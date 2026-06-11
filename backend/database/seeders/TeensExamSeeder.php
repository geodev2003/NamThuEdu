<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\ClassModel;
use App\Models\Exam;
use App\Models\Question;
use App\Models\Answer;
use App\Models\TestAssignment;

/**
 * TeensExamSeeder
 *
 * Self-contained seed cho luồng học viên TEENS (13–17):
 *  - 1 giáo viên (nếu chưa có)
 *  - 1 lớp teens
 *  - 3 học viên teens gán vào lớp
 *  - 1 đề GENERAL (objective, eSkill=mixed → KHÔNG vướng age-gate VSTEP)
 *    gồm 10 câu trắc nghiệm (grammar/vocabulary/reading) có đáp án đúng
 *  - 1 assignment gán đề cho lớp teens (deadline tương lai)
 *
 * Mục đích: cho phép teens đăng nhập → làm bài → chấm điểm tự động (objective).
 *
 * Chạy: php artisan db:seed --class=TeensExamSeeder
 */
class TeensExamSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🌱 Seeding TEENS exam flow...');

        // 1. Teacher
        $teacher = User::firstOrCreate(
            ['uPhone' => '0905550001'],
            [
                'uName'     => 'GV Teens Demo',
                'uPassword' => Hash::make('password123'),
                'uRole'     => 'teacher',
                'uStatus'   => 'active',
                'uGender'   => 1,
            ]
        );

        // 2. Lớp teens
        $class = ClassModel::firstOrCreate(
            ['cName' => 'Lớp Teens Demo (E2E)'],
            [
                'cTeacher_id'  => $teacher->uId,
                'cDescription' => 'Lớp teens dùng cho seed + test luồng làm bài',
                'age_group'    => 'teens',
                'max_students' => 30,
                'cStatus'      => 'active',
            ]
        );

        // 3. Học viên teens
        $studentsData = [
            ['uPhone' => '0907770001', 'uName' => 'Teen An',  'uGender' => 1, 'uDoB' => '2010-03-12'],
            ['uPhone' => '0907770002', 'uName' => 'Teen Bình','uGender' => 0, 'uDoB' => '2009-07-05'],
            ['uPhone' => '0907770003', 'uName' => 'Teen Chi', 'uGender' => 0, 'uDoB' => '2011-01-20'],
        ];

        foreach ($studentsData as $s) {
            User::updateOrCreate(
                ['uPhone' => $s['uPhone']],
                [
                    'uName'      => $s['uName'],
                    'uPassword'  => Hash::make('password123'),
                    'uRole'      => 'student',
                    'uStatus'    => 'active',
                    'uGender'    => $s['uGender'],
                    'uDoB'       => $s['uDoB'],
                    'class_id'   => $class->cId,
                    'age_group'  => 'teens',
                ]
            );
        }

        // 4. Đề GENERAL (objective, mixed) — tránh age-gate (VSTEP/Cambridge YL)
        $exam = Exam::firstOrCreate(
            ['eTitle' => 'Teens English Test (E2E Demo)'],
            [
                'eDescription'      => 'Đề trắc nghiệm tổng hợp cho teens — grammar, vocabulary, reading',
                'eType'             => 'GENERAL',
                'eSkill'            => 'mixed',
                'ePurpose'          => 'exam',
                'eDifficulty'       => 'easy',
                'eTeacher_id'       => $teacher->uId,
                'eDuration_minutes' => 30,
                'eTotal_score'      => 100,
                'ePass_score'       => 50,
                'eIs_private'       => false,
                'eSource_type'      => 'manual',
                'eStatus'           => 'published',
                'age_group'         => 'teens',
            ]
        );

        // Chỉ seed câu hỏi nếu đề chưa có (idempotent)
        if ($exam->questions()->count() === 0) {
            $bank = $this->questionBank();
            foreach ($bank as $i => $q) {
                $question = Question::create([
                    'exam_id'        => $exam->eId,
                    'qContent'       => $q['content'],
                    'qType'          => 'multiple_choice',
                    'qSection'       => $q['section'],
                    'qSkill'         => $q['section'],
                    'qSection_order' => $i + 1,
                    'qPoints'        => 10,
                    'qDifficulty'    => 'easy',
                ]);

                // Insert options theo thứ tự — đáp án đúng nằm ở index $q['correct'] (0-based)
                foreach ($q['options'] as $idx => $optText) {
                    Answer::create([
                        'question_id' => $question->qId,
                        'aContent'    => $optText,
                        'aIs_correct' => $idx === $q['correct'],
                    ]);
                }
            }
            $this->command->info('   ✓ Created ' . count($bank) . ' objective questions');
        } else {
            $this->command->info('   ✓ Exam already has questions, skipping');
        }

        // 5. Assignment cho lớp teens
        TestAssignment::firstOrCreate(
            [
                'exam_id'       => $exam->eId,
                'taTarget_type' => 'class',
                'taTarget_id'   => $class->cId,
            ],
            [
                'taDeadline'   => now()->addDays(30),
                'taMax_attempt'=> 3,
                'taIs_public'  => true,
            ]
        );

        // ─────────────────────────────────────────────────────────────
        // 6. Đề ĐA DẠNG dạng câu hỏi — demo cho engine teens mới
        //    (trắc nghiệm, đúng/sai, điền từ, trả lời ngắn, nối cột, tự luận)
        // ─────────────────────────────────────────────────────────────
        $diverseExam = Exam::firstOrCreate(
            ['eTitle' => 'Teens English — Đa dạng dạng bài (Demo)'],
            [
                'eDescription'      => 'Đề tổng hợp nhiều dạng: trắc nghiệm, đúng/sai, điền từ, trả lời ngắn, nối cột, tự luận',
                'eType'             => 'GENERAL',
                'eSkill'            => 'mixed',
                'ePurpose'          => 'exam',
                'eDifficulty'       => 'medium',
                'eTeacher_id'       => $teacher->uId,
                'eDuration_minutes' => 25,
                'eTotal_score'      => 100,
                'ePass_score'       => 50,
                'eIs_private'       => false,
                'eSource_type'      => 'manual',
                'eStatus'           => 'published',
                'age_group'         => 'teens',
            ]
        );

        if ($diverseExam->questions()->count() === 0) {
            foreach ($this->diverseBank() as $i => $q) {
                $question = Question::create([
                    'exam_id'        => $diverseExam->eId,
                    'qContent'       => $q['content'],
                    'qType'          => $q['type'],
                    'qSection'       => $q['section'],
                    'qSkill'         => $q['section'],
                    'qSection_order' => $i + 1,
                    'qPoints'        => 10,
                    'qDifficulty'    => 'medium',
                    'qPassage_text'  => $q['passage'] ?? null,
                    'qData'          => $q['data'] ?? null,
                ]);

                if (!empty($q['options'])) {
                    // multiple_choice / true_false: đáp án đúng ở index $q['correct']
                    foreach ($q['options'] as $idx => $optText) {
                        Answer::create([
                            'question_id' => $question->qId,
                            'aContent'    => $optText,
                            'aIs_correct' => $idx === ($q['correct'] ?? -1),
                        ]);
                    }
                } elseif (isset($q['answer'])) {
                    // fill_blank / short_answer / matching: 1 đáp án đúng dạng text
                    Answer::create([
                        'question_id' => $question->qId,
                        'aContent'    => $q['answer'],
                        'aIs_correct' => true,
                    ]);
                }
                // essay: không tạo đáp án (giáo viên chấm tay)
            }
            $this->command->info('   ✓ Created ' . count($this->diverseBank()) . ' diverse-type questions');
        }

        TestAssignment::firstOrCreate(
            [
                'exam_id'       => $diverseExam->eId,
                'taTarget_type' => 'class',
                'taTarget_id'   => $class->cId,
            ],
            [
                'taDeadline'   => now()->addDays(30),
                'taMax_attempt'=> 3,
                'taIs_public'  => true,
            ]
        );

        $this->command->info('✅ TEENS seed done.');
        $this->command->info('   👩‍🏫 Teacher: 0905550001 / password123');
        $this->command->info('   🧑 Students: 0907770001 / 0907770002 / 0907770003 (pass: password123)');
        $this->command->info('   📝 Exam 1: "Teens English Test (E2E Demo)" (10 câu, mixed)');
        $this->command->info('   📝 Exam 2: "Teens English — Đa dạng dạng bài (Demo)" (đa dạng dạng câu)');
    }

    /**
     * 10 câu trắc nghiệm có đáp án đúng (index 0-based trong options).
     */
    private function questionBank(): array
    {
        return [
            ['section' => 'grammar', 'content' => 'She ___ to school every day.', 'options' => ['go', 'goes', 'going', 'gone'], 'correct' => 1],
            ['section' => 'grammar', 'content' => 'They ___ playing football now.', 'options' => ['is', 'am', 'are', 'be'], 'correct' => 2],
            ['section' => 'grammar', 'content' => 'I have lived here ___ 2010.', 'options' => ['since', 'for', 'in', 'at'], 'correct' => 0],
            ['section' => 'grammar', 'content' => 'If it rains, we ___ stay home.', 'options' => ['will', 'would', 'are', 'did'], 'correct' => 0],
            ['section' => 'vocabulary', 'content' => 'A person who teaches students is a ___.', 'options' => ['doctor', 'teacher', 'driver', 'farmer'], 'correct' => 1],
            ['section' => 'vocabulary', 'content' => 'The opposite of "happy" is ___.', 'options' => ['glad', 'sad', 'big', 'fast'], 'correct' => 1],
            ['section' => 'vocabulary', 'content' => 'We use an ___ to see in the dark.', 'options' => ['umbrella', 'apple', 'lamp', 'orange'], 'correct' => 2],
            ['section' => 'reading', 'content' => 'Tom likes apples. What does Tom like? ->', 'options' => ['Oranges', 'Apples', 'Bananas', 'Grapes'], 'correct' => 1],
            ['section' => 'reading', 'content' => 'The cat is on the table. Where is the cat? ->', 'options' => ['Under the table', 'On the table', 'In the box', 'On the chair'], 'correct' => 1],
            ['section' => 'reading', 'content' => 'It is sunny today. How is the weather? ->', 'options' => ['Rainy', 'Snowy', 'Sunny', 'Windy'], 'correct' => 2],
        ];
    }

    /**
     * Ngân hàng câu hỏi ĐA DẠNG dạng — demo cho engine teens.
     * Mỗi câu khai báo 'type' + dữ liệu phù hợp:
     *  - options + correct (index)  → multiple_choice / true_false
     *  - answer (text)              → fill_blank / short_answer / matching
     *  - data (left/right)          → matching
     *  - passage                    → đoạn đọc kèm theo
     *  - essay                      → không có đáp án (chấm tay)
     */
    private function diverseBank(): array
    {
        return [
            [
                'type' => 'multiple_choice', 'section' => 'grammar',
                'content' => 'Choose the correct word: She ___ TV every evening.',
                'options' => ['watch', 'watches', 'watching', 'watched'], 'correct' => 1,
            ],
            [
                'type' => 'multiple_choice', 'section' => 'vocabulary',
                'content' => 'Which word has a similar meaning to "happy"?',
                'options' => ['glad', 'sad', 'angry', 'tired'], 'correct' => 0,
            ],
            [
                'type' => 'true_false', 'section' => 'grammar',
                'content' => 'Is this sentence correct? — "He don\'t like coffee."',
                'options' => ['True', 'False'], 'correct' => 1,
            ],
            [
                'type' => 'fill_blank', 'section' => 'grammar',
                'content' => 'Fill in the blank: I have been waiting ___ two hours.',
                'answer' => 'for',
            ],
            [
                'type' => 'short_answer', 'section' => 'vocabulary',
                'content' => 'What is the past tense of the verb "go"?',
                'answer' => 'went',
            ],
            [
                'type' => 'matching', 'section' => 'vocabulary',
                'content' => 'Match each English word with its Vietnamese meaning.',
                'data' => ['left' => ['Happy', 'Big', 'Fast'], 'right' => ['Vui', 'To', 'Nhanh']],
                'answer' => '1-a,2-b,3-c',
            ],
            [
                'type' => 'multiple_choice', 'section' => 'reading',
                'content' => 'Read the passage. What does Tom do after school?',
                'passage' => 'Tom is a student. Every day after school, he plays football with his friends in the park. He loves sports very much.',
                'options' => ['He reads books', 'He plays football', 'He watches TV', 'He sleeps'], 'correct' => 1,
            ],
            [
                'type' => 'essay', 'section' => 'writing',
                'content' => 'Write 2-3 sentences about your favourite hobby.',
            ],
        ];
    }
}
