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
  BookOpen, 
  Trophy, 
  Star, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const KidsNavItem = ({ 
  icon: Icon, 
  emoji, 
  label, 
  path, 
  isActive, 
  onClick 
}: {
  icon: any;
  emoji: string;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200
        ${isActive 
          ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg scale-105' 
          : 'text-gray-700 hover:bg-purple-100 hover:scale-105'
        }
      `}
    >
      <div className="flex items-center gap-2">
        <span className="text-3xl">{emoji}</span>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-xl font-bold">{label}</span>
    </button>
  );
};

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

  const navItems = [
    { icon: Home, emoji: '🏠', label: 'Trang chủ', path: '/hoc-vien/kids' },
    { icon: BookOpen, emoji: '📚', label: 'Học bài', path: '/hoc-vien/kids/hoc-bai' },
    { icon: Trophy, emoji: '🏆', label: 'Huy hiệu', path: '/hoc-vien/kids/huy-hieu' },
    { icon: Star, emoji: '⭐', label: 'Thành tích', path: '/hoc-vien/kids/thanh-tich' },
    { icon: Settings, emoji: '⚙️', label: 'Cài đặt', path: '/hoc-vien/kids/cai-dat' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-lg p-4 border-b-4 border-yellow-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">😊</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-purple-600">
                Xin chào {user?.uName}! 🎉
              </h1>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl border-r-4 border-yellow-400
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-purple-400 to-pink-400 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-3xl">😊</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Xin chào {user?.uName}! 🎉
                </h2>
                <p className="text-purple-100">Hôm nay học gì nhỉ? ✨</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-6 space-y-3">
            {navItems.map((item) => (
              <KidsNavItem
                key={item.path}
                icon={item.icon}
                emoji={item.emoji}
                label={item.label}
                path={item.path}
                isActive={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              />
            ))}
          </div>

          {/* Logout Button */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <span className="text-3xl">👋</span>
                <LogOut className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">Tạm biệt!</span>
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