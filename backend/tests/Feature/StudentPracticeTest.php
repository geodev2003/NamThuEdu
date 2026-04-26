<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Exam;
use App\Models\PracticeSession;
use App\Models\Question;
use App\Models\Answer;
use App\Models\Submission;
use App\Models\SubmissionAnswer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

class StudentPracticeTest extends TestCase
{
    use RefreshDatabase;

    protected $student;
    protected $teacher;
    protected $token;
    protected $exam;
    protected $session;

    protected function setUp(): void
    {
        parent::setUp();

        $this->teacher = User::factory()->create(['uRole' => 'teacher']);

        // Tạo class rồi mới tạo student (User model yêu cầu student phải có class_id)
        $classId = DB::table('classes')->insertGetId([
            'cName'       => 'Test Class',
            'cTeacher_id' => $this->teacher->uId,
            'cStatus'     => 'active',
            'age_group'   => 'adults',
        ]);

        $this->student = User::factory()->create([
            'uRole'      => 'student',
            'class_id'   => $classId,
            'age_group'  => 'adults',
        ]);
        $this->token = $this->student->createToken('test')->plainTextToken;

        // Tạo exam VSTEP Reading
        $this->exam = Exam::create([
            'eTitle'            => 'VSTEP Reading Practice',
            'eType'             => 'VSTEP',
            'eSkill'            => 'reading',
            'eTeacher_id'       => $this->teacher->uId,
            'eDuration_minutes' => 60,
            'eIs_private'       => true,
            'eSource_type'      => 'manual',
            'ePurpose'          => 'practice',
        ]);

        // Tạo 2 câu hỏi MCQ
        for ($i = 1; $i <= 2; $i++) {
            $q = Question::create([
                'exam_id'  => $this->exam->eId,
                'qContent' => "Question $i",
                'qType'    => 'multiple_choice',
                'qPart'    => 1,
                'qPoints'  => 1,
            ]);
            for ($j = 1; $j <= 4; $j++) {
                Answer::create([
                    'question_id' => $q->qId,
                    'aContent'    => "Option $j",
                    'aIs_correct' => $j === 1,
                ]);
            }
        }

        // Tạo practice session
        $this->session = PracticeSession::create([
            'ps_title'            => 'VSTEP Reading Luyện tập',
            'ps_type'             => 'skill_based',
            'ps_purpose'          => 'practice',
            'ps_target_skill'     => 'reading',
            'ps_difficulty'       => 'medium',
            'ps_duration_minutes' => 60,
            'ps_teacher_id'       => $this->teacher->uId,
            'ps_exam_id'          => $this->exam->eId,
            'ps_is_active'        => true,
        ]);
    }

    private function auth(): array
    {
        return ['Authorization' => 'Bearer ' . $this->token];
    }

    // =============================================
    // index
    // =============================================

    /** @test */
    public function student_can_list_practice_sessions()
    {
        $res = $this->withHeaders($this->auth())->getJson('/api/student/practice');

        $res->assertStatus(200);
        $res->assertJsonPath('status', 'success');
        $this->assertCount(1, $res->json('data'));
        $this->assertEquals($this->session->ps_id, $res->json('data.0.ps_id'));
        $this->assertEquals(0, $res->json('data.0.attempts_count'));
    }

    /** @test */
    public function index_shows_attempt_count_correctly()
    {
        Submission::create([
            'user_id'       => $this->student->uId,
            'exam_id'       => $this->exam->eId,
            'assignment_id' => null,
            'sAttempt'      => 1,
            'sStart_time'   => now(),
            'sStatus'       => 'graded',
        ]);

        $res = $this->withHeaders($this->auth())->getJson('/api/student/practice');

        $res->assertStatus(200);
        $this->assertEquals(1, $res->json('data.0.attempts_count'));
    }

    // =============================================
    // show
    // =============================================

    /** @test */
    public function student_can_view_practice_session_detail()
    {
        $res = $this->withHeaders($this->auth())
            ->getJson('/api/student/practice/' . $this->session->ps_id);

        $res->assertStatus(200);
        $res->assertJsonPath('status', 'success');
        $res->assertJsonPath('data.ps_id', $this->session->ps_id);

        // VSTEP: câu hỏi nằm trong vstep_structure.parts[].questions
        $vstep = $res->json('data.exam.vstep_structure');
        $this->assertNotNull($vstep, 'VSTEP structure should be present');
        $this->assertArrayHasKey('parts', $vstep);

        // Đáp án đúng phải bị ẩn trong các answers
        $firstPartQuestions = $vstep['parts'][0]['questions'] ?? [];
        if (!empty($firstPartQuestions)) {
            $answers = $firstPartQuestions[0]['answers'] ?? [];
            foreach ($answers as $a) {
                $this->assertArrayNotHasKey('aIs_correct', $a);
            }
        }
    }

    /** @test */
    public function show_returns_404_for_inactive_session()
    {
        $this->session->update(['ps_is_active' => false]);

        $res = $this->withHeaders($this->auth())
            ->getJson('/api/student/practice/' . $this->session->ps_id);

        $res->assertStatus(404);
    }

    // =============================================
    // start
    // =============================================

    /** @test */
    public function student_can_start_practice_session()
    {
        $res = $this->withHeaders($this->auth())
            ->postJson('/api/student/practice/' . $this->session->ps_id . '/start');

        $res->assertStatus(200);
        $res->assertJsonPath('status', 'success');
        $this->assertNotNull($res->json('data.submissionId'));
        $this->assertEquals(3600, $res->json('data.timeLimit')); // 60 phút * 60 giây

        $this->assertDatabaseHas('submissions', [
            'user_id'       => $this->student->uId,
            'exam_id'       => $this->exam->eId,
            'assignment_id' => null,
            'sStatus'       => 'in_progress',
        ]);
    }

    /** @test */
    public function start_resumes_existing_in_progress_submission()
    {
        $existing = Submission::create([
            'user_id'       => $this->student->uId,
            'exam_id'       => $this->exam->eId,
            'assignment_id' => null,
            'sAttempt'      => 1,
            'sStart_time'   => now()->subMinutes(5),
            'sStatus'       => 'in_progress',
        ]);

        $res = $this->withHeaders($this->auth())
            ->postJson('/api/student/practice/' . $this->session->ps_id . '/start');

        $res->assertStatus(200);
        $res->assertJsonPath('status', 'info');
        $this->assertEquals($existing->sId, $res->json('data.submissionId'));
        $this->assertTrue($res->json('data.canResume'));
        $this->assertDatabaseCount('submissions', 1); // Không tạo mới
    }

    // =============================================
    // answer
    // =============================================

    /** @test */
    public function student_can_save_answer_during_practice()
    {
        $submission = Submission::create([
            'user_id'       => $this->student->uId,
            'exam_id'       => $this->exam->eId,
            'assignment_id' => null,
            'sAttempt'      => 1,
            'sStart_time'   => now(),
            'sStatus'       => 'in_progress',
        ]);

        $question = $this->exam->questions->first();

        $res = $this->withHeaders($this->auth())
            ->postJson("/api/student/practice/{$submission->sId}/answer", [
                'question_id'   => $question->qId,
                'saAnswer_text' => 'Option 1',
            ]);

        $res->assertStatus(200);
        $this->assertDatabaseHas('submission_answers', [
            'submission_id' => $submission->sId,
            'question_id'   => $question->qId,
            'saAnswer_text' => 'Option 1',
        ]);
    }

    /** @test */
    public function answer_rejects_question_from_different_exam()
    {
        $otherExam = Exam::create([
            'eTitle' => 'Other', 'eType' => 'VSTEP', 'eSkill' => 'listening',
            'eTeacher_id' => $this->teacher->uId, 'eDuration_minutes' => 40,
            'eIs_private' => true, 'eSource_type' => 'manual',
        ]);
        $otherQ = Question::create(['exam_id' => $otherExam->eId, 'qContent' => 'Q', 'qType' => 'multiple_choice', 'qPart' => 1]);

        $submission = Submission::create([
            'user_id' => $this->student->uId, 'exam_id' => $this->exam->eId,
            'assignment_id' => null, 'sAttempt' => 1,
            'sStart_time' => now(), 'sStatus' => 'in_progress',
        ]);

        $res = $this->withHeaders($this->auth())
            ->postJson("/api/student/practice/{$submission->sId}/answer", [
                'question_id'   => $otherQ->qId,
                'saAnswer_text' => 'X',
            ]);

        $res->assertStatus(403);
    }

    // =============================================
    // complete + auto-grade MCQ
    // =============================================

    /** @test */
    public function complete_auto_grades_mcq_and_returns_score()
    {
        $submission = Submission::create([
            'user_id' => $this->student->uId, 'exam_id' => $this->exam->eId,
            'assignment_id' => null, 'sAttempt' => 1,
            'sStart_time' => now(), 'sStatus' => 'in_progress',
        ]);

        $questions = $this->exam->questions;

        // Trả lời đúng câu 1, sai câu 2
        SubmissionAnswer::create([
            'submission_id' => $submission->sId,
            'question_id'   => $questions[0]->qId,
            'saAnswer_text' => 'Option 1', // đúng
        ]);
        SubmissionAnswer::create([
            'submission_id' => $submission->sId,
            'question_id'   => $questions[1]->qId,
            'saAnswer_text' => 'Option 2', // sai
        ]);

        $res = $this->withHeaders($this->auth())
            ->postJson("/api/student/practice/{$submission->sId}/complete");

        $res->assertStatus(200);
        $this->assertEquals(50, $res->json('data.sScore')); // 1/2 = 50%
        $res->assertJsonPath('data.sStatus', 'graded');
    }

    // =============================================
    // history
    // =============================================

    /** @test */
    public function student_can_view_practice_history()
    {
        Submission::create([
            'user_id' => $this->student->uId, 'exam_id' => $this->exam->eId,
            'assignment_id' => null, 'sAttempt' => 1,
            'sStart_time' => now(), 'sSubmit_time' => now(),
            'sStatus' => 'graded', 'sScore' => 75.0,
        ]);

        $res = $this->withHeaders($this->auth())->getJson('/api/student/practice/history');

        $res->assertStatus(200);
        $this->assertEquals(1, $res->json('data.total'));
    }

    // =============================================
    // result
    // =============================================

    /** @test */
    public function student_can_view_result_with_correct_answers_for_mcq()
    {
        $submission = Submission::create([
            'user_id' => $this->student->uId, 'exam_id' => $this->exam->eId,
            'assignment_id' => null, 'sAttempt' => 1,
            'sStart_time' => now(), 'sSubmit_time' => now(),
            'sStatus' => 'graded', 'sScore' => 100.0,
        ]);

        $question = $this->exam->questions->first();
        SubmissionAnswer::create([
            'submission_id'   => $submission->sId,
            'question_id'     => $question->qId,
            'saAnswer_text'   => 'Option 1',
            'saIs_correct'    => true,
            'saPoints_awarded' => 1,
        ]);

        $res = $this->withHeaders($this->auth())
            ->getJson("/api/student/practice/{$submission->sId}/result");

        $res->assertStatus(200);
        $this->assertEquals(100, $res->json('data.sScore'));

        $firstQ = $res->json('data.questions.0');
        $this->assertArrayHasKey('correct_answer', $firstQ);
        $this->assertEquals('Option 1', $firstQ['correct_answer']);
    }

    /** @test */
    public function result_returns_400_for_in_progress_submission()
    {
        $submission = Submission::create([
            'user_id' => $this->student->uId, 'exam_id' => $this->exam->eId,
            'assignment_id' => null, 'sAttempt' => 1,
            'sStart_time' => now(), 'sStatus' => 'in_progress',
        ]);

        $res = $this->withHeaders($this->auth())
            ->getJson("/api/student/practice/{$submission->sId}/result");

        $res->assertStatus(400);
    }
}
