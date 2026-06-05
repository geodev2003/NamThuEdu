<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$teachers = \App\Models\User::where('uRole', 'teacher')
    ->get(['uId', 'uName', 'uPhone', 'uEmail', 'plain_password']);

echo "=== Tài khoản giáo viên ===\n\n";
foreach ($teachers as $t) {
    echo "ID:       {$t->uId}\n";
    echo "Tên:      {$t->uName}\n";
    echo "SĐT:      {$t->uPhone}\n";
    echo "Email:    " . ($t->uEmail ?: '(không có)') . "\n";
    echo "Password: " . ($t->plain_password ?: '(đã hash, không xem được)') . "\n";
    echo str_repeat('-', 50) . "\n";
}
echo "\nTổng: " . $teachers->count() . " giáo viên\n";
