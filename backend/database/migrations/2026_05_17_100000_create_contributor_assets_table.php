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
        Schema::create('contributor_assets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('contributor_id');
            
            // File info
            $table->string('filename', 255);
            $table->string('file_path', 500);
            $table->unsignedInteger('file_size');
            $table->string('mime_type', 100);
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            
            // Metadata (editable by contributor)
            $table->string('title', 255)->nullable();
            $table->text('description')->nullable();
            $table->text('keywords')->nullable(); // JSON array
            $table->string('category_1', 100)->nullable();
            $table->string('category_2', 100)->nullable();
            
            // Status workflow
            $table->enum('status', [
                'draft', 
                'pending_review', 
                'approved', 
                'rejected', 
                'live', 
                'removed'
            ])->default('draft');
            
            // Timestamps
            $table->timestamp('uploaded_at')->useCurrent();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('published_at')->nullable();
            
            // Review info
            $table->unsignedBigInteger('reviewer_id')->nullable();
            $table->text('rejection_reason')->nullable();
            
            // Stats
            $table->unsignedInteger('views_count')->default(0);
            $table->unsignedInteger('downloads_count')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Foreign keys
            $table->foreign('contributor_id')
                  ->references('uId')
                  ->on('users')
                  ->onDelete('cascade');
                  
            $table->foreign('reviewer_id')
                  ->references('uId')
                  ->on('users')
                  ->onDelete('set null');
            
            // Indexes
            $table->index(['contributor_id', 'status'], 'idx_contributor_status');
            $table->index('status', 'idx_status');
            $table->index('submitted_at', 'idx_submitted_at');
            $table->index('approved_at', 'idx_approved_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contributor_assets');
    }
};
