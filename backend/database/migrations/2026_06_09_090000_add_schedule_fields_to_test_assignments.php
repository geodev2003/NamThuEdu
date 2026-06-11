<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bổ sung cho test_assignments khả năng:
 *  - taStart_time: thời điểm bài tập "mở" / diễn ra (giáo viên hẹn giờ).
 *  - taNotify_before_minutes: báo cho học viên trước bao nhiêu phút.
 *  - taNotified_at: đã bắn thông báo "trước giờ" chưa (tránh gửi trùng).
 *  - taInstructions: lời nhắn kèm theo khi giao.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('test_assignments', function (Blueprint $table) {
            $table->dateTime('taStart_time')->nullable()->after('taDeadline');
            $table->integer('taNotify_before_minutes')->nullable()->after('taStart_time');
            $table->timestamp('taNotified_at')->nullable()->after('taNotify_before_minutes');
            $table->text('taInstructions')->nullable()->after('taNotified_at');
        });
    }

    public function down(): void
    {
        Schema::table('test_assignments', function (Blueprint $table) {
            $table->dropColumn([
                'taStart_time',
                'taNotify_before_minutes',
                'taNotified_at',
                'taInstructions',
            ]);
        });
    }
};
