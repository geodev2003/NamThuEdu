import { useState, useEffect } from "react";
import {
  Headphones,
  Upload,
  Save,
  Plus,
  Trash2,
  Volume2,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { IELTS_STRUCTURE, IELTS_LISTENING_QUESTION_TYPES, type IeltsTestType } from "../structure";
import { api } from "../../../../../../services/api";

interface ListeningQuestion {
  id: string;
  questionNumber: number;
  questionType: string;
  questionText: string;
  options?: Record<string, string>;
  correctAnswer: string;
}

interface ListeningSection {
  sectionNumber: 1 | 2 | 3 | 4;
  audioUrl: string;
  audioFileName: string;
  transcript: string;
  questions: ListeningQuestion[];
}

interface Props {
  examId?: string;
  testType: IeltsTestType;
  initialData?: any;
  onSave: (data: any) => void;
}

const buildEmptySection = (n: 1 | 2 | 3 | 4): ListeningSection => {
  const start = (n - 1) * 10 + 1;
  return {
    sectionNumber: n,
    audioUrl: "",
    audioFileName: "",
    transcript: "",
    questions: Array.from({ length: 10 }, (_, i) => ({
      id: `s${n}-q${start + i}`,
      questionNumber: start + i,
      questionType: "multiple-choice",
      questionText: "",
      options: { A: "", B: "", C: "", D: "" },
      correctAnswer: "A",
    })),
  };
};

export function IeltsListeningEditor({ examId, initialData, onSave }: Props) {
  const [sections, setSections] = useState<ListeningSection[]>(() => {
    if (initialData?.sections) return initialData.sections;
    return [1, 2, 3, 4].map((n) => buildEmptySection(n as 1 | 2 | 3 | 4));
  });
  const [activeSection, setActiveSection] = useState<1 | 2 | 3 | 4>(1);
  const [uploadingSection, setUploadingSection] = useState<number | null>(null);

  const current = sections.find((s) => s.sectionNumber === activeSection)!;
  const partInfo = IELTS_STRUCTURE.listening.parts[activeSection - 1];

  const updateSection = (n: number, patch: Partial<ListeningSection>) => {
    setSections((prev) =>
      prev.map((s) => (s.sectionNumber === n ? { ...s, ...patch } : s))
    );
  };

  const updateQuestion = (
    secNum: number,
    qIdx: number,
    patch: Partial<ListeningQuestion>
  ) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.sectionNumber !== secNum) return s;
        const questions = [...s.questions];
        questions[qIdx] = { ...questions[qIdx], ...patch };
        return { ...s, questions };
      })
    );
  };

  const handleAudioUpload = async (file: File) => {
    if (!examId) {
      alert("Vui lòng đợi exam được tạo trước khi upload audio");
      return;
    }
    setUploadingSection(activeSection);
    try {
      const fd = new FormData();
      fd.append("audio", file);
      fd.append("section", String(activeSection));
      const res = await api.post(
        `/teacher/exams/${examId}/ielts/listening/sections/${activeSection}/audio`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const url = res.data?.audio_url || res.data?.data?.audio_url;
      if (url) {
        updateSection(activeSection, { audioUrl: url, audioFileName: file.name });
      }
    } catch (err: any) {
      console.error("Audio upload failed:", err);
      // Still set local URL as fallback (won't persist to server)
      const localUrl = URL.createObjectURL(file);
      updateSection(activeSection, { audioUrl: localUrl, audioFileName: file.name });
    } finally {
      setUploadingSection(null);
    }
  };

  const completedSections = sections.filter(
    (s) => s.audioUrl && s.questions.some((q) => q.questionText.trim())
  ).length;

  // Auto-save on section change
  useEffect(() => {
    onSave({ sections });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  return (
    <div className="space-y-5">
      {/* ── Section tabs ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-4 divide-x divide-gray-100">
          {sections.map((s) => {
            const isActive = s.sectionNumber === activeSection;
            const hasAudio = !!s.audioUrl;
            const filledQs = s.questions.filter((q) => q.questionText.trim()).length;
            return (
              <button
                key={s.sectionNumber}
                type="button"
                onClick={() => setActiveSection(s.sectionNumber)}
                className="px-4 py-3 text-left transition-all cursor-pointer relative"
                style={{
                  background: isActive ? "#EFF6FF" : "#FFFFFF",
                  borderBottom: isActive ? "3px solid #2563EB" : "3px solid transparent",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-xs font-bold"
                    style={{ color: isActive ? "#1D4ED8" : "#6B7280" }}
                  >
                    Section {s.sectionNumber}
                  </span>
                  {hasAudio && filledQs === 10 && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                  <Volume2 className="w-3 h-3" />
                  <span className={hasAudio ? "text-emerald-600 font-medium" : ""}>
                    {hasAudio ? "Audio ✓" : "Cần audio"}
                  </span>
                  <span className="text-gray-300">·</span>
                  <span>{filledQs}/10 câu</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section header ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Headphones className="w-4 h-4 text-blue-600" />
              {partInfo.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{partInfo.description}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600 tabular-nums">
              {current.questions.filter((q) => q.questionText.trim()).length}
              <span className="text-sm text-gray-400 font-normal">/10</span>
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">
              câu hoàn thành
            </p>
          </div>
        </div>

        {/* Audio upload */}
        <div
          className="rounded-xl p-4 border-2 border-dashed transition-all"
          style={{
            background: current.audioUrl ? "#F0FDF4" : "#F9FAFB",
            borderColor: current.audioUrl ? "#86EFAC" : "#E5E7EB",
          }}
        >
          {current.audioUrl ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Volume2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {current.audioFileName || "audio.mp3"}
                </p>
                <audio src={current.audioUrl} controls className="w-full mt-2 h-8" />
              </div>
              <button
                type="button"
                onClick={() =>
                  updateSection(activeSection, { audioUrl: "", audioFileName: "" })
                }
                className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-3 py-6 cursor-pointer hover:bg-gray-50 rounded-lg transition-all">
              {uploadingSection === activeSection ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Đang upload...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Tải lên audio cho Section {activeSection}
                  </span>
                  <span className="text-xs text-gray-400">(.mp3, .wav, .m4a)</span>
                </>
              )}
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleAudioUpload(f);
                }}
              />
            </label>
          )}
        </div>

        {/* Transcript (optional) */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
            Transcript (tuỳ chọn)
          </label>
          <textarea
            value={current.transcript}
            onChange={(e) =>
              updateSection(activeSection, { transcript: e.target.value })
            }
            placeholder="Dán transcript của audio vào đây để hỗ trợ chấm điểm..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
      </div>

      {/* ── Questions ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-gray-900">
            Câu hỏi {(activeSection - 1) * 10 + 1} – {activeSection * 10}
          </h4>
          <span className="text-xs text-gray-500">10 câu / section</span>
        </div>

        <div className="space-y-3">
          {current.questions.map((q, idx) => (
            <ListeningQuestionRow
              key={q.id}
              question={q}
              onChange={(patch) => updateQuestion(activeSection, idx, patch)}
            />
          ))}
        </div>
      </div>

      {/* ── Bottom progress ─────────────────────────────────── */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 p-4 sticky bottom-0">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1">
            {sections.map((s) => {
              const done =
                !!s.audioUrl && s.questions.every((q) => q.questionText.trim());
              return (
                <div
                  key={s.sectionNumber}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white"
                  style={{
                    background: done
                      ? "#10B981"
                      : s.sectionNumber === activeSection
                      ? "#2563EB"
                      : "#E5E7EB",
                    color: done || s.sectionNumber === activeSection ? "#FFF" : "#6B7280",
                  }}
                >
                  {s.sectionNumber}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-600 font-medium">
            {completedSections}/4 sections hoàn thành
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSave({ sections })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Lưu Listening
        </button>
      </div>
    </div>
  );
}

// ─── Question row ─────────────────────────────────────────────────────────
function ListeningQuestionRow({
  question,
  onChange,
}: {
  question: ListeningQuestion;
  onChange: (patch: Partial<ListeningQuestion>) => void;
}) {
  const isMcq = question.questionType === "multiple-choice";
  return (
    <div className="rounded-xl border border-gray-200 p-3 hover:border-blue-300 transition-all">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
          {question.questionNumber}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <select
              value={question.questionType}
              onChange={(e) => onChange({ questionType: e.target.value })}
              className="text-xs font-medium px-2 py-1 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {IELTS_LISTENING_QUESTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            value={question.questionText}
            onChange={(e) => onChange({ questionText: e.target.value })}
            placeholder="Nội dung câu hỏi..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          {isMcq && question.options ? (
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(question.options).filter((k) => k.length === 1) as string[])
                .sort()
                .map((k) => (
                <label
                  key={k}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md border border-gray-200 hover:border-blue-300 transition-all cursor-pointer text-xs"
                  style={{
                    background: question.correctAnswer === k ? "#ECFDF5" : "#FFFFFF",
                    borderColor: question.correctAnswer === k ? "#86EFAC" : "#E5E7EB",
                  }}
                >
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={question.correctAnswer === k}
                    onChange={() => onChange({ correctAnswer: k })}
                    className="w-3.5 h-3.5 accent-emerald-500"
                  />
                  <span className="font-bold text-gray-700">{k}.</span>
                  <input
                    type="text"
                    value={(question.options as any)![k] || ""}
                    onChange={(e) =>
                      onChange({
                        options: { ...question.options!, [k]: e.target.value } as any,
                      })
                    }
                    placeholder={`Đáp án ${k}`}
                    className="flex-1 bg-transparent text-xs outline-none"
                  />
                </label>
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={question.correctAnswer}
              onChange={(e) => onChange({ correctAnswer: e.target.value })}
              placeholder="Đáp án đúng (vd: TRUE / FALSE / NOT GIVEN, hoặc từ khóa)..."
              className="w-full px-3 py-2 text-sm border border-emerald-200 bg-emerald-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default IeltsListeningEditor;
