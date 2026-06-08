<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Exam;
use App\Models\ExamType;
use App\Models\Question;
use App\Models\Submission;
use App\Models\SubmissionAnswer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class GradingApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $teacher;
    protected $student;
    protected $exam;
    protected $submission;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');

        $this->teacher = User::factory()->create(['uRole' => 'teacher']);

        $classId = \Illuminate\Support\Facades\DB::table('classes')->insertGetId([
            'cName'       => 'Test Class',
            'cTeacher_id' => $this->teacher->uId,
            'cStatus'     => 'active',
            'age_group'   => 'adults',
        ]);

        $this->student = User::factory()->create([
            'uRole'      => 'student',
            'class_id'   => $classId,
            'age_group'  => 'adults',
        ]);

        $examType = ExamType::create([
            'etName' => 'IELTS',
            'etDescription' => 'IELTS Exam Type',
        ]);

        $this->exam = Exam::factory()->create([
            'eTeacher_id' => $this->teacher->uId,
            'eType' => 'GENERAL',
            'eTotal_score' => 10,
        ]);

        Question::factory()->count(5)->create([
            'exam_id' => $this->exam->eId,
            'qScore' => 2,
            'qType' => 'multiple_choice',
        ]);

        $this->submission = Submission::create([
            'exam_id' => $this->exam->eId,
            'user_id' => $this->student->uId,
            'sStatus' => 'submitted',
            'sStart_time' => now()->subHour(),
            'sSubmit_time' => now(),
            'sAttempt' => 1,
        ]);
    }

    /** @test */
    public function teacher_can_view_submissions()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/teacher/submissions');

        $response->assertStatus(200)
                 ->assertStatus(200);
    }

    /** @test */
    public function teacher_can_view_submission_detail()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/teacher/submissions/{$this->submission->sId}");

        $response->assertStatus(200)
                 ->assertStatus(200);
    }

    /** @test */
    public function teacher_can_auto_grade_submission()
    {
        $questions = Question::where('exam_id', $this->exam->eId)->get();

        foreach ($questions as $question) {
            SubmissionAnswer::create([
                'submission_id' => $this->submission->sId,
                'question_id' => $question->qId,
                'saAnswer_text' => $question->qCorrect_answer,
            ]);
        }

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/teacher/submissions/{$this->submission->sId}/auto-grade");

        if ($response->status() !== 200) {
            dump($response->json());
        }

        $response->assertStatus(200);

        $this->assertDatabaseHas('submissions', [
            'sId' => $this->submission->sId,
            'sStatus' => 'graded',
        ]);
    }

    /** @test */
    public function teacher_can_manually_grade_submission()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/teacher/submissions/{$this->submission->sId}/grade", [
            'score' => 8.5,
            'feedback' => 'Good work! Keep practicing.',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('submissions', [
            'sId' => $this->submission->sId,
            'sScore' => 8.5,
            'sStatus' => 'graded',
        ]);
    }

    /** @test */
    public function teacher_can_grade_with_detailed_feedback()
    {
        $questions = Question::where('exam_id', $this->exam->eId)->get();
        $questionGrades = [];

        foreach ($questions as $question) {
            SubmissionAnswer::create([
                'submission_id' => $this->submission->sId,
                'question_id' => $question->qId,
                'saAnswer_text' => 'Student answer',
            ]);

            $questionGrades[] = [
                'question_id' => $question->qId,
                'points_awarded' => 1.5,
                'feedback' => 'Partially correct',
                'is_correct' => false,
            ];
        }

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/teacher/submissions/{$this->submission->sId}/detailed-grade", [
            'question_grades' => $questionGrades,
            'overall_feedback' => 'Good effort overall',
        ]);

        $this->assertDatabaseHas('submissions', [
            'sId' => $this->submission->sId,
            'sStatus' => 'graded',
        ]);
    }

    /** @test */
    public function teacher_can_view_grading_statistics()
    {
        Submission::factory()->count(10)->create([
            'exam_id' => $this->exam->eId,
            'status' => 'graded',
            'score' => 7.5,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/teacher/grading/statistics');

        $response->assertStatus(200)
                 ->assertStatus(200);
    }

    /** @test */
    public function teacher_can_override_correct_answer()
    {
        $question = Question::where('exam_id', $this->exam->eId)->first();
        
        // Create 2 answers for this question
        $answer1 = \App\Models\Answer::create([
            'question_id' => $question->qId,
            'aContent' => 'Option A',
            'aIs_correct' => true,
        ]);
        
        $answer2 = \App\Models\Answer::create([
            'question_id' => $question->qId,
            'aContent' => 'Option B',
            'aIs_correct' => false,
        ]);

        // Student answer is Option B (incorrect under old key)
        $subAnswer = SubmissionAnswer::create([
            'submission_id' => $this->submission->sId,
            'question_id' => $question->qId,
            'saAnswer_text' => 'Option B',
            'saIs_correct' => false,
            'saPoints_awarded' => 0,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        // Override correct answer to Option B (answer2)
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/teacher/questions/{$question->qId}/override-correct-answer", [
            'correct_answer_id' => $answer2->aId,
            'submission_id' => $this->submission->sId,
        ]);

        $response->assertStatus(200);

        // Verify correct answer updated in database
        $this->assertDatabaseHas('answers', [
            'aId' => $answer1->aId,
            'aIs_correct' => false,
        ]);
        $this->assertDatabaseHas('answers', [
            'aId' => $answer2->aId,
            'aIs_correct' => true,
        ]);

        // Verify student submission answer updated to correct
        $this->assertDatabaseHas('submission_answers', [
            'submission_id' => $this->submission->sId,
            'question_id' => $question->qId,
            'saIs_correct' => true,
            'saPoints_awarded' => $question->qPoints ?? 1,
        ]);
    }
}
