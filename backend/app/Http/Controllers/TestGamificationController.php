<?php

namespace App\Http\Controllers;

use App\Services\GamificationService;
use Illuminate\Http\Request;

class TestGamificationController extends Controller
{
    protected $gamificationService;

    public function __construct(GamificationService $gamificationService)
    {
        $this->gamificationService = $gamificationService;
    }

    /**
     * Test lesson completion with gamification
     */
    public function testLessonCompletion(Request $request)
    {
        $studentId = $request->user()->uId;
        
        // Simulate lesson completion
        $this->gamificationService->updateStats($studentId, 'lesson_completed', null);
        $this->gamificationService->updateStreak($studentId);
        
        // Check for new badges and achievements
        $newBadges = $this->gamificationService->checkAndAwardBadges($studentId);
        $newAchievements = $this->gamificationService->updateAchievementProgress($studentId, 'lessons_completed', 5);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Lesson completed successfully',
            'data' => [
                'gamification' => [
                    'coins_earned' => 10,
                    'new_badges' => $newBadges,
                    'new_achievements' => $newAchievements,
                ]
            ]
        ]);
    }

    /**
     * Test exam completion with gamification
     */
    public function testExamCompletion(Request $request)
    {
        $studentId = $request->user()->uId;
        $score = $request->input('score', 85);
        
        // Simulate exam completion
        $this->gamificationService->updateStats($studentId, 'exam_taken', [
            'score' => $score,
            'points' => $score * 10
        ]);
        $this->gamificationService->updateStreak($studentId);
        
        // Check for new badges and achievements
        $newBadges = $this->gamificationService->checkAndAwardBadges($studentId);
        $newAchievements = $this->gamificationService->updateAchievementProgress($studentId, 'exams_taken', 5);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Exam completed successfully',
            'data' => [
                'score' => $score,
                'gamification' => [
                    'coins_earned' => $this->calculateExamCoinReward($score),
                    'new_badges' => $newBadges,
                    'new_achievements' => $newAchievements,
                ]
            ]
        ]);
    }

    private function calculateExamCoinReward(float $score): int
    {
        if ($score >= 100) return 50;
        if ($score >= 90) return 30;
        if ($score >= 80) return 20;
        if ($score >= 70) return 15;
        if ($score >= 60) return 10;
        return 5;
    }
}