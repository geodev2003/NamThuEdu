<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "🔄 Updating exam durations based on exam type...\n\n";

$exams = DB::table('exams')
    ->whereNotNull('kids_exam_config')
    ->select('eId', 'eTitle', 'eDuration', 'kids_exam_config')
    ->get();

$updated = 0;
$skipped = 0;

foreach ($exams as $exam) {
    $config = json_decode($exam->kids_exam_config, true);
    $examType = $config['exam_type'] ?? 'unknown';
    
    $expectedDuration = null;
    if ($examType === 'yle_starters') {
        $expectedDuration = 45;
    } elseif ($examType === 'yle_movers') {
        $expectedDuration = 60;
    } elseif ($examType === 'yle_flyers') {
        $expectedDuration = 75;
    }
    
    if ($expectedDuration && $exam->eDuration != $expectedDuration) {
        // Update duration
        DB::table('exams')
            ->where('eId', $exam->eId)
            ->update(['eDuration' => $expectedDuration]);
        
        echo "✅ Updated ID {$exam->eId}: {$exam->eTitle}\n";
        echo "   {$examType}: {$exam->eDuration} min → {$expectedDuration} min\n\n";
        $updated++;
    } else {
        echo "⏭️  Skipped ID {$exam->eId}: {$exam->eTitle} (already correct)\n\n";
        $skipped++;
    }
}

echo "\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "📊 Summary:\n";
echo "   Total exams: " . $exams->count() . "\n";
echo "   ✅ Updated: {$updated}\n";
echo "   ⏭️  Skipped: {$skipped}\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
