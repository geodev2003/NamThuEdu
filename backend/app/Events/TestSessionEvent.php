<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TestSessionEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $submissionId;
    public $userId;
    public $eventType;
    public $data;

    /**
     * Event types:
     * - connected: Student kết nối WebSocket
     * - disconnected: Student mất kết nối (cúp điện/mất mạng)
     * - reconnected: Student kết nối lại
     * - answer_saved: Câu trả lời được lưu thành công
     * - time_sync: Đồng bộ thời gian từ server
     * - test_expired: Bài thi hết thời gian
     * - auto_submit_warning: Cảnh báo sắp tự động nộp bài
     * - connection_unstable: Kết nối không ổn định
     * - teacher_message: Tin nhắn từ giáo viên
     */
    public function __construct($submissionId, $userId, $eventType, $data = [])
    {
        $this->submissionId = $submissionId;
        $this->userId = $userId;
        $this->eventType = $eventType;
        $this->data = $data;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn()
    {
        return new PrivateChannel('test-session.' . $this->submissionId);
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith()
    {
        return [
            'type' => $this->eventType,
            'submission_id' => $this->submissionId,
            'user_id' => $this->userId,
            'data' => $this->data,
            'timestamp' => now()->toISOString(),
            'server_time' => now()->timestamp,
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs()
    {
        return 'test.session.event';
    }
}