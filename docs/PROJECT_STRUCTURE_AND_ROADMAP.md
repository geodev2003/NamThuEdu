# Cấu Trúc Dự Án & Roadmap - Nam Thu Edu

## 📁 Cấu Trúc Dự Án Hiện Tại

```
NamThuEdu/
├── backend/                    # ✅ Laravel 8 Backend (MỚI)
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/   # 5 controllers đã hoàn thành
│   │   │   │   ├── AuthController.php      ✅
│   │   │   │   ├── CourseController.php    ✅
│   │   │   │   ├── UserController.php      ✅
│   │   │   │   ├── BlogController.php      ✅
│   │   │   │   └── CategoryController.php  ✅
│   │   │   └── Middleware/
│   │   │       └── CheckRole.php           ✅
│   │   └── Models/
│   │       ├── User.php                    ✅
│   │       ├── Course.php                  ✅
│   │       ├── Post.php                    ✅
│   │       ├── Category.php                ✅
│   │       └── OtpLog.php                  ✅
│   ├── database/
│   │   ├── migrations/                     ✅ 5 tables
│   │   └── seeders/                        ✅ Sample data
│   ├── routes/
│   │   └── api.php                         ✅ 19 endpoints
│   └── .env                                ✅ Config
│
├── backend-php-old/            # 🗄️ PHP Vanilla Backend (CŨ - Backup)
│   └── [archived]
│
├── frontend/                   # 🎨 VueJS Frontend
│   ├── src/
│   │   ├── views/             # Pages
│   │   ├── components/        # UI Components
│   │   ├── router/            # Vue Router
│   │   ├── api/               # API calls
│   │   └── tools/             # Utilities
│   └── package.json
│
├── docs/                       # 📚 Documentation
│   ├── API_DOCUMENTATION.md           ✅
│   ├── FRAMEWORK_COMPARISON.md        ✅
│   ├── BACKEND_COMPARISON.md          ✅
│   └── PROJECT_STRUCTURE_AND_ROADMAP.md (file này)
│
├── .kiro/                      # 🤖 Kiro Specs
│   └── specs/
│       └── prisma-orm-integration/  ❌ (Không cần - đã hủy)
│
├── database.sql                # 💾 Database Schema
└── README.md                   # 📖 Project Overview
```

---

## ✅ Đã Hoàn Thành

### 1. Backend Migration (100%)
- ✅ Migrate từ PHP vanilla sang Laravel 8
- ✅ 19 API endpoints hoạt động đầy đủ
- ✅ Authentication với Sanctum
- ✅ Role-based access control
- ✅ Soft delete functionality
- ✅ OTP system
- ✅ Rate limiting
- ✅ Database migrations & seeders

### 2. Documentation (100%)
- ✅ API Documentation
- ✅ Framework Comparison
- ✅ Backend Comparison
- ✅ Setup Instructions

---

## 🎯 Cần Làm Tiếp Theo

### Phase 1: Backend - Student & Admin APIs (Ưu tiên cao)

#### 1.1 Student APIs (Chưa có)
```php
// Cần implement trong backend/app/Http/Controllers/StudentController.php
```

**Endpoints cần tạo:**

| Endpoint | Method | Chức năng | Priority |
|----------|--------|-----------|----------|
| `/api/student/courses` | GET | Xem khóa học đã đăng ký | 🔴 HIGH |
| `/api/student/profile` | GET | Xem thông tin cá nhân | 🔴 HIGH |
| `/api/student/profile` | PUT | Cập nhật thông tin | 🟡 MEDIUM |
| `/api/student/tests` | GET | Xem danh sách bài test | 🔴 HIGH |
| `/api/student/tests/{id}` | GET | Làm bài test | 🔴 HIGH |
| `/api/student/tests/{id}/submit` | POST | Nộp bài test | 🔴 HIGH |
| `/api/student/history` | GET | Lịch sử làm bài | 🟡 MEDIUM |
| `/api/student/blogs` | GET | Xem bài viết/blog | 🟢 LOW |

#### 1.2 Admin APIs (Chưa có)
```php
// Cần implement trong backend/app/Http/Controllers/AdminController.php
```

**Endpoints cần tạo:**

| Endpoint | Method | Chức năng | Priority |
|----------|--------|-----------|----------|
| `/api/admin/users` | GET | Quản lý tất cả users | 🔴 HIGH |
| `/api/admin/users/{id}` | PUT | Cập nhật user | 🔴 HIGH |
| `/api/admin/users/{id}` | DELETE | Xóa user | 🔴 HIGH |
| `/api/admin/teachers` | GET | Quản lý teachers | 🟡 MEDIUM |
| `/api/admin/teachers/{id}/approve` | POST | Phê duyệt teacher | 🟡 MEDIUM |
| `/api/admin/categories` | POST | Tạo category | 🟡 MEDIUM |
| `/api/admin/categories/{id}` | PUT | Sửa category | 🟡 MEDIUM |
| `/api/admin/categories/{id}` | DELETE | Xóa category | 🟡 MEDIUM |
| `/api/admin/statistics` | GET | Thống kê hệ thống | 🟢 LOW |

---

### Phase 2: Test Management System (Chức năng chính)

#### 2.1 Test CRUD APIs
```php
// Cần implement trong backend/app/Http/Controllers/TestController.php
```

**Endpoints cần tạo:**

| Endpoint | Method | Chức năng | Priority |
|----------|--------|-----------|----------|
| `/api/teacher/tests` | GET | Danh sách bài test | 🔴 HIGH |
| `/api/teacher/tests` | POST | Tạo bài test mới | 🔴 HIGH |
| `/api/teacher/tests/{id}` | GET | Chi tiết bài test | 🔴 HIGH |
| `/api/teacher/tests/{id}` | PUT | Cập nhật bài test | 🔴 HIGH |
| `/api/teacher/tests/{id}` | DELETE | Xóa bài test | 🔴 HIGH |
| `/api/teacher/tests/{id}/assign` | POST | Giao bài test | 🔴 HIGH |
| `/api/teacher/tests/{id}/submissions` | GET | Xem bài làm của học viên | 🔴 HIGH |
| `/api/teacher/tests/upload` | POST | Upload file test (Excel/Word) | 🟡 MEDIUM |

#### 2.2 Test Models & Database
```sql
-- Cần tạo migrations cho:
tests (
  tId BIGINT PRIMARY KEY,
  tName VARCHAR(255),
  tType ENUM('listening', 'reading', 'writing', 'speaking'),
  tDuration INT,
  tStatus ENUM('private', 'public'),
  tTeacherId BIGINT,
  tCreated_at TIMESTAMP,
  tDeleted_at TIMESTAMP
)

test_questions (
  qId BIGINT PRIMARY KEY,
  qTestId BIGINT,
  qContent TEXT,
  qType VARCHAR(50),
  qOrder INT,
  qPoints INT
)

test_answers (
  aId BIGINT PRIMARY KEY,
  aQuestionId BIGINT,
  aContent TEXT,
  aIsCorrect BOOLEAN
)

test_submissions (
  sId BIGINT PRIMARY KEY,
  sTestId BIGINT,
  sStudentId BIGINT,
  sScore DECIMAL(5,2),
  sSubmitted_at TIMESTAMP
)

test_assignments (
  asId BIGINT PRIMARY KEY,
  asTestId BIGINT,
  asClassId BIGINT,
  asStudentId BIGINT,
  asDeadline DATETIME,
  asAttempts INT
)
```

---

### Phase 3: File Upload & Processing

#### 3.1 File Upload System
```php
// Cần implement trong backend/app/Http/Controllers/FileController.php
```

**Chức năng:**
- Upload audio files (Listening)
- Upload images
- Upload Excel/CSV (Test import)
- Upload Word documents
- File validation & security

**Storage:**
```
backend/storage/app/
├── public/
│   ├── audio/          # Listening audio files
│   ├── images/         # Blog images, thumbnails
│   └── documents/      # Uploaded test files
```

#### 3.2 Excel/Word Parser
```php
// Cần implement trong backend/app/Services/FileParserService.php
```

**Chức năng:**
- Parse Excel/CSV để tạo test
- Parse Word document để tạo test
- Validate file format
- Extract questions & answers

---

### Phase 4: AI Integration (Gemini API)

#### 4.1 Writing Assessment
```php
// Cần implement trong backend/app/Services/GeminiService.php
```

**Chức năng:**
- Gọi Gemini API để chấm bài Writing
- Parse JSON response
- Lưu feedback vào database
- Rate limiting cho API calls

**Endpoint:**
```
POST /api/teacher/tests/{id}/grade-writing
POST /api/student/tests/{id}/check-writing
```

---

### Phase 5: Notification System

#### 5.1 Notification APIs
```php
// Cần implement trong backend/app/Http/Controllers/NotificationController.php
```

**Endpoints:**

| Endpoint | Method | Chức năng |
|----------|--------|-----------|
| `/api/notifications` | GET | Lấy danh sách thông báo |
| `/api/notifications/{id}/read` | PUT | Đánh dấu đã đọc |
| `/api/notifications/read-all` | PUT | Đánh dấu tất cả đã đọc |

**Database:**
```sql
notifications (
  nId BIGINT PRIMARY KEY,
  nUserId BIGINT,
  nType VARCHAR(50),
  nTitle VARCHAR(255),
  nContent TEXT,
  nIsRead BOOLEAN,
  nCreated_at TIMESTAMP
)
```

---

### Phase 6: Vocabulary Learning System

#### 6.1 Vocabulary APIs
```php
// Cần implement trong backend/app/Http/Controllers/VocabularyController.php
```

**Endpoints:**

| Endpoint | Method | Chức năng |
|----------|--------|-----------|
| `/api/vocabulary/sets` | GET | Danh sách bộ từ vựng |
| `/api/vocabulary/sets/{id}` | GET | Chi tiết bộ từ vựng |
| `/api/vocabulary/sets/{id}/learn` | POST | Học từ vựng |
| `/api/vocabulary/sets/{id}/review` | GET | Ôn tập |

**Database:**
```sql
vocabulary_sets (
  vsId BIGINT PRIMARY KEY,
  vsName VARCHAR(255),
  vsDescription TEXT,
  vsCreated_at TIMESTAMP
)

vocabulary_words (
  vwId BIGINT PRIMARY KEY,
  vwSetId BIGINT,
  vwWord VARCHAR(100),
  vwMeaning TEXT,
  vwExample TEXT,
  vwAudio VARCHAR(255)
)

user_vocabulary_progress (
  uvpId BIGINT PRIMARY KEY,
  uvpUserId BIGINT,
  uvpWordId BIGINT,
  uvpLevel INT,
  uvpLastReview TIMESTAMP
)
```

---

### Phase 7: Security & Performance

#### 7.1 Security Enhancements
- [ ] Implement CORS properly (restrict origins)
- [ ] Add request validation middleware
- [ ] Implement API rate limiting per user
- [ ] Add SQL injection protection (Eloquent đã có)
- [ ] Add XSS protection
- [ ] Implement file upload security
- [ ] Add audit logging

#### 7.2 Performance Optimization
- [ ] Add database indexing
- [ ] Implement caching (Redis)
- [ ] Optimize N+1 queries
- [ ] Add pagination to all list endpoints
- [ ] Implement lazy loading
- [ ] Add query optimization

---

### Phase 8: Testing & Quality Assurance

#### 8.1 Backend Testing
```php
// Cần tạo tests trong backend/tests/Feature/
```

**Test Coverage:**
- [ ] Authentication tests
- [ ] Course management tests
- [ ] Student management tests
- [ ] Blog management tests
- [ ] Test management tests
- [ ] File upload tests
- [ ] API integration tests

#### 8.2 API Documentation
- [ ] Generate Swagger/OpenAPI documentation
- [ ] Add Postman collection
- [ ] Create API testing guide

---

### Phase 9: Deployment & DevOps

#### 9.1 Environment Setup
- [ ] Setup production environment
- [ ] Configure production database
- [ ] Setup SSL certificate
- [ ] Configure domain & DNS

#### 9.2 CI/CD Pipeline
- [ ] Setup GitHub Actions
- [ ] Automated testing
- [ ] Automated deployment
- [ ] Database backup strategy

#### 9.3 Monitoring
- [ ] Setup error logging (Sentry)
- [ ] Setup performance monitoring
- [ ] Setup uptime monitoring
- [ ] Setup database monitoring

---

## 📊 Priority Matrix

### 🔴 HIGH Priority (Làm ngay)
1. **Student APIs** - Học viên cần làm bài test
2. **Test Management System** - Core feature
3. **File Upload** - Cần cho test management
4. **Admin APIs** - Quản lý hệ thống

### 🟡 MEDIUM Priority (Làm sau)
5. **AI Integration (Gemini)** - Chấm bài Writing
6. **Notification System** - Thông báo cho users
7. **Vocabulary System** - Học từ vựng

### 🟢 LOW Priority (Có thể làm sau)
8. **Statistics & Reports** - Báo cáo thống kê
9. **Advanced Features** - Game, flashcard, etc.

---

## 🗓️ Timeline Đề Xuất

### Sprint 1 (Week 1-2): Student & Admin APIs
- Implement Student APIs (8 endpoints)
- Implement Admin APIs (9 endpoints)
- Testing & documentation

### Sprint 2 (Week 3-4): Test Management System
- Database design & migrations
- Test CRUD APIs (8 endpoints)
- Test assignment logic
- Testing & documentation

### Sprint 3 (Week 5-6): File Upload & Processing
- File upload system
- Excel/Word parser
- Audio file handling
- Testing & documentation

### Sprint 4 (Week 7-8): AI Integration
- Gemini API integration
- Writing assessment
- Feedback system
- Testing & documentation

### Sprint 5 (Week 9-10): Notification & Vocabulary
- Notification system
- Vocabulary APIs
- Testing & documentation

### Sprint 6 (Week 11-12): Security, Testing & Deployment
- Security enhancements
- Performance optimization
- Full testing
- Production deployment

---

## 🛠️ Tech Stack Summary

### Backend
- **Framework**: Laravel 8
- **Authentication**: Laravel Sanctum
- **ORM**: Eloquent
- **Database**: MySQL 5.7+
- **PHP**: 7.4+
- **File Processing**: PhpSpreadsheet, PhpWord
- **AI**: Gemini API

### Frontend
- **Framework**: Vue.js 3
- **Router**: Vue Router
- **HTTP Client**: Axios
- **Build Tool**: Vite

### DevOps
- **Version Control**: Git
- **CI/CD**: GitHub Actions (planned)
- **Monitoring**: Sentry (planned)
- **Hosting**: TBD

---

## 📝 Next Steps (Immediate Actions)

1. **Xóa Prisma Spec** (không cần thiết)
   ```bash
   rm -rf .kiro/specs/prisma-orm-integration
   ```

2. **Tạo Student APIs Spec**
   - Create requirements document
   - Design API endpoints
   - Plan database changes

3. **Tạo Test Management Spec**
   - Design database schema
   - Plan API endpoints
   - Design file upload flow

4. **Setup Development Environment**
   - Configure local database
   - Test all existing APIs
   - Prepare for new development

---

**Last Updated**: 2026-03-18  
**Status**: ✅ Backend Migration Complete, Ready for Phase 1
