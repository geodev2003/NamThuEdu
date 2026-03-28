import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { Send, AlertTriangle, CheckCircle, BookOpen, Play, Pause, Mic } from "lucide-react";
import { studentApi } from "../../../../services/studentApi";

import { IntroScreen } from "./components/IntroScreen";

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#EDE9FE";
const PAGE_BG = "#E5E7EB";

const SKILL_LABELS: Record<string, string> = {
  listening: "Nghe",
  reading: "Doc",
  writing: "Viet",
  speaking: "Noi",
};

const SKILL_ORDER = ["listening", "reading", "writing", "speaking"];

const SKILL_DURATION: Record<string, number> = {
  listening: 47,
  reading: 60,
  writing: 60,
  speaking: 12,
};

function getQuestionId(question: any): string {
  return String(question?.qId ?? question?.id ?? "");
}

function getQuestionSkill(question: any): string {
  return String(question?.qSkill ?? question?.qSection ?? "reading").toLowerCase();
}

function getQuestionPart(question: any): number {
  return Number(question?.qPart ?? question?.qSection_order ?? 1);
}

function getOptions(question: any) {
  if (Array.isArray(question?.options)) {
    return question.options.map((opt: any, idx: number) => ({
      id: String(opt?.id ?? idx + 1),
      label: String(opt?.label ?? String.fromCharCode(65 + idx)),
      content: String(opt?.content ?? ""),
      value: String(opt?.id ?? idx + 1),
    }));
  }

  if (Array.isArray(question?.answers)) {
    return question.answers.map((opt: any, idx: number) => ({
      id: String(opt?.aId ?? idx + 1),
      label: String.fromCharCode(65 + idx),
      content: String(opt?.aContent ?? ""),
      value: String(opt?.aContent ?? ""),
    }));
  }

  return [];
}

function buildMockExam() {
  return {
    eTitle: "VSTEP Mock Full Test",
    eDuration_minutes: 179,
    questions: [
      {
        id: "l1",
        qId: 1,
        qSkill: "listening",
        qPart: 1,
        qContent: "Question 1: What music will they have at the party?",
        qInstruction:
          "In this part, you will hear short recordings once only. Choose the best answer A, B, C or D.",
        qAudio_duration: 426,
        options: [
          { id: 1, label: "A", content: "guitar" },
          { id: 2, label: "B", content: "cello" },
          { id: 3, label: "C", content: "CDs" },
          { id: 4, label: "D", content: "piano" },
        ],
      },
      {
        id: "l2",
        qId: 2,
        qSkill: "listening",
        qPart: 1,
        qContent: "Question 2: When will the man go on holiday?",
        options: [
          { id: 1, label: "A", content: "January" },
          { id: 2, label: "B", content: "August" },
          { id: 3, label: "C", content: "June" },
          { id: 4, label: "D", content: "July" },
        ],
      },
      {
        id: "r1",
        qId: 3,
        qSkill: "reading",
        qPart: 1,
        qPassage:
          "<p><b>Directions:</b> In this section, you will read several passages and answer questions based on each passage.</p><p>(A) It is estimated that over 99 percent of all species that ever existed have become extinct...</p>",
        qContent: "Question 1: The word \"it\" in paragraph (A) refers to",
        options: [
          { id: 1, label: "A", content: "99 percent" },
          { id: 2, label: "B", content: "species" },
          { id: 3, label: "C", content: "extinction" },
          { id: 4, label: "D", content: "environment" },
        ],
      },
      {
        id: "r2",
        qId: 4,
        qSkill: "reading",
        qPart: 1,
        qPassage:
          "<p><b>Directions:</b> In this section, you will read several passages and answer questions based on each passage.</p><p>(A) It is estimated that over 99 percent of all species that ever existed have become extinct...</p>",
        qContent: "Question 2: The word \"ultimately\" in paragraph (A) is closest in meaning to",
        options: [
          { id: 1, label: "A", content: "dramatically" },
          { id: 2, label: "B", content: "exceptionally" },
          { id: 3, label: "C", content: "unfortunately" },
          { id: 4, label: "D", content: "eventually" },
        ],
      },
      {
        id: "w1",
        qId: 5,
        qSkill: "writing",
        qPart: 1,
        qContent:
          "You should spend about 20 minutes on this task. Write an email responding to your friend and sharing your music preferences.",
        qWord_count: 120,
      },
      {
        id: "w2",
        qId: 6,
        qSkill: "writing",
        qPart: 2,
        qContent:
          "You should spend about 40 minutes on this task. Write an essay discussing the effects of the Internet on human interactions.",
        qWord_count: 250,
      },
      {
        id: "s1",
        qId: 7,
        qSkill: "speaking",
        qPart: 1,
        qContent:
          "Social Interaction (3 minutes): Talk about your birthday and your favorite means of transportation.",
      },
      {
        id: "s2",
        qId: 8,
        qSkill: "speaking",
        qPart: 2,
        qContent:
          "Solution Discussion (4 minutes): Choose one option and justify your choice.",
      },
      {
        id: "s3",
        qId: 9,
        qSkill: "speaking",
        qPart: 3,
        qContent:
          "Topic Development (5 minutes): Present your viewpoint and defend it with examples.",
      },
    ],
  };
}

// ─── Timer ────────────────────────────────────────────────────────────────────
function Timer({ seconds }: { seconds: number }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isWarning = seconds <= 300;
  const isDanger = seconds <= 60;
  return (
    <div
      className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold"
      style={{
        background: isDanger ? "#FEE2E2" : isWarning ? "#FEF3C7" : PURPLE_LIGHT,

      }}
    const [activeSkill, setActiveSkill] = useState<string>("listening");
    const [activePart, setActivePart] = useState<number>(1);

    </div>
  );
}
    const [showBottomNav, setShowBottomNav] = useState(true);

function SubmitDialog({
    const [playerSeconds, setPlayerSeconds] = useState(0);
    const [isPlayerRunning, setIsPlayerRunning] = useState(false);
  open, total, answered, onConfirm, onCancel, loading,
}: {
    const examPrepData = useMemo(() => ({
}) {
      exam_duration: exam?.eDuration_minutes ?? 120,
  const unanswered = total - answered;
    }), [assignmentId, exam?.eDuration_minutes]);

    const questions = exam?.questions ?? [];

    const sections = useMemo(() => {
      const map = new Map<string, { skill: string; part: number; count: number }>();
      questions.forEach((q: any) => {
        const skill = getQuestionSkill(q);
        const part = getQuestionPart(q);
        const key = `${skill}-${part}`;
        if (!map.has(key)) {
          map.set(key, { skill, part, count: 0 });
        }
        const existing = map.get(key)!;
        existing.count += 1;
      });

      return Array.from(map.values()).sort((a, b) => {
        const skillDelta = SKILL_ORDER.indexOf(a.skill) - SKILL_ORDER.indexOf(b.skill);
        if (skillDelta !== 0) return skillDelta;
        return a.part - b.part;
      });
    }, [questions]);

    const activeSectionIndex = useMemo(
      () => sections.findIndex((s) => s.skill === activeSkill && s.part === activePart),
      [sections, activeSkill, activePart]
    );

    const currentPartQuestions = useMemo(
      () => questions.filter((q: any) => getQuestionSkill(q) === activeSkill && getQuestionPart(q) === activePart),
      [questions, activeSkill, activePart]
    );

    const answeredCount = useMemo(
      () => Object.keys(answers).filter((k) => String(answers[k] ?? "").trim() !== "").length,
      [answers]
    );
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: unanswered > 0 ? "#FEF3C7" : "#D1FAE5" }}>
            {unanswered > 0
              ? <AlertTriangle className="w-8 h-8 text-amber-500" />

        const fetchedExam = data?.exam ?? buildMockExam();
        setExam(fetchedExam);
        const durationMinutes = Number(fetchedExam?.eDuration_minutes ?? fetchedExam?.exam_duration ?? 120);
        setTimeLeft(durationMinutes * 60);
              className="flex-1 py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: PURPLE, fontSize: 15 }}>
              {loading ? "Đang nộp..." : "Nộp bài"}
        alert("Khong ket noi duoc Backend. Tu dong chuyen sang Mock Mode de xem giao dien thi.");
        </div>
      </div>
        const fallbackExam = buildMockExam();
        setExam(fallbackExam);
        setTimeLeft(120 * 60);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmit, setShowSubmit] = useState(false);
  const [started, setStarted] = useState(false);
  
      mutationFn: (p: { question_id: number; saAnswer_text: string }) =>
        studentApi.saveAnswer(submissionId!, { question_id: p.question_id, saAnswer_text: p.saAnswer_text } as any),
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // 1. Fetch Exam info (Mock if needed before starting, or use API directly)
  const [examPrepData, setExamPrepData] = useState<any>({
    exam_title: `Bài thi VSTEP ID: #${assignmentId}`,
    exam_duration: 120, // phút
    total_questions: 40,
  });

  // 2. Mutations
  const startMutation = useMutation({
    mutationFn: () => studentApi.startTest(assignmentId),
    onSuccess: (res: any) => {
      const data = res.data?.data;
      setSubmissionId(data?.submissionId || 999);
      // FORCE MOCK DATA FOR 4 SKILLS UI TESTING
      setExam({
         eTitle: "VSTEP English Proficiency Test (Mock - 4 Skills)",
         questions: [
            { id: "q1", qSkill: "listening", qPart: 1, qContent: "Part 1: Listen to the short announcement.", options: [{id: 1, label: "A", content: "Ok"}, {id: 2, label: "B", content: "No"}] },
            { id: "q2", qSkill: "listening", qPart: 2, qContent: "Part 2: Listen to the dialogue.", options: [{id: 1, label: "A", content: "Yes"}, {id: 2, label: "B", content: "No"}] },
            { id: "q3", qSkill: "listening", qPart: 3, qContent: "Part 3: Listen to the lecture.", options: [{id: 1, label: "A", content: "A"}, {id: 2, label: "B", content: "B"}] },
            { id: "q4", qSkill: "reading", qPart: 1, qContent: "Part 1: Reading passage 1", qPassage: "<p>Reading P1...</p>", options: [{id: 1, label: "A", content: "A"}, {id: 2, label: "B", content: "B"}] },
            { id: "q5", qSkill: "reading", qPart: 2, qContent: "Part 2: Reading passage 2", qPassage: "<p>Reading P2...</p>", options: [{id: 1, label: "A", content: "A"}, {id: 2, label: "B", content: "B"}] },
            { id: "q6", qSkill: "reading", qPart: 3, qContent: "Part 3: Reading passage 3", qPassage: "<p>Reading P3...</p>", options: [{id: 1, label: "A", content: "A"}, {id: 2, label: "B", content: "B"}] },
            { id: "q7", qSkill: "reading", qPart: 4, qContent: "Part 4: Reading passage 4", qPassage: "<p>Reading P4...</p>", options: [{id: 1, label: "A", content: "A"}, {id: 2, label: "B", content: "B"}] },
            { id: "q8", qSkill: "writing", qPart: 1, qContent: "<b>Task 1:</b> Write an email.", qPassage: "Email..." },
            { id: "q9", qSkill: "writing", qPart: 2, qContent: "<b>Task 2:</b> Write an essay.", qPassage: "Essay..." },
            { id: "q10", qSkill: "speaking", qPart: 1, qContent: "<b>Part 1: Social Interaction</b><br/>Talk about yourself." },
            { id: "q11", qSkill: "speaking", qPart: 2, qContent: "<b>Part 2: Solution Discussion</b><br/>Which choice?" },
            { id: "q12", qSkill: "speaking", qPart: 3, qContent: "<b>Part 3: Topic Development</b><br/>Develop the topic." },
         ]
      });
      setTimeLeft(7200);
      setStarted(true);
    },
    onError: () => {
      // Vì đang trong giai đoạn phát triển, cho phép mock data nếu API lỗi
      alert("Không kết nối được Backend. Tự động chuyển sang Mock Mode để xem UI.");
      setStarted(true);
      setSubmissionId(999);
      setExam({
         eTitle: "VSTEP English Proficiency Test (Mock - 4 Skills)",
         questions: [
            { id: "q1", qSkill: "listening", qPart: 1, qContent: "Part 1: Listen to the short announcement.", options: [{id: 1, label: "A", content: "Ok"}, {id: 2, label: "B", content: "No"}] },
            { id: "q2", qSkill: "listening", qPart: 2, qContent: "Part 2: Listen to the dialogue.", options: [{id: 1, label: "A", content: "Yes"}, {id: 2, label: "B", content: "No"}] },
            { id: "q3", qSkill: "listening", qPart: 3, qContent: "Part 3: Listen to the lecture.", options: [{id: 1, label: "A", content: "A"}, {id: 2, label: "B", content: "B"}] },
            { id: "q4", qSkill: "reading", qPart: 1, qContent: "Part 1: Reading passage 1", qPassage: "<p>Reading P1...</p>", options: [{id: 1, label: "A", content: "A"}, {id: 2, label: "B", content: "B"}] },
            { id: "q5", qSkill: "reading", qPart: 2, qContent: "Part 2: Reading passage 2", qPassage: "<p>Reading P2...</p>", options: [{id: 1, label: "A", content: "A"}, {id: 2, label: "B", content: "B"}] },
            { id: "q6", qSkill: "reading", qPart: 3, qContent: "Part 3: Reading passage 3", qPassage: "<p>Reading P3...</p>", options: [{id: 1, label: "A", content: "A"}, {id: 2, label: "B", content: "B"}] },
            { id: "q7", qSkill: "reading", qPart: 4, qContent: "Part 4: Reading passage 4", qPassage: "<p>Reading P4...</p>", options: [{id: 1, label: "A", content: "A"}, {id: 2, label: "B", content: "B"}] },
            { id: "q8", qSkill: "writing", qPart: 1, qContent: "<b>Task 1:</b> Write an email.", qPassage: "Email..." },
            { id: "q9", qSkill: "writing", qPart: 2, qContent: "<b>Task 2:</b> Write an essay.", qPassage: "Essay..." },
            { id: "q10", qSkill: "speaking", qPart: 1, qContent: "<b>Part 1: Social Interaction</b><br/>Talk about yourself." },
            { id: "q11", qSkill: "speaking", qPart: 2, qContent: "<b>Part 2: Solution Discussion</b><br/>Which choice?" },
            { id: "q12", qSkill: "speaking", qPart: 3, qContent: "<b>Part 3: Topic Development</b><br/>Develop the topic." },
         ]
      });
      setTimeLeft(7200);
    }
  });

  const saveAnswerMutation = useMutation({
    mutationFn: (p: { question_id: number; answer_text: string }) =>
      studentApi.saveAnswer(submissionId!, { question_id: p.question_id, answer_text: p.answer_text }),
  });

  const submitMutation = useMutation({
    mutationFn: () => studentApi.submitTest(submissionId!),
    onSuccess: (res: any) => {
      const sid = res.data?.data?.submissionId ?? submissionId;
      navigate(`/ket-qua/${sid}`);
    },
    onError: () => {
      alert("Mock Mode: Nop bai thanh cong (Local)");
      navigate(`/ket-qua/${submissionId ?? 999}`);
    }
  });

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) { clearInterval(t); submitMutation.mutate(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, submissionId]);

  const doAutoSave = useCallback(() => {
    setAutoSaving(true);
    setTimeout(() => setAutoSaving(false), 800);
  }, []);
  
  useEffect(() => {
    if (!started) return;
    autoSaveRef.current = setInterval(doAutoSave, 30000);
    return () => clearInterval(autoSaveRef.current);
  }, [started, doAutoSave]);

  useEffect(() => {
    if (!sections.length) return;
    const hasCurrent = sections.some((section) => section.skill === activeSkill && section.part === activePart);
    if (!hasCurrent) {
      setActiveSkill(sections[0].skill);
      setActivePart(sections[0].part);
    }
  }, [sections, activeSkill, activePart]);

  const handleAnswerChange = (question: any, val: string) => {
    const qKey = getQuestionId(question);
    if (!qKey) return;

    setAnswers((prev) => ({ ...prev, [qKey]: val }));
    if (submissionId && question?.qId) {
      saveAnswerMutation.mutate({ question_id: Number(question.qId), saAnswer_text: val });
    }
  };

  const goToSection = (skill: string, part: number) => {
    setActiveSkill(skill);
    setActivePart(part);
  };

  const goNextSection = () => {
    if (activeSectionIndex === -1 || activeSectionIndex >= sections.length - 1) return;
    const next = sections[activeSectionIndex + 1];
    goToSection(next.skill, next.part);
  };

  const handleManualSave = () => {
    doAutoSave();
  };

  useEffect(() => {
    if (activeSkill !== "listening") {
      setIsPlayerRunning(false);
      setPlayerSeconds(0);
      return;
    }

    const firstListeningQuestion = currentPartQuestions[0];
    setPlayerSeconds(Number(firstListeningQuestion?.qAudio_duration ?? 420));
    setIsPlayerRunning(false);
  }, [activeSkill, activePart, currentPartQuestions]);

  useEffect(() => {
    if (!isPlayerRunning || playerSeconds <= 0) return;
    const t = setInterval(() => {
      setPlayerSeconds((s) => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isPlayerRunning, playerSeconds]);

  if (!started) {
    return (
      <IntroScreen 
         examData={examPrepData}
         onStart={() => startMutation.mutate()}
         isLoading={startMutation.isPending}
      />
    );
  }

  const minutes = Math.floor(playerSeconds / 60);
  const secs = playerSeconds % 60;

  return (
    <div className="min-h-screen" style={{ background: PAGE_BG }}>
      <header className="fixed top-0 left-0 right-0 z-40 h-[64px] bg-[#CBD5E1] border-b border-slate-300 px-4 lg:px-6">
        <div className="h-full max-w-[1600px] mx-auto grid grid-cols-3 items-center gap-3">
          <div className="flex items-center gap-2 text-slate-800 text-sm font-semibold">
            <BookOpen className="w-4 h-4" />
            Nguyen Van Thuan
          </div>

          <div className="flex justify-center">
            <div className="px-4 py-1 rounded-md bg-blue-500 text-white font-mono font-bold text-lg tracking-wider">
              <Timer seconds={timeLeft} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-end gap-3">
              <span className="text-xs font-semibold text-slate-700">
                Da tra loi: {answeredCount}/{questions.length}
              </span>
              <button
                onClick={() => setShowSubmit(true)}
                className="px-4 py-1.5 rounded-md text-white font-bold text-sm transition-opacity hover:opacity-90"
                style={{ background: "#3B82F6" }}
              >
                Nop bai
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-[84px] pb-[130px] px-4 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8">
            <div className="mb-6 border-b border-slate-200 pb-4">
              <h1 className="text-xl lg:text-2xl font-extrabold text-slate-800">{exam?.eTitle ?? "VSTEP Full Skills Test"}</h1>
              <p className="text-sm text-slate-500 mt-1">
                Ky nang: {SKILL_LABELS[activeSkill] ?? activeSkill} - Part {activePart}
              </p>
              <p className="text-xs font-semibold mt-2" style={{ color: autoSaving ? "#CA8A04" : "#16A34A" }}>
                {autoSaving ? "Dang luu bai..." : "Da luu"}
              </p>
            </div>

            {activeSkill === "listening" && (
              <section className="space-y-5">
                <div className="text-sm leading-6 text-slate-700">
                  <p>
                    In this part, you will hear recordings once only. Read questions below and choose the best answer A, B, C or D.
                  </p>
                </div>
                <div className="rounded-md border border-violet-300 bg-violet-700 text-white p-2 flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayerRunning((prev) => !prev)}
                    disabled={playerSeconds <= 0}
                    className="w-7 h-7 rounded-sm bg-white/10 flex items-center justify-center disabled:opacity-40"
                  >
                    {isPlayerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white"
                      style={{ width: `${Math.max(0, 100 - (playerSeconds / Math.max(playerSeconds, 1)) * 100)}%` }}
                    />
                  </div>
                  <div className="font-bold min-w-[58px] text-right">
                    {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
                  </div>
                </div>

                <div className="space-y-5">
                  {currentPartQuestions.map((question: any, index: number) => {
                    const qKey = getQuestionId(question);
                    const selectedValue = answers[qKey] || "";
                    const options = getOptions(question);

                    return (
                      <article key={qKey || index} className="space-y-3">
                        <h3 className="text-base font-bold text-slate-800" dangerouslySetInnerHTML={{ __html: question.qContent ?? `Question ${index + 1}` }} />
                        <div className="space-y-1 text-slate-700">
                          {options.map((opt: any) => {
                            const isChecked = selectedValue === opt.value;
                            return (
                              <label key={opt.id} className="flex items-start gap-2 text-sm cursor-pointer">
                                <input
                                  type="radio"
                                  name={`q-${qKey}`}
                                  checked={isChecked}
                                  onChange={() => handleAnswerChange(question, opt.value)}
                                  className="mt-1"
                                />
                                <span dangerouslySetInnerHTML={{ __html: `${opt.label}. ${opt.content}` }} />
                              </label>
                            );
                          })}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {activeSkill === "reading" && (
              <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="rounded-lg border border-slate-200 p-5 text-[15px] leading-7 text-slate-700 max-h-[62vh] overflow-y-auto">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: currentPartQuestions[0]?.qPassage ?? "<p>Reading passage se hien thi o day.</p>",
                    }}
                  />
                </div>
                <div className="rounded-lg border border-slate-200 p-5 max-h-[62vh] overflow-y-auto space-y-5">
                  {currentPartQuestions.map((question: any, index: number) => {
                    const qKey = getQuestionId(question);
                    const selectedValue = answers[qKey] || "";
                    const options = getOptions(question);

                    return (
                      <article key={qKey || index}>
                        <h3 className="text-sm font-bold text-slate-800" dangerouslySetInnerHTML={{ __html: question.qContent ?? `Question ${index + 1}` }} />
                        <div className="space-y-2 mt-2">
                          {options.map((opt: any) => {
                            const isChecked = selectedValue === opt.value;
                            return (
                              <label
                                key={opt.id}
                                className="flex items-start gap-2 text-sm cursor-pointer p-2 rounded-md"
                                style={{ background: isChecked ? "#EEF2FF" : "#F8FAFC" }}
                              >
                                <input
                                  type="radio"
                                  name={`q-${qKey}`}
                                  checked={isChecked}
                                  onChange={() => handleAnswerChange(question, opt.value)}
                                  className="mt-1"
                                />
                                <span dangerouslySetInnerHTML={{ __html: `${opt.label}. ${opt.content}` }} />
                              </label>
                            );
                          })}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {activeSkill === "writing" && (
              <section className="space-y-6">
                {currentPartQuestions.map((question: any, index: number) => {
                  const qKey = getQuestionId(question);
                  const value = answers[qKey] || "";
                  const wc = value.trim() ? value.trim().split(/\s+/).length : 0;
                  const minWords = Number(question?.qWord_count ?? (getQuestionPart(question) === 1 ? 120 : 250));
                  return (
                    <article key={qKey || index} className="rounded-lg border border-slate-200 p-5 space-y-3">
                      <h3 className="font-bold text-slate-800">Part {getQuestionPart(question)}</h3>
                      <p className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: question.qContent ?? "" }} />
                      <div className="text-xs font-semibold" style={{ color: wc >= minWords ? "#16A34A" : "#CA8A04" }}>
                        Word count: {wc} / {minWords}+
                      </div>
                      <textarea
                        value={value}
                        onChange={(e) => handleAnswerChange(question, e.target.value)}
                        className="w-full min-h-[220px] rounded-md border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Nhap bai viet cua ban..."
                      />
                    </article>
                  );
                })}
              </section>
            )}

            {activeSkill === "speaking" && (
              <section className="space-y-6">
                {currentPartQuestions.map((question: any, index: number) => {
                  const qKey = getQuestionId(question);
                  const value = answers[qKey] || "";
                  return (
                    <article key={qKey || index} className="rounded-lg border border-slate-200 p-5 space-y-4">
                      <h3 className="font-bold text-slate-800">Part {getQuestionPart(question)}</h3>
                      <p className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: question.qContent ?? "" }} />
                      <div className="flex items-center gap-3">
                        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors">
                          <Mic className="w-4 h-4" /> Record
                        </button>
                        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-white bg-slate-700 hover:bg-slate-800 transition-colors">
                          <Play className="w-4 h-4" /> Play
                        </button>
                      </div>
                      <textarea
                        value={value}
                        onChange={(e) => handleAnswerChange(question, e.target.value)}
                        className="w-full min-h-[120px] rounded-md border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Ghi chu cau tra loi (neu can)..."
                      />
                    </article>
                  );
                })}
              </section>
            )}
          </div>
        </div>
      </main>

      {showBottomNav ? (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-300 bg-[#CBD5E1] px-3 py-2">
          <div className="max-w-[1600px] mx-auto flex flex-col gap-2">
            <div className="flex flex-wrap gap-1">
              {sections.map((section) => {
                const isActive = section.skill === activeSkill && section.part === activePart;
                return (
                  <button
                    key={`${section.skill}-${section.part}`}
                    onClick={() => goToSection(section.skill, section.part)}
                    className="px-2 py-1 rounded text-xs font-semibold transition-colors"
                    style={{
                      background: isActive ? "#F59E0B" : "#DBEAFE",
                      color: isActive ? "#1F2937" : "#1E3A8A",
                    }}
                  >
                    Part {section.part}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {SKILL_ORDER.map((skill) => (
                <div key={skill} className="px-3 py-1 rounded-md text-xs font-bold text-white" style={{ background: "#2563EB" }}>
                  {SKILL_LABELS[skill]} - {SKILL_DURATION[skill]}
                </div>
              ))}
              <button
                onClick={goNextSection}
                className="px-4 py-1.5 rounded-md text-white text-sm font-bold transition-opacity hover:opacity-90"
                style={{ background: "#3B82F6" }}
              >
                Tiep tuc
              </button>
              <button
                onClick={handleManualSave}
                className="px-4 py-1.5 rounded-md text-white text-sm font-bold transition-opacity hover:opacity-90"
                style={{ background: "#16A34A" }}
              >
                Luu bai
              </button>
              <button
                onClick={() => setShowBottomNav(false)}
                className="px-4 py-1.5 rounded-md text-blue-700 bg-blue-100 text-sm font-bold transition-colors hover:bg-blue-200"
              >
                An menu
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowBottomNav(true)}
          className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-md text-white font-bold"
          style={{ background: PURPLE }}
        >
          Hien menu
        </button>
      )}

      <SubmitDialog 
        open={showSubmit}
        total={questions.length}
        answered={answeredCount}
        onCancel={() => setShowSubmit(false)}
        onConfirm={() => submitMutation.mutate()}
        loading={submitMutation.isPending}
      />
    </div>
  );
}
