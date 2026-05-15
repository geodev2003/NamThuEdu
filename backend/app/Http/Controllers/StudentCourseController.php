<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use App\Models\CourseEnrollment;
use App\Models\TestAssignment;
use App\Models\User;
use Illuminate\Http\Request;

class StudentCourseController extends Controller
{
    public function getCourses(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $query = CourseEnrollment::where('student_id', $user->uId)
            ->with(['course.teacher:uId,uName', 'course.category:caId,caName']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $enrollments = $query->orderByDesc('enrolled_at')->get();
        $courses = $enrollments->map(function ($enrollment) {
            $course = $enrollment->course;
            if (!$course) {
                return null;
            }

            return [
                'enrollment_id' => $enrollment->id,
                'course_id' => $course->cId,
                'course_name' => $course->cName,
                'category' => $course->category ? $course->category->caName : null,
                'teacher' => $course->teacher ? [
                    'id' => $course->teacher->uId,
                    'name' => $course->teacher->uName,
                ] : null,
                'schedule' => $course->cSchedule,
                'time' => $course->cTime,
                'start_date' => $course->cStartDate ? $course->cStartDate->format('Y-m-d') : null,
                'end_date' => $course->cEndDate ? $course->cEndDate->format('Y-m-d') : null,
                'description' => $course->cDescription,
                'course_status' => $course->cStatus,
                'enrollment_status' => $enrollment->status,
                'enrolled_at' => $enrollment->enrolled_at,
                'completed_at' => $enrollment->completed_at,
                'fee_paid' => $enrollment->fee_paid,
            ];
        })->filter()->values();

        return response()->json([
            'status' => 'success',
            'data' => [
                'courses' => $courses,
                'total' => $courses->count(),
                'summary' => [
                    'enrolled' => $enrollments->where('status', 'enrolled')->count(),
                    'completed' => $enrollments->where('status', 'completed')->count(),
                    'dropped' => $enrollments->where('status', 'dropped')->count(),
                ],
            ],
        ]);
    }

    public function getCourseDetail(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $enrollment = CourseEnrollment::where('student_id', $user->uId)
            ->where('course_id', $id)
            ->with(['course.teacher:uId,uName,uPhone', 'course.category:caId,caName'])
            ->first();

        if (!$enrollment || !$enrollment->course) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn chưa đăng ký khóa học này.'
            ], 403);
        }

        $course = $enrollment->course;
        $userClassId = $user->class_id;
        $classes = Classes::where('course', $course->cId)
            ->with('teacher:uId,uName')
            ->orderByDesc('cCreated_at')
            ->get()
            ->map(function ($class) use ($userClassId) {
                $studentCount = User::where('uRole', 'student')
                    ->where('class_id', $class->cId)
                    ->count();
                return [
                    'class_id' => $class->cId,
                    'class_name' => $class->cName,
                    'teacher' => $class->teacher ? $class->teacher->uName : null,
                    'description' => $class->cDescription,
                    'status' => $class->cStatus,
                    'student_count' => $studentCount,
                    'is_enrolled' => $userClassId === $class->cId,
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => [
                'course' => [
                    'id' => $course->cId,
                    'name' => $course->cName,
                    'category' => $course->category ? $course->category->caName : null,
                    'teacher' => $course->teacher ? [
                        'id' => $course->teacher->uId,
                        'name' => $course->teacher->uName,
                        'phone' => $course->teacher->uPhone,
                    ] : null,
                    'schedule' => $course->cSchedule,
                    'time' => $course->cTime,
                    'start_date' => $course->cStartDate ? $course->cStartDate->format('Y-m-d') : null,
                    'end_date' => $course->cEndDate ? $course->cEndDate->format('Y-m-d') : null,
                    'description' => $course->cDescription,
                    'status' => $course->cStatus,
                ],
                'enrollment' => [
                    'status' => $enrollment->status,
                    'enrolled_at' => $enrollment->enrolled_at,
                    'completed_at' => $enrollment->completed_at,
                    'fee_paid' => $enrollment->fee_paid,
                    'notes' => $enrollment->notes,
                ],
                'classes' => $classes,
                'tests' => [],
            ],
        ]);
    }

    public function getClasses(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        // Each student belongs to exactly one class via users.class_id
        $classes = collect();
        if ($user->class_id) {
            $class = Classes::with(['teacher:uId,uName', 'course:cId,cName,cSchedule'])
                ->find($user->class_id);
            if ($class) {
                $studentCount = User::where('uRole', 'student')
                    ->where('class_id', $class->cId)
                    ->count();
                $classes->push([
                    'class_id' => $class->cId,
                    'class_name' => $class->cName,
                    'teacher' => $class->teacher ? [
                        'id' => $class->teacher->uId,
                        'name' => $class->teacher->uName,
                    ] : null,
                    'course' => $class->course ? [
                        'id' => $class->course->cId,
                        'name' => $class->course->cName,
                        'schedule' => $class->course->cSchedule,
                    ] : null,
                    'description' => $class->cDescription,
                    'status' => $class->cStatus,
                    'enrolled_at' => $user->created_at ?? null,
                    'student_count' => $studentCount,
                ]);
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'classes' => $classes->values(),
                'total' => $classes->count(),
            ],
        ]);
    }

    public function getClassDetail(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        if ((int)$user->class_id !== (int)$id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn chưa tham gia lớp học này.'
            ], 403);
        }

        $class = Classes::with(['teacher:uId,uName,uPhone', 'course'])
            ->find($id);
        if (!$class) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy lớp học.'
            ], 404);
        }

        $classmates = User::where('uRole', 'student')
            ->where('class_id', $id)
            ->where('uId', '!=', $user->uId)
            ->select('uId', 'uName')
            ->get()
            ->map(fn($u) => ['id' => $u->uId, 'name' => $u->uName])
            ->values();

        return response()->json([
            'status' => 'success',
            'data' => [
                'class' => [
                    'id' => $class->cId,
                    'name' => $class->cName,
                    'description' => $class->cDescription,
                    'status' => $class->cStatus,
                    'teacher' => $class->teacher ? [
                        'id' => $class->teacher->uId,
                        'name' => $class->teacher->uName,
                        'phone' => $class->teacher->uPhone,
                    ] : null,
                    'course' => $class->course ? [
                        'id' => $class->course->cId,
                        'name' => $class->course->cName,
                        'schedule' => $class->course->cSchedule,
                    ] : null,
                ],
                'enrollment' => [
                    'enrolled_at' => $user->created_at ?? null,
                ],
                'classmates' => $classmates,
                'classmate_count' => $classmates->count(),
                'tests' => [],
            ],
        ]);
    }

    public function getSchedule(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $weekOffset = (int)$request->get('week', 0);
        $startOfWeek = now()->startOfWeek()->addWeeks($weekOffset);
        $endOfWeek = now()->endOfWeek()->addWeeks($weekOffset);

        $courses = CourseEnrollment::where('student_id', $user->uId)
            ->where('status', 'enrolled')
            ->with(['course:cId,cName,cSchedule,cTime,cStartDate,cEndDate'])
            ->get()
            ->map(function ($enrollment) {
                $course = $enrollment->course;
                if (!$course) {
                    return null;
                }
                return [
                    'type' => 'course',
                    'id' => $course->cId,
                    'name' => $course->cName,
                    'schedule' => $course->cSchedule,
                    'time' => $course->cTime,
                ];
            })
            ->filter()
            ->values();

        // Real upcoming tests within the week range
        $classIds = $user->class_id ? [$user->class_id] : [];
        $upcomingTests = TestAssignment::with(['exam:eId,eTitle,eType,eSkill,eDuration_minutes'])
            ->where(function ($q) use ($user, $classIds) {
                $q->where(function ($s) use ($user) {
                    $s->where('taTarget_type', 'student')->where('taTarget_id', $user->uId);
                })->orWhere(function ($s) use ($classIds) {
                    $s->where('taTarget_type', 'class')->whereIn('taTarget_id', $classIds);
                });
            })
            ->whereNotNull('taDeadline')
            ->whereBetween('taDeadline', [$startOfWeek, $endOfWeek])
            ->orderBy('taDeadline', 'asc')
            ->get()
            ->map(function ($a) {
                if (!$a->exam) return null;
                return [
                    'type'          => 'test',
                    'assignment_id' => $a->taId,
                    'exam_id'       => $a->exam->eId,
                    'name'          => $a->exam->eTitle,
                    'exam_type'     => $a->exam->eType,
                    'skill'         => $a->exam->eSkill,
                    'duration'      => $a->exam->eDuration_minutes,
                    'deadline'      => $a->taDeadline,
                ];
            })
            ->filter()
            ->values();

        return response()->json([
            'status' => 'success',
            'data' => [
                'week' => [
                    'start' => $startOfWeek->format('Y-m-d'),
                    'end' => $endOfWeek->format('Y-m-d'),
                    'offset' => $weekOffset,
                ],
                'courses' => $courses,
                'upcoming_tests' => $upcomingTests,
                'test_count' => $upcomingTests->count(),
            ],
        ]);
    }

    public function getMaterials(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || $user->uRole !== 'student') {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền truy cập.'
            ], 401);
        }

        $enrollment = CourseEnrollment::where('student_id', $user->uId)
            ->where('course_id', $id)
            ->with('course')
            ->first();

        if (!$enrollment || !$enrollment->course) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn chưa đăng ký khóa học này.'
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Chức năng tài liệu đang được phát triển.',
            'data' => [
                'course_id' => $enrollment->course->cId,
                'course_name' => $enrollment->course->cName,
                'materials' => [],
                'note' => 'Tài liệu khóa học sẽ được cập nhật sớm.',
            ],
        ]);
    }
}
