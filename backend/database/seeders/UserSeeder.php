<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create teacher user
        User::create([
            'uName' => 'Nhựt Tuấn',
            'uPhone' => '0336695863',
            'uPassword' => Hash::make('password123'),
            'uRole' => 'teacher',
            'uStatus' => 'active',
            'uDoB' => '1990-01-01',
            'uGender' => true,
            'uAddress' => 'Cần Thơ',
        ]);

        // Create sample students
        $students = [
            [
                'uName' => 'Lê Thị B',
                'uPhone' => '0912345678',
                'uPassword' => Hash::make('password123'),
                'uGender' => false,
                'uDoB' => '2003-02-15',
                'uAddress' => '123 Đường 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ',
                'uClass' => 3,
                'uStatus' => 'active',
                'uRole' => 'student'
            ],
            [
                'uName' => 'Trần Văn C',
                'uPhone' => '0922345678',
                'uPassword' => Hash::make('password123'),
                'uGender' => true,
                'uDoB' => '2003-05-20',
                'uAddress' => '456 Cách Mạng Tháng 8, Bùi Hữu Nghĩa, Bình Thủy, Cần Thơ',
                'uClass' => 3,
                'uStatus' => 'active',
                'uRole' => 'student'
            ],
            [
                'uName' => 'Phạm Thị D',
                'uPhone' => '0932345678',
                'uPassword' => Hash::make('password123'),
                'uGender' => false,
                'uDoB' => '2003-08-10',
                'uAddress' => '789 Nguyễn Văn Cừ, An Khánh, Ninh Kiều, Cần Thơ',
                'uClass' => 3,
                'uStatus' => 'active',
                'uRole' => 'student'
            ],
        ];

        foreach ($students as $student) {
            User::create($student);
        }
    }
}
