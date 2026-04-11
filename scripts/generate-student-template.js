import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tạo dữ liệu mẫu cho template
const templateData = [
  {
    'Họ và tên': 'Nguyễn Văn A',
    'Số điện thoại': '0904521297',
    'Email': 'nguyenvana@gmail.com',
    'Ngày sinh': '2005-03-15',
    'Nhóm lớp': 'Thiếu niên',
    'Lớp': 'IELTS 6.5',
    'Trạng thái': 'Đang học'
  },
  {
    'Họ và tên': 'Trần Thị B',
    'Số điện thoại': '0909876543',
    'Email': 'tranthib@gmail.com',
    'Ngày sinh': '2008-07-20',
    'Nhóm lớp': 'Trẻ em',
    'Lớp': 'Cambridge YLE',
    'Trạng thái': 'Đang học'
  },
  {
    'Họ và tên': 'Lê Văn C',
    'Số điện thoại': '0912345678',
    'Email': 'levanc@gmail.com',
    'Ngày sinh': '1995-11-10',
    'Nhóm lớp': 'Người lớn',
    'Lớp': 'TOEIC 750',
    'Trạng thái': 'Đang học'
  }
];

// Tạo workbook
const wb = XLSX.utils.book_new();

// Tạo worksheet từ dữ liệu
const ws = XLSX.utils.json_to_sheet(templateData);

// Thiết lập độ rộng cột
ws['!cols'] = [
  { wch: 25 }, // Họ và tên
  { wch: 15 }, // Số điện thoại
  { wch: 30 }, // Email
  { wch: 12 }, // Ngày sinh
  { wch: 15 }, // Nhóm lớp
  { wch: 20 }, // Lớp
  { wch: 12 }, // Trạng thái
];

// Thêm worksheet vào workbook
XLSX.utils.book_append_sheet(wb, ws, 'Danh sách học viên');

// Tạo worksheet hướng dẫn
const instructionData = [
  { 'CỘT': 'Họ và tên', 'BẮT BUỘC': 'Có', 'ĐỊNH DẠNG': 'Văn bản', 'VÍ DỤ': 'Nguyễn Văn A', 'GHI CHÚ': 'Họ tên đầy đủ của học viên' },
  { 'CỘT': 'Số điện thoại', 'BẮT BUỘC': 'Có', 'ĐỊNH DẠNG': 'Số (10 chữ số)', 'VÍ DỤ': '0904521297', 'GHI CHÚ': 'Số điện thoại liên hệ' },
  { 'CỘT': 'Email', 'BẮT BUỘC': 'Không', 'ĐỊNH DẠNG': 'Email hợp lệ', 'VÍ DỤ': 'email@gmail.com', 'GHI CHÚ': 'Để trống nếu không có' },
  { 'CỘT': 'Ngày sinh', 'BẮT BUỘC': 'Có', 'ĐỊNH DẠNG': 'YYYY-MM-DD', 'VÍ DỤ': '2005-03-15', 'GHI CHÚ': 'Định dạng: Năm-Tháng-Ngày' },
  { 'CỘT': 'Nhóm lớp', 'BẮT BUỘC': 'Có', 'ĐỊNH DẠNG': 'Trẻ em / Thiếu niên / Người lớn', 'VÍ DỤ': 'Thiếu niên', 'GHI CHÚ': 'Chọn 1 trong 3 giá trị' },
  { 'CỘT': 'Lớp', 'BẮT BUỘC': 'Không', 'ĐỊNH DẠNG': 'Văn bản', 'VÍ DỤ': 'IELTS 6.5', 'GHI CHÚ': 'Tên lớp học (nếu có)' },
  { 'CỘT': 'Trạng thái', 'BẮT BUỘC': 'Có', 'ĐỊNH DẠNG': 'Đang học / Tạm nghỉ', 'VÍ DỤ': 'Đang học', 'GHI CHÚ': 'Chọn 1 trong 2 giá trị' }
];

const wsInstruction = XLSX.utils.json_to_sheet(instructionData);

// Thiết lập độ rộng cột cho sheet hướng dẫn
wsInstruction['!cols'] = [
  { wch: 18 }, // Cột
  { wch: 12 }, // Bắt buộc
  { wch: 30 }, // Định dạng
  { wch: 25 }, // Ví dụ
  { wch: 35 }, // Ghi chú
];

// Thêm sheet hướng dẫn
XLSX.utils.book_append_sheet(wb, wsInstruction, 'Hướng dẫn');

// Lưu file
const outputPath = path.join(__dirname, '../public/templates/student-import-template.xlsx');
XLSX.writeFile(wb, outputPath);

console.log('✅ Đã tạo file template thành công tại:', outputPath);
