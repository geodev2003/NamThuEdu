import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { logout } from "../../../services/authApi";
import { api } from "../../../services/api";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  GraduationCap,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Signal,
  Lightbulb,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SubMenuItem {
  name: string;
  href: string;
}

interface MenuItem {
  name: string;
  href?: string;
  icon: any;
  badge?: string | number;
  indicator?: "active" | "pending";
  submenu?: SubMenuItem[];
}

const navigationData: MenuItem[] = [
  { 
    name: "dashboard", 
    href: "/giao-vien", 
    icon: LayoutDashboard 
  },
  {
    name: "students",
    icon: Users,
    submenu: [
      { name: "manageStudents", href: "/giao-vien/students" },
      { name: "addStudent", href: "/giao-vien/students/them-moi" },
      { name: "importStudents", href: "/giao-vien/students/import" },
    ],
  },
  {
    name: "examBank",
    icon: FileText,
    submenu: [
      { name: "allExams", href: "/giao-vien/de-thi" },
      { name: "createExam", href: "/giao-vien/de-thi/tao-moi" },
      { name: "myExams", href: "/giao-vien/de-thi/cua-toi" },
    ],
  },
  {
    name: "assignments",
    icon: ClipboardList,
    badge: 8,
    submenu: [
      { name: "assignmentList", href: "/giao-vien/bai-tap" },
      { name: "assignmentStats", href: "/giao-vien/bai-tap/thong-ke" },
    ],
  },
  {
    name: "practice",
    icon: Lightbulb,
    submenu: [
      { name: "practiceList", href: "/giao-vien/luyen-tap" },
    ],
  },
  {
    name: "grading",
    icon: CheckCircle2,
    submenu: [
      { name: "pendingGrading", href: "/giao-vien/cham-diem" },
      { name: "gradingStats", href: "/giao-vien/cham-diem/thong-ke" },
    ],
  },
  {
    name: "liveMonitor",
    icon: Signal,
    indicator: "active",
    submenu: [
      { name: "activeSessions", href: "/giao-vien/giam-sat-truc-tiep" },
      { name: "realtimeStats", href: "/giao-vien/giam-sat-truc-tiep/thong-ke" },
    ],
  },
  {
    name: "blog",
    icon: FileText,
    submenu: [
      { name: "allPosts", href: "/giao-vien/bai-viet" },
      { name: "createPost", href: "/giao-vien/bai-viet/tao-moi" },
      { name: "categories", href: "/giao-vien/bai-viet/danh-muc" },
      { name: "contentStats", href: "/giao-vien/bai-viet/thong-ke" },
    ],
  },
  {
    name: "reports",
    icon: BarChart3,
    submenu: [
      { name: "reportOverview", href: "/giao-vien/bao-cao" },
      { name: "studentProgress", href: "/giao-vien/bao-cao/tien-do-students" },
      { name: "analysis", href: "/giao-vien/bao-cao/phan-tich" },
      { name: "exportReport", href: "/giao-vien/bao-cao/xuat-bao-cao" },
    ],
  },
  {
    name: "settings",
    href: "/giao-vien/cai-dat",
    icon: Settings,
  },
];

export function Sidebar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [pendingGradingCount, setPendingGradingCount] = useState<number>(0);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPendingGrading = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      const res = await api.get('/teacher/dashboard/overview');
      const count = res.data?.data?.pending_grading ?? 0;
      setPendingGradingCount(count);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchPendingGrading();
    pollingRef.current = setInterval(fetchPendingGrading, 30_000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Get user info from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || user?.uName || 'Teacher';
  const userPhone = user?.phone || user?.uPhone || '';
  const userEmail = `${userPhone}@namthuedu.com`; // Generate email from phone
  
  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  const userInitials = getInitials(userName);

  const handleLogout = async () => {
    await logout();
    navigate("/giao-vien/dang-nhap", { replace: true });
  };

  // Auto-expand menu if current route matches
  const getCurrentExpandedMenu = (): string | null => {
    for (const item of navigationData) {
      if (item.submenu) {
        const isOnSubmenuPage = item.submenu.some((sub) =>
          location.pathname.startsWith(sub.href)
        );
        if (isOnSubmenuPage) {
          return item.name;
        }
      }
    }
    return null;
  };

  // Set initial expanded menu on mount or location change
  useEffect(() => {
    const currentMenu = getCurrentExpandedMenu();
    if (currentMenu && !expandedMenu) {
      setExpandedMenu(currentMenu);
    }
  }, [location]);

  const toggleMenu = (menuName: string) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  const isMenuActive = (item: MenuItem): boolean => {
    if (item.href && location.pathname === item.href) return true;
    if (item.submenu) {
      return item.submenu.some((sub) => location.pathname.startsWith(sub.href));
    }
    return false;
  };

  const isSubmenuActive = (href: string): boolean => {
    // Only exact match - no parent matching at all
    return location.pathname === href;
  };

  const renderMenuItem = (item: MenuItem) => {
    const isActive = isMenuActive(item);
    const isExpanded = expandedMenu === item.name;
    const Icon = item.icon;
    const hasSubmenu = item.submenu && item.submenu.length > 0;

    if (hasSubmenu) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleMenu(item.name)}
            className={`w-full flex items-center gap-2.5 rounded-lg transition-all duration-150 relative group text-sm font-medium ${
              isCollapsed ? 'px-2.5 py-2.5 justify-center' : 'px-3 py-2.5'
            } ${
              isActive
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
            title={isCollapsed ? t(`nav.${item.name}`) : undefined}
          >
            {/* Left accent */}
            {isActive && !isCollapsed && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-slate-700" />
            )}
            <Icon className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">{t(`nav.${item.name}`)}</span>
                {item.indicator === "active" && (
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                )}
                {item.name === 'grading' && pendingGradingCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-500 text-white animate-pulse">
                    {pendingGradingCount > 99 ? '99+' : pendingGradingCount}
                  </span>
                )}
                {item.name !== 'grading' && item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-600">
                    {item.badge}
                  </span>
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
            {isCollapsed && item.name === 'grading' && pendingGradingCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                {pendingGradingCount > 99 ? '9+' : pendingGradingCount}
              </div>
            )}
            {isCollapsed && item.name !== 'grading' && item.badge && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-700 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                {item.badge}
              </div>
            )}
            {isCollapsed && item.indicator === "active" && (
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full" />
            )}
          </button>

          {/* Submenu */}
          {!isCollapsed && (
            <div
              className="overflow-hidden transition-all duration-300"
              style={{
                maxHeight: isExpanded ? "400px" : "0",
                opacity: isExpanded ? 1 : 0,
              }}
            >
              <div className="ml-4 pl-3 border-l border-slate-100 space-y-0.5 py-1">
                {item.submenu?.map((subItem) => {
                  const isSubActive = isSubmenuActive(subItem.href);
                  return (
                    <Link
                      key={subItem.name}
                      to={subItem.href}
                      className={`block px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                        isSubActive
                          ? "bg-slate-100 text-slate-900 font-semibold"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium"
                      }`}
                    >
                      {t(`nav.${subItem.name}`)}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Single menu item without submenu
    return (
      <Link
        key={item.name}
        to={item.href!}
        className={`flex items-center gap-2.5 rounded-lg transition-all duration-150 relative text-sm font-medium ${
          isCollapsed ? 'px-2.5 py-2.5 justify-center' : 'px-3 py-2.5'
        } ${
          isActive
            ? 'bg-slate-100 text-slate-900'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
        }`}
        title={isCollapsed ? t(`nav.${item.name}`) : undefined}
      >
        {isActive && !isCollapsed && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-slate-700" />
        )}
        <Icon className="w-4 h-4 flex-shrink-0" />
        {!isCollapsed && <span className="flex-1">{t(`nav.${item.name}`)}</span>}
      </Link>
    );
  };

  return (
    <div 
      className={`h-screen bg-white border-r border-slate-200 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out relative ${
        isCollapsed ? 'w-[80px]' : 'w-[260px]'
      }`}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-none">
              <span className="text-slate-900 text-[15px] font-bold tracking-tight">{t("appName")}</span>
              <span className="text-slate-400 text-[11px] font-medium mt-0.5">Teacher Portal</span>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
          className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
          title={isCollapsed ? "Mở rộng" : "Thu gọn"}
          type="button"
        >
          {isCollapsed
            ? <ChevronRight className="w-4 h-4 text-slate-400 pointer-events-none" />
            : <ChevronLeft className="w-4 h-4 text-slate-400 pointer-events-none" />}
        </button>
      </div>

      {/* User Profile */}
      {!isCollapsed ? (
        <div className="px-3 py-3 border-b border-slate-100">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-default">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-800 text-sm font-semibold truncate leading-tight">{userName}</p>
              <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                <GraduationCap className="w-3 h-3 flex-shrink-0" />
                Giáo viên
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center py-3 border-b border-slate-100">
          <div
            className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold"
            title={userName}
          >
            {userInitials}
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-5">
        {/* MAIN */}
        <div>
          {!isCollapsed && <p className="px-2 mb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Main</p>}
          {renderMenuItem(navigationData[0])}
        </div>

        {/* TEACHING */}
        <div>
          {!isCollapsed && <p className="px-2 mb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Teaching</p>}
          <div className="space-y-0.5">
            {navigationData.slice(1, 2).map((item) => renderMenuItem(item))}
          </div>
        </div>

        {/* ASSESSMENT */}
        <div>
          {!isCollapsed && <p className="px-2 mb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Assessment</p>}
          <div className="space-y-0.5">
            {navigationData.slice(2, 7).map((item) => renderMenuItem(item))}
          </div>
        </div>

        {/* CONTENT */}
        <div>
          {!isCollapsed && <p className="px-2 mb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Content</p>}
          <div className="space-y-0.5">
            {navigationData.slice(7, 9).map((item) => renderMenuItem(item))}
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* SYSTEM */}
        <div className="space-y-0.5">
          {renderMenuItem(navigationData[9])}
        </div>
      </nav>

      {/* Bottom — Logout */}
      <div className={`px-3 py-3 border-t border-slate-100`}>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? "Đăng xuất" : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
}
