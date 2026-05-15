<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Sử dụng flexible schema với JSON để lưu trữ kids exam data
     * Tái sử dụng bảng exams và questions hiện có
     */
    public function up(): void
    {
        // Thêm các trường cần thiết vào bảng exams
        if (Schema::hasTable('exams')) {
            Schema::table('exams', function (Blueprint $table) {
            // Kids exam metadata - lưu dạng JSON để linh hoạt
            $table->json('kids_exam_config')->nullable()->after('ui_config');
            // Structure:
            // {
            //   "exam_type": "yle_starters|yle_movers|yle_flyers",
            //   "level": "Pre A1|A1|A2",
            //   "age_range": "6-8|8-11|9-12",
            //   "vocabulary_size": 350,
            //   "skills": ["listening", "reading", "writing", "speaking"],
            //   "total_parts": 9,
            //   "instructions": "..."
            // }
        });
        }

        // Thêm các trường cần thiết vào bảng questions
        if (Schema::hasTable('questions')) {
            Schema::table('questions', function (Blueprint $table) {
            // Kids task type và data - lưu dạng JSON
            $table->json('kids_task_config')->nullable()->after('feedback_config');
            // Structure:
            // {
            //   "task_type": "listen_and_draw_lines|unscramble_words|...",
            //   "task_name": "Listen and Draw Lines",
            //   "skill": "listening|reading|writing|speaking",
            //   "part_number": 1,
            //   "instructions": "Nghe và nối tên với đúng người",
            //   "task_data": {
            //     "audio_url": "...",
            //     "base_image_url": "...",
            //     "items": [...]
            //   },
            //   "correct_answer": {...},
            //   "scoring": {...}
            // }
        });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('questions')) {
            Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('kids_task_config');
        });
        }

        if (Schema::hasTable('exams')) {
            Schema::table('exams', function (Blueprint $table) {
            $table->dropColumn('kids_exam_config');
        });
        }
    }
};
