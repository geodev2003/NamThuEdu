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
        ExamTemplate::create([
            'template_code' => 'IELTS',
            'template_name' => 'IELTS Academic/General Training',
            'category' => 'international',
            'level' => 'b1',
            'age_group' => 'adult',
            'total_duration_minutes' => 165,
            'skills' => ['reading', 'writing', 'listening', 'speaking'],
            'description' => 'International English Language Testing System - Academic and General Training versions.',
            'sections' => [
                ['name' => 'Listening', 'duration' => 30, 'questions' => 40],
                ['name' => 'Reading', 'duration' => 60, 'questions' => 40],
                ['name' => 'Writing', 'duration' => 60, 'questions' => 2],
                ['name' => 'Speaking', 'duration' => 15, 'questions' => 3]
            ]
        ]);
    }

    private function createVSTEPTemplate()
    {
        ExamTemplate::create([
            'template_code' => 'VSTEP',
            'template_name' => 'Vietnamese Standardized Test of English Proficiency',
            'category' => 'international',
            'level' => 'b1',
            'age_group' => 'adult',
            'total_duration_minutes' => 150,
            'skills' => ['listening', 'reading', 'writing', 'speaking'],
            'description' => 'Vietnamese national English proficiency test.',
            'sections' => [
                [
                    'name' => 'Listening',
                    'duration' => 40,
                    'questions' => 35,
                    'parts' => [
                        ['part' => 1, 'name' => 'Short Conversations', 'questions' => 8, 'type' => 'multiple_choice'],
                        ['part' => 2, 'name' => 'Long Conversations', 'questions' => 12, 'type' => 'multiple_choice'],
                        ['part' => 3, 'name' => 'Short Talks', 'questions' => 15, 'type' => 'multiple_choice']
                    ]
                ],
                ['name' => 'Reading', 'duration' => 60, 'questions' => 40],
                ['name' => 'Writing', 'duration' => 60, 'questions' => 2],
                ['name' => 'Speaking', 'duration' => 12, 'questions' => 3]
            ]
        ]);
    }
}