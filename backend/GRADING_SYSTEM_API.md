# Grading System API Documentation

## Tổng quan
Hệ thống chấm điểm toàn diện cho phép giáo viên tự động chấm câu trắc nghiệm, chấm thủ công câu tự luận với nhận xét chi tiết, và xem báo cáo kết quả lớp học.

## Các chức năng chính
- ✅ **Tự động chấm câu trắc nghiệm** - Multiple choice, True/False, Fill-in-blank
- ✅ **Chấm thủ công câu tự luận** - Essay, Short answer với điểm và feedback
- ✅ **Thêm nhận xét chi tiết** - Feedback từng câu và tổng thể
- ✅ **Xem báo cáo kết quả lớp học** - Thống kê, phân tích, ranking
- ✅ **Thống kê và phân tích** - Hiệu suất theo đề thi, câu hỏi
- ✅ **Quản lý tiến độ chấm** - Theo dõi bài đã chấm/chưa chấm

---

## API Endpoints

### 1. Danh sách bài làm cần chấm
**GET** `/api/teacher/submissions`

Lấy danh sách bài làm của học sinh với filter tùy chọn.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `exam_id` (optional, integer): Lọc theo ID đề thi
- `student_id` (optional, integer): Lọc theo ID học sinh
- `status` (optional, string): Lọc theo trạng thái (submitted, graded, partially_graded)

**Response Success (200):**
```json
{
    "status": "success",
    "data": [
        {
            "sId": 123,
            "user_id": 45,
            "exam_id": 12,
            "sAttempt": 1,
            "sSubmit_time": "2026-03-20T14:30:00",
            "sScore": 85.5,
            "sStatus": "submitted",
            "user": {
                "uId": 45,
                "uName": "Nguyễn Văn A",
                "uPhone": "0901234567"
            },
            "exam": {
                "eId": 12,
                "eTitle": "VSTEP Reading Test",
                "eType": "vstep"
            }
        }
    ]
}
```

---

### 2. Chi tiết bài làm
**GET** `/api/teacher/submissions/{id}`

Xem chi tiết bài làm với tất cả câu trả lời của học sinh.

**Headers:**
```
Authorization: Bearer {token}
```

**Parameters:**
- `id` (path, integer): ID của submission

**Response Success (200):**
```json
{
    "status": "success",
    "data": {
        "sId": 123,
        "user": {
            "uId": 45,
            "uName": "Nguyễn Văn A"
        },
        "exam": {
            "eId": 12,
            "eTitle": "VSTEP Reading Test",
            "questions": [
                {
                    "qId": 1,
                    "qContent": "What is the main idea?",
                    "qPoints": 2.0,
                    "answers": [
                        {
                            "aId": 1,
                            "aContent": "Option A",
                            "aIs_correct": true
                        }
                    ]
                }
            ]
        },
        "answers": [
            {
                "saId": 456,
                "question_id": 1,
                "saAnswer_text": "Option A",
                "saIs_correct": true,
                "saPoints_awarded": 2.0,
                "saTeacher_feedback": "Correct answer!",
                "question": {
                    "qId": 1,
                    "qContent": "What is the main idea?",
                    "qPoints": 2.0
                }
            }
        ],
        "sScore": 85.5,
        "sStatus": "graded",
        "sTeacher_feedback": "{\"overall_feedback\":\"Good work\",\"strengths\":[\"Clear understanding\"],\"improvements\":[\"More details needed\"]}"
    }
}
```

---

### 3. Tự động chấm câu trắc nghiệm
**POST** `/api/teacher/submissions/{id}/auto-grade`

Tự động chấm các câu trắc nghiệm, True/False, Fill-in-blank.

**Headers:**
```
Authorization: Bearer {token}
```

**Parameters:**
- `id` (path, integer): ID của submission

**Response Success (200):**
```json
{
    "status": "success",
    "data": {
        "submissionId": 123,
        "auto_graded_questions": 15,
        "manual_grading_required": 3,
        "current_score": 78.5,
        "status": "partially_graded",
        "message": "Đã tự động chấm 15 câu trắc nghiệm. Còn 3 câu cần chấm thủ công."
    }
}
```

---

### 4. Chấm thủ công với nhận xét chi tiết
**POST** `/api/teacher/submissions/{id}/detailed-grade`

Chấm từng câu với điểm số và feedback chi tiết.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Parameters:**
- `id` (path, integer): ID của submission

**Request Body:**
```json
{
    "question_grades": [
        {
            "question_id": 1,
            "points_awarded": 1.5,
            "feedback": "Good answer but could be more detailed",
            "is_correct": true
        },
        {
            "question_id": 2,
            "points_awarded": 0.5,
            "feedback": "Partially correct, missing key points",
            "is_correct": false
        }
    ],
    "overall_feedback": "Overall good performance with room for improvement",
    "strengths": [
        "Clear writing style",
        "Good grammar",
        "Logical structure"
    ],
    "improvements": [
        "Add more specific examples",
        "Expand vocabulary",
        "Improve conclusion"
    ]
}
```

**Response Success (200):**
```json
{
    "status": "success",
    "data": {
        "submissionId": 123,
        "final_score": 82.5,
        "questions_graded": 2,
        "detailed_feedback": {
            "overall_feedback": "Overall good performance with room for improvement",
            "strengths": ["Clear writing style", "Good grammar", "Logical structure"],
            "improvements": ["Add more specific examples", "Expand vocabulary", "Improve conclusion"],
            "graded_by": "Nguyễn Thị Giáo Viên",
            "graded_at": "2026-03-20T15:30:00Z"
        },
        "message": "Chấm điểm chi tiết hoàn tất"
    }
}
```

---

### 5. Chấm điểm cơ bản (Legacy)
**POST** `/api/teacher/submissions/{id}/grade`

Chấm điểm cơ bản với feedback tổng thể.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "sTeacher_feedback": "Good work overall, keep it up!",
    "questionScores": [
        {
            "question_id": 1,
            "saPoints_awarded": 2.0
        },
        {
            "question_id": 2,
            "saPoints_awarded": 1.5
        }
    ]
}
```

**Response Success (200):**
```json
{
    "status": "success",
    "data": {
        "submissionId": 123,
        "sScore": 87.5,
        "message": "Chấm điểm bài làm thành công"
    }
}
```

---

### 6. Báo cáo kết quả lớp học
**GET** `/api/teacher/classes/{classId}/report`

Xem báo cáo chi tiết kết quả của cả lớp học.

**Headers:**
```
Authorization: Bearer {token}
```

**Parameters:**
- `classId` (path, integer): ID của lớp học

**Query Parameters:**
- `exam_id` (optional, integer): Lọc theo đề thi cụ thể

**Response Success (200):**
```json
{
    "status": "success",
    "data": {
        "class": {
            "cId": 5,
            "cName": "Lớp VSTEP A1",
            "total_students": 25
        },
        "statistics": {
            "total_students": 25,
            "students_with_submissions": 23,
            "participation_rate": 92.0,
            "average_score": 78.5,
            "highest_score": 95.0,
            "lowest_score": 45.0,
            "pass_rate": 82.6,
            "score_distribution": {
                "90-100": 5,
                "80-89": 8,
                "70-79": 6,
                "60-69": 3,
                "0-59": 1
            }
        },
        "exam_performance": [
            {
                "exam_id": 12,
                "exam_title": "VSTEP Reading Test",
                "exam_type": "vstep",
                "submissions_count": 23,
                "average_score": 78.5,
                "highest_score": 95.0,
                "lowest_score": 45.0,
                "pass_rate": 82.6
            }
        ],
        "student_rankings": [
            {
                "student_id": 45,
                "student_name": "Nguyễn Văn A",
                "submissions_count": 3,
                "average_score": 92.5,
                "highest_score": 95.0,
                "total_points": 277.5
            }
        ],
        "question_analysis": [
            {
                "question_id": 1,
                "question_text": "What is the main idea?",
                "total_attempts": 23,
                "correct_attempts": 18,
                "success_rate": 78.26,
                "average_score": 1.56
            }
        ],
        "generated_at": "2026-03-20T15:30:00Z"
    }
}
```

---

### 7. Thống kê chấm điểm tổng quan
**GET** `/api/teacher/grading/statistics`

Lấy thống kê tổng quan về hoạt động chấm điểm của giáo viên.

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
    "status": "success",
    "data": {
        "total_submissions": 150,
        "graded_submissions": 120,
        "pending_submissions": 30,
        "grading_completion_rate": 80.0,
        "scores_by_exam_type": {
            "vstep": {
                "count": 80,
                "average_score": 75.5,
                "highest_score": 98.0,
                "lowest_score": 35.0
            },
            "ielts": {
                "count": 40,
                "average_score": 72.3,
                "highest_score": 95.0,
                "lowest_score": 42.0
            }
        },
        "recent_grading_activity": 25,
        "average_grading_time": 45.5
    }
}
```

---

## Validation Rules

### Auto-Grading
- Chỉ áp dụng cho: `multiple_choice`, `true_false_not_given`, `yes_no_not_given`, `fill_blank`
- Submission phải có status `submitted` hoặc `partially_graded`
- Giáo viên phải sở hữu đề thi

### Detailed Grading
- `question_grades`: Bắt buộc, array có ít nhất 1 phần tử
- `question_grades.*.question_id`: Bắt buộc, integer, phải tồn tại
- `question_grades.*.points_awarded`: Bắt buộc, numeric >= 0
- `question_grades.*.feedback`: Tùy chọn, string
- `overall_feedback`: Tùy chọn, string
- `strengths`: Tùy chọn, array of strings
- `improvements`: Tùy chọn, array of strings

### Class Report
- `classId`: Phải tồn tại và có học sinh
- `exam_id`: Tùy chọn, phải thuộc về giáo viên

---

## Auto-Grading Logic

### Multiple Choice
```php
// Exact match (case-insensitive)
$isCorrect = (trim(strtolower($studentAnswer)) === trim(strtolower($correctAnswer)));
```

### Fill-in-Blank
```php
// Flexible matching (remove extra spaces)
$isCorrect = (str_replace(' ', '', strtolower($studentAnswer)) === 
              str_replace(' ', '', strtolower($correctAnswer)));
```

### True/False Questions
```php
// Exact match for boolean values
$isCorrect = ($studentAnswer === $correctAnswer);
```

---

## Score Calculation

### Individual Question
```php
$pointsAwarded = $isCorrect ? $question->qPoints : 0;
```

### Total Score (Percentage)
```php
$totalScore = ($totalPointsAwarded / $maxPossiblePoints) * 100;
```

### Pass/Fail Determination
```php
$isPassed = $totalScore >= 60; // 60% threshold
```

---

## Feedback Structure

### Individual Question Feedback
```json
{
    "question_id": 1,
    "points_awarded": 1.5,
    "feedback": "Good answer but could be more detailed",
    "is_correct": true
}
```

### Overall Detailed Feedback
```json
{
    "overall_feedback": "Good performance overall",
    "strengths": [
        "Clear writing style",
        "Good grammar"
    ],
    "improvements": [
        "Add more examples",
        "Expand vocabulary"
    ],
    "graded_by": "Teacher Name",
    "graded_at": "2026-03-20T15:30:00Z"
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Dữ liệu không hợp lệ | Validation error |
| 401 | Bạn không có quyền truy cập | Unauthorized |
| 404 | Không tìm thấy bài làm | Submission not found |
| 404 | Không tìm thấy lớp học | Class not found |
| 500 | Lỗi hệ thống khi chấm điểm | Internal server error |

---

## Database Schema Updates

### submission_answers table
```sql
ALTER TABLE submission_answers 
ADD COLUMN saTeacher_feedback TEXT NULL AFTER saPoints_awarded;
```

### submissions table
```sql
ALTER TABLE submissions 
ADD COLUMN sGraded_time DATETIME NULL AFTER sSubmit_time;
```

---

## Usage Examples

### Tự động chấm trắc nghiệm
```bash
curl -X POST "http://localhost:8000/api/teacher/submissions/123/auto-grade" \
  -H "Authorization: Bearer {token}"
```

### Chấm thủ công với feedback chi tiết
```bash
curl -X POST "http://localhost:8000/api/teacher/submissions/123/detailed-grade" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "question_grades": [
      {
        "question_id": 1,
        "points_awarded": 1.5,
        "feedback": "Good answer",
        "is_correct": true
      }
    ],
    "overall_feedback": "Well done!",
    "strengths": ["Clear writing"],
    "improvements": ["Add examples"]
  }'
```

### Xem báo cáo lớp học
```bash
curl -X GET "http://localhost:8000/api/teacher/classes/5/report?exam_id=12" \
  -H "Authorization: Bearer {token}"
```

---

## Testing Results

✅ **Tất cả 10 test cases đều PASS**
- Tự động chấm câu trắc nghiệm: ✅
- Chấm thủ công câu tự luận: ✅
- Thêm nhận xét chi tiết: ✅
- Xem báo cáo kết quả lớp học: ✅
- Thống kê và phân tích điểm: ✅
- Phân tích câu hỏi: ✅
- Hệ thống feedback đa cấp: ✅
- Tính toán điểm chính xác: ✅
- Validation đầy đủ: ✅
- Báo cáo chi tiết: ✅

**Hệ thống sẵn sàng cho production!** 🚀

---

## Performance Considerations

### Auto-Grading
- Xử lý batch để tối ưu performance
- Cache kết quả để tránh tính toán lại
- Async processing cho submissions lớn

### Class Reports
- Pagination cho lớp học lớn
- Cache thống kê trong 15 phút
- Lazy loading cho dữ liệu chi tiết

### Database Optimization
- Index trên `submission_id`, `question_id`
- Index trên `sStatus`, `sGraded_time`
- Optimize queries với proper joins

---

## Security Features

- **Role-based access**: Chỉ teacher mới được chấm điểm
- **Ownership validation**: Giáo viên chỉ chấm đề thi của mình
- **Input sanitization**: Validate tất cả input data
- **SQL injection prevention**: Sử dụng prepared statements
- **Rate limiting**: Giới hạn số request chấm điểm/phút