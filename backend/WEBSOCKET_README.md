# 🔌 WebSocket Implementation for Nam Thu Edu Test System

## 📋 Overview

Hệ thống WebSocket real-time cho platform thi trực tuyến, hỗ trợ 100+ users đồng thời với các tính năng:

- ⚡ Real-time answer saving
- 🔄 Auto-recovery sau cúp điện
- ⏰ Accurate time synchronization  
- 📊 Teacher monitoring dashboard
- 🚨 Connection quality monitoring

## 🚀 Phase Implementation

### Phase 1: Basic WebSocket Infrastructure ✅
- Laravel WebSocket server setup
- Basic broadcasting events
- Redis integration for session management
- Connection/disconnection handling

### Phase 2: Enhanced Features ✅  
- Real-time answer auto-save
- Connection quality monitoring
- Teacher dashboard with live statistics
- Auto-submit for expired/inactive tests
- Proactive recovery mechanisms

### Phase 3: Advanced Monitoring (Next)
- Detailed analytics dashboard
- Performance metrics
- Load balancing for 500+ users
- Advanced security features

## 🛠️ Installation & Setup

### Prerequisites
```bash
# Required software
- PHP 7.3+ / 8.0+
- Redis server
- MySQL/MariaDB
- Composer
```

### Quick Setup
```bash
# 1. Run setup script
chmod +x setup-websocket.sh
./setup-websocket.sh

# 2. Start services
php artisan serve                    # Laravel API (port 8000)
php artisan websocket:serve         # WebSocket server (port 6001)  
php artisan queue:work              # Background jobs
```

### Manual Setup
```bash
# Install dependencies
composer install

# Configure environment
cp .env.example .env
# Update .env with WebSocket settings

# Run migrations
php artisan migrate

# Start Redis
redis-server

# Start WebSocket server
php artisan websockets:serve --host=127.0.0.1 --port=6001
```

## 📡 WebSocket Endpoints

### Student Test Session
```javascript
// Connect to test session
const ws = new WebSocket('ws://localhost:6001/app/local-key');

// Subscribe to test session channel
ws.send(JSON.stringify({
    event: 'pusher:subscribe',
    data: {
        channel: 'private-test-session.123'
    }
}));
```

### API Endpoints
```
POST /api/student/websocket/connect      # Establish WebSocket connection
POST /api/student/websocket/answer       # Real-time answer saving
POST /api/student/websocket/reconnect    # Handle reconnection
POST /api/student/websocket/sync-time    # Time synchronization
```

### Teacher Monitoring
```
GET  /api/teacher/dashboard/active-sessions        # Live test sessions
GET  /api/teacher/dashboard/test-statistics/{id}   # Real-time stats
POST /api/teacher/dashboard/send-message           # Send message to student
GET  /api/teacher/dashboard/connection-logs/{id}   # Connection history
```

## 🎯 WebSocket Events

### Student Events
| Event | Description | Data |
|-------|-------------|------|
| `connected` | Student kết nối thành công | connection_quality |
| `disconnected` | Mất kết nối (cúp điện) | disconnected_at, duration |
| `reconnected` | Kết nối lại thành công | offline_duration, saved_answers |
| `answer_saved` | Câu trả lời được lưu | question_id, saved_at |
| `time_sync` | Đồng bộ thời gian | server_time, time_remaining |
| `auto_submit_warning` | Cảnh báo sắp hết thời gian | minutes_remaining |
| `teacher_message` | Tin nhắn từ giáo viên | message, teacher_name |

### Teacher Events  
| Event | Description | Data |
|-------|-------------|------|
| `student_connected` | Học viên bắt đầu thi | student_id, exam_title |
| `student_disconnected` | Học viên mất kết nối | student_id, duration |
| `student_reconnected` | Học viên kết nối lại | student_id, offline_duration |

## 🔧 Configuration

### Environment Variables
```env
# WebSocket Configuration
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=local-app-id
PUSHER_APP_KEY=local-key
PUSHER_APP_SECRET=local-secret
PUSHER_HOST=127.0.0.1
PUSHER_PORT=6001
PUSHER_SCHEME=http

# Redis Configuration  
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
```

### WebSocket Settings
```php
// config/websockets.php
'apps' => [
    [
        'id' => 'local-app-id',
        'name' => 'Nam Thu Edu',
        'key' => 'local-key',
        'secret' => 'local-secret',
        'capacity' => null, // Unlimited for 100+ users
        'enable_statistics' => true,
    ],
],
```

## 📊 Monitoring & Analytics

### WebSocket Dashboard
- URL: `http://localhost:8000/laravel-websockets`
- Real-time connection monitoring
- Message statistics
- Performance metrics

### Teacher Dashboard Features
- Live test session monitoring
- Connection status tracking  
- Real-time statistics
- Student communication
- Connection troubleshooting

## 🚨 Troubleshooting

### Common Issues

**1. WebSocket connection failed**
```bash
# Check Redis is running
redis-cli ping

# Check WebSocket server
php artisan websockets:serve --host=0.0.0.0 --port=6001

# Check firewall/ports
netstat -an | grep 6001
```

**2. Events not broadcasting**
```bash
# Clear config cache
php artisan config:clear

# Check queue worker
php artisan queue:work --verbose

# Check Redis connection
php artisan tinker
>>> Redis::ping()
```

**3. High memory usage**
```bash
# Monitor Redis memory
redis-cli info memory

# Clear old sessions
php artisan websockets:clean

# Optimize Redis config
redis-cli config set maxmemory 256mb
```

## 🔒 Security Considerations

### Authentication
- All WebSocket channels require authentication
- Private channels with user verification
- Token-based access control

### Rate Limiting
```php
// Prevent spam/abuse
'throttle:60,1' // 60 requests per minute per user
```

### Data Validation
- All WebSocket messages validated
- SQL injection prevention
- XSS protection

## 📈 Performance Optimization

### For 100+ Concurrent Users
```bash
# Redis optimization
redis-cli config set tcp-keepalive 60
redis-cli config set timeout 300

# PHP optimization  
memory_limit = 512M
max_execution_time = 300

# WebSocket optimization
pm.max_children = 50
pm.start_servers = 10
```

### Monitoring Commands
```bash
# Monitor active connections
php artisan websockets:statistics

# Check Redis usage
redis-cli info stats

# Monitor system resources
htop
```

## 🎯 Usage Examples

### Frontend Integration
```javascript
// Initialize WebSocket connection
class TestWebSocket {
    constructor(submissionId, token) {
        this.submissionId = submissionId;
        this.connect(token);
    }
    
    connect(token) {
        this.pusher = new Pusher('local-key', {
            wsHost: '127.0.0.1',
            wsPort: 6001,
            forceTLS: false,
            auth: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });
        
        this.channel = this.pusher.subscribe(`private-test-session.${this.submissionId}`);
        
        // Handle events
        this.channel.bind('test.session.event', (data) => {
            this.handleEvent(data);
        });
    }
    
    handleEvent(data) {
        switch(data.type) {
            case 'connected':
                console.log('✅ Kết nối thành công');
                break;
            case 'answer_saved':
                this.showSaveConfirmation(data.data.question_id);
                break;
            case 'time_sync':
                this.updateCountdown(data.data.time_remaining_minutes);
                break;
            case 'reconnected':
                this.restoreAnswers(data.data.saved_answers);
                break;
        }
    }
    
    saveAnswer(questionId, answerText) {
        fetch('/api/student/websocket/answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify({
                submission_id: this.submissionId,
                question_id: questionId,
                answer_text: answerText
            })
        });
    }
}
```

## 🎉 Success Metrics

### Target Performance (100+ Users)
- ✅ Connection latency: < 100ms
- ✅ Message delivery: < 50ms  
- ✅ Memory usage: < 512MB
- ✅ CPU usage: < 70%
- ✅ Uptime: 99.9%

### Features Delivered
- ✅ Real-time answer auto-save
- ✅ Instant disconnect detection
- ✅ Seamless reconnection after power outage
- ✅ Accurate server time sync
- ✅ Teacher monitoring dashboard
- ✅ Connection quality analytics

## 🚀 Next Steps (Phase 3)

1. **Load Balancing**: Support 500+ concurrent users
2. **Advanced Analytics**: Detailed performance metrics
3. **Mobile Optimization**: PWA support
4. **AI Monitoring**: Suspicious activity detection
5. **Clustering**: Multi-server deployment

---

**🎯 Ready for production with 100+ concurrent users!**

For support: [GitHub Issues](https://github.com/namthuedu/websocket-issues)