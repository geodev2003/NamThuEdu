<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Course;
use App\Models\User;

class CourseController extends Controller
{
    /**
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
