# 🎓 NamThu Education — Project Index

> **Stack**: Laravel 8 (PHP 8+) · React 18 + TypeScript · Vite · TailwindCSS 4 · MySQL · WebSocket

---

## 📁 Cấu trúc thư mục

```
NamThuEdu/
├── backend/          # Laravel 8 API (port 8000)
├── frontend/         # React 18 SPA (port 5173)
├── public/templates/ # File mẫu (Excel import học viên)
└── scripts/          # Deploy scripts
```

---

## 🚀 Khởi động nhanh

```bash
# Backend
cd backend && php artisan serve

# Frontend
cd frontend && pnpm dev
```

**Tài khoản test:**
- Teacher: `0336695863` / `password123`
- Student: `0912345678` / `password123`

---

## 👥 3 Role & Routes

| Role | Base Path | Layout theme |
|------|-----------|-------------|
| **Teacher** | `/giao-vien` | Deep Indigo (`#1E1B4B`) |
| **Student** | `/hoc-vien` | 3 age-groups (Kids/Teens/Adults) |
| **Admin** | `/admin` | Dark (`#0F172A`) |

---

## 🎯 VSTEP & IELTS — Luồng thi của học viên

### Tổng quan cấu trúc VSTEP

```
VSTEP (150 phút, eType="VSTEP", eSkill="mixed")
├── Listening  35 câu
│   ├── Part 1 — Announcements      (8 câu, 8 sections, mỗi section 1 audio)
│   ├── Part 2 — Dialogues          (12 câu, 3 sections, mỗi section 1 audio)
│   └── Part 3 — Lectures           (15 câu, 3 sections, mỗi section 1 audio)
├── Reading    40 câu
│   ├── Part 1 — Passage 1          (10 câu MCQ)
│   ├── Part 2 — Passage 2          (10 câu MCQ)
│   ├── Part 3 — Passage 3          (10 câu MCQ)
│   └── Part 4 — Passage 4          (10 câu MCQ)
├── Writing    2 task
│   ├── Task 1 — Formal writing     (≥150 từ, mở từ)
│   └── Task 2 — Essay              (≥250 từ, mở từ)
└── Speaking   3 part
    ├── Part 1 — Social Interaction (topic cards + 3 câu hỏi/topic)
    ├── Part 2 — Solution Discussion(situation + 3 solutions + question)
    └── Part 3 — Topic Development  (main topic + ideas + follow-up)
```

---

### Luồng thi học viên (Student Exam Flow)

```
[1] Danh sách bài thi
    GET /api/student/tests
    → StudentTestController::index()
    → Chỉ trả về bài thi có eSkill="mixed" (VSTEP full)
    → Filter theo age_group (adults thấy VSTEP/IELTS, kids thấy Starters/Movers/Flyers)
    → Frontend: StudentExamBrowser.tsx

[2] Xem chi tiết bài thi / Lobby
    GET /api/student/tests/{id}
    → StudentTestController::show()
    → Frontend: ExamLobby.tsx
    → Hiển thị: thông tin đề, số câu, thời gian, số lần còn lại

[3] Bắt đầu thi
    POST /api/student/tests/{id}/start
    → StudentTestController::start()
    → Tạo Submission (sStatus="in_progress")
    → Trả về submission_id + thời gian còn lại
    → Nếu đang dở: POST /api/student/tests/{id}/resume → lấy lại answers đã lưu

[4] Load đề thi theo kỹ năng (VSTEP)
    GET /api/student/exams/{examId}/vstep/listening
    GET /api/student/exams/{examId}/vstep/reading
    GET /api/student/exams/{examId}/vstep/writing
    GET /api/student/exams/{examId}/vstep/speaking
    → StudentTestController::loadVstepListening/Reading/Writing/Speaking()
    → Frontend: StudentVstepExamPage.tsx (116KB — component chính)

[5] Lưu câu trả lời (real-time)
    POST /api/student/tests/{submissionId}/answer
    → StudentTestController::answer()
    → Throttle: 120 req/phút
    → Lưu SubmissionAnswer (question_id, answer text/id)
    → Speaking: upload audio file
      POST /api/student/submissions/{submissionId}/speaking/{partNumber}/upload

[6] Nộp bài
    POST /api/student/tests/{submissionId}/submit
    → StudentTestController::submit()
    → Throttle: 30 req/phút
    → Idempotency key (tránh nộp 2 lần)
    → sStatus: "in_progress" → "completed"
    → Trigger auto-grade job (GradeVstepSubjectiveJob)

[7] Kết quả & Review
    GET /api/student/submissions/{id}
    → StudentTestController::submissionDetail()
    GET /api/student/submissions/{id}/grading-status
    → Polling trạng thái chấm bài (pending_grading → graded)
    GET /api/student/submissions/{id}/answers
    → Chi tiết từng câu trả lời
    → Frontend: VstepResultPage.tsx, AnswerReview.tsx, ResultDetail.tsx
```

---

### Submission Status Flow

```
draft
  ↓ (start)
in_progress
  ↓ (submit)
completed
  ↓ (auto-grade Listening/Reading)
partially_graded     ← Listening + Reading đã chấm, Writing/Speaking chờ teacher
  ↓ (teacher grade)
graded               ← Đã có điểm cuối
```

---

### Model: Submission

```php
// app/Models/Submission.php
PK: sId
- user_id            → users.uId
- exam_id            → exams.eId
- assignment_id      → test_assignments.taId (nullable — direct exam không có)
- sAttempt           int     — lần thi thứ mấy
- sStart_time        datetime
- sSubmit_time       datetime
- sGraded_time       datetime
- sScore             decimal(5,2)
- sStatus            enum: draft|in_progress|completed|partially_graded|graded
- sTeacher_feedback  text    — nhận xét của giáo viên
- sGemini_feedback   text    — nhận xét AI (Groq/Gemini)
- teacher_reviewed_at datetime
- sTime_taken        int (seconds)
- submit_idempotency_key string — chống nộp 2 lần
```

---

### Chấm bài (Grading Flow)

```
Auto-grade (khi nộp bài):
  Listening + Reading → chấm tự động (MCQ so đáp án)
  Writing + Speaking  → dispatch GradeVstepSubjectiveJob (AI grading via Groq)

Teacher grade (manual):
  POST /api/teacher/submissions/{id}/grade
  → GradingController::grade()
  → Nhập điểm từng kỹ năng + feedback

  POST /api/teacher/submissions/{id}/detailed-grade
  → GradingController::detailedGrade()
  → Chấm chi tiết từng câu writing/speaking

  POST /api/teacher/submissions/{id}/auto-grade
  → GradingController::autoGrade()
  → Trigger lại AI grading
```

---

### Frontend Files — Học viên thi VSTEP

| File | Mô tả |
|------|-------|
| `features/student/exams/StudentExamBrowser.tsx` | Danh sách đề thi (browse + assigned) |
| `features/student/exams/StudentVstepExamPage.tsx` | **Main exam UI** — 4 skill tabs, timer, answer |
| `features/student/exams/VstepResultPage.tsx` | Trang kết quả sau khi nộp |
| `features/student/test-taking/ExamLobby.tsx` | Lobby trước khi vào thi |
| `features/student/test-taking/TestTakingVSTEP.tsx` | Component thi VSTEP (skill riêng lẻ) |
| `features/student/test-taking/AnswerReview.tsx` | Review đáp án sau thi |
| `features/student/test-taking/ResultDetail.tsx` | Chi tiết kết quả |
| `features/student/test-taking/layouts/ListeningLayout.tsx` | UI layout kỹ năng Listening |
| `features/student/test-taking/layouts/ReadingLayout.tsx` | UI layout kỹ năng Reading |
| `features/student/test-taking/layouts/WritingLayout.tsx` | UI layout kỹ năng Writing |
| `features/student/test-taking/layouts/SpeakingLayout.tsx` | UI layout kỹ năng Speaking |
| `features/student/test-taking/components/IntroScreen.tsx` | Màn hình giới thiệu kỹ năng |
| `features/student/test-taking/components/ExamBottomNav.tsx` | Navigation điều hướng câu hỏi |
| `features/student/test-taking/components/TestNavigator.tsx` | Bảng điều hướng câu hỏi |

---

### Frontend Files — Giáo viên tạo đề VSTEP

| File | Mô tả |
|------|-------|
| `features/teacher/exams/CreateVSTEPExam.tsx` | Tạo đề VSTEP (bước đầu) |
| `features/teacher/exams/vstep/CreateVstepFull.tsx` | VSTEP full 4 kỹ năng |
| `features/teacher/exams/vstep/CreateVstepListening.tsx` | Soạn Listening (56KB) |
| `features/teacher/exams/vstep/CreateVstepReading.tsx` | Soạn Reading |
| `features/teacher/exams/vstep/CreateVstepWriting.tsx` | Soạn Writing |
| `features/teacher/exams/vstep/CreateVstepSpeaking.tsx` | Soạn Speaking |
| `features/teacher/exams/vstep/VstepImportModal.tsx` | Import từ JSON (Gemini AI) |
| `features/teacher/exams/VstepExamPreview.tsx` | Preview đề trước khi publish |
| `features/teacher/grading/` | Chấm bài học viên |

---

### Backend Files — VSTEP Core

| File | Mô tả |
|------|-------|
| `Controllers/StudentTestController.php` | Start/answer/submit/resume exam |
| `Controllers/GradingController.php` | Teacher chấm bài |
| `Services/VSTEPService.php` | Business logic VSTEP |
| `Services/VstepGradingService.php` | Logic chấm điểm VSTEP (35KB) |
| `Services/IELTSService.php` | Business logic IELTS (24KB) |
| `Services/TestWebSocketService.php` | Real-time monitoring khi thi |
| `Services/TestRecoveryService.php` | Recovery bài thi bị gián đoạn |
| `Models/Submission.php` | Bài làm học viên |
| `Models/SubmissionAnswer.php` | Từng câu trả lời |
| `Models/Exam.php` | Đề thi |
| `Models/Question.php` | Câu hỏi |
| `Models/Answer.php` | Đáp án MCQ |

---

### API Services (Frontend)

| File | Mô tả |
|------|-------|
| `services/vstepApi.ts` | CRUD VSTEP exam cho teacher (save/publish/load từng kỹ năng) |
| `services/studentApi.ts` | API học viên (tests, submissions, answer, submit) |
| `services/teacherApi.ts` | API giáo viên (47KB) |
| `services/groqApi.ts` | AI grading via Groq (24KB) |

---

## 📡 Toàn bộ API Reference

> Base URL: `http://localhost:8000/api` | Auth: `Bearer <token>` | Format: `application/json`

---

### 🔓 Public — Không cần auth

```
GET    /test                                   Health check
GET    /health                                 Service health
POST   /login                                  Đăng nhập {phone, password}
POST   /refresh                                Refresh token
POST   /users/accept                           Xác nhận OTP
POST   /users/reset-password                   Reset mật khẩu
GET    /categories                             Danh sách danh mục
GET    /public/courses                         Khóa học công khai
GET    /public/posts                           Blog công khai
GET    /public/posts/{slug}                    Chi tiết bài viết
GET    /public/stats                           Thống kê hệ thống
GET    /push/vapid-public-key                  VAPID key (Web Push)
GET    /address/provinces                      Danh sách tỉnh thành
GET    /address/provinces/{code}/communes      Danh sách xã phường
GET    /tests                                  Danh sách bài thi công khai
```

---

### 👤 User (auth:sanctum — mọi role)

```
GET    /user/profile                           Lấy hồ sơ
PUT    /user/profile                           Cập nhật hồ sơ
POST   /user/avatar                            Upload avatar
DELETE /user/avatar                            Xóa avatar
GET    /user/age-group                         Lấy nhóm tuổi
POST   /user/age-group                         Cập nhật nhóm tuổi
GET    /user/theme-preference                  Lấy theme ưa thích
POST   /user/theme-preference                  Cập nhật theme
POST   /logout                                 Đăng xuất
POST   /push/subscribe                         Đăng ký push notification
DELETE /push/unsubscribe                       Hủy đăng ký push
```

---

### 🧑‍🏫 Teacher API (`/api/teacher/*`)

#### Dashboard & Monitoring

```
GET    /teacher/dashboard/overview             Tổng quan dashboard
GET    /teacher/dashboard/student-stats        Thống kê học viên
GET    /teacher/dashboard/performance-data     Dữ liệu hiệu suất (6 tuần)
GET    /teacher/dashboard/recent-activities    Hoạt động gần đây
GET    /teacher/dashboard/test-statistics/{examId}  Thống kê 1 đề thi
GET    /teacher/dashboard/active-sessions      Học viên đang thi (real-time)
GET    /teacher/dashboard/monitoring-stats     Số liệu monitoring
GET    /teacher/dashboard/recent-starts        Bắt đầu thi gần đây
POST   /teacher/dashboard/cleanup-expired      Dọn session hết hạn
GET    /teacher/dashboard/statistics           Thống kê tổng
POST   /teacher/dashboard/send-message         Gửi tin nhắn cho học viên đang thi
GET    /teacher/dashboard/connection-logs/{submissionId} Log kết nối WebSocket
```

#### Khóa học (Courses)

```
GET    /teacher/courses                        Danh sách khóa học
POST   /teacher/courses                        Tạo khóa học
GET    /teacher/courses/{id}                   Chi tiết khóa học
PUT    /teacher/courses/{id}                   Cập nhật
DELETE /teacher/courses/{id}                   Xóa
GET    /teacher/courses/{id}/students          Học viên trong khóa
POST   /teacher/courses/{id}/enroll            Thêm học viên vào khóa
DELETE /teacher/courses/{id}/students/{sid}    Xóa học viên khỏi khóa
GET    /teacher/courses/{id}/statistics        Thống kê khóa học
```

#### Lớp học (Classes)

```
GET    /teacher/classes                        Danh sách lớp
POST   /teacher/classes                        Tạo lớp
GET    /teacher/classes/statistics             Thống kê lớp
GET    /teacher/classes/{id}                   Chi tiết lớp
PUT    /teacher/classes/{id}                   Cập nhật lớp
DELETE /teacher/classes/{id}                   Xóa lớp
POST   /teacher/classes/{id}/enroll            Thêm học viên vào lớp
POST   /teacher/classes/{from}/transfer/{to}   Chuyển học viên sang lớp khác
GET    /teacher/classes/{id}/transfer-history  Lịch sử chuyển lớp
DELETE /teacher/classes/{id}/students/{sid}    Xóa học viên khỏi lớp
GET    /teacher/classes/{classId}/report       Báo cáo lớp học
```

#### Học viên (Students)

```
GET    /teacher/students                       Danh sách học viên
GET    /teacher/students/deleted               Học viên đã xóa
GET    /teacher/students/statistics            Thống kê học viên
GET    /teacher/students/export                Xuất Excel
GET    /teacher/students/progress              Tiến độ tất cả học viên
GET    /teacher/student/check-phone            Kiểm tra số điện thoại
GET    /teacher/student/{id}                   Chi tiết học viên
POST   /teacher/student                        Tạo học viên
PUT    /teacher/student/{id}                   Cập nhật
DELETE /teacher/student/{id}                   Xóa mềm (soft delete)
POST   /teacher/student/{id}/restore           Khôi phục học viên đã xóa
GET    /teacher/student/{id}/view-password     Xem mật khẩu học viên
POST   /teacher/student/{id}/reset-password    Reset mật khẩu
DELETE /teacher/student/{id}/permanent         Xóa vĩnh viễn
```

#### Đề thi (Exams) — VSTEP/IELTS/Cambridge

```
GET    /teacher/exams                          Danh sách đề thi
POST   /teacher/exams                          Tạo đề mới
GET    /teacher/exams/{id}                     Chi tiết đề
PUT    /teacher/exams/{id}                     Cập nhật
DELETE /teacher/exams/{id}                     Xóa
POST   /teacher/exams/{id}/questions           Thêm câu hỏi
PUT    /teacher/exams/{id}/questions/{qid}     Cập nhật câu hỏi
DELETE /teacher/exams/{id}/questions/{qid}     Xóa câu hỏi
GET    /teacher/exams/{id}/sections            Lấy sections
POST   /teacher/exams/{id}/clone               Clone đề
GET    /teacher/exams/{id}/preview             Preview đề
POST   /teacher/exams/{id}/publish             Xuất bản

# VSTEP Reading
POST   /teacher/exams/{id}/vstep/parts/{n}                           Lưu part Reading
POST   /teacher/exams/{id}/vstep/publish                             Publish Reading
GET    /teacher/exams/{id}/vstep/load                                Load Reading

# VSTEP Listening
POST   /teacher/exams/{id}/vstep/listening/parts/{n}                              Lưu Part Listening
POST   /teacher/exams/{id}/vstep/listening/parts/{n}/audio                        Lưu audio part (legacy)
POST   /teacher/exams/{id}/vstep/listening/parts/{n}/sections/{s}/audio           Lưu audio section
POST   /teacher/exams/{id}/vstep/listening/parts/{n}/sections/{s}                 Lưu section + questions
POST   /teacher/exams/{id}/vstep/listening/publish                                Publish Listening
GET    /teacher/exams/{id}/vstep/listening/load                                   Load Listening

# VSTEP Writing
POST   /teacher/exams/{id}/vstep/writing/tasks/{n}                   Lưu Writing Task
POST   /teacher/exams/{id}/vstep/writing/publish                     Publish Writing
GET    /teacher/exams/{id}/vstep/writing/load                        Load Writing

# VSTEP Speaking
POST   /teacher/exams/{id}/vstep/speaking/parts/{n}                  Lưu Speaking Part
POST   /teacher/exams/{id}/vstep/speaking/publish                    Publish Speaking
GET    /teacher/exams/{id}/vstep/speaking/load                       Load Speaking

# VSTEP Review (teacher xem lại đề đã publish)
GET    /teacher/exams/{id}/vstep/listening                           Load đề Listening (review)
GET    /teacher/exams/{id}/vstep/reading                             Load đề Reading (review)
GET    /teacher/exams/{id}/vstep/writing                             Load đề Writing (review)
GET    /teacher/exams/{id}/vstep/speaking                            Load đề Speaking (review)

# Import from AI (Gemini JSON)
POST   /teacher/exams/import                                         Import đề từ JSON
POST   /teacher/exams/import/validate                                Validate JSON trước khi import
```

#### Kids Exam (Thiếu nhi — 22 task types)

```
GET    /teacher/kids-exams/types               Danh sách exam types
GET    /teacher/kids-exams/task-types          Danh sách task types
GET    /teacher/kids-exams/task-types/{code}   Chi tiết task type
GET    /teacher/kids-exams                     Danh sách đề thi Kids
POST   /teacher/kids-exams                     Tạo đề Kids
GET    /teacher/kids-exams/{id}                Chi tiết đề Kids
PUT    /teacher/kids-exams/{id}                Cập nhật
DELETE /teacher/kids-exams/{id}                Xóa
POST   /teacher/kids-exams/{id}/questions      Thêm câu hỏi
PUT    /teacher/kids-exams/{id}/questions/{qid} Cập nhật câu hỏi
DELETE /teacher/kids-exams/{id}/questions/{qid} Xóa câu hỏi
POST   /teacher/kids-exams/media/upload        Upload media (ảnh/audio)
GET    /teacher/kids-exams/{id}/media          Media của đề
DELETE /teacher/kids-exams/media/{id}          Xóa media
```

#### Exam Templates (Cambridge)

```
GET    /teacher/exam-templates                 Danh sách templates
GET    /teacher/exam-templates/{category}      Templates theo category
GET    /teacher/exam-templates/{id}            Chi tiết template
GET    /teacher/exam-templates/{id}/sections   Sections của template
POST   /teacher/exams/from-template/{id}       Tạo đề từ template
```

#### Giao bài (Test Assignments)

```
POST   /teacher/exams/{examId}/assign          Giao bài cho lớp/học viên
GET    /teacher/assignments                    Danh sách bài đã giao
PUT    /teacher/assignments/{id}               Cập nhật assignment
DELETE /teacher/assignments/{id}               Xóa assignment
GET    /teacher/assignments/{id}/progress      Tiến độ làm bài
POST   /teacher/assignments/bulk               Giao bài hàng loạt
POST   /teacher/assignments/{id}/reminders     Gửi nhắc nhở
GET    /teacher/assignments/statistics         Thống kê giao bài
```

#### Chấm bài (Grading)

```
GET    /teacher/submissions                    Danh sách bài làm
                                               ?exam_id, ?student_id, ?status, ?reviewed
GET    /teacher/submissions/{id}               Chi tiết bài làm + tất cả câu trả lời
POST   /teacher/submissions/{id}/grade         Chấm tay
                                               Body: {score, feedback, questionScores[]}
POST   /teacher/submissions/{id}/auto-grade    Trigger AI grading lại
POST   /teacher/submissions/{id}/detailed-grade Chấm chi tiết từng câu writing/speaking
GET    /teacher/grading/statistics             Thống kê chấm bài
```

#### Báo cáo (Reports)

```
GET    /teacher/reports/overview               Tổng quan báo cáo
GET    /teacher/reports/student-progress       Tiến độ học viên (theo filter)
```

#### Luyện tập (Practice Sessions)

```
GET    /teacher/practice-sessions              Danh sách buổi luyện tập
POST   /teacher/practice-sessions/topic-based  Tạo session theo topic
POST   /teacher/practice-sessions/template-based Tạo theo template
POST   /teacher/practice-sessions/random       Tạo ngẫu nhiên
GET    /teacher/practice-sessions/statistics   Thống kê luyện tập
GET    /teacher/practice-sessions/{id}         Chi tiết session
PUT    /teacher/practice-sessions/{id}         Cập nhật
DELETE /teacher/practice-sessions/{id}         Xóa
GET    /teacher/templates                      Templates luyện tập
```

#### Blog & Content

```
GET    /teacher/blogs                          Danh sách bài viết
GET    /teacher/blogs/statistics               Thống kê blog
POST   /teacher/blogs                          Tạo bài viết
GET    /teacher/blogs/{id}                     Chi tiết bài viết
PUT    /teacher/blogs/{id}                     Cập nhật
DELETE /teacher/blogs/{id}                     Xóa
GET    /teacher/blog-types                     Loại bài viết
POST   /teacher/blog-types                     Tạo loại mới
```

#### Upload File

```
POST   /teacher/upload/audio                   Upload audio (multipart)
POST   /teacher/upload/image                   Upload ảnh (multipart)
DELETE /teacher/upload/file                    Xóa file
```

#### Age-Group Content

```
POST   /teacher/content/kids/create            Tạo content cho Kids
POST   /teacher/content/teens/create           Tạo content cho Teens
POST   /teacher/content/adults/create          Tạo content cho Adults
GET    /teacher/content/{id}/preview/{group}   Preview content theo age group
POST   /teacher/assignments/smart-assign       Smart assign theo age group
GET    /teacher/analytics/by-age-group         Analytics theo age group
```

---

### 🎓 Student API (`/api/student/*`)

#### Bài thi (Tests)

```
GET    /student/tests                          Danh sách bài được giao
                                               ?status (pending/in_progress/completed)
GET    /student/tests/in-progress              Bài đang làm dở
GET    /student/tests/upcoming                 Bài sắp đến hạn
GET    /student/tests/{id}                     Chi tiết bài thi
GET    /student/tests/{id}/resume              Resume bài dang dở (lấy lại answers)
POST   /student/tests/{id}/start               Bắt đầu thi → tạo Submission
POST   /student/tests/{subId}/answer           Lưu câu trả lời (throttle 120/phút)
POST   /student/tests/{subId}/submit           Nộp bài (throttle 30/phút)
```

#### VSTEP Direct (không cần assignment)

```
GET    /student/exams/browse                   Duyệt đề VSTEP/IELTS công khai
POST   /student/exams/{examId}/start-direct    Bắt đầu thi trực tiếp (không cần giao bài)
GET    /student/exams/{examId}/vstep/listening Load đề Listening
GET    /student/exams/{examId}/vstep/reading   Load đề Reading
GET    /student/exams/{examId}/vstep/writing   Load đề Writing
GET    /student/exams/{examId}/vstep/speaking  Load đề Speaking
POST   /student/exams/{examId}/checkin-photo   Upload ảnh check-in (multipart)
POST   /student/submissions/{subId}/speaking/{part}/upload  Upload audio Speaking (multipart)
```

#### Kết quả & Review

```
GET    /student/submissions                    Lịch sử nộp bài
GET    /student/submissions/{id}               Chi tiết kết quả
GET    /student/submissions/{id}/grading-status Polling trạng thái chấm
GET    /student/submissions/{id}/answers       Từng câu trả lời + đáp án đúng
GET    /student/submissions/{id}/compare       So sánh với bài thi khác
GET    /student/progress                       Tiến độ học tập tổng thể
```

#### WebSocket (Real-time trong lúc thi)

```
POST   /student/websocket/connect              Kết nối WebSocket
POST   /student/websocket/answer               Lưu câu trả lời qua WS (throttle 180/phút)
POST   /student/websocket/reconnect            Reconnect sau mất mạng
POST   /student/websocket/sync-time            Đồng bộ thời gian
```

#### Luyện tập (Practice)

```
GET    /student/practice/topics                Danh sách topic luyện tập
GET    /student/practice/questions             Câu hỏi theo topic/skill/difficulty
GET    /student/practice/history               Lịch sử luyện tập
POST   /student/practice/sessions              Tạo session luyện tập
POST   /student/practice/sessions/{id}/answer  Trả lời trong session
POST   /student/practice/sessions/{id}/complete Hoàn thành session
GET    /student/practice/{id}                  Chi tiết session
POST   /student/practice/complete              Hoàn thành (+ gamification)
GET    /student/practice/{id}/result           Kết quả luyện tập
GET    /student/recommendations/practice       Gợi ý luyện tập
```

#### Gamification

```
GET    /student/gamification/overview          Tổng quan (coins, badges, streak)
GET    /student/gamification/coins             Lịch sử coins
GET    /student/gamification/badges            Huy hiệu
GET    /student/gamification/achievements      Thành tích + progress bar
GET    /student/gamification/stats             Thống kê
GET    /student/gamification/streak            Chuỗi ngày học
GET    /student/gamification/leaderboard       Bảng xếp hạng
```

#### Thông báo & Nhắc nhở

```
GET    /student/notifications                  Danh sách thông báo
PUT    /student/notifications/read-all         Đánh dấu đọc tất cả
PUT    /student/notifications/{id}/read        Đánh dấu đọc 1 thông báo
DELETE /student/notifications/{id}             Xóa thông báo
GET    /student/reminders                      Nhắc nhở từ giáo viên
PUT    /student/reminders/{id}/read            Đọc nhắc nhở
DELETE /student/reminders/{id}                 Bỏ qua nhắc nhở
```

#### Hồ sơ & Cài đặt

```
GET    /student/profile                        Hồ sơ học viên
PUT    /student/profile                        Cập nhật hồ sơ
POST   /student/profile/avatar                 Upload avatar
DELETE /student/profile/avatar                 Xóa avatar
PUT    /student/profile/password               Đổi mật khẩu
GET    /student/settings                       Cài đặt
PUT    /student/settings                       Cập nhật cài đặt
```

#### Khóa học & Lớp học

```
GET    /student/courses                        Khóa học đã đăng ký
GET    /student/courses/{id}                   Chi tiết khóa học
GET    /student/courses/{id}/materials         Tài liệu khóa học
GET    /student/classes                        Lớp học
GET    /student/classes/{id}                   Chi tiết lớp
GET    /student/schedule                       Lịch học
```

#### Analytics

```
GET    /student/analytics/overview             Tổng quan phân tích
GET    /student/analytics/skills               Phân tích theo kỹ năng
GET    /student/analytics/weaknesses           Điểm yếu cần cải thiện
GET    /student/analytics/history              Lịch sử điểm số
```

---

### 👑 Admin API (`/api/admin/*`)

#### Quản lý người dùng

```
GET    /admin/users                            Tất cả users
POST   /admin/users                            Tạo user
GET    /admin/users/export                     Xuất Excel
GET    /admin/users/locked                     Users bị khóa
POST   /admin/users/bulk-action                Hành động hàng loạt
POST   /admin/users/bulk-import                Import hàng loạt (Excel)
POST   /admin/users/{id}/change-role           Đổi role
POST   /admin/users/{id}/lock                  Khóa tài khoản
POST   /admin/users/{id}/unlock                Mở khóa
GET    /admin/users/{id}                       Chi tiết user
PUT    /admin/users/{id}                       Cập nhật
DELETE /admin/users/{id}                       Xóa
GET    /admin/roles/statistics                 Thống kê theo role
```

#### Thống kê hệ thống

```
GET    /admin/statistics/overview              Tổng quan hệ thống
GET    /admin/statistics/activity              Hoạt động người dùng
GET    /admin/reports/user-activity            Báo cáo hoạt động
```

#### Phân công lớp & giáo viên

```
GET    /admin/classes/assignments              Phân công lớp học
GET    /admin/classes/assignment-teachers      Giáo viên được phân công
PUT    /admin/classes/{id}/assign-teacher      Gán giáo viên cho lớp
GET    /admin/students/new-registrations       Đăng ký mới
GET    /admin/students/complaints              Khiếu nại của học viên
POST   /admin/students/complaints/{id}/resolve Xử lý khiếu nại
```

#### Kiểm duyệt nội dung

```
GET    /admin/posts                            Tất cả bài viết
GET    /admin/posts/pending                    Bài chờ duyệt
GET    /admin/posts/{id}                       Chi tiết bài
POST   /admin/posts/{id}/approve               Duyệt bài
POST   /admin/posts/{id}/reject                Từ chối
DELETE /admin/posts/{id}                       Xóa bài

GET    /admin/categories                       Danh mục
POST   /admin/categories                       Tạo danh mục
PUT    /admin/categories/{id}                  Cập nhật
DELETE /admin/categories/{id}                  Xóa
POST   /admin/courses                          Tạo khóa học (admin)
```

#### Kiểm duyệt đề thi

```
GET    /admin/exams                            Tất cả đề thi
GET    /admin/exams/pending                    Đề chờ duyệt
GET    /admin/exams/statistics                 Thống kê đề thi
GET    /admin/exams/{id}                       Chi tiết đề
POST   /admin/exams/{id}/approve               Duyệt đề
POST   /admin/exams/{id}/reject                Từ chối
DELETE /admin/exams/{id}                       Xóa
```

#### Exam Templates (Admin)

```
GET    /admin/exam-templates                   Tất cả templates
POST   /admin/exam-templates                   Tạo template
PUT    /admin/exam-templates/{id}              Cập nhật
DELETE /admin/exam-templates/{id}              Xóa
POST   /admin/exam-templates/{id}/activate     Kích hoạt
POST   /admin/exam-templates/{id}/deactivate   Vô hiệu hóa
GET    /admin/templates/statistics             Thống kê templates
GET    /admin/content/statistics               Thống kê nội dung
```

#### Cài đặt & Báo cáo hệ thống

```
GET    /admin/system/settings                  Cài đặt hệ thống
POST   /admin/system/settings                  Cập nhật cài đặt
GET    /admin/system/notifications             Thông báo admin
POST   /admin/system/notifications/{id}/read   Đánh dấu đọc

GET    /admin/reports/dashboard                Dashboard báo cáo
GET    /admin/reports/users                    Thống kê user
GET    /admin/reports/courses                  Thống kê khóa học
GET    /admin/reports/activity                 Báo cáo hoạt động
GET    /admin/reports/trends                   Phân tích xu hướng
GET    /admin/reports/export                   Xuất báo cáo
```

---

### 🏗️ Controllers Map

| Controller | Route prefix | Chức năng |
|-----------|-------------|-----------|
| `AuthController` | `/api` | Login, logout, refresh, reset password |
| `UserController` | `/api/teacher, /api/admin` | CRUD students/users, export, bulk import |
| `ClassController` | `/api/teacher/classes` | Quản lý lớp học |
| `CourseController` | `/api/teacher/courses` | Quản lý khóa học |
| `ExamController` | `/api/teacher/exams` | VSTEP/IELTS exam CRUD + publish |
| `KidsExamController` | `/api/teacher/kids-exams` | Đề thi thiếu nhi (22 task types) |
| `ExamTemplateController` | `/api/teacher/exam-templates` | Cambridge templates |
| `ExamImportController` | `/api/teacher/exams/import` | Import từ JSON AI |
| `TestAssignmentController` | `/api/teacher/assignments` | Giao bài cho lớp/học viên |
| `GradingController` | `/api/teacher/submissions` | Chấm bài |
| `TeacherDashboardController` | `/api/teacher/dashboard` | Dashboard giáo viên |
| `TeacherReportController` | `/api/teacher/reports` | Báo cáo học tập |
| `MonitoringController` | `/api/teacher/dashboard` | Giám sát thi real-time |
| `PracticeController` | `/api/teacher/practice-sessions` | Buổi luyện tập |
| `BlogController` | `/api/teacher/blogs` | CMS bài viết |
| `AgeGroupContentController` | `/api/teacher/content` | Age-group content |
| `StudentTestController` | `/api/student/tests` | Học viên làm bài thi |
| `StudentPracticeController` | `/api/student/practice` | Luyện tập tự do |
| `StudentGamificationController` | `/api/student/gamification` | Coins, badges, streaks |
| `StudentProfileController` | `/api/student/profile` | Hồ sơ học viên |
| `StudentCourseController` | `/api/student/courses` | Khóa học, lớp học |
| `StudentAnalyticsController` | `/api/student/analytics` | Phân tích kết quả |
| `TestWebSocketController` | `/api/student/websocket` | Real-time khi thi |
| `AdminSystemController` | `/api/admin/system` | Cài đặt hệ thống |
| `SystemReportController` | `/api/admin/reports` | Báo cáo admin |
| `PushController` | `/api/push` | Web Push notifications |
| `AddressProxyController` | `/api/address` | Proxy địa chỉ hành chính |
| `FileUploadController` | `/api/teacher/upload` | Upload audio/image |

---

## 🗄️ Database Schema — VSTEP Full 4 Skills

### Sơ đồ quan hệ (ERD tóm tắt)

```
exams (1) ──────────────────── (N) questions
  │                                    │
  │                                    └── (N) answers  [MCQ options]
  │
  └── (N) content_blocks       [passage / audio / image]
              │
              └── (N) questions  [linked via content_block_id]

test_assignments (N) ─── (1) exams
      │
      └── (N) submissions (học viên làm bài)
                  │
                  └── (N) submission_answers
```

---

### Table: `exams` — Đề thi

```sql
exams
├── eId                   BIGINT PK AUTO_INCREMENT
├── exam_type_id          BIGINT FK → exam_types.etId  (nullable)
├── template_id           BIGINT FK → exam_templates   (nullable)
├── exam_code             VARCHAR                       (nullable)
├── eTitle                VARCHAR  NOT NULL
├── eDescription          TEXT     (nullable)
├── eDifficulty_level     VARCHAR  (nullable)           -- B1, B2, C1...
├── eTarget_level         VARCHAR  (nullable)
├── eDuration             INT      (nullable)           -- phút (alias mới)
├── eDuration_minutes     INT      DEFAULT 60           -- phút (field gốc)
├── eTotal_score          DECIMAL(5,2) (nullable)
├── ePass_score           DECIMAL(5,2) (nullable)
│
├── eType      ENUM('VSTEP','IELTS','GENERAL','STARTERS','MOVERS','FLYERS','KIDS')
├── eSkill     ENUM('listening','reading','writing','speaking','mixed')
│               ↳ 'mixed' = đề thi VSTEP đầy đủ 4 kỹ năng
│
├── eStatus      VARCHAR  DEFAULT 'draft'               -- draft | published | archived
├── eVisibility  VARCHAR  DEFAULT 'private'             -- private | public
├── eIs_private  BOOLEAN  DEFAULT true
├── eSource_type ENUM('manual','upload') DEFAULT 'manual'
├── ePurpose     VARCHAR  (nullable)
├── eTopic       VARCHAR  (nullable)
├── eDifficulty  VARCHAR  (nullable)
├── eTags        JSON     (nullable)
│
├── eTeacher_id        BIGINT FK → users.uId  (owner)
├── teacher_id         BIGINT FK → users.uId  (nullable, alias)
├── eParent_exam_id    BIGINT FK → exams.eId  (nullable — cloned from)
│
└── eCreated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

---

### Table: `content_blocks` — Khối nội dung dùng chung

> Dùng để gắn **passage / audio / image** vào nhiều câu hỏi cùng lúc (thay vì lặp lại trong từng question)

```sql
content_blocks
├── id             BIGINT PK AUTO_INCREMENT
├── exam_id        BIGINT FK → exams.eId  CASCADE DELETE
│
├── block_type     VARCHAR(50)
│   └── VALUES: 'passage' | 'audio' | 'video' | 'image' | 'instruction'
│
├── content        TEXT     (nullable)   -- nội dung chính hoặc URL
├── metadata       JSON     (nullable)   -- {title, duration, transcript, word_count...}
├── display_order  INT      DEFAULT 0
│
├── created_at, updated_at
│
INDEX: (exam_id, display_order), (block_type)
```

**metadata examples:**
```json
// audio block
{ "duration": 120, "transcript": "...", "part": 1, "section": 2 }

// passage block
{ "title": "Climate Change", "word_count": 420, "part": 3 }
```

---

### Table: `questions` — Câu hỏi

```sql
questions
├── qId               BIGINT PK AUTO_INCREMENT
├── qOrder            INT      DEFAULT 0        -- thứ tự hiển thị
├── qPartNumber       INT      DEFAULT 1        -- số Part (1,2,3...)
├── qPart             INT      (nullable)       -- part VSTEP (1=L, 2=R, 3=W, 4=S)
├── qSubPart          INT      (nullable)       -- sub-part Cambridge YLE
├── qCustomTitle      VARCHAR  (nullable)       -- tên part tùy chỉnh
├── qSkillSection     VARCHAR(50) (nullable)    -- 'listening' | 'reading' | 'writing' | 'speaking'
├── qSkill            VARCHAR(50) (nullable)    -- alias của qSection
│
├── exam_id           BIGINT FK → exams.eId  CASCADE DELETE
├── content_block_id  BIGINT FK → content_blocks.id  (nullable)
│   └── linking question đến passage/audio dùng chung
│
├── qType  ENUM (24 loại):
│   -- Chung
│   ├── 'multiple_choice'          MCQ 4 đáp án A/B/C/D
│   ├── 'fill_blank'               Điền vào chỗ trống
│   ├── 'true_false'               Đúng / Sai
│   ├── 'matching'                 Nối cột
│   ├── 'matching_lines'           Nối đường
│   ├── 'short_answer'             Trả lời ngắn
│   ├── 'essay'                    Tự luận dài
│   -- VSTEP Listening
│   ├── 'listening_announcement'   Part 1 — Thông báo
│   ├── 'listening_dialogue'       Part 2 — Hội thoại
│   ├── 'listening_lecture'        Part 3 — Bài giảng
│   -- VSTEP Reading
│   ├── 'reading_inference'        Suy luận từ đoạn văn
│   ├── 'reading_main_idea'        Ý chính đoạn văn
│   ├── 'reading_vocabulary'       Từ vựng trong ngữ cảnh
│   ├── 'multiple_choice_cloze'    Điền vào đoạn văn (MCQ)
│   ├── 'open_cloze'               Điền vào đoạn văn (tự viết)
│   -- VSTEP Writing
│   ├── 'short_writing'            Writing Task 1 (≥150 từ)
│   ├── 'information_transfer'     Chuyển thông tin
│   -- VSTEP Speaking
│   ├── 'speaking_interaction'     Part 1 — Social Interaction
│   ├── 'speaking_solution'        Part 2 — Solution Discussion
│   ├── 'speaking_topic'           Part 3 — Topic Development
│   ├── 'speaking_identification'  Nhận biết
│   ├── 'speaking_comparison'      So sánh
│   -- Cambridge Kids
│   ├── 'coloring'                 Tô màu
│   └── 'word_completion'          Hoàn thành từ
│
├── qContent          TEXT  NOT NULL      -- đề bài / câu hỏi
├── qData             JSON  (nullable)    -- flexible data: options, correct_answer, rubric...
├── qConfig           JSON  (nullable)    -- cấu hình bổ sung theo type
│
├── qSection          VARCHAR(50)  (nullable)   -- 'Part 1', 'Reading'...
├── qSection_order    INT          (nullable)
├── qDifficulty       ENUM('easy','medium','hard') DEFAULT 'medium'
├── qTags             JSON         (nullable)    -- ['grammar','vocabulary'...]
│
│   -- Media & Audio
├── qMedia_url        VARCHAR      (nullable)    -- URL audio / image
├── qAudio_duration   INT          (nullable)    -- giây
├── qAudio_type       VARCHAR(50)  (nullable)    -- 'announcement' | 'dialogue' | 'lecture'
├── qPlay_limit       INT          DEFAULT 2     -- số lần nghe tối đa
├── qTranscript_available BOOLEAN  DEFAULT true
├── qTranscript       TEXT         (nullable)    -- script audio
│
│   -- Writing / Speaking
├── qPassage_text     TEXT  (nullable)   -- đoạn văn đọc (Reading)
├── qWord_count       INT   (nullable)   -- số từ yêu cầu (Writing)
├── qTime_limit       INT   (nullable)   -- thời gian giây (Speaking)
├── qWeight           DECIMAL(5,2) (nullable) -- trọng số chấm điểm
│
├── qPoints           INT    DEFAULT 1   -- điểm tối đa câu này
├── qExplanation      TEXT   (nullable)  -- giải thích đáp án
├── qListen_limit     INT    DEFAULT 1   -- (legacy, dùng qPlay_limit)
│
└── qCreated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP

INDEX: (exam_id, qOrder)  idx_exam_order
INDEX: (exam_id, qSkillSection)  idx_exam_skill
```

**qData JSON examples:**
```json
// MCQ question
{
  "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
  "correct_answer": "B"
}

// Speaking Part 1 (Social Interaction)
{
  "topics": [
    { "id": "t1", "topicName": "Family", "questions": ["Q1", "Q2", "Q3"] }
  ]
}

// Speaking Part 2 (Solution Discussion)
{
  "situation": "You need to choose a gift...",
  "solutions": ["Option A", "Option B", "Option C"],
  "question": "Which would you choose and why?"
}

// Speaking Part 3 (Topic Development)
{
  "mainTopic": "Environmental Problems",
  "suggestedIdeas": ["pollution", "deforestation", "climate change", "waste"],
  "followUpQuestions": ["What causes this?", "How can we solve it?"]
}

// Writing Task
{
  "prompt": "Write a letter to...",
  "min_words": 150,
  "max_words": 200,
  "rubric": ["Task Achievement", "Coherence", "Vocabulary", "Grammar"]
}
```

---

### Table: `answers` — Đáp án MCQ

```sql
answers
├── aId           BIGINT PK AUTO_INCREMENT
├── question_id   BIGINT FK → questions.qId  CASCADE DELETE
├── aContent      TEXT     (nullable)   -- nội dung đáp án
└── aIs_correct   BOOLEAN  DEFAULT false
```

> ⚠️ Chỉ dùng cho MCQ. Writing/Speaking lưu đáp án trong `qData.correct_answer` hoặc `submission_answers.saAnswer_text`

---

### Table: `submissions` — Bài làm học viên

```sql
submissions
├── sId                      BIGINT PK AUTO_INCREMENT
├── user_id                  BIGINT FK → users.uId
├── exam_id                  BIGINT FK → exams.eId
├── assignment_id            BIGINT FK → test_assignments.taId  (nullable)
│                            └── NULL = thi trực tiếp không qua giao bài
│
├── sAttempt                 INT        -- lần thi thứ mấy
├── sStart_time              DATETIME
├── sSubmit_time             DATETIME   (nullable)
├── sGraded_time             DATETIME   (nullable)
├── teacher_reviewed_at      DATETIME   (nullable)
│
├── sStatus  ENUM:
│   ├── 'in_progress'          đang thi
│   ├── 'submitted'            đã nộp, chưa chấm
│   ├── 'partially_graded'     L+R tự động xong, W+S chờ teacher
│   ├── 'grading_subjective'   AI đang chấm W+S
│   ├── 'graded'               đã chấm xong hoàn toàn
│   └── 'auto_submitted'       hết giờ tự nộp
│
├── sScore                   DECIMAL(5,2)  (nullable)  -- điểm tổng
├── sTeacher_feedback        TEXT          (nullable)  -- nhận xét giáo viên
├── sGemini_feedback         TEXT          (nullable)  -- nhận xét AI (Groq)
├── sTime_taken              INT           (nullable)  -- giây đã dùng
└── submit_idempotency_key   VARCHAR       (nullable)  -- chống nộp 2 lần
```

---

### Table: `submission_answers` — Từng câu trả lời

```sql
submission_answers
├── saId                BIGINT PK AUTO_INCREMENT
├── submission_id       BIGINT FK → submissions.sId  CASCADE DELETE
├── question_id         BIGINT FK → questions.qId    CASCADE DELETE
│
├── saAnswer_text       TEXT       (nullable)
│   ├── MCQ:     'A' | 'B' | 'C' | 'D'  (hoặc answer_id)
│   ├── Writing: nội dung bài viết đầy đủ
│   └── Speaking: URL file audio .webm
│
├── saIs_correct        BOOLEAN    (nullable)  -- auto-graded MCQ
├── saPoints_awarded    DECIMAL(5,2) (nullable) -- điểm từng câu
└── saTeacher_feedback  TEXT       (nullable)  -- nhận xét từng câu
```

---

### VSTEP — Mapping qType theo kỹ năng

| Kỹ năng | Part | qType | qAudio_type | qPartNumber |
|---------|------|-------|-------------|-------------|
| **Listening** | Part 1 | `listening_announcement` | `announcement` | 1 |
| **Listening** | Part 2 | `listening_dialogue` | `dialogue` | 2 |
| **Listening** | Part 3 | `listening_lecture` | `lecture` | 3 |
| **Reading** | Part 1–4 | `multiple_choice` / `reading_*` | — | 1–4 |
| **Writing** | Task 1 | `short_writing` | — | 1 |
| **Writing** | Task 2 | `essay` | — | 2 |
| **Speaking** | Part 1 | `speaking_interaction` | — | 1 |
| **Speaking** | Part 2 | `speaking_solution` | — | 2 |
| **Speaking** | Part 3 | `speaking_topic` | — | 3 |

---

### Câu hỏi liên kết audio (Listening)

```
content_blocks
  block_type = 'audio'
  content    = 'https://cdn/.../audio.mp3'
  metadata   = { part: 1, section: 3, duration: 45, transcript: '...' }
       │
       └──(FK content_block_id)──► questions (8 câu MCQ của section đó)
                                     qType = 'listening_announcement'
                                     qAudio_type = 'announcement'
                                     qSkillSection = 'listening'
                                     qPartNumber = 1
```

---

## 🔑 Middleware & Auth

```
auth:sanctum          → Tất cả route cần đăng nhập
role:teacher          → Chỉ giáo viên (/api/teacher/*)
role:student          → Chỉ học viên (/api/student/*)
role:admin            → Chỉ admin (/api/admin/*)
admin                 → Admin sub-functions trong teacher route
throttle:120,1        → Lưu câu trả lời (120 req/phút)
throttle:30,1         → Nộp bài (30 req/phút)
```

---

## 🎮 Gamification System

```
Học viên nhận coins khi:
- Hoàn thành bài thi
- Hoàn thành buổi luyện tập
- Duy trì streak (học ngày liên tiếp)

Badges: tự động unlock khi đạt milestone
Achievements: progress bar (từng bước đạt)
Leaderboard: xếp hạng theo điểm/coins
```

---

## 📋 Còn cần làm / Known Issues

- [ ] IELTS full test flow (chỉ có VSTEP full, IELTS đang là skills riêng lẻ)
- [ ] Kids exam real-time monitoring
- [ ] Certificate generation sau khi thi xong
- [ ] Offline mode / answer sync khi mất mạng
- [ ] Speaking audio playback trong result review

---

*Cập nhật: 19/05/2026*
