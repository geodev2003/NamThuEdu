<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Thêm cột `ielts_skill` để phân biệt đề IELTS theo skill cụ thể.
 *
 * Concept mới (theo study4.com):
 *   • 1 đề = 1 skill duy nhất (listening | reading | writing | speaking)
 *   • Học viên chọn chế độ Practice (chọn sections) hoặc Full test (làm liên tục)
 *   • Không có "full 4 skills" trong 1 record exam
 *
 * Cột `eSkill` đã có nhưng dùng cho VSTEP (string giá trị "Listening", "Reading"...).
 * Cột mới `ielts_skill` dùng enum chuẩn (lowercase) để query/filter chính xác.
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::table('exams', function (Blueprint $table) {
            // ielts_skill: enum 4 giá trị, nullable (vì các đề non-IELTS không có)
            if (!Schema::hasColumn('exams', 'ielts_skill')) {
                $table->enum('ielts_skill', ['listening', 'reading', 'writing', 'speaking'])
                    ->nullable()
                    ->after('ielts_test_type')
                    ->comment('Skill của đề IELTS (1 đề = 1 skill)');
            }
        });

        // Index để filter nhanh: WHERE eType=IELTS_ACADEMIC AND ielts_skill=listening
        Schema::table('exams', function (Blueprint $table) {
            if (!Schema::hasColumn('exams', 'ielts_skill')) return;
            try {
                $table->index(['ielts_test_type', 'ielts_skill'], 'idx_ielts_type_skill');
            } catch (\Throwable $e) {
                // Index có thể đã tồn tại — bỏ qua
            }
        });
    }

    public function down(): void
    {
        Schema::table('exams', function (Blueprint $table) {
            try {
                $table->dropIndex('idx_ielts_type_skill');
            } catch (\Throwable $e) {
                // ignore
            }
            if (Schema::hasColumn('exams', 'ielts_skill')) {
                $table->dropColumn('ielts_skill');
            }
        });
    }
};
