<?php

namespace Database\Factories;

use App\Models\Classes;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClassesFactory extends Factory
{
    protected $model = Classes::class;

    public function definition()
    {
        return [
            'cName' => $this->faker->words(3, true) . ' Class',
            'cTeacher_id' => User::factory()->create(['uRole' => 'teacher'])->uId,
            'cDescription' => $this->faker->paragraph(),
            'cStatus' => $this->faker->randomElement(['active', 'inactive']),
            'course' => null, // Will be set by test if needed
        ];
    }
}
