<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddOrderFieldsToQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('questions', function (Blueprint $table) {
            // Add qOrder for question ordering (if not exists)
            if (!Schema::hasColumn('questions', 'qOrder')) {
                $table->integer('qOrder')->default(0)->after('qId');
            }
            
            // Add qPartNumber for display (Part 1, Part 2, etc.)
            if (!Schema::hasColumn('questions', 'qPartNumber')) {
                $table->integer('qPartNumber')->default(1)->after('qOrder');
            }
            
            // Add qCustomTitle for custom part names
            if (!Schema::hasColumn('questions', 'qCustomTitle')) {
                $table->string('qCustomTitle', 255)->nullable()->after('qPartNumber');
            }
            
            // Add qSkillSection to track which skill section (listening, reading, speaking)
            if (!Schema::hasColumn('questions', 'qSkillSection')) {
                $table->string('qSkillSection', 50)->nullable()->after('qCustomTitle');
            }
        });
        
        // Add indexes for performance (check if they don't exist)
        Schema::table('questions', function (Blueprint $table) {
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $indexesFound = $sm->listTableIndexes('questions');
            
            if (!array_key_exists('idx_exam_order', $indexesFound)) {
                $table->index(['exam_id', 'qOrder'], 'idx_exam_order');
            }
            
            if (!array_key_exists('idx_exam_skill', $indexesFound)) {
                $table->index(['exam_id', 'qSkillSection'], 'idx_exam_skill');
            }
        });
        
        // Migrate existing data: set qOrder = qId to maintain current order (only for records with qOrder = 0 or 1)
        DB::statement('UPDATE questions SET qOrder = qId WHERE qOrder IN (0, 1)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('questions', function (Blueprint $table) {
            // Drop indexes first (check if they exist)
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $indexesFound = $sm->listTableIndexes('questions');
            
            if (array_key_exists('idx_exam_order', $indexesFound)) {
                $table->dropIndex('idx_exam_order');
            }
            
            if (array_key_exists('idx_exam_skill', $indexesFound)) {
                $table->dropIndex('idx_exam_skill');
            }
            
            // Drop columns (only the new ones we added)
            $columnsToCheck = ['qPartNumber', 'qCustomTitle', 'qSkillSection'];
            $columnsToDrop = [];
            
            foreach ($columnsToCheck as $column) {
                if (Schema::hasColumn('questions', $column)) {
                    $columnsToDrop[] = $column;
                }
            }
            
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
            
            // Note: We don't drop qOrder as it was added by a previous migration
        });
    }
}
