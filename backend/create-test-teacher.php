<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Create or update test teacher
$phone = '0999999999';
$password = 'test123456';

$teacher = DB::table('users')->where('uPhone', $phone)->first();

if ($teacher) {
    // Update existing
    DB::table('users')->where('uPhone', $phone)->update([
        'uPassword' => Hash::make($password),
        'plain_password' => $password,
    ]);
    echo "✅ Updated existing teacher\n";
} else {
    // Create new
    DB::table('users')->insert([
        'uName' => 'Test Teacher',
        'uPhone' => $phone,
        'uPassword' => Hash::make($password),
        'plain_password' => $password,
        'uRole' => 'teacher',
        'uEmail' => 'testteacher@example.com',
    ]);
    echo "✅ Created new teacher\n";
}

echo "Phone: $phone\n";
echo "Password: $password\n";
