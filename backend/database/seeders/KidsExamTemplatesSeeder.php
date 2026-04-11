<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KidsExamTemplatesSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'code' => 'yle_starters',
                'name' => 'Cambridge YLE Starters',
                'config' => json_encode([
                    'level' => 'Pre A1',
                    'age_range' => '6-8 years',
                    'vocabulary_size' => 350,
                    'skills' => ['listening', 'reading', 'writing', 'speaking'],
                    'duration' => 45,
                    'description' => 'Cambridge English: Young Learners Starters - Pre A1 level',
                    'parts' => [
                        ['skill' => 'listening', 'parts' => 4],
                        ['skill' => 'reading', 'parts' => 5],
                        ['skill' => 'writing', 'parts' => 3],
                        ['skill' => 'speaking', 'parts' => 3],
                    ],
                ]),
            ],
            [
                'code' => 'yle_movers',
                'name' => 'Cambridge YLE Movers',
                'config' => json_encode([
                    'level' => 'A1',
                    'age_range' => '8-11 years',
                    'vocabulary_size' => 650,
                    'skills' => ['listening', 'reading', 'writing', 'speaking'],
                    'duration' => 60,
                    'description' => 'Cambridge English: Young Learners Movers - A1 level',
                    'parts' => [
                        ['skill' => 'listening', 'parts' => 5],
                        ['skill' => 'reading', 'parts' => 6],
                        ['skill' => 'writing', 'parts' => 3],
                        ['skill' => 'speaking', 'parts' => 4],
                    ],
                ]),
            ],
            [
                'code' => 'yle_flyers',
                'name' => 'Cambridge YLE Flyers',
                'config' => json_encode([
                    'level' => 'A2',
                    'age_range' => '9-12 years',
                    'vocabulary_size' => 900,
                    'skills' => ['listening', 'reading', 'writing', 'speaking'],
                    'duration' => 75,
                    'description' => 'Cambridge English: Young Learners Flyers - A2 level',
                    'parts' => [
                        ['skill' => 'listening', 'parts' => 5],
                        ['skill' => 'reading', 'parts' => 7],
                        ['skill' => 'writing', 'parts' => 3],
                        ['skill' => 'speaking', 'parts' => 4],
                    ],
                ]),
            ],
        ];

        foreach ($templates as $template) {
            DB::table('kids_exam_templates')->insert(array_merge($template, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
