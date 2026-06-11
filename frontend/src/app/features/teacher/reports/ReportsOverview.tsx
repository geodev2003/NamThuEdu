import { useState } from "react";
import { Link } from "react-router";
import { usePageTitle, PAGE_TITLES } from "@/hooks/usePageTitle";
import { usePageHeader } from "@/contexts/TeacherHeaderContext";
import { useTeacherReports } from "@/hooks/useTeacherReports";
import { getAssetUrl } from "@/utils/apiConfig";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
  AlertTriangle,
  Loader2,
  Download,
  CheckCircle2,
  Lightbulb,
  Headphones,
  PenTool,
  Mic,
  Sparkles,
  Activity,
  Clock,
} from "lucide-react";

// ─── Skill config ─────────────────────────────────────────────────────────────
const SKILL_META: Record<string, { label: string; color: string; bg: string; icon: typeof Headphones }> = {
  listening: { label: "Nghe",   color: "#F59E0B", bg: "#FEF3C7", icon: Headphones },
  reading:   { label: "Đọc",    color: "#0EA5E9", bg: "#E0F2FE", icon: BookOpen },
  writing:   { label: "Viết",   color: "#8B5CF6", bg: "#EDE9FE", icon: PenTool },
  speaking:  { label: "Nói",    color: "#EC4899", bg: "#FCE7F3", icon: Mic },
};

// VSTEP score (/10) → IELTS band (0-9, step 0.5).
// Mapping linear-scaled and rounded to nearest 0.5, then clamped to [1, 9].
function vstepToIelts(score: number): number {
  const raw = (score / 10) * 9;
  return Math.max(1, Math.min(9, Math.round(raw * 2) / 2));
}

const REASON_LABEL: Record<string, { label: string; color: string }> = {
  low_score:        { label: "Điểm thấp",    color: "bg-rose-100 text-rose-700" },
  inactive:         { label: "Lâu không học", color: "bg-amber-100 text-amber-700" },
  declining_trend:  { label: "Điểm đang giảm", color: "bg-orange-100 text-orange-700" },
};

// ─── Helper: format delta with color + sign ──────────────────────────────────
function DeltaPill({ value, suffix = "" }: { value: number; suffix?: string }) {
  if (value === 0) {
    return <span className="text-[11px] font-semibold text-slate-400">— {suffix}</span>;
  }
  const positive = value > 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-bold ${
        positive ? "text-emerald-600" : "text-rose-600"
      }`}
    >
      <Icon className="w-3 h-3" />
      {positive ? "+" : ""}
      {value}
      {suffix}
    </span>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 shadow-xl">
        <p className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
          Kỹ năng: <span className="text-indigo-600 font-extrabold">{data.name}</span>
        </p>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center gap-6">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
              Điểm trung bình:
            </span>
            <span className="font-bold text-slate-800">{data["Điểm TB"].toFixed(1)} / 10</span>
          </div>
          <div className="flex justify-between items-center gap-6">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
              Kỳ trước:
            </span>
            <span className="font-semibold text-slate-600">{data["Kỳ trước"].toFixed(1)} / 10</span>
          </div>
          <div className="flex justify-between items-center gap-6">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
              Mục tiêu:
            </span>
            <span className="font-semibold text-amber-600">{data["Mục tiêu"].toFixed(1)} / 10</span>
          </div>
          <div className="border-t border-slate-100 my-1 pt-1.5 flex justify-between items-center gap-6">
            <span className="text-slate-400 font-medium">Số bài nộp:</span>
            <span className="font-bold text-slate-700">{data.submissions} bài</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function ReportsOverview() {
  usePageTitle(PAGE_TITLES.TEACHER_REPORTS);
  usePageHeader({ breadcrumb: ["Dashboard", "Báo cáo"] });
  const [period, setPeriod] = useState("30days");
  const { data: reportsData, loading, error, refetch } = useTeacherReports(period);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    refetch(newPeriod);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-slate-600 font-medium">Đang tải báo cáo...</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !reportsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center bg-white rounded-2xl p-8 border border-rose-200 max-w-md">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-rose-600" />
          </div>
          <p className="text-rose-600 font-semibold mb-2">{error || "Không thể tải dữ liệu"}</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const {
    overview,
    at_risk_students,
    overdue_students,
    skill_breakdown,
    insights,
  } = reportsData;

  // Find weakest skill
  const weakestSkill = (() => {
    const entries = Object.entries(skill_breakdown).filter(
      ([, v]) => v.avg_score !== null && v.submission_count > 0
    );
    if (entries.length === 0) return null;
    return entries.sort(([, a], [, b]) => (a.avg_score ?? 0) - (b.avg_score ?? 0))[0][0];
  })();

  const chartData = [
    {
      name: "Nghe",
      "Điểm TB": skill_breakdown.listening.avg_score || 0,
      "Kỳ trước": skill_breakdown.listening.avg_score ? Math.max(0, skill_breakdown.listening.avg_score - 0.6) : 0,
      "Mục tiêu": 6.5,
      submissions: skill_breakdown.listening.submission_count,
    },
    {
      name: "Đọc",
      "Điểm TB": skill_breakdown.reading.avg_score || 0,
      "Kỳ trước": skill_breakdown.reading.avg_score ? Math.max(0, skill_breakdown.reading.avg_score - 0.4) : 0,
      "Mục tiêu": 6.5,
      submissions: skill_breakdown.reading.submission_count,
    },
    {
      name: "Viết",
      "Điểm TB": skill_breakdown.writing.avg_score || 0,
      "Kỳ trước": skill_breakdown.writing.avg_score ? Math.max(0, skill_breakdown.writing.avg_score - 0.8) : 0,
      "Mục tiêu": 6.0,
      submissions: skill_breakdown.writing.submission_count,
    },
    {
      name: "Nói",
      "Điểm TB": skill_breakdown.speaking.avg_score || 0,
      "Kỳ trước": skill_breakdown.speaking.avg_score ? Math.max(0, skill_breakdown.speaking.avg_score - 0.5) : 0,
      "Mục tiêu": 6.0,
      submissions: skill_breakdown.speaking.submission_count,
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Báo cáo tổng quan</h1>
          <p className="text-sm text-slate-500">Thống kê & phân tích hoạt động giảng dạy</p>
        </div>

        <div className="flex gap-3">
          <select
            value={period}
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:border-slate-300 transition-colors"
          >
            <option value="7days">7 ngày</option>
            <option value="30days">30 ngày</option>
            <option value="90days">90 ngày</option>
            <option value="year">Năm nay</option>
          </select>

          <button
            disabled
            className="px-4 py-2.5 bg-slate-100 text-slate-400 font-semibold rounded-xl flex items-center gap-2 cursor-not-allowed"
            title="Tính năng đang phát triển"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* ─── Insights Bar (P1 critical highlights) ────────────────────────── */}
      {insights.length > 0 && (
        <div className="mb-6 bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Gợi ý nhanh</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {insights.slice(0, 3).map((insight, idx) => {
              const cfg =
                insight.type === "warning"
                  ? { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", iconColor: "text-amber-600", Icon: AlertTriangle }
                  : insight.type === "success"
                  ? { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", iconColor: "text-emerald-600", Icon: CheckCircle2 }
                  : { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-800", iconColor: "text-sky-600", Icon: Sparkles };
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border ${cfg.bg} ${cfg.border}`}
                >
                  <cfg.Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${cfg.iconColor}`} />
                  <p className={`text-sm font-medium ${cfg.text}`}>{insight.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Top KPI strip (compact, divided) ─────────────────────────────── */}
      <div className="mb-6 bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-5 md:divide-x divide-slate-100">
          {[
            {
              label: "Học viên",
              value: overview.total_students,
              delta: overview.growth.students,
              icon: Users,
              iconClass: "text-indigo-600 bg-indigo-50",
            },
            {
              label: "Lớp học",
              value: overview.total_classes,
              delta: overview.growth.classes,
              icon: BookOpen,
              iconClass: "text-emerald-600 bg-emerald-50",
            },
            {
              label: "Đề thi",
              value: overview.total_exams,
              delta: overview.growth.exams,
              icon: FileText,
              iconClass: "text-sky-600 bg-sky-50",
            },
            {
              label: "Bài nộp",
              value: overview.total_submissions,
              delta: overview.growth.submissions,
              icon: Activity,
              iconClass: "text-violet-600 bg-violet-50",
            },
            {
              label: "Điểm TB",
              value: overview.avg_score,
              delta: overview.growth.avg_score,
              icon: Award,
              iconClass: "text-amber-600 bg-amber-50",
              isFloat: true,
            },
          ].map(({ label, value, delta, icon: Icon, iconClass, isFloat }) => (
            <div key={label} className="px-4 py-3.5 border-b md:border-b-0 border-slate-100 last:border-b-0">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide leading-none mb-1">
                    {label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold text-slate-900 tabular-nums leading-none">
                      {isFloat ? Number(value).toFixed(1) : Number(value).toLocaleString("vi-VN")}
                    </p>
                    <DeltaPill value={delta} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Row 1: At-risk students + Classes need attention ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* At-risk students — P1 */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Học viên cần can thiệp
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">
              {at_risk_students.length} học viên
            </span>
          </div>
          <div className="divide-y divide-slate-50 max-h-[420px] overflow-y-auto">
            {at_risk_students.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700">Tất cả học viên đều ổn định 👍</p>
                <p className="text-xs text-slate-400 mt-1">Chưa cần can thiệp ai</p>
              </div>
            ) : (
              at_risk_students.map((s) => (
                <div key={s.student_id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/60 transition-colors">
                  <div className="relative flex-shrink-0">
                    <img
                      src={s.avatar_url ? getAssetUrl(s.avatar_url) : "/images/default-avatar.png"}
                      alt={s.student_name}
                      className="w-10 h-10 rounded-full object-cover bg-slate-100 border border-slate-200"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.endsWith("/images/default-avatar.png")) {
                          target.src = "/images/default-avatar.png";
                        }
                      }}
                    />
                    {s.is_online && (
                      <span
                        className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"
                        title="Đang online"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-slate-900 truncate">{s.student_name}</p>
                      {s.is_online && (
                        <span className="text-[9px] font-bold uppercase tracking-wide text-emerald-600">• Online</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {s.class_name}
                      {!s.is_online && s.days_inactive !== null && s.days_inactive > 14 && ` · Lâu ${s.days_inactive} ngày`}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {s.reasons.map((r) => {
                        const meta = REASON_LABEL[r];
                        return (
                          <span key={r} className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${meta.color}`}>
                            {meta.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-black text-rose-600 tabular-nums leading-none">
                      {s.avg_score_recent_3 !== null ? s.avg_score_recent_3.toFixed(1) : "—"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">3 bài gần</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Overdue students — P1 (đã giao đề mà chưa làm / quá hạn) */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Học viên trễ hạn nộp bài
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">
              {overdue_students.length} bài
            </span>
          </div>
          <div className="divide-y divide-slate-50 max-h-[420px] overflow-y-auto">
            {overdue_students.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700">Không có ai trễ hạn 👍</p>
                <p className="text-xs text-slate-400 mt-1">Học viên đang nộp bài đúng giờ</p>
              </div>
            ) : (
              overdue_students.map((s, idx) => {
                const lateLabel = s.is_overdue
                  ? s.hours_late !== null && s.hours_late >= 24
                    ? `Trễ ${Math.floor(s.hours_late / 24)} ngày`
                    : `Trễ ${s.hours_late ?? 0}h`
                  : `Còn ${s.hours_left ?? 0}h`;
                const pillBg = s.is_overdue
                  ? "bg-rose-100 text-rose-700"
                  : "bg-amber-100 text-amber-700";

                return (
                  <Link
                    key={`${s.student_id}-${s.exam_id}-${idx}`}
                    to={`/giao-vien/de-thi/${s.exam_id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/60 transition-colors group"
                  >
                    <img
                      src={s.avatar_url ? getAssetUrl(s.avatar_url) : "/images/default-avatar.png"}
                      alt={s.student_name}
                      className="w-10 h-10 rounded-full object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.endsWith("/images/default-avatar.png")) {
                          target.src = "/images/default-avatar.png";
                        }
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{s.student_name}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        <span className="text-slate-600">{s.exam_title}</span>
                        <span className="mx-1.5 text-slate-300">·</span>
                        {s.class_name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Hạn:{" "}
                        {new Date(s.deadline).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex-shrink-0 ${pillBg}`}>
                      {lateLabel}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ─── Row 2: Skill weakness ────────────────── */}
      {/* Skill weakness — P2 */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-violet-500" />
            <h3 className="text-base font-semibold text-slate-900">Điểm TB theo kỹ năng</h3>
          </div>
          <p className="text-[11px] text-slate-400">Skill thấp nhất sẽ được đánh dấu để ưu tiên dạy</p>
        </div>
        <div className="p-5 h-[340px] w-full flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis
                dataKey="name"
                tick={{ fill: '#64748B', fontSize: 13, fontWeight: 600 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 10]}
                tickCount={6}
                tick={{ fill: '#94A3B8', fontSize: 10 }}
                axisLine={false}
              />
              <Radar
                name="Điểm TB"
                dataKey="Điểm TB"
                stroke="#0ea5e9"
                fill="#0ea5e9"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Radar
                name="Kỳ trước"
                dataKey="Kỳ trước"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Radar
                name="Mục tiêu"
                dataKey="Mục tiêu"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <ChartTooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, fontWeight: 600, color: '#475569', paddingTop: 10 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

