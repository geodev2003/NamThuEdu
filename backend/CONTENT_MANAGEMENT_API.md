# Content Management System API Documentation

## Tổng quan
Hệ thống quản lý nội dung cho phép quản trị viên duyệt bài viết của giáo viên, quản lý danh mục (VSTEP/IELTS), tạo mẫu đề thi chuẩn và kiểm duyệt đề thi.

## Authentication
Tất cả API endpoints yêu cầu authentication với Bearer token và role admin.

```
Authorization: Bearer {token}
```

---

## 1. DUYỆT BÀI VIẾT CỦA GIÁO VIÊN

### 1.1 Lấy danh sách bài viết cần duyệt
```http
GET /api/admin/posts
```

**Query Parameters:**
- `status` (string, optional): Lọc theo trạng thái (active, draft, inactive)
- `author_id` (integer, optional): Lọc theo tác giả
- `type` (string, optional): Lọc theo loại (grammar, tips, vocabulary)
- `category` (integer, optional): Lọc theo danh mục
- `search` (string, optional): Tìm kiếm trong tiêu đề và nội dung
- `sort_by` (string, optional): Sắp xếp theo (pCreated_at, pTitle, pView)
- `sort_order` (string, optional): Thứ tự (asc, desc)
- `per_page` (integer, optional): Số bài viết mỗi trang (default: 20)

**Response:**
```json
{
  "status": "success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "pId": 1,
        "pTitle": "Grammar Tips for VSTEP",
        "pContent": "Content...",
        "pStatus": "draft",
        "pType": "grammar",
        "pCreated_at": "2026-03-20T10:00:00Z",
        "author": {
          "uId": 2,
          "uName": "Teacher Name"
        },
        "category": {
          "caId": 1,
          "caName": "VSTEP Grammar"
        }
      }
    ],
    "total": 50,
    "per_page": 20
  }
}
```

### 1.2 Xem chi tiết bài viết
```http
GET /api/admin/posts/{id}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "pId": 1,
    "pTitle": "Grammar Tips for VSTEP",
    "pContent": "Full content...",
    "pStatus": "draft",
    "pType": "grammar",
    "pView": 0,
    "pLike": 0,
    "pCreated_at": "2026-03-20T10:00:00Z",
    "author": {
      "uId": 2,
      "uName": "Teacher Name",
      "uEmail": "teacher@example.com"
    },
    "category": {
      "caId": 1,
      "caName": "VSTEP Grammar"
    }
  }
}
```

### 1.3 Duyệt bài viết
```http
POST /api/admin/posts/{id}/approve
```

**Response:**
```json
{
  "status": "success",
  "message": "Duyệt bài viết thành công.",
  "data": {
    "post_id": 1,
    "post_title": "Grammar Tips for VSTEP",
    "approved_by": "Admin Name",
    "approved_at": "2026-03-20T10:30:00Z"
  }
}
```

### 1.4 Từ chối bài viết
```http
POST /api/admin/posts/{id}/reject
```

**Request Body:**
```json
{
  "reason": "Nội dung không đạt tiêu chuẩn chất lượng"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Từ chối bài viết thành công.",
  "data": {
    "post_id": 1,
    "post_title": "Grammar Tips for VSTEP",
    "reason": "Nội dung không đạt tiêu chuẩn chất lượng",
    "rejected_by": "Admin Name",
    "rejected_at": "2026-03-20T10:30:00Z"
  }
}
```

### 1.5 Xóa bài viết
```http
DELETE /api/admin/posts/{id}
```

**Response:**
```json
{
  "status": "success",
  "message": "Xóa bài viết thành công."
}
```

### 1.6 Danh sách bài viết chờ duyệt
```http
GET /api/admin/posts/pending
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "pending_posts": [
      {
        "pId": 1,
        "pTitle": "Grammar Tips for VSTEP",
        "pStatus": "draft",
        "pCreated_at": "2026-03-20T10:00:00Z",
        "author": {
          "uName": "Teacher Name"
        }
      }
    ],
    "total_pending": 5
  }
}
```

---

## 2. QUẢN LÝ DANH MỤC (VSTEP/IELTS)

### 2.1 Lấy danh sách danh mục
```http
GET /api/admin/categories
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "caId": 1,
      "caName": "VSTEP Grammar",
      "caDescription": "Grammar lessons for VSTEP",
      "caType": "VSTEP",
      "courses_count": 5,
      "posts_count": 12
    },
    {
      "caId": 2,
      "caName": "IELTS Writing",
      "caDescription": "Writing tips for IELTS",
      "caType": "IELTS",
      "courses_count": 3,
      "posts_count": 8
    }
  ]
}
```

### 2.2 Tạo danh mục mới
```http
POST /api/admin/categories
```

**Request Body:**
```json
{
  "caName": "VSTEP Listening",
  "caDescription": "Listening practice for VSTEP",
  "caType": "VSTEP"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Tạo danh mục thành công.",
  "data": {
    "caId": 3,
    "caName": "VSTEP Listening",
    "caDescription": "Listening practice for VSTEP",
    "caType": "VSTEP"
  }
}
```

### 2.3 Cập nhật danh mục
```http
PUT /api/admin/categories/{id}
```

**Request Body:**
```json
{
  "caName": "VSTEP Listening Skills",
  "caDescription": "Advanced listening practice for VSTEP",
  "caType": "VSTEP"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Cập nhật danh mục thành công.",
  "data": {
    "caId": 3,
    "caName": "VSTEP Listening Skills",
    "caDescription": "Advanced listening practice for VSTEP",
    "caType": "VSTEP"
  }
}
```

### 2.4 Xóa danh mục
```http
DELETE /api/admin/categories/{id}
```

**Response:**
```json
{
  "status": "success",
  "message": "Xóa danh mục thành công."
}
```

**Error Response (nếu danh mục đang được sử dụng):**
```json
{
  "status": "error",
  "message": "Không thể xóa danh mục đang được sử dụng.",
  "data": {
    "courses_count": 5,
    "posts_count": 12
  }
}
```

---

## 3. TẠO MẪU ĐỀ THI CHUẨN

### 3.1 Lấy danh sách mẫu đề thi
```http
GET /api/admin/exam-templates
```

**Query Parameters:**
- `category` (string, optional): cambridge_young, cambridge_main, international, specialized
- `level` (string, optional): pre_a1, a1, a2, b1, b2, c1, c2
- `is_active` (boolean, optional): true/false
- `search` (string, optional): Tìm kiếm trong tên và mô tả
- `sort_by` (string, optional): created_at, template_name, category
- `sort_order` (string, optional): asc, desc
- `per_page` (integer, optional): Số mẫu mỗi trang (default: 20)

**Response:**
```json
{
  "status": "success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "template_code": "VSTEP_B1_2026",
        "template_name": "VSTEP B1 Standard Template",
        "category": "international",
        "level": "b1",
        "age_group": "adult",
        "total_duration_minutes": 150,
        "skills": ["listening", "reading", "writing", "speaking"],
        "sections": [
          {
            "name": "Listening",
            "duration": 40,
            "questions": 35
          }
        ],
        "description": "Standard VSTEP B1 template",
        "is_active": true,
        "created_at": "2026-03-20T10:00:00Z",
        "exams_count": 15
      }
    ],
    "total": 10
  }
}
```

### 3.2 Tạo mẫu đề thi mới
```http
POST /api/admin/exam-templates
```

**Request Body:**
```json
{
  "template_code": "IELTS_B2_2026",
  "template_name": "IELTS B2 Academic Template",
  "category": "international",
  "level": "b2",
  "age_group": "adult",
  "total_duration_minutes": 165,
  "skills": ["listening", "reading", "writing", "speaking"],
  "sections": [
    {
      "name": "Listening",
      "duration": 30,
      "questions": 40,
      "parts": [
        {
          "name": "Part 1",
          "type": "multiple_choice",
          "questions": 10
        }
      ]
    },
    {
      "name": "Reading",
      "duration": 60,
      "questions": 40
    },
    {
      "name": "Writing",
      "duration": 60,
      "questions": 2
    },
    {
      "name": "Speaking",
      "duration": 15,
      "questions": 3
    }
  ],
  "description": "Standard IELTS Academic template for B2 level"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Tạo mẫu đề thi thành công.",
  "data": {
    "id": 10,
    "template_code": "IELTS_B2_2026",
    "template_name": "IELTS B2 Academic Template",
    "category": "international",
    "level": "b2",
    "is_active": true
  }
}
```

### 3.3 Cập nhật mẫu đề thi
```http
PUT /api/admin/exam-templates/{id}
```

**Request Body:**
```json
{
  "template_name": "IELTS B2 Academic Template (Updated)",
  "total_duration_minutes": 170,
  "description": "Updated IELTS Academic template",
  "is_active": true
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Cập nhật mẫu đề thi thành công.",
  "data": {
    "id": 10,
    "template_name": "IELTS B2 Academic Template (Updated)",
    "total_duration_minutes": 170,
    "is_active": true
  }
}
```

### 3.4 Xóa mẫu đề thi
```http
DELETE /api/admin/exam-templates/{id}
```

**Response:**
```json
{
  "status": "success",
  "message": "Xóa mẫu đề thi thành công."
}
```

**Error Response (nếu mẫu đang được sử dụng):**
```json
{
  "status": "error",
  "message": "Không thể xóa mẫu đề thi đang được sử dụng.",
  "data": {
    "exams_using_template": 5
  }
}
```

### 3.5 Kích hoạt mẫu đề thi
```http
POST /api/admin/exam-templates/{id}/activate
```

**Response:**
```json
{
  "status": "success",
  "message": "Kích hoạt mẫu đề thi thành công.",
  "data": {
    "template_id": 10,
    "template_name": "IELTS B2 Academic Template",
    "is_active": true
  }
}
```

### 3.6 Vô hiệu hóa mẫu đề thi
```http
POST /api/admin/exam-templates/{id}/deactivate
```

**Response:**
```json
{
  "status": "success",
  "message": "Vô hiệu hóa mẫu đề thi thành công.",
  "data": {
    "template_id": 10,
    "template_name": "IELTS B2 Academic Template",
    "is_active": false
  }
}
```

---

## 4. KIỂM DUYỆT ĐỀ THI

### 4.1 Lấy danh sách đề thi cần kiểm duyệt
```http
GET /api/admin/exams
```

**Query Parameters:**
- `is_private` (boolean, optional): true (chờ duyệt), false (đã duyệt)
- `type` (string, optional): VSTEP, IELTS, GENERAL
- `skill` (string, optional): listening, reading, writing, speaking
- `teacher_id` (integer, optional): Lọc theo giáo viên
- `search` (string, optional): Tìm kiếm trong tiêu đề và mô tả
- `sort_by` (string, optional): eCreated_at, eTitle, eDuration_minutes
- `sort_order` (string, optional): asc, desc
- `per_page` (integer, optional): Số đề thi mỗi trang (default: 20)

**Response:**
```json
{
  "status": "success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "eId": 1,
        "eTitle": "VSTEP Practice Test - Class A",
        "eDescription": "Practice test for VSTEP preparation",
        "eType": "VSTEP",
        "eSkill": "listening",
        "eDuration_minutes": 90,
        "eIs_private": true,
        "eCreated_at": "2026-03-20T10:00:00Z",
        "questions_count": 25,
        "teacher": {
          "uId": 2,
          "uName": "Teacher Name"
        }
      }
    ],
    "total": 15
  }
}
```

### 4.2 Xem chi tiết đề thi
```http
GET /api/admin/exams/{id}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "eId": 1,
    "eTitle": "VSTEP Practice Test - Class A",
    "eDescription": "Practice test for VSTEP preparation",
    "eType": "VSTEP",
    "eSkill": "listening",
    "eDuration_minutes": 90,
    "eIs_private": true,
    "eCreated_at": "2026-03-20T10:00:00Z",
    "questions_count": 25,
    "teacher": {
      "uId": 2,
      "uName": "Teacher Name",
      "uEmail": "teacher@example.com"
    },
    "template": {
      "id": 1,
      "template_name": "VSTEP B1 Standard Template"
    },
    "questions": [
      {
        "qId": 1,
        "qContent": "Listen to the audio and choose the correct answer",
        "qPoints": 1,
        "answers": [
          {
            "aId": 1,
            "aContent": "Option A",
            "aIs_correct": true
          }
        ]
      }
    ]
  }
}
```

### 4.3 Duyệt đề thi
```http
POST /api/admin/exams/{id}/approve
```

**Response:**
```json
{
  "status": "success",
  "message": "Duyệt đề thi thành công.",
  "data": {
    "exam_id": 1,
    "exam_title": "VSTEP Practice Test - Class A",
    "approved_by": "Admin Name",
    "approved_at": "2026-03-20T10:30:00Z"
  }
}
```

### 4.4 Từ chối đề thi
```http
POST /api/admin/exams/{id}/reject
```

**Request Body:**
```json
{
  "reason": "Đề thi thiếu câu hỏi và cần bổ sung thêm nội dung"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Từ chối đề thi thành công.",
  "data": {
    "exam_id": 1,
    "exam_title": "VSTEP Practice Test - Class A",
    "reason": "Đề thi thiếu câu hỏi và cần bổ sung thêm nội dung",
    "rejected_by": "Admin Name",
    "rejected_at": "2026-03-20T10:30:00Z"
  }
}
```

### 4.5 Xóa đề thi
```http
DELETE /api/admin/exams/{id}
```

**Response:**
```json
{
  "status": "success",
  "message": "Xóa đề thi thành công."
}
```

**Error Response (nếu đề thi đang được giao bài):**
```json
{
  "status": "error",
  "message": "Không thể xóa đề thi đang được giao bài.",
  "data": {
    "assignments_count": 3
  }
}
```

### 4.6 Danh sách đề thi chờ duyệt
```http
GET /api/admin/exams/pending
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "pending_exams": [
      {
        "eId": 1,
        "eTitle": "VSTEP Practice Test - Class A",
        "eType": "VSTEP",
        "eCreated_at": "2026-03-20T10:00:00Z",
        "questions_count": 25,
        "teacher": {
          "uName": "Teacher Name"
        }
      }
    ],
    "total_pending": 8
  }
}
```

---

## 5. THỐNG KÊ VÀ BÁO CÁO

### 5.1 Thống kê nội dung tổng quan
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
      },
      {
        "author_name": "Teacher B",
        "post_count": 20
      }
    ],
    "activity": {
      "recent_posts": 15
    }
  }
}
```

### 5.2 Thống kê mẫu đề thi
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
      },
      {
        "template_name": "IELTS Academic B2",
        "usage_count": 32
      }
    ]
  }
}
```

### 5.3 Thống kê đề thi
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
      },
      {
        "teacher_name": "Teacher B",
        "exam_count": 28
      }
    ],
    "activity": {
      "recent_exams": 12
    }
  }
}
```

---

## Error Responses

### 403 Forbidden
```json
{
  "status": "error",
  "message": "Chỉ quản trị viên mới có quyền truy cập."
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Không tìm thấy tài nguyên."
}
```

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Dữ liệu không hợp lệ.",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Lỗi hệ thống.",
  "error": "Detailed error message"
}
```

---

## Workflow Duyệt Nội Dung

### Bài viết của giáo viên:
1. **Draft** → **Active** (Duyệt) hoặc **Inactive** (Từ chối)
2. Lưu thông tin người duyệt/từ chối và thời gian
3. Lưu lý do từ chối (nếu có)

### Đề thi:
1. **Private** (Chờ duyệt) → **Public** (Đã duyệt)
2. Từ chối: Giữ nguyên Private và thêm ghi chú lý do

### Mẫu đề thi:
1. **Active** (Kích hoạt) ↔ **Inactive** (Vô hiệu hóa)
2. Chỉ mẫu Active mới hiển thị cho giáo viên

---

## Security & Validation

- Tất cả endpoints yêu cầu authentication và role admin
- Validation đầy đủ cho tất cả input
- Soft delete cho bài viết và đề thi
- Kiểm tra ràng buộc trước khi xóa (danh mục, mẫu đề thi)
- Audit trail cho tất cả thao tác duyệt/từ chối
- Rate limiting và pagination cho performance

---

## Notes

- Hệ thống hỗ trợ tìm kiếm và lọc nâng cao
- Thống kê real-time cho dashboard admin
- Export data (sẽ được bổ sung trong phiên bản sau)
- Notification system (sẽ được bổ sung trong phiên bản sau)