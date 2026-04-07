import { useParams, useNavigate, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Trophy,
  RotateCcw,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Target,
} from "lucide-react";
import { studentApi } from "../../../../services/studentApi";
import { useEffect, useRef } from "react";

const PRIMARY = "#0EA5E9"; // Sky Blue
const PRIMARY_LIGHT = "#E0F2FE"; // Light Sky
const STUDENT_BASE_PATH = "/hoc-vien";

// ─── Confetti (CSS-based) ─────────────────────────────────────────────────────
function Confetti() {
  const colors = ["#0EA5E9", "#06B6D4", "#F59E0B", "#EF4444", "#10B981"];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={i}
          className="absolute w-2 h-3 rounded-sm opacity-0"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            background: colors[i % colors.length],
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `confettiFall ${1.5 + Math.random() * 2}s ${Math.random() * 1}s ease-in forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { opacity: 1; transform: translateY(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(100vh) rotate(720deg); }
        }
      `}</style>
    </div>
  );
}

// ─── Score Circle ─────────────────────────────────────────────────────────────
function ScoreCircle({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10B981" : score >= 60 ? PRIMARY : score >= 40 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#F3F4F6" strokeWidth="10" />
        <circle
          cx="60" cy="60" r="54" fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ fontSize: 32, fontWeight: 900, color, lineHeight: 1 }}>
          {score.toFixed(0)}
        </span>
        <span style={{ fontSize: 12, color: "#9CA3AF" }}>điểm</span>
      </div>
    </div>
  );
}

function getGrade(score: number) {
  if (score >= 90) return { label: "Xuất sắc", color: "#10B981", bg: "#D1FAE5" };
  if (score >= 80) return { label: "Giỏi", color: "#059669", bg: "#D1FAE5" };
  if (score >= 70) return { label: "Khá", color: PRIMARY, bg: PRIMARY_LIGHT };
  if (score >= 60) return { label: "Trung bình", color: "#F59E0B", bg: "#FEF3C7" };
  return { label: "Chưa đạt", color: "#EF4444", bg: "#FEE2E2" };
}

export function ResultDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const submissionId = Number(id);
  const confettiShown = useRef(false);

  const { data, isLoading } = useQuery({
    queryKey: ["submission", submissionId],
    queryFn: () => studentApi.getSubmissionDetail(submissionId),
    enabled: !!submissionId,
  });

  const submission = (data as any)?.data?.data ?? (data as any)?.data;
  const score = submission?.sScore ?? 0;
  const grade = getGrade(score);
  const showConfetti = score >= 80 && !confettiShown.current;
  if (score >= 80) confettiShown.current = true;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 rounded-full animate-spin"
          style={{ borderColor: PRIMARY_LIGHT, borderTopColor: PRIMARY }} />
      </div>
    );
  }

  const answeredCorrect = submission?.answers?.filter((a: any) => a.saIs_correct)?.length ?? 0;
  const totalAnswered = submission?.answers?.length ?? 0;
  const totalQuestions = submission?.exam?.questions?.length ?? totalAnswered;
  const assignmentId = submission?.assignment_id;

  return (
    <div className="py-6 max-w-2xl mx-auto space-y-6">
      {showConfetti && <Confetti />}

      {/* Back */}
      <button onClick={() => navigate(`${STUDENT_BASE_PATH}/bai-tap`)}
        className="flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
        style={{ color: PRIMARY }}>
        <ArrowLeft className="w-4 h-4" /> Về danh sách bài tập
      </button>

      {/* Score Hero Card */}
      <div className="rounded-3xl p-8 text-center bg-white"
        style={{ border: "1.5px solid #F0EEFF", boxShadow: "0 8px 32px rgba(124,58,237,0.10)" }}>
        <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 16 }}>Kết quả bài thi</p>
        <h1 className="font-extrabold mb-6" style={{ fontSize: 22, color: "#1F1344" }}>
          {submission?.exam?.eTitle ?? "Bài thi"}
        </h1>

        <ScoreCircle score={score} />

        <div className="mt-4">
          <span className="px-4 py-1.5 rounded-full text-sm font-bold"
            style={{ background: grade.bg, color: grade.color }}>
            {grade.label}
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { icon: CheckCircle, label: "Câu đúng", value: `${answeredCorrect}/${totalQuestions}`, color: "#10B981", bg: "#D1FAE5" },
            { icon: Clock, label: "Trạng thái", value: submission?.sStatus ?? "graded", color: PRIMARY, bg: PRIMARY_LIGHT },
            { icon: TrendingUp, label: "Lần thử", value: `#${submission?.sAttempt ?? 1}`, color: "#F59E0B", bg: "#FEF3C7" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-4" style={{ background: s.bg }}>
              <s.icon className="w-5 h-5 mx-auto mb-2" style={{ color: s.color }} />
              <p style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accuracy bar */}
      <div className="rounded-2xl p-5 bg-white" style={{ border: "1.5px solid #F0EEFF" }}>
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4" style={{ color: PRIMARY }} />
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1F1344" }}>Độ chính xác</p>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize: 13, color: "#6B7280" }}>
            {answeredCorrect}/{totalQuestions} câu đúng
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: PRIMARY }}>
            {totalQuestions > 0 ? Math.round((answeredCorrect / totalQuestions) * 100) : 0}%
          </span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: "#F3F4F6" }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${totalQuestions > 0 ? (answeredCorrect / totalQuestions) * 100 : 0}%`,
              background: `linear-gradient(90deg, ${PRIMARY}, #38BDF8)`,
            }}
          />
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link to={`${STUDENT_BASE_PATH}/dap-an/${submissionId}`}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-opacity hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${PRIMARY}, #38BDF8)`, color: "#fff", fontSize: 15 }}>
          <Eye className="w-5 h-5" /> Xem đáp án
        </Link>
        {assignmentId && (
          <Link to={`${STUDENT_BASE_PATH}/lam-bai/${assignmentId}`}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold border-2 transition-colors hover:bg-sky-50"
            style={{ borderColor: PRIMARY, color: PRIMARY, fontSize: 15 }}>
            <RotateCcw className="w-5 h-5" /> Làm lại
          </Link>
        )}
      </div>
    </div>
  );
}
