/**
 * IELTS — right-side question navigator (theme NamThuEdu, style giống VSTEP).
 *
 * Hiển thị dạng panel dock bên phải, gom câu theo section/passage:
 *  • Đã trả lời → cam đặc
 *  • Đã gắn cờ  → hổ phách
 *  • Câu hiện tại / section hiện tại → ring cam
 *  • Có thể thu gọn (collapse) để không che nội dung
 */
import { useState } from "react";
import { ListChecks, ChevronRight, Send, Clock } from "lucide-react";
import type { QuestionMeta } from "./IeltsBottomNav";

interface IeltsQuestionNavigatorProps {
  questions: QuestionMeta[];
  answers: Record<number, any>;
  flagged: Record<number, boolean>;
  /** index của nhóm (section/passage) đang mở */
  activeGroupIndex?: number;
  currentNumber?: number;
  onJump: (q: QuestionMeta) => void;
  /** Thời gian còn lại (giây) — hiện ở đầu panel */
  timeLeft?: number;
  showTimer?: boolean;
  /** Nút nộp bài */
  onSubmit?: () => void;
}

function formatClock(sec?: number) {
  if (sec == null || sec < 0) return "--:--";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function IeltsQuestionNavigator({
  questions,
  answers,
  flagged,
  activeGroupIndex,
  currentNumber,
  onJump,
  timeLeft,
  showTimer = true,
  onSubmit,
}: IeltsQuestionNavigatorProps) {
  const [open, setOpen] = useState(true);
  const lowTime = timeLeft != null && timeLeft <= 300; // ≤5 phút

  // Gom câu theo nhóm
  const groups = (() => {
    const map = new Map<number, { index: number; label: string; items: QuestionMeta[] }>();
    questions.forEach((q) => {
      const key = q.groupIndex ?? 0;
      if (!map.has(key)) {
        map.set(key, {
          index: key,
          label: q.groupLabel ?? `Section ${key + 1}`,
          items: [],
        });
      }
      map.get(key)!.items.push(q);
    });
    return Array.from(map.values()).sort((a, b) => a.index - b.index);
  })();

  const totalAnswered = questions.filter((q) => {
    const v = answers[q.qId];
    return v != null && v !== "";
  }).length;

  // Nút mở lại khi đã thu gọn
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Mở danh sách câu hỏi"
        className="hidden lg:flex fixed top-1/2 right-0 -translate-y-1/2 z-30 items-center gap-1.5 px-2.5 py-3 rounded-l-xl bg-white border border-r-0 border-[#e0e0e0] shadow-md text-[#FF6B35] hover:bg-[#fff7f2] transition-colors cursor-pointer"
      >
        <ListChecks className="w-4 h-4" />
        <span className="text-xs font-bold tabular-nums">{totalAnswered}/{questions.length}</span>
      </button>
    );
  }

  return (
    <aside className="hidden lg:block fixed top-[150px] right-4 w-[200px] z-30">
      <div className="bg-white border border-[#e0e0e0] rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-[#FF8C42] to-[#FF6B35] text-white">
          <div className="flex items-center gap-1.5">
            <ListChecks className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">Danh sách câu</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            title="Thu gọn"
            className="text-white/90 hover:text-white cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Timer + Submit (giống mẫu — đặt trên đầu panel) */}
        <div className="px-3 pt-3 pb-2.5 border-b border-[#eef0f2] space-y-2.5">
          {showTimer && (
            <div className="text-center">
              <p className="text-[11px] text-[#677788] mb-0.5">Thời gian còn lại</p>
              <div className={`flex items-center justify-center gap-1.5 text-2xl font-bold tabular-nums ${lowTime ? "text-red-600 animate-pulse" : "text-[#1a1a1a]"}`}>
                <Clock className={`w-5 h-5 ${lowTime ? "text-red-500" : "text-[#FF6B35]"}`} />
                {formatClock(timeLeft)}
              </div>
            </div>
          )}
          {onSubmit && (
            <button
              type="button"
              onClick={onSubmit}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-[#FF8C42] to-[#FF6B35] hover:opacity-90 transition-opacity cursor-pointer shadow-sm shadow-orange-200"
            >
              <Send className="w-4 h-4" />
              Nộp bài
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-3 space-y-3 max-h-[calc(100vh-340px)] overflow-y-auto">
          {groups.map((group) => {
            const groupAnswered = group.items.filter((q) => {
              const v = answers[q.qId];
              return v != null && v !== "";
            }).length;
            const isActiveGroup = activeGroupIndex === group.index;

            return (
              <div key={group.index}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[11px] font-bold ${isActiveGroup ? "text-[#FF6B35]" : "text-[#677788]"}`}>
                    {group.label}
                  </span>
                  <span className="text-[10px] text-[#9aa5b1] tabular-nums">
                    {groupAnswered}/{group.items.length}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {group.items.map((q) => {
                    const v = answers[q.qId];
                    const answered = v != null && v !== "";
                    const flag = !!flagged[q.qId];
                    const isCurrent = currentNumber === q.number;

                    let tone: string;
                    if (flag) {
                      tone = "bg-amber-500 text-white hover:bg-amber-600";
                    } else if (answered) {
                      tone = "bg-[#FF6B35] text-white hover:bg-[#FF8C42]";
                    } else {
                      tone = "bg-[#f1f3f5] text-[#677788] hover:bg-[#e4e7eb]";
                    }
                    const ring = isCurrent ? " ring-2 ring-offset-1 ring-[#FF8C42]" : "";

                    return (
                      <button
                        key={q.qId}
                        type="button"
                        onClick={() => onJump(q)}
                        title={`Câu ${q.number}${flag ? " — đã gắn cờ" : answered ? " — đã trả lời" : ""}`}
                        className={`relative h-7 rounded text-[11px] font-semibold tabular-nums transition-all cursor-pointer flex items-center justify-center ${tone}${ring}`}
                      >
                        {q.number}
                        {flag && answered && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-white" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer legend */}
        <div className="px-3 py-2 border-t border-[#eef0f2] flex items-center gap-3 text-[10px] text-[#677788]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#FF6B35]" /> Đã làm
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Gắn cờ
          </span>
        </div>
      </div>
    </aside>
  );
}
