<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Tạo bảng kids_exam_templates và kids_task_definitions
     * để lưu trữ metadata về các loại đề thi và task types
     */
    public function up(): void
    {
        // Bảng kids_exam_templates: Lưu metadata về các loại đề thi (Starters, Movers, Flyers)
        Schema::create('kids_exam_templates', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // yle_starters, yle_movers, yle_flyers
            $table->string('name'); // Cambridge YLE Starters
            $table->json('config'); // Lưu toàn bộ config dạng JSON
            // Structure:
            // {
            //   "level": "Pre A1",
            //   "age_range": "6-8 years",
            //   "vocabulary_size": 350,
            //   "skills": ["listening", "reading", "writing", "speaking"],
            //   "parts": [...],
            //   "duration": 45,
            //   "description": "..."
            // }
            $table->timestamps();
        });

        // Bảng kids_task_definitions: Lưu metadata về các dạng bài (task types)
        Schema::create('kids_task_definitions', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // listen_and_draw_lines, look_and_read, etc.
            $table->string('name'); // Listen and Draw Lines
            $table->json('definition'); // Lưu toàn bộ definition dạng JSON
            // Structure:
            // {
            //   "skill": "listening",
            //   "icon": "🎧",
            //   "instructions": "Nghe và nối tên với đúng người",
            //   "applicable_levels": ["starters", "movers", "flyers"],
            //   "example_structure": {...}
            // }
            $table->timestamps();
        });

        // Bảng kids_media: Lưu media files (audio, images) cho kids exams
        Schema::create('kids_media', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('exam_id')->nullable();
            $table->unsignedBigInteger('question_id')->nullable();
            $table->enum('media_type', ['audio', 'image']);
            $table->string('file_url');
            $table->string('file_name');
            $table->integer('file_size')->nullable();
            $table->string('mime_type')->nullable();
            $table->timestamps();

            $table->foreign('exam_id')->references('eId')->on('exams')->onDelete('cascade');
            $table->foreign('question_id')->references('qId')->on('questions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kids_media');
        Schema::dropIfExists('kids_task_definitions');
        Schema::dropIfExists('kids_exam_templates');
    }
};
