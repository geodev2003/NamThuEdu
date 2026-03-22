<?php

namespace Database\Factories;

use App\Models\Exam;
use App\Models\User;
use App\Models\ExamType;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExamFactory extends Factory
{
    protected $model = Exam::class;

    public function definition()
    {
        return [
            'eTeacher_id' => User::factory()->create(['uRole' => 'teacher'])->uId,
            'eTitle' => $this->faker->sentence(4),
            'eDescription' => $this->faker->paragraph(),
            'eType' => $this->faker->randomElement(['VSTEP', 'IELTS', 'GENERAL']),
            'eSkill' => $this->faker->randomElement(['listening', 'reading', 'writing', 'speaking']),
            'eDuration_minutes' => $this->faker->randomElement([30, 45, 60, 90, 120]),
            'eIs_private' => $this->faker->boolean(),
            'eSource_type' => $this->faker->randomElement(['manual', 'upload']),
            'eStatus' => $this->faker->randomElement(['draft', 'published', 'archived']),
            'eTotal_score' => $this->faker->numberBetween(10, 100),
            'ePurpose' => $this->faker->randomElement(['exam', 'practice']),
            'eCreated_at' => now(),
        ];
    }
}
