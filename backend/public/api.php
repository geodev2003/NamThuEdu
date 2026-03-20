<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '/';

// Simple routing
switch ($path) {
    case '/':
    case '/status':
        echo json_encode([
            'status' => 'success',
            'message' => 'NamThu Education API is running!',
            'version' => '1.0.0',
            'timestamp' => date('c'),
            'endpoints' => [
                'GET /api.php/status' => 'API status',
                'GET /docs' => 'Swagger documentation',
                'POST /api.php/login' => 'User login (demo)',
            ]
        ]);
        break;
        
    case '/login':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            echo json_encode([
                'status' => 'success',
                'message' => 'Login demo endpoint',
                'data' => [
                    'token' => 'demo_token_' . time(),
                    'user' => [
                        'id' => 1,
                        'name' => 'Demo User',
                        'role' => 'student'
                    ]
                ]
            ]);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Endpoint not found',
            'available_endpoints' => [
                '/api.php/status',
                '/api.php/login',
                '/docs'
            ]
        ]);
}
?>