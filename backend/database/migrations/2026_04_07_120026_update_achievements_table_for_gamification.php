<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('achievements', function (Blueprint $table) {
            // Add missing columns for gamification
            $table->string('slug')->nullable()->after('name');
            $table->enum('age_group', ['kids', 'teens', 'adults', 'all'])->default('all')->after('category');
            $table->integer('target_value')->default(1)->after('age_group');
            $table->string('target_type')->default('lessons_completed')->after('target_value');
            $table->integer('coin_reward')->default(0)->after('target_type');
            
            // Rename existing columns
            $table->renameColumn('points', 'old_points');
            $table->renameColumn('criteria', 'old_criteria');
        });
        
        // Update existing data
        DB::table('achievements')->update([
            'slug' => DB::raw("LOWER(REPLACE(name, ' ', '_'))"),
            'coin_reward' => DB::raw('old_points'),
        ]);
    }

    public function down(): void
    {
        Schema::table('achievements', function (Blueprint $table) {
            $table->dropColumn(['slug', 'age_group', 'target_value', 'target_type', 'coin_reward']);
            $table->renameColumn('old_points', 'points');
            $table->renameColumn('old_criteria', 'criteria');
        });
    }
};