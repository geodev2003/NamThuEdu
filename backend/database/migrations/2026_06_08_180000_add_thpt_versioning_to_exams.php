<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Versioning cho đề THPT đã published:
 *
 *  - thpt_config        : bản LIVE — học viên đang/sẽ làm
 *  - thpt_draft_config  : bản NHÁP đang sửa — chỉ teacher thấy
 *  - thpt_version       : số thứ tự version hiện tại của thpt_config (1, 2, 3…)
 *  - thpt_versions      : lịch sử các version cũ
 *      [{ version: 1, published_at: "...", config: {...} }, ...]
 *
 * Khi teacher click "Xuất bản bản mới":
 *   - Snapshot thpt_config (cùng thpt_version) vào thpt_versions[]
 *   - Move thpt_draft_config -> thpt_config
 *   - thpt_draft_config = null
 *   - thpt_version += 1
 *
 * Submission tạo: snapshot exam.thpt_config vào submission_payload['exam_snapshot']
 * Submission grade/review: luôn dùng snapshot trong submission_payload, không
 * đụng exam.thpt_config hiện tại → không bị ảnh hưởng nếu đề được publish version mới.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('exams', function (Blueprint $table) {
            $table->json('thpt_draft_config')->nullable()->after('thpt_config');
            $table->unsignedInteger('thpt_version')->default(0)->after('thpt_draft_config');
            $table->json('thpt_versions')->nullable()->after('thpt_version');
        });

        // Đề đã published trước migration này coi như version 1
        \DB::table('exams')
            ->where('eType', 'THPT')
            ->where('eStatus', 'published')
            ->update(['thpt_version' => 1]);
    }

    public function down(): void
    {
        Schema::table('exams', function (Blueprint $table) {
            $table->dropColumn(['thpt_draft_config', 'thpt_version', 'thpt_versions']);
        });
    }
};
