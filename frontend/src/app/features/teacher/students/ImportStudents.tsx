import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Info,
  Users,
  Check,
} from "lucide-react";

type ImportStep = "upload" | "mapping" | "preview" | "result";

// Mock data for preview
const mockPreviewData = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    phone: "0901234567",
    email: "an.nguyen@email.com",
    dob: "15/03/2005",
    class: "IELTS 6.5",
    status: "valid",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    phone: "0912345678",
    email: "binh.tran@email.com",
    dob: "20/05/2004",
    class: "TOEIC 750",
    status: "valid",
  },
  {
    id: 3,
    name: "Lê Minh Châu",
    phone: "Invalid",
    email: "chau.le@email.com",
    dob: "10/08/2006",
    class: "Cambridge FCE",
    status: "error",
  },
  {
    id: 4,
    name: "Phạm Đức Duy",
    phone: "0934567890",
    email: "invalid-email",
    dob: "05/12/2005",
    class: "IELTS 7.0",
    status: "warning",
  },
  {
    id: 5,
    name: "Hoàng Thu Hà",
    phone: "0945678901",
    email: "ha.hoang@email.com",
    dob: "25/02/2005",
    class: "VSTEP B2",
    status: "valid",
  },
];

const columnMappings = [
  { source: "Họ và tên", target: "name" },
  { source: "Số điện thoại", target: "phone" },
  { source: "Email", target: "email" },
  { source: "Ngày sinh", target: "dob" },
  { source: "Lớp học", target: "class" },
];

export function ImportStudents() {
  const [currentStep, setCurrentStep] = useState<ImportStep>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.csv'))) {
      handleFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      valid: { icon: CheckCircle2, label: "Hợp lệ", color: "#10B981", bg: "#D1FAE5" },
      warning: { icon: AlertCircle, label: "Cảnh báo", color: "#F59E0B", bg: "#FEF3C7" },
      error: { icon: XCircle, label: "Lỗi", color: "#EF4444", bg: "#FEE2E2" },
    };
    const { icon: Icon, label, color, bg } = config[status as keyof typeof config];
    return (
      <div className="flex items-center gap-1.5">
        <Icon className="w-4 h-4" style={{ color }} />
        <span
          className="px-2 py-0.5 rounded-full text-xs font-medium"
          style={{ color, backgroundColor: bg }}
        >
          {label}
        </span>
      </div>
    );
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: "upload", label: "Tải file", number: 1 },
      { id: "mapping", label: "Ánh xạ cột", number: 2 },
      { id: "preview", label: "Xem trước", number: 3 },
      { id: "result", label: "Kết quả", number: 4 },
    ];

    const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = index < getCurrentStepIndex();
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all"
                    style={{
                      backgroundColor: isCompleted || isActive ? "#EA580C" : "#E5E7EB",
                      color: isCompleted || isActive ? "#FFFFFF" : "#9CA3AF",
                    }}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <p
                    className="mt-2 text-sm font-medium"
                    style={{ color: isActive ? "#EA580C" : "#6B7280" }}
                  >
                    {step.label}
                  </p>
                </div>
                {!isLast && (
                  <div
                    className="flex-1 h-0.5 mx-4 transition-all"
                    style={{ backgroundColor: isCompleted ? "#EA580C" : "#E5E7EB" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/giao-vien/students"
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#EA580C] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Quay lại</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#111827] mb-1">
            Import học sinh
          </h1>
          <p className="text-[#6B7280] text-sm">
            Dashboard &gt; Học viên &gt; Import học sinh
          </p>
        </div>
      </div>

      {renderStepIndicator()}

      {/* Step Content */}
      <div className="max-w-5xl mx-auto">
        {currentStep === "upload" && (
          <div>
            {/* Instructions Card */}
            <div className="bg-[#FFF7ED] border border-[#FDBA74] rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#EA580C] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#C2410C] mb-2">
                    Hướng dẫn import dữ liệu
                  </h3>
                  <ul className="space-y-1.5 text-sm text-[#C2410C]">
                    <li>• File phải có định dạng .xlsx hoặc .csv</li>
                    <li>• Dòng đầu tiên phải chứa tên các cột</li>
                    <li>• Các cột bắt buộc: Họ tên, Số điện thoại, Email</li>
                    <li>• Tối đa 1000 học sinh mỗi lần import</li>
                    <li>• Số điện thoại phải hợp lệ (10 số, bắt đầu bằng 0)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Template Download */}
            <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#10B98115] flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111827] mb-1">
                      Tải file mẫu
                    </h3>
                    <p className="text-sm text-[#6B7280]">
                      Sử dụng file Excel mẫu để đảm bảo định dạng đúng
                    </p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors font-medium">
                  <Download className="w-4 h-4" />
                  Tải xuống mẫu
                </button>
              </div>
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-xl p-8 border border-[#E5E7EB]">
              <div
                className="border-2 border-dashed rounded-xl p-12 text-center transition-all"
                style={{
                  borderColor: isDragging ? "#EA580C" : "#E5E7EB",
                  backgroundColor: isDragging ? "#FFF7ED" : "#F9FAFB",
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#111827] mb-2">
                  Kéo thả file hoặc click để chọn
                </h3>
                <p className="text-sm text-[#6B7280] mb-6">
                  Hỗ trợ: .xlsx, .csv (Tối đa 10MB)
                </p>
                <input
                  type="file"
                  id="file-upload"
                  accept=".xlsx,.csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors font-medium cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  Chọn file từ máy tính
                </label>
              </div>

              {selectedFile && (
                <div className="mt-6 p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="w-8 h-8 text-[#10B981]" />
                      <div>
                        <p className="font-medium text-[#111827]">{selectedFile.name}</p>
                        <p className="text-sm text-[#6B7280]">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-[#EF4444] hover:text-[#DC2626] font-medium text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              )}

              {selectedFile && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setCurrentStep("mapping")}
                    className="px-6 py-2.5 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors font-medium"
                  >
                    Tiếp tục
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === "mapping" && (
          <div className="bg-white rounded-xl p-8 border border-[#E5E7EB]">
            <h3 className="text-lg font-bold text-[#111827] mb-6">
              Ánh xạ các cột dữ liệu
            </h3>

            <div className="space-y-4 mb-8">
              {columnMappings.map((mapping, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-6 items-center p-4 bg-[#F9FAFB] rounded-lg"
                >
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">
                      Cột trong file Excel
                    </label>
                    <input
                      type="text"
                      value={mapping.source}
                      disabled
                      className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg bg-white text-[#9CA3AF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">
                      Trường trong hệ thống
                    </label>
                    <select className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C]">
                      <option value={mapping.target}>{mapping.source}</option>
                      <option value="skip">Bỏ qua cột này</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep("upload")}
                className="px-6 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-colors font-medium"
              >
                Quay lại
              </button>
              <button
                onClick={() => setCurrentStep("preview")}
                className="px-6 py-2.5 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors font-medium"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {currentStep === "preview" && (
          <div>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-[#EA580C]" />
                  <span className="text-sm text-[#6B7280]">Tổng số dòng</span>
                </div>
                <p className="text-3xl font-bold text-[#111827]">5</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  <span className="text-sm text-[#6B7280]">Hợp lệ</span>
                </div>
                <p className="text-3xl font-bold text-[#10B981]">3</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
                <div className="flex items-center gap-3 mb-2">
                  <XCircle className="w-5 h-5 text-[#EF4444]" />
                  <span className="text-sm text-[#6B7280]">Có lỗi</span>
                </div>
                <p className="text-3xl font-bold text-[#EF4444]">2</p>
              </div>
            </div>

            {/* Preview Table */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden mb-6">
              <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <h3 className="font-bold text-[#111827]">Xem trước dữ liệu</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        STT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Họ tên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        SĐT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Ngày sinh
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Lớp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {mockPreviewData.map((row, index) => (
                      <tr
                        key={row.id}
                        className="hover:bg-[#F9FAFB] transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-[#6B7280]">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#111827]">
                          {row.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#6B7280]">
                          {row.phone}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#6B7280]">
                          {row.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#6B7280]">
                          {row.dob}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#6B7280]">
                          {row.class}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(row.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#92400E] mb-1">
                    Lưu ý trước khi import
                  </p>
                  <p className="text-sm text-[#92400E]">
                    Có 2 dòng dữ liệu có lỗi sẽ bị bỏ qua. Chỉ 3 học sinh hợp lệ sẽ được thêm vào hệ thống.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep("mapping")}
                className="px-6 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-colors font-medium"
              >
                Quay lại
              </button>
              <button
                onClick={() => setCurrentStep("result")}
                className="px-6 py-2.5 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors font-medium"
              >
                Xác nhận import
              </button>
            </div>
          </div>
        )}

        {currentStep === "result" && (
          <div>
            {/* Success Message */}
            <div className="bg-white rounded-xl p-8 border border-[#E5E7EB] text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
              </div>
              <h3 className="text-2xl font-bold text-[#111827] mb-2">
                Import thành công!
              </h3>
              <p className="text-[#6B7280]">
                Đã thêm <span className="font-bold text-[#10B981]">3 học sinh</span> vào hệ thống
              </p>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] mb-6">
              <h3 className="font-bold text-[#111827] mb-4">Tóm tắt kết quả</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
                  <span className="text-sm text-[#6B7280]">Tổng số dòng đã xử lý</span>
                  <span className="font-bold text-[#111827]">5</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#D1FAE5] rounded-lg">
                  <span className="text-sm text-[#059669]">Thành công</span>
                  <span className="font-bold text-[#059669]">3</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#FEE2E2] rounded-lg">
                  <span className="text-sm text-[#DC2626]">Lỗi</span>
                  <span className="font-bold text-[#DC2626]">2</span>
                </div>
              </div>
            </div>

            {/* Error Details */}
            <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] mb-6">
              <h3 className="font-bold text-[#111827] mb-4">Chi tiết lỗi</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 bg-[#FEF3C7] rounded-lg">
                  <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#92400E]">
                      Dòng 3: Lê Minh Châu
                    </p>
                    <p className="text-sm text-[#92400E]">
                      Số điện thoại không hợp lệ
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-[#FEF3C7] rounded-lg">
                  <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#92400E]">
                      Dòng 4: Phạm Đức Duy
                    </p>
                    <p className="text-sm text-[#92400E]">
                      Email không đúng định dạng
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Link
                to="/giao-vien/students"
                className="px-6 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-colors font-medium"
              >
                Về trang quản lý
              </Link>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setCurrentStep("upload");
                }}
                className="px-6 py-2.5 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors font-medium"
              >
                Import file khác
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}