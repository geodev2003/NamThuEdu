<?php

namespace App\Http\Controllers;

use App\Models\ClassEnrollment;
use App\Models\Classes;
use App\Models\CourseEnrollment;
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
        $classes = Classes::where('course', $course->cId)
            ->with('teacher:uId,uName')
            ->orderByDesc('cCreated_at')
            ->get()
            ->map(function ($class) use ($user) {
                $isEnrolled = ClassEnrollment::where('class_id', $class->cId)
                    ->where('student_id', $user->uId)
                    ->exists();

                return [
                    'class_id' => $class->cId,
                    'class_name' => $class->cName,
                    'teacher' => $class->teacher ? $class->teacher->uName : null,
                    'description' => $class->cDescription,
                    'status' => $class->cStatus,
                    'student_count' => $class->getStudentCount(),
                    'is_enrolled' => $isEnrolled,
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

        $enrollments = ClassEnrollment::where('student_id', $user->uId)
            ->with(['class.teacher:uId,uName', 'class.course:cId,cName,cSchedule'])
            ->orderByDesc('enrolled_at')
            ->get();

        $classes = $enrollments->map(function ($enrollment) {
            $class = $enrollment->class;
            if (!$class) {
                return null;
            }

            return [
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
                'enrolled_at' => $enrollment->enrolled_at,
                'student_count' => $class->getStudentCount(),
            ];
        })->filter()->values();

        return response()->json([
            'status' => 'success',
            'data' => [
                'classes' => $classes,
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

        $enrollment = ClassEnrollment::where('student_id', $user->uId)
            ->where('class_id', $id)
            ->first();

        if (!$enrollment) {
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

        $classmates = ClassEnrollment::where('class_id', $id)
            ->where('student_id', '!=', $user->uId)
            ->with('student:uId,uName')
            ->get()
            ->map(function ($item) {
                return $item->student ? [
                    'id' => $item->student->uId,
                    'name' => $item->student->uName,
                ] : null;
            })
            ->filter()
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
                    'enrolled_at' => $enrollment->enrolled_at,
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

        return response()->json([
            'status' => 'success',
            'data' => [
                'week' => [
                    'start' => $startOfWeek->format('Y-m-d'),
                    'end' => $endOfWeek->format('Y-m-d'),
                    'offset' => $weekOffset,
                ],
                'courses' => $courses,
                'upcoming_tests' => [],
                'test_count' => 0,
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
