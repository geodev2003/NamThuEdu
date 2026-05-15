<?php

namespace App\Http\Controllers;

use App\Models\StudentCoin;
use App\Models\StudentStats;
use App\Models\StudentStreak;
use App\Models\Badge;
use App\Models\Achievement;
use App\Models\StudentAchievement;
use App\Models\CoinTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentGamificationController extends Controller
{
    /**
     * GET /api/student/gamification/overview
     * Lấy tổng quan gamification của student
     */
    public function getOverview(Request $request)
    {
        $studentId = $request->user()->uId;

        // Coins
        $coins = StudentCoin::where('student_id', $studentId)->first();
        if (!$coins) {
            $coins = (object)['total_coins' => 0, 'lifetime_coins' => 0, 'spent_coins' => 0];
        }
        
        // Stats
        $stats = StudentStats::where('student_id', $studentId)->first();
        if (!$stats) {
            $stats = (object)['lessons_completed' => 0, 'exams_taken' => 0, 'practice_sessions' => 0, 'total_points' => 0, 'average_score' => 0, 'study_time_minutes' => 0];
        }
        
        // Streak
        $streak = StudentStreak::where('student_id', $studentId)->first();
        if (!$streak) {
            $streak = (object)['current_streak' => 0, 'longest_streak' => 0, 'last_activity_date' => null, 'total_active_days' => 0];
        }
        
        // Badges count
        $badgesCount = DB::table('student_badges')
            ->where('student_id', $studentId)
            ->count();
        
        // Achievements progress
        $achievementsTotal = Achievement::where('is_active', true)->count();
        $achievementsCompleted = StudentAchievement::where('student_id', $studentId)
            ->where('is_completed', true)
            ->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'coins' => [
                    'total' => $coins->total_coins ?? 0,
                    'lifetime' => $coins->lifetime_coins ?? 0,
                    'spent' => $coins->spent_coins ?? 0,
                ],
                'stats' => [
                    'lessons_completed' => $stats->lessons_completed ?? 0,
                    'exams_taken' => $stats->exams_taken ?? 0,
                    'practice_sessions' => $stats->practice_sessions ?? 0,
                    'total_points' => $stats->total_points ?? 0,
                    'average_score' => (float)($stats->average_score ?? 0),
                    'study_time_minutes' => $stats->study_time_minutes ?? 0,
                ],
                'streak' => [
                    'current' => $streak->current_streak ?? 0,
                    'longest' => $streak->longest_streak ?? 0,
                    'last_activity' => $streak->last_activity_date ?? null,
                    'total_active_days' => $streak->total_active_days ?? 0,
                ],
                'badges' => [
                    'earned' => $badgesCount,
                ],
                'achievements' => [
                    'completed' => $achievementsCompleted,
                    'total' => $achievementsTotal,
                    'percentage' => $achievementsTotal > 0 ? round(($achievementsCompleted / $achievementsTotal) * 100, 2) : 0,
                ],
            ]
        ]);
    }

    /**
     * GET /api/student/gamification/coins
     * Lấy thông tin coins và lịch sử giao dịch
     */
    public function getCoins(Request $request)
    {
        $studentId = $request->user()->uId;

        $coins = StudentCoin::where('student_id', $studentId)->first();
        
        $transactions = CoinTransaction::where('student_id', $studentId)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'coins' => [
                    'total' => $coins->total_coins ?? 0,
                    'lifetime' => $coins->lifetime_coins ?? 0,
                    'spent' => $coins->spent_coins ?? 0,
                ],
                'transactions' => $transactions,
            ]
        ]);
    }

    /**
     * GET /api/student/gamification/badges
     * Lấy danh sách badges (earned + available)
     */
    public function getBadges(Request $request)
    {
        $studentId = $request->user()->uId;
        $ageGroup = $request->user()->age_group ?? 'teens';

        // Earned badges
        $earnedBadges = DB::table('student_badges')
            ->join('badges', 'student_badges.badge_id', '=', 'badges.id')
            ->where('student_badges.student_id', $studentId)
            ->select('badges.*', 'student_badges.earned_at')
            ->get();

        // Available badges (not earned yet)
        $earnedBadgeIds = $earnedBadges->pluck('id')->toArray();
        
        $availableBadges = Badge::where('is_active', true)
            ->whereIn('age_group', [$ageGroup, 'all'])
            ->whereNotIn('id', $earnedBadgeIds)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'earned' => $earnedBadges,
                'available' => $availableBadges,
                'total_earned' => $earnedBadges->count(),
            ]
        ]);
    }

    /**
     * GET /api/student/gamification/achievements
     * Lấy danh sách achievements với progress
     */
    public function getAchievements(Request $request)
    {
        $studentId = $request->user()->uId;
        $ageGroup = $request->user()->age_group ?? 'teens';

        // Get all active achievements for this age group
        $achievements = Achievement::where('is_active', true)
            ->whereIn('age_group', [$ageGroup, 'all'])
            ->get();

        // Get student's progress
        $studentAchievements = StudentAchievement::where('student_id', $studentId)
            ->get()
            ->keyBy('achievement_id');

        $result = $achievements->map(function ($achievement) use ($studentAchievements) {
            $progress = $studentAchievements->get($achievement->id);
            
            return [
                'id' => $achievement->id,
                'code' => $achievement->code,
                'name' => $achievement->name,
                'description' => $achievement->description,
                'icon' => $achievement->icon,
                'category' => $achievement->category,
                'target_value' => $achievement->target_value,
                'target_type' => $achievement->target_type,
                'coin_reward' => $achievement->coin_reward,
                'current_value' => $progress->current_value ?? 0,
                'is_completed' => $progress->is_completed ?? false,
                'completed_at' => $progress->completed_at ?? null,
                'progress_percentage' => $achievement->target_value > 0 
                    ? min(100, round((($progress->current_value ?? 0) / $achievement->target_value) * 100, 2))
                    : 0,
            ];
        });

        $completed = $result->where('is_completed', true)->count();
        $total = $result->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'achievements' => $result->values(),
                'completed' => $completed,
                'total' => $total,
                'percentage' => $total > 0 ? round(($completed / $total) * 100, 2) : 0,
            ]
        ]);
    }

    /**
     * GET /api/student/gamification/stats
     * Lấy thống kê chi tiết
     */
    public function getStats(Request $request)
    {
        $studentId = $request->user()->uId;

        $stats = StudentStats::where('student_id', $studentId)->first();

        if (!$stats) {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'lessons_completed' => 0,
                    'exams_taken' => 0,
                    'practice_sessions' => 0,
                    'total_points' => 0,
                    'average_score' => 0,
                    'study_time_minutes' => 0,
                    'study_time_hours' => 0,
                ]
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'lessons_completed' => $stats->lessons_completed,
                'exams_taken' => $stats->exams_taken,
                'practice_sessions' => $stats->practice_sessions,
                'total_points' => $stats->total_points,
                'average_score' => $stats->average_score,
                'study_time_minutes' => $stats->study_time_minutes,
                'study_time_hours' => round($stats->study_time_minutes / 60, 2),
            ]
        ]);
    }

    /**
     * GET /api/student/gamification/streak
     * Lấy thông tin streak
     */
    public function getStreak(Request $request)
    {
        $studentId = $request->user()->uId;

        $streak = StudentStreak::where('student_id', $studentId)->first();

        if (!$streak) {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'current_streak' => 0,
                    'longest_streak' => 0,
                    'last_activity_date' => null,
                    'total_active_days' => 0,
                    'is_active_today' => false,
                ]
            ]);
        }

        $isActiveToday = $streak->last_activity_date && 
                        $streak->last_activity_date->isToday();

        return response()->json([
            'status' => 'success',
            'data' => [
                'current_streak' => $streak->current_streak,
                'longest_streak' => $streak->longest_streak,
                'last_activity_date' => $streak->last_activity_date,
                'total_active_days' => $streak->total_active_days,
                'is_active_today' => $isActiveToday,
            ]
        ]);
    }

    /**
     * GET /api/student/gamification/leaderboard
     * Bảng xếp hạng học viên theo tổng điểm
     */
    public function getLeaderboard(Request $request)
    {
        $studentId = $request->user()->uId;
        $limit     = min((int) $request->input('limit', 10), 50);

        // Top N students by total_points
        $top = DB::table('student_stats')
            ->join('users', 'student_stats.student_id', '=', 'users.uId')
            ->where('users.uRole', 'student')
            ->orderByDesc('student_stats.total_points')
            ->limit($limit)
            ->get(['users.uId as id', 'users.uName as name', 'student_stats.total_points', 'student_stats.average_score', 'student_stats.exams_taken']);

        // Current user's rank (number of students with strictly more points + 1)
        $myStats = StudentStats::where('student_id', $studentId)->first();
        $myPoints = $myStats ? (int) $myStats->total_points : 0;

        $myRank = DB::table('student_stats')
            ->join('users', 'student_stats.student_id', '=', 'users.uId')
            ->where('users.uRole', 'student')
            ->where('student_stats.total_points', '>', $myPoints)
            ->count() + 1;

        $totalStudents = DB::table('student_stats')
            ->join('users', 'student_stats.student_id', '=', 'users.uId')
            ->where('users.uRole', 'student')
            ->count();

        $streakMap = StudentStreak::whereIn('student_id', $top->pluck('id')->toArray())
            ->get()
            ->keyBy('student_id');

        $rows = $top->values()->map(function ($row, $index) use ($studentId, $streakMap) {
            $streak = $streakMap->get($row->id);
            return [
                'rank'         => $index + 1,
                'id'           => $row->id,
                'name'         => $row->name,
                'total_points' => (int) $row->total_points,
                'average_score'=> round((float) $row->average_score, 1),
                'exams_taken'  => (int) $row->exams_taken,
                'streak'       => $streak ? (int) $streak->current_streak : 0,
                'is_me'        => $row->id == $studentId,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data'   => [
                'top'            => $rows,
                'me'             => [
                    'rank'          => $myRank,
                    'total_points'  => $myPoints,
                    'total_students'=> $totalStudents,
                ],
            ],
        ]);
    }
}
