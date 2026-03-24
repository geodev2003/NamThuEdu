import { useState } from "react";
import { Link } from "react-router";
import {
  Users,
  BookOpen,
  CheckCircle,
  TrendingUp,
  FileText,
  Clock,
  AlertCircle,
  Award,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Activity,
  ChevronRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function ReportsOverview() {
  const [dateRange, setDateRange] = useState("30days");

  // Mock data for performance over time
  const performanceData = [
    { date: "T2", score: 65, submissions: 12 },
    { date: "T3", score: 68, submissions: 15 },
    { date: "T4", score: 72, submissions: 18 },
    { date: "T5", score: 70, submissions: 14 },
    { date: "T6", score: 75, submissions: 20 },
    { date: "T7", score: 78, submissions: 22 },
    { date: "CN", score: 80, submissions: 25 },
  ];

  // Submissions by status
  const submissionStatus = [
    { name: "Đã chấm", value: 245, color: "#10B981" },
    { name: "Đang chờ", value: 38, color: "#F59E0B" },
    { name: "Đang làm", value: 15, color: "#3B82F6" },
  ];

  // Recent activities
  const recentActivities = [
    {
      id: "1",
      type: "completed",
      student: "Nguyễn Văn A",
      action: "hoàn thành bài thi IELTS Reading",
      score: 8.5,
      time: "5 phút trước",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      id: "2",
      type: "submission",
      student: "Trần Thị B",
      action: "nộp bài TOEFL Listening",
      time: "12 phút trước",
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      id: "3",
      type: "improvement",
      student: "Lớp A1",
      action: "tăng điểm TB lên 7.5 (+0.8)",
      time: "1 giờ trước",
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      id: "4",
      type: "completed",
      student: "Phạm Văn C",
      action: "hoàn thành Cambridge FCE",
      score: 7.0,
      time: "2 giờ trước",
      icon: Award,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Báo cáo & Thống kê 📊</h1>
            <p className="text-gray-600">Theo dõi hiệu suất giảng dạy và tiến độ học sinh</p>
          </div>

          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="90days">90 ngày qua</option>
            <option value="year">Năm nay</option>
          </select>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Link
            to="/giao-vien/bao-cao"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg whitespace-nowrap"
          >
            Tổng quan
          </Link>
          <Link
            to="/giao-vien/bao-cao/tien-do-hoc-sinh"
            className="px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 whitespace-nowrap"
          >
            Tiến độ học sinh
          </Link>
          <Link
            to="/giao-vien/bao-cao/phan-tich"
            className="px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 whitespace-nowrap"
          >
            Phân tích kết quả
          </Link>
          <Link
            to="/giao-vien/bao-cao/xuat-bao-cao"
            className="px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 whitespace-nowrap"
          >
            Xuất báo cáo
          </Link>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Students */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Tổng học sinh</p>
          <p className="text-3xl font-bold text-gray-900">156</p>
        </div>

        {/* Active Courses */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              +3
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Khóa học hoạt động</p>
          <p className="text-3xl font-bold text-gray-900">12</p>
        </div>

        {/* Completion Rate */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              +5%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Tỷ lệ hoàn thành</p>
          <p className="text-3xl font-bold text-gray-900">85.2%</p>
        </div>

        {/* Average Score */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              +0.8
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Điểm trung bình</p>
          <p className="text-3xl font-bold text-gray-900">7.5</p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-600">Đã chấm tuần này</p>
              <p className="text-xl font-bold text-gray-900">87</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-xs text-gray-600">Đang chờ chấm</p>
              <p className="text-xl font-bold text-orange-600">38</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-600">Hoạt động gần đây</p>
              <p className="text-xl font-bold text-gray-900">124</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-600">Thời gian chấm TB</p>
              <p className="text-xl font-bold text-gray-900">12 phút</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Performance Over Time */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Hiệu suất theo thời gian</h3>
              <p className="text-sm text-gray-600">Điểm trung bình 7 ngày qua</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#2563EB"
                strokeWidth={2}
                fill="url(#colorScore)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Submissions by Status */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Bài nộp theo trạng thái</h3>
              <p className="text-sm text-gray-600">Tổng: {submissionStatus.reduce((sum, s) => sum + s.value, 0)} bài</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <PieChart className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie
                  data={submissionStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {submissionStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            {submissionStatus.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">{item.name}: <strong>{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Hoạt động gần đây</h3>
            <Link
              to="/giao-vien/bao-cao/tien-do-hoc-sinh"
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
            >
              Xem tất cả
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
              >
                <div className={`p-2 ${activity.bg} rounded-lg`}>
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{activity.student}</span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                {activity.score && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                    {activity.score}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="space-y-3">
            <Link
              to="/giao-vien/cham-diem/bao-cao-lop"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all group"
            >
              <div className="p-2 bg-blue-600 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Xem báo cáo lớp</p>
                <p className="text-xs text-gray-600">Chi tiết từng lớp</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
            </Link>

            <Link
              to="/giao-vien/bao-cao/phan-tich"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all group"
            >
              <div className="p-2 bg-purple-600 rounded-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Phân tích bài thi</p>
                <p className="text-xs text-gray-600">Thống kê chi tiết</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
            </Link>

            <Link
              to="/giao-vien/bao-cao/xuat-bao-cao"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all group"
            >
              <div className="p-2 bg-green-600 rounded-lg">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Xuất báo cáo PDF</p>
                <p className="text-xs text-gray-600">Tải về file</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
            </Link>
          </div>

          {/* Insights Box */}
          <div className="mt-6 p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-xl">
            <div className="flex items-start gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-900">Xu hướng tích cực!</p>
                <p className="text-xs text-orange-700 mt-1">
                  Điểm TB tăng 15% so với tháng trước
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}