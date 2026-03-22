<?php

namespace Database\Factories;

use App\Models\ExamTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExamTemplateFactory extends Factory
{
    protected $model = ExamTemplate::class;

    public function definition()
    {
        $categories = ['cambridge_young', 'cambridge_main', 'international', 'specialized'];
        $levels = ['pre_a1', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
        $skills = ['listening', 'reading', 'writing', 'speaking'];
        
        return [
            'template_code' => strtoupper($this->faker->unique()->lexify('???')),
            'template_name' => $this->faker->words(3, true) . ' Template',
            'category' => $this->faker->randomElement($categories),
            'level' => $this->faker->randomElement($levels),
            'age_group' => $this->faker->randomElement(['6-8', '8-11', '11-14', 'adult']),
            'total_duration_minutes' => $this->faker->randomElement([60, 90, 120, 180]),
            'skills' => json_encode($this->faker->randomElements($skills, $this->faker->numberBetween(2, 4))),
            'sections' => json_encode([
                [
                    'name' => 'Reading',
                    'duration' => 60,
                    'questions' => 40,
                ],
                [
                    'name' => 'Listening',
                    'duration' => 30,
                    'questions' => 30,
                ],
            ]),
            'instructions' => $this->faker->paragraph(),
            'description' => $this->faker->paragraph(),
            'is_active' => $this->faker->boolean(80),
            'template_category' => $this->faker->randomElement(['IELTS', 'TOEFL', 'VSTEP', 'GENERAL']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
