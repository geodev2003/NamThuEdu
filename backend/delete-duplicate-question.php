<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== DELETING DUPLICATE QUESTION ===\n\n";

// Check question 472
$q = DB::table('questions')->where('qId', 472)->first();
if ($q) {
    echo "Question 472:\n";
    echo "  Exam ID: {$q->exam_id}\n";
    echo "  Part: {$q->qPart}\n";
    echo "  Order: {$q->qOrder}\n";
    echo "  Type: {$q->qType}\n\n";

    // Delete it
    DB::table('questions')->where('qId', 472)->delete();
    echo "✅ Deleted duplicate question 472\n";
} else {
    echo "Question 472 not found.\n";
}

// Verify
echo "\n=== VERIFICATION ===\n";
$exam135 = DB::table('questions')->where('exam_id', 135)->orderBy('qPart')->get();
echo "Exam 135 now has {$exam135->count()} questions:\n";
foreach ($exam135 as $q) {
    echo "  - Part {$q->qPart} (Question ID: {$q->qId})\n";
}
