<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Course;
use App\Models\Exam;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AdminReportExportTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $teacher;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');

        $this->admin = User::factory()->create(['uRole' => 'admin']);
        $this->teacher = User::factory()->create(['uRole' => 'teacher']);

        Category::create(['caName' => 'IELTS']);
        Course::factory()->count(2)->create();
        Exam::factory()->count(3)->create();
    }

    private function adminHeaders()
    {
        $token = $this->admin->createToken('test-token')->plainTextToken;
        return ['Authorization' => 'Bearer ' . $token];
    }

    /** @test */
    public function admin_can_export_users_report_as_csv()
    {
        $response = $this->withHeaders($this->adminHeaders())
            ->get('/api/admin/reports/export?type=users&format=csv');

        $response->assertStatus(200);
        $response->assertHeader('content-type', 'text/csv; charset=UTF-8');

        $content = $response->streamedContent();
        $this->assertStringContainsString('key', $content);
        $this->assertStringContainsString('value', $content);
        // type marker row written first
        $this->assertStringContainsString('users', $content);
    }

    /** @test */
    public function csv_export_has_attachment_disposition()
    {
        $response = $this->withHeaders($this->adminHeaders())
            ->get('/api/admin/reports/export?type=dashboard&format=csv');

        $response->assertStatus(200);
        $disposition = $response->headers->get('content-disposition');
        $this->assertStringContainsString('attachment', $disposition);
        $this->assertStringContainsString('.csv', $disposition);
    }

    /** @test */
    public function json_export_still_works_as_default()
    {
        $response = $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/reports/export?type=users&format=json');

        $response->assertStatus(200);
        $response->assertJsonStructure(['status', 'data', 'export_info' => ['type', 'format', 'period']]);
    }

    /** @test */
    public function csv_export_flattens_nested_data_into_rows()
    {
        $response = $this->withHeaders($this->adminHeaders())
            ->get('/api/admin/reports/export?type=courses&format=csv');

        $response->assertStatus(200);
        $content = $response->streamedContent();
        // nested keys should be flattened with dot notation (e.g. overview.total_courses)
        $this->assertMatchesRegularExpression('/[a-z_]+\.[a-z_]+/', $content);
    }

    /** @test */
    public function export_requires_admin_role()
    {
        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->getJson('/api/admin/reports/export?type=users&format=csv');

        $response->assertStatus(403);
    }
}
