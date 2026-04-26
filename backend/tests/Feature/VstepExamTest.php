<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Exam;
use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;

class VstepExamTest extends TestCase
{
    use RefreshDatabase;

    protected $teacher;
    protected $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->teacher = User::factory()->create(['uRole' => 'teacher']);
        $this->token = $this->teacher->createToken('test')->plainTextToken;
    }

    private function authHeader(): array
    {
        return ['Authorization' => 'Bearer ' . $this->token];
    }

    // =============================================
    // BUG 1: Không tạo practice_session trong store()
    // =============================================

    /** @test */
    public function store_single_skill_vstep_does_not_create_practice_session()
    {
        $response = $this->withHeaders($this->authHeader())
            ->postJson('/api/teacher/exams', [
                'eTitle'            => 'VSTEP Reading Test',
                'eType'             => 'VSTEP',
                'eSkill'            => 'reading',
                'eDuration_minutes' => 60,
            ]);

        $response->assertStatus(200);

        // Không được có practice_session ngay khi mới tạo exam
        $this->assertDatabaseCount('practice_sessions', 0);
    }

    /** @test */
    public function store_mixed_vstep_does_not_create_practice_session()
    {
        $response = $this->withHeaders($this->authHeader())
            ->postJson('/api/teacher/exams', [
                'eTitle'            => 'VSTEP Full Exam',
                'eType'             => 'VSTEP',
                'eSkill'            => 'mixed',
                'eDuration_minutes' => 180,
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseCount('practice_sessions', 0);
    }

    // =============================================
    // BUG 2: saveVstepPart trả 404 thay vì auto-create
    // =============================================

    /** @test */
    public function save_vstep_reading_part_returns_404_when_exam_not_found()
    {
        $response = $this->withHeaders($this->authHeader())
            ->postJson('/api/teacher/exams/99999/vstep/parts/1', [
                'partName'  => 'Part 1',
                'passage'   => 'Some passage text here.',
                'wordCount' => 100,
                'questions' => [
                    [
                        'questionNumber' => 1,
                        'questionText'   => 'What is the main idea?',
                        'options'        => ['A' => 'Opt A', 'B' => 'Opt B', 'C' => 'Opt C', 'D' => 'Opt D'],
                        'correctAnswer'  => 'A',
                    ],
                ],
            ]);

        $response->assertStatus(404);
        $response->assertJson(['status' => 'error']);

        // Không được tạo exam mới
        $this->assertDatabaseCount('exams', 0);
    }

    /** @test */
    public function save_vstep_listening_part_returns_404_when_exam_not_found()
    {
        $response = $this->withHeaders($this->authHeader())
            ->postJson('/api/teacher/exams/99999/vstep/listening/parts/1', [
                'partName'           => 'Part 1',
                'audioUrl'           => 'https://example.com/audio.mp3',
                'audioDuration'      => 120,
                'completedQuestions' => 1,
                'totalQuestions'     => 8,
                'questions'          => [
                    [
                        'questionNumber' => 1,
                        'questionText'   => 'What did the speaker say?',
                        'options'        => ['A' => 'Opt A', 'B' => 'Opt B', 'C' => 'Opt C', 'D' => 'Opt D'],
                        'correctAnswer'  => 'B',
                    ],
                ],
            ]);

        $response->assertStatus(404);
        $response->assertJson(['status' => 'error']);
        $this->assertDatabaseCount('exams', 0);
    }

    /** @test */
    public function save_vstep_writing_task_returns_404_when_exam_not_found()
    {
        $response = $this->withHeaders($this->authHeader())
            ->postJson('/api/teacher/exams/99999/vstep/writing/tasks/1', [
                'taskName'  => 'Task 1',
                'prompt'    => 'Write a letter to your friend.',
                'wordCount' => [120, 150],
                'timeLimit' => 20,
            ]);

        $response->assertStatus(404);
        $response->assertJson(['status' => 'error']);
        $this->assertDatabaseCount('exams', 0);
    }

    /** @test */
    public function save_vstep_speaking_part_returns_404_when_exam_not_found()
    {
        $response = $this->withHeaders($this->authHeader())
            ->postJson('/api/teacher/exams/99999/vstep/speaking/parts/1', [
                'partName'  => 'Part 1',
                'timeLimit' => 3,
                'questions' => [
                    [
                        'questionNumber'  => 1,
                        'questionText'    => 'Tell me about yourself.',
                        'preparationTime' => 30,
                        'responseTime'    => 60,
                    ],
                ],
            ]);

        $response->assertStatus(404);
        $response->assertJson(['status' => 'error']);
        $this->assertDatabaseCount('exams', 0);
    }

    // =============================================
    // Happy path: Luồng đúng Reading
    // =============================================

    /** @test */
    public function teacher_can_save_vstep_reading_part_with_valid_exam()
    {
        // Bước 1: Tạo exam
        $createResponse = $this->withHeaders($this->authHeader())
            ->postJson('/api/teacher/exams', [
                'eTitle'            => 'VSTEP Reading',
                'eType'             => 'VSTEP',
                'eSkill'            => 'reading',
                'eDuration_minutes' => 60,
            ]);

        $createResponse->assertStatus(200);
        $examId = $createResponse->json('data.eId');
        $this->assertNotNull($examId);

        // Bước 2: Save Part 1
        $partResponse = $this->withHeaders($this->authHeader())
            ->postJson("/api/teacher/exams/{$examId}/vstep/parts/1", [
                'partName'  => 'Part 1',
                'passage'   => 'This is a reading passage.',
                'wordCount' => 200,
                'questions' => [
                    [
                        'questionNumber' => 1,
                        'questionText'   => 'What is the topic?',
                        'options'        => ['A' => 'Opt A', 'B' => 'Opt B', 'C' => 'Opt C', 'D' => 'Opt D'],
                        'correctAnswer'  => 'C',
                    ],
                ],
            ]);

        $partResponse->assertStatus(200);
        $partResponse->assertJson(['status' => 'success']);
        $partResponse->assertJsonPath('data.exam_id', $examId);

        // DB có đúng số câu hỏi
        $this->assertDatabaseCount('questions', 1);
    }
}
