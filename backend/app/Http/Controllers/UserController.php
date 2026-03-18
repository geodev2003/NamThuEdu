<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/users",
     *     tags={"Users"},
     *     summary="Get users list",
     *     description="Get list of all users (public endpoint)",
     *     @OA\Response(
     *         response=200,
     *         description="Users retrieved successfully"
     *     )
     * )
     * 
     * GET /api/users
     * Test endpoint
     */
    public function index()
    {
        return response()->json([
            'message' => 'Router hoạt động OK'
        ]);
    }

    /**
     * @OA\Post(
     *     path="/users",
     *     tags={"Users"},
     *     summary="Create new user",
     *     description="Create a new user (requires teacher/admin role if authenticated)",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"phone","password"},
     *             @OA\Property(property="phone", type="string", example="0987654321"),
     *             @OA\Property(property="password", type="string", example="password123"),
     *             @OA\Property(property="name", type="string", example="Nguyen Van B"),
     *             @OA\Property(property="role", type="string", example="student")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User created successfully"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Validation error"
     *     )
     * )
     * 
     * POST /api/users
     * Tạo user mới (tương thích với backend cũ)
     */
    /**
     * @OA\Post(
     *     path="/users",
     *     tags={"User Management"},
     *     summary="Create new user",
     *     description="Create a new user (public endpoint)",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"phone", "password"},
     *             @OA\Property(property="phone", type="string", example="0987654321"),
     *             @OA\Property(property="password", type="string", example="password123"),
     *             @OA\Property(property="name", type="string", example="Nguyen Van A"),
     *             @OA\Property(property="role", type="string", enum={"student", "teacher"}, example="student"),
     *             @OA\Property(property="dob", type="string", format="date", example="1995-01-01"),
     *             @OA\Property(property="address", type="string", example="Can Tho City"),
     *             @OA\Property(property="gender", type="boolean", example=true),
     *             @OA\Property(property="class", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User created successfully"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Permission denied"
     *     )
     * )
     */
    public function store(Request $request)
    {
        // Nếu có auth, check permission
        $authUser = auth()->user();
        if ($authUser && $authUser->uRole !== 'teacher' && $authUser->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền tạo user.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|unique:users,uPhone',
            'password' => 'required|string|min:6',
            'name' => 'nullable|string|max:150',
            'role' => 'nullable|in:student,teacher',
            'dob' => 'nullable|date',
            'address' => 'nullable|string',
            'gender' => 'nullable|boolean',
            'class' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            $user = User::create([
                'uPhone' => trim($request->phone),
                'uPassword' => Hash::make($request->password),
                'uName' => $request->name,
                'uRole' => $request->role ?? 'student',
                'uDoB' => $request->dob,
                'uAddress' => $request->address ?? '',
                'uGender' => $request->gender ?? 0,
                'uClass' => $request->class ?? 0,
                'uStatus' => 'active',
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'User created successfully',
                'data' => [
                    'id' => $user->uId,
                    'phone' => $user->uPhone,
                    'name' => $user->uName,
                    'role' => $user->uRole,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/users/{id}",
     *     tags={"Users"},
     *     summary="Delete user",
     *     description="Delete a user by ID (requires teacher/admin role)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="User deleted successfully"),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=404, description="User not found")
     * )
     * 
     * DELETE /api/users/{id}
     * Xóa user (tương thích với backend cũ)
     */
    public function destroy(Request $request, $id)
    {
        // Check permission
        $authUser = auth()->user();
        if (!$authUser || ($authUser->uRole !== 'teacher' && $authUser->uRole !== 'admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền xóa user.'
            ], 403);
        }

        $user = User::where('uId', $id)->whereNull('uDeleted_at')->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        // Prevent self-deletion
        if ($user->uId === $authUser->uId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete yourself'
            ], 400);
        }

        try {
            $user->delete(); // Soft delete

            return response()->json([
                'status' => 'success',
                'message' => 'User deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/teacher/students",
     *     tags={"Teachers"},
     *     summary="Get teacher students",
     *     description="Get list of students managed by authenticated teacher",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Students retrieved successfully"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     * 
     * GET /api/teacher/students
     * Lấy danh sách học viên (Teacher only)
     */
    public function teacherStudents(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $students = User::where('uRole', 'student')
                       ->whereNull('uDeleted_at')
                       ->orderBy('uCreated_at', 'desc')
                       ->get();

        return response()->json([
            'status' => 'success',
            'data' => $students
        ]);
    }

    /**
     * GET /api/teacher/student/{id}
     * Lấy chi tiết học viên
     */
    /**
     * @OA\Get(
     *     path="/teacher/student/{id}",
     *     tags={"Student Management"},
     *     summary="Get student details",
     *     description="Get detailed information about a specific student",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer"),
     *         example=2
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Student details retrieved successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Student not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function getStudentById(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $student = User::where('uId', $id)
                      ->where('uRole', 'student')
                      ->whereNull('uDeleted_at')
                      ->first();

        if (!$student) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy học viên.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $student
        ]);
    }

    /**
     * POST /api/teacher/student
     * Tạo học viên mới (đơn lẻ hoặc hàng loạt)
     */
    /**
     * @OA\Post(
     *     path="/teacher/student",
     *     tags={"Student Management"},
     *     summary="Create new student(s)",
     *     description="Create one or multiple students (teacher only)",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             oneOf={
     *                 @OA\Schema(
     *                     type="object",
     *                     required={"studentPhone", "studentPassword"},
     *                     @OA\Property(property="studentPhone", type="string", example="0912345678"),
     *                     @OA\Property(property="studentPassword", type="string", example="password123"),
     *                     @OA\Property(property="studentName", type="string", example="Nguyen Van B"),
     *                     @OA\Property(property="studentDoB", type="string", format="date", example="2000-01-01"),
     *                     @OA\Property(property="uClass", type="integer", example=1)
     *                 ),
     *                 @OA\Schema(
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         required={"studentPhone", "studentPassword"},
     *                         @OA\Property(property="studentPhone", type="string"),
     *                         @OA\Property(property="studentPassword", type="string"),
     *                         @OA\Property(property="studentName", type="string"),
     *                         @OA\Property(property="studentDoB", type="string", format="date"),
     *                         @OA\Property(property="uClass", type="integer")
     *                     )
     *                 )
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Students created successfully"
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
     */
    public function storeStudent(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $input = $request->all();

        if (empty($input)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không được để trống'
            ], 400);
        }

        // Chuẩn hóa dữ liệu: array of objects hoặc single object
        $students = isset($input[0]) ? $input : [$input];

        $results = [
            'success_count' => 0,
            'errors' => []
        ];

        foreach ($students as $index => $data) {
            // Validation cho từng student
            $validator = Validator::make($data, [
                'studentPhone' => 'required|string|unique:users,uPhone',
                'studentPassword' => 'required|string|min:6',
                'studentName' => 'nullable|string|max:150',
                'studentDoB' => 'nullable|date',
                'uClass' => 'nullable|integer',
            ]);

            if ($validator->fails()) {
                $results['errors'][] = [
                    'index' => $index,
                    'phone' => $data['studentPhone'] ?? 'N/A',
                    'error' => $validator->errors()->first()
                ];
                continue;
            }

            try {
                $student = User::create([
                    'uPhone' => trim($data['studentPhone']),
                    'uPassword' => Hash::make($data['studentPassword']),
                    'uName' => $data['studentName'] ?? null,
                    'uDoB' => $data['studentDoB'] ?? null,
                    'uClass' => $data['uClass'] ?? null,
                    'uRole' => 'student',
                    'uStatus' => 'active',
                ]);

                if ($student) {
                    $results['success_count']++;
                }
            } catch (\Exception $e) {
                $results['errors'][] = [
                    'index' => $index,
                    'phone' => $data['studentPhone'],
                    'error' => $e->getMessage()
                ];
            }
        }

        if ($results['success_count'] > 0) {
            return response()->json([
                'status' => 'success',
                'data' => $results,
                'message' => 'Đã xử lý xong danh sách học viên.'
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể tạo học viên nào.',
                'data' => $results['errors']
            ], 400);
        }
    }

    /**
     * PUT /api/teacher/student/{id}
     * Cập nhật thông tin học viên
     */
    /**
     * @OA\Put(
     *     path="/teacher/student/{id}",
     *     tags={"Student Management"},
     *     summary="Update student",
     *     description="Update student information",
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
     *             @OA\Property(property="studentName", type="string", example="Nguyen Van C"),
     *             @OA\Property(property="studentPhone", type="string", example="0987654321"),
     *             @OA\Property(property="studentDoB", type="string", format="date", example="2000-01-01"),
     *             @OA\Property(property="studentAddress", type="string", example="Can Tho City"),
     *             @OA\Property(property="studentGender", type="boolean", example=true),
     *             @OA\Property(property="classId", type="integer", example=1),
     *             @OA\Property(property="studentStatus", type="string", enum={"active", "inactive"}, example="active")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Student updated successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Student not found"
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
                'message' => 'Bạn không có quyền thực hiện hành động này.'
            ], 401);
        }

        $student = User::where('uId', $id)
                      ->where('uRole', 'student')
                      ->whereNull('uDeleted_at')
                      ->first();

        if (!$student) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy học viên.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'studentName' => 'sometimes|required|string|max:150',
            'studentPhone' => 'sometimes|required|string|unique:users,uPhone,' . $id . ',uId',
            'studentDoB' => 'sometimes|nullable|date',
            'studentAddress' => 'sometimes|nullable|string',
            'studentGender' => 'sometimes|nullable|boolean',
            'classId' => 'sometimes|nullable|integer',
            'studentStatus' => 'sometimes|required|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $updateData = [];
        if ($request->has('studentName')) $updateData['uName'] = $request->studentName;
        if ($request->has('studentPhone')) $updateData['uPhone'] = $request->studentPhone;
        if ($request->has('studentDoB')) $updateData['uDoB'] = $request->studentDoB;
        if ($request->has('studentAddress')) $updateData['uAddress'] = $request->studentAddress;
        if ($request->has('studentGender')) $updateData['uGender'] = $request->studentGender;
        if ($request->has('classId')) $updateData['uClass'] = $request->classId;
        if ($request->has('studentStatus')) $updateData['uStatus'] = $request->studentStatus;

        $student->update($updateData);

        return response()->json([
            'status' => 'success',
            'data' => [
                'UPDATE_STUDENT_SUCCESS',
                'Cập nhật thông tin học viên thành công',
                null,
                200
            ]
        ]);
    }

    /**
     * DELETE /api/teacher/student/{id}
     * Xóa học viên (soft delete)
     */
    /**
     * @OA\Delete(
     *     path="/teacher/student/{id}",
     *     tags={"Student Management"},
     *     summary="Delete student",
     *     description="Delete a student (soft delete)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Student deleted successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Student not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function destroyStudent(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền thực hiện hành động này.'
            ], 401);
        }

        $student = User::where('uId', $id)
                      ->where('uRole', 'student')
                      ->whereNull('uDeleted_at')
                      ->first();

        if (!$student) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy học viên hoặc học viên đã bị xóa.'
            ], 404);
        }

        $student->delete(); // This will set uDeleted_at due to SoftDeletes trait

        return response()->json([
            'status' => 'success',
            'data' => [
                'DELETE_STUDENT_SUCCESS',
                'Xóa học viên thành công',
                null,
                200
            ]
        ]);
    }
}
