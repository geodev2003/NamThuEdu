import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  CheckCircle2,
  Loader2,
  Bot,
  UserCheck,
  MessageSquare,
  BarChart3,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { api } from "../../../../services/api";

// ─── Types ─────────────────────────────────────────────────────────────────
interface VstepScores {
  listening?: number;
  reading?: number;
  writing?: number;
  speaking?: number;
  total?: number;
}

interface ReviewSubmission {
  id: string;
  studentName: string;
  studentAvatar: string;
  examTitle: string;
  examType: string;
  submissionTime: Date;
  status: string;
  score?: number;
  maxScore: number;
  attemptNumber: number;
  sGemini_feedback?: string;
  sTeacher_feedback?: string;
  teacher_reviewed_at?: string;
}

interface Props {
  submission: ReviewSubmission | null;
  open: boolean;
  onClose: () => void;
  onReviewed: (id: string) => void;
}

// ─── Skill config ──────────────────────────────────────────────────────────
const SKILLS = [
  { key: "listening", labelKey: "teacher.grading.detail.skills.listening", icon: Headphones, color: "#F59E0B", bg: "#FEF3C7", weight: 25 },
  { key: "reading",   labelKey: "teacher.grading.detail.skills.reading",   icon: BookOpen,   color: "#0EA5E9", bg: "#E0F2FE", weight: 25 },
  { key: "writing",   labelKey: "teacher.grading.detail.skills.writing",   icon: PenTool,    color: "#8B5CF6", bg: "#EDE9FE", weight: 25 },
  { key: "speaking",  labelKey: "teacher.grading.detail.skills.speaking",  icon: Mic,        color: "#EC4899", bg: "#FCE7F3", weight: 25 },
] as const;

// ─── Score ring ─────────────────────────────────────────────────────────────
function ScoreRing({ score, max = 10, color }: { score: number; max?: number; color: string }) {
  const pct = Math.min((score / max) * 100, 100);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#E5E7EB" strokeWidth="7" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke={color} strokeWidth="7"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s cubic-bezier(.4,0,.2,1)" }}
      />
    </svg>
  );
}

// ─── Main Modal ─────────────────────────────────────────────────────────────
export function TeacherReviewModal({ submission, open, onClose, onReviewed }: Props) {
  const { t } = useTranslation();
  const aiScores: VstepScores = (() => {
    try { return JSON.parse(submission?.sGemini_feedback ?? "{}").vstep_scores ?? {}; }
    catch { return {}; }
  })();

  const [scores, setScores] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submission) return;
    const initial: Record<string, string> = {};
    SKILLS.forEach(({ key }) => {
      const ai = (aiScores as any)[key];
      initial[key] = ai !== undefined && ai !== null ? String(Number(ai).toFixed(1)) : "";
    });
    setScores(initial);
    setFeedback(submission.sTeacher_feedback ?? "");
    setError(null);
  }, [submission?.id]);

  const hasAiScores = Object.values(aiScores).some((v) => v !== undefined && v !== null);

  const totalOverride = (() => {
    const vals = SKILLS.map(({ key }) => parseFloat(scores[key] ?? ""));
    if (vals.some(isNaN)) return null;
    return vals.reduce((s, v) => s + v, 0) / vals.length;
  })();

  const handleSave = async () => {
    if (!submission) return;
    setSaving(true);
    setError(null);
    try {
      const payload: any = {
        feedback,
        sTeacher_feedback: feedback,
      };
      if (totalOverride !== null) {
        payload.score = Math.round(totalOverride * 10);
      }
      await api.post(`/teacher/submissions/${submission.id}/grade`, payload);
      onReviewed(submission.id);
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? t("teacher.grading.reviewModal.saveError"));
    } finally {
      setSaving(false);
    }
  };

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && submission && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-600 to-purple-600">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">{t("teacher.grading.reviewModal.submitTitle")}</h2>
                  <p className="text-xs text-violet-200">{submission.examTitle}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body — 2 columns */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">

                {/* ─── LEFT: AI results ─── */}
                <div className="p-6 space-y-5">
                  {/* Student info */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {submission.studentAvatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{submission.studentName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {submission.submissionTime.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-700">
                          {t("teacher.grading.queuePage.attempt")} {submission.attemptNumber}
                        </span>
                      </div>
                    </div>
                    <div className="ml-auto text-right flex-shrink-0">
                      <p className="text-2xl font-black text-slate-800">{submission.score ?? "—"}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide">/ {submission.maxScore}</p>
                    </div>
                  </div>

                  {/* AI scores */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t("teacher.grading.reviewModal.aiScore")}</span>
                    </div>

                    {hasAiScores ? (
                      <div className="grid grid-cols-2 gap-3">
                        {SKILLS.map(({ key, labelKey, icon: Icon, color, bg }) => {
                          const val = (aiScores as any)[key];
                          const n = val !== undefined && val !== null ? Number(val) : null;
                          return (
                            <div
                              key={key}
                              className="rounded-xl p-3 flex items-center gap-3"
                              style={{ background: bg }}
                            >
                              <div className="relative flex-shrink-0">
                                {n !== null ? (
                                  <>
                                    <ScoreRing score={n} max={10} color={color} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <span className="text-sm font-black" style={{ color }}>{n.toFixed(1)}</span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="w-[72px] h-[72px] rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center">
                                    <span className="text-xs text-slate-400">N/A</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-1 mb-0.5">
                                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                                  <span className="text-xs font-semibold text-slate-700">{t(labelKey)}</span>
                                </div>
                                <span className="text-[10px] text-slate-400">/ 10</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl bg-slate-50 border border-dashed border-slate-200 py-8 flex flex-col items-center gap-2">
                        <BarChart3 className="w-8 h-8 text-slate-300" />
                        <p className="text-sm text-slate-400">{t("teacher.grading.reviewModal.noAiScore")}</p>
                        <p className="text-xs text-slate-300">{t("teacher.grading.reviewModal.onlyTotal")} {submission.score ?? "—"}/{submission.maxScore}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ─── RIGHT: Teacher override ─── */}
                <div className="p-6 space-y-5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-md bg-violet-100 flex items-center justify-center">
                      <UserCheck className="w-3.5 h-3.5 text-violet-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t("teacher.grading.reviewModal.adjustScore")}</span>
                  </div>

                  <div className="space-y-3">
                    {SKILLS.map(({ key, labelKey, icon: Icon, color, bg }) => {
                      const aiVal = (aiScores as any)[key];
                      const aiN = aiVal !== undefined && aiVal !== null ? Number(aiVal) : null;
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: bg }}
                          >
                            <Icon className="w-4 h-4" style={{ color }} />
                          </div>
                          <span className="text-sm text-slate-700 w-10 flex-shrink-0">{t(labelKey)}</span>
                          <div className="flex-1 relative">
                            <input
                              type="number"
                              min={0}
                              max={10}
                              step={0.1}
                              value={scores[key] ?? ""}
                              onChange={(e) => setScores((prev) => ({ ...prev, [key]: e.target.value }))}
                              placeholder={aiN !== null ? `AI: ${aiN.toFixed(1)}` : "—"}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all"
                            />
                          </div>
                          <span className="text-xs text-slate-400 flex-shrink-0">/ 10</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Calculated override total */}
                  {totalOverride !== null && (
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-violet-50 border border-violet-100">
                      <span className="text-sm text-violet-700 font-medium">{t("teacher.grading.reviewModal.newTotal")}</span>
                      <span className="text-lg font-black text-violet-700">{Math.round(totalOverride * 10)}/100</span>
                    </div>
                  )}

                  {/* Feedback */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t("teacher.grading.reviewModal.feedback")}</span>
                    </div>
                    <textarea
                      rows={4}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder={t("teacher.grading.reviewModal.feedbackPlaceholder")}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all placeholder:text-slate-300"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-50 border border-rose-100">
                      <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      <p className="text-xs text-rose-600">{error}</p>
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {saving ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> {t("teacher.grading.reviewModal.saving")}</>
                    ) : (
                      <><CheckCircle2 className="w-4 h-4" /> {t("teacher.grading.reviewModal.confirmSave")}</>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-400">
                    {t("teacher.grading.reviewModal.afterConfirm")} <strong>{t("teacher.grading.reviewModal.statusReviewed")}</strong>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
