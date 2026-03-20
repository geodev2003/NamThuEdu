<?php

namespace App\Services;

use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CourseManagementService
{
    /**
     * Tạo khóa học mới với validation VSTEP/IELTS
     */
    public static function createCourse($teacherId, $courseData)
    {
        // Validate course type
        $allowedTypes = ['VSTEP', 'IELTS'];
        if (!in_array($courseData['courseType'], $allowedTypes)) {
            throw new \InvalidArgumentException('Chỉ hỗ trợ khóa học VSTEP và IELTS');
        }

        // Validate schedule format
        $schedule = self::validateSchedule($courseData['schedule']);
        
        return Course::create([
            'cName' => $courseData['courseName'],
            'cCategory' => $courseData['category'],
            'cNumberOfStudent' => $courseData['numberOfStudent'],
            'cTime' => $courseData['time'],
            'cSchedule' => $schedule,
            'cStartDate' => $courseData['startDate'],
            'cEndDate' => $courseData['endDate'],
            'cDescription' => $courseData['description'] ?? '',
            'cTeacher' => $teacherId,
            'cStatus' => 'draft',
        ]);
    }

    /**
     * Validate và format lịch học
     */
    private static function validateSchedule($schedule)
    {
        // Format: "Thứ 2, Thứ 4, Thứ 6 - 18:00-20:00"
        // Hoặc: "2,4,6" (ngắn gọn)
        
        if (preg_match('/^[2-8](,[2-8])*$/', $schedule)) {
            // Format ngắn gọn: "2,4,6"
            return $schedule;
        }
        
        // Có thể mở rộng validation cho format dài hơn
        return $schedule;
    }

    /**
     * Kiểm tra khả năng enrollment
     */
    public static function canEnrollStudent($courseId, $studentId)
    {
        $course = Course::find($courseId);
        if (!$course) {
            return ['can_enroll' => false, 'reason' => 'Không tìm thấy khóa học'];
        }

        // Kiểm tra trạng thái khóa học
        if (!in_array($course->cStatus, ['active', 'draft'])) {
            return ['can_enroll' => false, 'reason' => 'Khóa học không còn nhận đăng ký'];
        }

        // Kiểm tra đã đăng ký chưa
        $existingEnrollment = CourseEnrollment::where('course_id', $courseId)
                                            ->where('student_id', $studentId)
                                            ->first();

        if ($existingEnrollment) {
            return [
                'can_enroll' => false, 
                'reason' => 'Học sinh đã được đăng ký',
                'current_status' => $existingEnrollment->status
            ];
        }

        // Kiểm tra số lượng
        $currentEnrollments = CourseEnrollment::where('course_id', $courseId)
                                            ->where('status', 'enrolled')
                                            ->count();

        if ($currentEnrollments >= $course->cNumberOfStudent) {
            return [
                'can_enroll' => false, 
                'reason' => 'Khóa học đã đầy',
                'current_students' => $currentEnrollments,
                'max_students' => $course->cNumberOfStudent
            ];
        }

        return [
            'can_enroll' => true,
            'available_slots' => $course->cNumberOfStudent - $currentEnrollments
        ];
    }

    /**
     * Thống kê tổng quan cho teacher
     */
    public static function getTeacherDashboard($teacherId)
    {
        $courses = Course::where('cTeacher', $teacherId)
                        ->whereNull('cDeleteAt')
                        ->get();

        $totalCourses = $courses->count();
        $activeCourses = $courses->where('cStatus', 'active')->count();
        $draftCourses = $courses->where('cStatus', 'draft')->count();
        $completedCourses = $courses->where('cStatus', 'complete')->count();

        // Thống kê enrollment
        $courseIds = $courses->pluck('cId');
        $totalEnrollments = CourseEnrollment::whereIn('course_id', $courseIds)
                                          ->where('status', 'enrolled')
                                          ->count();

        $totalRevenue = CourseEnrollment::whereIn('course_id', $courseIds)
                                      ->sum('fee_paid');

        // Khóa học sắp bắt đầu
        $upcomingCourses = $courses->where('cStartDate', '>', now())
                                 ->where('cStatus', 'active')
                                 ->sortBy('cStartDate')
                                 ->take(3);

        // Khóa học cần chú ý (ít học sinh)
        $coursesNeedAttention = [];
        foreach ($courses->where('cStatus', 'active') as $course) {
            $enrollmentCount = CourseEnrollment::where('course_id', $course->cId)
                                             ->where('status', 'enrolled')
                                             ->count();
            
            $occupancyRate = $course->cNumberOfStudent > 0 ? 
                ($enrollmentCount / $course->cNumberOfStudent) * 100 : 0;
            
            if ($occupancyRate < 50) {
                $coursesNeedAttention[] = [
                    'course' => $course,
                    'enrollment_count' => $enrollmentCount,
                    'occupancy_rate' => round($occupancyRate, 1),
                ];
            }
        }

        return [
            'overview' => [
                'total_courses' => $totalCourses,
                'active_courses' => $activeCourses,
                'draft_courses' => $draftCourses,
                'completed_courses' => $completedCourses,
                'total_students' => $totalEnrollments,
                'total_revenue' => $totalRevenue,
            ],
            'upcoming_courses' => $upcomingCourses->values(),
            'courses_need_attention' => $coursesNeedAttention,
            'recent_enrollments' => self::getRecentEnrollments($courseIds),
        ];
    }

    /**
     * Lấy enrollment gần đây
     */
    private static function getRecentEnrollments($courseIds)
    {
        return CourseEnrollment::with(['student', 'course'])
                              ->whereIn('course_id', $courseIds)
                              ->orderBy('enrolled_at', 'desc')
                              ->limit(5)
                              ->get()
                              ->map(function($enrollment) {
                                  return [
                                      'student_name' => $enrollment->student->uName,
                                      'course_name' => $enrollment->course->cName,
                                      'enrolled_at' => $enrollment->enrolled_at,
                                      'status' => $enrollment->status,
                                  ];
                              });
    }

    /**
     * Cập nhật trạng thái khóa học tự động
     */
    public static function updateCourseStatuses()
    {
        $now = now();
        
        // Chuyển từ draft/active sang ongoing nếu đã bắt đầu
        Course::where('cStatus', 'active')
              ->where('cStartDate', '<=', $now)
              ->where('cEndDate', '>', $now)
              ->update(['cStatus' => 'ongoing']);

        // Chuyển sang complete nếu đã kết thúc
        Course::whereIn('cStatus', ['active', 'ongoing'])
              ->where('cEndDate', '<=', $now)
              ->update(['cStatus' => 'complete']);

        return [
            'message' => 'Cập nhật trạng thái khóa học thành công',
            'updated_at' => $now
        ];
    }

    /**
     * Xuất báo cáo khóa học
     */
    public static function generateCourseReport($courseId)
    {
        $course = Course::with(['category', 'teacher'])->find($courseId);
        if (!$course) {
            throw new \Exception('Không tìm thấy khóa học');
        }

        $enrollments = CourseEnrollment::with(['student'])
                                     ->where('course_id', $courseId)
                                     ->get();

        return [
            'course_info' => [
                'name' => $course->cName,
                'teacher' => $course->teacher->uName,
                'category' => $course->category->caName ?? 'N/A',
                'schedule' => $course->cSchedule,
                'duration' => $course->cStartDate->format('d/m/Y') . ' - ' . $course->cEndDate->format('d/m/Y'),
                'max_students' => $course->cNumberOfStudent,
            ],
            'enrollment_summary' => [
                'total_enrolled' => $enrollments->where('status', 'enrolled')->count(),
                'total_completed' => $enrollments->where('status', 'completed')->count(),
                'total_dropped' => $enrollments->where('status', 'dropped')->count(),
                'total_revenue' => $enrollments->sum('fee_paid'),
            ],
            'student_list' => $enrollments->map(function($enrollment) {
                return [
                    'name' => $enrollment->student->uName,
                    'phone' => $enrollment->student->uPhone,
                    'status' => $enrollment->status,
                    'enrolled_date' => $enrollment->enrolled_at->format('d/m/Y'),
                    'fee_paid' => $enrollment->fee_paid,
                ];
            }),
            'generated_at' => now()->format('d/m/Y H:i:s'),
        ];
    }
}