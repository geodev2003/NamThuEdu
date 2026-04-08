import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import {
  ArrowLeft,
  Download,
  School,
  Users,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Award,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

// Mock Data
const keyMetrics = [
  {
    label: "Tổng số lớp",
    value: 48,
    change: 12.5,
    trend: "up",
    icon: School,
    color: "#EA580C",
  },
  {
    label: "Tổng học sinh",
    value: 1248,
    change: 15.2,
    trend: "up",
    icon: Users,
    color: "#10B981",
  },
  {
    label: "Tỷ lệ điểm danh",
    value: 89,
    change: 3.5,
    trend: "up",
    icon: Target,
    color: "#F59E0B",
  },
  {
    label: "Điểm TB chung",
    value: 7.2,
    change: -0.5,
    trend: "down",
    icon: Award,
    color: "#8B5CF6",
  },
];

const enrollmentTrends = [
  { month: "T1", students: 145 },
  { month: "T2", students: 168 },
  { month: "T3", students: 192 },
  { month: "T4", students: 210 },
  { month: "T5", students: 235 },
  { month: "T6", students: 248 },
];

const classPerformance = [
  { name: "IELTS 7.0 Morning", score: 8.2, color: "#10B981" },
  { name: "Cambridge FCE", score: 7.8, color: "#10B981" },
  { name: "IELTS 6.5 Foundation", score: 7.2, color: "#EA580C" },
  { name: "TOEIC 750+", score: 6.9, color: "#EA580C" },
  { name: "VSTEP B2", score: 6.5, color: "#F59E0B" },
  { name: "TOEIC Basic", score: 5.8, color: "#EF4444" },
];

const sizeDistribution = [
  { range: "0-10", count: 5 },
  { range: "11-20", count: 12 },
  { range: "21-30", count: 26 },
  { range: "31+", count: 5 },
];

const detailedClasses = [
  {
    id: 1,
    name: "IELTS 7.0 - Intensive Morning",
    code: "CLS-2024-001",
    students: 28,
    avgScore: 7.2,
    attendance: 92,
    status: "active",
  },
  {
    id: 2,
    name: "TOEIC 750+ Evening Class",
    code: "CLS-2024-002",
    students: 25,
    avgScore: 6.8,
    attendance: 88,
    status: "active",
  },
  {
    id: 3,
    name: "Cambridge FCE Preparation",
    code: "CLS-2024-003",
    students: 18,
    avgScore: 7.5,
    attendance: 95,
    status: "active",
  },
];

const insights = [
  {
    type: "warning",
    icon: TrendingDown,
    color: "#F59E0B",
    text: "Lớp IELTS 7.0 có tỷ lệ vắng mặt cao trong 2 tuần qua",
  },
  {
    type: "success",
    icon: TrendingUp,
    color: "#10B981",
    text: "Điểm trung bình tăng 15% so với kỳ trước",
  },
  {
    type: "info",
    icon: Users,
    color: "#EA580C",
    text: "3 lớp cần bổ sung học sinh để đạt sĩ số tối ưu",
  },
];

export function ClassStats() {
  const { t } = useTranslation();
  const [expandedClass, setExpandedClass] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState("current-semester");

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/giao-vien/lop-hoc"
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#EA580C] mb-6 transition-colors group"
        >
          <div className="p-1.5 rounded-lg bg-white border border-[#E5E7EB] group-hover:border-[#EA580C] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Quay lại danh sách lớp</span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#111827] mb-2">
              Thống kê lớp học
            </h1>
            <p className="text-[#6B7280]">
              Dashboard &gt; Lớp học &gt; Thống kê
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C] font-medium"
            >
              <option value="current-semester">Học kỳ hiện tại</option>
              <option value="last-month">30 ngày qua</option>
              <option value="last-quarter">3 tháng qua</option>
              <option value="last-year">Năm nay</option>
            </select>
            <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white rounded-xl hover:shadow-xl hover:shadow-orange-500/30 font-semibold transition-all">
              <Download className="w-5 h-5" />
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${metric.color}15` }}
                >
                  <Icon className="w-7 h-7" style={{ color: metric.color }} />
                </div>
                <div
                  className="flex items-center gap-1.5 text-sm font-bold px-2.5 py-1 rounded-full"
                  style={{
                    color: metric.trend === "up" ? "#10B981" : "#EF4444",
                    backgroundColor:
                      metric.trend === "up" ? "#D1FAE5" : "#FEE2E2",
                  }}
                >
                  <TrendIcon className="w-4 h-4" />
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <p className="text-3xl font-bold text-[#111827] mb-1">
                {metric.value.toLocaleString()}
                {metric.label.includes("Tỷ lệ") && "%"}
              </p>
              <p className="text-sm text-[#6B7280] font-medium">
                {metric.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Class Performance Comparison */}
      <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#111827]">
            So sánh hiệu suất lớp học
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#6B7280]">Xếp theo:</span>
            <select className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#EA580C]">
              <option>Điểm TB</option>
              <option>Điểm danh</option>
              <option>Hoàn thành</option>
            </select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={classPerformance}
            layout="vertical"
            margin={{ left: 20, right: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" domain={[0, 10]} stroke="#6B7280" />
            <YAxis dataKey="name" type="category" stroke="#6B7280" width={180} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                padding: "12px",
              }}
            />
            <Bar dataKey="score" radius={[0, 8, 8, 0]}>
              {classPerformance.map((entry, index) => (
                <Cell key={`bar-cell-${entry.name}-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#10B981]" />
            <span className="text-sm text-[#6B7280]">Xuất sắc (&ge; 7.5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#EA580C]" />
            <span className="text-sm text-[#6B7280]">Tốt (6.5-7.4)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#F59E0B]" />
            <span className="text-sm text-[#6B7280]">Trung bình (6.0-6.4)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#EF4444]" />
            <span className="text-sm text-[#6B7280]">Cần cải thiện (&lt; 6.0)</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Enrollment Trends */}
        <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm">
          <h3 className="text-xl font-bold text-[#111827] mb-6">
            Xu hướng ghi danh
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={enrollmentTrends}>
              <defs>
                <linearGradient id="colorStudents2" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    key="stop-enrollment-start"
                    offset="5%"
                    stopColor="#EA580C"
                    stopOpacity={0.3}
                  />
                  <stop
                    key="stop-enrollment-end"
                    offset="95%"
                    stopColor="#EA580C"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="students"
                stroke="#EA580C"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorStudents2)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Size Distribution */}
        <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm">
          <h3 className="text-xl font-bold text-[#111827] mb-6">
            Phân bố sĩ số
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sizeDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="range" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="count" fill="#EA580C" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-[#FFF7ED] rounded-xl">
            <p className="text-sm text-[#6B7280]">
              <span className="font-semibold text-[#EA580C]">
                Sĩ số lý tưởng:
              </span>{" "}
              21-30 học sinh/lớp
            </p>
          </div>
        </div>
      </div>

      {/* Insights Panel */}
      <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm mb-8">
        <h3 className="text-xl font-bold text-[#111827] mb-6">
          Nhận định & Đề xuất
        </h3>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${insight.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: insight.color }} />
                </div>
                <p className="text-[#374151] flex-1">{insight.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Class Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-[#E5E7EB]">
          <h3 className="text-xl font-bold text-[#111827]">
            Chi tiết từng lớp
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase">
                  Lớp học
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase">
                  Mã lớp
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase">
                  Học sinh
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase">
                  Điểm TB
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase">
                  Điểm danh
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {detailedClasses.map((classItem) => (
                <>
                  <tr
                    key={classItem.id}
                    className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          setExpandedClass(
                            expandedClass === classItem.id ? null : classItem.id
                          )
                        }
                        className="flex items-center gap-2 font-semibold text-[#111827] hover:text-[#EA580C]"
                      >
                        {expandedClass === classItem.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                        {classItem.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B7280] font-mono">
                      {classItem.code}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#111827]">
                      {classItem.students}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-[#10B981]">
                        {classItem.avgScore}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-[#EA580C]">
                        {classItem.attendance}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-[#D1FAE5] text-[#10B981] rounded-full text-xs font-semibold">
                        Đang hoạt động
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/lop-hoc/${classItem.id}`}
                          className="p-2 hover:bg-[#FFF7ED] rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5 text-[#EA580C]" />
                        </Link>
                        <button className="p-2 hover:bg-[#FFF7ED] rounded-lg transition-colors">
                          <FileText className="w-5 h-5 text-[#6B7280]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedClass === classItem.id && (
                    <tr className="bg-[#F9FAFB]">
                      <td colSpan={7} className="px-6 py-6">
                        <div className="grid grid-cols-3 gap-4 max-w-4xl">
                          <div className="p-4 bg-white rounded-xl border border-[#E5E7EB]">
                            <p className="text-xs text-[#6B7280] mb-2">
                              Bài tập đã giao
                            </p>
                            <p className="text-2xl font-bold text-[#111827]">
                              15
                            </p>
                          </div>
                          <div className="p-4 bg-white rounded-xl border border-[#E5E7EB]">
                            <p className="text-xs text-[#6B7280] mb-2">
                              Tỷ lệ hoàn thành
                            </p>
                            <p className="text-2xl font-bold text-[#10B981]">
                              87%
                            </p>
                          </div>
                          <div className="p-4 bg-white rounded-xl border border-[#E5E7EB]">
                            <p className="text-xs text-[#6B7280] mb-2">
                              Mức độ hài lòng
                            </p>
                            <p className="text-2xl font-bold text-[#F59E0B]">
                              4.5/5
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
