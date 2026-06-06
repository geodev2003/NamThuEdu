/**
 * IELTS — Submit confirmation dialog.
 *
 * Shows totals (answered / unanswered / flagged) and asks for confirmation.
 */
import { CheckCircle2, AlertCircle, X, Send } from "lucide-react";
import { useEffect } from "react";

interface IeltsSubmitDialogProps {
  open: boolean;
  totalQuestions: number;
  answeredCount: number;
  flaggedCount: number;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  /** Custom title — defaults to "Submit your answers?" */
  title?: string;
  /** Force submit (no cancel option) — used when timeout */
  forceSubmit?: boolean;
}

export function IeltsSubmitDialog({
  open,
  totalQuestions,
  answeredCount,
  flaggedCount,
  isSubmitting = false,
  onCancel,
  onConfirm,
  title,
  forceSubmit = false,
}: IeltsSubmitDialogProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  const unanswered = Math.max(0, totalQuestions - answeredCount);
  const allAnswered = unanswered === 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close (only if not force-submit) */}
        {!forceSubmit && !isSubmitting && (
          <button
            type="button"
            onClick={onCancel}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cancel"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {/* Header */}
        <div className={`px-6 pt-6 pb-4 ${forceSubmit ? "bg-gradient-to-br from-red-50 to-orange-50" : ""}`}>
          <div className="flex items-start gap-3 mb-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              forceSubmit ? "bg-red-100 text-red-600" : allAnswered ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
            }`}>
              {forceSubmit ? <AlertCircle className="w-5 h-5" /> : <Send className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">
                {title ?? (forceSubmit ? "Time's up — submitting" : "Submit your answers?")}
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                {forceSubmit
                  ? "Your test has ended. Answers will be saved automatically."
                  : "Once submitted, you cannot change your answers."}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 pb-4 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-emerald-700 tabular-nums">{answeredCount}</div>
              <div className="text-[11px] text-emerald-700/70 font-medium uppercase tracking-wider mt-0.5">Answered</div>
            </div>
            <div className={`${unanswered > 0 ? "bg-amber-50 border-amber-100" : "bg-gray-50 border-gray-100"} border rounded-lg p-3 text-center`}>
              <div className={`text-2xl font-bold tabular-nums ${unanswered > 0 ? "text-amber-700" : "text-gray-500"}`}>
                {unanswered}
              </div>
              <div className={`text-[11px] font-medium uppercase tracking-wider mt-0.5 ${unanswered > 0 ? "text-amber-700/70" : "text-gray-500/70"}`}>
                Unanswered
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-700 tabular-nums">{flaggedCount}</div>
              <div className="text-[11px] text-blue-700/70 font-medium uppercase tracking-wider mt-0.5">Flagged</div>
            </div>
          </div>

          {!forceSubmit && unanswered > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                You have <span className="font-bold">{unanswered}</span> unanswered question{unanswered === 1 ? "" : "s"}. They will be marked as incorrect if you submit now.
              </p>
            </div>
          )}

          {!forceSubmit && allAnswered && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-800">All questions answered. Good luck!</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 pt-2 flex items-center gap-2">
          {!forceSubmit && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`${forceSubmit ? "w-full" : "flex-1"} px-4 py-2.5 rounded-lg text-sm font-bold text-white shadow-md transition-all cursor-pointer ${
              forceSubmit ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
            } disabled:opacity-60 disabled:cursor-wait`}
          >
            {isSubmitting ? "Submitting…" : forceSubmit ? "Submit now" : "Confirm submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
