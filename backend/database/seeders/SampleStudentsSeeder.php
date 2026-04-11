<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ClassModel;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class SampleStudentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tạo 3 học viên mẫu với các age group khác nhau
        
        // 1. Kids Student (6-12 tuổi)
        $kidsClass = ClassModel::where('age_group', 'kids')->first();
        if ($kidsClass) {
            User::create([
                'uName' => 'Bé Minh',
                'uPhone' => '0901234567',
                'uPassword' => Hash::make('password123'),
                'uGender' => 1, // Nam
                'uAddress' => 'Quận 1, TP.HCM',
                'class_id' => $kidsClass->cId,
                'uRole' => 'student',
                'uDoB' => Carbon::create(2016, 5, 15), // 8 tuổi
                'date_of_birth' => Carbon::create(2016, 5, 15),
                'uStatus' => 'active',
                'age_group' => 'kids',
                'theme_preference' => 'colorful',
                'language_preference' => 'vi',
                'bio' => 'Em thích học tiếng Anh và chơi game!',
                'uCreated_at' => now(),
            ]);
        }

        // 2. Teens Student (13-17 tuổi) - Sinh viên
        $teensClass = ClassModel::where('age_group', 'teens')->first();
        if ($teensClass) {
            User::create([
                'uName' => 'Nguyễn Thị Lan',
                'uPhone' => '0902345678',
                'uPassword' => Hash::make('password123'),
                'uGender' => 0, // Nữ
                'uAddress' => 'Quận 3, TP.HCM',
                'class_id' => $teensClass->cId,
                'uRole' => 'student',
                'uDoB' => Carbon::create(2009, 8, 20), // 15 tuổi
                'date_of_birth' => Carbon::create(2009, 8, 20),
                'uStatus' => 'active',
                'age_group' => 'teens',
                'theme_preference' => 'modern',
                'language_preference' => 'vi',
                'bio' => 'Học sinh lớp 10, mục tiêu đạt IELTS 6.5 để du học',
                'uCreated_at' => now(),
            ]);
        }

        // 3. Adults Student (18+ tuổi) - Người đi làm
        $adultsClass = ClassModel::where('age_group', 'adults')->first();
        if ($adultsClass) {
            User::create([
                'uName' => 'Trần Văn Hùng',
                'uPhone' => '0903456789',
                'uPassword' => Hash::make('password123'),
                'uGender' => 1, // Nam
                'uAddress' => 'Quận 7, TP.HCM',
                'class_id' => $adultsClass->cId,
                'uRole' => 'student',
                'uDoB' => Carbon::create(1990, 12, 10), // 34 tuổi
                'date_of_birth' => Carbon::create(1990, 12, 10),
                'uStatus' => 'active',
                'age_group' => 'adults',
                'theme_preference' => 'professional',
                'language_preference' => 'vi',
                'bio' => 'Kỹ sư phần mềm, cần tiếng Anh để thăng tiến trong công việc',
                'uCreated_at' => now(),
            ]);
        }

        $this->command->info('✅ Created 3 sample students:');
        $this->command->info('   - Bé Minh (Kids, 8 tuổi) - Phone: 0901234567');
        $this->command->info('   - Nguyễn Thị Lan (Teens, 15 tuổi) - Phone: 0902345678');
        $this->command->info('   - Trần Văn Hùng (Adults, 34 tuổi) - Phone: 0903456789');
        $this->command->info('   - Password for all: password123');
    }
}