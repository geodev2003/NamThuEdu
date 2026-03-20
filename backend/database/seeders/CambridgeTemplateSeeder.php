<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ExamTemplate;
use App\Models\TemplateSection;

class CambridgeTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Cambridge Young Learners Templates
        $this->createStartersTemplate();
        $this->createMoversTemplate();
        $this->createFlyersTemplate();
        
        // Cambridge Main Suite Templates
        $this->createKETTemplate();
        $this->createPETTemplate();
        $this->createFCETemplate();
        $this->createCAETemplate();
        
        // Enhanced International Templates
        $this->createIELTSTemplate();
        $this->createVSTEPTemplate();
    }

    private function createStartersTemplate()
    {
        $template = ExamTemplate::create([
            'template_code' => 'STARTERS',
            'template_name' => 'Cambridge English Starters',
            'category' => 'cambridge_young',
            'level' => 'pre_a1',
            'age_group' => '6-8',
            'total_duration_minutes' => 45,
            'skills' => ['listening', 'reading', 'speaking'],
            'description' => 'Cambridge English Starters is the first of three Cambridge English Qualifications designed for young learners.',
            'instructions' => 'This test is designed for children aged 6-8 years old. It includes fun activities with pictures, colors and games.',
            'sections' => [
                [
                    'name' => 'Listening',
                    'duration' => 20,
                    'questions' => 20,
                    'parts' => [
                        [
                            'part' => 1,
                            'name' => 'Listen and draw lines',
                            'questions' => 5,
                            'type' => 'matching_lines',
                            'instructions' => 'Listen and draw a line from each name to the correct person.'
                        ],
                        [
                            'part' => 2,
                            'name' => 'Listen and write',
                            'questions' => 5,
                            'type' => 'fill_blank',
                            'instructions' => 'Listen and write a name or a number.'
                        ],
                        [
                            'part' => 3,
                            'name' => 'Listen and tick the box',
                            'questions' => 5,
                            'type' => 'multiple_choice',
                            'instructions' => 'Listen and tick (✓) the box.'
                        ],
                        [
                            'part' => 4,
                            'name' => 'Listen and colour',
                            'questions' => 5,
                            'type' => 'coloring',
                            'instructions' => 'Listen and colour.'
                        ]
                    ]
                ],
                [
                    'name' => 'Reading and Writing',
                    'duration' => 20,
                    'questions' => 25,
                    'parts' => [
                        [
                            'part' => 1,
                            'name' => 'Look and read',
                            'questions' => 5,
                            'type' => 'true_false',
                            'instructions' => 'Look and read. Put a tick (✓) or a cross (✗) in the box.'
                        ],
                        [
                            'part' => 2,
                            'name' => 'Look and read',
                            'questions' => 6,
                            'type' => 'multiple_choice',
                            'instructions' => 'Look and read. Write yes or no.'
                        ],
                        [
                            'part' => 3,
                            'name' => 'Look at the pictures and read the story',
                            'questions' => 5,
                            'type' => 'fill_blank',
                            'instructions' => 'Choose a word from the box. Write the correct word next to numbers 1-5.'
                        ],
                        [
                            'part' => 4,
                            'name' => 'Read this',
                            'questions' => 5,
                            'type' => 'multiple_choice',
                            'instructions' => 'Read the text. Choose the right words and write them on the lines.'
                        ],
                        [
                            'part' => 5,
                            'name' => 'Look at the picture and read the questions',
                            'questions' => 3,
                            'type' => 'short_answer',
                            'instructions' => 'Write one-word answers.'
                        ]
                    ]
                ],
                [
                    'name' => 'Speaking',
                    'duration' => 5,
                    'questions' => 9,
                    'parts' => [
                        [
                            'part' => 1,
                            'name' => 'What\'s this?',
                            'questions' => 5,
                            'type' => 'speaking_identification',
                            'instructions' => 'Point to the pictures and name them.'
                        ],
                        [
                            'part' => 2,
                            'name' => 'Find the differences',
                            'questions' => 4,
                            'type' => 'speaking_comparison',
                            'instructions' => 'Find the four differences between the two pictures.'
                        ]
                    ]
                ]
            ]
        ]);

        // Create template sections
        foreach ($template->sections as $index => $section) {
            TemplateSection::create([
                'template_id' => $template->id,
                'section_name' => $section['name'],
                'section_order' => $index + 1,
                'duration_minutes' => $section['duration'],
                'question_count' => $section['questions'],
                'question_types' => collect($section['parts'])->pluck('type')->unique()->values()->toArray(),
                'instructions' => 'Complete all parts in this section.',
                'section_config' => $section
            ]);
        }
    }

    private function createMoversTemplate()
    {
        $template = ExamTemplate::create([
            'template_code' => 'MOVERS',
            'template_name' => 'Cambridge English Movers',
            'category' => 'cambridge_young',
            'level' => 'a1',
            'age_group' => '8-11',
            'total_duration_minutes' => 62,
            'skills' => ['listening', 'reading', 'speaking'],
            'description' => 'Cambridge English Movers is the second of three Cambridge English Qualifications designed for young learners.',
            'instructions' => 'This test is designed for children aged 8-11 years old.',
            'sections' => [
                [
                    'name' => 'Listening',
                    'duration' => 25,
                    'questions' => 25,
                    'parts' => [
                        ['part' => 1, 'name' => 'Listen and draw lines', 'questions' => 5, 'type' => 'matching_lines'],
                        ['part' => 2, 'name' => 'Listen and write', 'questions' => 6, 'type' => 'fill_blank'],
                        ['part' => 3, 'name' => 'Listen and tick', 'questions' => 6, 'type' => 'multiple_choice'],
                        ['part' => 4, 'name' => 'Listen and colour and write', 'questions' => 5, 'type' => 'coloring'],
                        ['part' => 5, 'name' => 'Listen and colour and write', 'questions' => 3, 'type' => 'fill_blank']
                    ]
                ],
                [
                    'name' => 'Reading and Writing',
                    'duration' => 30,
                    'questions' => 35,
                    'parts' => [
                        ['part' => 1, 'name' => 'Look and read', 'questions' => 6, 'type' => 'true_false'],
                        ['part' => 2, 'name' => 'Look and read', 'questions' => 6, 'type' => 'multiple_choice'],
                        ['part' => 3, 'name' => 'Look at the pictures and read the story', 'questions' => 6, 'type' => 'fill_blank'],
                        ['part' => 4, 'name' => 'Read the text and choose the missing words', 'questions' => 5, 'type' => 'multiple_choice'],
                        ['part' => 5, 'name' => 'Look at the picture and read the story', 'questions' => 7, 'type' => 'fill_blank'],
                        ['part' => 6, 'name' => 'Read and write', 'questions' => 5, 'type' => 'short_answer']
                    ]
                ],
                [
                    'name' => 'Speaking',
                    'duration' => 7,
                    'questions' => 4,
                    'parts' => [
                        ['part' => 1, 'name' => 'Find the differences', 'questions' => 4, 'type' => 'speaking_comparison']
                    ]
                ]
            ]
        ]);

        foreach ($template->sections as $index => $section) {
            TemplateSection::create([
                'template_id' => $template->id,
                'section_name' => $section['name'],
                'section_order' => $index + 1,
                'duration_minutes' => $section['duration'],
                'question_count' => $section['questions'],
                'question_types' => collect($section['parts'])->pluck('type')->unique()->values()->toArray(),
                'instructions' => 'Complete all parts in this section.',
                'section_config' => $section
            ]);
        }
    }

    private function createFlyersTemplate()
    {
        $template = ExamTemplate::create([
            'template_code' => 'FLYERS',
            'template_name' => 'Cambridge English Flyers',
            'category' => 'cambridge_young',
            'level' => 'a2',
            'age_group' => '9-12',
            'total_duration_minutes' => 72,
            'skills' => ['listening', 'reading', 'speaking'],
            'description' => 'Cambridge English Flyers is the third of three Cambridge English Qualifications designed for young learners.',
            'sections' => [
                [
                    'name' => 'Listening',
                    'duration' => 25,
                    'questions' => 25
                ],
                [
                    'name' => 'Reading and Writing',
                    'duration' => 40,
                    'questions' => 44
                ],
                [
                    'name' => 'Speaking',
                    'duration' => 9,
                    'questions' => 4
                ]
            ]
        ]);
    }

    private function createKETTemplate()
    {
        $template = ExamTemplate::create([
            'template_code' => 'KET',
            'template_name' => 'Cambridge English Key (KET)',
            'category' => 'cambridge_main',
            'level' => 'a2',
            'age_group' => 'adult',
            'total_duration_minutes' => 110,
            'skills' => ['reading', 'writing', 'listening', 'speaking'],
            'description' => 'Cambridge English Key, also known as Key English Test (KET), is a basic-level qualification.',
            'sections' => [
                [
                    'name' => 'Reading and Writing',
                    'duration' => 60,
                    'questions' => 56,
                    'parts' => [
                        ['part' => 1, 'name' => 'Multiple choice', 'questions' => 6, 'type' => 'multiple_choice'],
                        ['part' => 2, 'name' => 'Matching', 'questions' => 7, 'type' => 'matching'],
                        ['part' => 3, 'name' => 'Multiple choice', 'questions' => 8, 'type' => 'multiple_choice'],
                        ['part' => 4, 'name' => 'Right or Wrong', 'questions' => 7, 'type' => 'true_false'],
                        ['part' => 5, 'name' => 'Multiple choice cloze', 'questions' => 8, 'type' => 'multiple_choice_cloze'],
                        ['part' => 6, 'name' => 'Word completion', 'questions' => 5, 'type' => 'word_completion'],
                        ['part' => 7, 'name' => 'Open cloze', 'questions' => 10, 'type' => 'open_cloze'],
                        ['part' => 8, 'name' => 'Information transfer', 'questions' => 5, 'type' => 'information_transfer'],
                        ['part' => 9, 'name' => 'Short message', 'questions' => 1, 'type' => 'short_writing']
                    ]
                ],
                [
                    'name' => 'Listening',
                    'duration' => 30,
                    'questions' => 25
                ],
                [
                    'name' => 'Speaking',
                    'duration' => 10,
                    'questions' => 2
                ]
            ]
        ]);
    }

    private function createPETTemplate()
    {
        ExamTemplate::create([
            'template_code' => 'PET',
            'template_name' => 'Cambridge English Preliminary (PET)',
            'category' => 'cambridge_main',
            'level' => 'b1',
            'age_group' => 'adult',
            'total_duration_minutes' => 140,
            'skills' => ['reading', 'writing', 'listening', 'speaking'],
            'description' => 'Cambridge English Preliminary, also known as Preliminary English Test (PET), is an intermediate-level qualification.',
            'sections' => [
                ['name' => 'Reading', 'duration' => 45, 'questions' => 35],
                ['name' => 'Writing', 'duration' => 45, 'questions' => 3],
                ['name' => 'Listening', 'duration' => 30, 'questions' => 25],
                ['name' => 'Speaking', 'duration' => 14, 'questions' => 4]
            ]
        ]);
    }

    private function createFCETemplate()
    {
        ExamTemplate::create([
            'template_code' => 'FCE',
            'template_name' => 'Cambridge English First (FCE)',
            'category' => 'cambridge_main',
            'level' => 'b2',
            'age_group' => 'adult',
            'total_duration_minutes' => 209,
            'skills' => ['reading', 'writing', 'listening', 'speaking'],
            'description' => 'Cambridge English First, also known as First Certificate in English (FCE), is an upper-intermediate level qualification.',
            'sections' => [
                ['name' => 'Reading and Use of English', 'duration' => 75, 'questions' => 52],
                ['name' => 'Writing', 'duration' => 80, 'questions' => 2],
                ['name' => 'Listening', 'duration' => 40, 'questions' => 30],
                ['name' => 'Speaking', 'duration' => 14, 'questions' => 4]
            ]
        ]);
    }

    private function createCAETemplate()
    {
        ExamTemplate::create([
            'template_code' => 'CAE',
            'template_name' => 'Cambridge English Advanced (CAE)',
            'category' => 'cambridge_main',
            'level' => 'c1',
            'age_group' => 'adult',
            'total_duration_minutes' => 235,
            'skills' => ['reading', 'writing', 'listening', 'speaking'],
            'description' => 'Cambridge English Advanced, also known as Certificate in Advanced English (CAE), is a high-level qualification.',
            'sections' => [
                ['name' => 'Reading and Use of English', 'duration' => 90, 'questions' => 56],
                ['name' => 'Writing', 'duration' => 90, 'questions' => 2],
                ['name' => 'Listening', 'duration' => 40, 'questions' => 30],
                ['name' => 'Speaking', 'duration' => 15, 'questions' => 4]
            ]
        ]);
    }

    private function createIELTSTemplate()
    {
        // IELTS Academic Template
        $academicTemplate = ExamTemplate::create([
            'template_code' => 'IELTS_ACADEMIC',
            'template_name' => 'IELTS Academic Test',
            'category' => 'international',
            'level' => 'b1',
            'age_group' => 'adult',
            'total_duration_minutes' => 165, // 30+60+60+15 (actual test time, not including breaks)
            'skills' => ['listening', 'reading', 'writing', 'speaking'],
            'description' => 'IELTS Academic test for university admission and professional registration.',
            'sections' => [
                [
                    'name' => 'Listening',
                    'duration' => 30, // + 10 minutes transfer time
                    'questions' => 40,
                    'parts' => [
                        [
                            'part' => 1,
                            'name' => 'Social Context - Conversation',
                            'questions' => 10,
                            'type' => 'ielts_listening_part1',
                            'description' => 'Conversation between two people in everyday social context',
                            'context' => 'social',
                            'speakers' => 2
                        ],
                        [
                            'part' => 2,
                            'name' => 'Social Context - Monologue',
                            'questions' => 10,
                            'type' => 'ielts_listening_part2',
                            'description' => 'Monologue in everyday social context',
                            'context' => 'social',
                            'speakers' => 1
                        ],
                        [
                            'part' => 3,
                            'name' => 'Educational Context - Conversation',
                            'questions' => 10,
                            'type' => 'ielts_listening_part3',
                            'description' => 'Conversation in educational/training context',
                            'context' => 'educational',
                            'speakers' => '2-4'
                        ],
                        [
                            'part' => 4,
                            'name' => 'Academic Context - Lecture',
                            'questions' => 10,
                            'type' => 'ielts_listening_part4',
                            'description' => 'Monologue on academic subject',
                            'context' => 'academic',
                            'speakers' => 1
                        ]
                    ]
                ],
                [
                    'name' => 'Reading',
                    'duration' => 60,
                    'questions' => 40,
                    'parts' => [
                        [
                            'part' => 1,
                            'name' => 'Passage 1',
                            'questions' => 13,
                            'type' => 'ielts_reading_academic',
                            'description' => 'Text from books, journals, magazines for general interest',
                            'difficulty' => 'easier'
                        ],
                        [
                            'part' => 2,
                            'name' => 'Passage 2',
                            'questions' => 13,
                            'type' => 'ielts_reading_academic',
                            'description' => 'Text related to work issues and training',
                            'difficulty' => 'medium'
                        ],
                        [
                            'part' => 3,
                            'name' => 'Passage 3',
                            'questions' => 14,
                            'type' => 'ielts_reading_academic',
                            'description' => 'Academic text suitable for undergraduate students',
                            'difficulty' => 'harder'
                        ]
                    ]
                ],
                [
                    'name' => 'Writing',
                    'duration' => 60,
                    'questions' => 2,
                    'parts' => [
                        [
                            'part' => 1,
                            'name' => 'Task 1 - Data Description',
                            'questions' => 1,
                            'type' => 'ielts_academic_task1',
                            'description' => 'Describe visual information (150+ words)',
                            'min_words' => 150,
                            'suggested_time' => 20,
                            'weight' => 33.33
                        ],
                        [
                            'part' => 2,
                            'name' => 'Task 2 - Essay',
                            'questions' => 1,
                            'type' => 'ielts_academic_task2',
                            'description' => 'Write discursive essay (250+ words)',
                            'min_words' => 250,
                            'suggested_time' => 40,
                            'weight' => 66.67
                        ]
                    ]
                ],
                [
                    'name' => 'Speaking',
                    'duration' => 14, // 11-14 minutes
                    'questions' => 3,
                    'parts' => [
                        [
                            'part' => 1,
                            'name' => 'Introduction and Interview',
                            'questions' => 1,
                            'type' => 'ielts_speaking_part1',
                            'description' => 'General questions (4-5 minutes)',
                            'duration' => 5
                        ],
                        [
                            'part' => 2,
                            'name' => 'Long Turn (Cue Card)',
                            'questions' => 1,
                            'type' => 'ielts_speaking_part2',
                            'description' => '1-2 minutes speech after 1 minute preparation',
                            'duration' => 4,
                            'preparation_time' => 1
                        ],
                        [
                            'part' => 3,
                            'name' => 'Two-way Discussion',
                            'questions' => 1,
                            'type' => 'ielts_speaking_part3',
                            'description' => 'Abstract discussion (4-5 minutes)',
                            'duration' => 5
                        ]
                    ]
                ]
            ]
        ]);

        // Create template sections for Academic
        foreach ($academicTemplate->sections as $index => $section) {
            TemplateSection::create([
                'template_id' => $academicTemplate->id,
                'section_name' => $section['name'],
                'section_order' => $index + 1,
                'duration_minutes' => $section['duration'],
                'question_count' => $section['questions'],
                'question_types' => collect($section['parts'])->pluck('type')->unique()->values()->toArray(),
                'instructions' => 'Complete all parts in this section according to IELTS format.',
                'section_config' => $section
            ]);
        }

        // IELTS General Training Template
        $generalTemplate = ExamTemplate::create([
            'template_code' => 'IELTS_GENERAL',
            'template_name' => 'IELTS General Training Test',
            'category' => 'international',
            'level' => 'b1',
            'age_group' => 'adult',
            'total_duration_minutes' => 165,
            'skills' => ['listening', 'reading', 'writing', 'speaking'],
            'description' => 'IELTS General Training test for immigration and work purposes.',
            'sections' => [
                [
                    'name' => 'Listening',
                    'duration' => 30,
                    'questions' => 40,
                    'parts' => [
                        [
                            'part' => 1,
                            'name' => 'Social Context - Conversation',
                            'questions' => 10,
                            'type' => 'ielts_listening_part1',
                            'description' => 'Conversation between two people in everyday social context'
                        ],
                        [
                            'part' => 2,
                            'name' => 'Social Context - Monologue',
                            'questions' => 10,
                            'type' => 'ielts_listening_part2',
                            'description' => 'Monologue in everyday social context'
                        ],
                        [
                            'part' => 3,
                            'name' => 'Educational Context - Conversation',
                            'questions' => 10,
                            'type' => 'ielts_listening_part3',
                            'description' => 'Conversation in educational/training context'
                        ],
                        [
                            'part' => 4,
                            'name' => 'Academic Context - Lecture',
                            'questions' => 10,
                            'type' => 'ielts_listening_part4',
                            'description' => 'Monologue on academic subject'
                        ]
                    ]
                ],
                [
                    'name' => 'Reading',
                    'duration' => 60,
                    'questions' => 40,
                    'parts' => [
                        [
                            'part' => 1,
                            'name' => 'Section 1 - Social Survival',
                            'questions' => 14,
                            'type' => 'ielts_reading_general',
                            'description' => 'Texts for basic linguistic survival',
                            'context' => 'everyday_life'
                        ],
                        [
                            'part' => 2,
                            'name' => 'Section 2 - Workplace Survival',
                            'questions' => 13,
                            'type' => 'ielts_reading_general',
                            'description' => 'Texts related to workplace survival',
                            'context' => 'workplace'
                        ],
                        [
                            'part' => 3,
                            'name' => 'Section 3 - General Reading',
                            'questions' => 13,
                            'type' => 'ielts_reading_general',
                            'description' => 'Complex texts on general interest topics',
                            'context' => 'general_interest'
                        ]
                    ]
                ],
                [
                    'name' => 'Writing',
                    'duration' => 60,
                    'questions' => 2,
                    'parts' => [
                        [
                            'part' => 1,
                            'name' => 'Task 1 - Letter Writing',
                            'questions' => 1,
                            'type' => 'ielts_general_task1',
                            'description' => 'Write a letter (150+ words)',
                            'min_words' => 150,
                            'suggested_time' => 20,
                            'weight' => 33.33
                        ],
                        [
                            'part' => 2,
                            'name' => 'Task 2 - Essay',
                            'questions' => 1,
                            'type' => 'ielts_general_task2',
                            'description' => 'Write an essay (250+ words)',
                            'min_words' => 250,
                            'suggested_time' => 40,
                            'weight' => 66.67
                        ]
                    ]
                ],
                [
                    'name' => 'Speaking',
                    'duration' => 14,
                    'questions' => 3,
                    'parts' => [
                        [
                            'part' => 1,
                            'name' => 'Introduction and Interview',
                            'questions' => 1,
                            'type' => 'ielts_speaking_part1',
                            'description' => 'General questions (4-5 minutes)',
                            'duration' => 5
                        ],
                        [
                            'part' => 2,
                            'name' => 'Long Turn (Cue Card)',
                            'questions' => 1,
                            'type' => 'ielts_speaking_part2',
                            'description' => '1-2 minutes speech after 1 minute preparation',
                            'duration' => 4
                        ],
                        [
                            'part' => 3,
                            'name' => 'Two-way Discussion',
                            'questions' => 1,
                            'type' => 'ielts_speaking_part3',
                            'description' => 'Abstract discussion (4-5 minutes)',
                            'duration' => 5
                        ]
                    ]
                ]
            ]
        ]);

        // Create template sections for General Training
        foreach ($generalTemplate->sections as $index => $section) {
            TemplateSection::create([
                'template_id' => $generalTemplate->id,
                'section_name' => $section['name'],
                'section_order' => $index + 1,
                'duration_minutes' => $section['duration'],
                'question_count' => $section['questions'],
                'question_types' => collect($section['parts'])->pluck('type')->unique()->values()->toArray(),
                'instructions' => 'Complete all parts in this section according to IELTS format.',
                'section_config' => $section
            ]);
        }
    }

    private function createVSTEPTemplate()
    {
        ExamTemplate::create([
            'template_code' => 'VSTEP',
            'template_name' => 'Vietnamese Standardized Test of English Proficiency',
            'category' => 'international',
            'level' => 'b1',
            'age_group' => 'adult',
            'total_duration_minutes' => 172, // 40+60+60+12
            'skills' => ['listening', 'reading', 'writing', 'speaking'],
            'description' => 'Vietnamese national English proficiency test following official VSTEP format.',
            'sections' => [
                [
                    'name' => 'Listening',
                    'duration' => 40,
                    'questions' => 35,
                    'parts' => [
                        [
                            'part' => 1, 
                            'name' => 'Announcements', 
                            'questions' => 8, 
                            'type' => 'multiple_choice',
                            'description' => 'Short announcements and instructions'
                        ],
                        [
                            'part' => 2, 
                            'name' => 'Dialogues', 
                            'questions' => 12, 
                            'type' => 'multiple_choice',
                            'description' => 'Conversations between two or more people'
                        ],
                        [
                            'part' => 3, 
                            'name' => 'Lectures', 
                            'questions' => 15, 
                            'type' => 'multiple_choice',
                            'description' => 'Academic lectures and presentations'
                        ]
                    ]
                ],
                [
                    'name' => 'Reading',
                    'duration' => 60,
                    'questions' => 40,
                    'parts' => [
                        [
                            'part' => 1,
                            'name' => 'Passage 1',
                            'questions' => 10,
                            'type' => 'multiple_choice',
                            'description' => 'Short factual text (400-500 words)'
                        ],
                        [
                            'part' => 2,
                            'name' => 'Passage 2', 
                            'questions' => 10,
                            'type' => 'multiple_choice',
                            'description' => 'Descriptive or narrative text (400-500 words)'
                        ],
                        [
                            'part' => 3,
                            'name' => 'Passage 3',
                            'questions' => 10,
                            'type' => 'multiple_choice',
                            'description' => 'Argumentative text (500-600 words)'
                        ],
                        [
                            'part' => 4,
                            'name' => 'Passage 4',
                            'questions' => 10,
                            'type' => 'multiple_choice',
                            'description' => 'Academic text (600-700 words)'
                        ]
                    ]
                ],
                [
                    'name' => 'Writing',
                    'duration' => 60,
                    'questions' => 2,
                    'parts' => [
                        [
                            'part' => 1,
                            'name' => 'Task 1 - Letter/Email',
                            'questions' => 1,
                            'type' => 'short_writing',
                            'description' => 'Write a letter or email (150 words minimum)',
                            'weight' => 33.33 // 1/3 of writing score
                        ],
                        [
                            'part' => 2,
                            'name' => 'Task 2 - Essay',
                            'questions' => 1,
                            'type' => 'essay',
                            'description' => 'Write an argumentative essay (250 words minimum)',
                            'weight' => 66.67 // 2/3 of writing score
                        ]
                    ]
                ],
                [
                    'name' => 'Speaking',
                    'duration' => 12,
                    'questions' => 3,
                    'parts' => [
                        [
                            'part' => 1,
                            'name' => 'Social Interaction',
                            'questions' => 1,
                            'type' => 'speaking_interaction',
                            'description' => 'Answer 3-6 questions about familiar topics (3 minutes)',
                            'duration' => 3
                        ],
                        [
                            'part' => 2,
                            'name' => 'Solution Discussion',
                            'questions' => 1,
                            'type' => 'speaking_solution',
                            'description' => 'Choose and explain a solution to a problem (4 minutes)',
                            'duration' => 4
                        ],
                        [
                            'part' => 3,
                            'name' => 'Topic Development',
                            'questions' => 1,
                            'type' => 'speaking_topic',
                            'description' => 'Develop a topic with follow-up questions (5 minutes)',
                            'duration' => 5
                        ]
                    ]
                ]
            ]
        ]);
    }
}