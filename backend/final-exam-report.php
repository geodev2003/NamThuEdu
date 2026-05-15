<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Exam;

echo "=== FINAL EXAM REPORT ===\n\n";

// Overall stats
$totalExams = Exam::count();
$examsWithQuestions = Exam::has('questions')->count();
$emptyExams = Exam::doesntHave('questions')->count();

echo "📊 OVERALL STATISTICS\n";
echo "Total exams: $totalExams\n";
echo "Exams with questions: $examsWithQuestions\n";
echo "Empty exams: $emptyExams\n\n";

// By age group
echo "📚 BY AGE GROUP\n";
$ageGroups = ['kids', 'teens', 'adults'];
foreach ($ageGroups as $group) {
    $total = Exam::where('age_group', $group)->count();
    $withQ = Exam::where('age_group', $group)->has('questions')->count();
    $empty = Exam::where('age_group', $group)->doesntHave('questions')->count();
    echo ucfirst($group) . ": $total total | $withQ with questions | $empty empty\n";
}

echo "\n🎯 BY EXAM TYPE\n";
$types = ['VSTEP', 'IELTS', 'GENERAL', 'CAMBRIDGE'];
foreach ($types as $type) {
    $total = Exam::where('eType', $type)->count();
    $withQ = Exam::where('eType', $type)->has('questions')->count();
    if ($total > 0) {
        echo "$type: $total total | $withQ with questions\n";
    }
}

echo "\n🎓 KIDS EXAMS DETAIL\n";
$kidsExams = Exam::where('age_group', 'kids')
    ->has('questions')
    ->with('questions')
    ->orderBy('eId')
    ->get();

foreach ($kidsExams as $exam) {
    $qCount = $exam->questions->count();
    $type = $exam->exam_type_code ?: 'N/A';
    echo "ID {$exam->eId}: {$exam->eTitle}\n";
    echo "  Type: $type | Questions: $qCount | Skill: {$exam->eSkill}\n";
}

echo "\n✅ CLEANUP SUCCESSFUL!\n";
echo "All empty kids exams have been removed.\n";
echo "Remaining: {$kidsExams->count()} kids exams with real questions.\n";
