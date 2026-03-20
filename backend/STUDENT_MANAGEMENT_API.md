# API Quản Lý Học Sinh - Nam Thu Edu

## Tổng Quan

Hệ thống quản lý học sinh cung cấp đầy đủ các chức năng:
- ✅ Xem danh sách tất cả học sinh (với tìm kiếm, lọc, phân trang)
- ✅ Tạo tài khoản học sinh mới (đơn lẻ và hàng loạt)
- ✅ Cập nhật thông tin học sinh
- ✅ Theo dõi tiến độ học tập (analytics chi tiết)
- ✅ Thống kê tổng quan
- ✅ Export danh sách học sinh (CSV/JSON)
- ✅ Xóa học sinh (soft delete)

## Authentication

Tất cả API endpoints yêu cầu authentication với Bearer token và role `teacher`.

```
Authorization: Bearer {token}
```

## API Endpoints

### 1. Xem Danh Sách Học Sinh (Có Tìm Kiếm & Lọc)

```http
GET /api/teacher/students
```

**Query Parameters:**
- `search` (string): Tìm kiếm theo tên hoặc số điện thoại
- `status` (string): Lọc theo trạng thái (`active`, `inactive`)
- `class` (integer): Lọc theo lớp
- `gender` (boolean): Lọc theo giới tính (1=Nam, 0=Nữ)
- `sort_by` (string): Sắp xếp theo (`uCreated_at`, `uName`, `uPhone`, `uStatus`)
- `sort_order` (string): Thứ tự sắp xếp (`asc`, `desc`)
- `per_page` (integer): Số bản ghi mỗi trang (max 100)
- `paginate` (string): `false` để không phân trang

**Examples:**
```http
GET /api/teacher/students?search=Nguyen&status=active&per_page=20
GET /api/teacher/students?class=1&gender=1&sort_by=uName&sort_order=asc
GET /api/teacher/students?paginate=false
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "current_page": 1,
        "data": [
            {
                "uId": 2,
                "uName": "Lê Thị B",
                "uPhone": "0912345678",
                "uGender": 0,
                "uAddress": "Can Tho City",
                "uClass": 1,
                "uRole": "student",
                "uDoB": "2000-01-01",
                "uStatus": "active",
                "uCreated_at": "2026-03-20T10:00:00.000000Z"
            }
        ],
        "per_page": 20,
        "total": 25
    }
}
```

### 2. Xem Chi Tiết Học Sinh

```http
GET /api/teacher/student/{id}
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "uId": 2,
        "uName": "Lê Thị B",
        "uPhone": "0912345678",
        "uGender": 0,
        "uAddress": "Can Tho City",
        "uClass": 1,
        "uRole": "student",
        "uDoB": "2000-01-01",
        "uStatus": "active",
        "uCreated_at": "2026-03-20T10:00:00.000000Z"
    }
}
```

### 3. Tạo Học Sinh Mới (Đơn Lẻ)

```http
POST /api/teacher/student
```

**Request Body:**
```json
{
    "studentPhone": "0987654321",
    "studentPassword": "password123",
    "studentName": "Nguyễn Văn C",
    "studentDoB": "2000-05-15",
    "uClass": 2
}
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "success_count": 1,
        "errors": []
    },
    "message": "Đã xử lý xong danh sách học viên."
}
```

### 4. Tạo Học Sinh Hàng Loạt

```http
POST /api/teacher/student
```

**Request Body:**
```json
[
    {
        "studentPhone": "0987654321",
        "studentPassword": "password123",
        "studentName": "Nguyễn Văn C",
        "studentDoB": "2000-05-15",
        "uClass": 2
    },
    {
        "studentPhone": "0987654322",
        "studentPassword": "password123",
        "studentName": "Trần Thị D",
        "studentDoB": "2001-03-20",
        "uClass": 1
    }
]
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "success_count": 2,
        "errors": []
    },
    "message": "Đã xử lý xong danh sách học viên."
}
```

### 5. Cập Nhật Thông Tin Học Sinh

```http
PUT /api/teacher/student/{id}
```

**Request Body:**
```json
{
    "studentName": "Nguyễn Văn C - Updated",
    "studentPhone": "0987654321",
    "studentDoB": "2000-05-15",
    "studentAddress": "Updated Address",
    "studentGender": true,
    "classId": 2,
    "studentStatus": "active"
}
```

**Response:**
```json
{
    "status": "success",
    "data": [
        "UPDATE_STUDENT_SUCCESS",
        "Cập nhật thông tin học viên thành công",
        null,
        200
    ]
}
```

### 6. Xóa Học Sinh (Soft Delete)

```http
DELETE /api/teacher/student/{id}
```

**Response:**
```json
{
    "status": "success",
    "data": [
        "DELETE_STUDENT_SUCCESS",
        "Xóa học viên thành công",
        null,
        200
    ]
}
```

### 7. Thống Kê Học Sinh

```http
GET /api/teacher/students/statistics
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "overview": {
            "total_students": 150,
            "active_students": 142,
            "inactive_students": 8,
            "recent_registrations": 15
        },
        "demographics": {
            "gender": {
                "male": 75,
                "female": 70,
                "unspecified": 5
            },
            "age_groups": {
                "under_18": 20,
                "18_25": 85,
                "26_35": 35,
                "over_35": 10
            }
        },
        "distribution": {
            "by_class": {
                "1": 45,
                "2": 50,
                "3": 40,
                "0": 15
            },
            "by_status": {
                "active": 142,
                "inactive": 8
            }
        },
        "growth": {
            "last_30_days": 15,
            "growth_rate": 10.0
        }
    }
}
```

### 8. Export Danh Sách Học Sinh

```http
GET /api/teacher/students/export?format=csv
GET /api/teacher/students/export?format=json
```

**CSV Response:**
- Content-Type: `text/csv`
- File download với tên: `students_export_YYYY-MM-DD_HH-mm-ss.csv`

**JSON Response:**
```json
{
    "status": "success",
    "data": [
        {
            "uId": 2,
            "uName": "Lê Thị B",
            "uPhone": "0912345678",
            "uGender": 0,
            "uAddress": "Can Tho City",
            "uClass": 1,
            "uStatus": "active",
            "uCreated_at": "2026-03-20T10:00:00.000000Z"
        }
    ],
    "exported_at": "2026-03-20T10:30:00.000000Z",
    "total_records": 150
}
```

## Theo Dõi Tiến Độ Học Tập

### 9. Xem Tiến Độ Học Tập Của Học Sinh

```http
GET /api/student/progress
```

**Response (từ StudentProgressService):**
```json
{
    "status": "success",
    "data": {
        "overview": {
            "total_submissions": 25,
            "average_score": 78.5,
            "improvement_rate": 12.3,
            "consistency_score": 85.2,
            "mastery_level": "intermediate"
        },
        "trends": {
            "score_trend": "improving",
            "recent_performance": [75, 78, 82, 85, 88],
            "monthly_progress": {
                "2026-01": 72.5,
                "2026-02": 76.8,
                "2026-03": 82.1
            }
        },
        "skills_analysis": {
            "listening": {
                "average_score": 80.5,
                "submissions": 8,
                "trend": "stable"
            },
            "reading": {
                "average_score": 75.2,
                "submissions": 10,
                "trend": "improving"
            },
            "writing": {
                "average_score": 78.8,
                "submissions": 4,
                "trend": "improving"
            },
            "speaking": {
                "average_score": 82.1,
                "submissions": 3,
                "trend": "stable"
            }
        },
        "insights": [
            "Bạn đang có xu hướng cải thiện tốt trong 30 ngày qua",
            "Kỹ năng Reading cần được chú trọng hơn",
            "Điểm số ổn định, cho thấy sự kiên trì trong học tập"
        ],
        "recommendations": [
            "Tập trung luyện tập thêm kỹ năng Reading",
            "Duy trì tần suất làm bài đều đặn",
            "Thử thách bản thân với các đề thi khó hơn"
        ]
    }
}
```

## Error Responses

### 401 Unauthorized
```json
{
    "status": "error",
    "message": "Bạn không có quyền truy cập."
}
```

### 404 Not Found
```json
{
    "status": "error",
    "message": "Không tìm thấy học viên."
}
```

### 400 Bad Request
```json
{
    "status": "error",
    "message": "Dữ liệu không hợp lệ.",
    "errors": {
        "studentPhone": ["Số điện thoại đã tồn tại."],
        "studentPassword": ["Mật khẩu phải có ít nhất 6 ký tự."]
    }
}
```

## Business Rules

### Tạo Học Sinh
- Chỉ teacher mới có thể tạo học sinh
- Số điện thoại phải unique
- Mật khẩu tối thiểu 6 ký tự
- Hỗ trợ tạo đơn lẻ và hàng loạt

### Cập Nhật Thông Tin
- Chỉ teacher mới có thể cập nhật
- Số điện thoại phải unique (trừ chính học sinh đó)
- Có thể cập nhật từng phần (partial update)

### Tìm Kiếm & Lọc
- Tìm kiếm theo tên hoặc số điện thoại (LIKE)
- Lọc theo trạng thái, lớp, giới tính
- Sắp xếp theo nhiều tiêu chí
- Phân trang với giới hạn tối đa 100/trang

### Xóa Học Sinh
- Sử dụng soft delete (uDeleted_at)
- Không ảnh hưởng đến dữ liệu bài thi đã làm
- Học sinh bị xóa không xuất hiện trong danh sách

### Export Dữ Liệu
- Hỗ trợ CSV và JSON
- CSV tự động download file
- JSON trả về data trong response

## Database Schema

### Bảng `users` (Student records)
```sql
CREATE TABLE users (
    uId BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uPhone VARCHAR(20) UNIQUE NOT NULL,
    uPassword VARCHAR(255) NOT NULL,
    uName VARCHAR(150),
    uGender TINYINT(1) DEFAULT 0,
    uAddress TEXT,
    uClass BIGINT UNSIGNED,
    uRole ENUM('student','teacher','admin') DEFAULT 'student',
    uDoB DATE,
    uStatus ENUM('active','inactive') DEFAULT 'active',
    refresh_token VARCHAR(500),
    refresh_token_expires_at TIMESTAMP,
    uCreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uDeleted_at TIMESTAMP NULL
);
```

## Testing

Hệ thống đã được test toàn diện với 10 test cases:

1. ✅ Kiểm tra dữ liệu học sinh hiện tại
2. ✅ Tạo học sinh mới
3. ✅ Cập nhật thông tin học sinh
4. ✅ Kiểm tra chức năng tìm kiếm
5. ✅ Kiểm tra chức năng lọc
6. ✅ Kiểm tra thống kê
7. ✅ Kiểm tra theo dõi tiến độ học tập
8. ✅ Kiểm tra chức năng export
9. ✅ Kiểm tra xóa mềm học sinh
10. ✅ Dọn dẹp và kiểm tra cuối

**Kết quả:** Tất cả test PASS - Hệ thống sẵn sàng production!

## Implementation Status

- ✅ **Xem danh sách tất cả học sinh** - HOÀN THÀNH 100%
  - Tìm kiếm theo tên/SĐT
  - Lọc theo trạng thái, lớp, giới tính
  - Sắp xếp đa tiêu chí
  - Phân trang linh hoạt

- ✅ **Tạo tài khoản học sinh mới** - HOÀN THÀNH 100%
  - Tạo đơn lẻ
  - Tạo hàng loạt
  - Validation đầy đủ
  - Error handling chi tiết

- ✅ **Cập nhật thông tin học sinh** - HOÀN THÀNH 100%
  - Partial update
  - Validation unique phone
  - Permission check

- ✅ **Theo dõi tiến độ học tập** - HOÀN THÀNH 100%
  - StudentProgressService với analytics chi tiết
  - Phân tích theo kỹ năng
  - Xu hướng và insights
  - Recommendations

- ✅ **Thống kê tổng quan** - HOÀN THÀNH 100%
  - Demographics analysis
  - Growth tracking
  - Distribution charts
  - Age group analysis

- ✅ **Export danh sách** - HOÀN THÀNH 100%
  - CSV download
  - JSON response
  - Metadata included

- ✅ **API Documentation** - HOÀN THÀNH 100%
- ✅ **Database Schema** - HOÀN THÀNH 100%
- ✅ **Testing** - HOÀN THÀNH 100%

**TỔNG TIẾN ĐỘ: 100% HOÀN THÀNH** 🎉