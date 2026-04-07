<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Exam;
use App\Models\Question;
use App\Models\Answer;
use App\Models\Classes;
use App\Models\ClassEnrollment;
use Illuminate\Support\Facades\Hash;

class TeacherExamSeeder extends Seeder
{
    /**
     * Seed data for testing teacher exam and assignment features
     */
    public function run(): void
    {
        // 1. Create Teacher Account
        $teacher = User::firstOrCreate(
            ['uPhone' => '0901111111'],
            [
                'uName' => 'Giáo viên Test',
                'uPassword' => Hash::make('123456'),
                'uRole' => 'teacher',
                'uStatus' => 'active',
            ]
        );

        echo "✅ Created teacher: 0901111111 / 123456\n";

        // 2. Create Students
        $students = [];
        for ($i = 1; $i <= 5; $i++) {
            $students[] = User::firstOrCreate(
                ['uPhone' => "090222222{$i}"],
                [
                    'uName' => "Học viên Test {$i}",
                    'uPassword' => Hash::make('123456'),
                    'uRole' => 'student',
                    'uStatus' => 'active',
                    'age_group' => ['kids', 'teens', 'adults'][rand(0, 2)],
                ]
            );
        }

        echo "✅ Created 5 students: 0902222221 to 0902222225 / 123456\n";

        // 3. Create Class
        $class = Classes::firstOrCreate(
            ['cName' => 'Lớp Test A1'],
            [
                'cDescription' => 'Lớp học thử nghiệm cho giáo viên',
                'cTeacher_id' => $teacher->uId,
                'cStatus' => 'active',
            ]
        );

        // Enroll students to class
        foreach ($students as $student) {
            ClassEnrollment::firstOrCreate([
                'class_id' => $class->cId,
                'student_id' => $student->uId,
            ]);
        }

        echo "✅ Created class and enrolled 5 students\n";

        // 4. Create VSTEP Listening Exam
        $vstepExam = Exam::create([
            'eTitle' => 'VSTEP Listening Practice Test 1',
            'eDescription' => 'Đề thi thử VSTEP kỹ năng Listening - Part 1, 2, 3',
            'eType' => 'VSTEP',
            'eSkill' => 'listening',
            'eTeacher_id' => $teacher->uId,
            'eDuration_minutes' => 40,
            'eIs_private' => false,
            'eSource_type' => 'manual',
            'eDifficulty' => 'medium',
            'eTarget_level' => 'B1',
        ]);

        // VSTEP Part 1 - Multiple Choice
        for ($i = 1; $i <= 8; $i++) {
            $question = Question::create([
                'exam_id' => $vstepExam->eId,
                'qContent' => "Question {$i}: You will hear a short conversation. What is the main topic?",
                'qType' => 'multiple_choice',
                'qPoints' => 1,
                'qSection' => 'Part 1',
                'qMedia_url' => "https://example.com/audio/vstep-part1-q{$i}.mp3",
                'qAudio_duration' => 30,
                'qListen_limit' => 2,
                'qDifficulty' => 'easy',
            ]);

            Answer::create(['question_id' => $question->qId, 'aContent' => 'A travel plan', 'aIs_correct' => true]);
            Answer::create(['question_id' => $question->qId, 'aContent' => 'A business meeting', 'aIs_correct' => false]);
            Answer::create(['question_id' => $question->qId, 'aContent' => 'A school event', 'aIs_correct' => false]);
            Answer::create(['question_id' => $question->qId, 'aContent' => 'A family gathering', 'aIs_correct' => false]);
        }

        echo "✅ Created VSTEP Listening exam with 8 questions\n";

        // 5. Create IELTS Reading Exam
        $ieltsExam = Exam::create([
            'eTitle' => 'IELTS Reading Practice Test 1',
            'eDescription' => 'Đề thi thử IELTS kỹ năng Reading - 3 passages',
            'eType' => 'IELTS',
            'eSkill' => 'reading',
            'eTeacher_id' => $teacher->uId,
            'eDuration_minutes' => 60,
            'eIs_private' => false,
            'eSource_type' => 'manual',
            'eDifficulty' => 'hard',
            'eTarget_level' => 'B2',
        ]);

        $passage = "Climate change is one of the most pressing issues facing humanity today. Scientists have observed significant changes in global temperatures over the past century, with the last decade being the warmest on record. The primary cause of this warming trend is the increase in greenhouse gas emissions from human activities, particularly the burning of fossil fuels for energy and transportation.";

        // IELTS Reading - True/False/Not Given
        for ($i = 1; $i <= 5; $i++) {
            $question = Question::create([
                'exam_id' => $ieltsExam->eId,
                'qContent' => "Statement {$i}: The last decade has been the warmest in recorded history.\n\nPassage: {$passage}",
                'qType' => 'multiple_choice',
                'qPoints' => 1,
                'qSection' => 'Reading Passage 1',
                'qDifficulty' => 'medium',
            ]);

            Answer::create(['question_id' => $question->qId, 'aContent' => 'True', 'aIs_correct' => $i === 1]);
            Answer::create(['question_id' => $question->qId, 'aContent' => 'False', 'aIs_correct' => false]);
            Answer::create(['question_id' => $question->qId, 'aContent' => 'Not Given', 'aIs_correct' => $i !== 1]);
        }

        // IELTS Reading - Multiple Choice
        for ($i = 6; $i <= 10; $i++) {
            $question = Question::create([
                'exam_id' => $ieltsExam->eId,
                'qContent' => "Question {$i}: According to the passage, what is the primary cause of global warming?\n\nPassage: {$passage}",
                'qType' => 'multiple_choice',
                'qPoints' => 1,
                'qSection' => 'Reading Passage 1',
                'qDifficulty' => 'medium',
            ]);

            Answer::create(['question_id' => $question->qId, 'aContent' => 'Greenhouse gas emissions', 'aIs_correct' => true]);
            Answer::create(['question_id' => $question->qId, 'aContent' => 'Natural climate cycles', 'aIs_correct' => false]);
            Answer::create(['question_id' => $question->qId, 'aContent' => 'Solar radiation', 'aIs_correct' => false]);
            Answer::create(['question_id' => $question->qId, 'aContent' => 'Volcanic activity', 'aIs_correct' => false]);
        }

        echo "✅ Created IELTS Reading exam with 10 questions\n";

        // 6. Create General Mixed Skills Exam
        $generalExam = Exam::create([
            'eTitle' => 'General English Test - Mixed Skills',
            'eDescription' => 'Bài kiểm tra tổng hợp các kỹ năng tiếng Anh',
            'eType' => 'GENERAL',
            'eSkill' => 'mixed',
            'eTeacher_id' => $teacher->uId,
            'eDuration_minutes' => 90,
            'eIs_private' => false,
            'eSource_type' => 'manual',
            'eDifficulty' => 'medium',
            'eTarget_level' => 'B1',
        ]);

        // Grammar - Multiple Choice
        for ($i = 1; $i <= 5; $i++) {
            $question = Question::create([
                'exam_id' => $generalExam->eId,
                'qContent' => "Choose the correct answer: She _____ to the market every Sunday.",
                'qType' => 'multiple_choice',
                'qPoints' => 2,
                'qSection' => 'Grammar',
                'qDifficulty' => 'easy',
            ]);

            Answer::create(['question_id' => $question->qId, 'aContent' => 'goes', 'aIs_correct' => true]);
            Answer::create(['question_id' => $question->qId, 'aContent' => 'go', 'aIs_correct' => false]);
            Answer::create(['question_id' => $question->qId, 'aContent' => 'going', 'aIs_correct' => false]);
            Answer::create(['question_id' => $question->qId, 'aContent' => 'gone', 'aIs_correct' => false]);
        }

        // Fill in the blank
        for ($i = 6; $i <= 10; $i++) {
            $question = Question::create([
                'exam_id' => $generalExam->eId,
                'qContent' => "Fill in the blank: I have _____ finished my homework.",
                'qType' => 'fill_blank',
                'qPoints' => 2,
                'qSection' => 'Grammar',
                'qDifficulty' => 'medium',
            ]);

            Answer::create(['question_id' => $question->qId, 'aContent' => 'just', 'aIs_correct' => true]);
            Answer::create(['question_id' => $question->qId, 'aContent' => 'already', 'aIs_correct' => true]);
        }

        // Writing - Essay
        $question = Question::create([
            'exam_id' => $generalExam->eId,
            'qContent' => "Write an essay (150-200 words) about the advantages and disadvantages of social media.",
            'qType' => 'essay',
            'qPoints' => 20,
            'qSection' => 'Writing',
            'qDifficulty' => 'hard',
        ]);

        Answer::create(['question_id' => $question->qId, 'aContent' => 'Manual grading required', 'aIs_correct' => true]);

        echo "✅ Created General Mixed exam with 11 questions\n";

        // 7. Create Writing Exam
        $writingExam = Exam::create([
            'eTitle' => 'IELTS Writing Task 1 & 2',
            'eDescription' => 'Đề thi IELTS Writing với 2 tasks',
            'eType' => 'IELTS',
            'eSkill' => 'writing',
            'eTeacher_id' => $teacher->uId,
            'eDuration_minutes' => 60,
            'eIs_private' => false,
            'eSource_type' => 'manual',
            'eDifficulty' => 'hard',
            'eTarget_level' => 'B2',
        ]);

        // Task 1
        $question = Question::create([
            'exam_id' => $writingExam->eId,
            'qContent' => "The chart below shows the percentage of households in different income brackets in a city. Summarize the information by selecting and reporting the main features. (Write at least 150 words)",
            'qType' => 'short_writing',
            'qPoints' => 30,
            'qSection' => 'Task 1',
            'qDifficulty' => 'medium',
        ]);

        Answer::create(['question_id' => $question->qId, 'aContent' => 'Manual grading required', 'aIs_correct' => true]);

        // Task 2
        $question = Question::create([
            'exam_id' => $writingExam->eId,
            'qContent' => "Some people believe that technology has made our lives more complicated. Others think it has made life easier. Discuss both views and give your opinion. Write at least 250 words.",
            'qType' => 'essay',
            'qPoints' => 40,
            'qSection' => 'Task 2',
            'qDifficulty' => 'hard',
        ]);

        Answer::create(['question_id' => $question->qId, 'aContent' => 'Manual grading required', 'aIs_correct' => true]);

        echo "✅ Created IELTS Writing exam with 2 tasks\n";

        // Summary
        echo "\n📊 SEED DATA SUMMARY:\n";
        echo "==========================================\n";
        echo "Teacher: 0901111111 / 123456\n";
        echo "Students: 0902222221 to 0902222225 / 123456\n";
        echo "Class: Lớp Test A1 (5 students enrolled)\n";
        echo "\nExams created:\n";
        echo "1. VSTEP Listening (8 questions, 40 mins)\n";
        echo "2. IELTS Reading (10 questions, 60 mins)\n";
        echo "3. General Mixed (11 questions, 90 mins)\n";
        echo "4. IELTS Writing (2 tasks, 60 mins)\n";
        echo "\nTotal: 4 exams, 31 questions\n";
        echo "==========================================\n";
    }
}
