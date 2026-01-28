<?php

namespace App\Controllers;

use App\Core\Database;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Core\Response;
use App\Core\RateLimiter;
use App\Validators\LoginValidator;

class AuthController
{
    /**
     * POST /api/login
     * Đăng nhập bằng SĐT + mật khẩu
     */
    public function login(): void
    {

        // Rate limit theo IP
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        RateLimiter::limit('login:' . $ip, 5, 60);

        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input || empty($input['phone']) || empty($input['password'])) {
            // http_response_code(400);
            // echo json_encode([
            //     'status'  => 'error',
            //     'message' => 'Thiếu số điện thoại hoặc mật khẩu'
            // ]);
            // return;
            Response::error(
                'INVALID_JSON',
                'Body request không hợp lệ'
            );
        }

        // $phone = trim($input['phone']);
        // $password = $input['password'];
        
        // Validation
        $data = LoginValidator::validate($input);

        $db = Database::getInstance()->getConnection();

        // Tìm user theo SĐT
        $stmt = $db->prepare("
            SELECT uId, uPhone, uPassword, uRole, uDoB, uStatus
            FROM users
            WHERE uPhone = ? AND uDeleted_at IS NULL
            LIMIT 1
        ");
        $stmt->execute([$data['phone']]);

        $user = $stmt->fetch();

        if (!$user || !password_verify($data['password'], $user['uPassword'])) {
            // http_response_code(401);
            // echo json_encode([
            //     'status'  => 'error',
            //     'message' => 'Số điện thoại hoặc mật khẩu không đúng'
            // ]);
            // return;
            Response::error(
                'AUTH_INVALID_CREDENTIALS',
                'Số điện thoại hoặc mật khẩu không đúng',
                null,
                401
            );
        }

        if ($user['uStatus'] !== 'active') {
            // http_response_code(403);
            // echo json_encode([
            //     'status'  => 'error',
            //     'message' => 'Tài khoản chưa được kích hoạt'
            // ]);
            // return;
            Response::error(
                'AUTH_ACCOUNT_INACTIVE',
                'Tài khoản chưa được kích hoạt',
                null,
                403
            );
        }

        // Verify password
        // if (!password_verify($password, $user['uPassword'])) {
        //     http_response_code(401);
        //     echo json_encode([
        //         'status'  => 'error',
        //         'message' => 'Số điện thoại hoặc mật khẩu không đúng'
        //     ]);
        //     return;
        // }
        $dob = new \DateTime($user['uDoB']);
        $now = new \DateTime();
        $age = $now->diff($dob)->y;
        // Tạo JWT
        $payload = [
            'iss' => 'namthuedu',
            'iat' => time(),
            'exp' => time() + 60 * 60 * 24, // 24h
            'sub' => $user['uId'],
            'phone' => $user['uPhone'],
            'age' => $age,
            'role' => $user['uRole']
        ];

        $jwtSecret = $_ENV['JWT_SECRET'] ?? 'namthuedu_secret';

        $token = JWT::encode($payload, $jwtSecret, 'HS256');

        // echo json_encode([
        //     'status' => 'success',
        //     'message' => 'Đăng nhập thành công',
        //     'data' => [
        //         'access_token' => $token,
        //         'user' => [
        //             'id' => $user['uId'],
        //             'phone' => $user['uPhone'],
        //             'age' => date('Y-m-d', time()) - $user['uDoB'],
        //             'role' => $user['uRole']
        //         ]
        //     ]
        // ]);

        Response::success([
            'access_token' => $token,
            'user' => [
                'id' => $user['uId'],
                'phone' => $user['uPhone'],
                'age' => $age,
                'role' => $user['uRole']
            ]
        ]);
    }

    public function accept(): void {
        // Lấy số điện thoại
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Lấy IP của máy yêu cầu xác nhận
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

        // Kiểm tra đầu vào có empty không?
        if(empty($input['phone']) || !$input) {
            Response::error(
                'AUTH_INVALID_CREDENTIALS',
                'Số điện thoại không đúng',
                null,
                401
            );
        }

        $db = Database::getInstance()->getConnection();

        // Kiểm tra số điện thoại có tồn tại trong database không?
        $stmt = $db->prepare("
            SELECT uId, uRole, uPhone
            FROM users
            WHERE uPhone=? AND uDeleted_at IS NULL
        ");

        $stmt->execute([$input['phone']]);

        $user = $stmt->fetch();

        // Nếu số điện thoại không tồn tại => báo lỗi
        if(!$user) {
            Response::error(
                'AUTHORIZATION_PHONE_NOT_FOUND',
                'Không tìm thấy số điện thoại trên cơ sở dữ liệu',
                null,
                404
            );
        }

        // Tạo một OTP
        $new_otp = $this->generateOTP(6);

        // cập nhật OTP, số điện thoại, IP máy yêu cầu xác nhận lên DB
        // Fix SQL syntax: INSERT INTO ... VALUES (...)
        $insert_otp = $db->prepare("
            INSERT INTO otp_logs (userId, oCode, oExpired_at)
            VALUES (?, ?, ?)
        ");

        // Expired in 5 minutes
        $expired_at = date('Y-m-d H:i:s', time() + 5 * 60);

        $result = $insert_otp->execute([$user['uId'], $new_otp, $expired_at]);

        if(!$result) {
            Response::error(
                'INSERT_OTP_FAILED',
                'Tạo mã OTP thất bại',
                null,
                500
            );
        }

        // Gửi OTP về số điện thoại (Mock)
        // Trong thực tế sẽ gọi API SMS ở đây
        
        Response::success([
            'message' => 'Mã OTP đã được gửi đến số điện thoại của bạn (Mock: ' . $new_otp . ')',
            'debug_otp' => $new_otp // For testing purpose
        ]);
    }

    public function resetPassword(): void {
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['phone']) || empty($input['otp']) || empty($input['password'])) {
             Response::error(
                'INVALID_INPUT',
                'Vui lòng nhập đầy đủ thông tin',
                null,
                400
            );
        }

        $db = Database::getInstance()->getConnection();

        // 1. Get user by phone
        $stmt = $db->prepare("SELECT uId FROM users WHERE uPhone = ? AND uDeleted_at IS NULL");
        $stmt->execute([$input['phone']]);
        $user = $stmt->fetch();

        if (!$user) {
            Response::error(
                'USER_NOT_FOUND',
                'Người dùng không tồn tại',
                null,
                404
            );
        }

        // 2. Verify OTP
        // Get the latest unexpired, unverified OTP for this user
        $stmtOtp = $db->prepare("
            SELECT oId 
            FROM otp_logs 
            WHERE userId = ? 
              AND oCode = ? 
              AND oVerified = 0 
              AND oExpired_at > NOW()
            ORDER BY oCreated_at DESC 
            LIMIT 1
        ");
        $stmtOtp->execute([$user['uId'], $input['otp']]);
        $otpRecord = $stmtOtp->fetch();

        if (!$otpRecord) {
             Response::error(
                'INVALID_OTP',
                'Mã OTP không chính xác hoặc đã hết hạn',
                null,
                400
            );
        }

        // 3. Update password
        $newPasswordHash = password_hash($input['password'], PASSWORD_DEFAULT);
        $updateUser = $db->prepare("UPDATE users SET uPassword = ? WHERE uId = ?");
        $updateUser->execute([$newPasswordHash, $user['uId']]);

        // 4. Mark OTP as verified
        $updateOtp = $db->prepare("UPDATE otp_logs SET oVerified = 1 WHERE oId = ?");
        $updateOtp->execute([$otpRecord['oId']]);

        Response::success([
            'message' => 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.'
        ]);
    }

    public function generateOTP(int $length = 6): string {
        return (string) rand(pow(10, $length-1), pow(10, $length)-1);
    }

    public function sendOTP (string $phone, string $otp) {
        $apiKey = "";
    }
}
