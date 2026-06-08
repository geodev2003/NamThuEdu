<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Add 'THPT' to exams.eType ENUM to support
     * Vietnamese university entrance exam format
     * (4 parts × 25 questions, 60 minutes).
     */
    public function up(): void
    {
        DB::statement("
            ALTER TABLE exams
            MODIFY COLUMN eType
            ENUM('VSTEP', 'IELTS', 'GENERAL', 'THPT')
            NOT NULL
        ");

        echo "✅ Added 'THPT' to exams.eType ENUM\n";
        echo "   Now supports: VSTEP, IELTS, GENERAL, THPT\n";
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Refuse to downgrade if any THPT exam exists
        $count = DB::table('exams')->where('eType', 'THPT')->count();
        if ($count > 0) {
            throw new \RuntimeException(
                "Cannot rollback: {$count} exam(s) with eType='THPT' still exist. Delete them first."
            );
        }

        DB::statement("
            ALTER TABLE exams
            MODIFY COLUMN eType
            ENUM('VSTEP', 'IELTS', 'GENERAL')
            NOT NULL
        ");

        echo "⚠️  Removed 'THPT' from exams.eType ENUM\n";
    }
};
