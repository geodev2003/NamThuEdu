<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Classes;
use App\Models\ClassEnrollment;
use App\Models\ClassTransfer;
use App\Models\Course;
use App\Models\User;

class ClassController extends Controller
{
    /**
     * @OA\Get(
     *     path="/teacher/classes",
     *     tags={"Classes"},
     *     summary="Get teacher classes",
     *     description="Get list of classes for authenticated teacher with enrollment statistics",
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
     * Lấy danh sách lớp học của teacher với thống kê
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

        $classes = Classes::with(['course', 'enrollments'])
                         ->where('cTeacher_id', $user->uId)
                         ->orderBy('cCreated_at', 'desc')
                         ->get();

        // Thêm thống kê cho mỗi lớp
        $classesWithStats = $classes->map(function($class) {
            return [
                'cId' => $class->cId,
                'cName' => $class->cName,
                'cDescription' => $class->cDescription,
                'cStatus' => $class->cStatus,
                'cCreated_at' => $class->cCreated_at,
                'course' => $class->course ? [
                    'cId' => $class->course->cId,
                    'cName' => $class->course->cName,
                ] : null,
                'enrollment_stats' => [
                    'total_students' => $class->enrollments->count(),
                    'active_students' => $class->enrollments->count(), // All enrollments are active in current schema
                ],
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $classesWithStats
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
            'cDescription' => 'nullable|string|max:1000',
            'cStatus' => 'required|in:active,inactive',
            'course' => 'required|integer|exists:course,cId',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        // Kiểm tra teacher có quyền với course này không
        $course = Course::where('cId', $request->course)
                       ->where('cTeacher', $user->uId)
                       ->whereNull('cDeleteAt')
                       ->first();

        if (!$course) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền tạo lớp trong khóa học này.'
            ], 403);
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

    /**
     * POST /api/teacher/classes/{fromId}/transfer/{toId}
     * Chuyển học viên giữa các lớp
     */
    /**
     * @OA\Post(
     *     path="/teacher/classes/{fromId}/transfer/{toId}",
     *     tags={"Classes"},
     *     summary="Transfer students between classes",
     *     description="Transfer multiple students from one class to another",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="fromId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer"),
     *         example=1
     *     ),
     *     @OA\Parameter(
     *         name="toId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer"),
     *         example=2
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
     *             ),
     *             @OA\Property(property="reason", type="string", example="Học viên yêu cầu chuyển lớp"),
     *             @OA\Property(property="notes", type="string", example="Ghi chú thêm về việc chuyển lớp")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Students transferred successfully"
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
    public function transferStudents(Request $request, $fromId, $toId)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        // Validate classes exist and belong to teacher
        $fromClass = Classes::where('cId', $fromId)
                           ->where('cTeacher_id', $user->uId)
                           ->first();

        $toClass = Classes::where('cId', $toId)
                         ->where('cTeacher_id', $user->uId)
                         ->first();

        if (!$fromClass || !$toClass) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy lớp học hoặc bạn không có quyền truy cập.'
            ], 404);
        }

        if ($fromId == $toId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể chuyển học viên trong cùng một lớp.'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'student_ids' => 'required|array|min:1',
            'student_ids.*' => 'required|integer|exists:users,uId',
            'reason' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
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

                // Check if student is enrolled in from_class
                $fromEnrollment = ClassEnrollment::where('class_id', $fromId)
                                                ->where('student_id', $studentId)
                                                ->first();

                if (!$fromEnrollment) {
                    $errors[] = "Học viên {$student->uName} không có trong lớp nguồn.";
                    continue;
                }

                // Check if student is already in to_class
                $toEnrollment = ClassEnrollment::where('class_id', $toId)
                                              ->where('student_id', $studentId)
                                              ->exists();

                if ($toEnrollment) {
                    $errors[] = "Học viên {$student->uName} đã có trong lớp đích.";
                    continue;
                }

                // Perform transfer
                // 1. Remove from source class
                $fromEnrollment->delete();

                // 2. Add to destination class
                ClassEnrollment::create([
                    'class_id' => $toId,
                    'student_id' => $studentId,
                ]);

                // 3. Log transfer
                ClassTransfer::create([
                    'student_id' => $studentId,
                    'from_class_id' => $fromId,
                    'to_class_id' => $toId,
                    'teacher_id' => $user->uId,
                    'reason' => $request->reason,
                    'notes' => $request->notes,
                    'transferred_at' => now(),
                ]);

                $successCount++;
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'transferred_count' => $successCount,
                    'errors' => $errors,
                    'from_class' => $fromClass->cName,
                    'to_class' => $toClass->cName,
                ],
                'message' => "Đã chuyển {$successCount} học viên thành công từ lớp '{$fromClass->cName}' sang lớp '{$toClass->cName}'."
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi chuyển học viên.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/teacher/classes/{id}/transfer-history
     * Xem lịch sử chuyển lớp của một lớp học
     */
    /**
     * @OA\Get(
     *     path="/teacher/classes/{id}/transfer-history",
     *     tags={"Classes"},
     *     summary="Get class transfer history",
     *     description="Get transfer history for a specific class (both incoming and outgoing transfers)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer"),
     *         example=1
     *     ),
     *     @OA\Parameter(
     *         name="days",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="integer", default=30),
     *         example=30
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Transfer history retrieved successfully"
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
    public function transferHistory(Request $request, $id)
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

        $days = $request->get('days', 30);

        // Get transfers involving this class
        $transfers = ClassTransfer::with(['student', 'fromClass', 'toClass', 'teacher'])
                                 ->byClass($id)
                                 ->recent($days)
                                 ->orderBy('transferred_at', 'desc')
                                 ->get();

        $transferHistory = $transfers->map(function($transfer) use ($id) {
            return [
                'id' => $transfer->id,
                'student' => [
                    'id' => $transfer->student->uId,
                    'name' => $transfer->student->uName,
                    'email' => $transfer->student->uEmail,
                ],
                'from_class' => [
                    'id' => $transfer->fromClass->cId,
                    'name' => $transfer->fromClass->cName,
                ],
                'to_class' => [
                    'id' => $transfer->toClass->cId,
                    'name' => $transfer->toClass->cName,
                ],
                'teacher' => [
                    'id' => $transfer->teacher->uId,
                    'name' => $transfer->teacher->uName,
                ],
                'reason' => $transfer->reason,
                'notes' => $transfer->notes,
                'transferred_at' => $transfer->transferred_at,
                'direction' => $transfer->from_class_id == $id ? 'outgoing' : 'incoming',
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => [
                'class' => [
                    'id' => $class->cId,
                    'name' => $class->cName,
                ],
                'transfers' => $transferHistory,
                'summary' => [
                    'total_transfers' => $transfers->count(),
                    'incoming' => $transfers->where('to_class_id', $id)->count(),
                    'outgoing' => $transfers->where('from_class_id', $id)->count(),
                    'period_days' => $days,
                ],
            ]
        ]);
    }

    /**
     * DELETE /api/teacher/classes/{id}/students/{studentId}
     * Xóa học viên khỏi lớp
     */
    /**
     * @OA\Delete(
     *     path="/teacher/classes/{id}/students/{studentId}",
     *     tags={"Classes"},
     *     summary="Remove student from class",
     *     description="Remove a student from a class",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer"),
     *         example=1
     *     ),
     *     @OA\Parameter(
     *         name="studentId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer"),
     *         example=2
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Student removed successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Class or student not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function removeStudent(Request $request, $id, $studentId)
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

        $enrollment = ClassEnrollment::where('class_id', $id)
                                   ->where('student_id', $studentId)
                                   ->first();

        if (!$enrollment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Học viên không có trong lớp này.'
            ], 404);
        }

        $student = User::find($studentId);
        $enrollment->delete();

        return response()->json([
            'status' => 'success',
            'data' => [
                'message' => "Đã xóa học viên {$student->uName} khỏi lớp {$class->cName}."
            ]
        ]);
    }

    /**
     * GET /api/teacher/classes/statistics
     * Thống kê tổng quan về các lớp học
     */
    /**
     * @OA\Get(
     *     path="/teacher/classes/statistics",
     *     tags={"Classes"},
     *     summary="Get class statistics",
     *     description="Get overall statistics for teacher's classes",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Statistics retrieved successfully"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function statistics(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $classes = Classes::where('cTeacher_id', $user->uId)->get();
        $totalStudents = ClassEnrollment::whereIn('class_id', $classes->pluck('cId'))->count();
        $recentTransfers = ClassTransfer::where('teacher_id', $user->uId)
                                      ->recent(7)
                                      ->count();

        $statistics = [
            'total_classes' => $classes->count(),
            'active_classes' => $classes->where('cStatus', 'active')->count(),
            'inactive_classes' => $classes->where('cStatus', 'inactive')->count(),
            'total_students' => $totalStudents,
            'recent_transfers' => $recentTransfers,
            'classes_by_course' => $classes->groupBy('course')->map(function($group) {
                return $group->count();
            }),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $statistics
        ]);
    }
}
