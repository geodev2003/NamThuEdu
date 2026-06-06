/**
 * IELTS Listening — student view (4 sections × 10 Q = 40 total).
 * Layout giống study4.com:
 *   ┌─ Audio bar (top, full width) ────────────────────────────┐
 *   │ [Recording 1] [Recording 2] [Recording 3] [Recording 4]  │
 *   │ ▶ ━━━━━━━━━━━━━━━━━━ 00:00 / 00:00  🔊 ━━ ⚙          │
 *   ├─ 2-col body ─────────────────────────────────────────────┤
 *   │ Form/Context (left)        │  Q1 [____]  Q2 [____] ...  │
 *   │ Insurance Co.              │                             │
 *   │ Type: Vehicle              │                             │
 *   │ Policy: ___1___            │                             │
 *   └──────────────────────────────────────────────────────────┘
 */
import { useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import type {
  IeltsListeningPayload,
  IeltsListeningSection,
  AnswerMap,
} from "../types";
import { IeltsAudioOnce } from "../components/IeltsAudioOnce";
import { type QuestionMeta } from "../components/IeltsBottomNav";
import { IeltsQuestionNavigator } from "../components/IeltsQuestionNavigator";

interface IeltsListeningViewProps {
  payload: IeltsListeningPayload;
  answers: AnswerMap;
  flagged: Record<number, boolean>;
  onAnswer: (qId: number, value: any) => void;
  onToggleFlag: (qId: number) => void;
  onSubmit: () => void;
  onAllSectionsDone?: () => void;
  timeLeft?: number;
  showTimer?: boolean;
}

type Phase = "section" | "review";

export function IeltsListeningView({
  payload,
  answers,
  flagged,
  onAnswer,
  onSubmit,
  onAllSectionsDone,
  timeLeft,
  showTimer,
}: IeltsListeningViewProps) {
  const [phase, setPhase] = useState<Phase>("section");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [audioStartedAt, setAudioStartedAt] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sections = payload.sections ?? [];
  const currentSection: IeltsListeningSection | undefined = sections[sectionIndex];

  const allMeta: QuestionMeta[] = useMemo(() => {
    const out: QuestionMeta[] = [];
    sections.forEach((sec, sIdx) => {
      sec.questions.forEach((q) => {
        out.push({
          number: q.questionNumber,
          qId: q.qId,
          groupIndex: sIdx,
          groupLabel: sec.sectionName,
        });
      });
    });
    return out.sort((a, b) => a.number - b.number);
  }, [sections]);

  const handleSectionEnded = () => {
    if (sectionIndex < sections.length - 1) {
      setSectionIndex((i) => i + 1);
      setAudioStartedAt(Date.now());
    } else {
      setPhase("review");
      onAllSectionsDone?.();
    }
  };

  const jumpToQuestion = (q: QuestionMeta) => {
    if (phase === "review" || q.groupIndex === sectionIndex) {
      setSectionIndex(q.groupIndex);
      requestAnimationFrame(() => {
        const el = document.getElementById(`ielts-q-${q.qId}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  };

  if (!currentSection) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-gray-500">
        Đang tải dữ liệu đề thi…
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white flex flex-col" ref={containerRef}>
      {/* ── Top bar: section tabs + audio player (sticky khi cuộn) ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#e0e0e0] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1170px] mx-auto px-3 pt-3 pb-3">
          {/* Section tabs — style study4: chỉ underline khi active, không bg */}
          <div className="flex items-center gap-1 mb-3 -mx-1 px-1 overflow-x-auto border-b border-[#e0e0e0]">
            {sections.map((sec, idx) => {
              const isActive = idx === sectionIndex;
              return (
                <button
                  key={sec.sectionNumber}
                  type="button"
                  onClick={() => {
                    setSectionIndex(idx);
                    setAudioStartedAt(Date.now());
                  }}
                  className={`relative px-3.5 py-1.5 text-sm whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? "font-semibold text-[#FF6B35]"
                      : "font-medium text-[#677788] hover:text-[#1a1a1a]"
                  }`}
                >
                  Recording {sec.sectionNumber}
                  {isActive && (
                    <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#FF6B35]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Audio player full width */}
          {currentSection.audioUrl ? (
            <IeltsAudioOnce
              key={`audio-${currentSection.sectionNumber}-${audioStartedAt}`}
              src={currentSection.audioUrl}
              autoPlay
              onEnded={handleSectionEnded}
            />
          ) : (
            <div className="bg-[#fdf7d4] border border-[#ffad3b] rounded-md px-4 py-2 text-sm text-[#8f5500]">
              Không có file audio cho section này.
            </div>
          )}
        </div>
      </div>

      {/* ── Body 2-cols (max-width 1170px theo study4) ── */}
      <div className="flex-1 max-w-[1170px] w-full mx-auto px-3 py-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ── LEFT: form/context (cuộn theo trang) ── */}
          <div className="space-y-4">
            {currentSection.instructions && (
              <p className="italic text-[15px] leading-[1.5] text-[#1a1a1a]">
                {currentSection.instructions}
              </p>
            )}
            <FormContent section={currentSection} />
          </div>

          {/* ── RIGHT: answer input boxes (sticky + cuộn riêng khi dài) ── */}
          <div className="lg:sticky lg:top-[200px] lg:max-h-[calc(100vh-260px)] lg:overflow-y-auto lg:pr-1 space-y-2">
            {currentSection.questions.map((q) => {
              const num = q.questionNumber;
              const value = (answers[q.qId] ?? "") as string;
              const hasAnswer = value.trim().length > 0;
              return (
                <div
                  key={q.qId}
                  id={`ielts-q-${q.qId}`}
                  className="flex items-center gap-2.5"
                >
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-md font-semibold text-sm flex items-center justify-center transition-colors ${
                      hasAnswer
                        ? "bg-[#FF6B35] text-white"
                        : "bg-[#f8f9fa] text-[#677788] border border-[#e0e0e0]"
                    }`}
                  >
                    {num}
                  </span>
                  {q.options && Object.keys(q.options).length > 0 ? (
                    <select
                      value={value}
                      onChange={(e) => onAnswer(q.qId, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-md border border-[#e0e0e0] text-[15px] bg-white focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100 transition-colors"
                    >
                      <option value="">-- Chọn đáp án --</option>
                      {Object.entries(q.options).map(([letter, text]) => (
                        <option key={letter} value={letter}>
                          {letter}. {text}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => onAnswer(q.qId, e.target.value)}
                      placeholder="Nhập câu trả lời..."
                      className="flex-1 px-3 py-2 rounded-md border border-[#e0e0e0] text-[15px] bg-white focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100 transition-colors"
                    />
                  )}
                </div>
              );
            })}

            {/* Skip button — minimal style */}
            <button
              type="button"
              onClick={handleSectionEnded}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#677788] hover:text-[#FF6B35] transition-colors cursor-pointer"
            >
              Bỏ qua sang{" "}
              {sectionIndex < sections.length - 1
                ? `Recording ${sectionIndex + 2}`
                : "phần ôn lại"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <IeltsQuestionNavigator
        questions={allMeta}
        answers={answers}
        flagged={flagged}
        activeGroupIndex={sectionIndex}
        onJump={jumpToQuestion}
        timeLeft={timeLeft}
        showTimer={showTimer}
        onSubmit={onSubmit}
      />
    </div>
  );
}

// ─── FormContent ─────────────────────────────────────────────────────────
/**
 * Render form content giống study4 — text với chỗ trống ___N___ thay bằng số.
 * Lấy từ qContent của các câu hỏi trong section. Mỗi qContent có thể là
 * 1 dòng kiểu "Family Name: Mackinlay" hoặc "Policy #: ___1___".
 */
function FormContent({ section }: { section: IeltsListeningSection }) {
  const lines = useMemo(() => {
    return section.questions.map((q) => ({
      number: q.questionNumber,
      content: (q.questionText || "").trim(),
    }));
  }, [section.questions]);

  return (
    <div className="space-y-2 text-[15px] leading-[1.65] text-[#1a1a1a]">
      {lines.map((line, idx) => (
        <div key={idx}>{renderInlineBlanks(line.content, line.number)}</div>
      ))}
    </div>
  );
}

/**
 * Replace ___N___ patterns trong text với inline blank styling kiểu study4.
 * Ví dụ: "Policy #: ___1___" → "Policy #: [1]"
 */
function renderInlineBlanks(text: string, fallbackNum: number) {
  const parts: React.ReactNode[] = [];
  const regex = /_{2,}\s*(\d+)?\s*_{2,}/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  let foundAny = false;

  while ((m = regex.exec(text)) !== null) {
    foundAny = true;
    if (m.index > lastIndex) {
      parts.push(text.slice(lastIndex, m.index));
    }
    const num = m[1] ? parseInt(m[1], 10) : fallbackNum;
    parts.push(
      <span
        key={`blank-${m.index}`}
        className="inline-flex items-center justify-center min-w-[32px] h-6 px-2 mx-1 rounded bg-[#fff0eb] text-[#FF6B35] font-semibold text-xs border border-[#ffc1ad]"
      >
        {num}
      </span>
    );
    lastIndex = m.index + m[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // Fallback: text không có blank pattern → hiện inline với số nhỏ ở đầu
  if (!foundAny) {
    return (
      <div className="flex items-start gap-2">
        <span className="inline-flex flex-shrink-0 w-6 h-6 rounded bg-[#fff0eb] text-[#FF6B35] font-semibold text-xs items-center justify-center mt-0.5 border border-[#ffc1ad]">
          {fallbackNum}
        </span>
        <span>{text}</span>
      </div>
    );
  }

  return <span>{parts}</span>;
}
