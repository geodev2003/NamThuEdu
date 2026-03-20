<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Course;
use App\Models\CourseEnrollment;

class CourseController extends Controller
{
    /**
     * @OA\Get(
     *     path="/teacher/courses",
     *     tags={"Teachers"},
     *     summary="Get teacher courses",
     *     description="Get list of courses for authenticated teacher with enrollment statistics",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Courses retrieved successfully"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     * 
     * GET /api/teacher/courses
     * Lấy danh sách khóa học của teacher với thống kê enrollment
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

        $courses = Course::with(['category', 'activeEnrollments'])
                        ->byTeacher($user->uId)
                        ->whereNull('cDeleteAt')
                        ->orderBy('cCreateAt', 'desc')
                        ->get();

        // Thêm thống kê enrollment cho mỗi khóa học
        $coursesWithStats = $courses->map(function($course) {
            return [
                'cId' => $course->cId,
                'cName' => $course->cName,
                'cCategory' => $course->cCategory,
                'cNumberOfStudent' => $course->cNumberOfStudent,
                'cTime' => $course->cTime,
                'cSchedule' => $course->cSchedule,
                'cStartDate' => $course->cStartDate,
                'cEndDate' => $course->cEndDate,
                'cStatus' => $course->cStatus,
                'cDescription' => $course->cDescription,
                'cCreateAt' => $course->cCreateAt,
                'category' => $course->category,
                'enrollment_stats' => [
                    'current_students' => $course->activeEnrollments->count(),
                    'max_students' => $course->cNumberOfStudent,
                    'available_slots' => $course->cNumberOfStudent - $course->activeEnrollments->count(),
                    'is_full' => $course->activeEnrollments->count() >= $course->cNumberOfStudent,
                ]
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $coursesWithStats
        ]);
    }

    /**
     * @OA\Post(
     *     path="/teacher/courses",
     *     tags={"Course Management"},
     *     summary="Create new course",
     *     description="Create a new course (teacher only)",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"courseName", "numberOfStudent", "time", "category", "schedule", "startDate", "endDate"},
     *             @OA\Property(property="courseName", type="string", example="VSTEP Preparation Course"),
     *             @OA\Property(property="numberOfStudent", type="integer", example=20),
     *             @OA\Property(property="time", type="string", example="2 hours"),
     *             @OA\Property(property="category", type="integer", example=1),
     *             @OA\Property(property="schedule", type="string", example="Mon, Wed, Fri - 7:00 PM"),
     *             @OA\Property(property="startDate", type="string", format="date", example="2026-04-01"),
     *             @OA\Property(property="endDate", type="string", format="date", example="2026-06-30"),
     *             @OA\Property(property="description", type="string", example="Comprehensive VSTEP preparation course")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Course created successfully"
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
     * POST /api/teacher/courses
     * Tạo khóa học mới
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
            'courseName' => 'required|string|max:100',
            'numberOfStudent' => 'required|integer|min:1|max:100',
            'time' => 'required|string|max:50',
            'category' => 'required|integer|exists:category,caId',
            'schedule' => 'required|string',
            'startDate' => 'required|date|after:today',
            'endDate' => 'required|date|after:startDate',
            'description' => 'nullable|string|max:1000',
            'courseType' => 'required|in:VSTEP,IELTS', // Chỉ cho phép VSTEP và IELTS
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không đầy đủ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $course = Course::create([
            'cName' => $request->courseName,
            'cCategory' => $request->category,
            'cNumberOfStudent' => $request->numberOfStudent,
            'cTime' => $request->time,
            'cSchedule' => $request->schedule,
            'cStartDate' => $request->startDate,
            'cEndDate' => $request->endDate,
            'cDescription' => $request->description ?? '',
            'cTeacher' => $user->uId,
            'cStatus' => 'draft', // Mặc định là draft, teacher có thể activate sau
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Tạo khóa học thành công',
            'data' => [
                'courseId' => $course->cId,
                'courseName' => $course->cName,
                'courseType' => $request->courseType,
                'maxStudents' => $course->cNumberOfStudent,
                'status' => $course->cStatus,
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/teacher/courses/{id}",
     *     tags={"Course Management"},
     *     summary="Get course details",
     *     description="Get detailed information about a specific course",
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
     *         description="Course details retrieved successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Course not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     * 
     * GET /api/teacher/courses/{id}
     * Lấy chi tiết khóa học
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

        $course = Course::with(['category', 'teacher'])
                       ->where('cId', $id)
                       ->where('cTeacher', $user->uId)
                       ->whereNull('cDeleteAt')
                       ->first();

        if (!$course) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy khóa học.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $course
        ]);
    }

    /**
     * @OA\Put(
     *     path="/teacher/courses/{id}",
     *     tags={"Course Management"},
     *     summary="Update course",
     *     description="Update course information",
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
     *             @OA\Property(property="courseName", type="string"),
     *             @OA\Property(property="numberOfStudent", type="integer"),
     *             @OA\Property(property="time", type="string"),
     *             @OA\Property(property="category", type="integer"),
     *             @OA\Property(property="schedule", type="string"),
     *             @OA\Property(property="startDate", type="string", format="date"),
     *             @OA\Property(property="endDate", type="string", format="date"),
     *             @OA\Property(property="description", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Course updated successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Course not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     * 
     * PUT /api/teacher/courses/{id}
     * Cập nhật khóa học
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Không có quyền.'
            ], 401);
        }

        $course = Course::where('cId', $id)
                       ->where('cTeacher', $user->uId)
                       ->whereNull('cDeleteAt')
                       ->first();

        if (!$course) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy khóa học.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'courseName' => 'sometimes|required|string|max:100',
            'numberOfStudent' => 'sometimes|required|integer|min:1',
            'time' => 'sometimes|required|string|max:50',
            'category' => 'sometimes|required|integer|exists:category,caId',
            'schedule' => 'sometimes|required|string',
            'startDate' => 'sometimes|required|date',
            'endDate' => 'sometimes|required|date|after:startDate',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        $updateData = [];
        if ($request->has('courseName')) $updateData['cName'] = $request->courseName;
        if ($request->has('numberOfStudent')) $updateData['cNumberOfStudent'] = $request->numberOfStudent;
        if ($request->has('time')) $updateData['cTime'] = $request->time;
        if ($request->has('category')) $updateData['cCategory'] = $request->category;
        if ($request->has('schedule')) $updateData['cSchedule'] = $request->schedule;
        if ($request->has('startDate')) $updateData['cStartDate'] = $request->startDate;
        if ($request->has('endDate')) $updateData['cEndDate'] = $request->endDate;
        if ($request->has('description')) $updateData['cDescription'] = $request->description;

        $course->update($updateData);

        return response()->json([
            'status' => 'success',
            'data' => ['message' => 'Cập nhật khóa học thành công']
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/teacher/courses/{id}",
     *     tags={"Course Management"},
     *     summary="Delete course",
     *     description="Delete a course (soft delete)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Course deleted successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Course not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     * 
     * DELETE /api/teacher/courses/{id}
     * Xóa khóa học (soft delete)
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Không có quyền.'
            ], 401);
        }

        $course = Course::where('cId', $id)
                       ->where('cTeacher', $user->uId)
                       ->whereNull('cDeleteAt')
                       ->first();

        if (!$course) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy khóa học.'
            ], 404);
        }

        $course->update(['cDeleteAt' => now()]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'DELETE_COURSE_SUCCESS',
                'Xóa khóa học thành công',
                null,
                200
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/teacher/courses/{id}/students",
     *     tags={"Course Management"},
     *     summary="Get course students",
     *     description="Get list of students enrolled in a specific course",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Students retrieved successfully"),
     *     @OA\Response(response=404, description="Course not found")
     * )
     * 
     * GET /api/teacher/courses/{id}/students
     * Lấy danh sách học sinh trong khóa học
     */
    public function getStudents(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $course = Course::where('cId', $id)
                       ->where('cTeacher', $user->uId)
                       ->whereNull('cDeleteAt')
                       ->first();

        if (!$course) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy khóa học.'
            ], 404);
        }

        $enrollments = CourseEnrollment::with(['student'])
                                     ->where('course_id', $id)
                                     ->orderBy('enrolled_at', 'desc')
                                     ->get();

        $studentsData = $enrollments->map(function($enrollment) {
            return [
                'enrollment_id' => $enrollment->id,
                'student' => [
                    'uId' => $enrollment->student->uId,
                    'uName' => $enrollment->student->uName,
                    'uPhone' => $enrollment->student->uPhone,
                ],
                'status' => $enrollment->status,
                'enrolled_at' => $enrollment->enrolled_at,
                'fee_paid' => $enrollment->fee_paid,
                'notes' => $enrollment->notes,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => [
                'course_info' => [
                    'cId' => $course->cId,
                    'cName' => $course->cName,
                    'cNumberOfStudent' => $course->cNumberOfStudent,
                ],
                'enrollment_stats' => [
                    'total_enrolled' => $enrollments->where('status', 'enrolled')->count(),
                    'total_completed' => $enrollments->where('status', 'completed')->count(),
                    'total_dropped' => $enrollments->where('status', 'dropped')->count(),
                    'available_slots' => $course->cNumberOfStudent - $enrollments->where('status', 'enrolled')->count(),
                ],
                'students' => $studentsData,
            ]
        ]);
    }

    /**
     * @OA\Post(
     *     path="/teacher/courses/{id}/enroll",
     *     tags={"Course Management"},
     *     summary="Enroll student to course",
     *     description="Add a student to a course",
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
     *             required={"student_id"},
     *             @OA\Property(property="student_id", type="integer", example=1),
     *             @OA\Property(property="fee_paid", type="number", format="float", example=1500000),
     *             @OA\Property(property="notes", type="string", example="Học sinh chuyển từ lớp khác")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Student enrolled successfully"),
     *     @OA\Response(response=400, description="Enrollment failed")
     * )
     * 
     * POST /api/teacher/courses/{id}/enroll
     * Thêm học sinh vào khóa học
     */
    public function enrollStudent(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $course = Course::where('cId', $id)
                       ->where('cTeacher', $user->uId)
                       ->whereNull('cDeleteAt')
                       ->first();

        if (!$course) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy khóa học.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'student_id' => 'required|integer|exists:users,uId',
            'fee_paid' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        // Kiểm tra học sinh có role student không
        $student = User::where('uId', $request->student_id)
                      ->where('uRole', 'student')
                      ->first();

        if (!$student) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy học sinh hoặc user không phải là student.'
            ], 404);
        }

        // Kiểm tra đã đăng ký chưa
        $existingEnrollment = CourseEnrollment::where('course_id', $id)
                                            ->where('student_id', $request->student_id)
                                            ->first();

        if ($existingEnrollment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Học sinh đã được đăng ký vào khóa học này.',
                'current_status' => $existingEnrollment->status
            ], 400);
        }

        // Kiểm tra số lượng tối đa
        $currentEnrollments = CourseEnrollment::where('course_id', $id)
                                            ->where('status', 'enrolled')
                                            ->count();

        if ($currentEnrollments >= $course->cNumberOfStudent) {
            return response()->json([
                'status' => 'error',
                'message' => 'Khóa học đã đầy. Không thể thêm học sinh mới.',
                'current_students' => $currentEnrollments,
                'max_students' => $course->cNumberOfStudent
            ], 400);
        }

        // Tạo enrollment mới
        $enrollment = CourseEnrollment::create([
            'course_id' => $id,
            'student_id' => $request->student_id,
            'status' => 'enrolled',
            'fee_paid' => $request->fee_paid,
            'notes' => $request->notes,
            'enrolled_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Thêm học sinh vào khóa học thành công.',
            'data' => [
                'enrollment_id' => $enrollment->id,
                'student_name' => $student->uName,
                'course_name' => $course->cName,
                'enrolled_at' => $enrollment->enrolled_at,
                'current_students' => $currentEnrollments + 1,
                'available_slots' => $course->cNumberOfStudent - ($currentEnrollments + 1),
            ]
        ], 201);
    }

    /**
     * @OA\Delete(
     *     path="/teacher/courses/{courseId}/students/{studentId}",
     *     tags={"Course Management"},
     *     summary="Remove student from course",
     *     description="Remove a student from a course (set status to dropped)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="courseId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="studentId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Student removed successfully"),
     *     @OA\Response(response=404, description="Enrollment not found")
     * )
     * 
     * DELETE /api/teacher/courses/{courseId}/students/{studentId}
     * Xóa học sinh khỏi khóa học
     */
    public function removeStudent(Request $request, $courseId, $studentId)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $course = Course::where('cId', $courseId)
                       ->where('cTeacher', $user->uId)
                       ->whereNull('cDeleteAt')
                       ->first();

        if (!$course) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy khóa học.'
            ], 404);
        }

        $enrollment = CourseEnrollment::where('course_id', $courseId)
                                    ->where('student_id', $studentId)
                                    ->where('status', 'enrolled')
                                    ->first();

        if (!$enrollment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy đăng ký của học sinh trong khóa học này.'
            ], 404);
        }

        $enrollment->update(['status' => 'dropped']);

        return response()->json([
            'status' => 'success',
            'message' => 'Xóa học sinh khỏi khóa học thành công.',
            'data' => [
                'student_id' => $studentId,
                'course_id' => $courseId,
                'new_status' => 'dropped'
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/teacher/courses/{id}/statistics",
     *     tags={"Course Management"},
     *     summary="Get course statistics",
     *     description="Get detailed statistics for a specific course",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Statistics retrieved successfully"),
     *     @OA\Response(response=404, description="Course not found")
     * )
     * 
     * GET /api/teacher/courses/{id}/statistics
     * Lấy thống kê chi tiết khóa học
     */
    public function getStatistics(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $course = Course::with(['category'])
                       ->where('cId', $id)
                       ->where('cTeacher', $user->uId)
                       ->whereNull('cDeleteAt')
                       ->first();

        if (!$course) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy khóa học.'
            ], 404);
        }

        $enrollments = CourseEnrollment::where('course_id', $id)->get();
        
        // Thống kê enrollment
        $enrollmentStats = [
            'total_enrolled' => $enrollments->where('status', 'enrolled')->count(),
            'total_completed' => $enrollments->where('status', 'completed')->count(),
            'total_dropped' => $enrollments->where('status', 'dropped')->count(),
            'total_ever_enrolled' => $enrollments->count(),
            'available_slots' => $course->cNumberOfStudent - $enrollments->where('status', 'enrolled')->count(),
            'occupancy_rate' => $course->cNumberOfStudent > 0 ? 
                round(($enrollments->where('status', 'enrolled')->count() / $course->cNumberOfStudent) * 100, 2) : 0,
        ];

        // Thống kê theo thời gian
        $enrollmentsByMonth = $enrollments->groupBy(function($enrollment) {
            return $enrollment->enrolled_at->format('Y-m');
        })->map(function($group, $month) {
            return [
                'month' => $month,
                'count' => $group->count(),
            ];
        })->values();

        // Thống kê revenue (nếu có)
        $revenueStats = [
            'total_revenue' => $enrollments->sum('fee_paid'),
            'average_fee' => $enrollments->where('fee_paid', '>', 0)->avg('fee_paid') ?: 0,
            'paid_students' => $enrollments->where('fee_paid', '>', 0)->count(),
        ];

        // Thống kê thời gian khóa học
        $now = now();
        $startDate = $course->cStartDate;
        $endDate = $course->cEndDate;
        
        $courseProgress = [
            'status' => $course->cStatus,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'days_total' => $startDate && $endDate ? $startDate->diffInDays($endDate) : 0,
            'days_elapsed' => $startDate && $now >= $startDate ? $startDate->diffInDays($now) : 0,
            'days_remaining' => $endDate && $now <= $endDate ? $now->diffInDays($endDate) : 0,
            'progress_percentage' => 0,
        ];

        if ($startDate && $endDate && $courseProgress['days_total'] > 0) {
            $courseProgress['progress_percentage'] = min(100, 
                round(($courseProgress['days_elapsed'] / $courseProgress['days_total']) * 100, 2)
            );
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'course_info' => [
                    'cId' => $course->cId,
                    'cName' => $course->cName,
                    'cStatus' => $course->cStatus,
                    'category' => $course->category,
                    'max_students' => $course->cNumberOfStudent,
                ],
                'enrollment_stats' => $enrollmentStats,
                'enrollments_by_month' => $enrollmentsByMonth,
                'revenue_stats' => $revenueStats,
                'course_progress' => $courseProgress,
            ]
        ]);
    }
}
