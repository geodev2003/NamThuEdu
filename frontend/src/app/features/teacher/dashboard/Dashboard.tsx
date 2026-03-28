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

const performanceData = [
  { week: "T1", average: 65, listening: 60, reading: 68, writing: 62 },
  { week: "T2", average: 70, listening: 68, reading: 72, writing: 66 },
  { week: "T3", average: 74, listening: 73, reading: 76, writing: 70 },
  { week: "T4", average: 78, listening: 77, reading: 80, writing: 74 },
  { week: "T5", average: 75, listening: 72, reading: 78, writing: 71 },
  { week: "T6", average: 82, listening: 80, reading: 84, writing: 78 },
];

const recentActivities = [
  {
    id: 1,
    type: "created",
    detail: "IELTS Reading Test",
    time: "2",
    timeUnit: "hoursAgo",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    id: 2,
    type: "assigned",
    detail: "Morning Class",
    time: "5",
    timeUnit: "hoursAgo",
    color: "#10B981",
    bg: "#F0FDF4",
  },
  {
    id: 3,
    type: "graded",
    detail: "12",
    detailType: "submissions",
    time: "",
    timeUnit: "yesterday",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    id: 4,
    type: "created",
    detail: "Cambridge B2 Mock",
    time: "2",
    timeUnit: "daysAgo",
    color: "#8B5CF6",
    bg: "#F5F3FF",
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

export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

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
      value: "12",
      change: "+2",
      iconColor: "#2563EB",
      iconBg: "#EFF6FF",
      accent: "#2563EB",
      delay: "0ms",
    },
    {
      icon: School,
      key: "classes",
      value: "8",
      change: "+1",
      iconColor: "#10B981",
      iconBg: "#F0FDF4",
      accent: "#10B981",
      delay: "80ms",
    },
    {
      icon: Users,
      key: "students",
      value: "156",
      change: "+12",
      iconColor: "#F59E0B",
      iconBg: "#FFFBEB",
      accent: "#F59E0B",
      delay: "160ms",
    },
    {
      icon: FileText,
      key: "exams",
      value: "45",
      change: "+5",
      iconColor: "#8B5CF6",
      iconBg: "#F5F3FF",
      accent: "#8B5CF6",
      delay: "240ms",
    },
  ];

  const quickActions = [
    {
      icon: FileEdit,
      titleKey: "dashboard.quickActions.createExam",
      descKey: "dashboard.quickActions.createExamDesc",
      href: "/giao-vien/de-thi/tao-moi",
      color: "#2563EB",
      bg: "from-[#EFF6FF] to-[#DBEAFE]",
    },
    {
      icon: GraduationCap,
      titleKey: "dashboard.quickActions.cambridgeTemplate",
      descKey: "dashboard.quickActions.cambridgeTemplateDesc",
      href: "/mau-de-cambridge",
      color: "#10B981",
      bg: "from-[#F0FDF4] to-[#D1FAE5]",
    },
    {
      icon: Send,
      titleKey: "dashboard.quickActions.assignTest",
      descKey: "dashboard.quickActions.assignTestDesc",
      href: "/bai-tap",
      color: "#F59E0B",
      bg: "from-[#FFFBEB] to-[#FEF3C7]",
    },
    {
      icon: BarChart2,
      titleKey: "dashboard.quickActions.viewReports",
      descKey: "dashboard.quickActions.viewReportsDesc",
      href: "/cham-diem",
      color: "#8B5CF6",
      bg: "from-[#F5F3FF] to-[#EDE9FE]",
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        breadcrumb={[t("breadcrumb.dashboard"), t("breadcrumb.home")]}
        action={{ label: t("header.new"), onClick: () => navigate("/giao-vien/de-thi/tao-moi") }}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: "#EEEEF3" }}>
        {/* ── Hero Banner ── */}
        <div
          className="relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #312e81 45%, #4c1d95 100%)",
          }}
        >
          {/* Decorative geometry */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }}
          />
          <div
            className="absolute -bottom-16 left-1/4 w-64 h-64 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #60a5fa, transparent)" }}
          />

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
                <p className="text-white/50 text-sm mb-1">
                  {greetingEmoji} {greeting}, thứ Tư, 18/03/2026
                </p>
                <h1
                  className="text-white mb-5"
                  style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.5px" }}
                >
                  Nguyễn Thành! 👋
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1.5 bg-white/10 text-white/80 text-xs px-3 py-1.5 rounded-full border border-white/10">
                    <Clock className="w-3.5 h-3.5" />
                    3 {t('teacher.dashboard.todayClasses')}
                  </span>
                  <span className="flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs px-3 py-1.5 rounded-full border border-amber-400/20">
                    <AlertCircle className="w-3.5 h-3.5" />
                    12 {t('teacher.dashboard.pendingGrading')}
                  </span>
                  <span className="flex items-center gap-1.5 bg-emerald-400/20 text-emerald-300 text-xs px-3 py-1.5 rounded-full border border-emerald-400/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    2 {t('teacher.dashboard.deadlinesThisWeek')}
                  </span>
                </div>
              </div>

              {/* Right: CTA */}
              <button
                onClick={() => navigate("/giao-vien/de-thi/tao-moi")}
                className="flex items-center gap-2 bg-white text-[#312e81] rounded-xl px-5 py-2.5 shadow-lg hover:bg-white/90 transition-all hover:scale-105 active:scale-95 mr-8"
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
                      className="text-[#2563EB]"
                      style={{ fontSize: "28px", fontWeight: 800, lineHeight: "1" }}
                    >
                      82%
                    </span>
                    <span className="text-[#10B981]" style={{ fontSize: "13px", fontWeight: 500 }}>
                      ↑ 4%
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
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorListening" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorReading" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorWriting" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
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
                      stroke="#2563EB"
                      strokeWidth={2.5}
                      fill="url(#colorAvg)"
                      dot={{ fill: "#2563EB", r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <Area
                      key="area-listening"
                      type="monotone"
                      dataKey="listening"
                      name={t("dashboard.charts.listening")}
                      stroke="#10B981"
                      strokeWidth={2}
                      fill="url(#colorListening)"
                      dot={{ fill: "#10B981", r: 3, strokeWidth: 0 }}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                    <Area
                      key="area-reading"
                      type="monotone"
                      dataKey="reading"
                      name={t("dashboard.charts.reading")}
                      stroke="#F59E0B"
                      strokeWidth={2}
                      fill="url(#colorReading)"
                      dot={{ fill: "#F59E0B", r: 3, strokeWidth: 0 }}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                    <Area
                      key="area-writing"
                      type="monotone"
                      dataKey="writing"
                      name={t("dashboard.charts.writing")}
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      fill="url(#colorWriting)"
                      dot={{ fill: "#8B5CF6", r: 3, strokeWidth: 0 }}
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
                  className="text-xs flex items-center gap-0.5 hover:opacity-70 transition-opacity"
                  style={{ color: "#2563EB", fontWeight: 500 }}
                >
                  {t("dashboard.recentActivity.viewAll")}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 space-y-3">
                {recentActivities.map((activity) => {
                  const Icon = activityIcon(activity.type);
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-[#F9FAFB] cursor-default group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: activity.bg }}
                      >
                        <Icon className="w-4 h-4" style={{ color: activity.color }} />
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
                  className="flex items-center gap-1"
                  style={{ fontSize: "12px", color: "#10B981", fontWeight: 600 }}
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