/**
 * Kids Layout - Giao diện dành cho trẻ em (6-12 tuổi)
 * 
 * Đặc điểm:
 * - Màu sắc tươi sáng, nhiều emoji
 * - Navigation đơn giản, icon lớn
 * - Gamification nổi bật
 * - An toàn cho trẻ em
 */

import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  Home,
  ClipboardList,
  Sparkles,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

type NavItem = { icon: any; label: string; path: string };

const NavLink = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: any;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      relative w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[15px] font-semibold
      transition-all duration-150 active:scale-[0.98]
      ${isActive
        ? 'bg-rose-50 text-rose-700'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
    `}
  >
    {isActive && (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-rose-500 rounded-r-full" />
    )}
    <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-rose-500' : 'text-slate-400'}`} />
    <span>{label}</span>
  </button>
);

export function KidsLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_role');
    localStorage.removeItem('user');
    navigate('/dang-nhap');
  };

  const navItems: NavItem[] = [
    { icon: Home,          label: 'Trang chủ',  path: '/hoc-vien/kids' },
    { icon: ClipboardList, label: 'Bài thi',    path: '/hoc-vien/bai-tap' },
    { icon: Sparkles,      label: 'Luyện tập',  path: '/hoc-vien/luyen-tap' },
    { icon: Trophy,        label: 'Thành tích', path: '/hoc-vien/kids/thanh-tich' },
    { icon: Settings,      label: 'Cài đặt',    path: '/hoc-vien/kids/cai-dat' },
  ];

  const initial = (user?.uName || 'B')[0]?.toUpperCase() || 'B';

  return (
    <div className="kids-scope min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white flex items-center justify-center text-base font-bold shadow-sm">
              {initial}
            </div>
            <div>
              <p className="text-[15px] font-bold text-slate-900 leading-tight">{user?.uName || 'Bạn'}</p>
              <p className="text-xs text-slate-500">Cambridge YL</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 w-64 h-screen
            bg-white border-r border-slate-200 flex flex-col
            transform transition-transform duration-200 ease-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Brand / User */}
          <div className="px-5 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-400 via-pink-500 to-orange-400 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-rose-200/60">
                {initial}
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-bold text-slate-900 truncate">{user?.uName || 'Bạn'}</p>
                <p className="text-xs text-slate-500">Cambridge YL · Kids</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-3 mb-1">
              Khám phá
            </p>
            {navItems.map(item => (
              <NavLink
                key={item.path}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              />
            ))}
          </nav>

          {/* Footer / Logout */}
          <div className="px-3 py-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[15px] font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
            >
              <LogOut className="w-[18px] h-[18px] text-slate-400" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}