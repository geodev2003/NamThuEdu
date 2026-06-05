<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Use one of the existing webp files in the uploads/avatars folder
$avatarFile = '/uploads/avatars/1775657435_69d661dbc6053.webp';

// Update users who are teachers or admins to have this avatar_url
$affected = DB::table('users')
    ->where('uRole', 'teacher')
    ->orWhere('uRole', 'admin')
    ->update(['avatar_url' => $avatarFile]);

echo "✅ Updated $affected users (teachers/admins) with default avatar_url: $avatarFile\n";
