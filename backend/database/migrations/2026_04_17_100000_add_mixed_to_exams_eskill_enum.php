<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Add 'mixed' value to eSkill ENUM to support VSTEP Full Test (4 skills)
     */
    public function up(): void
    {
        // Add 'mixed' to eSkill ENUM
        DB::statement("
            ALTER TABLE exams 
            MODIFY COLUMN eSkill 
            ENUM('listening', 'reading', 'writing', 'speaking', 'mixed') 
            NOT NULL
        ");
        
        echo "✅ Added 'mixed' to exams.eSkill ENUM\n";
        echo "   Now supports: listening, reading, writing, speaking, mixed\n";
        echo "   This enables VSTEP Full Test (4 skills) creation\n";
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Check if any exam uses 'mixed' skill
        $mixedCount = DB::table('exams')->where('eSkill', 'mixed')->count();
        
        if ($mixedCount > 0) {
            throw new \Exception(
                "Cannot rollback: {$mixedCount} exam(s) are using eSkill='mixed'. " .
                "Please update or delete these exams before rolling back this migration."
            );
        }
        
        // Remove 'mixed' from eSkill ENUM
        DB::statement("
            ALTER TABLE exams 
            MODIFY COLUMN eSkill 
            ENUM('listening', 'reading', 'writing', 'speaking') 
            NOT NULL
        ");
        
        echo "⚠️  Removed 'mixed' from exams.eSkill ENUM\n";
    }
};
