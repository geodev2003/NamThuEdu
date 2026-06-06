<?php

namespace Database\Seeders\Ielts;

/**
 * Sample IELTS Listening data — 4 sections × 10 questions = 40 Q
 * Style: Cambridge IELTS Academic Test
 *
 * Section 1: Form completion — Hostel booking
 * Section 2: MCQ + Map labelling — Local museum tour
 * Section 3: Matching + MCQ — Tutorial discussion (PhD student)
 * Section 4: Note completion — Lecture on plastic pollution
 */
class IeltsSampleListeningData
{
    public static function get(): array
    {
        return [
            // ─────────────────────────────────────────────────────────────
            // SECTION 1 — Hostel booking conversation (form completion)
            // ─────────────────────────────────────────────────────────────
            [
                'sectionNumber' => 1,
                'audioUrl' => '',
                'audioFileName' => 'ielts_listening_section1_hostel.mp3',
                'transcript' => "RECEPTIONIST: Good morning, Sunset Backpackers, how can I help you?\n"
                    . "CALLER: Hi, I'd like to book a bed for next week, please.\n"
                    . "RECEPTIONIST: Certainly. Could I have your full name?\n"
                    . "CALLER: It's Daniel Hartman. That's H-A-R-T-M-A-N.\n"
                    . "RECEPTIONIST: Thank you, Mr Hartman. And your nationality?\n"
                    . "CALLER: Australian.\n"
                    . "RECEPTIONIST: When would you like to check in?\n"
                    . "CALLER: On the 14th of October. I'd like to stay for four nights.\n"
                    . "RECEPTIONIST: A four-night stay. We have a six-bed mixed dorm at \$32 per night, or a four-bed female-only at \$38.\n"
                    . "CALLER: I'll take the six-bed dorm, please. By the way, do you have lockers?\n"
                    . "RECEPTIONIST: Yes, free lockers in every room — but please bring your own padlock.\n"
                    . "CALLER: Great. And is breakfast included?\n"
                    . "RECEPTIONIST: A continental breakfast is included between 7 and 9 a.m. We also have a shared kitchen open until 11 p.m.\n"
                    . "CALLER: Perfect. Could you take a deposit on my card now?\n"
                    . "RECEPTIONIST: Of course. The card number please?",
                'questions' => [
                    [
                        'questionNumber' => 1,
                        'questionType' => 'short-answer',
                        'questionText' => 'Caller\'s surname:',
                        'correctAnswer' => 'Hartman',
                    ],
                    [
                        'questionNumber' => 2,
                        'questionType' => 'short-answer',
                        'questionText' => 'Nationality:',
                        'correctAnswer' => 'Australian',
                    ],
                    [
                        'questionNumber' => 3,
                        'questionType' => 'short-answer',
                        'questionText' => 'Check-in date (DD/MM):',
                        'correctAnswer' => '14/10',
                    ],
                    [
                        'questionNumber' => 4,
                        'questionType' => 'short-answer',
                        'questionText' => 'Number of nights:',
                        'correctAnswer' => 'four',
                    ],
                    [
                        'questionNumber' => 5,
                        'questionType' => 'short-answer',
                        'questionText' => 'Room type chosen:',
                        'correctAnswer' => 'six-bed dorm',
                    ],
                    [
                        'questionNumber' => 6,
                        'questionType' => 'short-answer',
                        'questionText' => 'Price per night (in dollars):',
                        'correctAnswer' => '32',
                    ],
                    [
                        'questionNumber' => 7,
                        'questionType' => 'short-answer',
                        'questionText' => 'Item the guest must bring for the locker:',
                        'correctAnswer' => 'padlock',
                    ],
                    [
                        'questionNumber' => 8,
                        'questionType' => 'short-answer',
                        'questionText' => 'Type of breakfast included:',
                        'correctAnswer' => 'continental',
                    ],
                    [
                        'questionNumber' => 9,
                        'questionType' => 'short-answer',
                        'questionText' => 'Shared kitchen closes at:',
                        'correctAnswer' => '11 p.m.',
                    ],
                    [
                        'questionNumber' => 10,
                        'questionType' => 'multiple-choice',
                        'questionText' => 'How will the caller pay?',
                        'options' => [
                            'A' => 'In cash on arrival',
                            'B' => 'By bank transfer',
                            'C' => 'By credit card now (deposit)',
                            'D' => 'By PayPal',
                        ],
                        'correctAnswer' => 'C',
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────
            // SECTION 2 — Museum tour (MCQ)
            // ─────────────────────────────────────────────────────────────
            [
                'sectionNumber' => 2,
                'audioUrl' => '',
                'audioFileName' => 'ielts_listening_section2_museum.mp3',
                'transcript' => "Welcome, everyone, to the Riverside Maritime Museum. My name is Sarah and I'll be your guide today.\n"
                    . "The museum was opened in 1985 in a former dockyard warehouse. It now houses over 12,000 objects relating to two centuries of seafaring history in our region.\n"
                    . "Before we start the tour, a few important notes. Please switch your mobile phones to silent mode — calls disturb other visitors. Photography is allowed without flash in all galleries except Gallery C, which contains light-sensitive nautical maps.\n"
                    . "The tour will last approximately 45 minutes. Halfway through, we'll stop at the Lighthouse Café, where you can buy refreshments. The café accepts cash and contactless cards.\n"
                    . "Now, looking at the floor plan: we are currently at the main entrance. Directly ahead is the ticket desk. To your left is the cloakroom — please leave large bags there free of charge. To your right is the gift shop, which we'll visit at the end of the tour.\n"
                    . "We'll begin in Gallery A, the room immediately past the ticket desk on your left, which houses the shipbuilding exhibition. After that, Gallery B on the right covers daily life at sea. Gallery C, the maps room, is at the far end of the corridor.",
                'questions' => [
                    [
                        'questionNumber' => 11,
                        'questionType' => 'multiple-choice',
                        'questionText' => 'When was the museum opened?',
                        'options' => ['A' => '1975', 'B' => '1985', 'C' => '1995', 'D' => '2005'],
                        'correctAnswer' => 'B',
                    ],
                    [
                        'questionNumber' => 12,
                        'questionType' => 'multiple-choice',
                        'questionText' => 'How many objects does the museum have?',
                        'options' => ['A' => 'Over 1,200', 'B' => 'Over 12,000', 'C' => 'Over 20,000', 'D' => 'Over 120,000'],
                        'correctAnswer' => 'B',
                    ],
                    [
                        'questionNumber' => 13,
                        'questionType' => 'multiple-choice',
                        'questionText' => 'Photography is NOT allowed in:',
                        'options' => ['A' => 'Gallery A', 'B' => 'Gallery B', 'C' => 'Gallery C', 'D' => 'The café'],
                        'correctAnswer' => 'C',
                    ],
                    [
                        'questionNumber' => 14,
                        'questionType' => 'multiple-choice',
                        'questionText' => 'How long will the tour last?',
                        'options' => ['A' => '30 minutes', 'B' => '45 minutes', 'C' => '60 minutes', 'D' => '90 minutes'],
                        'correctAnswer' => 'B',
                    ],
                    [
                        'questionNumber' => 15,
                        'questionType' => 'multiple-choice',
                        'questionText' => 'At the Lighthouse Café you can pay by:',
                        'options' => ['A' => 'Cash only', 'B' => 'Card only', 'C' => 'Cash or contactless cards', 'D' => 'Mobile wallet only'],
                        'correctAnswer' => 'C',
                    ],
                    [
                        'questionNumber' => 16,
                        'questionType' => 'short-answer',
                        'questionText' => 'Cloakroom is on your: (left/right)',
                        'correctAnswer' => 'left',
                    ],
                    [
                        'questionNumber' => 17,
                        'questionType' => 'short-answer',
                        'questionText' => 'Cost to leave bags in cloakroom:',
                        'correctAnswer' => 'free',
                    ],
                    [
                        'questionNumber' => 18,
                        'questionType' => 'short-answer',
                        'questionText' => 'Gallery A topic:',
                        'correctAnswer' => 'shipbuilding',
                    ],
                    [
                        'questionNumber' => 19,
                        'questionType' => 'short-answer',
                        'questionText' => 'Gallery B topic:',
                        'correctAnswer' => 'daily life at sea',
                    ],
                    [
                        'questionNumber' => 20,
                        'questionType' => 'short-answer',
                        'questionText' => 'Gallery C contains:',
                        'correctAnswer' => 'nautical maps',
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────
            // SECTION 3 — Tutorial discussion (PhD project)
            // ─────────────────────────────────────────────────────────────
            [
                'sectionNumber' => 3,
                'audioUrl' => '',
                'audioFileName' => 'ielts_listening_section3_tutorial.mp3',
                'transcript' => "TUTOR: So Maya, how is your dissertation on urban beekeeping coming along?\n"
                    . "MAYA: Slowly, Dr Nguyen. I've completed the literature review but the data collection is taking longer than expected.\n"
                    . "TUTOR: That's normal. Have you settled on your three case-study cities?\n"
                    . "MAYA: Yes — Berlin, Toronto, and Melbourne. Each has very different climate conditions, which makes comparison interesting.\n"
                    . "TUTOR: Excellent choice. What's your main research question?\n"
                    . "MAYA: I want to find out whether rooftop hives produce more honey than ground-level hives in dense urban areas.\n"
                    . "TUTOR: A very practical question. How are you collecting the data?\n"
                    . "MAYA: I'm using a combination of three methods. First, online surveys distributed to local beekeeping associations. Second, structured interviews with experienced beekeepers — I'm aiming for fifteen per city. And third, hive-yield records from public databases.\n"
                    . "TUTOR: Good triangulation. But I'd suggest you also include direct observation in at least one city. Field notes will strengthen your qualitative chapter.\n"
                    . "MAYA: That's a great idea — I'll arrange a two-week visit to Melbourne in spring.\n"
                    . "TUTOR: Don't forget to apply for ethics approval well in advance. The form takes around six weeks to process.",
                'questions' => [
                    [
                        'questionNumber' => 21,
                        'questionType' => 'short-answer',
                        'questionText' => 'Topic of Maya\'s dissertation:',
                        'correctAnswer' => 'urban beekeeping',
                    ],
                    [
                        'questionNumber' => 22,
                        'questionType' => 'short-answer',
                        'questionText' => 'Number of case-study cities:',
                        'correctAnswer' => 'three',
                    ],
                    [
                        'questionNumber' => 23,
                        'questionType' => 'short-answer',
                        'questionText' => 'Cities chosen (one example):',
                        'correctAnswer' => 'Berlin',
                    ],
                    [
                        'questionNumber' => 24,
                        'questionType' => 'short-answer',
                        'questionText' => 'Number of beekeepers Maya plans to interview per city:',
                        'correctAnswer' => '15',
                    ],
                    [
                        'questionNumber' => 25,
                        'questionType' => 'multiple-choice',
                        'questionText' => 'What additional method does the tutor suggest?',
                        'options' => [
                            'A' => 'Online experiments',
                            'B' => 'Direct observation',
                            'C' => 'Lab analysis',
                            'D' => 'A second literature review',
                        ],
                        'correctAnswer' => 'B',
                    ],
                    [
                        'questionNumber' => 26,
                        'questionType' => 'multiple-choice',
                        'questionText' => 'Which city will Maya visit for fieldwork?',
                        'options' => ['A' => 'Berlin', 'B' => 'Toronto', 'C' => 'Melbourne', 'D' => 'Sydney'],
                        'correctAnswer' => 'C',
                    ],
                    [
                        'questionNumber' => 27,
                        'questionType' => 'short-answer',
                        'questionText' => 'Length of fieldwork visit:',
                        'correctAnswer' => 'two weeks',
                    ],
                    [
                        'questionNumber' => 28,
                        'questionType' => 'multiple-choice',
                        'questionText' => 'How long does ethics approval take?',
                        'options' => ['A' => 'Two weeks', 'B' => 'Four weeks', 'C' => 'Six weeks', 'D' => 'Eight weeks'],
                        'correctAnswer' => 'C',
                    ],
                    [
                        'questionNumber' => 29,
                        'questionType' => 'short-answer',
                        'questionText' => 'Main research question — does rooftop produce more …. ?',
                        'correctAnswer' => 'honey',
                    ],
                    [
                        'questionNumber' => 30,
                        'questionType' => 'short-answer',
                        'questionText' => 'Field notes will strengthen which chapter?',
                        'correctAnswer' => 'qualitative',
                    ],
                ],
            ],

            // ─────────────────────────────────────────────────────────────
            // SECTION 4 — University lecture (note completion)
            // ─────────────────────────────────────────────────────────────
            [
                'sectionNumber' => 4,
                'audioUrl' => '',
                'audioFileName' => 'ielts_listening_section4_plastic.mp3',
                'transcript' => "Good morning, everyone. Today's lecture concludes our unit on environmental challenges with a look at one of the most visible — plastic pollution in the world's oceans.\n"
                    . "Globally, an estimated 8 million tonnes of plastic enter our oceans every year. To put that in perspective, that's the equivalent of one rubbish-truck-load every minute.\n"
                    . "Most ocean plastic begins its journey on land. Studies suggest that nearly 80 percent of marine plastic originates from rivers, with just 10 river systems — eight in Asia and two in Africa — responsible for the bulk of the flow.\n"
                    . "Once at sea, plastic does not biodegrade. Instead, sunlight and wave action break larger items into smaller fragments called microplastics — defined as pieces smaller than five millimetres. These microplastics are now found in every layer of the ocean, from the surface to the deepest trenches.\n"
                    . "The impact on marine life is severe. Researchers have documented over 800 species affected, including sea turtles which mistake plastic bags for jellyfish, and seabirds whose chicks die after being fed plastic by their parents.\n"
                    . "Solutions fall into three categories: reduce — cutting unnecessary single-use packaging at source; reuse — designing products with multiple lifecycles; and recycle — though only 9 percent of plastic ever produced has been successfully recycled.\n"
                    . "Recent international agreements, particularly the 2023 UN Plastic Treaty, set legally binding targets to phase out the most polluting items by 2030.",
                'questions' => [
                    [
                        'questionNumber' => 31,
                        'questionType' => 'short-answer',
                        'questionText' => 'Tonnes of plastic entering oceans yearly (millions):',
                        'correctAnswer' => '8',
                    ],
                    [
                        'questionNumber' => 32,
                        'questionType' => 'short-answer',
                        'questionText' => 'Equivalent: a rubbish-truck-load every …',
                        'correctAnswer' => 'minute',
                    ],
                    [
                        'questionNumber' => 33,
                        'questionType' => 'short-answer',
                        'questionText' => 'Percentage of marine plastic from rivers:',
                        'correctAnswer' => '80',
                    ],
                    [
                        'questionNumber' => 34,
                        'questionType' => 'short-answer',
                        'questionText' => 'Number of river systems responsible for the bulk:',
                        'correctAnswer' => '10',
                    ],
                    [
                        'questionNumber' => 35,
                        'questionType' => 'short-answer',
                        'questionText' => 'Microplastics are defined as smaller than … millimetres:',
                        'correctAnswer' => '5',
                    ],
                    [
                        'questionNumber' => 36,
                        'questionType' => 'short-answer',
                        'questionText' => 'Number of species affected (over):',
                        'correctAnswer' => '800',
                    ],
                    [
                        'questionNumber' => 37,
                        'questionType' => 'short-answer',
                        'questionText' => 'Sea turtles mistake plastic bags for:',
                        'correctAnswer' => 'jellyfish',
                    ],
                    [
                        'questionNumber' => 38,
                        'questionType' => 'short-answer',
                        'questionText' => 'Three solution categories: reduce, reuse, …',
                        'correctAnswer' => 'recycle',
                    ],
                    [
                        'questionNumber' => 39,
                        'questionType' => 'short-answer',
                        'questionText' => 'Percentage of plastic successfully recycled:',
                        'correctAnswer' => '9',
                    ],
                    [
                        'questionNumber' => 40,
                        'questionType' => 'short-answer',
                        'questionText' => 'UN Plastic Treaty target year for phase-out:',
                        'correctAnswer' => '2030',
                    ],
                ],
            ],
        ];
    }
}
