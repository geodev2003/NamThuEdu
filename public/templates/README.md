# 📝 HƯỚNG DẪN TẠO FILE MẪU IMPORT HỌC VIÊN

## Cách tạo file mẫu

Vì lý do kỹ thuật, bạn cần tạo file Excel mẫu thủ công theo hướng dẫn dưới đây:

### Bước 1: Tạo file Excel mới

1. Mở Microsoft Excel, Google Sheets hoặc LibreOffice Calc
2. Tạo file mới

### Bước 2: Tạo Sheet "Danh sách học viên"

Tạo bảng với các cột sau (dòng đầu tiên):

| Họ và tên | Số điện thoại | Email | Ngày sinh | Nhóm lớp | Lớp | Trạng thái |
|-----------|---------------|-------|-----------|----------|-----|------------|

### Bước 3: Thêm dữ liệu mẫu

Thêm 3 dòng dữ liệu mẫu:

| Họ và tên | Số điện thoại | Email | Ngày sinh | Nhóm lớp | Lớp | Trạng thái |
|-----------|---------------|-------|-----------|----------|-----|------------|
| Nguyễn Văn A | 0904521297 | nguyenvana@gmail.com | 2005-03-15 | Thiếu niên | IELTS 6.5 | Đang học |
| Trần Thị B | 0909876543 | tranthib@gmail.com | 2008-07-20 | Trẻ em | Cambridge YLE | Đang học |
| Lê Văn C | 0912345678 | levanc@gmail.com | 1995-11-10 | Người lớn | TOEIC 750 | Đang học |

### Bước 4: Tạo Sheet "Hướng dẫn" (tùy chọn)

Tạo sheet thứ 2 với tên "Hướng dẫn" và bảng sau:

| CỘT | BẮT BUỘC | ĐỊNH DẠNG | VÍ DỤ | GHI CHÚ |
|-----|----------|-----------|-------|---------|
| Họ và tên | Có | Văn bản | Nguyễn Văn A | Họ tên đầy đủ của học viên |
| Số điện thoại | Có | Số (10 chữ số) | 0904521297 | Số điện thoại liên hệ |
| Email | Không | Email hợp lệ | email@gmail.com | Để trống nếu không có |
| Ngày sinh | Có | YYYY-MM-DD | 2005-03-15 | Định dạng: Năm-Tháng-Ngày |
| Nhóm lớp | Có | Trẻ em / Thiếu niên / Người lớn | Thiếu niên | Chọn 1 trong 3 giá trị |
| Lớp | Không | Văn bản | IELTS 6.5 | Tên lớp học (nếu có) |
| Trạng thái | Có | Đang học / Tạm nghỉ | Đang học | Chọn 1 trong 2 giá trị |

### Bước 5: Lưu file

1. Lưu file với tên: `Mau_Import_Hoc_Vien.xlsx`
2. Định dạng: Excel Workbook (.xlsx)
3. Lưu vào thư mục `public/templates/` của dự án

## ✅ Hoàn tất!

File mẫu đã sẵn sàng để giáo viên tải xuống và sử dụng.

---

## 📋 Quy tắc quan trọng

### Các cột BẮT BUỘC:
- ✅ Họ và tên
- ✅ Số điện thoại
- ✅ Ngày sinh
- ✅ Nhóm lớp
- ✅ Trạng thái

### Các cột TÙY CHỌN:
- ❌ Email (có thể để trống)
- ❌ Lớp (có thể để trống)

### Định dạng đặc biệt:

**Ngày sinh:** YYYY-MM-DD (ví dụ: 2005-03-15)

**Nhóm lớp:** Chỉ được chọn 1 trong 3:
- Trẻ em
- Thiếu niên
- Người lớn

**Trạng thái:** Chỉ được chọn 1 trong 2:
- Đang học
- Tạm nghỉ

**Số điện thoại:** 10 chữ số, bắt đầu bằng 0 (ví dụ: 0904521297)

---

## 💡 Mẹo

1. Copy file mẫu này để tạo file import thực tế
2. Xóa 3 dòng dữ liệu mẫu
3. Điền thông tin học viên thực tế
4. Kiểm tra kỹ định dạng trước khi upload

---

**Xem hướng dẫn chi tiết tại:** `/docs/HUONG-DAN-IMPORT-HOC-VIEN.md`
