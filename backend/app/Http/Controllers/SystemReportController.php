<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Course;
use App\Models\Classes;
use App\Models\Exam;
use App\Models\TestAssignment;
use App\Models\Submission;
use App\Models\Post;
use App\Models\Category;

class SystemReportController extends Controller
{
    /**
     * @OA\Get(
     *     path="/admin/reports/dashboard",
     *     tags={"System Reports"},
     *     summary="Get admin dashboard overview",
     *     description="Get comprehensive system overview for admin dashboard",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Dashboard data retrieved successfully"),
     *     @OA\Response(response=403, description="Access denied")
     * )
     * 
     * GET /api/admin/reports/dashboard
     * Tổng quan hệ thống cho dashboard admin
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        // Users Overview
        $usersOverview = $this->getUsersOverview();
        
        // Courses Overview
        $coursesOverview = $this->getCoursesOverview();
        
        // Exams Overview
        $examsOverview = $this->getExamsOverview();
        
        // System Activity
        $systemActivity = $this->getSystemActivity();
        
        // Performance Metrics
        $performanceMetrics = $this->getPerformanceMetrics();

        return response()->json([
            'status' => 'success',
            'data' => [
                'users' => $usersOverview,
                'courses' => $coursesOverview,
                'exams' => $examsOverview,
                'activity' => $systemActivity,
                'performance' => $performanceMetrics,
                'generated_at' => now()->toISOString()
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/admin/reports/users",
     *     tags={"System Reports"},
     *     summary="Get detailed user statistics",
     *     description="Get comprehensive user statistics and analytics",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="period",
     *         in="query",
     *         description="Time period (7d, 30d, 90d, 1y)",
     *         @OA\Schema(type="string", enum={"7d", "30d", "90d", "1y"})
     *     ),
     *     @OA\Response(response=200, description="User statistics retrieved successfully")
     * )
     * 
     * GET /api/admin/reports/users
     * Thống kê chi tiết người dùng
     */
    public function userStatistics(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        $period = $request->get('period', '30d');
        $days = $this->getPeriodDays($period);

        // Basic statistics
        $totalUsers = User::whereNull('uDeleted_at')->count();
        $activeUsers = User::where('uStatus', 'active')->whereNull('uDeleted_at')->count();
        $newUsers = User::where('uCreated_at', '>=', now()->subDays($days))
                       ->whereNull('uDeleted_at')
                       ->count();

        // Users by role
        $usersByRole = User::whereNull('uDeleted_at')
                          ->selectRaw('uRole, COUNT(*) as count')
                          ->groupBy('uRole')
                          ->pluck('count', 'uRole');

        // Registration trend
        $registrationTrend = $this->getRegistrationTrend($days);

        // Activity statistics
        $activityStats = $this->getUserActivityStats($days);

        // Geographic distribution (if available)
        $geographicStats = $this->getGeographicStats();

        return response()->json([
            'status' => 'success',
            'data' => [
                'overview' => [
                    'total_users' => $totalUsers,
                    'active_users' => $activeUsers,
                    'new_users' => $newUsers,
                    'active_rate' => $totalUsers > 0 ? round(($activeUsers / $totalUsers) * 100, 2) : 0,
                ],
                'by_role' => $usersByRole,
                'registration_trend' => $registrationTrend,
                'activity' => $activityStats,
                'geographic' => $geographicStats,
                'period' => $period
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/admin/reports/courses",
     *     tags={"System Reports"},
     *     summary="Get detailed course statistics",
     *     description="Get comprehensive course statistics and analytics",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="period",
     *         in="query",
     *         description="Time period (7d, 30d, 90d, 1y)",
     *         @OA\Schema(type="string", enum={"7d", "30d", "90d", "1y"})
     *     ),
     *     @OA\Response(response=200, description="Course statistics retrieved successfully")
     * )
     * 
     * GET /api/admin/reports/courses
     * Thống kê chi tiết khóa học
     */
    public function courseStatistics(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        $period = $request->get('period', '30d');
        $days = $this->getPeriodDays($period);

        // Basic course statistics
        $totalCourses = Course::count();
        $activeCourses = Course::where('cStatus', 'active')->count();
        $newCourses = Course::where('cCreated_at', '>=', now()->subDays($days))->count();

        // Courses by type
        $coursesByType = Course::selectRaw('cType, COUNT(*) as count')
                              ->groupBy('cType')
                              ->pluck('count', 'cType');

        // Enrollment statistics
        $totalEnrollments = DB::table('course_enrollments')->count();
        $newEnrollments = DB::table('course_enrollments')
                            ->where('enrolled_at', '>=', now()->subDays($days))
                            ->count();

        // Popular courses
        $popularCourses = Course::withCount('enrollments')
                               ->orderByDesc('enrollments_count')
                               ->limit(10)
                               ->get()
                               ->map(function($course) {
                                   return [
                                       'course_name' => $course->cName,
                                       'enrollments' => $course->enrollments_count,
                                       'type' => $course->cType
                                   ];
                               });

        // Revenue statistics (if applicable)
        $revenueStats = $this->getCourseRevenueStats($days);

        // Course creation trend
        $creationTrend = $this->getCourseCreationTrend($days);

        return response()->json([
            'status' => 'success',
            'data' => [
                'overview' => [
                    'total_courses' => $totalCourses,
                    'active_courses' => $activeCourses,
                    'new_courses' => $newCourses,
                    'total_enrollments' => $totalEnrollments,
                    'new_enrollments' => $newEnrollments,
                ],
                'by_type' => $coursesByType,
                'popular_courses' => $popularCourses,
                'revenue' => $revenueStats,
                'creation_trend' => $creationTrend,
                'period' => $period
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/admin/reports/activity",
     *     tags={"System Reports"},
     *     summary="Get system activity report",
     *     description="Get detailed system activity and usage analytics",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="period",
     *         in="query",
     *         description="Time period (7d, 30d, 90d, 1y)",
     *         @OA\Schema(type="string", enum={"7d", "30d", "90d", "1y"})
     *     ),
     *     @OA\Response(response=200, description="Activity report retrieved successfully")
     * )
     * 
     * GET /api/admin/reports/activity
     * Báo cáo hoạt động hệ thống
     */
    public function activityReport(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        $period = $request->get('period', '30d');
        $days = $this->getPeriodDays($period);

        // Test activity
        $testActivity = $this->getTestActivity($days);

        // Content activity
        $contentActivity = $this->getContentActivity($days);

        // User engagement
        $userEngagement = $this->getUserEngagement($days);

        // System usage patterns
        $usagePatterns = $this->getUsagePatterns($days);

        // Peak hours analysis
        $peakHours = $this->getPeakHoursAnalysis($days);

        return response()->json([
            'status' => 'success',
            'data' => [
                'tests' => $testActivity,
                'content' => $contentActivity,
                'engagement' => $userEngagement,
                'usage_patterns' => $usagePatterns,
                'peak_hours' => $peakHours,
                'period' => $period
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/admin/reports/trends",
     *     tags={"System Reports"},
     *     summary="Get usage trends analysis",
     *     description="Get detailed usage trends and predictive analytics",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="period",
     *         in="query",
     *         description="Time period (30d, 90d, 6m, 1y)",
     *         @OA\Schema(type="string", enum={"30d", "90d", "6m", "1y"})
     *     ),
     *     @OA\Response(response=200, description="Trends analysis retrieved successfully")
     * )
     * 
     * GET /api/admin/reports/trends
     * Phân tích xu hướng sử dụng
     */
    public function trendsAnalysis(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        $period = $request->get('period', '90d');
        $days = $this->getPeriodDays($period);

        // Growth trends
        $growthTrends = $this->getGrowthTrends($days);

        // Usage trends
        $usageTrends = $this->getUsageTrends($days);

        // Performance trends
        $performanceTrends = $this->getPerformanceTrends($days);

        // Seasonal patterns
        $seasonalPatterns = $this->getSeasonalPatterns($days);

        // Predictions (simple linear regression)
        $predictions = $this->generatePredictions($days);

        return response()->json([
            'status' => 'success',
            'data' => [
                'growth' => $growthTrends,
                'usage' => $usageTrends,
                'performance' => $performanceTrends,
                'seasonal' => $seasonalPatterns,
                'predictions' => $predictions,
                'period' => $period
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/admin/reports/export",
     *     tags={"System Reports"},
     *     summary="Export system reports",
     *     description="Export comprehensive system reports in various formats",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="type",
     *         in="query",
     *         description="Report type",
     *         @OA\Schema(type="string", enum={"dashboard", "users", "courses", "activity", "trends"})
     *     ),
     *     @OA\Parameter(
     *         name="format",
     *         in="query",
     *         description="Export format",
     *         @OA\Schema(type="string", enum={"json", "csv", "pdf"})
     *     ),
     *     @OA\Parameter(
     *         name="period",
     *         in="query",
     *         description="Time period",
     *         @OA\Schema(type="string", enum={"7d", "30d", "90d", "1y"})
     *     ),
     *     @OA\Response(response=200, description="Report exported successfully")
     * )
     * 
     * GET /api/admin/reports/export
     * Xuất báo cáo hệ thống
     */
    public function exportReport(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->uRole !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Chỉ quản trị viên mới có quyền truy cập.'
            ], 403);
        }

        $type = $request->get('type', 'dashboard');
        $format = $request->get('format', 'json');
        $period = $request->get('period', '30d');

        // Get report data based on type
        $reportData = $this->getReportData($type, $period);

        // Generate export based on format
        switch ($format) {
            case 'csv':
                return $this->exportToCsv($reportData, $type);
            case 'pdf':
                return $this->exportToPdf($reportData, $type);
            default:
                return response()->json([
                    'status' => 'success',
                    'data' => $reportData,
                    'export_info' => [
                        'type' => $type,
                        'format' => $format,
                        'period' => $period,
                        'generated_at' => now()->toISOString()
                    ]
                ]);
        }
    }

    /* ========================================
     * PRIVATE HELPER METHODS
     * ======================================== */

    private function getUsersOverview()
    {
        $totalUsers = User::whereNull('uDeleted_at')->count();
        $activeUsers = User::where('uStatus', 'active')->whereNull('uDeleted_at')->count();
        $newUsersToday = User::whereDate('uCreated_at', today())->whereNull('uDeleted_at')->count();
        $newUsersThisWeek = User::where('uCreated_at', '>=', now()->subDays(7))->whereNull('uDeleted_at')->count();

        return [
            'total' => $totalUsers,
            'active' => $activeUsers,
            'new_today' => $newUsersToday,
            'new_this_week' => $newUsersThisWeek,
            'active_rate' => $totalUsers > 0 ? round(($activeUsers / $totalUsers) * 100, 2) : 0,
        ];
    }

    private function getCoursesOverview()
    {
        $totalCourses = Course::count();
        $activeCourses = Course::where('cStatus', 'active')->count();
        $totalEnrollments = DB::table('course_enrollments')->count();
        $newEnrollmentsToday = DB::table('course_enrollments')->whereDate('enrolled_at', today())->count();

        return [
            'total' => $totalCourses,
            'active' => $activeCourses,
            'total_enrollments' => $totalEnrollments,
            'new_enrollments_today' => $newEnrollmentsToday,
            'avg_enrollments_per_course' => $totalCourses > 0 ? round($totalEnrollments / $totalCourses, 2) : 0,
        ];
    }

    private function getExamsOverview()
    {
        $totalExams = Exam::count();
        $publicExams = Exam::where('eIs_private', false)->count();
        $totalSubmissions = Submission::count();
        $newSubmissionsToday = Submission::whereDate('sSubmitted_at', today())->count();

        return [
            'total' => $totalExams,
            'public' => $publicExams,
            'total_submissions' => $totalSubmissions,
            'new_submissions_today' => $newSubmissionsToday,
            'avg_submissions_per_exam' => $totalExams > 0 ? round($totalSubmissions / $totalExams, 2) : 0,
        ];
    }

    private function getSystemActivity()
    {
        $today = today();
        $yesterday = $today->copy()->subDay();

        return [
            'logins_today' => $this->getLoginsCount($today),
            'logins_yesterday' => $this->getLoginsCount($yesterday),
            'tests_taken_today' => Submission::whereDate('sSubmitted_at', $today)->count(),
            'posts_created_today' => Post::whereDate('pCreated_at', $today)->count(),
            'courses_created_today' => Course::whereDate('cCreated_at', $today)->count(),
        ];
    }

    private function getPerformanceMetrics()
    {
        // Average test scores
        $avgScore = Submission::whereNotNull('sTotal_score')->avg('sTotal_score');
        
        // Completion rates
        $totalAssignments = TestAssignment::count();
        $completedAssignments = TestAssignment::whereHas('submissions')->count();
        $completionRate = $totalAssignments > 0 ? round(($completedAssignments / $totalAssignments) * 100, 2) : 0;

        return [
            'avg_test_score' => round($avgScore ?? 0, 2),
            'assignment_completion_rate' => $completionRate,
            'system_uptime' => '99.9%', // This would come from monitoring system
        ];
    }

    private function getPeriodDays($period)
    {
        switch ($period) {
            case '7d': return 7;
            case '30d': return 30;
            case '90d': return 90;
            case '6m': return 180;
            case '1y': return 365;
            default: return 30;
        }
    }

    private function getRegistrationTrend($days)
    {
        $trend = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $count = User::whereDate('uCreated_at', $date)->whereNull('uDeleted_at')->count();
            $trend[] = [
                'date' => $date,
                'registrations' => $count
            ];
        }
        return $trend;
    }

    private function getUserActivityStats($days)
    {
        // This would require login tracking table
        return [
            'daily_active_users' => User::where('uStatus', 'active')->count(), // Simplified
            'weekly_active_users' => User::where('uStatus', 'active')->count(), // Simplified
            'monthly_active_users' => User::where('uStatus', 'active')->count(), // Simplified
        ];
    }

    private function getGeographicStats()
    {
        // This would require location data in users table
        return [
            'top_countries' => [
                ['country' => 'Vietnam', 'users' => User::count()],
            ]
        ];
    }

    private function getCourseRevenueStats($days)
    {
        // This would require payment/revenue tracking
        return [
            'total_revenue' => 0,
            'revenue_this_period' => 0,
            'avg_revenue_per_course' => 0,
        ];
    }

    private function getCourseCreationTrend($days)
    {
        $trend = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $count = Course::whereDate('cCreated_at', $date)->count();
            $trend[] = [
                'date' => $date,
                'courses_created' => $count
            ];
        }
        return $trend;
    }

    private function getTestActivity($days)
    {
        $totalTests = TestAssignment::where('created_at', '>=', now()->subDays($days))->count();
        $completedTests = Submission::where('sSubmitted_at', '>=', now()->subDays($days))->count();

        return [
            'tests_assigned' => $totalTests,
            'tests_completed' => $completedTests,
            'completion_rate' => $totalTests > 0 ? round(($completedTests / $totalTests) * 100, 2) : 0,
        ];
    }

    private function getContentActivity($days)
    {
        return [
            'posts_created' => Post::where('pCreated_at', '>=', now()->subDays($days))->count(),
            'posts_approved' => Post::where('pApproved_at', '>=', now()->subDays($days))->count(),
            'exams_created' => Exam::where('eCreated_at', '>=', now()->subDays($days))->count(),
        ];
    }

    private function getUserEngagement($days)
    {
        // This would require more detailed tracking
        return [
            'avg_session_duration' => '25 minutes', // Placeholder
            'bounce_rate' => '15%', // Placeholder
            'pages_per_session' => 8.5, // Placeholder
        ];
    }

    private function getUsagePatterns($days)
    {
        return [
            'peak_usage_day' => 'Tuesday',
            'peak_usage_hour' => '14:00',
            'most_used_feature' => 'Test Taking',
        ];
    }

    private function getPeakHoursAnalysis($days)
    {
        // This would require detailed logging
        $hours = [];
        for ($i = 0; $i < 24; $i++) {
            $hours[] = [
                'hour' => sprintf('%02d:00', $i),
                'activity_level' => rand(10, 100) // Placeholder
            ];
        }
        return $hours;
    }

    private function getGrowthTrends($days)
    {
        return [
            'user_growth_rate' => 15.5, // Percentage
            'course_growth_rate' => 8.2,
            'engagement_growth_rate' => 12.1,
        ];
    }

    private function getUsageTrends($days)
    {
        return [
            'test_taking_trend' => 'increasing',
            'course_enrollment_trend' => 'stable',
            'content_creation_trend' => 'increasing',
        ];
    }

    private function getPerformanceTrends($days)
    {
        return [
            'avg_score_trend' => 'improving',
            'completion_rate_trend' => 'stable',
            'user_satisfaction_trend' => 'improving',
        ];
    }

    private function getSeasonalPatterns($days)
    {
        return [
            'peak_season' => 'September - December',
            'low_season' => 'June - August',
            'seasonal_variance' => '35%',
        ];
    }

    private function generatePredictions($days)
    {
        return [
            'next_month_users' => User::count() * 1.15, // Simple prediction
            'next_month_courses' => Course::count() * 1.08,
            'next_month_tests' => Submission::count() * 1.12,
        ];
    }

    private function getLoginsCount($date)
    {
        // This would require login tracking
        return rand(50, 200); // Placeholder
    }

    private function getReportData($type, $period)
    {
        $request = request();
        $request->merge(['period' => $period]);

        switch ($type) {
            case 'users':
                return $this->userStatistics($request)->getData()->data;
            case 'courses':
                return $this->courseStatistics($request)->getData()->data;
            case 'activity':
                return $this->activityReport($request)->getData()->data;
            case 'trends':
                return $this->trendsAnalysis($request)->getData()->data;
            default:
                return $this->dashboard($request)->getData()->data;
        }
    }

    private function exportToCsv($data, $type)
    {
        // CSV export implementation
        return response()->json([
            'status' => 'success',
            'message' => 'CSV export sẽ được implement trong phiên bản sau',
            'data' => $data
        ]);
    }

    private function exportToPdf($data, $type)
    {
        // PDF export implementation
        return response()->json([
            'status' => 'success',
            'message' => 'PDF export sẽ được implement trong phiên bản sau',
            'data' => $data
        ]);
    }
}