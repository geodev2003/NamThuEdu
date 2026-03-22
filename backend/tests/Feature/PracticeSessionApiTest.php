<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Exam;
use App\Models\ExamType;
use App\Models\ExamTemplate;
use App\Models\Question;
use App\Models\PracticeSession;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class PracticeSessionApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $teacher;
    protected $student;
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
    }

    /** @test */
    public function teacher_can_create_topic_based_practice_session()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/teacher/practice-sessions/topic-based', [
            'topic' => 'Reading Comprehension',
            'difficulty' => 'intermediate',
            'question_count' => 10,
            'duration_minutes' => 30,
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_can_create_template_based_practice_session()
    {
        $template = ExamTemplate::create([
            'template_name' => 'IELTS Reading Template',
            'template_category' => 'IELTS',
            'description' => 'Standard IELTS reading template',
            'total_duration' => 60,
            'is_active' => true,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/teacher/practice-sessions/template-based', [
            'template_id' => $template->template_id,
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_can_create_random_practice_session()
    {
        // Create some questions first
        $exam = Exam::factory()->create([
            'eTeacher_id' => $this->teacher->uId,
            
        ]);

        Question::factory()->count(20)->create([
            'exam_id' => $exam->eId,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/teacher/practice-sessions/random', [
            'question_count' => 10,
            'difficulty' => 'medium',
            'duration_minutes' => 20,
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_can_view_practice_sessions()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/teacher/practice-sessions');

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_can_view_practice_session_statistics()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/teacher/practice-sessions/statistics');

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_can_delete_practice_session()
    {
        $exam = Exam::factory()->create([
            'eTeacher_id' => $this->teacher->uId,
            
            'ePurpose' => 'practice',
        ]);

        $practiceSession = PracticeSession::create([
            'ps_exam_id' => $exam->eId,
            'ps_created_by' => $this->teacher->uId,
            'ps_type' => 'topic_based',
            'ps_topic' => 'Reading',
            'ps_difficulty' => 'medium',
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/teacher/practice-sessions/{$practiceSession->ps_id}");

        $response->assertStatus(200);
    }
}
