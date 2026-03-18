# 📚 API Documentation - Theo Role User

**Backend**: NamThu Education Laravel API  
**Base URL**: `http://127.0.0.1:8000/api`  
**Authentication**: Bearer Token (Sanctum)  

---

# 👨‍🏫 TEACHER ROLE APIs

## 🔐 Authentication

### 1. Đăng nhập
```http
POST /api/login
Content-Type: application/json

{
  "phone": "0336695863",
  "password": "password123"
}
```
**Response**: Access token + user info

### 2. Đăng xuất
```http
POST /api/logout
Authorization: Bearer {token}
```

### 3. Yêu cầu OTP reset password
```http
POST /api/users/accept
Content-Type: application/json

{
  "phone": "0336695863"
}
```

### 4. Reset password bằng OTP
```http
POST /api/users/reset-password
Content-Type: application/json

{
  "phone": "0336695863",
  "otp": "123456",
  "password": "newpassword123"
}
```

---

## 📚 Course Management

### 5. Xem danh sách khóa học
```http
GET /api/teacher/courses
Authorization: Bearer {token}
```

### 6. Tạo khóa học mới
```http
POST /api/teacher/courses
Authorization: Bearer {token}
Content-Type: application/json

{
  "courseName": "VSTEP Preparation Course",
  "numberOfStudent": 20,
  "time": "2 hours",
  "category": 1,
  "schedule": "Mon, Wed, Fri - 7:00 PM",
  "startDate": "2026-04-01",
  "endDate": "2026-06-30",
  "description": "Comprehensive VSTEP preparation course"
}
```

### 7. Xem chi tiết khóa học
```http
GET /api/teacher/courses/{id}
Authorization: Bearer {token}
```

### 8. Cập nhật khóa học
```http
PUT /api/teacher/courses/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "courseName": "Updated Course Name",
  "numberOfStudent": 25,
  "description": "Updated description"
}
```

### 9. Xóa khóa học
```http
DELETE /api/teacher/courses/{id}
Authorization: Bearer {token}
```

---

## 🏫 Class Management

### 10. Xem danh sách lớp học
```http
GET /api/teacher/classes
Authorization: Bearer {token}
```

### 11. Tạo lớp học mới
```http
POST /api/teacher/classes
Authorization: Bearer {token}
Content-Type: application/json

{
  "cName": "Advanced English Class",
  "cDescription": "Advanced level English course",
  "cStatus": "active"
}
```

### 12. Xem chi tiết lớp học
```http
GET /api/teacher/classes/{id}
Authorization: Bearer {token}
```

### 13. Cập nhật lớp học
```http
PUT /api/teacher/classes/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "cName": "Updated Class Name",
  "cDescription": "Updated description",
  "cStatus": "active"
}
```

### 14. Xóa lớp học
```http
DELETE /api/teacher/classes/{id}
Authorization: Bearer {token}
```

### 15. Ghi danh học viên vào lớp
```http
POST /api/teacher/classes/{id}/enroll
Authorization: Bearer {token}
Content-Type: application/json

{
  "student_ids": [2, 3, 4]
}
```

---

## 👥 Student Management

### 16. Xem danh sách học viên
```http
GET /api/teacher/students
Authorization: Bearer {token}
```

### 17. Tạo học viên mới
```http
POST /api/teacher/student
Authorization: Bearer {token}
Content-Type: application/json

{
  "studentPhone": "0912345678",
  "studentPassword": "password123",
  "studentName": "Nguyen Van B",
  "studentDoB": "2000-01-01",
  "uClass": 1
}
```

### 18. Xem chi tiết học viên
```http
GET /api/teacher/student/{id}
Authorization: Bearer {token}
```

### 19. Cập nhật thông tin học viên
```http
PUT /api/teacher/student/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "studentName": "Updated Name",
  "studentPhone": "0987654321",
  "studentAddress": "Can Tho City",
  "studentStatus": "active"
}
```

### 20. Xóa học viên
```http
DELETE /api/teacher/student/{id}
Authorization: Bearer {token}
```

---

## 📝 Blog Management

### 21. Xem danh sách bài viết
```http
GET /api/teacher/blogs
Authorization: Bearer {token}
```

### 22. Tạo bài viết mới
```http
POST /api/teacher/blogs
Authorization: Bearer {token}
Content-Type: application/json

{
  "blogName": "Grammar Tips for VSTEP",
  "blogContent": "Detailed content about grammar...",
  "blogType": "grammar",
  "blogCategory": 1,
  "blogUrl": "grammar-tips-vstep",
  "blogThumbnail": "thumbnail.jpg"
}
```

### 23. Xem chi tiết bài viết
```http
GET /api/teacher/blogs/{id}
Authorization: Bearer {token}
```

### 24. Cập nhật bài viết
```http
PUT /api/teacher/blogs/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "blogName": "Updated Title",
  "blogContent": "Updated content",
  "pStatus": "active"
}
```

### 25. Xóa bài viết
```http
DELETE /api/teacher/blogs/{id}
Authorization: Bearer {token}
```

---

## 📋 Exam Management

### 26. Xem danh sách đề thi
```http
GET /api/teacher/exams
Authorization: Bearer {token}
```

### 27. Tạo đề thi mới
```http
POST /api/teacher/exams
Authorization: Bearer {token}
Content-Type: application/json

{
  "eTitle": "VSTEP Practice Test",
  "eDescription": "Practice test for VSTEP preparation",
  "eType": "VSTEP",
  "eSkill": "listening",
  "eDuration": 90,
  "eTotal_score": 100
}
```

### 28. Xem chi tiết đề thi
```http
GET /api/teacher/exams/{id}
Authorization: Bearer {token}
```

### 29. Cập nhật đề thi
```http
PUT /api/teacher/exams/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "eTitle": "Updated Exam Title",
  "eDescription": "Updated description",
  "eDuration": 120
}
```

### 30. Xóa đề thi
```http
DELETE /api/teacher/exams/{id}
Authorization: Bearer {token}
```

### 31. Thêm câu hỏi vào đề thi
```http
POST /api/teacher/exams/{id}/questions
Authorization: Bearer {token}
Content-Type: application/json

{
  "questions": [
    {
      "qText": "What is the main idea?",
      "qType": "multiple_choice",
      "qScore": 5
    }
  ]
}
```

### 32. Sửa câu hỏi
```http
PUT /api/teacher/exams/{examId}/questions/{questionId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "qText": "Updated question text",
  "qScore": 10
}
```

### 33. Xóa câu hỏi
```http
DELETE /api/teacher/exams/{examId}/questions/{questionId}
Authorization: Bearer {token}
```

---

## 📊 Test Assignment

### 34. Giao bài thi cho lớp
```http
POST /api/teacher/exams/{examId}/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "class_ids": [1, 2],
  "start_time": "2026-04-01 09:00:00",
  "end_time": "2026-04-01 11:00:00",
  "instructions": "Complete all questions"
}
```

### 35. Xem danh sách bài thi đã giao
```http
GET /api/teacher/assignments
Authorization: Bearer {token}
```

### 36. Hủy bài thi đã giao
```http
DELETE /api/teacher/assignments/{id}
Authorization: Bearer {token}
```

---

## 📈 Grading & Assessment

### 37. Xem danh sách bài làm cần chấm
```http
GET /api/teacher/submissions
Authorization: Bearer {token}
```

### 38. Xem chi tiết bài làm
```http
GET /api/teacher/submissions/{id}
Authorization: Bearer {token}
```

### 39. Chấm điểm bài làm
```http
POST /api/teacher/submissions/{id}/grade
Authorization: Bearer {token}
Content-Type: application/json

{
  "grades": [
    {
      "question_id": 1,
      "score": 8.5
    }
  ],
  "feedback": "Good work overall"
}
```

---

## 📁 File & Content Management

### 40. Upload file đề thi
```http
POST /api/tests/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [Excel/CSV file]
title: "VSTEP Sample Test"
description: "Sample test for VSTEP preparation"
type: "VSTEP"
```

### 41. Xem danh mục
```http
GET /api/teacher/categories
Authorization: Bearer {token}
```

---

# 👨‍🎓 STUDENT ROLE APIs

## 🔐 Authentication

### 1. Đăng nhập
```http
POST /api/login
Content-Type: application/json

{
  "phone": "0912345678",
  "password": "password123"
}
```

### 2. Đăng xuất
```http
POST /api/logout
Authorization: Bearer {token}
```

### 3. Yêu cầu OTP reset password
```http
POST /api/users/accept
Content-Type: application/json

{
  "phone": "0912345678"
}
```

### 4. Reset password bằng OTP
```http
POST /api/users/reset-password
Content-Type: application/json

{
  "phone": "0912345678",
  "otp": "123456",
  "password": "newpassword123"
}
```

---

## 📝 Test Taking

### 5. Xem danh sách bài thi được giao
```http
GET /api/student/tests
Authorization: Bearer {token}
```

### 6. Xem chi tiết đề thi
```http
GET /api/student/tests/{id}
Authorization: Bearer {token}
```

### 7. Bắt đầu làm bài thi
```http
POST /api/student/tests/{id}/start
Authorization: Bearer {token}
```

### 8. Trả lời câu hỏi
```http
POST /api/student/tests/{submissionId}/answer
Authorization: Bearer {token}
Content-Type: application/json

{
  "question_id": 1,
  "answer_id": 2
}
```
**Hoặc cho câu hỏi tự luận:**
```json
{
  "question_id": 1,
  "answer_text": "Essay answer text"
}
```

### 9. Nộp bài thi
```http
POST /api/student/tests/{submissionId}/submit
Authorization: Bearer {token}
```

---

## 📊 Submission History

### 10. Xem lịch sử bài làm
```http
GET /api/student/submissions
Authorization: Bearer {token}
```

### 11. Xem chi tiết bài làm + điểm số
```http
GET /api/student/submissions/{id}
Authorization: Bearer {token}
```

---

# 🌐 PUBLIC APIs

## 👥 User Management

### 1. Xem danh sách users
```http
GET /api/users
```

### 2. Đăng ký tài khoản mới
```http
POST /api/users
Content-Type: application/json

{
  "phone": "0987654321",
  "password": "password123",
  "name": "Nguyen Van A",
  "role": "student",
  "dob": "1995-01-01",
  "address": "Can Tho City",
  "gender": true
}
```

### 3. Xóa user
```http
DELETE /api/users/{id}
```

---

## 📋 Test Access

### 4. Xem danh sách đề thi public
```http
GET /api/tests
```

---

## 🔐 Authentication

### 5. Đăng nhập (public)
```http
POST /api/login
Content-Type: application/json

{
  "phone": "phone_number",
  "password": "password"
}
```

---

# 📋 Response Formats

## ✅ Success Response
```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation completed successfully"
}
```

## ❌ Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "errors": { ... }
}
```

## 🔐 Authentication Response
```json
{
  "status": "success",
  "data": {
    "access_token": "token_string",
    "user": {
      "id": 1,
      "name": "User Name",
      "phone": "0123456789",
      "role": "teacher"
    }
  }
}
```

---

# 🔒 Security Notes

- **Bearer Token**: Thêm `Authorization: Bearer {token}` vào header
- **Rate Limiting**: Login có giới hạn 5 lần/phút
- **Role Permissions**: APIs chỉ accessible bởi role tương ứng
- **Data Ownership**: User chỉ truy cập data của mình
- **Soft Delete**: Data không bị xóa vĩnh viễn

---

# 🎯 Testing

**Swagger UI**: http://127.0.0.1:8000/docs  
**Test Accounts**:
- Teacher: `0336695863` / `password123`
- Student: `0912345678` / `password123`

**Total APIs**: 49 endpoints (41 Teacher + 11 Student + 5 Public)