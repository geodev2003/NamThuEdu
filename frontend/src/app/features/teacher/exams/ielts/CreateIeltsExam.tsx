import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import {
  ArrowLeft,
  Save,
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  CheckCircle2,
  Sparkles,
  Loader2,
  ChevronRight,
  AlertTriangle,
  Info,
  Clock,
  FileText,
} from "lucide-react";
import { useToast } from "../../../../../hooks/useToast";
import { api } from "../../../../../services/api";
import {
  IELTS_STRUCTURE,
  IELTS_BAND,
  type IeltsSkill,
  type IeltsTestType,
} from "./structure";
import { IeltsListeningEditor } from "./editors/IeltsListeningEditor";
import { IeltsReadingEditor } from "./editors/IeltsReadingEditor";
import { IeltsWritingEditor } from "./editors/IeltsWritingEditor";
import { IeltsSpeakingEditor } from "./editors/IeltsSpeakingEditor";

// ─── Theme: clean professional dashboard, IELTS blue ────────────────────────
const IELTS_COLOR = "#0F4C81"; // IELTS official-ish blue
const IELTS_ACCENT = "#3B82F6";

// Default exam payload structure stored under exam.kids_exam_config / metadata
export interface IeltsExamPayload {
  test_type: IeltsTestType;
  skill: IeltsSkill;
  // Editor data is stored loosely so each skill editor can extend it.
  data: any;
}

// ─── Skill tab metadata ────────────────────────────────────────────────────
const SKILL_TABS: {
  key: IeltsSkill;
  label: string;
  icon: any;
  color: string;
  bg: string;
}[] = [
  { key: "listening", label: "Listening", icon: Headphones, color: "#2563EB", bg: "#EFF6FF" },
  { key: "reading", label: "Reading", icon: BookOpen, color: "#10B981", bg: "#ECFDF5" },
  { key: "writing", label: "Writing", icon: PenLine, color: "#F97316", bg: "#FFF7ED" },
  { key: "speaking", label: "Speaking", icon: Mic, color: "#A855F7", bg: "#FAF5FF" },
];

interface CreateIeltsExamProps {
  /** Single skill mode. When undefined → Full Test (all 4 skills as tabs). */
  initialSkill?: IeltsSkill;
}

export function CreateIeltsExam({ initialSkill }: CreateIeltsExamProps) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const { success, error } = useToast();

  // ── State ───────────────────────────────────────────────────────────────
  const isFullTest = !initialSkill;
  const [examId, setExamId] = useState<string | undefined>(params.examId);
  const [examTitle, setExamTitle] = useState<string>(
    (location.state as any)?.title || (isFullTest ? "IELTS Academic - Full Test" : `IELTS Academic - ${initialSkill}`)
  );
  const [examDescription, setExamDescription] = useState<string>((location.state as any)?.description || "");
  const [testType, setTestType] = useState<IeltsTestType>("Academic");
  const [activeSkill, setActiveSkill] = useState<IeltsSkill>(initialSkill || "listening");
  const [skillData, setSkillData] = useState<Record<IeltsSkill, any>>({
    listening: null,
    reading: null,
    writing: null,
    speaking: null,
  });
  const [skillCompleted, setSkillCompleted] = useState<Record<IeltsSkill, boolean>>({
    listening: false,
    reading: false,
    writing: false,
    speaking: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // ── Total duration ──────────────────────────────────────────────────────
  const totalDuration = useMemo(() => {
    if (!isFullTest) return IELTS_STRUCTURE[activeSkill].duration;
    return SKILL_TABS.reduce((acc, t) => acc + IELTS_STRUCTURE[t.key].duration, 0);
  }, [isFullTest, activeSkill]);

  const totalQuestions = useMemo(() => {
    if (!isFullTest) return IELTS_STRUCTURE[activeSkill].totalQuestions;
    return SKILL_TABS.reduce((acc, t) => acc + IELTS_STRUCTURE[t.key].totalQuestions, 0);
  }, [isFullTest, activeSkill]);

  // ── Auto-create draft exam if not yet ──────────────────────────────────
  useEffect(() => {
    let mounted = true;
    const createDraft = async () => {
      if (examId) return;
      try {
        const res = await api.post("/teacher/exams", {
          eTitle: examTitle,
          eDescription: examDescription,
          eType: "IELTS",
          eSkill: isFullTest ? "Mixed" : activeSkill,
          eDuration_minutes: totalDuration,
          eStatus: "draft",
          ePurpose: "exam",
          eDifficulty: "medium",
        });
        const newId = res.data?.data?.eId || res.data?.eId;
        if (mounted && newId) setExamId(String(newId));
      } catch (err) {
        console.warn("Failed to create draft IELTS exam:", err);
      }
    };
    createDraft();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Save current skill data ─────────────────────────────────────────────
  const handleSaveSkill = (skill: IeltsSkill, data: any) => {
    setSkillData((prev) => ({ ...prev, [skill]: data }));
    setSkillCompleted((prev) => ({ ...prev, [skill]: true }));
    success(`Đã lưu phần ${IELTS_STRUCTURE[skill].name}`);
  };

  // ── Publish ─────────────────────────────────────────────────────────────
  const handlePublish = async () => {
    if (!examId) {
      error("Chưa có exam ID — không thể xuất bản");
      return;
    }
    setIsPublishing(true);
    try {
      const payload = {
        eTitle: examTitle,
        eDescription: examDescription,
        eType: "IELTS",
        eSkill: isFullTest ? "Mixed" : activeSkill,
        eDuration_minutes: totalDuration,
        eStatus: "published",
        ielts_test_type: testType,
        ielts_data: skillData,
      };
      await api.post(`/teacher/exams/${examId}/publish`, payload);
      success("Đã xuất bản đề thi IELTS");
      setTimeout(() => navigate("/giao-vien/de-thi/de-thi-cua-toi"), 600);
    } catch (err: any) {
      error(err?.response?.data?.message || "Không thể xuất bản đề thi");
    } finally {
      setIsPublishing(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-[#F9FAFB] flex-col">
      {/* ── Top Bar ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-30"
        style={{ borderTopColor: IELTS_COLOR, borderTopWidth: 3 }}
      >
        <div className="flex items-center gap-4 min-w-0">
          <button
            type="button"
            onClick={() => navigate("/giao-vien/de-thi/tao-moi")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="min-w-0">
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="text-lg font-bold text-gray-900 bg-transparent border-0 outline-none focus:bg-blue-50 focus:px-2 rounded transition-all w-[440px] max-w-full truncate"
              placeholder="Tên đề thi IELTS..."
            />
            <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
              <span
                className="px-2 py-0.5 rounded-full font-bold text-white"
                style={{ background: IELTS_COLOR, fontSize: 10 }}
              >
                IELTS
              </span>
              <span>{isFullTest ? "Full Test" : IELTS_STRUCTURE[activeSkill].name}</span>
              <span className="text-gray-300">•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" /> {totalDuration} phút
              </span>
              <span className="text-gray-300">•</span>
              <span>{totalQuestions} câu</span>
              <span className="text-gray-300">•</span>
              <span>Band 0–9</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Test type selector — only relevant for Academic vs General */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-lg bg-gray-100">
            {(["Academic", "General Training"] as IeltsTestType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTestType(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  testType === t
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing || !examId}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm hover:shadow-md"
            style={{ background: `linear-gradient(135deg, ${IELTS_COLOR}, ${IELTS_ACCENT})` }}
          >
            {isPublishing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Xuất bản
          </button>
        </div>
      </div>

      {/* ── Skill Tabs (only Full Test mode) ─────────────────────────── */}
      {isFullTest && (
        <div className="bg-white border-b border-gray-200 px-6 sticky top-[73px] z-20">
          <div className="flex items-center gap-1 overflow-x-auto -mb-px">
            {SKILL_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSkill === tab.key;
              const completed = skillCompleted[tab.key];
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveSkill(tab.key)}
                  className="flex items-center gap-2 px-4 py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap text-sm font-semibold"
                  style={{
                    borderColor: isActive ? tab.color : "transparent",
                    color: isActive ? tab.color : "#6B7280",
                    background: isActive ? tab.bg : "transparent",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  <span className="text-[10px] opacity-70 font-normal">
                    {IELTS_STRUCTURE[tab.key].duration}'
                  </span>
                  {completed && (
                    <CheckCircle2
                      className="w-3.5 h-3.5"
                      style={{ color: "#10B981" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Editor Area ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* Test type info banner */}
          <div
            className="mb-5 p-4 rounded-xl flex items-start gap-3"
            style={{ background: `${IELTS_COLOR}08`, border: `1px solid ${IELTS_COLOR}22` }}
          >
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: IELTS_COLOR }} />
            <div className="flex-1">
              <p className="text-xs font-bold" style={{ color: IELTS_COLOR }}>
                IELTS {testType} • {IELTS_STRUCTURE[activeSkill].name} •{" "}
                {IELTS_STRUCTURE[activeSkill].duration} phút •{" "}
                {IELTS_STRUCTURE[activeSkill].totalQuestions}{" "}
                {activeSkill === "writing" ? "tasks" : "câu"}
              </p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                {activeSkill === "listening" &&
                  "4 sections × 10 câu. Mỗi section dùng audio riêng. Audio chỉ phát 1 lần khi thi thật."}
                {activeSkill === "reading" &&
                  IELTS_STRUCTURE.reading.variants?.[testType]}
                {activeSkill === "writing" &&
                  `Task 1 (≥150 từ, ~20p) + Task 2 (≥250 từ, ~40p). Đánh giá theo 4 tiêu chí: ${IELTS_STRUCTURE.writing.assessmentCriteria?.join(", ")}.`}
                {activeSkill === "speaking" &&
                  `3 parts: Interview, Long turn (cue card), Discussion. Đánh giá theo 4 tiêu chí: ${IELTS_STRUCTURE.speaking.assessmentCriteria?.join(", ")}.`}
              </p>
            </div>
          </div>

          {/* Active skill editor */}
          {activeSkill === "listening" && (
            <IeltsListeningEditor
              examId={examId}
              testType={testType}
              initialData={skillData.listening}
              onSave={(d) => handleSaveSkill("listening", d)}
            />
          )}
          {activeSkill === "reading" && (
            <IeltsReadingEditor
              examId={examId}
              testType={testType}
              initialData={skillData.reading}
              onSave={(d) => handleSaveSkill("reading", d)}
            />
          )}
          {activeSkill === "writing" && (
            <IeltsWritingEditor
              examId={examId}
              testType={testType}
              initialData={skillData.writing}
              onSave={(d) => handleSaveSkill("writing", d)}
            />
          )}
          {activeSkill === "speaking" && (
            <IeltsSpeakingEditor
              examId={examId}
              testType={testType}
              initialData={skillData.speaking}
              onSave={(d) => handleSaveSkill("speaking", d)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateIeltsExam;
