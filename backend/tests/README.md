# Nam Thu Education - API Testing Guide

## Tổng quan

Dự án này sử dụng PHPUnit để test các API endpoints với database thật (MySQL).

## Cấu trúc Tests

```
tests/
├── Feature/              # Feature tests (API endpoints)
│   ├── AuthApiTest.php           # Authentication APIs
│   ├── CourseApiTest.php         # Course management APIs
│   ├── ExamApiTest.php           # Exam management APIs
│   ├── GradingApiTest.php        # Grading APIs
│   ├── StudentTestApiTest.php    # Student test-taking APIs
│   ├── ClassApiTest.php          # Class management APIs
│   ├── AdminApiTest.php          # Admin APIs
│   └── TestAssignmentApiTest.php # Test assignment APIs
├── Unit/                 # Unit tests
└── TestCase.php         # Base test class
```

## Cài đặt

### 1. Tạo database test

```sql
CREATE DATABASE namthuedu_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Cấu hình môi trường test

File `.env.testing` đã được tạo với cấu hình:
- Database: `namthuedu_test`
- Cache: `array`
- Session: `array`
- Mail: `array`

### 3. Cài đặt dependencies

```bash
cd backend
composer install
```

## Chạy Tests

### Chạy tất cả tests

```bash
cd backend
php artisan test
```

hoặc

```bash
./vendor/bin/phpunit
```

### Chạy một test file cụ thể

```bash
php artisan test --filter=AuthApiTest
php artisan test --filter=ExamApiTest
php artisan test --filter=CourseApiTest
```

### Chạy một test method cụ thể

```bash
php artisan test --filter=teacher_can_create_exam
php artisan test --filter=student_can_start_test
```

### Chạy tests với coverage

```bash
./vendor/bin/phpunit --coverage-html coverage
```

### Chạy tests với output chi tiết

```bash
php artisan test --verbose
./vendor/bin/phpunit --testdox
```

## Các Test Cases

### 1. Authentication Tests (AuthApiTest)
- ✅ User login với credentials hợp lệ
- ✅ User không thể login với credentials sai
- ✅ User logout
- ✅ Refresh token

### 2. Course Tests (CourseApiTest)
- ✅ Teacher tạo khóa học
- ✅ Teacher xem danh sách khóa học
- ✅ Teacher thêm học sinh vào khóa học
- ✅ Teacher cập nhật khóa học
- ✅ Teacher xóa khóa học
- ✅ Student không thể tạo khóa học

### 3. Exam Tests (ExamApiTest)
- ✅ Teacher tạo đề thi
- ✅ Teacher xem danh sách đề thi
- ✅ Teacher thêm câu hỏi vào đề thi
- ✅ Teacher publish đề thi
- ✅ Teacher clone đề thi
- ✅ Teacher xóa đề thi

### 4. Grading Tests (GradingApiTest)
- ✅ Teacher xem danh sách bài làm
- ✅ Teacher xem chi tiết bài làm
- ✅ Teacher auto-grade bài làm
- ✅ Teacher chấm điểm thủ công
- ✅ Teacher chấm điểm chi tiết từng câu
- ✅ Teacher xem thống kê chấm điểm

### 5. Student Test Tests (StudentTestApiTest)
- ✅ Student xem bài thi được giao
- ✅ Student bắt đầu làm bài
- ✅ Student submit câu trả lời
- ✅ Student nộp bài
- ✅ Student xem lịch sử bài làm
- ✅ Student không thể bắt đầu bài thi 2 lần

### 6. Class Tests (ClassApiTest)
- ✅ Teacher tạo lớp học
- ✅ Teacher thêm học sinh vào lớp
- ✅ Teacher chuyển học sinh giữa các lớp
- ✅ Teacher xem thống kê lớp học
- ✅ Teacher xóa học sinh khỏi lớp

### 7. Admin Tests (AdminApiTest)
- ✅ Admin xem tất cả users
- ✅ Admin tạo user mới
- ✅ Admin thay đổi role của user
- ✅ Admin khóa/mở khóa user
- ✅ Admin xem bài viết chờ duyệt
- ✅ Admin duyệt/từ chối bài viết
- ✅ Admin xem thống kê hệ thống
- ✅ Teacher/Student không thể truy cập admin routes

### 8. Test Assignment Tests (TestAssignmentApiTest)
- ✅ Teacher giao bài cho học sinh
- ✅ Teacher giao bài cho lớp
- ✅ Teacher xem danh sách bài đã giao
- ✅ Teacher xem tiến độ làm bài
- ✅ Teacher xóa bài đã giao
- ✅ Teacher giao bài hàng loạt
- ✅ Teacher xem thống kê bài giao

## Database Factories

Các factory đã được tạo để hỗ trợ testing:

- `UserFactory` - Tạo users (student, teacher, admin)
- `ExamFactory` - Tạo đề thi
- `ExamTypeFactory` - Tạo loại đề thi
- `QuestionFactory` - Tạo câu hỏi
- `CourseFactory` - Tạo khóa học
- `CategoryFactory` - Tạo danh mục
- `ClassesFactory` - Tạo lớp học
- `ClassEnrollmentFactory` - Tạo enrollment
- `SubmissionFactory` - Tạo bài làm
- `PostFactory` - Tạo bài viết
- `TestAssignmentFactory` - Tạo bài giao

## Lưu ý quan trọng

### RefreshDatabase Trait
Tất cả tests sử dụng `RefreshDatabase` trait để:
- Tự động migrate database trước mỗi test
- Rollback sau mỗi test
- Đảm bảo tests độc lập với nhau

### Authentication
Tests sử dụng Laravel Sanctum tokens:
```php
$token = $user->createToken('test-token')->plainTextToken;

$response = $this->withHeaders([
    'Authorization' => 'Bearer ' . $token,
])->getJson('/api/endpoint');
```

### Assertions phổ biến

```php
// Status code
$response->assertStatus(200);
$response->assertStatus(201);
$response->assertStatus(403);

// JSON structure
$response->assertJsonStructure([
    'status',
    'data' => ['key1', 'key2']
]);

// Database
$this->assertDatabaseHas('table', ['column' => 'value']);
$this->assertDatabaseMissing('table', ['column' => 'value']);
$this->assertDatabaseCount('table', 5);
$this->assertSoftDeleted('table', ['id' => 1]);
```

## Troubleshooting

### Database connection error
```bash
# Kiểm tra database đã tạo chưa
mysql -u root -p
CREATE DATABASE namthuedu_test;

# Kiểm tra credentials trong .env.testing
```

### Migration errors
```bash
# Chạy migration thủ công
php artisan migrate --env=testing

# Reset database
php artisan migrate:fresh --env=testing
```

### Factory errors
```bash
# Clear cache
php artisan config:clear
php artisan cache:clear
composer dump-autoload
```

## Best Practices

1. **Mỗi test nên độc lập**: Không phụ thuộc vào thứ tự chạy
2. **Sử dụng factories**: Tạo test data với factories thay vì hardcode
3. **Test cả success và failure cases**: Kiểm tra cả trường hợp thành công và thất bại
4. **Descriptive test names**: Tên test rõ ràng, mô tả chức năng
5. **Arrange-Act-Assert pattern**: Tổ chức code test rõ ràng

## Continuous Integration

Để chạy tests trong CI/CD pipeline:

```yaml
# .github/workflows/tests.yml
- name: Run tests
  run: |
    cd backend
    cp .env.testing .env
    php artisan key:generate
    php artisan migrate --force
    php artisan test
```

## Kết quả mong đợi

Khi chạy tất cả tests, bạn sẽ thấy:

```
PASS  Tests\Feature\AuthApiTest
✓ user can login with valid credentials
✓ user cannot login with invalid credentials
✓ user can logout
✓ user can refresh token

PASS  Tests\Feature\ExamApiTest
✓ teacher can create exam
✓ teacher can view their exams
✓ teacher can add questions to exam
...

Tests:  50+ passed
Time:   < 30s
```

## Liên hệ

Nếu có vấn đề với tests, vui lòng tạo issue hoặc liên hệ team.
