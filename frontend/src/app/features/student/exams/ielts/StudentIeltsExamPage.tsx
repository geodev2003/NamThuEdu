/**
 * IELTS — Student exam page (orchestrator).
 *
 * Routes by URL:
 *  • /hoc-vien/lam-bai-ielts/:examId           → Full IELTS test (sequence: L → R → W → S)
 *  • /hoc-vien/lam-bai-ielts/:examId/listening → Listening only
 *  • /hoc-vien/lam-bai-ielts/:examId/reading   → Reading only
 *  • /hoc-vien/lam-bai-ielts/:examId/writing   → Writing only
 *  • /hoc-vien/lam-bai-ielts/:examId/speaking  → Speaking only
 *
 * Manages:
 *  • Test session (submissionId from `start-direct`)
 *  • Global timer (per skill or full)
 *  • Answer state + auto-save (debounced) → POST /api/student/tests/:submissionId/answer
 *  • Submit dialog → POST /api/student/tests/:submissionId/submit
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Loader2, AlertCircle, Headphones } from "lucide-react";
import { studentApi } from "../../../../../services/studentApi";
import { api } from "../../../../../services/api";
import { usePageTitle } from "../../../../../hooks/usePageTitle";

import { IeltsTopBar } from "./components/IeltsTopBar";
import { IeltsSubmitDialog } from "./components/IeltsSubmitDialog";

import { IeltsListeningView } from "./views/IeltsListeningView";
import { IeltsReadingView } from "./views/IeltsReadingView";
import { IeltsWritingView } from "./views/IeltsWritingView";
import { IeltsSpeakingView } from "./views/IeltsSpeakingView";

import type {
  IeltsSkill,
  AnswerMap,
  IeltsListeningPayload,
  IeltsReadingPayload,
  IeltsWritingPayload,
  IeltsSpeakingPayload,
  IELTS_SKILL_TIME,
} from "./types";
import { IELTS_SKILL_TIME as TIMES } from "./types";

interface StudentIeltsExamPageProps {
  /** Force a specific skill (used for skill-only routes) */
  skill?: IeltsSkill;
  /** Full test mode runs all 4 skills sequentially */
  fullTest?: boolean;
}

export function StudentIeltsExamPage({ skill, fullTest = false }: StudentIeltsExamPageProps) {
  const { examId: examIdParam } = useParams<{ examId: string }>();
  const examId = Number(examIdParam);
  const navigate = useNavigate();
  const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userStr ? JSON.parse(userStr) : null;
  usePageTitle("IELTS Test");

  // Resolve effective skill ordering for full test
  const skillSequence: IeltsSkill[] = useMemo(() => {
    if (skill) return [skill];
    if (fullTest) return ["listening", "reading", "writing", "speaking"];
    return ["listening"]; // default fallback
  }, [skill, fullTest]);

  const [skillIdx, setSkillIdx] = useState(0);
  const currentSkill = skillSequence[skillIdx];

  // Session
  const [submissionId, setSubmissionId] = useState<number | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  // Skill payload (loaded per skill)
  const [payload, setPayload] = useState<any>(null);
  const [payloadLoading, setPayloadLoading] = useState(false);

  // Answer state
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});

  // Timer (in seconds)
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Submit
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [forceSubmit, setForceSubmit] = useState(false);

  // ─── 1) Start the exam session ────────────────────────────────────────
  useEffect(() => {
    if (!examId) {
      setSessionError("Invalid exam ID.");
      setSessionLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await studentApi.startDirectVstepExam(examId, true);
        if (cancelled) return;
        const sId = res.data?.data?.submissionId;
        if (!sId) throw new Error("No submission ID returned.");
        setSubmissionId(sId);
        setSessionLoading(false);
      } catch (e: any) {
        if (cancelled) return;
        setSessionError(e?.response?.data?.message ?? e?.message ?? "Failed to start exam session.");
        setSessionLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [examId]);

  // ─── 2) Load payload when skill changes ───────────────────────────────
  useEffect(() => {
    if (!submissionId || !currentSkill) return;
    let cancelled = false;
    setPayloadLoading(true);
    setPayload(null);

    const loaders: Record<IeltsSkill, (id: number) => Promise<any>> = {
      listening: (id) => studentApi.loadStudentIeltsListening(id),
      reading:   (id) => studentApi.loadStudentIeltsReading(id),
      writing:   (id) => studentApi.loadStudentIeltsWriting(id),
      speaking:  (id) => studentApi.loadStudentIeltsSpeaking(id),
    };

    loaders[currentSkill](examId)
      .then((res: any) => {
        if (cancelled) return;
        const data = res.data?.data;
        setPayload(data);
        // Reset timer for the skill
        setTimeLeft((data?.duration ?? TIMES[currentSkill]) * 60);
      })
      .catch((e: any) => {
        if (cancelled) return;
        setSessionError(e?.response?.data?.message ?? e?.message ?? "Failed to load skill data.");
      })
      .finally(() => !cancelled && setPayloadLoading(false));

    return () => { cancelled = true; };
  }, [submissionId, currentSkill, examId]);

  // ─── 3) Timer tick ────────────────────────────────────────────────────
  useEffect(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (timeLeft <= 0 || !payload) return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // Timeout → force submit current skill
          handleForceSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { timerRef.current && window.clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload]);

  // ─── 4) Auto-save answer (debounced) ──────────────────────────────────
  const saveTimers = useRef<Record<number, number>>({});
  const handleAnswer = useCallback((qId: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));

    // Debounce per question (700ms)
    if (saveTimers.current[qId]) {
      window.clearTimeout(saveTimers.current[qId]);
    }
    saveTimers.current[qId] = window.setTimeout(async () => {
      if (!submissionId) return;
      try {
        const text = Array.isArray(value) ? value.join("|") : String(value ?? "");
        await api.post(`/student/tests/${submissionId}/answer`, {
          question_id: qId,
          saAnswer_text: text,
        });
      } catch {
        // Silently retry on next change; surface critical errors via toast in Phase 6
      }
    }, 700);
  }, [submissionId]);

  const handleToggleFlag = useCallback((qId: number) => {
    setFlagged((prev) => ({ ...prev, [qId]: !prev[qId] }));
  }, []);

  // ─── 5) Submit current skill or full ──────────────────────────────────
  const totalQuestions = useMemo(() => {
    if (!payload) return 0;
    if (currentSkill === "listening") return (payload as IeltsListeningPayload).totalQuestions ?? 0;
    if (currentSkill === "reading")   return (payload as IeltsReadingPayload).totalQuestions ?? 0;
    if (currentSkill === "writing")   return (payload as IeltsWritingPayload).tasks?.length ?? 0;
    if (currentSkill === "speaking")  return (payload as IeltsSpeakingPayload).parts?.length ?? 0;
    return 0;
  }, [payload, currentSkill]);

  const answeredCount = useMemo(() => {
    if (!payload) return 0;
    let count = 0;
    if (currentSkill === "listening") {
      (payload as IeltsListeningPayload).sections.forEach((s) =>
        s.questions.forEach((q) => answers[q.qId] != null && answers[q.qId] !== "" && count++)
      );
    } else if (currentSkill === "reading") {
      (payload as IeltsReadingPayload).passages.forEach((p) =>
        p.questions.forEach((q) => answers[q.qId] != null && answers[q.qId] !== "" && count++)
      );
    } else if (currentSkill === "writing") {
      (payload as IeltsWritingPayload).tasks.forEach((t) => {
        const txt = (answers[t.questionId] as string) ?? "";
        if (txt.trim().length >= t.minWords) count++;
      });
    }
    return count;
  }, [answers, payload, currentSkill]);

  const flaggedCount = useMemo(() => Object.values(flagged).filter(Boolean).length, [flagged]);

  const handleRequestSubmit = () => {
    setSubmitOpen(true);
  };

  const handleForceSubmit = () => {
    setForceSubmit(true);
    setSubmitOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!submissionId) return;
    try {
      setSubmitting(true);
      // Send final flush of current answer values just before submit
      await api.post(`/student/tests/${submissionId}/submit`, {});

      // If this is part of a full test, advance to next skill instead of leaving
      if (fullTest && skillIdx < skillSequence.length - 1) {
        setSkillIdx((i) => i + 1);
        setAnswers({});
        setFlagged({});
        setSubmitOpen(false);
        setForceSubmit(false);
        setSubmitting(false);
        // New session for next skill — reuse same submissionId? In this design we reuse.
        return;
      }

      // Single-skill: navigate to results
      navigate(`/hoc-vien/ket-qua-vstep/${submissionId}`);
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Submit failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── RENDER STATES ────────────────────────────────────────────────────

  if (sessionError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-red-200 rounded-xl p-6 max-w-md w-full shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Không thể bắt đầu bài thi</h2>
          </div>
          <p className="text-sm text-gray-700 mb-4">{sessionError}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#FF8C42] to-[#FF6B35] text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (sessionLoading || payloadLoading || !payload) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF7F2] to-[#F5F5F5] flex items-center justify-center p-4">
        <div className="text-center">
          {/* Brand badge */}
          <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] flex items-center justify-center shadow-lg shadow-orange-200">
            <Headphones className="w-7 h-7 text-white" />
          </div>
          {/* Spinner */}
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[#FF6B35]" />
          <p className="text-[15px] font-semibold text-[#1a1a1a]">
            {sessionLoading ? "Đang khởi tạo phiên thi…" : "Đang tải câu hỏi…"}
          </p>
          <p className="text-sm text-[#677788] mt-1">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  const sectionLabel = (() => {
    const titles: Record<IeltsSkill, string> = {
      listening: "Listening",
      reading: "Reading",
      writing: "Writing",
      speaking: "Speaking",
    };
    return `IELTS ${titles[currentSkill]} · ${payload.title ?? ""}`;
  })();

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <IeltsTopBar
        candidateName={(user?.uName as string) ?? "Candidate"}
        testId={`#${examId}`}
        sectionLabel={sectionLabel}
        timeLeft={timeLeft}
        showTimer={false}
      />

      {currentSkill === "listening" && (
        <IeltsListeningView
          payload={payload as IeltsListeningPayload}
          answers={answers}
          flagged={flagged}
          onAnswer={handleAnswer}
          onToggleFlag={handleToggleFlag}
          onSubmit={handleRequestSubmit}
          timeLeft={timeLeft}
          showTimer
        />
      )}
      {currentSkill === "reading" && (
        <IeltsReadingView
          payload={payload as IeltsReadingPayload}
          answers={answers}
          flagged={flagged}
          onAnswer={handleAnswer}
          onToggleFlag={handleToggleFlag}
          onSubmit={handleRequestSubmit}
          timeLeft={timeLeft}
          showTimer
        />
      )}
      {currentSkill === "writing" && (
        <IeltsWritingView
          payload={payload as IeltsWritingPayload}
          answers={answers}
          onAnswer={handleAnswer}
          onSubmit={handleRequestSubmit}
        />
      )}
      {currentSkill === "speaking" && (
        <IeltsSpeakingView
          payload={payload as IeltsSpeakingPayload}
          submissionId={submissionId}
          onSubmit={handleRequestSubmit}
        />
      )}

      <IeltsSubmitDialog
        open={submitOpen}
        totalQuestions={totalQuestions}
        answeredCount={answeredCount}
        flaggedCount={flaggedCount}
        isSubmitting={submitting}
        onCancel={() => { setSubmitOpen(false); setForceSubmit(false); }}
        onConfirm={handleConfirmSubmit}
        forceSubmit={forceSubmit}
      />
    </div>
  );
}

export default StudentIeltsExamPage;
