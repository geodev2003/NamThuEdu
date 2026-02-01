<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


/**
 * =================================================
 * Front Controller – Entry Point của Backend API
 * =================================================
 * - PHP thuần theo mô hình MVC
 * - Backend chỉ trả JSON (VueJS SPA)
 * - Autoload bằng Composer (PSR-4)
 */

/**
 * ------------------------------------------
 * 1. Load Composer Autoload
 * ------------------------------------------
 * - Tự động load toàn bộ class (Controller, Model...)
 * - Load thư viện ngoài (JWT, Dotenv, Spreadsheet...)
 */
require_once __DIR__ . '/../vendor/autoload.php';

use App\Core\Router;

/**
 * ------------------------------------------
 * 2. Cấu hình header chung cho API
 * ------------------------------------------
 * - Cho phép gọi API từ frontend (VueJS)
 * - Giao tiếp bằng JSON
 */
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

/**
 * ------------------------------------------
 * 3. Xử lý preflight request (CORS)
 * ------------------------------------------
 */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/**
 * ------------------------------------------
 * 4. Khởi tạo Router
 * ------------------------------------------
 * - Router chịu trách nhiệm mapping URL → Controller
 */
$router = new Router();

/**
 * ------------------------------------------
 * 5. Định nghĩa các API routes
 * ------------------------------------------
 * Format:
 *   HTTP_METHOD + URI → Controller@method
 */

/* ========= AUTH ========= */
$router->post('/api/login', 'AuthController@login');
$router->post('/api/logout', 'AuthController@logout');
$router->post('/api/users/accept', 'AuthController@accept');
$router->post('/api/users/reset-password', 'AuthController@resetPassword');

/* ========= USER ========= */
$router->get('/api/users', 'UserController@index');
$router->post('/api/users', 'UserController@store');
$router->delete('/api/users/{id}', 'UserController@softDelete');

/* ========= TEST / VSTEP ========= */
$router->post('/api/tests/upload', 'TestController@upload');
$router->get('/api/tests', 'TestController@index');

/* ======== COURSE ========= */
$router->get('/api/teacher/courses', 'CourseController@teacherCourses');
$router->post('/api/teacher/courses', 'CourseController@store');
$router->delete('/api/teacher/courses/{id}', 'CourseController@destroy');
$router->get('/api/teacher/courses/{id}', 'CourseController@show');
$router->put('/api/teacher/courses/{id}', 'CourseController@update');

/* ======== CATEGORY ======== */
$router->get('/api/teacher/categories', 'CategoryController@getCategory');


/**
 * ------------------------------------------
 * 6. Chạy Router
 * ------------------------------------------
 */
try {
    $router->run();
} catch (Throwable $e) {
    /**
     * --------------------------------------
     * 7. Bắt lỗi toàn cục
     * --------------------------------------
     * - Tránh lỗi trắng trang
     * - Trả lỗi JSON cho frontend
     */
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
