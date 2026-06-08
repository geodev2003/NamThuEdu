<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

/**
 * Add AI-grading & review state fields to submission_answers.
 *
 * Strategy:
 *  - AI fields are immutable once written (saAi_*) — show what AI suggested.
 *  - saPoints_awarded + saTeacher_feedback remain the FINAL teacher-confirmed values.
 *  - saReview_status tracks what the teacher did with the AI suggestion.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('submission_answers')) {
            return;
        }

        Schema::table('submission_answers', function (Blueprint $table) {
            // AI grading output
            if (!Schema::hasColumn('submission_answers', 'saAi_score')) {
                $table->decimal('saAi_score', 5, 2)->nullable()->after('saPoints_awarded')
                      ->comment('AI suggested score (0-10)');
            }
            if (!Schema::hasColumn('submission_answers', 'saAi_feedback')) {
                $table->text('saAi_feedback')->nullable()->after('saAi_score')
                      ->comment('AI generated feedback for this answer');
            }
            if (!Schema::hasColumn('submission_answers', 'saAi_criteria')) {
                $table->json('saAi_criteria')->nullable()->after('saAi_feedback')
                      ->comment('Per-criterion breakdown JSON');
            }
            if (!Schema::hasColumn('submission_answers', 'saAi_model')) {
                $table->string('saAi_model', 80)->nullable()->after('saAi_criteria');
            }
            if (!Schema::hasColumn('submission_answers', 'saAi_graded_at')) {
                $table->timestamp('saAi_graded_at')->nullable()->after('saAi_model');
            }

            // Review state
            if (!Schema::hasColumn('submission_answers', 'saReview_status')) {
                $table->enum('saReview_status', ['pending', 'accepted', 'modified'])
                      ->default('pending')
                      ->after('saAi_graded_at')
                      ->comment('pending=not reviewed; accepted=AI verbatim; modified=teacher overrode');
            }
            if (!Schema::hasColumn('submission_answers', 'saReviewed_at')) {
                $table->timestamp('saReviewed_at')->nullable()->after('saReview_status');
            }
            if (!Schema::hasColumn('submission_answers', 'saReviewed_by')) {
                $table->unsignedBigInteger('saReviewed_by')->nullable()->after('saReviewed_at');
            }
        });

        // Backfill: for already-graded subjective answers, treat the existing teacher score as
        // both "AI-suggested" (since they came from AI before this migration) and "accepted" so
        // the FE shows them in a sensible state.
        DB::statement("
            UPDATE submission_answers sa
            INNER JOIN questions q ON q.qId = sa.question_id
            SET
                sa.saAi_score = sa.saPoints_awarded,
                sa.saReview_status = CASE
                    WHEN sa.saPoints_awarded IS NOT NULL THEN 'accepted'
                    ELSE 'pending'
                END,
                sa.saAi_model = 'legacy-import'
            WHERE sa.saAi_score IS NULL
              AND LOWER(COALESCE(q.qSkill, '')) IN ('writing', 'speaking')
        ");
    }

    public function down(): void
    {
        if (!Schema::hasTable('submission_answers')) {
            return;
        }

        Schema::table('submission_answers', function (Blueprint $table) {
            $columns = ['saAi_score', 'saAi_feedback', 'saAi_criteria', 'saAi_model',
                        'saAi_graded_at', 'saReview_status', 'saReviewed_at', 'saReviewed_by'];
            foreach ($columns as $col) {
                if (Schema::hasColumn('submission_answers', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
