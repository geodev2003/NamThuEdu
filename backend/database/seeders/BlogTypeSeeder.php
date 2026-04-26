<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BlogTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $blogTypes = [
            [
                'type_value' => 'grammar',
                'type_label' => 'Grammar',
                'type_icon' => 'BookOpen',
                'is_default' => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type_value' => 'tips',
                'type_label' => 'Tips',
                'type_icon' => 'Lightbulb',
                'is_default' => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type_value' => 'vocabulary',
                'type_label' => 'Vocabulary',
                'type_icon' => 'BookMarked',
                'is_default' => true,
                'sort_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type_value' => 'teaching',
                'type_label' => 'Teaching',
                'type_icon' => 'GraduationCap',
                'is_default' => true,
                'sort_order' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type_value' => 'news',
                'type_label' => 'News',
                'type_icon' => 'Newspaper',
                'is_default' => true,
                'sort_order' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('blog_types')->insert($blogTypes);
    }
}
