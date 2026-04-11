<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\StudentCoin;
use App\Models\StudentStats;
use App\Models\StudentStreak;
use App\Models\StudentAchievement;
use App\Models\CoinTransaction;
use App\Models\Achievement;
use App\Models\Badge;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SampleStudentGamificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lấy 3 học viên mẫu
        $kidsStudent = User::where('uPhone', '0901234567')->first();
        $teensStudent = User::where('uPhone', '0902345678')->first();
        $adultsStudent = User::where('uPhone', '0903456789')->first();

        if (!$kidsStudent || !$teensStudent || !$adultsStudent) {
            $this->command->error('❌ Sample students not found. Please run SampleStudentsSeeder first.');
            return;
        }

        // 1. KIDS STUDENT - Bé Minh (Gamification cao)
        $this->createKidsGamificationData($kidsStudent);

        // 2. TEENS STUDENT - Nguyễn Thị Lan (Gamification trung bình)
        $this->createTeensGamificationData($teensStudent);

        // 3. ADULTS STUDENT - Trần Văn Hùng (Gamification thấp, focus analytics)
        $this->createAdultsGamificationData($adultsStudent);

        $this->command->info('✅ Created gamification data for all 3 sample students');
    }

    private function createKidsGamificationData($student)
    {
        // Coins - Kids có nhiều coins nhất
        StudentCoin::updateOrCreate(
            ['student_id' => $student->uId],
            [
                'total_coins' => 850,
                'lifetime_coins' => 1200,
                'spent_coins' => 350,
            ]
        );

        // Stats - Kids có nhiều hoạt động
        StudentStats::updateOrCreate(
            ['student_id' => $student->uId],
            [
                'lessons_completed' => 25,
                'exams_taken' => 8,
                'practice_sessions' => 45,
                'total_points' => 2100,
                'average_score' => 78.5,
                'study_time_minutes' => 720, // 12 hours
            ]
        );

        // Streak - Kids có streak tốt
        StudentStreak::updateOrCreate(
            ['student_id' => $student->uId],
            [
                'current_streak' => 12,
                'longest_streak' => 15,
                'last_activity_date' => Carbon::today(),
                'total_active_days' => 45,
            ]
        );

        // Coin Transactions - Kids có nhiều giao dịch
        $transactions = [
            ['reason' => 'lesson_completed', 'amount' => 10, 'type' => 'earn', 'description' => 'Hoàn thành bài học về động vật'],
            ['reason' => 'exam_completed', 'amount' => 25, 'type' => 'earn', 'description' => 'Làm bài kiểm tra đạt 85 điểm'],
            ['reason' => 'daily_login', 'amount' => 5, 'type' => 'earn', 'description' => 'Đăng nhập hàng ngày'],
            ['reason' => 'streak_bonus', 'amount' => 50, 'type' => 'earn', 'description' => 'Học 10 ngày liên tiếp'],
            ['reason' => 'pet_food', 'amount' => 20, 'type' => 'spend', 'description' => 'Mua thức ăn cho thú cưng'],
            ['reason' => 'avatar_unlock', 'amount' => 30, 'type' => 'spend', 'description' => 'Mở khóa avatar mới'],
        ];

        foreach ($transactions as $transaction) {
            CoinTransaction::create([
                'student_id' => $student->uId,
                'type' => $transaction['type'],
                'amount' => $transaction['amount'],
                'reason' => $transaction['reason'],
                'description' => $transaction['description'],
                'metadata' => null,
            ]);
        }

        // Badges - Kids có nhiều badges
        $kidsBadges = Badge::whereIn('age_group', ['kids', 'all'])->limit(4)->get();
        foreach ($kidsBadges as $badge) {
            // Check if badge already exists
            $exists = DB::table('student_badges')
                ->where('student_id', $student->uId)
                ->where('badge_id', $badge->id)
                ->exists();
                
            if (!$exists) {
                DB::table('student_badges')->insert([
                    'student_id' => $student->uId,
                    'badge_id' => $badge->id,
                    'earned_at' => Carbon::now()->subDays(rand(1, 30)),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Achievements - Kids có một số achievements hoàn thành
        $kidsAchievements = Achievement::whereIn('age_group', ['kids', 'all'])->limit(6)->get();
        foreach ($kidsAchievements as $index => $achievement) {
            $isCompleted = $index < 2; // 2 achievements đầu đã hoàn thành
            
            // Check if achievement already exists
            $existingAchievement = StudentAchievement::where('student_id', $student->uId)
                ->where('achievement_id', $achievement->id)
                ->first();
                
            if (!$existingAchievement) {
                StudentAchievement::create([
                    'student_id' => $student->uId,
                    'achievement_id' => $achievement->id,
                    'current_value' => $isCompleted ? $achievement->target_value : rand(1, $achievement->target_value - 1),
                    'target_value' => $achievement->target_value,
                    'is_completed' => $isCompleted,
                    'completed_at' => $isCompleted ? Carbon::now()->subDays(rand(1, 20)) : null,
                    'metadata' => null,
                ]);
            }
        }

        $this->command->info('   ✅ Kids gamification data created');
    }

    private function createTeensGamificationData($student)
    {
        // Coins - Teens có coins trung bình
        StudentCoin::updateOrCreate(
            ['student_id' => $student->uId],
            [
                'total_coins' => 520,
                'lifetime_coins' => 750,
                'spent_coins' => 230,
            ]
        );

        // Stats - Teens focus vào exams
        StudentStats::updateOrCreate(
            ['student_id' => $student->uId],
            [
                'lessons_completed' => 18,
                'exams_taken' => 15,
                'practice_sessions' => 28,
                'total_points' => 3200,
                'average_score' => 82.3,
                'study_time_minutes' => 960, // 16 hours
            ]
        );

        // Streak - Teens có streak ổn
        StudentStreak::updateOrCreate(
            ['student_id' => $student->uId],
            [
                'current_streak' => 7,
                'longest_streak' => 18,
                'last_activity_date' => Carbon::today(),
                'total_active_days' => 32,
            ]
        );

        // Coin Transactions - Teens có ít giao dịch hơn
        $transactions = [
            ['reason' => 'exam_completed', 'amount' => 35, 'type' => 'earn', 'description' => 'Làm bài thi IELTS mock đạt 7.0'],
            ['reason' => 'lesson_completed', 'amount' => 10, 'type' => 'earn', 'description' => 'Hoàn thành bài học Writing'],
            ['reason' => 'achievement_completed', 'amount' => 100, 'type' => 'earn', 'description' => 'Đạt thành tích "IELTS Warrior"'],
            ['reason' => 'premium_content', 'amount' => 50, 'type' => 'spend', 'description' => 'Mở khóa đề thi IELTS premium'],
        ];

        foreach ($transactions as $transaction) {
            CoinTransaction::create([
                'student_id' => $student->uId,
                'type' => $transaction['type'],
                'amount' => $transaction['amount'],
                'reason' => $transaction['reason'],
                'description' => $transaction['description'],
                'metadata' => null,
            ]);
        }

        // Badges - Teens có badges trung bình
        $teensBadges = Badge::whereIn('age_group', ['teens', 'all'])->limit(3)->get();
        foreach ($teensBadges as $badge) {
            DB::table('student_badges')->insert([
                'student_id' => $student->uId,
                'badge_id' => $badge->id,
                'earned_at' => Carbon::now()->subDays(rand(1, 25)),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Achievements - Teens có achievements focus vào skills
        $teensAchievements = Achievement::whereIn('age_group', ['teens', 'all'])->limit(5)->get();
        foreach ($teensAchievements as $index => $achievement) {
            $isCompleted = $index < 1; // 1 achievement đã hoàn thành
            StudentAchievement::create([
                'student_id' => $student->uId,
                'achievement_id' => $achievement->id,
                'current_value' => $isCompleted ? $achievement->target_value : rand(5, $achievement->target_value - 2),
                'target_value' => $achievement->target_value,
                'is_completed' => $isCompleted,
                'completed_at' => $isCompleted ? Carbon::now()->subDays(rand(1, 15)) : null,
                'metadata' => null,
            ]);
        }

        $this->command->info('   ✅ Teens gamification data created');
    }

    private function createAdultsGamificationData($student)
    {
        // Coins - Adults có ít coins nhất (không quan tâm gamification)
        StudentCoin::updateOrCreate(
            ['student_id' => $student->uId],
            [
                'total_coins' => 280,
                'lifetime_coins' => 420,
                'spent_coins' => 140,
            ]
        );

        // Stats - Adults có stats cao nhất (focus vào kết quả)
        StudentStats::updateOrCreate(
            ['student_id' => $student->uId],
            [
                'lessons_completed' => 35,
                'exams_taken' => 22,
                'practice_sessions' => 18,
                'total_points' => 4500,
                'average_score' => 88.7,
                'study_time_minutes' => 1440, // 24 hours
            ]
        );

        // Streak - Adults có streak thấp (không đều đặn)
        StudentStreak::updateOrCreate(
            ['student_id' => $student->uId],
            [
                'current_streak' => 3,
                'longest_streak' => 8,
                'last_activity_date' => Carbon::today(),
                'total_active_days' => 28,
            ]
        );

        // Coin Transactions - Adults có ít giao dịch, focus vào learning
        $transactions = [
            ['reason' => 'exam_completed', 'amount' => 45, 'type' => 'earn', 'description' => 'Hoàn thành TOEIC test đạt 850'],
            ['reason' => 'lesson_completed', 'amount' => 10, 'type' => 'earn', 'description' => 'Hoàn thành Business English module'],
            ['reason' => 'certificate_unlock', 'amount' => 80, 'type' => 'spend', 'description' => 'Mở khóa chứng chỉ Business English'],
        ];

        foreach ($transactions as $transaction) {
            CoinTransaction::create([
                'student_id' => $student->uId,
                'type' => $transaction['type'],
                'amount' => $transaction['amount'],
                'reason' => $transaction['reason'],
                'description' => $transaction['description'],
                'metadata' => null,
            ]);
        }

        // Badges - Adults có ít badges
        $adultsBadges = Badge::whereIn('age_group', ['adults', 'all'])->limit(2)->get();
        foreach ($adultsBadges as $badge) {
            DB::table('student_badges')->insert([
                'student_id' => $student->uId,
                'badge_id' => $badge->id,
                'earned_at' => Carbon::now()->subDays(rand(1, 20)),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Achievements - Adults có achievements focus vào professional goals
        $adultsAchievements = Achievement::whereIn('age_group', ['adults', 'all'])->limit(4)->get();
        foreach ($adultsAchievements as $index => $achievement) {
            $isCompleted = $index < 1; // 1 achievement đã hoàn thành
            StudentAchievement::create([
                'student_id' => $student->uId,
                'achievement_id' => $achievement->id,
                'current_value' => $isCompleted ? $achievement->target_value : rand(8, $achievement->target_value - 1),
                'target_value' => $achievement->target_value,
                'is_completed' => $isCompleted,
                'completed_at' => $isCompleted ? Carbon::now()->subDays(rand(1, 10)) : null,
                'metadata' => null,
            ]);
        }

        $this->command->info('   ✅ Adults gamification data created');
    }
}