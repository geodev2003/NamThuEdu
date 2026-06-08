<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * @OA\Tag(
 *     name="Student Profile",
 *     description="API endpoints for student profile and settings management"
 * )
 */
class StudentProfileController extends Controller
{
    /**
     * @OA\Get(
     *     path="/student/profile",
     *     tags={"Student Profile"},
     *     summary="Get student profile",
     *     description="Retrieve the current student's profile information",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Profile retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'uId' => $user->uId,
                'uName' => $user->uName,
                'uPhone' => $user->uPhone,
                'uGender' => $user->uGender,
                'uAddress' => $user->uAddress,
                'uDoB' => $user->uDoB ? $user->uDoB->format('Y-m-d') : null,
                'avatar_url' => $user->avatar_url,
                'bio' => $user->bio,
                'age_group' => $user->age_group,
                'theme_preference' => $user->theme_preference,
                'language_preference' => $user->language_preference ?? 'vi',
                'uCreated_at' => $user->uCreated_at,
            ]
        ]);
    }

    /**
     * @OA\Put(
     *     path="/student/profile",
     *     tags={"Student Profile"},
     *     summary="Update student profile",
     *     description="Update the current student's profile information",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="uName", type="string", example="Nguyen Van A"),
     *             @OA\Property(property="uGender", type="boolean", example=true),
     *             @OA\Property(property="uAddress", type="string", example="Ha Noi"),
     *             @OA\Property(property="uDoB", type="string", format="date", example="2000-01-15"),
     *             @OA\Property(property="bio", type="string", example="Học viên IELTS")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Profile updated successfully"),
     *     @OA\Response(response=400, description="Validation error"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'uName' => 'sometimes|string|max:150',
            'uGender' => 'sometimes|boolean',
            'uAddress' => 'sometimes|nullable|string|max:500',
            'uDoB' => 'sometimes|nullable|date|before:today',
            'bio' => 'sometimes|nullable|string|max:500',
        ], [
            'uName.max' => 'Tên không được vượt quá 150 ký tự.',
            'uAddress.max' => 'Địa chỉ không được vượt quá 500 ký tự.',
            'uDoB.date' => 'Ngày sinh không hợp lệ.',
            'uDoB.before' => 'Ngày sinh phải trước ngày hôm nay.',
            'bio.max' => 'Giới thiệu không được vượt quá 500 ký tự.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            $updateData = $request->only(['uName', 'uGender', 'uAddress', 'uDoB', 'bio']);
            
            foreach ($updateData as $key => $value) {
                if ($value !== null) {
                    $user->$key = $value;
                }
            }
            
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật thông tin thành công.',
                'data' => [
                    'uId' => $user->uId,
                    'uName' => $user->uName,
                    'uPhone' => $user->uPhone,
                    'uGender' => $user->uGender,
                    'uAddress' => $user->uAddress,
                    'uDoB' => $user->uDoB ? $user->uDoB->format('Y-m-d') : null,
                    'avatar_url' => $user->avatar_url,
                    'bio' => $user->bio,
                    'age_group' => $user->age_group,
                    'theme_preference' => $user->theme_preference,
                    'language_preference' => $user->language_preference ?? 'vi',
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi cập nhật thông tin.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/student/profile/avatar",
     *     tags={"Student Profile"},
     *     summary="Upload avatar",
     *     description="Upload a new avatar image for the student",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(property="avatar", type="string", format="binary", description="Avatar image file (max 2MB)")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=200, description="Avatar uploaded successfully"),
     *     @OA\Response(response=400, description="Validation error"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function uploadAvatar(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ], [
            'avatar.required' => 'Vui lòng chọn file ảnh.',
            'avatar.image' => 'File phải là hình ảnh.',
            'avatar.mimes' => 'Định dạng ảnh phải là: jpeg, png, jpg, gif.',
            'avatar.max' => 'Kích thước ảnh không được vượt quá 2MB.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            // Delete old avatar if exists
            if ($user->avatar_url) {
                $oldPath = str_replace('/storage/', '', $user->avatar_url);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Generate new filename
            $file = $request->file('avatar');
            $extension = $file->getClientOriginalExtension();
            $filename = $user->uId . '_' . time() . '.' . $extension;

            // Store new avatar
            $path = $file->storeAs('avatars', $filename, 'public');

            // Update user avatar_url
            $user->avatar_url = '/storage/' . $path;
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Upload avatar thành công.',
                'data' => [
                    'avatar_url' => $user->avatar_url
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi upload avatar.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/student/profile/avatar",
     *     tags={"Student Profile"},
     *     summary="Delete avatar",
     *     description="Delete the current avatar and reset to default",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Avatar deleted successfully"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function deleteAvatar(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        try {
            if ($user->avatar_url) {
                $oldPath = str_replace('/storage/', '', $user->avatar_url);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
                
                $user->avatar_url = null;
                $user->save();
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa avatar thành công.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi xóa avatar.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/student/profile/password",
     *     tags={"Student Profile"},
     *     summary="Change password",
     *     description="Change the student's password",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"current_password", "new_password", "new_password_confirmation"},
     *             @OA\Property(property="current_password", type="string", example="oldpass123"),
     *             @OA\Property(property="new_password", type="string", example="newpass456"),
     *             @OA\Property(property="new_password_confirmation", type="string", example="newpass456")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Password changed successfully"),
     *     @OA\Response(response=400, description="Validation error or wrong password"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
            'new_password_confirmation' => 'required|string',
        ], [
            'current_password.required' => 'Vui lòng nhập mật khẩu hiện tại.',
            'new_password.required' => 'Vui lòng nhập mật khẩu mới.',
            'new_password.min' => 'Mật khẩu mới phải có ít nhất 6 ký tự.',
            'new_password.confirmed' => 'Xác nhận mật khẩu không khớp.',
            'new_password_confirmation.required' => 'Vui lòng xác nhận mật khẩu mới.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        // Verify current password
        if (!Hash::check($request->current_password, $user->uPassword)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mật khẩu hiện tại không đúng.'
            ], 400);
        }

        // Check if new password is same as current
        if (Hash::check($request->new_password, $user->uPassword)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mật khẩu mới phải khác mật khẩu hiện tại.'
            ], 400);
        }

        try {
            $user->uPassword = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Đổi mật khẩu thành công.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi đổi mật khẩu.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/student/settings",
     *     tags={"Student Profile"},
     *     summary="Get settings",
     *     description="Get the student's app settings (theme, language)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Settings retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="theme_preference", type="string", example="auto"),
     *                 @OA\Property(property="language_preference", type="string", example="vi"),
     *                 @OA\Property(property="age_group", type="string", example="adults")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function getSettings(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'theme_preference' => $user->theme_preference ?? 'auto',
                'language_preference' => $user->language_preference ?? 'vi',
                'age_group' => $user->age_group,
            ]
        ]);
    }

    /**
     * @OA\Put(
     *     path="/student/settings",
     *     tags={"Student Profile"},
     *     summary="Update settings",
     *     description="Update the student's app settings (theme, language)",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="theme_preference", type="string", enum={"auto","kids","teens","adults"}, example="teens"),
     *             @OA\Property(property="language_preference", type="string", enum={"vi","en"}, example="vi")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Settings updated successfully"),
     *     @OA\Response(response=400, description="Validation error"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function updateSettings(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'theme_preference' => 'sometimes|in:auto,kids,teens,adults',
            'language_preference' => 'sometimes|in:vi,en',
        ], [
            'theme_preference.in' => 'Theme không hợp lệ. Chọn: auto, kids, teens, adults.',
            'language_preference.in' => 'Ngôn ngữ không hợp lệ. Chọn: vi, en.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            if ($request->has('theme_preference')) {
                $user->theme_preference = $request->theme_preference;
                $user->theme_updated_at = now();
            }

            if ($request->has('language_preference')) {
                $user->language_preference = $request->language_preference;
            }

            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật cài đặt thành công.',
                'data' => [
                    'theme_preference' => $user->theme_preference ?? 'auto',
                    'language_preference' => $user->language_preference ?? 'vi',
                    'age_group' => $user->age_group,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi cập nhật cài đặt.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * GET /api/student/profile/sessions
     * List active sessions/devices
     */
    public function getSessions(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->uRole !== 'student') {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $currentToken = $request->user()->currentAccessToken();

        $userId = $user->uId;
        $userType = get_class($user);

        $sessions = PersonalAccessToken::where('tokenable_id', $userId)
            ->where('tokenable_type', $userType)
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->orderByDesc('last_used_at')
            ->get()
            ->map(function ($token) use ($currentToken, $request) {
                $deviceName = $token->name;
                $isCurrent = $currentToken && $currentToken->id === $token->id;

                if ($deviceName === 'auth_token' || empty($deviceName)) {
                    if ($isCurrent) {
                        $ua = $request->userAgent() ?? '';
                        $browser = 'Unknown Browser';
                        $os = 'Unknown OS';
                        if (preg_match('/(Edg|OPR|Chrome|Firefox|Safari|MSIE|Trident)/i', $ua, $bm)) {
                            $browserMap = ['Edg' => 'Edge', 'OPR' => 'Opera', 'Trident' => 'IE'];
                            $browser = $browserMap[$bm[1]] ?? ucfirst($bm[1]);
                        }
                        if (preg_match('/(iPhone|iPad|Android|Windows|Macintosh|Linux|Ubuntu)/i', $ua, $om)) {
                            $osMap = ['Macintosh' => 'macOS', 'iPhone' => 'iPhone', 'iPad' => 'iPad'];
                            $os = $osMap[$om[1]] ?? ucfirst($om[1]);
                        }
                        $deviceName = "$browser trên $os";
                    } else {
                        $deviceName = 'Thiết bị khác (chưa rõ)';
                    }
                }

                return [
                    'id'           => $token->id,
                    'name'         => $deviceName,
                    'ip'           => $token->last_used_ip,
                    'last_used_at' => $token->last_used_at ? $token->last_used_at->toISOString() : null,
                    'created_at'   => $token->created_at->toISOString(),
                    'is_current'   => $isCurrent,
                ];
            });

        return response()->json(['status' => 'success', 'data' => $sessions]);
    }

    /**
     * DELETE /api/student/profile/sessions/{id}
     * Revoke a specific session
     */
    public function revokeSession(Request $request, int $id)
    {
        $user = $request->user();
        if (!$user || $user->uRole !== 'student') {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $token = PersonalAccessToken::where('id', $id)
            ->where('tokenable_id', $user->uId)
            ->where('tokenable_type', get_class($user))
            ->first();

        if (!$token) {
            return response()->json(['status' => 'error', 'message' => 'Phiên không tồn tại.'], 404);
        }

        $currentToken = $request->user()->currentAccessToken();
        if ($currentToken && $currentToken->id === $token->id) {
            return response()->json(['status' => 'error', 'message' => 'Không thể thu hồi phiên hiện tại.'], 400);
        }

        $token->delete();

        return response()->json(['status' => 'success', 'message' => 'Đã đăng xuất thiết bị.']);
    }

    /**
     * DELETE /api/student/profile/sessions
     * Revoke all sessions except current
     */
    public function revokeAllSessions(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->uRole !== 'student') {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $currentToken = $request->user()->currentAccessToken();

        $query = PersonalAccessToken::where('tokenable_id', $user->uId)
            ->where('tokenable_type', get_class($user));

        if ($currentToken) {
            $query->where('id', '!=', $currentToken->id);
        }

        $count = $query->count();
        $query->delete();

        return response()->json([
            'status'  => 'success',
            'message' => "Đã đăng xuất {$count} thiết bị khác.",
            'data'    => ['revoked_count' => $count],
        ]);
    }
}
