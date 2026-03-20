<?php

namespace App\Services;

use App\Models\Exam;
use App\Models\Question;
use App\Models\Answer;

class IELTSService
{
    /**
     * Get IELTS standard structure (Official format 2024)
     */
    public static function getStandardStructure()
    {
        return [
            'listening' => [
                'duration' => 30, // + 10 minutes transfer time = 40 total
                'total_questions' => 40,
                'parts' => [
                    [
                        'part' => 1,
                        'name' => 'Social Context - Conversation',
                        'questions' => 10,
                        'description' => 'Conversation between two people in everyday social context (e.g. booking accommodation)',
                        'context' => 'social',
                        'speakers' => 2,
                        'question_types' => ['form_completion', 'note_completion', 'table_completion', 'short_answer']
                    ],
                    [
                        'part' => 2,
                        'name' => 'Social Context - Monologue',
                        'questions' => 10,
                        'description' => 'Monologue in everyday social context (e.g. speech about local facilities, guided tour)',
                        'context' => 'social',
                        'speakers' => 1,
                        'question_types' => ['multiple_choice', 'matching', 'plan_map_diagram_labelling', 'form_completion']
                    ],
                    [
                        'part' => 3,
                        'name' => 'Educational Context - Conversation',
                        'questions' => 10,
                        'description' => 'Conversation between up to 4 people in educational/training context (e.g. student discussion)',
                        'context' => 'educational',
                        'speakers' => '2-4',
                        'question_types' => ['multiple_choice', 'matching', 'flow_chart_completion', 'sentence_completion']
                    ],
                    [
                        'part' => 4,
                        'name' => 'Academic Context - Lecture',
                        'questions' => 10,
                        'description' => 'Monologue on academic subject (e.g. university lecture, academic presentation)',
                        'context' => 'academic',
                        'speakers' => 1,
                        'question_types' => ['sentence_completion', 'summary_completion', 'note_completion', 'multiple_choice']
                    ]
                ]
            ],
            'reading' => [
                'academic' => [
                    'duration' => 60,
                    'total_questions' => 40,
                    'passages' => 3,
                    'parts' => [
                        [
                            'passage' => 1,
                            'name' => 'Passage 1',
                            'questions' => [13, 14], // Usually 13-14 questions
                            'description' => 'Text from books, journals, magazines, newspapers for general interest',
                            'word_count' => [750, 900],
                            'difficulty' => 'easier',
                            'topics' => ['general_interest', 'factual', 'descriptive']
                        ],
                        [
                            'passage' => 2,
                            'name' => 'Passage 2',
                            'questions' => [13, 14],
                            'description' => 'Text related to work issues (training manuals, job descriptions, staff development)',
                            'word_count' => [750, 900],
                            'difficulty' => 'medium',
                            'topics' => ['work_related', 'training', 'professional']
                        ],
                        [
                            'passage' => 3,
                            'name' => 'Passage 3',
                            'questions' => [13, 14],
                            'description' => 'Text on academic topics suitable for undergraduate students',
                            'word_count' => [750, 900],
                            'difficulty' => 'harder',
                            'topics' => ['academic', 'research', 'analytical']
                        ]
                    ],
                    'question_types' => [
                        'multiple_choice',
                        'identifying_information', // True/False/Not Given
                        'identifying_writers_views', // Yes/No/Not Given
                        'matching_information',
                        'matching_headings',
                        'matching_features',
                        'matching_sentence_endings',
                        'sentence_completion',
                        'summary_completion',
                        'note_completion',
                        'table_completion',
                        'flow_chart_completion',
                        'diagram_label_completion',
                        'short_answer'
                    ]
                ],
                'general' => [
                    'duration' => 60,
                    'total_questions' => 40,
                    'sections' => 3,
                    'parts' => [
                        [
                            'section' => 1,
                            'name' => 'Social Survival',
                            'questions' => 14,
                            'description' => 'Texts relevant to basic linguistic survival in English-speaking countries',
                            'text_types' => ['advertisements', 'notices', 'timetables', 'brochures', 'leaflets'],
                            'difficulty' => 'easier',
                            'context' => 'everyday_life'
                        ],
                        [
                            'section' => 2,
                            'name' => 'Workplace Survival',
                            'questions' => 13,
                            'description' => 'Texts related to workplace survival in English-speaking countries',
                            'text_types' => ['job_descriptions', 'contracts', 'training_materials', 'staff_handbooks'],
                            'difficulty' => 'medium',
                            'context' => 'workplace'
                        ],
                        [
                            'section' => 3,
                            'name' => 'General Reading',
                            'questions' => 13,
                            'description' => 'More complex and lengthy texts on topics of general interest',
                            'text_types' => ['newspapers', 'magazines', 'books', 'reports'],
                            'difficulty' => 'harder',
                            'context' => 'general_interest'
                        ]
                    ],
                    'question_types' => [
                        'multiple_choice',
                        'identifying_information', // True/False/Not Given
                        'matching_information',
                        'matching_headings',
                        'sentence_completion',
                        'summary_completion',
                        'short_answer',
                        'table_completion',
                        'note_completion'
                    ]
                ]
            ],
            'writing' => [
                'academic' => [
                    'duration' => 60,
                    'total_tasks' => 2,
                    'tasks' => [
                        [
                            'task' => 1,
                            'name' => 'Academic Task 1 - Data Description',
                            'description' => 'Describe, summarise or explain visual information (graph, table, chart, diagram, map, process)',
                            'min_words' => 150,
                            'suggested_time' => 20,
                            'weight' => 33.33, // 1/3 of writing score
                            'type' => 'ielts_academic_task1',
                            'visual_types' => ['line_graph', 'bar_chart', 'pie_chart', 'table', 'diagram', 'map', 'process', 'multiple_charts']
                        ],
                        [
                            'task' => 2,
                            'name' => 'Academic Task 2 - Essay',
                            'description' => 'Write an essay in response to point of view, argument or problem (discursive essay)',
                            'min_words' => 250,
                            'suggested_time' => 40,
                            'weight' => 66.67, // 2/3 of writing score
                            'type' => 'ielts_academic_task2',
                            'essay_types' => ['opinion', 'discussion', 'problem_solution', 'advantages_disadvantages', 'two_part_question']
                        ]
                    ]
                ],
                'general' => [
                    'duration' => 60,
                    'total_tasks' => 2,
                    'tasks' => [
                        [
                            'task' => 1,
                            'name' => 'General Task 1 - Letter Writing',
                            'description' => 'Write a letter requesting information or explaining a situation (personal, semi-formal or formal)',
                            'min_words' => 150,
                            'suggested_time' => 20,
                            'weight' => 33.33,
                            'type' => 'ielts_general_task1',
                            'letter_types' => ['personal', 'semi_formal', 'formal'],
                            'purposes' => ['complaint', 'request', 'apology', 'invitation', 'application', 'explanation']
                        ],
                        [
                            'task' => 2,
                            'name' => 'General Task 2 - Essay',
                            'description' => 'Write an essay in response to point of view, argument or problem (same as Academic)',
                            'min_words' => 250,
                            'suggested_time' => 40,
                            'weight' => 66.67,
                            'type' => 'ielts_general_task2',
                            'essay_types' => ['opinion', 'discussion', 'problem_solution', 'advantages_disadvantages']
                        ]
                    ]
                ]
            ],
            'speaking' => [
                'duration' => [11, 14], // 11-14 minutes total
                'total_parts' => 3,
                'format' => 'face_to_face_interview',
                'parts' => [
                    [
                        'part' => 1,
                        'name' => 'Introduction and Interview',
                        'duration' => [4, 5],
                        'description' => 'General questions about yourself, home, family, work, studies and familiar topics',
                        'type' => 'ielts_speaking_part1',
                        'question_count' => [4, 6],
                        'topics' => ['home_accommodation', 'family', 'work_studies', 'interests_hobbies', 'hometown', 'daily_routine'],
                        'question_style' => 'short_answers'
                    ],
                    [
                        'part' => 2,
                        'name' => 'Long Turn (Cue Card)',
                        'duration' => [3, 4],
                        'description' => 'Speak for 1-2 minutes on a given topic after 1 minute preparation time',
                        'type' => 'ielts_speaking_part2',
                        'preparation_time' => 60, // 1 minute
                        'speaking_time' => [60, 120], // 1-2 minutes
                        'follow_up_questions' => [1, 2],
                        'cue_card_structure' => [
                            'main_topic',
                            'bullet_points_4',
                            'explain_why_important'
                        ]
                    ],
                    [
                        'part' => 3,
                        'name' => 'Two-way Discussion',
                        'duration' => [4, 5],
                        'description' => 'Discussion of more abstract ideas and issues related to Part 2 topic',
                        'type' => 'ielts_speaking_part3',
                        'question_types' => ['opinion', 'speculation', 'comparison', 'evaluation', 'analysis'],
                        'complexity' => 'abstract_conceptual',
                        'question_style' => 'extended_answers'
                    ]
                ]
            ]
        ];
    }

    /**
     * Get IELTS band scores (0-9 scale)
     */
    public static function getBandDescriptors()
    {
        return [
            9 => ['level' => 'Expert User', 'description' => 'Fully operational command of the language'],
            8 => ['level' => 'Very Good User', 'description' => 'Fully operational command with occasional inaccuracies'],
            7 => ['level' => 'Good User', 'description' => 'Operational command with occasional inaccuracies'],
            6 => ['level' => 'Competent User', 'description' => 'Generally effective command despite inaccuracies'],
            5 => ['level' => 'Modest User', 'description' => 'Partial command, copes with overall meaning'],
            4 => ['level' => 'Limited User', 'description' => 'Basic competence limited to familiar situations'],
            3 => ['level' => 'Extremely Limited User', 'description' => 'Conveys general meaning in familiar situations'],
            2 => ['level' => 'Intermittent User', 'description' => 'Great difficulty understanding spoken and written English'],
            1 => ['level' => 'Non User', 'description' => 'Essentially no ability to use the language'],
            0 => ['level' => 'Did not attempt', 'description' => 'No assessable information provided']
        ];
    }

    /**
     * Calculate IELTS overall band score
     */
    public static function calculateOverallBand($sectionScores)
    {
        // IELTS uses 0-9 band scale
        // Overall band = average of 4 skills, rounded to nearest 0.5
        $totalScore = 0;
        $sectionCount = 0;

        foreach ($sectionScores as $section => $score) {
            $totalScore += $score;
            $sectionCount++;
        }

        if ($sectionCount === 0) return 0;

        $averageScore = $totalScore / $sectionCount;
        
        // Round to nearest 0.5
        $overallBand = round($averageScore * 2) / 2;
        
        // Ensure within valid range
        $overallBand = max(0, min(9, $overallBand));

        return [
            'overall_band' => $overallBand,
            'section_scores' => $sectionScores,
            'band_descriptor' => self::getBandDescriptors()[$overallBand] ?? null
        ];
    }

    /**
     * Validate IELTS exam structure
     */
    public static function validateExamStructure(Exam $exam, $version = 'academic')
    {
        $errors = [];
        $structure = self::getStandardStructure();

        if (!in_array($exam->eType, ['IELTS', 'IELTS_ACADEMIC', 'IELTS_GENERAL'])) {
            return ['This is not an IELTS exam'];
        }

        // Check total duration (165 minutes = 30+60+60+15)
        $totalDuration = $exam->eDuration_minutes;
        $expectedDuration = 165;
        
        if ($totalDuration !== $expectedDuration) {
            $errors[] = "Total duration should be {$expectedDuration} minutes, got {$totalDuration}";
        }

        // Check questions by section
        $questionsBySection = $exam->questions->groupBy('qSection');
        
        // Listening validation
        $listeningQuestions = $questionsBySection->get('Listening', collect());
        if ($listeningQuestions->count() !== 40) {
            $errors[] = "Listening should have 40 questions, got " . $listeningQuestions->count();
        }

        // Reading validation
        $readingQuestions = $questionsBySection->get('Reading', collect());
        if ($readingQuestions->count() !== 40) {
            $errors[] = "Reading should have 40 questions, got " . $readingQuestions->count();
        }

        // Writing validation
        $writingQuestions = $questionsBySection->get('Writing', collect());
        if ($writingQuestions->count() !== 2) {
            $errors[] = "Writing should have 2 tasks, got " . $writingQuestions->count();
        }

        // Speaking validation
        $speakingQuestions = $questionsBySection->get('Speaking', collect());
        if ($speakingQuestions->count() !== 3) {
            $errors[] = "Speaking should have 3 parts, got " . $speakingQuestions->count();
        }

        return $errors;
    }

    /**
     * Get sample questions for IELTS sections
     */
    public static function getSampleQuestions($section, $part = null, $version = 'academic')
    {
        $samples = [
            'listening' => [
                'part1' => [
                    'content' => 'You will hear a conversation between a customer and a travel agent.',
                    'audio_script' => 'Customer: I\'d like to book a holiday to Australia. Agent: Certainly, when would you like to travel?',
                    'question_type' => 'form_completion',
                    'questions' => [
                        'Destination: ________',
                        'Departure date: ________',
                        'Number of passengers: ________'
                    ]
                ],
                'part2' => [
                    'content' => 'You will hear a talk about a local museum.',
                    'question_type' => 'multiple_choice',
                    'questions' => [
                        'The museum is open: A) Every day B) Weekdays only C) Weekends only'
                    ]
                ]
            ],
            'reading' => [
                'academic' => [
                    'passage' => 'Climate change represents one of the most significant challenges facing humanity in the 21st century...',
                    'questions' => [
                        ['type' => 'multiple_choice', 'question' => 'The main cause of climate change is:'],
                        ['type' => 'true_false_not_given', 'question' => 'All scientists agree on climate change causes.'],
                        ['type' => 'matching_headings', 'question' => 'Match the heading to paragraph B.']
                    ]
                ],
                'general' => [
                    'text' => 'LIBRARY OPENING HOURS: Monday-Friday: 9am-8pm, Saturday: 9am-5pm, Sunday: Closed',
                    'questions' => [
                        ['type' => 'multiple_choice', 'question' => 'When is the library closed?'],
                        ['type' => 'short_answer', 'question' => 'What time does the library close on Friday?']
                    ]
                ]
            ],
            'writing' => [
                'academic_task1' => [
                    'prompt' => 'The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
                    'type' => 'chart_description',
                    'min_words' => 150
                ],
                'academic_task2' => [
                    'prompt' => 'Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university should be to give access to knowledge for its own sake, regardless of whether the course is useful to an employer. What, in your opinion, should be the main function of a university?',
                    'type' => 'argumentative_essay',
                    'min_words' => 250
                ],
                'general_task1' => [
                    'prompt' => 'You recently bought a piece of equipment for your kitchen but it did not work. You phoned the shop but no action was taken. Write a letter to the shop manager.',
                    'type' => 'formal_letter',
                    'min_words' => 150
                ]
            ],
            'speaking' => [
                'part1' => [
                    'topics' => ['Work/Studies', 'Hometown', 'Accommodation'],
                    'sample_questions' => [
                        'What do you do? Do you work or are you a student?',
                        'Where are you from?',
                        'Do you live in a house or apartment?'
                    ]
                ],
                'part2' => [
                    'cue_card' => 'Describe a memorable journey you have made.',
                    'points' => [
                        'Where you went',
                        'How you travelled',
                        'Who you went with',
                        'And explain why this journey was memorable'
                    ],
                    'preparation_time' => 60,
                    'speaking_time' => 120
                ],
                'part3' => [
                    'topic' => 'Travel and Tourism',
                    'sample_questions' => [
                        'How has travel changed in recent years?',
                        'What are the benefits of international travel?',
                        'Do you think space tourism will become popular?'
                    ]
                ]
            ]
        ];

        return $samples[$section] ?? [];
    }

    /**
     * Get IELTS question types by section
     */
    public static function getQuestionTypes()
    {
        return [
            'listening' => [
                'form_completion',
                'note_completion', 
                'table_completion',
                'flow_chart_completion',
                'summary_completion',
                'sentence_completion',
                'multiple_choice',
                'matching',
                'plan_map_diagram_labelling',
                'short_answer'
            ],
            'reading' => [
                'multiple_choice',
                'identifying_information', // True/False/Not Given
                'identifying_writers_views', // Yes/No/Not Given
                'matching_information',
                'matching_headings',
                'matching_features',
                'matching_sentence_endings',
                'sentence_completion',
                'summary_completion',
                'note_completion',
                'table_completion',
                'flow_chart_completion',
                'diagram_label_completion',
                'short_answer'
            ],
            'writing' => [
                'ielts_academic_task1', // Charts, graphs, diagrams
                'ielts_academic_task2', // Essay
                'ielts_general_task1',  // Letter
                'ielts_general_task2'   // Essay
            ],
            'speaking' => [
                'ielts_speaking_part1', // Introduction & Interview
                'ielts_speaking_part2', // Long Turn
                'ielts_speaking_part3'  // Discussion
            ]
        ];
    }
}