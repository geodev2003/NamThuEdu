<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\TestAssignment;
use App\Models\AssignmentReminder;
use App\Models\User;
use App\Services\PushNotificationService;
use Carbon\Carbon;

/**
 * Gửi thông báo "trước giờ" cho các assignment đã hẹn.
 *
 * Logic: với assignment có taNotify_before_minutes và chưa taNotified_at,
 * mốc nhắc = (taStart_time ?? taDeadline) - notify_before. Khi now() đã qua mốc
 * này (và chưa quá thời điểm gốc), bắn push + tạo AssignmentReminder cho từng
 * học viên thuộc đối tượng, rồi đánh dấu taNotified_at để không gửi trùng.
 */
class SendScheduledAssignmentReminders extends Command
{
    protected $signature = 'assignments:send-scheduled-reminders';

    protected $description = 'Gửi thông báo trước giờ cho bài tập đã hẹn lịch';

    public function handle()
    {
        $now = Carbon::now();

        $assignments = TestAssignment::with('exam')
            ->whereNull('taNotified_at')
            ->whereNotNull('taNotify_before_minutes')
            ->where(function ($q) {
                $q->whereNotNull('taStart_time')->orWhereNotNull('taDeadline');
            })
            ->get();

        $pushService = new PushNotificationService();
        $sentCount = 0;

        foreach ($assignments as $assignment) {
            $anchor = $assignment->taStart_time ?? $assignment->taDeadline;
            if (!$anchor) {
                continue;
            }

            $remindAt = $anchor->copy()->subMinutes($assignment->taNotify_before_minutes);

            // Chưa tới mốc nhắc → bỏ qua. Đã qua mốc gốc → vẫn gửi 1 lần (trễ còn hơn không).
            if ($now->lt($remindAt)) {
                continue;
            }

            $students = $this->resolveStudents($assignment);
            if ($students->isEmpty()) {
                $assignment->taNotified_at = $now;
                $assignment->save();
                continue;
            }

            $examTitle = $assignment->exam->eTitle ?? 'Bài tập';
            $whenText = $anchor->format('H:i d/m/Y');
            $message = "Bài tập \"{$examTitle}\" sẽ diễn ra lúc {$whenText}. Hãy chuẩn bị nhé!";

            foreach ($students as $student) {
                AssignmentReminder::create([
                    'assignment_id' => $assignment->taId,
                    'student_id'    => $student->uId,
                    'teacher_id'    => null,
                    'message'       => $message,
                ]);
            }

            try {
                $pushService->sendToUsers(
                    $students->pluck('uId')->toArray(),
                    '⏰ Sắp đến giờ làm bài',
                    $message,
                    ['url' => '/hoc-vien/bai-tap']
                );
            } catch (\Exception $e) {
                \Log::warning('Scheduled reminder push failed: ' . $e->getMessage());
            }

            $assignment->taNotified_at = $now;
            $assignment->save();
            $sentCount++;
        }

        $this->info("Đã gửi thông báo trước giờ cho {$sentCount} assignment.");
        return 0;
    }

    private function resolveStudents(TestAssignment $assignment)
    {
        if ($assignment->taTarget_type === 'class') {
            return User::where('class_id', $assignment->taTarget_id)
                ->where('uRole', 'student')
                ->whereNull('uDeleted_at')
                ->get();
        }

        return User::where('uId', $assignment->taTarget_id)
            ->where('uRole', 'student')
            ->whereNull('uDeleted_at')
            ->get();
    }
}
