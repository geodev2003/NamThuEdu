<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddVstepStatusesToSubmissions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE submissions MODIFY COLUMN sStatus ENUM(
            'in_progress',
            'submitted',
            'graded',
            'partially_graded',
            'grading_subjective',
            'auto_submitted'
        ) DEFAULT 'in_progress'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE submissions MODIFY COLUMN sStatus ENUM(
            'in_progress',
            'submitted',
            'graded',
            'partially_graded'
        ) DEFAULT 'in_progress'");
    }
}
