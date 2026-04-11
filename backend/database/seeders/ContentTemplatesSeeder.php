<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContentTemplate;

class ContentTemplatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            // KIDS TEMPLATES
            [
                'name' => '🐘 Animal Match Game',
                'description' => 'Drag and drop animals to their correct habitats',
                'age_group' => 'kids',
                'template_type' => 'game',
                'template_config' => [
                    'activity_type' => 'drag_drop',
                    'theme' => 'animals',
                    'difficulty' => 'easy',
                    'time_limit' => null,
                ],
                'default_settings' => [
                    'coins_per_correct' => 10,
                    'stars_possible' => 3,
                    'celebration_type' => 'confetti',
                ],
                'is_active' => true,
            ],
            [
                'name' => '🌈 Color Quiz',
                'description' => 'Match colors with their names',
                'age_group' => 'kids',
                'template_type' => 'quiz',
                'template_config' => [
                    'activity_type' => 'match_pairs',
                    'theme' => 'colors',
                    'difficulty' => 'easy',
                ],
                'default_settings' => [
                    'coins_per_correct' => 5,
                    'stars_possible' => 3,
                ],
                'is_active' => true,
            ],
            [
                'name' => '🔢 Number Game',
                'description' => 'Count and match numbers',
                'age_group' => 'kids',
                'template_type' => 'game',
                'template_config' => [
                    'activity_type' => 'match_pairs',
                    'theme' => 'numbers',
                    'difficulty' => 'easy',
                ],
                'default_settings' => [
                    'coins_per_correct' => 8,
                    'stars_possible' => 3,
                ],
                'is_active' => true,
            ],

            // TEENS TEMPLATES
            [
                'name' => '⚡ Speed Grammar Challenge',
                'description' => 'Fast-paced grammar quiz with leaderboard',
                'age_group' => 'teens',
                'template_type' => 'challenge',
                'template_config' => [
                    'competitive_mode' => true,
                    'time_limit' => 300,
                    'question_count' => 20,
                ],
                'default_settings' => [
                    'base_points' => 10,
                    'speed_bonus' => 5,
                    'leaderboard_enabled' => true,
                ],
                'is_active' => true,
            ],
            [
                'name' => '🏆 Vocabulary Battle',
                'description' => 'Compete with classmates on vocabulary',
                'age_group' => 'teens',
                'template_type' => 'challenge',
                'template_config' => [
                    'competitive_mode' => true,
                    'battle_mode' => true,
                    'time_limit' => 600,
                ],
                'default_settings' => [
                    'base_points' => 15,
                    'streak_multiplier' => 1.5,
                ],
                'is_active' => true,
            ],
            [
                'name' => '🎯 Daily Challenge',
                'description' => 'Daily mixed skills challenge',
                'age_group' => 'teens',
                'template_type' => 'quiz',
                'template_config' => [
                    'mixed_skills' => true,
                    'time_limit' => 900,
                ],
                'default_settings' => [
                    'base_points' => 20,
                    'daily_bonus' => 50,
                ],
                'is_active' => true,
            ],

            // ADULTS TEMPLATES
            [
                'name' => '📊 Professional Assessment',
                'description' => 'Comprehensive skills assessment',
                'age_group' => 'adults',
                'template_type' => 'assessment',
                'template_config' => [
                    'professional_level' => 'intermediate',
                    'detailed_feedback' => true,
                    'time_limit' => 3600,
                ],
                'default_settings' => [
                    'passing_score' => 80,
                    'certification_enabled' => true,
                ],
                'is_active' => true,
            ],
            [
                'name' => '🎓 IELTS Practice Module',
                'description' => 'IELTS preparation module',
                'age_group' => 'adults',
                'template_type' => 'module',
                'template_config' => [
                    'professional_level' => 'advanced',
                    'sections' => ['reading', 'writing', 'listening', 'speaking'],
                ],
                'default_settings' => [
                    'target_score' => 7.0,
                    'detailed_analytics' => true,
                ],
                'is_active' => true,
            ],
            [
                'name' => '💼 Business English Assessment',
                'description' => 'Professional business English evaluation',
                'age_group' => 'adults',
                'template_type' => 'assessment',
                'template_config' => [
                    'professional_level' => 'expert',
                    'business_focused' => true,
                ],
                'default_settings' => [
                    'passing_score' => 85,
                    'certificate_template' => 'business_cert',
                ],
                'is_active' => true,
            ],

            // UNIVERSAL TEMPLATES
            [
                'name' => '📝 Standard Quiz',
                'description' => 'Standard multiple choice quiz for all ages',
                'age_group' => 'all',
                'template_type' => 'quiz',
                'template_config' => [
                    'adaptive_difficulty' => true,
                    'time_limit' => 1800,
                ],
                'default_settings' => [
                    'auto_adapt' => true,
                ],
                'is_active' => true,
            ],
        ];

        foreach ($templates as $template) {
            ContentTemplate::create($template);
        }

        $this->command->info('Content templates seeded successfully!');
    }
}
