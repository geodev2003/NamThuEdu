import { useState, useMemo, useEffect } from "react";
import { api } from "../../../../services/api";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import {
  ChevronRight,
  FileText,
  Clock,
  Hash,
  Save,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  Bot,
  Pencil,
  LayoutList,
  Target,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type VstepSkill = "listening" | "reading" | "writing" | "speaking";

interface Question {
  id: string;
  number: number;
  type: "multiple_choice" | "essay" | "fill_blank" | "true_false";
  skill?: VstepSkill;
  text: string;
  studentAnswer: string;
  correctAnswer?: string;
  aiScore?: number;      // AI-assigned score for subjective
  points: number;
  maxPoints: number;
  isCorrect?: boolean;
  feedback: string;
  autoGraded: boolean;
}

// ─── Skill config ─────────────────────────────────────────────────────────────
const VSTEP_SKILLS: Record<VstepSkill, { labelKey: string; emoji: string; color: string; bg: string; border: string; icon: typeof Headphones; subjective: boolean }> = {
  listening: { labelKey: "teacher.grading.detail.skills.listening", emoji: "🎧", color: "#F59E0B", bg: "#FEF3C7", border: "#FDE68A", icon: Headphones, subjective: false },
  reading:   { labelKey: "teacher.grading.detail.skills.reading",   emoji: "📖", color: "#0EA5E9", bg: "#E0F2FE", border: "#BAE6FD", icon: BookOpen,   subjective: false },
  writing:   { labelKey: "teacher.grading.detail.skills.writing",   emoji: "✍️", color: "#8B5CF6", bg: "#EDE9FE", border: "#DDD6FE", icon: PenTool,    subjective: true  },
  speaking:  { labelKey: "teacher.grading.detail.skills.speaking",  emoji: "�️", color: "#EC4899", bg: "#FCE7F3", border: "#FBCFE8", icon: Mic,        subjective: true  },
};

const Q_TYPE_CONFIG: Record<Question["type"], { labelKey: string; color: string; bg: string; icon: typeof LayoutList }> = {
  multiple_choice: { labelKey: "teacher.grading.detail.questionTypes.multiple_choice", color: "#6366F1", bg: "#EEF2FF", icon: LayoutList },
  essay:           { labelKey: "teacher.grading.detail.questionTypes.essay",           color: "#8B5CF6", bg: "#EDE9FE", icon: Pencil    },
  fill_blank:      { labelKey: "teacher.grading.detail.questionTypes.fill_blank",      color: "#0EA5E9", bg: "#E0F2FE", icon: Hash       },
  true_false:      { labelKey: "teacher.grading.detail.questionTypes.true_false",      color: "#F59E0B", bg: "#FEF3C7", icon: Target     },
};

// ─── Mock VSTEP data ──────────────────────────────────────────────────────────
const MOCK_VSTEP_QUESTIONS: Question[] = [
  // Listening
  { id: "L1", number: 1, type: "multiple_choice", skill: "listening", text: "What time does the train leave?", studentAnswer: "A. 9:30", correctAnswer: "A. 9:30", points: 1, maxPoints: 1, isCorrect: true, feedback: "", autoGraded: true },
  { id: "L2", number: 2, type: "multiple_choice", skill: "listening", text: "Where will the speakers meet?", studentAnswer: "B. At the library", correctAnswer: "C. At the café", points: 0, maxPoints: 1, isCorrect: false, feedback: "", autoGraded: true },
  { id: "L3", number: 3, type: "true_false",      skill: "listening", text: "The woman works at a hospital.", studentAnswer: "True", correctAnswer: "False", points: 0, maxPoints: 1, isCorrect: false, feedback: "", autoGraded: true },
  // Reading
  { id: "R1", number: 4, type: "multiple_choice", skill: "reading", text: "According to the passage, what is the main cause of deforestation?", studentAnswer: "C. Agricultural expansion", correctAnswer: "C. Agricultural expansion", points: 1, maxPoints: 1, isCorrect: true, feedback: "", autoGraded: true },
  { id: "R2", number: 5, type: "fill_blank",      skill: "reading", text: "The author uses the word '___' to describe the rapid loss of biodiversity.", studentAnswer: "alarming", correctAnswer: "alarming", points: 1, maxPoints: 1, isCorrect: true, feedback: "", autoGraded: true },
  { id: "R3", number: 6, type: "true_false",      skill: "reading", text: "The article claims renewable energy is currently more expensive than fossil fuels.", studentAnswer: "False", correctAnswer: "False", points: 1, maxPoints: 1, isCorrect: true, feedback: "", autoGraded: true },
  // Writing (subjective)
  { id: "W1", number: 7, type: "essay", skill: "writing", text: "Task 1: Describe the graph below about internet usage in Vietnam from 2015–2023. (150–180 words)", studentAnswer: "The graph shows that internet usage in Vietnam has increased significantly over the past 8 years. In 2015, only around 45% of the population had access to the internet. By 2023, this figure had risen to nearly 80%. The most notable growth occurred between 2017 and 2019 when the government invested heavily in infrastructure...", aiScore: 7.5, points: 0, maxPoints: 10, feedback: "", autoGraded: false },
  { id: "W2", number: 8, type: "essay", skill: "writing", text: "Task 2: Some people believe that technology makes people more isolated. Do you agree or disagree? (250–300 words)", studentAnswer: "Technology has become an integral part of modern life, and many argue that it creates social isolation. While I partially agree with this view, I believe the benefits outweigh the drawbacks when technology is used responsibly...", aiScore: 8.0, points: 0, maxPoints: 10, feedback: "", autoGraded: false },
  // Speaking (subjective)
  { id: "S1", number: 9, type: "essay", skill: "speaking", text: "Task 1: Talk about your hometown. Describe its location, climate, and what makes it special. (2–3 minutes)", studentAnswer: "[Transcript] My hometown is Da Nang, a coastal city in central Vietnam. It is located between Hue and Hoi An, making it a central hub for tourism. The climate is tropical, with a dry season from May to September and a rainy season from October to April. What makes Da Nang special is its beautiful beaches, particularly My Khe Beach, which is often ranked among the best in Asia...", aiScore: 7.0, points: 0, maxPoints: 10, feedback: "", autoGraded: false },
];

const MOCK_OTHER_QUESTIONS: Question[] = [
  { id: "1", number: 1, type: "multiple_choice", text: "What is the capital of Vietnam?", studentAnswer: "Hanoi", correctAnswer: "Hanoi", points: 10, maxPoints: 10, isCorrect: true, feedback: "", autoGraded: true },
  { id: "2", number: 2, type: "essay", text: "Write an essay about the importance of learning English in the modern world. (200-250 words)", studentAnswer: "Learning English is extremely important in today's globalized world. It helps us communicate with people from different countries and opens up many opportunities for career advancement...", points: 0, maxPoints: 20, feedback: "", autoGraded: false },
  { id: "3", number: 3, type: "fill_blank", text: "I ___ (go) to school every day.", studentAnswer: "go", correctAnswer: "go", points: 5, maxPoints: 5, isCorrect: true, feedback: "", autoGraded: true },
];

// ─── Score bar ────────────────────────────────────────────────────────────────
function MiniScoreBar({ score, max, color }: { score: number; max: number; color: string }) {
  const pct = Math.min((score / max) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-black w-10 text-right" style={{ color }}>{score.toFixed(1)}/10</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function GradingDetail() {
  const { t } = useTranslation();
  const { submissionId } = useParams();

  // ── Remote state ────────────────────────────────────────────────────────────
  const [pageLoading, setPageLoading] = useState(true);
  const [saveLoading, setSaveLoading]   = useState(false);
  const [exam,       setExam]           = useState({ title: "—", type: "VSTEP" });
  const [student,    setStudent]        = useState({ name: "—", avatar: "??", id: "" });
  const [submission, setSubmission]     = useState({ time: new Date(), attemptNumber: 1 });
  const isVstep = exam.type.toLowerCase().includes("vstep");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [overallFeedback, setOverallFeedback] = useState("");
  const [strengths] = useState<string[]>([]);
  const [improvements] = useState<string[]>([]);

  // Per-skill override scores (VSTEP)
  const [skillScores, setSkillScores]   = useState<Partial<Record<VstepSkill, string>>>({});
  const [skillFeedback, setSkillFeedback] = useState<Partial<Record<VstepSkill, string>>>({});

  // ── Fetch submission from API ────────────────────────────────────────────
  useEffect(() => {
    if (!submissionId) return;
    setPageLoading(true);
    api.get(`/teacher/submissions/${submissionId}`)
      .then((res: any) => {
        const d = res?.data?.data ?? res?.data;
        if (!d) return;

        // Student
        const uName: string = d.user?.uName ?? "Unknown";
        setStudent({
          name:   uName,
          avatar: uName.split(" ").pop()?.substring(0, 2).toUpperCase() ?? "?",
          id:     String(d.user?.uId ?? ""),
        });

        // Exam
        setExam({ title: d.exam?.eTitle ?? "—", type: d.exam?.eType ?? "General" });

        // Submission meta
        setSubmission({
          time:          d.sSubmit_time ? new Date(d.sSubmit_time) : new Date(),
          attemptNumber: d.sAttempt ?? 1,
        });

        // Overall feedback
        if (d.sTeacher_feedback) setOverallFeedback(d.sTeacher_feedback);

        // Pre-populate per-skill scores from Gemini feedback (same source as TeacherReviewModal)
        try {
          const vstepScores = JSON.parse(d.sGemini_feedback ?? "{}").vstep_scores ?? {};
          const initial: Partial<Record<VstepSkill, string>> = {};
          for (const sk of Object.keys(VSTEP_SKILLS) as VstepSkill[]) {
            const v = vstepScores[sk];
            if (v !== undefined && v !== null) initial[sk] = String(Number(v).toFixed(1));
          }
          if (Object.keys(initial).length > 0) setSkillScores(initial);
        } catch { /* no gemini feedback */ }

        // Build correct-answer lookup: qId → correct answer content
        const correctMap: Record<number, string> = {};
        for (const eq of (d.exam?.questions ?? [])) {
          const correct = (eq.answers ?? []).find((a: any) => a.aIs_correct);
          if (correct) correctMap[eq.qId] = correct.aContent;
        }

        // Map student answers → Question[]
        const qs: Question[] = (d.answers ?? []).map((sa: any, idx: number) => {
          const q = sa.question ?? {};
          const skill = (q.qSkill ?? "").toLowerCase() as VstepSkill;
          const isSubjective = skill === "writing" || skill === "speaking";
          const studentAns = sa.saAnswer_text ?? "";
          const correctKey  = correctMap[q.qId];
          // Use sa.saIs_correct (already computed by auto-grader)
          const isCorrect: boolean | undefined = isSubjective
            ? undefined
            : (sa.saIs_correct !== null && sa.saIs_correct !== undefined
               ? Boolean(sa.saIs_correct)
               : undefined);
          return {
            id:            String(q.qId ?? sa.saId ?? idx),
            number:        idx + 1,
            type:          isSubjective ? "essay" : "multiple_choice",
            skill,
            text:          q.qText ?? "",
            studentAnswer: studentAns,
            correctAnswer: isSubjective ? undefined : correctMap[q.qId],
            aiScore:       sa.saAi_score ?? undefined,
            points:        Number(sa.saPoints_awarded ?? 0),
            maxPoints:     isSubjective ? 10 : 1,
            isCorrect:     isCorrect as boolean | undefined,
            feedback:      sa.saTeacher_feedback ?? "",
            autoGraded:    !isSubjective,
          } satisfies Question;
        });
        setQuestions(qs);
      })
      .catch(() => {})
      .finally(() => setPageLoading(false));
  }, [submissionId]);

  // ── Save handler ────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!submissionId) return;
    setSaveLoading(true);
    const questionScores = questions.map((q) => ({
      question_id:      parseInt(q.id),
      saPoints_awarded: q.points,
    }));
    api.post(`/teacher/submissions/${submissionId}/grade`, {
      questionScores,
      sTeacher_feedback: overallFeedback,
    })
      .catch(() => {})
      .finally(() => setSaveLoading(false));
  };

  const updateSkillScore = (skill: VstepSkill, val: string) => setSkillScores((p) => ({ ...p, [skill]: val }));
  const updateSkillFeedback = (skill: VstepSkill, val: string) => setSkillFeedback((p) => ({ ...p, [skill]: val }));

  const updateQuestionPoints = (id: string, pts: number) =>
    setQuestions((prev) => prev.map((q) => q.id === id ? { ...q, points: Math.min(pts, q.maxPoints) } : q));
  const updateQuestionFeedback = (id: string, fb: string) =>
    setQuestions((prev) => prev.map((q) => q.id === id ? { ...q, feedback: fb } : q));

  // Group by skill for VSTEP
  const vstepGroups = useMemo(() => {
    if (!isVstep) return null;
    const groups: Partial<Record<VstepSkill, Question[]>> = {};
    for (const q of questions) {
      if (q.skill) {
        if (!groups[q.skill]) groups[q.skill] = [];
        groups[q.skill]!.push(q);
      }
    }
    return groups;
  }, [questions, isVstep]);

  // Scores
  const totalScore = questions.reduce((s, q) => s + q.points, 0);
  const maxScore   = questions.reduce((s, q) => s + q.maxPoints, 0);
  const gradedCount = questions.filter((q) => q.autoGraded || q.points > 0).length;
  const manualCount = questions.filter((q) => !q.autoGraded && q.points === 0).length;
  const pct = maxScore ? Math.round((totalScore / maxScore) * 100) : 0;
  const scoreColor = pct >= 80 ? "#10B981" : pct >= 60 ? "#F59E0B" : "#EF4444";

  // VSTEP skill computed scores (override → AI → objective sum)
  const vstepSkillScores = useMemo(() => {
    if (!vstepGroups) return {} as Record<VstepSkill, number>;
    const result: Record<string, number> = {};
    for (const sk of Object.keys(VSTEP_SKILLS) as VstepSkill[]) {
      const override = parseFloat(skillScores[sk] ?? "");
      if (!isNaN(override)) { result[sk] = override; continue; }
      const qs = vstepGroups[sk] ?? [];
      if (VSTEP_SKILLS[sk].subjective) {
        // Use average AI score of subjective questions
        const aiVals = qs.map((q) => q.aiScore).filter((v): v is number => v !== undefined);
        result[sk] = aiVals.length ? aiVals.reduce((a, b) => a + b, 0) / aiVals.length : 0;
      } else {
        // Objective: count correct answers / total * 10
        const correct = qs.filter((q) => q.isCorrect === true).length;
        result[sk] = qs.length ? Math.round((correct / qs.length) * 10 * 10) / 10 : 0;
      }
    }
    return result as Record<VstepSkill, number>;
  }, [vstepGroups, skillScores]);

  const vstepTotal = Object.values(vstepSkillScores).reduce((a, b) => a + b, 0) / 4;

  // ── Question card ─────────────────────────────────────────────────────────
  const QuestionCard = ({ question }: { question: Question }) => {
    const qt = Q_TYPE_CONFIG[question.type];
    const QtIcon = qt.icon;
    return (
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black" style={{ background: qt.bg, color: qt.color }}>
              {question.number}
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold" style={{ background: qt.bg, color: qt.color }}>
              <QtIcon className="w-3 h-3" />{t(qt.labelKey)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {question.autoGraded ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                <Bot className="w-3 h-3" />{t("teacher.grading.detail.autoGraded")}
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-50 text-violet-600 text-[11px] font-bold">
                <Pencil className="w-3 h-3" />{t("teacher.grading.detail.manual")}
              </span>
            )}
            {question.autoGraded && (
              question.isCorrect
                ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                : <XCircle className="w-4 h-4 text-rose-500" />
            )}
            <span className="text-sm font-black text-slate-700">
              {question.points}<span className="text-slate-300 font-normal text-xs">/{question.maxPoints}</span>
            </span>
          </div>
        </div>

        <div className="px-5 py-4 space-y-3">
          <p className="text-sm font-semibold text-slate-800 leading-relaxed">{question.text}</p>

          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t("teacher.grading.detail.studentAnswer")}</p>
            <div className={`px-4 py-2.5 rounded-xl text-sm border-l-4 ${question.isCorrect === false ? "bg-rose-50 border-rose-400 text-rose-800" : "bg-slate-50 border-violet-400 text-slate-700"}`}>
              {question.studentAnswer}
            </div>
          </div>

          {question.correctAnswer && question.isCorrect === false && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t("teacher.grading.detail.correctAnswer")}</p>
              <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border-l-4 border-emerald-400 text-sm text-emerald-800">
                {question.correctAnswer}
              </div>
            </div>
          )}

          {!question.autoGraded && (
            <>
              {question.aiScore !== undefined && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-100">
                  <Bot className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="text-xs text-amber-700">{t("teacher.grading.detail.aiScore")}: <strong>{question.aiScore}/10</strong></span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t("teacher.grading.detail.manual")}</p>
                  <div className="flex items-center gap-2">
                    <input type="number" min={0} max={question.maxPoints} value={question.points} onChange={(e) => updateQuestionPoints(question.id, parseFloat(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-violet-400" />
                    <span className="text-sm text-slate-400">/ {question.maxPoints}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t("teacher.grading.detail.quickGrade")}</p>
                  <div className="flex gap-2">
                    <button onClick={() => updateQuestionPoints(question.id, question.maxPoints)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5" />{t("teacher.grading.detail.pass")}
                    </button>
                    <button onClick={() => updateQuestionPoints(question.id, 0)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors">
                      <XCircle className="w-3.5 h-3.5" />{t("teacher.grading.detail.fail")}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t("teacher.grading.detail.questionFeedback")}</p>
            <textarea rows={2} value={question.feedback} onChange={(e) => updateQuestionFeedback(question.id, e.target.value)}
              placeholder={t("teacher.grading.detail.questionFeedbackPlaceholder")}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-slate-300" />
          </div>
        </div>
      </div>
    );
  };

  // ── Listening & Reading: collapsible state ────────────────────────────────
  const [expandedSkills, setExpandedSkills] = useState<Partial<Record<VstepSkill, boolean>>>({});
  const toggleSkill = (sk: VstepSkill) => setExpandedSkills((p) => ({ ...p, [sk]: !p[sk] }));

  // ── VSTEP skill section ───────────────────────────────────────────────────
  const VstepSkillSection = ({ skillKey }: { skillKey: VstepSkill }) => {
    const sk = VSTEP_SKILLS[skillKey];
    const SkIcon = sk.icon;
    const qs = vstepGroups?.[skillKey] ?? [];
    const computedScore = vstepSkillScores[skillKey] ?? 0;

    // ── Shared skill header ─────────────────────────────────────────────────
    const SkillHeader = ({ extra }: { extra?: React.ReactNode }) => (
      <div className="flex items-center justify-between px-5 py-3.5" style={{ background: sk.bg }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
            <SkIcon className="w-5 h-5" style={{ color: sk.color }} />
          </div>
          <div>
            <p className="text-sm font-black" style={{ color: sk.color }}>{t(sk.labelKey)}</p>
            <p className="text-[11px] text-slate-500">{qs.length} {sk.subjective ? t("teacher.grading.detail.taskLabel") : t("teacher.grading.detail.questionsLabel")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {extra}
          <div className="text-right">
            <p className="text-xs text-slate-400">{t("teacher.grading.detail.skillScore")}</p>
            <p className="text-lg font-black" style={{ color: sk.color }}>
              {computedScore.toFixed(1)}<span className="text-xs font-normal text-slate-400">/10</span>
            </p>
          </div>
        </div>
      </div>
    );

    // ══ LISTENING & READING — collapsible ══════════════════════════════════
    if (skillKey === "listening" || skillKey === "reading") {
      const isExpanded = !!expandedSkills[skillKey];
      const correctCount = qs.filter((q) => q.isCorrect).length;
      return (
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: sk.border }}>
          <SkillHeader
            extra={
              <button
                onClick={() => toggleSkill(skillKey)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                style={{ background: "rgba(255,255,255,0.7)", color: sk.color }}
              >
                {isExpanded ? (
                  <><EyeOff className="w-3.5 h-3.5" />{t("teacher.grading.detail.hideQuestions")}</>
                ) : (
                  <><Eye className="w-3.5 h-3.5" />{t("teacher.grading.detail.showQuestions")}</>
                )}
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            }
          />
          {/* Collapsed summary */}
          {!isExpanded && (
            <div className="px-5 py-3 bg-white border-t border-slate-50 flex items-center gap-3">
              <span className="text-sm font-bold text-slate-700">{t("teacher.grading.detail.correctSummary", { correct: correctCount, total: qs.length })}</span>
              <span className="text-[11px] text-slate-400">{t("teacher.grading.detail.viewHint")}</span>
              <div className="ml-auto flex gap-1.5">
                {qs.map((q) => (
                  <div
                    key={q.id}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: q.isCorrect ? "#10B981" : q.isCorrect === false ? "#EF4444" : "#E2E8F0" }}
                    title={`${t("teacher.grading.detail.question")} ${q.number}: ${q.isCorrect ? t("teacher.grading.detail.correct") : t("teacher.grading.detail.incorrect")}`}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Expanded questions */}
          {isExpanded && (
            <div className="p-4 space-y-3 bg-white">
              {qs.map((q) => <QuestionCard key={q.id} question={q} />)}
            </div>
          )}
        </div>
      );
    }

    // ══ WRITING & SPEAKING — document reader ════════════════════════════════
    if (skillKey === "writing" || skillKey === "speaking") {
      return (
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: sk.border }}>
          <SkillHeader
            extra={
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/70 text-[11px] font-bold" style={{ color: sk.color }}>
                <Bot className="w-3 h-3" />{t("teacher.grading.detail.subjectiveTag")}
              </span>
            }
          />

          <div className="bg-white divide-y divide-slate-50">
            {qs.map((q, idx) => (
              <div key={q.id} className="px-6 py-6 space-y-5">
                {/* Task label */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black text-white" style={{ background: sk.color }}>
                    {idx + 1}
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: sk.color }}>
                    Task {idx + 1}
                  </p>
                  {q.aiScore !== undefined && (
                    <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100">
                      <Bot className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs font-bold text-amber-700">AI: {q.aiScore}/10</span>
                    </div>
                  )}
                </div>

                {/* Prompt */}
                <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t("teacher.grading.detail.taskPrompt")}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{q.text}</p>
                </div>

                {/* Student essay / transcript */}
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {skillKey === "speaking" ? t("teacher.grading.detail.transcript") : t("teacher.grading.detail.studentEssay")}
                  </p>
                  <div
                    className="relative rounded-2xl border-l-4 px-6 py-5 text-sm leading-loose text-slate-700"
                    style={{ background: sk.bg + "55", borderLeftColor: sk.color }}
                  >
                    {/* Decorative quote mark */}
                    <span
                      className="absolute top-3 left-4 text-4xl font-black leading-none opacity-10 select-none"
                      style={{ color: sk.color }}
                    >"</span>
                    <p className="relative z-10 whitespace-pre-wrap">{q.studentAnswer}</p>
                  </div>
                </div>

                {/* Teacher grading panel */}
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="px-4 py-3 flex items-center gap-2" style={{ background: sk.bg }}>
                    <Star className="w-4 h-4" style={{ color: sk.color }} />
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: sk.color }}>
                      {t("teacher.grading.detail.teacherGrading")}
                    </p>
                  </div>
                  <div className="px-4 py-4 bg-white space-y-3">
                    {/* Per-question score (for this task) */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-[11px] text-slate-400 mb-1.5">{t("teacher.grading.detail.taskScoreLabel", { max: q.maxPoints })}</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="number" min={0} max={q.maxPoints} step={0.5}
                            value={q.points || ""}
                            onChange={(e) => updateQuestionPoints(q.id, parseFloat(e.target.value) || 0)}
                            placeholder={q.aiScore !== undefined ? t("teacher.grading.detail.aiSuggestion", { score: q.aiScore }) : t("teacher.grading.detail.feedbackPlaceholder")}
                            className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 placeholder:text-slate-300"
                            style={{ "--tw-ring-color": sk.color } as any}
                          />
                          <span className="text-sm text-slate-400 flex-shrink-0">/ {q.maxPoints}</span>
                        </div>
                      </div>
                      {q.aiScore !== undefined && (
                        <button
                          onClick={() => updateQuestionPoints(q.id, q.aiScore!)}
                          className="mt-5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors"
                          style={{ borderColor: sk.color + "55", color: sk.color, background: sk.bg }}
                        >
                          {t("teacher.grading.detail.useAiScore")}
                        </button>
                      )}
                    </div>

                    {/* Per-question feedback */}
                    <div>
                      <p className="text-[11px] text-slate-400 mb-1.5">{t("teacher.grading.detail.taskFeedback")}</p>
                      <textarea
                        rows={2}
                        value={q.feedback}
                        onChange={(e) => updateQuestionFeedback(q.id, e.target.value)}
                        placeholder={t("teacher.grading.detail.taskFeedbackPlaceholder")}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Skill-level override (average for the whole skill) */}
            <div className="px-6 py-4 space-y-3">
              <div className="h-px bg-slate-100" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: sk.bg }}>
                  <SkIcon className="w-3.5 h-3.5" style={{ color: sk.color }} />
                </div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {t("teacher.grading.detail.skillOverallTitle", { skill: t(sk.labelKey) })}
                </p>
                <span className="text-[10px] text-slate-400 ml-1">{t("teacher.grading.detail.skillOverrideHint")}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] text-slate-400 mb-1">{t("teacher.grading.detail.skillScoreLabel")}</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number" min={0} max={10} step={0.1}
                      value={skillScores[skillKey] ?? ""}
                      onChange={(e) => updateSkillScore(skillKey, e.target.value)}
                      placeholder={t("teacher.grading.detail.autoCalculated", { score: computedScore.toFixed(1) })}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 placeholder:text-slate-300"
                      style={{ "--tw-ring-color": sk.color } as any}
                    />
                    <span className="text-sm text-slate-400">/ 10</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 mb-1">{t("teacher.grading.detail.skillFeedbackLabel")}</p>
                  <textarea
                    rows={1}
                    value={skillFeedback[skillKey] ?? ""}
                    onChange={(e) => updateSkillFeedback(skillKey, e.target.value)}
                    placeholder={t("teacher.grading.detail.skillFeedbackPlaceholder", { skill: t(sk.labelKey) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ══ Fallback — flat question list ═══════════════════════════════════════
    return (
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: sk.border }}>
        <SkillHeader />
        <div className="p-4 space-y-3 bg-white">
          {qs.map((q) => <QuestionCard key={q.id} question={q} />)}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* ── Top bar ── */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-1.5 text-sm">
          <Link to="/giao-vien/cham-diem" className="text-violet-600 hover:text-violet-700 font-semibold">{t("teacher.grading.detail.breadcrumb")}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-700 font-semibold">{student.name}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-400 truncate max-w-[240px]">{exam.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/giao-vien/cham-diem" className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-4 h-4" />{t("teacher.grading.detail.back")}
          </Link>
          <button
            onClick={handleSave}
            disabled={saveLoading || pageLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold hover:from-violet-700 hover:to-purple-700 transition-all shadow-sm shadow-violet-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />{saveLoading ? "Đang lưu..." : t("teacher.grading.detail.saveGrades")}
          </button>
        </div>
      </div>

      {pageLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Đang tải...</span>
          </div>
        </div>
      ) : (
      <div className="flex-1 overflow-y-auto" style={{ background: "#EEEEF3" }}>
        <div className="px-6 py-5 space-y-5">

          {/* ── Hero card ── */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
            <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xl font-black flex-shrink-0">{student.avatar}</div>
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">{t("teacher.grading.detail.student")}</p>
                  <p className="text-base font-black text-slate-800">{student.name}</p>
                  <p className="text-xs text-slate-400">ID: {student.id}</p>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">{t("teacher.grading.detail.exam")}</p>
                <p className="text-sm font-bold text-slate-800 leading-snug mb-1.5">{exam.title}</p>
                <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-lg bg-violet-100 text-violet-700 text-[11px] font-bold">{exam.type}</span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">{t("teacher.grading.detail.submittedAt")}</p>
                <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {submission.time.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
                <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 text-[11px] font-bold">{t("teacher.grading.detail.attemptLabel")} {submission.attemptNumber}</span>
              </div>
            </div>
          </div>

          {/* ── Main 2-col ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* ── Content (left) ── */}
            <div className="lg:col-span-2 space-y-4">
              {isVstep && vstepGroups ? (
                /* VSTEP: render skill sections */
                (Object.keys(VSTEP_SKILLS) as VstepSkill[])
                  .filter((sk) => (vstepGroups[sk]?.length ?? 0) > 0)
                  .map((sk) => <VstepSkillSection key={sk} skillKey={sk} />)
              ) : (
                /* Non-VSTEP: flat question list */
                questions.map((q) => <QuestionCard key={q.id} question={q} />)
              )}

              {/* Overall feedback */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-violet-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t("teacher.grading.detail.overallFeedbackTitle")}</h3>
                </div>
                <textarea rows={4} value={overallFeedback} onChange={(e) => setOverallFeedback(e.target.value)}
                  placeholder={t("teacher.grading.detail.overallFeedbackPlaceholder")}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-slate-300 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />{t("teacher.grading.detail.strengths")}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {strengths.map((s, i) => <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">{s}</span>)}
                    </div>
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />{t("teacher.grading.detail.improvements")}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {improvements.map((s, i) => <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold">{s}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Sidebar (right) ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">

                {/* Score card */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4">{t("teacher.grading.detail.scoreSummary")}</p>

                  {isVstep ? (
                    /* VSTEP: 4-skill breakdown + average */
                    <div className="space-y-3">
                      {(Object.keys(VSTEP_SKILLS) as VstepSkill[]).map((sk) => {
                        const s = VSTEP_SKILLS[sk];
                        const SIcon = s.icon;
                        const score = vstepSkillScores[sk] ?? 0;
                        return (
                          <div key={sk} className="rounded-xl p-3" style={{ background: s.bg }}>
                            <div className="flex items-center gap-2 mb-2">
                              <SIcon className="w-4 h-4 flex-shrink-0" style={{ color: s.color }} />
                              <span className="text-xs font-bold text-slate-700">{t(s.labelKey)}</span>
                              {skillScores[sk] && <span className="ml-auto text-[10px] bg-white/80 text-violet-600 font-bold px-1.5 py-0.5 rounded-md">{t("teacher.grading.detail.overridden")}</span>}
                            </div>
                            <MiniScoreBar score={score} max={10} color={s.color} />
                          </div>
                        );
                      })}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t("teacher.grading.detail.averageScore")}</span>
                        <span className="text-2xl font-black" style={{ color: scoreColor }}>{vstepTotal.toFixed(2)}<span className="text-sm font-normal text-slate-400">/10</span></span>
                      </div>
                    </div>
                  ) : (
                    /* Non-VSTEP: classic score display */
                    <>
                      <div className="text-center mb-5">
                        <div className="text-6xl font-black mb-0.5" style={{ color: scoreColor }}>{totalScore}</div>
                        <div className="text-sm text-slate-400 mb-3">/ {maxScore} {t("teacher.grading.detail.points")}</div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: scoreColor }} />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{pct}% {t("teacher.grading.detail.totalPct")}</p>
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: t("teacher.grading.detail.gradedCount"),   value: gradedCount,      color: "#10B981", bg: "#D1FAE5", icon: CheckCircle2 },
                          { label: t("teacher.grading.detail.manualNeeded"),  value: manualCount,      color: "#F59E0B", bg: "#FEF3C7", icon: Clock },
                          { label: t("teacher.grading.detail.totalQuestions"),value: questions.length, color: "#6366F1", bg: "#EEF2FF", icon: Hash },
                          { label: t("teacher.grading.detail.maxScore"),       value: maxScore,         color: "#8B5CF6", bg: "#EDE9FE", icon: FileText },
                        ].map(({ label, value, color, bg, icon: Icon }) => (
                          <div key={label} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: bg }}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                              <span className="text-xs font-semibold text-slate-700">{label}</span>
                            </div>
                            <span className="text-sm font-black" style={{ color }}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Save CTA */}
                <button
                  onClick={handleSave}
                  disabled={saveLoading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />{saveLoading ? "Đang lưu..." : t("teacher.grading.detail.saveGradesBtn")}
                </button>
                <p className="text-center text-[11px] text-slate-400">{t("teacher.grading.detail.saveReminder")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}