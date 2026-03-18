<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('questions', function (Blueprint $table) {
            // Add question type support
            $table->enum('qType', [
                'multiple_choice',
                'fill_blank', 
                'true_false',
                'matching',
                'matching_lines',
                'coloring',
                'short_answer',
                'essay',
                'speaking_identification',
                'speaking_comparison',
                'multiple_choice_cloze',
                'word_completion',
                'open_cloze',
                'information_transfer',
                'short_writing'
            ])->default('multiple_choice')->after('qContent');
            
            // Add section information
            $table->string('qSection', 50)->nullable()->after('qType'); // 'Part 1', 'Reading', etc.
            $table->integer('qSection_order')->nullable()->after('qSection');
            
            // Add additional configuration for different question types
            $table->json('qConfig')->nullable()->after('qListen_limit'); // Question-specific config
            
            // Add difficulty level
            $table->enum('qDifficulty', ['easy', 'medium', 'hard'])->default('medium')->after('qConfig');
            
            // Add tags for categorization
            $table->json('qTags')->nullable()->after('qDifficulty'); // ['grammar', 'vocabulary', etc.]
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn([
                'qType',
                'qSection', 
                'qSection_order',
                'qConfig',
                'qDifficulty',
                'qTags'
            ]);
        });
    }
};