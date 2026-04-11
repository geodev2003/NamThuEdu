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
}
