/**
 * IELTS exam — Top bar theo theme NamThuEdu (orange brand).
 *
 * Hiển thị: candidate name, test ID, section label.
 * Timer đã được chuyển sang panel navigator bên phải để tránh trùng lặp.
 *
 * KHÔNG sticky — scroll cùng nội dung để không che header global.
 */
import { User, Headphones } from "lucide-react";

interface IeltsTopBarProps {
  candidateName: string;
  testId: string | number;
  sectionLabel: string;
}

// ─── Theme NamThuEdu ──────────────────────────────────────────────────────
const BRAND_PRIMARY = "#FF8C42";
const BRAND_SECONDARY = "#FF6B35";

export function IeltsTopBar({
  candidateName,
  testId,
  sectionLabel,
}: IeltsTopBarProps) {
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

        {/* ── Right: Section label (chiếm chỗ phải, căn lề phải khi đủ rộng) ── */}
        <div className="hidden md:flex flex-shrink-0">
          <span className="text-sm font-semibold text-gray-700 truncate">
            {sectionLabel}
          </span>
        </div>
      </div>

      {/* ── Mobile: Section label dưới header ── */}
      <div className="md:hidden px-4 pb-2 text-xs font-medium text-gray-600 border-t border-gray-100 pt-2">
        {sectionLabel}
      </div>
    </header>
  );
}
