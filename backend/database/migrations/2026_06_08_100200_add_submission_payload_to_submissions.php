<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Add `submission_payload` JSON column to store flexible answer data
     * for exam types that don't fit the question/answer row model
     * (e.g. THPT format with mixed task types per question).
     */
    public function up(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            if (!Schema::hasColumn('submissions', 'submission_payload')) {
                $table->json('submission_payload')->nullable()->after('sGemini_feedback');
            }
        });

        echo "✅ Added 'submission_payload' JSON column to submissions table\n";
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            if (Schema::hasColumn('submissions', 'submission_payload')) {
                $table->dropColumn('submission_payload');
            }
        });
    }
};
