/**
 * Adults Layout - Giao diện dành cho người lớn (18+ tuổi)
 * 
 * Đặc điểm:
 * - Thiết kế chuyên nghiệp, tối giản
 * - Focus vào productivity và analytics
 * - Màu sắc trung tính, dễ nhìn
 * - Tối ưu cho công việc
 */

import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  Target, 
  Calendar,
  Settings, 
  LogOut,
  Menu,
  X,
  Award,
  Clock
} from 'lucide-react';

const AdultsNavItem = ({ 
  icon: Icon, 
  label, 
  path, 
  isActive, 
  onClick 
}: {
  icon: any;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-orange-500 text-white shadow-md' 
          : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
        }
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
};

export function AdultsLayout() {
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
    { icon: Home, label: 'Dashboard', path: '/hoc-vien/adults' },
    { icon: BookOpen, label: 'Courses', path: '/hoc-vien/adults/courses' },
    { icon: BarChart3, label: 'Analytics', path: '/hoc-vien/adults/analytics' },
    { icon: Target, label: 'Goals', path: '/hoc-vien/adults/goals' },
    { icon: Award, label: 'Certifications', path: '/hoc-vien/adults/certifications' },
    { icon: Calendar, label: 'Schedule', path: '/hoc-vien/adults/schedule' },
    { icon: Settings, label: 'Settings', path: '/hoc-vien/adults/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">{user?.uName?.charAt(0) || 'P'}</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Welcome, {user?.uName}
              </h1>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-orange-500 to-red-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  {user?.uName || 'Professional'}
                </h2>
                <p className="text-orange-100 text-sm">Learning Platform</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-lg font-bold text-gray-900">0h</span>
                </div>
                <p className="text-xs text-gray-500">Study Time</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Award className="w-4 h-4 text-orange-500" />
                  <span className="text-lg font-bold text-gray-900">0</span>
                </div>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4 space-y-1">
            {navItems.map((item) => (
              <AdultsNavItem
                key={item.path}
                icon={item.icon}
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
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
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