import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, BookOpen, CheckCircle, Mic, Pause, Play, Square, RotateCcw } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";
import { studentApi } from "../../../../services/studentApi";
import { IntroScreen } from "./components/IntroScreen";
import { useTranslation } from "react-i18next";

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#EDE9FE";
const PAGE_BG = "#E5E7EB";

const SKILL_LABELS: Record<string, string> = {
  listening: "Nghe",
  reading: "Đọc",
  writing: "Viết",
  speaking: "Nói",
};

const SKILL_ORDER = ["listening", "reading", "writing", "speaking"];

const SKILL_DURATION: Record<string, number> = {
  listening: 47,
  reading: 60,
  writing: 60,
  speaking: 12,
};

type Section = {
  skill: string;
  part: number;
  count: number;
};

type SpeakingMediaState = {
  url?: string;
  recording: boolean;
};

function formatClock(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

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
        qContent: "Solution Discussion (4 minutes): Choose one option and justify your choice.",
      },
      {
        id: "s3",
        qId: 9,
        qSkill: "speaking",
        qPart: 3,
        qContent: "Topic Development (5 minutes): Present your viewpoint and defend it with examples.",
      },
    ],
  };
}

function ensureVstepFullExam(exam: any) {
  if (!exam) return buildMockExam();

  const questions = Array.isArray(exam?.questions) ? exam.questions : [];
  const skillSet = new Set(questions.map((q: any) => getQuestionSkill(q)));
  const hasAllSkills = ["listening", "reading", "writing", "speaking"].every((s) => skillSet.has(s));

  if (hasAllSkills) return exam;

  const title = String(exam?.eTitle ?? exam?.exam_title ?? "").toLowerCase();
  const type = String(exam?.eType ?? exam?.exam_type ?? "").toLowerCase();
  const isVstep = title.includes("vstep") || type.includes("vstep");

  if (!isVstep) return exam;

  const fallback = buildMockExam();
  return {
    ...fallback,
    eTitle: exam?.eTitle ?? fallback.eTitle,
  };
}

function SubmitDialog({
  open,
  total,
  answered,
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean;
  total: number;
  answered: number;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const { t } = useTranslation();
  if (!open) return null;
  const unanswered = total - answered;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl mx-4" style={{ border: `1.5px solid ${PURPLE}20` }}>
        <div className="flex flex-col items-center text-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: unanswered > 0 ? "#FEF3C7" : "#D1FAE5" }}
          >
            {unanswered > 0 ? (
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            ) : (
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            )}
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1F1344" }}>
              {unanswered > 0 ? t("student.examTaking.unansweredTitle") : t("student.examTaking.readyTitle")}
            </h2>
            <p className="mt-2" style={{ fontSize: 14, color: "#6B7280" }}>
              {unanswered > 0
                ? t("student.examTaking.unansweredText", { count: unanswered })
                : t("student.examTaking.answeredText", { answered, total })}
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-semibold transition hover:bg-gray-200"
              style={{ background: "#F3F4F6", color: "#374151", fontSize: 15 }}
            >
              {t("student.examTaking.continue")}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: PURPLE, fontSize: 15 }}
            >
              {loading ? t("student.examTaking.submitting") : t("student.examTaking.submit")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestTaking() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const assignmentId = Number(id);
  const autoStart = useMemo(() => new URLSearchParams(location.search).get("autostart") === "1", [location.search]);

  const [submissionId, setSubmissionId] = useState<number | null>(null);
  const [exam, setExam] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeSkill, setActiveSkill] = useState<string>("listening");
  const [activePart, setActivePart] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmit, setShowSubmit] = useState(false);
  const [started, setStarted] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [autoSaving, setAutoSaving] = useState(false);
  const [playerSeconds, setPlayerSeconds] = useState(0);
  const [isPlayerRunning, setIsPlayerRunning] = useState(false);
  const [listeningPlayedSections, setListeningPlayedSections] = useState<Record<string, boolean>>({});
  const [speakingMediaMap, setSpeakingMediaMap] = useState<Record<string, SpeakingMediaState>>({});
  const [recordingQuestionId, setRecordingQuestionId] = useState<string | null>(null);
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);

  const examPrepData = useMemo(
    () => ({
      exam_title: `Bai thi VSTEP ID: #${assignmentId}`,
      exam_duration: exam?.eDuration_minutes ?? 120,
      total_questions: exam?.questions?.length ?? 40,
    }),
    [assignmentId, exam?.eDuration_minutes, exam?.questions?.length]
  );

  const questions = exam?.questions ?? [];

  const sections = useMemo<Section[]>(() => {
    const map = new Map<string, Section>();

    questions.forEach((q: any) => {
      const skill = getQuestionSkill(q);
      const part = getQuestionPart(q);
      const key = `${skill}-${part}`;
      if (!map.has(key)) {
        map.set(key, { skill, part, count: 0 });
      }
      map.get(key)!.count += 1;
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

  const activeSectionKey = `${activeSkill}-${activePart}`;
  const playerInitialSeconds = Number(currentPartQuestions[0]?.qAudio_duration ?? 420);

  const answeredCount = useMemo(
    () => Object.keys(answers).filter((k) => String(answers[k] ?? "").trim() !== "").length,
    [answers]
  );

  const answeredBySection = useMemo(() => {
    const map = new Map<string, number>();
    questions.forEach((q: any) => {
      const key = `${getQuestionSkill(q)}-${getQuestionPart(q)}`;
      const qid = getQuestionId(q);
      const val = String(answers[qid] ?? "").trim();
      if (!val) return;
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return map;
  }, [questions, answers]);

  const startMutation = useMutation({
    mutationFn: () => studentApi.startTest(assignmentId),
    onSuccess: (res: any) => {
      const data = res.data?.data;
      const rawExam = data?.exam ?? data?.assignment?.exam;
      const fetchedExam = ensureVstepFullExam(rawExam);
      setSubmissionId(data?.submissionId || 999);
      setExam(fetchedExam);
      const durationMinutes = Number(fetchedExam?.eDuration_minutes ?? fetchedExam?.exam_duration ?? 120);
      setTimeLeft(durationMinutes * 60);
      setStarted(true);
    },
    onError: () => {
      alert(t("student.examTaking.alertMockMode"));
      setSubmissionId(999);
      setExam(buildMockExam());
      setTimeLeft(120 * 60);
      setStarted(true);
    },
  });

  const saveAnswerMutation = useMutation({
    mutationFn: (p: { question_id: number; saAnswer_text: string }) =>
      studentApi.saveAnswer(submissionId!, { question_id: p.question_id, saAnswer_text: p.saAnswer_text } as any),
  });

  const submitMutation = useMutation({
    mutationFn: () => studentApi.submitTest(submissionId!),
    onSuccess: (res: any) => {
      const sid = res.data?.data?.submissionId ?? submissionId;
      navigate(`/ket-qua/${sid}`);
    },
    onError: () => {
      alert(t("student.examTaking.alertSubmitMock"));
      navigate(`/ket-qua/${submissionId ?? 999}`);
    },
  });

  const doAutoSave = useCallback(() => {
    setAutoSaving(true);
    setTimeout(() => setAutoSaving(false), 700);
  }, []);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;

    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          submitMutation.mutate();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [started, timeLeft, submitMutation]);

  useEffect(() => {
    if (!started) return;
    autoSaveRef.current = setInterval(doAutoSave, 30000);
    return () => clearInterval(autoSaveRef.current);
  }, [started, doAutoSave]);

  useEffect(() => {
    if (!sections.length) return;
    const found = sections.some((s) => s.skill === activeSkill && s.part === activePart);
    if (!found) {
      setActiveSkill(sections[0].skill);
      setActivePart(sections[0].part);
    }
  }, [sections, activeSkill, activePart]);

  useEffect(() => {
    if (activeSkill !== "listening") {
      setIsPlayerRunning(false);
      setPlayerSeconds(0);
      return;
    }

    const alreadyPlayed = listeningPlayedSections[activeSectionKey] === true;
    if (alreadyPlayed) {
      setPlayerSeconds(0);
      setIsPlayerRunning(false);
      return;
    }

    setPlayerSeconds(playerInitialSeconds);
    setIsPlayerRunning(false);
  }, [
    activeSkill,
    activePart,
    currentPartQuestions,
    listeningPlayedSections,
    activeSectionKey,
    playerInitialSeconds,
  ]);

  useEffect(() => {
    if (!isPlayerRunning || playerSeconds <= 0) return;

    const t = setInterval(() => {
      setPlayerSeconds((s) => {
        if (s <= 1) {
          clearInterval(t);
          setListeningPlayedSections((prev) => ({ ...prev, [activeSectionKey]: true }));
          setIsPlayerRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [isPlayerRunning, playerSeconds, activeSectionKey]);

  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      Object.values(speakingMediaMap).forEach((media) => {
        if (media.url) URL.revokeObjectURL(media.url);
      });
    };
  }, [speakingMediaMap]);

  const handleAnswerChange = (question: any, value: string) => {
    const qKey = getQuestionId(question);
    if (!qKey) return;

    setAnswers((prev) => ({ ...prev, [qKey]: value }));
    if (submissionId && question?.qId) {
      saveAnswerMutation.mutate({ question_id: Number(question.qId), saAnswer_text: value });
    }
  };

  const goToSection = (skill: string, part: number) => {
    setActiveSkill(skill);
    setActivePart(part);
  };

  const toggleListeningPlayback = () => {
    if (activeSkill !== "listening") return;
    if (listeningPlayedSections[activeSectionKey]) return;

    const mediaUrl = currentPartQuestions[0]?.qMedia_url as string | undefined;
    if (mediaUrl) {
      if (!audioPlayerRef.current || audioPlayerRef.current.src !== mediaUrl) {
        audioPlayerRef.current = new Audio(mediaUrl);
        audioPlayerRef.current.onended = () => {
          setIsPlayerRunning(false);
          setPlayerSeconds(0);
          setListeningPlayedSections((prev) => ({ ...prev, [activeSectionKey]: true }));
        };
      }
      if (!isPlayerRunning) {
        audioPlayerRef.current.play().catch(() => undefined);
      } else {
        audioPlayerRef.current.pause();
      }
    }
    setIsPlayerRunning((prev) => !prev);
  };

  const resetSectionAudio = () => {
    setListeningPlayedSections((prev) => ({ ...prev, [activeSectionKey]: false }));
    setPlayerSeconds(playerInitialSeconds);
    setIsPlayerRunning(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
  };

  const startSpeakingRecording = async (question: any) => {
    const qid = getQuestionId(question);
    if (!qid || recordingQuestionId) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      mediaChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          mediaChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(mediaChunksRef.current, { type: "audio/webm" });
        const nextUrl = URL.createObjectURL(blob);

        setSpeakingMediaMap((prev) => {
          const old = prev[qid]?.url;
          if (old) URL.revokeObjectURL(old);
          return { ...prev, [qid]: { url: nextUrl, recording: false } };
        });

        setRecordingQuestionId(null);
        handleAnswerChange(question, nextUrl);

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
          mediaStreamRef.current = null;
        }
      };

      setSpeakingMediaMap((prev) => ({ ...prev, [qid]: { ...prev[qid], recording: true } }));
      setRecordingQuestionId(qid);
      recorder.start();
    } catch {
      alert(t("student.examTaking.alertMicPermission"));
    }
  };

  const stopSpeakingRecording = (qid: string) => {
    if (recordingQuestionId !== qid) return;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const playSpeakingAudio = (qid: string) => {
    const url = speakingMediaMap[qid]?.url;
    if (!url) return;
    const a = new Audio(url);
    a.play().catch(() => undefined);
  };

  const goNextSection = () => {
    if (activeSectionIndex < 0 || activeSectionIndex >= sections.length - 1) return;
    const next = sections[activeSectionIndex + 1];
    goToSection(next.skill, next.part);
  };

  useEffect(() => {
    if (!autoStart || started || startMutation.isPending) return;
    startMutation.mutate();
  }, [autoStart, started, startMutation]);

  if (!started) {
    if (autoStart) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: PURPLE_LIGHT, borderTopColor: PURPLE }} />
        </div>
      );
    }
    return <IntroScreen examData={examPrepData} onStart={() => startMutation.mutate()} isLoading={startMutation.isPending} />;
  }

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
              {formatClock(timeLeft)}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <span className="text-xs font-semibold text-slate-700">Da tra loi: {answeredCount}/{questions.length}</span>
            <span className="text-xs font-semibold text-slate-700">{t("student.examTaking.answered", { answered: answeredCount, total: questions.length })}</span>
            <button
              onClick={() => setShowSubmit(true)}
              className="px-4 py-1.5 rounded-md text-white font-bold text-sm transition-opacity hover:opacity-90"
              style={{ background: "#3B82F6" }}
            >
              {t("student.examTaking.submit")}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-[84px] pb-[130px] px-4 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8">
            <div className="mb-6 border-b border-slate-200 pb-4">
              <h1 className="text-xl lg:text-2xl font-extrabold text-slate-800">{exam?.eTitle ?? "VSTEP Full Skills Test"}</h1>
              <p className="text-sm text-slate-500 mt-1">
                {t("student.examTaking.currentSkill")} {SKILL_LABELS[activeSkill] ?? activeSkill} - {t("student.examTaking.part")} {activePart}
              </p>
              <p className="text-xs font-semibold mt-2" style={{ color: autoSaving ? "#CA8A04" : "#16A34A" }}>
                {autoSaving ? t("student.examTaking.saving") : t("student.examTaking.saved")}
              </p>
            </div>

            {activeSkill === "listening" && (
              <section className="space-y-5">
                <p className="text-sm leading-6 text-slate-700">
                  {t("student.examTaking.listeningInstruction")}
                </p>

                <div className="rounded-md border border-violet-300 bg-violet-700 text-white p-2 flex items-center gap-3">
                  <button
                    onClick={toggleListeningPlayback}
                    disabled={playerSeconds <= 0 || listeningPlayedSections[activeSectionKey]}
                    className="w-7 h-7 rounded-sm bg-white/10 flex items-center justify-center disabled:opacity-40"
                  >
                    {isPlayerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <div className="text-sm font-semibold">{t("student.examTaking.audioOneTime")}</div>
                  <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, ((playerInitialSeconds - playerSeconds) / Math.max(1, playerInitialSeconds)) * 100))}%` }}
                    />
                  </div>
                  <div className="font-bold min-w-[60px] text-right">{formatClock(playerSeconds)}</div>
                  {listeningPlayedSections[activeSectionKey] && (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-white/20">{t("student.examTaking.audioFinished")}</span>
                  )}
                  <button
                    onClick={resetSectionAudio}
                    className="w-7 h-7 rounded-sm bg-white/10 flex items-center justify-center"
                    title="Reset audio for preview"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-5">
                  {currentPartQuestions.map((question: any, index: number) => {
                    const qKey = getQuestionId(question);
                    const selected = answers[qKey] ?? "";
                    const options = getOptions(question);

                    return (
                      <article key={qKey || index} className="space-y-2">
                        <h3 className="text-base font-bold text-slate-800" dangerouslySetInnerHTML={{ __html: question.qContent ?? `Question ${index + 1}` }} />
                        <div className="space-y-1">
                          {options.map((opt: any) => (
                            <label key={opt.id} className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
                              <input
                                type="radio"
                                className="mt-1"
                                checked={selected === opt.value}
                                onChange={() => handleAnswerChange(question, opt.value)}
                              />
                              <span dangerouslySetInnerHTML={{ __html: `${opt.label}. ${opt.content}` }} />
                            </label>
                          ))}
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
                  <div dangerouslySetInnerHTML={{ __html: currentPartQuestions[0]?.qPassage ?? "<p>Reading passage se hien thi o day.</p>" }} />
                </div>
                <div className="rounded-lg border border-slate-200 p-5 max-h-[62vh] overflow-y-auto space-y-5">
                  {currentPartQuestions.map((question: any, index: number) => {
                    const qKey = getQuestionId(question);
                    const selected = answers[qKey] ?? "";
                    const options = getOptions(question);

                    return (
                      <article key={qKey || index}>
                        <h3 className="text-sm font-bold text-slate-800" dangerouslySetInnerHTML={{ __html: question.qContent ?? `Question ${index + 1}` }} />
                        <div className="space-y-2 mt-2">
                          {options.map((opt: any) => (
                            <label
                              key={opt.id}
                              className="flex items-start gap-2 text-sm cursor-pointer p-2 rounded-md"
                              style={{ background: selected === opt.value ? "#EEF2FF" : "#F8FAFC" }}
                            >
                              <input
                                type="radio"
                                className="mt-1"
                                checked={selected === opt.value}
                                onChange={() => handleAnswerChange(question, opt.value)}
                              />
                              <span dangerouslySetInnerHTML={{ __html: `${opt.label}. ${opt.content}` }} />
                            </label>
                          ))}
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
                  const value = answers[qKey] ?? "";
                  const minWords = Number(question?.qWord_count ?? (getQuestionPart(question) === 1 ? 120 : 250));
                  const wc = value.trim() ? value.trim().split(/\s+/).length : 0;

                  return (
                    <article key={qKey || index} className="rounded-lg border border-slate-200 p-5 space-y-3">
                      <h3 className="font-bold text-slate-800">{t("student.examTaking.part")} {getQuestionPart(question)}</h3>
                      <p className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: question.qContent ?? "" }} />
                      <p className="text-xs font-semibold" style={{ color: wc >= minWords ? "#16A34A" : "#CA8A04" }}>
                        Word count: {wc} / {minWords}+
                      </p>
                      <textarea
                        value={value}
                        onChange={(e) => handleAnswerChange(question, e.target.value)}
                        className="w-full min-h-[220px] rounded-md border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder={t("student.examTaking.writePlaceholder")}
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
                  const value = answers[qKey] ?? "";

                  return (
                    <article key={qKey || index} className="rounded-lg border border-slate-200 p-5 space-y-4">
                      <h3 className="font-bold text-slate-800">{t("student.examTaking.part")} {getQuestionPart(question)}</h3>
                      <p className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: question.qContent ?? "" }} />
                      <div className="flex items-center gap-3">
                        {recordingQuestionId === qKey ? (
                          <button
                            onClick={() => stopSpeakingRecording(qKey)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                          >
                            <Square className="w-4 h-4" /> {t("student.examTaking.stop")}
                          </button>
                        ) : (
                          <button
                            onClick={() => startSpeakingRecording(question)}
                            disabled={recordingQuestionId !== null}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            <Mic className="w-4 h-4" /> {t("student.examTaking.record")}
                          </button>
                        )}
                        <button
                          onClick={() => playSpeakingAudio(qKey)}
                          disabled={!speakingMediaMap[qKey]?.url}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-white bg-slate-700 hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                          <Play className="w-4 h-4" /> {t("student.examTaking.play")}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">
                        {recordingQuestionId === qKey
                          ? t("student.examTaking.recording")
                          : speakingMediaMap[qKey]?.url
                          ? t("student.examTaking.recorded")
                          : t("student.examTaking.notRecorded")}
                      </p>
                      <textarea
                        value={value}
                        onChange={(e) => handleAnswerChange(question, e.target.value)}
                        className="w-full min-h-[120px] rounded-md border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder={t("student.examTaking.speakingNote")}
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
                const key = `${section.skill}-${section.part}`;
                const answeredSection = answeredBySection.get(key) ?? 0;
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
                    {t("student.examTaking.part")} {section.part} ({answeredSection}/{section.count})
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
                {t("student.examTaking.continue")}
              </button>
              <button
                onClick={doAutoSave}
                className="px-4 py-1.5 rounded-md text-white text-sm font-bold transition-opacity hover:opacity-90"
                style={{ background: "#16A34A" }}
              >
                {t("student.examTaking.save")}
              </button>
              <button
                onClick={() => setShowBottomNav(false)}
                className="px-4 py-1.5 rounded-md text-blue-700 bg-blue-100 text-sm font-bold transition-colors hover:bg-blue-200"
              >
                {t("student.examTaking.hideMenu")}
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
          {t("student.examTaking.showMenu")}
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
