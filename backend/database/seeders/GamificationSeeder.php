<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GamificationSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedBadges();
        $this->seedAchievements();
        $this->seedStudentInitialData();
    }

    private function seedBadges(): void
    {
        DB::table('student_badges')->delete();
        DB::table('badges')->delete();
        
        $badges = [
            ['name' => 'Người mới bắt đầu', 'slug' => 'beginner', 'description' => 'Hoàn thành bài học đầu tiên', 'icon' => '🌟', 'color' => '#FFD700', 'rarity' => 'common', 'age_group' => 'all', 'requirements' => json_encode(['lessons_completed' => 1]), 'coin_reward' => 10, 'is_active' => true],
            ['name' => 'Siêu sao nhỏ', 'slug' => 'little_star', 'description' => 'Hoàn thành 10 bài học', 'icon' => '⭐', 'color' => '#FFA500', 'rarity' => 'common', 'age_group' => 'kids', 'requirements' => json_encode(['lessons_completed' => 10]), 'coin_reward' => 50, 'is_active' => true],
            ['name' => 'Nhà thám hiểm', 'slug' => 'explorer', 'description' => 'Học 7 ngày liên tục', 'icon' => '🗺️', 'color' => '#4CAF50', 'rarity' => 'rare', 'age_group' => 'kids', 'requirements' => json_encode(['streak_days' => 7]), 'coin_reward' => 100, 'is_active' => true],
            ['name' => 'Chiến binh nhỏ', 'slug' => 'little_warrior', 'description' => 'Đạt 100 điểm', 'icon' => '⚔️', 'color' => '#F44336', 'rarity' => 'rare', 'age_group' => 'kids', 'requirements' => json_encode(['total_points' => 100]), 'coin_reward' => 75, 'is_active' => true],
            ['name' => 'Học giả trẻ', 'slug' => 'young_scholar', 'description' => 'Hoàn thành 25 bài học', 'icon' => '📚', 'color' => '#2196F3', 'rarity' => 'rare', 'age_group' => 'teens', 'requirements' => json_encode(['lessons_completed' => 25]), 'coin_reward' => 150, 'is_active' => true],
            ['name' => 'Streak Master', 'slug' => 'streak_master', 'description' => 'Học 30 ngày liên tục', 'icon' => '🔥', 'color' => '#FF5722', 'rarity' => 'epic', 'age_group' => 'teens', 'requirements' => json_encode(['streak_days' => 30]), 'coin_reward' => 300, 'is_active' => true],
            ['name' => 'Điểm cao', 'slug' => 'high_scorer', 'description' => 'Đạt điểm trung bình trên 90%', 'icon' => '💯', 'color' => '#9C27B0', 'rarity' => 'epic', 'age_group' => 'teens', 'requirements' => json_encode(['average_score' => 90]), 'coin_reward' => 200, 'is_active' => true],
            ['name' => 'Chuyên gia', 'slug' => 'expert', 'description' => 'Hoàn thành 50 bài học', 'icon' => '🎓', 'color' => '#607D8B', 'rarity' => 'epic', 'age_group' => 'adults', 'requirements' => json_encode(['lessons_completed' => 50]), 'coin_reward' => 250, 'is_active' => true],
            ['name' => 'Kiên trì', 'slug' => 'persistent', 'description' => 'Học 60 ngày liên tục', 'icon' => '💪', 'color' => '#795548', 'rarity' => 'legendary', 'age_group' => 'adults', 'requirements' => json_encode(['streak_days' => 60]), 'coin_reward' => 500, 'is_active' => true],
            ['name' => 'Hoàn hảo', 'slug' => 'perfectionist', 'description' => 'Đạt 100% trong 5 bài kiểm tra', 'icon' => '🏆', 'color' => '#FFD700', 'rarity' => 'legendary', 'age_group' => 'adults', 'requirements' => json_encode(['perfect_exams' => 5]), 'coin_reward' => 400, 'is_active' => true],
        ];

        DB::table('badges')->insert($badges);
    }

    private function seedAchievements(): void
    {
        DB::table('student_achievements')->delete();
        DB::table('achievements')->delete();
        
        $achievements = [
            ['code' => 'first_lesson', 'name' => 'Bài học đầu tiên', 'slug' => 'first_lesson', 'description' => 'Hoàn thành bài học đầu tiên của bạn', 'icon' => '📖', 'category' => 'lessons', 'age_group' => 'all', 'target_value' => 1, 'target_type' => 'lessons_completed', 'coin_reward' => 10, 'is_active' => true],
            ['code' => 'ten_lessons', 'name' => '10 bài học', 'slug' => 'ten_lessons', 'description' => 'Hoàn thành 10 bài học', 'icon' => '📚', 'category' => 'lessons', 'age_group' => 'all', 'target_value' => 10, 'target_type' => 'lessons_completed', 'coin_reward' => 50, 'is_active' => true],
            ['code' => 'twentyfive_lessons', 'name' => '25 bài học', 'slug' => 'twentyfive_lessons', 'description' => 'Hoàn thành 25 bài học', 'icon' => '📕', 'category' => 'lessons', 'age_group' => 'all', 'target_value' => 25, 'target_type' => 'lessons_completed', 'coin_reward' => 100, 'is_active' => true],
            ['code' => 'fifty_lessons', 'name' => '50 bài học', 'slug' => 'fifty_lessons', 'description' => 'Hoàn thành 50 bài học', 'icon' => '📗', 'category' => 'lessons', 'age_group' => 'all', 'target_value' => 50, 'target_type' => 'lessons_completed', 'coin_reward' => 200, 'is_active' => true],
            ['code' => 'first_exam', 'name' => 'Bài kiểm tra đầu tiên', 'slug' => 'first_exam', 'description' => 'Hoàn thành bài kiểm tra đầu tiên', 'icon' => '📝', 'category' => 'exams', 'age_group' => 'all', 'target_value' => 1, 'target_type' => 'exams_taken', 'coin_reward' => 20, 'is_active' => true],
            ['code' => 'high_score', 'name' => 'Điểm cao', 'slug' => 'high_score', 'description' => 'Đạt trên 90% trong bài kiểm tra', 'icon' => '🌟', 'category' => 'exams', 'age_group' => 'all', 'target_value' => 90, 'target_type' => 'exam_score', 'coin_reward' => 50, 'is_active' => true],
            ['code' => 'perfect_score', 'name' => 'Hoàn hảo', 'slug' => 'perfect_score', 'description' => 'Đạt 100% trong bài kiểm tra', 'icon' => '💯', 'category' => 'exams', 'age_group' => 'all', 'target_value' => 100, 'target_type' => 'exam_score', 'coin_reward' => 100, 'is_active' => true],
            ['code' => 'first_practice', 'name' => 'Luyện tập đầu tiên', 'slug' => 'first_practice', 'description' => 'Hoàn thành buổi luyện tập đầu tiên', 'icon' => '✏️', 'category' => 'practice', 'age_group' => 'all', 'target_value' => 1, 'target_type' => 'practice_sessions', 'coin_reward' => 10, 'is_active' => true],
            ['code' => 'practice_hard', 'name' => 'Người luyện tập chăm chỉ', 'slug' => 'practice_hard', 'description' => 'Hoàn thành 20 buổi luyện tập', 'icon' => '💪', 'category' => 'practice', 'age_group' => 'all', 'target_value' => 20, 'target_type' => 'practice_sessions', 'coin_reward' => 75, 'is_active' => true],
            ['code' => 'streak_7', 'name' => 'Streak 7 ngày', 'slug' => 'streak_7', 'description' => 'Học 7 ngày liên tục', 'icon' => '🔥', 'category' => 'special', 'age_group' => 'all', 'target_value' => 7, 'target_type' => 'streak_days', 'coin_reward' => 100, 'is_active' => true],
            ['code' => 'streak_30', 'name' => 'Streak 30 ngày', 'slug' => 'streak_30', 'description' => 'Học 30 ngày liên tục', 'icon' => '🔥', 'category' => 'special', 'age_group' => 'all', 'target_value' => 30, 'target_type' => 'streak_days', 'coin_reward' => 300, 'is_active' => true],
        ];

        DB::table('achievements')->insert($achievements);
    }

    private function seedStudentInitialData(): void
    {
        $students = DB::table('users')->where('uRole', 'student')->get();

        foreach ($students as $student) {
            if (!DB::table('student_coins')->where('student_id', $student->uId)->exists()) {
                DB::table('student_coins')->insert([
                    'student_id' => $student->uId,
                    'total_coins' => 0,
                    'lifetime_coins' => 0,
                    'spent_coins' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            if (!DB::table('student_stats')->where('student_id', $student->uId)->exists()) {
                DB::table('student_stats')->insert([
                    'student_id' => $student->uId,
                    'lessons_completed' => 0,
                    'exams_taken' => 0,
                    'practice_sessions' => 0,
                    'total_points' => 0,
                    'average_score' => 0,
                    'study_time_minutes' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            if (!DB::table('student_streaks')->where('student_id', $student->uId)->exists()) {
                DB::table('student_streaks')->insert([
                    'student_id' => $student->uId,
                    'current_streak' => 0,
                    'longest_streak' => 0,
                    'last_activity_date' => null,
                    'total_active_days' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
