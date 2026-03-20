<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('l5-swagger.documentations.default.api.title', 'NamThu Education API') }}</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui.css" />
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin:0;
            background: #fafafa;
        }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>

    <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: '/api-docs.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                tryItOutEnabled: true,
                requestInterceptor: function(request) {
                    // Thêm headers cần thiết
                    request.headers['Accept'] = 'application/json';
                    if (request.method !== 'GET') {
                        request.headers['Content-Type'] = 'application/json';
                    }
                    
                    // Thêm Authorization header nếu có token
                    const token = localStorage.getItem('api_token');
                    if (token) {
                        request.headers['Authorization'] = 'Bearer ' + token;
                    }
                    
                    // Thêm Origin header cho CORS
                    request.headers['Origin'] = window.location.origin;
                    
                    console.log('Request headers:', request.headers);
                    return request;
                },
                responseInterceptor: function(response) {
                    console.log('Response:', response);
                    return response;
                },
                onComplete: function() {
                    console.log('Swagger UI loaded successfully');
                }
            });

            // Thêm UI để nhập token
            setTimeout(function() {
                const wrapper = document.querySelector('.swagger-ui');
                if (wrapper && !document.getElementById('token-section')) {
                    const tokenSection = document.createElement('div');
                    tokenSection.id = 'token-section';
                    tokenSection.innerHTML = `
                        <div style="background: #f7f7f7; padding: 15px; margin: 20px 0; border-radius: 5px; border: 1px solid #ddd;">
                            <h3 style="margin: 0 0 10px 0; color: #3b4151;">🔐 Authentication</h3>
                            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                                <input type="text" id="api-token" placeholder="Nhập Bearer Token (không cần 'Bearer ')" 
                                       style="padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; flex: 1; min-width: 300px;" />
                                <button onclick="setApiToken()" style="padding: 8px 16px; background: #4990e2; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                    Lưu Token
                                </button>
                                <button onclick="clearApiToken()" style="padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                    Xóa Token
                                </button>
                                <button onclick="testLogin()" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                    Test Login
                                </button>
                            </div>
                            <div style="margin-top: 10px; font-size: 12px; color: #666;">
                                💡 Để test API cần authentication, hãy login trước bằng endpoint <code>POST /api/login</code> với <code>{"phone": "0123456789", "password": "password123"}</code>
                            </div>
                        </div>
                    `;
                    wrapper.insertBefore(tokenSection, wrapper.firstChild);
                }
            }, 1000);

            window.setApiToken = function() {
                const token = document.getElementById('api-token').value.trim();
                if (token) {
                    localStorage.setItem('api_token', token);
                    alert('✅ Token đã được lưu! Bây giờ bạn có thể test các API endpoints cần authentication.');
                } else {
                    alert('❌ Vui lòng nhập token!');
                }
            };

            window.clearApiToken = function() {
                localStorage.removeItem('api_token');
                document.getElementById('api-token').value = '';
                alert('🗑️ Token đã được xóa!');
            };

            window.testLogin = function() {
                fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        phone: '0123456789',
                        password: 'password123'
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        const token = data.data.access_token;
                        localStorage.setItem('api_token', token);
                        document.getElementById('api-token').value = token;
                        alert('✅ Login thành công! Token đã được tự động lưu.');
                    } else {
                        alert('❌ Login thất bại: ' + data.message);
                    }
                })
                .catch(error => {
                    alert('❌ Lỗi kết nối: ' + error.message);
                });
            };

            // Load token từ localStorage nếu có
            setTimeout(function() {
                const savedToken = localStorage.getItem('api_token');
                if (savedToken) {
                    const tokenInput = document.getElementById('api-token');
                    if (tokenInput) {
                        tokenInput.value = savedToken;
                    }
                }
            }, 1500);
        };
    </script>
</body>
</html>