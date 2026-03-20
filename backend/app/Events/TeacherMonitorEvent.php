<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TeacherMonitorEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $teacherId;
    public $eventType;
    public $data;

    /**
     * Event types for teacher monitoring:
     * - student_started_test: Học viên bắt đầu làm bài
     * - student_disconnected: Học viên mất kết nối
     * - student_reconnected: Học viên kết nối lại
     * - student_submitted: Học viên nộp bài
     * - test_statistics: Thống kê real-time
     * - suspicious_activity: Hoạt động đáng nghi
     */
    public function __construct($teacherId, $eventType, $data = [])
    {
        $this->teacherId = $teacherId;
        $this->eventType = $eventType;
        $this->data = $data;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn()
    {
        return new PrivateChannel('teacher-monitor.' . $this->teacherId);
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith()
    {
        return [
            'type' => $this->eventType,
            'teacher_id' => $this->teacherId,
            'data' => $this->data,
            'timestamp' => now()->toISOString(),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs()
    {
        return 'teacher.monitor.event';
    }
}