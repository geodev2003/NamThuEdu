<?php

namespace App\Services;

use App\Models\StudentCoin;
use App\Models\CoinTransaction;
use App\Models\Badge;
use App\Models\Achievement;
use App\Models\StudentAchievement;
use App\Models\StudentStreak;
use App\Models\StudentStats;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GamificationService
{
    /**
     * Award coins to student
     */
    public function awardCoins(int $studentId, int $amount, string $reason, string $type = 'earn', ?string $description = null, ?array $metadata = null): bool
    {
        try {
            DB::beginTransaction();

            // Get or create student coins record
            $studentCoin = StudentCoin::firstOrCreate(
                ['student_id' => $studentId],
                ['total_coins' => 0, 'lifetime_coins' => 0, 'spent_coins' => 0]
            );

            // Update coins
            if ($type === 'earn') {
                $studentCoin->total_coins += $amount;
                $studentCoin->lifetime_coins += $amount;
            } else {
                $studentCoin->total_coins -= $amount;
                $studentCoin->spent_coins += $amount;
            }
            $studentCoin->save();

            // Create transaction record
            CoinTransaction::create([
                'student_id' => $studentId,
                'type' => $type,
                'amount' => $amount,
                'reason' => $reason,
                'description' => $description,
                'metadata' => $metadata,
            ]);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to award coins: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Check and award badges based on student progress
     */
    public function checkAndAwardBadges(int $studentId): array
    {
        $awardedBadges = [];
        
        try {
            $student = User::find($studentId);
            if (!$student) return $awardedBadges;

            $stats = StudentStats::where('student_id', $studentId)->first();
            $streak = StudentStreak::where('student_id', $studentId)->first();

            // Get all badges for this age group that student hasn't earned yet
            $earnedBadgeIds = DB::table('student_badges')
                ->where('student_id', $studentId)
                ->pluck('badge_id')
                ->toArray();

            $badges = Badge::where('is_active', true)
                ->whereIn('age_group', [$student->age_group ?? 'teens', 'all'])
                ->whereNotIn('id', $earnedBadgeIds)
                ->get();

            foreach ($badges as $badge) {
                if ($this->checkBadgeRequirements($badge, $stats, $streak)) {
                    // Award badge
                    DB::table('student_badges')->insert([
                        'student_id' => $studentId,
                        'badge_id' => $badge->id,
                        'earned_at' => now(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    // Award coins
                    $this->awardCoins(
                        $studentId,
                        $badge->coin_reward,
                        'badge_earned',
                        'earn',
                        "Nhận huy hiệu: {$badge->name}",
                        ['badge_id' => $badge->id, 'badge_name' => $badge->name]
                    );

                    $awardedBadges[] = $badge;
                }
            }
        } catch (\Exception $e) {
            \Log::error('Failed to check badges: ' . $e->getMessage());
        }

        return $awardedBadges;
    }

    /**
     * Check if badge requirements are met
     */
    private function checkBadgeRequirements(Badge $badge, ?StudentStats $stats, ?StudentStreak $streak): bool
    {
        $requirements = $badge->requirements;
        if (!$requirements) return false;

        foreach ($requirements as $key => $value) {
            switch ($key) {
                case 'lessons_completed':
                    if (!$stats || $stats->lessons_completed < $value) return false;
                    break;
                case 'exams_taken':
                    if (!$stats || $stats->exams_taken < $value) return false;
                    break;
                case 'total_points':
                    if (!$stats || $stats->total_points < $value) return false;
                    break;
                case 'average_score':
                    if (!$stats || $stats->average_score < $value) return false;
                    break;
                case 'streak_days':
                    if (!$streak || $streak->current_streak < $value) return false;
                    break;
            }
        }

        return true;
    }

    /**
     * Update achievement progress
     */
    public function updateAchievementProgress(int $studentId, string $targetType, int $value, ?array $metadata = null): array
    {
        $completedAchievements = [];

        try {
            $student = User::find($studentId);
            if (!$student) return $completedAchievements;

            // Get all achievements for this target type
            $achievements = Achievement::where('is_active', true)
                ->where('target_type', $targetType)
                ->whereIn('age_group', [$student->age_group ?? 'teens', 'all'])
                ->get();

            foreach ($achievements as $achievement) {
                // Get or create student achievement
                $studentAchievement = StudentAchievement::firstOrCreate(
                    [
                        'student_id' => $studentId,
                        'achievement_id' => $achievement->id,
                    ],
                    [
                        'current_value' => 0,
                        'target_value' => $achievement->target_value,
                        'is_completed' => false,
                    ]
                );

                // Skip if already completed
                if ($studentAchievement->is_completed) continue;

                // Update progress
                $studentAchievement->current_value = $value;
                if ($metadata) {
                    $studentAchievement->metadata = array_merge($studentAchievement->metadata ?? [], $metadata);
                }

                // Check if completed
                if ($studentAchievement->current_value >= $achievement->target_value) {
                    $studentAchievement->is_completed = true;
                    $studentAchievement->completed_at = now();
                    
                    // Award coins
                    $this->awardCoins(
                        $studentId,
                        $achievement->coin_reward,
                        'achievement_completed',
                        'earn',
                        "Hoàn thành thành tích: {$achievement->name}",
                        ['achievement_id' => $achievement->id, 'achievement_name' => $achievement->name]
                    );

                    $completedAchievements[] = $achievement;
                }

                $studentAchievement->save();
            }
        } catch (\Exception $e) {
            \Log::error('Failed to update achievement progress: ' . $e->getMessage());
        }

        return $completedAchievements;
    }

    /**
     * Update student streak
     */
    public function updateStreak(int $studentId): bool
    {
        try {
            $streak = StudentStreak::firstOrCreate(
                ['student_id' => $studentId],
                [
                    'current_streak' => 0,
                    'longest_streak' => 0,
                    'last_activity_date' => null,
                    'total_active_days' => 0,
                ]
            );

            $today = Carbon::today();
            $lastActivity = $streak->last_activity_date ? Carbon::parse($streak->last_activity_date) : null;

            // If already active today, do nothing
            if ($lastActivity && $lastActivity->isSameDay($today)) {
                return true;
            }

            // If yesterday, increment streak
            if ($lastActivity && $lastActivity->isSameDay($today->copy()->subDay())) {
                $streak->current_streak += 1;
            } else {
                // Reset streak if more than 1 day gap
                $streak->current_streak = 1;
            }

            // Update longest streak
            if ($streak->current_streak > $streak->longest_streak) {
                $streak->longest_streak = $streak->current_streak;
            }

            $streak->last_activity_date = $today;
            $streak->total_active_days += 1;
            $streak->save();

            // Check streak achievements
            $this->updateAchievementProgress($studentId, 'streak_days', $streak->current_streak);

            return true;
        } catch (\Exception $e) {
            \Log::error('Failed to update streak: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Update student stats
     */
    public function updateStats(int $studentId, string $type, $value): bool
    {
        try {
            $stats = StudentStats::firstOrCreate(
                ['student_id' => $studentId],
                [
                    'lessons_completed' => 0,
                    'exams_taken' => 0,
                    'practice_sessions' => 0,
                    'total_points' => 0,
                    'average_score' => 0,
                    'study_time_minutes' => 0,
                ]
            );

            switch ($type) {
                case 'lesson_completed':
                    $stats->lessons_completed += 1;
                    $this->updateAchievementProgress($studentId, 'lessons_completed', $stats->lessons_completed);
                    $this->awardCoins($studentId, 10, 'lesson_completed', 'earn', 'Hoàn thành bài học');
                    break;

                case 'exam_taken':
                    $stats->exams_taken += 1;
                    $score = $value['score'] ?? 0;
                    $stats->total_points += $value['points'] ?? 0;
                    
                    // Recalculate average score
                    $stats->average_score = ($stats->average_score * ($stats->exams_taken - 1) + $score) / $stats->exams_taken;
                    
                    $this->updateAchievementProgress($studentId, 'exams_taken', $stats->exams_taken);
                    $this->updateAchievementProgress($studentId, 'exam_score', $score);
                    
                    // Award coins based on score
                    $coinReward = $this->calculateExamCoinReward($score);
                    $this->awardCoins($studentId, $coinReward, 'exam_completed', 'earn', "Hoàn thành bài kiểm tra (Điểm: {$score}%)");
                    break;

                case 'practice_completed':
                    $stats->practice_sessions += 1;
                    $this->updateAchievementProgress($studentId, 'practice_sessions', $stats->practice_sessions);
                    $this->awardCoins($studentId, 5, 'practice_completed', 'earn', 'Hoàn thành buổi luyện tập');
                    break;

                case 'study_time':
                    $stats->study_time_minutes += $value;
                    break;
            }

            $stats->save();

            // Check for badges
            $this->checkAndAwardBadges($studentId);

            return true;
        } catch (\Exception $e) {
            \Log::error('Failed to update stats: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Calculate coin reward based on exam score
     */
    private function calculateExamCoinReward(float $score): int
    {
        if ($score >= 100) return 50;
        if ($score >= 90) return 30;
        if ($score >= 80) return 20;
        if ($score >= 70) return 15;
        if ($score >= 60) return 10;
        return 5;
    }

    /**
     * Get student gamification summary
     */
    public function getStudentSummary(int $studentId): array
    {
        $coins = StudentCoin::where('student_id', $studentId)->first();
        $stats = StudentStats::where('student_id', $studentId)->first();
        $streak = StudentStreak::where('student_id', $studentId)->first();
        
        $badgesCount = DB::table('student_badges')->where('student_id', $studentId)->count();
        $achievementsCompleted = StudentAchievement::where('student_id', $studentId)
            ->where('is_completed', true)
            ->count();

        return [
            'coins' => $coins ? $coins->total_coins : 0,
            'badges' => $badgesCount,
            'achievements' => $achievementsCompleted,
            'streak' => $streak ? $streak->current_streak : 0,
            'lessons_completed' => $stats ? $stats->lessons_completed : 0,
            'average_score' => $stats ? $stats->average_score : 0,
        ];
    }
}
