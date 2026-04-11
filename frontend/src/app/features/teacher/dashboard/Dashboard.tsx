import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
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

// Map backend colors to frontend theme
const mapActivityColor = (color: string) => {
  // Backend returns colors like #2563EB, #10B981, #F59E0B
  // Map to orange theme
  const colorMap: Record<string, { color: string; bg: string }> = {
    '#2563EB': { color: '#EA580C', bg: '#FFF7ED' }, // Blue -> Orange
    '#10B981': { color: '#F97316', bg: '#FFEDD5' }, // Green -> Orange-500
    '#F59E0B': { color: '#FB923C', bg: '#FED7AA' }, // Amber -> Orange-400
  };
  
  return colorMap[color] || { color: '#EA580C', bg: '#FFF7ED' };
};

export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // Get user info from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || user?.uName || 'Teacher';

  // Fetch dashboard statistics with 30-second polling
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState(fallbackPerformanceData);
  const [recentActivities, setRecentActivities] = useState(fallbackActivities);

  // Fetch dashboard overview
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const response = await fetch('http://localhost:8000/api/teacher/dashboard/overview', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success') {
            setDashboardStats(result.data);
          }
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
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const response = await fetch('http://localhost:8000/api/teacher/dashboard/performance-data', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success' && result.data && result.data.length > 0) {
            setPerformanceData(result.data);
          }
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
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const response = await fetch('http://localhost:8000/api/teacher/dashboard/recent-activities', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success' && result.data && result.data.length > 0) {
            setRecentActivities(result.data);
          }
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
      iconColor: "#EA580C",
      iconBg: "#FFF7ED",
      accent: "#EA580C",
      delay: "0ms",
    },
    {
      icon: School,
      key: "classes",
      value: statsLoading ? "..." : (dashboardStats?.total_classes?.toString() || "0"),
      change: statsLoading ? "" : `+${dashboardStats?.new_classes_this_month || 0}`,
      iconColor: "#F97316",
      iconBg: "#FFEDD5",
      accent: "#F97316",
      delay: "80ms",
    },
    {
      icon: Users,
      key: "students",
      value: statsLoading ? "..." : (dashboardStats?.total_students?.toString() || "0"),
      change: statsLoading ? "" : `+${dashboardStats?.new_students_this_month || 0}`,
      iconColor: "#FB923C",
      iconBg: "#FED7AA",
      accent: "#FB923C",
      delay: "160ms",
    },
    {
      icon: FileText,
      key: "exams",
      value: statsLoading ? "..." : (dashboardStats?.total_exams?.toString() || "0"),
      change: statsLoading ? "" : `+${dashboardStats?.new_exams_this_month || 0}`,
      iconColor: "#C2410C",
      iconBg: "#FFEDD5",
      accent: "#C2410C",
      delay: "240ms",
    },
  ];

  const quickActions = [
    {
      icon: FileEdit,
      titleKey: "dashboard.quickActions.createExam",
      descKey: "dashboard.quickActions.createExamDesc",
      href: "/giao-vien/de-thi/tao-moi",
      color: "#EA580C",
      bg: "from-[#FFF7ED] to-[#FFEDD5]",
    },
    {
      icon: GraduationCap,
      titleKey: "dashboard.quickActions.cambridgeTemplate",
      descKey: "dashboard.quickActions.cambridgeTemplateDesc",
      href: "/mau-de-cambridge",
      color: "#F97316",
      bg: "from-[#FFEDD5] to-[#FED7AA]",
    },
    {
      icon: Send,
      titleKey: "dashboard.quickActions.assignTest",
      descKey: "dashboard.quickActions.assignTestDesc",
      href: "/bai-tap",
      color: "#FB923C",
      bg: "from-[#FFF7ED] via-[#FFEDD5] to-[#FED7AA]",
    },
    {
      icon: BarChart2,
      titleKey: "dashboard.quickActions.viewReports",
      descKey: "dashboard.quickActions.viewReportsDesc",
      href: "/cham-diem",
      color: "#C2410C",
      bg: "from-white to-[#FFF7ED]",
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        breadcrumb={[t("breadcrumb.dashboard"), t("breadcrumb.home")]}
        action={{ label: t("header.new"), onClick: () => navigate("/giao-vien/de-thi/tao-moi") }}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: "#F9FAFB" }}>
        {/* ── Hero Banner ── */}
        <div
          className="relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #FB923C 0%, #FED7AA 50%, #FFEDD5 100%)",
          }}
        >
          {/* SVG Topography Pattern */}
          <div className="absolute inset-0 opacity-[0.06]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="topography" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
                  <path d="M0 200 Q 50 150, 100 200 T 200 200 T 300 200 T 400 200" stroke="white" strokeWidth="1.5" fill="none" opacity="0.3"/>
                  <path d="M0 220 Q 50 170, 100 220 T 200 220 T 300 220 T 400 220" stroke="white" strokeWidth="1.5" fill="none" opacity="0.25"/>
                  <path d="M0 240 Q 50 190, 100 240 T 200 240 T 300 240 T 400 240" stroke="white" strokeWidth="1.5" fill="none" opacity="0.2"/>
                  <path d="M0 180 Q 50 130, 100 180 T 200 180 T 300 180 T 400 180" stroke="white" strokeWidth="1.5" fill="none" opacity="0.25"/>
                  <path d="M0 160 Q 50 110, 100 160 T 200 160 T 300 160 T 400 160" stroke="white" strokeWidth="1.5" fill="none" opacity="0.2"/>
                  
                  <circle cx="100" cy="200" r="3" fill="white" opacity="0.4"/>
                  <circle cx="200" cy="200" r="3" fill="white" opacity="0.4"/>
                  <circle cx="300" cy="200" r="3" fill="white" opacity="0.4"/>
                  <circle cx="150" cy="180" r="2" fill="white" opacity="0.3"/>
                  <circle cx="250" cy="220" r="2" fill="white" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#topography)"/>
            </svg>
          </div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-10 right-20 w-32 h-32 opacity-[0.08]">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="white" opacity="0.6"/>
              <polygon points="50,25 75,37.5 75,62.5 50,75 25,62.5 25,37.5" fill="none" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          
          <div className="absolute bottom-16 left-32 w-24 h-24 opacity-[0.08]">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="2"/>
              <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="2"/>
              <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          
          <div className="absolute top-1/2 right-1/3 w-20 h-20 opacity-[0.08]">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="10" width="80" height="80" fill="none" stroke="white" strokeWidth="2" transform="rotate(45 50 50)"/>
              <rect x="25" y="25" width="50" height="50" fill="white" opacity="0.4" transform="rotate(45 50 50)"/>
            </svg>
          </div>

          <div className="relative px-8 pt-8 pb-20">
            <div className="flex items-start justify-between relative z-10">
              {/* Left: greeting */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(12px)",
                  transition: "opacity 500ms ease, transform 500ms ease",
                }}
              >
                <p className="text-orange-800/70 text-sm mb-1">
                  {greetingEmoji} {greeting}, thứ Tư, 18/03/2026
                </p>
                <h1
                  className="text-orange-900 mb-5"
                  style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.5px" }}
                >
                  {userName}! 👋
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1.5 bg-orange-600/10 text-orange-800 text-xs px-3 py-1.5 rounded-full border border-orange-300/30">
                    <Clock className="w-3.5 h-3.5" />
                    {statsLoading ? "..." : (dashboardStats?.classes_today || 0)} {t('teacher.dashboard.todayClasses')}
                  </span>
                  <span className="flex items-center gap-1.5 bg-amber-400/15 text-amber-800 text-xs px-3 py-1.5 rounded-full border border-amber-400/30">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {statsLoading ? "..." : (dashboardStats?.pending_grading || 0)} {t('teacher.dashboard.pendingGrading')}
                  </span>
                  <span className="flex items-center gap-1.5 bg-emerald-400/15 text-emerald-800 text-xs px-3 py-1.5 rounded-full border border-emerald-400/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {statsLoading ? "..." : (dashboardStats?.deadlines_this_week || 0)} {t('teacher.dashboard.deadlinesThisWeek')}
                  </span>
                </div>
              </div>

              {/* Right: CTA */}
              <button
                onClick={() => navigate("/giao-vien/de-thi/tao-moi")}
                className="flex items-center gap-2 bg-orange-600 text-white rounded-xl px-5 py-2.5 shadow-lg hover:bg-orange-700 hover:shadow-xl transition-all hover:scale-105 active:scale-95 mr-8"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                <Zap className="w-4 h-4" />
                {t('teacher.dashboard.quickActions.createExam')}
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats Cards (overlap hero) ── */}
        <div className="px-8 -mt-10 mb-6">
          <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.key}
                  className="bg-white rounded-2xl p-5 shadow-md cursor-pointer group"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 400ms ease ${stat.delay}, transform 400ms ease ${stat.delay}`,
                    borderTop: `3px solid ${stat.accent}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 8px 24px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 4px 6px rgba(0,0,0,0.07)";
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: stat.iconBg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: stat.iconColor }} />
                    </div>
                    <span
                      className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs"
                      style={{
                        color: stat.iconColor,
                        backgroundColor: stat.iconBg,
                        fontWeight: 600,
                      }}
                    >
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </span>
                  </div>
                  <p
                    className="text-[#111827]"
                    style={{ fontSize: "32px", fontWeight: 800, lineHeight: "1", letterSpacing: "-1px" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[#9CA3AF] mt-1" style={{ fontSize: "13px" }}>
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
                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorReading" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FB923C" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#FB923C" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorWriting" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FDBA74" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#FDBA74" stopOpacity={0} />
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
                      stroke="#F97316"
                      strokeWidth={2}
                      fill="url(#colorListening)"
                      dot={{ fill: "#F97316", r: 3, strokeWidth: 0 }}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                    <Area
                      key="area-reading"
                      type="monotone"
                      dataKey="reading"
                      name={t("dashboard.charts.reading")}
                      stroke="#FB923C"
                      strokeWidth={2}
                      fill="url(#colorReading)"
                      dot={{ fill: "#FB923C", r: 3, strokeWidth: 0 }}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                    <Area
                      key="area-writing"
                      type="monotone"
                      dataKey="writing"
                      name={t("dashboard.charts.writing")}
                      stroke="#FDBA74"
                      strokeWidth={2}
                      fill="url(#colorWriting)"
                      dot={{ fill: "#FDBA74", r: 3, strokeWidth: 0 }}
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
                  className="text-xs flex items-center gap-0.5 text-orange-600 hover:text-orange-700 transition-colors"
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
                      className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-[#F9FAFB] cursor-default group"
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
                  className="flex items-center gap-1 text-orange-600"
                  style={{ fontSize: "12px", fontWeight: 600 }}
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
                  className={`relative group text-left bg-gradient-to-br ${action.bg} rounded-2xl p-5 border border-white/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 400ms ease ${i * 80 + 400}ms, transform 400ms ease ${i * 80 + 400}ms`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.01)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)";
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm"
                    style={{ backgroundColor: action.color }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p
                    className="text-[#111827] mb-1"
                    style={{ fontSize: "14px", fontWeight: 700 }}
                  >
                    {t(action.titleKey)}
                  </p>
                  <p className="text-[#6B7280]" style={{ fontSize: "12px" }}>
                    {t(action.descKey)}
                  </p>
                  <ArrowUpRight
                    className="absolute top-4 right-4 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: action.color }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}