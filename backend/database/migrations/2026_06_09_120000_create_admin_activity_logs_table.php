<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * admin_activity_logs — Audit log cho hành động của admin.
 *
 * Mirror cấu trúc teacher_activity_logs nhưng bổ sung các trường bảo mật/audit
 * cần thiết cho admin: method + path + ip + status_code (đến từ middleware tự ghi).
 */
class CreateAdminActivityLogsTable extends Migration
{
    public function up()
    {
        Schema::create('admin_activity_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('admin_id')->index();
            // Action key — eg: user.lock, user.unlock, exam.approve, post.reject,
            // settings.update, session.revoke, ...
            $table->string('action', 64)->index();
            // Loại entity: user | exam | post | category | template | setting | session | other
            $table->string('entity_type', 32)->nullable()->index();
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->string('detail', 255)->nullable();
            // Thông tin request (do middleware tự ghi)
            $table->string('method', 8)->nullable();
            $table->string('path', 255)->nullable();
            $table->string('ip', 45)->nullable();
            $table->unsignedSmallInteger('status_code')->nullable();
            // Meta JSON cho payload phụ
            $table->json('meta')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['admin_id', 'created_at']);
            $table->index(['entity_type', 'entity_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('admin_activity_logs');
    }
}
