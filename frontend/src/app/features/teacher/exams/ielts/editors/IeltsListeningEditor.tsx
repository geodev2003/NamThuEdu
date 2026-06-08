import { useState, useEffect, useRef, memo, useCallback } from "react";
import {
  Headphones,
  Upload,
  Trash2,
  Volume2,
  Loader2,
  CheckCircle2,
  Wand2,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { IELTS_STRUCTURE, IELTS_LISTENING_QUESTION_TYPES, type IeltsTestType } from "../structure";
import { api } from "../../../../../../services/api";
import { transcribeLocal } from "../../../../../../services/whisperLocal";

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
  sectionTitle?: string;
  sectionInstruction?: string;
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
    sectionTitle: "",
    sectionInstruction: "",
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
    const empty = [1, 2, 3, 4].map((n) => buildEmptySection(n as 1 | 2 | 3 | 4));
    if (!initialData?.sections) return empty;
    // Normalize incoming sections để tránh field null gây React warning
    // (vd transcript=null từ backend → textarea phàn nàn).
    return empty.map((emptySec) => {
      const incoming = initialData.sections.find(
        (s: any) => s.sectionNumber === emptySec.sectionNumber
      );
      if (!incoming) return emptySec;
      return {
        ...emptySec,
        ...incoming,
        sectionTitle: incoming.sectionTitle ?? "",
        sectionInstruction: incoming.sectionInstruction ?? "",
        audioUrl: incoming.audioUrl ?? "",
        audioFileName: incoming.audioFileName ?? "",
        transcript: incoming.transcript ?? "",
        questions: (incoming.questions ?? emptySec.questions).map((q: any) => {
          const isMcq = (q.questionType ?? "multiple-choice") === "multiple-choice";
          // MCQ mà chưa có đáp án → mặc định chọn "A" để phòng giáo viên quên chọn.
          const correctAnswer =
            q.correctAnswer ?? (isMcq ? "A" : "");
          return {
            ...q,
            questionText: q.questionText ?? "",
            correctAnswer: isMcq && !correctAnswer.trim() ? "A" : correctAnswer,
            options: q.options ?? { A: "", B: "", C: "", D: "" },
          };
        }),
      };
    });
  });
  const [activeSection, setActiveSection] = useState<1 | 2 | 3 | 4>(1);
  const [uploadingSection, setUploadingSection] = useState<number | null>(null);
  const [transcribingSection, setTranscribingSection] = useState<number | null>(null);
  const [modelLoadingPct, setModelLoadingPct] = useState<number | null>(null);
  const [transcribeError, setTranscribeError] = useState<string | null>(null);
  const [enableDiarization, setEnableDiarization] = useState(true);
  const autoSaveTimerRef = useRef<number | null>(null);

  // AI suggest đáp án (Groq) — track per section
  const [suggestingSection, setSuggestingSection] = useState<number | null>(null);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  // Bộ section đã có suggestion từ AI → hiện banner cảnh báo
  const [aiSuggestedSections, setAiSuggestedSections] = useState<Set<number>>(new Set());

  const current = sections.find((s) => s.sectionNumber === activeSection)!;
  const partInfo = IELTS_STRUCTURE.listening.parts[activeSection - 1];

  const updateSection = useCallback(
    (n: number, patch: Partial<ListeningSection>) => {
      setSections((prev) =>
        prev.map((s) => (s.sectionNumber === n ? { ...s, ...patch } : s))
      );
    },
    []
  );

  const updateQuestion = useCallback(
    (secNum: number, qIdx: number, patch: Partial<ListeningQuestion>) => {
      setSections((prev) =>
        prev.map((s) => {
          if (s.sectionNumber !== secNum) return s;
          const questions = [...s.questions];
          questions[qIdx] = { ...questions[qIdx], ...patch };
          return { ...s, questions };
        })
      );
    },
    []
  );

  const handleAudioUpload = async (file: File) => {
    if (!examId) {
      alert("Vui lòng đợi exam được tạo trước khi upload audio");
      return;
    }
    setUploadingSection(activeSection);
    let uploadedUrl = "";
    try {
      const fd = new FormData();
      fd.append("audio", file);
      fd.append("section", String(activeSection));
      const res = await api.post(
        `/teacher/exams/${examId}/ielts/listening/sections/${activeSection}/audio`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      uploadedUrl = res.data?.audio_url || res.data?.data?.audio_url || "";
      if (uploadedUrl) {
        updateSection(activeSection, { audioUrl: uploadedUrl, audioFileName: file.name });
      }
    } catch (err: any) {
      console.error("Audio upload failed:", err);
      // Fallback: dùng object URL local — vẫn cho transcribe được
      uploadedUrl = URL.createObjectURL(file);
      updateSection(activeSection, { audioUrl: uploadedUrl, audioFileName: file.name });
    } finally {
      setUploadingSection(null);
    }

    // Auto STT: nếu section chưa có transcript thì tự động chạy
    const currentTranscript = sections.find((s) => s.sectionNumber === activeSection)?.transcript || "";
    if (!currentTranscript.trim()) {
      void runTranscribe(file, activeSection);
    }
  };

  /**
   * Chạy Speech-to-Text bằng Whisper LOCAL (transformers.js).
   * Free, không cần API key. Lần đầu sẽ tải model (~40MB) cache offline.
   *
   * Nếu enableDiarization = true: sau khi có text, gửi lên backend Groq LLM
   * để phân tách speaker A/B dựa trên ngữ nghĩa (chính xác hơn pitch).
   */
  const runTranscribe = async (file: File, sectionNum: 1 | 2 | 3 | 4) => {
    setTranscribingSection(sectionNum);
    setTranscribeError(null);
    let lastUpdate = 0;
    let lastPctRef = -1;
    try {
      const onProgress = (info: any) => {
        if (info.status === "progress" && typeof info.progress === "number") {
          const pct = Math.round(info.progress);
          const now = Date.now();
          if (pct !== lastPctRef && now - lastUpdate > 100) {
            lastPctRef = pct;
            lastUpdate = now;
            setModelLoadingPct(pct);
          }
        } else if (info.status === "done" || info.status === "ready") {
          setModelLoadingPct(null);
        }
      };

      // Step 1: Whisper local → raw text
      const rawText = await transcribeLocal(file, { language: "en", onProgress });
      setModelLoadingPct(null);

      if (!rawText) {
        setTranscribeError("Whisper không trả về text. Vui lòng nhập thủ công.");
        return;
      }

      // Step 2: Diarize nếu bật (gọi Groq qua backend)
      let finalText = rawText;
      if (enableDiarization && rawText.split(/\s+/).length > 10) {
        try {
          const res = await api.post("/teacher/ielts/diarize-transcript", {
            transcript: rawText,
            max_speakers: 2,
          });
          const lines = res.data?.data?.speaker_lines;
          if (Array.isArray(lines) && lines.length > 0) {
            // Kiểm tra có thật sự > 1 speaker
            const hasBoth = lines.some((l: string) => l.startsWith("A:")) &&
                            lines.some((l: string) => l.startsWith("B:"));
            if (hasBoth) {
              finalText = lines.join("\n");
            }
          }
        } catch (dErr: any) {
          // Groq fail → vẫn dùng raw text, không block user
          console.warn("Diarize failed, using raw transcript:", dErr?.message);
        }
      }

      updateSection(sectionNum, { transcript: finalText });

      // Auto: nếu section có câu hỏi mà chưa có đáp án → tự gợi ý 1 lượt từ
      // transcript vừa tạo. Silent = không spam lỗi nếu AI không tìm được.
      const secNow = sections.find((s) => s.sectionNumber === sectionNum);
      const hasQuestions = secNow?.questions.some((q) => q.questionText?.trim());
      const missingAnswers = secNow?.questions.some(
        (q) => q.questionText?.trim() && !q.correctAnswer?.trim()
      );
      if (hasQuestions && missingAnswers) {
        void suggestAnswersForSection(sectionNum, finalText, true);
      }
    } catch (err: any) {
      console.error("Transcribe failed:", err);
      setModelLoadingPct(null);
      setTranscribeError(
        err?.message?.includes("scale")
          ? "Model AI gặp sự cố tương thích. Vui lòng nhập transcript thủ công."
          : err?.message || "Không thể tự động chuyển audio thành text. Vui lòng nhập thủ công."
      );
    } finally {
      setTranscribingSection(null);
    }
  };

  /**
   * Cho phép user chủ động re-run STT từ audio đã upload (re-fetch file qua URL).
   */
  const handleManualTranscribe = async () => {
    if (!current.audioUrl) return;
    setTranscribingSection(activeSection);
    setTranscribeError(null);
    try {
      const resp = await fetch(current.audioUrl);
      const blob = await resp.blob();
      const fileName = current.audioFileName || "audio.mp3";
      const file = new File([blob], fileName, { type: blob.type || "audio/mpeg" });
      await runTranscribe(file, activeSection);
    } catch (err: any) {
      console.error("Manual transcribe failed:", err);
      setTranscribeError("Không thể tải lại file audio. Vui lòng upload lại.");
      setTranscribingSection(null);
    }
  };

  /**
   * Core: gợi ý đáp án bằng Groq cho 1 section cụ thể.
   * Dùng được cả khi user bấm nút lẫn auto sau khi transcribe xong.
   * @param sectionNum section cần điền
   * @param transcript transcript để AI suy đáp án (truyền explicit để dùng ngay
   *        sau transcribe, không phải chờ setState)
   * @param silent true = không set error khi không tìm được (dùng cho auto-flow)
   */
  const suggestAnswersForSection = async (
    sectionNum: 1 | 2 | 3 | 4,
    transcript: string,
    silent = false
  ) => {
    const sec = sections.find((s) => s.sectionNumber === sectionNum);
    if (!sec) return;
    if (!transcript?.trim()) {
      if (!silent) setSuggestError("Cần có transcript trước khi AI gợi ý đáp án.");
      return;
    }
    const questionsWithText = sec.questions.filter((q) => q.questionText?.trim());
    if (questionsWithText.length === 0) {
      if (!silent)
        setSuggestError("Cần có nội dung câu hỏi trước khi AI gợi ý đáp án.");
      return;
    }

    setSuggestingSection(sectionNum);
    setSuggestError(null);
    try {
      const payload = {
        skill: "listening",
        context: transcript,
        questions: questionsWithText.map((q) => ({
          number: q.questionNumber,
          text: q.questionText,
          type: q.questionType,
          options: q.options,
        })),
      };
      const res = await api.post("/teacher/ielts/suggest-answers", payload);
      const answers = res.data?.data?.answers || [];
      // eslint-disable-next-line no-console
      console.log(`[AI Suggest] section ${sectionNum} →`, answers);
      if (!Array.isArray(answers) || answers.length === 0) {
        throw new Error("AI không trả về đáp án nào.");
      }

      const emptyCount = answers.filter((a: any) => {
        const v = a?.answer;
        return v == null || String(v).trim() === "";
      }).length;

      const byNumber = new Map<number, string>();
      answers.forEach((a: any) => {
        const n = Number(a?.number);
        if (Number.isFinite(n) && a?.answer != null && String(a.answer).trim() !== "") {
          byNumber.set(n, String(a.answer).trim());
        }
      });

      let appliedCount = 0;
      setSections((prev) =>
        prev.map((s) => {
          if (s.sectionNumber !== sectionNum) return s;
          const askedQs = s.questions.filter((q) => q.questionText?.trim());
          const useIndexFallback =
            byNumber.size === 0 && answers.length === askedQs.length;
          const updatedQuestions = s.questions.map((q) => {
            const ansByNum = byNumber.get(q.questionNumber);
            if (ansByNum) {
              appliedCount++;
              return { ...q, correctAnswer: ansByNum };
            }
            if (useIndexFallback) {
              const idx = askedQs.findIndex((x) => x.id === q.id);
              const a = answers[idx];
              if (a?.answer && String(a.answer).trim() !== "") {
                appliedCount++;
                return { ...q, correctAnswer: String(a.answer).trim() };
              }
            }
            return q;
          });
          return { ...s, questions: updatedQuestions };
        })
      );

      if (appliedCount === 0) {
        if (!silent) {
          if (emptyCount === answers.length) {
            setSuggestError(
              "AI không tìm thấy đáp án nào trong transcript. " +
                "Transcript hiện tại có thể không đúng audio gốc của đề (vd: dùng audio test)."
            );
          } else {
            setSuggestError(
              `AI trả về ${answers.length} đáp án nhưng không match được câu hỏi nào. ` +
                `Kiểm tra Console để xem chi tiết.`
            );
          }
        }
      } else {
        setAiSuggestedSections((prev) => {
          const next = new Set(prev);
          next.add(sectionNum);
          return next;
        });
        if (emptyCount > 0 && !silent) {
          setSuggestError(
            `Đã điền ${appliedCount}/${answers.length} câu. ` +
              `${emptyCount} câu AI không xác định được — bạn cần điền thủ công.`
          );
        }
      }
    } catch (err: any) {
      if (!silent) {
        setSuggestError(
          err?.response?.data?.message ||
            err?.message ||
            "Không thể gợi ý đáp án. Vui lòng thử lại."
        );
      } else {
        console.warn("Auto-suggest failed:", err?.message);
      }
    } finally {
      setSuggestingSection(null);
    }
  };

  /** Nút bấm tay: gợi ý cho section hiện tại từ transcript đã có. */
  const handleSuggestAnswers = () =>
    suggestAnswersForSection(activeSection, current.transcript || "");

  const completedSections = sections.filter(
    (s) => s.audioUrl && s.questions.some((q) => q.questionText.trim())
  ).length;

  // Debounced auto-save: chờ 1.5s sau lần cuối cùng sections thay đổi.
  // Không save khi đang transcribe để tránh spam HTTP + lag giao diện.
  useEffect(() => {
    // Bỏ qua khi đang xử lý STT — transcript sẽ update nhiều lần trong lúc này
    if (transcribingSection !== null) return;

    if (autoSaveTimerRef.current) window.clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = window.setTimeout(() => {
      onSave({ sections });
    }, 1500);

    return () => {
      if (autoSaveTimerRef.current) window.clearTimeout(autoSaveTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, transcribingSection]);

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

        {/* Tiêu đề part (chủ đề) */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
            Tiêu đề part (chủ đề)
          </label>
          <input
            type="text"
            value={current.sectionTitle || ""}
            onChange={(e) =>
              updateSection(activeSection, { sectionTitle: e.target.value })
            }
            placeholder="VD: Restaurant recommendations, Pottery class..."
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Yêu cầu đề (instruction) */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
            Yêu cầu đề (instruction)
          </label>
          <textarea
            value={current.sectionInstruction || ""}
            onChange={(e) =>
              updateSection(activeSection, { sectionInstruction: e.target.value })
            }
            rows={2}
            placeholder="VD: Complete the notes below. Write ONE WORD ONLY for each answer."
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-y"
          />
          <p className="mt-1 text-[11px] text-gray-400">
            Hiển thị cho học viên ở banner "Yêu cầu" trước mỗi part. Sao chép đúng dòng yêu cầu trong đề.
          </p>
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
          <div className="flex items-center justify-between mb-1.5 gap-2 flex-wrap">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Transcript (tuỳ chọn)
            </label>
            <div className="flex items-center gap-2">
              {/* Toggle diarization 2-speaker */}
              <label className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium text-gray-600 hover:text-gray-900 cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={enableDiarization}
                  onChange={(e) => setEnableDiarization(e.target.checked)}
                  className="w-3 h-3 cursor-pointer accent-blue-600"
                />
                <span>Tách giọng A/B</span>
              </label>
              {current.audioUrl && (
                <button
                  type="button"
                  onClick={handleManualTranscribe}
                  disabled={transcribingSection === activeSection}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {transcribingSection === activeSection ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Đang nhận dạng...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3 h-3" />
                      {current.transcript ? "Tạo lại từ audio" : "Tự động chuyển audio → text"}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          <textarea
            value={current.transcript ?? ""}
            onChange={(e) =>
              updateSection(activeSection, { transcript: e.target.value })
            }
            placeholder={
              transcribingSection === activeSection
                ? "Đang nhận dạng giọng nói, vui lòng chờ..."
                : "Dán transcript của audio vào đây để hỗ trợ chấm điểm... (hoặc upload audio để tự động tạo)"
            }
            rows={4}
            disabled={transcribingSection === activeSection}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-50 disabled:text-gray-400"
          />
          {/* Status banner — gộp loading + error vào 1 block, không gây giật khi mount/unmount.
              Dùng will-change để tối ưu re-paint, fixed height để không layout-shift textarea phía trên. */}
          {(transcribingSection === activeSection || transcribeError) && (
            <div
              className={`mt-2 flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] border ${
                transcribeError
                  ? "bg-rose-50/80 text-rose-700 border-rose-200"
                  : "bg-blue-50/70 text-blue-700 border-blue-100"
              }`}
            >
              {transcribingSection === activeSection ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {modelLoadingPct !== null && modelLoadingPct < 100 ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium tabular-nums">
                          Đang tải Whisper model lần đầu… {modelLoadingPct}%
                        </span>
                        <div
                          className="flex-1 max-w-[200px] h-1.5 bg-blue-100 rounded-full overflow-hidden"
                          aria-hidden
                        >
                          <div
                            className="h-full bg-blue-500"
                            style={{
                              width: `${modelLoadingPct}%`,
                              transition: "width 200ms linear",
                              willChange: "width",
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="font-medium">Whisper AI đang xử lý audio…</span>
                    )}
                  </div>
                </>
              ) : transcribeError ? (
                <>
                  <span className="text-rose-500 flex-shrink-0">⚠</span>
                  <span className="flex-1 min-w-0 leading-snug">{transcribeError}</span>
                  <button
                    type="button"
                    onClick={() => setTranscribeError(null)}
                    className="flex-shrink-0 text-rose-600 hover:text-rose-800 text-xs font-semibold cursor-pointer"
                    aria-label="Đóng"
                  >
                    ✕
                  </button>
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* ── Questions ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h4 className="text-sm font-bold text-gray-900">
            Câu hỏi {(activeSection - 1) * 10 + 1} – {activeSection * 10}
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">10 câu / section</span>
            <button
              type="button"
              onClick={handleSuggestAnswers}
              disabled={
                suggestingSection === activeSection ||
                !current.transcript?.trim()
              }
              title={
                !current.transcript?.trim()
                  ? "Cần có transcript trước khi AI gợi ý"
                  : "Dùng AI để tự động điền đáp án tham khảo từ transcript"
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer border border-violet-200"
            >
              {suggestingSection === activeSection ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  AI đang gợi ý...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  AI gợi ý đáp án
                </>
              )}
            </button>
          </div>
        </div>

        {suggestError && (
          <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[12px]">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1">{suggestError}</span>
            <button
              type="button"
              onClick={() => setSuggestError(null)}
              className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {aiSuggestedSections.has(activeSection) && (
          <div className="mb-3 flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[12px] leading-relaxed">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span className="flex-1">
              <span className="font-semibold">Đáp án do AI gợi ý — có thể sai.</span>{" "}
              Vui lòng đối chiếu với transcript và sửa lại nếu cần trước khi xuất bản.
            </span>
          </div>
        )}

        <div className="space-y-3">
          {current.questions.map((q, idx) => (
            <ListeningQuestionRow
              key={q.id}
              question={q}
              sectionNumber={activeSection}
              index={idx}
              onPatch={updateQuestion}
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
        <p className="text-xs text-gray-400">
          Dùng nút <span className="font-semibold text-gray-600">Lưu nháp</span> hoặc{" "}
          <span className="font-semibold text-gray-600">Xuất bản</span> ở thanh trên cùng để lưu.
        </p>
      </div>
    </div>
  );
}

// ─── Question row ─────────────────────────────────────────────────────────
// Memoized: chỉ re-render khi question thay đổi.
// Dùng (sectionNumber, index, onPatch stable) để tránh tạo callback mới mỗi parent render.
const ListeningQuestionRow = memo(function ListeningQuestionRow({
  question,
  sectionNumber,
  index,
  onPatch,
}: {
  question: ListeningQuestion;
  sectionNumber: number;
  index: number;
  onPatch: (secNum: number, qIdx: number, patch: Partial<ListeningQuestion>) => void;
}) {
  const isMcq = question.questionType === "multiple-choice";
  const handleChange = (patch: Partial<ListeningQuestion>) => onPatch(sectionNumber, index, patch);
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
              onChange={(e) => {
                const newType = e.target.value;
                // Nếu chuyển sang MCQ mà chưa có đáp án → mặc định "A".
                if (
                  newType === "multiple-choice" &&
                  !question.correctAnswer?.trim()
                ) {
                  handleChange({ questionType: newType, correctAnswer: "A" });
                } else {
                  handleChange({ questionType: newType });
                }
              }}
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
            onChange={(e) => handleChange({ questionText: e.target.value })}
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
                    onChange={() => handleChange({ correctAnswer: k })}
                    className="w-3.5 h-3.5 accent-emerald-500"
                  />
                  <span className="font-bold text-gray-700">{k}.</span>
                  <input
                    type="text"
                    value={(question.options as any)![k] || ""}
                    onChange={(e) =>
                      handleChange({
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
              onChange={(e) => handleChange({ correctAnswer: e.target.value })}
              placeholder="Đáp án đúng (vd: TRUE / FALSE / NOT GIVEN, hoặc từ khóa)..."
              className="w-full px-3 py-2 text-sm border border-emerald-200 bg-emerald-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default IeltsListeningEditor;
