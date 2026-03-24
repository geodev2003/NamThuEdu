import { useState } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  Clock,
  User,
  Mail,
  Phone,
  Award,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  avatar: string;
  class: string;
  testsCompleted: number;
  totalTests: number;
  avgScore: number;
  lastActivity: string;
  attendanceRate: number;
  trend: "up" | "down" | "stable";
  trendValue: number;
}

export function StudentProgress() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const students: Student[] = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      avatar: "👨‍🎓",
      class: "IELTS A1",
      testsCompleted: 12,
      totalTests: 15,
      avgScore: 8.5,
      lastActivity: "2 giờ trước",
      attendanceRate: 95,
      trend: "up",
      trendValue: 0.8,
    },
    {
      id: "2",
      name: "Trần Thị B",
      avatar: "👩‍🎓",
      class: "TOEFL B2",
      testsCompleted: 10,
      totalTests: 12,
      avgScore: 7.2,
      lastActivity: "5 giờ trước",
      attendanceRate: 88,
      trend: "up",
      trendValue: 0.5,
    },
    {
      id: "3",
      name: "Phạm Văn C",
      avatar: "👨‍💼",
      class: "Cambridge FCE",
      testsCompleted: 8,
      totalTests: 15,
      avgScore: 6.8,
      lastActivity: "1 ngày trước",
      attendanceRate: 75,
      trend: "down",
      trendValue: -0.3,
    },
    {
      id: "4",
      name: "Lê Thị D",
      avatar: "👩‍💻",
      class: "IELTS A1",
      testsCompleted: 14,
      totalTests: 15,
      avgScore: 9.0,
      lastActivity: "30 phút trước",
      attendanceRate: 98,
      trend: "up",
      trendValue: 1.2,
    },
    {
      id: "5",
      name: "Hoàng Văn E",
      avatar: "👨‍🔧",
      class: "TOEFL B2",
      testsCompleted: 6,
      totalTests: 12,
      avgScore: 5.5,
      lastActivity: "3 ngày trước",
      attendanceRate: 60,
      trend: "stable",
      trendValue: 0,
    },
    {
      id: "6",
      name: "Đặng Thị F",
      avatar: "👩‍🏫",
      class: "Cambridge FCE",
      testsCompleted: 11,
      totalTests: 15,
      avgScore: 7.8,
      lastActivity: "1 giờ trước",
      attendanceRate: 92,
      trend: "up",
      trendValue: 0.6,
    },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === "all" || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const classes = ["all", "IELTS A1", "TOEFL B2", "Cambridge FCE"];

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "text-green-600 bg-green-100";
    if (score >= 7.0) return "text-blue-600 bg-blue-100";
    if (score >= 6.0) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getTrendIcon = (trend: string, value: number) => {
    if (trend === "up")
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === "down")
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
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
          <span className="text-gray-900 font-semibold">Tiến độ học sinh</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Tiến độ học sinh 📈</h1>
        <p className="text-gray-600 mt-2">Theo dõi chi tiết tiến độ và kết quả học tập</p>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm học sinh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả lớp</option>
            {classes.filter((c) => c !== "all").map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Export Button */}
          <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 whitespace-nowrap">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedStudents.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-3">
            <span className="text-sm text-gray-700 font-semibold">
              Đã chọn {selectedStudents.length} học sinh
            </span>
            <button className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-200 transition-all">
              Xuất báo cáo hàng loạt
            </button>
            <button className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-semibold rounded-lg hover:bg-green-200 transition-all">
              Gửi thông báo
            </button>
            <button
              onClick={() => setSelectedStudents([])}
              className="ml-auto text-sm text-gray-600 hover:text-gray-900"
            >
              Bỏ chọn
            </button>
          </div>
        )}
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
          >
            {/* Checkbox */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => toggleStudent(student.id)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div className="text-3xl">{student.avatar}</div>
                <div>
                  <h3 className="font-bold text-gray-900">{student.name}</h3>
                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg">
                    {student.class}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Tiến độ</span>
                <span className="font-semibold text-gray-900">
                  {student.testsCompleted}/{student.totalTests}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all"
                  style={{
                    width: `${(student.testsCompleted / student.totalTests) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Average Score */}
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Điểm TB</span>
                  {getTrendIcon(student.trend, student.trendValue)}
                </div>
                <p className={`text-2xl font-bold ${getScoreColor(student.avgScore).split(' ')[0]}`}>
                  {student.avgScore}
                </p>
                {student.trend !== "stable" && (
                  <p
                    className={`text-xs font-semibold ${
                      student.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {student.trend === "up" ? "+" : ""}{student.trendValue}
                  </p>
                )}
              </div>

              {/* Attendance */}
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1 mb-1">
                  <CheckCircle className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600">Chuyên cần</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{student.attendanceRate}%</p>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div
                    className="bg-green-500 h-full rounded-full"
                    style={{ width: `${student.attendanceRate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Last Activity */}
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Hoạt động: {student.lastActivity}</span>
            </div>

            {/* Actions */}
            <Link
              to={`/bao-cao/hoc-sinh/${student.id}`}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2"
            >
              Xem chi tiết
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy học sinh</h3>
          <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tổng quan</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Tổng học sinh</p>
            <p className="text-2xl font-bold text-gray-900">{students.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Điểm TB chung</p>
            <p className="text-2xl font-bold text-blue-600">
              {(students.reduce((sum, s) => sum + s.avgScore, 0) / students.length).toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Tỷ lệ hoàn thành</p>
            <p className="text-2xl font-bold text-green-600">
              {Math.round(
                (students.reduce((sum, s) => sum + s.testsCompleted, 0) /
                  students.reduce((sum, s) => sum + s.totalTests, 0)) *
                  100
              )}
              %
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Chuyên cần TB</p>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}