<?php

namespace App\Controllers;

use App\Core\Database;
use App\Core\Response;
use App\Models\CourseModel;
use App\Models\UserModel;

class UserController
{

    /**
     * GET /api/users/
     */
    public function index()
    {
        echo json_encode([
            'message' => 'Router hoạt động OK'
        ]);
    }

    /** 
     * POST /api/users
     * Dang ky tai khoan
     * */
    // public function store(): void
    // {
    //     $input = json_decode(file_get_contents('php://input'), true);

    //     if (!$input || empty($input['phone']) || empty($input['password']) || empty($input['birthday'])) {
    //         http_response_code(400);
    //         echo json_encode([
    //             'status' => 'error',
    //             'message' => 'Thiếu số điện thoại hoặc mật khẩu'
    //         ]);
    //         return;
    //     }

    //     $phone = trim($input['phone']);
    //     $password = password_hash($input['password'], PASSWORD_BCRYPT);
    //     $birthday = trim($input['birthday']);

    //     $db = Database::getInstance()->getConnection();

    //     // Kiểm tra trùng SĐT
    //     $check = $db->prepare("SELECT uId FROM users WHERE uPhone=?");
    //     $check->execute([$phone]);

    //     if ($check->fetch()) {
    //         http_response_code(409);
    //         echo json_encode([
    //             'status' => 'error',
    //             'message' => 'Số điện thoại đã tồn tại'
    //         ]);
    //         return;
    //     }

    //     // Insert user
    //     $stmt = $db->prepare("
    //             INSERT INTO users (uPhone, uPassword, uRole, uDoB, uStatus, uCreated_at)
    //             VALUES (?, ?, 'student', ?, 'active', NOW())
    //         ");

    //     $stmt->execute([$phone, $password, $birthday]);

    //     // Kiểm tra xem có thực sự insert được dòng nào không
    //     if ($stmt->rowCount() > 0) {
    //         echo json_encode([
    //             'status' => 'success',
    //             'message' => 'Đăng ký thành công!',
    //             'id' => $db->lastInsertId() // Trả về ID vừa tạo để xác nhận
    //         ]);
    //     } else {
    //         echo json_encode([
    //             'status' => 'error',
    //             'message' => 'Lỗi khi tạo tài khoản'
    //         ]);
    //     }
    // }

    public function teacherStudents()
    {
        $user = UserModel::getAuthenticatedUser();

        if (!$user || $user['uRole'] !== 'teacher') {
            Response::error('AUTH_UNAUTHORIZED', 'Bạn không có quyền truy cập.', null, 401);
            return;
        }

        $users = UserModel::getAllStudents();

        // Trả về trực tiếp $courses để Response::success đóng gói vào key 'data'
        Response::success($users);
    }

    public function getStudentById(int $studentId)
    {
        $user = UserModel::getAuthenticatedUser();

        if (!$user || $user['uRole'] !== 'teacher') {
            Response::error('AUTH_UNAUTHORIZED', 'Bạn không có quyền truy cập.', null, 401);
            return;
        }

        $row = UserModel::getStudentById($studentId);

        Response::success($row);
    }

    public function store()
    {
        // 1. Kiểm tra quyền của Teacher
        $user = UserModel::getAuthenticatedUser();
        if (!$user || $user['uRole'] !== 'teacher') {
            Response::error('AUTH_UNAUTHORIZED', 'Bạn không có quyền truy cập.', null, 401);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input)) {
            Response::error('INVALID_DATA', 'Dữ liệu không được để trống', null, 400);
            return;
        }

        // 2. Chuẩn hóa dữ liệu: Đưa tất cả về dạng mảng để xử lý chung
        // Nếu $input là một mảng đánh chỉ số (array of objects), giữ nguyên. 
        // Nếu là một object đơn lẻ, bọc nó vào mảng.
        $students = isset($input[0]) ? $input : [$input];

        $results = [
            'success_count' => 0,
            'errors' => []
        ];

        foreach ($students as $index => $data) {
            // Kiểm tra các trường bắt buộc
            if (empty($data['studentPhone']) || empty($data['studentPassword'])) {
                $results['errors'][] = [
                    'index' => $index,
                    'phone' => $data['studentPhone'] ?? 'N/A',
                    'error' => 'Thiếu số điện thoại hoặc mật khẩu'
                ];
                continue;
            }

            // 3. Gọi Model để tạo Student
            try {
                $createdId = UserModel::createStudent([
                    'phone'    => trim($data['studentPhone']),
                    'password' => $data['studentPassword'], // Password sẽ được hash ở Model
                    'name'     => $data['studentName'] ?? null,
                    'dob'      => $data['studentDoB'] ?? null,
                    'classId'  => $data['uClass'] ?? null, // Nếu có truyền lớp
                ]);

                if ($createdId) {
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

        // 4. Phản hồi kết quả
        if ($results['success_count'] > 0) {
            Response::success($results, "Đã xử lý xong danh sách học viên.");
        } else {
            Response::error('CREATE_FAILED', 'Không thể tạo học viên nào.', $results['errors'], 400);
        }
    }

    public function destroy(int $id)
    {
        // 1. Kiểm tra quyền của Teacher thông qua JWT
        $user = UserModel::getAuthenticatedUser();

        if (!$user || $user['uRole'] !== 'teacher') {
            Response::error('AUTH_UNAUTHORIZED', 'Bạn không có quyền thực hiện hành động này.', null, 401);
            return;
        }

        // 2. Gọi Model để xóa Student
        try {
            $success = UserModel::deleteStudent($id);

            if ($success) {
                Response::success([
                    'DELETE_STUDENT_SUCCESS',
                    'Xóa học viên thành công',
                    null,
                    200
                ]);
            } else {
                Response::error('DELETE_STUDENT_FAILED', 'Không tìm thấy học viên hoặc học viên đã bị xóa.', null, 404);
            }
        } catch (\Exception $e) {
            Response::error('SERVER_ERROR', 'Lỗi hệ thống khi xóa học viên.', null, 500);
        }
    }

    public function update(int $id)
    {
        // 1. Kiểm tra quyền Teacher
        $user = UserModel::getAuthenticatedUser();
        if (!$user || $user['uRole'] !== 'teacher') {
            Response::error('AUTH_UNAUTHORIZED', 'Bạn không có quyền thực hiện hành động này.', null, 401);
            return;
        }

        // 2. Lấy dữ liệu từ Request body
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('INVALID_INPUT', 'Dữ liệu không hợp lệ.', null, 400);
            return;
        }

        // 3. Thực hiện cập nhật
        try {
            $success = UserModel::updateStudent($id, [
                'name'     => $input['studentName'] ?? '',
                'phone'    => $input['studentPhone'] ?? '',
                'birthday' => $input['studentDoB'] ?? null,
                'address'  => $input['studentAddress'] ?? '',
                'gender'   => $input['studentGender'] ?? 'Nam',
                'class_id' => $input['classId'] ?? null, // Thay đổi lớp học tại đây
                'status'   => $input['studentStatus'] ?? 'active'
            ]);

            if ($success) {
                Response::success([
                    'UPDATE_STUDENT_SUCCESS',
                    'Cập nhật thông tin học viên thành công',
                    null,
                    200
                ]);
            } else {
                Response::error('UPDATE_STUDENT_FAILED', 'Không thể cập nhật hoặc không có thay đổi nào.', null, 400);
            }
        } catch (\Exception $e) {
            Response::error('SERVER_ERROR', 'Lỗi hệ thống: ' . $e->getMessage(), null, 500);
        }
    }
}
