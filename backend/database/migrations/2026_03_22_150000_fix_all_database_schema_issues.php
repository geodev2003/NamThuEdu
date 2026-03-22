<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class FixAllDatabaseSchemaIssues extends Migration
{
    public function up()
    {
        // Fix questions table - add missing columns
        if (Schema::hasTable('questions')) {
            Schema::table('questions', function (Blueprint $table) {
                if (!Schema::hasColumn('questions', 'qCorrect_answer')) {
                    $table->text('qCorrect_answer')->nullable()->after('qOptions');
                }
                if (!Schema::hasColumn('questions', 'qScore')) {
                    $table->integer('qScore')->default(1)->after('qCorrect_answer');
                }
                if (!Schema::hasColumn('questions', 'qOrder')) {
                    $table->integer('qOrder')->default(1)->after('qScore');
                }
                if (!Schema::hasColumn('questions', 'qExam_id')) {
                    $table->unsignedBigInteger('qExam_id')->nullable()->after('exam_id');
                    $table->foreign('qExam_id')->references('eId')->on('exams')->onDelete('cascade');
                }
            });
        }

        // Fix submissions table - add missing columns
        if (Schema::hasTable('submissions')) {
            Schema::table('submissions', function (Blueprint $table) {
                if (!Schema::hasColumn('submissions', 'sStudent_id')) {
                    $table->unsignedBigInteger('sStudent_id')->nullable()->after('user_id');
                    $table->foreign('sStudent_id')->references('uId')->on('users')->onDelete('cascade');
                }
                if (!Schema::hasColumn('submissions', 'sTotal_score')) {
                    $table->decimal('sTotal_score', 5, 2)->nullable()->after('sScore');
                }
                if (!Schema::hasColumn('submissions', 'student_id')) {
                    $table->unsignedBigInteger('student_id')->nullable()->after('sStudent_id');
                }
                if (!Schema::hasColumn('submissions', 'status')) {
                    $table->string('status')->default('in_progress')->after('sStatus');
                }
                if (!Schema::hasColumn('submissions', 'started_at')) {
                    $table->timestamp('started_at')->nullable()->after('sStart_time');
                }
                if (!Schema::hasColumn('submissions', 'submitted_at')) {
                    $table->timestamp('submitted_at')->nullable()->after('sSubmit_time');
                }
                if (!Schema::hasColumn('submissions', 'score')) {
                    $table->decimal('score', 5, 2)->nullable()->after('sScore');
                }
                if (!Schema::hasColumn('submissions', 'feedback')) {
                    $table->text('feedback')->nullable()->after('sTeacher_feedback');
                }
                if (!Schema::hasColumn('submissions', 'time_spent')) {
                    $table->integer('time_spent')->nullable()->after('feedback');
                }
            });
        }

        // Fix course table - add missing columns
        if (Schema::hasTable('course')) {
            Schema::table('course', function (Blueprint $table) {
                if (!Schema::hasColumn('course', 'cTeacher_id')) {
                    $table->unsignedBigInteger('cTeacher_id')->nullable()->after('cTeacher');
                    $table->foreign('cTeacher_id')->references('uId')->on('users')->onDelete('cascade');
                }
                if (!Schema::hasColumn('course', 'cType')) {
                    $table->string('cType')->default('general')->after('cCategory');
                }
            });
        }

        // Fix classes table - add missing columns
        if (Schema::hasTable('classes')) {
            Schema::table('classes', function (Blueprint $table) {
                if (!Schema::hasColumn('classes', 'clTeacher_id')) {
                    $table->unsignedBigInteger('clTeacher_id')->nullable()->after('cTeacher_id');
                    $table->foreign('clTeacher_id')->references('uId')->on('users')->onDelete('cascade');
                }
                if (!Schema::hasColumn('classes', 'clId')) {
                    $table->unsignedBigInteger('clId')->nullable()->after('cId');
                }
            });
        }

        // Fix test_assignments table - add missing columns
        if (Schema::hasTable('test_assignments')) {
            Schema::table('test_assignments', function (Blueprint $table) {
                if (!Schema::hasColumn('test_assignments', 'taTeacher_id')) {
                    $table->unsignedBigInteger('taTeacher_id')->nullable()->after('taTarget_id');
                    $table->foreign('taTeacher_id')->references('uId')->on('users')->onDelete('cascade');
                }
                if (!Schema::hasColumn('test_assignments', 'assigned_by')) {
                    $table->unsignedBigInteger('assigned_by')->nullable()->after('taTeacher_id');
                }
                if (!Schema::hasColumn('test_assignments', 'due_date')) {
                    $table->timestamp('due_date')->nullable()->after('taDeadline');
                }
                if (!Schema::hasColumn('test_assignments', 'status')) {
                    $table->string('status')->default('assigned')->after('due_date');
                }
                if (!Schema::hasColumn('test_assignments', 'instructions')) {
                    $table->text('instructions')->nullable()->after('status');
                }
                if (!Schema::hasColumn('test_assignments', 'student_id')) {
                    $table->unsignedBigInteger('student_id')->nullable()->after('taTarget_id');
                }
                if (!Schema::hasColumn('test_assignments', 'class_id')) {
                    $table->unsignedBigInteger('class_id')->nullable()->after('student_id');
                }
            });
        }

        // Fix practice_sessions table - add missing columns
        if (Schema::hasTable('practice_sessions')) {
            Schema::table('practice_sessions', function (Blueprint $table) {
                if (!Schema::hasColumn('practice_sessions', 'ps_exam_id')) {
                    $table->unsignedBigInteger('ps_exam_id')->nullable()->after('ps_teacher_id');
                    $table->foreign('ps_exam_id')->references('eId')->on('exams')->onDelete('set null');
                }
            });
        }

        // Fix exam_templates table - add missing columns
        if (Schema::hasTable('exam_templates')) {
            Schema::table('exam_templates', function (Blueprint $table) {
                if (!Schema::hasColumn('exam_templates', 'etId')) {
                    $table->unsignedBigInteger('etId')->nullable()->after('id');
                }
                if (!Schema::hasColumn('exam_templates', 'etName')) {
                    $table->string('etName')->nullable()->after('template_name');
                }
                if (!Schema::hasColumn('exam_templates', 'etCategory')) {
                    $table->string('etCategory')->nullable()->after('category');
                }
                if (!Schema::hasColumn('exam_templates', 'etStatus')) {
                    $table->string('etStatus')->default('active')->after('is_active');
                }
            });
        }

        // Fix template_sections table - add missing columns
        if (Schema::hasTable('template_sections')) {
            Schema::table('template_sections', function (Blueprint $table) {
                if (!Schema::hasColumn('template_sections', 'section_description')) {
                    $table->text('section_description')->nullable()->after('section_name');
                }
            });
        }

        // Fix users table - add missing columns for tests
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'role')) {
                    $table->string('role')->nullable()->after('uRole');
                }
                if (!Schema::hasColumn('users', 'name')) {
                    $table->string('name')->nullable()->after('uName');
                }
                if (!Schema::hasColumn('users', 'uDeleted_at')) {
                    $table->timestamp('uDeleted_at')->nullable();
                }
            });
        }

        // Fix class_enrollments table - add missing columns
        if (Schema::hasTable('class_enrollments')) {
            Schema::table('class_enrollments', function (Blueprint $table) {
                // Add status column for enrollment tracking
                if (!Schema::hasColumn('class_enrollments', 'status')) {
                    $table->string('status')->default('active')->after('enrolled_at');
                }
                // Add enrollment_id for easier reference in tests
                if (!Schema::hasColumn('class_enrollments', 'enrollment_id')) {
                    $table->unsignedBigInteger('enrollment_id')->nullable()->after('status');
                }
            });
        }
    }

    public function down()
    {
        // Reverse all changes
        if (Schema::hasTable('questions')) {
            Schema::table('questions', function (Blueprint $table) {
                $table->dropForeign(['qExam_id']);
                $table->dropColumn(['qCorrect_answer', 'qScore', 'qOrder', 'qExam_id']);
            });
        }

        if (Schema::hasTable('submissions')) {
            Schema::table('submissions', function (Blueprint $table) {
                $table->dropForeign(['sStudent_id']);
                $table->dropColumn([
                    'sStudent_id', 'sTotal_score', 'student_id', 'status', 
                    'started_at', 'submitted_at', 'score', 'feedback', 'time_spent'
                ]);
            });
        }

        if (Schema::hasTable('course')) {
            Schema::table('course', function (Blueprint $table) {
                $table->dropForeign(['cTeacher_id']);
                $table->dropColumn(['cTeacher_id', 'cType']);
            });
        }

        if (Schema::hasTable('classes')) {
            Schema::table('classes', function (Blueprint $table) {
                $table->dropForeign(['clTeacher_id']);
                $table->dropColumn(['clTeacher_id', 'clId']);
            });
        }

        if (Schema::hasTable('test_assignments')) {
            Schema::table('test_assignments', function (Blueprint $table) {
                $table->dropForeign(['taTeacher_id']);
                $table->dropColumn([
                    'taTeacher_id', 'assigned_by', 'due_date', 'status', 
                    'instructions', 'student_id', 'class_id'
                ]);
            });
        }

        if (Schema::hasTable('practice_sessions')) {
            Schema::table('practice_sessions', function (Blueprint $table) {
                $table->dropForeign(['ps_exam_id']);
                $table->dropColumn('ps_exam_id');
            });
        }

        if (Schema::hasTable('exam_templates')) {
            Schema::table('exam_templates', function (Blueprint $table) {
                $table->dropColumn(['etId', 'etName', 'etCategory', 'etStatus']);
            });
        }

        if (Schema::hasTable('template_sections')) {
            Schema::table('template_sections', function (Blueprint $table) {
                $table->dropColumn('section_description');
            });
        }

        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn(['role', 'name', 'uDeleted_at']);
            });
        }

        if (Schema::hasTable('class_enrollments')) {
            Schema::table('class_enrollments', function (Blueprint $table) {
                $table->dropColumn(['status', 'enrollment_id']);
            });
        }
    }
}