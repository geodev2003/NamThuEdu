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
import { usePushNotification } from '../../hooks/usePushNotification';
import { NotificationPermissionBanner } from '../../components/NotificationPermissionBanner';
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
      relative w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[15px] font-bold
      transition-all duration-150 active:scale-[0.97]
      ${isActive
        ? 'bg-rose-500 text-white shadow-md'
        : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'}
    `}
    style={isActive ? { boxShadow: '0 4px 12px rgba(244,63,94,0.30)' } : undefined}
  >
    <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
    <span>{label}</span>
  </button>
);

export function KidsLayout() {
  const push = usePushNotification();
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
    { icon: ClipboardList, label: 'Bài thi',    path: '/hoc-vien/kids/bai-tap' },
    { icon: Sparkles,      label: 'Luyện tập',  path: '/hoc-vien/kids/luyen-tap' },
    { icon: Trophy,        label: 'Thành tích', path: '/hoc-vien/kids/thanh-tich' },
    { icon: Settings,      label: 'Cài đặt',    path: '/hoc-vien/kids/cai-dat' },
  ];

  const initial = (user?.uName || 'B')[0]?.toUpperCase() || 'B';

  return (
    <div className="kids-scope min-h-screen" style={{ background: 'linear-gradient(160deg, #FFF1F2 0%, #FFF7ED 50%, #F0FDF4 100%)' }}>
      <NotificationPermissionBanner push={push} />
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-30" style={{ background: 'linear-gradient(135deg, #FB7185, #F97316)', boxShadow: '0 2px 12px rgba(251,113,133,0.30)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-base font-bold border-2 border-white/30">
              {initial}
            </div>
            <div>
              <p className="text-[15px] font-bold text-white leading-tight">{user?.uName || 'Bạn'}</p>
              <p className="text-xs text-rose-100">Cambridge YL ⭐</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-white/15 text-white hover:bg-white/25 transition-colors"
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
            bg-white flex flex-col
            transform transition-transform duration-200 ease-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          style={{ boxShadow: '4px 0 24px rgba(251,113,133,0.12)', borderRight: '1.5px solid #FFE4E6' }}
        >
          {/* Brand / User — colorful gradient header */}
          <div className="px-5 py-5" style={{ background: 'linear-gradient(135deg, #FB7185 0%, #F97316 100%)' }}>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-xl font-extrabold border-2 border-white/30">
                {initial}
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-extrabold text-white truncate">{user?.uName || 'Bạn'}</p>
                <p className="text-xs text-rose-100">Cambridge YL ⭐ Kids</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <p className="text-[11px] uppercase tracking-wider text-rose-400 font-bold px-3 mb-1">
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
          <div className="px-3 py-4" style={{ borderTop: '1.5px solid #FFE4E6' }}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[15px] font-bold text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors"
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