<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\ClassModel;
use App\Models\Exam;
use App\Models\Question;
use App\Models\Answer;
use App\Models\TestAssignment;
use App\Models\Submission;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Verify luồng học viên TEENS làm bài + chấm điểm tự động (objective).
 *
 * Flow: login → GET /tests → POST /tests/{taId}/start → POST answer mỗi câu
 *       → POST submit → assert graded + sScore đúng.
 */
class TeensTakeExamTest extends TestCase
{
    use RefreshDatabase;

    protected User $teacher;
    protected User $student;
    protected ClassModel $class;
    protected Exam $exam;
    protected TestAssignment $assignment;

    /** @var array<int,array{qId:int,correct:string,wrong:string}> */
    protected array $questionMeta = [];

    protected function setUp(): void
    {
        parent::setUp();
        $this->buildScenario();
    }

    /**
     * Tạo teacher + lớp teens + học viên teens + đề GENERAL objective + assignment.
     */
    private function buildScenario(): void
    {
        $this->teacher = User::factory()->create(['uRole' => 'teacher']);

        $this->class = ClassModel::create([
            'cName'        => 'Teens E2E Class',
            'cTeacher_id'  => $this->teacher->uId,
            'age_group'    => 'teens',
            'max_students' => 30,
            'cStatus'      => 'active',
        ]);

        $this->student = User::factory()->create([
            'uRole'     => 'student',
            'age_group' => 'teens',
            'class_id'  => $this->class->cId,
            'uStatus'   => 'active',
        ]);

        $this->exam = Exam::create([
            'eTitle'            => 'Teens English Test (Test)',
            'eDescription'      => 'objective mixed',
            'eType'             => 'GENERAL',
            'eSkill'            => 'mixed',
            'ePurpose'          => 'exam',
            'eDifficulty'       => 'easy',
            'eTeacher_id'       => $this->teacher->uId,
            'eDuration_minutes' => 30,
            'eTotal_score'      => 100,
            'ePass_score'       => 50,
            'eIs_private'       => false,
            'eSource_type'      => 'manual',
            'eStatus'           => 'published',
            'age_group'         => 'teens',
        ]);

        // 5 câu trắc nghiệm, mỗi câu 10 điểm; option đúng ở vị trí biết trước.
        $bank = [
            ['content' => 'She ___ to school.',        'options' => ['go', 'goes', 'going', 'gone'],          'correct' => 1],
            ['content' => 'They ___ playing now.',     'options' => ['is', 'am', 'are', 'be'],                'correct' => 2],
            ['content' => 'Opposite of happy is ___.', 'options' => ['glad', 'sad', 'big', 'fast'],           'correct' => 1],
            ['content' => 'A ___ teaches students.',   'options' => ['doctor', 'teacher', 'driver', 'farmer'],'correct' => 1],
            ['content' => 'It is sunny -> weather?',   'options' => ['rainy', 'snowy', 'sunny', 'windy'],     'correct' => 2],
        ];

        foreach ($bank as $i => $q) {
            $question = Question::create([
                'exam_id'        => $this->exam->eId,
                'qContent'       => $q['content'],
                'qType'          => 'multiple_choice',
                'qSection'       => 'grammar',
                'qSkill'         => 'grammar',
                'qSection_order' => $i + 1,
                'qPoints'        => 10,
            ]);

            $correctText = null;
            $wrongText    = null;
            foreach ($q['options'] as $idx => $optText) {
                Answer::create([
                    'question_id' => $question->qId,
                    'aContent'    => $optText,
                    'aIs_correct' => $idx === $q['correct'],
                ]);
                if ($idx === $q['correct']) $correctText = $optText;
                elseif ($wrongText === null) $wrongText = $optText;
            }

            $this->questionMeta[] = [
                'qId'     => $question->qId,
                'correct' => $correctText,
                'wrong'   => $wrongText,
            ];
        }

        $this->assignment = TestAssignment::create([
            'exam_id'       => $this->exam->eId,
            'taTarget_type' => 'class',
            'taTarget_id'   => $this->class->cId,
            'taDeadline'    => now()->addDays(7),
            'taMax_attempt' => 3,
            'taIs_public'   => true,
        ]);
    }

    private function startSubmission(): int
    {
        $res = $this->actingAs($this->student, 'sanctum')
            ->postJson("/api/student/tests/{$this->assignment->taId}/start", []);
        $res->assertStatus(200);
        return $res->json('data.submissionId');
    }

    private function answer(int $submissionId, int $questionId, string $text): void
    {
        $this->actingAs($this->student, 'sanctum')
            ->postJson("/api/student/tests/{$submissionId}/answer", [
                'question_id'   => $questionId,
                'saAnswer_text' => $text,
            ])
            ->assertStatus(200);
    }

    /** @test */
    public function teens_student_sees_assigned_exam_in_pending(): void
    {
        $res = $this->actingAs($this->student, 'sanctum')
            ->getJson('/api/student/tests');

        $res->assertStatus(200);
        $pending = collect($res->json('data.pending'));
        $this->assertTrue(
            $pending->contains('exam_id', $this->exam->eId),
            'Đề được gán phải xuất hiện trong nhóm pending của teens.'
        );
    }

    /** @test */
    public function teens_student_can_start_exam(): void
    {
        $submissionId = $this->startSubmission();
        $this->assertNotNull($submissionId);
        $this->assertDatabaseHas('submissions', [
            'sId'     => $submissionId,
            'user_id' => $this->student->uId,
            'exam_id' => $this->exam->eId,
            'sStatus' => 'in_progress',
        ]);
    }

    /** @test */
    public function all_correct_answers_score_full_marks(): void
    {
        $submissionId = $this->startSubmission();

        foreach ($this->questionMeta as $q) {
            $this->answer($submissionId, $q['qId'], $q['correct']);
        }

        $res = $this->actingAs($this->student, 'sanctum')
            ->postJson("/api/student/tests/{$submissionId}/submit", []);

        $res->assertStatus(200);
        $res->assertJsonPath('data.sStatus', 'graded');
        $this->assertEquals(100.0, (float) $res->json('data.sScore'));
    }

    /** @test */
    public function partial_correct_answers_score_proportionally(): void
    {
        $submissionId = $this->startSubmission();

        // 3 đúng / 5 sai -> 60%
        foreach ($this->questionMeta as $i => $q) {
            $text = $i < 3 ? $q['correct'] : $q['wrong'];
            $this->answer($submissionId, $q['qId'], $text);
        }

        $res = $this->actingAs($this->student, 'sanctum')
            ->postJson("/api/student/tests/{$submissionId}/submit", []);

        $res->assertStatus(200);
        $res->assertJsonPath('data.sStatus', 'graded');
        $this->assertEquals(60.0, (float) $res->json('data.sScore'));
    }

    /** @test */
    public function letter_based_answer_is_graded_correctly(): void
    {
        // Học viên gửi 'A'..'D' thay vì text — backend map theo thứ tự aId.
        $submissionId = $this->startSubmission();

        foreach ($this->questionMeta as $i => $q) {
            // index đúng -> letter
            $bank = [1, 2, 1, 1, 2]; // tương ứng correct index trong buildScenario
            $letter = chr(ord('A') + $bank[$i]);
            $this->answer($submissionId, $q['qId'], $letter);
        }

        $res = $this->actingAs($this->student, 'sanctum')
            ->postJson("/api/student/tests/{$submissionId}/submit", []);

        $res->assertStatus(200);
        $res->assertJsonPath('data.sStatus', 'graded');
        $this->assertEquals(100.0, (float) $res->json('data.sScore'));
    }

    /** @test */
    public function student_can_view_result_after_submit(): void
    {
        $submissionId = $this->startSubmission();
        foreach ($this->questionMeta as $q) {
            $this->answer($submissionId, $q['qId'], $q['correct']);
        }
        $this->actingAs($this->student, 'sanctum')
            ->postJson("/api/student/tests/{$submissionId}/submit", [])
            ->assertStatus(200);

        $res = $this->actingAs($this->student, 'sanctum')
            ->getJson("/api/student/submissions/{$submissionId}/answers");

        $res->assertStatus(200);
        $res->assertJsonPath('data.summary.correct_answers', 5);
        $res->assertJsonPath('data.summary.total_questions', 5);
    }
}
