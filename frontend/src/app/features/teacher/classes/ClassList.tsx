import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { usePageTitle, PAGE_TITLES } from "../../../../hooks/usePageTitle";
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
  Loader2,
  AlertCircle,
} from "lucide-react";

type ViewMode = "grid" | "list";

interface ClassItem {
  id: number;
  name: string;
  code: string;
  course: string;
  studentCount: number;
  maxStudents: number;
  status: string;
  schedule: string;
  room: string;
  teacher: string;
  startDate: string;
  avgScore: number;
  attendance: number;
  assignments: number;
}

export function ClassList() {
  usePageTitle(PAGE_TITLES.TEACHER_CLASSES);
  const { t } = useTranslation();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/classes`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success') {
            setClasses(result.data || []);
          } else {
            setError(t('teacher.classes.loadError'));
          }
        } else {
          setError(t('teacher.classes.loadDataError'));
        }
      } catch (err) {
        setError(t('teacher.classes.connectionError'));
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const statsData = [
    {
      label: t('teacher.classes.stats.totalClasses'),
      value: classes.length,
      change: 12.5,
      trend: "up",
      icon: School,
      color: "#EA580C",
    },
    {
      label: t('teacher.classes.stats.activeClasses'),
      value: classes.filter(c => c.status === 'active').length,
      change: 8.3,
      trend: "up",
      icon: UserCheck,
      color: "#10B981",
    },
    {
      label: t('teacher.classes.stats.totalStudents'),
      value: classes.reduce((sum, c) => sum + c.studentCount, 0),
      change: 15.2,
      trend: "up",
      icon: Users,
      color: "#F59E0B",
    },
    {
      label: t('teacher.classes.stats.avgStudents'),
      value: classes.length > 0 ? Math.round(classes.reduce((sum, c) => sum + c.studentCount, 0) / classes.length) : 0,
      change: -2.1,
      trend: "down",
      icon: Target,
      color: "#8B5CF6",
    },
  ];

  if (loading) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#EA580C] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">{t('teacher.classes.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-semibold mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
          >
            {t('teacher.classes.retry')}
          </button>
        </div>
      </div>
    );
  }

  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         classItem.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         classItem.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || classItem.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: t('teacher.classes.status.active'), color: "#10B981", bg: "#D1FAE5" },
      inactive: { label: t('teacher.classes.status.inactive'), color: "#6B7280", bg: "#F3F4F6" },
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
              {t('teacher.classes.title')}
            </h1>
            <p className="text-[#6B7280] text-sm">
              {t('teacher.classes.breadcrumb')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/giao-vien/lop-hoc/thong-ke"
              className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-[#E5E7EB] text-[#374151] rounded-xl hover:border-[#EA580C] hover:bg-[#FFF7ED] transition-all font-semibold"
            >
              <BarChart3 className="w-5 h-5" />
              {t('teacher.classes.btnStats')}
            </Link>
            <Link
              to="/giao-vien/lop-hoc/tao-moi"
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white rounded-xl hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105 transition-all font-bold"
            >
              <Plus className="w-5 h-5" />
              {t('teacher.classes.btnCreateClass')}
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
              placeholder={t('teacher.classes.searchPlaceholder')}
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
            {t('teacher.classes.filter')}
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

      {/* Empty State */}
      {filteredClasses.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('teacher.classes.empty.title')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('teacher.classes.empty.subtitle')}
          </p>
          <Link
            to="/giao-vien/lop-hoc/tao-moi"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#EA580C] text-white font-semibold rounded-xl hover:bg-[#C2410C] transition-all"
          >
            <Plus className="w-5 h-5" />
            {t('teacher.classes.empty.createFirst')}
          </Link>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && filteredClasses.length > 0 && (
        <div className="grid grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => (
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
                      {t('teacher.classes.grid.capacity')}
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
                  <p className="text-xs text-[#6B7280] mb-1">{t('teacher.classes.grid.avgScore')}</p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: getScoreColor(classItem.avgScore) }}
                  >
                    {classItem.avgScore}
                  </p>
                </div>
                <div className="w-px h-8 bg-[#E5E7EB]" />
                <div className="flex-1 text-center">
                  <p className="text-xs text-[#6B7280] mb-1">{t('teacher.classes.grid.attendance')}</p>
                  <p className="text-lg font-bold text-[#10B981]">
                    {classItem.attendance}%
                  </p>
                </div>
                <div className="w-px h-8 bg-[#E5E7EB]" />
                <div className="flex-1 text-center">
                  <p className="text-xs text-[#6B7280] mb-1">{t('teacher.classes.grid.assignments')}</p>
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
      {viewMode === "list" && filteredClasses.length > 0 && (
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
                    {t('teacher.classes.table.class')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                    {t('teacher.classes.table.course')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                    {t('teacher.classes.table.students')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                    {t('teacher.classes.table.schedule')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                    {t('teacher.classes.table.avgScore')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                    {t('teacher.classes.table.status')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                    {t('teacher.classes.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredClasses.map((classItem) => (
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
              {t('teacher.classes.pagination.showing')}{" "}
              <span className="font-bold text-[#111827]">1-{Math.min(filteredClasses.length, 10)}</span> {t('teacher.classes.pagination.of')}{" "}
              <span className="font-bold text-[#111827]">{filteredClasses.length}</span> {t('teacher.classes.pagination.items')}
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-white transition-all text-sm font-medium text-[#6B7280]">
                {t('teacher.classes.pagination.previous')}
              </button>
              <button className="px-4 py-2 bg-[#EA580C] text-white rounded-lg font-medium text-sm">
                1
              </button>
              <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-white transition-all text-sm font-medium text-[#6B7280]">
                {t('teacher.classes.pagination.next')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}