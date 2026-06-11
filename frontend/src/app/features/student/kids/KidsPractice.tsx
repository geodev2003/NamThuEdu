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

// ─── Claymorphism tokens (đồng bộ với KidsDashboard) ──────────────────────────

const SKILL_CLAY: Record<string, { bg: string; icon: string; shadow: string; emoji: string }> = {
  nghe: { bg: 'linear-gradient(135deg, #FFF0F0, #FECDD3)', icon: '#E11D48', shadow: '0 8px 20px rgba(225,29,72,0.18)', emoji: '👂' },
  đọc:  { bg: 'linear-gradient(135deg, #EFF6FF, #BFDBFE)', icon: '#2563EB', shadow: '0 8px 20px rgba(37,99,235,0.18)', emoji: '📖' },
  viết: { bg: 'linear-gradient(135deg, #F0FFF4, #BBF7D0)', icon: '#059669', shadow: '0 8px 20px rgba(5,150,105,0.18)', emoji: '✏️' },
  nói:  { bg: 'linear-gradient(135deg, #FEFCE8, #FEF08A)', icon: '#B45309', shadow: '0 8px 20px rgba(180,83,9,0.15)', emoji: '🎤' },
};

const SKILLS = [
  { key: 'nghe', Icon: Headphones, label: 'Nghe', desc: 'Nghe và làm theo hướng dẫn — luyện hiểu tiếng Anh nói.', link: '/hoc-vien/luyen-tap?skill=listening' },
  { key: 'đọc',  Icon: BookOpen,   label: 'Đọc',  desc: 'Đọc câu chuyện ngắn, hình ảnh — luyện đọc hiểu vui vẻ.', link: '/hoc-vien/luyen-tap?skill=reading' },
  { key: 'viết', Icon: PenLine,    label: 'Viết', desc: 'Viết câu đơn giản — luyện chính tả và ngữ pháp cơ bản.', link: '/hoc-vien/luyen-tap?skill=writing' },
  { key: 'nói',  Icon: Mic,        label: 'Nói',  desc: 'Nói theo mẫu — luyện phát âm chuẩn như người bản xứ.', link: '/hoc-vien/luyen-tap?skill=speaking' },
] as const;

// ─── Practice modes ───────────────────────────────────────────────────────────

const MODES = [
  { Icon: Shuffle,  label: 'Luyện ngẫu nhiên',     desc: '10 câu hỏi tổng hợp từ nhiều chủ đề', link: '/hoc-vien/luyen-tap/random?count=10', clay: { bg: 'linear-gradient(135deg,#FFF1F2,#FFE4E6)', icon: '#E11D48' } },
  { Icon: RotateCcw, label: 'Ôn lại bài sai',       desc: 'Làm lại các câu em đã sai gần đây',    link: '/hoc-vien/luyen-tap/mistakes',        clay: { bg: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', icon: '#2563EB' } },
  { Icon: Sparkles,  label: 'Khám phá chủ đề mới',  desc: 'Học từ vựng theo chủ đề thú vị',       link: '/hoc-vien/luyen-tap/new',             clay: { bg: 'linear-gradient(135deg,#F0FFF4,#DCFCE7)', icon: '#059669' } },
] as const;

// ─── Cambridge YL levels ──────────────────────────────────────────────────────

const LEVELS = [
  { label: 'Starters', sub: 'Pre A1', emoji: '🌱', desc: 'Từ vựng, câu chào hỏi cơ bản',     clay: { bg: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)', text: '#065F46', badge: '#10B981', badgeBg: 'rgba(209,250,229,0.7)', shadow: '0 8px 24px rgba(16,185,129,0.22)' } },
  { label: 'Movers',   sub: 'A1',     emoji: '🚀', desc: 'Đoạn văn ngắn, câu đơn giản',       clay: { bg: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)', text: '#1E3A8A', badge: '#3B82F6', badgeBg: 'rgba(219,234,254,0.7)', shadow: '0 8px 24px rgba(59,130,246,0.22)' } },
  { label: 'Flyers',   sub: 'A2',     emoji: '✈️', desc: 'Đoạn văn dài, viết đoạn ngắn',       clay: { bg: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)', text: '#4C1D95', badge: '#8B5CF6', badgeBg: 'rgba(237,233,254,0.7)', shadow: '0 8px 24px rgba(139,92,246,0.22)' } },
] as const;

// ─── Section wrapper (đồng bộ ClaySection của dashboard) ──────────────────────

const ClaySection = ({ title, subtitle, emoji, accentColor, children }:
  { title: string; subtitle?: string; emoji?: string; accentColor?: string; children: React.ReactNode }) => (
  <section className="rounded-3xl p-5 sm:p-6"
    style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(251,113,133,0.10), 0 2px 8px rgba(0,0,0,0.04)', border: '2px solid rgba(255,255,255,0.9)' }}>
    <header className="mb-5">
      <h2 className="text-base sm:text-lg font-extrabold tracking-tight" style={{ color: accentColor || '#1A1040' }}>
        {emoji && <span className="mr-1.5">{emoji}</span>}{title}
      </h2>
      {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">{subtitle}</p>}
    </header>
    {children}
  </section>
);

// ─── Main component ───────────────────────────────────────────────────────────

export function KidsPractice() {
  usePageTitle(PAGE_TITLES.STUDENT_PRACTICE);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #FFF1F2 0%, #FFF7ED 50%, #F0FDF4 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-5 pb-8">

        {/* ─── Greeting ────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-3xl p-5 sm:p-7"
          style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF7ED 100%)', boxShadow: '0 8px 32px rgba(251,113,133,0.12)', border: '2px solid rgba(255,255,255,0.9)' }}>
          <div className="absolute -top-10 -right-6 w-40 h-40 rounded-full opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle, #FED7AA, transparent)' }} />
          <div className="absolute -bottom-12 left-1/3 w-36 h-36 rounded-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, #FECDD3, transparent)' }} />
          <div className="relative z-10">
            <p className="text-xs font-extrabold text-rose-400 uppercase tracking-widest mb-1">🎯 Luyện tập</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight" style={{ color: '#9F1239' }}>
              Khu vực luyện tập
            </h1>
            <p className="text-sm font-semibold text-orange-500/80 mt-1">
              Chọn kỹ năng em muốn luyện hôm nay — học một chút mỗi ngày nhé!
            </p>
          </div>
        </section>

        {/* ─── 4 Skills ────────────────────────────────────────── */}
        <ClaySection title="4 Kỹ năng" emoji="💪" subtitle="Nghe · Đọc · Viết · Nói" accentColor="#1E3A8A">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {SKILLS.map(s => {
              const clay = SKILL_CLAY[s.key];
              return (
                <Link key={s.label} to={s.link}
                  className="group rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:-translate-y-1 active:scale-[0.97]"
                  style={{ background: clay.bg, boxShadow: clay.shadow, border: '2px solid rgba(255,255,255,0.85)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/40 backdrop-blur-sm">
                      <s.Icon className="w-5 h-5" style={{ color: clay.icon }} />
                    </div>
                    <span className="text-xl">{clay.emoji}</span>
                  </div>
                  <h3 className="text-sm font-extrabold mb-1" style={{ color: clay.icon }}>{s.label}</h3>
                  <p className="text-xs font-medium mb-3 leading-relaxed line-clamp-2" style={{ color: clay.icon, opacity: 0.7 }}>{s.desc}</p>
                  <div className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-white/50" style={{ color: clay.icon }}>
                    Bắt đầu <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </ClaySection>

        {/* ─── Cách luyện ──────────────────────────────────────── */}
        <ClaySection title="Cách luyện" emoji="🎲" subtitle="Chọn cách luyện em thích — vui vẻ và hiệu quả!" accentColor="#9F1239">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MODES.map(m => (
              <Link key={m.label} to={m.link}
                className="group flex items-start gap-3 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 active:scale-[0.97]"
                style={{ background: m.clay.bg, boxShadow: `0 6px 18px ${m.clay.icon}22`, border: '2px solid rgba(255,255,255,0.85)' }}>
                <div className="w-10 h-10 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <m.Icon className="w-5 h-5" style={{ color: m.clay.icon }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold" style={{ color: m.clay.icon }}>{m.label}</p>
                  <p className="text-xs font-medium mt-0.5 leading-snug" style={{ color: m.clay.icon, opacity: 0.75 }}>{m.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" style={{ color: m.clay.icon, opacity: 0.7 }} />
              </Link>
            ))}
          </div>
        </ClaySection>

        {/* ─── Cambridge YL Levels ─────────────────────────────── */}
        <ClaySection title="Lộ trình Cambridge" emoji="🌈" subtitle="Starters · Movers · Flyers — 3 cấp độ tăng dần" accentColor="#065F46">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LEVELS.map((lv, i) => (
              <div key={lv.label} className="rounded-2xl p-5 transition-all hover:-translate-y-1"
                style={{ background: lv.clay.bg, boxShadow: lv.clay.shadow, border: '2px solid rgba(255,255,255,0.8)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full"
                    style={{ background: lv.clay.badgeBg, color: lv.clay.text, backdropFilter: 'blur(8px)' }}>
                    {lv.sub}
                  </span>
                  <span className="text-xl">{lv.emoji}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: lv.clay.badge }}>Bước {i + 1}</p>
                <h3 className="text-base font-extrabold mb-2" style={{ color: lv.clay.text }}>{lv.label}</h3>
                <p className="text-xs leading-relaxed font-medium" style={{ color: lv.clay.text, opacity: 0.75 }}>{lv.desc}</p>
              </div>
            ))}
          </div>
        </ClaySection>

        {/* ─── Tip card ───────────────────────────────────────── */}
        <section className="rounded-3xl p-5 sm:p-6"
          style={{ background: 'linear-gradient(135deg, #FFF1F2, #FCE7F3)', boxShadow: '0 8px 24px rgba(244,63,94,0.12)', border: '2px solid rgba(255,255,255,0.85)' }}>
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-rose-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-extrabold text-rose-800">Mẹo nhỏ cho em</h3>
              <p className="text-xs sm:text-sm text-rose-700/80 mt-1 leading-relaxed font-medium">
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
