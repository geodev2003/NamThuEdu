<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ExamTemplateController;
use App\Http\Controllers\TestAssignmentController;
use App\Http\Controllers\GradingController;
use App\Http\Controllers\StudentTestController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\SystemReportController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/* ========= AUTH ========= */
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);
Route::post('/users/accept', [AuthController::class, 'accept']);
Route::post('/users/reset-password', [AuthController::class, 'resetPassword']);

/* ========= PUBLIC ENDPOINTS ========= */
Route::get('/tests', [TestController::class, 'index']); // Public test list

/* ========= AUTHENTICATED ROUTES ========= */
Route::middleware('auth:sanctum')->group(function () {
    
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
    
    /* ======== TEACHER ROUTES ========= */
    Route::middleware('role:teacher')->prefix('teacher')->group(function () {
        
        // Course Management
        Route::get('/courses', [CourseController::class, 'index']);
        Route::post('/courses', [CourseController::class, 'store']);
        Route::get('/courses/{id}', [CourseController::class, 'show']);
        Route::put('/courses/{id}', [CourseController::class, 'update']);
        Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
        
        // Course Enrollment Management
        Route::get('/courses/{id}/students', [CourseController::class, 'getStudents']);
        Route::post('/courses/{id}/enroll', [CourseController::class, 'enrollStudent']);
        Route::delete('/courses/{courseId}/students/{studentId}', [CourseController::class, 'removeStudent']);
        Route::get('/courses/{id}/statistics', [CourseController::class, 'getStatistics']);
        
        // Student Management
        Route::get('/students', [UserController::class, 'teacherStudents']);
        Route::get('/student/{id}', [UserController::class, 'getStudentById']);
        Route::post('/student', [UserController::class, 'storeStudent']);
        Route::put('/student/{id}', [UserController::class, 'update']);
        Route::delete('/student/{id}', [UserController::class, 'destroyStudent']);
        Route::get('/students/statistics', [UserController::class, 'studentStatistics']);
        Route::get('/students/export', [UserController::class, 'exportStudents']);
        
        // Blog Management
        Route::get('/blogs', [BlogController::class, 'index']);
        Route::post('/blogs', [BlogController::class, 'store']);
        Route::get('/blogs/{id}', [BlogController::class, 'show']);
        Route::put('/blogs/{id}', [BlogController::class, 'update']);
        Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);
        
        // Categories
        Route::get('/categories', [CategoryController::class, 'index']);
        
        // Class Management
        Route::get('/classes', [ClassController::class, 'index']);
        Route::post('/classes', [ClassController::class, 'store']);
        Route::get('/classes/statistics', [ClassController::class, 'statistics']);
        Route::get('/classes/{id}', [ClassController::class, 'show']);
        Route::put('/classes/{id}', [ClassController::class, 'update']);
        Route::delete('/classes/{id}', [ClassController::class, 'destroy']);
        Route::post('/classes/{id}/enroll', [ClassController::class, 'enroll']);
        Route::post('/classes/{fromId}/transfer/{toId}', [ClassController::class, 'transferStudents']);
        Route::get('/classes/{id}/transfer-history', [ClassController::class, 'transferHistory']);
        Route::delete('/classes/{id}/students/{studentId}', [ClassController::class, 'removeStudent']);
        
        // Exam Management
        Route::get('/exams', [ExamController::class, 'index']);
        Route::post('/exams', [ExamController::class, 'store']);
        Route::get('/exams/{id}', [ExamController::class, 'show']);
        Route::put('/exams/{id}', [ExamController::class, 'update']);
        Route::delete('/exams/{id}', [ExamController::class, 'destroy']);
        Route::post('/exams/{id}/questions', [ExamController::class, 'addQuestions']);
        Route::put('/exams/{examId}/questions/{questionId}', [ExamController::class, 'updateQuestion']);
        Route::delete('/exams/{examId}/questions/{questionId}', [ExamController::class, 'deleteQuestion']);
        Route::get('/exams/{id}/sections', [ExamController::class, 'sections']);
        Route::post('/exams/{id}/clone', [ExamController::class, 'clone']);
        Route::get('/exams/{id}/preview', [ExamController::class, 'preview']);
        Route::post('/exams/{id}/publish', [ExamController::class, 'publish']);
        
        // Exam Templates
        Route::get('/exam-templates', [App\Http\Controllers\ExamTemplateController::class, 'index']);
        Route::get('/exam-templates/{category}', [App\Http\Controllers\ExamTemplateController::class, 'byCategory']);
        Route::get('/exam-templates/{id}', [App\Http\Controllers\ExamTemplateController::class, 'show']);
        Route::get('/exam-templates/{id}/sections', [App\Http\Controllers\ExamTemplateController::class, 'sections']);
        Route::post('/exams/from-template/{templateId}', [App\Http\Controllers\ExamTemplateController::class, 'createFromTemplate']);
        
        // Test Management
        Route::post('/tests/upload', [TestController::class, 'upload']);
        
        // User Management (Admin functions)
        Route::middleware('admin')->group(function () {
            Route::get('/users', [UserController::class, 'index']);
            Route::post('/users', [UserController::class, 'store']);
            Route::delete('/users/{id}', [UserController::class, 'destroy']);
        });
        
        // Test Assignment
        Route::post('/exams/{examId}/assign', [TestAssignmentController::class, 'assign']);
        Route::get('/assignments', [TestAssignmentController::class, 'index']);
        Route::delete('/assignments/{id}', [TestAssignmentController::class, 'destroy']);
        Route::get('/assignments/{id}/progress', [TestAssignmentController::class, 'progress']);
        Route::post('/assignments/bulk', [TestAssignmentController::class, 'bulkAssign']);
        Route::post('/assignments/{id}/reminders', [TestAssignmentController::class, 'sendReminders']);
        Route::get('/assignments/statistics', [TestAssignmentController::class, 'statistics']);
        
        // Grading
        Route::get('/submissions', [GradingController::class, 'index']);
        Route::get('/submissions/{id}', [GradingController::class, 'show']);
        Route::post('/submissions/{id}/grade', [GradingController::class, 'grade']);
        Route::post('/submissions/{id}/auto-grade', [GradingController::class, 'autoGrade']);
        Route::post('/submissions/{id}/detailed-grade', [GradingController::class, 'detailedGrade']);
        Route::get('/classes/{classId}/report', [GradingController::class, 'classReport']);
        Route::get('/grading/statistics', [GradingController::class, 'gradingStatistics']);
        
        // Real-time Dashboard & Monitoring
        Route::get('/dashboard/test-statistics/{examId}', [App\Http\Controllers\TeacherDashboardController::class, 'getTestStatistics']);
        Route::get('/dashboard/active-sessions', [App\Http\Controllers\TeacherDashboardController::class, 'getActiveSessions']);
        Route::post('/dashboard/send-message', [App\Http\Controllers\TeacherDashboardController::class, 'sendMessageToStudent']);
        Route::get('/dashboard/connection-logs/{submissionId}', [App\Http\Controllers\TeacherDashboardController::class, 'getConnectionLogs']);
    });
    
    /* ======== STUDENT ROUTES ========= */
    Route::middleware('role:student')->prefix('student')->group(function () {
        // Test Taking
        Route::get('/tests', [StudentTestController::class, 'index']);
        Route::get('/tests/{id}', [StudentTestController::class, 'show']);
        Route::get('/tests/{id}/resume', [StudentTestController::class, 'resume']);
        Route::post('/tests/{id}/start', [StudentTestController::class, 'start']);
        Route::post('/tests/{submissionId}/answer', [StudentTestController::class, 'answer']);
        Route::post('/tests/{submissionId}/submit', [StudentTestController::class, 'submit']);
        
        // WebSocket Real-time Features
        Route::post('/websocket/connect', [App\Http\Controllers\TestWebSocketController::class, 'connect']);
        Route::post('/websocket/answer', [App\Http\Controllers\TestWebSocketController::class, 'saveAnswer']);
        Route::post('/websocket/reconnect', [App\Http\Controllers\TestWebSocketController::class, 'reconnect']);
        Route::post('/websocket/sync-time', [App\Http\Controllers\TestWebSocketController::class, 'syncTime']);
        
        // Submission History & Results Analysis
        Route::get('/submissions', [StudentTestController::class, 'submissions']);
        Route::get('/submissions/{id}', [StudentTestController::class, 'submissionDetail']);
        Route::get('/submissions/{id}/answers', [StudentTestController::class, 'submissionAnswers']);
        Route::get('/submissions/{id}/compare', [StudentTestController::class, 'compareSubmission']);
        
        // Learning Progress & Analytics
        Route::get('/progress', [StudentTestController::class, 'progress']);
    });
    
    /* ======== ADMIN ROUTES ========= */
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        
        // User Management - View All Users
        Route::get('/users', [UserController::class, 'adminUsers']);
        Route::get('/users/{id}', [UserController::class, 'adminUserDetail']);
        Route::post('/users', [UserController::class, 'adminCreateUser']);
        Route::put('/users/{id}', [UserController::class, 'adminUpdateUser']);
        Route::delete('/users/{id}', [UserController::class, 'adminDeleteUser']);
        
        // Role Management
        Route::post('/users/{id}/change-role', [UserController::class, 'changeUserRole']);
        Route::get('/roles/statistics', [UserController::class, 'roleStatistics']);
        
        // Account Status Management
        Route::post('/users/{id}/lock', [UserController::class, 'lockUser']);
        Route::post('/users/{id}/unlock', [UserController::class, 'unlockUser']);
        Route::get('/users/locked', [UserController::class, 'lockedUsers']);
        
        // Bulk Operations
        Route::post('/users/bulk-action', [UserController::class, 'bulkUserAction']);
        Route::post('/users/bulk-import', [UserController::class, 'bulkImportUsers']);
        
        // System Statistics
        Route::get('/statistics/overview', [UserController::class, 'systemOverview']);
        Route::get('/statistics/activity', [UserController::class, 'userActivity']);
        
        // Export & Reports
        Route::get('/users/export', [UserController::class, 'adminExportUsers']);
        Route::get('/reports/user-activity', [UserController::class, 'userActivityReport']);
        
        // Content Management - Blog Moderation
        Route::get('/posts', [BlogController::class, 'adminPosts']);
        Route::get('/posts/{id}', [BlogController::class, 'adminPostDetail']);
        Route::post('/posts/{id}/approve', [BlogController::class, 'approvePost']);
        Route::post('/posts/{id}/reject', [BlogController::class, 'rejectPost']);
        Route::delete('/posts/{id}', [BlogController::class, 'adminDeletePost']);
        Route::get('/posts/pending', [BlogController::class, 'pendingPosts']);
        
        // Category Management
        Route::get('/categories', [CategoryController::class, 'adminCategories']);
        Route::post('/categories', [CategoryController::class, 'adminCreateCategory']);
        Route::put('/categories/{id}', [CategoryController::class, 'adminUpdateCategory']);
        Route::delete('/categories/{id}', [CategoryController::class, 'adminDeleteCategory']);
        
        // Exam Template Management
        Route::get('/exam-templates', [ExamTemplateController::class, 'adminTemplates']);
        Route::post('/exam-templates', [ExamTemplateController::class, 'adminCreateTemplate']);
        Route::put('/exam-templates/{id}', [ExamTemplateController::class, 'adminUpdateTemplate']);
        Route::delete('/exam-templates/{id}', [ExamTemplateController::class, 'adminDeleteTemplate']);
        Route::post('/exam-templates/{id}/activate', [ExamTemplateController::class, 'activateTemplate']);
        Route::post('/exam-templates/{id}/deactivate', [ExamTemplateController::class, 'deactivateTemplate']);
        
        // Exam Moderation
        Route::get('/exams', [ExamController::class, 'adminExams']);
        Route::get('/exams/{id}', [ExamController::class, 'adminExamDetail']);
        Route::post('/exams/{id}/approve', [ExamController::class, 'approveExam']);
        Route::post('/exams/{id}/reject', [ExamController::class, 'rejectExam']);
        Route::delete('/exams/{id}', [ExamController::class, 'adminDeleteExam']);
        Route::get('/exams/pending', [ExamController::class, 'pendingExams']);
        
        // Statistics
        Route::get('/content/statistics', [BlogController::class, 'contentStatistics']);
        Route::get('/templates/statistics', [ExamTemplateController::class, 'templateStatistics']);
        Route::get('/exams/statistics', [ExamController::class, 'examStatistics']);
        
        // System Reports & Analytics
        Route::prefix('reports')->group(function () {
            Route::get('/dashboard', [SystemReportController::class, 'dashboard']);
            Route::get('/users', [SystemReportController::class, 'userStatistics']);
            Route::get('/courses', [SystemReportController::class, 'courseStatistics']);
            Route::get('/activity', [SystemReportController::class, 'activityReport']);
            Route::get('/trends', [SystemReportController::class, 'trendsAnalysis']);
            Route::get('/export', [SystemReportController::class, 'exportReport']);
        });
    });
});
