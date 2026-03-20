<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hướng dẫn sử dụng API - NamThu Education</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; }
        .step { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .code { background: #333; color: #fff; padding: 10px; border-radius: 3px; font-family: monospace; }
        .success { color: #28a745; }
        .warning { color: #ffc107; }
        .error { color: #dc3545; }
        .btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 3px; cursor: pointer; }
        .btn:hover { background: #0056b3; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Hướng dẫn sử dụng NamThu Education API</h1>
        
        <div class="step">
            <h2>📋 Bước 1: Truy cập API Documentation</h2>
            <p>Mở Swagger UI tại: <a href="/docs" target="_blank">http://localhost:8000/docs</a></p>
        </div>

        <div class="step">
            <h2>🔐 Bước 2: Lấy Authentication Token</h2>
            <p>Để test các API endpoints cần authentication, bạn cần login trước:</p>
            
            <h3>2.1. Login để lấy token:</h3>
            <div class="code">
POST /api/login
Content-Type: application/json

{
    "uPhone": "0123456789",
    "uPassword": "password123"
}
            </div>
            
            <h3>2.2. Response sẽ trả về token:</h3>
            <div class="code">
{
    "status": "success",
    "message": "Login successful",
    "data": {
        "user": {...},
        "token": "1|abcdef123456...",
        "refresh_token": "..."
    }
}
            </div>
        </div>

        <div class="step">
            <h2>🔧 Bước 3: Sử dụng Token trong Swagger UI</h2>
            <ol>
                <li>Copy token từ response login (phần sau dấu |)</li>
                <li>Trong Swagger UI, tìm ô "Enter Bearer Token" ở góc trên</li>
                <li>Paste token vào và click "Set Token"</li>
                <li>Bây giờ bạn có thể test tất cả API endpoints!</li>
            </ol>
        </div>

        <div class="step">
            <h2>✅ Bước 4: Test API Endpoints</h2>
            
            <h3>🌐 Public Endpoints (không cần token):</h3>
            <ul>
                <li><code>GET /api/test</code> - Test API hoạt động</li>
                <li><code>GET /api/health</code> - Health check</li>
                <li><code>GET /api/categories</code> - Danh sách categories</li>
                <li><code>POST /api/login</code> - Đăng nhập</li>
            </ul>

            <h3>🔒 Protected Endpoints (cần token):</h3>
            <ul>
                <li><code>GET /api/teacher/students</code> - Danh sách học sinh</li>
                <li><code>GET /api/teacher/courses</code> - Danh sách khóa học</li>
                <li><code>GET /api/teacher/exams</code> - Danh sách bài thi</li>
                <li><code>POST /api/logout</code> - Đăng xuất</li>
            </ul>
        </div>

        <div class="step">
            <h2>🛠️ Bước 5: Test với cURL</h2>
            
            <h3>Test endpoint public:</h3>
            <div class="code">
curl -X GET "http://localhost:8000/api/health" \
     -H "Accept: application/json"
            </div>

            <h3>Test endpoint với authentication:</h3>
            <div class="code">
curl -X GET "http://localhost:8000/api/teacher/students" \
     -H "Accept: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
            </div>
        </div>

        <div class="step">
            <h2>⚠️ Lưu ý quan trọng</h2>
            <ul>
                <li class="warning">Token có thời hạn, cần refresh khi hết hạn</li>
                <li class="warning">Một số endpoint yêu cầu role cụ thể (teacher, admin, student)</li>
                <li class="success">CORS đã được cấu hình cho development</li>
                <li class="success">Rate limiting: 60 requests/minute cho API</li>
            </ul>
        </div>

        <div class="step">
            <h2>🔗 Links hữu ích</h2>
            <ul>
                <li><a href="/docs">📖 API Documentation (Swagger UI)</a></li>
                <li><a href="/api-docs.json">📄 OpenAPI JSON Schema</a></li>
                <li><a href="/api/test">🧪 Test API Status</a></li>
                <li><a href="/api/health">💚 Health Check</a></li>
            </ul>
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <button class="btn" onclick="window.open('/docs', '_blank')">
                🚀 Mở Swagger UI
            </button>
        </div>
    </div>
</body>
</html>