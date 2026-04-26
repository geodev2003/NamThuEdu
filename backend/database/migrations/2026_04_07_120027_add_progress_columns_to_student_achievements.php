<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('student_achievements')) {
            Schema::table('student_achievements', function (Blueprint $table) {
            // Add progress tracking columns
            $table->integer('current_value')->default(0)->after('achievement_id');
            $table->integer('target_value')->default(1)->after('current_value');
            $table->boolean('is_completed')->default(false)->after('target_value');
            $table->timestamp('completed_at')->nullable()->after('is_completed');
        });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('student_achievements')) {
            Schema::table('student_achievements', function (Blueprint $table) {
            $table->dropColumn(['current_value', 'target_value', 'is_completed', 'completed_at']);
        });
        }
    }
};