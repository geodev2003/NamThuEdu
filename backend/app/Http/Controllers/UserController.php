<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Classes;
use App\Models\ClassEnrollment;
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

        $query = User::with('class')
                    ->where('uRole', 'student')
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
            $query->where('class_id', $request->class);
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
        $perPage = $request->get('per_page', 10);
        $perPage = min($perPage, 100); // Max 100 per page

        if ($request->has('paginate') && $request->paginate === 'false') {
            $students = $query->get()->map(function($student) {
                return [
                    'uId' => $student->uId,
                    'uName' => $student->uName,
                    'uPhone' => $student->uPhone,
                    'uEmail' => $student->uEmail,
                    'uStatus' => $student->uStatus,
                    'uCreated_at' => $student->uCreated_at,
                    'avatar_url' => $student->avatar_url,
                    'age_group' => $student->age_group,
                    'class_name' => $student->class ? $student->class->cName : null,
                    'class_id' => $student->class_id,
                ];
            });
            $result = [
                'data' => $students,
                'total' => $students->count()
            ];
        } else {
            $paginated = $query->paginate($perPage);
            $paginated->getCollection()->transform(function($student) {
                return [
                    'uId' => $student->uId,
                    'uName' => $student->uName,
                    'uPhone' => $student->uPhone,
                    'uEmail' => $student->uEmail,
                    'uStatus' => $student->uStatus,
                    'uCreated_at' => $student->uCreated_at,
                    'avatar_url' => $student->avatar_url,
                    'age_group' => $student->age_group,
                    'class_name' => $student->class ? $student->class->cName : null,
                    'class_id' => $student->class_id,
                ];
            });
            $result = $paginated;
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

        // Check if this is a single student or batch creation
        $isBatch = $request->has('0') || is_array($request->input('studentPhone'));
        
        if ($isBatch) {
            // Batch creation (array of students)
            return $this->batchCreateStudents($request, $user);
        } else {
            // Single student creation
            return $this->createSingleStudent($request, $user);
        }
    }

    private function createSingleStudent(Request $request, $user)
    {
        // Validation for single student
        $validator = Validator::make($request->all(), [
            'studentPhone' => 'required|string|unique:users,uPhone|regex:/^0[0-9]{9,10}$/',
            'studentPassword' => 'required|string|min:6',
            'studentName' => 'required|string|max:150',
            'studentEmail' => 'nullable|email|max:255',
            'studentDoB' => 'nullable|date|before:today',
            'age_group' => 'required|in:kids,teens,adults',
            'avatar' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp,bmp,svg|max:20480',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 400);
        }

        try {
            $ageGroup = $request->age_group;
            
            // Auto-calculate age_group from DoB if provided
            if ($request->studentDoB) {
                $age = \Carbon\Carbon::parse($request->studentDoB)->age;
                if ($age >= 6 && $age <= 12) {
                    $ageGroup = 'kids';
                } elseif ($age >= 13 && $age <= 17) {
                    $ageGroup = 'teens';
                } elseif ($age >= 18) {
                    $ageGroup = 'adults';
                }
            }

            // Find or create class for this teacher with matching age_group
            $class = \App\Models\Classes::where('cTeacher_id', $user->uId)
                ->where('age_group', $ageGroup)
                ->first();

            if (!$class) {
                // Create default class for this age group
                $ageGroupLabels = [
                    'kids' => 'Lớp Tiểu học',
                    'teens' => 'Lớp THCS-THPT',
                    'adults' => 'Lớp Người lớn'
                ];
                
                $class = \App\Models\Classes::create([
                    'cName' => $ageGroupLabels[$ageGroup] . ' - ' . $user->uName,
                    'cTeacher_id' => $user->uId,
                    'age_group' => $ageGroup,
                    'cStatus' => 'active',
                    'cDescription' => 'Lớp tự động tạo cho ' . $ageGroupLabels[$ageGroup],
                ]);
            }

            // Handle avatar upload
            $avatarPath = null;
            if ($request->hasFile('avatar')) {
                $avatar = $request->file('avatar');
                $avatarName = time() . '_' . uniqid() . '.' . $avatar->getClientOriginalExtension();
                $avatar->move(public_path('uploads/avatars'), $avatarName);
                $avatarPath = 'uploads/avatars/' . $avatarName;
            }

            $student = User::create([
                'uPhone' => trim($request->studentPhone),
                'uPassword' => Hash::make($request->studentPassword),
                'plain_password' => encrypt($request->studentPassword), // Store encrypted plain password
                'uName' => $request->studentName,
                'uEmail' => $request->studentEmail ?? null,
                'uDoB' => $request->studentDoB ?? null,
                'avatar_url' => $avatarPath,
                'class_id' => $class->cId,
                'age_group' => $ageGroup,
                'theme_preference' => 'auto',
                'language_preference' => 'vi',
                'uRole' => 'student',
                'uStatus' => 'active',
            ]);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'success_count' => 1,
                    'created_students' => [[
                        'id' => $student->uId,
                        'name' => $student->uName,
                        'phone' => $student->uPhone,
                        'age_group' => $student->age_group,
                        'class_name' => $class->cName,
                        'class_id' => $class->cId,
                        'avatar_url' => $student->avatar_url,
                    ]],
                    'password' => $request->studentPassword, // Return plain password for teacher to copy
                ],
                'message' => 'Tạo học viên thành công!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * GET /api/teacher/student/check-phone?phone=xxx
     * Kiểm tra số điện thoại đã tồn tại chưa (real-time unique check)
     */
    public function checkPhoneUnique(Request $request)
    {
        $phone = trim($request->input('phone', ''));

        if (!$phone) {
            return response()->json(['status' => 'error', 'message' => 'Phone required'], 400);
        }

        $exists = \App\Models\User::where('uPhone', $phone)
            ->whereNull('uDeleted_at')
            ->exists();

        return response()->json([
            'status'    => 'success',
            'available' => !$exists,
        ]);
    }

    private function batchCreateStudents(Request $request, $user)
    {
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
            'errors' => [],
            'created_students' => []
        ];

        foreach ($students as $index => $data) {
            // Validation cho từng student
            $validator = Validator::make($data, [
                'studentPhone' => 'required|string|unique:users,uPhone|regex:/^0[0-9]{9,10}$/',
                'studentPassword' => 'required|string|min:6',
                'studentName' => 'required|string|max:150',
                'studentDoB' => 'nullable|date|before:today',
                'age_group' => 'required|in:kids,teens,adults',
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
                $ageGroup = $data['age_group'];
                
                // Auto-calculate age_group from DoB if provided
                if (isset($data['studentDoB'])) {
                    $age = \Carbon\Carbon::parse($data['studentDoB'])->age;
                    if ($age >= 6 && $age <= 12) {
                        $ageGroup = 'kids';
                    } elseif ($age >= 13 && $age <= 17) {
                        $ageGroup = 'teens';
                    } elseif ($age >= 18) {
                        $ageGroup = 'adults';
                    }
                }

                // Find or create class for this teacher with matching age_group
                $class = \App\Models\Classes::where('cTeacher_id', $user->uId)
                    ->where('age_group', $ageGroup)
                    ->first();

                if (!$class) {
                    // Create default class for this age group
                    $ageGroupLabels = [
                        'kids' => 'Lớp Tiểu học',
                        'teens' => 'Lớp THCS-THPT',
                        'adults' => 'Lớp Người lớn'
                    ];
                    
                    $class = \App\Models\Classes::create([
                        'cName' => $ageGroupLabels[$ageGroup] . ' - ' . $user->uName,
                        'cTeacher_id' => $user->uId,
                        'age_group' => $ageGroup,
                        'cStatus' => 'active',
                        'cDescription' => 'Lớp tự động tạo cho ' . $ageGroupLabels[$ageGroup],
                    ]);
                }

                $student = User::create([
                    'uPhone' => trim($data['studentPhone']),
                    'uPassword' => Hash::make($data['studentPassword']),
                    'plain_password' => encrypt($data['studentPassword']), // Store encrypted plain password
                    'uName' => $data['studentName'],
                    'uDoB' => $data['studentDoB'] ?? null,
                    'class_id' => $class->cId,
                    'age_group' => $ageGroup,
                    'theme_preference' => 'auto',
                    'language_preference' => 'vi',
                    'uRole' => 'student',
                    'uStatus' => 'active',
                ]);

                if ($student) {
                    $results['success_count']++;
                    $results['created_students'][] = [
                        'id' => $student->uId,
                        'name' => $student->uName,
                        'phone' => $student->uPhone,
                        'age_group' => $student->age_group,
                        'class_name' => $class->cName,
                        'class_id' => $class->cId,
                    ];
                }
            } catch (\Exception $e) {
                $results['errors'][] = [
                    'index' => $index,
                    'phone' => $data['studentPhone'] ?? 'N/A',
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
            'uName' => 'sometimes|required|string|max:150',
            'uPhone' => 'sometimes|required|string|unique:users,uPhone,' . $id . ',uId',
            'uEmail' => 'sometimes|nullable|email|max:255',
            'uDoB' => 'sometimes|nullable|date',
            'uAddress' => 'sometimes|nullable|string',
            'uGender' => 'sometimes|nullable|boolean',
            'age_group' => 'sometimes|nullable|in:kids,teens,adults',
            'class_id' => 'sometimes|nullable|integer',
            'uStatus' => 'sometimes|required|in:active,inactive',
            'avatar' => 'sometimes|nullable|image|mimes:jpeg,jpg,png,gif,webp,bmp,svg|max:20480',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $updateData = [];
        if ($request->has('uName')) $updateData['uName'] = $request->uName;
        if ($request->has('uPhone')) $updateData['uPhone'] = $request->uPhone;
        if ($request->has('uEmail')) $updateData['uEmail'] = $request->uEmail;
        if ($request->has('uDoB')) $updateData['uDoB'] = $request->uDoB;
        if ($request->has('uAddress')) $updateData['uAddress'] = $request->uAddress;
        if ($request->has('uGender')) $updateData['uGender'] = $request->uGender;
        if ($request->has('age_group')) $updateData['age_group'] = $request->age_group;
        if ($request->has('class_id')) $updateData['class_id'] = $request->class_id;
        if ($request->has('uStatus')) $updateData['uStatus'] = $request->uStatus;

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $avatarName = time() . '_' . uniqid() . '.' . $avatar->getClientOriginalExtension();
            $avatar->move(public_path('uploads/avatars'), $avatarName);
            $updateData['avatar_url'] = 'uploads/avatars/' . $avatarName;
        }

        $student->update($updateData);

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật thông tin học viên thành công',
            'data' => [
                'id' => $student->uId,
                'name' => $student->uName,
                'phone' => $student->uPhone,
                'email' => $student->uEmail,
                'dateOfBirth' => $student->uDoB,
                'ageGroup' => $student->age_group,
                'status' => $student->uStatus,
                'avatarUrl' => $student->avatar_url,
            ]
        ]);
    }

    /**
     * DELETE /api/teacher/student/{id}
     * Xóa học viên (soft delete) - sẽ tự động xóa vĩnh viễn sau 24h
     */
    /**
     * @OA\Delete(
     *     path="/teacher/student/{id}",
     *     tags={"Student Management"},
     *     summary="Delete student",
     *     description="Delete a student (soft delete) - will be permanently deleted after 24 hours",
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
            'message' => 'Đã xóa học viên. Có thể khôi phục trong vòng 24 giờ.',
            'data' => [
                'deleted_at' => $student->uDeleted_at,
                'can_restore_until' => now()->addHours(24)->toIso8601String(),
            ]
        ]);
    }

    /**
     * POST /api/teacher/student/{id}/restore
     * Khôi phục học viên đã xóa (trong vòng 24h)
     */
    /**
     * @OA\Post(
     *     path="/teacher/student/{id}/restore",
     *     tags={"Student Management"},
     *     summary="Restore deleted student",
     *     description="Restore a soft-deleted student (within 24 hours)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Student restored successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Student not found or already restored"
     *     ),
     *     @OA\Response(
     *         response=410,
     *         description="Student was deleted more than 24 hours ago"
     *     )
     * )
     */
    public function restoreStudent(Request $request, $id)
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
                      ->onlyTrashed()
                      ->first();

        if (!$student) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy học viên đã xóa.'
            ], 404);
        }

        // Check if deleted more than 24 hours ago
        $deletedAt = \Carbon\Carbon::parse($student->uDeleted_at);
        $hoursSinceDeleted = $deletedAt->diffInHours(now());

        if ($hoursSinceDeleted > 24) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể khôi phục. Học viên đã bị xóa quá 24 giờ.',
                'deleted_hours_ago' => $hoursSinceDeleted
            ], 410);
        }

        $student->restore();

        return response()->json([
            'status' => 'success',
            'message' => 'Đã khôi phục học viên thành công.',
            'data' => $student
        ]);
    }

    /**
     * GET /api/teacher/students/deleted
     * Lấy danh sách học viên đã xóa (trong vòng 24h)
     */
    /**
     * @OA\Get(
     *     path="/teacher/students/deleted",
     *     tags={"Student Management"},
     *     summary="Get deleted students",
     *     description="Get list of soft-deleted students (within 24 hours)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Deleted students retrieved successfully"
     *     )
     * )
     */
    public function getDeletedStudents(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        // Get students deleted within last 24 hours
        $students = User::where('uRole', 'student')
                       ->onlyTrashed()
                       ->where('uDeleted_at', '>=', now()->subHours(24))
                       ->orderBy('uDeleted_at', 'desc')
                       ->get()
                       ->map(function($student) {
                           $deletedAt = \Carbon\Carbon::parse($student->uDeleted_at);
                           $hoursRemaining = 24 - $deletedAt->diffInHours(now());
                           
                           return [
                               'uId' => $student->uId,
                               'uName' => $student->uName,
                               'uPhone' => $student->uPhone,
                               'uEmail' => $student->uEmail,
                               'class_id' => $student->class_id,
                               'uDeleted_at' => $student->uDeleted_at,
                               'deleted_hours_ago' => $deletedAt->diffInHours(now()),
                               'hours_remaining' => max(0, $hoursRemaining),
                               'can_restore' => $hoursRemaining > 0,
                               'will_be_deleted_at' => $deletedAt->addHours(24)->toIso8601String(),
                           ];
                       });

        return response()->json([
            'status' => 'success',
            'data' => $students,
            'total' => $students->count()
        ]);
    }

    /**
     * DELETE /api/teacher/student/{id}/permanent
     * Xóa vĩnh viễn học viên ngay lập tức
     */
    /**
     * @OA\Delete(
     *     path="/teacher/student/{id}/permanent",
     *     tags={"Student Management"},
     *     summary="Permanently delete student",
     *     description="Permanently delete a student immediately (cannot be restored)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Student permanently deleted"
     *     )
     * )
     */
    public function permanentDeleteStudent(Request $request, $id)
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
                      ->onlyTrashed()
                      ->first();

        if (!$student) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy học viên đã xóa.'
            ], 404);
        }

        $student->forceDelete(); // Permanent delete

        return response()->json([
            'status' => 'success',
            'message' => 'Đã xóa vĩnh viễn học viên.'
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
                              ->selectRaw('class_id, COUNT(*) as count')
                              ->groupBy('class_id')
                              ->pluck('count', 'class_id');

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
                            END as age_group
                        ')
                        ->get()
                        ->groupBy('age_group')
                        ->map(function($group) {
                            return $group->count();
                        });

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
                    $student->class_id,
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
                'active_sessions' => 0, // Placeholder for realtime sessions
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
            $dailyActiveUsers = User::where('uLast_login', '>=', now()->subDay())->count();
            $weeklyActiveUsers = User::where('uLast_login', '>=', now()->subDays(7))->count();
            $monthlyActiveUsers = User::where('uLast_login', '>=', now()->subDays(30))->count();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'daily_active_users' => $dailyActiveUsers,
                    'weekly_active_users' => $weeklyActiveUsers,
                    'monthly_active_users' => $monthlyActiveUsers,
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
                'data' => [
                    'report_data' => $report,
                    'generated_at' => now()->toISOString(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tạo báo cáo hoạt động.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/admin/users/bulk-action
     * Thực hiện thao tác hàng loạt trên user
     */
    public function bulkUserAction(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền thực hiện thao tác này.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'action' => 'required|in:lock,unlock,activate,deactivate,delete,restore,change_role',
            'user_ids' => 'required|array|min:1|max:500',
            'user_ids.*' => 'required|integer',
            'role' => 'required_if:action,change_role|in:student,teacher,admin',
            'reason' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $action = $request->action;
        $targetIds = collect($request->user_ids)->unique()->values()->all();
        $canIncludeDeleted = in_array($action, ['restore'], true);
        $targetUsers = ($canIncludeDeleted ? User::withTrashed() : User::query())
            ->whereIn('uId', $targetIds)
            ->get()
            ->keyBy('uId');

        $changed = 0;
        $skipped = [];

        foreach ($targetIds as $targetId) {
            /** @var \App\Models\User|null $targetUser */
            $targetUser = $targetUsers->get($targetId);

            if (!$targetUser) {
                $skipped[] = [
                    'user_id' => $targetId,
                    'reason' => 'Không tìm thấy người dùng.',
                ];
                continue;
            }

            if ($targetUser->uId === $user->uId && in_array($action, ['delete', 'deactivate', 'lock', 'change_role'], true)) {
                $skipped[] = [
                    'user_id' => $targetUser->uId,
                    'reason' => 'Không thể thao tác trên tài khoản của chính mình.',
                ];
                continue;
            }

            if ($action === 'change_role' && $request->role === $targetUser->uRole) {
                $skipped[] = [
                    'user_id' => $targetUser->uId,
                    'reason' => 'Người dùng đã có quyền này.',
                ];
                continue;
            }

            if ($action === 'lock' || $action === 'deactivate') {
                if ($targetUser->uStatus === 'inactive') {
                    $skipped[] = [
                        'user_id' => $targetUser->uId,
                        'reason' => 'Tài khoản đã ở trạng thái inactive.',
                    ];
                    continue;
                }
                $targetUser->update(['uStatus' => 'inactive']);
                $changed++;
                continue;
            }

            if ($action === 'unlock' || $action === 'activate') {
                if ($targetUser->uStatus === 'active') {
                    $skipped[] = [
                        'user_id' => $targetUser->uId,
                        'reason' => 'Tài khoản đã ở trạng thái active.',
                    ];
                    continue;
                }
                $targetUser->update(['uStatus' => 'active']);
                $changed++;
                continue;
            }

            if ($action === 'delete') {
                if ($targetUser->trashed()) {
                    $skipped[] = [
                        'user_id' => $targetUser->uId,
                        'reason' => 'Tài khoản đã bị xóa mềm trước đó.',
                    ];
                    continue;
                }
                $targetUser->delete();
                $changed++;
                continue;
            }

            if ($action === 'restore') {
                if (!$targetUser->trashed()) {
                    $skipped[] = [
                        'user_id' => $targetUser->uId,
                        'reason' => 'Tài khoản chưa bị xóa mềm.',
                    ];
                    continue;
                }
                $targetUser->restore();
                $changed++;
                continue;
            }

            if ($action === 'change_role') {
                $targetUser->update(['uRole' => $request->role]);
                $changed++;
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Đã xử lý thao tác hàng loạt.',
            'data' => [
                'action' => $action,
                'requested_count' => count($targetIds),
                'updated_count' => $changed,
                'skipped_count' => count($skipped),
                'skipped' => $skipped,
                'changed_by' => $user->uId,
                'changed_at' => now()->toISOString(),
            ]
        ]);
    }

    /**
     * POST /api/admin/users/bulk-import
     * Import tài khoản hàng loạt
     */
    public function bulkImportUsers(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền import tài khoản.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'users' => 'required|array|min:1|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu import không hợp lệ.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $createdCount = 0;
        $errors = [];

        foreach ($request->users as $index => $userData) {
            $rowValidator = Validator::make($userData, [
                'phone' => 'required|string',
                'password' => 'required|string|min:6',
                'name' => 'required|string|max:150',
                'role' => 'nullable|in:student,teacher,admin',
                'status' => 'nullable|in:active,inactive',
                'dob' => 'nullable|date',
                'address' => 'nullable|string',
                'gender' => 'nullable|boolean',
                'class' => 'nullable|integer',
                'age_group' => 'nullable|in:kids,teens,adults',
            ]);

            if ($rowValidator->fails()) {
                $errors[] = [
                    'index' => $index,
                    'phone' => $userData['phone'] ?? null,
                    'reason' => $rowValidator->errors()->first(),
                ];
                continue;
            }

            $phone = trim($userData['phone']);
            $phoneExists = User::withTrashed()->where('uPhone', $phone)->exists();
            if ($phoneExists) {
                $errors[] = [
                    'index' => $index,
                    'phone' => $phone,
                    'reason' => 'Số điện thoại đã tồn tại.',
                ];
                continue;
            }

            User::create([
                'uPhone' => $phone,
                'uPassword' => Hash::make($userData['password']),
                'uName' => $userData['name'],
                'uRole' => $userData['role'] ?? 'student',
                'uStatus' => $userData['status'] ?? 'active',
                'uDoB' => $userData['dob'] ?? null,
                'uAddress' => $userData['address'] ?? '',
                'uGender' => $userData['gender'] ?? 0,
                'uClass' => $userData['class'] ?? 0,
                'age_group' => $userData['age_group'] ?? 'teens',
            ]);

            $createdCount++;
        }

        if ($createdCount === 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tạo được tài khoản nào từ dữ liệu import.',
                'data' => [
                    'created_count' => 0,
                    'error_count' => count($errors),
                    'errors' => $errors,
                ]
            ], 400);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Import người dùng hoàn tất.',
            'data' => [
                'created_count' => $createdCount,
                'error_count' => count($errors),
                'errors' => $errors,
                'imported_by' => $user->uId,
                'imported_at' => now()->toISOString(),
            ]
        ], 201);
    }

    /**
     * GET /api/admin/users/export
     * Tạo thông tin export người dùng cho admin
     */
    public function adminExportUsers(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền export dữ liệu người dùng.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'format' => 'nullable|in:csv,json',
            'role' => 'nullable|in:student,teacher,admin',
            'status' => 'nullable|in:active,inactive',
            'include_deleted' => 'nullable|in:true,false',
            'search' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tham số export không hợp lệ.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $query = User::query();
        $includeDeleted = $request->get('include_deleted') === 'true';
        if ($includeDeleted) {
            $query->withTrashed();
        } else {
            $query->whereNull('uDeleted_at');
        }

        if ($request->filled('role')) {
            $query->where('uRole', $request->role);
        }

        if ($request->filled('status')) {
            $query->where('uStatus', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('uName', 'LIKE', "%{$search}%")
                  ->orWhere('uPhone', 'LIKE', "%{$search}%")
                  ->orWhere('uAddress', 'LIKE', "%{$search}%");
            });
        }

        $totalRecords = $query->count();
        $format = $request->get('format', 'csv');
        $generatedAt = now()->toISOString();
        $fileName = 'admin_users_export_' . now()->format('Ymd_His') . '.' . $format;

        return response()->json([
            'status' => 'success',
            'data' => [
                'export_url' => url('/exports/' . $fileName),
                'file_name' => $fileName,
                'format' => $format,
                'total_records' => $totalRecords,
                'filters' => [
                    'role' => $request->role,
                    'status' => $request->status,
                    'include_deleted' => $includeDeleted,
                    'search' => $request->search,
                ],
                'generated_at' => $generatedAt,
                'generated_by' => $user->uId,
            ]
        ]);
    }

    /**
     * GET /api/admin/classes/assignments
     * Danh sách phân công giáo viên - lớp cho admin
     */
    public function adminClassAssignments(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'search' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,inactive',
            'teacher_id' => 'nullable|integer|exists:users,uId',
            'paginate' => 'nullable|in:true,false',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $query = Classes::query()
            ->with([
                'teacher:uId,uName,uPhone,uStatus',
                'course:cId,cName,cStatus',
            ])
            ->withCount('enrollments')
            ->orderBy('cCreated_at', 'desc');

        if ($request->filled('status')) {
            $query->where('cStatus', $request->status);
        }

        if ($request->filled('teacher_id')) {
            $query->where('cTeacher_id', $request->teacher_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('cName', 'LIKE', "%{$search}%")
                    ->orWhere('cDescription', 'LIKE', "%{$search}%")
                    ->orWhereHas('teacher', function ($tq) use ($search) {
                        $tq->where('uName', 'LIKE', "%{$search}%")
                            ->orWhere('uPhone', 'LIKE', "%{$search}%");
                    });
            });
        }

        if ($request->get('paginate') === 'false') {
            $rows = $query->get();
            $data = $rows->map(function ($class) {
                $course = $class->getRelation('course');
                return [
                    'class_id' => $class->cId,
                    'class_name' => $class->cName,
                    'class_status' => $class->cStatus,
                    'description' => $class->cDescription,
                    'teacher' => $class->teacher ? [
                        'id' => $class->teacher->uId,
                        'name' => $class->teacher->uName,
                        'phone' => $class->teacher->uPhone,
                        'status' => $class->teacher->uStatus,
                    ] : null,
                    'course' => $course ? [
                        'id' => $course->cId,
                        'name' => $course->cName,
                        'status' => $course->cStatus ?? null,
                    ] : null,
                    'student_count' => (int) ($class->enrollments_count ?? 0),
                    'created_at' => $class->cCreated_at,
                ];
            })->values();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'data' => $data,
                    'total' => $data->count(),
                ]
            ]);
        }

        $perPage = (int) $request->get('per_page', 20);
        $paginated = $query->paginate($perPage);

        $transformed = collect($paginated->items())->map(function ($class) {
            $course = $class->getRelation('course');
            return [
                'class_id' => $class->cId,
                'class_name' => $class->cName,
                'class_status' => $class->cStatus,
                'description' => $class->cDescription,
                'teacher' => $class->teacher ? [
                    'id' => $class->teacher->uId,
                    'name' => $class->teacher->uName,
                    'phone' => $class->teacher->uPhone,
                    'status' => $class->teacher->uStatus,
                ] : null,
                'course' => $course ? [
                    'id' => $course->cId,
                    'name' => $course->cName,
                    'status' => $course->cStatus ?? null,
                ] : null,
                'student_count' => (int) ($class->enrollments_count ?? 0),
                'created_at' => $class->cCreated_at,
            ];
        })->values();

        return response()->json([
            'status' => 'success',
            'data' => [
                'data' => $transformed,
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ]
        ]);
    }

    /**
     * GET /api/admin/classes/assignment-teachers
     * Danh sách giáo viên để phân công lớp
     */
    public function adminAssignmentTeachers(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        $teachers = User::where('uRole', 'teacher')
            ->where('uStatus', 'active')
            ->whereNull('uDeleted_at')
            ->orderBy('uName')
            ->get(['uId', 'uName', 'uPhone', 'uStatus']);

        $teacherIds = $teachers->pluck('uId');
        $classCounts = Classes::whereIn('cTeacher_id', $teacherIds)
            ->selectRaw('cTeacher_id, COUNT(*) as assigned_classes')
            ->groupBy('cTeacher_id')
            ->pluck('assigned_classes', 'cTeacher_id');

        return response()->json([
            'status' => 'success',
            'data' => [
                'teachers' => $teachers->map(function ($teacher) use ($classCounts) {
                    return [
                        'id' => $teacher->uId,
                        'name' => $teacher->uName,
                        'phone' => $teacher->uPhone,
                        'status' => $teacher->uStatus,
                        'assigned_classes' => (int) ($classCounts[$teacher->uId] ?? 0),
                    ];
                })->values(),
                'total' => $teachers->count(),
            ]
        ]);
    }

    /**
     * PUT /api/admin/classes/{id}/assign-teacher
     * Đổi giáo viên phụ trách lớp
     */
    public function adminAssignTeacherToClass(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền thực hiện thao tác này.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'teacher_id' => 'required|integer|exists:users,uId',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $class = Classes::find($id);
        if (!$class) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy lớp học.'
            ], 404);
        }

        $teacher = User::where('uId', $request->teacher_id)
            ->where('uRole', 'teacher')
            ->where('uStatus', 'active')
            ->whereNull('uDeleted_at')
            ->first();

        if (!$teacher) {
            return response()->json([
                'status' => 'error',
                'message' => 'Giáo viên không hợp lệ hoặc không còn hoạt động.'
            ], 400);
        }

        if ((int) $class->cTeacher_id === (int) $teacher->uId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lớp đã được gán cho giáo viên này.'
            ], 400);
        }

        $oldTeacherId = $class->cTeacher_id;
        $class->update([
            'cTeacher_id' => $teacher->uId,
        ]);

        $oldTeacher = User::withTrashed()->find($oldTeacherId);
        $studentCount = ClassEnrollment::where('class_id', $class->cId)->count();

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật phân công giáo viên thành công.',
            'data' => [
                'class' => [
                    'id' => $class->cId,
                    'name' => $class->cName,
                    'status' => $class->cStatus,
                    'student_count' => $studentCount,
                ],
                'old_teacher' => $oldTeacher ? [
                    'id' => $oldTeacher->uId,
                    'name' => $oldTeacher->uName,
                ] : null,
                'new_teacher' => [
                    'id' => $teacher->uId,
                    'name' => $teacher->uName,
                    'phone' => $teacher->uPhone,
                ],
                'updated_by' => $user->uId,
                'updated_at' => now()->toISOString(),
            ]
        ]);
    }

    /**
     * GET /api/admin/students/new-registrations
     * Danh sách học viên đăng ký mới
     */
    public function adminStudentNewRegistrations(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'period_days' => 'nullable|integer|min:1|max:365',
            'search' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,inactive',
            'paginate' => 'nullable|in:true,false',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $periodDays = (int) $request->get('period_days', 30);
        $fromDate = now()->subDays($periodDays);

        $query = User::where('uRole', 'student')
            ->whereNull('uDeleted_at')
            ->where('uCreated_at', '>=', $fromDate)
            ->orderBy('uCreated_at', 'desc');

        if ($request->filled('status')) {
            $query->where('uStatus', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('uName', 'LIKE', "%{$search}%")
                    ->orWhere('uPhone', 'LIKE', "%{$search}%")
                    ->orWhere('uAddress', 'LIKE', "%{$search}%");
            });
        }

        $summaryBase = User::where('uRole', 'student')
            ->whereNull('uDeleted_at')
            ->where('uCreated_at', '>=', $fromDate);

        $summary = [
            'period_days' => $periodDays,
            'total_new' => (clone $summaryBase)->count(),
            'active' => (clone $summaryBase)->where('uStatus', 'active')->count(),
            'inactive' => (clone $summaryBase)->where('uStatus', 'inactive')->count(),
            'last_7_days' => (clone $summaryBase)->where('uCreated_at', '>=', now()->subDays(7))->count(),
        ];

        $transform = function ($student) {
            return [
                'id' => $student->uId,
                'name' => $student->uName,
                'phone' => $student->uPhone,
                'status' => $student->uStatus,
                'address' => $student->uAddress,
                'created_at' => $student->uCreated_at,
                'last_login' => $student->uLast_login,
            ];
        };

        if ($request->get('paginate') === 'false') {
            $rows = $query->get()->map($transform)->values();
            return response()->json([
                'status' => 'success',
                'data' => [
                    'summary' => $summary,
                    'data' => $rows,
                    'total' => $rows->count(),
                ]
            ]);
        }

        $perPage = (int) $request->get('per_page', 20);
        $paginated = $query->paginate($perPage);
        $rows = collect($paginated->items())->map($transform)->values();

        return response()->json([
            'status' => 'success',
            'data' => [
                'summary' => $summary,
                'data' => $rows,
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ]
        ]);
    }

    /**
     * GET /api/admin/students/complaints
     * Danh sách khiếu nại học viên (luồng xử lý tài khoản inactive)
     */
    public function adminStudentComplaints(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'search' => 'nullable|string|max:255',
            'paginate' => 'nullable|in:true,false',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors(),
            ], 400);
        }

        $query = User::where('uRole', 'student')
            ->where('uStatus', 'inactive')
            ->whereNull('uDeleted_at')
            ->orderBy('uCreated_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('uName', 'LIKE', "%{$search}%")
                    ->orWhere('uPhone', 'LIKE', "%{$search}%")
                    ->orWhere('uAddress', 'LIKE', "%{$search}%");
            });
        }

        $summary = [
            'total_complaints' => User::where('uRole', 'student')->where('uStatus', 'inactive')->whereNull('uDeleted_at')->count(),
            'new_last_7_days' => User::where('uRole', 'student')->where('uStatus', 'inactive')->whereNull('uDeleted_at')->where('uCreated_at', '>=', now()->subDays(7))->count(),
        ];

        $transform = function ($student) {
            return [
                'complaint_id' => $student->uId,
                'student' => [
                    'id' => $student->uId,
                    'name' => $student->uName,
                    'phone' => $student->uPhone,
                    'address' => $student->uAddress,
                ],
                'type' => 'account_inactive',
                'status' => 'open',
                'submitted_at' => $student->uCreated_at,
                'note' => 'Tài khoản học viên đang ở trạng thái inactive và cần admin xử lý.',
            ];
        };

        if ($request->get('paginate') === 'false') {
            $rows = $query->get()->map($transform)->values();
            return response()->json([
                'status' => 'success',
                'data' => [
                    'summary' => $summary,
                    'data' => $rows,
                    'total' => $rows->count(),
                ]
            ]);
        }

        $perPage = (int) $request->get('per_page', 20);
        $paginated = $query->paginate($perPage);
        $rows = collect($paginated->items())->map($transform)->values();

        return response()->json([
            'status' => 'success',
            'data' => [
                'summary' => $summary,
                'data' => $rows,
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ]
        ]);
    }

    /**
     * POST /api/admin/students/complaints/{id}/resolve
     * Đánh dấu đã xử lý khiếu nại (mở lại tài khoản học viên)
     */
    public function resolveStudentComplaint(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền thực hiện thao tác này.'
            ], 403);
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

        if ($student->uStatus === 'active') {
            return response()->json([
                'status' => 'success',
                'message' => 'Khiếu nại đã được xử lý trước đó.',
                'data' => [
                    'student_id' => $student->uId,
                    'status' => $student->uStatus,
                ]
            ]);
        }

        $student->update(['uStatus' => 'active']);

        return response()->json([
            'status' => 'success',
            'message' => 'Đã xử lý khiếu nại và mở lại tài khoản học viên.',
            'data' => [
                'student_id' => $student->uId,
                'student_name' => $student->uName,
                'status' => $student->uStatus,
                'resolved_by' => $user->uId,
                'resolved_at' => now()->toISOString(),
            ]
        ]);
    }

    /**
     * POST /api/teacher/student/{id}/reset-password
     * Đặt lại mật khẩu cho học viên (Teacher only)
     */
    /**
     * @OA\Post(
     *     path="/teacher/student/{id}/reset-password",
     *     tags={"Student Management"},
     *     summary="Reset student password",
     *     description="Reset password for a student (teacher only)",
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
     *             required={"new_password"},
     *             @OA\Property(property="new_password", type="string", example="newpass123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Password reset successfully"
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
    public function resetStudentPassword(Request $request, $id)
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
            'new_password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mật khẩu phải có ít nhất 6 ký tự.',
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            $student->update([
                'uPassword' => Hash::make($request->new_password),
                'plain_password' => encrypt($request->new_password) // Store encrypted plain password
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Đã đặt lại mật khẩu thành công.',
                'data' => [
                    'student_id' => $student->uId,
                    'student_name' => $student->uName,
                    'student_phone' => $student->uPhone,
                    'reset_by' => $user->uId,
                    'reset_at' => now()->toISOString(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi đặt lại mật khẩu: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/teacher/student/{id}/view-password
     * Xem mật khẩu hiện tại của học viên (Teacher only)
     */
    /**
     * @OA\Get(
     *     path="/teacher/student/{id}/view-password",
     *     tags={"Student Management"},
     *     summary="View student password",
     *     description="View current password for a student (teacher only)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Password retrieved successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Student not found or password not available"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function viewStudentPassword(Request $request, $id)
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

        if (!$student->plain_password) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mật khẩu không khả dụng. Vui lòng đặt lại mật khẩu mới.'
            ], 404);
        }

        try {
            $plainPassword = decrypt($student->plain_password);

            return response()->json([
                'status' => 'success',
                'message' => 'Lấy mật khẩu thành công.',
                'data' => [
                    'student_id' => $student->uId,
                    'student_name' => $student->uName,
                    'student_phone' => $student->uPhone,
                    'password' => $plainPassword,
                    'viewed_by' => $user->uId,
                    'viewed_at' => now()->toISOString(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể giải mã mật khẩu. Vui lòng đặt lại mật khẩu mới.'
            ], 500);
        }
    }

}
