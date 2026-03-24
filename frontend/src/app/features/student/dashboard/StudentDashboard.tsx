import { useState } from "react";
import { Link } from "react-router";
import {
  ClipboardList,
  Trophy,
  Flame,
  Lightbulb,
  ChevronRight,
  Clock,
  CheckCircle2,
  Star,
  TrendingUp,
  BookOpen,
  Play,
  AlertCircle,
  Calendar,
  Headphones,
  PenTool,
  Eye,
  Mic,
  ArrowUpRight,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
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

const skillData = [
  { skill: "Listening", score: 72 },
  { skill: "Reading", score: 80 },
  { skill: "Writing", score: 65 },
  { skill: "Speaking", score: 68 },
  { skill: "Vocabulary", score: 77 },
  { skill: "Grammar", score: 82 },
];

const progressData = [
  { week: "T1", score: 58 },
  { week: "T2", score: 63 },
  { week: "T3", score: 67 },
  { week: "T4", score: 71 },
  { week: "T5", score: 69 },
  { week: "T6", score: 75 },
  { week: "T7", score: 79 },
];

const pendingAssignments = [
  {
    id: 1,
    title: "IELTS Reading Practice - Section 3",
    subject: "Reading",
    due: "Hôm nay, 23:59",
    urgent: true,
    color: "#10B981",
    icon: Eye,
  },
  {
    id: 2,
    title: "Listening Mock Test - Cambridge 17",
    subject: "Listening",
    due: "Ngày mai, 20:00",
    urgent: false,
    color: "#8B5CF6",
    icon: Headphones,
  },
  {
    id: 3,
    title: "Writing Task 2 - Environment",
    subject: "Writing",
    due: "26/03, 22:00",
    urgent: false,
    color: "#F59E0B",
    icon: PenTool,
  },
  {
    id: 4,
    title: "Speaking Part 2 - Describe a Place",
    subject: "Speaking",
    due: "28/03, 18:00",
    urgent: false,
    color: "#2563EB",
    icon: Mic,
  },
];

const recentResults = [
  { id: 1, title: "Reading Test 8", score: 82, max: 100, date: "22/03", badge: "Tốt" },
  { id: 2, title: "Listening Practice", score: 76, max: 100, date: "20/03", badge: "Khá" },
  { id: 3, title: "Full Mock Test", score: 71, max: 100, date: "18/03", badge: "Khá" },
];

const quickPractice = [
  { label: "Listening", color: "#8B5CF6", icon: Headphones, path: "/hoc-sinh/luyen-tap/chu-de" },
  { label: "Reading", color: "#10B981", icon: Eye, path: "/hoc-sinh/luyen-tap/chu-de" },
  { label: "Writing", color: "#F59E0B", icon: PenTool, path: "/hoc-sinh/luyen-tap/chu-de" },
  { label: "Speaking", color: "#2563EB", icon: Mic, path: "/hoc-sinh/luyen-tap/chu-de" },
];

export function StudentDashboard() {
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return "Chào buổi sáng";
    if (h < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  });

  return (
    <div className="min-h-screen p-6" style={{ background: "#F5F3FF" }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p style={{ fontSize: 13, color: "#8B5CF6", fontWeight: 600 }}>
              {greeting}, 👋
            </p>
            <h1
              className="mt-1"
              style={{ fontSize: 26, fontWeight: 800, color: "#1F1344", letterSpacing: "-0.03em" }}
            >
              Nguyễn Thị Mai
            </h1>
            <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
              Mục tiêu IELTS 7.0 · Còn 47 ngày đến kỳ thi
            </p>
          </div>

          {/* Streak Badge */}
          <div
            className="flex items-center gap-2 px-5 py-3 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
              border: "2px solid #F59E0B",
            }}
          >
            <Flame className="w-6 h-6" style={{ color: "#F59E0B" }} />
            <div>
              <p style={{ fontSize: 22, fontWeight: 800, color: "#92400E", lineHeight: 1 }}>24</p>
              <p style={{ fontSize: 11, color: "#B45309", fontWeight: 500 }}>ngày streak</p>
            </div>
          </div>
        </div>

        {/* Target progress bar */}
        <div
          className="mt-4 p-4 rounded-2xl flex items-center gap-4"
          style={{
            background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
            boxShadow: "0 4px 20px rgba(139,92,246,0.3)",
          }}
        >
          <Target className="w-8 h-8 text-white flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                Tiến độ mục tiêu IELTS 7.0
              </p>
              <span style={{ fontSize: 13, color: "#FDE68A", fontWeight: 700 }}>
                Band 6.5 hiện tại
              </span>
            </div>
            <div className="relative h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
              <div
                className="h-2.5 rounded-full"
                style={{
                  width: "72%",
                  background: "linear-gradient(90deg, #FDE68A, #F59E0B)",
                  boxShadow: "0 0 8px rgba(245,158,11,0.5)",
                }}
              />
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>
              Cần cải thiện thêm 0.5 band · Đã học 73 giờ tháng này
            </p>
          </div>
          <Sparkles className="w-5 h-5" style={{ color: "#FDE68A" }} />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Bài tập đang chờ",
            value: "4",
            sub: "2 bài hôm nay",
            icon: ClipboardList,
            color: "#EF4444",
            bg: "linear-gradient(135deg, #FEE2E2, #FECACA)",
            textColor: "#991B1B",
          },
          {
            label: "Điểm trung bình",
            value: "74",
            sub: "+3 điểm tuần này",
            icon: TrendingUp,
            color: "#8B5CF6",
            bg: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
            textColor: "#4C1D95",
          },
          {
            label: "Xếp hạng lớp",
            value: "#3",
            sub: "Top 15% học viên",
            icon: Trophy,
            color: "#F59E0B",
            bg: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
            textColor: "#78350F",
          },
          {
            label: "XP tích lũy",
            value: "4,250",
            sub: "750 điểm → Lv.6",
            icon: Star,
            color: "#10B981",
            bg: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
            textColor: "#064E3B",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl p-5"
            style={{
              background: card.bg,
              border: `1px solid ${card.color}30`,
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${card.color}20` }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <ArrowUpRight className="w-4 h-4" style={{ color: card.color, opacity: 0.6 }} />
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: card.textColor, lineHeight: 1 }}>
              {card.value}
            </p>
            <p style={{ fontSize: 12, color: card.textColor, opacity: 0.7, marginTop: 4 }}>
              {card.label}
            </p>
            <p style={{ fontSize: 11, color: card.color, marginTop: 6, fontWeight: 600 }}>
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        {/* Bài tập đang chờ - col 8 */}
        <div
          className="col-span-8 rounded-2xl p-6"
          style={{ background: "#FFFFFF", border: "1px solid #EDE9FE" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#EDE9FE" }}
              >
                <ClipboardList className="w-4 h-4" style={{ color: "#8B5CF6" }} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F1344" }}>
                Bài tập đang chờ
              </h2>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{ background: "#EF4444", color: "#FFFFFF", fontSize: 11, fontWeight: 700 }}
              >
                4
              </span>
            </div>
            <Link
              to="/hoc-sinh/bai-tap"
              className="flex items-center gap-1 transition-all hover:gap-2"
              style={{ fontSize: 13, color: "#8B5CF6", fontWeight: 600 }}
            >
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingAssignments.map((a) => {
              const Icon = a.icon;
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer"
                  style={{ border: "1px solid #F3F4F6", background: "#FAFAFA" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#EDE9FE";
                    (e.currentTarget as HTMLDivElement).style.background = "#F9F7FF";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#F3F4F6";
                    (e.currentTarget as HTMLDivElement).style.background = "#FAFAFA";
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${a.color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: a.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1F1344" }} className="truncate">
                      {a.title}
                    </p>
                    <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                      {a.subject}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-1">
                      {a.urgent ? (
                        <AlertCircle className="w-3.5 h-3.5" style={{ color: "#EF4444" }} />
                      ) : (
                        <Clock className="w-3.5 h-3.5" style={{ color: "#9CA3AF" }} />
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
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        background: a.color,
                        color: "#FFFFFF",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      <Play className="w-3 h-3" />
                      Làm bài
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Radar - col 4 */}
        <div
          className="col-span-4 rounded-2xl p-6"
          style={{ background: "#FFFFFF", border: "1px solid #EDE9FE" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#EDE9FE" }}
            >
              <Target className="w-4 h-4" style={{ color: "#8B5CF6" }} />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F1344" }}>
              Kỹ năng
            </h2>
          </div>
          <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 16 }}>
            Đánh giá năng lực 6 kỹ năng
          </p>
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
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>

          {/* Skill highlights */}
          <div className="space-y-2 mt-2">
            {[
              { skill: "Điểm cao nhất", name: "Grammar", val: 82, color: "#10B981" },
              { skill: "Cần cải thiện", name: "Writing", val: 65, color: "#EF4444" },
            ].map((s) => (
              <div key={s.skill} className="flex items-center justify-between">
                <div>
                  <p style={{ fontSize: 11, color: "#9CA3AF" }}>{s.skill}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#1F1344" }}>{s.name}</p>
                </div>
                <span
                  className="px-2.5 py-1 rounded-lg"
                  style={{
                    background: `${s.color}15`,
                    color: s.color,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {s.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Progress chart - col 7 */}
        <div
          className="col-span-7 rounded-2xl p-6"
          style={{ background: "#FFFFFF", border: "1px solid #EDE9FE" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#EDE9FE" }}
              >
                <TrendingUp className="w-4 h-4" style={{ color: "#8B5CF6" }} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F1344" }}>
                Tiến độ 7 tuần
              </h2>
            </div>
            <span
              className="flex items-center gap-1 px-3 py-1 rounded-full"
              style={{ background: "#D1FAE5", fontSize: 12, color: "#065F46", fontWeight: 600 }}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              +21 điểm
            </span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="studGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 90]} tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid #EDE9FE", fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#8B5CF6"
                strokeWidth={2.5}
                fill="url(#studGrad)"
                dot={{ fill: "#8B5CF6", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right col - Results + Quick Practice - col 5 */}
        <div className="col-span-5 space-y-4">
          {/* Recent results */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "#FFFFFF", border: "1px solid #EDE9FE" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" style={{ color: "#F59E0B" }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1F1344" }}>
                  Kết quả gần đây
                </h3>
              </div>
              <Link
                to="/hoc-sinh/ket-qua"
                style={{ fontSize: 12, color: "#8B5CF6", fontWeight: 600 }}
              >
                Tất cả
              </Link>
            </div>
            <div className="space-y-2.5">
              {recentResults.map((r) => (
                <div key={r.id} className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{r.title}</p>
                    <p style={{ fontSize: 11, color: "#9CA3AF" }}>{r.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-md"
                      style={{
                        background: r.score >= 80 ? "#D1FAE5" : "#EDE9FE",
                        color: r.score >= 80 ? "#065F46" : "#4C1D95",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {r.badge}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#1F1344" }}>
                      {r.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick practice */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", boxShadow: "0 4px 20px rgba(139,92,246,0.3)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-white" />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF" }}>
                Luyện tập nhanh
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickPractice.map((q) => {
                const Icon = q.icon;
                return (
                  <Link
                    key={q.label}
                    to={q.path}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                    }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF" }}>
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
