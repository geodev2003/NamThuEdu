<?php

namespace Database\Factories;

use App\Models\ExamType;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExamTypeFactory extends Factory
{
    protected $model = ExamType::class;

    public function definition()
    {
        $types = ['IELTS', 'TOEFL', 'TOEIC', 'VSTEP', 'Cambridge'];
        $typeName = $this->faker->randomElement($types);
        
        return [
            'type_code' => strtoupper(substr($typeName, 0, 4)),
            'type_name' => $typeName,
            'etDescription' => $typeName . ' Exam Type',
            'etHas_reading' => true,
            'etHas_listening' => true,
            'etHas_writing' => $this->faker->boolean(80),
            'etHas_speaking' => $this->faker->boolean(80),
            'etScoring_system' => $this->faker->randomElement(['band', 'score', 'percentage']),
            'etMax_score' => $this->faker->randomElement([9, 120, 990, 10]),
            'etMin_pass_score' => $this->faker->randomElement([5, 60, 450, 5]),
            'etOfficial_website' => 'https://' . strtolower($typeName) . '.org',
            'etIs_active' => true,
        ];
    }
}
