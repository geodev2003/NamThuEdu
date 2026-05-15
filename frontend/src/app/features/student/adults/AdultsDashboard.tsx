import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  BarChart3, BookOpen, Target, Clock, TrendingUp, Award,
  Flame, ArrowRight, Play, CheckCircle2, ChevronRight, Sparkles,
  AlertCircle, Bell, CalendarClock, X, MessageSquareQuote,
  ClipboardList, Mic, Headphones, PenLine, BookOpenCheck,
} from 'lucide-react';
import { api } from '../../../../services/api';
import {
  studentApi,
  type InProgressTest,
  type UpcomingTest,
  type TeacherReminder,
  type TestAssignment,
} from '../../../../services/studentApi';

// ─── Design tokens (mirrors StudentExamBrowser) ─────────────────────────────
const PURPLE       = '#7C3AED';
const PURPLE_MID   = '#8B5CF6';
const PURPLE_LIGHT = '#EDE9FE';

// ─── Next-action model ────────────────────────────────────────────────────────
// A clean discriminated-union for the "Continue learning" card so the JSX
// doesn't depend on raw API shapes.
type NextAction =
  | {
      kind: 'resume';
      submissionId: number;
      examType: string;
      title: string;
      skill: string;
      minutesLeft: number;
      totalDuration: number;
      routeUrl: string;
    }
  | {
      kind: 'start';
      assignmentId: number;
      examType: string;
      title: string;
      skill: string;
      durationMin: number;
      isUrgent: boolean;
      daysUntil: number;
      routeUrl: string;
    }
  | null;

function computeNextAction(
  inProgress: InProgressTest[],
  upcoming: UpcomingTest[],
): NextAction {
  if (inProgress.length > 0) {
    const t = inProgress[0];
    const isVstep = String(t.type || '').toUpperCase() === 'VSTEP';
    return {
      kind: 'resume',
      submissionId: t.submission_id,
      examType: t.type || '',
      title: t.title || 'Bài thi',
      skill: t.skill || '',
      minutesLeft: Math.max(0, Math.round(Number(t.time_remaining) || 0)),
      totalDuration: Number(t.total_duration) || 0,
      routeUrl: isVstep
        ? `/hoc-vien/lam-bai-vstep/${t.id}?submissionId=${t.submission_id}`
        : `/hoc-vien/lam-bai/${t.assignment_id ?? t.id}?autostart=1&submissionId=${t.submission_id}`,
    };
  }
  if (upcoming.length > 0) {
    const t = upcoming[0];
    return {
      kind: 'start',
      assignmentId: t.assignment_id,
      examType: t.type || '',
      title: t.title || 'Bài thi',
      skill: t.skill || '',
      durationMin: Number(t.duration) || 0,
      isUrgent: Boolean(t.is_urgent),
      daysUntil: Number(t.days_until) || 0,
      routeUrl: `/hoc-vien/phong-cho/${t.assignment_id}`,
    };
  }
  return null;
}

interface GamificationData {
  coins: {
    total: number;
    lifetime: number;
    spent: number;
  };
  stats: {
    lessons_completed: number;
    exams_taken: number;
    practice_sessions: number;
    total_points: number;
    average_score: number;
    study_time_minutes: number;
  };
  streak: {
    current: number;
    longest: number;
    last_activity: string | null;
    total_active_days: number;
  };
  badges: {
    earned: number;
  };
  achievements: {
    completed: number;
    total: number;
    percentage: number;
  };
}

// ─── Reusable bits ────────────────────────────────────────────────────────────

const StatTile = ({
  icon: Icon, label, value, hint, trend,
}: {
  icon: any; label: string; value: string | number; hint?: string; trend?: string;
}) => (
  <div
    className="relative rounded-3xl overflow-hidden p-5 hover:-translate-y-0.5 transition-all duration-300"
    style={{ background: '#fff', border: '1.5px solid #F0F0F8', boxShadow: '0 2px 12px rgba(124,58,237,0.07)' }}
  >
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ background: `linear-gradient(135deg, ${PURPLE}08 0%, ${PURPLE_MID}04 100%)` }}
    />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: PURPLE_LIGHT }}
        >
          <Icon className="w-[18px] h-[18px]" style={{ color: PURPLE }} strokeWidth={2} />
        </div>
        {trend && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#D1FAE5', color: '#065F46' }}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className="text-2xl font-extrabold tracking-tight tabular-nums" style={{ color: '#1A1040' }}>{value}</p>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  </div>
);

const ProgressRow = ({
  label, current, total,
}: {
  label: string; current: number; total: number;
}) => {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-xs tabular-nums" style={{ color: PURPLE_MID }}>{current}/{total}</span>
      </div>
      <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ background: PURPLE_LIGHT }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${PURPLE}, ${PURPLE_MID})` }}
        />
      </div>
    </div>
  );
};

const KeyValue = ({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) => (
  <div className="flex justify-between items-center py-1.5">
    <span className="text-sm text-slate-600">{label}</span>
    <span className={`text-sm font-semibold tabular-nums ${highlight ? 'text-orange-600' : 'text-slate-900'}`}>
      {value}
    </span>
  </div>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return 'Chào buổi sáng';
  if (h < 14) return 'Chào buổi trưa';
  if (h < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
}

function getLevel(points: number) {
  if (points > 2000) return 'Chuyên gia';
  if (points > 1000) return 'Nâng cao';
  if (points > 500)  return 'Trung cấp';
  return 'Cơ bản';
}

function formatDeadline(deadline: string | null | undefined, daysUntil: number) {
  if (daysUntil <= 0) return 'Hết hạn hôm nay';
  if (daysUntil === 1) return 'Còn 1 ngày';
  if (daysUntil <= 7) return `Còn ${daysUntil} ngày`;
  if (!deadline) return `Còn ${daysUntil} ngày`;
  try {
    const d = new Date(deadline);
    return `Hạn: ${d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
  } catch {
    return `Còn ${daysUntil} ngày`;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AdultsDashboard() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const [gam, setGam] = useState<GamificationData | null>(null);
  const [inProgress, setInProgress] = useState<InProgressTest[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingTest[]>([]);
  const [reminders, setReminders] = useState<TeacherReminder[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState<TestAssignment[]>([]);
  const [showAllAssignments, setShowAllAssignments] = useState(false);
  const [dismissingId, setDismissingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [gamRes, inProgRes, upcomingRes, remindersRes, testsRes] = await Promise.allSettled([
          api.get('/student/gamification/overview'),
          studentApi.getInProgressTests(),
          studentApi.getUpcomingTests({ days: 30 }),
          studentApi.getReminders(),
          studentApi.getTests({ status: 'pending' }),
        ]);

        if (!mounted) return;

        // Gamification — required, surface failure
        if (gamRes.status === 'fulfilled' && gamRes.value?.data?.status === 'success') {
          setGam(gamRes.value.data.data);
        } else {
          setError('Không thể tải dữ liệu tổng quan. Vui lòng thử lại sau.');
        }

        // In-progress tests — optional (may be empty)
        if (inProgRes.status === 'fulfilled' && inProgRes.value?.data?.status === 'success') {
          setInProgress(inProgRes.value.data.data || []);
        }

        // Upcoming tests — optional (may be empty)
        if (upcomingRes.status === 'fulfilled' && upcomingRes.value?.data?.status === 'success') {
          setUpcoming(upcomingRes.value.data.data || []);
        }

        // Teacher reminders — optional
        if (remindersRes.status === 'fulfilled' && (remindersRes.value as any)?.data?.status === 'success') {
          const payload = (remindersRes.value as any).data.data;
          setReminders(Array.isArray(payload?.reminders) ? payload.reminders : []);
        }

        // Pending assignments — optional
        if (testsRes.status === 'fulfilled') {
          const d = (testsRes.value as any)?.data?.data;
          const list = Array.isArray(d?.pending) ? d.pending : [];
          setPendingAssignments(list);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="w-full animate-pulse" style={{ background: '#F8F7FF', minHeight: '100vh' }}>

          {/* Hero skeleton */}
          <div style={{ background: 'linear-gradient(135deg, #1E0B4B 0%, #3B1B8F 45%, #1D4ED8 100%)' }}>
            <div className="px-6 sm:px-8 lg:px-10 py-8">
              <div className="h-2.5 w-20 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.2)' }} />
              <div className="h-8 w-72 rounded-xl mb-2" style={{ background: 'rgba(255,255,255,0.2)' }} />
              <div className="h-3.5 w-56 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.12)' }} />
              <div className="flex gap-3">
                {[100, 120, 90, 110].map((w, i) => (
                  <div key={i} className="h-10 rounded-2xl" style={{ width: w, background: 'rgba(255,255,255,0.12)' }} />
                ))}
              </div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

            {/* Stat tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-3xl p-5" style={{ background: '#fff', border: '1.5px solid #F0F0F8' }}>
                  <div className="w-9 h-9 rounded-xl bg-purple-100 mb-3" />
                  <div className="h-2.5 w-16 rounded-full bg-purple-100 mb-2" />
                  <div className="h-7 w-20 rounded-lg bg-purple-100" />
                </div>
              ))}
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

              {/* Left 3/5 */}
              <div className="lg:col-span-3 space-y-6">
                {/* Next test card */}
                <div className="rounded-3xl overflow-hidden" style={{ border: '1.5px solid #F0F0F8' }}>
                  <div className="px-6 pt-6 pb-5 bg-purple-50">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-200 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="h-2.5 w-28 rounded-full bg-purple-200 mb-2.5" />
                        <div className="h-5 w-60 rounded-lg bg-purple-200" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white px-6 py-4 flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="h-6 w-16 rounded-full bg-purple-100" />
                      <div className="h-6 w-12 rounded-full bg-slate-100" />
                    </div>
                    <div className="h-10 w-28 rounded-2xl bg-purple-200" />
                  </div>
                </div>

                {/* Progress card */}
                <div className="rounded-3xl overflow-hidden" style={{ border: '1.5px solid #F0F0F8' }}>
                  <div className="px-6 py-5 bg-purple-50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-200" />
                      <div>
                        <div className="h-2 w-14 rounded-full bg-purple-200 mb-1.5" />
                        <div className="h-4 w-36 rounded-lg bg-purple-200" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white px-6 py-5 space-y-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-2">
                          <div className="h-3 w-40 rounded-full bg-slate-100" />
                          <div className="h-3 w-10 rounded-full bg-slate-100" />
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-purple-100" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 2/5 */}
              <div className="lg:col-span-2 space-y-5">
                {/* Reminders */}
                <div className="rounded-3xl overflow-hidden" style={{ border: '1.5px solid #F0F0F8' }}>
                  <div className="px-5 py-4" style={{ background: 'linear-gradient(135deg, #1E0B4B, #7C3AED)' }}>
                    <div className="h-4 w-44 rounded-lg" style={{ background: 'rgba(255,255,255,0.2)' }} />
                  </div>
                  <div className="bg-white divide-y divide-slate-50">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between px-5 py-3">
                        <div>
                          <div className="h-3 w-36 rounded-full bg-slate-100 mb-1.5" />
                          <div className="h-2.5 w-24 rounded-full bg-slate-100" />
                        </div>
                        <div className="h-8 w-18 rounded-lg bg-purple-100" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance + Streak */}
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="rounded-3xl overflow-hidden" style={{ border: '1.5px solid #F0F0F8' }}>
                      <div className="px-4 py-3.5 bg-purple-50">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-purple-200" />
                          <div>
                            <div className="h-2 w-10 rounded-full bg-purple-200 mb-1" />
                            <div className="h-3 w-16 rounded-full bg-purple-200" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-white px-4 py-2 space-y-2">
                        {Array.from({ length: 3 }).map((_, j) => (
                          <div key={j} className="flex justify-between py-1">
                            <div className="h-2.5 w-12 rounded-full bg-slate-100" />
                            <div className="h-2.5 w-9 rounded-full bg-slate-100" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tip card */}
                <div className="rounded-3xl px-5 py-5" style={{ background: 'linear-gradient(135deg, #1E0B4B, #7C3AED)' }}>
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }} />
                    <div className="flex-1">
                      <div className="h-3.5 w-24 rounded-lg mb-2" style={{ background: 'rgba(255,255,255,0.2)' }} />
                      <div className="h-2.5 w-full rounded-full mb-1.5" style={{ background: 'rgba(255,255,255,0.12)' }} />
                      <div className="h-2.5 w-4/5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }

  const studyHours = Math.round((gam?.stats.study_time_minutes || 0) / 60);
  const overallProgress = gam
    ? Math.min(100, ((gam.stats.lessons_completed + gam.stats.exams_taken) / 70) * 100)
    : 0;

  // Build a typed next-action descriptor from the two real endpoints.
  const nextAction = computeNextAction(inProgress, upcoming);
  const completedCount = gam?.stats.exams_taken || 0;
  const ctaLabel  = nextAction?.kind === 'resume' ? 'Tiếp tục' : 'Bắt đầu';
  const eyebrow   = nextAction?.kind === 'resume' ? 'Tiếp tục bài thi' : 'Bài thi tiếp theo';

  const fullName = user?.uName || user?.name || '';
  const firstName = fullName.trim() ? fullName.trim().split(/\s+/).slice(-1)[0] : 'bạn';
  const streak = gam?.streak.current || 0;

  // Teacher reminders strip:
  // 1. Real reminders sent by teacher (highest priority, persisted in DB).
  // 2. Upcoming assignments with deadline within 7 days as auto-fill so the
  //    section is still useful before any teacher hits "Send reminder".
  type ReminderItem = {
    key: string;
    reminderId: number | null;     // DB id when from teacher; null when auto-derived
    assignmentId: number;
    title: string;
    type: string;
    skill: string;
    duration: number | null;
    deadline: string | null;
    daysUntil: number;
    isUrgent: boolean;
    fromTeacher: boolean;
    teacherName: string | null;
    message: string | null;
  };

  const teacherItems: ReminderItem[] = reminders.map((r) => ({
    key: `r-${r.id}`,
    reminderId: r.id,
    assignmentId: r.assignment_id,
    title: r.title || 'Bài thi',
    type: r.type || '',
    skill: r.skill || '',
    duration: r.duration ?? null,
    deadline: r.deadline,
    daysUntil: Number(r.days_until ?? 999),
    isUrgent: Boolean(r.is_urgent),
    fromTeacher: true,
    teacherName: r.teacher_name,
    message: r.message,
  }));

  const teacherAssignmentIds = new Set(teacherItems.map((i) => i.assignmentId));
  const upcomingItems: ReminderItem[] = upcoming
    .filter((t) => !teacherAssignmentIds.has(t.assignment_id) && Number(t.days_until ?? 999) <= 7)
    .map((t) => ({
      key: `u-${t.assignment_id}`,
      reminderId: null,
      assignmentId: t.assignment_id,
      title: t.title || 'Bài thi',
      type: t.type || '',
      skill: t.skill || '',
      duration: t.duration ?? null,
      deadline: t.deadline,
      daysUntil: Number(t.days_until ?? 999),
      isUrgent: Boolean(t.is_urgent),
      fromTeacher: false,
      teacherName: null,
      message: null,
    }));

  const allReminderItems = [...teacherItems, ...upcomingItems]
    .sort((a, b) => {
      // Teacher-sent items first, then by deadline urgency.
      if (a.fromTeacher !== b.fromTeacher) return a.fromTeacher ? -1 : 1;
      return a.daysUntil - b.daysUntil;
    });
  const visibleReminders = allReminderItems.slice(0, 3);
  const totalReminders = allReminderItems.length;

  const handleDismiss = async (item: ReminderItem) => {
    if (!item.reminderId) return; // can't dismiss auto-derived items
    setDismissingId(item.reminderId);
    try {
      await studentApi.dismissReminder(item.reminderId);
      setReminders((prev) => prev.filter((r) => r.id !== item.reminderId));
    } catch {
      // silent fail — user can retry
    } finally {
      setDismissingId(null);
    }
  };

  return (
    <div className="w-full" style={{ background: '#F8F7FF', minHeight: '100vh' }}>

      {/* ══ Hero Header ══════════════════════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E0B4B 0%, #3B1B8F 45%, #1D4ED8 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #A78BFA, transparent)', transform: 'translateY(-50%)' }} />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #60A5FA, transparent)', transform: 'translateY(40%)' }} />
        </div>
        <div className="relative z-10 px-6 sm:px-8 lg:px-10 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-purple-300 text-xs font-bold tracking-widest uppercase mb-1">Trang chủ</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {getGreeting()}, {firstName} 👋
              </h1>
              <p className="text-purple-200 text-sm mt-1">
                {streak > 0
                  ? <>Chuỗi học tập <span className="font-bold text-yellow-300">{streak} ngày</span> liên tiếp — tuyệt vời!</>
                  : 'Hãy bắt đầu hôm nay và xây dựng thói quen học tập.'}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Award className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-bold text-white tabular-nums">{gam?.coins.total || 0}</span>
                <span className="text-xs text-purple-200">xu</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span className="text-sm font-bold text-white">{getLevel(gam?.stats.total_points || 0)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {[
              { label: 'Tiến độ', value: `${Math.round(overallProgress)}%`, color: '#A78BFA' },
              { label: 'Bài hoàn thành', value: gam?.stats.lessons_completed || 0, color: '#34D399' },
              { label: 'Điểm TB', value: `${Math.round(gam?.stats.average_score || 0)}%`, color: '#60A5FA' },
              { label: 'Giờ học', value: `${studyHours}h`, color: '#FBBF24' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <span className="text-lg font-extrabold tabular-nums" style={{ color: s.color }}>{s.value}</span>
                <span className="text-xs font-semibold text-purple-200">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-200 bg-rose-50">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-rose-900">Có lỗi xảy ra</p>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline underline-offset-2 flex-shrink-0"
            >
              Tải lại
            </button>
          </div>
        )}

        {/* ─── Stat tiles ───────────────────────────────────── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile icon={BarChart3} label="Tiến độ tổng quan" value={`${Math.round(overallProgress)}%`} hint="Hoàn thành khóa học" />
          <StatTile icon={BookOpen} label="Bài đã hoàn thành" value={gam?.stats.lessons_completed || 0} hint={`${gam?.stats.exams_taken || 0} bài đánh giá`} />
          <StatTile icon={Target} label="Điểm trung bình" value={`${Math.round(gam?.stats.average_score || 0)}%`} hint="Qua các bài gần đây" />
          <StatTile icon={Clock} label="Thời gian học" value={`${studyHours}h`} hint={streak > 0 ? `Chuỗi ${streak} ngày` : 'Tháng này'} />
        </section>

        {/* ─── Main grid: 3+2 ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          <div className="lg:col-span-3 space-y-6">

            {/* Next test card */}
            {nextAction ? (
              <section
                className="relative rounded-3xl overflow-hidden group hover:-translate-y-0.5 transition-all duration-300"
                style={{ border: '1.5px solid #F0F0F8', boxShadow: `0 4px 24px rgba(124,58,237,0.10)` }}
              >
                {/* Gradient header zone */}
                <div
                  className="relative px-6 pt-6 pb-5 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${PURPLE}18 0%, #1D4ED810 100%)` }}
                >
                  {/* Decorative orb */}
                  <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${PURPLE}, transparent)` }} />

                  <div className="relative z-10 flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_MID})` }}
                    >
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: PURPLE_MID }}>
                          {eyebrow}
                        </p>
                        {nextAction.kind === 'start' && nextAction.isUrgent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                            <AlertCircle className="w-3 h-3" /> Sắp hết hạn
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-extrabold leading-snug truncate" style={{ color: '#1A1040' }}>
                        {nextAction.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="bg-white px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    {nextAction.examType && (
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full font-semibold text-[11px]"
                        style={{ background: PURPLE_LIGHT, color: PURPLE }}
                      >
                        {nextAction.examType}
                      </span>
                    )}
                    {nextAction.skill && nextAction.skill !== 'mixed' && (
                      <span className="text-slate-500 capitalize">{nextAction.skill}</span>
                    )}
                    {nextAction.kind === 'resume' && nextAction.minutesLeft > 0 && (
                      <span className="text-slate-500">Còn {nextAction.minutesLeft} phút</span>
                    )}
                    {nextAction.kind === 'start' && nextAction.durationMin > 0 && (
                      <span className="text-slate-500">{nextAction.durationMin} phút</span>
                    )}
                    {nextAction.kind === 'start' && nextAction.daysUntil > 0 && (
                      <span className="font-semibold" style={{ color: nextAction.daysUntil <= 2 ? '#EF4444' : '#94A3B8' }}>
                        Hạn còn {nextAction.daysUntil} ngày
                      </span>
                    )}
                  </div>
                  <Link
                    to={nextAction.routeUrl}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white flex-shrink-0 transition-all duration-200 hover:gap-3 active:scale-[0.97]"
                    style={{ background: `linear-gradient(135deg, ${PURPLE} 0%, ${PURPLE_MID} 100%)`, boxShadow: `0 4px 14px ${PURPLE}45` }}
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    {ctaLabel}
                    <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </section>
            ) : (
              <section
                className="relative rounded-3xl overflow-hidden"
                style={{ border: '1.5px solid #F0F0F8', boxShadow: '0 2px 12px rgba(124,58,237,0.07)' }}
              >
                <div
                  className="px-6 py-8 text-center"
                  style={{ background: `linear-gradient(135deg, ${PURPLE_LIGHT} 0%, #E0F2FE 100%)` }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_MID})` }}
                  >
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-base font-extrabold" style={{ color: '#1A1040' }}>Bạn đã hoàn thành tất cả bài thi</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {completedCount > 0 ? `Đã hoàn thành ${completedCount} bài. Tiếp tục luyện tập!` : 'Hãy luyện tập để giữ vững kiến thức.'}
                  </p>
                  <Link
                    to="/hoc-vien/luyen-tap"
                    className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-2xl text-sm font-bold text-white transition-all"
                    style={{ background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_MID})`, boxShadow: `0 4px 14px ${PURPLE}40` }}
                  >
                    Đi đến luyện tập <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>
            )}

            {/* Progress section */}
            <section
              className="rounded-3xl overflow-hidden hover:-translate-y-0.5 transition-all duration-300"
              style={{ border: '1.5px solid #F0F0F8', boxShadow: '0 2px 12px rgba(124,58,237,0.07)' }}
            >
              {/* Gradient header */}
              <div
                className="relative px-6 py-5 overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${PURPLE}18 0%, #1D4ED810 100%)` }}
              >
                <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full opacity-20 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${PURPLE_MID}, transparent)` }} />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_MID})` }}>
                      <TrendingUp className="w-[18px] h-[18px] text-white" strokeWidth={2.2} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: PURPLE_MID }}>Tổng quan</p>
                      <h2 className="text-sm font-extrabold leading-tight" style={{ color: '#1A1040' }}>Tiến độ học tập</h2>
                    </div>
                  </div>
                  <span
                    className="text-[11px] font-bold px-3 py-1 rounded-full"
                    style={{ background: PURPLE_LIGHT, color: PURPLE }}
                  >
                    Tháng này
                  </span>
                </div>
              </div>

              {/* Progress rows */}
              <div className="bg-white px-6 py-5">
                <div className="space-y-4">
                  <ProgressRow label="Hoàn thành khóa học"   current={gam?.stats.lessons_completed || 0} total={50} />
                  <ProgressRow label="Bài đánh giá đã làm"  current={gam?.stats.exams_taken || 0}       total={20} />
                  <ProgressRow label="Phiên luyện tập"      current={gam?.stats.practice_sessions || 0} total={30} />
                  <ProgressRow label="Thành tích đã mở khóa" current={gam?.achievements.completed || 0} total={gam?.achievements.total || 10} />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT: Reminders + Performance + Streak */}
          <div className="lg:col-span-2 space-y-5">

            {/* Reminders — premium sidebar card */}
            {visibleReminders.length > 0 && (
              <section
                className="rounded-3xl overflow-hidden"
                style={{
                  background: '#fff',
                  border: '1.5px solid #F0F0F8',
                  boxShadow: `0 4px 24px rgba(124,58,237,0.10)`,
                }}
              >
                {/* Purple gradient header */}
                <div
                  className="relative flex items-center justify-between px-5 py-3.5 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, #1E0B4B 0%, ${PURPLE} 100%)` }}
                >
                  {/* Orb */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-25 pointer-events-none"
                    style={{ background: `radial-gradient(circle, #A78BFA, transparent)` }} />
                  <div className="relative z-10 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(167,139,250,0.25)' }}>
                      <Bell className="w-3.5 h-3.5 text-purple-200" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-semibold text-white leading-tight">
                      {teacherItems.length > 0 ? 'Giáo viên nhắc nhở' : 'Bài tập sắp đến hạn'}
                    </span>
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold tabular-nums"
                      style={{ background: 'rgba(255,255,255,0.22)', color: '#fff' }}>
                      {totalReminders}
                    </span>
                  </div>
                  <Link
                    to="/hoc-vien/bai-tap"
                    className="relative z-10 text-[11px] font-medium text-purple-200 hover:text-white transition-colors flex items-center gap-0.5"
                  >
                    Tất cả <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Items */}
                <div className="py-0.5">
                  {visibleReminders.map((item, idx) => {
                    const isUrgent = item.isUrgent || item.daysUntil <= 1;
                    const isWarn   = !isUrgent && item.daysUntil <= 3;
                    const isDismissing = dismissingId === item.reminderId;
                    const accentColor = isUrgent ? '#EF4444' : isWarn ? '#F97316' : PURPLE_MID;
                    const ctaBg       = isUrgent ? '#EF4444' : `linear-gradient(135deg, ${PURPLE}, ${PURPLE_MID})`;
                    return (
                      <div
                        key={item.key}
                        className="group relative flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors duration-150"
                        style={{ borderBottom: idx < visibleReminders.length - 1 ? '1px solid #F8FAFC' : 'none' }}
                      >
                        {/* Always-visible left accent */}
                        <div
                          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full"
                          style={{ background: accentColor, opacity: isUrgent || isWarn ? 1 : 0.35 }}
                        />

                        {/* Content */}
                        <div className="flex-1 min-w-0 pl-1">
                          <p className="text-[13px] font-semibold text-slate-800 truncate leading-snug">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {item.type && <span className="text-[11px] text-slate-400">{item.type}</span>}
                            {item.duration ? <span className="text-[11px] text-slate-300">· {item.duration}ph</span> : null}
                            <span className="text-[11px] font-semibold ml-1" style={{ color: accentColor }}>
                              {formatDeadline(item.deadline, item.daysUntil)}
                            </span>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Link
                            to={`/hoc-vien/phong-cho/${item.assignmentId}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white transition-all hover:opacity-90 active:scale-95"
                            style={{ background: ctaBg }}
                          >
                            Làm bài <ArrowRight className="w-3 h-3" />
                          </Link>
                          {item.fromTeacher && item.reminderId && (
                            <button
                              onClick={() => handleDismiss(item)}
                              disabled={isDismissing}
                              className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center text-slate-300 hover:text-slate-500 disabled:opacity-30 rounded-md hover:bg-slate-100"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Performance + Streak side-by-side */}
            <div className="grid grid-cols-2 gap-4">
              <section
                className="rounded-3xl overflow-hidden hover:-translate-y-0.5 transition-all duration-300"
                style={{ border: '1.5px solid #F0F0F8', boxShadow: '0 2px 12px rgba(124,58,237,0.07)' }}
              >
                <div
                  className="relative px-4 py-3.5 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${PURPLE}18 0%, #1D4ED810 100%)` }}
                >
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${PURPLE_MID}, transparent)` }} />
                  <div className="relative z-10 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_MID})` }}>
                      <Award className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold tracking-widest uppercase" style={{ color: PURPLE_MID }}>Kết quả</p>
                      <h2 className="text-xs font-extrabold leading-tight" style={{ color: '#1A1040' }}>Hiệu suất</h2>
                    </div>
                  </div>
                </div>
                <div className="bg-white px-4 py-1.5 divide-y divide-slate-100">
                  <KeyValue label="Điểm TB" value={`${Math.round(gam?.stats.average_score || 0)}%`} />
                  <KeyValue label="Tổng điểm" value={gam?.stats.total_points || 0} />
                  <KeyValue label="Huy hiệu" value={gam?.badges.earned || 0} />
                </div>
              </section>

              <section
                className="rounded-3xl overflow-hidden hover:-translate-y-0.5 transition-all duration-300"
                style={{ border: '1.5px solid #F0F0F8', boxShadow: '0 2px 12px rgba(124,58,237,0.07)' }}
              >
                <div
                  className="relative px-4 py-3.5 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${PURPLE}18 0%, #1D4ED810 100%)` }}
                >
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20 pointer-events-none"
                    style={{ background: `radial-gradient(circle, #FBBF24, transparent)` }} />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }}>
                        <Flame className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold tracking-widest uppercase" style={{ color: PURPLE_MID }}>Hoạt động</p>
                        <h2 className="text-xs font-extrabold leading-tight" style={{ color: '#1A1040' }}>Đều đặn</h2>
                      </div>
                    </div>
                    {streak > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#FEF3C7', color: '#92400E' }}>
                        🔥{streak}
                      </span>
                    )}
                  </div>
                </div>
                <div className="bg-white px-4 py-1.5 divide-y divide-slate-100">
                  <KeyValue label="Hiện tại" value={`${streak} ngày`} highlight={streak > 0} />
                  <KeyValue label="Dài nhất" value={`${gam?.streak.longest || 0} ngày`} />
                  <KeyValue label="Tổng ngày" value={gam?.streak.total_active_days || 0} />
                </div>
              </section>
            </div>

            {/* Tip card */}
            <section
              className="rounded-3xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, #1E0B4B 0%, ${PURPLE} 100%)`,
                border: '1.5px solid #6D28D9',
                boxShadow: `0 4px 20px rgba(124,58,237,0.25)`,
              }}
            >
              <div className="relative px-5 py-5 overflow-hidden">
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-20 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, #60A5FA, transparent)' }} />
                <div className="relative z-10 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Mẹo cho bạn</p>
                    <p className="text-xs text-purple-200 mt-1 leading-relaxed">
                      Học <span className="font-bold text-yellow-300">30 phút mỗi ngày</span> hiệu quả hơn 4 tiếng cuối tuần. Hãy đặt lời nhắc cố định mỗi ngày.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ─── Danh sách bài tập được giao ────────────────────── */}
        {pendingAssignments.length > 0 && (() => {
          const SKILL_MAP: Record<string, { label: string; color: string; bg: string; icon: any }> = {
            listening: { label: 'Listening', color: 'text-blue-700',   bg: 'bg-blue-50',   icon: Headphones },
            reading:   { label: 'Reading',   color: 'text-emerald-700', bg: 'bg-emerald-50', icon: BookOpenCheck },
            writing:   { label: 'Writing',   color: 'text-violet-700', bg: 'bg-violet-50', icon: PenLine },
            speaking:  { label: 'Speaking',  color: 'text-orange-700', bg: 'bg-orange-50', icon: Mic },
            mixed:     { label: 'Full Test', color: 'text-slate-700',  bg: 'bg-slate-100', icon: ClipboardList },
          };
          const visible = showAllAssignments ? pendingAssignments : pendingAssignments.slice(0, 5);
          return (
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-slate-400" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Bài tập được giao</h2>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold">
                    {pendingAssignments.length}
                  </span>
                </div>
                <Link to="/hoc-vien/bai-tap" className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                  Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-slate-50">
                {visible.map((a) => {
                  const skill = SKILL_MAP[a.exam_skill?.toLowerCase()] ?? SKILL_MAP['mixed'];
                  const SkillIcon = skill.icon;
                  const deadlineStr = a.deadline
                    ? (() => {
                        const d = new Date(a.deadline);
                        const diff = Math.ceil((d.getTime() - Date.now()) / 86400000);
                        if (diff <= 0) return { text: 'Hết hạn hôm nay', urgent: true };
                        if (diff === 1) return { text: 'Còn 1 ngày', urgent: true };
                        if (diff <= 3) return { text: `Còn ${diff} ngày`, urgent: true };
                        return { text: `Hạn: ${d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}`, urgent: false };
                      })()
                    : null;
                  const attemptsLeft = a.attempts_allowed > 0 ? a.attempts_allowed - a.attempts_used : null;

                  return (
                    <div key={a.assignment_id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${skill.bg}`}>
                        <SkillIcon className={`w-[17px] h-[17px] ${skill.color}`} strokeWidth={2.2} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                          <span className="text-sm font-semibold text-slate-900 truncate">{a.exam_title}</span>
                          {(a.is_urgent || deadlineStr?.urgent) && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white flex-shrink-0">KHẨN</span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-slate-500">
                          <span className={`font-semibold ${skill.color}`}>{a.exam_type} · {skill.label}</span>
                          {a.exam_duration > 0 && <span>{a.exam_duration} phút</span>}
                          {a.total_questions > 0 && <span>{a.total_questions} câu</span>}
                          {deadlineStr && (
                            <span className={deadlineStr.urgent ? 'font-semibold text-rose-700' : 'text-slate-500'}>
                              {deadlineStr.text}
                            </span>
                          )}
                          {attemptsLeft !== null && (
                            <span className="text-slate-400">Còn {attemptsLeft} lượt</span>
                          )}
                        </div>
                      </div>

                      <Link
                        to={`/hoc-vien/phong-cho/${a.assignment_id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors flex-shrink-0"
                      >
                        Làm bài <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  );
                })}
              </div>

              {pendingAssignments.length > 5 && (
                <button
                  onClick={() => setShowAllAssignments(v => !v)}
                  className="w-full py-3 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  {showAllAssignments ? 'Thu gọn' : `Xem thêm ${pendingAssignments.length - 5} bài tập`}
                </button>
              )}
            </section>
          );
        })()}

      </div>
    </div>
  );
}
