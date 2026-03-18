<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Submission;
use App\Models\SubmissionAnswer;
use App\Models\Exam;

class GradingController extends Controller
{
    /**
     * @OA\Get(
     *     path="/teacher/submissions",
     *     tags={"Grading"},
     *     summary="Get submissions for grading",
     *     description="Get list of student submissions with optional filters",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="exam_id",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="integer"),
     *         description="Filter by exam ID"
     *     ),
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="string", enum={"completed","graded"}),
     *         description="Filter by submission status"
     *     ),
     *     @OA\Response(response=200, description="Submissions retrieved successfully"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     * 
     * GET /api/teacher/submissions
     * Lấy danh sách bài làm (có filter)
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $query = Submission::with(['user', 'exam'])
                          ->whereHas('exam', function($q) use ($user) {
                              $q->where('eTeacher_id', $user->uId);
                          });

        // Filter by exam_id
        if ($request->has('exam_id')) {
            $query->where('exam_id', $request->exam_id);
        }

        // Filter by student (user_id)
        if ($request->has('student_id')) {
            $query->where('user_id', $request->student_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('sStatus', $request->status);
        }

        $submissions = $query->orderBy('sSubmit_time', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $submissions
        ]);
    }

    /**
     * @OA\Get(
     *     path="/teacher/submissions/{id}",
     *     tags={"Grading"},
     *     summary="Get submission details",
     *     description="Get detailed information about a specific submission",
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
     * GET /api/teacher/submissions/{id}
     * Lấy chi tiết bài làm với tất cả câu trả lời
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $submission = Submission::where('sId', $id)
                                ->whereHas('exam', function($q) use ($user) {
                                    $q->where('eTeacher_id', $user->uId);
                                })
                                ->with(['user', 'exam.questions.answers', 'answers.question'])
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
     * @OA\Post(
     *     path="/teacher/submissions/{id}/grade",
     *     tags={"Grading"},
     *     summary="Grade submission",
     *     description="Grade a student submission (manual grading for essay questions)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="grades",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="question_id", type="integer"),
     *                     @OA\Property(property="score", type="number", format="float")
     *                 )
     *             ),
     *             @OA\Property(property="feedback", type="string", example="Good work overall")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Submission graded successfully"),
     *     @OA\Response(response=404, description="Submission not found")
     * )
     * 
     * POST /api/teacher/submissions/{id}/grade
     * Chấm điểm bài làm
     */
    public function grade(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $submission = Submission::where('sId', $id)
                                ->whereHas('exam', function($q) use ($user) {
                                    $q->where('eTeacher_id', $user->uId);
                                })
                                ->first();

        if (!$submission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài làm.'
            ], 404);
        }

        if (!in_array($submission->sStatus, ['submitted', 'graded'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bài làm chưa được nộp.'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'sTeacher_feedback' => 'nullable|string',
            'questionScores' => 'nullable|array',
            'questionScores.*.question_id' => 'required|integer',
            'questionScores.*.saPoints_awarded' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Update individual question scores if provided
            if ($request->has('questionScores')) {
                foreach ($request->questionScores as $scoreData) {
                    $submissionAnswer = SubmissionAnswer::where('submission_id', $id)
                                                       ->where('question_id', $scoreData['question_id'])
                                                       ->first();

                    if ($submissionAnswer) {
                        $submissionAnswer->update([
                            'saPoints_awarded' => $scoreData['saPoints_awarded']
                        ]);
                    }
                }
            }

            // Recalculate total score
            $totalScore = $this->calculateTotalScore($id);

            // Update submission
            $submission->update([
                'sTeacher_feedback' => $request->sTeacher_feedback,
                'sScore' => $totalScore,
                'sStatus' => 'graded'
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'submissionId' => $id,
                    'sScore' => $totalScore,
                    'message' => 'Chấm điểm bài làm thành công'
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi chấm điểm.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculate total score for a submission
     */
    private function calculateTotalScore($submissionId)
    {
        $submission = Submission::with(['answers.question'])->find($submissionId);
        
        $totalPoints = 0;
        $maxPoints = 0;

        foreach ($submission->answers as $answer) {
            $maxPoints += $answer->question->qPoints;
            $totalPoints += $answer->saPoints_awarded ?? 0;
        }

        if ($maxPoints == 0) {
            return 0;
        }

        return round(($totalPoints / $maxPoints) * 100, 2);
    }
}
