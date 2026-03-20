<?php

namespace App\Services;

use App\Models\Submission;
use App\Models\Question;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TestRecoveryService
{
    /**
     * Kiểm tra và xử lý các bài thi bị gián đoạn
     * Chạy định kỳ bằng cron job
     */
    public static function handleInterruptedTests()
    {
        // Tìm các submission đang in_progress quá thời gian cho phép
        $interruptedSubmissions = Submission::with(['exam', 'answers'])
            ->where('sStatus', 'in_progress')
            ->whereRaw('TIMESTAMPDIFF(MINUTE, sStart_time, NOW()) > (SELECT eDuration_minutes FROM exams WHERE eId = submissions.exam_id)')
            ->get();

        $processedCount = 0;

        foreach ($interruptedSubmissions as $submission) {
            try {
                self::autoSubmitExpiredTest($submission);
                $processedCount++;
                
                Log::info("Auto-submitted expired test", [
                    'submission_id' => $submission->sId,
                    'user_id' => $submission->user_id,
                    'exam_id' => $submission->exam_id
                ]);
                
            } catch (\Exception $e) {
                Log::error("Failed to auto-submit expired test", [
                    'submission_id' => $submission->sId,
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $processedCount;
    }

    /**
     * Tự động nộp bài thi hết thời gian
     */
    private static function autoSubmitExpiredTest($submission)
    {
        DB::beginTransaction();
        try {
            // Tự động chấm điểm các câu đã trả lời
            $totalScore = 0;
            $maxScore = 0;

            foreach ($submission->answers as $submissionAnswer) {
                $question = Question::with('answers')->find($submissionAnswer->question_id);
                if (!$question) continue;

                $correctAnswer = $question->answers->where('aIs_correct', true)->first();
                $maxScore += $question->qPoints;

                if ($correctAnswer && $submissionAnswer->saAnswer_text === $correctAnswer->aContent) {
                    $submissionAnswer->update([
                        'saIs_correct' => true,
                        'saPoints_awarded' => $question->qPoints,
                    ]);
                    $totalScore += $question->qPoints;
                } else {
                    $submissionAnswer->update([
                        'saIs_correct' => false,
                        'saPoints_awarded' => 0,
                    ]);
                }
            }

            // Tính điểm
            $answeredQuestions = $submission->answers->count();
            $totalQuestions = $submission->exam->questions->count();
            $scorePercentage = $maxScore > 0 ? round(($totalScore / $maxScore) * 100, 2) : 0;

            // Cập nhật submission
            $submission->update([
                'sSubmit_time' => now(),
                'sScore' => $scorePercentage,
                'sStatus' => 'auto_submitted',
                'sTeacher_feedback' => "Bài thi được tự động nộp do hết thời gian (có thể do cúp điện/mất mạng). Đã trả lời {$answeredQuestions}/{$totalQuestions} câu hỏi.",
            ]);

            DB::commit();
            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Kiểm tra trạng thái bài thi của học viên
     */
    public static function checkStudentTestStatus($userId, $assignmentId)
    {
        $submission = Submission::with(['exam'])
            ->where('user_id', $userId)
            ->where('assignment_id', $assignmentId)
            ->where('sStatus', 'in_progress')
            ->first();

        if (!$submission) {
            return ['status' => 'no_active_test'];
        }

        $timeElapsed = now()->diffInMinutes($submission->sStart_time);
        $timeRemaining = $submission->exam->eDuration_minutes - $timeElapsed;

        if ($timeRemaining <= 0) {
            // Tự động nộp bài hết thời gian
            self::autoSubmitExpiredTest($submission);
            return [
                'status' => 'auto_submitted',
                'message' => 'Bài thi đã hết thời gian và được tự động nộp.'
            ];
        }

        return [
            'status' => 'in_progress',
            'submission_id' => $submission->sId,
            'time_remaining' => $timeRemaining,
            'can_resume' => true
        ];
    }
}