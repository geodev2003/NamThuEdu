import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import {
  Users,
  School,
  TrendingUp,
  TrendingDown,
  UserCheck,
  Grid3x3,
  List,
  Search,
  Filter,
  Plus,
  BarChart3,
  Eye,
  Edit,
  MoreVertical,
  Clock,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Target,
} from "lucide-react";

type ViewMode = "grid" | "list";

// Mock Data
const statsData = [
  {
    label: "Tổng số lớp",
    value: 48,
    change: 12.5,
    trend: "up",
    icon: School,
    color: "#EA580C",
  },
  {
    label: "Lớp đang hoạt động",
    value: 42,
    change: 8.3,
    trend: "up",
    icon: UserCheck,
    color: "#10B981",
  },
  {
    label: "Tổng số học sinh",
    value: 1248,
    change: 15.2,
    trend: "up",
    icon: Users,
    color: "#F59E0B",
  },
  {
    label: "Sĩ số trung bình",
    value: 26,
    change: -2.1,
    trend: "down",
    icon: Target,
    color: "#8B5CF6",
  },
];

const mockClasses = [
  {
    id: 1,
    name: "IELTS 7.0 - Intensive Morning",
    code: "CLS-2024-001",
    course: "IELTS Advanced",
    studentCount: 28,
    maxStudents: 30,
    status: "active",
    schedule: "T2, T4, T6 - 8:00-10:00",
    room: "A101",
    teacher: "Nguyễn Thị Mai",
    startDate: "15/01/2024",
    avgScore: 7.2,
    attendance: 92,
    assignments: 12,
  },
  {
    id: 2,
    name: "TOEIC 750+ Evening Class",
    code: "CLS-2024-002",
    course: "TOEIC Intermediate",
    studentCount: 25,
    maxStudents: 30,
    status: "active",
    schedule: "T3, T5, T7 - 18:00-20:00",
    room: "B203",
    teacher: "Trần Văn Phúc",
    startDate: "20/01/2024",
    avgScore: 6.8,
    attendance: 88,
    assignments: 10,
  },
  {
    id: 3,
    name: "Cambridge FCE Preparation",
    code: "CLS-2024-003",
    course: "Cambridge FCE",
    studentCount: 18,
    maxStudents: 25,
    status: "active",
    schedule: "T2, T4 - 14:00-16:30",
    room: "C305",
    teacher: "Lê Thu Hương",
    startDate: "10/01/2024",
    avgScore: 7.5,
    attendance: 95,
    assignments: 15,
  },
  {
    id: 4,
    name: "VSTEP B2 Weekend",
    code: "CLS-2024-004",
    course: "VSTEP B2",
    studentCount: 30,
    maxStudents: 30,
    status: "active",
    schedule: "T7, CN - 9:00-12:00",
    room: "D102",
    teacher: "Phạm Minh Tú",
    startDate: "05/01/2024",
    avgScore: 6.5,
    attendance: 85,
    assignments: 8,
  },
  {
    id: 5,
    name: "IELTS 6.5 Foundation",
    code: "CLS-2024-005",
    course: "IELTS Foundation",
    studentCount: 22,
    maxStudents: 30,
    status: "active",
    schedule: "T2, T4, T6 - 14:00-16:00",
    room: "A205",
    teacher: "Đỗ Hải Yến",
    startDate: "12/01/2024",
    avgScore: 6.2,
    attendance: 90,
    assignments: 11,
  },
  {
    id: 6,
    name: "TOEIC Basic Afternoon",
    code: "CLS-2024-006",
    course: "TOEIC Basic",
    studentCount: 15,
    maxStudents: 25,
    status: "inactive",
    schedule: "T3, T5 - 15:00-17:00",
    room: "B104",
    teacher: "Nguyễn Văn An",
    startDate: "08/01/2024",
    avgScore: 5.8,
    attendance: 78,
    assignments: 6,
  },
];

export function ClassList() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: "Đang hoạt động", color: "#10B981", bg: "#D1FAE5" },
      inactive: { label: "Tạm dừng", color: "#6B7280", bg: "#F3F4F6" },
    };
    const { label, color, bg } =
      config[status as keyof typeof config] || config.active;
    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-semibold"
        style={{ color, backgroundColor: bg }}
      >
        {label}
      </span>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 7.5) return "#10B981";
    if (score >= 6.5) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-[#111827] mb-2">
              Danh sách lớp học
            </h1>
            <p className="text-[#6B7280] text-sm">
              Dashboard &gt; Lớp học &gt; Danh sách
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/giao-vien/lop-hoc/thong-ke"
              className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-[#E5E7EB] text-[#374151] rounded-xl hover:border-[#EA580C] hover:bg-[#FFF7ED] transition-all font-semibold"
            >
              <BarChart3 className="w-5 h-5" />
              Thống kê
            </Link>
            <Link
              to="/giao-vien/lop-hoc/tao-moi"
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white rounded-xl hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105 transition-all font-bold"
            >
              <Plus className="w-5 h-5" />
              Tạo lớp mới
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon className="w-7 h-7" style={{ color: stat.color }} />
                </div>
                <div
                  className="flex items-center gap-1.5 text-sm font-bold px-2.5 py-1 rounded-full"
                  style={{
                    color: stat.trend === "up" ? "#10B981" : "#EF4444",
                    backgroundColor:
                      stat.trend === "up" ? "#D1FAE5" : "#FEE2E2",
                  }}
                >
                  <TrendIcon className="w-4 h-4" />
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <p className="text-3xl font-bold text-[#111827] mb-1">
                {stat.value.toLocaleString()}
              </p>
              <p className="text-sm text-[#6B7280] font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm mb-6">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Tìm theo tên lớp, mã lớp, giáo viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all"
            />
          </div>

          {/* Filters */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C] font-medium"
          >
            <option value="all">{t('teacher.classes.allStatuses')}</option>
            <option value="active">{t('teacher.classes.status.active')}</option>
            <option value="inactive">{t('teacher.classes.status.inactive')}</option>
          </select>

          <select className="px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C] font-medium">
            <option>{t('teacher.classes.allCourses')}</option>
            <option>IELTS</option>
            <option>TOEIC</option>
            <option>Cambridge</option>
          </select>

          <button className="px-5 py-3.5 bg-[#EA580C] text-white rounded-xl hover:bg-[#C2410C] transition-all font-semibold flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Lọc
          </button>

          {/* View Toggle */}
          <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-[#EA580C] text-white"
                  : "text-[#6B7280] hover:bg-[#F3F4F6]"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-[#EA580C] text-white"
                  : "text-[#6B7280] hover:bg-[#F3F4F6]"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-3 gap-6">
          {mockClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-white rounded-2xl p-6 border border-[#E5E7EB] hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#111827] mb-1 group-hover:text-[#EA580C] transition-colors">
                    {classItem.name}
                  </h3>
                  <p className="text-sm text-[#6B7280] font-mono">
                    {classItem.code}
                  </p>
                </div>
                <button className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-[#6B7280]" />
                </button>
              </div>

              {/* Course Tag */}
              <div className="mb-4">
                <span className="px-3 py-1.5 bg-gradient-to-r from-[#FFF7ED] to-[#FFEDD5] text-[#EA580C] rounded-lg text-sm font-semibold inline-flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {classItem.course}
                </span>
              </div>

              {/* Student Count */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-[#F9FAFB] rounded-xl">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#6B7280] font-medium">
                      Sĩ số
                    </span>
                    <span className="text-sm font-bold text-[#111827]">
                      {classItem.studentCount}/{classItem.maxStudents}
                    </span>
                  </div>
                  <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#EA580C] to-[#C2410C] rounded-full transition-all"
                      style={{
                        width: `${
                          (classItem.studentCount / classItem.maxStudents) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Clock className="w-4 h-4" />
                  <span>{classItem.schedule.split(" - ")[0]}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <MapPin className="w-4 h-4" />
                  <span>{classItem.room}</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 mb-4 p-3 bg-[#F9FAFB] rounded-xl">
                <div className="flex-1 text-center">
                  <p className="text-xs text-[#6B7280] mb-1">Điểm TB</p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: getScoreColor(classItem.avgScore) }}
                  >
                    {classItem.avgScore}
                  </p>
                </div>
                <div className="w-px h-8 bg-[#E5E7EB]" />
                <div className="flex-1 text-center">
                  <p className="text-xs text-[#6B7280] mb-1">Điểm danh</p>
                  <p className="text-lg font-bold text-[#10B981]">
                    {classItem.attendance}%
                  </p>
                </div>
                <div className="w-px h-8 bg-[#E5E7EB]" />
                <div className="flex-1 text-center">
                  <p className="text-xs text-[#6B7280] mb-1">Bài tập</p>
                  <p className="text-lg font-bold text-[#EA580C]">
                    {classItem.assignments}
                  </p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                {getStatusBadge(classItem.status)}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/lop-hoc/${classItem.id}`}
                    className="p-2 hover:bg-[#FFF7ED] rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5 text-[#EA580C]" />
                  </Link>
                  <button className="p-2 hover:bg-[#FFF7ED] rounded-lg transition-colors">
                    <Edit className="w-5 h-5 text-[#6B7280]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9FAFB] border-b-2 border-[#E5E7EB]">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-2 border-[#D1D5DB] text-[#EA580C] focus:ring-2 focus:ring-[#EA580C] cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                    Lớp học
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                    Khóa học
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                    Sĩ số
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                    Lịch học
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                    Điểm TB
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {mockClasses.map((classItem) => (
                  <tr
                    key={classItem.id}
                    className="hover:bg-[#F9FAFB] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-2 border-[#D1D5DB] text-[#EA580C] focus:ring-2 focus:ring-[#EA580C] cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-[#111827]">
                          {classItem.name}
                        </p>
                        <p className="text-sm text-[#6B7280] font-mono">
                          {classItem.code}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-[#FFF7ED] text-[#EA580C] rounded-lg text-sm font-semibold">
                        {classItem.course}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-[#111827]">
                        {classItem.studentCount}/{classItem.maxStudents}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B7280]">
                      {classItem.schedule}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-lg font-bold"
                        style={{ color: getScoreColor(classItem.avgScore) }}
                      >
                        {classItem.avgScore}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(classItem.status)}
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
                          <Edit className="w-5 h-5 text-[#6B7280]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]">
            <p className="text-sm text-[#6B7280]">
              Hiển thị{" "}
              <span className="font-bold text-[#111827]">1-6</span> trong{" "}
              <span className="font-bold text-[#111827]">48</span> lớp học
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-white transition-all text-sm font-medium text-[#6B7280]">
                Trước
              </button>
              <button className="px-4 py-2 bg-[#EA580C] text-white rounded-lg font-medium text-sm">
                1
              </button>
              <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-white transition-all text-sm font-medium text-[#6B7280]">
                2
              </button>
              <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-white transition-all text-sm font-medium text-[#6B7280]">
                3
              </button>
              <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-white transition-all text-sm font-medium text-[#6B7280]">
                Sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}