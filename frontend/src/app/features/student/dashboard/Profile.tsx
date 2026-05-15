import { useState } from 'react';
import { User, Lock, UserCircle } from 'lucide-react';
import { AccountInfoCard } from '../account/AccountInfoCard';
import { PasswordChangeCard } from '../account/PasswordChangeCard';
import { usePageTitle, PAGE_TITLES } from '../../../../hooks/usePageTitle';

type Tab = 'info' | 'password';

export function Profile() {
  usePageTitle(PAGE_TITLES.STUDENT_PROFILE);
  const [tab, setTab] = useState<Tab>('info');

  const tabs: { key: Tab; label: string; Icon: any }[] = [
    { key: 'info',     label: 'Thông tin',  Icon: User },
    { key: 'password', label: 'Mật khẩu',   Icon: Lock },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#F8F7FF" }}>

      {/* Hero */}
      <div className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #4C1D95 0%, #6D28D9 45%, #7C3AED 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #C4B5FD, transparent)", transform: "translateY(-50%)" }} />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #A5B4FC, transparent)", transform: "translateY(40%)" }} />
        </div>
        <div className="relative z-10 px-8 lg:px-16 py-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
              style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}>
              <UserCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-purple-200 text-sm font-semibold tracking-widest uppercase mb-1">Tài khoản</p>
              <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">Hồ sơ của tôi</h1>
              <p className="text-purple-200 text-sm mt-1 font-medium">Cập nhật thông tin cá nhân và bảo mật tài khoản</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 space-y-4">

        {/* Tab nav */}
        <div className="inline-flex p-1 rounded-xl" style={{ background: "#EDE9FE" }}>
          {tabs.map(({ key, label, Icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: active ? "#7C3AED" : "transparent",
                  color: active ? "#fff" : "#6D28D9",
                  boxShadow: active ? "0 2px 8px rgba(124,58,237,0.3)" : "none",
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </div>

        {tab === 'info'     && <AccountInfoCard />}
        {tab === 'password' && <PasswordChangeCard />}
      </div>
    </div>
  );
}
