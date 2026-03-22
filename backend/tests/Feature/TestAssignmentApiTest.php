<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Exam;
use App\Models\ExamType;
use App\Models\Classes;
use App\Models\ClassEnrollment;
use App\Models\TestAssignment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class TestAssignmentApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $teacher;
    protected $student;
    protected $exam;
    protected $class;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');

        $this->teacher = User::factory()->create(['uRole' => 'teacher']);

        $this->student = User::factory()->create(['uRole' => 'student']);

        $examType = ExamType::create([
            'etName' => 'IELTS',
            'etDescription' => 'IELTS Exam Type',
        ]);

        $this->exam = Exam::factory()->create([
            'eTeacher_id' => $this->teacher->uId,
            
            'eStatus' => 'published',
        ]);

        $this->class = Classes::factory()->create([
            'eTeacher_id' => $this->teacher->uId,
        ]);

        ClassEnrollment::create([
            'class_id' => $this->class->clId,
            'student_id' => $this->student->uId,
            'status' => 'active',
        ]);
    }

    /** @test */
    public function teacher_can_assign_test_to_student()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/teacher/exams/{$this->exam->eId}/assign", [
            'student_ids' => [$this->student->uId],
            'due_date' => now()->addDays(7)->format('Y-m-d H:i:s'),
            'instructions' => 'Complete this test before the deadline',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('test_assignments', [
            'exam_id' => $this->exam->eId,
            'student_id' => $this->student->uId,
            'assigned_by' => $this->teacher->uId,
            'status' => 'assigned',
        ]);
    }

    /** @test */
    public function teacher_can_assign_test_to_class()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/teacher/exams/{$this->exam->eId}/assign", [
            'class_id' => $this->class->clId,
            'due_date' => now()->addDays(7)->format('Y-m-d H:i:s'),
            'instructions' => 'Complete this test before the deadline',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('test_assignments', [
            'exam_id' => $this->exam->eId,
            'class_id' => $this->class->clId,
            'assigned_by' => $this->teacher->uId,
        ]);
    }

    /** @test */
    public function teacher_can_view_assignments()
    {
        TestAssignment::factory()->count(5)->create([
            'exam_id' => $this->exam->eId,
            'assigned_by' => $this->teacher->uId,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/teacher/assignments');

        $response->assertStatus(200)
                 ->assertStatus(200);
    }

    /** @test */
    public function teacher_can_view_assignment_progress()
    {
        $assignment = TestAssignment::create([
            'exam_id' => $this->exam->eId,
            'student_id' => $this->student->uId,
            'assigned_by' => $this->teacher->uId,
            'due_date' => now()->addDays(7),
            'status' => 'assigned',
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/teacher/assignments/{$assignment->taId}/progress");

        $response->assertStatus(200)
                 ->assertStatus(200);
    }

    /** @test */
    public function teacher_can_delete_assignment()
    {
        $assignment = TestAssignment::create([
            'exam_id' => $this->exam->eId,
            'student_id' => $this->student->uId,
            'assigned_by' => $this->teacher->uId,
            'due_date' => now()->addDays(7),
            'status' => 'assigned',
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/teacher/assignments/{$assignment->taId}");

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_can_bulk_assign_tests()
    {
        $student2 = User::factory()->create(['uRole' => 'student']);
        $student3 = User::factory()->create(['uRole' => 'student']);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/teacher/assignments/bulk', [
            'exam_id' => $this->exam->eId,
            'student_ids' => [$this->student->uId, $student2->uId, $student3->uId],
            'due_date' => now()->addDays(7)->format('Y-m-d H:i:s'),
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseCount('test_assignments', 3);
    }

    /** @test */
    public function teacher_can_view_assignment_statistics()
    {
        TestAssignment::factory()->count(10)->create([
            'assigned_by' => $this->teacher->uId,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/teacher/assignments/statistics');

        $response->assertStatus(200)
                 ->assertStatus(200);
    }
}
