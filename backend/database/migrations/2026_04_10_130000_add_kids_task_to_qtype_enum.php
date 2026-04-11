<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add 'kids_task' to qType enum
        DB::statement("ALTER TABLE questions MODIFY COLUMN qType ENUM(
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
            'short_writing',
            'speaking_interaction',
            'speaking_solution',
            'speaking_topic',
            'reading_inference',
            'reading_main_idea',
            'reading_vocabulary',
            'listening_announcement',
            'listening_dialogue',
            'listening_lecture',
            'kids_task'
        ) DEFAULT 'multiple_choice'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove 'kids_task' from qType enum
        DB::statement("ALTER TABLE questions MODIFY COLUMN qType ENUM(
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
            'short_writing',
            'speaking_interaction',
            'speaking_solution',
            'speaking_topic',
            'reading_inference',
            'reading_main_idea',
            'reading_vocabulary',
            'listening_announcement',
            'listening_dialogue',
            'listening_lecture'
        ) DEFAULT 'multiple_choice'");
    }
};
