<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\ExamTemplate;
use App\Models\TemplateSection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class ExamTemplateApiTest extends TestCase
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
    }

    /** @test */
    public function teacher_can_view_exam_templates()
    {
        ExamTemplate::factory()->count(5)->create([
            'is_active' => true,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/teacher/exam-templates');

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_can_view_templates_by_category()
    {
        ExamTemplate::factory()->count(3)->create([
            'template_category' => 'IELTS',
            'is_active' => true,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/teacher/exam-templates/IELTS');

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_can_view_template_detail()
    {
        $template = ExamTemplate::factory()->create([
            'is_active' => true,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/teacher/exam-templates/{$template->template_id}");

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_can_view_template_sections()
    {
        $template = ExamTemplate::factory()->create([
            'is_active' => true,
        ]);

        TemplateSection::factory()->count(3)->create([
            'template_id' => $template->template_id,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/teacher/exam-templates/{$template->template_id}/sections");

        $response->assertStatus(200);
    }

    /** @test */
    public function teacher_can_create_exam_from_template()
    {
        $template = ExamTemplate::factory()->create([
            'is_active' => true,
        ]);

        $token = $this->teacher->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/teacher/exams/from-template/{$template->template_id}", [
            'eTitle' => 'My IELTS Test from Template',
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_create_exam_template()
    {
        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/admin/exam-templates', [
            'template_code' => 'TOEFL_READ_01',
            'template_name' => 'TOEFL Reading Template',
            'category' => 'international',
            'level' => 'b2',
            'age_group' => 'adult',
            'total_duration_minutes' => 60,
            'skills' => ['reading'],
            'sections' => [
                [
                    'name' => 'Reading',
                    'duration' => 60,
                    'questions' => 40,
                ]
            ],
            'description' => 'Standard TOEFL reading template',
            'is_active' => true,
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_activate_template()
    {
        $template = ExamTemplate::factory()->create([
            'is_active' => false,
        ]);

        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/admin/exam-templates/{$template->template_id}/activate");

        $response->assertStatus(200);

        $this->assertDatabaseHas('exam_templates', [
            'template_id' => $template->template_id,
            'is_active' => true,
        ]);
    }

    /** @test */
    public function admin_can_deactivate_template()
    {
        $template = ExamTemplate::factory()->create([
            'is_active' => true,
        ]);

        $token = $this->admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/admin/exam-templates/{$template->template_id}/deactivate");

        $response->assertStatus(200);

        $this->assertDatabaseHas('exam_templates', [
            'template_id' => $template->template_id,
            'is_active' => false,
        ]);
    }
}
