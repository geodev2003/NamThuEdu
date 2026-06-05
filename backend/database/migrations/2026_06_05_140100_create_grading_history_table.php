<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Audit log for every grading-related action on a submission.
 * Lets us track WHO scored WHAT WHEN, and WHY a teacher overrode AI.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('grading_history')) return;

        Schema::create('grading_history', function (Blueprint $table) {
            $table->id('ghId');
            $table->unsignedBigInteger('submission_id');
            $table->unsignedBigInteger('answer_id')->nullable();           // null = whole-submission action
            $table->enum('ghAction', [
                'ai_grade',          // AI scored for the first time
                'ai_regrade',        // teacher asked AI to re-score
                'teacher_accept',    // teacher accepted AI verbatim
                'teacher_modify',    // teacher overrode AI
                'teacher_save_all',  // teacher finalized the submission
            ]);
            $table->unsignedBigInteger('ghActor_id')->nullable();           // null = system/AI
            $table->decimal('ghPrev_score', 5, 2)->nullable();
            $table->decimal('ghNew_score', 5, 2)->nullable();
            $table->text('ghNote')->nullable();
            $table->json('ghMetadata')->nullable();                         // model, tokens, hint, etc
            $table->timestamps();

            $table->index('submission_id');
            $table->index('answer_id');
            $table->index(['submission_id', 'ghAction']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grading_history');
    }
};
