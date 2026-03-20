<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\TestAssignment;
use App\Models\Submission;
use App\Models\SubmissionAnswer;
use App\Models\ClassEnrollment;
use App\Models\Question;
use App\Models\Answer;

class StudentTestController extends Controller
{
    /**
     * @OA\Get(
     *     path="/student/tests",
     *     tags={"Students"},
     *     summary="Get student tests",
     *     description="Get list of tests assigned to authenticated student",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Tests retrieved successfully"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     * 
     * GET /api/student/tests
     * Lấy danh sách bài thi được gán cho học viên
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        // Get class IDs where student is enrolled
        $classIds = ClassEnrollment::where('student_id', $user->uId)
                                   ->pluck('class_id')
                                   ->toArray();

        // Get assignments for student (individual or class-based)
        $assignments = TestAssignment::with(['exam'])
                                    ->where(function($query) use ($user, $classIds) {
                                        // Individual assignments
                                        $query->where(function($q) use ($user) {
                                            $q->where('taTarget_type', 'student')
                                              ->where('taTarget_id', $user->uId);
                                        })
                                        // Class assignments
                                        ->orWhere(function($q) use ($classIds) {
                                            $q->where('taTarget_type', 'class')
                                              ->whereIn('taTarget_id', $classIds);
                                        });
                                    })
                                    ->orderBy('taCreated_at', 'desc')
                                    ->get();

        // Add attempt count for each assignment
        $data = $assignments->map(function($assignment) use ($user) {
            $attemptsUsed = Submission::where('user_id', $user->uId)
                                     ->where('assignment_id', $assignment->taId)
                                     ->count();

            return [
                'taId' => $assignment->taId,
                'exam' => [
                    'eId' => $assignment->exam->eId,
                    'eTitle' => $assignment->exam->eTitle,
                    'eDescription' => $assignment->exam->eDescription,
                    'eType' => $assignment->exam->eType,
                    'eSkill' => $assignment->exam->eSkill,
                    'eDuration_minutes' => $assignment->exam->eDuration_minutes,
                ],
                'taDeadline' => $assignment->taDeadline,
                'taMax_attempt' => $assignment->taMax_attempt,
                'attemptsUsed' => $attemptsUsed,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    /**
     * @OA\Get(
     *     path="/student/tests/{id}",
     *     tags={"Students"},
     *     summary="Get test details",
     *     description="Get detailed information about a specific test (without correct answers)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Test details retrieved successfully"),
     *     @OA\Response(response=404, description="Test not found")
     * )
     * 
     * GET /api/student/tests/{id}
     * Lấy chi tiết bài thi (không hiển thị đáp án đúng)
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $assignment = TestAssignment::with(['exam.questions.answers'])
                                    ->find($id);

        if (!$assignment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài thi.'
            ], 404);
        }

        // Check if student is eligible
        if (!$this->isStudentEligible($user->uId, $assignment)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập bài thi này.'
            ], 403);
        }

        // Hide correct answers from students
        $exam = $assignment->exam;
        $exam->questions->each(function($question) {
            $question->answers->each(function($answer) {
                unset($answer->aIs_correct);
            });
        });

        $attemptsUsed = Submission::where('user_id', $user->uId)
                                 ->where('assignment_id', $id)
                                 ->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'assignment' => $assignment,
                'attemptsUsed' => $attemptsUsed,
            ]
        ]);
    }

    /**
     * @OA\Post(
     *     path="/student/tests/{id}/start",
     *     tags={"Students"},
     *     summary="Start test",
     *     description="Start taking a test (creates submission)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=201, description="Test started successfully"),
     *     @OA\Response(response=400, description="Cannot start test (already completed, expired, etc.)")
     * )
     * 
     * POST /api/student/tests/{id}/start
     * Bắt đầu làm bài thi
     */
    public function start(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $assignment = TestAssignment::with(['exam.questions.answers'])
                                    ->find($id);

        if (!$assignment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài thi.'
            ], 404);
        }

        // Check eligibility
        if (!$this->isStudentEligible($user->uId, $assignment)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền làm bài thi này.'
            ], 403);
        }

        // Check deadline
        if ($assignment->taDeadline && now() > $assignment->taDeadline) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bài thi đã hết hạn nộp.'
            ], 403);
        }

        // Check attempt limit
        $attemptsUsed = Submission::where('user_id', $user->uId)
                                 ->where('assignment_id', $id)
                                 ->count();

        if ($attemptsUsed >= $assignment->taMax_attempt) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn đã hết số lần làm bài cho bài thi này.'
            ], 403);
        }

        // Check if there's already an in_progress submission
        $existingSubmission = Submission::where('user_id', $user->uId)
                                       ->where('assignment_id', $id)
                                       ->where('sStatus', 'in_progress')
                                       ->first();

        if ($existingSubmission) {
            // Kiểm tra thời gian còn lại
            $timeElapsed = now()->diffInMinutes($existingSubmission->sStart_time);
            $timeRemaining = $assignment->exam->eDuration_minutes - $timeElapsed;

            if ($timeRemaining <= 0) {
                // Tự động nộp bài hết thời gian
                return $this->autoSubmit($existingSubmission);
            }

            return response()->json([
                'status' => 'info',
                'message' => 'Bạn có bài thi đang làm dở. Bạn có thể tiếp tục làm bài.',
                'data' => [
                    'submissionId' => $existingSubmission->sId,
                    'timeRemaining' => $timeRemaining,
                    'canResume' => true
                ]
            ], 200);
        }

        // Create new submission
        $submission = Submission::create([
            'user_id' => $user->uId,
            'exam_id' => $assignment->exam_id,
            'assignment_id' => $id,
            'sAttempt' => $attemptsUsed + 1,
            'sStart_time' => now(),
            'sStatus' => 'in_progress',
        ]);

        // Hide correct answers
        $exam = $assignment->exam;
        $exam->questions->each(function($question) {
            $question->answers->each(function($answer) {
                unset($answer->aIs_correct);
            });
        });

        return response()->json([
            'status' => 'success',
            'data' => [
                'submissionId' => $submission->sId,
                'sStart_time' => $submission->sStart_time,
                'exam' => $exam,
            ]
        ]);
    }

    /**
     * @OA\Post(
     *     path="/student/tests/{submissionId}/answer",
     *     tags={"Students"},
     *     summary="Submit answer",
     *     description="Submit answer for a question during test",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="submissionId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"question_id"},
     *             @OA\Property(property="question_id", type="integer", example=1),
     *             @OA\Property(property="answer_id", type="integer", example=2, description="For multiple choice questions"),
     *             @OA\Property(property="answer_text", type="string", example="Essay answer text", description="For essay questions")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Answer submitted successfully"),
     *     @OA\Response(response=400, description="Invalid submission or question")
     * )
     * 
     * POST /api/student/tests/{submissionId}/answer
     * Lưu câu trả lời
     */
    public function answer(Request $request, $submissionId)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $submission = Submission::where('sId', $submissionId)
                               ->where('user_id', $user->uId)
                               ->first();

        if (!$submission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài làm.'
            ], 404);
        }

        if ($submission->sStatus !== 'in_progress') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bài làm đã được nộp hoặc không thể chỉnh sửa.'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'question_id' => 'required|integer|exists:questions,qId',
            'saAnswer_text' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        // Check if answer already exists, update or create
        $submissionAnswer = SubmissionAnswer::updateOrCreate(
            [
                'submission_id' => $submissionId,
                'question_id' => $request->question_id,
            ],
            [
                'saAnswer_text' => $request->saAnswer_text,
            ]
        );

        return response()->json([
            'status' => 'success',
            'data' => [
                'message' => 'Câu trả lời đã được lưu.'
            ]
        ]);
    }

    /**
     * @OA\Post(
     *     path="/student/tests/{submissionId}/submit",
     *     tags={"Students"},
     *     summary="Submit test",
     *     description="Submit completed test for grading",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="submissionId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Test submitted successfully"),
     *     @OA\Response(response=400, description="Cannot submit test (not started, already submitted, etc.)")
     * )
     * 
     * POST /api/student/tests/{submissionId}/submit
     * Nộp bài thi
     */
    public function submit(Request $request, $submissionId)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $submission = Submission::with(['exam.questions.answers', 'answers'])
                               ->where('sId', $submissionId)
                               ->where('user_id', $user->uId)
                               ->first();

        if (!$submission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài làm.'
            ], 404);
        }

        if ($submission->sStatus !== 'in_progress') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bài làm đã được nộp.'
            ], 400);
        }

        // Check if all questions are answered
        $totalQuestions = $submission->exam->questions->count();
        $answeredQuestions = $submission->answers->count();

        if ($answeredQuestions < $totalQuestions) {
            $answeredQuestionIds = $submission->answers->pluck('question_id')->toArray();
            $allQuestionIds = $submission->exam->questions->pluck('qId')->toArray();
            $unansweredQuestions = array_diff($allQuestionIds, $answeredQuestionIds);

            return response()->json([
                'status' => 'error',
                'message' => 'Vui lòng trả lời tất cả các câu hỏi trước khi nộp bài.',
                'unansweredQuestions' => array_values($unansweredQuestions)
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Auto-grade objective questions
            $totalScore = 0;
            $maxScore = 0;

            foreach ($submission->answers as $submissionAnswer) {
                $question = Question::with('answers')->find($submissionAnswer->question_id);
                $correctAnswer = $question->answers->where('aIs_correct', true)->first();

                $maxScore += $question->qPoints;

                if ($correctAnswer && $submissionAnswer->saAnswer_text === $correctAnswer->aContent) {
                    $submissionAnswer->update([
                        'saIs_correct' => true,
                        'saPoints_awarded' => $question->qPoints,
                    ]);
                    $totalScore += $question->qPoints;
                } else {
                    $submissionAnswer->update([
                        'saIs_correct' => false,
                        'saPoints_awarded' => 0,
                    ]);
                }
            }

            // Calculate score percentage
            $scorePercentage = $maxScore > 0 ? round(($totalScore / $maxScore) * 100, 2) : 0;

            // Update submission
            $submission->update([
                'sSubmit_time' => now(),
                'sScore' => $scorePercentage,
                'sStatus' => 'graded',
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'submissionId' => $submissionId,
                    'sScore' => $scorePercentage,
                    'sStatus' => 'graded',
                    'message' => "Nộp bài thành công. Điểm số: {$scorePercentage}%"
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi nộp bài.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/student/submissions",
     *     tags={"Students"},
     *     summary="Get student submissions",
     *     description="Get submission history for authenticated student",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Submissions retrieved successfully"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     * 
     * GET /api/student/submissions
     * Xem lịch sử bài làm
     */
    public function submissions(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $submissions = Submission::with(['exam', 'assignment'])
                                ->where('user_id', $user->uId)
                                ->orderBy('sSubmit_time', 'desc')
                                ->get();

        return response()->json([
            'status' => 'success',
            'data' => $submissions
        ]);
    }

    /**
     * @OA\Get(
     *     path="/student/submissions/{id}",
     *     tags={"Students"},
     *     summary="Get submission details",
     *     description="Get detailed information about a specific submission with scores and feedback",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Submission details retrieved successfully"),
     *     @OA\Response(response=404, description="Submission not found")
     * )
     * 
     * GET /api/student/submissions/{id}
     * Xem chi tiết bài làm với điểm số và feedback
     */
    public function submissionDetail(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $submission = Submission::with(['exam.questions.answers', 'answers.question'])
                               ->where('sId', $id)
                               ->where('user_id', $user->uId)
                               ->first();

        if (!$submission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài làm.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $submission
        ]);
    }

    /**
     * GET /api/student/tests/{id}/resume
     * Khôi phục bài thi bị gián đoạn (cúp điện, mất mạng)
     */
    public function resume(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        // Tìm submission đang dở
        $submission = Submission::with(['exam.questions.answers', 'answers'])
                               ->where('user_id', $user->uId)
                               ->where('assignment_id', $id)
                               ->where('sStatus', 'in_progress')
                               ->first();

        if (!$submission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài thi đang làm dở.'
            ], 404);
        }

        // Kiểm tra thời gian còn lại
        $timeElapsed = now()->diffInMinutes($submission->sStart_time);
        $timeRemaining = $submission->exam->eDuration_minutes - $timeElapsed;

        // Nếu hết thời gian, tự động nộp bài
        if ($timeRemaining <= 0) {
            return $this->autoSubmit($submission);
        }

        // Ẩn đáp án đúng
        $exam = $submission->exam;
        $exam->questions->each(function($question) {
            $question->answers->each(function($answer) {
                unset($answer->aIs_correct);
            });
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Khôi phục bài thi thành công. Bạn có thể tiếp tục làm bài.',
            'data' => [
                'submissionId' => $submission->sId,
                'sStart_time' => $submission->sStart_time,
                'timeRemaining' => $timeRemaining,
                'exam' => $exam,
                'savedAnswers' => $submission->answers, // Câu trả lời đã lưu
            ]
        ]);
    }

    /**
     * Auto-submit when time expires or interrupted
     */
    private function autoSubmit($submission)
    {
        DB::beginTransaction();
        try {
            // Tự động chấm điểm các câu đã trả lời
            $totalScore = 0;
            $maxScore = 0;

            foreach ($submission->answers as $submissionAnswer) {
                $question = Question::with('answers')->find($submissionAnswer->question_id);
                $correctAnswer = $question->answers->where('aIs_correct', true)->first();

                $maxScore += $question->qPoints;

                if ($correctAnswer && $submissionAnswer->saAnswer_text === $correctAnswer->aContent) {
                    $submissionAnswer->update([
                        'saIs_correct' => true,
                        'saPoints_awarded' => $question->qPoints,
                    ]);
                    $totalScore += $question->qPoints;
                } else {
                    $submissionAnswer->update([
                        'saIs_correct' => false,
                        'saPoints_awarded' => 0,
                    ]);
                }
            }

            // Tính điểm dựa trên câu đã trả lời
            $answeredQuestions = $submission->answers->count();
            $totalQuestions = $submission->exam->questions->count();
            $scorePercentage = $maxScore > 0 ? round(($totalScore / $maxScore) * 100, 2) : 0;

            // Cập nhật submission
            $submission->update([
                'sSubmit_time' => now(),
                'sScore' => $scorePercentage,
                'sStatus' => 'auto_submitted', // Đánh dấu tự động nộp
                'sTeacher_feedback' => "Bài thi được tự động nộp do hết thời gian. Đã trả lời {$answeredQuestions}/{$totalQuestions} câu hỏi.",
            ]);

            DB::commit();

            return response()->json([
                'status' => 'warning',
                'message' => 'Bài thi đã hết thời gian và được tự động nộp.',
                'data' => [
                    'submissionId' => $submission->sId,
                    'sScore' => $scorePercentage,
                    'answeredQuestions' => $answeredQuestions,
                    'totalQuestions' => $totalQuestions,
                    'autoSubmitted' => true,
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tự động nộp bài.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if student is eligible for assignment
     */
    private function isStudentEligible($studentId, $assignment)
    {
        if ($assignment->taTarget_type === 'student') {
            return $assignment->taTarget_id == $studentId;
        } else if ($assignment->taTarget_type === 'class') {
            return ClassEnrollment::where('class_id', $assignment->taTarget_id)
                                 ->where('student_id', $studentId)
                                 ->exists();
        }
        return false;
    }
}
