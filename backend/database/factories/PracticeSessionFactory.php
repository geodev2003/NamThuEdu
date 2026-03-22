<?php

namespace Database\Factories;

use App\Models\PracticeSession;
use App\Models\Exam;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PracticeSessionFactory extends Factory
{
    protected $model = PracticeSession::class;

    public function definition()
    {
        return [
            'ps_exam_id' => Exam::factory(),
            'ps_created_by' => User::factory()->create(['uRole' => 'teacher'])->uId,
            'ps_type' => $this->faker->randomElement(['topic_based', 'template_based', 'random']),
            'ps_topic' => $this->faker->randomElement(['Reading', 'Listening', 'Grammar', 'Vocabulary']),
            'ps_difficulty' => $this->faker->randomElement(['easy', 'medium', 'hard']),
            'ps_question_count' => $this->faker->numberBetween(10, 50),
            'ps_created_at' => now(),
        ];
    }
}
