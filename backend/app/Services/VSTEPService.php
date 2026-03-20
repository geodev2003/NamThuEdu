<?php

namespace App\Services;

use App\Models\Exam;
use App\Models\Question;
use App\Models\Answer;

class VSTEPService
{
    /**
     * Get VSTEP standard structure
     */
    public static function getStandardStructure()
    {
        return [
            'listening' => [
                'duration' => 40,
                'total_questions' => 35,
                'parts' => [
                    [
                        'part' => 1,
                        'name' => 'Announcements',
                        'questions' => 8,
                        'description' => 'Short announcements and instructions',
                        'type' => 'listening_announcement'
                    ],
                    [
                        'part' => 2,
                        'name' => 'Dialogues',
                        'questions' => 12,
                        'description' => 'Conversations between two or more people',
                        'type' => 'listening_dialogue'
                    ],
                    [
                        'part' => 3,
                        'name' => 'Lectures',
                        'questions' => 15,
                        'description' => 'Academic lectures and presentations',
                        'type' => 'listening_lecture'
                    ]
                ]
            ],
            'reading' => [
                'duration' => 60,
                'total_questions' => 40,
                'parts' => [
                    [
                        'part' => 1,
                        'name' => 'Passage 1',
                        'questions' => 10,
                        'description' => 'Short factual text (400-500 words)',
                        'word_count' => [400, 500]
                    ],
                    [
                        'part' => 2,
                        'name' => 'Passage 2',
                        'questions' => 10,
                        'description' => 'Descriptive or narrative text (400-500 words)',
                        'word_count' => [400, 500]
                    ],
                    [
                        'part' => 3,
                        'name' => 'Passage 3',
                        'questions' => 10,
                        'description' => 'Argumentative text (500-600 words)',
                        'word_count' => [500, 600]
                    ],
                    [
                        'part' => 4,
                        'name' => 'Passage 4',
                        'questions' => 10,
                        'description' => 'Academic text (600-700 words)',
                        'word_count' => [600, 700]
                    ]
                ]
            ],
            'writing' => [
                'duration' => 60,
                'total_questions' => 2,
                'parts' => [
                    [
                        'part' => 1,
                        'name' => 'Task 1 - Letter/Email',
                        'questions' => 1,
                        'description' => 'Write a letter or email (150 words minimum)',
                        'min_words' => 150,
                        'weight' => 33.33,
                        'time_suggestion' => 20
                    ],
                    [
                        'part' => 2,
                        'name' => 'Task 2 - Essay',
                        'questions' => 1,
                        'description' => 'Write an argumentative essay (250 words minimum)',
                        'min_words' => 250,
                        'weight' => 66.67,
                        'time_suggestion' => 40
                    ]
                ]
            ],
            'speaking' => [
                'duration' => 12,
                'total_questions' => 3,
                'parts' => [
                    [
                        'part' => 1,
                        'name' => 'Social Interaction',
                        'questions' => 1,
                        'description' => 'Answer 3-6 questions about familiar topics',
                        'duration' => 3,
                        'preparation_time' => 0
                    ],
                    [
                        'part' => 2,
                        'name' => 'Solution Discussion',
                        'questions' => 1,
                        'description' => 'Choose and explain a solution to a problem',
                        'duration' => 4,
                        'preparation_time' => 1
                    ],
                    [
                        'part' => 3,
                        'name' => 'Topic Development',
                        'questions' => 1,
                        'description' => 'Develop a topic with follow-up questions',
                        'duration' => 5,
                        'preparation_time' => 1,
                        'speaking_time' => 3,
                        'follow_up' => true
                    ]
                ]
            ]
        ];
    }

    /**
     * Validate VSTEP exam structure
     */
    public static function validateExamStructure(Exam $exam)
    {
        $errors = [];
        $structure = self::getStandardStructure();

        if ($exam->eType !== 'VSTEP') {
            return ['This is not a VSTEP exam'];
        }

        // Check total duration
        $totalDuration = $exam->eDuration_minutes;
        $expectedDuration = 172; // 40+60+60+12
        
        if ($totalDuration !== $expectedDuration) {
            $errors[] = "Total duration should be {$expectedDuration} minutes, got {$totalDuration}";
        }

        // Check questions by section
        $questionsBySection = $exam->questions->groupBy('qSection');
        
        foreach ($structure as $sectionName => $sectionData) {
            $sectionQuestions = $questionsBySection->get($sectionName, collect());
            $expectedCount = $sectionData['total_questions'];
            $actualCount = $sectionQuestions->count();
            
            if ($actualCount !== $expectedCount) {
                $errors[] = ucfirst($sectionName) . " should have {$expectedCount} questions, got {$actualCount}";
            }
        }

        return $errors;
    }

    /**
     * Get sample questions for VSTEP sections
     */
    public static function getSampleQuestions($sectionName, $partName = null)
    {
        $samples = [
            'listening' => [
                'announcements' => [
                    'content' => 'You will hear a short announcement about library hours. Choose the best answer.',
                    'audio_script' => 'The library will be closed this Saturday for maintenance. Normal hours will resume on Monday.',
                    'options' => [
                        'The library is open on Saturday',
                        'The library is closed for maintenance',
                        'The library has new hours',
                        'The library is permanently closed'
                    ],
                    'correct' => 1
                ],
                'dialogues' => [
                    'content' => 'You will hear a conversation between a student and a professor. Choose the best answer.',
                    'audio_script' => 'Student: Professor, I missed the deadline for the assignment. Professor: You can submit it tomorrow, but there will be a 10% penalty.',
                    'options' => [
                        'The student can submit without penalty',
                        'The student cannot submit the assignment',
                        'The student can submit with a penalty',
                        'The professor extended the deadline'
                    ],
                    'correct' => 2
                ],
                'lectures' => [
                    'content' => 'You will hear part of a lecture about climate change. Choose the best answer.',
                    'audio_script' => 'Climate change affects global weather patterns, leading to more extreme weather events such as hurricanes, droughts, and floods.',
                    'options' => [
                        'Climate change only affects temperature',
                        'Climate change causes extreme weather',
                        'Climate change is not real',
                        'Climate change only affects oceans'
                    ],
                    'correct' => 1
                ]
            ],
            'reading' => [
                'passage_1' => [
                    'content' => 'Read the following passage and answer the questions.',
                    'passage' => 'The Internet has revolutionized the way we communicate, work, and access information. It has connected people across the globe and made information readily available at our fingertips. However, it has also brought challenges such as privacy concerns and information overload.',
                    'question' => 'What is the main idea of the passage?',
                    'options' => [
                        'The Internet only has positive effects',
                        'The Internet has both benefits and challenges',
                        'The Internet is dangerous',
                        'The Internet is not useful'
                    ],
                    'correct' => 1
                ]
            ],
            'writing' => [
                'task_1' => [
                    'content' => 'You have received the following email from your friend. Write a reply (150 words minimum).',
                    'prompt' => "Hi! I'm planning to visit your city next month. Could you recommend some places to visit and good restaurants? Also, what's the weather like in March? Thanks!",
                    'sample_response' => 'Hi [Friend\'s name], I\'m so excited that you\'re coming to visit! There are many great places to see here. I recommend visiting the Old Quarter for its historical architecture and the National Museum for local culture. For restaurants, try [Restaurant name] for traditional food and [Cafe name] for great coffee. The weather in March is usually mild with temperatures around 20-25°C, so bring light layers. Let me know your exact dates and I can show you around! Looking forward to seeing you soon. Best regards, [Your name]'
                ],
                'task_2' => [
                    'content' => 'Write an essay (250 words minimum) on the following topic:',
                    'prompt' => 'Some people believe that social media has a positive impact on society, while others think it has negative effects. Discuss both views and give your own opinion.',
                    'sample_response' => 'Social media has become an integral part of modern society, sparking debates about its impact. This essay will examine both positive and negative perspectives before presenting my own view. Supporters argue that social media enhances communication and connectivity. It allows people to maintain relationships across distances, share experiences instantly, and access diverse perspectives. Additionally, it provides platforms for education, business promotion, and social movements. Critics, however, highlight several concerns. They point to issues like cyberbullying, privacy violations, and the spread of misinformation. Social media can also contribute to mental health problems, particularly among young people who may develop unrealistic expectations from curated online content. In my opinion, social media\'s impact depends largely on how it is used. When used responsibly, it can be a powerful tool for positive change and connection. However, users must be educated about digital literacy and platforms should implement better safeguards. The key is finding balance and promoting healthy usage habits rather than avoiding these technologies entirely.'
                ]
            ],
            'speaking' => [
                'social_interaction' => [
                    'content' => 'Let\'s talk about your daily routine.',
                    'questions' => [
                        'What time do you usually get up?',
                        'What do you usually have for breakfast?',
                        'How do you get to work/school?',
                        'What do you like to do in your free time?'
                    ]
                ],
                'solution_discussion' => [
                    'content' => 'Your friend wants to improve their English but doesn\'t have much time. Here are three suggestions:',
                    'options' => [
                        'Take an online course',
                        'Watch English movies with subtitles',
                        'Join an English conversation club'
                    ],
                    'task' => 'Which do you think is the best solution? Explain your choice.'
                ],
                'topic_development' => [
                    'content' => 'Describe the advantages and disadvantages of living in a big city.',
                    'preparation_time' => '1 minute to prepare',
                    'speaking_time' => '3 minutes to speak',
                    'follow_up' => 'The examiner may ask follow-up questions'
                ]
            ]
        ];

        return $samples[$sectionName] ?? [];
    }

    /**
     * Calculate VSTEP scores according to official scoring
     */
    public static function calculateVSTEPScore($sectionScores)
    {
        // VSTEP scoring: 0-10 scale
        // Each section contributes equally (25% each)
        $totalScore = 0;
        $sectionCount = 0;

        foreach ($sectionScores as $section => $score) {
            $totalScore += $score;
            $sectionCount++;
        }

        $averageScore = $sectionCount > 0 ? $totalScore / $sectionCount : 0;

        // Determine CEFR level based on score
        $level = 'No level';
        if ($averageScore >= 8.5) {
            $level = 'C1';
        } elseif ($averageScore >= 6.0) {
            $level = 'B2';
        } elseif ($averageScore >= 4.0) {
            $level = 'B1';
        }

        return [
            'total_score' => round($averageScore, 2),
            'cefr_level' => $level,
            'section_scores' => $sectionScores,
            'pass_status' => $averageScore >= 4.0 ? 'Pass' : 'Fail'
        ];
    }
}