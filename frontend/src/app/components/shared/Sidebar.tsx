import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { logout } from "../../../services/authApi";
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
      { name: "examTemplates", href: "/giao-vien/mau-de-cambridge" },
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
      { name: "byTopic", href: "/giao-vien/luyen-tap/theo-chu-de" },
      { name: "byTemplate", href: "/giao-vien/luyen-tap/theo-mau" },
      { name: "random", href: "/giao-vien/luyen-tap/ngau-nhien" },
    ],
  },
  {
    name: "grading",
    icon: CheckCircle2,
    badge: 15,
    submenu: [
      { name: "pendingGrading", href: "/giao-vien/cham-diem" },
      { name: "classReport", href: "/giao-vien/cham-diem/bao-cao-lop" },
      { name: "gradingStats", href: "/giao-vien/cham-diem/thong-ke" },
    ],
  },
  {
    name: "liveMonitor",
    icon: Signal,
    indicator: "active",
    submenu: [
      { name: "activeSessions", href: "/giao-vien/giam-sat-truc-tiep" },
      { name: "connectionHistory", href: "/giao-vien/giam-sat-truc-tiep/lich-su" },
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

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  // Get user info from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || user?.uName || 'Teacher';
  const userPhone = user?.phone || user?.uPhone || '';
  const userEmail = `${userPhone}@namthuedu.com`; // Generate email from phone
  
  // Debug log (remove in production)
  console.log('Sidebar Debug:', { userStr, user, userName, userPhone });
  
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative group"
            style={{
              background: isActive ? "linear-gradient(135deg, #F97316 0%, #EA580C 100%)" : "transparent",
              color: isActive ? "#FFFFFF" : "#78716C",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.background = "#FFF7ED";
                (e.currentTarget as HTMLButtonElement).style.color = "#EA580C";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#78716C";
              }
            }}
          >
            {/* Left Accent Bar */}
            {isActive && (
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                style={{ background: "#FBBF24" }}
              />
            )}
            <Icon
              className="w-5 h-5 flex-shrink-0"
              style={{ color: isActive ? "#FFFFFF" : "#78716C" }}
            />
            <span className="flex-1 text-left">{t(`nav.${item.name}`)}</span>
            
            {/* Indicator for Live Monitor */}
            {item.indicator === "active" && (
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            )}
            
            {/* Badge */}
            {item.badge && (
              <span
                className="px-2 py-0.5 rounded-full text-white"
                style={{
                  background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
                  fontSize: "11px",
                  fontWeight: 700,
                  boxShadow: "0 2px 4px rgba(249, 115, 22, 0.3)",
                }}
              >
                {item.badge}
              </span>
            )}
            
            <ChevronDown
              className="w-4 h-4 transition-transform duration-200"
              style={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                color: isActive ? "#FFFFFF" : "#A8A29E",
              }}
            />
          </button>

          {/* Submenu */}
          <div
            className="overflow-hidden transition-all duration-300"
            style={{
              maxHeight: isExpanded ? "400px" : "0",
              opacity: isExpanded ? 1 : 0,
            }}
          >
            <div className="pl-8 pr-4 py-1 space-y-1">
              {item.submenu?.map((subItem) => {
                const isSubActive = isSubmenuActive(subItem.href);
                return (
                  <Link
                    key={subItem.name}
                    to={subItem.href}
                    className="block px-4 py-2 rounded-md transition-all duration-150"
                    style={{
                      background: isSubActive ? "#FFF7ED" : "transparent",
                      color: isSubActive ? "#EA580C" : "#78716C",
                      fontSize: "13px",
                      fontWeight: isSubActive ? 600 : 500,
                      borderLeft: isSubActive ? "2px solid #F97316" : "2px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubActive) {
                        (e.currentTarget as HTMLAnchorElement).style.background = "#FFFBEB";
                        (e.currentTarget as HTMLAnchorElement).style.color = "#C2410C";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubActive) {
                        (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                        (e.currentTarget as HTMLAnchorElement).style.color = "#78716C";
                      }
                    }}
                  >
                    {t(`nav.${subItem.name}`)}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Single menu item without submenu
    return (
      <Link
        key={item.name}
        to={item.href!}
        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative group"
        style={{
          background: isActive ? "linear-gradient(135deg, #F97316 0%, #EA580C 100%)" : "transparent",
          color: isActive ? "#FFFFFF" : "#78716C",
          fontSize: "14px",
          fontWeight: 500,
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLAnchorElement).style.background = "#FFF7ED";
            (e.currentTarget as HTMLAnchorElement).style.color = "#EA580C";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            (e.currentTarget as HTMLAnchorElement).style.color = "#78716C";
          }
        }}
      >
        {/* Left Accent Bar */}
        {isActive && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
            style={{ background: "#FBBF24" }}
          />
        )}
        <Icon
          className="w-5 h-5 flex-shrink-0"
          style={{ color: isActive ? "#FFFFFF" : "#78716C" }}
        />
        <span className="flex-1">{t(`nav.${item.name}`)}</span>
      </Link>
    );
  };

  return (
    <div className="w-[280px] h-screen bg-gradient-to-b from-white to-orange-50/30 border-r border-orange-100 flex flex-col flex-shrink-0">
      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 border-b border-orange-100/50">
        <div className="flex items-center gap-3">
          <div
            className="relative w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
              boxShadow: "0 4px 12px rgba(249, 115, 22, 0.3)",
            }}
          >
            <BookOpen className="w-6 h-6 text-white" strokeWidth={2.5} />
            <div
              className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full"
              style={{
                background: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
                boxShadow: "0 2px 4px rgba(251, 191, 36, 0.4)",
              }}
            />
          </div>

          <div className="flex flex-col">
            <span
              className="text-gray-900 leading-none"
              style={{
                fontSize: "17px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {t("appName")}
            </span>
            <span
              className="text-orange-600 leading-none mt-0.5"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              Teacher Dashboard
            </span>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="px-4 py-4">
        <div
          className="rounded-xl p-4 flex items-center gap-3 border border-orange-100"
          style={{
            background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
          }}
        >
          <div
            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white border-2 border-white"
            style={{
              background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
              fontSize: "15px",
              fontWeight: 700,
              boxShadow: "0 4px 8px rgba(249, 115, 22, 0.25)",
            }}
          >
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-gray-900 truncate"
              style={{ fontSize: "14px", fontWeight: 700, marginBottom: "2px" }}
            >
              {userName}
            </p>
            <p
              className="text-orange-600 flex items-center gap-1"
              style={{ fontSize: "12px", fontWeight: 600 }}
            >
              <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
              Giáo viên
            </p>
            <p
              className="text-orange-400 truncate mt-0.5"
              style={{ fontSize: "11px" }}
            >
              {userEmail}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-2 overflow-y-auto">
        {/* MAIN Section */}
        <div className="mb-4">
          <div
            className="px-3 mb-2 text-orange-400 uppercase tracking-wider"
            style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em" }}
          >
            MAIN
          </div>
          {renderMenuItem(navigationData[0])}
        </div>

        {/* TEACHING Section */}
        <div className="mb-4">
          <div
            className="px-3 mb-2 text-orange-400 uppercase tracking-wider"
            style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em" }}
          >
            TEACHING
          </div>
          <div className="space-y-1">
            {navigationData.slice(1, 2).map((item) => renderMenuItem(item))}
          </div>
        </div>

        {/* ASSESSMENT Section */}
        <div className="mb-4">
          <div
            className="px-3 mb-2 text-orange-400 uppercase tracking-wider"
            style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em" }}
          >
            ASSESSMENT
          </div>
          <div className="space-y-1">
            {navigationData.slice(2, 7).map((item) => renderMenuItem(item))}
          </div>
        </div>

        {/* CONTENT Section */}
        <div className="mb-4">
          <div
            className="px-3 mb-2 text-orange-400 uppercase tracking-wider"
            style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em" }}
          >
            CONTENT
          </div>
          <div className="space-y-1">
            {navigationData.slice(7, 9).map((item) => renderMenuItem(item))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-orange-100" />

        {/* SYSTEM Section */}
        <div>
          {renderMenuItem(navigationData[9])}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="px-4 py-4 border-t border-orange-100 space-y-2">
        {/* Search button removed */}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all w-full"
          style={{ 
            fontSize: "14px", 
            fontWeight: 500, 
            color: "#DC2626",
            background: "transparent"
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#FEE2E2";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
