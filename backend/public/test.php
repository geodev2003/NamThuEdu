<?php
header('Content-Type: application/json');
echo json_encode([
    'status' => 'success',
    'message' => 'NamThu Education API Server is running!',
    'version' => '1.0.0',
    'timestamp' => date('c'),
    'php_version' => phpversion(),
    'documentation' => 'http://localhost:8000/docs'
]);
?>