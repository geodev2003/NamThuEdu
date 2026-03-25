import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  ClipboardList,
  Trophy,
  Flame,
  ChevronRight,
  Clock,
  Star,
  TrendingUp,
  Play,
  AlertCircle,
  Target,
  Zap,
  BookOpen,
  BarChart2,
  ArrowRight,
} from "lucide-react";
import { studentApi } from "../../../../services/studentApi";
import { getSkillColor, getSkillIcon, getSkillName } from "../../../../utils/skillHelpers";
import { formatDate } from "../../../../utils/formatters";
import { getGradeBadge } from "../../../../utils/gradeHelpers";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// ─── Color tokens ──────────────────────────────────────────────────────────────
const PURPLE = "#7C3AED";
const PURPLE_MID = "#8B5CF6";
const PURPLE_LIGHT = "#EDE9FE";
const CYAN = "#2DD4BF";

// ─── Quick Action Card ────────────────────────────────────────────────────────
interface QuickAction {
  label: string;
  sub: string;
  icon: React.ElementType;
  path: string;
  gradient: string;
  iconBg: string;
  textColor: string;
}

function QuickActionCard({ action }: { action: QuickAction }) {
  const Icon = action.icon;
  return (
    <Link
      to={action.path}
      className="group flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 cursor-pointer"
      style={{
        background: "#FFFFFF",
        border: "1.5px solid #F0EEFF",
        boxShadow: "0 2px 12px rgba(124,58,237,0.06)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 8px 28px rgba(124,58,237,0.14)";
        (e.currentTarget as HTMLElement).style.borderColor = `${PURPLE}40`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 2px 12px rgba(124,58,237,0.06)";
        (e.currentTarget as HTMLElement).style.borderColor = "#F0EEFF";
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: action.iconBg }}
      >
        <Icon className="w-6 h-6" style={{ color: action.textColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 15, fontWeight: 700, color: "#1F1344" }}>
          {action.label}
        </p>
        <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
          {action.sub}
        </p>
      </div>
      <ArrowRight
        className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
        style={{ color: "#D1D5DB" }}
      />
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200 ${className}`}
      style={{ opacity: 0.6 }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function StudentDashboard() {
  const { t } = useTranslation();

  // Fetch data
  const { data: testsData, isLoading: testsLoading } = useQuery({
    queryKey: ["student", "tests", "pending"],
    queryFn: () => studentApi.getTests({ status: "pending" }),
  });
  const { data: submissionsData, isLoading: submissionsLoading } = useQuery({
    queryKey: ["student", "submissions", "recent"],
    queryFn: () => studentApi.getSubmissions({ limit: 3, sort: "date_desc" }),
  });
  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ["student", "progress"],
    queryFn: () => studentApi.getProgress(),
  });

  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return t("student.dashboard.greeting.morning");
    if (h < 18) return t("student.dashboard.greeting.afternoon");
    return t("student.dashboard.greeting.evening");
  });

  // Transform data
  const pendingAssignments =
    (testsData as any)?.data?.data?.pending?.map((a: any) => ({
      id: a.assignment_id,
      examId: a.exam_id,
      title: a.exam_title,
      subject: getSkillName(a.exam_skill),
      due: a.time_remaining,
      urgent: a.is_urgent,
      color: getSkillColor(a.exam_skill),
      icon: getSkillIcon(a.exam_skill),
    })) || [];

  const recentResults =
    (submissionsData as any)?.data?.data?.submissions?.map((s: any) => ({
      id: s.sId,
      title: s.exam.eTitle,
      score: s.sScore,
      max: s.exam.eMax_score,
      date: formatDate(s.sSubmit_time),
      badge: getGradeBadge(s.sScore),
    })) || [];

  const progress = (progressData as any)?.data?.data;
  const skillData =
    progress?.skill_analysis?.skills_breakdown?.map((s: any) => ({
      skill: s.skill_name,
      score: s.average_score,
    })) || [];
  const chartData =
    progress?.trends?.recent_scores?.slice(-7).map((s: any, i: number) => ({
      week: `T${i + 1}`,
      score: s.score,
    })) || [];

  const stats = {
    pendingTests: pendingAssignments.length,
    averageScore: progress?.overview?.average_score || 0,
    totalTests: progress?.overview?.total_tests || 0,
    recentScore: progress?.overview?.recent_score || 0,
  };

  const isLoading = testsLoading || submissionsLoading || progressLoading;

  const quickActions: QuickAction[] = [
    {
      label: "Làm bài tập",
      sub: `${stats.pendingTests} bài đang chờ`,
      icon: ClipboardList,
      path: "/bai-tap",
      gradient: `linear-gradient(135deg, #EDE9FE, #DDD6FE)`,
      iconBg: PURPLE_LIGHT,
      textColor: PURPLE,
    },
    {
      label: "Luyện tập ngay",
      sub: "Nghe · Đọc · Viết · Nói",
      icon: Target,
      path: "/luyen-tap",
      gradient: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
      iconBg: "#D1FAE5",
      textColor: "#059669",
    },
    {
      label: "Xem tiến độ",
      sub: `${stats.averageScore.toFixed(1)} điểm TB`,
      icon: BarChart2,
      path: "/tien-do",
      gradient: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
      iconBg: "#DBEAFE",
      textColor: "#2563EB",
    },
    {
      label: "Lịch sử bài thi",
      sub: `${stats.totalTests} bài đã hoàn thành`,
      icon: Trophy,
      path: "/lich-su",
      gradient: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
      iconBg: "#FEF3C7",
      textColor: "#D97706",
    },
  ];

  return (
    <div className="py-6 space-y-6 max-w-[1600px] mx-auto">

      {/* ─── Hero Welcome Section ───────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 md:p-8"
        style={{
          background: `linear-gradient(135deg, ${PURPLE} 0%, ${PURPLE_MID} 50%, #A78BFA 100%)`,
        }}
      >
        {/* decorative circles */}
        <div
          className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20"
          style={{ background: "rgba(255,255,255,0.3)" }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-10"
          style={{ background: "rgba(255,255,255,0.5)" }}
        />
        <div
          className="absolute top-6 right-24 w-20 h-20 rounded-full opacity-10"
          style={{ background: "#fff" }}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p
              className="text-white/70 font-medium mb-1"
              style={{ fontSize: 14 }}
            >
              {greeting} 👋
            </p>
            <h1
              className="text-white font-extrabold leading-tight"
              style={{ fontSize: 26, letterSpacing: "-0.03em" }}
            >
              {isLoading ? "Xin chào..." : "Học viên"}
            </h1>
            <p className="text-white/60 mt-1" style={{ fontSize: 13 }}>
              Hôm nay bạn có <strong className="text-white">{stats.pendingTests}</strong> bài tập đang chờ
            </p>

            {/* XP progress bar */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-white/90">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span style={{ fontSize: 13, fontWeight: 700 }}>1,240 XP</span>
              </div>
              <div
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.2)", maxWidth: 160 }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "62%",
                    background:
                      "linear-gradient(90deg, #FCD34D, #F59E0B)",
                  }}
                />
              </div>
              <span className="text-white/60" style={{ fontSize: 11 }}>
                1,500 XP
              </span>
            </div>
          </div>

          {/* Streak badge */}
          <div
            className="flex-shrink-0 flex flex-col items-center px-5 py-4 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <Flame className="w-7 h-7 text-yellow-300 mb-1" />
            <p
              className="text-white font-extrabold"
              style={{ fontSize: 28, lineHeight: 1 }}
            >
              7
            </p>
            <p className="text-white/70" style={{ fontSize: 11 }}>
              ngày liên tiếp
            </p>
          </div>
        </div>
      </div>

      {/* ─── Stat Chips ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Bài chờ làm",
            value: stats.pendingTests,
            icon: ClipboardList,
            color: "#EF4444",
            bg: "#FEE2E2",
          },
          {
            label: "Điểm TB",
            value: stats.averageScore.toFixed(1),
            icon: TrendingUp,
            color: PURPLE,
            bg: PURPLE_LIGHT,
          },
          {
            label: "Điểm gần nhất",
            value: stats.recentScore.toFixed(1),
            icon: Star,
            color: "#F59E0B",
            bg: "#FEF3C7",
          },
          {
            label: "Đã hoàn thành",
            value: stats.totalTests,
            icon: Trophy,
            color: "#10B981",
            bg: "#D1FAE5",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white"
            style={{
              border: "1.5px solid #F3F4F6",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: card.bg }}
            >
              <card.icon className="w-5 h-5" style={{ color: card.color }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#1F1344",
                  lineHeight: 1,
                }}
              >
                {isLoading ? <Skeleton className="w-10 h-6" /> : card.value}
              </div>
              <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                {card.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Quick Actions ───────────────────────────────────────────────────── */}
      <div>
        <h2
          className="font-bold mb-3"
          style={{ fontSize: 17, color: "#1F1344" }}
        >
          Truy cập nhanh
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <QuickActionCard key={action.path} action={action} />
          ))}
        </div>
      </div>

      {/* ─── Main Grid: Pending + Skill Radar ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Pending Assignments — col 8 */}
        <div
          className="lg:col-span-8 rounded-2xl p-6 bg-white"
          style={{
            border: "1.5px solid #F0EEFF",
            boxShadow: "0 2px 12px rgba(124,58,237,0.06)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: PURPLE_LIGHT }}
              >
                <ClipboardList className="w-4 h-4" style={{ color: PURPLE }} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F1344" }}>
                Bài tập đang chờ
              </h2>
              {stats.pendingTests > 0 && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                  style={{ background: "#EF4444" }}
                >
                  {stats.pendingTests}
                </span>
              )}
            </div>
            <Link
              to="/bai-tap"
              className="flex items-center gap-1 text-sm font-semibold transition-colors"
              style={{ color: PURPLE }}
            >
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : pendingAssignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: PURPLE_LIGHT }}
              >
                <BookOpen className="w-7 h-7" style={{ color: PURPLE }} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#1F1344" }}>
                Chưa có bài tập
              </p>
              <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>
                Giáo viên chưa giao bài. Thử luyện tập tự do nhé!
              </p>
              <Link
                to="/luyen-tap"
                className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: PURPLE }}
              >
                Luyện tập ngay
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingAssignments.slice(0, 4).map((a: any) => {
                const Icon = a.icon;
                return (
                  <div
                    key={a.id}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 border cursor-pointer"
                    style={{ borderColor: "#F0EEFF", background: "#FAFAFE" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${PURPLE}40`;
                      (e.currentTarget as HTMLElement).style.background = PURPLE_LIGHT;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#F0EEFF";
                      (e.currentTarget as HTMLElement).style.background = "#FAFAFE";
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${a.color}18` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: a.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="truncate font-semibold"
                        style={{ fontSize: 14, color: "#1F1344" }}
                      >
                        {a.title}
                      </p>
                      <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                        {a.subject}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        {a.urgent ? (
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                        )}
                        <span
                          style={{
                            fontSize: 12,
                            color: a.urgent ? "#EF4444" : "#9CA3AF",
                            fontWeight: a.urgent ? 600 : 400,
                          }}
                        >
                          {a.due}
                        </span>
                      </div>
                      <Link
                        to={`/lam-bai/${a.examId}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-bold transition-opacity hover:opacity-90"
                        style={{ background: a.color }}
                      >
                        <Play className="w-3 h-3" />
                        Làm bài
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Skill Radar — col 4 */}
        <div
          className="lg:col-span-4 rounded-2xl p-6 bg-white"
          style={{
            border: "1.5px solid #F0EEFF",
            boxShadow: "0 2px 12px rgba(124,58,237,0.06)",
          }}
        >
          <div className="flex items-center gap-2.5 mb-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: PURPLE_LIGHT }}
            >
              <Target className="w-4 h-4" style={{ color: PURPLE }} />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F1344" }}>
              Kỹ năng
            </h2>
          </div>
          <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 16 }}>
            Phân tích 4 kỹ năng IELTS của bạn
          </p>

          {isLoading ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : skillData.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              Chưa có dữ liệu kỹ năng
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={190}>
                <RadarChart data={skillData}>
                  <PolarGrid stroke="#EDE9FE" />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fontSize: 10, fill: "#6B7280" }}
                  />
                  <Radar
                    name="Điểm"
                    dataKey="score"
                    stroke={PURPLE}
                    fill={PURPLE}
                    fillOpacity={0.18}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>

              {skillData.length >= 2 && (
                <div className="space-y-2.5 mt-2">
                  {[
                    {
                      label: "Tốt nhất",
                      data: skillData.reduce(
                        (max: any, s: any) =>
                          s.score > max.score ? s : max
                      ),
                      color: "#10B981",
                      bg: "#D1FAE5",
                    },
                    {
                      label: "Cần cải thiện",
                      data: skillData.reduce(
                        (min: any, s: any) =>
                          s.score < min.score ? s : min
                      ),
                      color: "#EF4444",
                      bg: "#FEE2E2",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p style={{ fontSize: 11, color: "#9CA3AF" }}>
                          {s.label}
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#1F1344",
                          }}
                        >
                          {s.data.skill}
                        </p>
                      </div>
                      <span
                        className="px-2.5 py-1 rounded-lg text-sm font-bold"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {Math.round(s.data.score)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ─── Bottom: Progress Chart + Results + Quick Skill ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Progress chart — col 7 */}
        <div
          className="lg:col-span-7 rounded-2xl p-6 bg-white"
          style={{
            border: "1.5px solid #F0EEFF",
            boxShadow: "0 2px 12px rgba(124,58,237,0.06)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: PURPLE_LIGHT }}
              >
                <TrendingUp className="w-4 h-4" style={{ color: PURPLE }} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F1344" }}>
                Tiến độ học tập
              </h2>
            </div>
            {chartData.length > 1 && (
              <span
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: "#D1FAE5", color: "#065F46" }}
              >
                <TrendingUp className="w-3 h-3" />+
                {(
                  chartData[chartData.length - 1].score - chartData[0].score
                ).toFixed(1)}{" "}
                điểm
              </span>
            )}
          </div>

          {isLoading || chartData.length === 0 ? (
            <Skeleton className="h-36 w-full rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PURPLE} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={PURPLE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F3F4F6"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: `1px solid ${PURPLE}30`,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke={PURPLE}
                  strokeWidth={2.5}
                  fill="url(#purpleGrad)"
                  dot={{ fill: PURPLE, r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Right col — Results + Quick Practice */}
        <div className="lg:col-span-5 space-y-5">

          {/* Recent Results */}
          <div
            className="rounded-2xl p-5 bg-white"
            style={{
              border: "1.5px solid #F0EEFF",
              boxShadow: "0 2px 12px rgba(124,58,237,0.06)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" style={{ color: "#F59E0B" }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1F1344" }}>
                  Kết quả gần đây
                </h3>
              </div>
              <Link
                to="/lich-su"
                style={{ fontSize: 12, color: PURPLE, fontWeight: 600 }}
              >
                Xem tất cả
              </Link>
            </div>

            {isLoading || recentResults.length === 0 ? (
              <div className="text-center py-4 text-gray-400 text-sm">
                Chưa có kết quả nào
              </div>
            ) : (
              <div className="space-y-3">
                {recentResults.map((r: any) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <p
                        className="truncate font-semibold"
                        style={{ fontSize: 13, color: "#374151" }}
                      >
                        {r.title}
                      </p>
                      <p style={{ fontSize: 11, color: "#9CA3AF" }}>
                        {r.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span
                        className="px-2 py-0.5 rounded-md text-xs font-semibold"
                        style={{
                          background:
                            r.score >= 80 ? "#D1FAE5" : PURPLE_LIGHT,
                          color: r.score >= 80 ? "#065F46" : PURPLE,
                        }}
                      >
                        {r.badge}
                      </span>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: "#1F1344",
                        }}
                      >
                        {r.score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Skill Practice */}
          <div
            className="rounded-2xl p-5 bg-white"
            style={{
              border: "1.5px solid #F0EEFF",
              boxShadow: "0 2px 12px rgba(124,58,237,0.06)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4" style={{ color: CYAN }} />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1F1344" }}>
                Luyện tập nhanh
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  label: t("student.dashboard.skillNames.listening"),
                  skill: "listening",
                  path: "/luyen-tap?skill=listening",
                },
                {
                  label: t("student.dashboard.skillNames.reading"),
                  skill: "reading",
                  path: "/luyen-tap?skill=reading",
                },
                {
                  label: t("student.dashboard.skillNames.writing"),
                  skill: "writing",
                  path: "/luyen-tap?skill=writing",
                },
                {
                  label: t("student.dashboard.skillNames.speaking"),
                  skill: "speaking",
                  path: "/luyen-tap?skill=speaking",
                },
              ].map((q) => {
                const Icon = getSkillIcon(q.skill);
                const color = getSkillColor(q.skill);
                return (
                  <Link
                    key={q.label}
                    to={q.path}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 border cursor-pointer"
                    style={{ borderColor: "#F0EEFF", background: "#FAFAFE" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
                      (e.currentTarget as HTMLElement).style.background = `${color}10`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#F0EEFF";
                      (e.currentTarget as HTMLElement).style.background = "#FAFAFE";
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1F1344",
                      }}
                    >
                      {q.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
