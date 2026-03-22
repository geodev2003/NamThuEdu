<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Exam;
use App\Models\ExamType;
use App\Models\Question;
use App\Models\Course;
use App\Models\Category;
use App\Models\Classes;
use App\Models\ClassEnrollment;
use App\Models\TestAssignment;
use App\Models\Submission;
use App\Models\SubmissionAnswer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

/**
 * Test toàn bộ workflow từ đầu đến cuối:
 * 1. Teacher tạo khóa học và lớp học
 * 2. Teacher tạo đề thi
 * 3. Teacher giao bài cho học sinh
 * 4. Student làm bài thi
 * 5. Teacher chấm điểm
 */
class CompleteWorkflowTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $teacher;
    protected $student;
    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');

        // Tạo users
        $this->teacher = User::factory()->create([
            'role' => 'teacher',
                        'name' => 'Teacher Nguyen',
        ]);

        $this->student = User::factory()->create([
            'role' => 'student',
                        'name' => 'Student Tran',
        ]);

        $this->admin = User::factory()->create([
            'role' => 'admin',
                        'name' => 'Admin Le',
        ]);
    }

    /** @test */
    public function complete_exam_workflow_from_creation_to_grading()
    {
        // ============================================
        // STEP 1: Teacher tạo khóa học
        // ============================================
        $category = Category::create([
            'caName' => 'IELTS Preparation',
            'caDescription' => 'IELTS courses',
        ]);

        $teacherToken = $this->teacher->createToken('test-token')->plainTextToken;

        $courseResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->postJson('/api/teacher/courses', [
            'courseName' => 'IELTS 7.0 Intensive',
            'numberOfStudent' => 20,
            'time' => '2 hours',
            'category' => $category->caId,
            'schedule' => 'Mon-Wed-Fri 9:00-11:00',
            'startDate' => '2026-04-01',
            'endDate' => '2026-06-30',
            'courseType' => 'intensive',
            'description' => 'Intensive IELTS preparation course',
        ]);

        $courseResponse->assertStatus(200);
        $courseId = $courseResponse->json('data.cId');

        // ============================================
        // STEP 2: Teacher tạo lớp học
        // ============================================
        $classResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->postJson('/api/teacher/classes', [
            'cName' => 'IELTS 7.0 - Class A',
            'cDescription' => 'Morning class',
            'cCapacity' => 20,
            'cStatus' => 'active',
            'cStartDate' => '2026-04-01',
            'cEndDate' => '2026-06-30',
        ]);

        $classResponse->assertStatus(200);
        $classId = $classResponse->json('data.cId');

        // ============================================
        // STEP 3: Teacher thêm học sinh vào lớp
        // ============================================
        $enrollResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->postJson("/api/teacher/classes/{$classId}/enroll", [
            'student_id' => $this->student->uId,
        ]);

        $enrollResponse->assertStatus(200);

        $this->assertDatabaseHas('class_enrollments', [
            'class_id' => $classId,
            'student_id' => $this->student->uId,
        ]);

        // ============================================
        // STEP 4: Teacher tạo đề thi
        // ============================================
        $examType = ExamType::create([
            'etName' => 'IELTS',
            'etDescription' => 'IELTS Exam',
        ]);

        $examResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->postJson('/api/teacher/exams', [
            'eTitle' => 'IELTS Reading Practice Test 1',
            'eDescription' => 'Practice test for reading section',
            
            'eDuration_minutes' => 60,
            'eTotal_score' => 10,
            'ePass_score' => 6,
            'eDifficulty_level' => 'intermediate',
            'eStatus' => 'draft',
        ]);

        $examResponse->assertStatus(200);
        $examId = $examResponse->json('data.eId');

        // ============================================
        // STEP 5: Teacher thêm câu hỏi vào đề thi
        // ============================================
        $questionsResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->postJson("/api/teacher/exams/{$examId}/questions", [
            'questions' => [
                [
                    'qContent' => 'What is the main idea of the passage?',
                    'qType' => 'multiple_choice',
                    'qOptions' => json_encode([
                        'A' => 'Climate change',
                        'B' => 'Technology advancement',
                        'C' => 'Education reform',
                        'D' => 'Economic growth'
                    ]),
                    'qCorrect_answer' => 'A',
                    'qScore' => 2,
                    'qOrder' => 1,
                ],
                [
                    'qContent' => 'According to the text, what year was mentioned?',
                    'qType' => 'fill_blank',
                    'qCorrect_answer' => '2020',
                    'qScore' => 2,
                    'qOrder' => 2,
                ],
                [
                    'qContent' => 'The author agrees with the statement. True or False?',
                    'qType' => 'true_false',
                    'qOptions' => json_encode(['True', 'False']),
                    'qCorrect_answer' => 'True',
                    'qScore' => 2,
                    'qOrder' => 3,
                ],
            ]
        ]);

        $questionsResponse->assertStatus(200);

        // ============================================
        // STEP 6: Teacher publish đề thi
        // ============================================
        $publishResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->postJson("/api/teacher/exams/{$examId}/publish");

        $publishResponse->assertStatus(200);

        $this->assertDatabaseHas('exams', [
            'eId' => $examId,
            'eStatus' => 'published',
        ]);

        // ============================================
        // STEP 7: Teacher giao bài cho học sinh
        // ============================================
        $assignResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->postJson("/api/teacher/exams/{$examId}/assign", [
            'student_ids' => [$this->student->uId],
            'due_date' => now()->addDays(7)->format('Y-m-d H:i:s'),
            'instructions' => 'Complete this test carefully',
        ]);

        $assignResponse->assertStatus(200);

        $this->assertDatabaseHas('test_assignments', [
            'exam_id' => $examId,
            'student_id' => $this->student->uId,
            'status' => 'assigned',
        ]);

        // ============================================
        // STEP 8: Student xem bài thi được giao
        // ============================================
        $studentToken = $this->student->createToken('test-token')->plainTextToken;

        $testsResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $studentToken,
        ])->getJson('/api/student/tests');

        $testsResponse->assertStatus(200);

        // ============================================
        // STEP 9: Student bắt đầu làm bài
        // ============================================
        $startResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $studentToken,
        ])->postJson("/api/student/tests/{$examId}/start");

        $startResponse->assertStatus(200);
        $submissionId = $startResponse->json('data.submission_id');

        $this->assertDatabaseHas('submissions', [
            'sId' => $submissionId,
            'exam_id' => $examId,
            'student_id' => $this->student->uId,
            'status' => 'in_progress',
        ]);

        // ============================================
        // STEP 10: Student trả lời các câu hỏi
        // ============================================
        $questions = Question::where('exam_id', $examId)->get();

        foreach ($questions as $question) {
            $answerResponse = $this->withHeaders([
                'Authorization' => 'Bearer ' . $studentToken,
            ])->postJson("/api/student/tests/{$submissionId}/answer", [
                'question_id' => $question->qId,
                'answer' => $question->qCorrect_answer, // Trả lời đúng
            ]);

            $answerResponse->assertStatus(200);
        }

        // ============================================
        // STEP 11: Student nộp bài
        // ============================================
        $submitResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $studentToken,
        ])->postJson("/api/student/tests/{$submissionId}/submit");

        $submitResponse->assertStatus(200);

        $this->assertDatabaseHas('submissions', [
            'sId' => $submissionId,
            'status' => 'submitted',
        ]);

        // ============================================
        // STEP 12: Teacher xem bài làm
        // ============================================
        $submissionDetailResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->getJson("/api/teacher/submissions/{$submissionId}");

        $submissionDetailResponse->assertStatus(200)
            ->assertStatus(200);

        // ============================================
        // STEP 13: Teacher auto-grade bài làm
        // ============================================
        $gradeResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $teacherToken,
        ])->postJson("/api/teacher/submissions/{$submissionId}/auto-grade");

        $gradeResponse->assertStatus(200);

        // Kiểm tra điểm (tất cả câu đúng = 6 điểm)
        $submission = Submission::find($submissionId);
        $this->assertEquals('graded', $submission->status);
        $this->assertEquals(6, $submission->score); // 3 câu x 2 điểm

        // ============================================
        // STEP 14: Student xem kết quả
        // ============================================
        $resultResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $studentToken,
        ])->getJson("/api/student/submissions/{$submissionId}");

        $resultResponse->assertStatus(200)
            ->assertStatus(200);

        // ============================================
        // STEP 15: Admin xem thống kê hệ thống
        // ============================================
        $adminToken = $this->admin->createToken('test-token')->plainTextToken;

        $statsResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $adminToken,
        ])->getJson('/api/admin/statistics/overview');

        $statsResponse->assertStatus(200)
            ->assertStatus(200);

        // ============================================
        // VERIFICATION: Kiểm tra toàn bộ workflow
        // ============================================
        
        // Verify course created
        $this->assertDatabaseHas('course', [
            'cId' => $courseId,
            'cTeacher' => $this->teacher->uId,
        ]);

        // Verify class created
        $this->assertDatabaseHas('classes', [
            'cId' => $classId,
            'cTeacher_id' => $this->teacher->uId,
        ]);

        // Verify student enrolled
        $this->assertDatabaseHas('class_enrollments', [
            'class_id' => $classId,
            'student_id' => $this->student->uId,
        ]);

        // Verify exam created with questions
        $this->assertDatabaseHas('exams', [
            'eId' => $examId,
            'eStatus' => 'published',
        ]);
        $this->assertDatabaseCount('questions', 3);

        // Verify assignment created
        $this->assertDatabaseHas('test_assignments', [
            'exam_id' => $examId,
            'student_id' => $this->student->uId,
        ]);

        // Verify submission completed and graded
        $this->assertDatabaseHas('submissions', [
            'sId' => $submissionId,
            'status' => 'graded',
            'score' => 6,
        ]);

        // Verify all answers saved
        $this->assertDatabaseCount('submission_answers', 3);

        echo "\n\n";
        echo "========================================\n";
        echo "  COMPLETE WORKFLOW TEST PASSED! ✓\n";
        echo "========================================\n";
        echo "✓ Course created\n";
        echo "✓ Class created\n";
        echo "✓ Student enrolled\n";
        echo "✓ Exam created with 3 questions\n";
        echo "✓ Exam published\n";
        echo "✓ Test assigned to student\n";
        echo "✓ Student started test\n";
        echo "✓ Student answered all questions\n";
        echo "✓ Student submitted test\n";
        echo "✓ Teacher graded test\n";
        echo "✓ Final score: 6/10\n";
        echo "========================================\n\n";
    }
}
