<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\Exam;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition()
    {
        $type = $this->faker->randomElement(['multiple_choice', 'true_false', 'fill_blank', 'essay']);
        
        $options = null;
        $correctAnswer = null;

        if ($type === 'multiple_choice') {
            $options = json_encode([
                'A' => $this->faker->sentence(),
                'B' => $this->faker->sentence(),
                'C' => $this->faker->sentence(),
                'D' => $this->faker->sentence(),
            ]);
            $correctAnswer = $this->faker->randomElement(['A', 'B', 'C', 'D']);
        } elseif ($type === 'true_false') {
            $options = json_encode(['True', 'False']);
            $correctAnswer = $this->faker->randomElement(['True', 'False']);
        } elseif ($type === 'fill_blank') {
            $correctAnswer = $this->faker->word();
        }

        return [
            'exam_id' => Exam::factory(),
            'qContent' => $this->faker->sentence() . '?',
            'qType' => $type,
            'qOptions' => $options,
            'qCorrect_answer' => $correctAnswer,
            'qScore' => $this->faker->randomElement([1, 2, 3, 5]),
            'qPoints' => $this->faker->randomElement([1, 2, 3, 5]),
            'qOrder' => $this->faker->numberBetween(1, 50),
            'qSection' => $this->faker->randomElement(['Reading', 'Listening', 'Writing', 'Speaking']),
            'qDifficulty' => $this->faker->randomElement(['easy', 'medium', 'hard']),
            'qExplanation' => $this->faker->paragraph(),
            'qCreated_at' => now(),
        ];
    }
}
