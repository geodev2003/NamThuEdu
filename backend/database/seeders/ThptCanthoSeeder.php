<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Seed đề minh hoạ ĐH Cần Thơ 2025 — format THPT 4 parts × 25 câu × 60'.
 *
 * Run: php artisan db:seed --class=ThptCanthoSeeder
 */
class ThptCanthoSeeder extends Seeder
{
    public function run(): void
    {
        // Ưu tiên tài khoản giáo viên test (để dev sửa được ngay), fallback teacher đầu tiên.
        $teacher = User::where('uEmail', 'testteacher@example.com')->whereNull('uDeleted_at')->first()
            ?? User::where('uRole', 'teacher')->whereNull('uDeleted_at')->first();
        if (!$teacher) {
            $this->command->warn('Không tìm thấy teacher nào — bỏ qua seed.');
            return;
        }

        $config = $this->buildConfig();

        $exam = Exam::updateOrCreate(
            ['eTitle' => 'THPT - Đầu vào ĐH Cần Thơ 2025 (Minh hoạ)'],
            [
                'eDescription' => 'Đề minh hoạ kỳ thi đánh giá đầu vào đại học trên máy tính 2025 — Tiếng Anh. 4 parts × 25 câu × 60 phút.',
                'eType' => 'THPT',
                'eSkill' => 'reading',
                'eDuration_minutes' => 60,
                'eStatus' => 'published',
                'ePurpose' => 'exam',
                'eDifficulty' => 'medium',
                'eTeacher_id' => $teacher->uId,
                'eIs_private' => false, // Đề minh hoạ — public cho mọi giáo viên thấy
                'age_group' => 'teens',
                'thpt_config' => $config,
            ]
        );

        $this->command->info("✅ Seeded THPT exam ID={$exam->eId} — {$exam->eTitle}");
    }

    private function buildConfig(): array
    {
        return [
            'version' => '2.0',
            'level' => 'DGNL',
            'school' => 'ĐH Cần Thơ',
            'total_duration_minutes' => 60,
            'scale_max' => 10,
            'sections' => [
                $this->part1(),
                $this->part2(),
                $this->part3(),
                $this->part4(),
            ],
        ];
    }

    private function part1(): array
    {
        return [
            'id' => 'sec_p1',
            'type' => 'tf_group',
            'points_per_question' => 1,
            'title' => 'PART 1 - Questions 1-7',
            'instructions' => 'Read the notices/messages/advertisements and decide if the statements that follow each question are TRUE or FALSE.',
            'items' => [
                [
                    'question_number' => 1,
                    'context' => "SCHOOL ENTRANCE AHEAD\nDEAD SLOW",
                    'context_style' => 'notice',
                    'statements' => [
                        ['id' => '1-1', 'text' => 'Parents must stay away from the gate.', 'correct' => false],
                        ['id' => '1-2', 'text' => 'The sign is meant for drivers.', 'correct' => true],
                        ['id' => '1-3', 'text' => 'There is a school gate near the sign.', 'correct' => true],
                        ['id' => '1-4', 'text' => 'Schoolchildren have to walk slowly.', 'correct' => false],
                    ],
                ],
                [
                    'question_number' => 2,
                    'context' => "GRAY & SONS BUILDERS\nSince 1983\nFree estimates",
                    'context_style' => 'ad',
                    'statements' => [
                        ['id' => '2-1', 'text' => 'Gray and Sons builds houses.', 'correct' => true],
                        ['id' => '2-2', 'text' => 'Gray and Sons estimates the size of your house for free.', 'correct' => false],
                        ['id' => '2-3', 'text' => 'Gray and Sons gives builders houses for free.', 'correct' => false],
                        ['id' => '2-4', 'text' => 'Gray and Sons has been in the business since 1983.', 'correct' => true],
                    ],
                ],
                [
                    'question_number' => 3,
                    'context' => "PACKERS & MOVERS\n24 hours, seven days a week\nMOBILE: 378 88806235",
                    'context_style' => 'ad',
                    'statements' => [
                        ['id' => '3-1', 'text' => 'Packers & Movers moves houses.', 'correct' => false],
                        ['id' => '3-2', 'text' => 'You can contact Packers & Movers on mobile.', 'correct' => true],
                        ['id' => '3-3', 'text' => "Packers & Movers doesn't work at the weekend.", 'correct' => false],
                        ['id' => '3-4', 'text' => 'Packers & Movers works only 24 hours a week.', 'correct' => false],
                    ],
                ],
                [
                    'question_number' => 4,
                    'context' => "YEAR-END PARTY\nOur year-end party will take place at the auditorium instead of the stadium as planned before. The party will also be delayed half an hour, starting at 7.30 p.m. on Dec 25th. Formal clothes are required!",
                    'context_style' => 'message',
                    'statements' => [
                        ['id' => '4-1', 'text' => 'The party will take place on the last day of the year.', 'correct' => false],
                        ['id' => '4-2', 'text' => 'The party will no longer be held in the stadium.', 'correct' => true],
                        ['id' => '4-3', 'text' => 'There is a change in the time of the party.', 'correct' => true],
                        ['id' => '4-4', 'text' => 'People can wear casual clothes to the party.', 'correct' => false],
                    ],
                ],
                [
                    'question_number' => 5,
                    'context' => "The Thinking Skills Assessment (TSA) is divided into two parts: a 90-minute, multiple choice TSA and a 30-minute writing task. The TSA will be a paper-based test from next month.",
                    'context_style' => 'notice',
                    'statements' => [
                        ['id' => '5-1', 'text' => 'Candidates can take the computer-based TSA from next month.', 'correct' => false],
                        ['id' => '5-2', 'text' => 'The TSA consists of two sessions.', 'correct' => true],
                        ['id' => '5-3', 'text' => 'There is no multiple choice TSA this year.', 'correct' => false],
                        ['id' => '5-4', 'text' => 'The TSA writing task lasts 30 minutes.', 'correct' => true],
                    ],
                ],
                [
                    'question_number' => 6,
                    'context' => "Single room available in our four-bedroom house in Fairfax. Two-minute walk from city centre. Move in from 1 Dec. Shared kitchen and living room with three female housemates, no parking, £600 a month. No pets. Contact 0678 123456 for viewing",
                    'context_style' => 'ad',
                    'statements' => [
                        ['id' => '6-1', 'text' => 'This house is near the city centre.', 'correct' => true],
                        ['id' => '6-2', 'text' => 'You can keep your car here.', 'correct' => false],
                        ['id' => '6-3', 'text' => 'You can come to see the house first.', 'correct' => true],
                        ['id' => '6-4', 'text' => 'Pets can live in the house.', 'correct' => false],
                    ],
                ],
                [
                    'question_number' => 7,
                    'context' => "From: Joy\nTo: Linh\nHi Linh. I'll be in town on business this Friday, so how about meeting for dinner then, instead of Tuesday as usual?\nJoy",
                    'context_style' => 'email',
                    'statements' => [
                        ['id' => '7-1', 'text' => 'Joy wants Linh to meet her on Tuesday this week.', 'correct' => false],
                        ['id' => '7-2', 'text' => 'The message is meant for Linh.', 'correct' => true],
                        ['id' => '7-3', 'text' => 'Joy and Linh often meet for dinner on Friday.', 'correct' => false],
                        ['id' => '7-4', 'text' => 'Joy is with Linh on a business trip to town.', 'correct' => false],
                    ],
                ],
            ],
        ];
    }

    private function part2(): array
    {
        $passage = "Fifty-two-year-old American Henry Evans is one of the world's first teletourists. From the comfort of his bed in Palo Alto, California, he has travelled to places as far away as Bora Bora in the South Pacific. Under normal circumstances, this journey would be impossible for Henry because he is disabled. A serious stroke when he was 40 affected his brain and left him without speech and unable to use his arms or legs. But with the help of technology, Henry is able to deal with his difficulties and get out to see the world.\n\n"
                  . "When Henry wants to visit a museum, he uses a telepresence robot called the Beam, a big computer monitor with a webcam that is attached to a mobile base with two poles. Using head movements, he can drive the machine around the halls, talking to the guide and learning about the exhibits, just like any other visitor. Several of the world's museums already use these machines, and Henry hopes there will soon be more.\n\n"
                  . "[A] To see what is happening outside, Henry uses a device called Polly. Like the Beam, Polly is made up of a monitor and a webcam, the difference being that it is small enough to be portable. The gadget fits into a frame attached to a person's shoulder allowing it to be carried around like a parrot. By virtue of this new technology, Henry can accompany and converse with his friends and family when they have a day out in the country. He controls it by moving his head, so that it turns around and shows him everything his companions can see and hear. [B] Thanks to improvements in long-distance remote-control software, Henry can fly drones, which also enable him to explore from the air. [C] When he wants to go further afield, he has found a website which has 5,000 drone videos from all over the world, which gives him access to all kinds of fascinating destinations. [D]\n\n"
                  . "No journey is too far for Henry, who is currently pursuing the possibility of travelling into space. He got the idea from an article he came across on the internet. He read that a research team was trying to get access for PC users to a robot on the International Space Station (ISS). Henry has already applied for permission to use this new technology, but he has not received approval yet. Judging by what he has already achieved, however, it is only a matter of time before he is allowed to go on a remote tour of the satellite.";

        return [
            'id' => 'sec_p2',
            'type' => 'reading_mixed',
            'points_per_question' => 1,
            'title' => 'PART 2 - Questions 8-15',
            'instructions' => 'Read the passage and answer questions 8-15.',
            'passage' => $passage,
            'items' => [
                [
                    'kind' => 'tf_group',
                    'question_number' => 8,
                    'context_paragraph_ref' => 'Based on the information in paragraph 1.',
                    'statements' => [
                        ['id' => '8-1', 'text' => 'Henry suffers from severe and lasting post-stroke disability.', 'correct' => true],
                        ['id' => '8-2', 'text' => 'Henry has been disabled since he was born.', 'correct' => false],
                        ['id' => '8-3', 'text' => 'Henry has only visited domestic destinations virtually so far.', 'correct' => false],
                        ['id' => '8-4', 'text' => 'It is impossible for Henry to travel physically to faraway places.', 'correct' => true],
                    ],
                ],
                [
                    'kind' => 'tf_group',
                    'question_number' => 9,
                    'context_paragraph_ref' => 'Based on the information in paragraph 2.',
                    'statements' => [
                        ['id' => '9-1', 'text' => 'Henry can visit museums with the help of a telepresence robot.', 'correct' => true],
                        ['id' => '9-2', 'text' => 'Robots like the Beam are being used widely in museums across the world.', 'correct' => false],
                        ['id' => '9-3', 'text' => 'Henry use sign language to communicate directly with museum guides.', 'correct' => false],
                        ['id' => '9-4', 'text' => "The Beam is attached permanently to museums' walls.", 'correct' => false],
                    ],
                ],
                [
                    'kind' => 'mc',
                    'question_number' => 10,
                    'prompt' => "In paragraph 3, the phrase 'made up' is closest in meaning to",
                    'options' => [
                        ['id' => 'A', 'text' => 'met'],
                        ['id' => 'B', 'text' => 'formed'],
                        ['id' => 'C', 'text' => 'avoided'],
                        ['id' => 'D', 'text' => 'caused'],
                    ],
                    'correct_id' => 'B',
                ],
                [
                    'kind' => 'mc',
                    'question_number' => 11,
                    'prompt' => "In paragraph 3, the word 'it' refers to",
                    'options' => [
                        ['id' => 'A', 'text' => 'Polly'],
                        ['id' => 'B', 'text' => "a person's shoulder"],
                        ['id' => 'C', 'text' => 'a frame'],
                        ['id' => 'D', 'text' => 'a parrot'],
                    ],
                    'correct_id' => 'A',
                ],
                [
                    'kind' => 'mc',
                    'question_number' => 12,
                    'prompt' => 'How does Polly differ from Beam according to paragraph 3?',
                    'options' => [
                        ['id' => 'A', 'text' => 'Polly is made up of completely different components from the Beam.'],
                        ['id' => 'B', 'text' => 'Polly is considerably smaller in size than the Beam.'],
                        ['id' => 'C', 'text' => "Polly can't be controlled by head movements while the Beam can."],
                        ['id' => 'D', 'text' => "Polly doesn't facilitate interaction between Henry and his friends whereas the Beam does."],
                    ],
                    'correct_id' => 'B',
                ],
                [
                    'kind' => 'sentence_insertion',
                    'question_number' => 13,
                    'prompt' => 'In which space (marked A, B, C, or D in the passage) will the following sentence fit?',
                    'sentence_to_insert' => "He controls them using his head, and he's even flown one around his garden wearing a virtual reality headset.",
                    'correct_marker' => 'B',
                ],
                [
                    'kind' => 'mc',
                    'question_number' => 14,
                    'prompt' => 'Which of the following can be inferred about Henry from the last paragraph of the passage?',
                    'options' => [
                        ['id' => 'A', 'text' => 'He has already been approved to use a robot on the International Space Station.'],
                        ['id' => 'B', 'text' => 'He has little hope of achieving his goal of exploring space remotely.'],
                        ['id' => 'C', 'text' => 'He has shifted his focus from using drones to controlling robots in space.'],
                        ['id' => 'D', 'text' => 'He is determined to keep exploring new possibilities despite his disability.'],
                    ],
                    'correct_id' => 'D',
                ],
                [
                    'kind' => 'mc',
                    'question_number' => 15,
                    'prompt' => 'Which sentence best summarizes the main idea of the passage?',
                    'options' => [
                        ['id' => 'A', 'text' => 'Henry Evans, at 52, uses advanced technology to help other disabled individuals experience the world in ways they could not before.'],
                        ['id' => 'B', 'text' => 'Henry Evans, a disabled American, has explored space using innovative technologies like telepresence robots and drones.'],
                        ['id' => 'C', 'text' => 'Henry Evans, a 52-year-old American, explores the world using telepresence robots and drones, aiming to one day travel to space.'],
                        ['id' => 'D', 'text' => 'Henry Evans, an American inventor, designs telepresence robots and drones to enable disabled individuals to travel virtually.'],
                    ],
                    'correct_id' => 'C',
                ],
            ],
        ];
    }

    private function part3(): array
    {
        return [
            'id' => 'sec_p3',
            'type' => 'matching',
            'points_per_question' => 1,
            'title' => 'PART 3 - Questions 16-20',
            'instructions' => 'Match each number (1-4) with a suitable letter (A-F) to make an appropriate exchange or ending.',
            'items' => [
                [
                    'question_number' => 16,
                    'list_1' => [
                        'Thanks a lot for helping me out this time!',
                        "Excuse me, where's the library?",
                        'Good bye!',
                        'What time is it?',
                    ],
                    'list_2' => [
                        'My pleasure.',
                        "It's near here, just round the corner.",
                        'See you.',
                        'I\'m glad you like it.',
                        "It's nine o'clock.",
                        "It's on May 5th.",
                    ],
                    'answers' => ['1' => 'A', '2' => 'B', '3' => 'C', '4' => 'E'],
                ],
                [
                    'question_number' => 17,
                    'list_1' => [
                        "Many children's insecurities",
                        'One consequence of family instability',
                        'Deforestation in the Amazon rain forest',
                        'A diet deficient in vitamin C',
                    ],
                    'list_2' => [
                        'come as a result of problematic parental behaviours.',
                        'stem mostly from human activities.',
                        'is a reduction in the overall well-being of the children involved.',
                        'is caused by bullying behaviours at school.',
                        'is having its impacts on the water cycle as well as plant and animal life in the region.',
                        'can lead to unwanted exhaustion and spontaneous bleeding.',
                    ],
                    'answers' => ['1' => 'A', '2' => 'C', '3' => 'E', '4' => 'F'],
                ],
                [
                    'question_number' => 18,
                    'list_1' => [
                        'Should the government promote a healthy lifestyle,',
                        'Were John to behave properly,',
                        'Had David seen Mary off at the airport yesterday,',
                        'Had it not been for the appearance of the famous singer,',
                    ],
                    'list_2' => [
                        "he wouldn't be often blamed by his peers.",
                        'many people will adopt better eating habits.',
                        "the concert wouldn't have been so appealing.",
                        'she would have been happy.',
                        'there would be no one in the hall.',
                        'she will be delighted.',
                    ],
                    'answers' => ['1' => 'B', '2' => 'A', '3' => 'D', '4' => 'C'],
                ],
                [
                    'question_number' => 19,
                    'list_1' => [
                        'Mr. Brian is considering early retirement,',
                        'Our next-door neighbour is a famous author,',
                        'The artist had an impressive performance,',
                        'David failed to answer the last question in the English speaking contest,',
                    ],
                    'list_2' => [
                        'in which case his only son will take over the family business.',
                        'most of whose books have been adapted for theatre.',
                        'which satisfied her audience.',
                        'for whom the students show great respect.',
                        'most of which have been translated into three languages.',
                        'which shocked everyone in the hall.',
                    ],
                    'answers' => ['1' => 'A', '2' => 'B', '3' => 'C', '4' => 'F'],
                ],
                [
                    'question_number' => 20,
                    'list_1' => [
                        'She handled the situation',
                        'Adam performed the experiment',
                        'It was this beautiful scenery',
                        "It is my parents' encouragement",
                    ],
                    'list_2' => [
                        'as she always will.',
                        'that attracted visitors to the place.',
                        'like a true leader would.',
                        'that helps me overcome many challenges.',
                        'which motivates me a lot.',
                        'the way he was instructed.',
                    ],
                    'answers' => ['1' => 'C', '2' => 'F', '3' => 'B', '4' => 'D'],
                ],
            ],
        ];
    }

    private function part4(): array
    {
        $passage = "We know sleep is an activity we can't do without, yet we let our hectic lifestyle wear us down until we can't (21) ____ from bed in the morning. We know the longer we go without sleep, the more likely we are to have (22) ____ accident, and when that happens, this will be the unhappiest moment we've been through in our life. It's safe to say that too many people have come up against this problem. But there's no need for us to make ourselves tired over a lack of sleep. Now it seems as if people are bouncing back from this terrible (23) ____ torture by taking mid-day naps. Some may think it makes them look lazy to the boss, but these days aren't as old-fashioned (24) ____ we might expect, and such ideas as napping at work are catching (25) ____. It's been proven by researchers that a mid-day nap increases productivity, and more employees are changing their tune about the practice.";

        return [
            'id' => 'sec_p4',
            'type' => 'open_cloze',
            'points_per_question' => 1,
            'title' => 'PART 4 - Questions 21-25',
            'instructions' => 'Read the text and fill in ONE word which best fits each gap.',
            'passage' => $passage,
            'blanks' => [
                ['question_number' => 21, 'accepted_answers' => ['get', 'rise'], 'case_sensitive' => false],
                ['question_number' => 22, 'accepted_answers' => ['an'], 'case_sensitive' => false],
                ['question_number' => 23, 'accepted_answers' => ['sleep'], 'case_sensitive' => false],
                ['question_number' => 24, 'accepted_answers' => ['as'], 'case_sensitive' => false],
                ['question_number' => 25, 'accepted_answers' => ['on'], 'case_sensitive' => false],
            ],
        ];
    }
}
