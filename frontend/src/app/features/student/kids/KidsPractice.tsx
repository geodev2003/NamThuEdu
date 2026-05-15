import { Link } from 'react-router';
import {
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  Shuffle,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { usePageTitle, PAGE_TITLES } from '../../../../hooks/usePageTitle';

// ─── Skill cards ──────────────────────────────────────────────────────────────

const SKILLS = [
  {
    Icon: Headphones,
    label: 'Nghe',
    desc: 'Nghe và làm theo hướng dẫn — luyện hiểu tiếng Anh nói.',
    accent: 'rose',
    link: '/hoc-vien/luyen-tap?skill=listening',
  },
  {
    Icon: BookOpen,
    label: 'Đọc',
    desc: 'Đọc câu chuyện ngắn, hình ảnh — luyện đọc hiểu vui vẻ.',
    accent: 'sky',
    link: '/hoc-vien/luyen-tap?skill=reading',
  },
  {
    Icon: PenLine,
    label: 'Viết',
    desc: 'Viết câu đơn giản — luyện chính tả và ngữ pháp cơ bản.',
    accent: 'emerald',
    link: '/hoc-vien/luyen-tap?skill=writing',
  },
  {
    Icon: Mic,
    label: 'Nói',
    desc: 'Nói theo mẫu — luyện phát âm chuẩn như người bản xứ.',
    accent: 'violet',
    link: '/hoc-vien/luyen-tap?skill=speaking',
  },
] as const;

const ACCENT_TONES: Record<string, { bg: string; text: string; ring: string; hover: string }> = {
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    ring: 'ring-rose-200',    hover: 'hover:border-rose-300' },
  sky:     { bg: 'bg-sky-50',     text: 'text-sky-600',     ring: 'ring-sky-200',     hover: 'hover:border-sky-300' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200', hover: 'hover:border-emerald-300' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  ring: 'ring-violet-200',  hover: 'hover:border-violet-300' },
};

// ─── Practice modes ───────────────────────────────────────────────────────────

const MODES = [
  {
    Icon: Shuffle,
    label: 'Luyện ngẫu nhiên',
    desc: '10 câu hỏi tổng hợp từ nhiều chủ đề',
    link: '/hoc-vien/kids/luyen-tap/random?count=10',
  },
  {
    Icon: RotateCcw,
    label: 'Ôn lại bài sai',
    desc: 'Làm lại các câu em đã sai gần đây',
    link: '/hoc-vien/kids/luyen-tap/mistakes',
  },
  {
    Icon: Sparkles,
    label: 'Khám phá chủ đề mới',
    desc: 'Học từ vựng theo chủ đề thú vị',
    link: '/hoc-vien/kids/luyen-tap/new',
  },
] as const;

// ─── Cambridge YL levels ──────────────────────────────────────────────────────

const LEVELS = [
  {
    label: 'Starters',
    sub: 'Pre A1',
    emoji: '🌱',
    desc: 'Từ vựng, câu chào hỏi cơ bản',
    tone: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
  {
    label: 'Movers',
    sub: 'A1',
    emoji: '🚀',
    desc: 'Đoạn văn ngắn, câu đơn giản',
    tone: 'bg-sky-50 text-sky-700 ring-sky-200',
  },
  {
    label: 'Flyers',
    sub: 'A2',
    emoji: '✈️',
    desc: 'Đoạn văn dài, viết đoạn ngắn',
    tone: 'bg-violet-50 text-violet-700 ring-violet-200',
  },
] as const;

// ─── Main component ───────────────────────────────────────────────────────────

export function KidsPractice() {
  usePageTitle(PAGE_TITLES.STUDENT_PRACTICE);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6">

        {/* ─── Header ──────────────────────────────────────────── */}
        <header>
          <p className="text-xs sm:text-sm text-rose-500 font-semibold mb-1">Luyện tập</p>
          <h1 className="text-2xl sm:text-3xl text-slate-900 leading-tight">
            Khu vực luyện tập 🎯
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chọn kỹ năng em muốn luyện hôm nay — học một chút mỗi ngày nhé!
          </p>
        </header>

        {/* ─── 4 Skills ────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
          <header className="mb-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">4 Kỹ năng</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Nghe · Đọc · Viết · Nói
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SKILLS.map(s => {
              const tone = ACCENT_TONES[s.accent];
              return (
                <Link
                  key={s.label}
                  to={s.link}
                  className={`group bg-white border border-slate-200 rounded-xl p-5 transition-all
                              hover:shadow-md ${tone.hover} active:scale-[0.99]`}
                >
                  <div className={`w-11 h-11 rounded-xl ${tone.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <s.Icon className={`w-5 h-5 ${tone.text}`} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-4">{s.label}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{s.desc}</p>
                  <div className={`inline-flex items-center gap-1 text-xs font-semibold mt-3 ${tone.text}`}>
                    Bắt đầu
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ─── Cách luyện ──────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
          <header className="mb-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Cách luyện</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Chọn cách luyện em thích — vui vẻ và hiệu quả!
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MODES.map(m => (
              <Link
                key={m.label}
                to={m.link}
                className="group flex items-start gap-3 bg-slate-50/60 hover:bg-rose-50/60 border border-slate-200
                           hover:border-rose-200 rounded-xl p-4 transition-all active:scale-[0.99]"
              >
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 group-hover:border-rose-200
                                flex items-center justify-center flex-shrink-0 transition-colors">
                  <m.Icon className="w-4 h-4 text-slate-600 group-hover:text-rose-600 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900">{m.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{m.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500 transition-all group-hover:translate-x-0.5 flex-shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </section>

        {/* ─── Cambridge YL Levels ─────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
          <header className="mb-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Lộ trình Cambridge</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Starters · Movers · Flyers — 3 cấp độ tăng dần
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {LEVELS.map((lv, i) => (
              <div key={lv.label} className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ring-inset ${lv.tone}`}>
                    {lv.sub}
                  </span>
                  <span className="text-xs text-slate-400">Bước {i + 1}</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-2xl">{lv.emoji}</span>
                  <h3 className="text-base font-bold text-slate-900">{lv.label}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{lv.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Tip card ───────────────────────────────────────── */}
        <section className="rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white border border-rose-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-rose-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900">Mẹo nhỏ cho em</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Luyện <strong>15 phút mỗi ngày</strong> tốt hơn ngồi 2 tiếng một lần.
                Cố gắng học đều đặn để giữ chuỗi ngày học của em nhé! 🔥
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
