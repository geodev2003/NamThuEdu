<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Exam;
use App\Models\ContentBlock;
use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Test endpoint /api/student/exams/{id}/ielts/detail
 *
 * Trả về metadata + sections (LIGHT — không full questions) để hiển thị
 * trang detail kiểu study4.com cho học viên.
 */
class IeltsStudentDetailTest extends TestCase
{
    use RefreshDatabase;

    /** @var User */
    protected $teacher;
    /** @var User */
    protected $student;
    /** @var string */
    protected $studentToken;

    protected function setUp(): void
    {
        parent::setUp();
        $this->teacher = User::factory()->teacher()->create();
        $this->student = User::factory()->student()->create();
        $this->studentToken = $this->student->createToken('test')->plainTextToken;
    }

    private function studentAuth(): array
    {
        return ['Authorization' => 'Bearer ' . $this->studentToken];
    }

    // ─────────────────────────────────────────────────────────────────────

    /** @test */
    public function student_can_load_published_listening_exam_detail()
    {
        $exam = $this->createPublishedListeningExam();

        $response = $this->withHeaders($this->studentAuth())
            ->getJson("/api/student/exams/{$exam->eId}/ielts/detail");

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.eId', $exam->eId)
            ->assertJsonPath('data.eType', 'IELTS')
            ->assertJsonPath('data.ielts_skill', 'listening')
            ->assertJsonPath('data.ielts_test_type', 'Academic')
            ->assertJsonPath('data.eDuration_minutes', 40)
            ->assertJsonPath('data.totalQuestions', 30); // 3 sections × 10 questions

        $sections = $response->json('data.sections');
        $this->assertIsArray($sections);
        $this->assertCount(3, $sections);
        $this->assertSame(10, $sections[0]['questionCount']);
        $this->assertStringStartsWith('Recording ', $sections[0]['name']);
    }

    /** @test */
    public function student_detail_returns_404_for_unpublished_exam()
    {
        $exam = Exam::create([
            'eTitle' => 'Draft',
            'eType' => 'IELTS',
            'eSkill' => 'listening',
            'eDuration_minutes' => 40,
            'eTeacher_id' => $this->teacher->uId,
            'ielts_skill' => 'listening',
            'ielts_test_type' => 'Academic',
            'eStatus' => 'draft',
        ]);

        $response = $this->withHeaders($this->studentAuth())
            ->getJson("/api/student/exams/{$exam->eId}/ielts/detail");
        $response->assertStatus(404);
    }

    /** @test */
    public function student_detail_returns_404_for_non_existent_exam()
    {
        $response = $this->withHeaders($this->studentAuth())
            ->getJson("/api/student/exams/999999/ielts/detail");
        $response->assertStatus(404);
    }

    /** @test */
    public function student_detail_includes_play_modes_from_config()
    {
        $exam = $this->createPublishedListeningExam([
            'play_modes' => [
                'practice_enabled' => true,
                'full_test_enabled' => false,
                'time_limit_options' => [null, 10, 20, 30],
            ],
        ]);

        $response = $this->withHeaders($this->studentAuth())
            ->getJson("/api/student/exams/{$exam->eId}/ielts/detail");

        $response->assertStatus(200)
            ->assertJsonPath('data.playMode.practice_enabled', true)
            ->assertJsonPath('data.playMode.full_test_enabled', false);

        $opts = $response->json('data.playMode.time_limit_options');
        $this->assertCount(4, $opts);
    }

    /** @test */
    public function student_detail_falls_back_to_default_play_modes_when_missing()
    {
        $exam = $this->createPublishedListeningExam(['no_play_modes' => true]);

        $response = $this->withHeaders($this->studentAuth())
            ->getJson("/api/student/exams/{$exam->eId}/ielts/detail");
        $response->assertStatus(200);

        $playMode = $response->json('data.playMode');
        $this->assertIsArray($playMode);
        $this->assertArrayHasKey('practice_enabled', $playMode);
        $this->assertArrayHasKey('full_test_enabled', $playMode);
    }

    /** @test */
    public function student_detail_returns_question_types_per_section()
    {
        $exam = $this->createPublishedListeningExam();

        $response = $this->withHeaders($this->studentAuth())
            ->getJson("/api/student/exams/{$exam->eId}/ielts/detail");
        $response->assertStatus(200);

        $section1Types = $response->json('data.sections.0.questionTypes');
        $this->assertIsArray($section1Types);
        $this->assertNotEmpty($section1Types, 'Section must report question types');
    }

    // ─────────────────────────────────────────────────────────────────────
    //  Helper
    // ─────────────────────────────────────────────────────────────────────

    /**
     * @param array $opts ['play_modes'?: array, 'no_play_modes'?: bool]
     */
    private function createPublishedListeningExam(array $opts = []): Exam
    {
        $config = [
            'test_type' => 'Academic',
            'skill' => 'listening',
        ];
        if (empty($opts['no_play_modes'])) {
            $config['play_modes'] = $opts['play_modes'] ?? [
                'practice_enabled' => true,
                'full_test_enabled' => true,
                'time_limit_options' => [null, 10, 20, 30],
            ];
        }

        $exam = Exam::create([
            'eTitle' => 'Cambridge IELTS Listening Test 1',
            'eDescription' => 'Sample description',
            'eType' => 'IELTS',
            'eSkill' => 'listening',
            'eDuration_minutes' => 40,
            'eTeacher_id' => $this->teacher->uId,
            'eStatus' => 'published',
            'eIs_private' => false,
            'ielts_skill' => 'listening',
            'ielts_test_type' => 'Academic',
            'ielts_config' => $config,
        ]);

        // Tạo 3 sections, mỗi section 10 câu
        for ($s = 1; $s <= 3; $s++) {
            $block = ContentBlock::create([
                'exam_id' => $exam->eId,
                'block_type' => 'audio',
                'content' => "https://x/section{$s}.mp3",
                'display_order' => $s,
                'metadata' => [
                    'section_number' => $s,
                    'audio_filename' => "section{$s}.mp3",
                ],
            ]);
            for ($q = 1; $q <= 10; $q++) {
                Question::create([
                    'exam_id' => $exam->eId,
                    'content_block_id' => $block->id,
                    'qContent' => "Q{$q}",
                    'qType' => 'multiple_choice',
                    'qSkill' => 'listening',
                    'qSection' => 'Listening',
                    'qPart' => $s,
                    'qSection_order' => $q,
                    'qPoints' => 1,
                    'qData' => ['question_number' => ($s - 1) * 10 + $q],
                ]);
            }
        }

        return $exam;
    }
}
