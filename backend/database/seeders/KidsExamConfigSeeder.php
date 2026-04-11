<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KidsExamConfigSeeder extends Seeder
{
    /**
     * Seed kids exam configuration data
     * Lưu vào bảng riêng để dễ quản lý và tái sử dụng
     */
    public function run(): void
    {
        // Tạo bảng config nếu chưa có
        DB::statement('
            CREATE TABLE IF NOT EXISTS kids_exam_templates (
                id INT PRIMARY KEY AUTO_INCREMENT,
                code VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                config JSON NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        ');

        $templates = [
            [
                'code' => 'yle_starters',
                'name' => 'Cambridge YLE Starters',
                'config' => json_encode([
                    'exam_type' => 'yle_starters',
                    'level' => 'Pre A1',
                    'age_range' => '6-8',
                    'min_age' => 6,
                    'max_age' => 8,
                    'vocabulary_size' => 350,
                    'description' => 'Cấp độ cơ bản nhất cho trẻ 6-8 tuổi',
                    'skills' => ['listening', 'reading', 'writing'],
                    'parts' => [
                        'listening' => 4,
                        'reading_writing' => 5,
                    ],
                    'task_types' => [
                        'listen_and_draw_lines',
                        'listen_and_write',
                        'listen_and_tick',
                        'listen_and_colour',
                        'look_and_read',
                        'unscramble_words',
                        'cloze_test',
                    ]
                ])
            ],
            [
                'code' => 'yle_movers',
                'name' => 'Cambridge YLE Movers',
                'config' => json_encode([
                    'exam_type' => 'yle_movers',
                    'level' => 'A1',
                    'age_range' => '8-11',
                    'min_age' => 8,
                    'max_age' => 11,
                    'vocabulary_size' => 600,
                    'description' => 'Cấp độ trung bình cho trẻ 8-11 tuổi',
                    'skills' => ['listening', 'reading', 'writing'],
                    'parts' => [
                        'listening' => 5,
                        'reading_writing' => 6,
                    ],
                    'task_types' => [
                        'listen_and_draw_lines',
                        'listen_and_write',
                        'listen_and_match',
                        'listen_and_tick',
                        'listen_colour_write',
                        'match_definitions',
                        'dialogue_completion',
                        'story_cloze',
                        'multiple_choice_grammar',
                        'story_completion',
                    ]
                ])
            ],
            [
                'code' => 'yle_flyers',
                'name' => 'Cambridge YLE Flyers',
                'config' => json_encode([
                    'exam_type' => 'yle_flyers',
                    'level' => 'A2',
                    'age_range' => '9-12',
                    'min_age' => 9,
                    'max_age' => 12,
                    'vocabulary_size' => 900,
                    'description' => 'Cấp độ nâng cao cho trẻ 9-12 tuổi',
                    'skills' => ['listening', 'reading', 'writing'],
                    'parts' => [
                        'listening' => 5,
                        'reading_writing' => 7,
                    ],
                    'task_types' => [
                        'listen_and_draw_lines',
                        'listen_and_write',
                        'listen_and_match',
                        'dictionary_definitions',
                        'dialogue_matching',
                        'story_completion',
                        'factual_text_grammar',
                        'open_cloze',
                        'picture_story_writing',
                    ]
                ])
            ],
        ];

        foreach ($templates as $template) {
            DB::table('kids_exam_templates')->updateOrInsert(
                ['code' => $template['code']],
                $template
            );
        }

        // Seed task type definitions
        DB::statement('
            CREATE TABLE IF NOT EXISTS kids_task_definitions (
                id INT PRIMARY KEY AUTO_INCREMENT,
                code VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                definition JSON NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        ');

        $taskDefinitions = $this->getTaskDefinitions();

        foreach ($taskDefinitions as $task) {
            DB::table('kids_task_definitions')->updateOrInsert(
                ['code' => $task['code']],
                $task
            );
        }
    }

    private function getTaskDefinitions(): array
    {
        return [
            // LISTENING TASKS
            [
                'code' => 'listen_and_draw_lines',
                'name' => 'Listen and Draw Lines',
                'definition' => json_encode([
                    'skill' => 'listening',
                    'icon' => '🎧',
                    'applicable_levels' => ['starters', 'movers', 'flyers'],
                    'instructions' => 'Nghe và nối tên với đúng người trong tranh',
                    'structure' => [
                        'audio_url' => 'required|string',
                        'base_image_url' => 'required|string',
                        'items' => 'required|array',
                        'items.*.name' => 'required|string',
                        'items.*.person_id' => 'required|string',
                        'items.*.description' => 'nullable|string',
                    ],
                    'example' => [
                        'audio_url' => 'https://example.com/audio.mp3',
                        'base_image_url' => 'https://example.com/scene.jpg',
                        'items' => [
                            ['name' => 'Tom', 'person_id' => 'person_1', 'description' => 'wearing red shirt']
                        ]
                    ]
                ])
            ],
            [
                'code' => 'listen_and_write',
                'name' => 'Listen and Write',
                'definition' => json_encode([
                    'skill' => 'listening',
                    'icon' => '✍️',
                    'applicable_levels' => ['starters', 'movers', 'flyers'],
                    'instructions' => 'Nghe và điền tên hoặc số vào chỗ trống',
                    'structure' => [
                        'audio_url' => 'required|string',
                        'form_fields' => 'required|array',
                        'form_fields.*.label' => 'required|string',
                        'form_fields.*.answer_type' => 'required|in:text,number',
                        'form_fields.*.correct_answer' => 'required|string',
                    ],
                    'example' => [
                        'audio_url' => 'https://example.com/audio.mp3',
                        'form_fields' => [
                            ['label' => 'Name:', 'answer_type' => 'text', 'correct_answer' => 'Sarah'],
                            ['label' => 'Age:', 'answer_type' => 'number', 'correct_answer' => '8']
                        ]
                    ]
                ])
            ],
            [
                'code' => 'listen_and_tick',
                'name' => 'Listen and Tick the Box',
                'definition' => json_encode([
                    'skill' => 'listening',
                    'icon' => '☑️',
                    'applicable_levels' => ['starters', 'movers', 'flyers'],
                    'instructions' => 'Nghe và chọn hình đúng (A, B, hoặc C)',
                    'structure' => [
                        'mainAudioUrl' => 'nullable|string',
                        'mainImageUrl' => 'nullable|string',
                        'items' => 'required|array',
                        'items.*.id' => 'required|string',
                        'items.*.questionText' => 'required|string',
                        'items.*.optionA' => 'required|array',
                        'items.*.optionB' => 'required|array',
                        'items.*.optionC' => 'required|array',
                        'items.*.correctAnswer' => 'required|in:A,B,C',
                        'items.*.isExample' => 'nullable|boolean',
                    ],
                    'example' => [
                        'mainAudioUrl' => 'https://example.com/audio.mp3',
                        'mainImageUrl' => 'https://example.com/main.jpg',
                        'items' => [
                            [
                                'id' => '1',
                                'questionText' => 'Where is Lucy now?',
                                'optionA' => ['imageUrl' => 'a.jpg', 'label' => 'A'],
                                'optionB' => ['imageUrl' => 'b.jpg', 'label' => 'B'],
                                'optionC' => ['imageUrl' => 'c.jpg', 'label' => 'C'],
                                'correctAnswer' => 'A',
                                'isExample' => true
                            ]
                        ]
                    ]
                ])
            ],
            [
                'code' => 'listen_colour',
                'name' => 'Listen and Colour',
                'definition' => json_encode([
                    'skill' => 'listening',
                    'icon' => '🎨',
                    'applicable_levels' => ['starters', 'movers', 'flyers'],
                    'instructions' => 'Nghe và tô màu theo hướng dẫn',
                    'structure' => [
                        'mainAudioUrl' => 'nullable|string',
                        'mainImageUrl' => 'required|string',
                        'instructions' => 'required|array',
                        'instructions.*.id' => 'required|string',
                        'instructions.*.objectName' => 'required|string',
                        'instructions.*.colour' => 'required|string',
                        'instructions.*.position' => 'nullable|string',
                        'instructions.*.isExample' => 'nullable|boolean',
                    ],
                    'example' => [
                        'mainAudioUrl' => 'https://example.com/audio.mp3',
                        'mainImageUrl' => 'https://example.com/coloring-page.jpg',
                        'instructions' => [
                            [
                                'id' => '1',
                                'objectName' => 'the apple',
                                'colour' => 'red',
                                'position' => 'on the table',
                                'isExample' => true
                            ],
                            [
                                'id' => '2',
                                'objectName' => 'the banana',
                                'colour' => 'yellow',
                                'position' => 'next to the apple',
                                'isExample' => false
                            ]
                        ]
                    ]
                ])
            ],
            [
                'code' => 'look_and_read',
                'name' => 'Look and Read',
                'definition' => json_encode([
                    'skill' => 'reading',
                    'icon' => '👀',
                    'applicable_levels' => ['starters', 'movers', 'flyers'],
                    'instructions' => 'Nhìn tranh và đọc câu. Đánh dấu ✓ hoặc ✗',
                    'structure' => [
                        'items' => 'required|array',
                        'items.*.id' => 'required|string',
                        'items.*.imageUrl' => 'required|string',
                        'items.*.statement' => 'required|string',
                        'items.*.correctAnswer' => 'required|in:tick,cross',
                        'items.*.isExample' => 'nullable|boolean',
                    ],
                    'example' => [
                        'items' => [
                            [
                                'id' => '1',
                                'imageUrl' => 'https://example.com/bus.jpg',
                                'statement' => 'This is a bus.',
                                'correctAnswer' => 'tick',
                                'isExample' => true
                            ],
                            [
                                'id' => '2',
                                'imageUrl' => 'https://example.com/snakes.jpg',
                                'statement' => 'These are snakes.',
                                'correctAnswer' => 'cross',
                                'isExample' => true
                            ],
                            [
                                'id' => '3',
                                'imageUrl' => 'https://example.com/mat.jpg',
                                'statement' => 'This is a mat.',
                                'correctAnswer' => 'cross',
                                'isExample' => false
                            ]
                        ]
                    ]
                ])
            ],
            [
                'code' => 'unscramble_words',
                'name' => 'Unscramble Words',
                'definition' => json_encode([
                    'skill' => 'writing',
                    'icon' => '🔤',
                    'applicable_levels' => ['starters'],
                    'instructions' => 'Nhìn hình và sắp xếp chữ cái thành từ đúng',
                    'structure' => [
                        'items' => 'required|array',
                        'items.*.image_url' => 'required|string',
                        'items.*.scrambled_word' => 'required|string',
                        'items.*.correct_answer' => 'required|string',
                    ],
                    'example' => [
                        'items' => [
                            ['image_url' => 'cat.jpg', 'scrambled_word' => 'tca', 'correct_answer' => 'cat']
                        ]
                    ]
                ])
            ],
            [
                'code' => 'picture_story_writing',
                'name' => 'Picture Story Writing',
                'definition' => json_encode([
                    'skill' => 'writing',
                    'icon' => '🖼️',
                    'applicable_levels' => ['flyers'],
                    'instructions' => 'Nhìn tranh và viết câu chuyện (tối thiểu 20 từ)',
                    'structure' => [
                        'images' => 'required|array|min:3',
                        'images.*' => 'required|string',
                        'min_words' => 'required|integer|min:20',
                        'scoring_criteria' => 'required|array',
                    ],
                    'example' => [
                        'images' => ['img1.jpg', 'img2.jpg', 'img3.jpg'],
                        'min_words' => 20,
                        'scoring_criteria' => [
                            'content' => 3,
                            'language' => 3,
                            'organization' => 2
                        ]
                    ]
                ])
            ],
            // Thêm các task types khác tương tự...
        ];
    }
}
