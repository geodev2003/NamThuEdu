import ThemeSwitcher from './ThemeSwitcher';
import { User, Bell, Shield, Globe } from 'lucide-react';

export function Settings() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
        <p className="text-gray-600 mt-1">Quản lý tài khoản và tùy chỉnh giao diện</p>
      </div>

      {/* Theme Settings */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Globe className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Giao diện</h2>
            <p className="text-sm text-gray-600">Chọn giao diện phù hợp với độ tuổi của bạn</p>
          </div>
        </div>
        <ThemeSwitcher />
      </section>

      {/* Account Settings */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Tài khoản</h2>
            <p className="text-sm text-gray-600">Thông tin cá nhân và bảo mật</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Tính năng đang phát triển...
        </div>
      </section>

      {/* Notification Settings */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <Bell className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Thông báo</h2>
            <p className="text-sm text-gray-600">Quản lý thông báo và nhắc nhở</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Tính năng đang phát triển...
        </div>
      </section>

      {/* Privacy Settings */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Quyền riêng tư</h2>
            <p className="text-sm text-gray-600">Bảo mật và quyền riêng tư</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Tính năng đang phát triển...
        </div>
      </section>
    </div>
  );
}
