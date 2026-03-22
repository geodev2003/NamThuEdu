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
     * GET /api/teacher/students
     * Lấy danh sách học viên (Teacher only) với tìm kiếm và lọc
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

        $query = User::where('uRole', 'student')
                    ->whereNull('uDeleted_at');

        // Search by name or phone
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('uName', 'LIKE', "%{$search}%")
                  ->orWhere('uPhone', 'LIKE', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status') && !empty($request->status)) {
            $query->where('uStatus', $request->status);
        }

        // Filter by class
        if ($request->has('class') && !empty($request->class)) {
            $query->where('uClass', $request->class);
        }

        // Filter by gender
        if ($request->has('gender') && $request->gender !== '') {
            $query->where('uGender', $request->gender);
        }

        // Sort options
        $sortBy = $request->get('sort_by', 'uCreated_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        $allowedSorts = ['uCreated_at', 'uName', 'uPhone', 'uStatus'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination
        $perPage = $request->get('per_page', 20);
        $perPage = min($perPage, 100); // Max 100 per page

        if ($request->has('paginate') && $request->paginate === 'false') {
            $students = $query->get();
            $result = [
                'data' => $students,
                'total' => $students->count()
            ];
        } else {
            $result = $query->paginate($perPage);
        }

        return response()->json([
            'status' => 'success',
            'data' => $result
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

    /**
     * GET /api/teacher/students/statistics
     * Thống kê tổng quan về học sinh
     */
    /**
     * @OA\Get(
     *     path="/teacher/students/statistics",
     *     tags={"Student Management"},
     *     summary="Get student statistics",
     *     description="Get comprehensive statistics about students",
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
    public function studentStatistics(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        // Total students
        $totalStudents = User::where('uRole', 'student')
                            ->whereNull('uDeleted_at')
                            ->count();

        // Active vs Inactive
        $activeStudents = User::where('uRole', 'student')
                             ->where('uStatus', 'active')
                             ->whereNull('uDeleted_at')
                             ->count();

        $inactiveStudents = $totalStudents - $activeStudents;

        // Gender distribution
        $maleStudents = User::where('uRole', 'student')
                           ->where('uGender', 1)
                           ->whereNull('uDeleted_at')
                           ->count();

        $femaleStudents = User::where('uRole', 'student')
                             ->where('uGender', 0)
                             ->whereNull('uDeleted_at')
                             ->count();

        // Students by class
        $studentsByClass = User::where('uRole', 'student')
                              ->whereNull('uDeleted_at')
                              ->selectRaw('uClass, COUNT(*) as count')
                              ->groupBy('uClass')
                              ->pluck('count', 'uClass');

        // Recent registrations (last 30 days)
        $recentRegistrations = User::where('uRole', 'student')
                                  ->whereNull('uDeleted_at')
                                  ->where('uCreated_at', '>=', now()->subDays(30))
                                  ->count();

        // Age distribution (if DoB available)
        $ageGroups = User::where('uRole', 'student')
                        ->whereNull('uDeleted_at')
                        ->whereNotNull('uDoB')
                        ->selectRaw('
                            CASE 
                                WHEN TIMESTAMPDIFF(YEAR, uDoB, CURDATE()) < 18 THEN "under_18"
                                WHEN TIMESTAMPDIFF(YEAR, uDoB, CURDATE()) BETWEEN 18 AND 25 THEN "18_25"
                                WHEN TIMESTAMPDIFF(YEAR, uDoB, CURDATE()) BETWEEN 26 AND 35 THEN "26_35"
                                ELSE "over_35"
                            END as age_group,
                            COUNT(*) as count
                        ')
                        ->groupBy('age_group')
                        ->pluck('count', 'age_group');

        $statistics = [
            'overview' => [
                'total_students' => $totalStudents,
                'active_students' => $activeStudents,
                'inactive_students' => $inactiveStudents,
                'recent_registrations' => $recentRegistrations,
            ],
            'demographics' => [
                'gender' => [
                    'male' => $maleStudents,
                    'female' => $femaleStudents,
                    'unspecified' => $totalStudents - $maleStudents - $femaleStudents,
                ],
                'age_groups' => $ageGroups,
            ],
            'distribution' => [
                'by_class' => $studentsByClass,
                'by_status' => [
                    'active' => $activeStudents,
                    'inactive' => $inactiveStudents,
                ],
            ],
            'growth' => [
                'last_30_days' => $recentRegistrations,
                'growth_rate' => $totalStudents > 0 ? round(($recentRegistrations / $totalStudents) * 100, 2) : 0,
            ],
        ];

        return response()->json([
            'status' => 'success',
            'data' => $statistics
        ]);
    }

    /**
     * GET /api/teacher/students/export
     * Export danh sách học sinh
     */
    /**
     * @OA\Get(
     *     path="/teacher/students/export",
     *     tags={"Student Management"},
     *     summary="Export students list",
     *     description="Export students list in CSV format",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="format",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="string", enum={"csv", "json"}, default="csv")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Export file generated successfully"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function exportStudents(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $format = $request->get('format', 'csv');
        
        $students = User::where('uRole', 'student')
                       ->whereNull('uDeleted_at')
                       ->orderBy('uCreated_at', 'desc')
                       ->get();

        if ($format === 'json') {
            return response()->json([
                'status' => 'success',
                'data' => $students,
                'exported_at' => now()->toISOString(),
                'total_records' => $students->count(),
            ]);
        }

        // CSV Export
        $filename = 'students_export_' . date('Y-m-d_H-i-s') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function() use ($students) {
            $file = fopen('php://output', 'w');
            
            // CSV Headers
            fputcsv($file, [
                'ID',
                'Tên',
                'Số điện thoại',
                'Ngày sinh',
                'Giới tính',
                'Địa chỉ',
                'Lớp',
                'Trạng thái',
                'Ngày tạo'
            ]);

            // CSV Data
            foreach ($students as $student) {
                fputcsv($file, [
                    $student->uId,
                    $student->uName,
                    $student->uPhone,
                    $student->uDoB ? $student->uDoB->format('Y-m-d') : '',
                    $student->uGender ? 'Nam' : 'Nữ',
                    $student->uAddress,
                    $student->uClass,
                    $student->uStatus === 'active' ? 'Hoạt động' : 'Không hoạt động',
                    $student->uCreated_at ? $student->uCreated_at->format('Y-m-d H:i:s') : ''
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /* ========================================
     * ADMIN METHODS - User Management System
     * ======================================== */

    /**
     * @OA\Get(
     *     path="/admin/users",
     *     tags={"Admin - User Management"},
     *     summary="Get all users (Admin only)",
     *     description="Get list of all users with advanced filtering and search",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="role",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="string", enum={"student", "teacher", "admin"})
     *     ),
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="string", enum={"active", "inactive"})
     *     ),
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(response=200, description="Users retrieved successfully"),
     *     @OA\Response(response=403, description="Admin access required")
     * )
     * 
     * GET /api/admin/users
     * Xem tất cả tài khoản (giáo viên, học sinh)
     */
    public function adminUsers(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        $query = User::query();

        // Include soft deleted users if requested
        if ($request->get('include_deleted') === 'true') {
            $query->withTrashed();
        } else {
            $query->whereNull('uDeleted_at');
        }

        // Filter by role
        if ($request->has('role') && !empty($request->role)) {
            $query->where('uRole', $request->role);
        }

        // Filter by status
        if ($request->has('status') && !empty($request->status)) {
            $query->where('uStatus', $request->status);
        }

        // Search by name, phone, or address
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('uName', 'LIKE', "%{$search}%")
                  ->orWhere('uPhone', 'LIKE', "%{$search}%")
                  ->orWhere('uAddress', 'LIKE', "%{$search}%");
            });
        }

        // Date range filter
        if ($request->has('created_from')) {
            $query->where('uCreated_at', '>=', $request->created_from);
        }
        if ($request->has('created_to')) {
            $query->where('uCreated_at', '<=', $request->created_to);
        }

        // Sort options
        $sortBy = $request->get('sort_by', 'uCreated_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        $allowedSorts = ['uCreated_at', 'uName', 'uPhone', 'uRole', 'uStatus'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination
        $perPage = $request->get('per_page', 20);
        $perPage = min($perPage, 100);

        if ($request->get('paginate') === 'false') {
            $users = $query->get();
            $result = [
                'data' => $users,
                'total' => $users->count()
            ];
        } else {
            $result = $query->paginate($perPage);
        }

        return response()->json([
            'status' => 'success',
            'data' => $result
        ]);
    }

    /**
     * @OA\Get(
     *     path="/admin/users/{id}",
     *     tags={"Admin - User Management"},
     *     summary="Get user details (Admin only)",
     *     description="Get detailed information about a specific user",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="User details retrieved successfully"),
     *     @OA\Response(response=404, description="User not found")
     * )
     * 
     * GET /api/admin/users/{id}
     * Xem chi tiết tài khoản
     */
    public function adminUserDetail(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        $targetUser = User::withTrashed()->find($id);

        if (!$targetUser) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy người dùng.'
            ], 404);
        }

        // Add additional info for admin
        $userDetail = $targetUser->toArray();
        $userDetail['is_deleted'] = $targetUser->trashed();
        $userDetail['account_age_days'] = $targetUser->uCreated_at ? 
            $targetUser->uCreated_at->diffInDays(now()) : null;

        return response()->json([
            'status' => 'success',
            'data' => $userDetail
        ]);
    }

    /**
     * @OA\Post(
     *     path="/admin/users",
     *     tags={"Admin - User Management"},
     *     summary="Create new user (Admin only)",
     *     description="Create a new user with any role",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"phone", "password", "role"},
     *             @OA\Property(property="phone", type="string", example="0987654321"),
     *             @OA\Property(property="password", type="string", example="password123"),
     *             @OA\Property(property="name", type="string", example="Nguyen Van Admin"),
     *             @OA\Property(property="role", type="string", enum={"student", "teacher", "admin"}, example="teacher"),
     *             @OA\Property(property="status", type="string", enum={"active", "inactive"}, example="active")
     *         )
     *     ),
     *     @OA\Response(response=201, description="User created successfully")
     * )
     * 
     * POST /api/admin/users
     * Tạo tài khoản mới
     */
    public function adminCreateUser(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền tạo tài khoản.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|unique:users,uPhone',
            'password' => 'required|string|min:6',
            'name' => 'required|string|max:150',
            'role' => 'required|in:student,teacher,admin',
            'status' => 'nullable|in:active,inactive',
            'dob' => 'nullable|date',
            'address' => 'nullable|string',
            'gender' => 'nullable|boolean',
            'class' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            $newUser = User::create([
                'uPhone' => trim($request->phone),
                'uPassword' => Hash::make($request->password),
                'uName' => $request->name,
                'uRole' => $request->role,
                'uStatus' => $request->status ?? 'active',
                'uDoB' => $request->dob,
                'uAddress' => $request->address ?? '',
                'uGender' => $request->gender ?? 0,
                'uClass' => $request->class ?? 0,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Tạo tài khoản thành công.',
                'data' => [
                    'id' => $newUser->uId,
                    'phone' => $newUser->uPhone,
                    'name' => $newUser->uName,
                    'role' => $newUser->uRole,
                    'status' => $newUser->uStatus,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tạo tài khoản: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/admin/users/{id}",
     *     tags={"Admin - User Management"},
     *     summary="Update user (Admin only)",
     *     description="Update user information including role and status",
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
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="phone", type="string"),
     *             @OA\Property(property="role", type="string", enum={"student", "teacher", "admin"}),
     *             @OA\Property(property="status", type="string", enum={"active", "inactive"})
     *         )
     *     ),
     *     @OA\Response(response=200, description="User updated successfully")
     * )
     * 
     * PUT /api/admin/users/{id}
     * Sửa tài khoản
     */
    public function adminUpdateUser(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền sửa tài khoản.'
            ], 403);
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy người dùng.'
            ], 404);
        }

        // Prevent admin from modifying their own role
        if ($targetUser->uId === $user->uId && $request->has('role')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể thay đổi quyền của chính mình.'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:150',
            'phone' => 'sometimes|required|string|unique:users,uPhone,' . $id . ',uId',
            'role' => 'sometimes|required|in:student,teacher,admin',
            'status' => 'sometimes|required|in:active,inactive',
            'dob' => 'sometimes|nullable|date',
            'address' => 'sometimes|nullable|string',
            'gender' => 'sometimes|nullable|boolean',
            'class' => 'sometimes|nullable|integer',
            'password' => 'sometimes|nullable|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $updateData = [];
        if ($request->has('name')) $updateData['uName'] = $request->name;
        if ($request->has('phone')) $updateData['uPhone'] = $request->phone;
        if ($request->has('role')) $updateData['uRole'] = $request->role;
        if ($request->has('status')) $updateData['uStatus'] = $request->status;
        if ($request->has('dob')) $updateData['uDoB'] = $request->dob;
        if ($request->has('address')) $updateData['uAddress'] = $request->address;
        if ($request->has('gender')) $updateData['uGender'] = $request->gender;
        if ($request->has('class')) $updateData['uClass'] = $request->class;
        if ($request->has('password') && !empty($request->password)) {
            $updateData['uPassword'] = Hash::make($request->password);
        }

        $targetUser->update($updateData);

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật tài khoản thành công.',
            'data' => $targetUser->fresh()
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/admin/users/{id}",
     *     tags={"Admin - User Management"},
     *     summary="Delete user (Admin only)",
     *     description="Delete a user account (soft delete)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="User deleted successfully")
     * )
     * 
     * DELETE /api/admin/users/{id}
     * Xóa tài khoản
     */
    public function adminDeleteUser(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền xóa tài khoản.'
            ], 403);
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy người dùng.'
            ], 404);
        }

        // Prevent self-deletion
        if ($targetUser->uId === $user->uId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể xóa tài khoản của chính mình.'
            ], 400);
        }

        $targetUser->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Xóa tài khoản thành công.'
        ]);
    }

    /**
     * @OA\Post(
     *     path="/admin/users/{id}/change-role",
     *     tags={"Admin - User Management"},
     *     summary="Change user role (Admin only)",
     *     description="Change user role with validation",
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
     *             required={"role"},
     *             @OA\Property(property="role", type="string", enum={"student", "teacher", "admin"}),
     *             @OA\Property(property="reason", type="string", example="Promotion to teacher")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Role changed successfully")
     * )
     * 
     * POST /api/admin/users/{id}/change-role
     * Phân quyền người dùng
     */
    public function changeUserRole(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền phân quyền.'
            ], 403);
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy người dùng.'
            ], 404);
        }

        // Prevent admin from changing their own role
        if ($targetUser->uId === $user->uId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể thay đổi quyền của chính mình.'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'role' => 'required|in:student,teacher,admin',
            'reason' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $oldRole = $targetUser->uRole;
        $newRole = $request->role;

        if ($oldRole === $newRole) {
            return response()->json([
                'status' => 'error',
                'message' => 'Người dùng đã có quyền này rồi.'
            ], 400);
        }

        $targetUser->update(['uRole' => $newRole]);

        return response()->json([
            'status' => 'success',
            'message' => "Đã thay đổi quyền từ {$oldRole} thành {$newRole}.",
            'data' => [
                'user_id' => $targetUser->uId,
                'user_name' => $targetUser->uName,
                'old_role' => $oldRole,
                'new_role' => $newRole,
                'reason' => $request->reason,
                'changed_by' => $user->uName,
                'changed_at' => now()->toISOString()
            ]
        ]);
    }

    /**
     * @OA\Post(
     *     path="/admin/users/{id}/lock",
     *     tags={"Admin - User Management"},
     *     summary="Lock user account (Admin only)",
     *     description="Lock/disable a user account",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="reason", type="string", example="Violation of terms")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Account locked successfully")
     * )
     * 
     * POST /api/admin/users/{id}/lock
     * Khóa tài khoản
     */
    public function lockUser(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền khóa tài khoản.'
            ], 403);
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy người dùng.'
            ], 404);
        }

        // Prevent self-locking
        if ($targetUser->uId === $user->uId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể khóa tài khoản của chính mình.'
            ], 400);
        }

        if ($targetUser->uStatus === 'inactive') {
            return response()->json([
                'status' => 'error',
                'message' => 'Tài khoản đã bị khóa rồi.'
            ], 400);
        }

        $targetUser->update(['uStatus' => 'inactive']);

        return response()->json([
            'status' => 'success',
            'message' => 'Đã khóa tài khoản thành công.',
            'data' => [
                'user_id' => $targetUser->uId,
                'user_name' => $targetUser->uName,
                'reason' => $request->reason,
                'locked_by' => $user->uName,
                'locked_at' => now()->toISOString()
            ]
        ]);
    }

    /**
     * @OA\Post(
     *     path="/admin/users/{id}/unlock",
     *     tags={"Admin - User Management"},
     *     summary="Unlock user account (Admin only)",
     *     description="Unlock/enable a user account",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Account unlocked successfully")
     * )
     * 
     * POST /api/admin/users/{id}/unlock
     * Mở khóa tài khoản
     */
    public function unlockUser(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền mở khóa tài khoản.'
            ], 403);
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy người dùng.'
            ], 404);
        }

        if ($targetUser->uStatus === 'active') {
            return response()->json([
                'status' => 'error',
                'message' => 'Tài khoản đang hoạt động bình thường.'
            ], 400);
        }

        $targetUser->update(['uStatus' => 'active']);

        return response()->json([
            'status' => 'success',
            'message' => 'Đã mở khóa tài khoản thành công.',
            'data' => [
                'user_id' => $targetUser->uId,
                'user_name' => $targetUser->uName,
                'unlocked_by' => $user->uName,
                'unlocked_at' => now()->toISOString()
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/admin/users/locked",
     *     tags={"Admin - User Management"},
     *     summary="Get locked users list (Admin only)",
     *     description="Get list of all locked/inactive user accounts",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Locked users retrieved successfully"),
     *     @OA\Response(response=403, description="Admin access required")
     * )
     * 
     * GET /api/admin/users/locked
     * Danh sách tài khoản bị khóa
     */
    public function lockedUsers(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        $lockedUsers = User::where('uStatus', 'inactive')
                          ->whereNull('uDeleted_at')
                          ->orderBy('uCreated_at', 'desc')
                          ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'locked_users' => $lockedUsers,
                'total_locked' => $lockedUsers->count()
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/admin/roles/statistics",
     *     tags={"Admin - User Management"},
     *     summary="Get role statistics (Admin only)",
     *     description="Get statistics about user roles distribution",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Role statistics retrieved successfully"),
     *     @OA\Response(response=403, description="Admin access required")
     * )
     * 
     * GET /api/admin/roles/statistics
     * Thống kê phân quyền
     */
    public function roleStatistics(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        $roleStats = User::whereNull('uDeleted_at')
                        ->selectRaw('uRole, uStatus, COUNT(*) as count')
                        ->groupBy('uRole', 'uStatus')
                        ->get()
                        ->groupBy('uRole');

        $statistics = [];
        foreach (['student', 'teacher', 'admin'] as $role) {
            $roleData = $roleStats->get($role, collect());
            $statistics[$role] = [
                'active' => $roleData->where('uStatus', 'active')->sum('count'),
                'inactive' => $roleData->where('uStatus', 'inactive')->sum('count'),
                'total' => $roleData->sum('count')
            ];
        }

        return response()->json([
            'status' => 'success',
            'data' => $statistics
        ]);
    }

    /**
     * @OA\Get(
     *     path="/admin/statistics/overview",
     *     tags={"Admin - User Management"},
     *     summary="Get system overview statistics (Admin only)",
     *     description="Get comprehensive system overview and health metrics",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="System overview retrieved successfully"),
     *     @OA\Response(response=403, description="Admin access required")
     * )
     * 
     * GET /api/admin/statistics/overview
     * Thống kê tổng quan hệ thống
     */
    public function systemOverview(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        // Total users
        $totalUsers = User::whereNull('uDeleted_at')->count();
        $activeUsers = User::where('uStatus', 'active')->whereNull('uDeleted_at')->count();
        $inactiveUsers = User::where('uStatus', 'inactive')->whereNull('uDeleted_at')->count();
        $deletedUsers = User::onlyTrashed()->count();

        // Users by role
        $usersByRole = User::whereNull('uDeleted_at')
                          ->selectRaw('uRole, COUNT(*) as count')
                          ->groupBy('uRole')
                          ->pluck('count', 'uRole');

        // Recent activity (last 30 days)
        $recentRegistrations = User::where('uCreated_at', '>=', now()->subDays(30))
                                  ->whereNull('uDeleted_at')
                                  ->count();

        // Growth metrics
        $lastMonthUsers = User::where('uCreated_at', '>=', now()->subDays(60))
                             ->where('uCreated_at', '<', now()->subDays(30))
                             ->whereNull('uDeleted_at')
                             ->count();

        $growthRate = $lastMonthUsers > 0 ? 
            round((($recentRegistrations - $lastMonthUsers) / $lastMonthUsers) * 100, 2) : 0;

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_users' => $totalUsers,
                'active_users' => $activeUsers,
                'inactive_users' => $inactiveUsers,
                'deleted_users' => $deletedUsers,
                'total_courses' => 0, // Will be implemented later
                'total_exams' => 0, // Will be implemented later
                'by_role' => $usersByRole,
                'activity' => [
                    'recent_registrations' => $recentRegistrations,
                    'growth_rate' => $growthRate,
                ],
                'health' => [
                    'active_rate' => $totalUsers > 0 ? round(($activeUsers / $totalUsers) * 100, 2) : 0,
                    'retention_rate' => $totalUsers > 0 ? round((($totalUsers - $deletedUsers) / ($totalUsers + $deletedUsers)) * 100, 2) : 0,
                ]
            ]
        ]);
    }
    /**
     * Get user activity data
     */
    public function userActivity(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        try {
            // Get user activity statistics
            $totalUsers = User::count();
            $activeUsers = User::where('uStatus', 'active')->count();
            $recentLogins = User::where('uLast_login', '>=', now()->subDays(7))->count();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'total_users' => $totalUsers,
                    'active_users' => $activeUsers,
                    'recent_logins' => $recentLogins,
                    'inactive_users' => $totalUsers - $activeUsers,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi lấy thống kê hoạt động người dùng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user activity report
     */
    public function userActivityReport(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        try {
            $period = $request->get('period', '30'); // days

            $report = [
                'period_days' => (int)$period,
                'total_users' => User::count(),
                'new_users' => User::where('uCreated_at', '>=', now()->subDays($period))->count(),
                'active_users' => User::where('uLast_login', '>=', now()->subDays($period))->count(),
                'by_role' => [
                    'students' => User::where('uRole', 'student')->count(),
                    'teachers' => User::where('uRole', 'teacher')->count(),
                    'admins' => User::where('uRole', 'admin')->count(),
                ]
            ];

            return response()->json([
                'status' => 'success',
                'data' => $report
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tạo báo cáo hoạt động.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}