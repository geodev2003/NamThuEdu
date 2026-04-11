import { useState } from "react";
import { Link } from "react-router";
import * as XLSX from 'xlsx';
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
  X,
  BookOpen,
} from "lucide-react";

type ImportStep = "upload" | "mapping" | "preview" | "result";

interface PreviewStudent {
  id: number;
  name: string;
  phone: string;
  email: string;
  ageGroup: string;
  class: string;
  course: string;
  status: 'valid' | 'warning' | 'error';
  statusMessage?: string;
}

const columnMappings = [
  { source: "Họ và tên", target: "name" },
  { source: "Số điện thoại", target: "phone" },
  { source: "Email", target: "email" },
  { source: "Nhóm tuổi", target: "ageGroup" },
  { source: "Lớp", target: "class" },
  { source: "Khóa", target: "course" },
  { source: "Trạng thái", target: "statusText" },
];

export function ImportStudents() {
  const [currentStep, setCurrentStep] = useState<ImportStep>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewStudent[]>([]);
  const [validCount, setValidCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Function to download template Excel for import (without STT and Ngày tạo)
  const handleDownloadTemplate = () => {
    // Prevent multiple downloads
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    // Template data - only fields needed for import (7 columns)
    const templateData = [
      {
        'Họ và tên': 'Nguyễn Văn A',
        'Số điện thoại': '0900000001',
        'Email': '',
        'Nhóm tuổi': 'Trẻ em',
        'Lớp': 'Test Class',
        'Khóa': 'Khóa tháng 4',
        'Trạng thái': 'Đang học',
      },
      {
        'Họ và tên': 'Trần Thị B',
        'Số điện thoại': '0900000002',
        'Email': '',
        'Nhóm tuổi': 'Thiếu niên',
        'Lớp': 'Lớp THCS-THPT - Nhựt Tuấn',
        'Khóa': 'Khóa tháng 4',
        'Trạng thái': 'Đang học',
      },
      {
        'Họ và tên': 'Lê Văn C',
        'Số điện thoại': '0900000003',
        'Email': '',
        'Nhóm tuổi': 'Người lớn',
        'Lớp': 'Lớp Người lớn - Nhựt Tuấn',
        'Khóa': 'Khóa tháng 4',
        'Trạng thái': 'Đang học',
      },
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Set column widths (7 columns for import)
    ws['!cols'] = [
      { wch: 25 }, // Họ và tên
      { wch: 15 }, // Số điện thoại
      { wch: 30 }, // Email
      { wch: 15 }, // Nhóm tuổi
      { wch: 30 }, // Lớp
      { wch: 15 }, // Khóa
      { wch: 12 }, // Trạng thái
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Mẫu Import Học viên');

    // Generate filename
    const filename = `Mau_Import_Hoc_Vien.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
    
    // Lock button for 5 seconds to prevent multiple downloads
    setTimeout(() => {
      setIsDownloading(false);
    }, 5000);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 100); // Update every 100ms for smooth animation
    
    // Parse file after 2 seconds
    setTimeout(() => {
      parseExcelFile(file);
      setIsProcessing(false);
    }, 2000);
  };

  const parseExcelFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      // Validate and transform data
      const students: PreviewStudent[] = jsonData.map((row, index) => {
        const student: PreviewStudent = {
          id: index + 1,
          name: row['Họ và tên'] || '',
          phone: row['Số điện thoại'] || '',
          email: row['Email'] || '',
          ageGroup: row['Nhóm tuổi'] || '',
          class: row['Lớp'] || '',
          course: row['Khóa'] || '',
          status: 'valid',
        };

        // Validation logic
        const errors: string[] = [];
        const warnings: string[] = [];

        // Required fields
        if (!student.name) errors.push('Thiếu họ tên');
        if (!student.phone) errors.push('Thiếu số điện thoại');
        if (!student.ageGroup) errors.push('Thiếu nhóm tuổi');
        if (!student.class) errors.push('Thiếu lớp');

        // Phone validation (Vietnamese format)
        if (student.phone && !/^(0|\+84)[0-9]{9,10}$/.test(student.phone.replace(/\s/g, ''))) {
          errors.push('Số điện thoại không hợp lệ');
        }

        // Email validation (optional but must be valid if provided)
        if (student.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
          warnings.push('Email không đúng định dạng');
        }

        // Age group validation
        if (student.ageGroup && !['Trẻ em', 'Thiếu niên', 'Người lớn'].includes(student.ageGroup)) {
          errors.push('Nhóm tuổi không hợp lệ');
        }

        // Set status
        if (errors.length > 0) {
          student.status = 'error';
          student.statusMessage = errors.join(', ');
        } else if (warnings.length > 0) {
          student.status = 'warning';
          student.statusMessage = warnings.join(', ');
        }

        return student;
      });

      // Check for duplicate phone numbers within the file
      const phoneMap = new Map<string, number[]>();
      students.forEach((student, index) => {
        if (student.phone) {
          const normalizedPhone = student.phone.replace(/\s/g, '');
          if (!phoneMap.has(normalizedPhone)) {
            phoneMap.set(normalizedPhone, []);
          }
          phoneMap.get(normalizedPhone)!.push(index);
        }
      });

      // Mark duplicates as errors
      phoneMap.forEach((indices, phone) => {
        if (indices.length > 1) {
          // Get the row numbers for better error message
          const rowNumbers = indices.map(i => i + 1).join(', ');
          const duplicateMessage = `SĐT trùng lặp với dòng ${rowNumbers}`;
          
          indices.forEach(index => {
            const student = students[index];
            
            if (student.status === 'valid') {
              student.status = 'error';
              student.statusMessage = duplicateMessage;
            } else if (student.statusMessage) {
              student.statusMessage += '; ' + duplicateMessage;
            } else {
              student.statusMessage = duplicateMessage;
            }
            student.status = 'error';
          });
        }
      });

      // Count statuses (recount after duplicate check)
      const valid = students.filter(s => s.status === 'valid').length;
      const warning = students.filter(s => s.status === 'warning').length;
      const error = students.filter(s => s.status === 'error').length;

      setPreviewData(students);
      setValidCount(valid);
      setWarningCount(warning);
      setErrorCount(error);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
    }
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
                <div className="flex-1">
                  <h3 className="font-bold text-[#C2410C] mb-2">
                    Hướng dẫn import dữ liệu
                  </h3>
                  <ul className="space-y-1.5 text-sm text-[#C2410C]">
                    <li>• File phải có định dạng .xlsx hoặc .csv</li>
                    <li>• Dòng đầu tiên phải chứa tên các cột</li>
                    <li>• Các cột bắt buộc: Họ và tên, Số điện thoại, Nhóm tuổi, Lớp</li>
                    <li>• Số điện thoại phải hợp lệ và không trùng lặp</li>
                  </ul>
                  <button 
                    onClick={() => setShowGuideModal(true)}
                    className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-[#EA580C] hover:text-[#C2410C] hover:underline"
                  >
                    <BookOpen className="w-4 h-4" />
                    Xem hướng dẫn chi tiết
                  </button>
                </div>
              </div>
            </div>

            {/* Template Download */}
            <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#10B98115] flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111827] mb-1">
                      Tải file mẫu
                    </h3>
                    <p className="text-sm text-[#6B7280]">
                      File Excel mẫu với cấu trúc giống file export (7 cột, 3 dòng mẫu)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownloadTemplate}
                    disabled={isDownloading}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-medium ${
                      isDownloading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-[#10B981] hover:bg-[#059669]'
                    } text-white`}
                  >
                    <Download className="w-4 h-4" />
                    {isDownloading ? 'Đang tải...' : 'Tải Excel'}
                  </button>
                </div>
              </div>
              
              {/* Additional Help */}
              <div className="pt-4 border-t border-[#E5E7EB]">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#6B7280]">
                    💡 Tải file mẫu, điền thông tin và import vào hệ thống
                  </p>
                  <button 
                    onClick={() => setShowGuideModal(true)}
                    className="text-sm font-medium text-[#EA580C] hover:text-[#C2410C] hover:underline flex items-center gap-1"
                  >
                    <BookOpen className="w-4 h-4" />
                    Xem hướng dẫn
                  </button>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-xl p-8 border border-[#E5E7EB]">
              {/* Selected File Display - Above drag area */}
              {selectedFile && (
                <div className="mb-6 p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="w-10 h-10 text-[#10B981]" />
                      <div>
                        <p className="font-medium text-[#111827]">{selectedFile.name}</p>
                        <p className="text-sm text-[#6B7280]">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setIsProcessing(false);
                        setUploadProgress(0);
                      }}
                      className="text-[#EF4444] hover:text-[#DC2626] font-medium text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                  
                  {/* Progress Bar */}
                  {isProcessing && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#6B7280]">Đang xử lý file...</span>
                        <span className="text-sm font-medium text-[#EA580C]">{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#EA580C] transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Drag & Drop Area */}
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

              {selectedFile && !isProcessing && (
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
                <p className="text-3xl font-bold text-[#111827]">{previewData.length}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  <span className="text-sm text-[#6B7280]">Hợp lệ</span>
                </div>
                <p className="text-3xl font-bold text-[#10B981]">{validCount}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
                <div className="flex items-center gap-3 mb-2">
                  <XCircle className="w-5 h-5 text-[#EF4444]" />
                  <span className="text-sm text-[#6B7280]">Có lỗi</span>
                </div>
                <p className="text-3xl font-bold text-[#EF4444]">{errorCount}</p>
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
                        Nhóm tuổi
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
                    {previewData.map((row, index) => (
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
                          {row.email || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#6B7280]">
                          {row.ageGroup}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#6B7280]">
                          {row.class}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {getStatusBadge(row.status)}
                            {row.statusMessage && (
                              <span className="text-xs text-[#6B7280]">{row.statusMessage}</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Warning */}
            {errorCount > 0 && (
              <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#92400E] mb-1">
                      Lưu ý trước khi import
                    </p>
                    <p className="text-sm text-[#92400E]">
                      Có {errorCount} dòng dữ liệu có lỗi sẽ bị bỏ qua. Chỉ {validCount} học sinh hợp lệ sẽ được thêm vào hệ thống.
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                Đã thêm <span className="font-bold text-[#10B981]">{validCount} học sinh</span> vào hệ thống
              </p>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] mb-6">
              <h3 className="font-bold text-[#111827] mb-4">Tóm tắt kết quả</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
                  <span className="text-sm text-[#6B7280]">Tổng số dòng đã xử lý</span>
                  <span className="font-bold text-[#111827]">{previewData.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#D1FAE5] rounded-lg">
                  <span className="text-sm text-[#059669]">Thành công</span>
                  <span className="font-bold text-[#059669]">{validCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#FEE2E2] rounded-lg">
                  <span className="text-sm text-[#DC2626]">Lỗi</span>
                  <span className="font-bold text-[#DC2626]">{errorCount}</span>
                </div>
              </div>
            </div>

            {/* Error Details */}
            {errorCount > 0 && (
              <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] mb-6">
                <h3 className="font-bold text-[#111827] mb-4">Chi tiết lỗi</h3>
                <div className="space-y-2">
                  {previewData
                    .filter(student => student.status === 'error' || student.status === 'warning')
                    .map((student, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-[#FEF3C7] rounded-lg">
                        <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#92400E]">
                            Dòng {student.id}: {student.name}
                          </p>
                          <p className="text-sm text-[#92400E]">
                            {student.statusMessage}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

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
                  setPreviewData([]);
                  setValidCount(0);
                  setWarningCount(0);
                  setErrorCount(0);
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

      {/* Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#EA580C15] flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#EA580C]" />
                </div>
                <h2 className="text-xl font-bold text-[#111827]">Hướng dẫn Import Học viên</h2>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-sm max-w-none">
                {/* Bước 1 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <h3 className="text-lg font-bold text-[#111827] m-0">Tải file mẫu Excel</h3>
                  </div>
                  <div className="ml-10 space-y-2 text-[#6B7280]">
                    <p>• Click nút "Tải Excel" để tải file mẫu về máy</p>
                    <p>• File mẫu có 7 cột: Họ và tên, Số điện thoại, Email, Nhóm tuổi, Lớp, Khóa, Trạng thái</p>
                    <p>• File đã có 3 dòng dữ liệu mẫu để tham khảo</p>
                  </div>
                </div>

                {/* Bước 2 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <h3 className="text-lg font-bold text-[#111827] m-0">Điền thông tin học viên</h3>
                  </div>
                  <div className="ml-10 space-y-3">
                    <div className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E5E7EB]">
                      <p className="font-semibold text-[#111827] mb-2">Các trường bắt buộc:</p>
                      <ul className="space-y-1 text-[#6B7280]">
                        <li>• <span className="font-medium">Họ và tên:</span> Tên đầy đủ của học viên</li>
                        <li>• <span className="font-medium">Số điện thoại:</span> 10 số, bắt đầu bằng 0 (VD: 0904521297)</li>
                        <li>• <span className="font-medium">Nhóm tuổi:</span> Chọn 1 trong 3: "Trẻ em", "Thiếu niên", "Người lớn"</li>
                        <li>• <span className="font-medium">Lớp:</span> Tên lớp học</li>
                      </ul>
                    </div>
                    <div className="bg-[#FEF3C7] rounded-lg p-4 border border-[#FDE68A]">
                      <p className="font-semibold text-[#92400E] mb-2">⚠️ Lưu ý quan trọng:</p>
                      <ul className="space-y-1 text-[#92400E]">
                        <li>• Số điện thoại phải UNIQUE (không trùng lặp trong file)</li>
                        <li>• Email có thể để trống nhưng nếu điền phải đúng format</li>
                        <li>• Nhóm tuổi phải viết chính xác: "Trẻ em", "Thiếu niên", hoặc "Người lớn"</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bước 3 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <h3 className="text-lg font-bold text-[#111827] m-0">Upload file và kiểm tra</h3>
                  </div>
                  <div className="ml-10 space-y-2 text-[#6B7280]">
                    <p>• Kéo thả file vào vùng upload hoặc click để chọn file</p>
                    <p>• Hệ thống sẽ tự động kiểm tra và hiển thị kết quả</p>
                    <p>• Các dòng có lỗi sẽ được đánh dấu màu đỏ với thông báo chi tiết</p>
                    <p>• Chỉ những dòng hợp lệ mới được import vào hệ thống</p>
                  </div>
                </div>

                {/* Ví dụ */}
                <div className="bg-[#D1FAE5] rounded-lg p-4 border border-[#10B981]">
                  <p className="font-semibold text-[#065F46] mb-2">✅ Ví dụ dữ liệu hợp lệ:</p>
                  <div className="bg-white rounded p-3 text-sm font-mono text-[#111827]">
                    <div>Họ và tên: Nguyễn Văn A</div>
                    <div>Số điện thoại: 0900000001</div>
                    <div>Email: (có thể để trống)</div>
                    <div>Nhóm tuổi: Trẻ em</div>
                    <div>Lớp: Test Class</div>
                    <div>Khóa: Khóa tháng 4</div>
                    <div>Trạng thái: Đang học</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#E5E7EB] flex justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-6 py-2.5 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors font-medium"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}