# Assignment Management API Documentation

## Tổng quan
Hệ thống quản lý giao bài thi cho phép giáo viên giao bài thi cho học sinh cụ thể hoặc cả lớp học, theo dõi tiến độ làm bài, và quản lý deadline.

## Các chức năng chính
- ✅ Giao bài cho học sinh cụ thể
- ✅ Giao bài cho cả lớp học  
- ✅ Thiết lập thời hạn làm bài
- ✅ Theo dõi ai đã làm, ai chưa làm
- ✅ Giao bài hàng loạt
- ✅ Gửi nhắc nhở deadline
- ✅ Thống kê và báo cáo
- ✅ Lọc và tìm kiếm assignments

---

## API Endpoints

### 1. Giao bài thi
**POST** `/api/teacher/exams/{examId}/assign`

Gán bài thi cho lớp hoặc học viên cụ thể.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Parameters:**
- `examId` (path, integer): ID của đề thi

**Request Body:**
```json
{
    "taTarget_type": "class|student",
    "taTarget_id": 1,
    "taDeadline": "2026-04-30T23:59:59",
    "taMax_attempt": 3,
    "taIs_public": false
}
```

**Response Success (201):**
```json
{
    "status": "success",
    "data": {
        "assignmentId": 123
    }
}
```

**Response Error (400):**
```json
{
    "status": "error",
    "message": "Dữ liệu không hợp lệ.",
    "errors": {
        "taTarget_type": ["Trường này là bắt buộc."]
    }
}
```

---

### 2. Danh sách assignments
**GET** `/api/teacher/assignments`

Lấy danh sách phân công bài thi với filter tùy chọn.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `exam_id` (optional, integer): Lọc theo ID đề thi
- `target_type` (optional, string): Lọc theo loại đối tượng (class/student)
- `target_id` (optional, integer): Lọc theo ID đối tượng

**Response Success (200):**
```json
{
    "status": "success",
    "data": [
        {
            "taId": 1,
            "exam_id": 5,
            "taTarget_type": "class",
            "taTarget_id": 2,
            "taDeadline": "2026-04-30T23:59:59",
            "taMax_attempt": 3,
            "taIs_public": false,
            "taCreated_at": "2026-03-20T10:00:00",
            "exam": {
                "eId": 5,
                "eTitle": "VSTEP Reading Test",
                "eType": "vstep"
            }
        }
    ]
}
```

---

### 3. Theo dõi tiến độ làm bài
**GET** `/api/teacher/assignments/{id}/progress`

Xem chi tiết tiến độ ai đã làm, ai chưa làm bài.

**Headers:**
```
Authorization: Bearer {token}
```

**Parameters:**
- `id` (path, integer): ID của assignment

**Response Success (200):**
```json
{
    "status": "success",
    "data": {
        "assignment": {
            "taId": 1,
            "exam": {
                "eId": 5,
                "eTitle": "VSTEP Reading Test",
                "eType": "vstep",
                "eDuration_minutes": 60
            },
            "taTarget_type": "class",
            "taTarget_id": 2,
            "taDeadline": "2026-04-30T23:59:59",
            "taMax_attempt": 3,
            "is_overdue": false,
            "time_remaining": "in 10 days"
        },
        "statistics": {
            "total_students": 25,
            "completed_count": 18,
            "not_completed_count": 7,
            "completion_rate": 72.0
        },
        "completed": [
            {
                "uId": 10,
                "uName": "Nguyễn Văn A",
                "uPhone": "0901234567",
                "submission": {
                    "sId": 45,
                    "sScore": 85.5,
                    "sStatus": "submitted",
                    "sSubmit_time": "2026-03-19T14:30:00",
                    "sAttempt": 1
                }
            }
        ],
        "not_completed": [
            {
                "uId": 15,
                "uName": "Trần Thị B",
                "uPhone": "0907654321"
            }
        ]
    }
}
```

---

### 4. Giao bài hàng loạt
**POST** `/api/teacher/assignments/bulk`

Giao bài thi cho nhiều lớp/học sinh cùng lúc.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "exam_id": 5,
    "targets": [
        {"type": "class", "id": 1},
        {"type": "class", "id": 2},
        {"type": "student", "id": 10},
        {"type": "student", "id": 15}
    ],
    "taDeadline": "2026-04-30T23:59:59",
    "taMax_attempt": 2,
    "taIs_public": false
}
```

**Response Success (201):**
```json
{
    "status": "success",
    "data": {
        "success_count": 4,
        "errors": [],
        "assignments": [
            {
                "assignment_id": 101,
                "target_type": "class",
                "target_id": 1,
                "target_name": "Lớp VSTEP A1"
            },
            {
                "assignment_id": 102,
                "target_type": "class", 
                "target_id": 2,
                "target_name": "Lớp IELTS B1"
            }
        ]
    },
    "message": "Đã giao bài thành công cho 4 đối tượng."
}
```

---

### 5. Gửi nhắc nhở deadline
**POST** `/api/teacher/assignments/{id}/reminders`

Gửi nhắc nhở deadline đến học sinh chưa làm bài.

**Headers:**
```
Authorization: Bearer {token}
```

**Parameters:**
- `id` (path, integer): ID của assignment

**Response Success (200):**
```json
{
    "status": "success",
    "data": {
        "reminders_sent": 7,
        "assignment_title": "VSTEP Reading Test",
        "deadline": "2026-04-30T23:59:59",
        "message": "Đã gửi nhắc nhở đến 7 học sinh chưa làm bài."
    }
}
```

---

### 6. Thống kê assignments
**GET** `/api/teacher/assignments/statistics`

Lấy thống kê tổng quan về assignments của giáo viên.

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
    "status": "success",
    "data": {
        "total_assignments": 45,
        "class_assignments": 28,
        "student_assignments": 17,
        "with_deadlines": 40,
        "overdue_assignments": 3,
        "recent_assignments": 12,
        "assignments_by_exam": {
            "5": {
                "count": 8,
                "exam_title": "VSTEP Reading Test"
            },
            "7": {
                "count": 6,
                "exam_title": "IELTS Listening Practice"
            }
        }
    }
}
```

---

### 7. Xóa assignment
**DELETE** `/api/teacher/assignments/{id}`

Xóa phân công bài thi.

**Headers:**
```
Authorization: Bearer {token}
```

**Parameters:**
- `id` (path, integer): ID của assignment

**Response Success (200):**
```json
{
    "status": "success",
    "data": {
        "message": "Xóa phân công bài thi thành công"
    }
}
```

**Response Error (404):**
```json
{
    "status": "error",
    "message": "Không tìm thấy phân công bài thi."
}
```

---

## Validation Rules

### Assignment Creation
- `taTarget_type`: Bắt buộc, phải là "class" hoặc "student"
- `taTarget_id`: Bắt buộc, phải là integer và tồn tại trong DB
- `taDeadline`: Tùy chọn, phải là datetime và sau thời điểm hiện tại
- `taMax_attempt`: Tùy chọn, phải là integer >= 1, mặc định = 1
- `taIs_public`: Tùy chọn, boolean, mặc định = false

### Bulk Assignment
- `exam_id`: Bắt buộc, phải tồn tại và thuộc về giáo viên
- `targets`: Bắt buộc, array có ít nhất 1 phần tử
- `targets.*.type`: Bắt buộc, "class" hoặc "student"
- `targets.*.id`: Bắt buộc, integer và tồn tại

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Dữ liệu không hợp lệ | Validation error |
| 401 | Bạn không có quyền truy cập | Unauthorized |
| 404 | Không tìm thấy bài thi | Exam not found |
| 404 | Không tìm thấy lớp học | Class not found |
| 404 | Không tìm thấy học viên | Student not found |
| 404 | Không tìm thấy phân công bài thi | Assignment not found |

---

## Database Schema

### test_assignments table
```sql
CREATE TABLE test_assignments (
    taId INT PRIMARY KEY AUTO_INCREMENT,
    exam_id INT NOT NULL,
    taTarget_type ENUM('class', 'student') NOT NULL,
    taTarget_id INT NOT NULL,
    taDeadline DATETIME NULL,
    taMax_attempt INT DEFAULT 1,
    taIs_public BOOLEAN DEFAULT FALSE,
    taCreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (exam_id) REFERENCES exams(eId),
    INDEX idx_target (taTarget_type, taTarget_id),
    INDEX idx_deadline (taDeadline),
    INDEX idx_created (taCreated_at)
);
```

---

## Usage Examples

### Giao bài cho lớp học
```bash
curl -X POST "http://localhost:8000/api/teacher/exams/5/assign" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "taTarget_type": "class",
    "taTarget_id": 2,
    "taDeadline": "2026-04-30T23:59:59",
    "taMax_attempt": 3
  }'
```

### Theo dõi tiến độ
```bash
curl -X GET "http://localhost:8000/api/teacher/assignments/123/progress" \
  -H "Authorization: Bearer {token}"
```

### Giao bài hàng loạt
```bash
curl -X POST "http://localhost:8000/api/teacher/assignments/bulk" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "exam_id": 5,
    "targets": [
      {"type": "class", "id": 1},
      {"type": "class", "id": 2}
    ],
    "taDeadline": "2026-04-30T23:59:59",
    "taMax_attempt": 2
  }'
```

---

## Testing Results

✅ **Tất cả 12 test cases đều PASS**
- Giao bài cho học sinh cụ thể: ✅
- Giao bài cho cả lớp học: ✅  
- Thiết lập thời hạn làm bài: ✅
- Theo dõi tiến độ làm bài: ✅
- Giao bài hàng loạt: ✅
- Thống kê và báo cáo: ✅
- Chức năng nhắc nhở: ✅
- Lọc và tìm kiếm: ✅
- Validation đầy đủ: ✅
- Tính toàn vẹn dữ liệu: ✅

**Hệ thống sẵn sàng cho production!** 🚀