<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "🔧 Fixing exams.eSkill ENUM to support VSTEP mixed skill...\n\n";

try {
    // Check current ENUM values
    $result = DB::select("SHOW COLUMNS FROM exams WHERE Field = 'eSkill'");
    $currentType = $result[0]->Type ?? 'unknown';
    
    echo "📋 Current eSkill type: {$currentType}\n\n";
    
    // Check if 'mixed' already exists
    if (strpos($currentType, 'mixed') !== false) {
        echo "✅ 'mixed' value already exists in eSkill ENUM!\n";
        echo "   No changes needed.\n";
        exit(0);
    }
    
    // Add 'mixed' to ENUM
    echo "🔄 Adding 'mixed' to eSkill ENUM...\n";
    
    DB::statement("
        ALTER TABLE exams 
        MODIFY COLUMN eSkill 
        ENUM('listening', 'reading', 'writing', 'speaking', 'mixed') 
        NOT NULL
    ");
    
    echo "✅ Successfully added 'mixed' to eSkill ENUM!\n\n";
    
    // Verify the change
    $result = DB::select("SHOW COLUMNS FROM exams WHERE Field = 'eSkill'");
    $newType = $result[0]->Type ?? 'unknown';
    
    echo "📋 New eSkill type: {$newType}\n\n";
    
    echo "🎉 Migration complete!\n";
    echo "   Now you can create VSTEP Full Test (4 skills) with eSkill='mixed'\n";
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
