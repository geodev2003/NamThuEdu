# Nam Thu Edu - Laravel Backend API

## Tổng Quan

Backend API được xây dựng bằng Laravel 8 với Sanctum authentication, cung cấp RESTful API cho ứng dụng giáo dục Nam Thu Edu.

## Cài Đặt

### 1. Cài đặt dependencies
```bash
composer install
```

### 2. Cấu hình môi trường
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Cấu hình database trong `.env`
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=namthuedu
DB_USERNAME=root
DB_PASSWORD=your_password

JWT_SECRET=namthuedu_super_secret_key
```

### 4. Chạy migrations và seeders
```bash
php artisan migrate
php artisan db:seed --class=CategorySeeder
php artisan db:seed --class=UserSeeder
```

### 5. Khởi động server
```bash
php artisan serve
```

API sẽ chạy tại: `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/login` - Đăng nhập
- `POST /api/logout` - Đăng xuất (cần auth)
- `POST /api/users/accept` - Yêu cầu OTP
- `POST /api/users/reset-password` - Đặt lại mật khẩu

### Teacher APIs
**Quản lý khóa học:**
- `GET /api/teacher/courses` - Danh sách khóa học
- `POST /api/teacher/courses` - Tạo khóa học mới
- `GET /api/teacher/courses/{id}` - Chi tiết khóa học
- `PUT /api/teacher/courses/{id}` - Cập nhật khóa học
- `DELETE /api/teacher/courses/{id}` - Xóa khóa học

**Quản lý học viên:**
- `GET /api/teacher/students` - Danh sách học viên
- `GET /api/teacher/student/{id}` - Chi tiết học viên
- `POST /api/teacher/student` - Tạo học viên mới
- `PUT /api/teacher/student/{id}` - Cập nhật học viên
- `DELETE /api/teacher/student/{id}` - Xóa học viên

**Quản lý bài viết:**
- `GET /api/teacher/blogs` - Danh sách bài viết
- `POST /api/teacher/blogs` - Tạo bài viết mới
- `GET /api/teacher/blogs/{id}` - Chi tiết bài viết
- `PUT /api/teacher/blogs/{id}` - Cập nhật bài viết
- `DELETE /api/teacher/blogs/{id}` - Xóa bài viết

**Danh mục:**
- `GET /api/teacher/categories` - Danh sách danh mục

## Authentication

API sử dụng Laravel Sanctum cho authentication. Sau khi login thành công, bạn sẽ nhận được `access_token`.

### Cách sử dụng token:
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     http://localhost:8000/api/teacher/courses
```

## Database Schema

### Users Table
```sql
users (
  uId BIGINT PRIMARY KEY,
  uPhone VARCHAR(20) UNIQUE,
  uPassword VARCHAR(255),
  uName VARCHAR(150),
  uGender BOOLEAN,
  uAddress TEXT,
  uClass BIGINT,
  uRole ENUM('student', 'teacher', 'admin'),
  uDoB DATE,
  uStatus ENUM('active', 'inactive'),
  uCreated_at TIMESTAMP,
  uDeleted_at TIMESTAMP
)
```

### Course Table
```sql
course (
  cId BIGINT PRIMARY KEY,
  cName VARCHAR(100),
  cCategory BIGINT,
  cNumberOfStudent INT,
  cTime VARCHAR(50),
  cSchedule TEXT,
  cStartDate DATE,
  cEndDate DATE,
  cStatus ENUM('active', 'draft', 'ongoing', 'complete'),
  cTeacher BIGINT,
  cDescription TEXT,
  cDeleteAt DATETIME,
  cCreateAt TIMESTAMP,
  cUpdateAt TIMESTAMP
)
```

### Posts Table
```sql
posts (
  pId BIGINT PRIMARY KEY,
  pTitle VARCHAR(255),
  pContent LONGTEXT,
  pAuthor_id BIGINT,
  pType ENUM('grammar', 'tips', 'vocabulary'),
  pCategory BIGINT,
  pUrl TEXT,
  pThumbnail TEXT,
  pView INT,
  pLike INT,
  pStatus ENUM('active', 'inactive', 'draft'),
  pCreated_at TIMESTAMP,
  pDeleted_at TIMESTAMP,
  pUpdated_at TIMESTAMP
)
```

## Testing

### Test Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "0336695863",
    "password": "password123"
  }'
```

### Test Teacher Courses
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     http://localhost:8000/api/teacher/courses
```

## Tài Khoản Mặc Định

**Teacher:**
- Phone: `0336695863`
- Password: `password123`
- Role: `teacher`

**Students:**
- Phone: `0912345678`, `0922345678`, `0932345678`
- Password: `password123`
- Role: `student`

## Cấu Trúc Thư Mục

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── CourseController.php
│   │   │   ├── UserController.php
│   │   │   ├── BlogController.php
│   │   │   └── CategoryController.php
│   │   └── Middleware/
│   │       └── CheckRole.php
│   └── Models/
│       ├── User.php
│       ├── Course.php
│       ├── Post.php
│       ├── Category.php
│       └── OtpLog.php
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
└── .env
```

## Features

### ✅ Đã Hoàn Thành
- Authentication với Sanctum
- JWT-like token system
- Role-based access control
- CRUD operations cho Courses, Users, Posts
- Soft deletes
- Rate limiting cho login
- OTP system cho reset password
- Validation và error handling
- Database relationships

### 🔄 Sẽ Tích Hợp Prisma
- Thay thế Eloquent ORM bằng Prisma
- Tối ưu performance queries
- Type-safe database operations

### 📋 Roadmap
- Student APIs
- Admin APIs
- File upload system
- Email notifications
- Real-time features
- Testing suite
- API documentation với Swagger

## Troubleshooting

### Database Connection Error
```bash
# Kiểm tra MySQL service
# Cập nhật .env với thông tin database đúng
# Tạo database namthuedu trước khi chạy migrate
```

### Migration Error
```bash
php artisan migrate:fresh --seed
```

### Permission Error
```bash
chmod -R 775 storage bootstrap/cache
```

## Development

### Tạo Controller mới
```bash
php artisan make:controller ExampleController --resource
```

### Tạo Model mới
```bash
php artisan make:model Example -m
```

### Tạo Middleware mới
```bash
php artisan make:middleware ExampleMiddleware
```

### Chạy tests
```bash
php artisan test
```

---

**Version**: 1.0.0  
**Laravel Version**: 8.x  
**PHP Version**: >= 7.4  
**Database**: MySQL 5.7+