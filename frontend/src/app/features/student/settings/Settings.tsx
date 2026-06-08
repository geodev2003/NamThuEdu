import { useState, type ComponentType, type CSSProperties } from 'react';
import { Settings2, User, ShieldCheck } from 'lucide-react';
import { AccountInfoCard } from '../account/AccountInfoCard';
import { PasswordChangeCard } from '../account/PasswordChangeCard';

type Tab = 'profile' | 'security';

const TABS: { id: Tab; label: string; icon: ComponentType<{ className?: string; style?: CSSProperties }>; desc: string }[] = [
  { id: 'profile',  label: 'Thông tin cá nhân', icon: User,        desc: 'Tên, ngày sinh, địa chỉ, ảnh đại diện' },
  { id: 'security', label: 'Bảo mật',           icon: ShieldCheck, desc: 'Đổi mật khẩu, bảo vệ tài khoản' },
];

const INDIGO = '#4F46E5';
const INDIGO_DARK = '#3730A3';
const INDIGO_DEEP = '#1E1B4B';

export function Settings() {
  const [tab, setTab] = useState<Tab>('profile');
  const activeTab = TABS.find(t => t.id === tab)!;
  const ActiveIcon = activeTab.icon;

  return (
    <div className="min-h-screen" style={{ background: '#F5F3FF' }}>

      {/* ─── Hero ──────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${INDIGO_DEEP} 0%, ${INDIGO_DARK} 50%, ${INDIGO} 100%)`, paddingBottom: '4rem' }}>
        {/* Decorative orbs */}
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, #818CF8, transparent)' }} />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(circle, #A5B4FC, transparent)', transform: 'translateY(50%)' }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-8 pt-8 pb-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
              <Settings2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-indigo-300 text-xs font-bold tracking-widest uppercase">Tài khoản</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Cài đặt</h1>
            </div>
          </div>
        </div>

        {/* ─── Floating Tab Bar ─────────────────────────────────────────────── */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-8 mt-6">
          <div className="flex gap-2 p-1.5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.18)' }}>
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={active
                    ? { background: 'rgba(255,255,255,0.95)', color: INDIGO, boxShadow: '0 2px 12px rgba(79,70,229,0.25)' }
                    : { color: 'rgba(255,255,255,0.75)' }
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Tab description strip ─────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <div className="flex items-center gap-2.5 -mt-3 mb-5 px-4 py-2.5 rounded-xl shadow-sm"
          style={{ background: 'white', border: `1px solid #EEF2FF` }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: '#EEF2FF' }}>
            <ActiveIcon className="w-3.5 h-3.5" style={{ color: INDIGO }} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">{activeTab.label}</p>
            <p className="text-[11px] text-slate-500">{activeTab.desc}</p>
          </div>
        </div>
      </div>

      {/* ─── Content ───────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-8 pb-10">
        {tab === 'profile'  && <AccountInfoCard  defaultExpanded />}
        {tab === 'security' && <PasswordChangeCard defaultExpanded />}
      </div>

    </div>
  );
}
