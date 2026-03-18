# Tài Liệu API Backend - Nam Thu Edu

## Tổng Quan
- **Backend Framework**: PHP thuần (MVC Pattern)
- **Authentication**: JWT (JSON Web Token)
- **Database**: MySQL
- **Response Format**: JSON

---

## 1. Authentication APIs

### 1.1 Đăng Nhập
**Endpoint**: `POST /api/login`

**Mô tả**: Đăng nhập bằng số điện thoại và mật khẩu

**Request Body**:
```json
{
  "phone": "0123456789",
  "password": "password123"
}
```

**Response Success (200)**:
```json
{
  "status": "success",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": 1,
      "name": "Nguyễn Văn A",
      "phone": "0123456789",
      "age": 25,
      "role": "teacher"
    }
  }
}
```

**Response Error**:
- `400`: Thiếu số điện thoại hoặc mật khẩu
- `401`: Số điện thoại hoặc mật khẩu không đúng
- `403`: Tài khoản chưa được kích hoạt

**Rate Limit**: 5 requests/60 seconds per IP

---

### 1.2 Yêu Cầu OTP (Quên Mật Khẩu)
**Endpoint**: `POST /api/users/accept`

**Mô tả**: Gửi mã OTP đến số điện thoại để reset mật khẩu

**Request Body**:
```json
{
  "phone": "0123456789"
}
```

**Response Success (200)**:
```json
{
  "status": "success",
  "data": {
    "message": "Mã OTP đã được gửi đến số điện thoại của bạn (Mock: 123456)",
    "debug_otp": "123456"
  }
}
```

**Response Error**:
- `401`: Số điện thoại không đúng
- `404`: Không tìm thấy số điện thoại trên cơ sở dữ liệu
- `500`: Tạo mã OTP thất bại

**Note**: OTP có hiệu lực trong 5 phút

---

### 1.3 Đặt Lại Mật Khẩu
**Endpoint**: `POST /api/users/reset-password`

**Mô tả**: Đặt lại mật khẩu bằng mã OTP

**Request Body**:
```json
{
  "phone": "0123456789",
  "otp": "123456",
  "password": "newpassword123"
}
```

**Response Success (200)**:
```json
{
  "status": "success",
  "data": {
    "message": "Đổi mật khẩu thành công. Vui lòng đăng nhập lại."
  }
}
```

**Response Error**:
- `400`: Vui lòng nhập đầy đủ thông tin / Mã OTP không chính xác hoặc đã hết hạn
- `404`: Người dùng không tồn tại

---

### 1.4 Đăng Xuất
**Endpoint**: `POST /api/logout`

**Mô tả**: Đăng xuất khỏi hệ thống

**Headers**: 
```
Authorization: Bearer {access_token}
```

---

## 2. User Management APIs

### 2.1 Lấy Danh Sách Users
**Endpoint**: `GET /api/users`

**Mô tả**: Test endpoint để kiểm tra router

**Response**:
```json
{
  "message": "Router hoạt động OK"
}
```

---

## 3. Teacher APIs

### 3.1 Quản Lý Khóa Học (Course Management)

#### 3.1.1 Lấy Danh Sách Khóa Học
**Endpoint**: `GET /api/teacher/courses`

**Mô tả**: Lấy tất cả khóa học của giáo viên

**Headers**: 
```
Authorization: Bearer {access_token}
```

**Response Success (200)**:
```json
{
  "status": "success",
  "data": [
    {
      "cId": 1,
      "cName": "Tiếng Anh Giao Tiếp",
      "cTime": "18:00-20:00",
      "cCategory": "Giao tiếp",
      "cSchedule": "Thứ 2, 4, 6",
      "cStartDate": "2024-01-15",
      "cEndDate": "2024-06-15",
      "cNumberOfStudent": 20,
      "cDescription": "Khóa học tiếng Anh giao tiếp cơ bản"
    }
  ]
}
```

**Authorization**: Chỉ Teacher

---

#### 3.1.2 Tạo Khóa Học Mới
**Endpoint**: `POST /api/teacher/courses`

**Headers**: 
```
Authorization: Bearer {access_token}
```

**Request Body**:
```json
{
  "courseName": "Tiếng Anh Giao Tiếp",
  "time": "18:00-20:00",
  "category": "Giao tiếp",
  "schedule": "Thứ 2, 4, 6",
  "startDate": "2024-01-15",
  "endDate": "2024-06-15",
  "numberOfStudent": 20,
  "description": "Khóa học tiếng Anh giao tiếp cơ bản"
}
```

**Response Success (200)**:
```json
{
  "status": "success",
  "data": {
    "courseId": 1
  }
}
```

**Response Error**:
- `400`: Dữ liệu không đầy đủ
- `401`: Không có quyền truy cập

**Authorization**: Chỉ Teacher

---

#### 3.1.3 Lấy Chi Tiết Khóa Học
**Endpoint**: `GET /api/teacher/courses/{id}`

**Headers**: 
```
Authorization: Bearer {access_token}
```

**Response Success (200)**:
```json
{
  "status": "success",
  "data": {
    "cId": 1,
    "cName": "Tiếng Anh Giao Tiếp",
    "cTime": "18:00-20:00",
    "cCategory": "Giao tiếp",
    "cSchedule": "Thứ 2, 4, 6",
    "cStartDate": "2024-01-15",
    "cEndDate": "2024-06-15",
    "cNumberOfStudent": 20,
    "cDescription": "Khóa học tiếng Anh giao tiếp cơ bản"
  }
}
```

**Response Error**:
- `404`: Không tìm thấy khóa học
- `401`: Không có quyền truy cập

**Authorization**: Chỉ Teacher

---

#### 3.1.4 Cập Nhật Khóa Học
**Endpoint**: `PUT /api/teacher/courses/{id}`

**Headers**: 
```
Authorization: Bearer {access_token}
```

**Request Body**:
```json
{
  "courseName": "Tiếng Anh Giao Tiếp Nâng Cao",
  "time": "19:00-21:00",
  "category": "Giao tiếp",
  "schedule": "Thứ 3, 5, 7",
  "startDate": "2024-02-01",
  "endDate": "2024-07-01",
  "numberOfStudent": 25,
  "description": "Khóa học tiếng Anh giao tiếp nâng cao"
}
```

**Response Success (200)**:
```json
{
  "status": "success",
  "data": {
    "message": "Cập nhật khóa học thành công"
  }
}
```

**Response Error**:
- `500`: Không thể cập nhật khóa học
- `401`: Không có quyền

**Authorization**: Chỉ Teacher

---

#### 3.1.5 Xóa Khóa Học
**Endpoint**: `DELETE /api/teacher/courses/{id}`

**Headers**: 
```
Authorization: Bearer {access_token}
```

**Response Success (200)**:
```json
{
  "status": "success",
  "data": [
    "DELETE_COURSE_SUCCESS",
    "Xóa khóa học thành công",
    null,
    200
  ]
}
```

**Response Error**:
- `500`: Không thể xóa khóa học
- `401`: Không có quyền

**Authorization**: Chỉ Teacher

---

### 3.2 Quản Lý Học Viên (Student Management)

#### 3.2.1 Lấy Danh Sách Học Viên
**Endpoint**: `GET /api/teacher/students`

**Headers**: 
```
Authorization: Bearer {access_token}
```

**Response Success (200)**:
```json
{
  "status": "success",
  "data": [
    {
      "uId": 1,
      "uName": "Nguyễn Văn A",
      "uPhone": "0123456789",
      "uDoB": "2005-01-15",
      "uAddress": "Hà Nội",
      "uGender": "Nam",
      "uStatus": "active",
      "uClass": 1
    }
  ]
}
```

**Authorization**: Chỉ Teacher

---

#### 3.2.2 Lấy Chi Tiết Học Viên
**Endpoint**: `GET /api/teacher/student/{id}`

**Headers**: 
```
Authorization: Bearer {access_token}
```

**Response Success (200)**:
```json
{
  "status": "success",
  "data": {
    "uId": 1,
    "uName": "Nguyễn Văn A",
    "uPhone": "0123456789",
    "uDoB": "2005-01-15",
    "uAddress": "Hà Nội",
    "uGender": "Nam",
    "uStatus": "active",
    "uClass": 1
  }
}
```

**Authorization**: Chỉ Teacher

---

#### 3.2.3 Tạo Học Viên Mới
**Endpoint**: `POST /api/teacher/student`

**Headers**: 
```
Authorization: Bearer {access_token}
```

**Request Body** (Một học viên):
```json
{
  "studentPhone": "0123456789",
  "studentPassword": "password123",
  "studentName": "Nguyễn Văn A",
  "studentDoB": "2005-01-15",
  "uClass": 1
}
```

**Request Body** (Nhiều học viên):
```json
[
  {
    "studentPhone": "0123456789",
    "studentPassword": "password123",
    "studentName": "Nguyễn Văn A",
    "studentDoB": "2005-01-15",
    "uClass": 1
  },
  {
    "studentPhone": "0987654321",
    "studentPassword": "password456",
    "studentName": "Trần Thị B",
    "studentDoB": "2006-03-20",
    "uClass": 1
  }
]
```

**Response Success (200)**:
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

**Response Error**:
- `400`: Dữ liệu không được để trống / Không thể tạo học viên nào
- `401`: Không có quyền truy cập

**Authorization**: Chỉ Teacher

---

#### 3.2.4 Cập Nhật Học Viên
**Endpoint**: `PUT /api/teacher/student/{id}`

**Headers**: 
```
Authorization: Bearer {access_token}
```

**Request Body**:
```json
{
  "studentName": "Nguyễn Văn A",
  "studentPhone": "0123456789",
  "studentDoB": "2005-01-15",
  "studentAddress": "Hà Nội",
  "studentGender": "Nam",
  "classId": 1,
  "studentStatus": "active"
}
```

**Response Success (200)**:
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

**Response Error**:
- `400`: Dữ liệu không hợp lệ / Không thể cập nhật hoặc không có thay đổi nào
- `401`: Không có quyền thực hiện hành động này
- `500`: Lỗi hệ thống

**Authorization**: Chỉ Teacher

---

#### 3.2.5 Xóa Học Viên
**Endpoint**: `DELETE /api/teacher/student/{id}`

**Headers**: 
```
Authorization: Bearer {access_token}
```

**Response Success (200)**:
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

**Response Error**:
- `404`: Không tìm thấy học viên hoặc học viên đã bị xóa
- `401`: Không có quyền thực hiện hành động này
- `500`: Lỗi hệ thống khi xóa học viên

**Authorization**: Chỉ Teacher

---

### 3.3 Quản Lý Bài Viết (Blog Management)

#### 3.3.1 Lấy Danh Sách Bài Viết
**Endpoint**: `GET /api/teacher/blogs`

**Headers**: 
```
Authorization: Bearer {access_token}
```

**Response Success (200)**:
```json
{
  "status": "success",
  "data": [
    {
      "bId": 1,
      "bName": "Cách học tiếng Anh hiệu quả",
      "bContent": "Nội dung bài viết...",
      "bType": "article",
      "bCategory": "Học tập",
      "bUrl": "https://example.com/blog/1",
      "bThumbnail": "https://example.com/images/blog1.jpg",
      "bCreated_at": "2024-01-15 10:00:00"
    }
  ]
}
```

**Authorization**: Chỉ Teacher (hiện tại đang comment check role)

---

#### 3.3.2 Tạo Bài Viết Mới
**Endpoint**: `POST /api/teacher/blogs`

**Headers**: 
```
Authorization: Bearer {access_token}
```

**Request Body**:
```json
{
  "blogName": "Cách học tiếng Anh hiệu quả",
  "blogContent": "Nội dung bài viết...",
  "blogType": "article",
  "blogCategory": "Học tập",
  "blogUrl": "https://example.com/blog/1",
  "blogThumbnail": "https://example.com/images/blog1.jpg"
}
```

**Response Success (200)**:
```json
{
  "status": "success",
  "data": {
    "blogId": 1
  }
}
```

**Response Error**:
- `400`: Dữ liệu không đầy đủ
- `401`: Không có quyền truy cập

**Authorization**: Chỉ Teacher

---

#### 3.3.3 Lấy Chi Tiết Bài Viết
**Endpoint**: `GET /api/teacher/blogs/{id}`

**Headers**: 
```
Authorization: Bearer {access_token}
```

**Response Success (200)**:
```json
{
  "status": "success",
  "data": {
    "bId": 1,
    "bName": "Cách học tiếng Anh hiệu quả",
    "bContent": "Nội dung bài viết...",
    "bType": "article",
    "bCategory": "Học tập",
    "bUrl": "https://example.com/blog/1",
    "bThumbnail": "https://example.com/images/blog1.jpg",
    "bCreated_at": "2024-01-15 10:00:00"
  }
}
```

**Response Error**:
- `404`: Không tìm thấy bài viết
- `401`: Không có quyền truy cập

**Authorization**: Chỉ Teacher

---

#### 3.3.4 Cập Nhật Bài Viết
**Endpoint**: `PUT /api/teacher/blogs/{id}`

**Headers**: 
```
Authorization: Bearer {access_token}
```

**Request Body**:
```json
{
  "blogName": "Cách học tiếng Anh hiệu quả (Updated)",
  "blogContent": "Nội dung bài viết đã cập nhật...",
  "blogType": "article",
  "blogCategory": "Học tập",
  "blogUrl": "https://example.com/blog/1",
  "blogThumbnail": "https://example.com/images/blog1-updated.jpg"
}
```

**Response Success (200)**:
```json
{
  "status": "success",
  "data": [
    "UPDATE_BLOG_SUCCESS",
    "Cập nhật bài viết thành công",
    null,
    200
  ]
}
```

**Response Error**:
- `500`: Không thể cập nhật bài viết
- `401`: Không có quyền

**Authorization**: Chỉ Teacher

---

#### 3.3.5 Xóa Bài Viết
**Endpoint**: `DELETE /api/teacher/blogs/{id}`

**Headers**: 
```
Authorization: Bearer {access_token}
```

**Response Success (200)**:
```json
{
  "status": "success",
  "data": [
    "DELETE_BLOG_SUCCESS",
    "Xóa bài viết thành công",
    null,
    200
  ]
}
```

**Response Error**:
- `500`: Không thể xóa bài viết
- `401`: Không có quyền

**Authorization**: Chỉ Teacher

---

### 3.4 Quản Lý Danh Mục (Category Management)

#### 3.4.1 Lấy Danh Sách Danh Mục
**Endpoint**: `GET /api/teacher/categories`

**Headers**: 
```
Authorization: Bearer {access_token}
```

**Response Success (200)**:
```json
{
  "status": "success",
  "data": [
    {
      "catId": 1,
      "catName": "Giao tiếp",
      "catDescription": "Khóa học giao tiếp"
    },
    {
      "catId": 2,
      "catName": "Ngữ pháp",
      "catDescription": "Khóa học ngữ pháp"
    }
  ]
}
```

---

## 4. Phân Quyền Theo Role

### 4.1 Role: Teacher (Giáo Viên)

**Chức năng**:
1. **Quản lý khóa học**:
   - Xem danh sách khóa học của mình
   - Tạo khóa học mới
   - Xem chi tiết khóa học
   - Cập nhật thông tin khóa học
   - Xóa khóa học

2. **Quản lý học viên**:
   - Xem danh sách học viên
   - Xem chi tiết học viên
   - Tạo học viên mới (đơn lẻ hoặc hàng loạt)
   - Cập nhật thông tin học viên
   - Xóa học viên (soft delete)

3. **Quản lý bài viết**:
   - Xem danh sách bài viết
   - Tạo bài viết mới
   - Xem chi tiết bài viết
   - Cập nhật bài viết
   - Xóa bài viết

4. **Xem danh mục**:
   - Xem danh sách danh mục khóa học

**API Endpoints**:
- `/api/teacher/courses` (GET, POST)
- `/api/teacher/courses/{id}` (GET, PUT, DELETE)
- `/api/teacher/students` (GET)
- `/api/teacher/student` (POST)
- `/api/teacher/student/{id}` (GET, PUT, DELETE)
- `/api/teacher/blogs` (GET, POST)
- `/api/teacher/blogs/{id}` (GET, PUT, DELETE)
- `/api/teacher/categories` (GET)

---

### 4.2 Role: Student (Học Viên)

**Chức năng**:
- Hiện tại chưa có API endpoints cụ thể cho Student
- Dự kiến sẽ có:
  - Xem khóa học đã đăng ký
  - Xem bài viết/blog
  - Xem thông tin cá nhân
  - Cập nhật thông tin cá nhân

**API Endpoints**: Chưa được implement

---

### 4.3 Role: Admin (Quản Trị Viên)

**Chức năng**:
- Hiện tại chưa có API endpoints cụ thể cho Admin
- Dự kiến sẽ có:
  - Quản lý tất cả users (Teacher, Student)
  - Quản lý danh mục
  - Xem báo cáo thống kê
  - Phê duyệt tài khoản

**API Endpoints**: Chưa được implement

---

## 5. Authentication & Authorization

### 5.1 JWT Token
- **Algorithm**: HS256
- **Expiration**: 24 giờ
- **Secret Key**: Lưu trong file `.env` (`JWT_SECRET`)

### 5.2 Token Payload
```json
{
  "iss": "namthuedu",
  "iat": 1234567890,
  "exp": 1234654290,
  "sub": 1,
  "name": "Nguyễn Văn A",
  "age": 25,
  "role": "teacher"
}
```

### 5.3 Cách Sử Dụng Token
Thêm token vào header của mỗi request:
```
Authorization: Bearer {access_token}
```

---

## 6. Error Codes

### 6.1 Authentication Errors
- `AUTH_INVALID_CREDENTIALS`: Số điện thoại hoặc mật khẩu không đúng
- `AUTH_ACCOUNT_INACTIVE`: Tài khoản chưa được kích hoạt
- `AUTH_UNAUTHORIZED`: Không có quyền truy cập

### 6.2 Validation Errors
- `INVALID_JSON`: Body request không hợp lệ
- `INVALID_DATA`: Dữ liệu không được để trống
- `INVALID_INPUT`: Dữ liệu không hợp lệ

### 6.3 Resource Errors
- `COURSE_NOT_FOUND`: Không tìm thấy khóa học
- `BLOG_NOT_FOUND`: Không tìm thấy bài viết
- `USER_NOT_FOUND`: Người dùng không tồn tại
- `AUTHORIZATION_PHONE_NOT_FOUND`: Không tìm thấy số điện thoại

### 6.4 Operation Errors
- `CREATE_FAILED`: Không thể tạo
- `UPDATE_FAILED`: Không thể cập nhật
- `DELETE_FAILED`: Không thể xóa
- `INSERT_OTP_FAILED`: Tạo mã OTP thất bại
- `INVALID_OTP`: Mã OTP không chính xác hoặc đã hết hạn

### 6.5 Server Errors
- `SERVER_ERROR`: Lỗi hệ thống

---

## 7. Rate Limiting

### 7.1 Login Endpoint
- **Limit**: 5 requests per 60 seconds
- **Scope**: Per IP address
- **Endpoint**: `/api/login`

---

## 8. Database Schema (Tóm Tắt)

### 8.1 Users Table
```sql
users (
  uId INT PRIMARY KEY,
  uName VARCHAR,
  uPhone VARCHAR UNIQUE,
  uPassword VARCHAR,
  uRole ENUM('teacher', 'student', 'admin'),
  uDoB DATE,
  uAddress VARCHAR,
  uGender VARCHAR,
  uStatus ENUM('active', 'inactive'),
  uClass INT,
  uDeleted_at DATETIME,
  uCreated_at DATETIME
)
```

### 8.2 Courses Table
```sql
courses (
  cId INT PRIMARY KEY,
  cName VARCHAR,
  cTime VARCHAR,
  cCategory VARCHAR,
  cSchedule VARCHAR,
  cStartDate DATE,
  cEndDate DATE,
  cNumberOfStudent INT,
  cDescription TEXT,
  cTeacherId INT,
  cDeleted_at DATETIME,
  cCreated_at DATETIME
)
```

### 8.3 Blogs Table
```sql
blogs (
  bId INT PRIMARY KEY,
  bName VARCHAR,
  bContent TEXT,
  bType VARCHAR,
  bCategory VARCHAR,
  bUrl VARCHAR,
  bThumbnail VARCHAR,
  bAuthorId INT,
  bDeleted_at DATETIME,
  bCreated_at DATETIME
)
```

### 8.4 OTP Logs Table
```sql
otp_logs (
  oId INT PRIMARY KEY,
  userId INT,
  oCode VARCHAR,
  oVerified BOOLEAN,
  oExpired_at DATETIME,
  oCreated_at DATETIME
)
```

---

## 9. Testing

### 9.1 Test với Postman/Insomnia

**Bước 1**: Đăng nhập
```
POST http://localhost/api/login
Content-Type: application/json

{
  "phone": "0123456789",
  "password": "password123"
}
```

**Bước 2**: Copy `access_token` từ response

**Bước 3**: Gọi API với token
```
GET http://localhost/api/teacher/courses
Authorization: Bearer {access_token}
```

---

## 10. Notes

### 10.1 CORS Configuration
- Backend cho phép tất cả origins (`Access-Control-Allow-Origin: *`)
- Trong production nên giới hạn origin cụ thể

### 10.2 Password Security
- Sử dụng `password_hash()` với `PASSWORD_BCRYPT`
- Không bao giờ trả về password trong response

### 10.3 Soft Delete
- Hệ thống sử dụng soft delete (đánh dấu `uDeleted_at`, `cDeleted_at`, `bDeleted_at`)
- Dữ liệu không bị xóa vĩnh viễn khỏi database

### 10.4 Date Format
- Input: `YYYY-MM-DD` (e.g., `2024-01-15`)
- Output: `YYYY-MM-DD HH:MM:SS` (e.g., `2024-01-15 10:30:00`)

---

## 11. Roadmap (Tính Năng Chưa Implement)

### 11.1 Student APIs
- [ ] Xem khóa học đã đăng ký
- [ ] Đăng ký khóa học mới
- [ ] Xem lịch học
- [ ] Xem điểm số/tiến độ
- [ ] Cập nhật thông tin cá nhân

### 11.2 Admin APIs
- [ ] Quản lý tất cả users
- [ ] Phê duyệt tài khoản Teacher
- [ ] Quản lý danh mục
- [ ] Xem báo cáo thống kê
- [ ] Quản lý hệ thống

### 11.3 Additional Features
- [ ] Upload file/image
- [ ] Notification system
- [ ] Email integration
- [ ] SMS OTP integration (hiện tại đang mock)
- [ ] Payment integration
- [ ] Export data (Excel, PDF)

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-15  
**Maintainer**: Nam Thu Edu Development Team
