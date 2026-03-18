<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class UserController extends Controller
{
    /**
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
    public function store(Request $request)
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
    public function destroy(Request $request, $id)
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
