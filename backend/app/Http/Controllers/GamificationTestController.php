<?php

namespace App\Http\Controllers;

use App\Services\GamificationService;
use Illuminate\Http\Request;

class GamificationTestController extends Controller
{
    protected $gamificationService;

    public function __construct(GamificationService $gamificationService)
    {
        $this->gamificationService = $gamificationService;
    }

    /**
     * POST /api/test/gamification/lesson-complete
     * Test lesson completion with gamification
     */
    public function testLessonComplete(Request $request)
    {
        $studentId = $request->user()->uId;
        
        // Update streak
        $this->gamificationService->updateStreak($studentId);
        
        // Update stats
        $this->gamificationService->updateStats($studentId, 'lesson_completed', null);
        
        // Check for new badges and achievements
        $newBadges = $this->gamificationService->checkAndAwardBadges($studentId);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Lesson completed successfully',
            'data' => [
                'gamification' => [
                    'coins_earned' => 10,
                    'new_badges' => $newBadges,
                    'streak_updated' => true,
                ]
            ]
        ]);
    }

    /**
     * POST /api/test/gamification/exam-complete
     * Test exam completion with gamification
     */
    public function testExamComplete(Request $request)
    {
        $studentId = $request->user()->uId;
        $score = $request->input('score', 85);
        $points = $request->input('points', 100);
        
        // Update streak
        $this->gamificationService->updateStreak($studentId);
        
        // Update stats
        $this->gamificationService->updateStats($studentId, 'exam_taken', [
            'score' => $score,
            'points' => $points
        ]);
        
        // Check for new badges and achievements
        $newBadges = $this->gamificationService->checkAndAwardBadges($studentId);
        
        // Calculate coin reward
        $coinReward = $this->calculateExamCoinReward($score);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Exam completed successfully',
            'data' => [
                'score' => $score,
                'points' => $points,
                'gamification' => [
                    'coins_earned' => $coinReward,
                    'new_badges' => $newBadges,
                    'streak_updated' => true,
                ]
            ]
        ]);
    }

    /**
     * POST /api/test/gamification/practice-complete
     * Test practice completion with gamification
     */
    public function testPracticeComplete(Request $request)
    {
        $studentId = $request->user()->uId;
        
        // Update streak
        $this->gamificationService->updateStreak($studentId);
        
        // Update stats
        $this->gamificationService->updateStats($studentId, 'practice_completed', null);
        
        // Check for new badges and achievements
        $newBadges = $this->gamificationService->checkAndAwardBadges($studentId);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Practice completed successfully',
            'data' => [
                'gamification' => [
                    'coins_earned' => 5,
                    'new_badges' => $newBadges,
                    'streak_updated' => true,
                ]
            ]
        ]);
    }

    /**
     * GET /api/test/gamification/summary
     * Get gamification summary
     */
    public function getSummary(Request $request)
    {
        $studentId = $request->user()->uId;
        
        $summary = $this->gamificationService->getStudentSummary($studentId);
        
        return response()->json([
            'status' => 'success',
            'data' => $summary
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