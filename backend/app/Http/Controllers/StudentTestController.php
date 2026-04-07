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
use App\Services\StudentProgressService;

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

        // Hide correct answers from students and add frontend compatibility aliases
        $exam = $assignment->exam;
        $exam->questions->each(function($question) {
            // Add alias for frontend compatibility
            $question->qPassage = $question->qPassage_text;
            $question->qSkill = $question->qSkill ?? $question->qSection;
            
            // Hide correct answers
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

        // Hide correct answers and add frontend compatibility aliases
        $exam = $assignment->exam;
        $exam->questions->each(function($question) {
            // Add alias for frontend compatibility
            $question->qPassage = $question->qPassage_text;
            $question->qSkill = $question->qSkill ?? $question->qSection;
            
            // Hide correct answers from students
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
            'saAnswer_text' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $question = Question::where('qId', $request->question_id)
            ->where('exam_id', $submission->exam_id)
            ->first();

        if (!$question) {
            return response()->json([
                'status' => 'error',
                'message' => 'Câu hỏi không thuộc bài thi này.'
            ], 403);
        }

        // Check if answer already exists, update or create
        $submissionAnswer = SubmissionAnswer::updateOrCreate(
            [
                'submission_id' => $submissionId,
                'question_id' => $question->qId,
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

        $validator = Validator::make($request->all(), [
            'submit_idempotency_key' => 'nullable|string|max:64',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $idempotencyKey = $request->input('submit_idempotency_key');

        if ($idempotencyKey) {
            $existingByKey = Submission::where('submit_idempotency_key', $idempotencyKey)
                ->where('user_id', $user->uId)
                ->first();

            if ($existingByKey) {
                return response()->json([
                    'status' => 'success',
                    'data' => [
                        'submissionId' => $existingByKey->sId,
                        'sScore' => $existingByKey->sScore,
                        'sStatus' => $existingByKey->sStatus,
                        'message' => 'Yêu cầu nộp bài đã được xử lý trước đó.'
                    ]
                ]);
            }
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

        if ($submission->sStatus === 'graded' || $submission->sStatus === 'auto_submitted') {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'submissionId' => $submissionId,
                    'sScore' => $submission->sScore,
                    'sStatus' => $submission->sStatus,
                    'message' => 'Bài làm đã được nộp trước đó.'
                ]
            ]);
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
            $submission = Submission::with(['exam.questions.answers', 'answers'])
                ->where('sId', $submissionId)
                ->where('user_id', $user->uId)
                ->lockForUpdate()
                ->first();

            if (!$submission) {
                DB::rollBack();
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy bài làm.'
                ], 404);
            }

            if ($submission->sStatus === 'graded' || $submission->sStatus === 'auto_submitted') {
                DB::rollBack();
                return response()->json([
                    'status' => 'success',
                    'data' => [
                        'submissionId' => $submissionId,
                        'sScore' => $submission->sScore,
                        'sStatus' => $submission->sStatus,
                        'message' => 'Bài làm đã được nộp trước đó.'
                    ]
                ]);
            }

            if ($submission->sStatus !== 'in_progress') {
                DB::rollBack();
                return response()->json([
                    'status' => 'error',
                    'message' => 'Bài làm không ở trạng thái cho phép nộp.'
                ], 400);
            }

            // Auto-grade objective questions
            $totalScore = 0;
            $maxScore = 0;

            foreach ($submission->answers as $submissionAnswer) {
                $question = Question::with('answers')->find($submissionAnswer->question_id);
                if (!$question || (int) $question->exam_id !== (int) $submission->exam_id) {
                    DB::rollBack();
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Dữ liệu câu hỏi không hợp lệ cho bài thi này.'
                    ], 400);
                }
                $correctAnswer = $question->answers->where('aIs_correct', true)->first();

                $maxScore += $question->qPoints;

                if ($correctAnswer && $this->isCorrectAnswer($submissionAnswer->saAnswer_text, $correctAnswer->aContent)) {
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
                'sGraded_time' => now(),
                'submit_idempotency_key' => $idempotencyKey,
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

        $validator = Validator::make($request->all(), [
            'per_page' => 'nullable|integer|min:1|max:100',
            'status' => 'nullable|string|in:in_progress,submitted,graded,auto_submitted',
            'exam_id' => 'nullable|integer|exists:exams,eId',
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date|after_or_equal:from_date',
            'sort_by' => 'nullable|string|in:sSubmit_time,sScore,sStart_time',
            'sort_order' => 'nullable|string|in:asc,desc',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tham số không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $perPage = (int) $request->input('per_page', 20);
        $sortBy = $request->input('sort_by', 'sSubmit_time');
        $sortOrder = $request->input('sort_order', 'desc');

        $query = Submission::with(['exam', 'assignment'])
            ->where('user_id', $user->uId);

        if ($request->filled('status')) {
            $query->where('sStatus', $request->input('status'));
        }

        if ($request->filled('exam_id')) {
            $query->where('exam_id', $request->input('exam_id'));
        }

        if ($request->filled('from_date')) {
            $query->whereDate('sSubmit_time', '>=', $request->input('from_date'));
        }

        if ($request->filled('to_date')) {
            $query->whereDate('sSubmit_time', '<=', $request->input('to_date'));
        }

        $submissions = $query
            ->orderBy($sortBy, $sortOrder)
            ->paginate($perPage);

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

        // Ẩn đáp án đúng và thêm alias cho frontend
        $exam = $submission->exam;
        $exam->questions->each(function($question) {
            // Add alias for frontend compatibility
            $question->qPassage = $question->qPassage_text;
            $question->qSkill = $question->qSkill ?? $question->qSection;
            
            // Hide correct answers
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
                if (!$question || (int) $question->exam_id !== (int) $submission->exam_id) {
                    DB::rollBack();
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Dữ liệu câu hỏi không hợp lệ cho bài thi này.'
                    ], 400);
                }
                $correctAnswer = $question->answers->where('aIs_correct', true)->first();

                $maxScore += $question->qPoints;

                if ($correctAnswer && $this->isCorrectAnswer($submissionAnswer->saAnswer_text, $correctAnswer->aContent)) {
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
                'sGraded_time' => now(),
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
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/student/submissions/{id}/answers",
     *     tags={"Students"},
     *     summary="Get submission answers with correct answers and explanations",
     *     description="Get detailed answers including correct answers and explanations after submission",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Answers retrieved successfully"),
     *     @OA\Response(response=404, description="Submission not found")
     * )
     * 
     * GET /api/student/submissions/{id}/answers
     * Xem đáp án đúng và giải thích sau khi nộp bài
     */
    public function submissionAnswers(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $submission = Submission::with([
            'exam.questions.answers', 
            'answers.question.answers'
        ])
        ->where('sId', $id)
        ->where('user_id', $user->uId)
        ->first();

        if (!$submission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài làm.'
            ], 404);
        }

        // Chỉ cho phép xem đáp án sau khi nộp bài
        if ($submission->sStatus === 'in_progress') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn chỉ có thể xem đáp án sau khi nộp bài.'
            ], 403);
        }

        // Tạo dữ liệu chi tiết với đáp án đúng và giải thích
        $detailedAnswers = [];
        
        foreach ($submission->exam->questions as $question) {
            $studentAnswer = $submission->answers->where('question_id', $question->qId)->first();
            $correctAnswer = $question->answers->where('aIs_correct', true)->first();
            
            $detailedAnswers[] = [
                'question' => [
                    'qId' => $question->qId,
                    'qContent' => $question->qContent,
                    'qType' => $question->qType,
                    'qPoints' => $question->qPoints,
                    'qExplanation' => $question->qExplanation,
                    'qSection' => $question->qSection,
                ],
                'student_answer' => $studentAnswer ? [
                    'saAnswer_text' => $studentAnswer->saAnswer_text,
                    'saIs_correct' => $studentAnswer->saIs_correct,
                    'saPoints_awarded' => $studentAnswer->saPoints_awarded,
                ] : null,
                'correct_answer' => $correctAnswer ? [
                    'aContent' => $correctAnswer->aContent,
                    'aIs_correct' => $correctAnswer->aIs_correct,
                ] : null,
                'all_options' => $question->answers->map(function($answer) {
                    return [
                        'aId' => $answer->aId,
                        'aContent' => $answer->aContent,
                        'aIs_correct' => $answer->aIs_correct,
                    ];
                }),
                'analysis' => [
                    'is_correct' => $studentAnswer ? $studentAnswer->saIs_correct : false,
                    'points_earned' => $studentAnswer ? $studentAnswer->saPoints_awarded : 0,
                    'points_possible' => $question->qPoints,
                ]
            ];
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'submission_info' => [
                    'sId' => $submission->sId,
                    'sScore' => $submission->sScore,
                    'sStatus' => $submission->sStatus,
                    'sSubmit_time' => $submission->sSubmit_time,
                    'exam_title' => $submission->exam->eTitle,
                ],
                'detailed_answers' => $detailedAnswers,
                'summary' => [
                    'total_questions' => count($detailedAnswers),
                    'answered_questions' => $submission->answers->count(),
                    'correct_answers' => $submission->answers->where('saIs_correct', true)->count(),
                    'total_score' => $submission->sScore,
                ]
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/student/progress",
     *     tags={"Students"},
     *     summary="Get student learning progress",
     *     description="Get comprehensive learning progress statistics and trends",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Progress data retrieved successfully"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     * 
     * GET /api/student/progress
     * Theo dõi tiến độ học tập chi tiết
     */
    public function progress(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $progressData = StudentProgressService::calculateDetailedProgress($user->uId);

        return response()->json([
            'status' => 'success',
            'data' => $progressData
        ]);
    }

    /**
     * @OA\Get(
     *     path="/student/submissions/{id}/compare",
     *     tags={"Students"},
     *     summary="Compare submission with previous attempts",
     *     description="Compare current submission with previous attempts and class average",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Comparison data retrieved successfully"),
     *     @OA\Response(response=404, description="Submission not found")
     * )
     * 
     * GET /api/student/submissions/{id}/compare
     * So sánh kết quả với lần làm trước và trung bình lớp
     */
    public function compareSubmission(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $currentSubmission = Submission::with(['exam', 'assignment'])
                                      ->where('sId', $id)
                                      ->where('user_id', $user->uId)
                                      ->first();

        if (!$currentSubmission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài làm.'
            ], 404);
        }

        // Tìm các lần làm trước của cùng bài thi
        $previousSubmissions = Submission::where('user_id', $user->uId)
                                        ->where('exam_id', $currentSubmission->exam_id)
                                        ->where('sId', '!=', $id)
                                        ->whereIn('sStatus', ['graded', 'auto_submitted'])
                                        ->orderBy('sSubmit_time', 'desc')
                                        ->get();

        // Lấy submission gần nhất trước đó
        $previousSubmission = $previousSubmissions->first();

        // Thống kê của tất cả học viên cùng bài thi
        $allSubmissions = Submission::where('exam_id', $currentSubmission->exam_id)
                                   ->whereIn('sStatus', ['graded', 'auto_submitted'])
                                   ->get();

        $classStats = [
            'total_students' => $allSubmissions->unique('user_id')->count(),
            'average_score' => round($allSubmissions->avg('sScore'), 2),
            'highest_score' => $allSubmissions->max('sScore'),
            'lowest_score' => $allSubmissions->min('sScore'),
            'median_score' => $this->calculateMedian($allSubmissions->pluck('sScore')->toArray()),
        ];

        // So sánh với lần làm trước
        $comparison = [];
        if ($previousSubmission) {
            $scoreDifference = $currentSubmission->sScore - $previousSubmission->sScore;
            $comparison = [
                'has_previous' => true,
                'previous_score' => $previousSubmission->sScore,
                'current_score' => $currentSubmission->sScore,
                'score_difference' => round($scoreDifference, 2),
                'improvement_percentage' => $previousSubmission->sScore > 0 ? 
                    round(($scoreDifference / $previousSubmission->sScore) * 100, 2) : 0,
                'previous_date' => $previousSubmission->sSubmit_time,
                'current_date' => $currentSubmission->sSubmit_time,
                'time_between' => $previousSubmission->sSubmit_time->diffForHumans($currentSubmission->sSubmit_time),
            ];
        } else {
            $comparison = [
                'has_previous' => false,
                'message' => 'Đây là lần đầu tiên bạn làm bài thi này.',
            ];
        }

        // Xếp hạng trong lớp
        $betterThanCount = $allSubmissions->where('sScore', '<', $currentSubmission->sScore)->count();
        $totalStudents = $allSubmissions->unique('user_id')->count();
        $ranking = $totalStudents - $betterThanCount;
        $percentile = $totalStudents > 0 ? round((($totalStudents - $ranking + 1) / $totalStudents) * 100, 1) : 0;

        // Phân tích chi tiết theo từng câu hỏi (nếu có lần làm trước)
        $questionAnalysis = [];
        if ($previousSubmission) {
            $currentAnswers = SubmissionAnswer::where('submission_id', $currentSubmission->sId)->get()->keyBy('question_id');
            $previousAnswers = SubmissionAnswer::where('submission_id', $previousSubmission->sId)->get()->keyBy('question_id');

            foreach ($currentAnswers as $questionId => $currentAnswer) {
                $previousAnswer = $previousAnswers->get($questionId);
                
                $questionAnalysis[] = [
                    'question_id' => $questionId,
                    'current_correct' => $currentAnswer->saIs_correct,
                    'previous_correct' => $previousAnswer ? $previousAnswer->saIs_correct : null,
                    'current_points' => $currentAnswer->saPoints_awarded,
                    'previous_points' => $previousAnswer ? $previousAnswer->saPoints_awarded : 0,
                    'improvement' => $previousAnswer ? 
                        ($currentAnswer->saPoints_awarded - $previousAnswer->saPoints_awarded) : null,
                ];
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'current_submission' => [
                    'sId' => $currentSubmission->sId,
                    'sScore' => $currentSubmission->sScore,
                    'sSubmit_time' => $currentSubmission->sSubmit_time,
                    'exam_title' => $currentSubmission->exam->eTitle,
                ],
                'comparison_with_previous' => $comparison,
                'class_statistics' => $classStats,
                'ranking' => [
                    'position' => $ranking,
                    'total_students' => $totalStudents,
                    'percentile' => $percentile,
                    'better_than_percent' => round(($betterThanCount / max($totalStudents, 1)) * 100, 1),
                ],
                'question_analysis' => $questionAnalysis,
                'all_attempts' => $previousSubmissions->map(function($submission) {
                    return [
                        'sId' => $submission->sId,
                        'sScore' => $submission->sScore,
                        'sSubmit_time' => $submission->sSubmit_time,
                        'sAttempt' => $submission->sAttempt,
                    ];
                }),
            ]
        ]);
    }

    /**
     * Helper methods for calculations
     */
    private function calculateImprovement($submissions)
    {
        if ($submissions->count() < 2) {
            return null;
        }

        $first = $submissions->first()->sScore;
        $last = $submissions->last()->sScore;
        
        return [
            'first_score' => $first,
            'latest_score' => $last,
            'difference' => round($last - $first, 2),
            'percentage' => $first > 0 ? round((($last - $first) / $first) * 100, 2) : 0,
            'trend' => $last > $first ? 'improving' : ($last < $first ? 'declining' : 'stable'),
        ];
    }

    private function calculateConsistency($submissions)
    {
        if ($submissions->count() < 2) {
            return null;
        }

        $scores = $submissions->pluck('sScore')->toArray();
        $mean = array_sum($scores) / count($scores);
        $variance = array_sum(array_map(function($score) use ($mean) {
            return pow($score - $mean, 2);
        }, $scores)) / count($scores);
        
        $standardDeviation = sqrt($variance);
        $coefficientOfVariation = $mean > 0 ? ($standardDeviation / $mean) * 100 : 0;

        return [
            'standard_deviation' => round($standardDeviation, 2),
            'coefficient_of_variation' => round($coefficientOfVariation, 2),
            'consistency_level' => $coefficientOfVariation < 15 ? 'high' : 
                                 ($coefficientOfVariation < 25 ? 'medium' : 'low'),
        ];
    }

    private function getStrengthAreas($statsBySkill)
    {
        return $statsBySkill->sortByDesc('average_score')->take(2)->map(function($stat) {
            return [
                'skill' => $stat['skill'],
                'average_score' => $stat['average_score'],
            ];
        })->values();
    }

    private function getImprovementAreas($statsBySkill)
    {
        return $statsBySkill->sortBy('average_score')->take(2)->map(function($stat) {
            return [
                'skill' => $stat['skill'],
                'average_score' => $stat['average_score'],
            ];
        })->values();
    }

    private function calculateMedian($scores)
    {
        sort($scores);
        $count = count($scores);
        
        if ($count === 0) return 0;
        
        if ($count % 2 === 0) {
            return ($scores[$count / 2 - 1] + $scores[$count / 2]) / 2;
        } else {
            return $scores[floor($count / 2)];
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

    /**
     * Get in-progress tests for dashboard
     */
    public function inProgressTests(Request $request)
    {
        $studentId = $request->user()->uId;

        // Get submissions that are in progress (not submitted yet)
        $inProgressSubmissions = Submission::where('user_id', $studentId)
            ->where('sStatus', 'in_progress')
            ->with(['exam'])
            ->orderBy('sStart_time', 'desc')
            ->get();

        $tests = $inProgressSubmissions->map(function ($submission) {
            $exam = $submission->exam;
            $duration = $exam->eDuration_minutes ?? $exam->eDuration ?? 0;
            $timeElapsed = now()->diffInMinutes($submission->sStart_time);
            $timeRemaining = max(0, $duration - $timeElapsed);

            return [
                'id' => $exam->eId,
                'submission_id' => $submission->sId,
                'title' => $exam->eTitle,
                'time_remaining' => $timeRemaining,
                'total_duration' => $duration,
                'skill' => $exam->eSkill,
                'started_at' => $submission->sStart_time,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $tests,
        ]);
    }

    /**
     * Get upcoming tests for dashboard
     */
    public function upcomingTests(Request $request)
    {
        $studentId = $request->user()->uId;
        $days = $request->input('days', 7);

        // Get assignments that are upcoming (within next X days)
        $upcomingAssignments = TestAssignment::where(function ($query) use ($studentId) {
                $query->where('taTarget_type', 'student')
                      ->where('taTarget_id', $studentId)
                      ->orWhereIn('taTarget_id', function ($subQuery) use ($studentId) {
                          $subQuery->select('class_id')
                                   ->from('class_enrollments')
                                   ->where('student_id', $studentId);
                      });
            })
            ->where('taStart_time', '<=', now())
            ->where('taEnd_time', '>=', now())
            ->where('taEnd_time', '<=', now()->addDays($days))
            ->with(['exam'])
            ->orderBy('taEnd_time', 'asc')
            ->get();

        $tests = $upcomingAssignments->map(function ($assignment) use ($studentId) {
            $exam = $assignment->exam;
            $deadline = \Carbon\Carbon::parse($assignment->taEnd_time);
            $daysUntil = now()->diffInDays($deadline, false);
            $isUrgent = $daysUntil <= 1;

            // Check if already started
            $hasStarted = Submission::where('user_id', $studentId)
                ->where('exam_id', $exam->eId)
                ->exists();

            if ($hasStarted) {
                return null; // Skip if already started
            }

            return [
                'id' => $exam->eId,
                'assignment_id' => $assignment->taId,
                'title' => $exam->eTitle,
                'deadline' => $assignment->taEnd_time,
                'duration' => $exam->eDuration_minutes ?? $exam->eDuration,
                'skill' => $exam->eSkill,
                'is_urgent' => $isUrgent,
                'days_until' => max(0, $daysUntil),
            ];
        })->filter()->values();

        return response()->json([
            'status' => 'success',
            'data' => $tests,
        ]);
    }

    /**
     * Get practice recommendations based on student performance
     */
    public function practiceRecommendations(Request $request)
    {
        $studentId = $request->user()->uId;

        // Get student's recent performance by skill
        $recentSubmissions = Submission::where('user_id', $studentId)
            ->where('sStatus', 'graded')
            ->with(['exam'])
            ->orderBy('sSubmit_time', 'desc')
            ->take(20)
            ->get();

        $skillStats = [];
        foreach ($recentSubmissions as $submission) {
            $skill = $submission->exam->eSkill;
            if (!isset($skillStats[$skill])) {
                $skillStats[$skill] = [
                    'count' => 0,
                    'total_score' => 0,
                    'scores' => [],
                ];
            }
            $skillStats[$skill]['count']++;
            $skillStats[$skill]['total_score'] += $submission->sScore;
            $skillStats[$skill]['scores'][] = $submission->sScore;
        }

        // Calculate average and identify weak areas
        $recommendations = [];
        foreach ($skillStats as $skill => $stats) {
            $avgScore = $stats['total_score'] / $stats['count'];
            $maxScore = max($stats['scores']);
            
            // Recommend practice if average is below 70 or needs improvement
            if ($avgScore < 70) {
                $recommendations[] = [
                    'id' => count($recommendations) + 1,
                    'title' => 'Luyện ' . $this->getSkillName($skill) . ' - Cơ bản',
                    'reason' => 'Điểm trung bình của bạn là ' . round($avgScore, 1) . '. Hãy luyện tập thêm để cải thiện!',
                    'skill' => $skill,
                    'duration' => 30,
                    'question_count' => 15,
                    'difficulty' => 'easy',
                    'link' => '/luyen-tap?skill=' . $skill . '&difficulty=easy',
                ];
            } else if ($avgScore >= 70 && $avgScore < 85) {
                $recommendations[] = [
                    'id' => count($recommendations) + 1,
                    'title' => 'Luyện ' . $this->getSkillName($skill) . ' - Nâng cao',
                    'reason' => 'Bạn đang làm tốt! Thử thách bản thân với bài khó hơn nhé.',
                    'skill' => $skill,
                    'duration' => 45,
                    'question_count' => 20,
                    'difficulty' => 'medium',
                    'link' => '/luyen-tap?skill=' . $skill . '&difficulty=medium',
                ];
            } else {
                $recommendations[] = [
                    'id' => count($recommendations) + 1,
                    'title' => 'Luyện ' . $this->getSkillName($skill) . ' - Chuyên sâu',
                    'reason' => 'Xuất sắc! Hãy thử thách với các bài tập khó nhất.',
                    'skill' => $skill,
                    'duration' => 60,
                    'question_count' => 25,
                    'difficulty' => 'hard',
                    'link' => '/luyen-tap?skill=' . $skill . '&difficulty=hard',
                ];
            }
        }

        // If no data, provide general recommendations
        if (empty($recommendations)) {
            $recommendations = [
                [
                    'id' => 1,
                    'title' => 'Bắt đầu với Listening',
                    'reason' => 'Hãy bắt đầu hành trình học tập của bạn!',
                    'skill' => 'listening',
                    'duration' => 30,
                    'question_count' => 15,
                    'difficulty' => 'easy',
                    'link' => '/luyen-tap?skill=listening',
                ],
                [
                    'id' => 2,
                    'title' => 'Luyện Reading cơ bản',
                    'reason' => 'Đọc hiểu là nền tảng quan trọng!',
                    'skill' => 'reading',
                    'duration' => 30,
                    'question_count' => 15,
                    'difficulty' => 'easy',
                    'link' => '/luyen-tap?skill=reading',
                ],
            ];
        }

        return response()->json([
            'status' => 'success',
            'data' => array_slice($recommendations, 0, 3), // Return top 3
        ]);
    }

    /**
     * Get skill name in Vietnamese
     */
    private function getSkillName($skill)
    {
        $names = [
            'listening' => 'Nghe',
            'reading' => 'Đọc',
            'writing' => 'Viết',
            'speaking' => 'Nói',
        ];
        return $names[$skill] ?? $skill;
    }

    /**
     * Get important notifications (mock implementation)
     * TODO: Implement proper notification system with database table
     */
    public function getNotifications(Request $request)
    {
        $studentId = $request->user()->uId;
        $urgent = $request->input('urgent', false);
        $limit = $request->input('limit', 10);

        $notifications = [];

        // Check for urgent assignments (ending soon)
        $urgentAssignments = TestAssignment::where(function ($query) use ($studentId) {
                $query->where('taTarget_type', 'student')
                      ->where('taTarget_id', $studentId)
                      ->orWhereIn('taTarget_id', function ($subQuery) use ($studentId) {
                          $subQuery->select('class_id')
                                   ->from('class_enrollments')
                                   ->where('student_id', $studentId);
                      });
            })
            ->where('taStart_time', '<=', now())
            ->where('taEnd_time', '>=', now())
            ->where('taEnd_time', '<=', now()->addDay())
            ->with(['exam'])
            ->get();

        foreach ($urgentAssignments as $assignment) {
            $hoursLeft = now()->diffInHours($assignment->taEnd_time);
            $notifications[] = [
                'id' => 'assignment_' . $assignment->taId,
                'title' => 'Bài thi sắp hết hạn',
                'message' => $assignment->exam->eTitle . ' sẽ hết hạn trong ' . $hoursLeft . ' giờ nữa. Hãy hoàn thành ngay!',
                'type' => 'urgent',
                'created_at' => $assignment->taCreated_at,
                'action_url' => '/bai-tap',
                'action_label' => 'Làm bài ngay',
            ];
        }

        // Check for recently graded submissions
        $recentGraded = Submission::where('user_id', $studentId)
            ->where('sStatus', 'graded')
            ->where('sGraded_time', '>=', now()->subDay())
            ->with(['exam'])
            ->orderBy('sGraded_time', 'desc')
            ->take(3)
            ->get();

        foreach ($recentGraded as $submission) {
            $notifications[] = [
                'id' => 'graded_' . $submission->sId,
                'title' => 'Kết quả bài thi đã có',
                'message' => 'Kết quả bài thi ' . $submission->exam->eTitle . ' đã được chấm. Điểm của bạn: ' . $submission->sScore,
                'type' => 'info',
                'created_at' => $submission->sGraded_time,
                'action_url' => '/lich-su',
                'action_label' => 'Xem kết quả',
            ];
        }

        // Sort by created_at desc
        usort($notifications, function ($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });

        // Filter by urgent if requested
        if ($urgent) {
            $notifications = array_filter($notifications, function ($n) {
                return $n['type'] === 'urgent';
            });
        }

        // Limit results
        $notifications = array_slice($notifications, 0, $limit);

        return response()->json([
            'status' => 'success',
            'data' => array_values($notifications),
        ]);
    }

    private function normalizeAnswer($value)
    {
        $normalized = trim((string) $value);
        return function_exists('mb_strtolower') ? mb_strtolower($normalized, 'UTF-8') : strtolower($normalized);
    }

    private function isCorrectAnswer($studentAnswer, $correctAnswer)
    {
        return $this->normalizeAnswer($studentAnswer) === $this->normalizeAnswer($correctAnswer);
    }
}
