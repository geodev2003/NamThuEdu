<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Course;
use App\Models\User;

class CourseController extends Controller
{
    /**
     * @OA\Get(
     *     path="/teacher/courses",
     *     tags={"Teachers"},
     *     summary="Get teacher courses",
     *     description="Get list of courses for authenticated teacher",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Courses retrieved successfully"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     * 
     * GET /api/teacher/courses
     * Lấy danh sách khóa học của teacher
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

        $courses = Course::with(['category'])
                        ->byTeacher($user->uId)
                        ->whereNull('cDeleteAt')
                        ->orderBy('cCreateAt', 'desc')
                        ->get();

        return response()->json([
            'status' => 'success',
            'data' => $courses
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
            'numberOfStudent' => 'required|integer|min:1',
            'time' => 'required|string|max:50',
            'category' => 'required|integer|exists:category,caId',
            'schedule' => 'required|string',
            'startDate' => 'required|date',
            'endDate' => 'required|date|after:startDate',
            'description' => 'nullable|string',
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
            'cStatus' => 'active',
        ]);

        return response()->json([
            'status' => 'success',
            'data' => ['courseId' => $course->cId]
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
}
