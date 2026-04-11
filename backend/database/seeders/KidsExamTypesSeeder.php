<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KidsExamTypesSeeder extends Seeder
{
    public function run(): void
    {
        $examTypes = [
            [
                'code' => 'yle_starters',
                'name' => 'Cambridge YLE Starters',
                'level' => 'Pre A1',
                'age_group' => 'kids',
                'min_age' => 6,
                'max_age' => 8,
                'vocabulary_size' => 350,
                'default_duration' => 45, // 20 min Listening + 20 min Reading & Writing + 5 min Speaking
                'description' => 'Cấp độ cơ bản nhất cho trẻ 6-8 tuổi. Tập trung vào từ vựng đơn giản và nhận diện hình ảnh.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'yle_movers',
                'name' => 'Cambridge YLE Movers',
                'level' => 'A1',
                'age_group' => 'kids',
                'min_age' => 8,
                'max_age' => 11,
                'vocabulary_size' => 600,
                'default_duration' => 60, // 25 min Listening + 30 min Reading & Writing + 5 min Speaking
                'description' => 'Cấp độ trung bình cho trẻ 8-11 tuổi. Yêu cầu hiểu ngữ cảnh và viết câu ngắn.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'yle_flyers',
                'name' => 'Cambridge YLE Flyers',
                'level' => 'A2',
                'age_group' => 'kids',
                'min_age' => 9,
                'max_age' => 12,
                'vocabulary_size' => 900,
                'default_duration' => 75, // 25 min Listening + 40 min Reading & Writing + 10 min Speaking
                'description' => 'Cấp độ nâng cao cho trẻ 9-12 tuổi. Yêu cầu ngữ pháp chuẩn xác và viết sáng tạo.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('kids_exam_types')->insert($examTypes);
    }
}
