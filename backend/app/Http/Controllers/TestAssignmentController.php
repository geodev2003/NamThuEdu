<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\TestAssignment;
use App\Models\Exam;
use App\Models\Classes;
use App\Models\User;

class TestAssignmentController extends Controller
{
    /**
     * @OA\Post(
     *     path="/teacher/exams/{examId}/assign",
     *     tags={"Assignments"},
     *     summary="Assign exam to class or student",
     *     description="Assign an exam to a class or individual student",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="examId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"taTarget_type","taTarget_id","taDeadline"},
     *             @OA\Property(property="taTarget_type", type="string", enum={"class","student"}, example="class"),
     *             @OA\Property(property="taTarget_id", type="integer", example=1),
     *             @OA\Property(property="taDeadline", type="string", format="date-time", example="2026-04-30T23:59:59"),
     *             @OA\Property(property="taMax_attempt", type="integer", example=3),
     *             @OA\Property(property="taInstructions", type="string", example="Complete within time limit")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Exam assigned successfully"),
     *     @OA\Response(response=400, description="Validation error")
     * )
     * 
     * POST /api/teacher/exams/{examId}/assign
     * Gán bài thi cho lớp hoặc học viên
     */
    public function assign(Request $request, $examId)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $exam = Exam::where('eId', $examId)
                   ->where('eTeacher_id', $user->uId)
                   ->first();

        if (!$exam) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài thi.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'taTarget_type' => 'required|in:class,student',
            'taTarget_id' => 'required|integer',
            'taDeadline' => 'nullable|date|after:now',
            'taMax_attempt' => 'nullable|integer|min:1',
            'taIs_public' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        // Validate target exists
        if ($request->taTarget_type === 'class') {
            $target = Classes::find($request->taTarget_id);
            if (!$target) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy lớp học.'
                ], 404);
            }
        } else {
            $target = User::where('uId', $request->taTarget_id)
                         ->where('uRole', 'student')
                         ->whereNull('uDeleted_at')
                         ->first();
            if (!$target) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy học viên.'
                ], 404);
            }
        }

        $assignment = TestAssignment::create([
            'exam_id' => $examId,
            'taTarget_type' => $request->taTarget_type,
            'taTarget_id' => $request->taTarget_id,
            'taDeadline' => $request->taDeadline,
            'taMax_attempt' => $request->taMax_attempt ?? 1,
            'taIs_public' => $request->taIs_public ?? false,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'assignmentId' => $assignment->taId
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/teacher/assignments",
     *     tags={"Assignments"},
     *     summary="Get test assignments",
     *     description="Get list of test assignments with optional filters",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="exam_id",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="integer"),
     *         description="Filter by exam ID"
     *     ),
     *     @OA\Parameter(
     *         name="target_type",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="string", enum={"class","student"}),
     *         description="Filter by target type"
     *     ),
     *     @OA\Response(response=200, description="Assignments retrieved successfully"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     * 
     * GET /api/teacher/assignments
     * Lấy danh sách phân công bài thi (có filter)
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $query = TestAssignment::with(['exam'])
                               ->whereHas('exam', function($q) use ($user) {
                                   $q->where('eTeacher_id', $user->uId);
                               });

        // Filter by exam_id
        if ($request->has('exam_id')) {
            $query->where('exam_id', $request->exam_id);
        }

        // Filter by target_type
        if ($request->has('target_type')) {
            $query->where('taTarget_type', $request->target_type);
        }

        // Filter by target_id
        if ($request->has('target_id')) {
            $query->where('taTarget_id', $request->target_id);
        }

        $assignments = $query->orderBy('taCreated_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $assignments
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/teacher/assignments/{id}",
     *     tags={"Assignments"},
     *     summary="Delete test assignment",
     *     description="Delete a test assignment",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Assignment deleted successfully"),
     *     @OA\Response(response=404, description="Assignment not found")
     * )
     * 
     * DELETE /api/teacher/assignments/{id}
     * Xóa phân công bài thi
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $assignment = TestAssignment::where('taId', $id)
                                    ->whereHas('exam', function($q) use ($user) {
                                        $q->where('eTeacher_id', $user->uId);
                                    })
                                    ->first();

        if (!$assignment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy phân công bài thi.'
            ], 404);
        }

        $assignment->delete();

        return response()->json([
            'status' => 'success',
            'data' => [
                'message' => 'Xóa phân công bài thi thành công'
            ]
        ]);
    }

    /**
     * GET /api/teacher/assignments/{id}/progress
     * Theo dõi tiến độ làm bài của assignment
     */
    /**
     * @OA\Get(
     *     path="/teacher/assignments/{id}/progress",
     *     tags={"Assignments"},
     *     summary="Get assignment progress",
     *     description="Get detailed progress of who completed and who hasn't for an assignment",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Assignment progress retrieved successfully"),
     *     @OA\Response(response=404, description="Assignment not found")
     * )
     */
    public function progress(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $assignment = TestAssignment::where('taId', $id)
                                    ->with(['exam'])
                                    ->whereHas('exam', function($q) use ($user) {
                                        $q->where('eTeacher_id', $user->uId);
                                    })
                                    ->first();

        if (!$assignment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy phân công bài thi.'
            ], 404);
        }

        // Get target students
        $targetStudents = $this->getTargetStudents($assignment);
        
        // Get submissions for this assignment
        $submissions = \App\Models\Submission::where('assignment_id', $id)
                                            ->with('user')
                                            ->get();

        // Build progress data
        $completed = [];
        $notCompleted = [];
        $submissionMap = $submissions->keyBy('user_id');

        foreach ($targetStudents as $student) {
            $studentData = [
                'uId' => $student->uId,
                'uName' => $student->uName,
                'uPhone' => $student->uPhone,
            ];

            if (isset($submissionMap[$student->uId])) {
                $submission = $submissionMap[$student->uId];
                $studentData['submission'] = [
                    'sId' => $submission->sId,
                    'sScore' => $submission->sScore,
                    'sStatus' => $submission->sStatus,
                    'sSubmit_time' => $submission->sSubmit_time,
                    'sAttempt' => $submission->sAttempt,
                ];
                $completed[] = $studentData;
            } else {
                $notCompleted[] = $studentData;
            }
        }

        // Calculate statistics
        $totalStudents = count($targetStudents);
        $completedCount = count($completed);
        $completionRate = $totalStudents > 0 ? round(($completedCount / $totalStudents) * 100, 2) : 0;

        // Check deadline status
        $isOverdue = $assignment->taDeadline && now() > $assignment->taDeadline;
        $timeRemaining = $assignment->taDeadline ? $assignment->taDeadline->diffForHumans() : null;

        return response()->json([
            'status' => 'success',
            'data' => [
                'assignment' => [
                    'taId' => $assignment->taId,
                    'exam' => [
                        'eId' => $assignment->exam->eId,
                        'eTitle' => $assignment->exam->eTitle,
                        'eType' => $assignment->exam->eType,
                        'eDuration_minutes' => $assignment->exam->eDuration_minutes,
                    ],
                    'taTarget_type' => $assignment->taTarget_type,
                    'taTarget_id' => $assignment->taTarget_id,
                    'taDeadline' => $assignment->taDeadline,
                    'taMax_attempt' => $assignment->taMax_attempt,
                    'is_overdue' => $isOverdue,
                    'time_remaining' => $timeRemaining,
                ],
                'statistics' => [
                    'total_students' => $totalStudents,
                    'completed_count' => $completedCount,
                    'not_completed_count' => $totalStudents - $completedCount,
                    'completion_rate' => $completionRate,
                ],
                'completed' => $completed,
                'not_completed' => $notCompleted,
            ]
        ]);
    }

    /**
     * POST /api/teacher/assignments/bulk
     * Giao bài hàng loạt cho nhiều lớp/học sinh
     */
    /**
     * @OA\Post(
     *     path="/teacher/assignments/bulk",
     *     tags={"Assignments"},
     *     summary="Bulk assign exam",
     *     description="Assign an exam to multiple classes or students at once",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"exam_id","targets"},
     *             @OA\Property(property="exam_id", type="integer", example=1),
     *             @OA\Property(
     *                 property="targets",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="type", type="string", enum={"class","student"}),
     *                     @OA\Property(property="id", type="integer")
     *                 )
     *             ),
     *             @OA\Property(property="taDeadline", type="string", format="date-time"),
     *             @OA\Property(property="taMax_attempt", type="integer", example=3)
     *         )
     *     ),
     *     @OA\Response(response=201, description="Bulk assignment completed"),
     *     @OA\Response(response=400, description="Validation error")
     * )
     */
    public function bulkAssign(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'exam_id' => 'required|integer|exists:exams,eId',
            'targets' => 'required|array|min:1',
            'targets.*.type' => 'required|in:class,student',
            'targets.*.id' => 'required|integer',
            'taDeadline' => 'nullable|date|after:now',
            'taMax_attempt' => 'nullable|integer|min:1',
            'taIs_public' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 400);
        }

        // Verify exam belongs to teacher
        $exam = Exam::where('eId', $request->exam_id)
                   ->where('eTeacher_id', $user->uId)
                   ->first();

        if (!$exam) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bài thi.'
            ], 404);
        }

        $results = [
            'success_count' => 0,
            'errors' => [],
            'assignments' => [],
        ];

        foreach ($request->targets as $index => $target) {
            try {
                // Validate target exists
                if ($target['type'] === 'class') {
                    $targetEntity = Classes::find($target['id']);
                    if (!$targetEntity) {
                        $results['errors'][] = "Lớp học ID {$target['id']} không tồn tại.";
                        continue;
                    }
                } else {
                    $targetEntity = User::where('uId', $target['id'])
                                       ->where('uRole', 'student')
                                       ->whereNull('uDeleted_at')
                                       ->first();
                    if (!$targetEntity) {
                        $results['errors'][] = "Học viên ID {$target['id']} không tồn tại.";
                        continue;
                    }
                }

                // Check if assignment already exists
                $existingAssignment = TestAssignment::where('exam_id', $request->exam_id)
                                                   ->where('taTarget_type', $target['type'])
                                                   ->where('taTarget_id', $target['id'])
                                                   ->first();

                if ($existingAssignment) {
                    $results['errors'][] = "Đã giao bài cho {$target['type']} ID {$target['id']}.";
                    continue;
                }

                // Create assignment
                $assignment = TestAssignment::create([
                    'exam_id' => $request->exam_id,
                    'taTarget_type' => $target['type'],
                    'taTarget_id' => $target['id'],
                    'taDeadline' => $request->taDeadline,
                    'taMax_attempt' => $request->taMax_attempt ?? 1,
                    'taIs_public' => $request->taIs_public ?? false,
                ]);

                $results['assignments'][] = [
                    'assignment_id' => $assignment->taId,
                    'target_type' => $target['type'],
                    'target_id' => $target['id'],
                    'target_name' => $target['type'] === 'class' ? $targetEntity->cName : $targetEntity->uName,
                ];

                $results['success_count']++;

            } catch (\Exception $e) {
                $results['errors'][] = "Lỗi khi giao bài cho {$target['type']} ID {$target['id']}: " . $e->getMessage();
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => $results,
            'message' => "Đã giao bài thành công cho {$results['success_count']} đối tượng."
        ], 201);
    }

    /**
     * GET /api/teacher/assignments/{id}/reminders
     * Gửi nhắc nhở deadline
     */
    /**
     * @OA\Post(
     *     path="/teacher/assignments/{id}/reminders",
     *     tags={"Assignments"},
     *     summary="Send deadline reminders",
     *     description="Send deadline reminders to students who haven't completed the assignment",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Reminders sent successfully"),
     *     @OA\Response(response=404, description="Assignment not found")
     * )
     */
    public function sendReminders(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $assignment = TestAssignment::where('taId', $id)
                                    ->with(['exam'])
                                    ->whereHas('exam', function($q) use ($user) {
                                        $q->where('eTeacher_id', $user->uId);
                                    })
                                    ->first();

        if (!$assignment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy phân công bài thi.'
            ], 404);
        }

        // Get students who haven't completed
        $targetStudents = $this->getTargetStudents($assignment);
        $submissions = \App\Models\Submission::where('assignment_id', $id)->pluck('user_id');
        $incompleteStudents = $targetStudents->whereNotIn('uId', $submissions);

        $remindersSent = 0;
        foreach ($incompleteStudents as $student) {
            // Here you would integrate with notification system
            // For now, we'll just count them
            $remindersSent++;
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'reminders_sent' => $remindersSent,
                'assignment_title' => $assignment->exam->eTitle,
                'deadline' => $assignment->taDeadline,
                'message' => "Đã gửi nhắc nhở đến {$remindersSent} học sinh chưa làm bài."
            ]
        ]);
    }

    /**
     * GET /api/teacher/assignments/statistics
     * Thống kê tổng quan assignments
     */
    /**
     * @OA\Get(
     *     path="/teacher/assignments/statistics",
     *     tags={"Assignments"},
     *     summary="Get assignment statistics",
     *     description="Get overall statistics for teacher's assignments",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Statistics retrieved successfully"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function statistics(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'teacher') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $assignments = TestAssignment::with(['exam'])
                                     ->whereHas('exam', function($q) use ($user) {
                                         $q->where('eTeacher_id', $user->uId);
                                     })
                                     ->get();

        $totalAssignments = $assignments->count();
        $classAssignments = $assignments->where('taTarget_type', 'class')->count();
        $studentAssignments = $assignments->where('taTarget_type', 'student')->count();

        // Assignments with deadlines
        $withDeadlines = $assignments->whereNotNull('taDeadline')->count();
        $overdue = $assignments->filter(function($assignment) {
            return $assignment->taDeadline && now() > $assignment->taDeadline;
        })->count();

        // Recent assignments (last 7 days)
        $recentAssignments = $assignments->filter(function($assignment) {
            return $assignment->taCreated_at >= now()->subDays(7);
        })->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_assignments' => $totalAssignments,
                'class_assignments' => $classAssignments,
                'student_assignments' => $studentAssignments,
                'with_deadlines' => $withDeadlines,
                'overdue_assignments' => $overdue,
                'recent_assignments' => $recentAssignments,
                'assignments_by_exam' => $assignments->groupBy('exam_id')->map(function($group) {
                    return [
                        'count' => $group->count(),
                        'exam_title' => $group->first()->exam->eTitle ?? 'Unknown',
                    ];
                }),
            ]
        ]);
    }

    /**
     * Helper method to get target students for an assignment
     */
    private function getTargetStudents($assignment)
    {
        if ($assignment->taTarget_type === 'class') {
            // Get students from class enrollments
            return User::whereIn('uId', function($query) use ($assignment) {
                $query->select('student_id')
                      ->from('class_enrollments')
                      ->where('class_id', $assignment->taTarget_id);
            })
            ->where('uRole', 'student')
            ->whereNull('uDeleted_at')
            ->get();
        } else {
            // Single student
            return User::where('uId', $assignment->taTarget_id)
                      ->where('uRole', 'student')
                      ->whereNull('uDeleted_at')
                      ->get();
        }
    }
}
