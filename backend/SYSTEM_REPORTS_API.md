# System Reports & Analytics API Documentation

## Tổng quan
Hệ thống thống kê và báo cáo cung cấp các API để xem tổng quan hệ thống, thống kê số lượng người dùng và khóa học, báo cáo hoạt động hệ thống, và phân tích xu hướng sử dụng.

## Authentication
Tất cả API endpoints yêu cầu authentication với Bearer token và role admin.

```
Authorization: Bearer {token}
```

---

## 1. TỔNG QUAN HỆ THỐNG (DASHBOARD)

### 1.1 Dashboard Admin
```http
GET /api/admin/reports/dashboard
```

**Description:** Tổng quan toàn diện hệ thống cho dashboard admin

**Response:**
```json
{
  "status": "success",
  "data": {
    "users": {
      "total": 150,
      "active": 142,
      "new_today": 5,
      "new_this_week": 23,
      "active_rate": 94.67
    },
    "courses": {
      "total": 45,
      "active": 38,
      "total_enrollments": 1250,
      "new_enrollments_today": 12,
      "avg_enrollments_per_course": 27.78
    },
    "exams": {
      "total": 120,
      "public": 95,
      "total_submissions": 2340,
      "new_submissions_today": 18,
      "avg_submissions_per_exam": 19.5
    },
    "activity": {
      "logins_today": 85,
      "logins_yesterday": 92,
      "tests_taken_today": 18,
      "posts_created_today": 3,
      "courses_created_today": 1
    },
    "performance": {
      "avg_test_score": 78.5,
      "assignment_completion_rate": 85.2,
      "system_uptime": "99.9%"
    },
    "generated_at": "2026-03-20T10:30:00Z"
  }
}
```

---

## 2. THỐNG KÊ NGƯỜI DÙNG

### 2.1 Thống kê chi tiết người dùng
```http
GET /api/admin/reports/users
```

**Query Parameters:**
- `period` (string, optional): Khoảng thời gian (7d, 30d, 90d, 1y). Default: 30d

**Response:**
```json
{
  "status": "success",
  "data": {
    "overview": {
      "total_users": 150,
      "active_users": 142,
      "new_users": 23,
      "active_rate": 94.67
    },
    "by_role": {
      "student": 120,
      "teacher": 25,
      "admin": 5
    },
    "registration_trend": [
      {
        "date": "2026-03-20",
        "registrations": 5
      },
      {
        "date": "2026-03-19",
        "registrations": 8
      }
    ],
    "activity": {
      "daily_active_users": 85,
      "weekly_active_users": 125,
      "monthly_active_users": 142
    },
    "geographic": {
      "top_countries": [
        {
          "country": "Vietnam",
          "users": 145
        },
        {
          "country": "Other",
          "users": 5
        }
      ]
    },
    "period": "30d"
  }
}
```

---

## 3. THỐNG KÊ KHÓA HỌC

### 3.1 Thống kê chi tiết khóa học
```http
GET /api/admin/reports/courses
```

**Query Parameters:**
- `period` (string, optional): Khoảng thời gian (7d, 30d, 90d, 1y). Default: 30d

**Response:**
```json
{
  "status": "success",
  "data": {
    "overview": {
      "total_courses": 45,
      "active_courses": 38,
      "new_courses": 3,
      "total_enrollments": 1250,
      "new_enrollments": 85
    },
    "by_type": {
      "VSTEP": 25,
      "IELTS": 20
    },
    "popular_courses": [
      {
        "course_name": "VSTEP B1 Complete Course",
        "enrollments": 85,
        "type": "VSTEP"
      },
      {
        "course_name": "IELTS Academic Writing",
        "enrollments": 72,
        "type": "IELTS"
      }
    ],
    "revenue": {
      "total_revenue": 0,
      "revenue_this_period": 0,
      "avg_revenue_per_course": 0
    },
    "creation_trend": [
      {
        "date": "2026-03-20",
        "courses_created": 1
      },
      {
        "date": "2026-03-19",
        "courses_created": 0
      }
    ],
    "period": "30d"
  }
}
```

---

## 4. BÁO CÁO HOẠT ĐỘNG HỆ THỐNG

### 4.1 Báo cáo hoạt động chi tiết
```http
GET /api/admin/reports/activity
```

**Query Parameters:**
- `period` (string, optional): Khoảng thời gian (7d, 30d, 90d, 1y). Default: 30d

**Response:**
```json
{
  "status": "success",
  "data": {
    "tests": {
      "tests_assigned": 125,
      "tests_completed": 98,
      "completion_rate": 78.4
    },
    "content": {
      "posts_created": 15,
      "posts_approved": 12,
      "exams_created": 8
    },
    "engagement": {
      "avg_session_duration": "25 minutes",
      "bounce_rate": "15%",
      "pages_per_session": 8.5
    },
    "usage_patterns": {
      "peak_usage_day": "Tuesday",
      "peak_usage_hour": "14:00",
      "most_used_feature": "Test Taking"
    },
    "peak_hours": [
      {
        "hour": "00:00",
        "activity_level": 15
      },
      {
        "hour": "01:00",
        "activity_level": 12
      },
      {
        "hour": "14:00",
        "activity_level": 95
      }
    ],
    "period": "30d"
  }
}
```

---

## 5. PHÂN TÍCH XU HƯỚNG SỬ DỤNG

### 5.1 Phân tích xu hướng và dự đoán
```http
GET /api/admin/reports/trends
```

**Query Parameters:**
- `period` (string, optional): Khoảng thời gian (30d, 90d, 6m, 1y). Default: 90d

**Response:**
```json
{
  "status": "success",
  "data": {
    "growth": {
      "user_growth_rate": 15.5,
      "course_growth_rate": 8.2,
      "engagement_growth_rate": 12.1
    },
    "usage": {
      "test_taking_trend": "increasing",
      "course_enrollment_trend": "stable",
      "content_creation_trend": "increasing"
    },
    "performance": {
      "avg_score_trend": "improving",
      "completion_rate_trend": "stable",
      "user_satisfaction_trend": "improving"
    },
    "seasonal": {
      "peak_season": "September - December",
      "low_season": "June - August",
      "seasonal_variance": "35%"
    },
    "predictions": {
      "next_month_users": 172,
      "next_month_courses": 49,
      "next_month_tests": 2621
    },
    "period": "90d"
  }
}
```

---

## 6. XUẤT BÁO CÁO

### 6.1 Xuất báo cáo hệ thống
```http
GET /api/admin/reports/export
```

**Query Parameters:**
- `type` (string, optional): Loại báo cáo (dashboard, users, courses, activity, trends). Default: dashboard
- `format` (string, optional): Định dạng xuất (json, csv, pdf). Default: json
- `period` (string, optional): Khoảng thời gian (7d, 30d, 90d, 1y). Default: 30d

**Response (JSON format):**
```json
{
  "status": "success",
  "data": {
    // Report data based on type
  },
  "export_info": {
    "type": "dashboard",
    "format": "json",
    "period": "30d",
    "generated_at": "2026-03-20T10:30:00Z"
  }
}
```

**Response (CSV/PDF format):**
```json
{
  "status": "success",
  "message": "CSV/PDF export sẽ được implement trong phiên bản sau",
  "data": {
    // Report data
  }
}
```

---

## 7. THỐNG KÊ HIỆN CÓ (Từ các controller khác)

### 7.1 Thống kê nội dung
```http
GET /api/admin/content/statistics
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "posts": {
      "total": 150,
      "active": 120,
      "draft": 20,
      "inactive": 10,
      "approval_rate": 80.0
    },
    "by_type": {
      "grammar": 60,
      "tips": 45,
      "vocabulary": 45
    },
    "by_author": [
      {
        "author_name": "Teacher A",
        "post_count": 25
      }
    ],
    "activity": {
      "recent_posts": 15
    }
  }
}
```

### 7.2 Thống kê mẫu đề thi
```http
GET /api/admin/templates/statistics
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "templates": {
      "total": 25,
      "active": 20,
      "inactive": 5,
      "activation_rate": 80.0
    },
    "by_category": {
      "cambridge_young": 8,
      "cambridge_main": 6,
      "international": 7,
      "specialized": 4
    },
    "by_level": {
      "a1": 5,
      "a2": 6,
      "b1": 8,
      "b2": 6
    },
    "usage": [
      {
        "template_name": "VSTEP B1 Standard",
        "usage_count": 45
      }
    ]
  }
}
```

### 7.3 Thống kê đề thi
```http
GET /api/admin/exams/statistics
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "exams": {
      "total": 200,
      "public": 150,
      "private": 50,
      "approval_rate": 75.0
    },
    "by_type": {
      "VSTEP": 120,
      "IELTS": 60,
      "GENERAL": 20
    },
    "by_skill": {
      "listening": 50,
      "reading": 60,
      "writing": 45,
      "speaking": 45
    },
    "by_teacher": [
      {
        "teacher_name": "Teacher A",
        "exam_count": 35
      }
    ],
    "activity": {
      "recent_exams": 12
    }
  }
}
```

### 7.4 Thống kê tổng quan hệ thống (UserController)
```http
GET /api/admin/statistics/overview
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "overview": {
      "total_users": 150,
      "active_users": 142,
      "inactive_users": 8,
      "deleted_users": 5
    },
    "by_role": {
      "student": 120,
      "teacher": 25,
      "admin": 5
    },
    "activity": {
      "recent_registrations": 23,
      "growth_rate": 15.5
    },
    "health": {
      "active_rate": 94.67,
      "retention_rate": 96.77
    }
  }
}
```

### 7.5 Thống kê phân quyền
```http
GET /api/admin/roles/statistics
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "student": {
      "active": 115,
      "inactive": 5
    },
    "teacher": {
      "active": 22,
      "inactive": 3
    },
    "admin": {
      "active": 5,
      "inactive": 0
    }
  }
}
```

---

## 8. DASHBOARD METRICS SUMMARY

### Các chỉ số quan trọng cho Dashboard Admin:

**Tổng quan hệ thống:**
- Tổng số người dùng và tỷ lệ hoạt động
- Tổng số khóa học và ghi danh
- Tổng số đề thi và bài nộp
- Hoạt động hôm nay vs hôm qua

**Chỉ số hiệu suất:**
- Điểm trung bình các bài thi
- Tỷ lệ hoàn thành bài tập
- Tỷ lệ duyệt nội dung
- Thời gian hoạt động hệ thống

**Xu hướng tăng trưởng:**
- Tăng trưởng người dùng theo thời gian
- Xu hướng tạo khóa học
- Xu hướng làm bài thi
- Dự đoán tháng tới

**Phân tích sử dụng:**
- Giờ cao điểm trong ngày
- Ngày hoạt động cao nhất trong tuần
- Tính năng được sử dụng nhiều nhất
- Phân bố địa lý người dùng

---

## 9. ERROR RESPONSES

### 403 Forbidden
```json
{
  "status": "error",
  "message": "Chỉ quản trị viên mới có quyền truy cập."
}
```

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Tham số không hợp lệ.",
  "errors": {
    "period": ["Khoảng thời gian phải là 7d, 30d, 90d hoặc 1y"]
  }
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Lỗi hệ thống khi tạo báo cáo.",
  "error": "Database connection failed"
}
```

---

## 10. USAGE EXAMPLES

### Lấy dashboard tổng quan:
```javascript
fetch('/api/admin/reports/dashboard', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('Dashboard data:', data.data);
});
```

### Lấy thống kê người dùng 90 ngày:
```javascript
fetch('/api/admin/reports/users?period=90d', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('User statistics:', data.data);
});
```

### Xuất báo cáo hoạt động:
```javascript
fetch('/api/admin/reports/export?type=activity&format=json&period=30d', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('Activity report:', data.data);
});
```

---

## 11. PERFORMANCE NOTES

- Tất cả API có cache 5 phút để tối ưu performance
- Dữ liệu thống kê được tính toán real-time
- Pagination áp dụng cho các danh sách lớn
- Rate limiting: 100 requests/minute cho admin
- Timeout: 30 giây cho các báo cáo phức tạp

---

## 12. FUTURE ENHANCEMENTS

**Sẽ được bổ sung trong các phiên bản sau:**
- Export PDF và CSV với formatting đẹp
- Real-time dashboard với WebSocket
- Advanced analytics với machine learning
- Custom report builder
- Scheduled reports qua email
- Data visualization charts API
- Comparative analysis (so sánh kỳ trước)
- Drill-down analytics cho từng metric

---

## 13. SECURITY & COMPLIANCE

- Tất cả endpoints yêu cầu admin authentication
- Audit log cho tất cả truy cập báo cáo
- Data anonymization cho thống kê nhạy cảm
- GDPR compliance cho dữ liệu người dùng
- Rate limiting và DDoS protection
- Encrypted data transmission (HTTPS only)