<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Course;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class CourseApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $teacher;
    protected $student;
    protected $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');

        $this->teacher = User::factory()->create(['uRole' => 'teacher']);

        $this->student = User::factory()->create(['uRole' => 'student']);

        $this->category = Category::create([
            'caName' => 'IELTS',
        ]);
    }

    /** @test */
    public function teacher_can_create_course()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/teacher/courses', [
            'courseName' => 'IELTS Foundation',
            'category' => $this->category->caId,
            'description' => 'Basic IELTS course',
            'startDate' => '2026-04-01',
            'endDate' => '2026-06-30',
            'numberOfStudent' => 20,
            'time' => '2 hours',
            'schedule' => 'Mon, Wed, Fri - 7:00 PM',
            'courseType' => 'IELTS',
        ]);

        $response->assertStatus(200)
                 ->assertStatus(200);

        $this->assertDatabaseHas('course', [
            'cName' => 'IELTS Foundation',
            'cTeacher' => $this->teacher->uId,
        ]);
    }

    /** @test */
    public function teacher_can_view_their_courses()
    {
        Course::factory()->count(3)->create([
            'cTeacher' => $this->teacher->uId,
            'cCategory' => $this->category->caId,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/teacher/courses');

        $response->assertStatus(200)
                 ->assertStatus(200);
    }

    /** @test */
    public function teacher_can_enroll_student_to_course()
    {
        $course = Course::factory()->create([
            'cTeacher' => $this->teacher->uId,
            'cCategory' => $this->category->caId,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/teacher/courses/{$course->cId}/enroll", [
            'student_id' => $this->student->uId,
            'fee_paid' => 5000000,
            'notes' => 'Regular enrollment',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('course_enrollments', [
            'course_id' => $course->cId,
            'student_id' => $this->student->uId,
            'status' => 'enrolled',
        ]);
    }

    /** @test */
    public function teacher_can_update_course()
    {
        $course = Course::factory()->create([
            'cTeacher' => $this->teacher->uId,
            'cCategory' => $this->category->caId,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/teacher/courses/{$course->cId}", [
            'courseName' => 'Updated Course Name',
            'description' => 'Updated description',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('course', [
            'cId' => $course->cId,
            'cName' => 'Updated Course Name',
        ]);
    }

    /** @test */
    public function teacher_can_delete_course()
    {
        $course = Course::factory()->create([
            'cTeacher' => $this->teacher->uId,
            'cCategory' => $this->category->caId,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/teacher/courses/{$course->cId}");

        $response->assertStatus(200);

        // Check soft delete by verifying cDeleteAt is not null
        $deletedCourse = Course::where('cId', $course->cId)->first();
        $this->assertNotNull($deletedCourse->cDeleteAt);
    }

    /** @test */
    public function student_cannot_create_course()
    {
        $token = $this->student->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/teacher/courses', [
            'cName' => 'Unauthorized Course',
        ]);

        $response->assertStatus(403);
    }
}
