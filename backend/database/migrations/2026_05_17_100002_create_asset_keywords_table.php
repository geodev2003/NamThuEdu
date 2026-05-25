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
        Schema::create('asset_keywords', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('asset_id');
            $table->string('keyword', 100);
            
            $table->timestamp('created_at')->useCurrent();
            
            // Foreign key
            $table->foreign('asset_id')
                  ->references('id')
                  ->on('contributor_assets')
                  ->onDelete('cascade');
            
            // Unique constraint
            $table->unique(['asset_id', 'keyword'], 'unique_asset_keyword');
            
            // Index
            $table->index('keyword', 'idx_keyword');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_keywords');
    }
};
