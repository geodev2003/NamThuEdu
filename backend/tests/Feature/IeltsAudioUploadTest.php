<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Exam;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Test endpoint upload audio cho IELTS Listening section.
 * POST /api/teacher/exams/{examId}/ielts/listening/sections/{sectionNumber}/audio
 */
class IeltsAudioUploadTest extends TestCase
{
    use RefreshDatabase;

    /** @var User */
    protected $teacher;
    /** @var string */
    protected $token;
    /** @var Exam */
    protected $exam;

    protected function setUp(): void
    {
        parent::setUp();
        $this->teacher = User::factory()->teacher()->create();
        $this->token = $this->teacher->createToken('test')->plainTextToken;
        $this->exam = Exam::create([
            'eTitle' => 'IELTS Listening',
            'eType' => 'IELTS',
            'eSkill' => 'listening',
            'eDuration_minutes' => 40,
            'eTeacher_id' => $this->teacher->uId,
            'ielts_skill' => 'listening',
            'ielts_test_type' => 'Academic',
            'eStatus' => 'draft',
        ]);
    }

    private function authHeader(): array
    {
        return ['Authorization' => 'Bearer ' . $this->token];
    }

    private function uploadAudio($examId, $sectionNumber, $file)
    {
        return $this->withHeaders($this->authHeader())
            ->postJson(
                "/api/teacher/exams/{$examId}/ielts/listening/sections/{$sectionNumber}/audio",
                ['audio' => $file]
            );
    }

    /** @test */
    public function teacher_can_upload_mp3_to_section_1()
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->create('section1.mp3', 1024, 'audio/mpeg');

        $response = $this->uploadAudio($this->exam->eId, 1, $file);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success');

        $this->assertNotNull($response->json('audio_url'));
        $this->assertStringContainsString('files/audio/', $response->json('audio_url'));

        $filename = $response->json('data.filename');
        Storage::disk('public')->assertExists("exam_audio/{$filename}");
    }

    /** @test */
    public function upload_accepts_each_section_number_from_1_to_4()
    {
        Storage::fake('public');
        for ($s = 1; $s <= 4; $s++) {
            $file = UploadedFile::fake()->create("s{$s}.mp3", 256, 'audio/mpeg');
            $this->uploadAudio($this->exam->eId, $s, $file)
                ->assertStatus(200);
        }
    }

    /** @test */
    public function upload_rejects_section_number_below_1()
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->create('a.mp3', 100, 'audio/mpeg');
        $this->uploadAudio($this->exam->eId, 0, $file)
            ->assertStatus(400);
    }

    /** @test */
    public function upload_rejects_section_number_above_4()
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->create('a.mp3', 100, 'audio/mpeg');
        $this->uploadAudio($this->exam->eId, 5, $file)
            ->assertStatus(400);
    }

    /** @test */
    public function upload_rejects_non_audio_mime()
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->create('doc.txt', 50, 'text/plain');
        $this->uploadAudio($this->exam->eId, 1, $file)
            ->assertStatus(400)
            ->assertJsonPath('status', 'error');
    }

    /** @test */
    public function upload_rejects_oversized_file()
    {
        Storage::fake('public');
        // 51 MB > 50 MB limit
        $file = UploadedFile::fake()->create('big.mp3', 51 * 1024, 'audio/mpeg');
        $this->uploadAudio($this->exam->eId, 1, $file)
            ->assertStatus(400);
    }

    /** @test */
    public function upload_rejects_when_audio_field_missing()
    {
        $response = $this->withHeaders($this->authHeader())
            ->postJson(
                "/api/teacher/exams/{$this->exam->eId}/ielts/listening/sections/1/audio",
                []
            );
        $response->assertStatus(400);
    }

    /** @test */
    public function upload_returns_404_for_non_existent_exam()
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->create('a.mp3', 100, 'audio/mpeg');
        $this->withHeaders($this->authHeader())
            ->postJson(
                '/api/teacher/exams/999999/ielts/listening/sections/1/audio',
                ['audio' => $file]
            )
            ->assertStatus(404);
    }

    /** @test */
    public function upload_returns_404_when_exam_belongs_to_other_teacher()
    {
        Storage::fake('public');
        $other = User::factory()->teacher()->create();
        $foreignExam = Exam::create([
            'eTitle' => 'Foreign',
            'eType' => 'IELTS',
            'eSkill' => 'listening',
            'eDuration_minutes' => 40,
            'eTeacher_id' => $other->uId,
        ]);

        $file = UploadedFile::fake()->create('a.mp3', 100, 'audio/mpeg');
        $this->uploadAudio($foreignExam->eId, 1, $file)
            ->assertStatus(404);
    }

    /** @test */
    public function upload_response_includes_filename_and_url()
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->create('original.mp3', 200, 'audio/mpeg');
        $response = $this->uploadAudio($this->exam->eId, 1, $file);

        $response->assertStatus(200);
        $this->assertNotNull($response->json('data.filename'));
        $this->assertNotNull($response->json('data.audio_url'));
        $this->assertSame('original.mp3', $response->json('data.originalName'));
    }
}
