import { useParams, useNavigate, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  RotateCcw,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowLeft,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  User,
  Calendar,
  Award,
} from "lucide-react";
import { studentApi } from "../../../../services/studentApi";
import { usePageTitle } from "../../../../hooks/usePageTitle";

const PRIMARY = "#0ea5e9"; // Sky Blue
const STUDENT_BASE_PATH = "/hoc-vien";

// ─── Score Circle ─────────────────────────────────────────────────────────────
function ScoreCircle({ score: rawScore, maxScore: rawMaxScore = 100 }: { score: number | string; maxScore?: number | string }) {
  const score = typeof rawScore === "number" ? rawScore : parseFloat(rawScore) || 0;
  const maxScore = typeof rawMaxScore === "number" ? rawMaxScore : parseFloat(rawMaxScore) || 100;
  const circumference = 2 * Math.PI * 54;
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const offset = circumference - (percentage / 100) * circumference;
  
  // Clean color: Slate for low scores, Sky Blue for pass/medium, Emerald for high scores
  const color = percentage >= 80 ? "#10B981" : percentage >= 50 ? PRIMARY : "#EF4444";

  // Always display scaled to 10-point system to match the teacher's grading page
  const displayScore = maxScore > 0 ? (score / maxScore) * 10 : 0;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#F1F5F9" strokeWidth="6" />
        <circle
          cx="60" cy="60" r="54" fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>
          {displayScore.toFixed(2)}
        </span>
        <span style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
          / 10
        </span>
      </div>
    </div>
  );
}

function getGrade(score: number, maxScore: number = 100) {
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  if (percentage >= 80) return { label: "Xuất sắc", color: "#047857", bg: "#D1FAE5", border: "#A7F3D0" };
  if (percentage >= 50) return { label: "Đạt", color: "#1E3A8A", bg: "#DBEAFE", border: "#BFDBFE" };
  return { label: "Chưa đạt", color: "#991B1B", bg: "#FEE2E2", border: "#FCA5A5" };
}

export function ResultDetail({ modalSubmissionId }: { modalSubmissionId?: number }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const submissionId = modalSubmissionId ?? Number(id);

  usePageTitle("Kết quả làm bài");

  const { data, isLoading } = useQuery({
    queryKey: ["submission", submissionId],
    queryFn: () => studentApi.getSubmissionDetail(submissionId),
    enabled: !!submissionId,
  });

  const submission = (data as any)?.data?.data ?? (data as any)?.data;
  const vstepMeta = submission?.vstep_meta;
  const isVstep = vstepMeta?.is_vstep;
  const vstepScores = vstepMeta?.vstep_scores || {};

  const scoreRaw = isVstep ? (vstepMeta?.overall_avg ?? 0) : (submission?.sScore ?? 0);
  const score = typeof scoreRaw === "number" ? scoreRaw : parseFloat(scoreRaw) || 0;
  const maxScore = isVstep ? 10 : (typeof submission?.exam?.eMax_score === "number" ? submission.exam.eMax_score : parseFloat(submission?.exam?.eMax_score) || 100);

  const vstepBand = vstepMeta?.vstep_band;
  let grade = getGrade(score, maxScore);
  if (isVstep) {
    if (vstepBand === 'C1') {
      grade = { label: "Bậc 5 (C1)", color: "#047857", bg: "#D1FAE5", border: "#A7F3D0" };
    } else if (vstepBand === 'B2') {
      grade = { label: "Bậc 4 (B2)", color: "#1E3A8A", bg: "#DBEAFE", border: "#BFDBFE" };
    } else if (vstepBand === 'B1') {
      grade = { label: "Bậc 3 (B1)", color: "#B45309", bg: "#FEF3C7", border: "#FDE68A" };
    } else if (vstepBand) {
      grade = { label: `Bậc 2 (${vstepBand})`, color: "#991B1B", bg: "#FEE2E2", border: "#FCA5A5" };
    } else {
      grade = { label: "Chờ chấm", color: "#64748B", bg: "#F1F5F9", border: "#E2E8F0" };
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 rounded-full animate-spin"
          style={{ borderColor: "#F5F3FF", borderTopColor: PRIMARY }} />
      </div>
    );
  }

  const answeredCorrect = submission?.answers?.filter((a: any) => a.saIs_correct)?.length ?? 0;
  const totalAnswered = submission?.answers?.length ?? 0;
  const totalQuestions = submission?.exam?.questions?.length ?? totalAnswered;
  const assignmentId = submission?.assignment_id;

  // Dynamically group sections from questions and answers
  const sections: Record<string, { correct: number; total: number; pointsEarned: number; pointsTotal: number }> = {};
  
  submission?.exam?.questions?.forEach((q: any) => {
    const secName = q.qSection || q.qSkill || "Khác";
    const normalizedName = secName.charAt(0).toUpperCase() + secName.slice(1);
    if (!sections[normalizedName]) {
      sections[normalizedName] = { correct: 0, total: 0, pointsEarned: 0, pointsTotal: 0 };
    }
    sections[normalizedName].total++;
    sections[normalizedName].pointsTotal += Number(q.qPoints) || 0;
  });

  submission?.answers?.forEach((ans: any) => {
    const q = ans.question;
    if (q) {
      const secName = q.qSection || q.qSkill || "Khác";
      const normalizedName = secName.charAt(0).toUpperCase() + secName.slice(1);
      if (!sections[normalizedName]) {
        sections[normalizedName] = { correct: 0, total: 0, pointsEarned: 0, pointsTotal: 0 };
      }
      if (ans.saIs_correct) {
        sections[normalizedName].correct++;
      }
      sections[normalizedName].pointsEarned += Number(ans.saPoints_awarded) || 0;
    }
  });

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "";
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) return timeStr;
      return date.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="py-2 max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Back Button */}
      {!modalSubmissionId && (
        <button onClick={() => navigate(`${STUDENT_BASE_PATH}/bai-tap`)}
          className="flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-85 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="w-4 h-4" /> Về danh sách bài tập
        </button>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Score Card */}
        <div className="bg-slate-50/30 backdrop-blur-sm rounded-3xl p-6 flex flex-col items-center justify-center space-y-6 border border-slate-100"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
          <div className="text-center">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Điểm số tổng quan</h2>
          </div>
          
          <ScoreCircle score={score} maxScore={maxScore} />
          
          <div className="text-center">
            <span className="px-4 py-1.5 rounded-full text-xs font-black border tracking-wider shadow-sm transition-all hover:scale-105"
              style={{ background: grade.bg, color: grade.color, borderColor: grade.border }}>
              {grade.label}
            </span>
          </div>

          {/* Accuracy */}
          <div className="w-full pt-5 border-t border-slate-100/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-bold">Độ chính xác</span>
              <span className="text-xs font-black text-slate-800">
                {totalQuestions > 0 ? Math.round((answeredCorrect / totalQuestions) * 100) : 0}%
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${totalQuestions > 0 ? (answeredCorrect / totalQuestions) * 100 : 0}%`,
                  background: `linear-gradient(90deg, ${PRIMARY}, #0284c7)`,
                }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-right font-medium">
              Đúng {answeredCorrect}/{totalQuestions} câu
            </p>
          </div>
        </div>

        {/* Right Column: Details & Stats & Actions */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 flex flex-col justify-between border border-slate-100"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
          
          {/* Header Info */}
          <div className="space-y-2.5">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase"
                style={{
                  backgroundColor: submission?.exam?.eType === "VSTEP" ? "#e0e7ff" : "#f1f5f9",
                  color: submission?.exam?.eType === "VSTEP" ? "#4f46e5" : "#475569"
                }}>
                {submission?.exam?.eType ?? "BÀI THI"}
              </span>
            </div>
            <h1 className="font-black text-slate-900 leading-snug tracking-tight" style={{ fontSize: 22 }}>
              {submission?.exam?.eTitle ?? "Bài thi"}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs text-slate-400 font-bold">
              {submission?.sSubmit_time && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-350" />
                  Nộp lúc {formatTime(submission?.sSubmit_time)}
                </span>
              )}
              {submission?.exam?.teacher?.uName && (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  Giảng viên chấm: <span className="text-slate-600 font-black">{submission.exam.teacher.uName}</span>
                </span>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 my-6">
            {[
              { icon: CheckCircle, label: "Số câu đúng", value: `${answeredCorrect}/${totalQuestions}`, color: "#10b981", bg: "#ecfdf5", border: "#d1fae5" },
              { icon: Clock, label: "Trạng thái", value: submission?.sStatus === "graded" ? "Đã chấm" : "Đã nộp", color: "#3b82f6", bg: "#eff6ff", border: "#dbeafe" },
              { icon: TrendingUp, label: "Lần làm bài", value: `Lần thứ ${submission?.sAttempt ?? 1}`, color: "#8b5cf6", bg: "#f5f3ff", border: "#ede9fe" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-4 border flex flex-col justify-between min-h-[105px] transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ background: "#ffffff", borderColor: "#f1f5f9" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-slate-850 font-black text-sm md:text-base mt-2">{s.value}</p>
                  <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
            <Link to={`${STUDENT_BASE_PATH}/dap-an/${submissionId}`}
              onClick={() => window.dispatchEvent(new Event("close-result-modal"))}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all shadow-md shadow-sky-500/10 hover:shadow-lg hover:shadow-sky-500/20 active:scale-[0.99]"
              style={{ background: `linear-gradient(135deg, ${PRIMARY}, #0284c7)`, fontSize: 14 }}>
              <Eye className="w-4.5 h-4.5" /> Xem đáp án chi tiết
            </Link>
            {assignmentId && (
              <Link to={`${STUDENT_BASE_PATH}/lam-bai/${assignmentId}`}
                onClick={() => window.dispatchEvent(new Event("close-result-modal"))}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold border border-slate-200/80 bg-white text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-350 active:scale-[0.99]"
                style={{ fontSize: 14 }}>
                <RotateCcw className="w-4.5 h-4.5" /> Làm lại bài thi
              </Link>
            )}
          </div>

        </div>

      </div>

      {/* Detailed Information & Part/Skill Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* General Details Card */}
        <div className="bg-white rounded-3xl p-6 space-y-4 border border-slate-100"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Thông tin chi tiết</h3>
          </div>
          <div className="space-y-3">
            {[
              { icon: User, label: "Học viên", value: submission?.user?.uName ?? "Chưa cập nhật" },
              { icon: Award, label: "Giảng viên chấm", value: submission?.exam?.teacher?.uName ?? "Hệ thống tự động" },
              { icon: Clock, label: "Ngày làm bài", value: submission?.sSubmit_time ? formatTime(submission?.sSubmit_time) : "—" },
              { icon: Calendar, label: "Ngày chấm", value: submission?.sGraded_time || submission?.teacher_reviewed_at ? formatTime(submission?.sGraded_time || submission?.teacher_reviewed_at) : "Chưa chấm điểm" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-50/60 text-xs">
                  <div className="flex items-center gap-2 text-slate-400 font-bold">
                    <Icon className="w-3.5 h-3.5 text-slate-350 flex-shrink-0" />
                    <span>{item.label}:</span>
                  </div>
                  <span className="text-slate-700 font-bold text-right truncate max-w-[160px]" title={item.value}>
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scores/Parts Details Card */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 space-y-4 border border-slate-100"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Điểm số từng phần</h3>
          </div>
          
          {isVstep ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { 
                  label: "Kỹ năng Nghe", 
                  val: vstepScores.listening, 
                  correct: vstepMeta?.skill_stats?.listening?.correct, 
                  total: vstepMeta?.skill_stats?.listening?.total,
                  icon: Headphones,
                  color: "#3b82f6", // Blue
                  bg: "#eff6ff",
                  border: "#dbeafe"
                },
                { 
                  label: "Kỹ năng Đọc", 
                  val: vstepScores.reading, 
                  correct: vstepMeta?.skill_stats?.reading?.correct, 
                  total: vstepMeta?.skill_stats?.reading?.total,
                  icon: BookOpen,
                  color: "#10b981", // Emerald
                  bg: "#ecfdf5",
                  border: "#d1fae5"
                },
                { 
                  label: "Kỹ năng Viết", 
                  val: vstepScores.writing, 
                  correct: null, 
                  total: null,
                  icon: PenTool,
                  color: "#8b5cf6", // Purple
                  bg: "#f5f3ff",
                  border: "#ede9fe"
                },
                { 
                  label: "Kỹ năng Nói", 
                  val: vstepScores.speaking, 
                  correct: null, 
                  total: null,
                  icon: Mic,
                  color: "#f59e0b", // Amber
                  bg: "#fffbeb",
                  border: "#fef3c7"
                },
              ].map((s) => {
                const Icon = s.icon;
                const isPending = s.val === null || s.val === undefined;
                return (
                  <div key={s.label} className="p-4 rounded-2xl border flex items-center gap-4 transition-all hover:shadow-md hover:scale-[1.01]"
                    style={{ backgroundColor: s.bg, borderColor: s.border }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                      <Icon className="w-5 h-5" style={{ color: s.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.label}</p>
                      <div className="mt-1 flex items-baseline justify-between">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Chờ chấm
                          </span>
                        ) : (
                          <p className="text-base font-extrabold text-slate-850">
                            {Number(s.val).toFixed(1)}<span className="text-xs text-slate-400 font-normal">/10.0</span>
                          </p>
                        )}
                        {s.correct !== null && s.total !== null && s.total > 0 && (
                          <span className="text-[10px] text-slate-500 bg-white/70 px-2 py-0.5 rounded-md font-semibold">
                            Đúng {s.correct}/{s.total}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {Object.keys(sections).length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Không tìm thấy phần kiểm tra riêng biệt nào</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(sections).map(([name, stat]) => (
                    <div key={name} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wide">{name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Số câu đúng: {stat.correct}/{stat.total}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-slate-800">{stat.pointsEarned.toFixed(1)} / {stat.pointsTotal.toFixed(1)}</p>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Điểm</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
