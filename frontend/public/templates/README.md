# 📚 Hướng Dẫn Sử Dụng Template Đề Thi

## 🎯 Mục đích
Các file template JSON này giúp giáo viên dễ dàng tạo đề thi theo cấu trúc chuẩn, tiết kiệm thời gian và đảm bảo tính nhất quán.

## 📁 Danh sách Template

### 1. VSTEP Templates
- **vstep-listening-template.json** - Đề thi VSTEP Listening
- **vstep-reading-template.json** - Đề thi VSTEP Reading

### 2. IELTS Templates
- **ielts-listening-template.json** - Đề thi IELTS Listening

### 3. General Templates
- **general-mixed-template.json** - Đề thi tổng hợp các kỹ năng

## 🚀 Cách Sử Dụng

### Bước 1: Chọn Template Phù Hợp
Chọn file template phù hợp với loại đề thi bạn muốn tạo.

### Bước 2: Copy & Chỉnh Sửa
1. Mở file template
2. Copy toàn bộ nội dung
3. Chỉnh sửa theo nhu cầu:
   - Thay đổi tiêu đề, mô tả đề thi
   - Sửa nội dung câu hỏi
   - Thay đổi đáp án
   - Thêm/bớt câu hỏi

### Bước 3: Import vào Hệ Thống
1. Vào trang "Tạo đề thi mới"
2. Click nút "Import JSON"
3. Paste nội dung đã chỉnh sửa
4. Click "Import"

## 📝 Cấu Trúc JSON

### Thông tin đề thi (exam_info)
```json
{
  "exam_info": {
    "title": "Tiêu đề đề thi",
    "description": "Mô tả chi tiết",
    "type": "VSTEP|IELTS|GENERAL",
    "skill": "listening|reading|writing|speaking|mixed",
    "duration_minutes": 60,
    "instructions": "Hướng dẫn làm bài"
  }
}
```

### Câu hỏi trắc nghiệm (Multiple Choice)
```json
{
  "content": "Nội dung câu hỏi",
  "type": "multiple_choice",
  "skill": "listening|reading|grammar|vocabulary",
  "part": 1,
  "points": 1,
  "audio_url": "audio/file.mp3",  // Chỉ cho listening
  "passage_text": "Đoạn văn",     // Chỉ cho reading
  "answers": [
    {
      "content": "Đáp án A",
      "is_correct": false
    },
    {
      "content": "Đáp án B",
      "is_correct": true
    }
  ]
}
```

### Câu hỏi điền từ (Fill in the Blank)
```json
{
  "content": "Câu hỏi có chỗ trống ___________",
  "type": "fill_blank",
  "skill": "listening|reading|grammar",
  "part": 1,
  "points": 1,
  "answers": [
    {
      "content": "đáp án đúng",
      "is_correct": true
    }
  ]
}
```

## 🎨 Các Loại Câu Hỏi Hỗ Trợ

### 1. Multiple Choice (Trắc nghiệm)
- Có 2-4 đáp án
- Chỉ 1 đáp án đúng
- Phù hợp cho: Listening, Reading, Grammar, Vocabulary

### 2. Fill in the Blank (Điền từ)
- Điền từ/cụm từ vào chỗ trống
- Có thể có nhiều đáp án đúng (synonyms)
- Phù hợp cho: Listening, Reading, Grammar

### 3. True/False (Đúng/Sai)
```json
{
  "content": "Câu phát biểu",
  "type": "true_false",
  "answers": [
    {
      "content": "True",
      "is_correct": true
    }
  ]
}
```

### 4. Matching (Nối)
```json
{
  "content": "Nối các cặp phù hợp",
  "type": "matching",
  "pairs": [
    {
      "left": "Item 1",
      "right": "Match 1"
    }
  ]
}
```

## 💡 Tips & Best Practices

### 1. Đặt tên file audio rõ ràng
- ✅ `vstep-b2-listening-part1-q1.mp3`
- ❌ `audio1.mp3`

### 2. Viết câu hỏi rõ ràng
- Tránh câu hỏi mơ hồ
- Đảm bảo chỉ có 1 đáp án đúng duy nhất
- Các đáp án sai phải hợp lý

### 3. Phân bổ điểm hợp lý
- Câu dễ: 1 điểm
- Câu trung bình: 2 điểm
- Câu khó: 3-5 điểm

### 4. Kiểm tra kỹ trước khi import
- Đảm bảo JSON syntax đúng
- Kiểm tra tất cả đáp án đã đánh dấu đúng/sai
- Xác nhận file audio/passage text đã có

## 🔧 Xử Lý Lỗi Thường Gặp

### Lỗi: "Invalid JSON format"
**Nguyên nhân:** Thiếu dấu phẩy, ngoặc, hoặc quote
**Giải pháp:** Sử dụng JSON validator online để kiểm tra

### Lỗi: "Missing required field"
**Nguyên nhân:** Thiếu trường bắt buộc (content, type, answers)
**Giải pháp:** Đảm bảo mỗi câu hỏi có đầy đủ thông tin

### Lỗi: "No correct answer found"
**Nguyên nhân:** Không có đáp án nào được đánh dấu is_correct: true
**Giải pháp:** Đảm bảo ít nhất 1 đáp án có is_correct: true

## 📞 Hỗ Trợ
Nếu gặp vấn đề, vui lòng liên hệ:
- Email: support@namthuedu.com
- Hotline: 0336695863

## 📄 License
© 2026 NamThuEdu - All rights reserved
