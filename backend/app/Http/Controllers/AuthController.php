<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\RateLimiter;
use App\Models\User;
use App\Models\OtpLog;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    /**
     * POST /api/login
     * Đăng nhập bằng SĐT + mật khẩu
     */
    public function login(Request $request)
    {
        // Rate limit theo IP
        $key = 'login:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Quá nhiều lần thử. Vui lòng thử lại sau.'
            ], 429);
        }

        // Validation
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Body request không hợp lệ',
                'errors' => $validator->errors()
            ], 400);
        }

        // Tìm user theo SĐT
        $user = User::where('uPhone', $request->phone)
                   ->whereNull('uDeleted_at')
                   ->first();

        if (!$user || !Hash::check($request->password, $user->uPassword)) {
            RateLimiter::hit($key, 60);
            return response()->json([
                'status' => 'error',
                'message' => 'Số điện thoại hoặc mật khẩu không đúng'
            ], 401);
        }

        if ($user->uStatus !== 'active') {
            return response()->json([
                'status' => 'error',
                'message' => 'Tài khoản chưa được kích hoạt'
            ], 403);
        }

        // Tính tuổi
        $age = $user->uDoB ? now()->diffInYears($user->uDoB) : null;

        // Tạo token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Clear rate limit on successful login
        RateLimiter::clear($key);

        return response()->json([
            'status' => 'success',
            'data' => [
                'access_token' => $token,
                'user' => [
                    'id' => $user->uId,
                    'name' => $user->uName,
                    'phone' => $user->uPhone,
                    'age' => $age,
                    'role' => $user->uRole
                ]
            ]
        ]);
    }

    /**
     * POST /api/users/accept
     * Yêu cầu OTP để reset mật khẩu
     */
    public function accept(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Số điện thoại không đúng'
            ], 401);
        }

        // Kiểm tra user tồn tại
        $user = User::where('uPhone', $request->phone)
                   ->whereNull('uDeleted_at')
                   ->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy số điện thoại trên cơ sở dữ liệu'
            ], 404);
        }

        // Tạo OTP
        $otp = $this->generateOTP(6);
        $expiredAt = now()->addMinutes(5);

        $otpLog = OtpLog::create([
            'userId' => $user->uId,
            'oCode' => $otp,
            'oExpired_at' => $expiredAt,
            'oVerified' => false,
        ]);

        if (!$otpLog) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tạo mã OTP thất bại'
            ], 500);
        }

        // TODO: Gửi SMS thực tế ở đây
        // $this->sendOTP($request->phone, $otp);

        return response()->json([
            'status' => 'success',
            'data' => [
                'message' => 'Mã OTP đã được gửi đến số điện thoại của bạn (Mock: ' . $otp . ')',
                'debug_otp' => $otp // For testing purpose
            ]
        ]);
    }

    /**
     * POST /api/users/reset-password
     * Đặt lại mật khẩu bằng OTP
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'otp' => 'required|string|size:6',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vui lòng nhập đầy đủ thông tin',
                'errors' => $validator->errors()
            ], 400);
        }

        // Tìm user
        $user = User::where('uPhone', $request->phone)
                   ->whereNull('uDeleted_at')
                   ->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Người dùng không tồn tại'
            ], 404);
        }

        // Verify OTP
        $otpRecord = OtpLog::where('userId', $user->uId)
                          ->where('oCode', $request->otp)
                          ->where('oVerified', false)
                          ->where('oExpired_at', '>', now())
                          ->orderBy('oCreated_at', 'desc')
                          ->first();

        if (!$otpRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mã OTP không chính xác hoặc đã hết hạn'
            ], 400);
        }

        // Update password
        $user->update([
            'uPassword' => Hash::make($request->password)
        ]);

        // Mark OTP as verified
        $otpRecord->update(['oVerified' => true]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'message' => 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.'
            ]
        ]);
    }

    /**
     * POST /api/logout
     * Đăng xuất
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng xuất thành công'
        ]);
    }

    /**
     * Generate OTP
     */
    private function generateOTP(int $length = 6): string
    {
        return (string) rand(pow(10, $length - 1), pow(10, $length) - 1);
    }

    /**
     * Send OTP via SMS (Mock implementation)
     */
    private function sendOTP(string $phone, string $otp): bool
    {
        // TODO: Implement actual SMS sending
        // Example: Twilio, AWS SNS, etc.
        return true;
    }
}
