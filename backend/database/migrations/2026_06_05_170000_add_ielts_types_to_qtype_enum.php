<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Extend the `questions.qType` ENUM to support IELTS-specific question types.
 * Required for storing TFNG, YNNG, matching headings, summary completion, etc.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE questions MODIFY COLUMN qType ENUM(
            'multiple_choice',
            'fill_blank',
            'true_false',
            'matching',
            'matching_lines',
            'coloring',
            'short_answer',
            'essay',
            'speaking',
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
            'kids_task',
            'true_false_not_given',
            'yes_no_not_given',
            'sentence_completion',
            'summary_completion',
            'note_completion',
            'form_completion',
            'table_completion',
            'flow_chart_completion',
            'matching_headings',
            'matching_information',
            'matching_features',
            'matching_sentence_endings',
            'diagram_labelling',
            'plan_map_diagram'
        ) DEFAULT 'multiple_choice'");
    }

    public function down(): void
    {
        // Restore previous enum (drop newly-added IELTS values)
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
};
