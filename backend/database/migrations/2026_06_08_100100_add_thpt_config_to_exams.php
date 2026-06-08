<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Add `thpt_config` JSON column to store the full THPT exam structure
     * (4 parts: TF group, reading mixed, matching, open cloze).
     */
    public function up(): void
    {
        Schema::table('exams', function (Blueprint $table) {
            $table->json('thpt_config')->nullable()->after('ielts_config');
        });

        echo "✅ Added 'thpt_config' JSON column to exams table\n";
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exams', function (Blueprint $table) {
            $table->dropColumn('thpt_config');
        });
    }
};
