<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Exam;
use App\Models\Submission;
use App\Models\TestAssignment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class DashboardApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $teacher;
    protected $student;
    protected $exam;

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
    }

    /** @test */
    public function teacher_can_view_test_statistics()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/teacher/dashboard/test-statistics/{$this->exam->eId}");

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_can_view_active_sessions()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/teacher/dashboard/active-sessions');

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_can_send_message_to_student()
    {
        $submission = Submission::create([
            'exam_id' => $this->exam->eId,
            'student_id' => $this->student->uId,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/teacher/dashboard/send-message', [
            'student_id' => $this->student->uId,
            'message' => 'Good luck with your test!',
            'submission_id' => $submission->sId,
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_can_view_connection_logs()
    {
        $submission = Submission::create([
            'exam_id' => $this->exam->eId,
            'student_id' => $this->student->uId,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/teacher/dashboard/connection-logs/{$submission->sId}");

        $response->assertStatus(200);
    }

    /** @test */
    public function dashboard_requires_teacher_role()
    {
        $token = $this->student->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/teacher/dashboard/test-statistics/{$this->exam->eId}");

        $response->assertStatus(403);
    }

    /** @test */
    public function teacher_can_only_view_own_exam_statistics()
    {
        $otherTeacher = User::factory()->create(['uRole' => 'teacher']);
        $otherExam = Exam::factory()->create([
            'eTeacher_id' => $otherTeacher->uId,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/teacher/dashboard/test-statistics/{$otherExam->eId}");

        $response->assertStatus(403);
    }
}