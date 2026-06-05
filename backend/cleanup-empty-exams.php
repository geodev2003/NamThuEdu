<?php
/**
 * Script to delete exams with no questions
 * Run: php cleanup-empty-exams.php
 */

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\DB;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "🔍 Tìm đề thi không có câu hỏi...\n\n";

try {
    // Find exams with 0 questions
    $emptyExams = DB::table('exams')
        ->leftJoin('questions', 'exams.eId', '=', 'questions.exam_id')
        ->select('exams.eId', 'exams.eTitle', 'exams.eType', 'exams.eSkill')
        ->groupBy('exams.eId', 'exams.eTitle', 'exams.eType', 'exams.eSkill')
        ->havingRaw('COUNT(questions.qId) = 0')
        ->get();

    if ($emptyExams->isEmpty()) {
        echo "✅ Không tìm thấy đề thi nào không có câu hỏi.\n";
        exit(0);
    }

    echo "📋 Tìm thấy " . $emptyExams->count() . " đề thi không có câu hỏi:\n\n";
    
    foreach ($emptyExams as $exam) {
        echo "  • ID: {$exam->eId}\n";
        echo "    Tên: {$exam->eTitle}\n";
        echo "    Loại: {$exam->eType} - {$exam->eSkill}\n";
        echo "    ---\n";
    }

    echo "\n⚠️  Bạn có muốn xóa tất cả các đề thi này không? (yes/no): ";
    $handle = fopen("php://stdin", "r");
    $line = trim(fgets($handle));
    fclose($handle);

    if (strtolower($line) !== 'yes') {
        echo "❌ Đã hủy bỏ.\n";
        exit(0);
    }

    echo "\n🗑️  Đang xóa...\n";

    $deletedCount = 0;
    foreach ($emptyExams as $exam) {
        // Delete exam
        DB::table('exams')->where('eId', $exam->eId)->delete();
        
        // Also delete related records if tables exist
        try {
            DB::table('test_assignments')->where('exam_id', $exam->eId)->delete();
        } catch (\Exception $e) {
            // Table doesn't exist, skip
        }
        
        try {
            DB::table('test_results')->where('exam_id', $exam->eId)->delete();
        } catch (\Exception $e) {
            // Table doesn't exist, skip
        }
        
        $deletedCount++;
        echo "  ✓ Đã xóa: {$exam->eTitle} (ID: {$exam->eId})\n";
    }

    echo "\n✅ Hoàn tất! Đã xóa {$deletedCount} đề thi không có câu hỏi.\n";

} catch (\Exception $e) {
    echo "❌ Lỗi: " . $e->getMessage() . "\n";
    exit(1);
}
