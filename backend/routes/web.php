<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    try {
        return response()->json([
            'status' => 'success',
            'message' => 'NamThu Education API is running!',
            'version' => '1.0.0',
            'documentation' => [
                'swagger_ui' => url('/docs'),
                'api_guide' => url('/api-guide'),
                'json_schema' => url('/api-docs.json')
            ],
            'public_endpoints' => [
                'health_check' => url('/api/health'),
                'test_api' => url('/api/test'),
                'categories' => url('/api/categories'),
                'login' => url('/api/login')
            ],
            'timestamp' => date('c')
        ]);
    } catch (Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Server error: ' . $e->getMessage()
        ], 500);
    }
});

// Swagger Documentation với minimal CSS
Route::get('/docs', function () {
    return response(view('docs'))
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
});

// API Guide
Route::get('/api-guide', function () {
    return view('api-guide');
});

// Serve API docs JSON với CORS headers
Route::get('/api-docs.json', function () {
    $filePath = public_path('api-docs.json');
    if (file_exists($filePath)) {
        $content = file_get_contents($filePath);
        return response($content, 200, [
            'Content-Type' => 'application/json',
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With',
        ]);
    }
    return response()->json(['error' => 'API documentation not found'], 404);
});

Route::get('/swagger', function () {
    return redirect('/docs');
});

// Test routes
Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Laravel server is running!',
        'timestamp' => now()->toISOString(),
        'php_version' => phpversion(),
        'laravel_version' => app()->version()
    ]);
});

Route::get('/docs-test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API Documentation is available at /docs',
        'swagger_ui' => url('/docs'),
        'json_schema' => url('/docs/api-docs.json')
    ]);
});
