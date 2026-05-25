import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  Clock,
  User,
  Users,
  Award,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { teacherApi } from "../../../../services/teacherApi";
import { useToast } from "../../../../hooks/useToast";

interface Student {
  uId: number;
  uName: string;
  uEmail: string;
  uPhone: string;
  uAvatar: string | null;
  uClass_id: number;
  className: string;
  testsCompleted: number;
  totalTests: number;
  avgScore: number;
  attendanceRate: number;
  lastActivity: string;
  lastActivityDate: string | null;
  scoreTrend: "up" | "down" | "stable";
  scoreTrendValue: number;
}

interface SummaryStats {
  totalStudents: number;
  avgScore: number;
  completionRate: number;
  avgAttendance: number;
  changes: {
    students: number;
    score: number;
    completion: number;
    attendance: number;
  };
}

export function StudentProgress() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "score" | "progress" | "attendance">("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const { error: showError } = useToast();

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchStudentsProgress();
  }, [selectedClass, sortBy]);

  const fetchStudentsProgress = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        sort_by: sortBy,
        sort_order: 'desc'
      };

      if (selectedClass !== 'all') {
        params.class_id = parseInt(selectedClass);
      }

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await teacherApi.reports.getStudentsProgress(params);
      
      if (response.status === 'success') {
        setStudents(response.data.students);
        setSummaryStats(response.data.summary);
      } else {
        throw new Error('Failed to fetch student progress');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Không thể tải dữ liệu tiến độ học sinh';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchStudentsProgress();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const classes = ["all", "IELTS A1", "TOEFL B2", "Cambridge FCE"];

  const toggleStudent = (id: number) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "#10B981"; // Green
    if (score >= 7.0) return "#2563EB"; // Blue
    if (score >= 6.0) return "#F59E0B"; // Orange
    return "#EF4444"; // Red
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8.5) return "#F0FDF4"; // Green bg
    if (score >= 7.0) return "#EFF6FF"; // Blue bg
    if (score >= 6.0) return "#FEF3C7"; // Orange bg
    return "#FEF2F2"; // Red bg
  };

  const getTrendIcon = (trend: string, value: number) => {
    if (trend === "up")
      return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (trend === "down")
      return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F5F7' }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: '#FF8C42' }} />
          <p className="text-sm text-slate-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F5F7' }}>
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Không thể tải dữ liệu</h3>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button
            onClick={fetchStudentsProgress}
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-2xl hover:scale-[1.02] transition-transform"
            style={{ background: '#FF8C42', boxShadow: '0 4px 12px rgba(255,140,66,0.25)' }}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!summaryStats) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: '#F5F5F7' }}>
      <div className="w-full px-6 py-6 space-y-5">
      {/* Breadcrumb & Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 text-sm mb-3">
          <Link to="/giao-vien/bao-cao" className="font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Báo cáo
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-900">Tiến độ học sinh</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tiến độ học sinh</h1>
        <p className="text-sm text-slate-500 mt-1">Theo dõi chi tiết tiến độ và kết quả học tập</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div
          className="bg-white rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#EFF6FF' }}
            >
              <Users className="w-6 h-6" style={{ color: '#2563EB' }} />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-3 h-3" />
              +{summaryStats.changes.students}
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 leading-none mb-2">{summaryStats.totalStudents}</p>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tổng học sinh</p>
        </div>

        {/* Average Score */}
        <div
          className="bg-white rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#F0FDF4' }}
            >
              <Award className="w-6 h-6" style={{ color: '#10B981' }} />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-3 h-3" />
              +{summaryStats.changes.score}
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 leading-none mb-2">{summaryStats.avgScore}</p>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Điểm trung bình</p>
        </div>

        {/* Completion Rate */}
        <div
          className="bg-white rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#FFF4E6' }}
            >
              <CheckCircle className="w-6 h-6" style={{ color: '#FF8C42' }} />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-3 h-3" />
              +{summaryStats.changes.completion}%
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 leading-none mb-2">{summaryStats.completionRate}%</p>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tỷ lệ hoàn thành</p>
        </div>

        {/* Average Attendance */}
        <div
          className="bg-white rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#FEF3C7' }}
            >
              <Calendar className="w-6 h-6" style={{ color: '#F59E0B' }} />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-3 h-3" />
              +{summaryStats.changes.attendance}%
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 leading-none mb-2">{summaryStats.avgAttendance}%</p>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Chuyên cần TB</p>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm học sinh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
              style={{ '--tw-ring-color': '#FF8C42' } as React.CSSProperties}
            />
          </div>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
            style={{ '--tw-ring-color': '#FF8C42' } as React.CSSProperties}
          >
            <option value="all">Tất cả lớp</option>
            {classes.filter((c) => c !== "all").map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
            style={{ '--tw-ring-color': '#FF8C42' } as React.CSSProperties}
          >
            <option value="name">Sắp xếp: Tên</option>
            <option value="score">Sắp xếp: Điểm</option>
            <option value="progress">Sắp xếp: Tiến độ</option>
            <option value="attendance">Sắp xếp: Chuyên cần</option>
          </select>

          {/* Export Button */}
          <button 
            className="px-4 py-2.5 text-white font-semibold rounded-xl hover:scale-[1.02] transition-transform flex items-center gap-2 whitespace-nowrap"
            style={{ background: '#FF8C42', boxShadow: '0 4px 12px rgba(255,140,66,0.25)' }}
          >
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedStudents.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-3">
            <span className="text-sm text-slate-700 font-semibold">
              Đã chọn {selectedStudents.length} học sinh
            </span>
            <button className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-100 transition-all">
              Xuất báo cáo hàng loạt
            </button>
            <button className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-semibold rounded-lg hover:bg-green-100 transition-all">
              Gửi thông báo
            </button>
            <button
              onClick={() => setSelectedStudents([])}
              className="ml-auto text-sm text-slate-600 hover:text-slate-900"
            >
              Bỏ chọn
            </button>
          </div>
        )}
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {students.map((student) => {
          const progressPercent = (student.testsCompleted / student.totalTests) * 100;
          const scoreColor = getScoreColor(student.avgScore);
          const scoreBgColor = getScoreBgColor(student.avgScore);

          return (
            <div
              key={student.uId}
              className="bg-white rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.uId)}
                  onChange={() => toggleStudent(student.uId)}
                  className="mt-1 w-4 h-4 rounded"
                  style={{ accentColor: '#FF8C42' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #FF8C42, #FF6B35)' }}
                    >
                      {student.uName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 truncate">{student.uName}</h3>
                      <span 
                        className="inline-block px-2 py-0.5 text-xs font-semibold rounded-lg"
                        style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}
                      >
                        {student.className}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600 font-medium">Tiến độ</span>
                  <span className="font-bold text-slate-900">
                    {student.testsCompleted}/{student.totalTests}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPercent}%`,
                      background: 'linear-gradient(90deg, #FF8C42, #FF6B35)'
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">{Math.round(progressPercent)}% hoàn thành</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Average Score */}
                <div 
                  className="rounded-xl p-3"
                  style={{ backgroundColor: scoreBgColor }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600 font-medium">Điểm TB</span>
                    {getTrendIcon(student.scoreTrend, student.scoreTrendValue)}
                  </div>
                  <p className="text-2xl font-bold" style={{ color: scoreColor }}>
                    {student.avgScore}
                  </p>
                  {student.scoreTrend !== "stable" && (
                    <p
                      className="text-xs font-semibold"
                      style={{ color: student.scoreTrend === "up" ? "#10B981" : "#EF4444" }}
                    >
                      {student.scoreTrend === "up" ? "+" : ""}{student.scoreTrendValue}
                    </p>
                  )}
                </div>

                {/* Attendance */}
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <CheckCircle className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-600 font-medium">Chuyên cần</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{student.attendanceRate}%</p>
                  <div className="w-full bg-slate-200 rounded-full h-1 mt-1">
                    <div
                      className="h-full rounded-full"
                      style={{ 
                        width: `${student.attendanceRate}%`,
                        backgroundColor: '#10B981'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Last Activity */}
              <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                <span>Hoạt động: {student.lastActivity}</span>
              </div>

              {/* Actions */}
              <Link
                to={`/giao-vien/bao-cao/students/${student.uId}`}
                className="w-full px-4 py-2.5 text-white font-semibold rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                style={{ background: '#FF8C42', boxShadow: '0 4px 12px rgba(255,140,66,0.25)' }}
              >
                Xem chi tiết
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {students.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#F1F5F9' }}
          >
            <User className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Không tìm thấy học sinh</h3>
          <p className="text-slate-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}

      </div>
    </div>
  );
}