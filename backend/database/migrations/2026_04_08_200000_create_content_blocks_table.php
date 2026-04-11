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
        // Create content_blocks table
        Schema::create('content_blocks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('exam_id');
            
            // Loại content: passage, audio, video, image, instruction
            $table->string('block_type', 50);
            
            // Nội dung chính (TEXT cho passage, URL cho audio/video/image)
            $table->text('content')->nullable();
            
            // Metadata linh hoạt (JSON)
            $table->json('metadata')->nullable();
            
            // Thứ tự hiển thị
            $table->integer('display_order')->default(0);
            
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('exam_id')->references('eId')->on('exams')->onDelete('cascade');
            
            // Indexes
            $table->index(['exam_id', 'display_order'], 'idx_exam_order');
            $table->index('block_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('content_blocks');
    }
};
