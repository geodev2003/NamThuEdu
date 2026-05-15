<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Update achievements table
        Schema::table('achievements', function (Blueprint $table) {
            if (!Schema::hasColumn('achievements', 'slug')) {
                $table->string('slug')->nullable()->after('code');
            }
            if (!Schema::hasColumn('achievements', 'age_group')) {
                $table->enum('age_group', ['kids', 'teens', 'adults', 'all'])->default('all')->after('category');
            }
            if (!Schema::hasColumn('achievements', 'target_value')) {
                $table->integer('target_value')->default(0)->after('age_group');
            }
            if (!Schema::hasColumn('achievements', 'target_type')) {
                $table->string('target_type')->nullable()->after('target_value');
            }
            if (!Schema::hasColumn('achievements', 'coin_reward')) {
                $table->integer('coin_reward')->default(0)->after('target_type');
            }
        });

        // Update badges table
        if (Schema::hasTable('badges')) {
            Schema::table('badges', function (Blueprint $table) {
                if (!Schema::hasColumn('badges', 'slug')) {
                    $table->string('slug')->nullable()->after('code');
                }
                if (!Schema::hasColumn('badges', 'age_group')) {
                    $table->enum('age_group', ['kids', 'teens', 'adults', 'all'])->default('all')->after('category');
                }
                if (!Schema::hasColumn('badges', 'rarity')) {
                    $table->enum('rarity', ['common', 'rare', 'epic', 'legendary'])->default('common')->after('age_group');
                }
                if (!Schema::hasColumn('badges', 'color')) {
                    $table->string('color')->default('#FFD700')->after('icon');
                }
                if (!Schema::hasColumn('badges', 'requirements')) {
                    $table->json('requirements')->nullable()->after('rarity');
                }
                if (!Schema::hasColumn('badges', 'coin_reward')) {
                    $table->integer('coin_reward')->default(0)->after('requirements');
                }
            });
        }

        // Ensure student_coins has correct columns
        if (Schema::hasTable('student_coins') && !Schema::hasColumn('student_coins', 'lifetime_coins')) {
            Schema::table('student_coins', function (Blueprint $table) {
                $table->integer('lifetime_coins')->default(0)->after('total_coins');
                $table->integer('spent_coins')->default(0)->after('lifetime_coins');
            });
        }

        // Ensure student_streaks has correct columns
        if (Schema::hasTable('student_streaks') && !Schema::hasColumn('student_streaks', 'total_active_days')) {
            Schema::table('student_streaks', function (Blueprint $table) {
                $table->integer('total_active_days')->default(0)->after('last_activity_date');
            });
        }
    }

    public function down(): void
    {
        Schema::table('achievements', function (Blueprint $table) {
            $table->dropColumn(['slug', 'age_group', 'target_value', 'target_type', 'coin_reward']);
        });

        Schema::table('badges', function (Blueprint $table) {
            $table->dropColumn(['slug', 'age_group', 'rarity', 'color', 'requirements', 'coin_reward']);
        });

        Schema::table('student_coins', function (Blueprint $table) {
            $table->dropColumn(['lifetime_coins', 'spent_coins']);
        });

        Schema::table('student_streaks', function (Blueprint $table) {
            $table->dropColumn('total_active_days');
        });
    }
};
