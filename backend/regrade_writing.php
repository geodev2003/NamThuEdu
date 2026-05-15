<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Services\VstepGradingService;
use App\Models\Submission;

$id    = (int) ($argv[1] ?? 38);
$skill = $argv[2] ?? 'all'; // 'writing', 'speaking', or 'all'
$sub   = Submission::with(['answers.question', 'exam.questions'])->find($id);
if (!$sub) { echo "Submission {$id} not found.\n"; exit(1); }

$svc = new VstepGradingService();
$wScore = null;
$spScore = null;

if (in_array($skill, ['writing', 'all'])) {
    $wScore = $svc->gradeWriting($sub);
    echo "Writing score: {$wScore}\n\n";
}

if (in_array($skill, ['speaking', 'all'])) {
    $spScore = $svc->gradeSpeaking($sub->fresh());
    echo "Speaking score: {$spScore}\n\n";
}

$svc->updateSubmission($sub->fresh(), $wScore, $spScore);

$raw = json_decode(Submission::find($id)->sGemini_feedback, true);
if (in_array($skill, ['writing', 'all'])) {
    echo "=== WRITING RESULTS ===\n";
    echo json_encode($raw['writing_results'] ?? [], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n\n";
}
if (in_array($skill, ['speaking', 'all'])) {
    echo "=== SPEAKING RESULTS ===\n";
    echo json_encode($raw['speaking_results'] ?? [], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n";
}
