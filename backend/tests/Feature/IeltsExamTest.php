<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Exam;
use App\Models\Question;
use App\Models\ContentBlock;
use App\Models\Answer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class IeltsExamTest extends TestCase
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

    /** @test */
    public function teacher_can_upload_listening_audio_file()
    {
        Storage::fake('public');

        $exam = Exam::create([
            'eTitle' => 'IELTS Test',
            'eType' => 'IELTS',
            'eSkill' => 'mixed',
            'eDuration_minutes' => 165,
            'eTeacher_id' => $this->teacher->uId,
        ]);

        $audioFile = UploadedFile::fake()->create('listening_part1.mp3', 1024, 'audio/mpeg');

        $response = $this->withHeaders($this->authHeader())
            ->postJson("/api/teacher/exams/{$exam->eId}/ielts/listening/sections/1/audio", [
                'audio' => $audioFile,
            ]);

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'success' => true,
        ]);

        $this->assertNotNull($response->json('audio_url'));
        $this->assertNotNull($response->json('data.audio_url'));

        // Verify the file was stored on the public disk
        $filename = $response->json('data.filename');
        Storage::disk('public')->assertExists('exam_audio/' . $filename);
    }

    /** @test */
    public function teacher_cannot_upload_invalid_file_type()
    {
        Storage::fake('public');

        $exam = Exam::create([
            'eTitle' => 'IELTS Test',
            'eType' => 'IELTS',
            'eSkill' => 'mixed',
            'eDuration_minutes' => 165,
            'eTeacher_id' => $this->teacher->uId,
        ]);

        $txtFile = UploadedFile::fake()->create('document.txt', 100, 'text/plain');

        $response = $this->withHeaders($this->authHeader())
            ->postJson("/api/teacher/exams/{$exam->eId}/ielts/listening/sections/1/audio", [
                'audio' => $txtFile,
            ]);

        $response->assertStatus(400);
        $response->assertJson(['status' => 'error']);
    }

    /** @test */
    public function teacher_can_publish_ielts_exam_with_full_test_data()
    {
        $exam = Exam::create([
            'eTitle' => 'IELTS Practice Exam',
            'eType' => 'IELTS',
            'eSkill' => 'mixed',
            'eDuration_minutes' => 165,
            'eTeacher_id' => $this->teacher->uId,
        ]);

        $ieltsData = [
            'listening' => [
                'sections' => [
                    [
                        'sectionNumber' => 1,
                        'audioUrl' => 'https://example.com/audio1.mp3',
                        'audioFileName' => 'audio1.mp3',
                        'transcript' => 'Section 1 transcript',
                        'questions' => [
                            [
                                'questionNumber' => 1,
                                'questionType' => 'multiple-choice',
                                'questionText' => 'Listening Q1 Text',
                                'options' => [
                                    'A' => 'Option A',
                                    'B' => 'Option B',
                                    'C' => 'Option C',
                                    'D' => 'Option D',
                                ],
                                'correctAnswer' => 'B',
                            ],
                            [
                                'questionNumber' => 2,
                                'questionType' => 'fill-in-the-blank',
                                'questionText' => 'Listening Q2 Text',
                                'correctAnswer' => 'completed',
                            ],
                        ],
                    ],
                ],
            ],
            'reading' => [
                'passages' => [
                    [
                        'passageNumber' => 1,
                        'title' => 'Reading Passage 1 Title',
                        'body' => 'Reading Passage 1 Body Content',
                        'wordCount' => 300,
                        'questions' => [
                            [
                                'questionNumber' => 11,
                                'questionType' => 'true-false-not-given',
                                'questionText' => 'Reading Q1 Text',
                                'correctAnswer' => 'TRUE',
                            ],
                        ],
                    ],
                ],
            ],
            'writing' => [
                'tasks' => [
                    [
                        'taskNumber' => 1,
                        'prompt' => 'Writing Task 1 Prompt',
                        'chartType' => 'bar_chart',
                    ],
                ],
            ],
            'speaking' => [
                'parts' => [
                    [
                        'partNumber' => 1,
                        'questions' => [
                            [
                                'text' => 'Speaking Q1 Text',
                                'topic' => 'hometown',
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $response = $this->withHeaders($this->authHeader())
            ->postJson("/api/teacher/exams/{$exam->eId}/publish", [
                'ielts_test_type' => 'Academic',
                'ielts_data' => $ieltsData,
            ]);

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
        ]);

        $response->assertJsonPath('data.questions_count', 5); // 2 Listening + 1 Reading + 1 Writing + 1 Speaking

        $exam->refresh();
        $this->assertEquals('Academic', $exam->ielts_test_type);
        $this->assertIsArray($exam->ielts_config);
        $this->assertEquals('published', $exam->eStatus);

        $this->assertDatabaseCount('content_blocks', 4);
        $this->assertDatabaseCount('questions', 5);
        $this->assertDatabaseCount('answers', 6);
    }
}
