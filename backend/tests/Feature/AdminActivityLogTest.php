<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\AdminActivityLog;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Audit log admin: middleware tự ghi log cho hành động gây thay đổi,
 * và endpoint đọc log + stats hoạt động đúng + có phân quyền.
 */
class AdminActivityLogTest extends TestCase
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
    public function record_helper_writes_a_log(): void
    {
        AdminActivityLog::record($this->admin->uId, 'user.lock', [
            'entity_type' => 'user',
            'entity_id'   => 42,
            'detail'      => 'locked spammer',
        ]);

        $this->assertDatabaseHas('admin_activity_logs', [
            'admin_id'    => $this->admin->uId,
            'action'      => 'user.lock',
            'entity_type' => 'user',
            'entity_id'   => 42,
        ]);
    }

    /** @test */
    public function admin_can_list_activity_logs(): void
    {
        AdminActivityLog::record($this->admin->uId, 'post.approve', ['entity_type' => 'post', 'entity_id' => 1]);
        AdminActivityLog::record($this->admin->uId, 'exam.reject', ['entity_type' => 'exam', 'entity_id' => 2]);

        $res = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/activity-logs');

        $res->assertStatus(200);
        $res->assertJsonPath('status', 'success');
        $this->assertGreaterThanOrEqual(2, count($res->json('data.data')));
    }

    /** @test */
    public function activity_logs_can_be_filtered_by_action(): void
    {
        AdminActivityLog::record($this->admin->uId, 'post.approve', ['entity_type' => 'post', 'entity_id' => 1]);
        AdminActivityLog::record($this->admin->uId, 'exam.reject', ['entity_type' => 'exam', 'entity_id' => 2]);

        $res = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/activity-logs?action=post.approve');

        $res->assertStatus(200);
        $rows = $res->json('data.data');
        $this->assertNotEmpty($rows);
        foreach ($rows as $row) {
            $this->assertEquals('post.approve', $row['action']);
        }
    }

    /** @test */
    public function stats_endpoint_returns_aggregates(): void
    {
        AdminActivityLog::record($this->admin->uId, 'user.lock', ['status_code' => 200]);
        AdminActivityLog::record($this->admin->uId, 'user.lock', ['status_code' => 200]);
        AdminActivityLog::record($this->admin->uId, 'exam.delete', ['status_code' => 500]);

        $res = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/activity-logs/stats');

        $res->assertStatus(200);
        $this->assertEquals(3, $res->json('data.total'));
        $this->assertEquals(1, $res->json('data.errors'));
        $this->assertNotEmpty($res->json('data.by_action'));
    }

    /** @test */
    public function teacher_cannot_access_admin_activity_logs(): void
    {
        $res = $this->actingAs($this->teacher, 'sanctum')
            ->getJson('/api/admin/activity-logs');
        $this->assertContains($res->status(), [401, 403]);
    }

    /** @test */
    public function middleware_auto_records_mutating_admin_action(): void
    {
        // Gọi 1 endpoint admin gây thay đổi: lock user (target là teacher)
        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/admin/users/{$this->teacher->uId}/lock");

        // Middleware phải ghi 1 log user.lock cho admin
        $this->assertDatabaseHas('admin_activity_logs', [
            'admin_id'    => $this->admin->uId,
            'action'      => 'user.lock',
            'entity_type' => 'user',
            'entity_id'   => $this->teacher->uId,
            'method'      => 'POST',
        ]);
    }

    /** @test */
    public function get_requests_are_not_logged(): void
    {
        $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/activity-logs');

        // GET không sinh log
        $this->assertDatabaseCount('admin_activity_logs', 0);
    }
}
