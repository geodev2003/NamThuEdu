<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Find student by phone 0123456789 or any student
$student = User::where('uPhone', '0123456789')->first();

if (!$student) {
    // If not found, try to find any student and update their phone to 0123456789
    $student = User::where('uRole', 'student')->first();
    if (!$student) {
        $student = new User();
        $student->uRole = 'student';
        $student->uName = 'K6 Test User';
        $student->uStatus = 'active';
    }
    $student->uPhone = '0123456789';
}

$student->uPassword = Hash::make('password123');
$student->save();
echo 'SUCCESS_PHONE:' . $student->uPhone;
