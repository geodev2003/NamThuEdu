import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import {
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  FileSearch,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useGradingStats } from "@/hooks/useGradingStats";

export function GradingStats() {
  const { t } = useTranslation();
  const { data: statsData, loading, error } = useGradingStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  if (error || !statsData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl p-8 border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-semibold mb-2">{error || "Không thể tải dữ liệu"}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Calculate completion rate
  const completionRate = statsData.total_submissions > 0 
    ? statsData.grading_completion_rate
    : 0;

  // Prepare data for Donut Chart (Status)
  const statusData = [
    { name: "Đã chấm", value: statsData.graded_submissions, color: "#10B981" },
    { name: "Chờ chấm", value: statsData.pending_submissions, color: "#F59E0B" },
  ];

  // Prepare data for Area Chart (7 days trend)
  const trendData = statsData.trend_7d.map(item => ({
    date: item.date,
    count: item.graded,
  }));

  // Prepare data for Bar Chart (Score by exam type)
  const scoresByType = Object.entries(statsData.scores_by_exam_type || {}).map(([type, data]: [string, any]) => ({
    name: type === 'listening' ? 'Nghe' : type === 'reading' ? 'Đọc' : type === 'writing' ? 'Viết' : type === 'speaking' ? 'Nói' : type,
    score: data.average_score || 0,
  }));

  // Prepare data for Score Distribution Bar Chart
  const scoreDistData = Object.entries(statsData.score_dist || {}).map(([range, count]) => ({
    range,
    count: count as number,
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thống kê chấm bài �</h1>
        <p className="text-gray-600">Tổng quan hoạt động chấm điểm và phân tích kết quả</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Total Submissions */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Tổng bài nộp</p>
          <p className="text-2xl font-bold text-gray-900">{statsData.total_submissions}</p>
        </div>

        {/* Graded */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Đã chấm</p>
          <p className="text-2xl font-bold text-gray-900">{statsData.graded_submissions}</p>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Chờ chấm</p>
          <p className="text-2xl font-bold text-gray-900">{statsData.pending_submissions}</p>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Hoàn thành</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-900">{completionRate.toFixed(1)}%</p>
          </div>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Area Chart - 2/3 width */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-200 hover:shadow-sm transition-all">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Hoạt động 7 ngày gần nhất
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorGraded" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#6366F1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorGraded)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart - 1/3 width */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-200 hover:shadow-sm transition-all">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {statusData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Scores by Exam Type */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-200 hover:shadow-sm transition-all">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Điểm TB theo loại đề</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={scoresByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="score" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Score Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-200 hover:shadow-sm transition-all">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bổ điểm</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={scoreDistData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="range" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row: Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-indigo-200 hover:shadow-sm transition-all">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Top học viên
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {statsData.top_students.map((student, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.count} bài</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-indigo-600">{student.avg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending by Exam */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-indigo-200 hover:shadow-sm transition-all">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-orange-600" />
              Đề chờ chấm nhiều nhất
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {statsData.pending_by_exam.map((exam, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{exam.title}</p>
                    <p className="text-xs text-gray-500">{exam.type}</p>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-bold">
                    {exam.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}