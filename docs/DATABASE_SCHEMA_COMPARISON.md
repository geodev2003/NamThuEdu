# So Sánh Database Schema - Cũ vs Laravel Mới

## 📊 Tổng Quan

| Tiêu chí | Database Cũ (database.sql) | Laravel Migrations | Trạng thái |
|----------|---------------------------|-------------------|------------|
| **Số tables** | 16 tables | 8 tables | ⚠️ Thiếu 8 tables |
| **Core tables** | ✅ Đầy đủ | ✅ Đầy đủ | ✅ OK |
| **Test system** | ✅ Có (8 tables) | ❌ Chưa có | ❌ Cần tạo |

---

## ✅ Tables Đã Migrate (8/16)

### 1. users ✅ GIỐNG NHAU
**Database Cũ:**
```sql
users (
  uId INT PRIMARY KEY,
  uPhone VARCHAR(20) UNIQUE,
  uPassword VARCHAR(255),
  uName VARCHAR(150),
  uGender BOOLEAN,
  uAddress TEXT,
  uClass INT,
  uRole ENUM('student','teacher','admin'),
  uDoB DATE,
  uStatus ENUM('active','inactive'),
  uCreated_at TIMESTAMP,
  uDeleted_at DATETIME
)
```

**Laravel Migration:** ✅ GIỐNG 100%

---

### 2. otp_logs ✅ GIỐNG NHAU
**Database Cũ:**
```sql
otp_logs (
  oId INT PRIMARY KEY,
  userId INT,
  oCode VARCHAR(6),
  oExpired_at DATETIME,
  oVerified BOOLEAN,
  oCreated_at TIMESTAMP
)
```

**Laravel Migration:** ✅ GIỐNG 100%

---

### 3. category ✅ GIỐNG NHAU
**Database Cũ:**
```sql
category (
  caId INT PRIMARY KEY,
  caName NVARCHAR(100)
)
```

**Laravel Migration:** ✅ GIỐNG 100%

---

### 4. course ✅ GIỐNG NHAU
**Database Cũ:**
```sql
course (
  cId INT PRIMARY KEY,
  cName NVARCHAR(100),
  cCategory INT,
  cNumberOfStudent INT,
  cTime NVARCHAR(50),
  cSchedule TEXT,
  cStartDate DATE,
  cEndDate DATE,
  cStatus ENUM('active','draft','ongoing','complete'),
  cTeacher INT,
  cDescription TEXT,
  cDeleteAt DATETIME,
  cCreateAt TIMESTAMP,
  cUpdateAt TIMESTAMP
)
```

**Laravel Migration:** ✅ GIỐNG 100%

---

### 5. posts ✅ GIỐNG NHAU
**Database Cũ:**
```sql
posts (
  pId INT PRIMARY KEY,
  pTitle VARCHAR(255),
  pContent LONGTEXT,
  pAuthor_id INT,
  pType ENUM('grammar','tips','vocabulary'),
  pCategory INT,
  pUrl TEXT,
  pThumbnail TEXT,
  pView INT,
  pLike INT,
  pStatus ENUM('active','inactive','draft'),
  pCreated_at TIMESTAMP,
  pDeleted_at TIMESTAMP,
  pUpdated_at TIMESTAMP
)
```

**Laravel Migration:** ✅ GIỐNG 100%

---

### 6-8. Laravel System Tables ✅
- `personal_access_tokens` - Sanctum authentication
- `password_resets` - Password reset functionality
- `failed_jobs` - Queue system

---

## ❌ Tables Chưa Migrate (8/16)

### 1. classes ❌ CHƯA CÓ
**Chức năng:** Quản lý lớp học

```sql
classes (
  cId INT PRIMARY KEY,
  cName VARCHAR(100),
  cTeacher_id INT,
  cDescription TEXT,
  cStatus ENUM('active','inactive'),
  cCreated_at TIMESTAMP,
  course INT
)
```

**Cần tạo:** ✅ Cần migration mới

---

### 2. class_enrollments ❌ CHƯA CÓ
**Chức năng:** Gán học viên vào lớp

```sql
class_enrollments (
  class_id INT,
  student_id INT,
  enrolled_at TIMESTAMP,
  PRIMARY KEY (class_id, student_id)
)
```

**Cần tạo:** ✅ Cần migration mới

---

### 3. exams ❌ CHƯA CÓ
**Chức năng:** Quản lý bài thi/test

```sql
exams (
  eId INT PRIMARY KEY,
  eTitle VARCHAR(255),
  eDescription TEXT,
  eType ENUM('VSTEP','IELTS','TOEIC','GENERAL'),
  eSkill ENUM('listening','reading','writing','speaking'),
  eTeacher_id INT,
  eDuration_minutes INT,
  eIs_private BOOLEAN,
  eSource_type ENUM('manual','upload'),
  eCreated_at TIMESTAMP
)
```

**Cần tạo:** ✅ Cần migration mới (QUAN TRỌNG)

---

### 4. questions ❌ CHƯA CÓ
**Chức năng:** Câu hỏi trong bài thi

```sql
questions (
  qId INT PRIMARY KEY,
  exam_id INT,
  qContent TEXT,
  qMedia_url VARCHAR(255),
  qPoints INT,
  qTranscript TEXT,
  qExplanation TEXT,
  qListen_limit INT,
  qCreated_at TIMESTAMP
)
```

**Cần tạo:** ✅ Cần migration mới (QUAN TRỌNG)

---

### 5. answers ❌ CHƯA CÓ
**Chức năng:** Đáp án cho câu hỏi

```sql
answers (
  aId INT PRIMARY KEY,
  question_id INT,
  aContent TEXT,
  aIs_correct BOOLEAN
)
```

**Cần tạo:** ✅ Cần migration mới (QUAN TRỌNG)

---

### 6. test_assignments ❌ CHƯA CÓ
**Chức năng:** Giao bài test cho lớp/học viên

```sql
test_assignments (
  taId INT PRIMARY KEY,
  exam_id INT,
  taTarget_type ENUM('class','student'),
  taTarget_id INT,
  taDeadline DATETIME,
  taMax_attempt INT,
  taIs_public BOOLEAN,
  taCreated_at TIMESTAMP
)
```

**Cần tạo:** ✅ Cần migration mới (QUAN TRỌNG)

---

### 7. submissions ❌ CHƯA CÓ
**Chức năng:** Bài làm của học viên

```sql
submissions (
  sId INT PRIMARY KEY,
  user_id INT,
  exam_id INT,
  assignment_id INT,
  sAttempt INT,
  sStart_time DATETIME,
  sSubmit_time DATETIME,
  sScore DECIMAL(5,2),
  sTeacher_feedback TEXT,
  sGemini_feedback TEXT,
  sStatus ENUM('in_progress','submitted','graded')
)
```

**Cần tạo:** ✅ Cần migration mới (QUAN TRỌNG)

---

### 8. submission_answers ❌ CHƯA CÓ
**Chức năng:** Câu trả lời của học viên

```sql
submission_answers (
  saId INT PRIMARY KEY,
  submission_id INT,
  question_id INT,
  saAnswer_text TEXT,
  saIs_correct BOOLEAN,
  saPoints_awarded DECIMAL(5,2)
)
```

**Cần tạo:** ✅ Cần migration mới (QUAN TRỌNG)

---

### 9-11. Optional Tables (Có thể làm sau)

**9. listening_logs** - Tracking số lần nghe
**10. speaking_records** - Ghi âm speaking
**11. schedules** - Lịch học/thi

---

### 12-13. System Tables (Có thể làm sau)

**12. notifications** - Thông báo
**13. audit_logs** - Audit trail

---

## 🎯 Kết Luận

### ✅ Đã Có (Core Features)
- Authentication & Users ✅
- Course Management ✅
- Blog/Posts Management ✅
- Categories ✅
- OTP System ✅

### ❌ Chưa Có (Test System - QUAN TRỌNG)
- Classes Management ❌
- Exams/Tests ❌
- Questions & Answers ❌
- Test Assignments ❌
- Submissions & Grading ❌

### 📊 Tỷ Lệ Hoàn Thành
- **Core tables**: 5/5 (100%) ✅
- **Test system tables**: 0/8 (0%) ❌
- **Optional tables**: 0/3 (0%) ⚠️
- **Tổng thể**: 8/16 (50%) ⚠️

---

## 🚀 Cần Làm Tiếp

### Priority 1: Test Management System (8 tables)
1. ✅ `classes` - Quản lý lớp học
2. ✅ `class_enrollments` - Gán học viên vào lớp
3. ✅ `exams` - Quản lý bài thi
4. ✅ `questions` - Câu hỏi
5. ✅ `answers` - Đáp án
6. ✅ `test_assignments` - Giao bài
7. ✅ `submissions` - Bài làm
8. ✅ `submission_answers` - Câu trả lời

### Priority 2: Supporting Features (3 tables)
9. ⚠️ `listening_logs` - Tracking listening
10. ⚠️ `speaking_records` - Speaking audio
11. ⚠️ `schedules` - Lịch học

### Priority 3: System Features (2 tables)
12. 🟢 `notifications` - Thông báo
13. 🟢 `audit_logs` - Audit trail

---

## 📝 Hành Động Tiếp Theo

**Bước 1:** Tạo migrations cho Test Management System (8 tables)
```bash
php artisan make:migration create_classes_table
php artisan make:migration create_class_enrollments_table
php artisan make:migration create_exams_table
php artisan make:migration create_questions_table
php artisan make:migration create_answers_table
php artisan make:migration create_test_assignments_table
php artisan make:migration create_submissions_table
php artisan make:migration create_submission_answers_table
```

**Bước 2:** Tạo Models tương ứng
```bash
php artisan make:model Classes
php artisan make:model Exam
php artisan make:model Question
php artisan make:model Answer
php artisan make:model TestAssignment
php artisan make:model Submission
php artisan make:model SubmissionAnswer
```

**Bước 3:** Tạo Controllers & APIs
```bash
php artisan make:controller TestController --resource
php artisan make:controller ClassController --resource
```

---

**Kết luận:** Database schema cũ **KHÔNG GIỐNG** hoàn toàn với Laravel migrations hiện tại. Laravel chỉ có **50% tables** (8/16). Cần tạo thêm **8 tables** cho Test Management System để đầy đủ chức năng.

**Last Updated**: 2026-03-18  
**Status**: ⚠️ Thiếu Test Management System
