import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router";
import {
  LayoutDashboard,
  ClipboardList,
  Trophy,
  Lightbulb,
  FileText,
  Bell,
  UserCircle,
  BookOpen,
  LogOut,
  ChevronDown,
  Flame,
  GraduationCap,
  Star,
} from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  badge?: number;
  submenu?: { label: string; href: string }[];
}

const studentNav: NavItem[] = [
  { label: "Tổng quan", href: "/hoc-sinh", icon: LayoutDashboard },
  {
    label: "Bài tập",
    icon: ClipboardList,
    badge: 5,
    submenu: [
      { label: "Đang chờ làm", href: "/hoc-sinh/bai-tap" },
      { label: "Đã nộp", href: "/hoc-sinh/bai-tap/da-nop" },
      { label: "Đã chấm", href: "/hoc-sinh/bai-tap/da-cham" },
    ],
  },
  {
    label: "Luyện tập",
    icon: Lightbulb,
    submenu: [
      { label: "Theo chủ đề", href: "/hoc-sinh/luyen-tap/chu-de" },
      { label: "Ngẫu nhiên", href: "/hoc-sinh/luyen-tap/ngau-nhien" },
      { label: "Theo mẫu đề", href: "/hoc-sinh/luyen-tap/mau-de" },
    ],
  },
  {
    label: "Kết quả",
    icon: Trophy,
    submenu: [
      { label: "Điểm số của tôi", href: "/hoc-sinh/ket-qua" },
      { label: "Xếp hạng lớp", href: "/hoc-sinh/ket-qua/xep-hang" },
    ],
  },
  { label: "Bài viết", href: "/hoc-sinh/bai-viet", icon: FileText },
  {
    label: "Thông báo",
    href: "/hoc-sinh/thong-bao",
    icon: Bell,
    badge: 3,
  },
  { label: "Hồ sơ", href: "/hoc-sinh/ho-so", icon: UserCircle },
];

const PURPLE = "#8B5CF6";
const PURPLE_LIGHT = "#EDE9FE";
const PURPLE_DARK = "#6D28D9";

export function StudentLayout() {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  useEffect(() => {
    for (const item of studentNav) {
      if (item.submenu?.some((s) => location.pathname.startsWith(s.href))) {
        setExpandedMenu(item.label);
        break;
      }
    }
  }, [location.pathname]);

  const isActive = (item: NavItem) => {
    if (item.href) return location.pathname === item.href;
    return item.submenu?.some((s) => location.pathname.startsWith(s.href)) ?? false;
  };

  const isSubActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + "/");

  return (
    <div className="flex h-screen" style={{ background: "#F5F3FF" }}>
      {/* Sidebar */}
      <aside
        className="w-[270px] h-screen flex flex-col flex-shrink-0 border-r"
        style={{ background: "#FFFFFF", borderColor: "#EDE9FE" }}
      >
        {/* Logo */}
        <div
          className="h-20 flex items-center px-6 border-b"
          style={{ borderColor: "#EDE9FE" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${PURPLE} 0%, ${PURPLE_DARK} 100%)`,
                boxShadow: `0 4px 12px rgba(139,92,246,0.28)`,
              }}
            >
              <BookOpen className="w-6 h-6 text-white" strokeWidth={2.5} />
              <div
                className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
                }}
              />
            </div>
            <div className="flex flex-col">
              <span
                className="text-[#1F1344] leading-none"
                style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                NamThu Edu
              </span>
              <span
                className="leading-none mt-0.5"
                style={{ fontSize: 11, fontWeight: 500, color: PURPLE }}
              >
                Student Portal
              </span>
            </div>
          </div>
        </div>

        {/* Profile card */}
        <div className="px-4 py-4">
          <div
            className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: "linear-gradient(135deg, #EDE9FE, #DDD6FE)" }}
          >
            <div
              className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white border-2 border-white"
              style={{
                background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_DARK})`,
                fontSize: 15,
                fontWeight: 700,
                boxShadow: "0 2px 8px rgba(139,92,246,0.3)",
              }}
            >
              NM
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="truncate"
                style={{ fontSize: 14, fontWeight: 700, color: "#1F1344", marginBottom: 2 }}
              >
                Nguyễn Thị Mai
              </p>
              <p
                className="flex items-center gap-1"
                style={{ fontSize: 12, fontWeight: 500, color: PURPLE }}
              >
                <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
                Học viên IELTS 7.0
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Flame className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />
                <span style={{ fontSize: 11, color: "#F59E0B", fontWeight: 600 }}>
                  24 ngày streak
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto space-y-1">
          {studentNav.map((item) => {
            const active = isActive(item);
            const expanded = expandedMenu === item.label;
            const Icon = item.icon;
            const hasSubmenu = !!item.submenu;

            if (hasSubmenu) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() =>
                      setExpandedMenu(expanded ? null : item.label)
                    }
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                    style={{
                      background: active ? PURPLE : "transparent",
                      color: active ? "#FFFFFF" : "#6B7280",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = PURPLE_LIGHT;
                        e.currentTarget.style.color = PURPLE_DARK;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#6B7280";
                      }
                    }}
                  >
                    <Icon
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: active ? "#FFFFFF" : PURPLE }}
                    />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span
                        className="px-2 py-0.5 rounded-full text-white"
                        style={{ background: "#EF4444", fontSize: 11, fontWeight: 700 }}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronDown
                      className="w-4 h-4 transition-transform duration-200"
                      style={{
                        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                        color: active ? "#FFFFFF" : "#9CA3AF",
                      }}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: expanded ? 300 : 0, opacity: expanded ? 1 : 0 }}
                  >
                    <div className="pl-8 pr-4 py-1 space-y-1">
                      {item.submenu!.map((sub) => {
                        const subActive = isSubActive(sub.href);
                        return (
                          <Link
                            key={sub.href}
                            to={sub.href}
                            className="block px-4 py-2 rounded-lg transition-all duration-150"
                            style={{
                              background: subActive ? PURPLE_LIGHT : "transparent",
                              color: subActive ? PURPLE_DARK : "#6B7280",
                              fontSize: 13,
                              fontWeight: subActive ? 600 : 500,
                            }}
                            onMouseEnter={(e) => {
                              if (!subActive) {
                                e.currentTarget.style.background = "#F9F7FF";
                                e.currentTarget.style.color = PURPLE;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!subActive) {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "#6B7280";
                              }
                            }}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.href!}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                style={{
                  background: active ? PURPLE : "transparent",
                  color: active ? "#FFFFFF" : "#6B7280",
                  fontSize: 14,
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = PURPLE_LIGHT;
                    e.currentTarget.style.color = PURPLE_DARK;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#6B7280";
                  }
                }}
              >
                <Icon
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: active ? "#FFFFFF" : PURPLE }}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className="px-2 py-0.5 rounded-full text-white"
                    style={{ background: "#EF4444", fontSize: 11, fontWeight: 700 }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div
          className="px-4 py-4 border-t space-y-2"
          style={{ borderColor: "#EDE9FE" }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: "linear-gradient(135deg, #EDE9FE, #DDD6FE)" }}
          >
            <Star className="w-4 h-4" style={{ color: PURPLE }} />
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: PURPLE_DARK }}>
                4,250 điểm XP
              </p>
              <p style={{ fontSize: 11, color: "#7C3AED" }}>
                750 điểm nữa → Lv.6
              </p>
            </div>
          </div>
          <button
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-full transition-all hover:bg-[#FEE2E2]"
            style={{ fontSize: 14, fontWeight: 500, color: "#EF4444" }}
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
