<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Submission;
use Laravel\Sanctum\Sanctum;

class StudentAdvancedApiTest extends TestCase
{
    use RefreshDatabase;

    protected $student;

    protected function setUp(): void
    {
        parent::setUp();
        $this->student = User::factory()->create(['uRole' => 'student']);
        Sanctum::actingAs($this->student);
    }

    /** @test */
    public function student_can_compare_submissions()
    {
        $submission = Submission::factory()->create(['sStudent_id' => $this->student->uId]);

        $response = $this->getJson("/api/student/submissions/{$submission->sId}/compare");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'data' => [
                'current_submission' => [
                    'submission_id',
                    'score',
                    'answers_count'
                ],
                'comparison_data' => [
                    'average_score',
                    'rank',
                    'percentile'
                ],
                'improvement_suggestions'
            ]
        ]);
    }
}