<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Exam;
use App\Models\Submission;
use App\Models\TestAssignment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class WebSocketApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $student;
    protected $teacher;
    protected $exam;
    protected $submission;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');

        $this->teacher = User::factory()->create(['uRole' => 'teacher']);
        $this->student = User::factory()->create(['uRole' => 'student']);
        
        $this->exam = Exam::factory()->create([
            'eTeacher_id' => $this->teacher->uId,
            'eStatus' => 'published',
        ]);

        TestAssignment::create([
            'exam_id' => $this->exam->eId,
            'student_id' => $this->student->uId,
            'assigned_at' => now(),
            'due_date' => now()->addDays(7),
            'status' => 'assigned',
        ]);

        $this->submission = Submission::create([
            'exam_id' => $this->exam->eId,
            'student_id' => $this->student->uId,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);
    }

    /** @test */
    public function student_can_connect_to_websocket()
    {
        $token = $this->student->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/student/websocket/connect', [
            'submission_id' => $this->submission->sId,
            'exam_id' => $this->exam->eId,
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function student_can_save_answer_via_websocket()
    {
        $token = $this->student->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/student/websocket/answer', [
            'submission_id' => $this->submission->sId,
            'question_id' => 1,
            'answer' => 'Test answer',
            'timestamp' => now()->toISOString(),
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function student_can_reconnect_to_websocket()
    {
        $token = $this->student->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/student/websocket/reconnect', [
            'submission_id' => $this->submission->sId,
            'last_activity' => now()->subMinutes(5)->toISOString(),
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function student_can_sync_time()
    {
        $token = $this->student->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/student/websocket/sync-time', [
            'client_time' => now()->toISOString(),
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function websocket_requires_authentication()
    {
        $response = $this->postJson('/api/student/websocket/connect', [
            'submission_id' => $this->submission->sId,
            'exam_id' => $this->exam->eId,
        ]);

        $response->assertStatus(401);
    }

    /** @test */
    public function websocket_requires_student_role()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/student/websocket/connect', [
            'submission_id' => $this->submission->sId,
            'exam_id' => $this->exam->eId,
        ]);

        $response->assertStatus(403);
    }
}