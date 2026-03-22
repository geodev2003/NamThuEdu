<?php

namespace Database\Factories;

use App\Models\TestAssignment;
use App\Models\Exam;
use App\Models\User;
use App\Models\Classes;
use Illuminate\Database\Eloquent\Factories\Factory;

class TestAssignmentFactory extends Factory
{
    protected $model = TestAssignment::class;

    public function definition()
    {
        $assignmentType = $this->faker->randomElement(['individual', 'class']);
        
        return [
            'exam_id' => Exam::factory(),
            'student_id' => $assignmentType === 'individual' ? User::factory()->create(['uRole' => 'student'])->uId : null,
            'class_id' => $assignmentType === 'class' ? Classes::factory()->clId : null,
            'assigned_by' => User::factory()->create(['uRole' => 'teacher'])->uId,
            'due_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'status' => $this->faker->randomElement(['assigned', 'in_progress', 'completed', 'overdue']),
            'instructions' => $this->faker->paragraph(),
            'max_attempts' => $this->faker->numberBetween(1, 3),
            'assigned_at' => now(),
        ];
    }
}
