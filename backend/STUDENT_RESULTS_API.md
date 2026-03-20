# 📊 API XEM KẾT QUẢ HỌC VIÊN - NAM THU EDU

## 🎯 Tổng quan chức năng

API này cung cấp đầy đủ các chức năng xem kết quả và phân tích tiến độ học tập cho học viên:

1. **Lịch sử tất cả bài thi đã làm**
2. **Xem điểm số chi tiết từng phần** 
3. **Theo dõi tiến độ học tập**
4. **Xem đáp án và giải thích**

---

## 📋 DANH SÁCH API ENDPOINTS

### 1. 📚 Lịch sử bài thi đã làm

**Endpoint:** `GET /api/student/submissions`

**Mô tả:** Lấy danh sách tất cả bài thi đã làm của học viên

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "sId": 1,
      "sScore": 85.5,
      "sStatus": "graded",
      "sSubmit_time": "2026-03-20T10:30:00Z",
      "sAttempt": 1,
      "exam": {
        "eId": 1,
        "eTitle": "VSTEP Sample Test",
        "eType": "VSTEP",
        "eSkill": "reading"
      },
      "assignment": {
        "taId": 1,
        "taDeadline": "2026-03-25T23:59:59Z"
      }
    }
  ]
}
```

---

### 2. 🔍 Chi tiết bài làm

**Endpoint:** `GET /api/student/submissions/{id}`

**Mô tả:** Xem chi tiết một bài làm cụ thể với điểm số và feedback

**Response:**
```json
{
  "status": "success",
  "data": {
    "sId": 1,
    "sScore": 85.5,
    "sStatus": "graded",
    "sTeacher_feedback": "Bài làm tốt, cần cải thiện phần ngữ pháp",
    "sGemini_feedback": "AI phân tích: Điểm mạnh ở từ vựng...",
    "exam": {
      "eTitle": "VSTEP Sample Test",
      "eDuration_minutes": 60
    },
    "answers": [
      {
        "question_id": 1,
        "saAnswer_text": "Câu trả lời của học viên",
        "saIs_correct": true,
        "saPoints_awarded": 10
      }
    ]
  }
}
```

---

### 3. ✅ Xem đáp án và giải thích

**Endpoint:** `GET /api/student/submissions/{id}/answers`

**Mô tả:** Xem đáp án đúng và giải thích chi tiết sau khi nộp bài

**Lưu ý:** Chỉ có thể xem sau khi nộp bài (sStatus != 'in_progress')

**Response:**
```json
{
  "status": "success",
  "data": {
    "submission_info": {
      "sId": 1,
      "sScore": 85.5,
      "exam_title": "VSTEP Sample Test"
    },
    "detailed_answers": [
      {
        "question": {
          "qId": 1,
          "qContent": "What is the main idea of the passage?",
          "qType": "multiple_choice",
          "qPoints": 10,
          "qExplanation": "Giải thích chi tiết về câu hỏi này...",
          "qSection": "Reading Comprehension"
        },
        "student_answer": {
          "saAnswer_text": "Option A",
          "saIs_correct": true,
          "saPoints_awarded": 10
        },
        "correct_answer": {
          "aContent": "Option A",
          "aIs_correct": true
        },
        "all_options": [
          {
            "aId": 1,
            "aContent": "Option A",
            "aIs_correct": true
          },
          {
            "aId": 2,
            "aContent": "Option B", 
            "aIs_correct": false
          }
        ],
        "analysis": {
          "is_correct": true,
          "points_earned": 10,
          "points_possible": 10
        }
      }
    ],
    "summary": {
      "total_questions": 20,
      "answered_questions": 20,
      "correct_answers": 17,
      "total_score": 85.5
    }
  }
}
```

---

### 4. 📈 Tiến độ học tập chi tiết

**Endpoint:** `GET /api/student/progress`

**Mô tả:** Phân tích toàn diện tiến độ học tập với thống kê và xu hướng

**Response:**
```json
{
  "status": "success",
  "data": {
    "overview": {
      "total_tests": 15,
      "average_score": 78.5,
      "highest_score": 95.0,
      "lowest_score": 65.0,
      "recent_score": 85.5,
      "improvement_trend": {
        "first_score": 65.0,
        "latest_score": 85.5,
        "difference": 20.5,
        "percentage": 31.54,
        "trend": "improving"
      },
      "consistency": {
        "standard_deviation": 8.2,
        "coefficient_of_variation": 10.4,
        "consistency_level": "high"
      },
      "grade_distribution": {
        "A": 3,
        "B": 8,
        "C": 4,
        "D": 0,
        "F": 0
      }
    },
    "trends": {
      "recent_scores": [
        {
          "date": "2026-03-15",
          "score": 82.0,
          "exam_title": "IELTS Reading Practice",
          "exam_type": "IELTS",
          "exam_skill": "reading"
        }
      ],
      "monthly_stats": [
        {
          "month": "2026-03",
          "month_name": "Mar 2026",
          "count": 5,
          "average_score": 83.2,
          "highest_score": 95.0,
          "improvement": {
            "trend": "improving",
            "percentage": 12.5
          }
        }
      ],
      "learning_velocity": {
        "velocity": 2.3,
        "trend": "improving"
      }
    },
    "skill_analysis": {
      "skills_breakdown": [
        {
          "skill": "reading",
          "skill_name": "Đọc",
          "count": 8,
          "average_score": 82.5,
          "highest_score": 95.0,
          "lowest_score": 70.0,
          "improvement": {
            "trend": "improving",
            "percentage": 15.2
          },
          "consistency": {
            "consistency_level": "high"
          },
          "recent_performance": 85.0,
          "mastery_level": "advanced"
        }
      ],
      "strongest_skills": [
        {
          "skill": "reading",
          "average_score": 82.5
        }
      ],
      "improvement_areas": [
        {
          "skill": "listening",
          "average_score": 72.3
        }
      ]
    },
    "type_analysis": [
      {
        "type": "VSTEP",
        "type_name": "VSTEP",
        "count": 6,
        "average_score": 80.2,
        "highest_score": 90.0,
        "difficulty_level": "medium"
      }
    ],
    "performance_insights": [
      {
        "type": "positive",
        "title": "Tiến bộ vượt trội",
        "message": "Điểm số gần đây của bạn cao hơn trung bình tổng thể 7.2 điểm."
      },
      {
        "type": "achievement",
        "title": "Chuỗi thành công",
        "message": "Bạn đã có 4 bài thi liên tiếp với điểm cao!"
      }
    ],
    "recommendations": [
      {
        "priority": "high",
        "title": "Tập trung cải thiện Nghe",
        "message": "Kỹ năng này cần được ưu tiên luyện tập thêm.",
        "action": "Làm thêm bài tập Nghe"
      }
    ]
  }
}
```

---

### 5. 🔄 So sánh kết quả

**Endpoint:** `GET /api/student/submissions/{id}/compare`

**Mô tả:** So sánh kết quả với lần làm trước và trung bình lớp

**Response:**
```json
{
  "status": "success",
  "data": {
    "current_submission": {
      "sId": 5,
      "sScore": 85.5,
      "sSubmit_time": "2026-03-20T10:30:00Z",
      "exam_title": "VSTEP Sample Test"
    },
    "comparison_with_previous": {
      "has_previous": true,
      "previous_score": 78.0,
      "current_score": 85.5,
      "score_difference": 7.5,
      "improvement_percentage": 9.62,
      "previous_date": "2026-03-10T14:20:00Z",
      "current_date": "2026-03-20T10:30:00Z",
      "time_between": "10 days ago"
    },
    "class_statistics": {
      "total_students": 25,
      "average_score": 76.8,
      "highest_score": 92.0,
      "lowest_score": 58.5,
      "median_score": 78.0
    },
    "ranking": {
      "position": 6,
      "total_students": 25,
      "percentile": 76.0,
      "better_than_percent": 76.0
    },
    "question_analysis": [
      {
        "question_id": 1,
        "current_correct": true,
        "previous_correct": false,
        "current_points": 10,
        "previous_points": 0,
        "improvement": 10
      }
    ],
    "all_attempts": [
      {
        "sId": 3,
        "sScore": 78.0,
        "sSubmit_time": "2026-03-10T14:20:00Z",
        "sAttempt": 1
      }
    ]
  }
}
```

---

## 🔐 Authentication & Authorization

Tất cả các endpoint đều yêu cầu:
- **Authentication:** Bearer token (Sanctum)
- **Authorization:** Role 'student'

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## ⚠️ Error Responses

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Bạn không có quyền truy cập."
}
```

### 403 Forbidden (cho endpoint answers)
```json
{
  "status": "error", 
  "message": "Bạn chỉ có thể xem đáp án sau khi nộp bài."
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Không tìm thấy bài làm."
}
```

---

## 🎯 Tính năng nổi bật

### ✅ Đã implement:
- ✅ Lịch sử bài thi đầy đủ
- ✅ Chi tiết điểm số từng câu
- ✅ Xem đáp án và giải thích
- ✅ Phân tích tiến độ học tập chi tiết
- ✅ So sánh với lần làm trước
- ✅ Thống kê theo kỹ năng và loại bài thi
- ✅ Xu hướng cải thiện
- ✅ Insights và recommendations
- ✅ Xếp hạng trong lớp
- ✅ Phân tích consistency
- ✅ Learning velocity

### 🚀 Tính năng nâng cao:
- 📊 Biểu đồ xu hướng điểm số
- 🎯 Phân tích điểm mạnh/yếu
- 🏆 Achievement system
- 📈 Dự đoán điểm số tương lai
- 🔔 Thông báo cải thiện
- 📱 Export báo cáo PDF

---

## 🛠️ Technical Implementation

### Services Used:
- **StudentProgressService:** Xử lý tính toán phức tạp
- **Eloquent ORM:** Database operations
- **Laravel Collections:** Data manipulation
- **Carbon:** Date/time handling

### Performance Optimizations:
- Eager loading relationships
- Efficient database queries
- Caching for heavy calculations
- Pagination for large datasets

---

Hệ thống xem kết quả đã hoàn thiện với đầy đủ tính năng phân tích và thống kê tiên tiến!