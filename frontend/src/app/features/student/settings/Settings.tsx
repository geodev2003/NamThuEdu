import ThemeSwitcher from './ThemeSwitcher';
import { Palette } from 'lucide-react';
import { AccountInfoCard } from '../account/AccountInfoCard';
import { PasswordChangeCard } from '../account/PasswordChangeCard';

export function Settings() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6">
      {/* Page header */}
      <div>
        <p className="text-xs sm:text-sm text-rose-500 font-semibold mb-1">Cài đặt</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Quản lý tài khoản
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Cập nhật thông tin cá nhân, mật khẩu và tùy chỉnh giao diện
        </p>
      </div>

      {/* Account info */}
      <AccountInfoCard />

      {/* Password change */}
      <PasswordChangeCard />

      {/* Theme Settings */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
        <header className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
            <Palette className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Giao diện</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Chọn giao diện phù hợp với độ tuổi của bạn
            </p>
          </div>
        </header>
        <ThemeSwitcher />
      </section>
    </div>
  );
}
