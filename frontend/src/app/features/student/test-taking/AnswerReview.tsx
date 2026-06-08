import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle,
  XCircle,
  MinusCircle,
  ArrowLeft,
  Filter,
} from "lucide-react";
import { studentApi } from "../../../../services/studentApi";

const PRIMARY = "#0EA5E9";
const PRIMARY_LIGHT = "#E0F2FE";

type FilterType = "all" | "correct" | "wrong" | "unanswered";

export function AnswerReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const submissionId = Number(id);
  const [filter, setFilter] = useState<FilterType>("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["answers", submissionId],
    queryFn: () => studentApi.getAnswers(submissionId),
    enabled: !!submissionId,
  });

  const rawData = (data as any)?.data?.data ?? (data as any)?.data;
  const isVstep = rawData?.submission_info?.exam_type?.toUpperCase() === "VSTEP";
  const examId = rawData?.submission_info?.exam_id;

  // Ensure modal is closed on mount
  useEffect(() => {
    window.dispatchEvent(new Event("close-result-modal"));
  }, []);

  useEffect(() => {
    if (isVstep && examId && submissionId) {
      window.dispatchEvent(new Event("close-result-modal"));
      navigate(`/hoc-vien/lam-bai-vstep/${examId}?review=${submissionId}`, { replace: true });
    }
  }, [isVstep, examId, submissionId, navigate]);

  const rawItems = rawData?.detailed_answers ?? (Array.isArray(rawData) ? rawData : []);
  const items: any[] = Array.isArray(rawItems)
    ? rawItems
    : (rawItems && typeof rawItems === "object" ? Object.values(rawItems) : []);

  const filtered = items.filter((item) => {
    if (filter === "correct") return item.student_answer?.saIs_correct === true;
    if (filter === "wrong") return item.student_answer?.saIs_correct === false && item.student_answer !== null;
    if (filter === "unanswered") return !item.student_answer;
    return true;
  });

  const correctCount = items.filter((i) => i.student_answer?.saIs_correct).length;
  const wrongCount = items.filter((i) => i.student_answer && !i.student_answer.saIs_correct).length;
  const unansweredCount = items.filter((i) => !i.student_answer).length;

  const filterBtns: { key: FilterType; label: string; count: number; color: string }[] = [
    { key: "all", label: "Tất cả", count: items.length, color: "#6B7280" },
    { key: "correct", label: "Đúng", count: correctCount, color: "#10B981" },
    { key: "wrong", label: "Sai", count: wrongCount, color: "#EF4444" },
    { key: "unanswered", label: "Chưa trả lời", count: unansweredCount, color: "#F59E0B" },
  ];

  if (isLoading || isVstep) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 rounded-full animate-spin"
          style={{ borderColor: PRIMARY_LIGHT, borderTopColor: PRIMARY }} />
        {isVstep && (
          <p className="text-sm font-semibold text-slate-500 animate-pulse">
            Đang chuyển hướng sang giao diện xem lại bài thi VSTEP...
          </p>
        )}
      </div>
    );
  }

  if (error) {
    const errorMsg = (error as any)?.response?.data?.message || (error as any)?.message || "Đã xảy ra lỗi khi tải đáp án.";
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-red-100 shadow-xl space-y-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
            <XCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F1344" }}>Không thể xem đáp án</h2>
            <p style={{ fontSize: 14, color: "#6B7280" }}>{errorMsg}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 rounded-2xl font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${PRIMARY}, #38BDF8)` }}
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)}
          className="p-2 rounded-xl transition-colors hover:bg-sky-50"
          style={{ color: PRIMARY }}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1F1344" }}>Xem đáp án</h1>
          <p style={{ fontSize: 13, color: "#9CA3AF" }}>
            {correctCount}/{items.length} câu đúng · Submission #{submissionId}
          </p>
        </div>
      </div>

      {/* Score summary bar */}
      <div className="rounded-2xl p-4 bg-white flex items-center gap-4 flex-wrap"
        style={{ border: "1.5px solid #F0EEFF" }}>
        {[
          { val: correctCount, label: "Đúng", color: "#10B981", bg: "#D1FAE5" },
          { val: wrongCount, label: "Sai", color: "#EF4444", bg: "#FEE2E2" },
          { val: unansweredCount, label: "Bỏ qua", color: "#F59E0B", bg: "#FEF3C7" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: s.bg }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</span>
            <span style={{ fontSize: 12, color: s.color }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filterBtns.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: filter === f.key ? PRIMARY : "#F3F4F6",
              color: filter === f.key ? "#fff" : "#6B7280",
            }}>
            <Filter className="w-3 h-3" />
            {f.label}
            <span className="px-1.5 py-0.5 rounded-lg text-xs"
              style={{
                background: filter === f.key ? "rgba(255,255,255,0.25)" : "#E5E7EB",
                color: filter === f.key ? "#fff" : "#374151",
              }}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Question list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Không có câu nào trong bộ lọc này</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item: any, idx: number) => {
            const q = item.question;
            const studentAns = item.student_answer;
            const correctAns = item.correct_answer;
            const isCorrect = studentAns?.saIs_correct === true;
            const isWrong = studentAns && !isCorrect;
            const isUnanswered = !studentAns;

            const statusColor = isCorrect ? "#10B981" : isWrong ? "#EF4444" : "#F59E0B";
            const statusBg = isCorrect ? "#D1FAE5" : isWrong ? "#FEE2E2" : "#FEF3C7";
            const StatusIcon = isCorrect ? CheckCircle : isWrong ? XCircle : MinusCircle;

            return (
              <div key={q?.qId ?? idx} className="rounded-2xl p-5 bg-white"
                style={{
                  border: `1.5px solid ${isCorrect ? "#D1FAE5" : isWrong ? "#FECACA" : "#FDE68A"}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}>
                {/* Question header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                    style={{ background: statusColor }}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <StatusIcon className="w-4 h-4" style={{ color: statusColor }} />
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: statusBg, color: statusColor }}>
                        {isCorrect ? "Đúng" : isWrong ? "Sai" : "Chưa trả lời"}
                      </span>
                      <span className="text-xs" style={{ color: "#9CA3AF" }}>
                        {q?.qPoints ?? 0} điểm
                      </span>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#1F1344", lineHeight: 1.6 }}
                      dangerouslySetInnerHTML={{ __html: q?.qContent ?? "" }} />
                  </div>
                </div>

                {/* Answer rows */}
                <div className="space-y-2 ml-10">
                  {/* All options */}
                  {(item.all_options ?? []).map((opt: any, oi: number) => {
                    const isStudentChoice = studentAns?.saAnswer_text === opt.aContent;
                    const isCorrectOpt = correctAns?.aContent === opt.aContent;
                    let optBg = "#F9FAFB";
                    let optBorder = "#E5E7EB";
                    let optColor = "#374151";
                    if (isCorrectOpt) { optBg = "#D1FAE5"; optBorder = "#10B981"; optColor = "#065F46"; }
                    else if (isStudentChoice && !isCorrectOpt) { optBg = "#FEE2E2"; optBorder = "#EF4444"; optColor = "#991B1B"; }

                    return (
                      <div key={opt.aId} className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ background: optBg, border: `1.5px solid ${optBorder}` }}>
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: optBorder, color: "#fff" }}>
                          {String.fromCharCode(65 + oi)}
                        </span>
                        <p style={{ fontSize: 14, color: optColor, fontWeight: isCorrectOpt || isStudentChoice ? 600 : 400 }}>
                          {opt.aContent}
                        </p>
                        <div className="ml-auto flex items-center gap-1 flex-shrink-0">
                          {isCorrectOpt && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                          {isStudentChoice && !isCorrectOpt && <XCircle className="w-4 h-4 text-red-500" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q?.qExplanation && (
                  <div className="ml-10 mt-3 p-3 rounded-xl"
                    style={{ background: PRIMARY_LIGHT, border: `1px solid ${PRIMARY}20` }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: PRIMARY, marginBottom: 4 }}>💡 Giải thích</p>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{q.qExplanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
