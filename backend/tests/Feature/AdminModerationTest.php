<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Exam;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Verify admin moderation flows: approve/reject exam + post.
 * Đảm bảo reject yêu cầu reason (không cho gửi rỗng), audit log được ghi.
 */
class AdminModerationTest extends TestCase
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
    public function admin_can_reject_exam_with_reason(): void
    {
        $exam = Exam::create([
            'eTitle'       => 'Đề chờ duyệt',
            'eType'        => 'GENERAL',
            'eSkill'       => 'reading',
            'eDuration_minutes' => 60,
            'eIs_private'  => true,
            'eStatus'      => 'pending',
            'eTeacher_id'  => $this->teacher->uId,
        ]);

        $res = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/admin/exams/{$exam->eId}/reject", [
                'reason' => 'Đề có lỗi chính tả ở câu 3, vui lòng sửa lại.',
            ]);

        $res->assertStatus(200);
        $res->assertJsonPath('status', 'success');

        $exam->refresh();
        $this->assertEquals('archived', $exam->eStatus);
        $this->assertTrue((bool) $exam->eIs_private);
    }

    /** @test */
    public function reject_exam_without_reason_is_rejected(): void
    {
        $exam = Exam::create([
            'eTitle' => 'X', 'eType' => 'GENERAL', 'eSkill' => 'reading',
            'eDuration_minutes' => 30, 'eIs_private' => true, 'eStatus' => 'pending',
            'eTeacher_id' => $this->teacher->uId,
        ]);

        $res = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/admin/exams/{$exam->eId}/reject", []);

        $this->assertContains($res->status(), [400, 422]);
    }

    /** @test */
    public function admin_can_approve_exam(): void
    {
        $exam = Exam::create([
            'eTitle' => 'Đề ổn', 'eType' => 'GENERAL', 'eSkill' => 'reading',
            'eDuration_minutes' => 30, 'eIs_private' => true, 'eStatus' => 'pending',
            'eTeacher_id' => $this->teacher->uId,
        ]);

        $res = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/admin/exams/{$exam->eId}/approve", []);

        $res->assertStatus(200);
        $exam->refresh();
        // Approve thường set eStatus='published' hoặc eIs_private=false
        $this->assertTrue(
            ($exam->eStatus === 'published') || ((bool) $exam->eIs_private === false),
            'Sau approve, exam phải public hoặc published'
        );
    }

    /** @test */
    public function teacher_cannot_reject_exam(): void
    {
        $exam = Exam::create([
            'eTitle' => 'X', 'eType' => 'GENERAL', 'eSkill' => 'reading',
            'eDuration_minutes' => 30, 'eIs_private' => true, 'eStatus' => 'pending',
            'eTeacher_id' => $this->teacher->uId,
        ]);

        $res = $this->actingAs($this->teacher, 'sanctum')
            ->postJson("/api/admin/exams/{$exam->eId}/reject", ['reason' => 'spam']);

        $this->assertContains($res->status(), [401, 403]);
    }

    /** @test */
    public function rejecting_an_exam_creates_admin_audit_entry(): void
    {
        $exam = Exam::create([
            'eTitle' => 'Audit', 'eType' => 'GENERAL', 'eSkill' => 'reading',
            'eDuration_minutes' => 30, 'eIs_private' => true, 'eStatus' => 'pending',
            'eTeacher_id' => $this->teacher->uId,
        ]);

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/admin/exams/{$exam->eId}/reject", ['reason' => 'không hợp lệ']);

        $this->assertDatabaseHas('admin_activity_logs', [
            'admin_id'    => $this->admin->uId,
            'action'      => 'exam.reject',
            'entity_type' => 'exam',
            'entity_id'   => $exam->eId,
            'method'      => 'POST',
        ]);
    }
}
