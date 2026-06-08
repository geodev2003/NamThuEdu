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
        // Create/update admin user (stable credentials for local/dev)
        User::updateOrCreate([
            'uPhone' => '0900000000',
        ], [
            'uName' => 'System Admin',
            'uPassword' => Hash::make('admin123'),
            'uRole' => 'admin',
            'uStatus' => 'active',
            'uDoB' => '1992-01-01',
            'uGender' => true,
            'uAddress' => 'Can Tho',
        ]);

        // Create/update teacher user
        $teacher = User::updateOrCreate([
            'uPhone' => '0336695863',
        ], [
            'uName' => 'Nhựt Tuấn',
            'uPassword' => Hash::make('password123'),
            'uRole' => 'teacher',
            'uStatus' => 'active',
            'uDoB' => '1990-01-01',
            'uGender' => true,
            'uAddress' => 'Cần Thơ',
        ]);

        // Create a default class for students
        $classId = \Illuminate\Support\Facades\DB::table('classes')->insertGetId([
            'cName' => 'Lớp Học Mẫu',
            'cTeacher_id' => $teacher->uId,
            'cStatus' => 'active',
            'age_group' => 'adults',
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
                'class_id' => $classId,
                'age_group' => 'adults',
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
                'class_id' => $classId,
                'age_group' => 'adults',
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
                'class_id' => $classId,
                'age_group' => 'adults',
                'uStatus' => 'active',
                'uRole' => 'student'
            ],
        ];

        foreach ($students as $student) {
            User::updateOrCreate(
                ['uPhone' => $student['uPhone']],
                $student
            );
        }
    }
}
