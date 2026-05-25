<?php
/**
 * Tạo/cập nhật tài khoản admin: phone=admin, password=admin123
 * Chạy: php create-admin.php (từ thư mục backend)
 */
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$user = User::updateOrCreate(
    ['uPhone' => 'admin'],
    [
        'uName'     => 'Administrator',
        'uPassword' => Hash::make('admin123'),
        'uRole'     => 'admin',
        'uStatus'   => 'active',
        'uDoB'      => '1990-01-01',
        'uGender'   => true,
    ]
);

echo "✅ Tài khoản admin đã sẵn sàng:\n";
echo "   Số điện thoại : admin\n";
echo "   Mật khẩu      : admin123\n";
echo "   ID            : {$user->uId}\n";
echo "   Trạng thái    : {$user->uStatus}\n";
