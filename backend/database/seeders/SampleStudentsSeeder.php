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
     * Self-contained: auto-creates classes per age_group if missing.
     */
    public function run(): void
    {
        // Find teacher to assign as class teacher (fallback: null)
        $teacher = User::where('uRole', 'teacher')->first();
        $teacherId = $teacher ? $teacher->uId : null;

        // 1. Kids Student (6-12 tuổi)
        $kidsClass = ClassModel::firstOrCreate(
            ['age_group' => 'kids'],
            [
                'cName'       => 'Lớp Kids Mẫu',
                'cTeacher_id' => $teacherId,
                'cDescription'=> 'Lớp học dành cho học viên nhỏ tuổi (6-12)',
                'max_students'=> 30,
                'cStatus'     => 'active',
            ]
        );

        User::updateOrCreate(
            ['uPhone' => '0901234567'],
            [
                'uName'               => 'Bé Minh',
                'uPassword'           => Hash::make('password123'),
                'uGender'             => 1,
                'uAddress'            => 'Quận 1, TP.HCM',
                'class_id'            => $kidsClass->cId,
                'uRole'               => 'student',
                'uDoB'                => Carbon::create(2016, 5, 15),
                'date_of_birth'       => Carbon::create(2016, 5, 15),
                'uStatus'             => 'active',
                'age_group'           => 'kids',
                'theme_preference'    => 'colorful',
                'language_preference' => 'vi',
                'bio'                 => 'Em thích học tiếng Anh và chơi game!',
            ]
        );

        // 2. Teens Student (13-17 tuổi)
        $teensClass = ClassModel::firstOrCreate(
            ['age_group' => 'teens'],
            [
                'cName'       => 'Lớp Teens Mẫu',
                'cTeacher_id' => $teacherId,
                'cDescription'=> 'Lớp học dành cho học viên thiếu niên (13-17)',
                'max_students'=> 30,
                'cStatus'     => 'active',
            ]
        );

        User::updateOrCreate(
            ['uPhone' => '0902345678'],
            [
                'uName'               => 'Nguyễn Thị Lan',
                'uPassword'           => Hash::make('password123'),
                'uGender'             => 0,
                'uAddress'            => 'Quận 3, TP.HCM',
                'class_id'            => $teensClass->cId,
                'uRole'               => 'student',
                'uDoB'                => Carbon::create(2009, 8, 20),
                'date_of_birth'       => Carbon::create(2009, 8, 20),
                'uStatus'             => 'active',
                'age_group'           => 'teens',
                'theme_preference'    => 'modern',
                'language_preference' => 'vi',
                'bio'                 => 'Học sinh lớp 10, mục tiêu đạt IELTS 6.5 để du học',
            ]
        );

        // 3. Adults Student (18+ tuổi)
        $adultsClass = ClassModel::firstOrCreate(
            ['age_group' => 'adults'],
            [
                'cName'       => 'Lớp Adults Mẫu',
                'cTeacher_id' => $teacherId,
                'cDescription'=> 'Lớp học dành cho học viên người lớn (18+)',
                'max_students'=> 30,
                'cStatus'     => 'active',
            ]
        );

        User::updateOrCreate(
            ['uPhone' => '0903456789'],
            [
                'uName'               => 'Trần Văn Hùng',
                'uPassword'           => Hash::make('password123'),
                'uGender'             => 1,
                'uAddress'            => 'Quận 7, TP.HCM',
                'class_id'            => $adultsClass->cId,
                'uRole'               => 'student',
                'uDoB'                => Carbon::create(1990, 12, 10),
                'date_of_birth'       => Carbon::create(1990, 12, 10),
                'uStatus'             => 'active',
                'age_group'           => 'adults',
                'theme_preference'    => 'professional',
                'language_preference' => 'vi',
                'bio'                 => 'Kỹ sư phần mềm, cần tiếng Anh để thăng tiến trong công việc',
            ]
        );

        $this->command->info('✅ 3 tài khoản học viên mẫu đã được tạo:');
        $this->command->info('');
        $this->command->info('  👶 KIDS   → Phone: 0901234567 | Pass: password123 | Tên: Bé Minh');
        $this->command->info('  🧑 TEENS  → Phone: 0902345678 | Pass:    | Tên: Nguyễn Thị Lan');
        $this->command->info('  👔 ADULTS → Phone: 0903456789 | Pass: 0903456789 | Tên: Trần Văn Hùng');
    }
}