<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        return [
            'uPhone' => $this->faker->unique()->numerify('09########'),
            'uPassword' => Hash::make('password123'),
            'uName' => $this->faker->name(),
            'uGender' => $this->faker->boolean(),
            'uAddress' => $this->faker->address(),
            'uRole' => 'student',
            'uStatus' => 'active',
            'uDoB' => $this->faker->date('Y-m-d', '-18 years'),
            'uCreated_at' => now(),
        ];
    }

    public function teacher()
    {
        return $this->state(function (array $attributes) {
            return [
                'uRole' => 'teacher',
            ];
        });
    }

    public function admin()
    {
        return $this->state(function (array $attributes) {
            return [
                'uRole' => 'admin',
            ];
        });
    }

    public function student()
    {
        return $this->state(function (array $attributes) {
            return [
                'uRole' => 'student',
            ];
        });
    }
}
