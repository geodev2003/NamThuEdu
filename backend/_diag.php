<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$lines = [];
$lines[] = 'Assignments to uId=15: '.App\Models\TestAssignment::where('taTarget_type','student')->where('taTarget_id',15)->count();
foreach (App\Models\TestAssignment::orderByDesc('taId')->limit(6)->get() as $a) {
    $lines[] = "taId={$a->taId} exam_id={$a->exam_id} type={$a->taTarget_type} target_id={$a->taTarget_id} created={$a->taCreated_at}";
}
$lines[] = '--- VSTEP exams ---';
foreach (App\Models\Exam::where('eType','VSTEP')->get() as $e) {
    $lines[] = "eId={$e->eId} skill=".var_export($e->eSkill,true)." status={$e->eStatus} age=".var_export($e->age_group,true);
}
file_put_contents(__DIR__.'/diag_out.txt', implode("\n", $lines)."\n");
echo "DONE\n";
