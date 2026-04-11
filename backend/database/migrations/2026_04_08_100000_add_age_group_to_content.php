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
        // Add age_group columns to exams table
        Schema::table('exams', function (Blueprint $table) {
            if (!Schema::hasColumn('exams', 'age_group')) {
                $table->enum('age_group', ['kids', 'teens', 'adults', 'all'])->default('all')->after('eType');
                $table->index('age_group');
            }
            if (!Schema::hasColumn('exams', 'content_type')) {
                $table->string('content_type', 50)->nullable()->after('age_group');
            }
            if (!Schema::hasColumn('exams', 'difficulty_level')) {
                $table->string('difficulty_level', 20)->nullable()->after('content_type');
            }
            if (!Schema::hasColumn('exams', 'gamification_config')) {
                $table->json('gamification_config')->nullable()->after('difficulty_level');
            }
            if (!Schema::hasColumn('exams', 'ui_config')) {
                $table->json('ui_config')->nullable()->after('gamification_config');
            }
        });

        // Add age_group columns to questions table
        Schema::table('questions', function (Blueprint $table) {
            if (!Schema::hasColumn('questions', 'age_group')) {
                $table->enum('age_group', ['kids', 'teens', 'adults', 'all'])->default('all')->after('qType');
                $table->index('age_group');
            }
            if (!Schema::hasColumn('questions', 'media_type')) {
                $table->string('media_type', 50)->nullable()->after('age_group');
            }
            if (!Schema::hasColumn('questions', 'interactive_config')) {
                $table->json('interactive_config')->nullable()->after('media_type');
            }
            if (!Schema::hasColumn('questions', 'feedback_config')) {
                $table->json('feedback_config')->nullable()->after('interactive_config');
            }
        });

        // Add age_group columns to test_assignments table
        Schema::table('test_assignments', function (Blueprint $table) {
            if (!Schema::hasColumn('test_assignments', 'age_group')) {
                $table->enum('age_group', ['kids', 'teens', 'adults', 'all'])->default('all')->after('exam_id');
                $table->index('age_group');
            }
            if (!Schema::hasColumn('test_assignments', 'adaptive_settings')) {
                $table->json('adaptive_settings')->nullable()->after('age_group');
            }
            if (!Schema::hasColumn('test_assignments', 'gamification_enabled')) {
                $table->boolean('gamification_enabled')->default(false)->after('adaptive_settings');
            }
            if (!Schema::hasColumn('test_assignments', 'competitive_mode')) {
                $table->boolean('competitive_mode')->default(false)->after('gamification_enabled');
            }
        });

        // Create content_templates table for age-specific templates
        if (!Schema::hasTable('content_templates')) {
            Schema::create('content_templates', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->text('description')->nullable();
                $table->enum('age_group', ['kids', 'teens', 'adults', 'all']);
                $table->string('template_type', 50); // activity, quiz, assessment, game
                $table->json('template_config'); // Template configuration
                $table->json('default_settings')->nullable();
                $table->boolean('is_active')->default(true);
                $table->integer('usage_count')->default(0);
                $table->decimal('avg_rating', 3, 2)->nullable();
                $table->timestamps();
                
                $table->index(['age_group', 'template_type']);
            });
        }

        // Create content_analytics table for age-group analytics
        if (!Schema::hasTable('content_analytics')) {
            Schema::create('content_analytics', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('exam_id');
                $table->enum('age_group', ['kids', 'teens', 'adults']);
                $table->integer('total_attempts')->default(0);
                $table->integer('total_completions')->default(0);
                $table->decimal('avg_score', 5, 2)->default(0);
                $table->decimal('avg_completion_time', 8, 2)->default(0); // in minutes
                $table->decimal('engagement_rate', 5, 2)->default(0); // percentage
                $table->json('performance_breakdown')->nullable(); // by topic, difficulty
                $table->timestamps();
                
                $table->foreign('exam_id')->references('eId')->on('exams')->onDelete('cascade');
                $table->unique(['exam_id', 'age_group']);
                $table->index('age_group');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('content_analytics');
        Schema::dropIfExists('content_templates');
        
        Schema::table('test_assignments', function (Blueprint $table) {
            $table->dropColumn(['age_group', 'adaptive_settings', 'gamification_enabled', 'competitive_mode']);
        });
        
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn(['age_group', 'media_type', 'interactive_config', 'feedback_config']);
        });
        
        Schema::table('exams', function (Blueprint $table) {
            $table->dropColumn(['age_group', 'content_type', 'difficulty_level', 'gamification_config', 'ui_config']);
        });
    }
};
