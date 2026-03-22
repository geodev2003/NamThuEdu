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

        if (!in_array($submission->sStatus, ['submitted', 'graded', 'in_progress'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bài làm chưa được nộp.'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'score' => 'nullable|numeric|min:0|max:100',
            'feedback' => 'nullable|string',
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
                // Recalculate total score from question scores
                $totalScore = $this->calculateTotalScore($id);
            } else {
                // Use provided total score
                $totalScore = $request->score ?? $this->calculateTotalScore($id);
            }

            // Update submission
            $submission->update([
                'sTeacher_feedback' => $request->feedback ?? $request->sTeacher_feedback,
                'sScore' => $totalScore,
                'sStatus' => 'graded'
            ]);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'submissionId' => $id,
                    'sScore' => $totalScore,
                    'message' => 'Chấm điểm bài làm thành công'
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi chấm điểm.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/teacher/submissions/{id}/auto-grade",
     *     tags={"Grading"},
     *     summary="Auto-grade multiple choice questions",
     *     description="Automatically grade multiple choice, true/false, and fill-in-blank questions",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Auto-grading completed successfully"),
     *     @OA\Response(response=404, description="Submission not found")
     * )
     * 
     * POST /api/teacher/submissions/{id}/auto-grade
     * Tự động chấm câu trắc nghiệm
     */
    public function autoGrade(Request $request, $id)
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
                                ->with(['answers.question.answers'])
                                ->first();

        if (!$submission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài làm.'
            ], 404);
        }

        try {
            $autoGradedCount = 0;
            $manualGradingRequired = 0;

            foreach ($submission->answers as $submissionAnswer) {
                $question = $submissionAnswer->question;
                
                // Auto-grade only specific question types
                if (in_array($question->qType, ['multiple_choice', 'true_false_not_given', 'yes_no_not_given', 'fill_blank', 'true_false'])) {
                    $isCorrect = $this->checkAnswer($question, $submissionAnswer->saAnswer_text);
                    $pointsAwarded = $isCorrect ? $question->qPoints : 0;

                    $submissionAnswer->update([
                        'saIs_correct' => $isCorrect,
                        'saPoints_awarded' => $pointsAwarded
                    ]);

                    $autoGradedCount++;
                } else {
                    // Essay, short answer, etc. require manual grading
                    $manualGradingRequired++;
                }
            }

            // Recalculate total score
            $totalScore = $this->calculateTotalScore($id);

            // Update submission status
            $newStatus = $manualGradingRequired > 0 ? 'partially_graded' : 'graded';
            $submission->update([
                'sScore' => $totalScore,
                'sStatus' => $newStatus,
                'sGraded_time' => now()
            ]);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'submissionId' => $id,
                    'auto_graded_questions' => $autoGradedCount,
                    'manual_grading_required' => $manualGradingRequired,
                    'current_score' => $totalScore,
                    'status' => $newStatus,
                    'message' => "Đã tự động chấm {$autoGradedCount} câu trắc nghiệm. Còn {$manualGradingRequired} câu cần chấm thủ công."
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tự động chấm điểm.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/teacher/submissions/{id}/detailed-grade",
     *     tags={"Grading"},
     *     summary="Detailed manual grading with comments",
     *     description="Grade individual questions with detailed feedback and comments",
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
     *                 property="question_grades",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="question_id", type="integer"),
     *                     @OA\Property(property="points_awarded", type="number", format="float"),
     *                     @OA\Property(property="feedback", type="string"),
     *                     @OA\Property(property="is_correct", type="boolean")
     *                 )
     *             ),
     *             @OA\Property(property="overall_feedback", type="string"),
     *             @OA\Property(property="strengths", type="array", @OA\Items(type="string")),
     *             @OA\Property(property="improvements", type="array", @OA\Items(type="string"))
     *         )
     *     ),
     *     @OA\Response(response=200, description="Detailed grading completed successfully")
     * )
     * 
     * POST /api/teacher/submissions/{id}/detailed-grade
     * Chấm thủ công với nhận xét chi tiết
     */
    public function detailedGrade(Request $request, $id)
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

        $validator = Validator::make($request->all(), [
            'question_grades' => 'required|array',
            'question_grades.*.question_id' => 'required|integer',
            'question_grades.*.points_awarded' => 'required|numeric|min:0',
            'question_grades.*.feedback' => 'nullable|string',
            'question_grades.*.is_correct' => 'nullable|boolean',
            'overall_feedback' => 'nullable|string',
            'strengths' => 'nullable|array',
            'improvements' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            // Update individual question grades with detailed feedback
            foreach ($request->question_grades as $gradeData) {
                $submissionAnswer = SubmissionAnswer::where('submission_id', $id)
                                                   ->where('question_id', $gradeData['question_id'])
                                                   ->first();

                if ($submissionAnswer) {
                    $submissionAnswer->update([
                        'saPoints_awarded' => $gradeData['points_awarded'],
                        'saIs_correct' => $gradeData['is_correct'] ?? null,
                        'saTeacher_feedback' => $gradeData['feedback'] ?? null
                    ]);
                }
            }

            // Prepare detailed feedback
            $detailedFeedback = [
                'overall_feedback' => $request->overall_feedback,
                'strengths' => $request->strengths ?? [],
                'improvements' => $request->improvements ?? [],
                'graded_by' => $user->uName,
                'graded_at' => now()->toISOString()
            ];

            // Recalculate total score
            $totalScore = $this->calculateTotalScore($id);

            // Update submission with detailed feedback
            $submission->update([
                'sScore' => $totalScore,
                'sStatus' => 'graded',
                'sTeacher_feedback' => json_encode($detailedFeedback),
                'sGraded_time' => now()
            ]);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'submissionId' => $id,
                    'final_score' => $totalScore,
                    'questions_graded' => count($request->question_grades),
                    'detailed_feedback' => $detailedFeedback,
                    'message' => 'Chấm điểm chi tiết hoàn tất'
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi chấm điểm chi tiết.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/teacher/classes/{classId}/report",
     *     tags={"Grading"},
     *     summary="Get class performance report",
     *     description="Get detailed performance report for a class including statistics and analysis",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="classId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="exam_id",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Class report generated successfully")
     * )
     * 
     * GET /api/teacher/classes/{classId}/report
     * Xem báo cáo kết quả lớp học
     */
    public function classReport(Request $request, $classId)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        // Get class information
        $class = \App\Models\Classes::find($classId);
        if (!$class) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy lớp học.'
            ], 404);
        }

        // Get students in class
        $studentIds = DB::table('class_enrollments')
                       ->where('class_id', $classId)
                       ->pluck('student_id');

        if ($studentIds->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'class' => $class,
                    'message' => 'Lớp học chưa có học sinh nào.'
                ]
            ]);
        }

        // Build query for submissions
        $submissionsQuery = Submission::with(['user', 'exam'])
                                     ->whereIn('user_id', $studentIds)
                                     ->whereHas('exam', function($q) use ($user) {
                                         $q->where('eTeacher_id', $user->uId);
                                     })
                                     ->where('sStatus', 'graded');

        // Filter by exam if specified
        if ($request->has('exam_id')) {
            $submissionsQuery->where('exam_id', $request->exam_id);
        }

        $submissions = $submissionsQuery->get();

        // Calculate statistics
        $statistics = $this->calculateClassStatistics($submissions, $studentIds);

        // Get performance by exam
        $examPerformance = $this->getExamPerformance($submissions);

        // Get student rankings
        $studentRankings = $this->getStudentRankings($submissions);

        // Get question analysis
        $questionAnalysis = $this->getQuestionAnalysis($submissions);

        return response()->json([
            'status' => 'success',
            'data' => [
                'class' => [
                    'cId' => $class->cId,
                    'cName' => $class->cName,
                    'total_students' => $studentIds->count()
                ],
                'statistics' => $statistics,
                'exam_performance' => $examPerformance,
                'student_rankings' => $studentRankings,
                'question_analysis' => $questionAnalysis,
                'generated_at' => now()->toISOString()
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/teacher/grading/statistics",
     *     tags={"Grading"},
     *     summary="Get grading statistics",
     *     description="Get overall grading statistics for teacher",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Grading statistics retrieved successfully")
     * )
     * 
     * GET /api/teacher/grading/statistics
     * Thống kê chấm điểm tổng quan
     */
    public function gradingStatistics(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $submissions = Submission::whereHas('exam', function($q) use ($user) {
                                    $q->where('eTeacher_id', $user->uId);
                                 })
                                 ->get();

        $totalSubmissions = $submissions->count();
        $gradedSubmissions = $submissions->where('sStatus', 'graded')->count();
        $pendingSubmissions = $submissions->whereIn('sStatus', ['submitted', 'partially_graded'])->count();

        // Average scores by exam type
        $scoresByExamType = $submissions->where('sStatus', 'graded')
                                      ->groupBy('exam.eType')
                                      ->map(function($group) {
                                          return [
                                              'count' => $group->count(),
                                              'average_score' => round($group->avg('sScore'), 2),
                                              'highest_score' => $group->max('sScore'),
                                              'lowest_score' => $group->min('sScore')
                                          ];
                                      });

        // Recent grading activity
        $recentActivity = $submissions->where('sStatus', 'graded')
                                    ->where('sGraded_time', '>=', now()->subDays(7))
                                    ->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_submissions' => $totalSubmissions,
                'graded_submissions' => $gradedSubmissions,
                'pending_submissions' => $pendingSubmissions,
                'grading_completion_rate' => $totalSubmissions > 0 ? round(($gradedSubmissions / $totalSubmissions) * 100, 2) : 0,
                'scores_by_exam_type' => $scoresByExamType,
                'recent_grading_activity' => $recentActivity,
                'average_grading_time' => $this->calculateAverageGradingTime($submissions)
            ]
        ]);
    }

    /**
     * Check if an answer is correct for auto-grading
     */
    private function checkAnswer($question, $studentAnswer)
    {
        $correctAnswers = $question->answers()->where('aIs_correct', true)->get();
        
        if ($correctAnswers->isEmpty()) {
            return false;
        }

        $studentAnswer = trim(strtolower($studentAnswer));

        foreach ($correctAnswers as $correctAnswer) {
            $correctText = trim(strtolower($correctAnswer->aContent));
            
            // Exact match for multiple choice
            if ($question->question_type === 'multiple_choice') {
                if ($studentAnswer === $correctText) {
                    return true;
                }
            }
            
            // Flexible matching for fill-in-blank
            if ($question->question_type === 'fill_blank') {
                // Remove extra spaces and check
                if (str_replace(' ', '', $studentAnswer) === str_replace(' ', '', $correctText)) {
                    return true;
                }
            }
            
            // Boolean questions
            if (in_array($question->question_type, ['true_false_not_given', 'yes_no_not_given'])) {
                if ($studentAnswer === $correctText) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Calculate class statistics
     */
    private function calculateClassStatistics($submissions, $studentIds)
    {
        $totalStudents = $studentIds->count();
        $studentsWithSubmissions = $submissions->pluck('user_id')->unique()->count();
        
        if ($submissions->isEmpty()) {
            return [
                'total_students' => $totalStudents,
                'students_with_submissions' => 0,
                'participation_rate' => 0,
                'average_score' => 0,
                'pass_rate' => 0,
                'score_distribution' => []
            ];
        }

        $scores = $submissions->pluck('sScore')->filter();
        $averageScore = round($scores->avg(), 2);
        $passCount = $scores->filter(function($score) { return $score >= 60; })->count();
        $passRate = round(($passCount / $scores->count()) * 100, 2);

        // Score distribution
        $scoreDistribution = [
            '90-100' => $scores->filter(function($s) { return $s >= 90; })->count(),
            '80-89' => $scores->filter(function($s) { return $s >= 80 && $s < 90; })->count(),
            '70-79' => $scores->filter(function($s) { return $s >= 70 && $s < 80; })->count(),
            '60-69' => $scores->filter(function($s) { return $s >= 60 && $s < 70; })->count(),
            '0-59' => $scores->filter(function($s) { return $s < 60; })->count(),
        ];

        return [
            'total_students' => $totalStudents,
            'students_with_submissions' => $studentsWithSubmissions,
            'participation_rate' => round(($studentsWithSubmissions / $totalStudents) * 100, 2),
            'average_score' => $averageScore,
            'highest_score' => $scores->max(),
            'lowest_score' => $scores->min(),
            'pass_rate' => $passRate,
            'score_distribution' => $scoreDistribution
        ];
    }

    /**
     * Get exam performance breakdown
     */
    private function getExamPerformance($submissions)
    {
        return $submissions->groupBy('exam_id')->map(function($examSubmissions) {
            $exam = $examSubmissions->first()->exam;
            $scores = $examSubmissions->pluck('sScore')->filter();
            
            return [
                'exam_id' => $exam->eId,
                'exam_title' => $exam->eTitle,
                'exam_type' => $exam->eType,
                'submissions_count' => $examSubmissions->count(),
                'average_score' => round($scores->avg(), 2),
                'highest_score' => $scores->max(),
                'lowest_score' => $scores->min(),
                'pass_rate' => round($scores->filter(function($s) { return $s >= 60; })->count() / $scores->count() * 100, 2)
            ];
        })->values();
    }

    /**
     * Get student rankings
     */
    private function getStudentRankings($submissions)
    {
        return $submissions->groupBy('user_id')->map(function($studentSubmissions) {
            $student = $studentSubmissions->first()->user;
            $scores = $studentSubmissions->pluck('sScore')->filter();
            
            return [
                'student_id' => $student->uId,
                'student_name' => $student->uName,
                'submissions_count' => $studentSubmissions->count(),
                'average_score' => round($scores->avg(), 2),
                'highest_score' => $scores->max(),
                'total_points' => $scores->sum()
            ];
        })->sortByDesc('average_score')->values();
    }

    /**
     * Get question analysis
     */
    private function getQuestionAnalysis($submissions)
    {
        $questionStats = [];
        
        foreach ($submissions as $submission) {
            foreach ($submission->answers as $answer) {
                $questionId = $answer->question_id;
                
                if (!isset($questionStats[$questionId])) {
                    $questionStats[$questionId] = [
                        'question_id' => $questionId,
                        'question_text' => $answer->question->question_text ?? 'N/A',
                        'question_type' => $answer->question->question_type ?? 'N/A',
                        'total_attempts' => 0,
                        'correct_attempts' => 0,
                        'average_score' => 0,
                        'total_points' => 0
                    ];
                }
                
                $questionStats[$questionId]['total_attempts']++;
                if ($answer->saIs_correct) {
                    $questionStats[$questionId]['correct_attempts']++;
                }
                $questionStats[$questionId]['total_points'] += $answer->saPoints_awarded ?? 0;
            }
        }
        
        // Calculate averages and success rates
        foreach ($questionStats as &$stat) {
            $stat['success_rate'] = $stat['total_attempts'] > 0 ? 
                round(($stat['correct_attempts'] / $stat['total_attempts']) * 100, 2) : 0;
            $stat['average_score'] = $stat['total_attempts'] > 0 ? 
                round($stat['total_points'] / $stat['total_attempts'], 2) : 0;
        }
        
        return array_values($questionStats);
    }

    /**
     * Calculate average grading time
     */
    private function calculateAverageGradingTime($submissions)
    {
        $gradedSubmissions = $submissions->where('sStatus', 'graded')
                                       ->whereNotNull('sSubmit_time')
                                       ->whereNotNull('sGraded_time');
        
        if ($gradedSubmissions->isEmpty()) {
            return 0;
        }
        
        $totalMinutes = 0;
        foreach ($gradedSubmissions as $submission) {
            $submitTime = \Carbon\Carbon::parse($submission->sSubmit_time);
            $gradedTime = \Carbon\Carbon::parse($submission->sGraded_time);
            $totalMinutes += $submitTime->diffInMinutes($gradedTime);
        }
        
        return round($totalMinutes / $gradedSubmissions->count(), 2);
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
