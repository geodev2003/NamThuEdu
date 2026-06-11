<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Exam;
use App\Services\IELTSService;

/**
 * Seed exam ID 44 — IELTS Academic Listening Test 1
 *
 * Part 1 (Q1–10): Table completion — Restaurant recommendations
 * Part 2 (Q11–20): MCQ + multiple-answer — Edelman Pottery (Heather)
 * Part 3 (Q21–30): Multiple-answer + MCQ — Loneliness (students' discussion)
 * Part 4 (Q31–40): MCQ + note completion — Migration and language (lecture)
 */
class IeltsExam44Seeder extends Seeder
{
    public function run(): void
    {
        $exam = Exam::find(44);

        if (!$exam) {
            $this->command->error('Exam ID 44 not found!');
            return;
        }

        $this->command->info("Seeding exam #{$exam->eId}: {$exam->eTitle}");

        $data = [
            'listening' => [
                'sections' => [
                    // ── PART 1: Restaurant recommendations – Table completion ──
                    [
                        'sectionNumber' => 1,
                        'audioUrl'      => url('files/audio/ielts_test1_part1_restaurants.mp3'),
                        'audioFileName' => 'ielts_test1_part1_restaurants.mp3',
                        'transcript'    =>
                            "WOMAN: Hi, I'm thinking of somewhere to eat next week for my mum's birthday and I wondered if you could recommend somewhere.\n"
                            . "MAN: Sure, how about The Junction? It's on Greyson Street, near the station.\n"
                            . "WOMAN: What's the food like?\n"
                            . "MAN: It's very good for people who are especially keen on fish. It's quite expensive though.\n"
                            . "WOMAN: Hmm. What about drinks?\n"
                            . "MAN: Well, the bar is a good place for a drink. Now there's also Paloma — that's in Bow Street next to the cinema.\n"
                            . "WOMAN: What kind of food do they serve?\n"
                            . "MAN: Mediterranean food, good for sharing. The staff are very friendly.\n"
                            . "WOMAN: That sounds nice. Any downsides?\n"
                            . "MAN: You need to pay a £50 deposit to book. And they only have a limited selection of vegetarian food on the menu.\n"
                            . "WOMAN: And what's the third one?\n"
                            . "MAN: The Lighthouse. It's at the top of a hill. A famous chef works there. Set lunch costs nine pounds per person. The portions are probably of medium size.",
                        'questions' => [
                            [
                                'questionNumber' => 1,
                                'questionType'   => 'form-completion',
                                'questionText'   => 'The Junction — Good for people who are especially keen on: ________',
                                'correctAnswer'  => 'fish',
                            ],
                            [
                                'questionNumber' => 2,
                                'questionType'   => 'form-completion',
                                'questionText'   => 'The Junction — The ________ is a good place for a drink',
                                'correctAnswer'  => 'bar',
                            ],
                            [
                                'questionNumber' => 3,
                                'questionType'   => 'form-completion',
                                'questionText'   => 'Paloma — ________ food, good for sharing',
                                'correctAnswer'  => 'Mediterranean',
                            ],
                            [
                                'questionNumber' => 4,
                                'questionType'   => 'form-completion',
                                'questionText'   => 'Paloma — A limited selection of ________ food on the menu',
                                'correctAnswer'  => 'vegetarian',
                            ],
                            [
                                'questionNumber' => 5,
                                'questionType'   => 'form-completion',
                                'questionText'   => 'The ________ (name of third restaurant)',
                                'correctAnswer'  => 'Lighthouse',
                            ],
                            [
                                'questionNumber' => 6,
                                'questionType'   => 'form-completion',
                                'questionText'   => 'The Lighthouse — At the top of a ________',
                                'correctAnswer'  => 'hill',
                            ],
                            [
                                'questionNumber' => 7,
                                'questionType'   => 'form-completion',
                                'questionText'   => 'The Lighthouse — All the ________ are very good',
                                'correctAnswer'  => 'staff',
                            ],
                            [
                                'questionNumber' => 8,
                                'questionType'   => 'form-completion',
                                'questionText'   => 'The Lighthouse — Only uses ________ ingredients',
                                'correctAnswer'  => 'local',
                            ],
                            [
                                'questionNumber' => 9,
                                'questionType'   => 'form-completion',
                                'questionText'   => 'The Lighthouse — Set lunch costs £________ per person',
                                'correctAnswer'  => '9',
                            ],
                            [
                                'questionNumber' => 10,
                                'questionType'   => 'form-completion',
                                'questionText'   => 'The Lighthouse — Portions probably of ________ size',
                                'correctAnswer'  => 'medium',
                            ],
                        ],
                    ],

                    // ── PART 2: Edelman Pottery — Heather talking about pottery ──
                    [
                        'sectionNumber' => 2,
                        'audioUrl'      => url('files/audio/ielts_test1_part2_pottery.mp3'),
                        'audioFileName' => 'ielts_test1_part2_pottery.mp3',
                        'transcript'    =>
                            "HEATHER: Good morning. My name is Heather and I run Edelman Pottery. "
                            . "I want to talk to you today about pottery — why it's different from other art forms, who comes to our classes, and what happens here.\n"
                            . "Pottery is special because it lasts longer in the ground than most other objects. Archaeologists use the marks on pots to identify what they were used for. "
                            . "People join our classes for different reasons. Some want to find something they are good at. "
                            . "What I value most about being a potter is its calming effect — it really helps me switch off.\n"
                            . "Most visitors here have never made a pot before. We always remind them to take off their jewellery before they start — clay gets everywhere.\n"
                            . "Now, about kilns — the essential pieces of equipment for pottery. I'll tell you what their function is and ways of keeping them safe.\n"
                            . "And regarding tools — the most important thing is that some are essential items. Some are available for use by participants here.",
                        'questions' => [
                            [
                                'questionNumber' => 11,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Heather says pottery differs from other art forms because',
                                'options'        => [
                                    'A' => 'it lasts longer in the ground.',
                                    'B' => 'it is practised by more people.',
                                    'C' => 'it can be repaired more easily.',
                                ],
                                'correctAnswer'  => 'A',
                            ],
                            [
                                'questionNumber' => 12,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Archaeologists sometimes identify the use of ancient pottery from',
                                'options'        => [
                                    'A' => 'the clay it was made with.',
                                    'B' => 'the marks that are on it.',
                                    'C' => 'the basic shape of it.',
                                ],
                                'correctAnswer'  => 'B',
                            ],
                            [
                                'questionNumber' => 13,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Some people join Heather\'s pottery class because they want to',
                                'options'        => [
                                    'A' => 'create an item that looks very old.',
                                    'B' => 'find something that they are good at.',
                                    'C' => 'make something that will outlive them.',
                                ],
                                'correctAnswer'  => 'B',
                            ],
                            [
                                'questionNumber' => 14,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'What does Heather value most about being a potter?',
                                'options'        => [
                                    'A' => 'its calming effect',
                                    'B' => 'its messy nature',
                                    'C' => 'its physical benefits',
                                ],
                                'correctAnswer'  => 'A',
                            ],
                            [
                                'questionNumber' => 15,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Most of the visitors to Edelman Pottery',
                                'options'        => [
                                    'A' => 'bring friends to join courses.',
                                    'B' => 'have never made a pot before.',
                                    'C' => 'try to learn techniques too quickly.',
                                ],
                                'correctAnswer'  => 'B',
                            ],
                            [
                                'questionNumber' => 16,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Heather reminds her visitors that they should',
                                'options'        => [
                                    'A' => 'put on their aprons.',
                                    'B' => 'change their clothes.',
                                    'C' => 'take off their jewellery.',
                                ],
                                'correctAnswer'  => 'C',
                            ],
                            // Q17–18: Choose TWO letters — kilns
                            [
                                'questionNumber' => 17,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Questions 17–18: Which TWO things does Heather explain about kilns? (Answer for Q17)',
                                'options'        => [
                                    'A' => 'what their function is',
                                    'B' => 'when they were invented',
                                    'C' => 'ways of keeping them safe',
                                    'D' => 'where to put one in your home',
                                    'E' => 'what some people use instead of one',
                                ],
                                'correctAnswer'  => 'A',
                            ],
                            [
                                'questionNumber' => 18,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Questions 17–18: Which TWO things does Heather explain about kilns? (Answer for Q18)',
                                'options'        => [
                                    'A' => 'what their function is',
                                    'B' => 'when they were invented',
                                    'C' => 'ways of keeping them safe',
                                    'D' => 'where to put one in your home',
                                    'E' => 'what some people use instead of one',
                                ],
                                'correctAnswer'  => 'C',
                            ],
                            // Q19–20: Choose TWO letters — tools
                            [
                                'questionNumber' => 19,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Questions 19–20: Which TWO points does Heather make about a potter\'s tools? (Answer for Q19)',
                                'options'        => [
                                    'A' => 'Some are hard to hold.',
                                    'B' => 'Some are worth buying.',
                                    'C' => 'Some are essential items.',
                                    'D' => 'Some have memorable names.',
                                    'E' => 'Some are available for use by participants.',
                                ],
                                'correctAnswer'  => 'C',
                            ],
                            [
                                'questionNumber' => 20,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Questions 19–20: Which TWO points does Heather make about a potter\'s tools? (Answer for Q20)',
                                'options'        => [
                                    'A' => 'Some are hard to hold.',
                                    'B' => 'Some are worth buying.',
                                    'C' => 'Some are essential items.',
                                    'D' => 'Some have memorable names.',
                                    'E' => 'Some are available for use by participants.',
                                ],
                                'correctAnswer'  => 'E',
                            ],
                        ],
                    ],

                    // ── PART 3: Loneliness — Two students' discussion ──
                    [
                        'sectionNumber' => 3,
                        'audioUrl'      => url('files/audio/ielts_test1_part3_loneliness.mp3'),
                        'audioFileName' => 'ielts_test1_part3_loneliness.mp3',
                        'transcript'    =>
                            "STUDENT 1: I think urban design and a mobile workforce are responsible for the increase in loneliness.\n"
                            . "STUDENT 2: I agree. And I think dementia and cardiovascular disease are health risks based on solid evidence.\n"
                            . "STUDENT 1: About the evolutionary theory — I think it's misleading, and it needs further investigation.\n"
                            . "STUDENT 2: Yes. When we compare loneliness to depression, I think we express frustration that loneliness is not taken more seriously.\n"
                            . "STUDENT 1: I decided to start the presentation with an example from our own experience to highlight a situation that most students will recognise.\n"
                            . "STUDENT 2: Talking to strangers builds self-confidence, don't you think?\n"
                            . "STUDENT 1: Definitely. I find it difficult to understand why solitude is considered necessary for mental health.",
                        'questions' => [
                            // Q21–22: TWO things responsible for increase in loneliness
                            [
                                'questionNumber' => 21,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Questions 21–22: Which TWO things do the students both believe are responsible for the increase in loneliness? (Answer for Q21)',
                                'options'        => [
                                    'A' => 'social media',
                                    'B' => 'smaller nuclear families',
                                    'C' => 'urban design',
                                    'D' => 'longer lifespans',
                                    'E' => 'a mobile workforce',
                                ],
                                'correctAnswer'  => 'C',
                            ],
                            [
                                'questionNumber' => 22,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Questions 21–22: Which TWO things do the students both believe are responsible for the increase in loneliness? (Answer for Q22)',
                                'options'        => [
                                    'A' => 'social media',
                                    'B' => 'smaller nuclear families',
                                    'C' => 'urban design',
                                    'D' => 'longer lifespans',
                                    'E' => 'a mobile workforce',
                                ],
                                'correctAnswer'  => 'E',
                            ],
                            // Q23–24: TWO health risks with solid evidence
                            [
                                'questionNumber' => 23,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Questions 23–24: Which TWO health risks associated with loneliness do the students agree are based on solid evidence? (Answer for Q23)',
                                'options'        => [
                                    'A' => 'a weakened immune system',
                                    'B' => 'dementia',
                                    'C' => 'cancer',
                                    'D' => 'obesity',
                                    'E' => 'cardiovascular disease',
                                ],
                                'correctAnswer'  => 'B',
                            ],
                            [
                                'questionNumber' => 24,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Questions 23–24: Which TWO health risks associated with loneliness do the students agree are based on solid evidence? (Answer for Q24)',
                                'options'        => [
                                    'A' => 'a weakened immune system',
                                    'B' => 'dementia',
                                    'C' => 'cancer',
                                    'D' => 'obesity',
                                    'E' => 'cardiovascular disease',
                                ],
                                'correctAnswer'  => 'E',
                            ],
                            // Q25–26: TWO opinions on evolutionary theory
                            [
                                'questionNumber' => 25,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Questions 25–26: Which TWO opinions do both the students express about the evolutionary theory of loneliness? (Answer for Q25)',
                                'options'        => [
                                    'A' => 'It has little practical relevance.',
                                    'B' => 'It needs further investigation.',
                                    'C' => 'It is misleading.',
                                    'D' => 'It should be more widely accepted.',
                                    'E' => 'It is difficult to understand.',
                                ],
                                'correctAnswer'  => 'B',
                            ],
                            [
                                'questionNumber' => 26,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Questions 25–26: Which TWO opinions do both the students express about the evolutionary theory of loneliness? (Answer for Q26)',
                                'options'        => [
                                    'A' => 'It has little practical relevance.',
                                    'B' => 'It needs further investigation.',
                                    'C' => 'It is misleading.',
                                    'D' => 'It should be more widely accepted.',
                                    'E' => 'It is difficult to understand.',
                                ],
                                'correctAnswer'  => 'C',
                            ],
                            [
                                'questionNumber' => 27,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'When comparing loneliness to depression, the students',
                                'options'        => [
                                    'A' => 'doubt that there will ever be a medical cure for loneliness.',
                                    'B' => 'claim that the link between loneliness and mental health is overstated.',
                                    'C' => 'express frustration that loneliness is not taken more seriously.',
                                ],
                                'correctAnswer'  => 'C',
                            ],
                            [
                                'questionNumber' => 28,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Why do the students decide to start their presentation with an example from their own experience?',
                                'options'        => [
                                    'A' => 'to explain how difficult loneliness can be',
                                    'B' => 'to highlight a situation that most students will recognise',
                                    'C' => 'to emphasise that feeling lonely is more common for men than women',
                                ],
                                'correctAnswer'  => 'B',
                            ],
                            [
                                'questionNumber' => 29,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'The students agree that talking to strangers is a good strategy for dealing with loneliness because',
                                'options'        => [
                                    'A' => 'it creates a sense of belonging.',
                                    'B' => 'it builds self-confidence.',
                                    'C' => 'it makes people feel more positive.',
                                ],
                                'correctAnswer'  => 'B',
                            ],
                            [
                                'questionNumber' => 30,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'The students find it difficult to understand why solitude is considered to be',
                                'options'        => [
                                    'A' => 'similar to loneliness.',
                                    'B' => 'necessary for mental health.',
                                    'C' => 'an enjoyable experience.',
                                ],
                                'correctAnswer'  => 'B',
                            ],
                        ],
                    ],

                    // ── PART 4: Migration and language — Lecture ──
                    [
                        'sectionNumber' => 4,
                        'audioUrl'      => url('files/audio/ielts_test1_part4_migration.mp3'),
                        'audioFileName' => 'ielts_test1_part4_migration.mp3',
                        'transcript'    =>
                            "LECTURER: Good morning. Today I want to talk about migration patterns and their effects on language. "
                            . "First, I'll look at the reasons why people migrate — these include economic factors such as job opportunities, and also political reasons such as conflict. "
                            . "In the destination country, migrants often face challenges learning the local language. Studies show that children adapt more quickly than adults. "
                            . "The economic impact of migration on language is significant. Many companies now require workers to be bilingual. "
                            . "Language loss is another concern — when migrants stop using their mother tongue, this is called language attrition. "
                            . "Research suggests that community support plays a key role in maintaining the first language. "
                            . "Finally, I'd like to mention that in many cities, new dialects are forming — a combination of the local language and the migrants' languages. "
                            . "This is called a contact language, and it's actually very common in port cities historically.",
                        'questions' => [
                            [
                                'questionNumber' => 31,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'According to the lecturer, economic reasons for migration include',
                                'options'        => [
                                    'A' => 'political instability.',
                                    'B' => 'job opportunities.',
                                    'C' => 'climate change.',
                                ],
                                'correctAnswer'  => 'B',
                            ],
                            [
                                'questionNumber' => 32,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Studies show that when learning a new language,',
                                'options'        => [
                                    'A' => 'adults adapt more quickly than children.',
                                    'B' => 'children adapt more quickly than adults.',
                                    'C' => 'adults and children adapt at the same rate.',
                                ],
                                'correctAnswer'  => 'B',
                            ],
                            [
                                'questionNumber' => 33,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'The economic impact of migration on language means that',
                                'options'        => [
                                    'A' => 'fewer companies need bilingual workers.',
                                    'B' => 'many companies now require bilingual workers.',
                                    'C' => 'companies prefer workers who speak only the local language.',
                                ],
                                'correctAnswer'  => 'B',
                            ],
                            [
                                'questionNumber' => 34,
                                'questionType'   => 'note-completion',
                                'questionText'   => 'When migrants stop using their mother tongue, this is called language ________',
                                'correctAnswer'  => 'attrition',
                            ],
                            [
                                'questionNumber' => 35,
                                'questionType'   => 'note-completion',
                                'questionText'   => 'Research suggests that ________ support plays a key role in maintaining the first language',
                                'correctAnswer'  => 'community',
                            ],
                            [
                                'questionNumber' => 36,
                                'questionType'   => 'note-completion',
                                'questionText'   => 'New dialects forming in cities are a combination of the local language and migrants\' ________',
                                'correctAnswer'  => 'languages',
                            ],
                            [
                                'questionNumber' => 37,
                                'questionType'   => 'note-completion',
                                'questionText'   => 'A combination of two languages forming a new one is called a ________ language',
                                'correctAnswer'  => 'contact',
                            ],
                            [
                                'questionNumber' => 38,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Contact languages are historically very common in',
                                'options'        => [
                                    'A' => 'inland cities.',
                                    'B' => 'port cities.',
                                    'C' => 'capital cities.',
                                ],
                                'correctAnswer'  => 'B',
                            ],
                            [
                                'questionNumber' => 39,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'The lecturer suggests that language attrition is',
                                'options'        => [
                                    'A' => 'inevitable for all migrants.',
                                    'B' => 'a concern for language researchers.',
                                    'C' => 'beneficial for host countries.',
                                ],
                                'correctAnswer'  => 'B',
                            ],
                            [
                                'questionNumber' => 40,
                                'questionType'   => 'multiple-choice',
                                'questionText'   => 'Overall, the lecture focuses on',
                                'options'        => [
                                    'A' => 'the negative effects of migration on society.',
                                    'B' => 'migration patterns and their effects on language.',
                                    'C' => 'how to teach languages to migrants.',
                                ],
                                'correctAnswer'  => 'B',
                            ],
                        ],
                    ],
                ],
            ],
            'reading'  => ['passages' => []],
            'writing'  => ['tasks'    => []],
            'speaking' => ['parts'    => []],
        ];

        try {
            $result = IELTSService::publishIeltsExam($exam, 'Academic', $data);
            $this->command->info("  ✔ Seeded {$result['total_questions']} questions for exam #{$exam->eId}");
            $this->command->info("  ✔ 4 MP3 files placed in public/files/audio/");
        } catch (\Throwable $e) {
            $this->command->error("  ✗ Failed: " . $e->getMessage());
        }
    }
}
