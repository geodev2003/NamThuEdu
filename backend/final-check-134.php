<?php
require __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\DB;

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== FINAL CHECK: EXAM 134 STATUS ===\n\n";

// 1. Check exams table
echo "1. Checking exams table:\n";
$exam = DB::table('exams')->where('eId', 134)->first();
if ($exam) {
    echo "❌ STILL EXISTS in exams table!\n";
    echo "Title: {$exam->eTitle}\n";
    echo "Status: {$exam->eStatus}\n";
} else {
    echo "✅ NOT FOUND in exams table (correctly deleted)\n";
}

// 2. Check questions table
echo "\n2. Checking questions table:\n";
$questions = DB::table('questions')->where('exam_id', 134)->count();
echo "Questions count: {$questions}\n";
if ($questions > 0) {
    echo "❌ Still has {$questions} questions linked to exam 134!\n";
} else {
    echo "✅ No questions found (correctly deleted)\n";
}

// 3. Check test_assignments table
echo "\n3. Checking test_assignments table:\n";
$assignments = DB::table('test_assignments')->where('exam_id', 134)->count();
echo "Assignments count: {$assignments}\n";
if ($assignments > 0) {
    echo "❌ Still has {$assignments} assignments linked to exam 134!\n";
} else {
    echo "✅ No assignments found\n";
}

// 4. Check exam_results / submissions table
echo "\n4. Checking exam_results table:\n";
try {
    $results = DB::table('exam_results')->where('exam_id', 134)->count();
    echo "Results count: {$results}\n";
    if ($results > 0) {
        echo "❌ Still has {$results} results linked to exam 134!\n";
    } else {
        echo "✅ No results found\n";
    }
} catch (\Exception $e) {
    echo "⚠️ Table exam_results doesn't exist (skipped)\n";
}

// 5. List all YLE Flyers exams (để kiểm tra có exam tương tự không)
echo "\n5. All YLE Flyers - Listening exams:\n";
$flyersExams = DB::table('exams')
    ->where('eTitle', 'LIKE', '%YLE Flyers%Listening%')
    ->select('eId', 'eTitle', 'eStatus', 'eCreated_at')
    ->orderBy('eId', 'desc')
    ->get();

if ($flyersExams->count() > 0) {
    foreach ($flyersExams as $e) {
        echo "ID: {$e->eId} | {$e->eTitle} | Status: {$e->eStatus}\n";
    }
} else {
    echo "No YLE Flyers Listening exams found\n";
}

echo "\n=== RECOMMENDATION ===\n";
if (!$exam && $questions === 0) {
    echo "✅ Exam 134 đã được xóa hoàn toàn khỏi database.\n";
    echo "Nếu vẫn thấy ở frontend:\n";
    echo "  1. Clear browser cache (Ctrl+Shift+Delete)\n";
    echo "  2. Hard refresh (Ctrl+F5)\n";
    echo "  3. Clear localStorage: mở Console → localStorage.clear()\n";
    echo "  4. Clear Service Worker nếu có\n";
} else {
    echo "❌ Exam 134 vẫn còn tồn tại trong database. Cần xóa lại.\n";
}

echo "\n=== DONE ===\n";
