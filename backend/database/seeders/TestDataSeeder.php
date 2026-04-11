<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\ExamTemplate;
use App\Models\TemplateSection;
use App\Models\Exam;
use App\Models\Question;
use App\Models\Answer;
use App\Models\TestAssignment;
use App\Models\Submission;
use App\Models\SubmissionAnswer;

class TestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->command->info('🌱 Seeding test data...');

        // 1. Create Exam Templates
        $this->createExamTemplates();

        // 2. Create Sample Exams
        $this->createSampleExams();

        // 3. Create Test Assignments
        $this->createTestAssignments();

        // 4. Create Sample Submissions
        $this->createSampleSubmissions();

        $this->command->info('✅ Test data seeded successfully!');
    }

    private function createExamTemplates()
    {
        $this->command->info('Creating exam templates...');

        // Check if templates already exist
        if (ExamTemplate::where('template_code', 'VSTEP_B1B2')->exists()) {
            $this->command->info('✓ Templates already exist, skipping...');
            return;
        }

        // VSTEP B1-B2 Template
        $vstepTemplate = ExamTemplate::create([
            'template_name' => 'VSTEP B1-B2 Full Test',
            'template_code' => 'VSTEP_B1B2',
            'description' => 'Complete VSTEP B1-B2 exam template with all 4 skills',
            'category' => 'international',
            'level' => 'b1',
            'age_group' => 'adults',
            'total_duration_minutes' => 150,
            'skills' => json_encode(['listening', 'reading', 'writing', 'speaking']),
            'sections' => json_encode([
                ['name' => 'Listening', 'duration' => 40, 'questions' => 35],
                ['name' => 'Reading', 'duration' => 60, 'questions' => 40],
                ['name' => 'Writing', 'duration' => 60, 'questions' => 2],
                ['name' => 'Speaking', 'duration' => 12, 'questions' => 3],
            ]),
            'instructions' => 'Complete all 4 sections within the time limit',
            'is_active' => true,
        ]);

        // IELTS Academic Template
        $ieltsTemplate = ExamTemplate::create([
            'template_name' => 'IELTS Academic Full Test',
            'template_code' => 'IELTS_ACADEMIC',
            'description' => 'Complete IELTS Academic exam template',
            'category' => 'international',
            'level' => 'b2',
            'age_group' => 'adults',
            'total_duration_minutes' => 165,
            'skills' => json_encode(['listening', 'reading', 'writing', 'speaking']),
            'sections' => json_encode([
                ['name' => 'Listening', 'duration' => 30, 'questions' => 40],
                ['name' => 'Reading', 'duration' => 60, 'questions' => 40],
                ['name' => 'Writing', 'duration' => 60, 'questions' => 2],
                ['name' => 'Speaking', 'duration' => 15, 'questions' => 3],
            ]),
            'instructions' => 'IELTS Academic test instructions',
            'is_active' => true,
        ]);

        // General English Template
        $generalTemplate = ExamTemplate::create([
            'template_name' => 'General English Assessment',
            'template_code' => 'GENERAL_ENG',
            'description' => 'General English proficiency test',
            'category' => 'specialized',
            'level' => 'a2',
            'age_group' => 'teens',
            'total_duration_minutes' => 90,
            'skills' => json_encode(['reading', 'listening', 'grammar']),
            'sections' => json_encode([
                ['name' => 'Grammar & Vocabulary', 'duration' => 30, 'questions' => 25],
                ['name' => 'Reading', 'duration' => 40, 'questions' => 20],
                ['name' => 'Listening', 'duration' => 20, 'questions' => 15],
            ]),
            'instructions' => 'General English assessment instructions',
            'is_active' => true,
        ]);

        $this->command->info('✓ Created 3 exam templates');
    }

    private function createSampleExams()
    {
        $this->command->info('Creating sample exams...');

        // Get teacher ID (assuming teacher with phone 0336695863 exists)
        $teacherId = DB::table('users')->where('uPhone', '0336695863')->value('uId');

        if (!$teacherId) {
            $this->command->warn('⚠ Teacher not found, using ID 3');
            $teacherId = 3;
        }

        // Create Reading Exam
        $readingExam = Exam::create([
            'eTitle' => 'VSTEP Reading Practice Test',
            'eDescription' => 'Practice test for VSTEP reading section',
            'eType' => 'VSTEP',
            'eSkill' => 'reading',
            'ePurpose' => 'practice',
            'eDifficulty' => 'medium',
            'eTeacher_id' => $teacherId,
            'eDuration_minutes' => 60,
            'eTotal_score' => 100,
            'ePass_score' => 60,
            'eIs_private' => false,
            'eSource_type' => 'manual',
            'eStatus' => 'active',
        ]);

        // Add questions to reading exam
        for ($i = 1; $i <= 10; $i++) {
            $question = Question::create([
                'exam_id' => $readingExam->eId,
                'qType' => 'multiple_choice',
                'qContent' => "Reading question $i: What is the main idea of the passage?",
                'qPoints' => 10,
                'qSection_order' => $i,
                'qConfig' => json_encode([
                    'passage' => 'Sample reading passage text here...',
                    'correct_answer' => 'A',
                ]),
            ]);

            // Add answers
            Answer::create([
                'question_id' => $question->qId,
                'aContent' => 'Option A - Correct answer',
                'aIs_correct' => true,
            ]);

            Answer::create([
                'question_id' => $question->qId,
                'aContent' => 'Option B - Wrong answer',
                'aIs_correct' => false,
            ]);

            Answer::create([
                'question_id' => $question->qId,
                'aContent' => 'Option C - Wrong answer',
                'aIs_correct' => false,
            ]);

            Answer::create([
                'question_id' => $question->qId,
                'aContent' => 'Option D - Wrong answer',
                'aIs_correct' => false,
            ]);
        }

        // Create Listening Exam
        $listeningExam = Exam::create([
            'eTitle' => 'IELTS Listening Practice',
            'eDescription' => 'IELTS listening practice test',
            'eType' => 'IELTS',
            'eSkill' => 'listening',
            'ePurpose' => 'practice',
            'eDifficulty' => 'medium',
            'eTeacher_id' => $teacherId,
            'eDuration_minutes' => 30,
            'eTotal_score' => 100,
            'ePass_score' => 60,
            'eIs_private' => false,
            'eSource_type' => 'manual',
            'eStatus' => 'active',
        ]);

        // Add questions to listening exam
        for ($i = 1; $i <= 8; $i++) {
            $question = Question::create([
                'exam_id' => $listeningExam->eId,
                'qType' => 'multiple_choice',
                'qContent' => "Listening question $i: What did the speaker say about...?",
                'qPoints' => 12.5,
                'qSection_order' => $i,
                'qConfig' => json_encode([
                    'audio_url' => 'sample-audio.mp3',
                    'correct_answer' => 'B',
                ]),
            ]);

            // Add answers
            foreach (['A', 'B', 'C', 'D'] as $index => $option) {
                Answer::create([
                    'question_id' => $question->qId,
                    'aContent' => "Option $option",
                    'aIs_correct' => $option === 'B',
                ]);
            }
        }

        $this->command->info('✓ Created 2 sample exams with questions');
    }

    private function createTestAssignments()
    {
        $this->command->info('Creating test assignments...');

        // Get first exam
        $examId = DB::table('exams')->where('eStatus', 'active')->value('eId');
        
        if (!$examId) {
            $this->command->warn('⚠ No active exam found, skipping assignments');
            return;
        }

        // Get class IDs
        $classIds = DB::table('classes')->limit(2)->pluck('cId');

        foreach ($classIds as $classId) {
            TestAssignment::create([
                'exam_id' => $examId,
                'taTarget_type' => 'class',
                'taTarget_id' => $classId,
                'taDeadline' => now()->addDays(7),
                'taMax_attempt' => 2,
                'taIs_public' => true,
            ]);
        }

        $this->command->info('✓ Created test assignments');
    }

    private function createSampleSubmissions()
    {
        $this->command->info('Creating sample submissions...');

        // Get exam and students
        $exam = DB::table('exams')->where('eStatus', 'active')->first();
        
        if (!$exam) {
            $this->command->warn('⚠ No active exam found, skipping submissions');
            return;
        }

        $students = DB::table('users')
            ->where('uRole', 'student')
            ->whereNull('uDeleted_at')
            ->limit(3)
            ->get();

        if ($students->isEmpty()) {
            $this->command->warn('⚠ No students found, skipping submissions');
            return;
        }

        foreach ($students as $student) {
            // Create submission
            $submission = Submission::create([
                'exam_id' => $exam->eId,
                'user_id' => $student->uId,
                'sStatus' => 'graded',
                'sScore' => rand(60, 95),
                'sSubmit_time' => now()->subDays(rand(1, 5)),
                'sGraded_time' => now()->subDays(rand(0, 3)),
            ]);

            // Skip submission answers for now - table structure may vary
        }

        $this->command->info('✓ Created sample submissions with answers');
    }
}
