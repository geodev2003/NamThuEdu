<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AdminSetting;
use App\Models\AdminNotification;

class AdminSystemController extends Controller
{
    /**
     * Lấy danh sách cài đặt
     */
    public function getSettings(Request $request)
    {
        $settings = AdminSetting::all()->pluck('value', 'key')->toArray();

        // Default values nếu chưa có trong DB
        if (!isset($settings['autoRefresh'])) {
            $settings['autoRefresh'] = true;
        } else {
            $settings['autoRefresh'] = filter_var($settings['autoRefresh'], FILTER_VALIDATE_BOOLEAN);
        }

        if (!isset($settings['emailAlert'])) {
            $settings['emailAlert'] = false;
        } else {
            $settings['emailAlert'] = filter_var($settings['emailAlert'], FILTER_VALIDATE_BOOLEAN);
        }

        return response()->json([
            'status' => 'success',
            'data' => $settings
        ]);
    }

    /**
     * Cập nhật cài đặt
     */
    public function updateSettings(Request $request)
    {
        $payload = $request->except(['_token', '_method']);
        
        foreach ($payload as $key => $value) {
            AdminSetting::updateOrCreate(
                ['key' => $key],
                ['value' => is_bool($value) ? ($value ? 'true' : 'false') : (string)$value]
            );
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật cài đặt thành công.'
        ]);
    }

    /**
     * Lấy nội dung pháp lý (public, không cần auth)
     */
    public function getLegalContent(Request $request)
    {
        $vi = AdminSetting::where('key', 'legal_vi')->value('value');
        $en = AdminSetting::where('key', 'legal_en')->value('value');

        return response()->json([
            'status' => 'success',
            'data' => [
                'legal_vi' => $vi ? json_decode($vi, true) : null,
                'legal_en' => $en ? json_decode($en, true) : null,
            ]
        ]);
    }

    /**
     * Lấy danh sách thông báo admin
     */
    public function getNotifications(Request $request)
    {
        $notifications = AdminNotification::orderBy('created_at', 'desc')->take(50)->get();

        // Tự động sinh mảng giả lập nếu bảng trống (Ví dụ cho lần đầu reload)
        if ($notifications->isEmpty()) {
            $mockNotifications = [
                ['title' => 'Bài viết chờ duyệt', 'body' => 'Có nội dung mới cần kiểm duyệt.', 'is_read' => false],
                ['title' => 'Đề thi chờ duyệt', 'body' => 'Đang có đề thi cần xử lý.', 'is_read' => false],
                ['title' => 'Hệ thống ổn định', 'body' => 'Không phát hiện lỗi nghiêm trọng.', 'is_read' => true],
            ];
            foreach ($mockNotifications as $mock) {
                AdminNotification::create($mock);
            }
            $notifications = AdminNotification::orderBy('created_at', 'desc')->take(50)->get();
        }

        // Map timestamp for UI
        $mapped = $notifications->map(function($n) {
            return [
                'id' => $n->id,
                'title' => $n->title,
                'body' => $n->body,
                'is_read' => (bool)$n->is_read,
                'time' => $n->created_at ? $n->created_at->diffForHumans() : 'Vừa xong'
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $mapped
        ]);
    }

    /**
     * Đánh dấu đã đọc
     */
    public function markNotificationRead($id)
    {
        $notification = AdminNotification::find($id);
        if ($notification) {
            $notification->is_read = true;
            $notification->save();
        }
        return response()->json([
            'status' => 'success'
        ]);
    }

    /**
     * GET /admin/profile
     * Lấy thông tin hồ sơ admin hiện tại
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'status' => 'success',
            'data' => [
                'id'         => $user->id,
                'name'       => $user->uName ?? $user->name ?? 'Administrator',
                'phone'      => $user->uPhone ?? $user->phone ?? '',
                'email'      => $user->uEmail ?? $user->email ?? '',
                'role'       => $user->uRole ?? $user->role ?? 'admin',
                'created_at' => $user->created_at ? $user->created_at->format('d/m/Y') : null,
                'last_login' => $user->last_login ?? null,
            ]
        ]);
    }

    /**
     * PUT /admin/profile
     * Cập nhật tên hiển thị và email
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name'  => 'nullable|string|max:100',
            'email' => 'nullable|email|max:150',
        ]);

        $user = $request->user();
        if ($request->filled('name')) {
            $user->uName = $request->name;
        }
        if ($request->filled('email')) {
            $user->uEmail = $request->email;
        }
        $user->save();

        return response()->json([
            'status'  => 'success',
            'message' => 'Cập nhật hồ sơ thành công',
            'data'    => [
                'name'  => $user->uName ?? $user->name,
                'email' => $user->uEmail ?? $user->email,
            ]
        ]);
    }

    /**
     * GET /admin/profile/sessions
     * Danh sách phiên đăng nhập (Sanctum tokens)
     */
    public function getSessions(Request $request)
    {
        $user    = $request->user();
        $current = $user->currentAccessToken();
        $tokens  = $user->tokens()->orderByDesc('last_used_at')->take(20)->get();

        $data = $tokens->map(function ($token) use ($current, $request) {
            $deviceName = $token->name;
            $isCurrent = $current && $token->id === $current->id;

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
                'is_current'   => $isCurrent,
                'created_at'   => $token->created_at ? $token->created_at->diffForHumans() : null,
                'last_used_at' => $token->last_used_at ? $token->last_used_at->diffForHumans() : 'Chưa sử dụng',
            ];
        });

        return response()->json([
            'status' => 'success',
            'data'   => $data,
        ]);
    }

    /**
     * DELETE /admin/profile/sessions/{id}
     * Thu hồi một phiên đăng nhập cụ thể
     */
    public function revokeSession(Request $request, $id)
    {
        $user    = $request->user();
        $current = $user->currentAccessToken();

        if ($id == $current->id) {
            return response()->json(['status' => 'error', 'message' => 'Không thể thu hồi phiên hiện tại'], 400);
        }

        $user->tokens()->where('id', $id)->delete();

        return response()->json(['status' => 'success', 'message' => 'Đã thu hồi phiên đăng nhập']);
    }

    /**
     * DELETE /admin/profile/sessions
     * Thu hồi tất cả phiên trừ phiên hiện tại
     */
    public function revokeAllSessions(Request $request)
    {
        $user    = $request->user();
        $current = $user->currentAccessToken();

        $user->tokens()->where('id', '!=', $current->id)->delete();

        return response()->json(['status' => 'success', 'message' => 'Đã thu hồi tất cả phiên khác']);
    }
}
