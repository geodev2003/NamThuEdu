<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTeacherActivityLogsTable extends Migration
{
    public function up()
    {
        Schema::create('teacher_activity_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('teacher_id');
            // Action key — eg: exam.create, exam.update, exam.delete, student.add,
            // student.update, student.delete, assignment.create, grading.complete,
            // blog.publish, ...
            $table->string('action', 64)->index();
            // Loại entity: exam | student | assignment | submission | blog | other
            $table->string('entity_type', 32)->nullable()->index();
            $table->unsignedBigInteger('entity_id')->nullable();
            // Mô tả ngắn để show ngay (FE đã build sẵn để giảm load)
            $table->string('detail', 255)->nullable();
            // Meta JSON cho thông tin phụ (tên đề, target group, ...)
            $table->json('meta')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['teacher_id', 'created_at']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('teacher_activity_logs');
    }
}
