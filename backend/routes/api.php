<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CategoryController;

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
Route::post('/users/accept', [AuthController::class, 'accept']);
Route::post('/users/reset-password', [AuthController::class, 'resetPassword']);

/* ========= USER ========= */
Route::get('/users', [UserController::class, 'index']);

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
        Route::post('/student', [UserController::class, 'store']);
        Route::put('/student/{id}', [UserController::class, 'update']);
        Route::delete('/student/{id}', [UserController::class, 'destroy']);
        
        // Blog Management
        Route::get('/blogs', [BlogController::class, 'index']);
        Route::post('/blogs', [BlogController::class, 'store']);
        Route::get('/blogs/{id}', [BlogController::class, 'show']);
        Route::put('/blogs/{id}', [BlogController::class, 'update']);
        Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);
        
        // Categories
        Route::get('/categories', [CategoryController::class, 'index']);
    });
    
    /* ======== STUDENT ROUTES (Future) ========= */
    // Route::middleware('role:student')->prefix('student')->group(function () {
    //     // Student specific routes will be added here
    // });
    
    /* ======== ADMIN ROUTES (Future) ========= */
    // Route::middleware('role:admin')->prefix('admin')->group(function () {
    //     // Admin specific routes will be added here
    // });
});
