import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  AlertTriangle, BookOpen, CheckCircle, Mic, Pause, Play, Square, 
  RotateCcw, ChevronRight, Volume2, FileText, Bookmark, BookmarkCheck 
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";
import { studentApi } from "../../../../services/studentApi";
import { IntroScreen } from "./components/IntroScreen";
import { useTranslation } from "react-i18next";

// VSTEP Structure - 4 Skills, 7 Parts
const VSTEP_STRUCTURE = {
  listening: {
    name: "Listening",
    icon: "🎧",
    color: "#3B82F6",
    lightBg: "#DBEAFE",
    parts: [
      { part: 1, name: "Announcements", questions: 8 },
      { part: 2, name: "Dialogues", questions: 12 },
      { part: 3, name: "Lectures", questions: 15 },
    ],
  },
  reading: {
    name: "Reading",
    icon: "📖",
    color: "#10B981",
    lightBg: "#D1FAE5",
    parts: [
      { part: 1, name: "Passage 1", questions: 10 },
      { part: 2, name: "Passage 2", questions: 10 },
      { part: 3, name: "Passage 3", questions: 10 },
      { part: 4, name: "Passage 4", questions: 10 },
    ],
  },
  writing: {
    name: "Writing",
    icon: "✍️",
    color: "#F59E0B",
    lightBg: "#FEF3C7",
    parts: [
      { part: 1, name: "Task 1", questions: 1, minWords: 150 },
      { part: 2, name: "Task 2", questions: 1, minWords: 250 },
    ],
  },
  speaking: {
    name: "Speaking",
    icon: "🗣️",
    color: "#8B5CF6",
    lightBg: "#EDE9FE",
    parts: [
      { part: 1, name: "Social Interaction", questions: 1 },
      { part: 2, name: "Solution Discussion", questions: 1 },
      { part: 3, name: "Topic Development", questions: 1 },
    ],
  },
};

type SkillType = keyof typeof VSTEP_STRUCTURE;

const STUDENT_BASE_PATH = "/hoc-vien";

function formatClock(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getQuestionId(question: any): string {
  return String(question?.qId ?? question?.id ?? "");
}

function getQuestionSkill(question: any): string {
  return String(question?.qSkill ?? question?.skill ?? "reading").toLowerCase();
}

function getQuestionPart(question: any): number {
  return Number(question?.qPart ?? question?.part ?? 1);
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

// Submit Dialog Component
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
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl mx-4" style={{ border: "1.5px solid #7C3AED20" }}>
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
              {unanswered > 0 ? "Còn câu chưa trả lời" : "Sẵn sàng nộp bài"}
            </h2>
            <p className="mt-2" style={{ fontSize: 14, color: "#6B7280" }}>
              {unanswered > 0
                ? `Bạn còn ${unanswered} câu chưa trả lời. Bạn có chắc muốn nộp bài?`
                : `Bạn đã trả lời ${answered}/${total} câu. Nộp bài ngay?`}
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-semibold transition hover:bg-gray-200"
              style={{ background: "#F3F4F6", color: "#374151", fontSize: 15 }}
            >
              Tiếp tục làm
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "#7C3AED", fontSize: 15 }}
            >
              {loading ? "Đang nộp..." : "Nộp bài"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestTakingVSTEP() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const assignmentId = Number(id);

  // State
  const [submissionId, setSubmissionId] = useState<number | null>(null);
  const [exam, setExam] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [currentSkill, setCurrentSkill] = useState<SkillType>("listening");
  const [currentPart, setCurrentPart] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmit, setShowSubmit] = useState(false);
  const [started, setStarted] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);

  const questions = exam?.questions ?? [];

  // Get questions for current skill and part
  const currentPartQuestions = useMemo(
    () => questions.filter((q: any) => getQuestionSkill(q) === currentSkill && getQuestionPart(q) === currentPart),
    [questions, currentSkill, currentPart]
  );

  // Calculate answered count
  const answeredCount = useMemo(
    () => Object.keys(answers).filter((k) => String(answers[k] ?? "").trim() !== "").length,
    [answers]
  );

  // Get answered count per part
  const getPartAnsweredCount = (skill: SkillType, part: number) => {
    const partQuestions = questions.filter((q: any) => getQuestionSkill(q) === skill && getQuestionPart(q) === part);
    return partQuestions.filter((q: any) => {
      const qid = getQuestionId(q);
      return String(answers[qid] ?? "").trim() !== "";
    }).length;
  };

  // Handle answer change
  const handleAnswerChange = (question: any, value: string) => {
    const qKey = getQuestionId(question);
    if (!qKey) return;

    setAnswers((prev) => ({ ...prev, [qKey]: value }));
    
    // Auto-save to server
    if (submissionId && question?.qId) {
      studentApi.saveAnswer(submissionId, { 
        question_id: Number(question.qId), 
        saAnswer_text: value 
      } as any).catch(console.error);
    }
  };

  // Toggle bookmark
  const toggleBookmark = (questionId: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  // Navigate to skill/part
  const goToSkillPart = (skill: SkillType, part: number) => {
    setCurrentSkill(skill);
    setCurrentPart(part);
  };

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: () => studentApi.submitTest(submissionId!),
    onSuccess: (res: any) => {
      const sid = res.data?.data?.submissionId ?? submissionId;
      navigate(`${STUDENT_BASE_PATH}/ket-qua/${sid}`);
    },
    onError: () => {
      alert("Lỗi nộp bài. Đang chuyển đến trang kết quả...");
      navigate(`${STUDENT_BASE_PATH}/ket-qua/${submissionId ?? 999}`);
    },
  });

  // Timer effect
  useEffect(() => {
    if (!started || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          submitMutation.mutate();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft, submitMutation]);

  // Mock start for now
  useEffect(() => {
    if (!started) {
      // Mock exam data
      const mockExam = {
        eTitle: "VSTEP B2 - Full Mock Test",
        eDuration_minutes: 179,
        questions: [
          // Listening Part 1
          ...Array.from({ length: 8 }, (_, i) => ({
            id: `l1-${i + 1}`,
            qId: i + 1,
            qSkill: "listening",
            qPart: 1,
            qContent: `Question ${i + 1}: What music will they have at the party?`,
            options: [
              { id: 1, label: "A", content: "guitar" },
              { id: 2, label: "B", content: "cello" },
              { id: 3, label: "C", content: "CDs" },
              { id: 4, label: "D", content: "piano" },
            ],
          })),
          // Reading Part 1
          ...Array.from({ length: 10 }, (_, i) => ({
            id: `r1-${i + 1}`,
            qId: 20 + i + 1,
            qSkill: "reading",
            qPart: 1,
            qPassage: "<p>Reading passage content here...</p>",
            qContent: `Question ${i + 1}: The word "it" in paragraph (A) refers to`,
            options: [
              { id: 1, label: "A", content: "99 percent" },
              { id: 2, label: "B", content: "species" },
              { id: 3, label: "C", content: "extinction" },
              { id: 4, label: "D", content: "environment" },
            ],
          })),
          // Writing Part 1
          {
            id: "w1-1",
            qId: 76,
            qSkill: "writing",
            qPart: 1,
            qContent: "Write an email responding to your friend (150 words minimum)",
            qWord_count: 150,
          },
          // Speaking Part 1
          {
            id: "s1-1",
            qId: 78,
            qSkill: "speaking",
            qPart: 1,
            qContent: "Social Interaction (3 minutes): Talk about your birthday",
          },
        ],
      };

      setExam(mockExam);
      setSubmissionId(999);
      setTimeLeft(179 * 60);
      setStarted(true);
    }
  }, [started]);

  if (!started) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: "#EDE9FE", borderTopColor: "#7C3AED" }} />
      </div>
    );
  }

  const skillData = VSTEP_STRUCTURE[currentSkill];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-gray-200 px-4 lg:px-6 shadow-sm">
        <div className="h-full max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-semibold text-gray-800">{exam?.eTitle}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Đã trả lời: <span className="font-bold text-gray-900">{answeredCount}/{questions.length}</span>
            </div>
            <div className="px-4 py-1.5 rounded-lg bg-blue-500 text-white font-mono font-bold text-lg">
              {formatClock(timeLeft)}
            </div>
            <button
              onClick={() => setShowSubmit(true)}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition"
            >
              Nộp bài
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Skill Tabs */}
          <div className="bg-white rounded-t-xl border border-gray-200 border-b-0 p-4">
            <div className="flex gap-2 overflow-x-auto">
              {(Object.keys(VSTEP_STRUCTURE) as SkillType[]).map((skill) => {
                const data = VSTEP_STRUCTURE[skill];
                const isActive = currentSkill === skill;
                return (
                  <button
                    key={skill}
                    onClick={() => goToSkillPart(skill, 1)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition whitespace-nowrap"
                    style={{
                      background: isActive ? data.lightBg : "#F9FAFB",
                      color: isActive ? data.color : "#6B7280",
                      border: `2px solid ${isActive ? data.color : "transparent"}`,
                    }}
                  >
                    <span className="text-lg">{data.icon}</span>
                    <span>{data.name.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Part Tabs */}
          <div className="bg-white border-x border-gray-200 p-4 border-t border-gray-100">
            <div className="flex gap-2 overflow-x-auto">
              {skillData.parts.map((partData) => {
                const isActive = currentPart === partData.part;
                const answeredInPart = getPartAnsweredCount(currentSkill, partData.part);
                const totalInPart = partData.questions;

                return (
                  <button
                    key={partData.part}
                    onClick={() => setCurrentPart(partData.part)}
                    className="flex flex-col items-start px-4 py-2.5 rounded-lg font-semibold text-sm transition min-w-[140px]"
                    style={{
                      background: isActive ? skillData.lightBg : "#FFFFFF",
                      border: `2px solid ${isActive ? skillData.color : "#E5E7EB"}`,
                      color: isActive ? skillData.color : "#374151",
                    }}
                  >
                    <span>Part {partData.part}</span>
                    <span className="text-xs font-normal text-gray-500">
                      {answeredInPart}/{totalInPart} câu
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-b-xl border border-gray-200 p-6 lg:p-8">
            <div className="flex gap-6">
              {/* Main Content */}
              <div className="flex-1">
                {/* Part Banner */}
                <div 
                  className="rounded-lg p-4 mb-6"
                  style={{ background: skillData.lightBg, borderLeft: `4px solid ${skillData.color}` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{skillData.icon}</span>
                    <div>
                      <h2 className="font-bold text-lg" style={{ color: skillData.color }}>
                        {skillData.name} - Part {currentPart}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {skillData.parts.find(p => p.part === currentPart)?.name} • {currentPartQuestions.length} câu hỏi
                      </p>
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-6">
                  {currentPartQuestions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      Không có câu hỏi trong phần này
                    </div>
                  ) : (
                    currentPartQuestions.map((question: any, index: number) => {
                      const qKey = getQuestionId(question);
                      const selected = answers[qKey] ?? "";
                      const isBookmarked = bookmarks.has(qKey);

                      // Render based on skill type
                      if (currentSkill === "listening" || currentSkill === "reading") {
                        const options = getOptions(question);
                        return (
                          <div key={qKey || index} className="border border-gray-200 rounded-lg p-5">
                            <div className="flex items-start justify-between mb-3">
                              <h3 
                                className="text-base font-bold text-gray-800 flex-1" 
                                dangerouslySetInnerHTML={{ __html: question.qContent ?? `Question ${index + 1}` }} 
                              />
                              <button
                                onClick={() => toggleBookmark(qKey)}
                                className="ml-3 p-1.5 rounded hover:bg-gray-100 transition"
                              >
                                {isBookmarked ? (
                                  <BookmarkCheck className="w-5 h-5 text-amber-500" />
                                ) : (
                                  <Bookmark className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                            <div className="space-y-2">
                              {options.map((opt: any) => (
                                <label
                                  key={opt.id}
                                  className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition"
                                  style={{
                                    background: selected === opt.value ? skillData.lightBg : "#F9FAFB",
                                    border: `2px solid ${selected === opt.value ? skillData.color : "#E5E7EB"}`,
                                  }}
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
                          </div>
                        );
                      }

                      if (currentSkill === "writing") {
                        const minWords = question.qWord_count || 150;
                        const wordCount = selected.trim().split(/\s+/).filter(Boolean).length;

                        return (
                          <div key={qKey || index} className="border border-gray-200 rounded-lg p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-base font-bold text-gray-800 mb-2">
                                  Task {currentPart}
                                </h3>
                                <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: question.qContent }} />
                              </div>
                              <button
                                onClick={() => toggleBookmark(qKey)}
                                className="ml-3 p-1.5 rounded hover:bg-gray-100 transition"
                              >
                                {isBookmarked ? (
                                  <BookmarkCheck className="w-5 h-5 text-amber-500" />
                                ) : (
                                  <Bookmark className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                            <div className="mb-2 text-sm">
                              <span className={wordCount >= minWords ? "text-green-600 font-semibold" : "text-gray-600"}>
                                {wordCount} từ
                              </span>
                              <span className="text-gray-400"> / {minWords} từ tối thiểu</span>
                            </div>
                            <textarea
                              value={selected}
                              onChange={(e) => handleAnswerChange(question, e.target.value)}
                              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Nhập câu trả lời của bạn..."
                            />
                          </div>
                        );
                      }

                      if (currentSkill === "speaking") {
                        return (
                          <div key={qKey || index} className="border border-gray-200 rounded-lg p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-base font-bold text-gray-800 mb-2">
                                  Part {currentPart}
                                </h3>
                                <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: question.qContent }} />
                              </div>
                              <button
                                onClick={() => toggleBookmark(qKey)}
                                className="ml-3 p-1.5 rounded hover:bg-gray-100 transition"
                              >
                                {isBookmarked ? (
                                  <BookmarkCheck className="w-5 h-5 text-amber-500" />
                                ) : (
                                  <Bookmark className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                              <button className="p-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition">
                                <Mic className="w-5 h-5" />
                              </button>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">Nhấn để ghi âm</p>
                                <p className="text-xs text-gray-500">Bạn có thể ghi âm nhiều lần</p>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })
                  )}
                </div>
              </div>

              {/* Question Navigator Sidebar */}
              <div className="w-64 flex-shrink-0">
                <div className="sticky top-24 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-sm text-gray-800 mb-3">Danh sách câu hỏi</h3>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {currentPartQuestions.map((q: any, idx: number) => {
                      const qid = getQuestionId(q);
                      const isAnswered = String(answers[qid] ?? "").trim() !== "";
                      const isBookmarked = bookmarks.has(qid);

                      return (
                        <button
                          key={qid}
                          className="w-10 h-10 rounded-lg font-semibold text-sm transition relative"
                          style={{
                            background: isAnswered ? "#10B981" : "#E5E7EB",
                            color: isAnswered ? "#FFFFFF" : "#6B7280",
                          }}
                        >
                          {idx + 1}
                          {isBookmarked && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-500" />
                      <span className="text-gray-600">Đã trả lời</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gray-300" />
                      <span className="text-gray-600">Chưa trả lời</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-500" />
                      <span className="text-gray-600">Đánh dấu</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Submit Dialog */}
      <SubmitDialog
        open={showSubmit}
        total={questions.length}
        answered={answeredCount}
        onConfirm={() => submitMutation.mutate()}
        onCancel={() => setShowSubmit(false)}
        loading={submitMutation.isPending}
      />
    </div>
  );
}
