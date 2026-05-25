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
        Schema::create('asset_metadata_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('asset_id');
            
            $table->string('field_name', 50);
            $table->text('old_value')->nullable();
            $table->text('new_value')->nullable();
            
            $table->unsignedBigInteger('changed_by');
            $table->timestamp('changed_at')->useCurrent();
            
            // Foreign keys
            $table->foreign('asset_id')
                  ->references('id')
                  ->on('contributor_assets')
                  ->onDelete('cascade');
                  
            $table->foreign('changed_by')
                  ->references('uId')
                  ->on('users')
                  ->onDelete('cascade');
            
            // Indexes
            $table->index('asset_id', 'idx_asset_id');
            $table->index('changed_at', 'idx_changed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_metadata_history');
    }
};
