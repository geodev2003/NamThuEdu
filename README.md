# NamThuEdu'

Backend = PHP thuần
Frontend = VueJS
Database = MySQL

Chấm writing => Gọi API KEY Gemini => JSON => FE

## Giáo viên upload file Test 

### 1. Trực tiếp giao diện 

### 2. Up file lên (word, excel, csv, pdf) => File mẫu


## Chức năng chính

### 1. Giáo viên

#### 1.1 Quản lý tài khoản học viên

**Tạo tài khoản (1 hoặc hàng loạt)**
+ Tạo tài khoản (SĐT + Mật khẩu random) 
+ Đăng nhập lần đầu => Yêu cầu đổi Mật khẩu hay không? => Nếu đổi gửi OTP xác thực về SĐT => Xác thực => Update Mật khẩu mới lên DB

**Xóa (soft delete)**
+ Xóa (soft delete) => Trạng thái tài khoản từ "Active" sang "Non-Active"
  
**Gán tài khoản học viên vô Một lớp học**
+ Thêm học viên vô một lớp học

**Restore tài khoản** 
+ Chuyển trạng thái từ "Non-Active" sang "Active"

#### 1.2 Quản lý test

**Tạo bài test mới**

    - ***Tạo trên giao diện***

        + Nhập tên bài test

        + Chế độ ***Private***

        + Thời gian làm bài

        + Chọn Skill 

            + If ***Listening***:

                + Up record

                + Up câu hỏi + đáp án + đáp án chính xác

                + Up transcript

                + Ràng buộc chỉ **Nghe được 1 lần**

            + If ***Reading***:

                + Up paragraph

                + Up câu hỏi + đáp án + đáp án chính xác

                + Giải thích (Optional)

            + If ***Writing***:

                + Up câu hỏi

            + If ***Speaking***:

                + Up câu hỏi

        + Bấm **Lưu**

    - ***Tạo bằng Upload file***

        + File excel/.csv mẫu (trong đó có những cột đã được đặt tên rồi) 

            + Đối với ***Listening***: 

                + Trong file excel/csv, ghi tên file record tương ứng với test/câu hỏi

                + Up kèm .zip

        + File word mẫu => Chuyển word sang excel => Xử lý như trên

        + Đọc file upload lên

        + Bấm **Lưu**

**Sửa bài test**

**Xóa bài test**

**Chấm bài test**
    - ***Nghe file Speaking*** => Chấm điểm

**Giao bài test**
    - ***Giao cho lớp***
        + Deadline
        + Số lượng làm (1 hoặc nhiều lần)
        + Chuyển chế độ ***Private*** sang ***Public***
        + Gán *ID* lớp
    - ***Giao cho một/một số học viên***
        + Deadline
        + Số lượng làm (1 hoặc nhiều lần)
        + Chuyển chế độ ***Private*** sang ***Public***
        + Gán *ID* học viên


#### 1.3 Quản lý bài đăng
- **Đăng bài**
    - ***Video***
        + Link youtube

    - ***Bài viết***

- **Sửa bài**

- **Xóa bài**

### 2. Học viên

#### 2.1 Thi 
- Thi xong coi điểm, đáp án, sửa (Listening, Reading)
- Đối với Writing coi sửa qua AI (Gemini)
- Đối với Speaking thì giáo viên nhận xét sau

#### 2.2 Luyện tập
- Đối với Speaking (Luyện trực tiếp với Thầy)

#### 2.3 Học từ vựng
- Game (Optional)
- Học Flashcard
- Nghe

#### 2.4 Lịch sử làm bài Luyện tập/Test
- Đối với bài Test coi được điểm
- Coi 

### 3. Hệ thống

#### 3.1 Quản lý truy cập

#### 3.2 Quản lý thông báo

#### 3.3 Ghi lịch sử/audit log

#### 3.4 Rate limit (Không cho đăng nhập sai nhiều lần,..)

#### 3.5 Bảo mật

## Phân chia nhiệm vụ

- **Thư**:  2.4, 2.2

- **Nhi**: 1.1, 1.2

- **Thuần** (bbb): 2.1, 3.3, 1.3

- **Tuần**: 3.1, 2.3

## Cấu trúc thư mục đề xuất
```
backend/
├── public/
│   └── index.php           # Entry point
│
├── app/
│   ├── Core/
│   │   ├── Router.php
│   │   ├── Controller.php
│   │   ├── Model.php
│   │   ├── Database.php
│   │   ├── Auth.php        # JWT, role check
│   │   ├── Validator.php
│   │   └── Response.php
│   │
│   ├── Modules/
│   │   ├── Auth/
│   │   │   ├── AuthController.php
│   │   │   └── AuthService.php
│   │   │
│   │   ├── User/
│   │   │   ├── UserController.php
│   │   │   ├── UserService.php
│   │   │   └── UserModel.php
│   │   │
│   │   ├── Class/
│   │   ├── Test/
│   │   ├── TestAssignment/
│   │   ├── Submission/
│   │   ├── Vocabulary/
│   │   ├── Post/
│   │   ├── Notification/
│   │   └── AuditLog/
│   │
│   └── Helpers/
│       ├── FileUpload.php
│       ├── OTPService.php
│       ├── ExcelReader.php
│       ├── WordParser.php
│       └── GeminiService.php
│
├── storage/
│   ├── audio/
│   ├── documents/
│   ├── submissions/
│   └── temp/
│
├── routes/
│   └── api.php
│
├── config/
│   ├── database.php
│   ├── jwt.php
│   └── app.php
│
└── vendor/
```

### 🔑 Nguyên tắc
**Controller**: nhận request, validate, gọi Service

**Service**: xử lý nghiệp vụ

**Model**: thao tác DB

**Helper**: xử lý file, OTP, AI

