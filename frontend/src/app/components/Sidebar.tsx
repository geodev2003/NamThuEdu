import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  BookOpen,
  School,
  Users,
  FileText,
  GraduationCap,
  ClipboardList,
  BarChart3,
  PenTool,
  Settings,
  LogOut,
  Mail,
  ChevronDown,
  Signal,
  Newspaper,
  Lightbulb,
  CheckCircle2,
  Search,
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
      { name: "manageStudents", href: "/giao-vien/hoc-vien" },
      { name: "addStudent", href: "/giao-vien/hoc-vien/them-moi" },
      { name: "importStudents", href: "/giao-vien/hoc-vien/import" },
    ],
  },
  {
    name: "classes",
    icon: School,
    submenu: [
      { name: "classList", href: "/giao-vien/lop-hoc/danh-sach" },
      { name: "createClass", href: "/giao-vien/lop-hoc/tao-moi" },
      { name: "transferClass", href: "/giao-vien/lop-hoc/chuyen-lop" },
      { name: "classStats", href: "/giao-vien/lop-hoc/thong-ke" },
    ],
  },
  {
    name: "courses",
    icon: BookOpen,
    submenu: [
      { name: "courseList", href: "/giao-vien/khoa-hoc" },
      { name: "createCourse", href: "/giao-vien/khoa-hoc/tao-moi" },
      { name: "manageStudents", href: "/giao-vien/khoa-hoc/quan-ly-hoc-vien" },
      { name: "courseStats", href: "/giao-vien/khoa-hoc/thong-ke" },
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
      { name: "studentProgress", href: "/giao-vien/bao-cao/tien-do-hoc-sinh" },
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
  const { t } = useTranslation();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

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
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  const renderMenuItem = (item: MenuItem, section?: string) => {
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
              background: isActive ? "#2563EB" : "transparent",
              color: isActive ? "#FFFFFF" : "#6B7280",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.background = "#F3F4F6";
                (e.currentTarget as HTMLButtonElement).style.color = "#374151";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#6B7280";
              }
            }}
          >
            {/* Left Accent Bar */}
            {isActive && (
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                style={{ background: "#1E40AF" }}
              />
            )}
            <Icon
              className="w-5 h-5 flex-shrink-0"
              style={{ color: isActive ? "#FFFFFF" : "#6B7280" }}
            />
            <span className="flex-1 text-left">{t(`nav.${item.name}`)}</span>
            
            {/* Indicator for Live Monitor */}
            {item.indicator === "active" && (
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
            )}
            
            {/* Badge */}
            {item.badge && (
              <span
                className="px-2 py-0.5 rounded-full text-white"
                style={{
                  backgroundColor: "#EF4444",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {item.badge}
              </span>
            )}
            
            <ChevronDown
              className="w-4 h-4 transition-transform duration-200"
              style={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                color: isActive ? "#FFFFFF" : "#9CA3AF",
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
                      background: isSubActive ? "#EFF6FF" : "transparent",
                      color: isSubActive ? "#2563EB" : "#6B7280",
                      fontSize: "13px",
                      fontWeight: isSubActive ? 600 : 500,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubActive) {
                        (e.currentTarget as HTMLAnchorElement).style.background = "#F9FAFB";
                        (e.currentTarget as HTMLAnchorElement).style.color = "#374151";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubActive) {
                        (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                        (e.currentTarget as HTMLAnchorElement).style.color = "#6B7280";
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
          background: isActive ? "#2563EB" : "transparent",
          color: isActive ? "#FFFFFF" : "#6B7280",
          fontSize: "14px",
          fontWeight: 500,
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLAnchorElement).style.background = "#F3F4F6";
            (e.currentTarget as HTMLAnchorElement).style.color = "#374151";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            (e.currentTarget as HTMLAnchorElement).style.color = "#6B7280";
          }
        }}
      >
        {/* Left Accent Bar */}
        {isActive && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
            style={{ background: "#1E40AF" }}
          />
        )}
        <Icon
          className="w-5 h-5 flex-shrink-0"
          style={{ color: isActive ? "#FFFFFF" : "#6B7280" }}
        />
        <span className="flex-1">{t(`nav.${item.name}`)}</span>
      </Link>
    );
  };

  return (
    <div className="w-[280px] h-screen bg-white border-r border-[#E5E7EB] flex flex-col flex-shrink-0">
      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div
            className="relative w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
            }}
          >
            <BookOpen className="w-6 h-6 text-white" strokeWidth={2.5} />
            <div
              className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full"
              style={{
                background: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
                boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)",
              }}
            />
          </div>

          <div className="flex flex-col">
            <span
              className="text-[#111827] leading-none"
              style={{
                fontSize: "17px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {t("appName")}
            </span>
            <span
              className="text-[#6B7280] leading-none mt-0.5"
              style={{
                fontSize: "11px",
                fontWeight: 500,
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
          className="rounded-xl p-4 flex items-center gap-3"
          style={{
            background: "linear-gradient(135deg, #F3F4F6, #E5E7EB)",
          }}
        >
          <div
            className="flex-shrink-0 w-12 h-12 bg-[#2563EB] rounded-full flex items-center justify-center text-white border-2 border-white"
            style={{
              fontSize: "15px",
              fontWeight: 700,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            NT
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-[#111827] truncate"
              style={{ fontSize: "14px", fontWeight: 700, marginBottom: "2px" }}
            >
              Nguyễn Văn Thuận
            </p>
            <p
              className="text-[#6B7280] flex items-center gap-1"
              style={{ fontSize: "12px", fontWeight: 500 }}
            >
              <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
              Giáo viên
            </p>
            <p
              className="text-[#9CA3AF] truncate mt-0.5"
              style={{ fontSize: "11px" }}
            >
              thuan@namthuedu.com
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-2 overflow-y-auto">
        {/* MAIN Section */}
        <div className="mb-4">
          <div
            className="px-3 mb-2 text-[#9CA3AF] uppercase tracking-wider"
            style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em" }}
          >
            MAIN
          </div>
          {renderMenuItem(navigationData[0])}
        </div>

        {/* TEACHING Section */}
        <div className="mb-4">
          <div
            className="px-3 mb-2 text-[#9CA3AF] uppercase tracking-wider"
            style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em" }}
          >
            TEACHING
          </div>
          <div className="space-y-1">
            {navigationData.slice(1, 4).map((item) => renderMenuItem(item, "teaching"))}
          </div>
        </div>

        {/* ASSESSMENT Section */}
        <div className="mb-4">
          <div
            className="px-3 mb-2 text-[#9CA3AF] uppercase tracking-wider"
            style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em" }}
          >
            ASSESSMENT
          </div>
          <div className="space-y-1">
            {navigationData.slice(4, 9).map((item) => renderMenuItem(item, "assessment"))}
          </div>
        </div>

        {/* CONTENT Section */}
        <div className="mb-4">
          <div
            className="px-3 mb-2 text-[#9CA3AF] uppercase tracking-wider"
            style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em" }}
          >
            CONTENT
          </div>
          <div className="space-y-1">
            {navigationData.slice(9, 11).map((item) => renderMenuItem(item, "content"))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-[#E5E7EB]" />

        {/* SYSTEM Section */}
        <div>
          {renderMenuItem(navigationData[11])}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="px-4 py-4 border-t border-[#E5E7EB] space-y-2">
        {/* Search button removed */}

        {/* Logout */}
        <button
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all w-full hover:bg-[#FEE2E2]"
          style={{ fontSize: "14px", fontWeight: 500, color: "#EF4444" }}
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}