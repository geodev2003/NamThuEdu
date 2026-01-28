<?php

namespace App\Controllers;

use App\Core\Database;

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
    public function store(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input || empty($input['phone']) || empty($input['password']) || empty($input['birthday'])) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Thiếu số điện thoại hoặc mật khẩu'
            ]);
            return;
        }

        $phone = trim($input['phone']);
        $password = password_hash($input['password'], PASSWORD_BCRYPT);
        $birthday = trim($input['birthday']);

        $db = Database::getInstance()->getConnection();

        // Kiểm tra trùng SĐT
        $check = $db->prepare("SELECT uId FROM users WHERE uPhone=?");
        $check->execute([$phone]);

        if ($check->fetch()) {
            http_response_code(409);
            echo json_encode([
                'status' => 'error',
                'message' => 'Số điện thoại đã tồn tại'
            ]);
            return;
        }

        // Insert user
        $stmt = $db->prepare("
                INSERT INTO users (uPhone, uPassword, uRole, uDoB, uStatus, uCreated_at)
                VALUES (?, ?, 'student', ?, 'active', NOW())
            ");

        $stmt->execute([$phone, $password, $birthday]);

        // Kiểm tra xem có thực sự insert được dòng nào không
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Đăng ký thành công!',
                'id' => $db->lastInsertId() // Trả về ID vừa tạo để xác nhận
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Lỗi khi tạo tài khoản'
            ]);
        }
    }
}
