<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Đề demo đầy đủ các dạng câu hỏi THPT/THCS để giáo viên tham khảo.
 * Bao gồm: ngữ âm, trọng âm, trắc nghiệm, đồng/trái nghĩa, chia dạng từ,
 * tìm lỗi sai, đọc điền, điền từ cho sẵn, open cloze, viết lại câu,
 * đọc hiểu hỗn hợp, nối câu.
 *
 * Run: php artisan db:seed --class=ThptFullDemoSeeder
 */
class ThptFullDemoSeeder extends Seeder
{
    public function run(): void
    {
        $teacher = User::where('uEmail', 'testteacher@example.com')->whereNull('uDeleted_at')->first()
            ?? User::where('uRole', 'teacher')->whereNull('uDeleted_at')->first();
        if (!$teacher) {
            $this->command->warn('Không tìm thấy teacher — bỏ qua.');
            return;
        }

        $exam = Exam::updateOrCreate(
            ['eTitle' => 'THPT - Đề tổng hợp đầy đủ dạng câu hỏi (Demo)'],
            [
                'eDescription' => 'Đề demo minh hoạ tất cả các dạng câu hỏi Tiếng Anh THCS/THPT mà giáo viên có thể tạo.',
                'eType' => 'THPT',
                'eSkill' => 'reading',
                'eDuration_minutes' => 60,
                'eStatus' => 'published',
                'ePurpose' => 'exam',
                'eDifficulty' => 'medium',
                'eTeacher_id' => $teacher->uId,
                'eIs_private' => false, // Đề demo — public cho mọi giáo viên
                'age_group' => 'teens',
                'thpt_config' => $this->config(),
            ]
        );

        $this->command->info("✅ Seeded full-demo THPT exam ID={$exam->eId}");
    }

    private function config(): array
    {
        return [
            'version' => '2.0',
            'level' => 'THPT',
            'total_duration_minutes' => 60,
            'scale_max' => 10,
            'sections' => [
                // 1. Phát âm
                [
                    'id' => 'd_phon', 'type' => 'phonetics', 'variant' => 'pronunciation', 'points_per_question' => 1,
                    'title' => 'Pronunciation', 'instructions' => 'Chọn từ có phần gạch chân phát âm khác.',
                    'items' => [
                        ['question_number' => 1, 'correct_id' => 'C', 'words' => [
                            ['id' => 'A', 'text' => 'cats', 'underline' => 's'],
                            ['id' => 'B', 'text' => 'books', 'underline' => 's'],
                            ['id' => 'C', 'text' => 'dogs', 'underline' => 's'],
                            ['id' => 'D', 'text' => 'maps', 'underline' => 's'],
                        ]],
                    ],
                ],
                // 2. Trọng âm
                [
                    'id' => 'd_stress', 'type' => 'phonetics', 'variant' => 'stress', 'points_per_question' => 1,
                    'title' => 'Stress', 'instructions' => 'Chọn từ có trọng âm khác vị trí.',
                    'items' => [
                        ['question_number' => 2, 'correct_id' => 'B', 'words' => [
                            ['id' => 'A', 'text' => 'teacher'],
                            ['id' => 'B', 'text' => 'begin'],
                            ['id' => 'C', 'text' => 'happy'],
                            ['id' => 'D', 'text' => 'pencil'],
                        ]],
                    ],
                ],
                // 3. Trắc nghiệm ngữ pháp
                [
                    'id' => 'd_gram', 'type' => 'mc_questions', 'variant' => 'grammar', 'points_per_question' => 1,
                    'title' => 'Grammar', 'instructions' => 'Chọn phương án đúng.',
                    'items' => [
                        ['question_number' => 3, 'prompt' => 'She ____ in London since 2010.', 'correct_id' => 'C', 'options' => [
                            ['id' => 'A', 'text' => 'lives'],
                            ['id' => 'B', 'text' => 'lived'],
                            ['id' => 'C', 'text' => 'has lived'],
                            ['id' => 'D', 'text' => 'is living'],
                        ]],
                    ],
                ],
                // 4. Đồng nghĩa
                [
                    'id' => 'd_syn', 'type' => 'mc_questions', 'variant' => 'synonym', 'points_per_question' => 1,
                    'title' => 'Synonym', 'instructions' => 'Chọn từ/cụm từ gần nghĩa nhất với phần gạch chân.',
                    'items' => [
                        ['question_number' => 4, 'prompt' => 'The film was absolutely fantastic.', 'correct_id' => 'A', 'options' => [
                            ['id' => 'A', 'text' => 'wonderful'],
                            ['id' => 'B', 'text' => 'boring'],
                            ['id' => 'C', 'text' => 'average'],
                            ['id' => 'D', 'text' => 'terrible'],
                        ]],
                    ],
                ],
                // 5. Chia dạng từ
                [
                    'id' => 'd_wf', 'type' => 'word_form', 'points_per_question' => 1,
                    'title' => 'Word form', 'instructions' => 'Cho dạng đúng của từ trong ngoặc.',
                    'items' => [
                        ['question_number' => 5, 'sentence' => 'She is one of the most ____ people I know.', 'root_word' => 'CREATE', 'accepted_answers' => ['creative'], 'case_sensitive' => false],
                    ],
                ],
                // 6. Tìm lỗi sai
                [
                    'id' => 'd_err', 'type' => 'error_identification', 'points_per_question' => 1,
                    'title' => 'Error identification', 'instructions' => 'Chọn phần gạch chân cần sửa.',
                    'items' => [
                        ['question_number' => 6, 'sentence' => 'He don\'t like coffee but he drinks it every morning.', 'correct_id' => 'A', 'segments' => [
                            ['id' => 'A', 'text' => "don't"],
                            ['id' => 'B', 'text' => 'like'],
                            ['id' => 'C', 'text' => 'drinks'],
                            ['id' => 'D', 'text' => 'every morning'],
                        ]],
                    ],
                ],
                // 7. Điền từ cho sẵn
                [
                    'id' => 'd_wb', 'type' => 'word_bank_cloze', 'points_per_question' => 1,
                    'title' => 'Word bank cloze', 'instructions' => 'Điền từ phù hợp từ ngân hàng từ.',
                    'word_bank' => ['however', 'because', 'although', 'therefore'],
                    'passage' => 'I wanted to go out. (7) ____, it was raining heavily, so I stayed home.',
                    'blanks' => [
                        ['question_number' => 7, 'accepted_answers' => ['However'], 'case_sensitive' => false],
                    ],
                ],
                // 8. Viết lại câu
                [
                    'id' => 'd_trans', 'type' => 'sentence_transformation', 'points_per_question' => 1,
                    'title' => 'Sentence transformation', 'instructions' => 'Viết lại câu sao cho nghĩa không đổi.',
                    'items' => [
                        ['question_number' => 8, 'original' => '"I will call you tomorrow," he said.', 'lead_in' => 'He said that', 'accepted_answers' => ['He said that he would call me the next day', 'He said that he would call me the following day']],
                    ],
                ],
            ],
        ];
    }
}
