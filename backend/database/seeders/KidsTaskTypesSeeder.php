<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KidsTaskTypesSeeder extends Seeder
{
    public function run(): void
    {
        $taskTypes = [
            // LISTENING TASKS
            [
                'code' => 'listen_and_draw_lines',
                'name' => 'Nghe và Nối',
                'definition' => json_encode([
                    'skill' => 'listening',
                    'icon' => '🎧',
                    'instructions' => 'Nghe và nối tên với đúng người trong tranh',
                    'applicable_levels' => ['starters', 'movers', 'flyers'],
                    'example_structure' => [
                        'audio_url' => 'string',
                        'base_image_url' => 'string',
                        'items' => [
                            ['name' => 'string', 'person_id' => 'string']
                        ]
                    ],
                ]),
            ],
            [
                'code' => 'listen_and_write',
                'name' => 'Nghe và Viết',
                'definition' => json_encode([
                    'skill' => 'listening',
                    'icon' => '✍️',
                    'instructions' => 'Nghe và điền tên hoặc số vào chỗ trống',
                    'applicable_levels' => ['starters', 'movers', 'flyers'],
                    'example_structure' => [
                        'audio_url' => 'string',
                        'form_fields' => [
                            ['label' => 'string', 'answer_type' => 'text|number', 'correct_answer' => 'string']
                        ]
                    ],
                ]),
            ],
            [
                'code' => 'listen_and_tick',
                'name' => 'Nghe và Chọn Hình',
                'definition' => json_encode([
                    'skill' => 'listening',
                    'icon' => '☑️',
                    'instructions' => 'Nghe và chọn hình đúng (A, B, hoặc C)',
                    'applicable_levels' => ['starters', 'movers', 'flyers'],
                    'example_structure' => [
                        'audio_url' => 'string',
                        'questions' => [
                            [
                                'question' => 'string',
                                'options' => [
                                    ['id' => 'A', 'image_url' => 'string']
                                ],
                                'correct_answer' => 'string'
                            ]
                        ]
                    ],
                ]),
            ],
            [
                'code' => 'listen_colour_write',
                'name' => 'Nghe và Tô Màu',
                'definition' => json_encode([
                    'skill' => 'listening',
                    'icon' => '🎨',
                    'instructions' => 'Nghe và tô màu theo hướng dẫn',
                    'applicable_levels' => ['starters', 'movers', 'flyers'],
                    'example_structure' => [
                        'audio_url' => 'string',
                        'base_image_url' => 'string',
                        'tasks' => [
                            ['object' => 'string', 'colour' => 'string', 'position' => 'string']
                        ]
                    ],
                ]),
            ],

            // READING & WRITING TASKS
            [
                'code' => 'look_and_read',
                'name' => 'Nhìn và Đọc',
                'definition' => json_encode([
                    'skill' => 'reading',
                    'icon' => '👀',
                    'instructions' => 'Nhìn tranh và đánh dấu đúng/sai',
                    'applicable_levels' => ['starters', 'movers', 'flyers'],
                    'example_structure' => [
                        'image_url' => 'string',
                        'statements' => [
                            ['text' => 'string', 'correct_answer' => 'yes|no']
                        ]
                    ],
                ]),
            ],
            [
                'code' => 'unscramble_words',
                'name' => 'Sắp Xếp Chữ Cái',
                'definition' => json_encode([
                    'skill' => 'writing',
                    'icon' => '🔤',
                    'instructions' => 'Nhìn hình và sắp xếp chữ cái thành từ đúng',
                    'applicable_levels' => ['starters'],
                    'example_structure' => [
                        'items' => [
                            ['image_url' => 'string', 'scrambled_word' => 'string', 'correct_answer' => 'string']
                        ]
                    ],
                ]),
            ],
            [
                'code' => 'cloze_test',
                'name' => 'Điền Từ Vào Chỗ Trống',
                'definition' => json_encode([
                    'skill' => 'reading',
                    'icon' => '📝',
                    'instructions' => 'Chọn từ đúng để điền vào chỗ trống',
                    'applicable_levels' => ['starters', 'movers', 'flyers'],
                    'example_structure' => [
                        'text' => 'string',
                        'gaps' => [
                            ['gap_id' => 'number', 'options' => ['array'], 'correct_answer' => 'string']
                        ]
                    ],
                ]),
            ],
            [
                'code' => 'dialogue_matching',
                'name' => 'Ghép Hội Thoại',
                'definition' => json_encode([
                    'skill' => 'reading',
                    'icon' => '💬',
                    'instructions' => 'Chọn câu trả lời phù hợp cho hội thoại',
                    'applicable_levels' => ['movers', 'flyers'],
                    'example_structure' => [
                        'dialogues' => [
                            [
                                'question' => 'string',
                                'options' => [['id' => 'string', 'text' => 'string']],
                                'correct_answer' => 'string'
                            ]
                        ]
                    ],
                ]),
            ],
            [
                'code' => 'story_completion',
                'name' => 'Hoàn Thành Câu Chuyện',
                'definition' => json_encode([
                    'skill' => 'reading',
                    'icon' => '📖',
                    'instructions' => 'Đọc câu chuyện và hoàn thành câu',
                    'applicable_levels' => ['movers', 'flyers'],
                    'example_structure' => [
                        'story_text' => 'string',
                        'completion_sentences' => [
                            ['text' => 'string', 'correct_answer' => 'string', 'max_words' => 'number']
                        ]
                    ],
                ]),
            ],
            [
                'code' => 'word_definition_matching',
                'name' => 'Ghép Từ với Định Nghĩa',
                'definition' => json_encode([
                    'skill' => 'reading',
                    'icon' => '📚',
                    'instructions' => 'Ghép từ với định nghĩa phù hợp',
                    'applicable_levels' => ['movers', 'flyers'],
                    'example_structure' => [
                        'words' => [
                            ['word' => 'string', 'definition' => 'string']
                        ]
                    ],
                ]),
            ],
            [
                'code' => 'word_bank_fill',
                'name' => 'Chọn Từ Điền Vào Chỗ Trống',
                'definition' => json_encode([
                    'skill' => 'reading',
                    'icon' => '🏦',
                    'instructions' => 'Chọn từ trong ngân hàng để điền vào chỗ trống',
                    'applicable_levels' => ['starters', 'movers'],
                    'example_structure' => [
                        'text' => 'string with __1__, __2__ gaps',
                        'word_bank' => ['array of words'],
                        'gaps' => [
                            ['gap_number' => 'number', 'correct_word' => 'string']
                        ]
                    ],
                ]),
            ],
            [
                'code' => 'reading_comprehension',
                'name' => 'Đọc Hiểu',
                'definition' => json_encode([
                    'skill' => 'reading',
                    'icon' => '📋',
                    'instructions' => 'Đọc đoạn văn và trả lời câu hỏi',
                    'applicable_levels' => ['flyers'],
                    'example_structure' => [
                        'passage' => 'string (50+ words)',
                        'questions' => [
                            ['question' => 'string', 'answer' => 'string']
                        ]
                    ],
                ]),
            ],
            [
                'code' => 'open_cloze',
                'name' => 'Tự Điền Từ',
                'definition' => json_encode([
                    'skill' => 'writing',
                    'icon' => '✏️',
                    'instructions' => 'Tự điền 1 từ thích hợp vào chỗ trống',
                    'applicable_levels' => ['flyers'],
                    'example_structure' => [
                        'text' => 'string',
                        'gaps' => [
                            ['gap_id' => 'number', 'correct_answers' => ['array']]
                        ]
                    ],
                ]),
            ],
            [
                'code' => 'picture_story_writing',
                'name' => 'Viết Câu Chuyện Theo Tranh',
                'definition' => json_encode([
                    'skill' => 'writing',
                    'icon' => '🖼️',
                    'instructions' => 'Nhìn tranh và viết câu chuyện (tối thiểu 20 từ)',
                    'applicable_levels' => ['flyers'],
                    'example_structure' => [
                        'images' => ['array of urls'],
                        'min_words' => 20,
                        'scoring_criteria' => ['content' => 3, 'language' => 3, 'organization' => 2]
                    ],
                ]),
            ],
            [
                'code' => 'picture_sentence_writing',
                'name' => 'Viết Câu Mô Tả Tranh',
                'definition' => json_encode([
                    'skill' => 'writing',
                    'icon' => '📸',
                    'instructions' => 'Nhìn tranh và viết câu mô tả (1 câu hoàn chỉnh)',
                    'applicable_levels' => ['movers', 'flyers'],
                    'example_structure' => [
                        'items' => [
                            [
                                'image_url' => 'string',
                                'prompt' => 'string',
                                'sample_answers' => ['array']
                            ]
                        ]
                    ],
                ]),
            ],

            // SPEAKING TASKS
            [
                'code' => 'find_differences',
                'name' => 'Tìm Điểm Khác Biệt',
                'definition' => json_encode([
                    'skill' => 'speaking',
                    'icon' => '🔍',
                    'instructions' => 'So sánh 2 bức tranh và mô tả sự khác biệt',
                    'applicable_levels' => ['starters', 'movers', 'flyers'],
                    'example_structure' => [
                        'image_a_url' => 'string',
                        'image_b_url' => 'string',
                        'differences' => ['array']
                    ],
                ]),
            ],
            [
                'code' => 'picture_story_narration',
                'name' => 'Kể Chuyện Theo Tranh',
                'definition' => json_encode([
                    'skill' => 'speaking',
                    'icon' => '🗣️',
                    'instructions' => 'Nhìn tranh và kể câu chuyện',
                    'applicable_levels' => ['starters', 'movers', 'flyers'],
                    'example_structure' => [
                        'images' => ['array of urls'],
                        'prompts' => ['array of questions']
                    ],
                ]),
            ],
            [
                'code' => 'odd_one_out',
                'name' => 'Tìm Hình Khác Loại',
                'definition' => json_encode([
                    'skill' => 'speaking',
                    'icon' => '🤔',
                    'instructions' => 'Tìm hình khác loại và giải thích lý do',
                    'applicable_levels' => ['starters', 'movers', 'flyers'],
                    'example_structure' => [
                        'images' => [
                            ['id' => 'number', 'url' => 'string', 'category' => 'string']
                        ],
                        'correct_odd_one' => 'number'
                    ],
                ]),
            ],
            [
                'code' => 'information_exchange',
                'name' => 'Trao Đổi Thông Tin',
                'definition' => json_encode([
                    'skill' => 'speaking',
                    'icon' => '🔄',
                    'instructions' => 'Hỏi và trả lời để trao đổi thông tin',
                    'applicable_levels' => ['flyers'],
                    'example_structure' => [
                        'student_card' => ['object with missing info'],
                        'examiner_card' => ['object with complete info'],
                        'required_questions' => ['array']
                    ],
                ]),
            ],
            
            // NEW CORRECTED TASK TYPES (2026-04-10)
            [
                'code' => 'object_placement',
                'name' => 'Đặt Vật Vào Tranh',
                'definition' => json_encode([
                    'skill' => 'speaking',
                    'icon' => '📍',
                    'instructions' => 'Đặt thẻ hình vào đúng vị trí trong tranh lớn',
                    'applicable_levels' => ['starters'],
                    'example_structure' => [
                        'base_image_url' => 'string',
                        'items' => [
                            [
                                'name' => 'string',
                                'card_image_url' => 'string',
                                'correct_position' => ['x' => 'number', 'y' => 'number']
                            ]
                        ]
                    ],
                ]),
            ],
            [
                'code' => 'picture_questions',
                'name' => 'Trả Lời Câu Hỏi Về Hình',
                'definition' => json_encode([
                    'skill' => 'speaking',
                    'icon' => '❓',
                    'instructions' => 'Trả lời câu hỏi về hình',
                    'applicable_levels' => ['starters'],
                    'example_structure' => [
                        'questions' => [
                            [
                                'image_url' => 'string',
                                'question' => 'string',
                                'sample_answer' => 'string'
                            ]
                        ]
                    ],
                ]),
            ],
            [
                'code' => 'picture_card_questions',
                'name' => 'Trả Lời Câu Hỏi Về Thẻ Hình',
                'definition' => json_encode([
                    'skill' => 'speaking',
                    'icon' => '🃏',
                    'instructions' => 'Trả lời câu hỏi về thẻ hình nhỏ',
                    'applicable_levels' => ['starters'],
                    'example_structure' => [
                        'cards' => [
                            [
                                'image_url' => 'string',
                                'question' => 'string',
                                'sample_answer' => 'string'
                            ]
                        ]
                    ],
                ]),
            ],
            [
                'code' => 'listening_letter_match',
                'name' => 'Nghe và Ghép Chữ Cái',
                'definition' => json_encode([
                    'skill' => 'listening',
                    'icon' => '🔤',
                    'instructions' => 'Nghe và ghép nối bằng chữ cái',
                    'applicable_levels' => ['movers', 'flyers'],
                    'example_structure' => [
                        'audio_url' => 'string',
                        'left_items' => [
                            ['name' => 'string', 'image_url' => 'string']
                        ],
                        'right_items' => [
                            ['letter' => 'string', 'image_url' => 'string']
                        ],
                        'correct_matches' => [
                            ['left_id' => 'string', 'right_letter' => 'string']
                        ]
                    ],
                ]),
            ],
            
            // NEW TASK TYPE: Look, Read and Write (2026-04-10)
            [
                'code' => 'look_read_write',
                'name' => 'Nhìn, Đọc và Viết',
                'definition' => json_encode([
                    'skill' => 'reading',
                    'icon' => '✍️',
                    'instructions' => 'Nhìn tranh, đọc câu hỏi và viết câu trả lời một từ',
                    'applicable_levels' => ['starters', 'movers', 'flyers'],
                    'example_structure' => [
                        'shared_image_url' => 'string (optional - if not provided, each question must have image_url)',
                        'questions' => [
                            [
                                'question' => 'string',
                                'hint_prefix' => 'string (optional)',
                                'correct_answer' => 'string',
                                'is_example' => 'boolean',
                                'image_url' => 'string (optional - if not provided, uses shared_image_url)'
                            ]
                        ]
                    ],
                ]),
            ],
        ];

        foreach ($taskTypes as $taskType) {
            DB::table('kids_task_definitions')->updateOrInsert(
                ['code' => $taskType['code']], // Match by code
                array_merge($taskType, [
                    'created_at' => DB::raw('COALESCE(created_at, NOW())'),
                    'updated_at' => now(),
                ])
            );
        }
    }
}
