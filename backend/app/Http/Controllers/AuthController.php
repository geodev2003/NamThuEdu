<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\OtpLog;
use Laravel\Sanctum\PersonalAccessToken;
use App\Services\GamificationService;

class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/register",
     *     tags={"Authentication"},
     *     summary="User registration",
     *     description="Register new student user with age-based theme",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","phone","password","password_confirmation"},
     *             @OA\Property(property="name", type="string", example="Nguyễn Văn A"),
     *             @OA\Property(property="phone", type="string", example="0336695863"),
     *             @OA\Property(property="email", type="string", example="example@gmail.com"),
     *             @OA\Property(property="password", type="string", example="password123"),
     *             @OA\Property(property="password_confirmation", type="string", example="password123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Registration successful"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Validation error"
     *     )
     * )
     * 
     * POST /api/register
     * Đăng ký tài khoản học sinh mới
     */
    /**
     * @OA\Post(
     *     path="/register",
     *     tags={"Authentication"},
     *     summary="User registration (DISABLED)",
     *     description="Self-registration is disabled. Students must be created by Admin/Teacher.",
     *     @OA\Response(
     *         response=403,
     *         description="Registration disabled"
     *     )
     * )
     * 
     * POST /api/register
     * DISABLED: Học viên không thể tự đăng ký
     * Chỉ Admin/Teacher mới có thể tạo tài khoản học viên
     */
    public function register(Request $request)
    {
        return response()->json([
            'status' => 'error',
            'message' => 'Chức năng đăng ký đã bị vô hiệu hóa. Vui lòng liên hệ Admin hoặc Giáo viên để được tạo tài khoản.',
            'code' => 'REGISTRATION_DISABLED'
        ], 403);
    }


    /**
     * @OA\Get(
     *     path="/user/profile",
     *     tags={"User"},
     *     summary="Get user profile",
     *     description="Get complete user profile including age_group and theme_preference",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Profile retrieved successfully"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     * 
     * GET /api/user/profile
     * Lấy thông tin profile đầy đủ
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        $age = $user->uDoB ? now()->diffInYears($user->uDoB) : null;

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $user->uId,
                'name' => $user->uName,
                'phone' => $user->uPhone,
                'email' => $user->uEmail ?? null,
                'age' => $age,
                'role' => $user->uRole,
                'age_group' => $user->age_group,
                'date_of_birth' => $user->uDoB ? $user->uDoB->format('Y-m-d') : null,
                'theme_preference' => $user->theme_preference ?? 'auto',
                'theme_updated_at' => $user->theme_updated_at,
                'avatar_url' => $user->avatar_url,
                'avatar' => $user->avatar_url,
            ]
        ]);
    }

    /**
     * Calculate age group from age
     */
    private function calculateAgeGroup(int $age): string
    {
        if ($age >= 6 && $age <= 12) {
            return 'kids';
        } elseif ($age >= 13 && $age <= 17) {
            return 'teens';
        }
        return 'adults';
    }
    /**
     * @OA\Post(
     *     path="/login",
     *     tags={"Authentication"},
     *     summary="User login",
     *     description="Authenticate user and return access token",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"phone","password"},
     *             @OA\Property(property="phone", type="string", example="0336695863"),
     *             @OA\Property(property="password", type="string", example="password123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login successful"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Invalid credentials"
     *     )
     * )
     * 
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

        // Tìm user theo SĐT với class info
        $user = User::with(['class.teacher'])
                   ->where('uPhone', $request->phone)
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
                'message' => 'Tài khoản đang bị khoá. Vui lòng liên hệ quản trị viên để được hỗ trợ.'
            ], 403);
        }

        // Tính tuổi
        $age = $user->uDoB ? now()->diffInYears($user->uDoB) : null;

        // Build human-readable device name from User-Agent
        $ua        = $request->userAgent() ?? '';
        $browser   = 'Unknown Browser';
        $os        = 'Unknown OS';
        if (preg_match('/(Edg|OPR|Chrome|Firefox|Safari|MSIE|Trident)/i', $ua, $bm)) {
            $browserMap = ['Edg' => 'Edge', 'OPR' => 'Opera', 'Trident' => 'IE'];
            $browser = $browserMap[$bm[1]] ?? ucfirst($bm[1]);
        }
        if (preg_match('/(iPhone|iPad|Android|Windows|Macintosh|Linux|Ubuntu)/i', $ua, $om)) {
            $osMap = ['Macintosh' => 'macOS', 'iPhone' => 'iPhone', 'iPad' => 'iPad'];
            $os = $osMap[$om[1]] ?? ucfirst($om[1]);
        }
        $deviceName = "$browser trên $os";

        // Tạo access token (sống 24h theo config sanctum.php)
        $newToken = $user->createToken($deviceName);
        $token = $newToken->plainTextToken;
        // Save client IP for session tracking
        $newToken->accessToken->forceFill(['last_used_ip' => $request->ip()])->save();

        // Clear rate limit on successful login
        RateLimiter::clear($key);

        // Update daily streak for students
        if ($user->uRole === 'student') {
            try {
                (new GamificationService())->updateStreak($user->uId);
            } catch (\Exception $e) {
                \Log::warning('Streak update failed on login: ' . $e->getMessage());
            }
        }

        // Tạo refresh token (sống 30 ngày)
        $refreshToken = Str::random(64);
        $user->update([
            'refresh_token'            => hash('sha256', $refreshToken),
            'refresh_token_expires_at' => now()->addDays(30),
        ]);

        // Prepare user data
        $userData = [
            'id'    => $user->uId,
            'name'  => $user->uName,
            'phone' => $user->uPhone,
            'age'   => $age,
            'role'  => $user->uRole,
            'age_group' => $user->age_group ?? 'teens',
            'class_id' => $user->class_id,
            'theme_preference' => $user->theme_preference ?? 'auto',
            'avatar_url' => $user->avatar_url,
            'avatar' => $user->avatar_url,
        ];

        // (Class system deprecated — học viên giờ chỉ thuộc age_group, không
        // còn thuộc lớp cố định. Khối expose class info đã được gỡ khỏi đây.)

        return response()->json([
            'status' => 'success',
            'data' => [
                'access_token'  => $token,
                'token_type'    => 'Bearer',
                'expires_in'    => 86400,
                'refresh_token' => $refreshToken,
                'user' => $userData
            ]
        ]);
    }

    /**
     * @OA\Post(
     *     path="/users/accept",
     *     tags={"Authentication"},
     *     summary="Request OTP for password reset",
     *     description="Request OTP code to reset password",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"phone"},
     *             @OA\Property(property="phone", type="string", example="0336695863")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="OTP sent successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Phone number not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Invalid phone number"
     *     )
     * )
     * 
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
     * @OA\Post(
     *     path="/users/reset-password",
     *     tags={"Authentication"},
     *     summary="Reset password with OTP",
     *     description="Reset user password using OTP verification",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"phone", "otp", "password"},
     *             @OA\Property(property="phone", type="string", example="0336695863"),
     *             @OA\Property(property="otp", type="string", example="123456"),
     *             @OA\Property(property="password", type="string", example="newpassword123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Password reset successfully"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid OTP or validation error"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found"
     *     )
     * )
     * 
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
     * @OA\Post(
     *     path="/logout",
     *     tags={"Authentication"},
     *     summary="User logout",
     *     description="Logout user and invalidate token",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Logout successful"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     * 
     * POST /api/logout
     * Đăng xuất
     */
    public function logout(Request $request)
    {
        // Thu hồi access token
        $request->user()->currentAccessToken()->delete();

        // Xóa luôn refresh token
        $request->user()->update([
            'refresh_token'            => null,
            'refresh_token_expires_at' => null,
        ]);

        return response()->json([
            'status'  => 'success',
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
