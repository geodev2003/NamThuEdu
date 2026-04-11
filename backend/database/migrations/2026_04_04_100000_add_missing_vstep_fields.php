<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Thêm các field còn thiếu cho VSTEP questions:
     * - qAudio_duration: Thời lượng audio (giây) cho listening questions
     * - qSkill: Alternative field name cho qSection (để tương thích với frontend)
     */
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            // Add qPart field for VSTEP structure (Part 1, Part 2, Part 3)
            $table->integer('qPart')
                  ->nullable()
                  ->after('qSection_order')
                  ->comment('Part number for VSTEP structure (1, 2, 3, etc.)');
            
            // Add audio duration field for listening questions
            $table->integer('qAudio_duration')
                  ->nullable()
                  ->after('qMedia_url')
                  ->comment('Audio duration in seconds for listening questions');
            
            // Add qSkill as alternative to qSection (for frontend compatibility)
            $table->string('qSkill', 50)
                  ->nullable()
                  ->after('qSection')
                  ->comment('Alternative field name for qSection (listening, reading, writing, speaking)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn(['qPart', 'qAudio_duration', 'qSkill']);
        });
    }
};
