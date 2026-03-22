<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Post;
use App\Models\Category;
use App\Models\ExamTemplate;
use App\Models\Exam;
use Laravel\Sanctum\Sanctum;

class AdminAdvancedApiTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['uRole' => 'admin']);
        Sanctum::actingAs($this->admin);
    }

    // System Statistics
    /** @test */
    public function admin_can_get_system_overview()
    {
        $response = $this->getJson('/api/admin/statistics/overview');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                'total_users',
                'total_courses',
                'total_exams',
                'active_sessions'
            ]
        ]);
    }

    /** @test */
    public function admin_can_get_user_activity()
    {
        $response = $this->getJson('/api/admin/statistics/activity');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                'daily_active_users',
                'weekly_active_users',
                'monthly_active_users'
            ]
        ]);
    }

    // Export & Reports
    /** @test */
    public function admin_can_export_users()
    {
        $response = $this->getJson('/api/admin/users/export');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                'export_url',
                'total_records'
            ]
        ]);
    }

    /** @test */
    public function admin_can_get_user_activity_report()
    {
        $response = $this->getJson('/api/admin/reports/user-activity');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                'report_data',
                'generated_at'
            ]
        ]);
    }

    // Blog Moderation
    /** @test */
    public function admin_can_get_all_posts()
    {
        Post::factory()->count(3)->create();

        $response = $this->getJson('/api/admin/posts');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                '*' => [
                    'pId',
                    'pTitle',
                    'pContent',
                    'pStatus'
                ]
            ]
        ]);
    }

    /** @test */
    public function admin_can_get_post_detail()
    {
        $post = Post::factory()->create();

        $response = $this->getJson("/api/admin/posts/{$post->pId}");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                'pId',
                'pTitle',
                'pContent',
                'pStatus',
                'pAuthor_id'
            ]
        ]);
    }

    /** @test */
    public function admin_can_approve_post()
    {
        $post = Post::factory()->create(['pStatus' => 'pending']);

        $response = $this->postJson("/api/admin/posts/{$post->pId}/approve");

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Post approved successfully'
        ]);
    }

    /** @test */
    public function admin_can_reject_post()
    {
        $post = Post::factory()->create(['pStatus' => 'pending']);

        $response = $this->postJson("/api/admin/posts/{$post->pId}/reject", [
            'reason' => 'Content not appropriate'
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Post rejected successfully'
        ]);
    }

    /** @test */
    public function admin_can_delete_post()
    {
        $post = Post::factory()->create();

        $response = $this->deleteJson("/api/admin/posts/{$post->pId}");

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Post deleted successfully'
        ]);
    }

    /** @test */
    public function admin_can_get_pending_posts()
    {
        Post::factory()->create(['pStatus' => 'pending']);
        Post::factory()->create(['pStatus' => 'approved']);

        $response = $this->getJson('/api/admin/posts/pending');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                '*' => [
                    'pId',
                    'pTitle',
                    'pStatus'
                ]
            ]
        ]);
    }

    // Category Management
    /** @test */
    public function admin_can_get_all_categories()
    {
        Category::factory()->count(3)->create();

        $response = $this->getJson('/api/admin/categories');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                '*' => [
                    'cId',
                    'cName',
                    'cDescription'
                ]
            ]
        ]);
    }

    /** @test */
    public function admin_can_create_category()
    {
        $response = $this->postJson('/api/admin/categories', [
            'cName' => 'New Category',
            'cDescription' => 'Category description'
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'status',
            'message',
            'data' => [
                'cId',
                'cName',
                'cDescription'
            ]
        ]);
    }

    /** @test */
    public function admin_can_update_category()
    {
        $category = Category::factory()->create();

        $response = $this->putJson("/api/admin/categories/{$category->cId}", [
            'cName' => 'Updated Category',
            'cDescription' => 'Updated description'
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Category updated successfully'
        ]);
    }

    /** @test */
    public function admin_can_delete_category()
    {
        $category = Category::factory()->create();

        $response = $this->deleteJson("/api/admin/categories/{$category->cId}");

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Category deleted successfully'
        ]);
    }

    // Exam Template Management
    /** @test */
    public function admin_can_get_all_exam_templates()
    {
        ExamTemplate::factory()->count(3)->create();

        $response = $this->getJson('/api/admin/exam-templates');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                '*' => [
                    'etId',
                    'etName',
                    'etCategory',
                    'etStatus'
                ]
            ]
        ]);
    }

    /** @test */
    public function admin_can_create_exam_template()
    {
        $response = $this->postJson('/api/admin/exam-templates', [
            'etName' => 'New Template',
            'etCategory' => 'IELTS',
            'etDescription' => 'Template description'
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'status',
            'message',
            'data' => [
                'etId',
                'etName',
                'etCategory'
            ]
        ]);
    }

    /** @test */
    public function admin_can_update_exam_template()
    {
        $template = ExamTemplate::factory()->create();

        $response = $this->putJson("/api/admin/exam-templates/{$template->etId}", [
            'etName' => 'Updated Template',
            'etDescription' => 'Updated description'
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Exam template updated successfully'
        ]);
    }

    /** @test */
    public function admin_can_delete_exam_template()
    {
        $template = ExamTemplate::factory()->create();

        $response = $this->deleteJson("/api/admin/exam-templates/{$template->etId}");

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Exam template deleted successfully'
        ]);
    }

    /** @test */
    public function admin_can_activate_exam_template()
    {
        $template = ExamTemplate::factory()->create(['etStatus' => 'inactive']);

        $response = $this->postJson("/api/admin/exam-templates/{$template->etId}/activate");

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Exam template activated successfully'
        ]);
    }

    /** @test */
    public function admin_can_deactivate_exam_template()
    {
        $template = ExamTemplate::factory()->create(['etStatus' => 'active']);

        $response = $this->postJson("/api/admin/exam-templates/{$template->etId}/deactivate");

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Exam template deactivated successfully'
        ]);
    }

    // Exam Moderation
    /** @test */
    public function admin_can_get_all_exams()
    {
        Exam::factory()->count(3)->create();

        $response = $this->getJson('/api/admin/exams');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                '*' => [
                    'eId',
                    'eTitle',
                    'eStatus',
                    'eTeacher_id'
                ]
            ]
        ]);
    }

    /** @test */
    public function admin_can_get_exam_detail()
    {
        $exam = Exam::factory()->create();

        $response = $this->getJson("/api/admin/exams/{$exam->eId}");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                'eId',
                'eTitle',
                'eDescription',
                'eStatus'
            ]
        ]);
    }

    /** @test */
    public function admin_can_approve_exam()
    {
        $exam = Exam::factory()->create(['eStatus' => 'pending']);

        $response = $this->postJson("/api/admin/exams/{$exam->eId}/approve");

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Exam approved successfully'
        ]);
    }

    /** @test */
    public function admin_can_reject_exam()
    {
        $exam = Exam::factory()->create(['eStatus' => 'pending']);

        $response = $this->postJson("/api/admin/exams/{$exam->eId}/reject", [
            'reason' => 'Content needs revision'
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Exam rejected successfully'
        ]);
    }

    /** @test */
    public function admin_can_delete_exam()
    {
        $exam = Exam::factory()->create();

        $response = $this->deleteJson("/api/admin/exams/{$exam->eId}");

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Exam deleted successfully'
        ]);
    }

    /** @test */
    public function admin_can_get_pending_exams()
    {
        Exam::factory()->create(['eStatus' => 'pending']);
        Exam::factory()->create(['eStatus' => 'approved']);

        $response = $this->getJson('/api/admin/exams/pending');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                '*' => [
                    'eId',
                    'eTitle',
                    'eStatus'
                ]
            ]
        ]);
    }

    // Statistics
    /** @test */
    public function admin_can_get_content_statistics()
    {
        $response = $this->getJson('/api/admin/content/statistics');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                'total_posts',
                'approved_posts',
                'pending_posts',
                'rejected_posts'
            ]
        ]);
    }

    /** @test */
    public function admin_can_get_template_statistics()
    {
        $response = $this->getJson('/api/admin/templates/statistics');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                'total_templates',
                'active_templates',
                'inactive_templates',
                'usage_count'
            ]
        ]);
    }

    /** @test */
    public function admin_can_get_exam_statistics()
    {
        $response = $this->getJson('/api/admin/exams/statistics');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                'total_exams',
                'approved_exams',
                'pending_exams',
                'rejected_exams'
            ]
        ]);
    }
}