<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\TestAssignment;
use App\Models\Exam;
use App\Models\Classes;
use App\Models\User;

class TestAssignmentController extends Controller
{
    /**
     * @OA\Post(
     *     path="/teacher/exams/{examId}/assign",
     *     tags={"Assignments"},
     *     summary="Assign exam to class or student",
     *     description="Assign an exam to a class or individual student",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="examId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"taTarget_type","taTarget_id","taDeadline"},
     *             @OA\Property(property="taTarget_type", type="string", enum={"class","student"}, example="class"),
     *             @OA\Property(property="taTarget_id", type="integer", example=1),
     *             @OA\Property(property="taDeadline", type="string", format="date-time", example="2026-04-30T23:59:59"),
     *             @OA\Property(property="taMax_attempt", type="integer", example=3),
     *             @OA\Property(property="taInstructions", type="string", example="Complete within time limit")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Exam assigned successfully"),
     *     @OA\Response(response=400, description="Validation error")
     * )
     * 
     * POST /api/teacher/exams/{examId}/assign
     * Gán bài thi cho lớp hoặc học viên
     */
    public function assign(Request $request, $examId)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $exam = Exam::where('eId', $examId)
                   ->where('eTeacher_id', $user->uId)
                   ->first();

        if (!$exam) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài thi.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'taTarget_type' => 'required|in:class,student',
            'taTarget_id' => 'required|integer',
            'taDeadline' => 'nullable|date|after:now',
            'taMax_attempt' => 'nullable|integer|min:1',
            'taIs_public' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        // Validate target exists
        if ($request->taTarget_type === 'class') {
            $target = Classes::find($request->taTarget_id);
            if (!$target) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy lớp học.'
                ], 404);
            }
        } else {
            $target = User::where('uId', $request->taTarget_id)
                         ->where('uRole', 'student')
                         ->whereNull('uDeleted_at')
                         ->first();
            if (!$target) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy học viên.'
                ], 404);
            }
        }

        $assignment = TestAssignment::create([
            'exam_id' => $examId,
            'taTarget_type' => $request->taTarget_type,
            'taTarget_id' => $request->taTarget_id,
            'taDeadline' => $request->taDeadline,
            'taMax_attempt' => $request->taMax_attempt ?? 1,
            'taIs_public' => $request->taIs_public ?? false,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'assignmentId' => $assignment->taId
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/teacher/assignments",
     *     tags={"Assignments"},
     *     summary="Get test assignments",
     *     description="Get list of test assignments with optional filters",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="exam_id",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="integer"),
     *         description="Filter by exam ID"
     *     ),
     *     @OA\Parameter(
     *         name="target_type",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="string", enum={"class","student"}),
     *         description="Filter by target type"
     *     ),
     *     @OA\Response(response=200, description="Assignments retrieved successfully"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     * 
     * GET /api/teacher/assignments
     * Lấy danh sách phân công bài thi (có filter)
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

        $query = TestAssignment::with(['exam'])
                               ->whereHas('exam', function($q) use ($user) {
                                   $q->where('eTeacher_id', $user->uId);
                               });

        // Filter by exam_id
        if ($request->has('exam_id')) {
            $query->where('exam_id', $request->exam_id);
        }

        // Filter by target_type
        if ($request->has('target_type')) {
            $query->where('taTarget_type', $request->target_type);
        }

        // Filter by target_id
        if ($request->has('target_id')) {
            $query->where('taTarget_id', $request->target_id);
        }

        $assignments = $query->orderBy('taCreated_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $assignments
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/teacher/assignments/{id}",
     *     tags={"Assignments"},
     *     summary="Delete test assignment",
     *     description="Delete a test assignment",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Assignment deleted successfully"),
     *     @OA\Response(response=404, description="Assignment not found")
     * )
     * 
     * DELETE /api/teacher/assignments/{id}
     * Xóa phân công bài thi
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $assignment = TestAssignment::where('taId', $id)
                                    ->whereHas('exam', function($q) use ($user) {
                                        $q->where('eTeacher_id', $user->uId);
                                    })
                                    ->first();

        if (!$assignment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy phân công bài thi.'
            ], 404);
        }

        $assignment->delete();

        return response()->json([
            'status' => 'success',
            'data' => [
                'message' => 'Xóa phân công bài thi thành công'
            ]
        ]);
    }
}
