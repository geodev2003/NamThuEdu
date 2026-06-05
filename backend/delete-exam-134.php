<?php
require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

try {
    $pdo = new PDO(
        'mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_DATABASE'],
        $_ENV['DB_USERNAME'],
        $_ENV['DB_PASSWORD']
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $examId = 134;

    echo "🗑️  BẮT ĐẦU XÓA ĐỀ THI ID: $examId\n";
    echo "=====================================\n\n";

    // Start transaction
    $pdo->beginTransaction();

    // 1. Count and delete questions
    $stmt = $pdo->prepare('SELECT COUNT(*) as count FROM questions WHERE exam_id = ?');
    $stmt->execute([$examId]);
    $questionCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    echo "📝 Tìm thấy $questionCount câu hỏi\n";
    
    if ($questionCount > 0) {
        $stmt = $pdo->prepare('DELETE FROM questions WHERE exam_id = ?');
        $stmt->execute([$examId]);
        echo "✅ Đã xóa $questionCount câu hỏi\n";
    }

    // 2. Count and delete submissions
    $stmt = $pdo->prepare('SELECT COUNT(*) as count FROM submissions WHERE exam_id = ?');
    $stmt->execute([$examId]);
    $submissionCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    echo "📋 Tìm thấy $submissionCount submissions\n";
    
    if ($submissionCount > 0) {
        // Delete submission_answers first
        $stmt = $pdo->prepare('DELETE sa FROM submission_answers sa INNER JOIN submissions s ON sa.submission_id = s.id WHERE s.exam_id = ?');
        $stmt->execute([$examId]);
        
        // Delete submissions
        $stmt = $pdo->prepare('DELETE FROM submissions WHERE exam_id = ?');
        $stmt->execute([$examId]);
        echo "✅ Đã xóa $submissionCount submissions và answers\n";
    }

    // 3. Count and delete test assignments
    $stmt = $pdo->prepare('SELECT COUNT(*) as count FROM test_assignments WHERE exam_id = ?');
    $stmt->execute([$examId]);
    $assignmentCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    echo "📌 Tìm thấy $assignmentCount test assignments\n";
    
    if ($assignmentCount > 0) {
        $stmt = $pdo->prepare('DELETE FROM test_assignments WHERE exam_id = ?');
        $stmt->execute([$examId]);
        echo "✅ Đã xóa $assignmentCount test assignments\n";
    }

    // 4. Delete the exam itself
    $stmt = $pdo->prepare('DELETE FROM exams WHERE eId = ?');
    $stmt->execute([$examId]);
    echo "✅ Đã xóa exam ID: $examId\n";

    // Commit transaction
    $pdo->commit();

    echo "\n=====================================\n";
    echo "✅ HOÀN TẤT XÓA ĐỀ THI ID: $examId\n";
    echo "=====================================\n";
    echo "Tổng kết:\n";
    echo "- Câu hỏi: $questionCount\n";
    echo "- Submissions: $submissionCount\n";
    echo "- Assignments: $assignmentCount\n";
    echo "- Exam: 1\n";

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo "❌ Lỗi: " . $e->getMessage() . "\n";
    exit(1);
}
