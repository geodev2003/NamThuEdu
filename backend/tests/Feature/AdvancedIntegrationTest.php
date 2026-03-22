<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Course;
use App\Models\Category;
use App\Models\Classes;
use App\Models\Exam;
use App\Models\Question;
use App\Models\TestAssignment;
use App\Models\Submission;
use App\Models\SubmissionAnswer;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

/**
 * Advanced Integration Tests covering complex workflows
 * and multi-user interactions across the entire system
 */
class AdvancedIntegrationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $teacher1;
    protected $teacher2;
    protected $student1;
    protected $student2;
    protected $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');

        // Create users
        $this->admin = User::factory()->create(['uRole' => 'admin']);
        $this->teacher1 = User::factory()->create(['uRole' => 'teacher']);
        $this->teacher2 = User::factory()->create(['uRole' => 'teacher']);
        $this->student1 = User::factory()->create(['uRole' => 'student']);
        $this->student2 = User::factory()->create(['uRole' => 'student']);

        // Create category
        $this->category = Category::create([
            'caName' => 'IELTS Preparation',
        ]);
    }

    /** @test */
    public function complete_multi_teacher_class_management_workflow()
    {
        // Teacher 1 creates a course
        $teacher1Token = $this->teacher1->createToken('test-token')->plainTextToken;
        
        $courseResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacher1Token,
        ])->postJson('/api/teacher/courses', [
            'courseName' => 'IELTS Advanced',
            'numberOfStudent' => 20,
            'time' => '2 hours',
            'category' => $this->category->caId,
            'schedule' => 'Mon-Wed-Fri 9:00-11:00',
            'startDate' => '2026-04-01',
            'endDate' => '2026-06-30',
            'courseType' => 'IELTS',
        ]);

        $courseResponse->assertStatus(200);
        $courseId = $courseResponse->json('data.courseId');

        // Teacher 1 creates two classes
        $class1Response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacher1Token,
        ])->postJson('/api/teacher/classes', [
            'cName' => 'IELTS Advanced - Morning',
            'cDescription' => 'Morning class',
            'cStatus' => 'active',
            'course' => $courseId,
        ]);

        $class2Response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacher1Token,
        ])->postJson('/api/teacher/classes', [
            'cName' => 'IELTS Advanced - Evening',
            'cDescription' => 'Evening class',
            'cStatus' => 'active',
            'course' => $courseId,
        ]);

        $class1Response->assertStatus(200);
        $class2Response->assertStatus(200);

        $class1Id = $class1Response->json('data.classId');
        $class2Id = $class2Response->json('data.classId');

        // Enroll students in different classes
        $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacher1Token,
        ])->postJson("/api/teacher/classes/{$class1Id}/enroll", [
            'student_ids' => [$this->student1->uId],
        ])->assertStatus(200);

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacher1Token,
        ])->postJson("/api/teacher/classes/{$class2Id}/enroll", [
            'student_ids' => [$this->student2->uId],
        ])->assertStatus(200);

        // Transfer student from class 1 to class 2
        $transferResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacher1Token,
        ])->postJson("/api/teacher/classes/{$class1Id}/transfer/{$class2Id}", [
            'student_ids' => [$this->student1->uId],
            'reason' => 'Schedule conflict',
        ]);

        $transferResponse->assertStatus(200);

        // Verify both students are now in class 2
        $this->assertDatabaseHas('class_enrollments', [
            'class_id' => $class2Id,
            'student_id' => $this->student1->uId,
        ]);

        $this->assertDatabaseHas('class_enrollments', [
            'class_id' => $class2Id,
            'student_id' => $this->student2->uId,
        ]);

        // Check transfer history
        $this->assertDatabaseHas('class_transfers', [
            'from_class_id' => $class1Id,
            'to_class_id' => $class2Id,
            'student_id' => $this->student1->uId,
        ]);
    }

    /** @test */
    public function complete_exam_creation_and_multi_student_testing_workflow()
    {
        $teacherToken = $this->teacher1->createToken('test-token')->plainTextToken;

        // Create exam
        $examResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->postJson('/api/teacher/exams', [
            'eTitle' => 'IELTS Reading Mock Test',
            'eDescription' => 'Comprehensive reading test',
            'eType' => 'IELTS',
            'eSkill' => 'reading',
            'eDuration_minutes' => 60,
        ]);

        $examResponse->assertStatus(200);
        $examId = $examResponse->json('data.eId');

        // Add questions to exam
        $questionsResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->postJson("/api/teacher/exams/{$examId}/questions", [
            'questions' => [
                [
                    'qContent' => 'What is the main topic?',
                    'qType' => 'multiple_choice',
                    'qOptions' => json_encode(['A' => 'Topic A', 'B' => 'Topic B', 'C' => 'Topic C']),
                    'qCorrect_answer' => 'A',
                    'qScore' => 2,
                ],
                [
                    'qContent' => 'Fill in the blank: The year was ____.',
                    'qType' => 'fill_blank',
                    'qCorrect_answer' => '2020',
                    'qScore' => 2,
                ],
            ]
        ]);

        $questionsResponse->assertStatus(200);

        // Publish exam
        $publishResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->postJson("/api/teacher/exams/{$examId}/publish");

        $publishResponse->assertStatus(200);

        // Assign to both students
        $assignResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->postJson("/api/teacher/exams/{$examId}/assign", [
            'student_ids' => [$this->student1->uId, $this->student2->uId],
            'due_date' => now()->addDays(7)->format('Y-m-d H:i:s'),
        ]);

        $assignResponse->assertStatus(200);

        // Student 1 takes the test
        $student1Token = $this->student1->createToken('test-token')->plainTextToken;

        $startResponse1 = $this->withHeaders([
            'Authorization' => 'Bearer ' . $student1Token,
        ])->postJson("/api/student/tests/{$examId}/start");

        $startResponse1->assertStatus(200);
        $submission1Id = $startResponse1->json('data.submission_id');

        // Student 1 answers questions
        $questions = Question::where('exam_id', $examId)->get();
        foreach ($questions as $question) {
            $this->withHeaders([
                'Authorization' => 'Bearer ' . $student1Token,
            ])->postJson("/api/student/tests/{$submission1Id}/answer", [
                'question_id' => $question->qId,
                'answer' => $question->qCorrect_answer,
            ])->assertStatus(200);
        }

        // Student 1 submits
        $this->withHeaders([
            'Authorization' => 'Bearer ' . $student1Token,
        ])->postJson("/api/student/tests/{$submission1Id}/submit")->assertStatus(200);

        // Student 2 takes the test (with different answers)
        $student2Token = $this->student2->createToken('test-token')->plainTextToken;

        $startResponse2 = $this->withHeaders([
            'Authorization' => 'Bearer ' . $student2Token,
        ])->postJson("/api/student/tests/{$examId}/start");

        $startResponse2->assertStatus(200);
        $submission2Id = $startResponse2->json('data.submission_id');

        // Student 2 answers incorrectly
        foreach ($questions as $question) {
            $this->withHeaders([
                'Authorization' => 'Bearer ' . $student2Token,
            ])->postJson("/api/student/tests/{$submission2Id}/answer", [
                'question_id' => $question->qId,
                'answer' => 'Wrong answer',
            ])->assertStatus(200);
        }

        // Student 2 submits
        $this->withHeaders([
            'Authorization' => 'Bearer ' . $student2Token,
        ])->postJson("/api/student/tests/{$submission2Id}/submit")->assertStatus(200);

        // Teacher grades both submissions
        $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->postJson("/api/teacher/submissions/{$submission1Id}/auto-grade")->assertStatus(200);

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->postJson("/api/teacher/submissions/{$submission2Id}/auto-grade")->assertStatus(200);

        // Verify different scores
        $submission1 = Submission::find($submission1Id);
        $submission2 = Submission::find($submission2Id);

        $this->assertEquals('graded', $submission1->status);
        $this->assertEquals('graded', $submission2->status);
        $this->assertGreaterThan($submission2->score, $submission1->score);
    }

    /** @test */
    public function complete_content_moderation_workflow()
    {
        $teacherToken = $this->teacher1->createToken('test-token')->plainTextToken;
        $adminToken = $this->admin->createToken('test-token')->plainTextToken;

        // Teacher creates blog posts
        $post1Response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->postJson('/api/teacher/blogs', [
            'pTitle' => 'IELTS Tips for Success',
            'pContent' => 'Here are some great tips...',
            'pType' => 'tips',
            'pCategory' => $this->category->caId,
        ]);

        $post2Response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->postJson('/api/teacher/blogs', [
            'pTitle' => 'Grammar Fundamentals',
            'pContent' => 'Understanding grammar basics...',
            'pType' => 'grammar',
            'pCategory' => $this->category->caId,
        ]);

        $post1Response->assertStatus(200);
        $post2Response->assertStatus(200);

        $post1Id = $post1Response->json('data.pId');
        $post2Id = $post2Response->json('data.pId');

        // Admin views pending posts
        $pendingResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $adminToken,
        ])->getJson('/api/admin/posts/pending');

        $pendingResponse->assertStatus(200);

        // Admin approves first post
        $approveResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $adminToken,
        ])->postJson("/api/admin/posts/{$post1Id}/approve");

        $approveResponse->assertStatus(200);

        // Admin rejects second post
        $rejectResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $adminToken,
        ])->postJson("/api/admin/posts/{$post2Id}/reject", [
            'reason' => 'Content needs improvement',
        ]);

        $rejectResponse->assertStatus(200);

        // Verify post statuses
        $this->assertDatabaseHas('posts', [
            'pId' => $post1Id,
            'pStatus' => 'published',
        ]);

        $this->assertDatabaseHas('posts', [
            'pId' => $post2Id,
            'pStatus' => 'rejected',
        ]);
    }

    /** @test */
    public function complete_user_management_and_role_changes_workflow()
    {
        $adminToken = $this->admin->createToken('test-token')->plainTextToken;

        // Admin creates new teacher
        $newTeacherResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $adminToken,
        ])->postJson('/api/admin/users', [
            'phone' => '0999111222',
            'password' => 'password123',
            'name' => 'New Teacher',
            'role' => 'teacher',
        ]);

        $newTeacherResponse->assertStatus(200);
        $newTeacherId = $newTeacherResponse->json('data.uId');

        // Admin changes student to teacher role
        $roleChangeResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $adminToken,
        ])->postJson("/api/admin/users/{$this->student1->uId}/change-role", [
            'role' => 'teacher',
        ]);

        $roleChangeResponse->assertStatus(200);

        // Admin locks a user
        $lockResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $adminToken,
        ])->postJson("/api/admin/users/{$this->student2->uId}/lock", [
            'reason' => 'Suspicious activity',
        ]);

        $lockResponse->assertStatus(200);

        // Admin views system statistics
        $statsResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $adminToken,
        ])->getJson('/api/admin/statistics/overview');

        $statsResponse->assertStatus(200);

        // Verify changes
        $this->assertDatabaseHas('users', [
            'uId' => $this->student1->uId,
            'uRole' => 'teacher',
        ]);

        $this->assertDatabaseHas('users', [
            'uId' => $this->student2->uId,
            'uStatus' => 'inactive',
        ]);

        // Admin unlocks the user
        $unlockResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $adminToken,
        ])->postJson("/api/admin/users/{$this->student2->uId}/unlock");

        $unlockResponse->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'uId' => $this->student2->uId,
            'uStatus' => 'active',
        ]);
    }

    /** @test */
    public function error_handling_and_permission_validation()
    {
        $studentToken = $this->student1->createToken('test-token')->plainTextToken;
        $teacherToken = $this->teacher1->createToken('test-token')->plainTextToken;

        // Student tries to access teacher endpoints
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $studentToken,
        ])->postJson('/api/teacher/courses', [
            'courseName' => 'Unauthorized Course',
        ]);

        $response->assertStatus(403);

        // Teacher tries to access admin endpoints
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->getJson('/api/admin/users');

        $response->assertStatus(403);

        // Unauthenticated access
        $response = $this->postJson('/api/teacher/courses', [
            'courseName' => 'Unauthorized Course',
        ]);

        $response->assertStatus(401);

        // Invalid data validation
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->postJson('/api/teacher/courses', [
            // Missing required fields
        ]);

        $response->assertStatus(422);
    }
}