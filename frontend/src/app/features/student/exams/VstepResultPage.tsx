import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  Home,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Bot,
  RefreshCw,
} from "lucide-react";
import { studentApi } from "../../../../services/studentApi";

const STUDENT_BASE = "/hoc-vien";

// ── Skill config ─────────────────────────────────────────────────────────────
const SKILLS = [
  { key: "listening", label: "Listening",  Icon: Headphones, color: "#F97316", bg: "#FFF7ED", border: "#FED7AA", dark: "#C2410C" },
  { key: "reading",   label: "Reading",    Icon: BookOpen,   color: "#0EA5E9", bg: "#E0F2FE", border: "#7DD3FC", dark: "#0369A1" },
  { key: "writing",   label: "Writing",    Icon: PenLine,    color: "#10B981", bg: "#D1FAE5", border: "#6EE7B7", dark: "#047857" },
  { key: "speaking",  label: "Speaking",   Icon: Mic,        color: "#7C3AED", bg: "#EDE9FE", border: "#C4B5FD", dark: "#5B21B6" },
];

// ── Radial gauge (0-10) ───────────────────────────────────────────────────────
function RadialGauge({ score, color, size = 100 }: { score: number | null; color: string; size?: number }) {
  const r = size * 0.38;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const pct = score !== null ? Math.min(score / 10, 1) : 0;
  const offset = circumference - pct * circumference;

  if (score === null) {
    return (
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: size, height: size, background: "#F3F4F6", flexShrink: 0 }}
      >
        <div className="text-center">
          <Clock className="w-6 h-6 text-slate-300 mx-auto mb-0.5" />
          <span style={{ fontSize: 10, color: "#9CA3AF" }}>Pending</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth={size * 0.09} />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={size * 0.09}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ fontSize: size * 0.24, fontWeight: 900, color, lineHeight: 1 }}>
          {score.toFixed(1)}
        </span>
        <span style={{ fontSize: size * 0.1, color: "#9CA3AF" }}>/10</span>
      </div>
    </div>
  );
}

// ── Band scale bar ────────────────────────────────────────────────────────────
function BandScaleBar({ avg }: { avg: number | null }) {
  const pct = avg !== null ? (avg / 10) * 100 : null;

  return (
    <div className="w-full mt-4">
      <div className="relative h-4 rounded-full overflow-hidden" style={{ background: "linear-gradient(90deg, #EF4444 0%, #F59E0B 40%, #10B981 60%, #0EA5E9 75%, #7C3AED 100%)" }}>
        {pct !== null && (
          <div
            className="absolute top-0 bottom-0 flex items-center"
            style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
          >
            <div className="w-4 h-4 rounded-full border-2 border-white shadow-md bg-white" />
          </div>
        )}
      </div>
      <div className="flex justify-between mt-1.5">
        <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>0</span>
        <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>10</span>
      </div>
      <div className="flex justify-between -mt-0.5 mb-1">
        {[0, 2.5, 5, 7.5, 10].map((v) => (
          <span key={v} style={{ fontSize: 10, color: "#9CA3AF" }}>{v}</span>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function VstepResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const submissionId = Number(id);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const [gradingDoneToast, setGradingDoneToast] = useState(false);
  const [countdown, setCountdown] = useState(8);
  const prevGradingRef = useRef<boolean | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vstep-submission", submissionId],
    queryFn: () => studentApi.getSubmissionDetail(submissionId),
    enabled: !!submissionId,
    retry: 2,
  });

  const raw = (data as any)?.data?.data ?? (data as any)?.data;
  const vstepMeta = raw?.vstep_meta ?? null;
  const submissionStatus = raw?.sStatus ?? "graded";
  const isGradingSubjective = submissionStatus === "grading_subjective";

  // Poll grading status every 8 s while W+S are still being graded
  const { data: statusPoll } = useQuery({
    queryKey: ["vstep-grading-status", submissionId],
    queryFn: () => studentApi.getGradingStatus(submissionId),
    enabled: !!submissionId && isGradingSubjective,
    refetchInterval: isGradingSubjective ? 8000 : false,
    retry: 1,
  });

  // Countdown 8→0 while grading_subjective
  useEffect(() => {
    if (!isGradingSubjective) { setCountdown(8); return; }
    const t = setInterval(() => setCountdown((c) => (c > 1 ? c - 1 : 8)), 1000);
    return () => clearInterval(t);
  }, [isGradingSubjective]);

  // Detect when grading flips from pending → done → show toast
  const polledStatus = (statusPoll as any)?.data?.data?.sStatus ?? null;
  useEffect(() => {
    if (prevGradingRef.current === true && polledStatus === "graded") {
      setGradingDoneToast(true);
      queryClient.invalidateQueries({ queryKey: ["vstep-submission", submissionId] });
      setTimeout(() => setGradingDoneToast(false), 5000);
    }
    if (polledStatus !== null) prevGradingRef.current = polledStatus === "grading_subjective";
  }, [polledStatus, submissionId, queryClient]);
  const examTitle  = raw?.exam?.eTitle ?? "VSTEP Exam";
  const submitTime = raw?.sSubmit_time ? new Date(raw.sSubmit_time) : null;

  // Merge polled scores on top of initial scores (live updates while grading_subjective)
  const polledScores = (statusPoll as any)?.data?.data?.vstep_scores ?? null;
  const baseScores   = vstepMeta?.vstep_scores ?? {};
  const scores       = polledScores ? { ...baseScores, ...polledScores } : baseScores;

  const available = Object.values(scores).filter((v) => typeof v === "number" && !isNaN(v as number)) as number[];
  const overallAvg = available.length > 0 ? +(available.reduce((a, b) => a + b, 0) / available.length).toFixed(2) : (vstepMeta?.overall_avg ?? null);

  const skillStats    = vstepMeta?.skill_stats ?? {};
  const pendingSkills = (["writing", "speaking"] as const).filter((s) => scores[s] === null || scores[s] === undefined);

  // Answers for MCQ review (sorted by question number)
  const answers = (raw?.answers ?? []) as any[];
  const listeningAnswers = answers.filter(
    (a) => (a.question?.qSection ?? "").toLowerCase() === "listening"
  ).sort((a, b) => (a.question?.qNumber ?? 0) - (b.question?.qNumber ?? 0));
  const readingAnswers = answers.filter(
    (a) => (a.question?.qSection ?? "").toLowerCase() === "reading"
  ).sort((a, b) => (a.question?.qNumber ?? 0) - (b.question?.qNumber ?? 0));

  // Build qId → correct answer letter from exam.questions.answers (fully loaded)
  const examQMap = useMemo(() => {
    const map: Record<number, string> = {};
    const LETTERS = ["A", "B", "C", "D"];
    for (const q of (raw?.exam?.questions ?? [])) {
      const correct = (q.answers ?? []).find((a: any) => a.aIs_correct);
      if (correct) {
        const order = correct.aOrder ?? (q.answers ?? []).indexOf(correct);
        map[q.qId] = LETTERS[order] ?? correct.aContent ?? "?";
      }
    }
    return map;
  }, [raw]);

  // ── Loading / error ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
      </div>
    );
  }

  if (isError || !raw) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-slate-600 font-medium mb-4">Không tìm thấy kết quả bài thi.</p>
          <button
            onClick={() => navigate(`${STUDENT_BASE}/de-thi`)}
            className="px-5 py-2 bg-sky-500 text-white rounded-xl font-bold text-sm hover:bg-sky-600 transition"
          >
            Về trang đề thi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-5">
      {/* ── Back ────────────────────────────────────────────────────────────── */}
      <button
        onClick={() => navigate(`${STUDENT_BASE}/de-thi`)}
        className="flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700 hover:underline transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Về trang đề thi
      </button>

      {/* ── Header Hero ─────────────────────────────────────────────────────── */}
      <div
        className="rounded-3xl p-6 text-center"
        style={{ background: "white", border: "1.5px solid #F0EEFF", boxShadow: "0 8px 32px rgba(124,58,237,0.10)" }}
      >
        <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">Kết quả bài thi VSTEP</p>
        <h1 className="text-xl font-extrabold text-slate-800 mb-1">{examTitle}</h1>
        {submitTime && (
          <p className="text-xs text-slate-400 mb-5">
            Nộp lúc {submitTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
            {" "}ngày {submitTime.toLocaleDateString("vi-VN")}
          </p>
        )}

        {/* Average score */}
        {!isGradingSubjective && overallAvg !== null ? (
          <div className="mb-4">
            <p className="text-sm text-slate-500 font-medium mb-1">
              Điểm trung bình
            </p>
            <p className="text-3xl font-black text-slate-800 tabular-nums">
              {overallAvg.toFixed(2)}<span className="text-base font-medium text-slate-400">/10</span>
            </p>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-base bg-slate-100 text-slate-500 mb-4">
            <Clock className="w-5 h-5" />
            {isGradingSubjective ? "Chờ kết quả Writing & Speaking…" : "Đang tính điểm tổng…"}
          </div>
        )}

        {/* Band scale bar — hide pointer while grading_subjective */}
        <BandScaleBar avg={isGradingSubjective ? null : overallAvg} />

        {pendingSkills.length > 0 && (
          <div
            className="mt-4 rounded-2xl px-4 py-3 flex items-start gap-3"
            style={{ background: "linear-gradient(135deg,#EDE9FE,#DBEAFE)", border: "1.5px solid #C4B5FD" }}
          >
            <div className="flex-shrink-0 mt-0.5">
              <Bot className="w-5 h-5" style={{ color: "#7C3AED" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold" style={{ color: "#5B21B6" }}>
                AI đang chấm {pendingSkills.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" & ")}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#6D28D9" }}>
                Kết quả sẽ tự động cập nhật. Không cần tải lại trang.
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-1.5" style={{ color: "#7C3AED" }}>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "2s" }} />
              <span className="text-xs font-bold tabular-nums">{countdown}s</span>
            </div>
          </div>
        )}
      </div>

      {/* ── 4 Skill Score Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {SKILLS.map(({ key, label, Icon, color, bg, border, dark }) => {
          const score   = scores[key] ?? null;
          const stats   = skillStats[key] ?? null;
          const isPending = score === null;
          const isSubjective = key === "writing" || key === "speaking";
          const submitted =
            key === "writing" ? vstepMeta?.writing_submitted :
            key === "speaking" ? vstepMeta?.speaking_submitted : false;

          return (
            <div
              key={key}
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: bg, border: `1.5px solid ${border}` }}
            >
              {/* Skill header */}
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: color }}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm" style={{ color: dark }}>{label}</span>
              </div>

              {/* Gauge */}
              <div className="flex justify-center">
                <RadialGauge score={score} color={color} size={90} />
              </div>

              {/* Sub-stats */}
              {!isSubjective && stats ? (
                <div className="text-center">
                  <span className="text-xs font-bold" style={{ color: dark }}>
                    {stats.correct}/{stats.total}
                  </span>
                  <span className="text-xs text-slate-500"> câu đúng</span>
                </div>
              ) : isPending && isSubjective ? (
                <div className="text-center">
                  {submitted ? (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
                      style={{ background: color + "22", color: dark }}
                    >
                      <Loader2 className="w-3 h-3 animate-spin" />
                      AI đang chấm...
                    </span>
                  ) : (
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold"
                      style={{ background: "#F3F4F6", color: "#9CA3AF" }}
                    >
                      Chưa có bài nộp
                    </span>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* ── Toast: grading done ──────────────────────────────────────────────── */}
      {gradingDoneToast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-bold"
          style={{ background: "linear-gradient(135deg,#059669,#10B981)", minWidth: 260 }}
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          Writing & Speaking đã được chấm xong!
        </div>
      )}

      {/* ── Grading Status Timeline ──────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-5 bg-white"
        style={{ border: "1.5px solid #F0EEFF" }}
      >
        <p className="text-sm font-bold text-slate-700 mb-4">Trạng thái chấm bài</p>
        <div className="space-y-3">
          {[
            {
              done: true,
              label: "Nộp bài thành công",
              sub: submitTime
                ? `${submitTime.toLocaleDateString("vi-VN")} · ${submitTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`
                : undefined,
            },
            {
              done: true,
              label: "Chấm Listening & Reading",
              sub: `${(skillStats.listening?.correct ?? 0) + (skillStats.reading?.correct ?? 0)} câu đúng / ${(skillStats.listening?.total ?? 0) + (skillStats.reading?.total ?? 0)} câu`,
            },
            {
              done: !pendingSkills.includes("writing"),
              label: "Chấm Writing (AI)",
              sub: pendingSkills.includes("writing")
                ? (vstepMeta?.writing_submitted ? "Bài viết đã nộp · AI đang chấm..." : "Chưa có bài nộp")
                : `Điểm: ${scores.writing?.toFixed(1)}/10`,
            },
            {
              done: !pendingSkills.includes("speaking"),
              label: "Chấm Speaking (AI)",
              sub: pendingSkills.includes("speaking")
                ? (vstepMeta?.speaking_submitted ? "Audio đã upload · AI đang chấm..." : "Chưa có audio")
                : `Điểm: ${scores.speaking?.toFixed(1)}/10`,
            },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {step.done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${step.done ? "text-slate-800" : "text-amber-600"}`}>
                  {step.label}
                </p>
                {step.sub && <p className="text-xs text-slate-400 mt-0.5">{step.sub}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MCQ Answer Review (collapsible per skill) ────────────────────────── */}
      {[
        { key: "listening", label: "Listening", cfg: SKILLS[0], rows: listeningAnswers },
        { key: "reading",   label: "Reading",   cfg: SKILLS[1], rows: readingAnswers },
      ].map(({ key, label, cfg, rows }) => {
        if (rows.length === 0) return null;
        const isOpen = expandedSkill === key;
        const correct = rows.filter((r) => r.saIs_correct).length;

        return (
          <div
            key={key}
            className="rounded-2xl overflow-hidden"
            style={{ border: `1.5px solid ${cfg.border}` }}
          >
            <button
              className="w-full flex items-center justify-between px-5 py-3.5 text-left"
              style={{ background: cfg.bg }}
              onClick={() => setExpandedSkill(isOpen ? null : key)}
            >
              <div className="flex items-center gap-2">
                <cfg.Icon className="w-4 h-4" style={{ color: cfg.color }} />
                <span className="font-bold text-sm" style={{ color: cfg.dark }}>
                  {label} — Chi tiết đáp án
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: cfg.color + "20", color: cfg.dark }}
                >
                  {correct}/{rows.length}
                </span>
              </div>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {isOpen && (
              <div className="bg-white divide-y divide-slate-100">
                {rows.map((ans, idx) => {
                  const qText = ans.question?.qContent?.replace(/<[^>]*>/g, "").slice(0, 80) ?? `Câu ${idx + 1}`;
                  const correctAns = examQMap[ans.question?.qId] ?? "—";
                  return (
                    <div key={ans.saId ?? idx} className="flex items-start gap-3 px-5 py-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {ans.saIs_correct ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-600 truncate">{qText}</p>
                        <div className="flex gap-3 mt-1 text-xs">
                          <span>
                            Bạn chọn:{" "}
                            <span
                              className="font-bold"
                              style={{ color: ans.saIs_correct ? "#10B981" : "#EF4444" }}
                            >
                              {ans.saAnswer_text ?? "—"}
                            </span>
                          </span>
                          {!ans.saIs_correct && (
                            <span>
                              Đáp án:{" "}
                              <span className="font-bold text-emerald-600">{correctAns}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 pb-4">
        {raw?.exam_id && (
          <Link
            to={`${STUDENT_BASE}/lam-bai-vstep/${raw.exam_id}?review=${submissionId}`}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #0EA5E9, #10B981)", color: "#fff" }}
          >
            <Eye className="w-4 h-4" />
            Xem lại bài thi (đúng / sai từng câu)
          </Link>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to={`${STUDENT_BASE}/dap-an/${submissionId}`}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7C3AED, #0EA5E9)", color: "#fff" }}
          >
            <Eye className="w-4 h-4" />
            Xem đáp án đầy đủ
          </Link>
          <button
            onClick={() => navigate(`${STUDENT_BASE}/de-thi`)}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            <Home className="w-4 h-4" />
            Về trang đề thi
          </button>
        </div>
      </div>
    </div>
  );
}
