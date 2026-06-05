import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Camera, CheckCircle2, GraduationCap, Phone } from 'lucide-react';
import { AccountInfoCard } from '../account/AccountInfoCard';
import { PasswordChangeCard } from '../account/PasswordChangeCard';
import { SecurityCard } from '../account/SecurityCard';
import { usePageTitle, PAGE_TITLES } from '../../../../hooks/usePageTitle';
import { studentApi } from '../../../../services/studentApi';

type ProfileData = {
  uId: number;
  uName: string;
  uPhone: string;
  uGender: 0 | 1 | boolean | null;
  uAddress: string | null;
  uDoB: string | null;
  bio: string | null;
  avatar_url: string | null;
  age_group?: string;
};

const initialsFrom = (name: string) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return parts[parts.length - 1][0]!.toUpperCase();
};

const scrollToCard = () => {
  document.getElementById('account-info-body')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

export function Profile() {
  usePageTitle(PAGE_TITLES.STUDENT_PROFILE);

  const { data } = useQuery({
    queryKey: ['student', 'profile'],
    queryFn: () => studentApi.getProfile(),
  });
  const profile: ProfileData | undefined =
    (data as any)?.data?.data ?? (data as any)?.data;

  // ─── Completeness calculation ────────────────────────────────
  const { pct, filled, total, missingLabels } = useMemo(() => {
    const fields: Array<{ key: string; label: string; filled: boolean }> = [
      { key: 'avatar',  label: 'Ảnh đại diện',  filled: !!profile?.avatar_url },
      { key: 'name',    label: 'Họ và tên',     filled: !!profile?.uName?.trim() },
      { key: 'phone',   label: 'Số điện thoại', filled: !!profile?.uPhone?.trim() },
      { key: 'gender',  label: 'Giới tính',     filled: profile?.uGender !== null && profile?.uGender !== undefined },
      { key: 'dob',     label: 'Ngày sinh',     filled: !!profile?.uDoB },
      { key: 'address', label: 'Địa chỉ',       filled: !!profile?.uAddress?.trim() },
      { key: 'bio',     label: 'Giới thiệu',    filled: !!profile?.bio?.trim() },
    ];
    const filledFields = fields.filter((f) => f.filled);
    const f = filledFields.length;
    const t = fields.length;
    return {
      pct: Math.round((f / t) * 100),
      filled: f,
      total: t,
      missingLabels: fields.filter((x) => !x.filled).map((x) => x.label),
    };
  }, [profile]);

  // ─── Ring geometry ───────────────────────────────────────────
  const RADIUS = 30;
  const CIRC = 2 * Math.PI * RADIUS;
  const dash = (pct / 100) * CIRC;

  const name = profile?.uName?.trim() || 'Học viên';

  return (
    <div className="min-h-screen" style={{ background: '#F8F7FF' }}>

      {/* ══ Hero ════════════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E0B4B 0%, #4C1D95 45%, #6D28D9 100%)' }}
      >
        {/* Decorative orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #A78BFA, transparent)', transform: 'translateY(-50%)' }} />
          <div className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #60A5FA, transparent)', transform: 'translateY(40%)' }} />
        </div>

        <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-8">
          <p className="text-purple-300 text-[11px] font-bold tracking-[0.18em] uppercase mb-5">Hồ sơ của tôi</p>

          <div className="flex items-center gap-5 sm:gap-6 flex-wrap">
            {/* ── Avatar with camera overlay ── */}
            <button
              type="button"
              onClick={scrollToCard}
              className="relative group flex-shrink-0 focus:outline-none"
              aria-label="Đổi ảnh đại diện"
            >
              <div
                className="w-[88px] h-[88px] rounded-2xl overflow-hidden flex items-center justify-center text-white text-3xl font-extrabold transition-transform duration-300 group-hover:scale-[1.03]"
                style={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
                  boxShadow: '0 12px 32px -8px rgba(124,58,237,0.45), 0 0 0 3px rgba(255,255,255,0.12)',
                }}
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span>{initialsFrom(name)}</span>
                )}
              </div>
              {/* Camera overlay */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                style={{ background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.18)' }}>
                <Camera className="w-4 h-4" style={{ color: '#6D28D9' }} strokeWidth={2.4} />
              </div>
            </button>

            {/* ── Identity ── */}
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight truncate">
                {name}
              </h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
                  style={{ background: 'rgba(167,139,250,0.20)', color: '#DDD6FE', border: '1px solid rgba(167,139,250,0.30)' }}>
                  <GraduationCap className="w-3 h-3" strokeWidth={2.4} />
                  Học viên
                </span>
                {profile?.uPhone && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-purple-100"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
                    <Phone className="w-3 h-3" strokeWidth={2.4} />
                    {profile.uPhone}
                  </span>
                )}
              </div>
              <p className="text-purple-200/80 text-xs mt-2 leading-relaxed max-w-md">
                {pct === 100
                  ? 'Hồ sơ của bạn đã hoàn thiện — sẵn sàng cho mọi tính năng.'
                  : `Hồ sơ chưa đầy đủ — bổ sung ${missingLabels.length} mục để mở khóa hết tính năng.`}
              </p>
            </div>

            {/* ── Profile completeness ring ── */}
            <button
              type="button"
              onClick={scrollToCard}
              className="flex items-center gap-4 pl-4 pr-5 py-3.5 rounded-2xl flex-shrink-0 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: '0 8px 32px -8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              {/* Ring */}
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 68 68">
                  <circle cx="34" cy="34" r={RADIUS} fill="none"
                    stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                  <circle cx="34" cy="34" r={RADIUS} fill="none"
                    stroke={pct === 100 ? 'url(#completeFull)' : 'url(#completePartial)'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${CIRC}`}
                    style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1)' }} />
                  <defs>
                    <linearGradient id="completePartial" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FCD34D" />
                      <stop offset="100%" stopColor="#F97316" />
                    </linearGradient>
                    <linearGradient id="completeFull" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#86EFAC" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  {pct === 100 ? (
                    <CheckCircle2 className="w-6 h-6" style={{ color: '#34D399' }} strokeWidth={2.4} />
                  ) : (
                    <div className="flex items-baseline">
                      <span className="text-base font-extrabold text-white tabular-nums leading-none">{pct}</span>
                      <span className="text-[9px] font-semibold text-white/55 ml-0.5">%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-1 leading-none text-left">
                <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/55">
                  Hồ sơ hoàn thiện
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-lg font-extrabold text-white tabular-nums leading-none">{filled}</span>
                  <span className="text-xs font-medium text-white/55 leading-none">/ {total} mục</span>
                </div>
                <span className="text-[10px] font-medium text-purple-200/80 leading-none mt-1">
                  {pct === 100 ? 'Đã đầy đủ' : `Còn thiếu ${missingLabels.length} mục`}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ══ Content ═════════════════════════════════════════════ */}
      <div className="w-full px-4 sm:px-8 lg:px-12 py-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LEFT — main: Account info (wider column) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 px-1">
              <span className="inline-block w-1 h-4 rounded-full" style={{ background: '#7C3AED' }} />
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-slate-500">
                Thông tin cá nhân
              </p>
            </div>
            <AccountInfoCard />
          </div>

          {/* RIGHT — sidebar: Security stack */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2 px-1">
              <span className="inline-block w-1 h-4 rounded-full" style={{ background: '#F59E0B' }} />
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-slate-500">
                Bảo mật &amp; tài khoản
              </p>
            </div>
            <div className="lg:sticky lg:top-4 space-y-4">
              <PasswordChangeCard />
              <SecurityCard defaultExpanded={false} />
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
