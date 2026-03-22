<?php

namespace Database\Factories;

use App\Models\ClassEnrollment;
use App\Models\Classes;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClassEnrollmentFactory extends Factory
{
    protected $model = ClassEnrollment::class;

    public function definition()
    {
        return [
            'class_id' => Classes::factory(),
            'student_id' => User::factory()->create(['uRole' => 'student'])->uId,
            'enrolled_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ];
    }
}
