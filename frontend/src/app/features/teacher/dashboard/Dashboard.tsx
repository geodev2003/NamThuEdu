import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { usePageTitle, PAGE_TITLES } from "../../../../hooks/usePageTitle";
import { api } from "../../../../services/api";
import { getAuthUser } from "../../../../utils/authStorage";
import { Header } from "../../../components/shared/Header";
import {
  BookOpen,
  School,
  Users,
  FileText,
  TrendingUp,
  FileEdit,
  GraduationCap,
  Send,
  BarChart2,
  ChevronRight,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Fallback data for when API is loading or fails
const fallbackPerformanceData = [
  { week: "T1", average: 65, listening: 60, reading: 68, writing: 62 },
  { week: "T2", average: 70, listening: 68, reading: 72, writing: 66 },
  { week: "T3", average: 74, listening: 73, reading: 76, writing: 70 },
  { week: "T4", average: 78, listening: 77, reading: 80, writing: 74 },
  { week: "T5", average: 75, listening: 72, reading: 78, writing: 71 },
  { week: "T6", average: 82, listening: 80, reading: 84, writing: 78 },
];

const fallbackActivities = [
  {
    id: 1,
    type: "created",
    detail: "IELTS Reading Test",
    time: "2",
    timeUnit: "hoursAgo",
    color: "#EA580C",
    bg: "#FFF7ED",
  },
  {
    id: 2,
    type: "assigned",
    detail: "Morning Class",
    time: "5",
    timeUnit: "hoursAgo",
    color: "#F97316",
    bg: "#FFEDD5",
  },
  {
    id: 3,
    type: "graded",
    detail: "12",
    detailType: "submissions",
    time: "",
    timeUnit: "yesterday",
    color: "#FB923C",
    bg: "#FED7AA",
  },
  {
    id: 4,
    type: "created",
    detail: "Cambridge B2 Mock",
    time: "2",
    timeUnit: "daysAgo",
    color: "#C2410C",
    bg: "#FFEDD5",
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F172A] text-white rounded-xl px-4 py-3 shadow-2xl text-xs border border-white/10">
        <p className="mb-2 opacity-50 text-[11px] uppercase tracking-wide">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-6 mb-1 last:mb-0">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: entry.color }}
              />
              <span className="opacity-80">{entry.name}</span>
            </div>
            <span className="font-semibold">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

const activityLabel = (type: string, detail: string, t: any, detailType?: string) => {
  if (type === "created") return `${t('teacher.dashboard.recentActivity.created')} "${detail}"`;
  if (type === "assigned") return `${t('teacher.dashboard.recentActivity.assigned')} "${detail}"`;
  if (type === "graded") return `${t('teacher.dashboard.recentActivity.graded')} ${detail} ${detailType ? t(`teacher.dashboard.recentActivity.${detailType}`) : ''}`;
  return detail;
};

const activityIcon = (type: string) => {
  if (type === "created") return FileEdit;
  if (type === "assigned") return Send;
  if (type === "graded") return CheckCircle2;
  return Sparkles;
};

const mapActivityColor = (_color: string) => ({ color: '#6B7280', bg: '#F9FAFB' });

export function Dashboard() {
  usePageTitle(PAGE_TITLES.TEACHER_DASHBOARD);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  const user = getAuthUser();
  const userName = (user?.name as string) || (user?.uName as string) || 'Teacher';

  // Fetch dashboard statistics with 30-second polling
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState(fallbackPerformanceData);
  const [recentActivities, setRecentActivities] = useState(fallbackActivities);

  // Fetch dashboard overview
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const { data: result } = await api.get('/teacher/dashboard/overview');
        if (result.status === 'success') {
          setDashboardStats(result.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchDashboardStats();
    const interval = setInterval(fetchDashboardStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Fetch performance data
  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const { data: result } = await api.get('/teacher/dashboard/performance-data');
        if (result.status === 'success' && result.data && result.data.length > 0) {
          setPerformanceData(result.data);
        }
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    };

    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, []);

  // Fetch recent activities
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const { data: result } = await api.get('/teacher/dashboard/recent-activities');
        if (result.status === 'success' && result.data && result.data.length > 0) {
          setRecentActivities(result.data);
        }
      } catch (error) {
        console.error('Error fetching recent activities:', error);
      }
    };

    fetchRecentActivities();
    const interval = setInterval(fetchRecentActivities, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t('teacher.dashboard.time.morning') : hour < 18 ? t('teacher.dashboard.time.afternoon') : t('teacher.dashboard.time.evening');
  const greetingEmoji = hour < 12 ? "☀️" : hour < 18 ? "🌤️" : "🌙";

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      icon: BookOpen,
      key: "courses",
      value: statsLoading ? "..." : (dashboardStats?.total_courses?.toString() || "0"),
      change: statsLoading ? "" : `+${dashboardStats?.new_courses_this_month || 0}`,
      delay: "0ms",
    },
    {
      icon: School,
      key: "classes",
      value: statsLoading ? "..." : (dashboardStats?.total_classes?.toString() || "0"),
      change: statsLoading ? "" : `+${dashboardStats?.new_classes_this_month || 0}`,
      delay: "80ms",
    },
    {
      icon: Users,
      key: "students",
      value: statsLoading ? "..." : (dashboardStats?.total_students?.toString() || "0"),
      change: statsLoading ? "" : `+${dashboardStats?.new_students_this_month || 0}`,
      delay: "160ms",
    },
    {
      icon: FileText,
      key: "exams",
      value: statsLoading ? "..." : (dashboardStats?.total_exams?.toString() || "0"),
      change: statsLoading ? "" : `+${dashboardStats?.new_exams_this_month || 0}`,
      delay: "240ms",
    },
  ];

  const quickActions = [
    {
      icon: FileEdit,
      titleKey: "dashboard.quickActions.createExam",
      descKey: "dashboard.quickActions.createExamDesc",
      href: "/giao-vien/de-thi/tao-moi",
      primary: true,
    },
    {
      icon: GraduationCap,
      titleKey: "dashboard.quickActions.cambridgeTemplate",
      descKey: "dashboard.quickActions.cambridgeTemplateDesc",
      href: "/mau-de-cambridge",
      primary: false,
    },
    {
      icon: Send,
      titleKey: "dashboard.quickActions.assignTest",
      descKey: "dashboard.quickActions.assignTestDesc",
      href: "/bai-tap",
      primary: false,
    },
    {
      icon: BarChart2,
      titleKey: "dashboard.quickActions.viewReports",
      descKey: "dashboard.quickActions.viewReportsDesc",
      href: "/cham-diem",
      primary: false,
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        breadcrumb={[t("breadcrumb.dashboard"), t("breadcrumb.home")]}
        action={{ label: t("header.new"), onClick: () => navigate("/giao-vien/de-thi/tao-moi") }}
      />

      <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
        {/* ── Hero Banner ── */}
        <div className="border-b border-gray-200 bg-white px-8 py-7">
          <div
            className="flex items-center justify-between"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 400ms ease, transform 400ms ease",
            }}
          >
            <div>
              <p className="text-xs text-slate-400 mb-1">
                {greetingEmoji} {greeting} · {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
              <h1 className="text-slate-900 text-2xl font-bold tracking-tight">
                {userName}
              </h1>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs px-3 py-1.5 rounded-full">
                  <Clock className="w-3 h-3" />
                  {statsLoading ? "..." : (dashboardStats?.classes_today || 0)} {t('teacher.dashboard.todayClasses')}
                </span>
                <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs px-3 py-1.5 rounded-full">
                  <AlertCircle className="w-3 h-3" />
                  {statsLoading ? "..." : (dashboardStats?.pending_grading || 0)} {t('teacher.dashboard.pendingGrading')}
                </span>
                <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  {statsLoading ? "..." : (dashboardStats?.deadlines_this_week || 0)} {t('teacher.dashboard.deadlinesThisWeek')}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/giao-vien/de-thi/tao-moi")}
              className="flex items-center gap-2 bg-orange-500 text-white rounded-xl px-5 py-2.5 hover:bg-orange-600 transition-colors"
              style={{ fontSize: "14px", fontWeight: 600 }}
            >
              <Zap className="w-4 h-4" />
              {t('teacher.dashboard.quickActions.createExam')}
            </button>
          </div>
        </div>

        {/* ── Stats Cards ── */}
        <div className="px-8 pt-6 mb-6">
          <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.key}
                  className="bg-white rounded-xl p-5 border border-gray-200 cursor-pointer hover:border-indigo-200 hover:shadow-sm transition-all"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 400ms ease ${stat.delay}, transform 400ms ease ${stat.delay}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-indigo-500" />
                    </div>
                    <span className="flex items-center gap-0.5 text-xs text-indigo-400" style={{ fontWeight: 500 }}>
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-slate-900" style={{ fontSize: "30px", fontWeight: 800, lineHeight: "1", letterSpacing: "-1px" }}>
                    {stat.value}
                  </p>
                  <p className="text-slate-400 mt-1" style={{ fontSize: "13px" }}>
                    {t(`dashboard.stats.${stat.key}`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Bento Grid ── */}
        <div className="px-8 pb-6">
          <div
            className="grid gap-5 mb-5"
            style={{ gridTemplateColumns: "1fr 380px" }}
          >
            {/* ── Chart Card ── */}
            <div
              className="bg-white rounded-2xl p-6 shadow-sm"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 500ms ease 300ms, transform 500ms ease 300ms",
              }}
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3
                    className="text-[#111827]"
                    style={{ fontSize: "17px", fontWeight: 700 }}
                  >
                    {t("dashboard.charts.studentPerformance")}
                  </h3>
                  <p className="text-[#9CA3AF] mt-0.5" style={{ fontSize: "13px" }}>
                    {t('teacher.dashboard.lastSixWeeks')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="text-orange-600"
                      style={{ fontSize: "28px", fontWeight: 800, lineHeight: "1" }}
                    >
                      {statsLoading ? "..." : `${dashboardStats?.average_score || 0}%`}
                    </span>
                    <span className="text-emerald-500" style={{ fontSize: "13px", fontWeight: 500 }}>
                      ↑ {statsLoading ? "..." : `${dashboardStats?.score_improvement || 0}%`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart
                    data={performanceData}
                    margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EA580C" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#EA580C" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorListening" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#64748B" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#64748B" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorReading" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorWriting" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#CBD5E1" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#CBD5E1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      key="grid"
                      strokeDasharray="3 3"
                      stroke="#F3F4F6"
                      vertical={false}
                    />
                    <XAxis
                      key="x-axis"
                      dataKey="week"
                      stroke="transparent"
                      tick={{ fontSize: 12, fill: "#9CA3AF" }}
                      tickLine={false}
                    />
                    <YAxis
                      key="y-axis"
                      stroke="transparent"
                      tick={{ fontSize: 11, fill: "#9CA3AF" }}
                      domain={[40, 100]}
                      ticks={[40, 60, 80, 100]}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip key="tooltip" content={<CustomTooltip />} />
                    <Legend
                      key="legend"
                      wrapperStyle={{ paddingTop: "14px", fontSize: "12px" }}
                      iconType="circle"
                      iconSize={7}
                    />
                    <Area
                      key="area-average"
                      type="monotone"
                      dataKey="average"
                      name={t("dashboard.charts.average")}
                      stroke="#EA580C"
                      strokeWidth={2.5}
                      fill="url(#colorAvg)"
                      dot={{ fill: "#EA580C", r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <Area
                      key="area-listening"
                      type="monotone"
                      dataKey="listening"
                      name={t("dashboard.charts.listening")}
                      stroke="#64748B"
                      strokeWidth={1.5}
                      fill="url(#colorListening)"
                      dot={{ fill: "#64748B", r: 3, strokeWidth: 0 }}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                    <Area
                      key="area-reading"
                      type="monotone"
                      dataKey="reading"
                      name={t("dashboard.charts.reading")}
                      stroke="#94A3B8"
                      strokeWidth={1.5}
                      fill="url(#colorReading)"
                      dot={{ fill: "#94A3B8", r: 3, strokeWidth: 0 }}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                    <Area
                      key="area-writing"
                      type="monotone"
                      dataKey="writing"
                      name={t("dashboard.charts.writing")}
                      stroke="#CBD5E1"
                      strokeWidth={1.5}
                      fill="url(#colorWriting)"
                      dot={{ fill: "#CBD5E1", r: 3, strokeWidth: 0 }}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Activity Feed ── */}
            <div
              className="bg-white rounded-2xl p-6 shadow-sm flex flex-col"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 500ms ease 380ms, transform 500ms ease 380ms",
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3
                  className="text-[#111827]"
                  style={{ fontSize: "17px", fontWeight: 700 }}
                >
                  {t("dashboard.recentActivity.title")}
                </h3>
                <button
                  className="text-xs flex items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  {t("dashboard.recentActivity.viewAll")}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 space-y-3">
                {recentActivities.map((activity) => {
                  const Icon = activityIcon(activity.type);
                  const mappedColors = mapActivityColor(activity.color);
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-indigo-50/50 cursor-default group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: mappedColors.bg }}
                      >
                        <Icon className="w-4 h-4" style={{ color: mappedColors.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[#374151] leading-snug"
                          style={{ fontSize: "13px", fontWeight: 500 }}
                        >
                          {activityLabel(activity.type, activity.detail, t, (activity as any).detailType)}
                        </p>
                        <p className="text-[#9CA3AF] mt-0.5" style={{ fontSize: "11px" }}>
                          {activity.timeUnit === 'yesterday' 
                            ? t('teacher.dashboard.recentActivity.yesterday')
                            : activity.time && activity.timeUnit
                            ? `${activity.time} ${t(`teacher.dashboard.recentActivity.${activity.timeUnit}`)}`
                            : activity.time
                          }
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom summary */}
              <div
                className="mt-4 pt-4 border-t border-[#F3F4F6] flex items-center justify-between"
              >
                <span className="text-[#9CA3AF]" style={{ fontSize: "12px" }}>
                  {t('teacher.dashboard.thisWeek')}
                </span>
                <span
                  className="flex items-center gap-1 text-slate-400"
                  style={{ fontSize: "12px", fontWeight: 500 }}
                >
                  <TrendingUp className="w-3 h-3" />
                  {t('teacher.dashboard.goodActivity')}
                </span>
              </div>
            </div>
          </div>

          {/* ── Quick Actions Row ── */}
          <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.titleKey}
                  onClick={() => navigate(action.href)}
                  className="relative group text-left bg-white rounded-xl p-5 border border-gray-200 hover:border-indigo-200 hover:shadow-sm transition-all duration-200"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 400ms ease ${i * 80 + 400}ms, transform 400ms ease ${i * 80 + 400}ms`,
                  }}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${action.primary ? 'bg-orange-500' : 'bg-indigo-50'}`}>
                    <Icon className={`w-4 h-4 ${action.primary ? 'text-white' : 'text-indigo-400'}`} />
                  </div>
                  <p className="text-slate-800 mb-1" style={{ fontSize: "14px", fontWeight: 600 }}>
                    {t(action.titleKey)}
                  </p>
                  <p className="text-slate-400" style={{ fontSize: "12px" }}>
                    {t(action.descKey)}
                  </p>
                  <ArrowUpRight className="absolute top-4 right-4 w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}