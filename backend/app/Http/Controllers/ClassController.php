<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Classes;
use App\Models\ClassEnrollment;
use App\Models\User;

class ClassController extends Controller
{
    /**
     * @OA\Get(
     *     path="/teacher/classes",
     *     tags={"Classes"},
     *     summary="Get teacher classes",
     *     description="Get list of classes for authenticated teacher",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Classes retrieved successfully"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     * 
     * GET /api/teacher/classes
     * Lấy danh sách lớp học của teacher
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

        $classes = Classes::where('cTeacher_id', $user->uId)
                         ->orderBy('cCreated_at', 'desc')
                         ->get();

        return response()->json([
            'status' => 'success',
            'data' => $classes
        ]);
    }

    /**
     * @OA\Post(
     *     path="/teacher/classes",
     *     tags={"Classes"},
     *     summary="Create new class",
     *     description="Create a new class (teacher only)",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"cName"},
     *             @OA\Property(property="cName", type="string", example="Advanced English Class"),
     *             @OA\Property(property="cDescription", type="string", example="Advanced level English course"),
     *             @OA\Property(property="cStatus", type="string", example="active")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Class created successfully"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     * 
     * POST /api/teacher/classes
     * Tạo lớp học mới
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'cName' => 'required|string|max:100',
            'cDescription' => 'nullable|string',
            'cStatus' => 'required|in:active,inactive',
            'course' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $class = Classes::create([
            'cName' => $request->cName,
            'cTeacher_id' => $user->uId,
            'cDescription' => $request->cDescription,
            'cStatus' => $request->cStatus,
            'course' => $request->course,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'classId' => $class->cId
            ]
        ]);
    }

    /**
     * GET /api/teacher/classes/{id}
     * Lấy chi tiết lớp học với danh sách học viên
     */
    /**
     * @OA\Get(
     *     path="/teacher/classes/{id}",
     *     tags={"Classes"},
     *     summary="Get class details",
     *     description="Get detailed information about a specific class including enrolled students",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer"),
     *         example=1
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Class details retrieved successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Class not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
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

        $class = Classes::where('cId', $id)
                       ->where('cTeacher_id', $user->uId)
                       ->first();

        if (!$class) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy lớp học.'
            ], 404);
        }

        // Load enrolled students
        $class->load(['enrollments.student']);

        return response()->json([
            'status' => 'success',
            'data' => $class
        ]);
    }

    /**
     * PUT /api/teacher/classes/{id}
     * Cập nhật thông tin lớp học
     */
    /**
     * @OA\Put(
     *     path="/teacher/classes/{id}",
     *     tags={"Classes"},
     *     summary="Update class",
     *     description="Update class information",
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
     *             @OA\Property(property="cName", type="string", example="Advanced English Class"),
     *             @OA\Property(property="cDescription", type="string", example="Advanced level English course"),
     *             @OA\Property(property="cStatus", type="string", enum={"active", "inactive"}, example="active"),
     *             @OA\Property(property="course", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Class updated successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Class not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $class = Classes::where('cId', $id)
                       ->where('cTeacher_id', $user->uId)
                       ->first();

        if (!$class) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy lớp học.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'cName' => 'sometimes|required|string|max:100',
            'cDescription' => 'nullable|string',
            'cStatus' => 'sometimes|required|in:active,inactive',
            'course' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $class->update($request->only(['cName', 'cDescription', 'cStatus', 'course']));

        return response()->json([
            'status' => 'success',
            'data' => [
                'message' => 'Cập nhật lớp học thành công'
            ]
        ]);
    }

    /**
     * DELETE /api/teacher/classes/{id}
     * Xóa lớp học (soft delete)
     */
    /**
     * @OA\Delete(
     *     path="/teacher/classes/{id}",
     *     tags={"Classes"},
     *     summary="Delete class",
     *     description="Delete a class (soft delete)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Class deleted successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Class not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
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

        $class = Classes::where('cId', $id)
                       ->where('cTeacher_id', $user->uId)
                       ->first();

        if (!$class) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy lớp học.'
            ], 404);
        }

        $class->delete();

        return response()->json([
            'status' => 'success',
            'data' => [
                'message' => 'Xóa lớp học thành công'
            ]
        ]);
    }

    /**
     * POST /api/teacher/classes/{id}/enroll
     * Ghi danh học viên vào lớp (đơn lẻ hoặc hàng loạt)
     */
    /**
     * @OA\Post(
     *     path="/teacher/classes/{id}/enroll",
     *     tags={"Classes"},
     *     summary="Enroll students to class",
     *     description="Enroll multiple students to a class",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer"),
     *         example=1
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"student_ids"},
     *             @OA\Property(
     *                 property="student_ids",
     *                 type="array",
     *                 @OA\Items(type="integer"),
     *                 example={2, 3, 4}
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Students enrolled successfully"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Class not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function enroll(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $class = Classes::where('cId', $id)
                       ->where('cTeacher_id', $user->uId)
                       ->first();

        if (!$class) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy lớp học.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'student_ids' => 'required|array',
            'student_ids.*' => 'required|integer|exists:users,uId',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $successCount = 0;
        $errors = [];

        DB::beginTransaction();
        try {
            foreach ($request->student_ids as $studentId) {
                // Check if student exists and has role='student'
                $student = User::where('uId', $studentId)
                              ->where('uRole', 'student')
                              ->whereNull('uDeleted_at')
                              ->first();

                if (!$student) {
                    $errors[] = "Học viên ID {$studentId} không tồn tại hoặc không phải là học viên.";
                    continue;
                }

                // Check if already enrolled
                $exists = ClassEnrollment::where('class_id', $id)
                                        ->where('student_id', $studentId)
                                        ->exists();

                if ($exists) {
                    $errors[] = "Học viên {$student->uName} đã được ghi danh vào lớp này.";
                    continue;
                }

                ClassEnrollment::create([
                    'class_id' => $id,
                    'student_id' => $studentId,
                ]);

                $successCount++;
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'enrolled_count' => $successCount,
                    'errors' => $errors
                ],
                'message' => "Đã ghi danh {$successCount} học viên thành công."
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi ghi danh học viên.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
