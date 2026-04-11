<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            // Link to content_blocks (nullable - không phải câu nào cũng cần)
            $table->unsignedBigInteger('content_block_id')->nullable()->after('exam_id');
            
            // Metadata linh hoạt (JSON) - chứa options, correct_answer, và mọi thứ khác
            $table->json('qData')->nullable()->after('qType');
            
            // Foreign key
            $table->foreign('content_block_id')->references('id')->on('content_blocks')->onDelete('set null');
            
            // Index
            $table->index('content_block_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropForeign(['content_block_id']);
            $table->dropIndex(['content_block_id']);
            $table->dropColumn(['content_block_id', 'qData']);
        });
    }
};
