import { useEffect, useState } from "react";
import { X, AlertTriangle } from "lucide-react";

/**
 * RejectReasonModal — modal nhập lý do từ chối (đề thi / bài viết).
 * Dùng chung cho mọi luồng moderation admin theo data-dense design system.
 */
interface Props {
  open: boolean;
  title: string;
  /** Subtitle/context: tên đề thi / bài viết bị từ chối */
  subject: string;
  /** Gợi ý nhanh — bấm sẽ điền vào textarea */
  presets?: string[];
  busy?: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

const DEFAULT_PRESETS = [
  "Nội dung chưa đạt tiêu chuẩn xuất bản.",
  "Đề/bài có lỗi chính tả, ngữ pháp.",
  "Sai cấu trúc đề thi tiêu chuẩn.",
  "Trùng lặp với nội dung đã xuất bản.",
  "Không phù hợp với độ tuổi học viên.",
];

export function RejectReasonModal({ open, title, subject, presets = DEFAULT_PRESETS, busy = false, onCancel, onConfirm }: Props) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  // Đóng modal bằng phím Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const canSubmit = reason.trim().length >= 5 && !busy;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <style>{`
        @keyframes rrmIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ animation: "rrmIn 0.18s ease-out forwards", border: "1px solid #E2E8F0" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "#FFFBEB" }}>
              <AlertTriangle className="h-5 w-5" style={{ color: "#F59E0B" }} />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">{title}</h2>
              <p className="mt-0.5 max-w-sm truncate text-xs text-slate-500">{subject}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={busy}
            aria-label="Đóng"
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Lý do từ chối <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={busy}
            rows={4}
            placeholder="Nhập lý do (tối thiểu 5 ký tự, tối đa 500)..."
            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 transition-colors duration-150 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
            maxLength={500}
            autoFocus
          />
          <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
            <span>{reason.trim().length < 5 ? "Cần ít nhất 5 ký tự" : "Hợp lệ"}</span>
            <span>{reason.length}/500</span>
          </div>

          {presets.length > 0 && (
            <div className="mt-3">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Gợi ý nhanh</p>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setReason(p)}
                    disabled={busy}
                    className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3">
          <button
            onClick={onCancel}
            disabled={busy}
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-50"
          >
            Huỷ
          </button>
          <button
            onClick={() => canSubmit && onConfirm(reason.trim())}
            disabled={!canSubmit}
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "#DC2626" }}
          >
            {busy ? "Đang xử lý..." : "Từ chối"}
          </button>
        </div>
      </div>
    </div>
  );
}
