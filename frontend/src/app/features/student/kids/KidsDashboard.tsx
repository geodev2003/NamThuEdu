import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Play, ArrowRight, Flame, ChevronRight, AlertCircle, Headphones, BookOpen, PenLine, Mic, Sparkles } from 'lucide-react';
import { api } from '../../../../services/api';
import { studentApi } from '../../../../services/studentApi';
import { usePageTitle, PAGE_TITLES } from '../../../../hooks/usePageTitle';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GamificationData {
  coins: { total: number };
  stats: {
    lessons_completed: number;
    exams_taken: number;
    total_points: number;
    average_score: number;
    study_time_minutes: number;
  };
  streak: { current: number; longest: number };
  badges: { earned: number };
  achievements: { completed: number; total: number };
}

interface TestItem {
  assignment_id: number;
  exam_title: string;
  exam_type: string;
  exam_skill: string;
  exam_duration: number;
  total_questions: number;
  attempts_allowed: number;
  attempts_used: number;
  is_urgent: boolean;
  status: 'pending' | 'in_progress' | 'completed';
  submission_id?: number;
}

// ─── Cambridge YL filtering ──────────────────────────────────────────────────
// Kids chỉ thấy Cambridge Young Learners. VSTEP/IELTS/TOEIC ẩn (dành cho teens/adults).

type CambridgeLevel = 'starters' | 'movers' | 'flyers' | 'other';

function detectLevel(examType: string, examTitle: string): CambridgeLevel {
  const t = (examType + ' ' + examTitle).toLowerCase();
  if (t.includes('starter') || t.includes('pre a1')) return 'starters';
  if (t.includes('mover')   || /\ba1\b/.test(t))     return 'movers';
  if (t.includes('flyer')   || /\ba2\b/.test(t))     return 'flyers';
  return 'other';
}

function isKidsExam(test: TestItem): boolean {
  const t = (test.exam_type + ' ' + test.exam_title).toLowerCase();
  if (t.includes('vstep') || t.includes('ielts') || t.includes('toeic')) return false;
  return true;
}

const LEVEL_META: Record<Exclude<CambridgeLevel, 'other'>, { label: string; sub: string; tone: string; dot: string }> = {
  starters: { label: 'Starters', sub: 'Pre A1', tone: 'bg-emerald-50 text-emerald-700 ring-emerald-200',  dot: 'bg-emerald-500' },
  movers:   { label: 'Movers',   sub: 'A1',     tone: 'bg-sky-50 text-sky-700 ring-sky-200',              dot: 'bg-sky-500' },
  flyers:   { label: 'Flyers',   sub: 'A2',     tone: 'bg-violet-50 text-violet-700 ring-violet-200',     dot: 'bg-violet-500' },
};

const SKILL_META: Record<string, { label: string; Icon: any }> = {
  listening: { label: 'Nghe',    Icon: Headphones },
  reading:   { label: 'Đọc',     Icon: BookOpen },
  writing:   { label: 'Viết',    Icon: PenLine },
  speaking:  { label: 'Nói',     Icon: Mic },
};

function getSkillMeta(skill: string) {
  return SKILL_META[skill?.toLowerCase()] ?? { label: skill || 'Tổng hợp', Icon: BookOpen };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const Section = ({ title, subtitle, action, children }:
  { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) => (
  <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
    <header className="flex items-start sm:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
      <div className="min-w-0">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </header>
    {children}
  </section>
);

const ExamCard = ({ test }: { test: TestItem }) => {
  const level = detectLevel(test.exam_type, test.exam_title);
  const meta  = level !== 'other' ? LEVEL_META[level] : null;
  const skill = getSkillMeta(test.exam_skill);
  const canStart = test.attempts_used < test.attempts_allowed;
  const inProgress = test.status === 'in_progress';

  return (
    <article className="group bg-white rounded-xl border border-slate-200 p-4 sm:p-5 transition-all hover:border-rose-300 hover:shadow-md">
      {/* Top row: level + urgent */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {meta ? (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ring-inset ${meta.tone}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
            <span className="text-slate-400 font-normal">· {meta.sub}</span>
          </span>
        ) : (
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {test.exam_type}
          </span>
        )}
        {test.is_urgent && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600">
            <AlertCircle className="w-3.5 h-3.5" />
            Sắp hết hạn
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-slate-900 mb-3 line-clamp-2 leading-snug min-h-[2.75rem]">
        {test.exam_title}
      </h3>

      {/* Meta row */}
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
        <span className="inline-flex items-center gap-1.5">
          <skill.Icon className="w-3.5 h-3.5" />
          {skill.label}
        </span>
        <span>{test.exam_duration} phút</span>
        <span>{test.total_questions} câu</span>
      </div>

      {/* Attempts */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
        <span>Lượt làm</span>
        <span className="font-medium text-slate-700">{test.attempts_used} / {test.attempts_allowed}</span>
      </div>

      {/* Action */}
      <Link
        to={canStart ? `/hoc-vien/kids/phong-cho/${test.assignment_id}` : '#'}
        onClick={e => !canStart && e.preventDefault()}
        className={`w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors
          ${canStart
            ? 'bg-rose-500 text-white hover:bg-rose-600'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
      >
        <Play className="w-4 h-4 fill-white" />
        {inProgress ? 'Tiếp tục' : 'Bắt đầu'}
      </Link>
    </article>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function KidsDashboard() {
  usePageTitle(PAGE_TITLES.STUDENT_KIDS_DASHBOARD);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
  const [tests, setTests] = useState<TestItem[]>([]);
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [gamiRes, testsRes, subRes] = await Promise.allSettled([
          api.get('/student/gamification/overview'),
          studentApi.getTests({ status: 'pending' }),
          studentApi.getSubmissions({ limit: 3, sort: 'recent' }),
        ]);

        if (gamiRes.status === 'fulfilled' && gamiRes.value.data.status === 'success') {
          setGamificationData(gamiRes.value.data.data);
        }
        if (testsRes.status === 'fulfilled') {
          const raw = (testsRes.value as any).data?.data;
          const pending = (raw?.pending || []).map((t: any) => ({ ...t, status: 'pending' }));
          const inProg  = (raw?.in_progress || []).map((t: any) => ({ ...t, status: 'in_progress' }));
          setTests([...inProg, ...pending].slice(0, 6));
        }
        if (subRes.status === 'fulfilled') {
          const subs = (subRes.value as any).data?.data?.submissions || [];
          setRecentResults(subs.slice(0, 3));
        }
      } catch (err) {
        console.error('KidsDashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Đang tải bảng điều khiển…</p>
        </div>
      </div>
    );
  }

  const d = gamificationData;
  const coins    = d?.coins.total ?? 0;
  const streak   = d?.streak.current ?? 0;
  const avgScore = Math.round(d?.stats.average_score ?? 0);
  const examsCount = d?.stats.exams_taken ?? 0;

  // Filter: kids chỉ thấy Cambridge YL — ẩn VSTEP/IELTS/TOEIC
  const kidsTests = tests.filter(isKidsExam);

  const SKILLS = [
    { Icon: Headphones, label: 'Nghe',     desc: 'Luyện nghe hiểu', link: '/hoc-vien/kids/luyen-tap' },
    { Icon: BookOpen,   label: 'Đọc',      desc: 'Luyện đọc hiểu',  link: '/hoc-vien/kids/luyen-tap' },
    { Icon: PenLine,    label: 'Viết',     desc: 'Luyện viết câu',  link: '/hoc-vien/kids/luyen-tap' },
    { Icon: Mic,        label: 'Nói',      desc: 'Luyện phát âm',   link: '/hoc-vien/kids/luyen-tap' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6">

        {/* ─── Header ───────────────────────────────────────────── */}
        <header className="space-y-4 lg:space-y-0 lg:flex lg:items-end lg:justify-between lg:gap-6">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-rose-500 font-semibold mb-1">Bảng điều khiển</p>
            <h1 className="text-2xl sm:text-3xl text-slate-900 leading-tight">
              Xin chào, {user?.uName || 'bạn'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Cambridge Young Learners · Starters · Movers · Flyers
            </p>
          </div>

          {/* Compact stats — grid on mobile, inline on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:items-center gap-2">
            <Stat label="Streak" value={`${streak}`} icon={<Flame className="w-3.5 h-3.5 text-rose-500" />} />
            <Stat label="Coins" value={`${coins}`} />
            <Stat label="Điểm TB" value={`${avgScore}%`} />
            <Stat label="Đã thi" value={`${examsCount}`} />
          </div>
        </header>

        {/* ─── Bài thi được giao ───────────────────────────────── */}
        <Section
          title="Bài thi của em"
          subtitle={kidsTests.length > 0 ? `${kidsTests.length} bài đang chờ em làm` : undefined}
          action={
            <Link to="/hoc-vien/kids/bai-tap"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600 hover:text-rose-700">
              Xem tất cả
              <ChevronRight className="w-4 h-4" />
            </Link>
          }
        >
          {kidsTests.length === 0 ? (
            <div className="relative text-center py-14 px-6 rounded-2xl bg-gradient-to-b from-rose-50/60 to-white border border-rose-100">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-rose-100 mx-auto mb-3 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-rose-400" />
              </div>
              <p className="text-base font-semibold text-slate-800">Chưa có bài thi nào</p>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Khi thầy/cô giao bài Starters, Movers hoặc Flyers — sẽ hiện ở đây.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kidsTests.map(test => <ExamCard key={test.assignment_id} test={test} />)}
            </div>
          )}
        </Section>

        {/* ─── Lộ trình Cambridge ──────────────────────────────── */}
        <Section
          title="Lộ trình Cambridge Young Learners"
          subtitle="Ba cấp độ tăng dần — Starters đến Flyers"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['starters', 'movers', 'flyers'] as const).map((lv, i) => {
              const meta = LEVEL_META[lv];
              return (
                <div key={lv} className="relative bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start justify-between">
                    <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ring-inset ${meta.tone}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                      {meta.sub}
                    </div>
                    <span className="text-xs text-slate-400">Bước {i + 1}</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mt-3">{meta.label}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {lv === 'starters' && 'Bước đầu làm quen tiếng Anh. Từ vựng cơ bản, câu chào hỏi, hình ảnh.'}
                    {lv === 'movers'   && 'Mở rộng vốn từ và cấu trúc câu. Đọc hiểu đoạn văn ngắn, viết câu đơn giản.'}
                    {lv === 'flyers'   && 'Vận dụng tiếng Anh trong nhiều tình huống. Đọc đoạn văn dài, viết đoạn ngắn.'}
                  </p>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ─── Luyện kỹ năng ───────────────────────────────────── */}
        <Section
          title="Luyện kỹ năng"
          subtitle="4 kỹ năng — luyện theo nhịp riêng của bạn"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {SKILLS.map(s => (
              <Link
                key={s.label}
                to={s.link}
                className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-rose-300 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-50 group-hover:bg-rose-50 flex items-center justify-center transition-colors">
                  <s.Icon className="w-5 h-5 text-slate-600 group-hover:text-rose-600 transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mt-3">{s.label}</h3>
                <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
                <div className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-rose-600 mt-3 transition-colors">
                  Bắt đầu
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* ─── Kết quả gần đây ────────────────────────────────── */}
        {recentResults.length > 0 && (
          <Section
            title="Kết quả gần đây"
            action={
              <Link to="/hoc-vien/kids/lich-su"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600 hover:text-rose-700">
                <span className="hidden sm:inline">Xem tất cả</span>
                <span className="sm:hidden">Xem</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            }
          >
            <div className="divide-y divide-slate-100">
              {recentResults.map((sub: any) => {
                const score = Math.round(sub.sScore ?? 0);
                const grade = score >= 80 ? 'text-emerald-600'
                            : score >= 60 ? 'text-amber-600'
                            : 'text-rose-600';
                const skill = getSkillMeta(sub.exam?.eSkill || '');
                return (
                  <Link
                    key={sub.sId}
                    to={`/hoc-vien/kids/ket-qua/${sub.sId}`}
                    className="flex items-center gap-3 sm:gap-4 py-3 first:pt-0 last:pb-0 hover:bg-slate-50/50 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <skill.Icon className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{sub.exam?.eTitle || 'Bài thi'}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{skill.label} · {sub.exam?.eTotal_questions || 0} câu</p>
                    </div>
                    <div className={`text-base font-semibold tabular-nums ${grade} flex-shrink-0`}>{score}%</div>
                    <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0 hidden sm:block" />
                  </Link>
                );
              })}
            </div>
          </Section>
        )}

      </div>
    </div>
  );
}

// Compact stat pill used in header (responsive)
const Stat = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <div className="flex items-center justify-between sm:justify-start gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 sm:py-1.5 min-w-0">
    <div className="flex items-center gap-1.5 min-w-0">
      {icon}
      <span className="text-xs text-slate-500 truncate">{label}</span>
    </div>
    <span className="text-sm font-semibold text-slate-900 tabular-nums flex-shrink-0">{value}</span>
  </div>
);
