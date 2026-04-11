<?php

namespace App\Http\Controllers;

use App\Services\GamificationService;
use Illuminate\Http\Request;

class StudentExamController extends Controller
{
    protected $gamificationService;

    public function __construct(GamificationService $gamificationService)
    {
        $this->gamificationService = $gamificationService;
    }

    /**
     * POST /api/student/exams/{examId}/submit
     * Submit exam and update gamification
     */
    public function submitExam(Request $request, $examId)
    {
        $studentId = $request->user()->uId;

        $request->validate([
            'answers' => 'required|array',
            'score' => 'required|numeric|min:0|max:100',
            'points' => 'required|integer|min:0',
        ]);

        try {
            // TODO: Add your exam submission logic here
            // Example: Save exam result to database
            
            // Update gamification
            $this->gamificationService->updateStats($studentId, 'exam_taken', [
                'score' => $request->score,
                'points' => $request->points,
            ]);
            $this->gamificationService->updateStreak($studentId);

            return response()->json([
                'status' => 'success',
                'message' => 'Exam submitted successfully',
                'score' => $request->score,
                'gamification' => $this->gamificationService->getStudentSummary($studentId),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to submit exam: ' . $e->getMessage(),
            ], 500);
        }
    }
}
