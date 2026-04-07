<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\TestWebSocketService;
use App\Models\Submission;
use App\Models\TestAssignment;
use Illuminate\Support\Facades\Redis;

/**
 * @OA\Tag(
 *     name="Teacher Dashboard",
 *     description="Real-time teacher dashboard and monitoring API endpoints"
 * )
 */
class TeacherDashboardController extends Controller
{
    /**
     * @OA\Get(
     *     path="/teacher/dashboard/overview",
     *     tags={"Teacher Dashboard"},
     *     summary="Get dashboard overview statistics",
     *     description="Get comprehensive dashboard statistics including counts, performance, and activities",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Dashboard overview retrieved successfully")
     * )
     */
    public function getDashboardOverview(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        // Get counts
        $totalCourses = \App\Models\Course::where('cTeacher', $user->uId)->count();
        $totalClasses = \App\Models\Classes::where('cTeacher_id', $user->uId)->count();
        $totalExams = \App\Models\Exam::where('teacher_id', $user->uId)->count();
        
        // Get total students across all classes
        $totalStudents = \App\Models\ClassEnrollment::whereIn('class_id', 
            \App\Models\Classes::where('cTeacher_id', $user->uId)->pluck('cId')
        )->distinct('student_id')->count('student_id');

        // Get this month's new items
        $newCoursesThisMonth = \App\Models\Course::where('cTeacher', $user->uId)
            ->whereMonth('cCreateAt', now()->month)
            ->count();
        
        $newClassesThisMonth = \App\Models\Classes::where('cTeacher_id', $user->uId)
            ->whereMonth('cCreated_at', now()->month)
            ->count();
            
        $newStudentsThisMonth = \App\Models\ClassEnrollment::whereIn('class_id',
            \App\Models\Classes::where('cTeacher_id', $user->uId)->pluck('cId')
        )
            ->whereMonth('enrolled_at', now()->month)
            ->distinct('student_id')
            ->count('student_id');
            
        $newExamsThisMonth = \App\Models\Exam::where('teacher_id', $user->uId)
            ->whereMonth('eCreated_at', now()->month)
            ->count();

        // Get today's classes (assignments with deadline today)
        $classesToday = \App\Models\TestAssignment::whereIn('exam_id',
            \App\Models\Exam::where('teacher_id', $user->uId)->pluck('eId')
        )
            ->whereDate('taDeadline', today())
            ->count();

        // Get pending grading
        $pendingGrading = Submission::whereIn('exam_id',
            \App\Models\Exam::where('teacher_id', $user->uId)->pluck('eId')
        )
            ->where('sStatus', 'submitted')
            ->whereNull('sGraded_time')
            ->count();

        // Get deadlines this week
        $deadlinesThisWeek = \App\Models\TestAssignment::whereIn('exam_id',
            \App\Models\Exam::where('teacher_id', $user->uId)->pluck('eId')
        )
            ->whereBetween('taDeadline', [now()->startOfWeek(), now()->endOfWeek()])
            ->count();

        // Calculate average score
        $avgScore = Submission::whereIn('exam_id',
            \App\Models\Exam::where('teacher_id', $user->uId)->pluck('eId')
        )
            ->where('sStatus', 'graded')
            ->whereNotNull('sScore')
            ->avg('sScore');

        // Calculate score improvement (compare last 2 weeks)
        $lastWeekAvg = Submission::whereIn('exam_id',
            \App\Models\Exam::where('teacher_id', $user->uId)->pluck('eId')
        )
            ->where('sStatus', 'graded')
            ->whereBetween('sSubmit_time', [now()->subWeeks(2), now()->subWeek()])
            ->avg('sScore');
            
        $thisWeekAvg = Submission::whereIn('exam_id',
            \App\Models\Exam::where('teacher_id', $user->uId)->pluck('eId')
        )
            ->where('sStatus', 'graded')
            ->whereBetween('sSubmit_time', [now()->subWeek(), now()])
            ->avg('sScore');

        $scoreImprovement = $lastWeekAvg > 0 ? round((($thisWeekAvg - $lastWeekAvg) / $lastWeekAvg) * 100, 1) : 0;

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_courses' => $totalCourses,
                'total_classes' => $totalClasses,
                'total_students' => $totalStudents,
                'total_exams' => $totalExams,
                'new_courses_this_month' => $newCoursesThisMonth,
                'new_classes_this_month' => $newClassesThisMonth,
                'new_students_this_month' => $newStudentsThisMonth,
                'new_exams_this_month' => $newExamsThisMonth,
                'classes_today' => $classesToday,
                'pending_grading' => $pendingGrading,
                'deadlines_this_week' => $deadlinesThisWeek,
                'average_score' => round($avgScore ?? 0, 1),
                'score_improvement' => $scoreImprovement,
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/teacher/dashboard/performance-data",
     *     tags={"Teacher Dashboard"},
     *     summary="Get weekly performance data",
     *     description="Get student performance data for the last 6 weeks",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Performance data retrieved successfully")
     * )
     */
    public function getPerformanceData(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        $examIds = \App\Models\Exam::where('teacher_id', $user->uId)->pluck('eId');
        
        $performanceData = [];
        
        for ($i = 5; $i >= 0; $i--) {
            $weekStart = now()->subWeeks($i)->startOfWeek();
            $weekEnd = now()->subWeeks($i)->endOfWeek();
            
            $submissions = Submission::whereIn('exam_id', $examIds)
                ->where('sStatus', 'graded')
                ->whereBetween('sSubmit_time', [$weekStart, $weekEnd])
                ->get();

            $weekLabel = 'T' . (6 - $i);
            
            $performanceData[] = [
                'week' => $weekLabel,
                'average' => round($submissions->avg('sScore') ?? 0, 1),
                'listening' => round($submissions->where('exam.eType', 'listening')->avg('sScore') ?? 0, 1),
                'reading' => round($submissions->where('exam.eType', 'reading')->avg('sScore') ?? 0, 1),
                'writing' => round($submissions->where('exam.eType', 'writing')->avg('sScore') ?? 0, 1),
            ];
        }

        return response()->json([
            'status' => 'success',
            'data' => $performanceData
        ]);
    }

    /**
     * @OA\Get(
     *     path="/teacher/dashboard/recent-activities",
     *     tags={"Teacher Dashboard"},
     *     summary="Get recent activities",
     *     description="Get recent teacher activities (exams created, assignments, grading)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Recent activities retrieved successfully")
     * )
     */
    public function getRecentActivities(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        $activities = [];

        // Recent exams created
        $recentExams = \App\Models\Exam::where('teacher_id', $user->uId)
            ->orderBy('eCreated_at', 'desc')
            ->limit(2)
            ->get();
            
        foreach ($recentExams as $exam) {
            $activities[] = [
                'id' => 'exam_' . $exam->eId,
                'type' => 'created',
                'detail' => $exam->eTitle,
                'time' => now()->diffInHours($exam->eCreated_at),
                'timeUnit' => 'hoursAgo',
                'timestamp' => $exam->eCreated_at,
                'color' => '#2563EB',
                'bg' => '#EFF6FF',
            ];
        }

        // Recent assignments
        $recentAssignments = \App\Models\TestAssignment::whereIn('exam_id',
            \App\Models\Exam::where('teacher_id', $user->uId)->pluck('eId')
        )
            ->orderBy('taCreated_at', 'desc')
            ->limit(2)
            ->get();
            
        foreach ($recentAssignments as $assignment) {
            $className = 'Class';
            if ($assignment->target_type === 'class' && $assignment->target_id) {
                $class = \App\Models\Classes::find($assignment->target_id);
                $className = $class ? $class->cName : 'Class';
            }
            
            $activities[] = [
                'id' => 'assignment_' . $assignment->id,
                'type' => 'assigned',
                'detail' => $className,
                'time' => now()->diffInHours($assignment->taCreated_at),
                'timeUnit' => 'hoursAgo',
                'timestamp' => $assignment->taCreated_at,
                'color' => '#10B981',
                'bg' => '#F0FDF4',
            ];
        }

        // Recent grading
        $recentGrading = Submission::whereIn('exam_id',
            \App\Models\Exam::where('teacher_id', $user->uId)->pluck('eId')
        )
            ->where('sStatus', 'graded')
            ->whereNotNull('sGraded_time')
            ->whereDate('sGraded_time', '>=', now()->subDays(2))
            ->count();
            
        if ($recentGrading > 0) {
            $activities[] = [
                'id' => 'grading_recent',
                'type' => 'graded',
                'detail' => (string)$recentGrading,
                'detailType' => 'submissions',
                'time' => '',
                'timeUnit' => 'yesterday',
                'timestamp' => now()->subDay(),
                'color' => '#F59E0B',
                'bg' => '#FFFBEB',
            ];
        }

        // Sort by timestamp and limit to 4
        usort($activities, function($a, $b) {
            return $b['timestamp'] <=> $a['timestamp'];
        });
        
        $activities = array_slice($activities, 0, 4);

        return response()->json([
            'status' => 'success',
            'data' => $activities
        ]);
    }

    /**
     * @OA\Get(
     *     path="/teacher/dashboard/test-statistics/{examId}",
     *     tags={"Teacher Dashboard"},
     *     summary="Get real-time test statistics",
     *     description="Get live statistics for ongoing tests",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="examId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Statistics retrieved successfully")
     * )
     */
    public function getTestStatistics(Request $request, $examId)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        // If examId is 0, return dashboard overview
        if ($examId == 0) {
            return $this->getDashboardOverview($request);
        }

        $stats = TestWebSocketService::getTestStatistics($examId);

        return response()->json([
            'status' => 'success',
            'data' => $stats
        ]);
    }

    /**
     * @OA\Get(
     *     path="/teacher/dashboard/active-sessions",
     *     tags={"Teacher Dashboard"},
     *     summary="Get active test sessions",
     *     description="Get list of currently active test sessions with connection status",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Active sessions retrieved successfully")
     * )
     */
    public function getActiveSessions(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        // Get active submissions for teacher's exams
        $activeSessions = Submission::with(['user', 'exam', 'assignment'])
            ->whereHas('exam', function($query) use ($user) {
                $query->where('teacher_id', $user->uId);
            })
            ->where('sStatus', 'in_progress')
            ->get()
            ->map(function($submission) {
                $connectionKey = "test_session:{$submission->sId}";
                
                return [
                    'submission_id' => $submission->sId,
                    'student' => [
                        'id' => $submission->user->uId,
                        'name' => $submission->user->uName,
                        'phone' => $submission->user->uPhone
                    ],
                    'exam' => [
                        'id' => $submission->exam->eId,
                        'title' => $submission->exam->eTitle
                    ],
                    'start_time' => $submission->sStart_time,
                    'time_elapsed' => now()->diffInMinutes($submission->sStart_time),
                    'time_remaining' => max(0, $submission->exam->eDuration_minutes - now()->diffInMinutes($submission->sStart_time)),
                    'connection_status' => [
                        'connected' => Redis::hget($connectionKey, 'connected') === 'true',
                        'last_seen' => Redis::hget($connectionKey, 'last_seen'),
                        'connection_count' => Redis::hget($connectionKey, 'connection_count') ?: 0,
                        'disconnection_count' => Redis::hget($connectionKey, 'disconnection_count') ?: 0,
                        'answers_count' => Redis::hget($connectionKey, 'answers_count') ?: 0
                    ]
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $activeSessions
        ]);
    }

    /**
     * @OA\Post(
     *     path="/teacher/dashboard/send-message",
     *     tags={"Teacher Dashboard"},
     *     summary="Send message to student during test",
     *     description="Send real-time message to student via WebSocket",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"submission_id", "message"},
     *             @OA\Property(property="submission_id", type="integer", example=123),
     *             @OA\Property(property="message", type="string", example="Chúc bạn làm bài tốt!")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Message sent successfully")
     * )
     */
    public function sendMessageToStudent(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        $request->validate([
            'submission_id' => 'required|integer|exists:submissions,sId',
            'message' => 'required|string|max:500'
        ]);

        $submission = Submission::with(['exam', 'user'])
            ->where('sId', $request->submission_id)
            ->whereHas('exam', function($query) use ($user) {
                $query->where('teacher_id', $user->uId);
            })
            ->first();

        if (!$submission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Submission not found or not authorized'
            ], 404);
        }

        // Send message via WebSocket
        broadcast(new \App\Events\TestSessionEvent(
            $submission->sId,
            $submission->user_id,
            'teacher_message',
            [
                'message' => $request->message,
                'teacher_name' => $user->uName,
                'timestamp' => now()->toISOString()
            ]
        ));

        return response()->json([
            'status' => 'success',
            'message' => 'Message sent to student successfully'
        ]);
    }

    /**
     * @OA\Get(
     *     path="/teacher/dashboard/connection-logs/{submissionId}",
     *     tags={"Teacher Dashboard"},
     *     summary="Get connection logs for a test session",
     *     description="Get detailed connection history for troubleshooting",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="submissionId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Connection logs retrieved successfully")
     * )
     */
    public function getConnectionLogs(Request $request, $submissionId)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        $submission = Submission::with(['exam', 'user'])
            ->where('sId', $submissionId)
            ->whereHas('exam', function($query) use ($user) {
                $query->where('teacher_id', $user->uId);
            })
            ->first();

        if (!$submission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Submission not found or not authorized'
            ], 404);
        }

        $connectionKey = "test_session:{$submissionId}";
        $connectionData = Redis::hgetall($connectionKey);

        return response()->json([
            'status' => 'success',
            'data' => [
                'submission_id' => $submissionId,
                'student' => [
                    'name' => $submission->user->uName,
                    'phone' => $submission->user->uPhone
                ],
                'connection_history' => $connectionData,
                'current_status' => [
                    'connected' => ($connectionData['connected'] ?? 'false') === 'true',
                    'last_activity' => $connectionData['last_seen'] ?? null,
                    'total_connections' => $connectionData['connection_count'] ?? 0,
                    'total_disconnections' => $connectionData['disconnection_count'] ?? 0,
                    'answers_submitted' => $connectionData['answers_count'] ?? 0
                ]
            ]
        ]);
    }
}