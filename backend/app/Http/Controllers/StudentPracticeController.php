<?php

namespace App\Http\Controllers;

use App\Models\PracticeSession;
use App\Models\Submission;
use App\Models\SubmissionAnswer;
use App\Models\Question;
use App\Services\GamificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class StudentPracticeController extends Controller
{
    protected $gamificationService;

    public function __construct(GamificationService $gamificationService)
    {
        $this->gamificationService = $gamificationService;
    }

    /**
     * GET /api/student/practice
     * Danh sách practice session có thể làm
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Phân loại exam theo độ tuổi
        $adultOnlyTypes = ['VSTEP', 'IELTS'];
        $kidsOnlyTypes  = ['STARTERS', 'MOVERS', 'FLYERS'];
        $ageGroup = $user->age_group;

        $query = PracticeSession::with(['exam'])
            ->where('ps_is_active', true)
            ->whereHas('exam', function ($q) use ($ageGroup, $adultOnlyTypes, $kidsOnlyTypes) {
                if ($ageGroup !== 'adults') {
                    $q->whereNotIn('eType', $adultOnlyTypes);
                }
                if ($ageGroup !== 'kids') {
                    $q->whereNotIn('eType', $kidsOnlyTypes);
                }
            });

        if ($request->filled('skill')) {
            $query->where('ps_target_skill', $request->skill);
        }

        $sessions = $query->orderBy('ps_created_at', 'desc')->get();

        $data = $sessions->map(function ($session) use ($user) {
            $attemptsCount = Submission::where('user_id', $user->uId)
                ->where('exam_id', $session->ps_exam_id)
                ->whereNull('assignment_id')
                ->count();

            return [
                'ps_id'           => $session->ps_id,
                'ps_title'        => $session->ps_title,
                'ps_description'  => $session->ps_description,
                'ps_target_skill' => $session->ps_target_skill,
                'ps_difficulty'   => $session->ps_difficulty,
                'ps_duration_minutes' => $session->ps_duration_minutes,
                'exam' => $session->exam ? [
                    'eId'    => $session->exam->eId,
                    'eTitle' => $session->exam->eTitle,
                    'eType'  => $session->exam->eType,
                    'eSkill' => $session->exam->eSkill,
                ] : null,
                'attempts_count' => $attemptsCount,
            ];
        });

        return response()->json(['status' => 'success', 'data' => $data]);
    }

    /**
     * GET /api/student/practice/{id}
     * Chi tiết practice session (ẩn đáp án đúng)
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $session = PracticeSession::with([
            'exam.questions.answers',
            'exam.contentBlocks',
        ])->where('ps_id', $id)->where('ps_is_active', true)->first();

        if (!$session) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy bài luyện tập.'], 404);
        }

        if ($session->exam) {
            $eType = $session->exam->eType;
            // VSTEP / IELTS chỉ dành cho adults
            if (in_array($eType, ['VSTEP', 'IELTS']) && $user->age_group !== 'adults') {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Bài luyện tập này chỉ dành cho học viên từ 18 tuổi trở lên (sinh viên / người đi làm).'
                ], 403);
            }
            // STARTERS / MOVERS / FLYERS chỉ dành cho kids
            if (in_array($eType, ['STARTERS', 'MOVERS', 'FLYERS']) && $user->age_group !== 'kids') {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Bài luyện tập này chỉ dành cho học viên nhỏ tuổi (kids).'
                ], 403);
            }
        }

        if ($session->exam) {
            $session->exam->questions->each(function ($question) {
                $question->answers->each(function ($answer) {
                    unset($answer->aIs_correct);
                });
            });
        }

        $attemptsCount = Submission::where('user_id', $user->uId)
            ->where('exam_id', $session->ps_exam_id)
            ->whereNull('assignment_id')
            ->count();

        $data = $session->toArray();
        unset($data['exam']); // thay bằng structured version
        $data['exam']          = $this->buildExamData($session->exam);
        $data['attempts_count'] = $attemptsCount;

        return response()->json(['status' => 'success', 'data' => $data]);
    }

    /**
     * POST /api/student/practice/{id}/start
     * Bắt đầu hoặc tiếp tục làm bài luyện tập
     */
    public function start(Request $request, $id)
    {
        $user = $request->user();

        $session = PracticeSession::with(['exam.questions.answers', 'exam.contentBlocks'])
            ->where('ps_id', $id)
            ->where('ps_is_active', true)
            ->first();

        if (!$session || !$session->exam) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy bài luyện tập.'], 404);
        }

        $eType = $session->exam->eType;
        if (in_array($eType, ['VSTEP', 'IELTS']) && $user->age_group !== 'adults') {
            return response()->json([
                'status'  => 'error',
                'message' => 'Bài luyện tập này chỉ dành cho học viên từ 18 tuổi trở lên (sinh viên / người đi làm).'
            ], 403);
        }
        if (in_array($eType, ['STARTERS', 'MOVERS', 'FLYERS']) && $user->age_group !== 'kids') {
            return response()->json([
                'status'  => 'error',
                'message' => 'Bài luyện tập này chỉ dành cho học viên nhỏ tuổi (kids).'
            ], 403);
        }

        // Kiểm tra submission đang dở
        $existing = Submission::where('user_id', $user->uId)
            ->where('exam_id', $session->ps_exam_id)
            ->whereNull('assignment_id')
            ->where('sStatus', 'in_progress')
            ->first();

        if ($existing) {
            $elapsed = now()->diffInSeconds($existing->sStart_time);
            $limitSeconds = $session->ps_duration_minutes * 60;
            $remaining = $limitSeconds - $elapsed;

            if ($remaining <= 0) {
                $this->autoComplete($existing);
                $existing->refresh();
            } else {
                $exam = $session->exam;
                $exam->questions->each(fn($q) => $q->answers->each(fn($a) => $a->makeHidden(['aIs_correct'])));

                return response()->json([
                    'status' => 'info',
                    'message' => 'Bạn có bài đang làm dở.',
                    'data' => [
                        'submissionId'   => $existing->sId,
                        'timeRemaining'  => $remaining,
                        'sStart_time'    => $existing->sStart_time,
                        'canResume'      => true,
                        'exam'           => $this->buildExamData($exam),
                    ],
                ]);
            }
        }

        $submission = Submission::create([
            'user_id'       => $user->uId,
            'exam_id'       => $session->ps_exam_id,
            'assignment_id' => null,
            'sAttempt'      => Submission::where('user_id', $user->uId)
                                ->where('exam_id', $session->ps_exam_id)
                                ->whereNull('assignment_id')->count() + 1,
            'sStart_time'   => now(),
            'sStatus'       => 'in_progress',
        ]);

        $exam = $session->exam;
        $exam->questions->each(fn($q) => $q->answers->each(fn($a) => $a->makeHidden(['aIs_correct'])));

        return response()->json([
            'status' => 'success',
            'data'   => [
                'submissionId'  => $submission->sId,
                'sStart_time'   => $submission->sStart_time,
                'timeLimit'     => $session->ps_duration_minutes * 60,
                'exam'          => $this->buildExamData($exam),
            ],
        ]);
    }

    /**
     * POST /api/student/practice/{submissionId}/answer
     * Lưu câu trả lời trong quá trình làm bài
     */
    public function answer(Request $request, $submissionId)
    {
        $user = $request->user();

        $submission = Submission::where('sId', $submissionId)
            ->where('user_id', $user->uId)
            ->whereNull('assignment_id')
            ->first();

        if (!$submission) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy bài làm.'], 404);
        }

        if ($submission->sStatus !== 'in_progress') {
            return response()->json(['status' => 'error', 'message' => 'Bài làm đã được nộp.'], 400);
        }

        $validator = Validator::make($request->all(), [
            'question_id'   => 'required|integer|exists:questions,qId',
            'saAnswer_text' => 'required|string|max:10000',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 400);
        }

        $question = Question::where('qId', $request->question_id)
            ->where('exam_id', $submission->exam_id)
            ->first();

        if (!$question) {
            return response()->json(['status' => 'error', 'message' => 'Câu hỏi không thuộc bài thi này.'], 403);
        }

        SubmissionAnswer::updateOrCreate(
            ['submission_id' => $submissionId, 'question_id' => $question->qId],
            ['saAnswer_text' => $request->saAnswer_text]
        );

        return response()->json(['status' => 'success', 'message' => 'Đã lưu câu trả lời.']);
    }

    /**
     * POST /api/student/practice/{submissionId}/complete
     * Nộp bài luyện tập
     */
    public function complete(Request $request, $submissionId)
    {
        $user = $request->user();

        $submission = Submission::with(['exam.questions.answers', 'answers'])
            ->where('sId', $submissionId)
            ->where('user_id', $user->uId)
            ->whereNull('assignment_id')
            ->first();

        if (!$submission) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy bài làm.'], 404);
        }

        if ($submission->sStatus !== 'in_progress') {
            return response()->json(['status' => 'success', 'message' => 'Bài đã được nộp trước đó.', 'data' => [
                'submissionId' => $submission->sId,
                'sScore'       => $submission->sScore,
                'sStatus'      => $submission->sStatus,
            ]]);
        }

        DB::beginTransaction();
        try {
            $score = $this->gradeSubmission($submission);

            $submission->update([
                'sSubmit_time' => now(),
                'sGraded_time' => $score !== null ? now() : null,
                'sScore'       => $score,
                'sStatus'      => $score !== null ? 'graded' : 'submitted',
            ]);

            DB::commit();

            // Gamification
            try {
                $this->gamificationService->updateStats($user->uId, 'practice_completed', null);
                $elapsed = now()->diffInMinutes($submission->sStart_time);
                if ($elapsed > 0) {
                    $this->gamificationService->updateStats($user->uId, 'study_time', $elapsed);
                }
                $this->gamificationService->updateStreak($user->uId);
            } catch (\Exception $e) {
                // Gamification failure không block kết quả
            }

            return response()->json([
                'status' => 'success',
                'data'   => [
                    'submissionId' => $submission->sId,
                    'sScore'       => $score,
                    'sStatus'      => $submission->sStatus,
                    'message'      => $score !== null
                        ? "Nộp bài thành công. Điểm: {$score}%"
                        : 'Nộp bài thành công. Đang chờ giáo viên chấm.',
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }

    /**
     * GET /api/student/practice/history
     * Lịch sử các lần luyện tập
     */
    public function history(Request $request)
    {
        $user = $request->user();

        $submissions = Submission::with(['exam'])
            ->where('user_id', $user->uId)
            ->whereNull('assignment_id')
            ->whereIn('sStatus', ['graded', 'submitted', 'in_progress'])
            ->orderBy('sStart_time', 'desc')
            ->paginate($request->input('per_page', 20));

        return response()->json(['status' => 'success', 'data' => $submissions]);
    }

    /**
     * GET /api/student/practice/{submissionId}/result
     * Kết quả chi tiết: MCQ hiện đáp án đúng, Writing/Speaking hiện bài làm
     */
    public function result(Request $request, $submissionId)
    {
        $user = $request->user();

        $submission = Submission::with([
            'exam.questions.answers',
            'exam.contentBlocks',
            'answers.question',
        ])
            ->where('sId', $submissionId)
            ->where('user_id', $user->uId)
            ->whereNull('assignment_id')
            ->first();

        if (!$submission) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy bài làm.'], 404);
        }

        if ($submission->sStatus === 'in_progress') {
            return response()->json(['status' => 'error', 'message' => 'Bài chưa được nộp.'], 400);
        }

        $isGraded = $submission->sStatus === 'graded';

        // Map câu trả lời của học viên vào từng câu hỏi
        $answeredMap = $submission->answers->keyBy('question_id');

        $questions = $submission->exam->questions->map(function ($question) use ($answeredMap, $isGraded) {
            $studentAnswer = $answeredMap->get($question->qId);
            $qType = $question->qType ?? 'multiple_choice';
            $isObjective = in_array($qType, ['multiple_choice', 'listening_mc', 'reading_mc']);

            $result = [
                'qId'           => $question->qId,
                'qContent'      => $question->qContent,
                'qType'         => $qType,
                'qPart'         => $question->qPart,
                'qSection'      => $question->qSection,
                'student_answer'   => $studentAnswer ? $studentAnswer->saAnswer_text : null,
                'is_correct'       => $studentAnswer ? $studentAnswer->saIs_correct : null,
                'points_awarded'   => $studentAnswer ? $studentAnswer->saPoints_awarded : null,
                'teacher_feedback' => $studentAnswer ? $studentAnswer->saTeacher_feedback : null,
            ];

            if ($isObjective && $isGraded) {
                $correct = $question->answers->firstWhere('aIs_correct', true);
                $result['correct_answer'] = $correct ? $correct->aContent : null;
                $result['answers'] = $question->answers;
            } elseif (!$isObjective) {
                $result['answers'] = [];
                $result['grading_status'] = $isGraded ? 'graded' : 'pending';
            } else {
                $result['answers'] = $question->answers->map(fn($a) => $a->makeHidden(['aIs_correct']));
            }

            return $result;
        });

        return response()->json([
            'status' => 'success',
            'data'   => [
                'submissionId' => $submission->sId,
                'sScore'       => $submission->sScore,
                'sStatus'      => $submission->sStatus,
                'sStart_time'  => $submission->sStart_time,
                'sSubmit_time' => $submission->sSubmit_time,
                'exam' => [
                    'eId'    => $submission->exam->eId,
                    'eTitle' => $submission->exam->eTitle,
                    'eSkill' => $submission->exam->eSkill,
                    'contentBlocks' => $submission->exam->contentBlocks,
                ],
                'questions' => $questions,
            ],
        ]);
    }

    /**
     * POST /api/student/practice/complete (gamification only — legacy route)
     */
    public function completePractice(Request $request)
    {
        $studentId = $request->user()->uId;

        $request->validate(['duration_minutes' => 'nullable|integer|min:0']);

        try {
            $this->gamificationService->updateStats($studentId, 'practice_completed', null);
            if ($request->has('duration_minutes')) {
                $this->gamificationService->updateStats($studentId, 'study_time', $request->duration_minutes);
            }
            $this->gamificationService->updateStreak($studentId);

            return response()->json([
                'status' => 'success',
                'message' => 'Practice session completed',
                'gamification' => $this->gamificationService->getStudentSummary($studentId),
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // ============================================================
    // Private helpers
    // ============================================================

    /**
     * Chuẩn bị dữ liệu exam cho học viên (VSTEP có cấu trúc parts)
     */
    private function buildExamData($exam): array
    {
        $base = [
            'eId'               => $exam->eId,
            'eTitle'            => $exam->eTitle,
            'eDescription'      => $exam->eDescription,
            'eType'             => $exam->eType,
            'eSkill'            => $exam->eSkill,
            'eDuration_minutes' => $exam->eDuration_minutes,
        ];

        if ($exam->eType !== 'VSTEP') {
            $base['questions']     = $exam->questions->values();
            $base['contentBlocks'] = $exam->contentBlocks->sortBy('display_order')->values();
            return $base;
        }

        $skill = $exam->eSkill ?? 'mixed';
        $contentBlocks = $exam->contentBlocks->sortBy('display_order');
        $questions     = $exam->questions->sortBy(['qPart', 'qOrder', 'qId']);
        $partNumbers   = $questions->pluck('qPart')->unique()->sort()->values();
        $parts = [];

        foreach ($partNumbers as $partNum) {
            $partBlock = $contentBlocks->first(function ($cb) use ($partNum) {
                $meta = $cb->metadata ?? [];
                return ($meta['part_number'] ?? null) == $partNum;
            });

            $partQuestions = $questions->where('qPart', $partNum)->values();

            $partData = [
                'partNumber' => $partNum,
                'partName'   => $partBlock ? ($partBlock->metadata['part_name'] ?? "Part $partNum") : "Part $partNum",
            ];

            if ($skill === 'reading') {
                $partData['passage']   = $partBlock ? $partBlock->content : null;
                $partData['wordCount'] = $partBlock ? ($partBlock->metadata['word_count'] ?? null) : null;
            } elseif ($skill === 'listening') {
                $partData['audioUrl']      = $partBlock ? $partBlock->content : null;
                $partData['audioDuration'] = $partBlock ? ($partBlock->metadata['audio_duration'] ?? null) : null;
                $partData['transcript']    = $partBlock ? ($partBlock->metadata['transcript'] ?? null) : null;
            } elseif ($skill === 'speaking') {
                $partData['instruction'] = $partBlock ? $partBlock->content : null;
                $partData['timeLimit']   = $partBlock ? ($partBlock->metadata['time_limit'] ?? null) : null;
            } elseif ($skill === 'writing') {
                $partData['prompt']    = $partBlock ? $partBlock->content : null;
                $partData['wordCount'] = $partBlock ? ($partBlock->metadata['min_words'] ?? null) : null;
            }

            $partData['questions'] = $partQuestions->map(function ($q) {
                return [
                    'qId'         => $q->qId,
                    'qContent'    => $q->qContent,
                    'qType'       => $q->qType,
                    'qPart'       => $q->qPart,
                    'qOrder'      => $q->qOrder,
                    'qPoints'     => $q->qPoints,
                    'qWord_count' => $q->qWord_count,
                    'qTime_limit' => $q->qTime_limit,
                    'answers'     => $q->answers->values(),
                ];
            })->values();

            $parts[] = $partData;
        }

        $base['vstep_structure'] = ['skill' => $skill, 'parts' => $parts];
        return $base;
    }

    /**
     * Chấm điểm tự động: MCQ trả về % điểm, essay/speaking trả về null
     */
    private function gradeSubmission(Submission $submission): ?float
    {
        $questions = $submission->exam->questions;
        $hasObjective = false;
        $totalScore = 0;
        $maxScore = 0;

        foreach ($submission->answers as $sa) {
            $question = $questions->firstWhere('qId', $sa->question_id);
            if (!$question) continue;

            $qType = $question->qType ?? 'multiple_choice';
            $isObjective = in_array($qType, ['multiple_choice', 'listening_mc', 'reading_mc']);

            if ($isObjective) {
                $hasObjective = true;
                $correct = $question->answers->firstWhere('aIs_correct', true);
                $maxScore += $question->qPoints ?? 1;

                if ($correct && trim(strtolower($sa->saAnswer_text)) === trim(strtolower($correct->aContent))) {
                    $sa->update(['saIs_correct' => true, 'saPoints_awarded' => $question->qPoints ?? 1]);
                    $totalScore += $question->qPoints ?? 1;
                } else {
                    $sa->update(['saIs_correct' => false, 'saPoints_awarded' => 0]);
                }
            }
        }

        if (!$hasObjective || $maxScore === 0) {
            return null;
        }

        return round(($totalScore / $maxScore) * 100, 2);
    }

    /**
     * Tự động hoàn thành bài khi hết giờ
     */
    private function autoComplete(Submission $submission): void
    {
        $submission->load(['exam.questions.answers', 'answers']);
        $score = $this->gradeSubmission($submission);
        $submission->update([
            'sSubmit_time' => now(),
            'sGraded_time' => $score !== null ? now() : null,
            'sScore'       => $score,
            'sStatus'      => $score !== null ? 'graded' : 'submitted',
        ]);
    }
}
