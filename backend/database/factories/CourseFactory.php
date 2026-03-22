<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CourseFactory extends Factory
{
    protected $model = Course::class;

    public function definition()
    {
        return [
            'cName' => $this->faker->sentence(3),
            'cCategory' => Category::factory(),
            'cDescription' => $this->faker->paragraph(),
            'cNumberOfStudent' => $this->faker->numberBetween(10, 30),
            'cTime' => $this->faker->randomElement(['18:00-20:00', '19:00-21:00', '14:00-16:00']),
            'cSchedule' => $this->faker->randomElement(['Mon, Wed, Fri', 'Tue, Thu', 'Sat, Sun']),
            'cStartDate' => $this->faker->dateTimeBetween('now', '+1 month'),
            'cEndDate' => $this->faker->dateTimeBetween('+2 months', '+6 months'),
            'cStatus' => $this->faker->randomElement(['active', 'draft', 'ongoing', 'complete']),
            'cTeacher' => User::factory()->create(['uRole' => 'teacher'])->uId,
            'cCreateAt' => now(),
            'cUpdateAt' => now(),
        ];
    }
}
