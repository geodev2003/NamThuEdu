import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePageTitle, PAGE_TITLES } from "@/hooks/usePageTitle";
import { useTeacherReports } from "@/hooks/useTeacherReports";
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Award,
  AlertCircle,
  Loader2,
  Download,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function ReportsOverview() {
  usePageTitle(PAGE_TITLES.TEACHER_REPORTS);
  const { t } = useTranslation();
  const [period, setPeriod] = useState("30days");
  const { data: reportsData, loading, error, refetch } = useTeacherReports(period);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    refetch(newPeriod);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F5F7' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#FF8C42' }} />
          <p className="text-slate-600 font-medium">Đang tải báo cáo...</p>
        </div>
      </div>
    );
  }

  if (error || !reportsData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F5F7' }}>
        <div className="text-center bg-white rounded-2xl p-8" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-rose-600" />
          </div>
          <p className="text-rose-600 font-semibold mb-2">{error || "Không thể tải dữ liệu"}</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2.5 text-white font-semibold rounded-xl hover:scale-[1.02] transition-transform"
            style={{ background: '#FF8C42', boxShadow: '0 4px 12px rgba(255,140,66,0.25)' }}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const { overview, activity_timeline, exams_by_type, top_classes, top_students, classes_need_attention, score_trend, insights } = reportsData;

  // Prepare chart data
  const activityData = activity_timeline.map(item => ({
    date: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    submissions: item.submissions,
    graded: item.graded,
    active: item.active_students
  }));

  const examTypeData = Object.entries(exams_by_type).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count as number
  })).filter(item => item.value > 0);

  const COLORS = ['#FF8C42', '#10B981', '#F59E0B', '#8B5CF6', '#2563EB'];

  const scoreTrendData = score_trend.map(item => ({
    date: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    score: item.avg_score
  }));

  return (
    <div className="min-h-screen p-6" style={{ background: '#F5F5F7' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Báo cáo tổng quan 📊</h1>
            <p className="text-sm text-slate-500">Thống kê và phân tích hoạt động giảng dạy</p>
          </div>

          <div className="flex gap-3">
            {/* Period Selector */}
            <select
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
              style={{ '--tw-ring-color': '#FF8C42' } as React.CSSProperties}
            >
              <option value="7days">7 ngày</option>
              <option value="30days">30 ngày</option>
              <option value="90days">90 ngày</option>
              <option value="year">Năm nay</option>
            </select>

            {/* Export Button */}
            <button 
              className="px-4 py-2.5 text-white font-semibold rounded-xl hover:scale-[1.02] transition-transform flex items-center gap-2"
              style={{ background: '#FF8C42', boxShadow: '0 4px 12px rgba(255,140,66,0.25)' }}
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {/* Students */}
        <div 
          className="bg-white rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFF4E6' }}>
              <Users className="w-5 h-5" style={{ color: '#FF8C42' }} />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Học viên</p>
          <p className="text-2xl font-bold text-slate-900">{overview.total_students}</p>
          {overview.growth.students !== 0 && (
            <p className="text-xs text-emerald-600 mt-1 font-semibold">+{overview.growth.students}</p>
          )}
        </div>

        {/* Classes */}
        <div 
          className="bg-white rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
              <BookOpen className="w-5 h-5" style={{ color: '#10B981' }} />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Lớp học</p>
          <p className="text-2xl font-bold text-slate-900">{overview.total_classes}</p>
        </div>

        {/* Exams */}
        <div 
          className="bg-white rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
              <FileText className="w-5 h-5" style={{ color: '#2563EB' }} />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Đề thi</p>
          <p className="text-2xl font-bold text-slate-900">{overview.total_exams}</p>
        </div>

        {/* Submissions */}
        <div 
          className="bg-white rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F5F3FF' }}>
              <TrendingUp className="w-5 h-5" style={{ color: '#8B5CF6' }} />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Bài nộp</p>
          <p className="text-2xl font-bold text-slate-900">{overview.total_submissions}</p>
          {overview.growth.submissions !== 0 && (
            <p className="text-xs text-emerald-600 mt-1 font-semibold">+{overview.growth.submissions}</p>
          )}
        </div>

        {/* Avg Score */}
        <div 
          className="bg-white rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFF4E6' }}>
              <Award className="w-5 h-5" style={{ color: '#FF8C42' }} />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Điểm TB</p>
          <p className="text-2xl font-bold text-slate-900">{overview.avg_score}</p>
          {overview.growth.avg_score !== 0 && (
            <p className={`text-xs mt-1 font-semibold ${overview.growth.avg_score > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {overview.growth.avg_score > 0 ? '+' : ''}{overview.growth.avg_score}
            </p>
          )}
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Area Chart - Activity Timeline (2/3) */}
        <div 
          className="lg:col-span-2 bg-white rounded-2xl p-6 hover:scale-[1.01] transition-transform duration-200"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: '#FF8C42' }} />
            Hoạt động theo thời gian
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8C42" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF8C42" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGraded" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{ fill: "#64748B", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748B", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}
              />
              <Area type="monotone" dataKey="submissions" stroke="#FF8C42" strokeWidth={2} fillOpacity={1} fill="url(#colorSubmissions)" />
              <Area type="monotone" dataKey="graded" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorGraded)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart - Exams by Type (1/3) */}
        <div 
          className="bg-white rounded-2xl p-6 hover:scale-[1.01] transition-transform duration-200"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Phân bổ theo loại đề</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RePieChart>
              <Pie
                data={examTypeData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {examTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {examTypeData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-700">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart - Top Classes */}
        <div 
          className="bg-white rounded-2xl p-6 hover:scale-[1.01] transition-transform duration-200"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top 5 lớp học</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={top_classes.slice(0, 5)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" tick={{ fill: "#64748B", fontSize: 12 }} />
              <YAxis dataKey="class_name" type="category" tick={{ fill: "#64748B", fontSize: 12 }} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}
              />
              <Bar dataKey="total_submissions" fill="#FF8C42" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Score Trend */}
        <div 
          className="bg-white rounded-2xl p-6 hover:scale-[1.01] transition-transform duration-200"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Xu hướng điểm TB</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={scoreTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{ fill: "#64748B", fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fill: "#64748B", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}
              />
              <Line type="monotone" dataKey="score" stroke="#FF8C42" strokeWidth={2} dot={{ fill: "#FF8C42", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Students */}
        <div 
          className="bg-white rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform duration-200"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5" style={{ color: '#FF8C42' }} />
              Top học viên
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {top_students.slice(0, 10).map((student, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #FF8C42, #FF6B35)' }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{student.student_name}</p>
                      <p className="text-xs text-slate-500">{student.class_name} • {student.total_submissions} bài</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold" style={{ color: '#FF8C42' }}>{student.avg_score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Classes Need Attention */}
        <div 
          className="bg-white rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform duration-200"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" style={{ color: '#F59E0B' }} />
              Lớp cần quan tâm
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {classes_need_attention.map((cls, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{cls.class_name}</p>
                    <p className="text-xs text-slate-500">{cls.reason}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-bold">
                      {cls.pending_count}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">Avg: {cls.avg_score}</p>
                  </div>
                </div>
              ))}
              {classes_need_attention.length === 0 && (
                <p className="text-center text-slate-500 py-8">Tất cả lớp đều ổn định 👍</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Insights Panel */}
      {insights.length > 0 && (
        <div 
          className="bg-white rounded-2xl p-6"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">💡 Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, idx) => {
              const bgColor = insight.type === 'warning' ? 'bg-orange-50' : insight.type === 'success' ? 'bg-emerald-50' : 'bg-blue-50';
              const borderColor = insight.type === 'warning' ? 'border-orange-200' : insight.type === 'success' ? 'border-emerald-200' : 'border-blue-200';
              const textColor = insight.type === 'warning' ? 'text-orange-700' : insight.type === 'success' ? 'text-emerald-700' : 'text-blue-700';
              
              return (
                <div key={idx} className={`p-4 rounded-xl border ${bgColor} ${borderColor}`}>
                  <p className={`text-sm ${textColor}`}>{insight.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
