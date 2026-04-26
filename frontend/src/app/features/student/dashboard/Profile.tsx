import { useState } from 'react';
import { User, Lock } from 'lucide-react';
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs sm:text-sm text-rose-500 font-semibold mb-1">Hồ sơ</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Hồ sơ của tôi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Cập nhật thông tin cá nhân và bảo mật tài khoản
        </p>
      </div>

      {/* Tab nav */}
      <div className="inline-flex bg-slate-100 p-1 rounded-xl">
        {tabs.map(({ key, label, Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors
                ${active
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {tab === 'info'     && <AccountInfoCard />}
      {tab === 'password' && <PasswordChangeCard />}
    </div>
  );
}
