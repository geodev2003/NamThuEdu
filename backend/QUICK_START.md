# 🚀 Quick Start Guide - Test System

## 📋 Tổng Quan

Hệ thống Test System đã được cài đặt hoàn chỉnh với dữ liệu thực từ VSTEP Sample Test.

## 🗄️ Database Setup

### 1. Chạy Migrations
```bash
php artisan migrate
```

### 2. Seed Dữ Liệu Mẫu
```bash
php artisan db:seed --class=TestSystemSeeder
```

Dữ liệu được tạo:
- ✅ 1 Teacher: `0336695863` / `password123`
- ✅ 5 Students: `0912345678-0952345678` / `password123`
- ✅ 3 Classes: IC3 courses
- ✅ 1 Exam: VSTEP Sample Test (20 câu hỏi listening)
- ✅ 1 Assignment: Đã gán cho lớp

## 🧪 Test API với Postman

### 1. Login Teacher
```http
POST http://localhost:8000/api/login
Content-Type: application/json

{
  "uPhone": "0336695863",
  "uPassword": "password123"
}
```

Response:
```json
{
  "token": "1|xxxxx...",
  "user": {
    "uId": 1,
    "uName": "Nguyen Van A",
    "uRole": "teacher"
  }
}
```

### 2. Xem Danh Sách Classes (Teacher)
```http
GET http://localhost:8000/api/teacher/classes
Authorization: Bearer {token}
```

### 3. Xem Danh Sách Exams (Teacher)
```http
GET http://localhost:8000/api/teacher/exams
Authorization: Bearer {token}
```

### 4. Xem Chi Tiết Exam với Questions
```http
GET http://localhost:8000/api/teacher/exams/1
Authorization: Bearer {token}
```

### 5. Login Student
```http
POST http://localhost:8000/api/login
Content-Type: application/json

{
  "uPhone": "0912345678",
  "uPassword": "password123"
}
```

### 6. Xem Bài Test Được Gán (Student)
```http
GET http://localhost:8000/api/student/tests
Authorization: Bearer {student_token}
```

### 7. Bắt Đầu Làm Bài (Student)
```http
POST http://localhost:8000/api/student/tests/1/start
Authorization: Bearer {student_token}
```

Response:
```json
{
  "submission_id": 1,
  "message": "Test started successfully"
}
```

### 8. Trả Lời Câu Hỏi (Student)
```http
POST http://localhost:8000/api/student/tests/1/answer
Authorization: Bearer {student_token}
Content-Type: application/json

{
  "question_id": 1,
  "answer_id": 3
}
```

### 9. Nộp Bài (Student)
```http
POST http://localhost:8000/api/student/tests/1/submit
Authorization: Bearer {student_token}
```

Response:
```json
{
  "message": "Test submitted successfully",
  "submission": {
    "sId": 1,
    "sScore": 85.5,
    "sStatus": "graded"
  }
}
```

### 10. Xem Kết Quả (Student)
```http
GET http://localhost:8000/api/student/submissions/1
Authorization: Bearer {student_token}
```

## 📊 Dữ Liệu VSTEP Sample Test

### Part 1: Short Announcements (Questions 1-8)
- 8 câu hỏi nghe thông báo ngắn
- Audio: `question1-8_VSTEP_Sample_Test.mp3`
- Mỗi câu 1 điểm

### Part 2: Conversations (Questions 9-20)
- 12 câu hỏi từ 3 đoạn hội thoại
- Audio files:
  - Q9-12: `question9-12_VSTEP_Sample_Test.wav`
  - Q13-16: `question13-16_VSTEP_Sample_Test.wav`
  - Q17-20: `question17-20_VSTEP_Sample_Test.wav`
- Mỗi câu 1 điểm

### Tổng: 20 câu = 20 điểm

## 🔐 Test Accounts

### Teacher
- Phone: `0336695863`
- Password: `password123`
- Name: Nguyen Van A

### Students
| Phone | Name | Address |
|-------|------|---------|
| 0912345678 | Lê Thị B | 123 Đường 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ |
| 0922345678 | Trần Văn C | 456 Cách Mạng Tháng 8, Bùi Hữu Nghĩa, Bình Thủy, Cần Thơ |
| 0932345678 | Phạm Thị D | 789 Nguyễn Văn Cừ, An Khánh, Ninh Kiều, Cần Thơ |
| 0942345678 | Hoàng Văn E | 101 Tầm Vu, Hưng Lợi, Ninh Kiều, Cần Thơ |
| 0952345678 | Nguyễn Thị F | 202 Trần Hưng Đạo, An Phú, Ninh Kiều, Cần Thơ |

## 🎯 Complete Workflow Test

### Scenario: Student làm bài test VSTEP

1. **Login Student** → Get token
2. **View Tests** → See assigned VSTEP test
3. **Start Test** → Create submission
4. **Answer Questions** → Answer all 20 questions
5. **Submit Test** → Auto-grading
6. **View Result** → See score and feedback

### Scenario: Teacher quản lý và chấm bài

1. **Login Teacher** → Get token
2. **View Classes** → See all classes
3. **View Exams** → See VSTEP exam
4. **View Submissions** → See student submissions
5. **Grade Manually** (optional) → Update scores
6. **View Statistics** → See class performance

## 📝 Notes

- Auto-grading hoạt động tự động khi student submit
- Teacher có thể chấm lại thủ công nếu cần
- Mỗi student có thể làm tối đa 2 lần (taMax_attempt = 2)
- Deadline: 30 ngày kể từ khi seed data
- Tất cả câu hỏi đều có đáp án đúng được đánh dấu

## 🔗 Related Documentation

- `TEST_SYSTEM_README.md` - Hướng dẫn chi tiết
- `IMPLEMENTATION_STATUS.md` - Trạng thái triển khai
- `DATABASE_ANALYSIS.md` - Phân tích database
- `docs/API_DOCUMENTATION.md` - API reference đầy đủ

## 🚀 Start Server

```bash
php artisan serve
```

Server sẽ chạy tại: `http://localhost:8000`

---

**Happy Testing! 🎉**
