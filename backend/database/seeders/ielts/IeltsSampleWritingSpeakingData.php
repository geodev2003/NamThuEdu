<?php

namespace Database\Seeders\Ielts;

/**
 * Sample IELTS Writing (2 tasks) + Speaking (3 parts) data.
 * Style: Cambridge IELTS Academic.
 */
class IeltsSampleWritingSpeakingData
{
    public static function writing(): array
    {
        return [
            // ─────────────────────────────────────────────────────────────
            // TASK 1 — Academic chart description
            // ─────────────────────────────────────────────────────────────
            [
                'taskNumber' => 1,
                'prompt' => 'The bar chart below shows the percentage of households in five European countries that owned a smart-home device (e.g. smart speaker, smart thermostat, smart lighting) in 2018 and 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.'
                    . "\n\n"
                    . "DATA:\n"
                    . "• Germany   — 2018: 18%   2023: 47%\n"
                    . "• United Kingdom — 2018: 22%   2023: 55%\n"
                    . "• France   — 2018: 12%   2023: 38%\n"
                    . "• Spain    — 2018: 9%    2023: 31%\n"
                    . "• Italy    — 2018: 7%    2023: 28%",
                'imageUrl' => null,
                'imageFileName' => null,
                'tone' => null,
                'chartType' => 'bar_chart',
                'essayType' => null,
                'modelAnswer' => "The bar chart compares the percentage of households owning at least one smart-home device in five European countries in 2018 and 2023.\n\n"
                    . "Overall, smart-home adoption increased substantially in every country between the two years, with the United Kingdom and Germany leading and the southern countries — Spain and Italy — remaining at the bottom of the ranking.\n\n"
                    . "In 2018, fewer than a quarter of households in any country owned such a device. The United Kingdom had the highest figure at 22%, followed by Germany at 18% and France at 12%. Spain and Italy lagged behind at 9% and 7% respectively.\n\n"
                    . "By 2023, ownership had risen sharply across the board. The United Kingdom continued to lead with 55%, more than double its 2018 figure, while Germany also reached almost half of all households at 47%. France climbed to 38%. Although Spain and Italy still trailed, their figures had nearly tripled to 31% and 28% respectively.\n\n"
                    . "The largest absolute increase was therefore in the UK (+33 percentage points), but in proportional terms growth was actually fastest in Italy and Spain. (181 words)",
            ],

            // ─────────────────────────────────────────────────────────────
            // TASK 2 — Discursive essay (advantages/disadvantages)
            // ─────────────────────────────────────────────────────────────
            [
                'taskNumber' => 2,
                'prompt' => 'Some people believe that working from home full-time benefits both employees and society. Others think that working in an office environment is more productive. Discuss both views and give your own opinion. Write at least 250 words.',
                'imageUrl' => null,
                'imageFileName' => null,
                'tone' => null,
                'chartType' => null,
                'essayType' => 'discussion',
                'modelAnswer' => "The rapid spread of digital technology has made full-time remote work a realistic option for millions of employees. While some argue that this arrangement benefits both individuals and the wider community, others maintain that office-based work remains more productive. In my view, neither extreme is ideal — a hybrid approach is more likely to combine the strengths of both.\n\n"
                    . "Those who favour full-time home working point to clear personal and societal gains. For employees, eliminating the daily commute saves time, reduces transport costs and improves work–life balance, particularly for parents of young children. For society, fewer commuters mean lower traffic congestion, reduced air pollution and less pressure on public transport. Recent surveys in major European cities have shown measurable improvements in air quality during periods of widespread remote work.\n\n"
                    . "Conversely, supporters of the traditional office argue that physical co-location boosts productivity. Spontaneous corridor conversations often generate ideas that scheduled video calls cannot. Junior staff in particular benefit from observing experienced colleagues, while managers can mentor more effectively in person. Office environments also help maintain a clear separation between professional and private life, which many home-workers struggle to preserve.\n\n"
                    . "In my opinion, the strongest evidence supports a balanced model in which staff spend two or three days a week in the office and the remainder at home. This pattern preserves the social and creative benefits of in-person collaboration while still delivering most of the personal and environmental advantages of remote work. Rigid full-time policies in either direction risk losing more than they gain.\n\n"
                    . "In conclusion, although full-time remote and full-time office work each have genuine merits, a flexible hybrid arrangement is the most rational solution for the majority of knowledge workers. (286 words)",
            ],
        ];
    }

    public static function speaking(): array
    {
        return [
            // ─────────────────────────────────────────────────────────────
            // PART 1 — Introduction & Interview
            // ─────────────────────────────────────────────────────────────
            [
                'partNumber' => 1,
                'questions' => [
                    ['text' => 'Let\'s talk about your hometown. Where are you from?', 'topic' => 'Hometown'],
                    ['text' => 'What do you like most about your hometown?', 'topic' => 'Hometown'],
                    ['text' => 'Has your hometown changed much since you were a child?', 'topic' => 'Hometown'],
                    ['text' => 'Now let\'s discuss work or studies. Do you work or are you a student?', 'topic' => 'Work/Studies'],
                    ['text' => 'What do you enjoy most about your job/course?', 'topic' => 'Work/Studies'],
                    ['text' => 'How do you usually relax after a busy day?', 'topic' => 'Daily life'],
                ],
            ],

            // ─────────────────────────────────────────────────────────────
            // PART 2 — Long Turn (Cue Card)
            // ─────────────────────────────────────────────────────────────
            [
                'partNumber' => 2,
                'cueCard' => [
                    'topic' => 'Describe a skill you would like to learn in the future.',
                    'bullets' => [
                        'What the skill is',
                        'How you would learn it',
                        'How long you think it would take',
                        'And explain why you would like to learn this skill',
                    ],
                    'preparationSeconds' => 60,
                    'speakingSeconds' => 120,
                ],
            ],

            // ─────────────────────────────────────────────────────────────
            // PART 3 — Discussion (extends Part 2 topic)
            // ─────────────────────────────────────────────────────────────
            [
                'partNumber' => 3,
                'questions' => [
                    ['text' => 'Why do you think some adults are reluctant to learn new skills?', 'topic' => 'Learning new skills'],
                    ['text' => 'In what ways has technology changed how people learn?', 'topic' => 'Technology and learning'],
                    ['text' => 'Do you believe practical skills should be taught in schools? Why or why not?', 'topic' => 'Education'],
                    ['text' => 'Should the government help adults to retrain for new careers? In what ways?', 'topic' => 'Government and education'],
                    ['text' => 'How might lifelong learning benefit society as a whole?', 'topic' => 'Lifelong learning'],
                ],
            ],
        ];
    }
}
