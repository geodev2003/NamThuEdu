<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $teacher;
    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');

        $this->teacher = User::factory()->create(['uRole' => 'teacher']);
        $this->admin = User::factory()->create(['uRole' => 'admin']);

        Storage::fake('local');
    }

    /** @test */
    public function teacher_can_upload_test_file()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $file = UploadedFile::fake()->create('test.xlsx', 100, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/teacher/tests/upload', [
            'file' => $file,
            'exam_type' => 'IELTS',
            'skill' => 'reading',
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_can_upload_csv_file()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $file = UploadedFile::fake()->create('test.csv', 50, 'text/csv');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/teacher/tests/upload', [
            'file' => $file,
            'exam_type' => 'TOEFL',
            'skill' => 'listening',
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function upload_requires_valid_file_type()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $file = UploadedFile::fake()->create('test.txt', 50, 'text/plain');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/teacher/tests/upload', [
            'file' => $file,
            'exam_type' => 'IELTS',
            'skill' => 'reading',
        ]);

        $response->assertStatus(422);
    }

    /** @test */
    public function upload_requires_teacher_role()
    {
        $student = User::factory()->create(['uRole' => 'student']);
        $token = $student->createToken('test-token')->plainTextToken;

        $file = UploadedFile::fake()->create('test.xlsx', 100, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/teacher/tests/upload', [
            'file' => $file,
            'exam_type' => 'IELTS',
            'skill' => 'reading',
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function upload_requires_authentication()
    {
        $file = UploadedFile::fake()->create('test.xlsx', 100, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        $response = $this->postJson('/api/teacher/tests/upload', [
            'file' => $file,
            'exam_type' => 'IELTS',
            'skill' => 'reading',
        ]);

        $response->assertStatus(401);
    }

    /** @test */
    public function upload_validates_required_fields()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $file = UploadedFile::fake()->create('test.xlsx', 100, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/teacher/tests/upload', [
            'file' => $file,
            // Missing exam_type and skill
        ]);

        $response->assertStatus(422);
    }

    /** @test */
    public function upload_validates_file_size()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        // Create a file larger than allowed (assuming 10MB limit)
        $file = UploadedFile::fake()->create('large_test.xlsx', 15000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/teacher/tests/upload', [
            'file' => $file,
            'exam_type' => 'IELTS',
            'skill' => 'reading',
        ]);

        $response->assertStatus(422);
    }
}