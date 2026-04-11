<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$user = \App\Models\User::where('uRole', 'teacher')->first();
if ($user) {
    $token = $user->createToken('test-token')->plainTextToken;
    echo $token;
} else {
    echo "No teacher found";
}
