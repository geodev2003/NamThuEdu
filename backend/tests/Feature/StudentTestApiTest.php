<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Exam;
use App\Models\ExamType;
use App\Models\Question;
use App\Models\TestAssignment;
use App\Models\Submission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class StudentTestApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $teacher;
    protected $student;
    protected $exam;
    protected $examType;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');

        $this->teacher = User::factory()->create(['uRole' => 'teacher']);

        $this->student = User::factory()->create(['uRole' => 'student']);

        $this->examType = ExamType::create([
            'etName' => 'IELTS',
            'etDescription' => 'IELTS Exam Type',
        ]);

        $this->exam = Exam::factory()->create([
            'eTeacher_id' => $this->teacher->uId,
            
            'eStatus' => 'published',
            'eDuration_minutes' => 60,
        ]);

        Question::factory()->count(5)->create([
            'exam_id' => $this->exam->eId,
        ]);
    }

    /** @test */
    public function student_can_view_assigned_tests()
    {
        TestAssignment::create([
            'exam_id' => $this->exam->eId,
            'student_id' => $this->student->uId,
            'assigned_by' => $this->teacher->uId,
            'due_date' => now()->addDays(7),
            'status' => 'assigned',
        ]);

        $token = $this->student->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/student/tests');

        $response->assertStatus(200)
                 ->assertStatus(200);
    }

    /** @test */
    public function student_can_start_test()
    {
        $assignment = TestAssignment::create([
            'exam_id' => $this->exam->eId,
            'student_id' => $this->student->uId,
            'assigned_by' => $this->teacher->uId,
            'due_date' => now()->addDays(7),
            'status' => 'assigned',
        ]);

        $token = $this->student->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/student/tests/{$this->exam->eId}/start");

        $response->assertStatus(200)
                 ->assertStatus(200);

        $this->assertDatabaseHas('submissions', [
            'exam_id' => $this->exam->eId,
            'student_id' => $this->student->uId,
            'status' => 'in_progress',
        ]);
    }

    /** @test */
    public function student_can_submit_answer()
    {
        $submission = Submission::create([
            'exam_id' => $this->exam->eId,
            'student_id' => $this->student->uId,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        $question = Question::where('exam_id', $this->exam->eId)->first();

        $token = $this->student->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/student/tests/{$submission->sId}/answer", [
            'question_id' => $question->qId,
            'answer' => 'Test Answer',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('submission_answers', [
            'submission_id' => $submission->sId,
            'question_id' => $question->qId,
        ]);
    }

    /** @test */
    public function student_can_submit_test()
    {
        $submission = Submission::create([
            'exam_id' => $this->exam->eId,
            'student_id' => $this->student->uId,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        $token = $this->student->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/student/tests/{$submission->sId}/submit");

        $response->assertStatus(200);

        $this->assertDatabaseHas('submissions', [
            'sId' => $submission->sId,
            'status' => 'submitted',
        ]);
    }

    /** @test */
    public function student_can_view_submission_history()
    {
        Submission::factory()->count(3)->create([
            'student_id' => $this->student->uId,
            'exam_id' => $this->exam->eId,
            'status' => 'graded',
        ]);

        $token = $this->student->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/student/submissions');

        $response->assertStatus(200)
                 ->assertStatus(200);
    }

    /** @test */
    public function student_cannot_start_test_twice()
    {
        $submission = Submission::create([
            'exam_id' => $this->exam->eId,
            'student_id' => $this->student->uId,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        $token = $this->student->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/student/tests/{$this->exam->eId}/start");

        $response->assertStatus(400);
    }
}
