<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Exam;

echo "=== CLEANUP EMPTY KIDS EXAMS ===\n\n";

// Find all empty kids exams
$emptyKidsExams = Exam::where('age_group', 'kids')
    ->doesntHave('questions')
    ->get();

echo "Found {$emptyKidsExams->count()} empty kids exams\n\n";

if ($emptyKidsExams->count() === 0) {
    echo "No empty exams to delete!\n";
    exit(0);
}

echo "Exams to be deleted:\n";
foreach ($emptyKidsExams as $exam) {
    echo "  - ID: {$exam->eId} | {$exam->eTitle}\n";
}

echo "\nDeleting...\n";

$deleted = 0;
foreach ($emptyKidsExams as $exam) {
    try {
        $exam->delete();
        $deleted++;
        echo "  ✓ Deleted exam ID {$exam->eId}\n";
    } catch (\Exception $e) {
        echo "  ✗ Failed to delete exam ID {$exam->eId}: {$e->getMessage()}\n";
    }
}

echo "\n=== CLEANUP COMPLETE ===\n";
echo "Deleted: $deleted exams\n";

// Show remaining stats
$remainingKids = Exam::where('age_group', 'kids')->count();
$remainingWithQuestions = Exam::where('age_group', 'kids')->has('questions')->count();

echo "\nRemaining kids exams: $remainingKids\n";
echo "Kids exams with questions: $remainingWithQuestions\n";
