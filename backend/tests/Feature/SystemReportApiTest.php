<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Course;
use App\Models\Exam;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class SystemReportApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $teacher;
    protected $student;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');

        $this->admin = User::factory()->create(['uRole' => 'admin']);
        $this->teacher = User::factory()->create(['uRole' => 'teacher']);
        $this->student = User::factory()->create(['uRole' => 'student']);

        // Create some test data
        Category::create(['caName' => 'IELTS']);
        Course::factory()->count(3)->create();
        Exam::factory()->count(5)->create();
    }

    /** @test */
    public function admin_can_view_system_dashboard()
    {
        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/admin/reports/dashboard');

        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_view_user_statistics()
    {
        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/admin/reports/users');

        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_view_course_statistics()
    {
        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/admin/reports/courses');

        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_view_activity_report()
    {
        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/admin/reports/activity');

        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_view_trends_analysis()
    {
        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/admin/reports/trends');

        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_export_report()
    {
        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/admin/reports/export?type=users&format=csv');

        $response->assertStatus(200);
    }

    /** @test */
    public function reports_require_admin_role()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/admin/reports/dashboard');

        $response->assertStatus(403);
    }

    /** @test */
    public function student_cannot_access_reports()
    {
        $token = $this->student->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/admin/reports/users');

        $response->assertStatus(403);
    }

    /** @test */
    public function reports_require_authentication()
    {
        $response = $this->getJson('/api/admin/reports/dashboard');

        $response->assertStatus(401);
    }
}