<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_stats', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id')->unique();
            $table->integer('lessons_completed')->default(0);
            $table->integer('exams_taken')->default(0);
            $table->integer('practice_sessions')->default(0);
            $table->integer('total_points')->default(0);
            $table->decimal('average_score', 5, 2)->default(0)->comment('Điểm trung bình (%)');
            $table->integer('study_time_minutes')->default(0)->comment('Tổng thời gian học (phút)');
            $table->timestamps();
            
            $table->foreign('student_id')->references('uId')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_stats');
    }
};
