<?php

namespace Database\Factories;

use App\Models\TemplateSection;
use App\Models\ExamTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

class TemplateSectionFactory extends Factory
{
    protected $model = TemplateSection::class;

    public function definition()
    {
        return [
            'template_id' => ExamTemplate::factory(),
            'section_name' => $this->faker->randomElement(['Reading', 'Listening', 'Writing', 'Speaking']),
            'section_order' => $this->faker->numberBetween(1, 4),
            'duration_minutes' => $this->faker->randomElement([20, 30, 40, 60]),
            'total_questions' => $this->faker->numberBetween(10, 40),
            'section_description' => $this->faker->sentence(),
            'instructions' => $this->faker->paragraph(),
        ];
    }
}
