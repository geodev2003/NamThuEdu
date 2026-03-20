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