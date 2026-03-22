<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Course;
use App\Models\Classes;
use App\Models\Exam;
use App\Models\TestAssignment;
use App\Models\Question;
use Laravel\Sanctum\Sanctum;

class TeacherAdvancedApiTest extends TestCase
{
    use RefreshDatabase;

    protected $teacher;

    protected function setUp(): void
    {
        parent::setUp();
        $this->teacher = User::factory()->create(['uRole' => 'teacher']);
        Sanctum::actingAs($this->teacher);
    }

    /** @test */
    public function teacher_can_enroll_student_to_course()
    {
        $course = Course::factory()->create(['cTeacher_id' => $this->teacher->uId]);
        $student = User::factory()->create(['uRole' => 'student']);

        $response = $this->postJson("/api/teacher/courses/{$course->cId}/enroll", [
            'student_id' => $student->uId
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'status',
            'message',
            'data' => [
                'enrollment_id',
                'course_id',
                'student_id'
            ]
        ]);
    }

    /** @test */
    public function teacher_can_remove_student_from_course()
    {
        $course = Course::factory()->create(['cTeacher_id' => $this->teacher->uId]);
        $student = User::factory()->create(['uRole' => 'student']);

        $response = $this->deleteJson("/api/teacher/courses/{$course->cId}/students/{$student->uId}");

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Student removed from course successfully'
        ]);
    }

    /** @test */
    public function teacher_can_get_course_statistics()
    {
        $course = Course::factory()->create(['cTeacher_id' => $this->teacher->uId]);

        $response = $this->getJson("/api/teacher/courses/{$course->cId}/statistics");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                'total_students',
                'active_students',
                'completion_rate',
                'average_score'
            ]
        ]);
    }

    /** @test */
    public function teacher_can_enroll_student_to_class()
    {
        $class = Classes::factory()->create(['clTeacher_id' => $this->teacher->uId]);
        $student = User::factory()->create(['uRole' => 'student']);

        $response = $this->postJson("/api/teacher/classes/{$class->clId}/enroll", [
            'student_id' => $student->uId
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'status',
            'message',
            'data' => [
                'enrollment_id',
                'class_id',
                'student_id'
            ]
        ]);
    }

    /** @test */
    public function teacher_can_transfer_students_between_classes()
    {
        $fromClass = Classes::factory()->create(['clTeacher_id' => $this->teacher->uId]);
        $toClass = Classes::factory()->create(['clTeacher_id' => $this->teacher->uId]);

        $response = $this->postJson("/api/teacher/classes/{$fromClass->clId}/transfer/{$toClass->clId}", [
            'student_ids' => [1, 2, 3]
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'message',
            'data' => [
                'transferred_count',
                'from_class_id',
                'to_class_id'
            ]
        ]);
    }

    /** @test */
    public function teacher_can_get_class_transfer_history()
    {
        $class = Classes::factory()->create(['clTeacher_id' => $this->teacher->uId]);

        $response = $this->getJson("/api/teacher/classes/{$class->clId}/transfer-history");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                '*' => [
                    'transfer_id',
                    'from_class_id',
                    'to_class_id',
                    'student_id',
                    'transferred_at'
                ]
            ]
        ]);
    }

    /** @test */
    public function teacher_can_remove_student_from_class()
    {
        $class = Classes::factory()->create(['clTeacher_id' => $this->teacher->uId]);
        $student = User::factory()->create(['uRole' => 'student']);

        $response = $this->deleteJson("/api/teacher/classes/{$class->clId}/students/{$student->uId}");

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Student removed from class successfully'
        ]);
    }

    /** @test */
    public function teacher_can_get_practice_templates()
    {
        $response = $this->getJson('/api/teacher/templates');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                '*' => [
                    'template_id',
                    'template_name',
                    'category',
                    'sections'
                ]
            ]
        ]);
    }

    /** @test */
    public function teacher_can_add_questions_to_exam()
    {
        $exam = Exam::factory()->create(['eTeacher_id' => $this->teacher->uId]);

        $response = $this->postJson("/api/teacher/exams/{$exam->eId}/questions", [
            'questions' => [
                [
                    'qContent' => 'What is PHP?',
                    'qType' => 'multiple_choice',
                    'qOptions' => json_encode(['A' => 'Language', 'B' => 'Framework']),
                    'qCorrect_answer' => 'A',
                    'qPoints' => 10
                ]
            ]
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'status',
            'message',
            'data' => [
                'added_questions_count'
            ]
        ]);
    }

    /** @test */
    public function teacher_can_update_exam_question()
    {
        $exam = Exam::factory()->create(['eTeacher_id' => $this->teacher->uId]);
        $question = Question::factory()->create(['qExam_id' => $exam->eId]);

        $response = $this->putJson("/api/teacher/exams/{$exam->eId}/questions/{$question->qId}", [
            'qContent' => 'Updated question content',
            'qPoints' => 15
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Question updated successfully'
        ]);
    }

    /** @test */
    public function teacher_can_delete_exam_question()
    {
        $exam = Exam::factory()->create(['eTeacher_id' => $this->teacher->uId]);
        $question = Question::factory()->create(['qExam_id' => $exam->eId]);

        $response = $this->deleteJson("/api/teacher/exams/{$exam->eId}/questions/{$question->qId}");

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Question deleted successfully'
        ]);
    }

    /** @test */
    public function teacher_can_get_exam_sections()
    {
        $exam = Exam::factory()->create(['eTeacher_id' => $this->teacher->uId]);

        $response = $this->getJson("/api/teacher/exams/{$exam->eId}/sections");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                '*' => [
                    'section_id',
                    'section_name',
                    'questions_count',
                    'total_points'
                ]
            ]
        ]);
    }

    /** @test */
    public function teacher_can_clone_exam()
    {
        $exam = Exam::factory()->create(['eTeacher_id' => $this->teacher->uId]);

        $response = $this->postJson("/api/teacher/exams/{$exam->eId}/clone", [
            'new_name' => 'Cloned Exam'
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'status',
            'message',
            'data' => [
                'cloned_exam_id',
                'original_exam_id'
            ]
        ]);
    }

    /** @test */
    public function teacher_can_preview_exam()
    {
        $exam = Exam::factory()->create(['eTeacher_id' => $this->teacher->uId]);

        $response = $this->getJson("/api/teacher/exams/{$exam->eId}/preview");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                'exam_info',
                'sections',
                'total_questions',
                'total_points'
            ]
        ]);
    }

    /** @test */
    public function teacher_can_publish_exam()
    {
        $exam = Exam::factory()->create(['eTeacher_id' => $this->teacher->uId]);

        $response = $this->postJson("/api/teacher/exams/{$exam->eId}/publish");

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Exam published successfully'
        ]);
    }

    /** @test */
    public function teacher_can_send_assignment_reminders()
    {
        $assignment = TestAssignment::factory()->create(['taTeacher_id' => $this->teacher->uId]);

        $response = $this->postJson("/api/teacher/assignments/{$assignment->taId}/reminders", [
            'message' => 'Please complete your test'
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Reminders sent successfully'
        ]);
    }

    /** @test */
    public function teacher_can_get_assignment_statistics()
    {
        $response = $this->getJson('/api/teacher/assignments/statistics');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                'total_assignments',
                'completed_assignments',
                'pending_assignments',
                'completion_rate'
            ]
        ]);
    }
}