<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMissingExamColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('exams', function (Blueprint $table) {
            // Add missing columns that are in the Exam model fillable array
            // Note: template_id already exists from previous migration
            if (!Schema::hasColumn('exams', 'exam_type_id')) {
                $table->unsignedBigInteger('exam_type_id')->nullable()->after('eId');
            }
            if (!Schema::hasColumn('exams', 'exam_code')) {
                $table->string('exam_code')->nullable()->after('template_id');
            }
            if (!Schema::hasColumn('exams', 'eDifficulty_level')) {
                $table->string('eDifficulty_level')->nullable()->after('eDescription');
            }
            if (!Schema::hasColumn('exams', 'eTarget_level')) {
                $table->string('eTarget_level')->nullable()->after('eDifficulty_level');
            }
            if (!Schema::hasColumn('exams', 'eDuration')) {
                $table->integer('eDuration')->nullable()->after('eTarget_level');
            }
            if (!Schema::hasColumn('exams', 'eTotal_score')) {
                $table->decimal('eTotal_score', 5, 2)->nullable()->after('eDuration');
            }
            if (!Schema::hasColumn('exams', 'ePass_score')) {
                $table->decimal('ePass_score', 5, 2)->nullable()->after('eTotal_score');
            }
            if (!Schema::hasColumn('exams', 'eStatus')) {
                $table->string('eStatus')->default('draft')->after('ePass_score');
            }
            if (!Schema::hasColumn('exams', 'eVisibility')) {
                $table->string('eVisibility')->default('private')->after('eStatus');
            }
            if (!Schema::hasColumn('exams', 'teacher_id')) {
                $table->unsignedBigInteger('teacher_id')->nullable()->after('eVisibility');
            }
            if (!Schema::hasColumn('exams', 'eTags')) {
                $table->json('eTags')->nullable()->after('teacher_id');
            }
            if (!Schema::hasColumn('exams', 'ePurpose')) {
                $table->string('ePurpose')->nullable()->after('eSource_type');
            }
            if (!Schema::hasColumn('exams', 'eTopic')) {
                $table->string('eTopic')->nullable()->after('ePurpose');
            }
            if (!Schema::hasColumn('exams', 'eDifficulty')) {
                $table->string('eDifficulty')->nullable()->after('eTopic');
            }
            if (!Schema::hasColumn('exams', 'eParent_exam_id')) {
                $table->unsignedBigInteger('eParent_exam_id')->nullable()->after('eDifficulty');
            }
        });
        
        // Add foreign key constraints after all columns are added
        Schema::table('exams', function (Blueprint $table) {
            if (Schema::hasColumn('exams', 'exam_type_id') && !$this->foreignKeyExists('exams', 'exams_exam_type_id_foreign')) {
                $table->foreign('exam_type_id')->references('etId')->on('exam_types')->onDelete('set null');
            }
            if (Schema::hasColumn('exams', 'teacher_id') && !$this->foreignKeyExists('exams', 'exams_teacher_id_foreign')) {
                $table->foreign('teacher_id')->references('uId')->on('users')->onDelete('cascade');
            }
            if (Schema::hasColumn('exams', 'eParent_exam_id') && !$this->foreignKeyExists('exams', 'exams_eparent_exam_id_foreign')) {
                $table->foreign('eParent_exam_id')->references('eId')->on('exams')->onDelete('set null');
            }
        });
    }
    
    private function foreignKeyExists($table, $name)
    {
        $keys = Schema::getConnection()->getDoctrineSchemaManager()->listTableForeignKeys($table);
        return collect($keys)->contains(function ($key) use ($name) {
            return $key->getName() === $name;
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('exams', function (Blueprint $table) {
            // Drop foreign keys first (only if they exist)
            if ($this->foreignKeyExists('exams', 'exams_exam_type_id_foreign')) {
                $table->dropForeign(['exam_type_id']);
            }
            if ($this->foreignKeyExists('exams', 'exams_teacher_id_foreign')) {
                $table->dropForeign(['teacher_id']);
            }
            if ($this->foreignKeyExists('exams', 'exams_eparent_exam_id_foreign')) {
                $table->dropForeign(['eParent_exam_id']);
            }
            
            // Drop columns (only if they exist)
            $columnsToCheck = [
                'exam_type_id', 'exam_code', 'eDifficulty_level',
                'eTarget_level', 'eDuration', 'eTotal_score', 'ePass_score',
                'eStatus', 'eVisibility', 'teacher_id', 'eTags', 'ePurpose',
                'eTopic', 'eDifficulty', 'eParent_exam_id'
            ];
            
            $columnsToDrop = [];
            foreach ($columnsToCheck as $column) {
                if (Schema::hasColumn('exams', $column)) {
                    $columnsToDrop[] = $column;
                }
            }
            
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
}
