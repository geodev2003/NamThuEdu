<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Verify endpoint /admin/system/health trả về các chỉ số đo thật.
 */
class AdminSystemHealthTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $teacher;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin   = User::factory()->create(['uRole' => 'admin', 'uStatus' => 'active']);
        $this->teacher = User::factory()->create(['uRole' => 'teacher', 'uStatus' => 'active']);
    }

    /** @test */
    public function admin_can_fetch_system_health(): void
    {
        $res = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/system/health');

        $res->assertStatus(200);
        $res->assertJsonPath('status', 'success');

        $data = $res->json('data');
        $this->assertContains($data['overall'], ['healthy', 'warning', 'critical']);
        $this->assertArrayHasKey('php_version', $data['app']);
        $this->assertArrayHasKey('used_percent', $data['disk']);
        $this->assertArrayHasKey('used_percent', $data['memory']);
        $this->assertTrue($data['database']['connected']);
        $this->assertIsNumeric($data['database']['latency_ms']);
        $this->assertArrayHasKey('users', $data['database']['counts']);
    }

    /** @test */
    public function teacher_cannot_access_system_health(): void
    {
        $res = $this->actingAs($this->teacher, 'sanctum')
            ->getJson('/api/admin/system/health');
        $this->assertContains($res->status(), [401, 403]);
    }

    /** @test */
    public function unauthenticated_request_is_rejected(): void
    {
        $res = $this->getJson('/api/admin/system/health');
        $this->assertContains($res->status(), [401, 403]);
    }
}
