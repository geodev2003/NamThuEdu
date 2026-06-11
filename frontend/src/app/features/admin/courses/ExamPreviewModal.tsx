/**
 * ExamPreviewModal — Modal xem trước đề thi đúng UI học viên sẽ thấy khi thi.
 *
 * Nhúng route preview standalone (/admin/de-thi/xem/*) vào trong một iframe
 * để hiển thị NGAY tại trang quản lý, không cần mở tab/trang mới. Iframe cùng
 * origin nên token trong localStorage vẫn dùng được (ProtectedRoute pass).
 */
import { useEffect, useState } from "react";
import { X, ExternalLink, Loader2, Maximize2, Minimize2 } from "lucide-react";
import type { AdminExam } from "@/services/adminApi";
import { getAdminPreviewUrl, getExamTitle, classifyExamType } from "./examClassify";

interface Props {
  exam: AdminExam | null;
  onClose: () => void;
}

export function ExamPreviewModal({ exam, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  // Reset trạng thái mỗi khi đổi đề
  useEffect(() => {
    if (exam) setLoading(true);
  }, [exam]);

  // Đóng bằng phím Esc
  useEffect(() => {
    if (!exam) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // Khoá scroll nền khi modal mở
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [exam, onClose]);

  if (!exam) return null;

  const url = getAdminPreviewUrl(exam);
  const title = getExamTitle(exam);
  const typeMeta = classifyExamType(exam);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Xem trước ${title}`}
    >
      <div
        className={`flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all ${
          expanded ? "h-full w-full" : "h-[90vh] w-full max-w-6xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thanh tiêu đề */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold"
              style={{ background: typeMeta.softBg, color: typeMeta.color }}
            >
              {typeMeta.label}
            </span>
            <h3 className="truncate text-sm font-semibold text-slate-900" title={title}>
              {title}
            </h3>
            <span className="hidden flex-shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600 sm:inline">
              Xem trước · UI học viên
            </span>
          </div>

          <div className="flex flex-shrink-0 items-center gap-1">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              title={expanded ? "Thu nhỏ" : "Toàn màn hình"}
              aria-label={expanded ? "Thu nhỏ" : "Toàn màn hình"}
            >
              {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              title="Mở trong tab mới"
              aria-label="Mở trong tab mới"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <button
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
              title="Đóng"
              aria-label="Đóng"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Khung preview */}
        <div className="relative flex-1 bg-slate-50">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50">
              <div className="text-center">
                <Loader2 className="mx-auto mb-2 h-7 w-7 animate-spin text-blue-600" />
                <p className="text-sm text-slate-500">Đang tải bản xem trước...</p>
              </div>
            </div>
          )}
          <iframe
            key={url}
            src={url}
            title={`Xem trước ${title}`}
            className="h-full w-full border-0"
            onLoad={() => setLoading(false)}
          />
        </div>
      </div>
    </div>
  );
}
