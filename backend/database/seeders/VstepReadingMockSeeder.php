<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Exam;
use App\Models\Question;
use Illuminate\Support\Facades\DB;

class VstepReadingMockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Tạo đề thi VSTEP Reading mock với passage "The Rise of Remote Work"
     * Format: Bên trái là đoạn văn, bên phải là 10 câu hỏi trắc nghiệm
     */
    public function run(): void
    {
        DB::beginTransaction();

        try {
            // Tạo đề thi VSTEP Reading
            $exam = Exam::create([
                'eTitle' => 'VSTEP Reading Practice - Remote Work',
                'eDescription' => 'Đề thi luyện tập VSTEP Reading với chủ đề "The Rise of Remote Work". Bao gồm 1 passage và 10 câu hỏi trắc nghiệm.',
                'eType' => 'VSTEP',
                'eSkill' => 'reading',
                'eDuration_minutes' => 20,
                'eTotal_score' => 10,
                'ePass_score' => 6,
                'eDifficulty' => 'medium',
                'eIs_private' => false,
                'eStatus' => 'published',
                'eTeacher_id' => 1, // Teacher ID
            ]);

            // Passage text
            $passage = "The Rise of Remote Work

The traditional office environment, once the standard for most professionals, is undergoing a dramatic transformation due to the rise of remote work. Driven by technological advancements, particularly high-speed internet and collaborative software, this shift allows employees to perform their duties outside of a conventional workplace. This change has profound implications for both businesses and the workforce.

For companies, remote work offers several distinct advantages. The most immediate is the potential for significant cost savings on office space, utilities, and maintenance. Furthermore, it expands the talent pool, enabling businesses to hire the best candidates regardless of their geographical location. Studies also suggest that remote employees are often more productive, partly due to reduced commute stress and the ability to tailor their work environment to their personal needs.

However, the transition is not without its challenges. Maintaining a strong company culture can be difficult when team members rarely interact face-to-face. Managers must adapt their leadership styles to monitor performance rather than physical presence. Security is also a major concern, as confidential company data is accessed over various home networks, requiring robust cybersecurity protocols.

For employees, the benefits include greater flexibility, a better work-life balance, and savings on travel and professional wardrobe. Yet, they also face potential pitfalls. Isolation and the blurring of lines between personal and professional life are common issues. Employees must be self-disciplined and skilled in time management to succeed in a remote setting. As remote work continues to grow, both employers and employees must find innovative ways to navigate this new professional landscape.";

            // Tạo 10 câu hỏi
            $questions = [
                [
                    'qContent' => 'What is the main reason for the rise of remote work mentioned in paragraph 1?',
                    'qOrder' => 1,
                    'answers' => [
                        ['text' => 'Decreased costs of office rent', 'isCorrect' => false],
                        ['text' => 'Technological advancements', 'isCorrect' => true],
                        ['text' => 'An increase in global travel', 'isCorrect' => false],
                        ['text' => 'A demand for more vacation time', 'isCorrect' => false],
                    ]
                ],
                [
                    'qContent' => 'The word "remote" in line 2 is closest in meaning to _________.',
                    'qOrder' => 2,
                    'answers' => [
                        ['text' => 'close', 'isCorrect' => false],
                        ['text' => 'far away', 'isCorrect' => true],
                        ['text' => 'temporary', 'isCorrect' => false],
                        ['text' => 'flexible', 'isCorrect' => false],
                    ]
                ],
                [
                    'qContent' => 'Which of the following is not listed as a direct advantage for companies?',
                    'qOrder' => 3,
                    'answers' => [
                        ['text' => 'Expanding the talent pool', 'isCorrect' => false],
                        ['text' => 'Lowering operational costs', 'isCorrect' => false],
                        ['text' => 'Increasing employee productivity', 'isCorrect' => false],
                        ['text' => 'Improving company culture', 'isCorrect' => true],
                    ]
                ],
                [
                    'qContent' => 'The word "Furthermore" in line 9 can best be replaced by _________.',
                    'qOrder' => 4,
                    'answers' => [
                        ['text' => 'Similarly', 'isCorrect' => false],
                        ['text' => 'Therefore', 'isCorrect' => false],
                        ['text' => 'In addition', 'isCorrect' => true],
                        ['text' => 'Conversely', 'isCorrect' => false],
                    ]
                ],
                [
                    'qContent' => 'What is a main challenge for managers in a remote work model?',
                    'qOrder' => 5,
                    'answers' => [
                        ['text' => 'Recruiting new staff', 'isCorrect' => false],
                        ['text' => 'Monitoring physical presence', 'isCorrect' => false],
                        ['text' => 'Developing new software', 'isCorrect' => false],
                        ['text' => 'Adapting to new leadership styles', 'isCorrect' => true],
                    ]
                ],
                [
                    'qContent' => 'The word "robust" in line 16 is closest in meaning to _________.',
                    'qOrder' => 6,
                    'answers' => [
                        ['text' => 'simple', 'isCorrect' => false],
                        ['text' => 'strong', 'isCorrect' => true],
                        ['text' => 'optional', 'isCorrect' => false],
                        ['text' => 'expensive', 'isCorrect' => false],
                    ]
                ],
                [
                    'qContent' => 'The phrase "blurring of lines" in line 20 refers to _________.',
                    'qOrder' => 7,
                    'answers' => [
                        ['text' => 'difficulty in seeing the computer screen', 'isCorrect' => false],
                        ['text' => 'the separation between work and life becoming less clear', 'isCorrect' => true],
                        ['text' => 'the inability to draw clearly on a whiteboard', 'isCorrect' => false],
                        ['text' => 'the distinction between different job roles', 'isCorrect' => false],
                    ]
                ],
                [
                    'qContent' => 'Which of the following is a potential pitfall for employees in remote work?',
                    'qOrder' => 8,
                    'answers' => [
                        ['text' => 'Reduced commute time', 'isCorrect' => false],
                        ['text' => 'Better work-life balance', 'isCorrect' => false],
                        ['text' => 'Isolation', 'isCorrect' => true],
                        ['text' => 'Cost savings', 'isCorrect' => false],
                    ]
                ],
                [
                    'qContent' => 'The main purpose of this passage is to _________.',
                    'qOrder' => 9,
                    'answers' => [
                        ['text' => 'encourage all companies to adopt remote work immediately', 'isCorrect' => false],
                        ['text' => 'describe the history of the traditional office', 'isCorrect' => false],
                        ['text' => 'discuss the benefits and challenges of the growing trend of remote work', 'isCorrect' => true],
                        ['text' => 'predict the future of work in the next decade', 'isCorrect' => false],
                    ]
                ],
                [
                    'qContent' => 'The word "they" in line 19 refers to _________.',
                    'qOrder' => 10,
                    'answers' => [
                        ['text' => 'the benefits', 'isCorrect' => false],
                        ['text' => 'employees', 'isCorrect' => true],
                        ['text' => 'savings', 'isCorrect' => false],
                        ['text' => 'pitfalls', 'isCorrect' => false],
                    ]
                ],
            ];

            // Tạo từng câu hỏi
            foreach ($questions as $questionData) {
                $question = Question::create([
                    'exam_id' => $exam->eId,
                    'qContent' => $questionData['qContent'],
                    'qType' => 'multiple_choice',
                    'qPoints' => 1,
                    'qOrder' => $questionData['qOrder'],
                    'qSkill' => 'reading',
                    'qPart' => 1, // Part 1 - Single passage
                    'qPassage_text' => $passage, // Tất cả câu hỏi đều có cùng passage
                    'qCorrect_answer' => null, // Will be set after creating answers
                ]);

                // Tạo 4 đáp án cho mỗi câu hỏi
                $correctAnswerId = null;
                foreach ($questionData['answers'] as $index => $answerData) {
                    $answerId = chr(65 + $index); // A, B, C, D
                    
                    $question->answers()->create([
                        'aContent' => $answerData['text'],
                        'aIs_correct' => $answerData['isCorrect'],
                    ]);

                    if ($answerData['isCorrect']) {
                        $correctAnswerId = $answerId;
                    }
                }

                // Update correct answer
                $question->update(['qCorrect_answer' => $correctAnswerId]);
            }

            DB::commit();

            $this->command->info('✅ Created VSTEP Reading mock exam successfully!');
            $this->command->info("📚 Exam ID: {$exam->eId}");
            $this->command->info("📖 Title: {$exam->eTitle}");
            $this->command->info("❓ Questions: 10");
            $this->command->info("⏱️  Duration: {$exam->eDuration_minutes} minutes");

        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('❌ Error creating VSTEP Reading mock exam: ' . $e->getMessage());
            throw $e;
        }
    }
}
