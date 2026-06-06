<?php

namespace Database\Seeders\Ielts;

/**
 * Sample IELTS Reading data — 3 passages × ~13–14 questions = 40 Q
 * Style: Cambridge IELTS Academic
 *
 * Passage 1 (13 Q): The History of the Bicycle  — TFNG + Sentence completion
 * Passage 2 (13 Q): The Psychology of Crowd Behaviour — Matching headings + MCQ
 * Passage 3 (14 Q): Coral Reefs and Climate Change — YNNG + Summary completion + MCQ
 */
class IeltsSampleReadingData
{
    public static function get(): array
    {
        return [
            self::passage1(),
            self::passage2(),
            self::passage3(),
        ];
    }

    private static function passage1(): array
    {
        return [
            'passageNumber' => 1,
            'title' => 'The History of the Bicycle',
            'wordCount' => 780,
            'body' => "The bicycle, in its modern form, has been with us for less than 150 years, yet it is now the most numerous human-powered vehicle on Earth. Its evolution illustrates how a simple idea — using two wheels in line, propelled by the rider's own legs — has been refined through a series of small but decisive innovations.\n\n"
                . "The earliest direct ancestor of the bicycle was the German 'draisine', invented by Karl von Drais in 1817. Made almost entirely of wood, the draisine had no pedals; the rider sat astride a wooden beam between two wheels and pushed along the ground with the feet. Although ridiculed at first, the device was clearly faster than walking on smooth roads, and small numbers were sold in France and Britain.\n\n"
                . "The next major step came in the 1860s when the French metalworker Pierre Michaux fitted pedals directly onto the front wheel. His machine, the 'velocipede' or 'boneshaker', became briefly fashionable but was extremely uncomfortable on the cobbled streets of European cities. By the 1870s the British engineer James Starley had introduced a radical redesign: an enormous front wheel — sometimes 1.5 metres in diameter — combined with a tiny rear wheel. This 'penny-farthing' allowed greater speeds because each pedal turn translated directly into a longer wheel rotation, but the rider sat dangerously high above the ground.\n\n"
                . "The decisive breakthrough was John Kemp Starley's 'safety bicycle' of 1885. By using a chain to connect the pedals to the rear wheel, Starley made it possible for the front and rear wheels to be of equal, moderate size. The rider sat lower, the centre of gravity was lower still, and falls became far less dangerous. Within ten years the safety bicycle, fitted with John Boyd Dunlop's pneumatic tyres of 1888, had displaced all rival designs and was being mass-produced in factories across Europe and North America.\n\n"
                . "Cycling's social impact in the 1890s was profound. For the first time, ordinary people had personal mobility. Cyclists' clubs lobbied governments to surface roads — work that, ironically, paved the way for the motor car. The bicycle also gave women unprecedented freedom of movement: the American suffragist Susan B. Anthony famously declared that the bicycle had 'done more to emancipate women than anything else in the world'.\n\n"
                . "After 1920 cycling lost ground to the automobile in many wealthy countries, but it remained the dominant form of personal transport across much of Asia, Africa and Eastern Europe. China alone produced an estimated 500 million bicycles between 1949 and 2000. The oil crises of the 1970s, combined with growing concern about urban air quality, sparked a renewed interest in cycling in Western Europe and North America. Cities such as Amsterdam and Copenhagen began to invest heavily in dedicated cycle infrastructure — investments that have continued to expand into the present century.\n\n"
                . "The most recent transformation has been the rise of the electrically assisted bicycle, or e-bike. By providing a small motor that supplements rather than replaces the rider's pedalling, e-bikes extend the range and reduce the effort of cycling, particularly in hilly terrain. Sales overtook those of conventional bicycles in several European countries by the early 2020s, and in many cities the e-bike has become a serious alternative to short car journeys.\n\n"
                . "Looking ahead, transport experts expect the bicycle, and especially the e-bike, to play an even larger role in urban mobility. Their advantages — low cost, zero direct emissions, minimal road wear, and excellent compatibility with public transport — match the priorities of city planners struggling with congestion and pollution. The simple two-wheeled machine, refined through more than two centuries of small innovations, may yet have its greatest era ahead.",
            'questions' => [
                // Q1–6: TRUE/FALSE/NOT GIVEN
                [
                    'questionNumber' => 1,
                    'questionType' => 'true-false-not-given',
                    'questionText' => 'The draisine had pedals fitted to the rear wheel.',
                    'correctAnswer' => 'FALSE',
                ],
                [
                    'questionNumber' => 2,
                    'questionType' => 'true-false-not-given',
                    'questionText' => 'The draisine was sold in some European countries.',
                    'correctAnswer' => 'TRUE',
                ],
                [
                    'questionNumber' => 3,
                    'questionType' => 'true-false-not-given',
                    'questionText' => 'Pierre Michaux invented the safety bicycle.',
                    'correctAnswer' => 'FALSE',
                ],
                [
                    'questionNumber' => 4,
                    'questionType' => 'true-false-not-given',
                    'questionText' => 'The penny-farthing was safer than the velocipede.',
                    'correctAnswer' => 'NOT GIVEN',
                ],
                [
                    'questionNumber' => 5,
                    'questionType' => 'true-false-not-given',
                    'questionText' => 'Pneumatic tyres were introduced before the chain-driven safety bicycle.',
                    'correctAnswer' => 'FALSE',
                ],
                [
                    'questionNumber' => 6,
                    'questionType' => 'true-false-not-given',
                    'questionText' => 'Cyclists\' lobbying contributed to the development of paved roads.',
                    'correctAnswer' => 'TRUE',
                ],
                // Q7–10: MCQ
                [
                    'questionNumber' => 7,
                    'questionType' => 'multiple-choice',
                    'questionText' => 'According to the passage, which feature of the safety bicycle was MOST important?',
                    'options' => [
                        'A' => 'Lighter wooden frame',
                        'B' => 'Equal-sized wheels with chain drive',
                        'C' => 'Solid rubber tyres',
                        'D' => 'A larger rear wheel',
                    ],
                    'correctAnswer' => 'B',
                ],
                [
                    'questionNumber' => 8,
                    'questionType' => 'multiple-choice',
                    'questionText' => 'Susan B. Anthony believed the bicycle:',
                    'options' => [
                        'A' => 'was unsafe for women',
                        'B' => 'helped women gain independence',
                        'C' => 'should be banned in cities',
                        'D' => 'replaced public transport',
                    ],
                    'correctAnswer' => 'B',
                ],
                [
                    'questionNumber' => 9,
                    'questionType' => 'multiple-choice',
                    'questionText' => 'Which event renewed Western interest in cycling in the 1970s?',
                    'options' => [
                        'A' => 'The oil crises and air-quality concerns',
                        'B' => 'The fall of the Soviet Union',
                        'C' => 'The introduction of e-bikes',
                        'D' => 'New cycling races',
                    ],
                    'correctAnswer' => 'A',
                ],
                [
                    'questionNumber' => 10,
                    'questionType' => 'multiple-choice',
                    'questionText' => 'In which country was the largest number of bicycles produced 1949–2000?',
                    'options' => [
                        'A' => 'India',
                        'B' => 'China',
                        'C' => 'Netherlands',
                        'D' => 'United States',
                    ],
                    'correctAnswer' => 'B',
                ],
                // Q11–13: Sentence completion
                [
                    'questionNumber' => 11,
                    'questionType' => 'sentence-completion',
                    'questionText' => 'The first ancestor of the bicycle was made almost entirely of ____.',
                    'correctAnswer' => 'wood',
                ],
                [
                    'questionNumber' => 12,
                    'questionType' => 'sentence-completion',
                    'questionText' => 'On the penny-farthing, the rider sat dangerously ____ above the ground.',
                    'correctAnswer' => 'high',
                ],
                [
                    'questionNumber' => 13,
                    'questionType' => 'sentence-completion',
                    'questionText' => 'E-bikes provide a small motor that supplements the rider\'s ____.',
                    'correctAnswer' => 'pedalling',
                ],
            ],
        ];
    }

    private static function passage2(): array
    {
        return [
            'passageNumber' => 2,
            'title' => 'The Psychology of Crowd Behaviour',
            'wordCount' => 820,
            'body' => "A. For more than a century scientists have tried to understand why people in large gatherings sometimes behave in ways that they would never consider as individuals. Early theorists viewed the crowd as a kind of primitive mind: irrational, easily led and dangerous. Most influential of these was the French sociologist Gustave Le Bon, whose 1895 book 'The Crowd' argued that individuals 'lose their personality' once they become part of a mass and are seized by a 'collective unconscious'.\n\n"
                . "B. For most of the twentieth century Le Bon's view dominated discussion. Police forces, governments, journalists and even academics described crowds as inherently unstable. The destructive riots of the 1960s were often interpreted as confirmations of this 'crowd madness' theory: ordinary people, the argument went, were transformed into a violent mob simply by being among others.\n\n"
                . "C. From the 1980s onwards, however, a generation of social psychologists led by Stephen Reicher began to challenge the orthodoxy. They argued that Le Bon had confused crowd behaviour with crowd identity. Reicher's studies of the 1980 St Pauls riot in Bristol, England, showed that participants did not lose self-control. Instead, they acted in ways that reflected a shared social identity — a sense of 'us' which was activated by what they perceived as unfair treatment by the police.\n\n"
                . "D. This newer 'social identity' approach makes a number of testable predictions. First, the more strongly people identify with a group, the more willing they are to take collective action on its behalf — but this action need not be violent. Second, the form that crowd behaviour takes depends on the meaning of the situation as the crowd members themselves understand it. Third, when authorities treat a crowd as inherently dangerous and respond with heavy-handed tactics, they often produce the very disorder they fear.\n\n"
                . "E. Modern football policing illustrates these ideas in practice. Across much of Europe, dialogue policing — where officers without riot gear engage with fans, listen to grievances and intervene only against actual offenders — has been shown to reduce disorder substantially compared with traditional 'paramilitary' approaches. The Portuguese police, advised by social psychologists during the European Football Championship of 2004, recorded only one arrest related to England fans, despite the country's notorious recent history.\n\n"
                . "F. Crowd behaviour is not, however, always benign. The same processes of shared identity that allow peaceful protest can, under different circumstances, support hostile action against an out-group. The crucial issue is what kind of identity is salient and how it is treated. When crowd members feel respected and listened to, they tend to police their own boundaries; when they feel demonised, they may close ranks behind their most extreme members.\n\n"
                . "G. Crowd researchers also draw a sharp distinction between disasters caused by panic and those caused by crushing. The popular image of a crowd in flight, every individual trampling the next, turns out to be largely a myth. Detailed studies of fires in nightclubs and stadium disasters such as Hillsborough in 1989 show that most fatalities result from physical force generated by overcrowding — often when authorities mistakenly direct people into already saturated spaces. Far from selfish stampede, survivor accounts reveal repeated acts of cooperation and mutual aid even at the moment of greatest danger.\n\n"
                . "H. The implications for public policy are considerable. If crowds are essentially rational, the goal of crowd management should not be to suppress them but to design environments and practices that allow people to act safely on the identities they share. This means clear signage, generous capacity, well-trained stewards rather than aggressive policing, and meaningful dialogue with organisers. Recent international guidance from bodies such as the World Health Organization has incorporated many of these principles into safety planning for mass events ranging from religious pilgrimages to music festivals.",
            'questions' => [
                // Q14–19: Matching headings (paragraphs A-H minus C/E for examples already given)
                [
                    'questionNumber' => 14,
                    'questionType' => 'matching-headings',
                    'questionText' => 'Match heading to paragraph A: choose i–vii',
                    'options' => [
                        'A' => 'i. Early ideas about why crowds turn violent',
                        'B' => 'ii. The role of police equipment in escalation',
                        'C' => 'iii. New evidence from a UK riot',
                        'D' => 'iv. Lessons from a major football tournament',
                    ],
                    'correctAnswer' => 'A',
                ],
                [
                    'questionNumber' => 15,
                    'questionType' => 'matching-headings',
                    'questionText' => 'Match heading to paragraph C:',
                    'options' => [
                        'A' => 'i. Le Bon\'s lasting influence',
                        'B' => 'ii. New evidence from a UK riot',
                        'C' => 'iii. Why people share food during disasters',
                        'D' => 'iv. The myth of panic in disasters',
                    ],
                    'correctAnswer' => 'B',
                ],
                [
                    'questionNumber' => 16,
                    'questionType' => 'matching-headings',
                    'questionText' => 'Match heading to paragraph E:',
                    'options' => [
                        'A' => 'i. Lessons from a major football tournament',
                        'B' => 'ii. Demonising fans backfires',
                        'C' => 'iii. Predictions of social-identity theory',
                        'D' => 'iv. New policy recommendations',
                    ],
                    'correctAnswer' => 'A',
                ],
                [
                    'questionNumber' => 17,
                    'questionType' => 'matching-headings',
                    'questionText' => 'Match heading to paragraph G:',
                    'options' => [
                        'A' => 'i. Why dialogue policing works',
                        'B' => 'ii. The myth of panic during disasters',
                        'C' => 'iii. Crowd identity and group respect',
                        'D' => 'iv. Origins of crowd theory',
                    ],
                    'correctAnswer' => 'B',
                ],
                [
                    'questionNumber' => 18,
                    'questionType' => 'matching-headings',
                    'questionText' => 'Match heading to paragraph H:',
                    'options' => [
                        'A' => 'i. Failures of football policing',
                        'B' => 'ii. New policy recommendations',
                        'C' => 'iii. Personality loss in crowds',
                        'D' => 'iv. Riots in the 1960s',
                    ],
                    'correctAnswer' => 'B',
                ],
                [
                    'questionNumber' => 19,
                    'questionType' => 'matching-headings',
                    'questionText' => 'Match heading to paragraph D:',
                    'options' => [
                        'A' => 'i. Predictions of the social-identity approach',
                        'B' => 'ii. Disasters caused by crushing',
                        'C' => 'iii. Le Bon\'s 1895 theory',
                        'D' => 'iv. Music festival safety',
                    ],
                    'correctAnswer' => 'A',
                ],
                // Q20–23: MCQ
                [
                    'questionNumber' => 20,
                    'questionType' => 'multiple-choice',
                    'questionText' => 'Le Bon believed crowds:',
                    'options' => [
                        'A' => 'were rational and orderly',
                        'B' => 'lost individual personality and acted unconsciously',
                        'C' => 'always supported governments',
                        'D' => 'were a myth',
                    ],
                    'correctAnswer' => 'B',
                ],
                [
                    'questionNumber' => 21,
                    'questionType' => 'multiple-choice',
                    'questionText' => 'Reicher\'s study of St Pauls riot showed participants:',
                    'options' => [
                        'A' => 'lost self-control',
                        'B' => 'acted on a shared sense of unfair treatment',
                        'C' => 'were paid agitators',
                        'D' => 'had been drinking heavily',
                    ],
                    'correctAnswer' => 'B',
                ],
                [
                    'questionNumber' => 22,
                    'questionType' => 'multiple-choice',
                    'questionText' => 'During Euro 2004 in Portugal, England fans had:',
                    'options' => [
                        'A' => 'many arrests as expected',
                        'B' => 'one arrest only',
                        'C' => 'no incidents at all',
                        'D' => 'the most arrests of any team',
                    ],
                    'correctAnswer' => 'B',
                ],
                [
                    'questionNumber' => 23,
                    'questionType' => 'multiple-choice',
                    'questionText' => 'According to crowd researchers, most stadium-disaster deaths result from:',
                    'options' => [
                        'A' => 'individual panic',
                        'B' => 'crushing due to overcrowding',
                        'C' => 'fire and smoke',
                        'D' => 'fighting between fans',
                    ],
                    'correctAnswer' => 'B',
                ],
                // Q24–26: Sentence completion
                [
                    'questionNumber' => 24,
                    'questionType' => 'sentence-completion',
                    'questionText' => 'Heavy-handed police tactics often produce the very ____ they fear.',
                    'correctAnswer' => 'disorder',
                ],
                [
                    'questionNumber' => 25,
                    'questionType' => 'sentence-completion',
                    'questionText' => 'Hillsborough disaster occurred in the year ____.',
                    'correctAnswer' => '1989',
                ],
                [
                    'questionNumber' => 26,
                    'questionType' => 'sentence-completion',
                    'questionText' => 'Survivor accounts often describe acts of cooperation and ____.',
                    'correctAnswer' => 'mutual aid',
                ],
            ],
        ];
    }

    private static function passage3(): array
    {
        return [
            'passageNumber' => 3,
            'title' => 'Coral Reefs and Climate Change',
            'wordCount' => 950,
            'body' => "Coral reefs are among the most biodiverse ecosystems on the planet, occupying less than one percent of the ocean's surface but supporting around a quarter of all marine species. The Great Barrier Reef alone is home to more than 1,500 species of fish and 400 species of coral. Reefs also provide essential services to humans: they protect coastlines from erosion, support fisheries that feed hundreds of millions of people, and underpin tourist economies worth tens of billions of dollars annually.\n\n"
                . "These ecosystems are built by tiny animals called coral polyps, which live in symbiosis with single-celled algae known as zooxanthellae. The algae photosynthesise inside the polyps' tissues, providing up to 90 percent of the energy that the corals need to grow their calcium-carbonate skeletons. In return, the polyps offer the algae a sheltered environment and a steady supply of nutrients. This partnership is, however, extraordinarily sensitive to changes in ocean temperature.\n\n"
                . "When sea temperatures rise even one or two degrees above the long-term summer average for several weeks, the relationship breaks down. Stressed corals expel their algal partners — a process known as coral bleaching, because the loss of algae leaves the white skeleton visible through the now-transparent tissue. A bleached coral is not yet dead, and a brief temperature anomaly may be survivable. But if heat-stress conditions persist, or if they recur before the colony has had time to recover, the coral starves and dies.\n\n"
                . "Until recently, mass-bleaching events were rare. The first global bleaching was recorded in 1998 during a strong El Niño year. The second occurred in 2010. The third, beginning in 2014 and lasting until 2017, was unprecedented in both duration and severity, affecting over 70 percent of the world's reefs. Most worryingly, a fourth global event was confirmed in 2024, showing that the gap between major bleachings is shrinking even as ocean temperatures continue to rise.\n\n"
                . "Climate change is not the only stress reefs face. Local pollutants, overfishing, sediment from coastal construction, and physical damage from storms and shipping all weaken corals. But scientists agree that without action on greenhouse-gas emissions, even healthy reefs will be unable to withstand the projected warming. Modelling by the Intergovernmental Panel on Climate Change suggests that 70–90 percent of tropical reefs would be lost at 1.5 °C of warming, and 99 percent at 2 °C — within the lifetime of children alive today.\n\n"
                . "The picture is, however, not entirely bleak. Researchers have identified several reasons for cautious optimism. First, certain coral species and even individual colonies appear to be more heat-tolerant than others, suggesting that natural selection may favour the survival of the fittest reef-builders. Second, scientists have begun cultivating heat-tolerant strains in laboratories and outplanting them onto degraded reefs — an emerging technique known as 'assisted evolution'. Third, well-managed marine reserves consistently show faster recovery after bleaching events than reefs lacking protection.\n\n"
                . "Innovative engineering approaches are also being trialled. In one Australian project, fine sea-water mist is sprayed into the air above sensitive reefs during marine heatwaves; the resulting low cloud reflects sunlight and reduces water temperature by a fraction of a degree — sometimes enough to prevent bleaching. Other experiments are using underwater speakers to broadcast the sounds of healthy reefs in order to attract fish and larvae back to recovering areas, accelerating ecological repair.\n\n"
                . "Yet local interventions have limits. Even the most ambitious restoration projects can cover only tens of hectares; the Great Barrier Reef extends over 34 million hectares. Most coral biologists therefore stress that local action is necessary but insufficient. Without rapid global decarbonisation, reefs may persist only as fragments — small refuges in cooler waters or in deep-water 'mesophotic' zones below the reach of the worst surface heat.\n\n"
                . "There is, ultimately, an ethical dimension. Coral reefs are not simply economic assets or scenic wonders; they are 400-million-year-old ecosystems that predate the dinosaurs. Their loss would represent an extinction event of a magnitude not seen for millions of years. The decisions made by the present generation — about energy systems, land use, marine policy and, above all, climate ambition — will determine whether reefs are still functioning communities at the end of this century, or merely entries in the geological record.",
            'questions' => [
                // Q27–32: Yes/No/Not Given
                [
                    'questionNumber' => 27,
                    'questionType' => 'yes-no-not-given',
                    'questionText' => 'The writer believes coral reefs are mainly important because of their tourist value.',
                    'correctAnswer' => 'NO',
                ],
                [
                    'questionNumber' => 28,
                    'questionType' => 'yes-no-not-given',
                    'questionText' => 'The writer thinks bleached coral can sometimes recover.',
                    'correctAnswer' => 'YES',
                ],
                [
                    'questionNumber' => 29,
                    'questionType' => 'yes-no-not-given',
                    'questionText' => 'The writer believes 1998 and 2010 had equally severe bleaching.',
                    'correctAnswer' => 'NOT GIVEN',
                ],
                [
                    'questionNumber' => 30,
                    'questionType' => 'yes-no-not-given',
                    'questionText' => 'The writer thinks local action alone will save reefs.',
                    'correctAnswer' => 'NO',
                ],
                [
                    'questionNumber' => 31,
                    'questionType' => 'yes-no-not-given',
                    'questionText' => 'The writer believes 1.5 °C of warming will destroy 70–90% of tropical reefs.',
                    'correctAnswer' => 'YES',
                ],
                [
                    'questionNumber' => 32,
                    'questionType' => 'yes-no-not-given',
                    'questionText' => 'The writer believes coral reefs are older than dinosaurs.',
                    'correctAnswer' => 'YES',
                ],
                // Q33–37: Summary completion
                [
                    'questionNumber' => 33,
                    'questionType' => 'summary-completion',
                    'questionText' => 'Coral polyps live in ____ with algae called zooxanthellae.',
                    'correctAnswer' => 'symbiosis',
                ],
                [
                    'questionNumber' => 34,
                    'questionType' => 'summary-completion',
                    'questionText' => 'The algae provide up to ____ percent of the corals\' energy.',
                    'correctAnswer' => '90',
                ],
                [
                    'questionNumber' => 35,
                    'questionType' => 'summary-completion',
                    'questionText' => 'When stressed, corals expel their algae — a process called ____.',
                    'correctAnswer' => 'bleaching',
                ],
                [
                    'questionNumber' => 36,
                    'questionType' => 'summary-completion',
                    'questionText' => 'The first global bleaching event was in ____ during a strong El Niño year.',
                    'correctAnswer' => '1998',
                ],
                [
                    'questionNumber' => 37,
                    'questionType' => 'summary-completion',
                    'questionText' => 'The fourth global bleaching event was confirmed in ____.',
                    'correctAnswer' => '2024',
                ],
                // Q38–40: MCQ
                [
                    'questionNumber' => 38,
                    'questionType' => 'multiple-choice',
                    'questionText' => 'Which technique sprays sea-water mist over reefs during heatwaves?',
                    'options' => [
                        'A' => 'Acoustic enrichment',
                        'B' => 'Cloud brightening',
                        'C' => 'Coral gardening',
                        'D' => 'Marine reserves',
                    ],
                    'correctAnswer' => 'B',
                ],
                [
                    'questionNumber' => 39,
                    'questionType' => 'multiple-choice',
                    'questionText' => '"Assisted evolution" refers to:',
                    'options' => [
                        'A' => 'breeding heat-tolerant corals and outplanting them',
                        'B' => 'banning fishing',
                        'C' => 'underwater music broadcasts',
                        'D' => 'building artificial reefs from concrete',
                    ],
                    'correctAnswer' => 'A',
                ],
                [
                    'questionNumber' => 40,
                    'questionType' => 'multiple-choice',
                    'questionText' => 'According to the passage, reefs in the future may persist mainly as:',
                    'options' => [
                        'A' => 'small refuges in cooler or deeper waters',
                        'B' => 'industrial fish farms',
                        'C' => 'global tourist parks',
                        'D' => 'completely artificial structures',
                    ],
                    'correctAnswer' => 'A',
                ],
            ],
        ];
    }
}
