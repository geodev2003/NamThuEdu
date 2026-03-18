<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Classes;
use App\Models\ClassEnrollment;
use App\Models\Exam;
use App\Models\Question;
use App\Models\Answer;
use App\Models\TestAssignment;

class TestSystemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Data extracted from namthu_edu.sql
     *
     * @return void
     */
    public function run()
    {
        $this->command->info('🌱 Seeding Test System with real data from namthu_edu.sql...');

        // Create teacher (from SQL: user id=1)
        $teacher = User::firstOrCreate(
            ['uPhone' => '0336695863'],
            [
                'uName' => 'Nguyen Van A',
                'uPassword' => Hash::make('password123'),
                'uRole' => 'teacher',
                'uStatus' => 'active',
                'uGender' => 0,
                'uAddress' => 'Cần Thơ',
                'uDoB' => '2003-02-15',
                'uClass' => 0,
            ]
        );

        // Create students (from SQL: users id=2-11)
        $studentsData = [
            ['uPhone' => '0912345678', 'uName' => 'Lê Thị B', 'uGender' => 0, 'uDoB' => '2003-02-15', 'uAddress' => '123 Đường 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ'],
            ['uPhone' => '0922345678', 'uName' => 'Trần Văn C', 'uGender' => 1, 'uDoB' => '2003-05-20', 'uAddress' => '456 Cách Mạng Tháng 8, Bùi Hữu Nghĩa, Bình Thủy, Cần Thơ'],
            ['uPhone' => '0932345678', 'uName' => 'Phạm Thị D', 'uGender' => 0, 'uDoB' => '2003-08-10', 'uAddress' => '789 Nguyễn Văn Cừ, An Khánh, Ninh Kiều, Cần Thơ'],
            ['uPhone' => '0942345678', 'uName' => 'Hoàng Văn E', 'uGender' => 1, 'uDoB' => '2003-11-25', 'uAddress' => '101 Tầm Vu, Hưng Lợi, Ninh Kiều, Cần Thơ'],
            ['uPhone' => '0952345678', 'uName' => 'Nguyễn Thị F', 'uGender' => 0, 'uDoB' => '2004-01-05', 'uAddress' => '202 Trần Hưng Đạo, An Phú, Ninh Kiều, Cần Thơ'],
        ];

        $students = [];
        foreach ($studentsData as $studentData) {
            $students[] = User::firstOrCreate(
                ['uPhone' => $studentData['uPhone']],
                [
                    'uName' => $studentData['uName'],
                    'uPassword' => Hash::make('password123'),
                    'uRole' => 'student',
                    'uStatus' => 'active',
                    'uGender' => $studentData['uGender'],
                    'uAddress' => $studentData['uAddress'],
                    'uDoB' => $studentData['uDoB'],
                    'uClass' => 0,
                ]
            );
        }

        // Create classes (from SQL: classes id=1-3)
        $class1 = Classes::firstOrCreate(
            ['cName' => 'Khóa học Tổng quát IC3'],
            [
                'cTeacher_id' => $teacher->uId,
                'cDescription' => 'Khóa học nền tảng',
                'cStatus' => 'active',
                'course' => null,
            ]
        );

        $class2 = Classes::firstOrCreate(
            ['cName' => 'Lớp Luyện Thi IC3 GS6 - Nhóm 1'],
            [
                'cTeacher_id' => $teacher->uId,
                'cDescription' => 'Lớp học mẫu cho sinh viên IT',
                'cStatus' => 'active',
                'course' => $class1->cId,
            ]
        );

        $class3 = Classes::firstOrCreate(
            ['cName' => 'Lớp Luyện Thi IC3 GS6 - Nhóm 2'],
            [
                'cTeacher_id' => $teacher->uId,
                'cDescription' => 'Lớp học mẫu cho sinh viên IT',
                'cStatus' => 'active',
                'course' => $class1->cId,
            ]
        );

        // Enroll students into class2
        foreach ($students as $index => $student) {
            ClassEnrollment::firstOrCreate([
                'class_id' => $class2->cId,
                'student_id' => $student->uId,
            ]);
        }

        // Create VSTEP Sample Test (from SQL: exam id=1)
        $exam = Exam::firstOrCreate(
            ['eTitle' => 'VSTEP Sample Test'],
            [
                'eDescription' => 'Bài thi mẫu VSTEP B1 - Listening Section',
                'eType' => 'VSTEP',
                'eSkill' => 'listening',
                'eTeacher_id' => $teacher->uId,
                'eDuration_minutes' => 40,
                'eIs_private' => false,
                'eSource_type' => 'manual',
            ]
        );

        // Part 1: Short announcements (Questions 1-8)
        $part1Questions = [
            ['q' => 'What time will the library close today?', 'answers' => [
                ['text' => '8:00 PM', 'correct' => false],
                ['text' => '7:00 PM', 'correct' => false],
                ['text' => '6:00 PM', 'correct' => true],
                ['text' => '9:00 PM', 'correct' => false],
            ]],
            ['q' => 'Which platform does the train to Brighton depart from?', 'answers' => [
                ['text' => 'Platform 2', 'correct' => false],
                ['text' => 'Platform 6', 'correct' => true],
                ['text' => 'Platform 4', 'correct' => false],
                ['text' => 'Platform 8', 'correct' => false],
            ]],
            ['q' => 'What is the main purpose of the announcement?', 'answers' => [
                ['text' => 'To warn about severe weather', 'correct' => true],
                ['text' => 'To notify a road closure', 'correct' => false],
                ['text' => 'To advertise a new event', 'correct' => false],
                ['text' => 'To remind about safety regulations', 'correct' => false],
            ]],
            ['q' => 'Where should students submit their project reports?', 'answers' => [
                ['text' => 'Room 101', 'correct' => false],
                ['text' => 'Room 303', 'correct' => true],
                ['text' => 'Room 300', 'correct' => false],
                ['text' => 'Room 404', 'correct' => false],
            ]],
            ['q' => 'What time does the concert start?', 'answers' => [
                ['text' => '5:30 PM', 'correct' => false],
                ['text' => '6:00 PM', 'correct' => false],
                ['text' => '6:30 PM', 'correct' => true],
                ['text' => '7:00 PM', 'correct' => false],
            ]],
            ['q' => 'What is included in the monthly gym membership?', 'answers' => [
                ['text' => 'Free yoga classes', 'correct' => false],
                ['text' => 'Free swimming lessons', 'correct' => false],
                ['text' => 'Complimentary personal training', 'correct' => true],
                ['text' => 'Access to exclusive use of workout equipment', 'correct' => false],
            ]],
            ['q' => 'How long will the maintenance work last?', 'answers' => [
                ['text' => '1 hour', 'correct' => false],
                ['text' => '2 hours', 'correct' => false],
                ['text' => '4 hours', 'correct' => false],
                ['text' => '3 hours', 'correct' => true],
            ]],
            ['q' => 'What should passengers do before boarding the bus?', 'answers' => [
                ['text' => 'Validate their tickets', 'correct' => true],
                ['text' => 'Show their ID cards', 'correct' => false],
                ['text' => 'Check the seating chart', 'correct' => false],
                ['text' => 'Confirm their destination', 'correct' => false],
            ]],
        ];

        foreach ($part1Questions as $index => $qData) {
            $question = Question::firstOrCreate(
                [
                    'exam_id' => $exam->eId,
                    'qContent' => $qData['q'],
                ],
                [
                    'qPoints' => 1,
                    'qMedia_url' => 'audio/question1-8_VSTEP_Sample_Test.mp3',
                ]
            );

            foreach ($qData['answers'] as $answerData) {
                Answer::firstOrCreate(
                    [
                        'question_id' => $question->qId,
                        'aContent' => $answerData['text'],
                    ],
                    [
                        'aIs_correct' => $answerData['correct'],
                    ]
                );
            }
        }

        // Part 2: Conversations (Questions 9-20)
        $part2Questions = [
            // Conversation 1
            ['q' => 'What is the man\'s main concern about the accommodation?', 'answers' => [
                ['text' => 'The cost of rent', 'correct' => true],
                ['text' => 'The size of the room', 'correct' => false],
                ['text' => 'The distance to campus', 'correct' => false],
                ['text' => 'The availability of facilities', 'correct' => false],
            ]],
            ['q' => 'What does the woman suggest about the utilities?', 'answers' => [
                ['text' => 'They are covered by the landlord.', 'correct' => false],
                ['text' => 'They are included in the rent.', 'correct' => true],
                ['text' => 'They are optional for students.', 'correct' => false],
                ['text' => 'They need to be paid separately.', 'correct' => false],
            ]],
            ['q' => 'Why does the man prefer a single room?', 'answers' => [
                ['text' => 'To focus on his studies', 'correct' => false],
                ['text' => 'To save money', 'correct' => false],
                ['text' => 'To have more privacy', 'correct' => true],
                ['text' => 'To avoid conflicts with the neighbors', 'correct' => false],
            ]],
            ['q' => 'What is the topic of the conversation?', 'answers' => [
                ['text' => 'Choosing a course', 'correct' => false],
                ['text' => 'Finding accommodation', 'correct' => true],
                ['text' => 'Budgeting expenses', 'correct' => false],
                ['text' => 'Joining a student club', 'correct' => false],
            ]],
            // Conversation 2
            ['q' => 'What is the purpose of the woman\'s trip?', 'answers' => [
                ['text' => 'Business', 'correct' => false],
                ['text' => 'Education', 'correct' => false],
                ['text' => 'Family visit', 'correct' => false],
                ['text' => 'Leisure', 'correct' => true],
            ]],
            ['q' => 'Why does the man recommend the city tour?', 'answers' => [
                ['text' => 'It\'s informative.', 'correct' => true],
                ['text' => 'It\'s affordable.', 'correct' => false],
                ['text' => 'It\'s popular with tourists.', 'correct' => false],
                ['text' => 'It\'s organized by locals.', 'correct' => false],
            ]],
            ['q' => 'What should visitors bring to the museum?', 'answers' => [
                ['text' => 'A guidebook', 'correct' => false],
                ['text' => 'Their tickets', 'correct' => true],
                ['text' => 'A camera', 'correct' => false],
                ['text' => 'A student ID', 'correct' => false],
            ]],
            ['q' => 'What is the man\'s role in the conversation?', 'answers' => [
                ['text' => 'A hotel receptionist', 'correct' => false],
                ['text' => 'A tour guide', 'correct' => false],
                ['text' => 'A travel agent', 'correct' => true],
                ['text' => 'A tourist', 'correct' => false],
            ]],
            // Conversation 3
            ['q' => 'Why does the woman need help with her assignment?', 'answers' => [
                ['text' => 'She doesn\'t know how to begin.', 'correct' => true],
                ['text' => 'She missed the last lecture.', 'correct' => false],
                ['text' => 'She has limited access to resources.', 'correct' => false],
                ['text' => 'She is running out of time.', 'correct' => false],
            ]],
            ['q' => 'What does the man suggest using for research?', 'answers' => [
                ['text' => 'Online journals', 'correct' => false],
                ['text' => 'Class notes', 'correct' => false],
                ['text' => 'The library\'s database', 'correct' => true],
                ['text' => 'A reference book', 'correct' => false],
            ]],
            ['q' => 'How does the woman feel about group work?', 'answers' => [
                ['text' => 'Excited', 'correct' => false],
                ['text' => 'Uninterested', 'correct' => false],
                ['text' => 'Confident', 'correct' => false],
                ['text' => 'Nervous', 'correct' => true],
            ]],
            ['q' => 'What is the conversation mainly about?', 'answers' => [
                ['text' => 'Preparing for an exam', 'correct' => false],
                ['text' => 'Completing an assignment', 'correct' => true],
                ['text' => 'Attending a workshop', 'correct' => false],
                ['text' => 'Choosing a project topic', 'correct' => false],
            ]],
        ];

        foreach ($part2Questions as $index => $qData) {
            $audioFile = $index < 4 ? 'audio/question9-12_VSTEP_Sample_Test.wav' : 
                        ($index < 8 ? 'audio/question13-16_VSTEP_Sample_Test.wav' : 'audio/question17-20_VSTEP_Sample_Test.wav');
            
            $question = Question::firstOrCreate(
                [
                    'exam_id' => $exam->eId,
                    'qContent' => $qData['q'],
                ],
                [
                    'qPoints' => 1,
                    'qMedia_url' => $audioFile,
                ]
            );

            foreach ($qData['answers'] as $answerData) {
                Answer::firstOrCreate(
                    [
                        'question_id' => $question->qId,
                        'aContent' => $answerData['text'],
                    ],
                    [
                        'aIs_correct' => $answerData['correct'],
                    ]
                );
            }
        }

        // Assign exam to class
        TestAssignment::firstOrCreate(
            [
                'exam_id' => $exam->eId,
                'taTarget_type' => 'class',
                'taTarget_id' => $class2->cId,
            ],
            [
                'taDeadline' => now()->addDays(30),
                'taMax_attempt' => 2,
                'taIs_public' => true,
            ]
        );

        $this->command->info('✅ Test System seeded successfully with real VSTEP data!');
        $this->command->info('');
        $this->command->info('📚 Created:');
        $this->command->info('   - 1 Teacher: 0336695863 / password123');
        $this->command->info('   - 5 Students: 0912345678-0952345678 / password123');
        $this->command->info('   - 3 Classes: IC3 courses');
        $this->command->info('   - 1 Exam: VSTEP Sample Test (20 questions)');
        $this->command->info('   - 1 Assignment: Assigned to class');
        $this->command->info('');
        $this->command->info('🎯 You can now test the system with real VSTEP listening questions!');
    }
}
