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
use App\Http\Controllers\TestAssignmentController;
use App\Http\Controllers\GradingController;
use App\Http\Controllers\StudentTestController;
use App\Http\Controllers\TestController;

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

/* ========= USER ========= */
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

/* ========= TEST / VSTEP ========= */
Route::post('/tests/upload', [TestController::class, 'upload']);
Route::get('/tests', [TestController::class, 'index']);

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
        
        // Student Management
        Route::get('/students', [UserController::class, 'teacherStudents']);
        Route::get('/student/{id}', [UserController::class, 'getStudentById']);
        Route::post('/student', [UserController::class, 'storeStudent']);
        Route::put('/student/{id}', [UserController::class, 'update']);
        Route::delete('/student/{id}', [UserController::class, 'destroyStudent']);
        
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
        Route::get('/classes/{id}', [ClassController::class, 'show']);
        Route::put('/classes/{id}', [ClassController::class, 'update']);
        Route::delete('/classes/{id}', [ClassController::class, 'destroy']);
        Route::post('/classes/{id}/enroll', [ClassController::class, 'enroll']);
        
        // Exam Management
        Route::get('/exams', [ExamController::class, 'index']);
        Route::post('/exams', [ExamController::class, 'store']);
        Route::get('/exams/{id}', [ExamController::class, 'show']);
        Route::put('/exams/{id}', [ExamController::class, 'update']);
        Route::delete('/exams/{id}', [ExamController::class, 'destroy']);
        Route::post('/exams/{id}/questions', [ExamController::class, 'addQuestions']);
        Route::put('/exams/{examId}/questions/{questionId}', [ExamController::class, 'updateQuestion']);
        Route::delete('/exams/{examId}/questions/{questionId}', [ExamController::class, 'deleteQuestion']);
        
        // Exam Templates
        Route::get('/exam-templates', [App\Http\Controllers\ExamTemplateController::class, 'index']);
        Route::get('/exam-templates/{category}', [App\Http\Controllers\ExamTemplateController::class, 'byCategory']);
        Route::get('/exam-templates/{id}', [App\Http\Controllers\ExamTemplateController::class, 'show']);
        Route::get('/exam-templates/{id}/sections', [App\Http\Controllers\ExamTemplateController::class, 'sections']);
        Route::post('/exams/from-template/{templateId}', [App\Http\Controllers\ExamTemplateController::class, 'createFromTemplate']);
        
        // Test Assignment
        Route::post('/exams/{examId}/assign', [TestAssignmentController::class, 'assign']);
        Route::get('/assignments', [TestAssignmentController::class, 'index']);
        Route::delete('/assignments/{id}', [TestAssignmentController::class, 'destroy']);
        
        // Grading
        Route::get('/submissions', [GradingController::class, 'index']);
        Route::get('/submissions/{id}', [GradingController::class, 'show']);
        Route::post('/submissions/{id}/grade', [GradingController::class, 'grade']);
    });
    
    /* ======== STUDENT ROUTES ========= */
    Route::middleware('role:student')->prefix('student')->group(function () {
        // Test Taking
        Route::get('/tests', [StudentTestController::class, 'index']);
        Route::get('/tests/{id}', [StudentTestController::class, 'show']);
        Route::post('/tests/{id}/start', [StudentTestController::class, 'start']);
        Route::post('/tests/{submissionId}/answer', [StudentTestController::class, 'answer']);
        Route::post('/tests/{submissionId}/submit', [StudentTestController::class, 'submit']);
        
        // Submission History
        Route::get('/submissions', [StudentTestController::class, 'submissions']);
        Route::get('/submissions/{id}', [StudentTestController::class, 'submissionDetail']);
    });
    
    /* ======== ADMIN ROUTES (Future) ========= */
    // Route::middleware('role:admin')->prefix('admin')->group(function () {
    //     // Admin specific routes will be added here
    // });
});
