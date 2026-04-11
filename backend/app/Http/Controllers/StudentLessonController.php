<?php

namespace App\Http\Controllers;

use App\Services\GamificationService;
use Illuminate\Http\Request;

class StudentLessonController extends Controller
{
    protected $gamificationService;

    public function __construct(GamificationService $gamificationService)
    {
        $this->gamificationService = $gamificationService;
    }

    /**
     * POST /api/student/lessons/{lessonId}/complete
     * Mark lesson as completed and update gamification
     */
    public function completeLesson(Request $request, $lessonId)
    {
        $studentId = $request->user()->uId;

        try {
            // TODO: Add your lesson completion logic here
            // Example: Mark lesson as completed in database
            
            // Update gamification
            $this->gamificationService->updateStats($studentId, 'lesson_completed', null);
            $this->gamificationService->updateStreak($studentId);

            return response()->json([
                'status' => 'success',
                'message' => 'Lesson completed successfully',
                'gamification' => $this->gamificationService->getStudentSummary($studentId),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to complete lesson: ' . $e->getMessage(),
            ], 500);
        }
    }
}
