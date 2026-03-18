# Hướng Dẫn Setup Database - Nam Thu Edu

## ✅ Tình Trạng Hiện Tại

Database đã được chuẩn bị sẵn sàng với:
- ✅ Migrations: 9 files (users, courses, posts, categories, otp_logs, etc.)
- ✅ Seeders: CategorySeeder, UserSeeder
- ✅ .env configuration: Đã có sẵn

## 🚀 Setup Nhanh (3 Bước)

### Bước 1: Tạo Database trong MySQL

**Option A: Dùng phpMyAdmin**
1. Mở phpMyAdmin: `http://localhost/phpmyadmin`
2. Click tab "Databases"
3. Tạo database mới tên: `namthuedu`
4. Collation: `utf8mb4_unicode_ci`

**Option B: Dùng MySQL Command Line**
```bash
# Mở MySQL
mysql -u root -p

# Tạo database
CREATE DATABASE namthuedu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Kiểm tra
SHOW DATABASES;

# Thoát
exit;
```

**Option C: Dùng MySQL Workbench**
1. Mở MySQL Workbench
2. Connect to localhost
3. Right-click → Create Schema
4. Name: `namthuedu`
5. Charset: `utf8mb4`, Collation: `utf8mb4_unicode_ci`

---

### Bước 2: Cấu Hình .env (Đã có sẵn)

File `backend/.env` đã được config sẵn:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=namthuedu
DB_USERNAME=root
DB_PASSWORD=              # ← Thay password MySQL của bạn (nếu có)
```

**Nếu MySQL có password:**
```env
DB_PASSWORD=your_mysql_password
```

---

### Bước 3: Chạy Migrations & Seeders

```bash
# Di chuyển vào thư mục backend
cd backend

# Chạy migrations (tạo tables)
php artisan migrate

# Chạy seeders (tạo dữ liệu mẫu)
php artisan db:seed --class=CategorySeeder
php artisan db:seed --class=UserSeeder
```

**Kết quả:**
```
Migration table created successfully.
Migrating: 2014_10_12_000000_create_users_table
Migrated:  2014_10_12_000000_create_users_table (50.23ms)
Migrating: 2014_10_12_100000_create_password_resets_table
Migrated:  2014_10_12_100000_create_password_resets_table (30.45ms)
...
Database seeding completed successfully.
```

---

## 📊 Database Schema Đã Tạo

### Tables (9 tables)

1. **users** - Người dùng (teachers, students, admin)
2. **course** - Khóa học
3. **posts** - Bài viết/blog
4. **category** - Danh mục
5. **otp_logs** - Lịch sử OTP
6. **personal_access_tokens** - Sanctum tokens
7. **password_resets** - Reset password
8. **failed_jobs** - Failed queue jobs
9. **migrations** - Migration history

### Sample Data (Seeders)

**Categories:**
- Giao tiếp
- Ngữ pháp
- Từ vựng
- IELTS
- TOEIC

**Users:**
- 1 Teacher: `0336695863` / `password123`
- 3 Students: `0912345678`, `0922345678`, `0932345678` / `password123`

---

## 🔍 Kiểm Tra Database

### Option 1: MySQL Command Line
```bash
mysql -u root -p

USE namthuedu;

# Xem tất cả tables
SHOW TABLES;

# Xem users
SELECT uId, uName, uPhone, uRole FROM users;

# Xem categories
SELECT * FROM category;

exit;
```

### Option 2: phpMyAdmin
1. Mở `http://localhost/phpmyadmin`
2. Click database `namthuedu`
3. Xem các tables và dữ liệu

### Option 3: Laravel Tinker
```bash
cd backend

php artisan tinker

# Xem users
User::all();

# Xem categories
Category::all();

# Xem courses
Course::all();

exit
```

---

## 🧪 Test API với Database

### 1. Khởi động Laravel server
```bash
cd backend
php artisan serve
```

Server chạy tại: `http://localhost:8000`

### 2. Test Login API
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "0336695863",
    "password": "password123"
  }'
```

**Response mong đợi:**
```json
{
  "status": "success",
  "data": {
    "access_token": "1|xxxxxxxxxxxxx",
    "user": {
      "id": 1,
      "name": "Nguyễn Văn Giáo Viên",
      "phone": "0336695863",
      "age": 30,
      "role": "teacher"
    }
  }
}
```

### 3. Test Teacher Courses API
```bash
# Lấy token từ response trên
TOKEN="1|xxxxxxxxxxxxx"

curl -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     http://localhost:8000/api/teacher/courses
```

---

## ❌ Troubleshooting

### Lỗi: "Access denied for user 'root'@'localhost'"
**Nguyên nhân:** Password MySQL không đúng

**Giải pháp:**
```env
# Sửa file backend/.env
DB_PASSWORD=your_correct_password
```

### Lỗi: "Unknown database 'namthuedu'"
**Nguyên nhân:** Chưa tạo database

**Giải pháp:**
```bash
mysql -u root -p
CREATE DATABASE namthuedu;
exit;
```

### Lỗi: "SQLSTATE[HY000] [2002] Connection refused"
**Nguyên nhân:** MySQL service chưa chạy

**Giải pháp:**
- **Windows (XAMPP)**: Mở XAMPP Control Panel → Start MySQL
- **Windows (WAMP)**: Mở WAMP → Start MySQL
- **Mac**: `brew services start mysql`
- **Linux**: `sudo service mysql start`

### Lỗi: "Nothing to migrate"
**Nguyên nhân:** Migrations đã chạy rồi

**Giải pháp:**
```bash
# Xem status
php artisan migrate:status

# Nếu muốn chạy lại (XÓA DỮ LIỆU CŨ)
php artisan migrate:fresh --seed
```

---

## 🔄 Reset Database (Nếu cần)

### Reset toàn bộ và chạy lại
```bash
cd backend

# Xóa tất cả tables và chạy lại migrations + seeders
php artisan migrate:fresh --seed
```

**⚠️ CẢNH BÁO:** Lệnh này sẽ XÓA TẤT CẢ dữ liệu!

### Chỉ chạy lại seeders
```bash
# Xóa dữ liệu cũ và seed lại
php artisan db:seed --class=CategorySeeder
php artisan db:seed --class=UserSeeder
```

---

## 📝 Checklist Setup

- [ ] MySQL service đang chạy
- [ ] Database `namthuedu` đã được tạo
- [ ] File `.env` đã config đúng (DB_PASSWORD)
- [ ] Chạy `php artisan migrate` thành công
- [ ] Chạy seeders thành công
- [ ] Test login API thành công
- [ ] Test teacher courses API thành công

---

## 🎯 Kết Luận

**KHÔNG CẦN** tạo database schema thủ công! Laravel migrations đã lo hết:
- ✅ Tự động tạo tables
- ✅ Tự động tạo relationships
- ✅ Tự động tạo indexes
- ✅ Seeders tạo dữ liệu mẫu

Chỉ cần:
1. Tạo database `namthuedu` trong MySQL
2. Config password trong `.env` (nếu có)
3. Chạy `php artisan migrate` và `php artisan db:seed`

**Xong!** 🎉

---

**Last Updated**: 2026-03-18  
**Status**: ✅ Ready to use
