<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Exam;
use App\Models\Question;

class SampleKidsExamSeeder extends Seeder
{
    public function run(): void
    {
        // Get teacher ID
        $teacher = DB::table('users')->where('uRole', 'teacher')->first();
        
        if (!$teacher) {
            $this->command->error('No teacher found! Please create a teacher first.');
            return;
        }

        // 1. Create YLE Starters Exam
        $startersExam = Exam::create([
            'eTitle' => 'Cambridge YLE Starters - Sample Test',
            'eDescription' => 'Đề thi mẫu cho trẻ 6-8 tuổi',
            'eDuration' => 60,
            'age_group' => 'kids',
            'eTeacher_id' => $teacher->uId,
            'eStatus' => 'published',
            'kids_exam_config' => [
                'exam_type' => 'yle_starters',
                'level' => 'Pre A1',
                'age_range' => '6-8',
                'vocabulary_size' => 350,
                'skills' => ['listening', 'reading', 'writing'],
            ],
        ]);

        // Add questions to Starters
        $this->addStartersQuestions($startersExam->eId);

        // 2. Create YLE Movers Exam
        $moversExam = Exam::create([
            'eTitle' => 'Cambridge YLE Movers - Sample Test',
            'eDescription' => 'Đề thi mẫu cho trẻ 8-11 tuổi',
            'eDuration' => 75,
            'age_group' => 'kids',
            'eTeacher_id' => $teacher->uId,
            'eStatus' => 'published',
            'kids_exam_config' => [
                'exam_type' => 'yle_movers',
                'level' => 'A1',
                'age_range' => '8-11',
                'vocabulary_size' => 600,
                'skills' => ['listening', 'reading', 'writing'],
            ],
        ]);

        $this->addMoversQuestions($moversExam->eId);

        // 3. Create YLE Flyers Exam
        $flyersExam = Exam::create([
            'eTitle' => 'Cambridge YLE Flyers - Sample Test',
            'eDescription' => 'Đề thi mẫu cho trẻ 9-12 tuổi',
            'eDuration' => 90,
            'age_group' => 'kids',
            'eTeacher_id' => $teacher->uId,
            'eStatus' => 'published',
            'kids_exam_config' => [
                'exam_type' => 'yle_flyers',
                'level' => 'A2',
                'age_range' => '9-12',
                'vocabulary_size' => 900,
                'skills' => ['listening', 'reading', 'writing'],
            ],
        ]);

        $this->addFlyersQuestions($flyersExam->eId);

        $this->command->info('✓ Created 3 sample kids exams with questions');
    }

    private function addStartersQuestions($examId)
    {
        // Question 1: Listen and Draw Lines
        Question::create([
            'exam_id' => $examId,
            'qContent' => 'Listen and draw lines to match the names to the people',
            'qType' => 'matching_lines',
            'qPoints' => 5,
            'kids_task_config' => [
                'task_type' => 'listen_and_draw_lines',
                'task_name' => 'Listen and Draw Lines',
                'skill' => 'listening',
                'part_number' => 1,
                'instructions' => 'Nghe và nối tên với đúng người trong tranh',
                'task_data' => [
                    'audio_url' => '/audio/starters/part1.mp3',
                    'base_image_url' => '/images/starters/playground.jpg',
                    'items' => [
                        ['name' => 'Tom', 'person_id' => 'person_1', 'description' => 'boy with red shirt playing football'],
                        ['name' => 'Sarah', 'person_id' => 'person_2', 'description' => 'girl with yellow dress on swing'],
                        ['name' => 'Ben', 'person_id' => 'person_3', 'description' => 'boy with blue cap reading book'],
                        ['name' => 'Lucy', 'person_id' => 'person_4', 'description' => 'girl with pink bag eating ice cream'],
                        ['name' => 'Jack', 'person_id' => 'person_5', 'description' => 'boy with green t-shirt riding bike'],
                    ]
                ],
            ],
        ]);

        // Question 2: Listen and Write
        Question::create([
            'exam_id' => $examId,
            'qContent' => 'Listen and write names or numbers',
            'qType' => 'fill_blank',
            'qPoints' => 5,
            'kids_task_config' => [
                'task_type' => 'listen_and_write',
                'task_name' => 'Listen and Write',
                'skill' => 'listening',
                'part_number' => 2,
                'instructions' => 'Nghe và điền tên hoặc số vào chỗ trống',
                'task_data' => [
                    'audio_url' => '/audio/starters/part2.mp3',
                    'form_fields' => [
                        ['label' => 'First name:', 'answer_type' => 'text', 'correct_answer' => 'Emma'],
                        ['label' => 'Last name:', 'answer_type' => 'text', 'correct_answer' => 'Brown'],
                        ['label' => 'Age:', 'answer_type' => 'number', 'correct_answer' => '7'],
                        ['label' => 'Favorite color:', 'answer_type' => 'text', 'correct_answer' => 'blue'],
                        ['label' => 'Number of pets:', 'answer_type' => 'number', 'correct_answer' => '2'],
                    ]
                ],
            ],
        ]);

        // Question 3: Unscramble Words
        Question::create([
            'exam_id' => $examId,
            'qContent' => 'Look at the pictures and write the words',
            'qType' => 'fill_blank',
            'qPoints' => 5,
            'kids_task_config' => [
                'task_type' => 'unscramble_words',
                'task_name' => 'Unscramble Words',
                'skill' => 'writing',
                'part_number' => 3,
                'instructions' => 'Nhìn hình và sắp xếp chữ cái thành từ đúng',
                'task_data' => [
                    'items' => [
                        ['image_url' => '/images/animals/cat.jpg', 'scrambled_word' => 'tca', 'correct_answer' => 'cat'],
                        ['image_url' => '/images/animals/dog.jpg', 'scrambled_word' => 'ogd', 'correct_answer' => 'dog'],
                        ['image_url' => '/images/animals/bird.jpg', 'scrambled_word' => 'ribd', 'correct_answer' => 'bird'],
                        ['image_url' => '/images/animals/fish.jpg', 'scrambled_word' => 'hfis', 'correct_answer' => 'fish'],
                        ['image_url' => '/images/animals/frog.jpg', 'scrambled_word' => 'gorf', 'correct_answer' => 'frog'],
                    ]
                ],
            ],
        ]);

        // Question 4: Look and Read
        Question::create([
            'exam_id' => $examId,
            'qContent' => 'Look at the picture and read the sentences. Put a tick or cross',
            'qType' => 'true_false',
            'qPoints' => 5,
            'kids_task_config' => [
                'task_type' => 'look_and_read',
                'task_name' => 'Look and Read',
                'skill' => 'reading',
                'part_number' => 4,
                'instructions' => 'Nhìn tranh và đánh dấu đúng/sai',
                'task_data' => [
                    'image_url' => '/images/scenes/classroom.jpg',
                    'statements' => [
                        ['text' => 'There are three children in the classroom.', 'correct_answer' => 'yes'],
                        ['text' => 'The teacher is writing on the board.', 'correct_answer' => 'yes'],
                        ['text' => 'The cat is sleeping under the table.', 'correct_answer' => 'no'],
                        ['text' => 'There is a clock on the wall.', 'correct_answer' => 'yes'],
                        ['text' => 'The children are playing football.', 'correct_answer' => 'no'],
                    ]
                ],
            ],
        ]);
    }

    private function addMoversQuestions($examId)
    {
        // Question 1: Dialogue Matching
        Question::create([
            'exam_id' => $examId,
            'qContent' => 'Read the conversation and choose the best answer',
            'qType' => 'multiple_choice',
            'qPoints' => 6,
            'kids_task_config' => [
                'task_type' => 'dialogue_matching',
                'task_name' => 'Dialogue Matching',
                'skill' => 'reading',
                'part_number' => 2,
                'instructions' => 'Chọn câu trả lời phù hợp cho hội thoại',
                'task_data' => [
                    'dialogues' => [
                        [
                            'question' => 'Would you like some juice?',
                            'options' => [
                                ['id' => 'a', 'text' => 'I am 8 years old.'],
                                ['id' => 'b', 'text' => 'Yes, please.'],
                                ['id' => 'c', 'text' => 'It is Monday.'],
                            ],
                            'correct_answer' => 'b'
                        ],
                        [
                            'question' => 'What is your favorite sport?',
                            'options' => [
                                ['id' => 'a', 'text' => 'I like football.'],
                                ['id' => 'b', 'text' => 'It is sunny.'],
                                ['id' => 'c', 'text' => 'My name is Tom.'],
                            ],
                            'correct_answer' => 'a'
                        ],
                        [
                            'question' => 'Where did you go yesterday?',
                            'options' => [
                                ['id' => 'a', 'text' => 'I am fine, thank you.'],
                                ['id' => 'b', 'text' => 'I went to the park.'],
                                ['id' => 'c', 'text' => 'I have two brothers.'],
                            ],
                            'correct_answer' => 'b'
                        ],
                    ]
                ],
            ],
        ]);

        // Question 2: Story Completion
        Question::create([
            'exam_id' => $examId,
            'qContent' => 'Read the story and complete the sentences',
            'qType' => 'fill_blank',
            'qPoints' => 5,
            'kids_task_config' => [
                'task_type' => 'story_completion',
                'task_name' => 'Story Completion',
                'skill' => 'reading',
                'part_number' => 5,
                'instructions' => 'Đọc câu chuyện và hoàn thành câu',
                'task_data' => [
                    'story_text' => 'Last Saturday, Tom went to the zoo with his family. They saw many animals. Tom liked the elephants best because they were very big. His sister liked the monkeys because they were funny. They ate ice cream and had a great day.',
                    'completion_sentences' => [
                        ['text' => 'Tom went to the zoo on _______', 'correct_answer' => 'Saturday', 'max_words' => 1],
                        ['text' => 'Tom liked the _______ best', 'correct_answer' => 'elephants', 'max_words' => 1],
                        ['text' => 'His sister liked the monkeys because they were _______', 'correct_answer' => 'funny', 'max_words' => 1],
                        ['text' => 'They ate _______', 'correct_answer' => 'ice cream', 'max_words' => 2],
                    ]
                ],
            ],
        ]);
    }

    private function addFlyersQuestions($examId)
    {
        // Question 1: Open Cloze
        Question::create([
            'exam_id' => $examId,
            'qContent' => 'Read the text and write one word for each gap',
            'qType' => 'fill_blank',
            'qPoints' => 6,
            'kids_task_config' => [
                'task_type' => 'open_cloze',
                'task_name' => 'Open Cloze',
                'skill' => 'writing',
                'part_number' => 6,
                'instructions' => 'Tự điền 1 từ thích hợp vào chỗ trống',
                'task_data' => [
                    'text' => 'Yesterday I went ___1___ the cinema with my friend. We watched a film about animals. It ___2___ very interesting. After the film, we ___3___ to a café and had some juice. I ___4___ home at 5 o\'clock. It was ___5___ great day!',
                    'gaps' => [
                        ['gap_id' => 1, 'correct_answers' => ['to']],
                        ['gap_id' => 2, 'correct_answers' => ['was']],
                        ['gap_id' => 3, 'correct_answers' => ['went']],
                        ['gap_id' => 4, 'correct_answers' => ['went', 'came', 'got']],
                        ['gap_id' => 5, 'correct_answers' => ['a']],
                    ]
                ],
            ],
        ]);

        // Question 2: Picture Story Writing
        Question::create([
            'exam_id' => $examId,
            'qContent' => 'Look at the three pictures and write a story (at least 20 words)',
            'qType' => 'essay',
            'qPoints' => 8,
            'kids_task_config' => [
                'task_type' => 'picture_story_writing',
                'task_name' => 'Picture Story Writing',
                'skill' => 'writing',
                'part_number' => 7,
                'instructions' => 'Nhìn tranh và viết câu chuyện (tối thiểu 20 từ)',
                'task_data' => [
                    'images' => [
                        '/images/story/boy_finds_dog.jpg',
                        '/images/story/boy_takes_dog_home.jpg',
                        '/images/story/boy_plays_with_dog.jpg',
                    ],
                    'min_words' => 20,
                    'scoring_criteria' => [
                        'content' => 3,
                        'language' => 3,
                        'organization' => 2,
                    ],
                    'sample_answer' => 'One day, Tom found a small dog in the park. The dog looked hungry and sad. Tom took the dog home and gave it some food. Now Tom and the dog play together every day. They are best friends!'
                ],
            ],
        ]);
    }
}
