<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Services\TestWebSocketService;
use App\Models\Submission;

/**
 * @OA\Tag(
 *     name="WebSocket",
 *     description="Real-time WebSocket API endpoints for test sessions"
 * )
 */
class TestWebSocketController extends Controller
{
    /**
     * @OA\Post(
     *     path="/student/websocket/connect",
     *     tags={"WebSocket"},
     *     summary="Connect to test WebSocket session",
     *     description="Establish WebSocket connection for real-time test features",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"submission_id"},
     *             @OA\Property(property="submission_id", type="integer", example=123)
     *         )
     *     ),
     *     @OA\Response(response=200, description="WebSocket connection established"),
     *     @OA\Response(response=404, description="Submission not found")
     * )
     */
    public function connect(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'submission_id' => 'required|integer|exists:submissions,sId'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        $submission = Submission::where('sId', $request->submission_id)
                               ->where('user_id', $user->uId)
                               ->first();

        if (!$submission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Submission not found'
            ], 404);
        }

        TestWebSocketService::handleConnection($request->submission_id, $user->uId);

        return response()->json([
            'status' => 'success',
            'message' => 'WebSocket connection established',
            'channel' => "test-session.{$request->submission_id}"
        ]);
    }

    /**
     * @OA\Post(
     *     path="/student/websocket/answer",
     *     tags={"WebSocket"},
     *     summary="Save answer via WebSocket",
     *     description="Real-time answer saving through WebSocket",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"submission_id", "question_id", "answer_text"},
     *             @OA\Property(property="submission_id", type="integer", example=123),
     *             @OA\Property(property="question_id", type="integer", example=5),
     *             @OA\Property(property="answer_text", type="string", example="B")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Answer saved successfully")
     * )
     */
    public function saveAnswer(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'submission_id' => 'required|integer|exists:submissions,sId',
            'question_id' => 'required|integer|exists:questions,qId',
            'answer_text' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        $result = TestWebSocketService::handleAnswerUpdate(
            $request->submission_id,
            $user->uId,
            $request->question_id,
            $request->answer_text
        );

        return response()->json([
            'status' => $result['success'] ? 'success' : 'error',
            'message' => $result['message']
        ]);
    }

    /**
     * @OA\Post(
     *     path="/student/websocket/reconnect",
     *     tags={"WebSocket"},
     *     summary="Reconnect to test session",
     *     description="Handle reconnection after interruption (power outage, network issue)",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"submission_id"},
     *             @OA\Property(property="submission_id", type="integer", example=123)
     *         )
     *     ),
     *     @OA\Response(response=200, description="Reconnection handled")
     * )
     */
    public function reconnect(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'submission_id' => 'required|integer|exists:submissions,sId'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        TestWebSocketService::handleReconnection($request->submission_id, $user->uId);

        return response()->json([
            'status' => 'success',
            'message' => 'Reconnection processed'
        ]);
    }

    /**
     * @OA\Post(
     *     path="/student/websocket/sync-time",
     *     tags={"WebSocket"},
     *     summary="Sync server time",
     *     description="Get accurate server time for countdown synchronization",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"submission_id"},
     *             @OA\Property(property="submission_id", type="integer", example=123)
     *         )
     *     ),
     *     @OA\Response(response=200, description="Time sync sent")
     * )
     */
    public function syncTime(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'submission_id' => 'required|integer|exists:submissions,sId'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        TestWebSocketService::sendTimeSync($request->submission_id, $user->uId);

        return response()->json([
            'status' => 'success',
            'message' => 'Time sync sent'
        ]);
    }
}