<?php

namespace App\Http\Controllers;

use App\Services\GamificationService;
use Illuminate\Http\Request;

class StudentPracticeController extends Controller
{
    protected $gamificationService;

    public function __construct(GamificationService $gamificationService)
    {
        $this->gamificationService = $gamificationService;
    }

    /**
     * POST /api/student/practice/complete
     * Complete practice session and update gamification
     */
    public function completePractice(Request $request)
    {
        $studentId = $request->user()->uId;

        $request->validate([
            'duration_minutes' => 'nullable|integer|min:0',
        ]);

        try {
            // TODO: Add your practice completion logic here
            
            // Update gamification
            $this->gamificationService->updateStats($studentId, 'practice_completed', null);
            
            if ($request->has('duration_minutes')) {
                $this->gamificationService->updateStats($studentId, 'study_time', $request->duration_minutes);
            }
            
            $this->gamificationService->updateStreak($studentId);

            return response()->json([
                'status' => 'success',
                'message' => 'Practice session completed',
                'gamification' => $this->gamificationService->getStudentSummary($studentId),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to complete practice: ' . $e->getMessage(),
            ], 500);
        }
    }
}
