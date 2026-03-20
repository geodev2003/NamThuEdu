<?php

namespace App\Services;

use App\Models\Submission;
use App\Models\SubmissionAnswer;
use App\Models\Question;
use Illuminate\Support\Collection;

class StudentProgressService
{
    /**
     * Tính toán thống kê tiến độ học tập chi tiết
     */
    public static function calculateDetailedProgress($userId)
    {
        $submissions = Submission::with(['exam', 'answers'])
                                ->where('user_id', $userId)
                                ->whereIn('sStatus', ['graded', 'auto_submitted'])
                                ->orderBy('sSubmit_time', 'asc')
                                ->get();

        if ($submissions->isEmpty()) {
            return [
                'message' => 'Chưa có dữ liệu tiến độ học tập.',
                'total_tests' => 0,
            ];
        }

        return [
            'overview' => self::calculateOverview($submissions),
            'trends' => self::calculateTrends($submissions),
            'skill_analysis' => self::analyzeBySkill($submissions),
            'type_analysis' => self::analyzeByType($submissions),
            'performance_insights' => self::generateInsights($submissions),
            'recommendations' => self::generateRecommendations($submissions),
        ];
    }

    /**
     * Tính toán thống kê tổng quan
     */
    private static function calculateOverview($submissions)
    {
        $totalTests = $submissions->count();
        $averageScore = $submissions->avg('sScore');
        $highestScore = $submissions->max('sScore');
        $lowestScore = $submissions->min('sScore');
        $recentScore = $submissions->last()->sScore ?? 0;

        // Tính xu hướng cải thiện tổng thể
        $improvement = self::calculateImprovement($submissions);
        
        // Tính độ ổn định
        $consistency = self::calculateConsistency($submissions);

        return [
            'total_tests' => $totalTests,
            'average_score' => round($averageScore, 2),
            'highest_score' => $highestScore,
            'lowest_score' => $lowestScore,
            'recent_score' => $recentScore,
            'improvement_trend' => $improvement,
            'consistency' => $consistency,
            'grade_distribution' => self::calculateGradeDistribution($submissions),
        ];
    }

    /**
     * Phân tích xu hướng theo thời gian
     */
    private static function calculateTrends($submissions)
    {
        // Xu hướng 6 bài gần nhất
        $recentSubmissions = $submissions->take(-6);
        $scoresTrend = $recentSubmissions->map(function($submission) {
            return [
                'date' => $submission->sSubmit_time->format('Y-m-d'),
                'score' => $submission->sScore,
                'exam_title' => $submission->exam->eTitle,
                'exam_type' => $submission->exam->eType,
                'exam_skill' => $submission->exam->eSkill,
            ];
        });

        // Thống kê theo tháng (6 tháng gần nhất)
        $monthlyStats = $submissions->filter(function($submission) {
            return $submission->sSubmit_time >= now()->subMonths(6);
        })->groupBy(function($submission) {
            return $submission->sSubmit_time->format('Y-m');
        })->map(function($group, $month) {
            return [
                'month' => $month,
                'month_name' => \Carbon\Carbon::createFromFormat('Y-m', $month)->format('M Y'),
                'count' => $group->count(),
                'average_score' => round($group->avg('sScore'), 2),
                'highest_score' => $group->max('sScore'),
                'improvement' => self::calculateImprovement($group),
            ];
        })->values();

        // Xu hướng theo tuần (4 tuần gần nhất)
        $weeklyStats = $submissions->filter(function($submission) {
            return $submission->sSubmit_time >= now()->subWeeks(4);
        })->groupBy(function($submission) {
            return $submission->sSubmit_time->format('Y-W');
        })->map(function($group, $week) {
            return [
                'week' => $week,
                'count' => $group->count(),
                'average_score' => round($group->avg('sScore'), 2),
            ];
        })->values();

        return [
            'recent_scores' => $scoresTrend,
            'monthly_stats' => $monthlyStats,
            'weekly_stats' => $weeklyStats,
            'learning_velocity' => self::calculateLearningVelocity($submissions),
        ];
    }

    /**
     * Phân tích theo kỹ năng
     */
    private static function analyzeBySkill($submissions)
    {
        $statsBySkill = $submissions->groupBy('exam.eSkill')->map(function($group, $skill) {
            $improvement = self::calculateImprovement($group);
            $consistency = self::calculateConsistency($group);
            
            return [
                'skill' => $skill,
                'skill_name' => self::getSkillName($skill),
                'count' => $group->count(),
                'average_score' => round($group->avg('sScore'), 2),
                'highest_score' => $group->max('sScore'),
                'lowest_score' => $group->min('sScore'),
                'improvement' => $improvement,
                'consistency' => $consistency,
                'recent_performance' => $group->take(-3)->avg('sScore'),
                'mastery_level' => self::calculateMasteryLevel($group->avg('sScore')),
            ];
        })->values();

        return [
            'skills_breakdown' => $statsBySkill,
            'strongest_skills' => $statsBySkill->sortByDesc('average_score')->take(2)->values(),
            'improvement_areas' => $statsBySkill->sortBy('average_score')->take(2)->values(),
            'most_consistent' => $statsBySkill->where('consistency.consistency_level', 'high')->values(),
        ];
    }

    /**
     * Phân tích theo loại bài thi
     */
    private static function analyzeByType($submissions)
    {
        return $submissions->groupBy('exam.eType')->map(function($group, $type) {
            return [
                'type' => $type,
                'type_name' => self::getTypeName($type),
                'count' => $group->count(),
                'average_score' => round($group->avg('sScore'), 2),
                'highest_score' => $group->max('sScore'),
                'improvement' => self::calculateImprovement($group),
                'difficulty_level' => self::assessDifficultyLevel($group->avg('sScore')),
            ];
        })->values();
    }

    /**
     * Tạo insights về hiệu suất
     */
    private static function generateInsights($submissions)
    {
        $insights = [];
        
        // Phân tích xu hướng gần đây
        $recentSubmissions = $submissions->take(-5);
        $recentAverage = $recentSubmissions->avg('sScore');
        $overallAverage = $submissions->avg('sScore');
        
        if ($recentAverage > $overallAverage + 5) {
            $insights[] = [
                'type' => 'positive',
                'title' => 'Tiến bộ vượt trội',
                'message' => 'Điểm số gần đây của bạn cao hơn trung bình tổng thể ' . round($recentAverage - $overallAverage, 1) . ' điểm.',
            ];
        } elseif ($recentAverage < $overallAverage - 5) {
            $insights[] = [
                'type' => 'warning',
                'title' => 'Cần cải thiện',
                'message' => 'Điểm số gần đây thấp hơn trung bình. Hãy xem lại phương pháp học tập.',
            ];
        }

        // Phân tích consistency
        $consistency = self::calculateConsistency($submissions);
        if ($consistency && $consistency['consistency_level'] === 'high') {
            $insights[] = [
                'type' => 'positive',
                'title' => 'Học tập ổn định',
                'message' => 'Bạn có kết quả học tập rất ổn định và đáng tin cậy.',
            ];
        }

        // Phân tích streak
        $streak = self::calculateStreak($submissions);
        if ($streak['current_streak'] >= 3) {
            $insights[] = [
                'type' => 'achievement',
                'title' => 'Chuỗi thành công',
                'message' => "Bạn đã có {$streak['current_streak']} bài thi liên tiếp với điểm cao!",
            ];
        }

        return $insights;
    }

    /**
     * Tạo khuyến nghị học tập
     */
    private static function generateRecommendations($submissions)
    {
        $recommendations = [];
        
        // Phân tích kỹ năng yếu nhất
        $skillStats = $submissions->groupBy('exam.eSkill')->map(function($group, $skill) {
            return [
                'skill' => $skill,
                'average' => $group->avg('sScore'),
                'count' => $group->count(),
            ];
        });

        $weakestSkill = $skillStats->sortBy('average')->first();
        if ($weakestSkill && $weakestSkill['average'] < 70) {
            $recommendations[] = [
                'priority' => 'high',
                'title' => 'Tập trung cải thiện ' . self::getSkillName($weakestSkill['skill']),
                'message' => 'Kỹ năng này cần được ưu tiên luyện tập thêm.',
                'action' => 'Làm thêm bài tập ' . self::getSkillName($weakestSkill['skill']),
            ];
        }

        // Khuyến nghị về tần suất luyện tập
        $recentActivity = $submissions->filter(function($submission) {
            return $submission->sSubmit_time >= now()->subWeeks(2);
        })->count();

        if ($recentActivity < 2) {
            $recommendations[] = [
                'priority' => 'medium',
                'title' => 'Tăng tần suất luyện tập',
                'message' => 'Bạn nên luyện tập thường xuyên hơn để duy trì và cải thiện kết quả.',
                'action' => 'Đặt mục tiêu làm ít nhất 2-3 bài thi mỗi tuần',
            ];
        }

        return $recommendations;
    }

    /**
     * Helper methods
     */
    private static function calculateImprovement($submissions)
    {
        if ($submissions->count() < 2) {
            return null;
        }

        $first = $submissions->first()->sScore;
        $last = $submissions->last()->sScore;
        
        return [
            'first_score' => $first,
            'latest_score' => $last,
            'difference' => round($last - $first, 2),
            'percentage' => $first > 0 ? round((($last - $first) / $first) * 100, 2) : 0,
            'trend' => $last > $first ? 'improving' : ($last < $first ? 'declining' : 'stable'),
        ];
    }

    private static function calculateConsistency($submissions)
    {
        if ($submissions->count() < 2) {
            return null;
        }

        $scores = $submissions->pluck('sScore')->toArray();
        $mean = array_sum($scores) / count($scores);
        $variance = array_sum(array_map(function($score) use ($mean) {
            return pow($score - $mean, 2);
        }, $scores)) / count($scores);
        
        $standardDeviation = sqrt($variance);
        $coefficientOfVariation = $mean > 0 ? ($standardDeviation / $mean) * 100 : 0;

        return [
            'standard_deviation' => round($standardDeviation, 2),
            'coefficient_of_variation' => round($coefficientOfVariation, 2),
            'consistency_level' => $coefficientOfVariation < 15 ? 'high' : 
                                 ($coefficientOfVariation < 25 ? 'medium' : 'low'),
        ];
    }

    private static function calculateGradeDistribution($submissions)
    {
        $distribution = [
            'A' => 0, // 90-100
            'B' => 0, // 80-89
            'C' => 0, // 70-79
            'D' => 0, // 60-69
            'F' => 0, // <60
        ];

        foreach ($submissions as $submission) {
            $score = $submission->sScore;
            if ($score >= 90) $distribution['A']++;
            elseif ($score >= 80) $distribution['B']++;
            elseif ($score >= 70) $distribution['C']++;
            elseif ($score >= 60) $distribution['D']++;
            else $distribution['F']++;
        }

        return $distribution;
    }

    private static function calculateLearningVelocity($submissions)
    {
        if ($submissions->count() < 3) {
            return null;
        }

        $recentSubmissions = $submissions->take(-5);
        $scores = $recentSubmissions->pluck('sScore')->toArray();
        
        // Tính độ dốc của đường xu hướng
        $n = count($scores);
        $x = range(1, $n);
        $xy = array_sum(array_map(function($i, $score) { return $i * $score; }, $x, $scores));
        $x_sum = array_sum($x);
        $y_sum = array_sum($scores);
        $x2_sum = array_sum(array_map(function($i) { return $i * $i; }, $x));
        
        $slope = ($n * $xy - $x_sum * $y_sum) / ($n * $x2_sum - $x_sum * $x_sum);
        
        return [
            'velocity' => round($slope, 2),
            'trend' => $slope > 1 ? 'fast_improving' : 
                      ($slope > 0 ? 'improving' : 
                      ($slope > -1 ? 'stable' : 'declining')),
        ];
    }

    private static function calculateStreak($submissions)
    {
        $currentStreak = 0;
        $maxStreak = 0;
        $tempStreak = 0;
        
        $threshold = 75; // Điểm ngưỡng để tính streak
        
        foreach ($submissions->reverse() as $submission) {
            if ($submission->sScore >= $threshold) {
                $tempStreak++;
                if ($currentStreak === 0) {
                    $currentStreak = $tempStreak;
                }
            } else {
                $maxStreak = max($maxStreak, $tempStreak);
                $tempStreak = 0;
                if ($currentStreak > 0) {
                    break;
                }
            }
        }
        
        $maxStreak = max($maxStreak, $tempStreak);
        
        return [
            'current_streak' => $currentStreak,
            'max_streak' => $maxStreak,
            'threshold' => $threshold,
        ];
    }

    private static function calculateMasteryLevel($averageScore)
    {
        if ($averageScore >= 90) return 'expert';
        if ($averageScore >= 80) return 'advanced';
        if ($averageScore >= 70) return 'intermediate';
        if ($averageScore >= 60) return 'beginner';
        return 'novice';
    }

    private static function assessDifficultyLevel($averageScore)
    {
        if ($averageScore >= 85) return 'easy';
        if ($averageScore >= 70) return 'medium';
        if ($averageScore >= 55) return 'hard';
        return 'very_hard';
    }

    private static function getSkillName($skill)
    {
        $skillNames = [
            'listening' => 'Nghe',
            'reading' => 'Đọc',
            'writing' => 'Viết',
            'speaking' => 'Nói',
        ];
        
        return $skillNames[$skill] ?? $skill;
    }

    private static function getTypeName($type)
    {
        $typeNames = [
            'VSTEP' => 'VSTEP',
            'IELTS' => 'IELTS',
            'TOEIC' => 'TOEIC',
            'GENERAL' => 'Tổng quát',
            'STARTERS' => 'Cambridge Starters',
            'MOVERS' => 'Cambridge Movers',
            'FLYERS' => 'Cambridge Flyers',
            'KET' => 'Cambridge KET',
            'PET' => 'Cambridge PET',
            'FCE' => 'Cambridge FCE',
            'CAE' => 'Cambridge CAE',
            'CPE' => 'Cambridge CPE',
            'TOEFL_IBT' => 'TOEFL iBT',
            'PTE_ACADEMIC' => 'PTE Academic',
            'APTIS' => 'APTIS',
        ];
        
        return $typeNames[$type] ?? $type;
    }
}