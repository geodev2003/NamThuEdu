<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$student   = App\Models\User::where('uPhone','0903456789')->first();
$teacher   = App\Models\User::where('uRole','teacher')->first();

if (!$student) { echo "NO_STUDENT\n"; exit; }
if (!$teacher) { echo "NO_TEACHER\n"; exit; }

$assignment = App\Models\TestAssignment::where(function($q) use ($student){
    $q->where('taTarget_type','student')->where('taTarget_id',$student->uId);
})->orWhere(function($q) use ($student){
    $q->where('taTarget_type','class')->where('taTarget_id',$student->class_id);
})->whereNotNull('taDeadline')->orderBy('taDeadline')->first();

if (!$assignment) { echo "NO_ASSIGNMENT\n"; exit; }

$r = App\Models\AssignmentReminder::updateOrCreate(
    [
        'assignment_id' => $assignment->taId,
        'student_id'    => $student->uId,
        'dismissed_at'  => null,
    ],
    [
        'teacher_id' => $teacher->uId,
        'message'    => 'Em nhớ làm bài này trước hạn nhé! Cô đã chuẩn bị đề khá hay, cố gắng ôn kỹ phần Listening Part 2.',
        'read_at'    => null,
        'updated_at' => now(),
    ]
);

echo "OK reminder_id={$r->id} assignment_id={$assignment->taId} student={$student->uId} teacher={$teacher->uId}\n";
echo "Title: {$assignment->exam->eTitle}\n";
echo "Deadline: {$assignment->taDeadline}\n";
