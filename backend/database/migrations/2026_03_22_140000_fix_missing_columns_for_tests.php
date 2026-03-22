<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class FixMissingColumnsForTests extends Migration
{
    public function up()
    {
        // Fix exams table
        if (Schema::hasTable('exams')) {
            Schema::table('exams', function (Blueprint $table) {
                if (!Schema::hasColumn('exams', 'eStatus')) {
                    $table->enum('eStatus', ['draft', 'published', 'archived'])->default('draft');
                }
                if (!Schema::hasColumn('exams', 'eTotal_score')) {
                    $table->integer('eTotal_score')->nullable();
                }
                if (!Schema::hasColumn('exams', 'ePurpose')) {
                    $table->enum('ePurpose', ['exam', 'practice'])->default('exam');
                }
            });
        }

        // Fix questions table
        if (Schema::hasTable('questions')) {
            Schema::table('questions', function (Blueprint $table) {
                if (!Schema::hasColumn('questions', 'qOptions')) {
                    $table->json('qOptions')->nullable();
                }
                if (!Schema::hasColumn('questions', 'qPoints')) {
                    $table->integer('qPoints')->default(1);
                }
            });
        }

        // Fix users table
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'deleted_at')) {
                    $table->softDeletes();
                }
            });
        }

        // Fix posts table - modify pStatus column
        if (Schema::hasTable('posts')) {
            Schema::table('posts', function (Blueprint $table) {
                $table->string('pStatus', 20)->change();
            });
        }

        // Fix exam_templates table
        if (Schema::hasTable('exam_templates')) {
            Schema::table('exam_templates', function (Blueprint $table) {
                if (!Schema::hasColumn('exam_templates', 'template_category')) {
                    $table->string('template_category')->nullable();
                }
            });
        }

        // Fix template_sections table
        if (Schema::hasTable('template_sections')) {
            Schema::table('template_sections', function (Blueprint $table) {
                if (!Schema::hasColumn('template_sections', 'total_questions')) {
                    $table->integer('total_questions')->default(0);
                }
            });
        }

        // Fix submissions table
        if (Schema::hasTable('submissions')) {
            Schema::table('submissions', function (Blueprint $table) {
                if (!Schema::hasColumn('submissions', 'sSubmitted_at')) {
                    $table->timestamp('sSubmitted_at')->nullable();
                }
            });
        }

        // Fix course table
        if (Schema::hasTable('course')) {
            Schema::table('course', function (Blueprint $table) {
                if (!Schema::hasColumn('course', 'cCreated_at')) {
                    $table->timestamp('cCreated_at')->nullable();
                }
            });
        }

        // Fix test_assignments table
        if (Schema::hasTable('test_assignments')) {
            Schema::table('test_assignments', function (Blueprint $table) {
                if (!Schema::hasColumn('test_assignments', 'created_at')) {
                    $table->timestamps();
                }
            });
        }
    }

    public function down()
    {
        // Reverse the changes
        if (Schema::hasTable('exams')) {
            Schema::table('exams', function (Blueprint $table) {
                $table->dropColumn(['eStatus', 'eTotal_score', 'ePurpose']);
            });
        }

        if (Schema::hasTable('questions')) {
            Schema::table('questions', function (Blueprint $table) {
                $table->dropColumn(['qOptions', 'qPoints']);
            });
        }

        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }

        if (Schema::hasTable('exam_templates')) {
            Schema::table('exam_templates', function (Blueprint $table) {
                $table->dropColumn('template_category');
            });
        }

        if (Schema::hasTable('template_sections')) {
            Schema::table('template_sections', function (Blueprint $table) {
                $table->dropColumn('total_questions');
            });
        }

        if (Schema::hasTable('submissions')) {
            Schema::table('submissions', function (Blueprint $table) {
                $table->dropColumn('sSubmitted_at');
            });
        }

        if (Schema::hasTable('course')) {
            Schema::table('course', function (Blueprint $table) {
                $table->dropColumn('cCreated_at');
            });
        }

        if (Schema::hasTable('test_assignments')) {
            Schema::table('test_assignments', function (Blueprint $table) {
                $table->dropTimestamps();
            });
        }
    }
}