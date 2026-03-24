import { useState } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  Download,
  FileText,
  Users,
  BarChart3,
  Calendar,
  CheckCircle,
  Eye,
  Settings,
  Loader2,
} from "lucide-react";

export function ExportReports() {
  const [reportType, setReportType] = useState("class");
  const [dateRange, setDateRange] = useState("30days");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(false);
  const [format, setFormat] = useState("pdf");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = () => {
    setIsGenerating(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            setProgress(0);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link to="/giao-vien/bao-cao" className="text-blue-600 hover:text-blue-700 font-semibold">
            Báo cáo
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Xuất báo cáo</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Xuất báo cáo 📄</h1>
        <p className="text-gray-600 mt-2">Tạo và tải xuống báo cáo theo nhu cầu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Type Selection */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Loại báo cáo
            </h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
                <input
                  type="radio"
                  name="reportType"
                  value="class"
                  checked={reportType === "class"}
                  onChange={(e) => setReportType(e.target.value)}
                  className="mt-1 w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-blue-600" />
                    <p className="font-semibold text-gray-900">Báo cáo lớp học</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Thống kê tổng quan về hiệu suất và tiến độ của cả lớp
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
                <input
                  type="radio"
                  name="reportType"
                  value="student"
                  checked={reportType === "student"}
                  onChange={(e) => setReportType(e.target.value)}
                  className="mt-1 w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-purple-600" />
                    <p className="font-semibold text-gray-900">Báo cáo học sinh cá nhân</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Chi tiết về tiến độ, điểm số và hoạt động của từng học sinh
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
                <input
                  type="radio"
                  name="reportType"
                  value="exam"
                  checked={reportType === "exam"}
                  onChange={(e) => setReportType(e.target.value)}
                  className="mt-1 w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-green-600" />
                    <p className="font-semibold text-gray-900">Phân tích bài thi</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Thống kê chi tiết về từng bài thi và câu hỏi
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
                <input
                  type="radio"
                  name="reportType"
                  value="overview"
                  checked={reportType === "overview"}
                  onChange={(e) => setReportType(e.target.value)}
                  className="mt-1 w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-orange-600" />
                    <p className="font-semibold text-gray-900">Thống kê tổng quan</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Báo cáo tổng hợp về toàn bộ hoạt động giảng dạy
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Options */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Tùy chọn báo cáo
            </h3>

            {/* Date Range */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Khoảng thời gian
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7days">7 ngày qua</option>
                <option value="30days">30 ngày qua</option>
                <option value="90days">90 ngày qua</option>
                <option value="semester">Học kỳ này</option>
                <option value="year">Năm nay</option>
                <option value="custom">Tùy chỉnh...</option>
              </select>
            </div>

            {/* Class/Student Selector */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {reportType === "class" && "Chọn lớp học"}
                {reportType === "student" && "Chọn học sinh"}
                {reportType === "exam" && "Chọn bài thi"}
                {reportType === "overview" && "Phạm vi"}
              </label>
              <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {reportType === "class" && (
                  <>
                    <option>IELTS A1</option>
                    <option>TOEFL B2</option>
                    <option>Cambridge FCE</option>
                    <option>Tất cả các lớp</option>
                  </>
                )}
                {reportType === "student" && (
                  <>
                    <option>Nguyễn Văn A</option>
                    <option>Trần Thị B</option>
                    <option>Phạm Văn C</option>
                    <option>Tất cả học sinh</option>
                  </>
                )}
                {reportType === "exam" && (
                  <>
                    <option>IELTS Reading Practice Test #1</option>
                    <option>TOEFL Listening Mock Test</option>
                    <option>Cambridge FCE Writing</option>
                  </>
                )}
                {reportType === "overview" && (
                  <>
                    <option>Tất cả lớp và học sinh</option>
                    <option>Theo khóa học</option>
                    <option>Theo giáo viên</option>
                  </>
                )}
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Bao gồm biểu đồ và đồ thị</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDetails}
                  onChange={(e) => setIncludeDetails(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Bao gồm dữ liệu chi tiết</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRecommendations}
                  onChange={(e) => setIncludeRecommendations(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Bao gồm nhận xét và đề xuất</span>
              </label>
            </div>
          </div>

          {/* Format Selection */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Định dạng file</h3>
            <div className="grid grid-cols-3 gap-3">
              <label
                className={`flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-all ${
                  format === "pdf"
                    ? "bg-blue-100 border-2 border-blue-600"
                    : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={format === "pdf"}
                  onChange={(e) => setFormat(e.target.value)}
                  className="sr-only"
                />
                <FileText
                  className={`w-8 h-8 ${format === "pdf" ? "text-blue-600" : "text-gray-600"}`}
                />
                <span
                  className={`text-sm font-semibold ${
                    format === "pdf" ? "text-blue-900" : "text-gray-700"
                  }`}
                >
                  PDF
                </span>
              </label>

              <label
                className={`flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-all ${
                  format === "excel"
                    ? "bg-green-100 border-2 border-green-600"
                    : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="excel"
                  checked={format === "excel"}
                  onChange={(e) => setFormat(e.target.value)}
                  className="sr-only"
                />
                <FileText
                  className={`w-8 h-8 ${format === "excel" ? "text-green-600" : "text-gray-600"}`}
                />
                <span
                  className={`text-sm font-semibold ${
                    format === "excel" ? "text-green-900" : "text-gray-700"
                  }`}
                >
                  Excel
                </span>
              </label>

              <label
                className={`flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-all ${
                  format === "csv"
                    ? "bg-purple-100 border-2 border-purple-600"
                    : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={format === "csv"}
                  onChange={(e) => setFormat(e.target.value)}
                  className="sr-only"
                />
                <FileText
                  className={`w-8 h-8 ${format === "csv" ? "text-purple-600" : "text-gray-600"}`}
                />
                <span
                  className={`text-sm font-semibold ${
                    format === "csv" ? "text-purple-900" : "text-gray-700"
                  }`}
                >
                  CSV
                </span>
              </label>
            </div>
          </div>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-sm font-semibold text-gray-900">
                  Đang tạo báo cáo... {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={isGenerating}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Xuất báo cáo
                </>
              )}
            </button>
            <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Xem trước
            </button>
          </div>
        </div>

        {/* Right Column - Preview & Info */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin báo cáo</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Loại báo cáo:</span>
                <span className="font-semibold text-gray-900">
                  {reportType === "class" && "Lớp học"}
                  {reportType === "student" && "Học sinh"}
                  {reportType === "exam" && "Bài thi"}
                  {reportType === "overview" && "Tổng quan"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Khoảng thời gian:</span>
                <span className="font-semibold text-gray-900">
                  {dateRange === "7days" && "7 ngày"}
                  {dateRange === "30days" && "30 ngày"}
                  {dateRange === "90days" && "90 ngày"}
                  {dateRange === "semester" && "Học kỳ"}
                  {dateRange === "year" && "Năm"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Định dạng:</span>
                <span className="font-semibold text-gray-900 uppercase">{format}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Ước tính kích thước:</span>
                <span className="font-semibold text-gray-900">~2.5 MB</span>
              </div>
            </div>
          </div>

          {/* Recent Exports */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Báo cáo gần đây</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    Báo cáo lớp IELTS A1
                  </p>
                  <p className="text-xs text-gray-600">Hôm qua • PDF • 2.1 MB</p>
                </div>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    Phân tích TOEFL Test
                  </p>
                  <p className="text-xs text-gray-600">2 ngày trước • Excel • 1.8 MB</p>
                </div>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    Tiến độ học sinh tháng 3
                  </p>
                  <p className="text-xs text-gray-600">1 tuần trước • PDF • 3.2 MB</p>
                </div>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6">
            <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Mẹo hữu ích
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• PDF phù hợp cho trình bày và in ấn</li>
              <li>• Excel tốt cho phân tích và xử lý dữ liệu</li>
              <li>• CSV nhẹ nhất, dễ import vào hệ thống khác</li>
              <li>• Bao gồm biểu đồ sẽ tăng kích thước file</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}