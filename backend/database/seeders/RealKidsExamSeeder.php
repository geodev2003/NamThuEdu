<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Exam;
use App\Models\Question;
use App\Models\User;

/**
 * Real Kids Exam Seeder
 * 
 * Creates complete Cambridge YLE sample exams with realistic content
 * Based on official Cambridge YLE test format (paraphrased for educational use)
 * 
 * Content is rephrased for compliance with licensing restrictions
 */
class RealKidsExamSeeder extends Seeder
{
    private $teacherId;

    public function run()
    {
        // Get first teacher or create one
        $this->teacherId = User::where('uRole', 'teacher')->first()->uId ?? 1;

        echo "🎓 Creating Real Cambridge YLE Sample Exams...\n\n";

        // Create complete exams
        $this->createStartersListeningExam();
        $this->createStartersReadingWritingExam();
        $this->createStartersSpeakingExam();

        echo "\n✅ Real Kids Exams Created Successfully!\n";
    }

    /**
     * YLE STARTERS - LISTENING TEST (4 parts, 20 questions)
     */
    private function createStartersListeningExam()
    {
        echo "📝 Creating Starters Listening Exam...\n";

        $exam = Exam::create([
            'eTitle' => 'Cambridge YLE Starters - Listening Test (Sample)',
            'eDescription' => 'Complete listening test with 4 parts and 20 questions. Duration: 20 minutes. Level: Pre A1 Starters',
            'eType' => 'GENERAL',
            'eSkill' => 'listening',
            'eTeacher_id' => $this->teacherId,
            'eDuration_minutes' => 20,
            'eIs_private' => false,
            'eSource_type' => 'manual',
            'eDifficulty' => 'easy',
            'age_group' => 'kids',
        ]);

        // PART 1: Listen and draw lines (5 questions)
        Question::create([
            'exam_id' => $exam->eId,
            'qContent' => 'Part 1: Listen and draw lines',
            'qPoints' => 5,
            'qType' => 'kids_task',
            'task_type_code' => 'listen_and_draw_lines',
            'part' => 1,
            'sub_part' => 1,
            'order_in_part' => 1,
            'order_in_exam' => 1,
            'task_data' => json_encode([
                'instructions' => 'Listen and draw a line from the name to the correct person in the picture.',
                'audio_url' => '/audio/starters/listening/part1.mp3',
                'image_url' => '/images/starters/listening/part1_scene.jpg',
                'names' => ['Tom', 'Lucy', 'Ben', 'Emma', 'Jack'],
                'people_in_image' => [
                    ['id' => 1, 'description' => 'boy playing football'],
                    ['id' => 2, 'description' => 'girl reading book'],
                    ['id' => 3, 'description' => 'boy riding bicycle'],
                    ['id' => 4, 'description' => 'girl eating ice cream'],
                    ['id' => 5, 'description' => 'boy flying kite'],
                ],
                'correct_matches' => [
                    'Tom' => 1,
                    'Lucy' => 2,
                    'Ben' => 3,
                    'Emma' => 4,
                    'Jack' => 5,
                ],
            ]),
        ]);

        // PART 2: Listen and write (5 questions)
        Question::create([
            'exam_id' => $exam->eId,
            'qContent' => 'Part 2: Listen and write a name or a number',
            'qPoints' => 5,
            'qType' => 'kids_task',
            'task_type_code' => 'listen_and_write',
            'part' => 1,
            'sub_part' => 2,
            'order_in_part' => 2,
            'order_in_exam' => 2,
            'task_data' => json_encode([
                'instructions' => 'Listen and write. There is one example.',
                'audio_url' => '/audio/starters/listening/part2.mp3',
                'context' => 'A girl is talking to a man at a pet shop.',
                'questions' => [
                    [
                        'question' => "What's the girl's name?",
                        'answer' => 'Sally',
                        'type' => 'name',
                    ],
                    [
                        'question' => 'How old is Sally?',
                        'answer' => '7',
                        'type' => 'number',
                    ],
                    [
                        'question' => "What's her favorite animal?",
                        'answer' => 'cat',
                        'type' => 'word',
                    ],
                    [
                        'question' => 'How many pets does she have?',
                        'answer' => '2',
                        'type' => 'number',
                    ],
                    [
                        'question' => "What's her pet's name?",
                        'answer' => 'Fluffy',
                        'type' => 'name',
                    ],
                ],
            ]),
        ]);

        // PART 3: Listen and tick the box (5 questions)
        Question::create([
            'exam_id' => $exam->eId,
            'qContent' => 'Part 3: Listen and tick (✓) the box',
            'qPoints' => 5,
            'qType' => 'kids_task',
            'task_type_code' => 'listen_and_tick',
            'part' => 1,
            'sub_part' => 3,
            'order_in_part' => 3,
            'order_in_exam' => 3,
            'task_data' => json_encode([
                'instructions' => 'Listen and tick the correct picture.',
                'audio_url' => '/audio/starters/listening/part3.mp3',
                'questions' => [
                    [
                        'question' => 'What did Tom eat for breakfast?',
                        'options' => [
                            ['id' => 'A', 'image' => '/images/food/bread.jpg', 'text' => 'bread'],
                            ['id' => 'B', 'image' => '/images/food/cereal.jpg', 'text' => 'cereal'],
                            ['id' => 'C', 'image' => '/images/food/eggs.jpg', 'text' => 'eggs'],
                        ],
                        'correct_answer' => 'B',
                    ],
                    [
                        'question' => 'What is Lucy wearing today?',
                        'options' => [
                            ['id' => 'A', 'image' => '/images/clothes/dress.jpg', 'text' => 'dress'],
                            ['id' => 'B', 'image' => '/images/clothes/jeans.jpg', 'text' => 'jeans'],
                            ['id' => 'C', 'image' => '/images/clothes/skirt.jpg', 'text' => 'skirt'],
                        ],
                        'correct_answer' => 'A',
                    ],
                    [
                        'question' => 'Which toy does Ben want?',
                        'options' => [
                            ['id' => 'A', 'image' => '/images/toys/car.jpg', 'text' => 'car'],
                            ['id' => 'B', 'image' => '/images/toys/ball.jpg', 'text' => 'ball'],
                            ['id' => 'C', 'image' => '/images/toys/robot.jpg', 'text' => 'robot'],
                        ],
                        'correct_answer' => 'C',
                    ],
                    [
                        'question' => 'What is the weather like?',
                        'options' => [
                            ['id' => 'A', 'image' => '/images/weather/sunny.jpg', 'text' => 'sunny'],
                            ['id' => 'B', 'image' => '/images/weather/rainy.jpg', 'text' => 'rainy'],
                            ['id' => 'C', 'image' => '/images/weather/cloudy.jpg', 'text' => 'cloudy'],
                        ],
                        'correct_answer' => 'A',
                    ],
                    [
                        'question' => 'Where is the cat?',
                        'options' => [
                            ['id' => 'A', 'image' => '/images/places/table.jpg', 'text' => 'on the table'],
                            ['id' => 'B', 'image' => '/images/places/chair.jpg', 'text' => 'under the chair'],
                            ['id' => 'C', 'image' => '/images/places/bed.jpg', 'text' => 'on the bed'],
                        ],
                        'correct_answer' => 'B',
                    ],
                ],
            ]),
        ]);

        // PART 4: Listen and colour (5 questions)
        Question::create([
            'exam_id' => $exam->eId,
            'qContent' => 'Part 4: Listen and colour',
            'qPoints' => 5,
            'qType' => 'kids_task',
            'task_type_code' => 'listen_and_colour',
            'part' => 1,
            'sub_part' => 4,
            'order_in_part' => 4,
            'order_in_exam' => 4,
            'task_data' => json_encode([
                'instructions' => 'Listen and colour the objects.',
                'audio_url' => '/audio/starters/listening/part4.mp3',
                'image_url' => '/images/starters/listening/part4_scene.jpg',
                'objects_to_colour' => [
                    ['object' => 'ball', 'position' => 'next to the tree', 'colour' => 'red'],
                    ['object' => 'flower', 'position' => 'in the garden', 'colour' => 'yellow'],
                    ['object' => 'car', 'position' => 'on the road', 'colour' => 'blue'],
                    ['object' => 'house', 'position' => 'behind the tree', 'colour' => 'green'],
                    ['object' => 'bird', 'position' => 'in the sky', 'colour' => 'orange'],
                ],
            ]),
        ]);

        echo "  ✓ Starters Listening: 4 parts, 20 questions\n";
    }

    /**
     * YLE STARTERS - READING & WRITING TEST (5 parts, 25 questions)
     */
    private function createStartersReadingWritingExam()
    {
        echo "📝 Creating Starters Reading & Writing Exam...\n";

        $exam = Exam::create([
            'eTitle' => 'Cambridge YLE Starters - Reading & Writing Test (Sample)',
            'eDescription' => 'Complete reading and writing test with 5 parts and 25 questions. Duration: 20 minutes. Level: Pre A1 Starters',
            'eType' => 'GENERAL',
            'eSkill' => 'reading',
            'eTeacher_id' => $this->teacherId,
            'eDuration_minutes' => 20,
            'eIs_private' => false,
            'eSource_type' => 'manual',
            'eDifficulty' => 'easy',
            'age_group' => 'kids',
        ]);

        // PART 1: Look and read. Put a tick or cross (5 questions)
        Question::create([
            'exam_id' => $exam->eId,
            'qContent' => 'Part 1: Look and read. Put a tick (✓) or a cross (✗)',
            'qPoints' => 5,
            'qType' => 'kids_task',
            'task_type_code' => 'look_and_read',
            'part' => 2,
            'sub_part' => 1,
            'order_in_part' => 1,
            'order_in_exam' => 1,
            'task_data' => json_encode([
                'instructions' => 'Look at the pictures. Look at the letters. Write the words.',
                'items' => [
                    [
                        'image' => '/images/objects/apple.jpg',
                        'sentence' => 'This is an apple.',
                        'is_correct' => true,
                    ],
                    [
                        'image' => '/images/objects/dog.jpg',
                        'sentence' => 'This is a cat.',
                        'is_correct' => false,
                    ],
                    [
                        'image' => '/images/objects/book.jpg',
                        'sentence' => 'This is a book.',
                        'is_correct' => true,
                    ],
                    [
                        'image' => '/images/objects/car.jpg',
                        'sentence' => 'This is a bike.',
                        'is_correct' => false,
                    ],
                    [
                        'image' => '/images/objects/ball.jpg',
                        'sentence' => 'This is a ball.',
                        'is_correct' => true,
                    ],
                ],
            ]),
        ]);

        // PART 2: Look and read. Write yes or no (5 questions)
        Question::create([
            'exam_id' => $exam->eId,
            'qContent' => 'Part 2: Look and read. Write yes or no',
            'qPoints' => 5,
            'qType' => 'kids_task',
            'task_type_code' => 'look_and_read',
            'part' => 2,
            'sub_part' => 2,
            'order_in_part' => 2,
            'order_in_exam' => 2,
            'task_data' => json_encode([
                'instructions' => 'Look at the picture and read the questions. Write yes or no.',
                'image' => '/images/scenes/park.jpg',
                'questions' => [
                    ['question' => 'There is a dog in the park.', 'answer' => 'yes'],
                    ['question' => 'The boy is riding a bike.', 'answer' => 'no'],
                    ['question' => 'The girl is eating an ice cream.', 'answer' => 'yes'],
                    ['question' => 'There are three birds in the tree.', 'answer' => 'no'],
                    ['question' => 'The sun is shining.', 'answer' => 'yes'],
                ],
            ]),
        ]);

        // PART 3: Look at the pictures. Look at the letters. Write the words (5 questions)
        Question::create([
            'exam_id' => $exam->eId,
            'qContent' => 'Part 3: Look at the pictures. Look at the letters. Write the words',
            'qPoints' => 5,
            'qType' => 'kids_task',
            'task_type_code' => 'unscramble_words',
            'part' => 2,
            'sub_part' => 3,
            'order_in_part' => 3,
            'order_in_exam' => 3,
            'task_data' => json_encode([
                'instructions' => 'Look at the pictures and the letters. Write the words.',
                'words' => [
                    ['image' => '/images/objects/table.jpg', 'scrambled' => 'elbat', 'answer' => 'table'],
                    ['image' => '/images/objects/chair.jpg', 'scrambled' => 'riahc', 'answer' => 'chair'],
                    ['image' => '/images/objects/pencil.jpg', 'scrambled' => 'licnep', 'answer' => 'pencil'],
                    ['image' => '/images/objects/banana.jpg', 'scrambled' => 'ananab', 'answer' => 'banana'],
                    ['image' => '/images/objects/window.jpg', 'scrambled' => 'wodniw', 'answer' => 'window'],
                ],
            ]),
        ]);

        // PART 4: Read this. Choose a word from the box. Write the correct word (5 questions)
        Question::create([
            'exam_id' => $exam->eId,
            'qContent' => 'Part 4: Read this. Choose a word from the box',
            'qPoints' => 5,
            'qType' => 'kids_task',
            'task_type_code' => 'word_bank_fill',
            'part' => 2,
            'sub_part' => 4,
            'order_in_part' => 4,
            'order_in_exam' => 4,
            'task_data' => json_encode([
                'instructions' => 'Read the story. Choose a word from the box. Write the correct word next to numbers 1-5.',
                'text' => "My name is Anna. I live in a big (1)_____ with my family. We have a (2)_____ in our garden. I like to play with my (3)_____ there. My favorite (4)_____ is red. I go to (5)_____ every day.",
                'word_bank' => ['house', 'tree', 'ball', 'colour', 'school', 'car', 'book'],
                'answers' => [
                    ['blank' => 1, 'answer' => 'house'],
                    ['blank' => 2, 'answer' => 'tree'],
                    ['blank' => 3, 'answer' => 'ball'],
                    ['blank' => 4, 'answer' => 'colour'],
                    ['blank' => 5, 'answer' => 'school'],
                ],
            ]),
        ]);

        // PART 5: Look at the pictures and read the story. Write words to complete the sentences (5 questions)
        Question::create([
            'exam_id' => $exam->eId,
            'qContent' => 'Part 5: Look at the pictures and read the story',
            'qPoints' => 5,
            'qType' => 'kids_task',
            'task_type_code' => 'look_read_and_write',
            'part' => 2,
            'sub_part' => 5,
            'order_in_part' => 5,
            'order_in_exam' => 5,
            'task_data' => json_encode([
                'instructions' => 'Look at the pictures and read the story. Write words to complete the sentences about the story.',
                'story_images' => [
                    '/images/story/pic1.jpg',
                    '/images/story/pic2.jpg',
                    '/images/story/pic3.jpg',
                ],
                'questions' => [
                    ['question' => 'Tom went to the _____.', 'answer' => 'park'],
                    ['question' => 'He played with his _____.', 'answer' => 'friend'],
                    ['question' => 'They saw a big _____.', 'answer' => 'dog'],
                    ['question' => 'The dog was _____.', 'answer' => 'brown'],
                    ['question' => 'Tom was very _____.', 'answer' => 'happy'],
                ],
            ]),
        ]);

        echo "  ✓ Starters Reading & Writing: 5 parts, 25 questions\n";
    }

    /**
     * YLE STARTERS - SPEAKING TEST (4 parts)
     */
    private function createStartersSpeakingExam()
    {
        echo "📝 Creating Starters Speaking Exam...\n";

        $exam = Exam::create([
            'eTitle' => 'Cambridge YLE Starters - Speaking Test (Sample)',
            'eDescription' => 'Complete speaking test with 4 parts. Duration: 3-5 minutes. Level: Pre A1 Starters',
            'eType' => 'GENERAL',
            'eSkill' => 'speaking',
            'eTeacher_id' => $this->teacherId,
            'eDuration_minutes' => 5,
            'eIs_private' => false,
            'eSource_type' => 'manual',
            'eDifficulty' => 'easy',
            'age_group' => 'kids',
        ]);

        // PART 1: Point to the correct picture
        Question::create([
            'exam_id' => $exam->eId,
            'qContent' => 'Part 1: Point to the correct picture',
            'qPoints' => 5,
            'qType' => 'kids_task',
            'task_type_code' => 'object_placement',
            'part' => 3,
            'sub_part' => 1,
            'order_in_part' => 1,
            'order_in_exam' => 1,
            'task_data' => json_encode([
                'instructions' => 'The examiner will ask you to point to different things in the picture.',
                'scene_image' => '/images/speaking/scene.jpg',
                'objects' => [
                    ['name' => 'ball', 'image' => '/images/objects/ball.jpg'],
                    ['name' => 'tree', 'image' => '/images/objects/tree.jpg'],
                    ['name' => 'house', 'image' => '/images/objects/house.jpg'],
                    ['name' => 'car', 'image' => '/images/objects/car.jpg'],
                ],
                'prompts' => [
                    'Where is the ball?',
                    'Can you see the tree?',
                    'Point to the house.',
                    'Show me the car.',
                ],
            ]),
        ]);

        // PART 2: Answer questions about the picture
        Question::create([
            'exam_id' => $exam->eId,
            'qContent' => 'Part 2: Answer questions about the picture',
            'qPoints' => 5,
            'qType' => 'kids_task',
            'task_type_code' => 'picture_questions',
            'part' => 3,
            'sub_part' => 2,
            'order_in_part' => 2,
            'order_in_exam' => 2,
            'task_data' => json_encode([
                'instructions' => 'Answer the examiner\'s questions about the big picture.',
                'image' => '/images/speaking/scene.jpg',
                'questions' => [
                    'What is this?',
                    'What colour is it?',
                    'How many can you see?',
                    'Where is the dog?',
                    'Tell me about the boy.',
                ],
            ]),
        ]);

        // PART 3: Answer questions about object cards
        Question::create([
            'exam_id' => $exam->eId,
            'qContent' => 'Part 3: Answer questions about object cards',
            'qPoints' => 5,
            'qType' => 'kids_task',
            'task_type_code' => 'picture_card_questions',
            'part' => 3,
            'sub_part' => 3,
            'order_in_part' => 3,
            'order_in_exam' => 3,
            'task_data' => json_encode([
                'instructions' => 'Answer questions about these object cards.',
                'cards' => [
                    ['image' => '/images/cards/apple.jpg', 'name' => 'apple'],
                    ['image' => '/images/cards/book.jpg', 'name' => 'book'],
                    ['image' => '/images/cards/ball.jpg', 'name' => 'ball'],
                    ['image' => '/images/cards/cat.jpg', 'name' => 'cat'],
                ],
                'questions' => [
                    'What is this?',
                    'Do you like [object]?',
                    'Have you got a [object]?',
                    'What colour is your [object]?',
                ],
            ]),
        ]);

        // PART 4: Personal questions
        Question::create([
            'exam_id' => $exam->eId,
            'qContent' => 'Part 4: Personal questions',
            'qPoints' => 5,
            'qType' => 'kids_task',
            'task_type_code' => 'information_exchange',
            'part' => 3,
            'sub_part' => 4,
            'order_in_part' => 4,
            'order_in_exam' => 4,
            'task_data' => json_encode([
                'instructions' => 'Answer the examiner\'s questions about yourself.',
                'questions' => [
                    'What\'s your name?',
                    'How old are you?',
                    'Do you have any brothers or sisters?',
                    'What\'s your favorite toy?',
                    'What do you like to do?',
                    'Do you have a pet?',
                    'What\'s your favorite colour?',
                ],
            ]),
        ]);

        echo "  ✓ Starters Speaking: 4 parts\n";
    }
}
