/**
 * IELTS exam — Top bar theo theme NamThuEdu (orange brand).
 *
 * Hiển thị: candidate name, test ID, section label, countdown timer.
 * Timer: vàng dưới 5 phút, đỏ dưới 1 phút.
 *
 * KHÔNG sticky — scroll cùng nội dung để không che header global.
 */
import { useEffect, useState } from "react";
import { Clock, User, Headphones } from "lucide-react";
import { IELTS_TIMER_THRESHOLDS } from "../types";

interface IeltsTopBarProps {
  candidateName: string;
  testId: string | number;
  sectionLabel: string;
  /** Tổng số giây còn lại */
  timeLeft: number;
  /** Hiển thị timer? (false khi đang setup) */
  showTimer?: boolean;
}

// ─── Theme NamThuEdu ──────────────────────────────────────────────────────
const BRAND_PRIMARY = "#FF8C42";
const BRAND_SECONDARY = "#FF6B35";

export function IeltsTopBar({
  candidateName,
  testId,
  sectionLabel,
  timeLeft,
  showTimer = true,
}: IeltsTopBarProps) {
  // Re-render mỗi giây khi timer đang chạy
  const [, force] = useState(0);
  useEffect(() => {
    if (!showTimer) return;
    const id = setInterval(() => force((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [showTimer]);

  const m = Math.max(0, Math.floor(timeLeft / 60));
  const s = Math.max(0, timeLeft % 60);
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");

  const danger = timeLeft <= IELTS_TIMER_THRESHOLDS.danger;
  const warn = !danger && timeLeft <= IELTS_TIMER_THRESHOLDS.warning;

  const timerStyles = danger
    ? "bg-red-50 text-red-700 border-red-200"
    : warn
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-orange-50 text-orange-700 border-orange-200";

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* ── Left: Brand + skill badge + candidate ── */}
        <div className="flex items-center gap-3 min-w-0">
          {/* IELTS skill badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-white text-xs font-bold tracking-wide"
            style={{
              background: `linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_SECONDARY})`,
            }}
          >
            <Headphones className="w-3.5 h-3.5" />
            IELTS
          </div>

          {/* Candidate info */}
          <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
            <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="font-semibold text-gray-800 truncate max-w-[200px]">
              {candidateName}
            </span>
            <span className="hidden lg:inline text-gray-300">·</span>
            <span className="hidden lg:inline text-xs text-gray-500">
              Mã đề: <span className="font-mono">{testId}</span>
            </span>
          </div>
        </div>

        {/* ── Center: Section label ── */}
        <div className="hidden md:flex flex-1 justify-center">
          <span className="text-sm font-semibold text-gray-700 truncate">
            {sectionLabel}
          </span>
        </div>

        {/* ── Right: Timer ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {showTimer ? (
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border tabular-nums text-sm font-bold transition-colors ${timerStyles} ${
                danger ? "animate-pulse" : ""
              }`}
              role="timer"
              aria-live={warn || danger ? "assertive" : "polite"}
            >
              <Clock className="w-4 h-4" />
              <span>
                {mm}:{ss}
              </span>
            </div>
          ) : (
            <div className="text-xs text-gray-400 italic">Đang chuẩn bị…</div>
          )}
        </div>
      </div>

      {/* ── Mobile: Section label dưới header ── */}
      <div className="md:hidden px-4 pb-2 text-xs font-medium text-gray-600 border-t border-gray-100 pt-2">
        {sectionLabel}
      </div>
    </header>
  );
}
