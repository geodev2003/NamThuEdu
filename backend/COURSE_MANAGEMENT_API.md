# 📚 API QUẢN LÝ KHÓA HỌC - NAM THU EDU

## 🎯 Tổng quan chức năng

API quản lý khóa học dành cho giáo viên với các tính năng:

1. **Tạo khóa học mới (VSTEP/IELTS)**
2. **Thiết lập thông tin: tên, mô tả, lịch học**
3. **Quản lý số lượng học sinh**
4. **Cập nhật và xóa khóa học**
5. **Quản lý enrollment học sinh**
6. **Thống kê và báo cáo**

---

## 📋 DANH SÁCH API ENDPOINTS

### 1. 📚 Quản lý khóa học cơ bản

#### **GET /api/teacher/courses**
Lấy danh sách khóa học của giáo viên với thống kê enrollment

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "cId": 1,
      "cName": "VSTEP B2 Intensive",
      "cCategory": 2,
      "cNumberOfStudent": 25,
      "cTime": "18:00-20:00",
      "cSchedule": "2,4,6",
      "cStartDate": "2026-04-01",
      "cEndDate": "2026-06-30",
      "cStatus": "active",
      "cDescription": "Khóa học VSTEP B2 chuyên sâu",
      "category": {
        "caId": 2,
        "caName": "VSTEP"
      },
      "enrollment_stats": {
        "current_students": 18,
        "max_students": 25,
        "available_slots": 7,
        "is_full": false
      }
    }
  ]
}
```

#### **POST /api/teacher/courses**
Tạo khóa học mới (chỉ VSTEP/IELTS)

**Request Body:**
```json
{
  "courseName": "IELTS Academic Writing",
  "numberOfStudent": 20,
  "time": "19:00-21:00",
  "category": 3,
  "schedule": "3,5,7",
  "startDate": "2026-04-15",
  "endDate": "2026-07-15",
  "description": "Khóa học IELTS Writing chuyên sâu",
  "courseType": "IELTS"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Tạo khóa học thành công",
  "data": {
    "courseId": 5,
    "courseName": "IELTS Academic Writing",
    "courseType": "IELTS",
    "maxStudents": 20,
    "status": "draft"
  }
}
```

#### **GET /api/teacher/courses/{id}**
Lấy chi tiết khóa học

#### **PUT /api/teacher/courses/{id}**
Cập nhật thông tin khóa học

#### **DELETE /api/teacher/courses/{id}**
Xóa khóa học (soft delete)

---

### 2. 👥 Quản lý học sinh trong khóa học

#### **GET /api/teacher/courses/{id}/students**
Lấy danh sách học sinh trong khóa học

**Response:**
```json
{
  "status": "success",
  "data": {
    "course_info": {
      "cId": 1,
      "cName": "VSTEP B2 Intensive",
      "cNumberOfStudent": 25
    },
    "enrollment_stats": {
      "total_enrolled": 18,
      "total_completed": 2,
      "total_dropped": 1,
      "available_slots": 7
    },
    "students": [
      {
        "enrollment_id": 1,
        "student": {
          "uId": 10,
          "uName": "Nguyễn Văn A",
          "uPhone": "0901234567"
        },
        "status": "enrolled",
        "enrolled_at": "2026-03-15T10:30:00Z",
        "fee_paid": 2500000,
        "notes": "Học sinh chuyển từ lớp khác"
      }
    ]
  }
}
```

#### **POST /api/teacher/courses/{id}/enroll**
Thêm học sinh vào khóa học

**Request Body:**
```json
{
  "student_id": 15,
  "fee_paid": 2500000,
  "notes": "Học sinh mới đăng ký"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Thêm học sinh vào khóa học thành công.",
  "data": {
    "enrollment_id": 25,
    "student_name": "Trần Thị B",
    "course_name": "VSTEP B2 Intensive",
    "enrolled_at": "2026-03-20T14:30:00Z",
    "current_students": 19,
    "available_slots": 6
  }
}
```

#### **DELETE /api/teacher/courses/{courseId}/students/{studentId}**
Xóa học sinh khỏi khóa học

**Response:**
```json
{
  "status": "success",
  "message": "Xóa học sinh khỏi khóa học thành công.",
  "data": {
    "student_id": 15,
    "course_id": 1,
    "new_status": "dropped"
  }
}
```

---

### 3. 📊 Thống kê và báo cáo

#### **GET /api/teacher/courses/{id}/statistics**
Lấy thống kê chi tiết khóa học

**Response:**
```json
{
  "status": "success",
  "data": {
    "course_info": {
      "cId": 1,
      "cName": "VSTEP B2 Intensive",
      "cStatus": "active",
      "category": {
        "caId": 2,
        "caName": "VSTEP"
      },
      "max_students": 25
    },
    "enrollment_stats": {
      "total_enrolled": 18,
      "total_completed": 2,
      "total_dropped": 1,
      "total_ever_enrolled": 21,
      "available_slots": 7,
      "occupancy_rate": 72.0
    },
    "enrollments_by_month": [
      {
        "month": "2026-03",
        "count": 15
      },
      {
        "month": "2026-04",
        "count": 6
      }
    ],
    "revenue_stats": {
      "total_revenue": 45000000,
      "average_fee": 2500000,
      "paid_students": 18
    },
    "course_progress": {
      "status": "active",
      "start_date": "2026-04-01",
      "end_date": "2026-06-30",
      "days_total": 90,
      "days_elapsed": 20,
      "days_remaining": 70,
      "progress_percentage": 22.22
    }
  }
}
```

---

## 🔐 Authentication & Authorization

Tất cả endpoints yêu cầu:
- **Authentication:** Bearer token (Sanctum)
- **Authorization:** Role 'teacher'
- **Ownership:** Chỉ quản lý khóa học của chính mình

---

## ⚠️ Business Rules

### **Tạo khóa học:**
- ✅ Chỉ hỗ trợ VSTEP và IELTS
- ✅ Số lượng học sinh: 1-100
- ✅ Ngày bắt đầu phải sau hôm nay
- ✅ Ngày kết thúc phải sau ngày bắt đầu
- ✅ Trạng thái mặc định: 'draft'

### **Enrollment:**
- ✅ Kiểm tra số lượng tối đa
- ✅ Không cho phép đăng ký trùng
- ✅ Chỉ student mới có thể được đăng ký
- ✅ Khóa học phải ở trạng thái 'active' hoặc 'draft'

### **Trạng thái khóa học:**
- **draft:** Khóa học mới tạo, chưa mở đăng ký
- **active:** Đang nhận đăng ký
- **ongoing:** Đang diễn ra
- **complete:** Đã hoàn thành

---

## 🎯 Tính năng nổi bật

### ✅ Đã implement:
- ✅ CRUD khóa học hoàn chỉnh
- ✅ Quản lý enrollment học sinh
- ✅ Thống kê chi tiết theo khóa học
- ✅ Validation chặt chẽ cho VSTEP/IELTS
- ✅ Soft delete bảo toàn dữ liệu
- ✅ Phân quyền bảo mật
- ✅ Theo dõi revenue và occupancy rate
- ✅ Thống kê theo thời gian
- ✅ Course progress tracking

### 🚀 Tính năng nâng cao:
- 📊 Dashboard tổng quan cho teacher
- 📈 Báo cáo xuất Excel/PDF
- 🔔 Notification khi khóa học sắp bắt đầu
- 📅 Calendar integration
- 💰 Payment tracking
- 📧 Email automation
- 📱 Mobile app support

---

## 🛠️ Technical Implementation

### **Database Schema:**
- **course:** Thông tin khóa học
- **course_enrollments:** Đăng ký học sinh
- **category:** Phân loại khóa học

### **Services:**
- **CourseManagementService:** Logic nghiệp vụ phức tạp
- **Validation:** Kiểm tra business rules
- **Statistics:** Tính toán thống kê

### **Security:**
- Role-based access control
- Ownership validation
- Input sanitization
- SQL injection prevention

---

## 📝 Error Handling

### **400 Bad Request:**
```json
{
  "status": "error",
  "message": "Khóa học đã đầy. Không thể thêm học sinh mới.",
  "current_students": 25,
  "max_students": 25
}
```

### **404 Not Found:**
```json
{
  "status": "error",
  "message": "Không tìm thấy khóa học."
}
```

### **403 Forbidden:**
```json
{
  "status": "error",
  "message": "Bạn không có quyền truy cập khóa học này."
}
```

---

Hệ thống quản lý khóa học đã hoàn thiện với đầy đủ tính năng cho VSTEP và IELTS!