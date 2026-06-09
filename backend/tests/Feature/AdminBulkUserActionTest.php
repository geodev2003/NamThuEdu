<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Verify POST /admin/users/bulk-action: lock/unlock/change_role nhiều user một lần.
 */
class AdminBulkUserActionTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    /** @var array<int,User> */
    protected array $students;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['uRole' => 'admin', 'uStatus' => 'active']);
        $this->students = [
            User::factory()->create(['uRole' => 'student', 'uStatus' => 'active']),
            User::factory()->create(['uRole' => 'student', 'uStatus' => 'active']),
            User::factory()->create(['uRole' => 'student', 'uStatus' => 'active']),
        ];
    }

    /** @test */
    public function admin_can_bulk_lock_multiple_users(): void
    {
        $ids = collect($this->students)->pluck('uId')->all();

        $res = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/admin/users/bulk-action', [
                'action'   => 'lock',
                'user_ids' => $ids,
            ]);

        $res->assertStatus(200);
        foreach ($ids as $id) {
            $this->assertDatabaseHas('users', ['uId' => $id, 'uStatus' => 'inactive']);
        }
    }

    /** @test */
    public function admin_can_bulk_unlock_multiple_users(): void
    {
        // Lock trước
        foreach ($this->students as $s) {
            $s->update(['uStatus' => 'inactive']);
        }
        $ids = collect($this->students)->pluck('uId')->all();

        $res = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/admin/users/bulk-action', [
                'action'   => 'unlock',
                'user_ids' => $ids,
            ]);

        $res->assertStatus(200);
        foreach ($ids as $id) {
            $this->assertDatabaseHas('users', ['uId' => $id, 'uStatus' => 'active']);
        }
    }

    /** @test */
    public function admin_can_bulk_change_role(): void
    {
        $ids = collect($this->students)->pluck('uId')->all();

        $res = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/admin/users/bulk-action', [
                'action'   => 'change_role',
                'user_ids' => $ids,
                'role'     => 'teacher',
            ]);

        $res->assertStatus(200);
        foreach ($ids as $id) {
            $this->assertDatabaseHas('users', ['uId' => $id, 'uRole' => 'teacher']);
        }
    }

    /** @test */
    public function admin_cannot_lock_themselves_via_bulk(): void
    {
        $res = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/admin/users/bulk-action', [
                'action'   => 'lock',
                'user_ids' => [$this->admin->uId],
            ]);

        $res->assertStatus(200);
        // Admin vẫn active
        $this->assertDatabaseHas('users', ['uId' => $this->admin->uId, 'uStatus' => 'active']);
    }

    /** @test */
    public function bulk_action_validates_payload(): void
    {
        $res = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/admin/users/bulk-action', [
                'action' => 'invalid_action',
                'user_ids' => [],
            ]);
        $this->assertContains($res->status(), [400, 422]);
    }

    /** @test */
    public function teacher_cannot_perform_bulk_action(): void
    {
        $teacher = User::factory()->create(['uRole' => 'teacher']);
        $res = $this->actingAs($teacher, 'sanctum')
            ->postJson('/api/admin/users/bulk-action', [
                'action'   => 'lock',
                'user_ids' => [$this->students[0]->uId],
            ]);
        $this->assertContains($res->status(), [401, 403]);
    }
}
