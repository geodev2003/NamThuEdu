<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Exam;
use App\Models\ExamType;
use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class ExamApiTest extends TestCase
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
    public function teacher_can_create_exam()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/teacher/exams', [
            'eTitle' => 'IELTS Reading Test 1',
            'eDescription' => 'Practice test for IELTS Reading',
            'eType' => 'IELTS',
            'eSkill' => 'reading',
            'eDuration_minutes' => 60,
            'eTotal_score' => 9.0,
            'ePass_score' => 5.0,
            'eDifficulty_level' => 'intermediate',
            'eStatus' => 'draft',
        ]);

        $response->assertStatus(200);
        
        // Just check basic structure
        $data = $response->json();
        $this->assertArrayHasKey('status', $data);

        $this->assertDatabaseHas('exams', [
            'eTitle' => 'IELTS Reading Test 1',
            'eTeacher_id' => $this->teacher->uId,
        ]);
    }

    /** @test */
    public function teacher_can_view_their_exams()
    {
        Exam::factory()->count(5)->create([
            'eTeacher_id' => $this->teacher->uId,
            
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/teacher/exams');

        $response->assertStatus(200)
                 ->assertStatus(200);
    }

    /** @test */
    public function teacher_can_add_questions_to_exam()
    {
        $exam = Exam::factory()->create([
            'eTeacher_id' => $this->teacher->uId,
            
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/teacher/exams/{$exam->eId}/questions", [
            'questions' => [
                [
                    'qContent' => 'What is the capital of Vietnam?',
                    'qPoints' => 1,
                    'answers' => [
                        ['aContent' => 'Hanoi', 'aIs_correct' => true],
                        ['aContent' => 'Ho Chi Minh', 'aIs_correct' => false],
                        ['aContent' => 'Da Nang', 'aIs_correct' => false],
                        ['aContent' => 'Hue', 'aIs_correct' => false],
                    ]
                ],
                [
                    'qContent' => 'What is 2 + 2?',
                    'qPoints' => 1,
                    'answers' => [
                        ['aContent' => '3', 'aIs_correct' => false],
                        ['aContent' => '4', 'aIs_correct' => true],
                        ['aContent' => '5', 'aIs_correct' => false],
                        ['aContent' => '6', 'aIs_correct' => false],
                    ]
                ]
            ]
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('questions', [
            'exam_id' => $exam->eId,
            'qContent' => 'What is the capital of Vietnam?',
        ]);
    }

    /** @test */
    public function teacher_can_publish_exam()
    {
        $exam = Exam::factory()->create([
            'eTeacher_id' => $this->teacher->uId,
            
            'eStatus' => 'draft',
        ]);

        // Add questions to the exam first
        Question::factory()->count(3)->create([
            'exam_id' => $exam->eId,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/teacher/exams/{$exam->eId}/publish");

        $response->assertStatus(200);

        $this->assertDatabaseHas('exams', [
            'eId' => $exam->eId,
            'eStatus' => 'published',
        ]);
    }

    /** @test */
    public function teacher_can_clone_exam()
    {
        $exam = Exam::factory()->create([
            'eTeacher_id' => $this->teacher->uId,
            
            'eTitle' => 'Original Exam',
        ]);

        Question::factory()->count(3)->create([
            'exam_id' => $exam->eId,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/teacher/exams/{$exam->eId}/clone", [
            'eTitle' => 'Cloned Exam',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('exams', [
            'eTitle' => 'Cloned Exam',
            'eParent_exam_id' => $exam->eId,
        ]);
    }

    /** @test */
    public function teacher_can_delete_exam()
    {
        $exam = Exam::factory()->create([
            'eTeacher_id' => $this->teacher->uId,
            
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/teacher/exams/{$exam->eId}");

        $response->assertStatus(200);
    }
}
