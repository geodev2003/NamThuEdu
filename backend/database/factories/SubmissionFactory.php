<?php

namespace Database\Factories;

use App\Models\Submission;
use App\Models\Exam;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubmissionFactory extends Factory
{
    protected $model = Submission::class;

    public function definition()
    {
        $status = $this->faker->randomElement(['in_progress', 'submitted', 'graded']);
        $startedAt = $this->faker->dateTimeBetween('-1 week', 'now');
        
        $submittedAt = null;
        $score = null;
        
        if (in_array($status, ['submitted', 'graded'])) {
            $submittedAt = $this->faker->dateTimeBetween($startedAt, 'now');
        }
        
        if ($status === 'graded') {
            $score = $this->faker->randomFloat(1, 0, 10);
        }

        return [
            'exam_id' => Exam::factory(),
            'user_id' => User::factory()->create(['uRole' => 'student'])->uId,
            'sAttempt' => 1,
            'sStart_time' => $startedAt,
            'sSubmit_time' => $submittedAt,
            'sScore' => $score,
            'sStatus' => $status,
            'sTeacher_feedback' => $status === 'graded' ? $this->faker->paragraph() : null,
        ];
    }
}
