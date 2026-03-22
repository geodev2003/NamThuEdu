<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class UserManagementApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $teacher;
    protected $student;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');

        $this->teacher = User::factory()->create(['uRole' => 'teacher']);

        $this->student = User::factory()->create(['uRole' => 'student']);
    }

    /** @test */
    public function teacher_can_view_their_students()
    {
        User::factory()->count(10)->create([
            'uRole' => 'student'
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/teacher/students');

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_can_view_student_detail()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/teacher/student/{$this->student->uId}");

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_can_create_student()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/teacher/student', [
            'studentPhone' => '0999888777',
            'studentPassword' => 'password123',
            'studentName' => 'New Student',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'uPhone' => '0999888777',
            'uRole' => 'student'
        ]);
    }

    /** @test */
    public function teacher_can_update_student()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/teacher/student/{$this->student->uId}", [
            'studentName' => 'Updated Student Name',
            'studentAddress' => 'New Address',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'uId' => $this->student->uId,
            'uName' => 'Updated Student Name',
        ]);
    }

    /** @test */
    public function teacher_can_delete_student()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/teacher/student/{$this->student->uId}");

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'uId' => $this->student->uId,
        ]);
        
        // Check that uDeleted_at is not null (soft deleted)
        $deletedUser = \App\Models\User::withTrashed()->find($this->student->uId);
        $this->assertNotNull($deletedUser->uDeleted_at);
    }

    /** @test */
    public function teacher_can_view_student_statistics()
    {
        User::factory()->count(15)->create([
            'uRole' => 'student'
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/teacher/students/statistics');

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_can_export_students()
    {
        User::factory()->count(5)->create([
            'uRole' => 'student'
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/teacher/students/export');

        $response->assertStatus(200);
    }
}
