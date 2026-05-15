/**
 * Teens Layout - Giao diện dành cho thanh thiếu niên (13-17 tuổi)
 * 
 * Đặc điểm:
 * - Thiết kế hiện đại, trendy
 * - Màu sắc gradient đẹp mắt
 * - Social features
 * - Gamification thông minh
 */

import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { usePushNotification } from '../../hooks/usePushNotification';
import { NotificationPermissionBanner } from '../../components/NotificationPermissionBanner';
import { 
  Home, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Users,
  Settings, 
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react';

const TeensNavItem = ({ 
  icon: Icon, 
  label, 
  path, 
  isActive, 
  onClick,
  badge 
}: {
  icon: any;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
  badge?: number;
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200
        ${isActive 
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
          : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
        }
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="font-semibold">{label}</span>
      {badge && badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
};

export function TeensLayout() {
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

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/hoc-vien/teens' },
    { icon: BookOpen, label: 'Lessons', path: '/hoc-vien/teens/lessons' },
    { icon: TrendingUp, label: 'Progress', path: '/hoc-vien/teens/progress' },
    { icon: Trophy, label: 'Achievements', path: '/hoc-vien/teens/achievements' },
    { icon: Users, label: 'Leaderboard', path: '/hoc-vien/teens/leaderboard' },
    { icon: Bell, label: 'Notifications', path: '/hoc-vien/teens/notifications', badge: 3 },
    { icon: Settings, label: 'Settings', path: '/hoc-vien/teens/settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <NotificationPermissionBanner push={push} />
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-lg p-4 border-b border-indigo-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">{user?.uName?.charAt(0) || 'S'}</span>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Hey {user?.uName}! 👋
              </h1>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-xl border-r border-indigo-100
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">{user?.uName?.charAt(0) || 'S'}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Hey {user?.uName}! 👋
                </h2>
                <p className="text-indigo-100">Ready to level up?</p>
              </div>
            </div>
          </div>

          {/* Stats Quick View */}
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">0</p>
                <p className="text-xs text-gray-500">Streak</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">0</p>
                <p className="text-xs text-gray-500">Points</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <TeensNavItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                isActive={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                badge={item.badge}
              />
            ))}
          </div>

          {/* Logout Button */}
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}