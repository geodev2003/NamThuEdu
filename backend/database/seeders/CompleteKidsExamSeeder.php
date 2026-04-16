<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CompleteKidsExamSeeder extends Seeder
{
    /**
     * Seed đầy đủ 24 task types cho Cambridge YLE
     * Mỗi task type sẽ có ít nhất 1 đề thi với câu hỏi đầy đủ
     */
    public function run(): void
    {
        // Get teacher ID (use teacher with ID 3, or first available teacher)
        $teacherId = DB::table('users')->where('uRole', 'teacher')->value('uId') ?? 3;
        
        // Get kids exam type IDs (not exam_types)
        $startersId = DB::table('kids_exam_types')->where('code', 'yle_starters')->value('id');
        $moversId = DB::table('kids_exam_types')->where('code', 'yle_movers')->value('id');
        $flyersId = DB::table('kids_exam_types')->where('code', 'yle_flyers')->value('id');

        // Get task type IDs
        $taskTypes = DB::table('kids_task_definitions')->pluck('id', 'code')->toArray();

        $now = Carbon::now();

        // ============================================
        // EXAM 1: STARTERS - LISTENING TASKS (Part 1-4)
        // ============================================
        $exam1Id = DB::table('exams')->insertGetId([
            'eTitle' => 'YLE Starters - Listening Complete Test',
            'eDescription' => 'Đề thi đầy đủ các dạng Listening cho Starters',
            'kids_exam_config' => json_encode(['kids_exam_type_id' => $startersId]),
            'age_group' => 'kids',
            'eSkill' => 'listening',
            'eDuration_minutes' => 20,
            'eTotal_score' => 20,
            'ePass_score' => 10,
            'eTeacher_id' => $teacherId,
            'eStatus' => 'published',
            'eCreated_at' => $now,
        ]);

        // Part 1: Listen and Draw Lines (5 questions)
        $this->createListenDrawLinesQuestions($exam1Id, $taskTypes['listen_and_draw_lines'], 1, 1);

        // Part 2: Listen and Write (5 questions)
        $this->createListenWriteQuestions($exam1Id, $taskTypes['listen_and_write'], 1, 2);

        // Part 3: Listen and Tick (5 questions)
        $this->createListenTickQuestions($exam1Id, $taskTypes['listen_and_tick'], 1, 3);

        // Part 4: Listen Colour Write (5 questions)
        $this->createListenColourQuestions($exam1Id, $taskTypes['listen_colour_write'], 1, 4);

        // ============================================
        // EXAM 2: STARTERS - READING & WRITING (Part 1-5)
        // ============================================
        $exam2Id = DB::table('exams')->insertGetId([
            'eTitle' => 'YLE Starters - Reading & Writing Complete Test',
            'eDescription' => 'Đề thi đầy đủ các dạng Reading & Writing cho Starters',
            'kids_exam_config' => json_encode(['kids_exam_type_id' => $startersId]),
            'age_group' => 'kids',
            'eSkill' => 'reading',
            'eDuration_minutes' => 20,
            'eTotal_score' => 25,
            'ePass_score' => 13,
            'eTeacher_id' => $teacherId,
            'eStatus' => 'published',
            'eCreated_at' => $now,
        ]);

        // Part 1: Look and Read (5 questions)
        $this->createLookReadQuestions($exam2Id, $taskTypes['look_and_read'], 1, 1);

        // Part 2: Look, Read and Write (5 questions)
        $this->createLookReadWriteQuestions($exam2Id, $taskTypes['look_read_write'], 1, 2);

        // Part 3: Unscramble Words (5 questions)
        $this->createUnscrambleWordsQuestions($exam2Id, $taskTypes['unscramble_words'], 1, 3);

        // Part 4: Word Bank Fill (5 questions)
        $this->createWordBankFillQuestions($exam2Id, $taskTypes['word_bank_fill'], 1, 4);

        // Part 5: Cloze Test (5 questions)
        $this->createClozeTestQuestions($exam2Id, $taskTypes['cloze_test'], 1, 5);

        // ============================================
        // EXAM 3: STARTERS - SPEAKING (Part 1-4)
        // ============================================
        $exam3Id = DB::table('exams')->insertGetId([
            'eTitle' => 'YLE Starters - Speaking Complete Test',
            'eDescription' => 'Đề thi đầy đủ các dạng Speaking cho Starters',
            'kids_exam_config' => json_encode(['kids_exam_type_id' => $startersId]),
            'age_group' => 'kids',
            'eSkill' => 'speaking',
            'eDuration_minutes' => 5,
                        'eTotal_score' => 15,
            'ePass_score' => 8,
            'eTeacher_id' => $teacherId,
            'eStatus' => 'published',
            'eCreated_at' => $now,
        ]);

        // Part 1: Object Placement (5 questions)
        $this->createObjectPlacementQuestions($exam3Id, $taskTypes['object_placement'], 1, 1);

        // Part 2: Picture Questions (5 questions)
        $this->createPictureQuestionsQuestions($exam3Id, $taskTypes['picture_questions'], 1, 2);

        // Part 3: Picture Card Questions (5 questions)
        $this->createPictureCardQuestions($exam3Id, $taskTypes['picture_card_questions'], 1, 3);

        // ============================================
        // EXAM 4: MOVERS - LISTENING (Part 1-5)
        // ============================================
        $exam4Id = DB::table('exams')->insertGetId([
            'eTitle' => 'YLE Movers - Listening Complete Test',
            'eDescription' => 'Đề thi đầy đủ các dạng Listening cho Movers',
            'kids_exam_config' => json_encode(['kids_exam_type_id' => $moversId]),
            'age_group' => 'kids',
            'eSkill' => 'listening',
            'eDuration_minutes' => 25,
                        'eTotal_score' => 25,
            'ePass_score' => 13,
            'eTeacher_id' => $teacherId,
            'eStatus' => 'published',
            'eCreated_at' => $now,
        ]);

        // Part 1: Listen and Draw Lines (5 questions)
        $this->createListenDrawLinesQuestions($exam4Id, $taskTypes['listen_and_draw_lines'], 2, 1);

        // Part 2: Listen and Write (6 questions)
        $this->createListenWriteQuestions($exam4Id, $taskTypes['listen_and_write'], 2, 2);

        // Part 3: Listening Letter Match (5 questions)
        $this->createListeningLetterMatchQuestions($exam4Id, $taskTypes['listening_letter_match'], 2, 3);

        // Part 4: Listen and Tick (5 questions)
        $this->createListenTickQuestions($exam4Id, $taskTypes['listen_and_tick'], 2, 4);

        // Part 5: Listen Colour (4 questions)
        $this->createListenColourQuestions($exam4Id, $taskTypes['listen_colour_write'], 2, 5);

        // ============================================
        // EXAM 5: MOVERS - READING & WRITING (Part 1-6)
        // ============================================
        $exam5Id = DB::table('exams')->insertGetId([
            'eTitle' => 'YLE Movers - Reading & Writing Complete Test',
            'eDescription' => 'Đề thi đầy đủ các dạng Reading & Writing cho Movers',
            'kids_exam_config' => json_encode(['kids_exam_type_id' => $moversId]),
            'age_group' => 'kids',
            'eSkill' => 'reading',
            'eDuration_minutes' => 30,
                        'eTotal_score' => 35,
            'ePass_score' => 18,
            'eTeacher_id' => $teacherId,
            'eStatus' => 'published',
            'eCreated_at' => $now,
        ]);

        // Part 1: Word Definition Matching (5 questions)
        $this->createWordDefinitionMatchingQuestions($exam5Id, $taskTypes['word_definition_matching'], 2, 1);

        // Part 2: Dialogue Matching (6 questions)
        $this->createDialogueMatchingQuestions($exam5Id, $taskTypes['dialogue_matching'], 2, 2);

        // Part 3: Story Completion (6 questions)
        $this->createStoryCompletionQuestions($exam5Id, $taskTypes['story_completion'], 2, 3);

        // Part 4: Cloze Test (7 questions)
        $this->createClozeTestQuestions($exam5Id, $taskTypes['cloze_test'], 2, 4);

        // Part 5: Look, Read and Write (6 questions)
        $this->createLookReadWriteQuestions($exam5Id, $taskTypes['look_read_write'], 2, 5);

        // Part 6: Picture Sentence Writing (5 questions)
        $this->createPictureSentenceWritingQuestions($exam5Id, $taskTypes['picture_sentence_writing'], 2, 6);

        // ============================================
        // EXAM 6: MOVERS - SPEAKING (Part 1-4)
        // ============================================
        $exam6Id = DB::table('exams')->insertGetId([
            'eTitle' => 'YLE Movers - Speaking Complete Test',
            'eDescription' => 'Đề thi đầy đủ các dạng Speaking cho Movers',
            'kids_exam_config' => json_encode(['kids_exam_type_id' => $moversId]),
            'age_group' => 'kids',
            'eSkill' => 'speaking',
            'eDuration_minutes' => 7,
                        'eTotal_score' => 12,
            'ePass_score' => 6,
            'eTeacher_id' => $teacherId,
            'eStatus' => 'published',
            'eCreated_at' => $now,
        ]);

        // Part 1: Find Differences (4 questions)
        $this->createFindDifferencesQuestions($exam6Id, $taskTypes['find_differences'], 2, 1);

        // Part 2: Picture Story Narration (4 questions)
        $this->createPictureStoryNarrationQuestions($exam6Id, $taskTypes['picture_story_narration'], 2, 2);

        // Part 3: Odd One Out (4 questions)
        $this->createOddOneOutQuestions($exam6Id, $taskTypes['odd_one_out'], 2, 3);

        // ============================================
        // EXAM 7: FLYERS - LISTENING (Part 1-5)
        // ============================================
        $exam7Id = DB::table('exams')->insertGetId([
            'eTitle' => 'YLE Flyers - Listening Complete Test',
            'eDescription' => 'Đề thi đầy đủ các dạng Listening cho Flyers',
            'kids_exam_config' => json_encode(['kids_exam_type_id' => $flyersId]),
            'age_group' => 'kids',
            'eSkill' => 'listening',
            'eDuration_minutes' => 25,
                        'eTotal_score' => 25,
            'ePass_score' => 13,
            'eTeacher_id' => $teacherId,
            'eStatus' => 'published',
            'eCreated_at' => $now,
        ]);

        // Part 1: Listening Letter Match (5 questions)
        $this->createListeningLetterMatchQuestions($exam7Id, $taskTypes['listening_letter_match'], 3, 1);

        // Part 2: Listen and Write (5 questions)
        $this->createListenWriteQuestions($exam7Id, $taskTypes['listen_and_write'], 3, 2);

        // Part 3: Listen and Tick (5 questions)
        $this->createListenTickQuestions($exam7Id, $taskTypes['listen_and_tick'], 3, 3);

        // Part 4: Listen Colour (5 questions)
        $this->createListenColourQuestions($exam7Id, $taskTypes['listen_colour_write'], 3, 4);

        // Part 5: Listen and Draw Lines (5 questions)
        $this->createListenDrawLinesQuestions($exam7Id, $taskTypes['listen_and_draw_lines'], 3, 5);

        // ============================================
        // EXAM 8: FLYERS - READING & WRITING (Part 1-7)
        // ============================================
        $exam8Id = DB::table('exams')->insertGetId([
            'eTitle' => 'YLE Flyers - Reading & Writing Complete Test',
            'eDescription' => 'Đề thi đầy đủ các dạng Reading & Writing cho Flyers',
            'kids_exam_config' => json_encode(['kids_exam_type_id' => $flyersId]),
            'age_group' => 'kids',
            'eSkill' => 'reading',
            'eDuration_minutes' => 40,
                        'eTotal_score' => 44,
            'ePass_score' => 22,
            'eTeacher_id' => $teacherId,
            'eStatus' => 'published',
            'eCreated_at' => $now,
        ]);

        // Part 1: Word Definition Matching (7 questions)
        $this->createWordDefinitionMatchingQuestions($exam8Id, $taskTypes['word_definition_matching'], 3, 1);

        // Part 2: Dialogue Matching (7 questions)
        $this->createDialogueMatchingQuestions($exam8Id, $taskTypes['dialogue_matching'], 3, 2);

        // Part 3: Reading Comprehension (7 questions)
        $this->createReadingComprehensionQuestions($exam8Id, $taskTypes['reading_comprehension'], 3, 3);

        // Part 4: Cloze Test (7 questions)
        $this->createClozeTestQuestions($exam8Id, $taskTypes['cloze_test'], 3, 4);

        // Part 5: Open Cloze (6 questions)
        $this->createOpenClozeQuestions($exam8Id, $taskTypes['open_cloze'], 3, 5);

        // Part 6: Look, Read and Write (5 questions)
        $this->createLookReadWriteQuestions($exam8Id, $taskTypes['look_read_write'], 3, 6);

        // Part 7: Picture Story Writing (5 questions)
        $this->createPictureStoryWritingQuestions($exam8Id, $taskTypes['picture_story_writing'], 3, 7);

        // ============================================
        // EXAM 9: FLYERS - SPEAKING (Part 1-4)
        // ============================================
        $exam9Id = DB::table('exams')->insertGetId([
            'eTitle' => 'YLE Flyers - Speaking Complete Test',
            'eDescription' => 'Đề thi đầy đủ các dạng Speaking cho Flyers',
            'kids_exam_config' => json_encode(['kids_exam_type_id' => $flyersId]),
            'age_group' => 'kids',
            'eSkill' => 'speaking',
            'eDuration_minutes' => 10,
                        'eTotal_score' => 15,
            'ePass_score' => 8,
            'eTeacher_id' => $teacherId,
            'eStatus' => 'published',
            'eCreated_at' => $now,
        ]);

        // Part 1: Find Differences (5 questions)
        $this->createFindDifferencesQuestions($exam9Id, $taskTypes['find_differences'], 3, 1);

        // Part 2: Picture Story Narration (5 questions)
        $this->createPictureStoryNarrationQuestions($exam9Id, $taskTypes['picture_story_narration'], 3, 2);

        // Part 3: Information Exchange (5 questions)
        $this->createInformationExchangeQuestions($exam9Id, $taskTypes['information_exchange'], 3, 3);

        echo "✅ Created 9 complete exams covering all 24 task types!\n";
    }

    // ============================================
    // HELPER METHODS - LISTENING TASKS
    // ============================================
    
    private function createListenDrawLinesQuestions($examId, $taskTypeId, $level, $part)
    {
        $questionData = json_encode([
            'audio_url' => 'https://example.com/audio/listen-draw-lines.mp3',
            'base_image_url' => 'https://example.com/images/classroom.jpg',
            'items' => [
                ['name' => 'Tom', 'person_id' => 'A'],
                ['name' => 'Lucy', 'person_id' => 'B'],
                ['name' => 'Ben', 'person_id' => 'C'],
                ['name' => 'Emma', 'person_id' => 'D'],
                ['name' => 'Jack', 'person_id' => 'E'],
            ]
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => 5,
            'qCreated_at' => now(),
        ]);
    }

    private function createListenWriteQuestions($examId, $taskTypeId, $level, $part)
    {
        $count = $level == 1 ? 5 : 6;
        $questionData = json_encode([
            'audio_url' => 'https://example.com/audio/listen-write.mp3',
            'form_fields' => array_map(function($i) {
                return [
                    'label' => 'Question ' . $i,
                    'answer_type' => $i % 2 == 0 ? 'text' : 'number',
                    'correct_answer' => $i % 2 == 0 ? 'Smith' : '10'
                ];
            }, range(1, $count))
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => $count,
            'qCreated_at' => now(),
        ]);
    }

    private function createListenTickQuestions($examId, $taskTypeId, $level, $part)
    {
        $questionData = json_encode([
            'audio_url' => 'https://example.com/audio/listen-tick.mp3',
            'questions' => [
                [
                    'question' => 'What is Tom doing?',
                    'options' => [
                        ['id' => 'A', 'image_url' => 'https://example.com/images/reading.jpg'],
                        ['id' => 'B', 'image_url' => 'https://example.com/images/playing.jpg'],
                        ['id' => 'C', 'image_url' => 'https://example.com/images/sleeping.jpg'],
                    ],
                    'correct_answer' => 'B'
                ],
                [
                    'question' => 'Where is the cat?',
                    'options' => [
                        ['id' => 'A', 'image_url' => 'https://example.com/images/table.jpg'],
                        ['id' => 'B', 'image_url' => 'https://example.com/images/chair.jpg'],
                        ['id' => 'C', 'image_url' => 'https://example.com/images/bed.jpg'],
                    ],
                    'correct_answer' => 'A'
                ],
                [
                    'question' => 'What is the weather?',
                    'options' => [
                        ['id' => 'A', 'image_url' => 'https://example.com/images/sunny.jpg'],
                        ['id' => 'B', 'image_url' => 'https://example.com/images/rainy.jpg'],
                        ['id' => 'C', 'image_url' => 'https://example.com/images/cloudy.jpg'],
                    ],
                    'correct_answer' => 'C'
                ],
                [
                    'question' => 'What color is the ball?',
                    'options' => [
                        ['id' => 'A', 'image_url' => 'https://example.com/images/red-ball.jpg'],
                        ['id' => 'B', 'image_url' => 'https://example.com/images/blue-ball.jpg'],
                        ['id' => 'C', 'image_url' => 'https://example.com/images/green-ball.jpg'],
                    ],
                    'correct_answer' => 'A'
                ],
                [
                    'question' => 'How many apples?',
                    'options' => [
                        ['id' => 'A', 'image_url' => 'https://example.com/images/3-apples.jpg'],
                        ['id' => 'B', 'image_url' => 'https://example.com/images/5-apples.jpg'],
                        ['id' => 'C', 'image_url' => 'https://example.com/images/7-apples.jpg'],
                    ],
                    'correct_answer' => 'B'
                ],
            ]
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => 5,
            'qCreated_at' => now(),
        ]);
    }

    private function createListenColourQuestions($examId, $taskTypeId, $level, $part)
    {
        $count = $level == 2 ? 4 : 5;
        $questionData = json_encode([
            'audio_url' => 'https://example.com/audio/listen-colour.mp3',
            'base_image_url' => 'https://example.com/images/garden.jpg',
            'tasks' => array_map(function($i) {
                $objects = ['tree', 'flower', 'house', 'car', 'bird'];
                $colours = ['red', 'blue', 'green', 'yellow', 'orange'];
                return [
                    'object' => $objects[$i - 1],
                    'colour' => $colours[$i - 1],
                    'position' => 'in the middle'
                ];
            }, range(1, $count))
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => $count,
            'qCreated_at' => now(),
        ]);
    }

    private function createListeningLetterMatchQuestions($examId, $taskTypeId, $level, $part)
    {
        $questionData = json_encode([
            'audio_url' => 'https://example.com/audio/letter-match.mp3',
            'left_items' => [
                ['name' => 'Tom', 'image_url' => 'https://example.com/images/tom.jpg'],
                ['name' => 'Lucy', 'image_url' => 'https://example.com/images/lucy.jpg'],
                ['name' => 'Ben', 'image_url' => 'https://example.com/images/ben.jpg'],
                ['name' => 'Emma', 'image_url' => 'https://example.com/images/emma.jpg'],
                ['name' => 'Jack', 'image_url' => 'https://example.com/images/jack.jpg'],
            ],
            'right_items' => [
                ['letter' => 'A', 'image_url' => 'https://example.com/images/swimming.jpg'],
                ['letter' => 'B', 'image_url' => 'https://example.com/images/reading.jpg'],
                ['letter' => 'C', 'image_url' => 'https://example.com/images/playing.jpg'],
                ['letter' => 'D', 'image_url' => 'https://example.com/images/sleeping.jpg'],
                ['letter' => 'E', 'image_url' => 'https://example.com/images/eating.jpg'],
                ['letter' => 'F', 'image_url' => 'https://example.com/images/running.jpg'],
                ['letter' => 'G', 'image_url' => 'https://example.com/images/dancing.jpg'],
            ],
            'correct_matches' => [
                ['left_id' => 'Tom', 'right_letter' => 'C'],
                ['left_id' => 'Lucy', 'right_letter' => 'A'],
                ['left_id' => 'Ben', 'right_letter' => 'B'],
                ['left_id' => 'Emma', 'right_letter' => 'F'],
                ['left_id' => 'Jack', 'right_letter' => 'E'],
            ]
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => 5,
            'qCreated_at' => now(),
        ]);
    }

    // ============================================
    // HELPER METHODS - READING & WRITING TASKS
    // ============================================

    private function createLookReadQuestions($examId, $taskTypeId, $level, $part)
    {
        $questionData = json_encode([
            'image_url' => 'https://example.com/images/park-scene.jpg',
            'statements' => [
                ['text' => 'There is a dog in the park.', 'correct_answer' => 'yes'],
                ['text' => 'The boy is swimming.', 'correct_answer' => 'no'],
                ['text' => 'There are three birds.', 'correct_answer' => 'yes'],
                ['text' => 'The girl has a red hat.', 'correct_answer' => 'no'],
                ['text' => 'The sun is shining.', 'correct_answer' => 'yes'],
            ]
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => 5,
            'qCreated_at' => now(),
        ]);
    }

    private function createLookReadWriteQuestions($examId, $taskTypeId, $level, $part)
    {
        $count = $level == 1 ? 5 : ($level == 2 ? 6 : 5);
        $questionData = json_encode([
            'shared_image_url' => 'https://example.com/images/bedroom.jpg',
            'questions' => array_map(function($i) {
                $questions = [
                    ['question' => 'What color is the bed?', 'correct_answer' => 'blue'],
                    ['question' => 'How many toys are there?', 'correct_answer' => 'five'],
                    ['question' => 'Where is the cat?', 'correct_answer' => 'chair'],
                    ['question' => 'What is on the table?', 'correct_answer' => 'book'],
                    ['question' => 'Is the window open?', 'correct_answer' => 'yes'],
                    ['question' => 'What time is it?', 'correct_answer' => 'three'],
                ];
                return $questions[$i - 1];
            }, range(1, $count))
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => $count,
            'qCreated_at' => now(),
        ]);
    }

    private function createUnscrambleWordsQuestions($examId, $taskTypeId, $level, $part)
    {
        $questionData = json_encode([
            'items' => [
                ['image_url' => 'https://example.com/images/cat.jpg', 'scrambled_word' => 'tac', 'correct_answer' => 'cat'],
                ['image_url' => 'https://example.com/images/dog.jpg', 'scrambled_word' => 'god', 'correct_answer' => 'dog'],
                ['image_url' => 'https://example.com/images/book.jpg', 'scrambled_word' => 'koob', 'correct_answer' => 'book'],
                ['image_url' => 'https://example.com/images/ball.jpg', 'scrambled_word' => 'lalb', 'correct_answer' => 'ball'],
                ['image_url' => 'https://example.com/images/tree.jpg', 'scrambled_word' => 'eetr', 'correct_answer' => 'tree'],
            ]
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => 5,
            'qCreated_at' => now(),
        ]);
    }

    private function createWordBankFillQuestions($examId, $taskTypeId, $level, $part)
    {
        $questionData = json_encode([
            'text' => 'My name is Tom. I live in a big __1__. I have a __2__ and a __3__. Every day I go to __4__ and play with my __5__.',
            'word_bank' => ['house', 'cat', 'dog', 'school', 'friends', 'car', 'book'],
            'gaps' => [
                ['gap_number' => 1, 'correct_word' => 'house'],
                ['gap_number' => 2, 'correct_word' => 'cat'],
                ['gap_number' => 3, 'correct_word' => 'dog'],
                ['gap_number' => 4, 'correct_word' => 'school'],
                ['gap_number' => 5, 'correct_word' => 'friends'],
            ]
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => 5,
            'qCreated_at' => now(),
        ]);
    }

    private function createClozeTestQuestions($examId, $taskTypeId, $level, $part)
    {
        $count = $level == 1 ? 5 : 7;
        $text = $level == 1 
            ? 'Tom __1__ a cat. The cat __2__ black and white. Tom __3__ his cat every day. The cat __4__ to play. Tom and his cat __5__ happy.'
            : 'Yesterday, I __1__ to the park with my family. We __2__ a picnic. My brother __3__ football. My sister __4__ a book. I __5__ my bike. We __6__ ice cream. It __7__ a great day!';
        
        $gaps = $level == 1 
            ? [
                ['gap_id' => 1, 'options' => ['has', 'have', 'had'], 'correct_answer' => 'has'],
                ['gap_id' => 2, 'options' => ['is', 'are', 'am'], 'correct_answer' => 'is'],
                ['gap_id' => 3, 'options' => ['feed', 'feeds', 'feeding'], 'correct_answer' => 'feeds'],
                ['gap_id' => 4, 'options' => ['like', 'likes', 'liked'], 'correct_answer' => 'likes'],
                ['gap_id' => 5, 'options' => ['is', 'are', 'am'], 'correct_answer' => 'are'],
            ]
            : [
                ['gap_id' => 1, 'options' => ['go', 'went', 'going'], 'correct_answer' => 'went'],
                ['gap_id' => 2, 'options' => ['have', 'has', 'had'], 'correct_answer' => 'had'],
                ['gap_id' => 3, 'options' => ['play', 'played', 'plays'], 'correct_answer' => 'played'],
                ['gap_id' => 4, 'options' => ['read', 'reads', 'reading'], 'correct_answer' => 'read'],
                ['gap_id' => 5, 'options' => ['ride', 'rode', 'riding'], 'correct_answer' => 'rode'],
                ['gap_id' => 6, 'options' => ['eat', 'ate', 'eating'], 'correct_answer' => 'ate'],
                ['gap_id' => 7, 'options' => ['is', 'was', 'were'], 'correct_answer' => 'was'],
            ];

        $questionData = json_encode([
            'text' => $text,
            'gaps' => $gaps
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => $count,
            'qCreated_at' => now(),
        ]);
    }

    private function createWordDefinitionMatchingQuestions($examId, $taskTypeId, $level, $part)
    {
        $count = $level == 2 ? 5 : 7;
        $words = [
            ['word' => 'library', 'definition' => 'A place where you can borrow books'],
            ['word' => 'bicycle', 'definition' => 'You ride this with two wheels'],
            ['word' => 'umbrella', 'definition' => 'You use this when it rains'],
            ['word' => 'hospital', 'definition' => 'A place where doctors work'],
            ['word' => 'restaurant', 'definition' => 'A place where you can eat food'],
            ['word' => 'museum', 'definition' => 'A place where you can see old things'],
            ['word' => 'airport', 'definition' => 'A place where planes take off'],
        ];

        $questionData = json_encode([
            'words' => array_slice($words, 0, $count)
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => $count,
            'qCreated_at' => now(),
        ]);
    }

    private function createDialogueMatchingQuestions($examId, $taskTypeId, $level, $part)
    {
        $count = $level == 2 ? 6 : 7;
        $dialogues = [
            [
                'question' => 'What\'s your name?',
                'options' => [
                    ['id' => 'A', 'text' => 'I\'m ten years old.'],
                    ['id' => 'B', 'text' => 'My name is Tom.'],
                    ['id' => 'C', 'text' => 'I live in London.'],
                ],
                'correct_answer' => 'B'
            ],
            [
                'question' => 'Where do you live?',
                'options' => [
                    ['id' => 'A', 'text' => 'I live in a big house.'],
                    ['id' => 'B', 'text' => 'I like pizza.'],
                    ['id' => 'C', 'text' => 'I have a dog.'],
                ],
                'correct_answer' => 'A'
            ],
            [
                'question' => 'What do you like doing?',
                'options' => [
                    ['id' => 'A', 'text' => 'I\'m reading a book.'],
                    ['id' => 'B', 'text' => 'I like playing football.'],
                    ['id' => 'C', 'text' => 'I went to the park.'],
                ],
                'correct_answer' => 'B'
            ],
            [
                'question' => 'How old are you?',
                'options' => [
                    ['id' => 'A', 'text' => 'I\'m fine, thank you.'],
                    ['id' => 'B', 'text' => 'I\'m eleven.'],
                    ['id' => 'C', 'text' => 'I\'m tall.'],
                ],
                'correct_answer' => 'B'
            ],
            [
                'question' => 'What\'s your favorite color?',
                'options' => [
                    ['id' => 'A', 'text' => 'I like blue.'],
                    ['id' => 'B', 'text' => 'I have a blue shirt.'],
                    ['id' => 'C', 'text' => 'The sky is blue.'],
                ],
                'correct_answer' => 'A'
            ],
            [
                'question' => 'Do you have any pets?',
                'options' => [
                    ['id' => 'A', 'text' => 'Yes, I like animals.'],
                    ['id' => 'B', 'text' => 'Yes, I have a cat.'],
                    ['id' => 'C', 'text' => 'No, I don\'t like cats.'],
                ],
                'correct_answer' => 'B'
            ],
            [
                'question' => 'What did you do yesterday?',
                'options' => [
                    ['id' => 'A', 'text' => 'I will go swimming.'],
                    ['id' => 'B', 'text' => 'I go to school.'],
                    ['id' => 'C', 'text' => 'I went to the cinema.'],
                ],
                'correct_answer' => 'C'
            ],
        ];

        $questionData = json_encode([
            'dialogues' => array_slice($dialogues, 0, $count)
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => $count,
            'qCreated_at' => now(),
        ]);
    }

    private function createStoryCompletionQuestions($examId, $taskTypeId, $level, $part)
    {
        $questionData = json_encode([
            'story_text' => 'Last Saturday, Tom went to the beach with his family. They played in the sand and swam in the sea. Tom found a beautiful shell. His sister built a big sandcastle. They had ice cream for lunch. It was a wonderful day!',
            'completion_sentences' => [
                ['text' => 'Tom went to the _____ with his family.', 'correct_answer' => 'beach', 'max_words' => 1],
                ['text' => 'They played in the _____ and swam in the sea.', 'correct_answer' => 'sand', 'max_words' => 1],
                ['text' => 'Tom found a beautiful _____.', 'correct_answer' => 'shell', 'max_words' => 1],
                ['text' => 'His sister built a big _____.', 'correct_answer' => 'sandcastle', 'max_words' => 1],
                ['text' => 'They had _____ for lunch.', 'correct_answer' => 'ice cream', 'max_words' => 2],
                ['text' => 'It was a _____ day!', 'correct_answer' => 'wonderful', 'max_words' => 1],
            ]
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => 6,
            'qCreated_at' => now(),
        ]);
    }

    private function createReadingComprehensionQuestions($examId, $taskTypeId, $level, $part)
    {
        $questionData = json_encode([
            'passage' => 'My name is Emma and I am ten years old. I live in a small town with my parents and my younger brother, Jack. Every morning, I wake up at seven o\'clock and have breakfast with my family. I usually eat cereal and drink orange juice. After breakfast, I walk to school with my friends. My favorite subject is art because I love drawing and painting. At lunchtime, I play with my friends in the playground. After school, I do my homework and then I help my mom in the kitchen. In the evening, I read books or watch TV. I go to bed at nine o\'clock.',
            'questions' => [
                ['question' => 'How old is Emma?', 'answer' => 'ten'],
                ['question' => 'Who does Emma live with?', 'answer' => 'her parents and brother'],
                ['question' => 'What time does Emma wake up?', 'answer' => 'seven o\'clock'],
                ['question' => 'What does Emma usually eat for breakfast?', 'answer' => 'cereal'],
                ['question' => 'What is Emma\'s favorite subject?', 'answer' => 'art'],
                ['question' => 'What does Emma do at lunchtime?', 'answer' => 'plays with friends'],
                ['question' => 'What time does Emma go to bed?', 'answer' => 'nine o\'clock'],
            ]
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => 7,
            'qCreated_at' => now(),
        ]);
    }

    private function createOpenClozeQuestions($examId, $taskTypeId, $level, $part)
    {
        $questionData = json_encode([
            'text' => 'Last summer, my family __1__ on holiday to Spain. We __2__ there by plane. The weather __3__ very hot and sunny. We stayed __4__ a hotel near the beach. Every day, we __5__ swimming in the sea. __6__ the evenings, we ate delicious food at restaurants.',
            'gaps' => [
                ['gap_id' => 1, 'correct_answers' => ['went', 'traveled']],
                ['gap_id' => 2, 'correct_answers' => ['went', 'traveled', 'flew']],
                ['gap_id' => 3, 'correct_answers' => ['was']],
                ['gap_id' => 4, 'correct_answers' => ['in', 'at']],
                ['gap_id' => 5, 'correct_answers' => ['went', 'were']],
                ['gap_id' => 6, 'correct_answers' => ['In', 'During']],
            ]
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => 6,
            'qCreated_at' => now(),
        ]);
    }

    private function createPictureSentenceWritingQuestions($examId, $taskTypeId, $level, $part)
    {
        $questionData = json_encode([
            'items' => [
                [
                    'image_url' => 'https://example.com/images/boy-playing-football.jpg',
                    'prompt' => 'What is the boy doing?',
                    'sample_answers' => ['The boy is playing football.', 'He is kicking a ball.']
                ],
                [
                    'image_url' => 'https://example.com/images/girl-reading-book.jpg',
                    'prompt' => 'What is the girl doing?',
                    'sample_answers' => ['The girl is reading a book.', 'She is reading.']
                ],
                [
                    'image_url' => 'https://example.com/images/cat-sleeping.jpg',
                    'prompt' => 'What is the cat doing?',
                    'sample_answers' => ['The cat is sleeping.', 'It is sleeping on the sofa.']
                ],
                [
                    'image_url' => 'https://example.com/images/children-swimming.jpg',
                    'prompt' => 'What are the children doing?',
                    'sample_answers' => ['The children are swimming.', 'They are swimming in the pool.']
                ],
                [
                    'image_url' => 'https://example.com/images/family-eating.jpg',
                    'prompt' => 'What is the family doing?',
                    'sample_answers' => ['The family is eating dinner.', 'They are having a meal together.']
                ],
            ]
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => 5,
            'qCreated_at' => now(),
        ]);
    }

    private function createPictureStoryWritingQuestions($examId, $taskTypeId, $level, $part)
    {
        $questionData = json_encode([
            'images' => [
                'https://example.com/images/story1-boy-wakes-up.jpg',
                'https://example.com/images/story2-boy-breakfast.jpg',
                'https://example.com/images/story3-boy-school.jpg',
                'https://example.com/images/story4-boy-playing.jpg',
                'https://example.com/images/story5-boy-home.jpg',
            ],
            'min_words' => 20,
            'scoring_criteria' => [
                'content' => 3,
                'language' => 3,
                'organization' => 2
            ]
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => 5,
            'qCreated_at' => now(),
        ]);
    }

    // ============================================
    // HELPER METHODS - SPEAKING TASKS
    // ============================================

    private function createObjectPlacementQuestions($examId, $taskTypeId, $level, $part)
    {
        $questionData = json_encode([
            'base_image_url' => 'https://example.com/images/room-scene.jpg',
            'items' => [
                ['name' => 'ball', 'card_image_url' => 'https://example.com/images/ball-card.jpg', 'correct_position' => ['x' => 100, 'y' => 200]],
                ['name' => 'book', 'card_image_url' => 'https://example.com/images/book-card.jpg', 'correct_position' => ['x' => 150, 'y' => 180]],
                ['name' => 'cat', 'card_image_url' => 'https://example.com/images/cat-card.jpg', 'correct_position' => ['x' => 200, 'y' => 250]],
                ['name' => 'toy', 'card_image_url' => 'https://example.com/images/toy-card.jpg', 'correct_position' => ['x' => 120, 'y' => 220]],
                ['name' => 'bag', 'card_image_url' => 'https://example.com/images/bag-card.jpg', 'correct_position' => ['x' => 180, 'y' => 190]],
            ]
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => 5,
            'qCreated_at' => now(),
        ]);
    }

    private function createPictureQuestionsQuestions($examId, $taskTypeId, $level, $part)
    {
        $questionData = json_encode([
            'questions' => [
                ['image_url' => 'https://example.com/images/dog.jpg', 'question' => 'What is this?', 'sample_answer' => 'It\'s a dog.'],
                ['image_url' => 'https://example.com/images/red-car.jpg', 'question' => 'What color is the car?', 'sample_answer' => 'It\'s red.'],
                ['image_url' => 'https://example.com/images/three-apples.jpg', 'question' => 'How many apples are there?', 'sample_answer' => 'There are three apples.'],
                ['image_url' => 'https://example.com/images/girl-happy.jpg', 'question' => 'Is the girl happy?', 'sample_answer' => 'Yes, she is happy.'],
                ['image_url' => 'https://example.com/images/big-house.jpg', 'question' => 'Is this a big house?', 'sample_answer' => 'Yes, it\'s a big house.'],
            ]
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => 5,
            'qCreated_at' => now(),
        ]);
    }

    private function createPictureCardQuestions($examId, $taskTypeId, $level, $part)
    {
        $questionData = json_encode([
            'cards' => [
                ['image_url' => 'https://example.com/images/card-banana.jpg', 'question' => 'Do you like bananas?', 'sample_answer' => 'Yes, I like bananas.'],
                ['image_url' => 'https://example.com/images/card-swimming.jpg', 'question' => 'Can you swim?', 'sample_answer' => 'Yes, I can swim.'],
                ['image_url' => 'https://example.com/images/card-school.jpg', 'question' => 'Do you go to school?', 'sample_answer' => 'Yes, I go to school every day.'],
                ['image_url' => 'https://example.com/images/card-cat.jpg', 'question' => 'Do you have a cat?', 'sample_answer' => 'Yes, I have a cat.'],
                ['image_url' => 'https://example.com/images/card-book.jpg', 'question' => 'Do you like reading?', 'sample_answer' => 'Yes, I like reading books.'],
            ]
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => 5,
            'qCreated_at' => now(),
        ]);
    }

    private function createFindDifferencesQuestions($examId, $taskTypeId, $level, $part)
    {
        $count = $level == 2 ? 4 : 5;
        $questionData = json_encode([
            'image_a_url' => 'https://example.com/images/picture-a.jpg',
            'image_b_url' => 'https://example.com/images/picture-b.jpg',
            'differences' => array_map(function($i) {
                $diffs = [
                    'The cat is black in picture A but white in picture B',
                    'There are 3 birds in picture A but 5 birds in picture B',
                    'The boy is wearing a red shirt in picture A but a blue shirt in picture B',
                    'The tree is big in picture A but small in picture B',
                    'There is a ball in picture A but no ball in picture B',
                ];
                return $diffs[$i - 1];
            }, range(1, $count))
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => $count,
            'qCreated_at' => now(),
        ]);
    }

    private function createPictureStoryNarrationQuestions($examId, $taskTypeId, $level, $part)
    {
        $count = $level == 2 ? 4 : 5;
        $questionData = json_encode([
            'images' => array_map(function($i) {
                return 'https://example.com/images/story-' . $i . '.jpg';
            }, range(1, $count)),
            'prompts' => [
                'What can you see in the first picture?',
                'What happened next?',
                'What is happening in this picture?',
                'What do you think happened after that?',
                'How does the story end?',
            ]
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => $count,
            'qCreated_at' => now(),
        ]);
    }

    private function createOddOneOutQuestions($examId, $taskTypeId, $level, $part)
    {
        $questionData = json_encode([
            'images' => [
                ['id' => 1, 'url' => 'https://example.com/images/apple.jpg', 'category' => 'fruit'],
                ['id' => 2, 'url' => 'https://example.com/images/banana.jpg', 'category' => 'fruit'],
                ['id' => 3, 'url' => 'https://example.com/images/carrot.jpg', 'category' => 'vegetable'],
                ['id' => 4, 'url' => 'https://example.com/images/orange.jpg', 'category' => 'fruit'],
            ],
            'correct_odd_one' => 3
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => 4,
            'qCreated_at' => now(),
        ]);
    }

    private function createInformationExchangeQuestions($examId, $taskTypeId, $level, $part)
    {
        $questionData = json_encode([
            'student_card' => [
                'name' => '?',
                'age' => '?',
                'favorite_color' => '?',
                'hobby' => '?',
                'pet' => '?',
            ],
            'examiner_card' => [
                'name' => 'Emma',
                'age' => '10',
                'favorite_color' => 'blue',
                'hobby' => 'reading',
                'pet' => 'cat',
            ],
            'required_questions' => [
                'What is your name?',
                'How old are you?',
                'What is your favorite color?',
                'What do you like doing?',
                'Do you have a pet?',
            ]
        ]);

        DB::table('questions')->insert([
            'exam_id' => $examId,
            'qContent' => '',
            'qType' => 'kids_task',
            'kids_task_config' => json_encode(['task_type_id' => $taskTypeId]),
            'qPart' => $part,
            'qSubPart' => null,
            'qOrder' => 1,
            'qData' => $questionData,
            'qPoints' => 5,
            'qCreated_at' => now(),
        ]);
    }
}
