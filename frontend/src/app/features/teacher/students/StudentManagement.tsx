import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import {
  Users,
  UserPlus,
  Download,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  UserCheck,
  UserX,
  Calendar,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  FileText,
  File,
  Check,
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type TabType = "list" | "stats" | "export";

// Mock Data
const studentStats = [
  { label: "Tổng học sinh", value: 1248, change: 12.5, trend: "up", icon: Users, color: "#2563EB" },
  { label: "Đang học", value: 1156, change: 8.2, trend: "up", icon: UserCheck, color: "#10B981" },
  { label: "Tạm nghỉ", value: 92, change: -3.1, trend: "down", icon: UserX, color: "#6B7280" },
  { label: "Mới tháng này", value: 45, change: 15.3, trend: "up", icon: Calendar, color: "#2563EB" },
];

const mockStudents = [
  { id: 1, name: "Nguyễn Văn An", phone: "0901234567", email: "an.nguyen@email.com", class: "IELTS 6.5 - Sáng", course: "IELTS", status: "active", avatar: "NA", createdAt: "15/03/2024" },
  { id: 2, name: "Trần Thị Bình", phone: "0912345678", email: "binh.tran@email.com", class: "TOEIC 750 - Chiều", course: "TOEIC", status: "active", avatar: "TB", createdAt: "12/03/2024" },
  { id: 3, name: "Lê Minh Châu", phone: "0923456789", email: "chau.le@email.com", class: "Cambridge FCE", course: "Cambridge", status: "inactive", avatar: "LC", createdAt: "10/03/2024" },
  { id: 4, name: "Phạm Đức Duy", phone: "0934567890", email: "duy.pham@email.com", class: "IELTS 7.0 - Tối", course: "IELTS", status: "active", avatar: "PD", createdAt: "08/03/2024" },
  { id: 5, name: "Hoàng Thu Hà", phone: "0945678901", email: "ha.hoang@email.com", class: "VSTEP B2", course: "VSTEP", status: "active", avatar: "HH", createdAt: "05/03/2024" },
];

const enrollmentData = [
  { month: "T1", students: 145 },
  { month: "T2", students: 168 },
  { month: "T3", students: 192 },
  { month: "T4", students: 210 },
  { month: "T5", students: 235 },
  { month: "T6", students: 248 },
];

const classDistribution = [
  { name: "IELTS", value: 485, color: "#2563EB" },
  { name: "TOEIC", value: 312, color: "#10B981" },
  { name: "Cambridge", value: 218, color: "#F59E0B" },
  { name: "VSTEP", value: 156, color: "#8B5CF6" },
  { name: "Khác", value: 77, color: "#6B7280" },
];

const topStudents = [
  { rank: 1, name: "Nguyễn Thị Mai", class: "IELTS 7.5", avgScore: 8.5, tests: 12, avatar: "NM" },
  { rank: 2, name: "Trần Văn Phúc", class: "TOEIC 900", avgScore: 8.2, tests: 15, avatar: "TP" },
  { rank: 3, name: "Lê Thu Hương", class: "Cambridge CAE", avgScore: 8.0, tests: 10, avatar: "LH" },
  { rank: 4, name: "Phạm Minh Tú", class: "IELTS 7.0", avgScore: 7.8, tests: 14, avatar: "PT" },
  { rank: 5, name: "Đỗ Hải Yến", class: "VSTEP B2", avgScore: 7.5, tests: 11, avatar: "DY" },
];

export function StudentManagement() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("excel");

  const tabs = [
    { id: "list" as TabType, label: "Danh sách", icon: Users },
    { id: "stats" as TabType, label: "Thống kê", icon: BarChart3 },
    { id: "export" as TabType, label: "Xuất dữ liệu", icon: Download },
  ];

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: "Đang học", color: "#10B981", bg: "#D1FAE5" },
      inactive: { label: "Tạm nghỉ", color: "#6B7280", bg: "#F3F4F6" },
    };
    const { label, color, bg } = config[status as keyof typeof config] || config.active;
    return (
      <span
        className="px-2 py-1 rounded-full text-xs font-medium"
        style={{ color, backgroundColor: bg }}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-[#111827] mb-1">
              Quản lý học sinh
            </h1>
            <p className="text-[#6B7280] text-sm">
              Dashboard &gt; Học viên &gt; Quản lý
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/giao-vien/students/them-moi"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium"
            >
              <UserPlus className="w-5 h-5" />
              Thêm học sinh
            </Link>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-colors font-medium">
              <Download className="w-5 h-5" />
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E5E7EB] mb-6">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all relative"
                style={{
                  color: isActive ? "#2563EB" : "#6B7280",
                  borderBottom: isActive ? "2px solid #2563EB" : "2px solid transparent",
                }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "list" && (
        <div>
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {studentStats.map((stat, index) => {
              const Icon = stat.icon;
              const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-[#E5E7EB]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium" style={{ color: stat.trend === "up" ? "#10B981" : "#EF4444" }}>
                      <TrendIcon className="w-4 h-4" />
                      {Math.abs(stat.change)}%
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[#111827] mb-1">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-[#6B7280]">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] mb-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, SĐT, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
                <option>Tất cả lớp</option>
                <option>IELTS 6.5</option>
                <option>TOEIC 750</option>
              </select>
              <select className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
                <option>Tất cả trạng thái</option>
                <option>Đang học</option>
                <option>Tạm nghỉ</option>
              </select>
              <button className="px-4 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Lọc
              </button>
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Học sinh
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      SĐT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Lớp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Khóa học
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {mockStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-semibold text-sm">
                            {student.avatar}
                          </div>
                          <span className="font-medium text-[#111827]">
                            {student.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {student.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {student.class}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {student.course}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(student.status)}</td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {student.createdAt}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-[#EFF6FF] rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-[#6B7280]" />
                          </button>
                          <button className="p-2 hover:bg-[#EFF6FF] rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-[#6B7280]" />
                          </button>
                          <button className="p-2 hover:bg-[#FEE2E2] rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-[#EF4444]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between">
              <p className="text-sm text-[#6B7280]">
                Hiển thị <span className="font-medium text-[#111827]">1-5</span> trong{" "}
                <span className="font-medium text-[#111827]">1,248</span> kết quả
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] text-sm font-medium text-[#6B7280]">
                  Trước
                </button>
                <button className="px-3 py-1.5 bg-[#2563EB] text-white rounded-lg text-sm font-medium">
                  1
                </button>
                <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] text-sm font-medium text-[#6B7280]">
                  2
                </button>
                <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] text-sm font-medium text-[#6B7280]">
                  3
                </button>
                <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] text-sm font-medium text-[#6B7280]">
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "stats" && (
        <div>
          {/* Overview Cards */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {studentStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[#111827] mb-1">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-[#6B7280]">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Enrollment Growth Chart */}
          <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] mb-6">
            <h3 className="text-lg font-bold text-[#111827] mb-4">
              Tăng trưởng học sinh
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={enrollmentData}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop key="stop-1" offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop key="stop-2" offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorStudents)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Class Distribution & Course Enrollment */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
              <h3 className="text-lg font-bold text-[#111827] mb-4">
                Phân bố theo lớp
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={classDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {classDistribution.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
              <h3 className="text-lg font-bold text-[#111827] mb-4">
                Phân bố theo khóa học
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={classDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {classDistribution.map((entry, index) => (
                      <Cell key={`bar-cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#111827]">
                Học sinh xuất sắc
              </h3>
              <button className="text-sm text-[#2563EB] font-medium hover:underline">
                Xem tất cả
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Xếp hạng
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Học sinh
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Lớp
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Điểm TB
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Số bài kiểm tra
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {topStudents.map((student) => (
                    <tr key={student.rank} className="hover:bg-[#F9FAFB]">
                      <td className="px-4 py-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{
                            backgroundColor: student.rank === 1 ? "#F59E0B" : student.rank === 2 ? "#9CA3AF" : student.rank === 3 ? "#D97706" : "#E5E7EB",
                            color: student.rank <= 3 ? "#FFF" : "#6B7280",
                          }}
                        >
                          {student.rank}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-semibold text-sm">
                            {student.avatar}
                          </div>
                          <span className="font-medium text-[#111827]">
                            {student.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#6B7280]">
                        {student.class}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-lg font-bold text-[#10B981]">
                          {student.avgScore}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#6B7280]">
                        {student.tests}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "export" && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl p-8 border border-[#E5E7EB]">
            {/* Format Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#111827] mb-4">
                Chọn định dạng
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "excel", label: "Excel (.xlsx)", icon: FileSpreadsheet, recommended: true },
                  { id: "csv", label: "CSV (.csv)", icon: FileText, recommended: false },
                  { id: "pdf", label: "PDF", icon: File, recommended: false },
                ].map((format) => {
                  const Icon = format.icon;
                  const isSelected = selectedFormat === format.id;
                  return (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className="relative p-4 border-2 rounded-xl hover:border-[#2563EB] transition-all"
                      style={{
                        borderColor: isSelected ? "#2563EB" : "#E5E7EB",
                        backgroundColor: isSelected ? "#EFF6FF" : "#FFF",
                      }}
                    >
                      {format.recommended && (
                        <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-[#10B981] text-white text-xs font-bold rounded-full">
                          Đề xuất
                        </span>
                      )}
                      <Icon className="w-8 h-8 mx-auto mb-2" style={{ color: isSelected ? "#2563EB" : "#6B7280" }} />
                      <p className="text-sm font-medium" style={{ color: isSelected ? "#2563EB" : "#374151" }}>
                        {format.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Data Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#111827]">
                  Chọn dữ liệu
                </h3>
                <button className="text-sm text-[#2563EB] font-medium hover:underline">
                  Chọn tất cả
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { id: "personal", label: "Thông tin cá nhân (Tên, SĐT, Email, Ngày sinh)", checked: true },
                  { id: "academic", label: "Thông tin học tập (Lớp, Khóa học, Mã học sinh)", checked: true },
                  { id: "scores", label: "Điểm số và kết quả thi", checked: false },
                  { id: "history", label: "Lịch sử tham gia", checked: false },
                  { id: "notes", label: "Ghi chú và nhận xét", checked: false },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-3 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={item.checked}
                      className="w-4 h-4 rounded border-2 border-[#D1D5DB] text-[#2563EB] focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-1 cursor-pointer transition-all hover:border-[#2563EB]"
                    />
                    <span className="text-sm text-[#374151]">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#111827] mb-4">Bộ lọc</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Lớp học
                  </label>
                  <select className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
                    <option>Tất cả lớp</option>
                    <option>IELTS 6.5</option>
                    <option>TOEIC 750</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Trạng thái
                  </label>
                  <select className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
                    <option>Tất cả trạng thái</option>
                    <option>Đang học</option>
                    <option>Tạm nghỉ</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-[#F9FAFB] rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#374151] mb-1">
                    Số lượng học sinh sẽ được xuất
                  </p>
                  <p className="text-2xl font-bold text-[#2563EB]">1,248</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#374151] mb-1">
                    Dung lượng file dự kiến
                  </p>
                  <p className="text-2xl font-bold text-[#10B981]">2.4 MB</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button className="px-6 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-colors font-medium">
                Hủy
              </button>
              <div className="flex items-center gap-3">
                <button className="px-6 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-colors font-medium">
                  Xem trước
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium">
                  <Download className="w-5 h-5" />
                  Xuất dữ liệu
                </button>
              </div>
            </div>
          </div>

          {/* Export History */}
          <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] mt-6">
            <h3 className="text-lg font-bold text-[#111827] mb-4">
              Lịch sử xuất dữ liệu
            </h3>
            <div className="space-y-3">
              {[
                { date: "22/03/2024 14:30", format: "Excel", records: 1248, size: "2.4 MB", status: "success" },
                { date: "20/03/2024 09:15", format: "CSV", records: 1156, size: "1.8 MB", status: "success" },
                { date: "18/03/2024 16:45", format: "PDF", records: 892, size: "5.2 MB", status: "success" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#10B98115] flex items-center justify-center">
                      <Check className="w-5 h-5 text-[#10B981]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#111827]">
                        {item.format} - {item.records} học sinh
                      </p>
                      <p className="text-sm text-[#6B7280]">
                        {item.date} • {item.size}
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Tải xuống
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}