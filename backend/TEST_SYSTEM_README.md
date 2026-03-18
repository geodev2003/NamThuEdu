# Test System APIs - Hướng Dẫn Sử Dụng

## 📋 Tổng Quan

Test System APIs cung cấp đầy đủ chức năng quản lý bài thi, câu hỏi, phân công bài thi, và chấm điểm cho nền tảng Nam Thu Edu.

### ✅ Đã Hoàn Thành

- ✅ 8 Models với relationships đầy đủ
- ✅ 8 Migrations cho Test System tables
- ✅ 5 Controllers với 26 API endpoints
- ✅ Routes configuration
- ✅ Test data seeder
- ✅ Auto-grading algorithm
- ✅ Validation và error handling

---

## 🚀 Cài Đặt & Chạy

### 1. Chạy Migrations

```bash
cd backend
php artisan migrate
```

### 2. Seed Test Data (Optional)

```bash
php artisan db:seed --class=TestSystemSeeder
```

Seeder sẽ tạo:
- 1 Teacher: `0987654321` / `teacher123`
- 5 Students: `0900000001-0900000005` / `student123`
- 1 Class với 5 students enrolled
- 1 Exam với 5 questions
- 1 Test assignment cho class

### 3. Khởi Động Server

```bash
php artisan serve
```

Server sẽ chạy tại: `http://localhost:8000`

---

## 📚 API Endpoints

### Teacher APIs (19 endpoints)

#### Class Management (6 endpoints)

```http
GET    /api/teacher/classes              # Lấy danh sách lớp
POST   /api/teacher/classes              # Tạo lớp mới
GET    /api/teacher/classes/{id}         # Chi tiết lớp
PUT    /api/teacher/classes/{id}         # Cập nhật lớp
DELETE /api/teacher/classes/{id}         # Xóa lớp
POST   /api/teacher/classes/{id}/enroll  # Ghi danh học viên
```

#### Exam Management (8 endpoints)

```http
GET    /api/teacher/exams                           # Lấy danh sách bài thi
POST   /api/teacher/exams                           # Tạo bài thi mới
GET    /api/teacher/exams/{id}                      # Chi tiết bài thi
PUT    /api/teacher/exams/{id}                      # Cập nhật bài thi
DELETE /api/teacher/exams/{id}                      # Xóa bài thi
POST   /api/teacher/exams/{id}/questions            # Thêm câu hỏi
PUT    /api/teacher/exams/{id}/questions/{qid}      # Cập nhật câu hỏi
DELETE /api/teacher/exams/{id}/questions/{qid}      # Xóa câu hỏi
```

#### Test Assignment (3 endpoints)

```http
POST   /api/teacher/exams/{id}/assign    # Gán bài thi
GET    /api/teacher/assignments          # Danh sách phân công
DELETE /api/teacher/assignments/{id}     # Xóa phân công
```

#### Grading (3 endpoints)

```http
GET    /api/teacher/submissions          # Danh sách bài làm
GET    /api/teacher/submissions/{id}     # Chi tiết bài làm
POST   /api/teacher/submissions/{id}/grade  # Chấm điểm
```

### Student APIs (7 endpoints)

#### Test Taking (5 endpoints)

```http
GET    /api/student/tests                    # Danh sách bài thi được gán
GET    /api/student/tests/{id}               # Chi tiết bài thi
POST   /api/student/tests/{id}/start         # Bắt đầu làm bài
POST   /api/student/tests/{sid}/answer       # Lưu câu trả lời
POST   /api/student/tests/{sid}/submit       # Nộp bài
```

#### Submission History (2 endpoints)

```http
GET    /api/student/submissions             # Lịch sử bài làm
GET    /api/student/submissions/{id}        # Chi tiết bài làm
```

---

## 🔐 Authentication

Tất cả endpoints yêu cầu Bearer token trong header:

```http
Authorization: Bearer {access_token}
```

### Lấy Token

```http
POST /api/login
Content-Type: application/json

{
  "phone": "0987654321",
  "password": "teacher123"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "access_token": "1|xxxxx...",
    "user": {
      "uId": 1,
      "uName": "Giáo Viên Test",
      "uRole": "teacher"
    }
  }
}
```

---

## 📖 Ví Dụ Sử Dụng

### 1. Teacher Tạo Bài Thi

```http
POST /api/teacher/exams
Authorization: Bearer {teacher_token}
Content-Type: application/json

{
  "eTitle": "IELTS Reading Practice Test 1",
  "eDescription": "Bài thi thử IELTS Reading",
  "eType": "IELTS",
  "eSkill": "reading",
  "eDuration_minutes": 60,
  "eIs_private": false,
  "eSource_type": "manual"
}
```

### 2. Teacher Thêm Câu Hỏi

```http
POST /api/teacher/exams/1/questions
Authorization: Bearer {teacher_token}
Content-Type: application/json

{
  "questions": [
    {
      "qContent": "What is the main idea?",
      "qPoints": 10,
      "answers": [
        {"aContent": "Answer A", "aIs_correct": true},
        {"aContent": "Answer B", "aIs_correct": false},
        {"aContent": "Answer C", "aIs_correct": false},
        {"aContent": "Answer D", "aIs_correct": false}
      ]
    }
  ]
}
```

### 3. Teacher Gán Bài Thi Cho Lớp

```http
POST /api/teacher/exams/1/assign
Authorization: Bearer {teacher_token}
Content-Type: application/json

{
  "taTarget_type": "class",
  "taTarget_id": 1,
  "taDeadline": "2026-12-31 23:59:59",
  "taMax_attempt": 2,
  "taIs_public": true
}
```

### 4. Student Xem Bài Thi Được Gán

```http
GET /api/student/tests
Authorization: Bearer {student_token}
```

### 5. Student Bắt Đầu Làm Bài

```http
POST /api/student/tests/1/start
Authorization: Bearer {student_token}
```

### 6. Student Trả Lời Câu Hỏi

```http
POST /api/student/tests/1/answer
Authorization: Bearer {student_token}
Content-Type: application/json

{
  "question_id": 1,
  "saAnswer_text": "Answer A"
}
```

### 7. Student Nộp Bài

```http
POST /api/student/tests/1/submit
Authorization: Bearer {student_token}
```

### 8. Teacher Xem Bài Làm

```http
GET /api/teacher/submissions?exam_id=1
Authorization: Bearer {teacher_token}
```

### 9. Teacher Chấm Điểm

```http
POST /api/teacher/submissions/1/grade
Authorization: Bearer {teacher_token}
Content-Type: application/json

{
  "sTeacher_feedback": "Good work! Keep practicing.",
  "questionScores": [
    {"question_id": 1, "saPoints_awarded": 10},
    {"question_id": 2, "saPoints_awarded": 3}
  ]
}
```

---

## 🎯 Tính Năng Chính

### 1. Class Management
- Tạo và quản lý lớp học
- Ghi danh học viên vào lớp (đơn lẻ hoặc hàng loạt)
- Xem danh sách học viên trong lớp

### 2. Exam Management
- Tạo bài thi với metadata (type, skill, duration)
- Thêm câu hỏi với nhiều đáp án
- Cập nhật và xóa câu hỏi
- Hỗ trợ 4 loại bài thi: VSTEP, IELTS, TOEIC, GENERAL
- Hỗ trợ 4 kỹ năng: listening, reading, writing, speaking

### 3. Test Assignment
- Gán bài thi cho lớp hoặc học viên cụ thể
- Đặt deadline và giới hạn số lần làm bài
- Cấu hình public/private visibility

### 4. Test Taking
- Học viên xem bài thi được gán
- Bắt đầu làm bài (tạo submission)
- Lưu câu trả lời từng câu
- Nộp bài khi hoàn thành

### 5. Auto-Grading
- Tự động chấm điểm câu trắc nghiệm
- Tính điểm phần trăm dựa trên tổng điểm
- Lưu kết quả chi tiết từng câu

### 6. Manual Grading
- Teacher xem danh sách bài làm
- Xem chi tiết câu trả lời của học viên
- Chấm điểm thủ công (cho câu tự luận)
- Thêm feedback cho học viên

### 7. Submission History
- Học viên xem lịch sử bài làm
- Xem điểm số và feedback
- Xem đáp án đúng sau khi nộp bài

---

## 🔒 Phân Quyền

### Teacher Role
- Quản lý lớp học và học viên
- Tạo và quản lý bài thi
- Gán bài thi cho lớp/học viên
- Xem và chấm điểm bài làm
- Thêm feedback cho học viên

### Student Role
- Xem bài thi được gán
- Làm bài thi trong thời gian cho phép
- Xem lịch sử bài làm và điểm số
- Xem feedback từ giáo viên

---

## ✅ Validation Rules

### Exam Creation
- `eTitle`: required, max 255 characters
- `eType`: required, enum (VSTEP, IELTS, TOEIC, GENERAL)
- `eSkill`: required, enum (listening, reading, writing, speaking)
- `eDuration_minutes`: required, integer, min 1

### Question Creation
- `qContent`: required, string
- `qPoints`: required, integer, min 0
- `answers`: required, array, min 1 answer
- At least one answer must have `aIs_correct = true`

### Test Assignment
- `taTarget_type`: required, enum (class, student)
- `taTarget_id`: required, must exist in target table
- `taDeadline`: optional, must be future date
- `taMax_attempt`: optional, integer, min 1, default 1

### Test Submission
- All questions must be answered before submit
- Submission must be in 'in_progress' status
- Cannot exceed max attempt limit
- Cannot submit after deadline

---

## 🐛 Error Handling

### Common Error Responses

**401 Unauthorized**
```json
{
  "status": "error",
  "message": "Bạn không có quyền truy cập."
}
```

**404 Not Found**
```json
{
  "status": "error",
  "message": "Không tìm thấy bài thi."
}
```

**400 Bad Request**
```json
{
  "status": "error",
  "message": "Dữ liệu không hợp lệ.",
  "errors": {
    "eTitle": ["The eTitle field is required."]
  }
}
```

**403 Forbidden**
```json
{
  "status": "error",
  "message": "Bạn đã hết số lần làm bài cho bài thi này."
}
```

---

## 📊 Database Schema

### Tables
1. `classes` - Lớp học
2. `class_enrollments` - Ghi danh học viên
3. `exams` - Bài thi
4. `questions` - Câu hỏi
5. `answers` - Đáp án
6. `test_assignments` - Phân công bài thi
7. `submissions` - Bài làm
8. `submission_answers` - Câu trả lời

### Relationships
- Classes belongsTo Teacher (User)
- Classes belongsToMany Students (User) through ClassEnrollment
- Exam belongsTo Teacher (User)
- Exam hasMany Questions
- Question hasMany Answers
- TestAssignment belongsTo Exam
- Submission belongsTo User, Exam, TestAssignment
- Submission hasMany SubmissionAnswers

---

## 🧪 Testing

### Manual Testing với Postman

1. Import collection từ `docs/API_DOCUMENTATION.md`
2. Đăng nhập để lấy token
3. Test từng endpoint theo flow:
   - Teacher tạo exam → thêm questions → assign to class
   - Student xem tests → start → answer → submit
   - Teacher xem submissions → grade

### Unit Testing (Future)

```bash
php artisan test --filter TestSystemTest
```

---

## 📝 Notes

### Auto-Grading Algorithm
- Chỉ áp dụng cho câu trắc nghiệm (multiple choice)
- So sánh `saAnswer_text` với `aContent` của đáp án đúng
- Tính điểm: `(totalPoints / maxPoints) * 100`
- Kết quả lưu vào `sScore` (decimal 0-100)

### Attempt Limit
- Mặc định: 1 lần
- Teacher có thể cấu hình khi assign test
- Hệ thống kiểm tra số lần đã làm trước khi cho phép start

### Deadline Enforcement
- Kiểm tra khi student start test
- Không cho phép start nếu quá deadline
- Không ảnh hưởng đến bài đang làm (in_progress)

### Soft Delete
- Classes, Exams sử dụng Laravel soft delete
- Dữ liệu không bị xóa vĩnh viễn
- Có thể restore nếu cần

---

## 🚀 Roadmap

### Phase 1: Core Features ✅ (Completed)
- [x] Class Management
- [x] Exam Management
- [x] Test Assignment
- [x] Test Taking
- [x] Auto-Grading
- [x] Manual Grading

### Phase 2: Advanced Features (Future)
- [ ] Listening test với audio files
- [ ] Speaking test với recording
- [ ] Writing test với AI grading (Gemini)
- [ ] Listening limit tracking
- [ ] Real-time test timer
- [ ] Export results to Excel/PDF

### Phase 3: Analytics (Future)
- [ ] Student performance analytics
- [ ] Class statistics
- [ ] Question difficulty analysis
- [ ] Exam completion rates

---

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs: `storage/logs/laravel.log`
2. Kiểm tra database connection
3. Verify migrations đã chạy
4. Kiểm tra token authentication

---

**Version**: 1.0.0  
**Last Updated**: 2026-03-18  
**Status**: ✅ Production Ready

