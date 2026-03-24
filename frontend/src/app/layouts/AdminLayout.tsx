import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  ChevronDown,
  Activity,
  Bell,
  Database,
  Zap,
  ServerCrash,
} from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  badge?: number;
  indicator?: "online" | "warning";
  submenu?: { label: string; href: string }[];
}

const adminNav: NavItem[] = [
  { label: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  {
    label: "Giáo viên",
    icon: GraduationCap,
    submenu: [
      { label: "Danh sách giáo viên", href: "/admin/giao-vien" },
      { label: "Thêm giáo viên", href: "/admin/giao-vien/them-moi" },
      { label: "Phân công lớp", href: "/admin/giao-vien/phan-cong" },
    ],
  },
  {
    label: "Học viên",
    icon: Users,
    badge: 12,
    submenu: [
      { label: "Tất cả học viên", href: "/admin/hoc-vien" },
      { label: "Đăng ký mới", href: "/admin/hoc-vien/dang-ky" },
      { label: "Khiếu nại", href: "/admin/hoc-vien/khieu-nai" },
    ],
  },
  {
    label: "Khóa học",
    icon: BookOpen,
    submenu: [
      { label: "Tất cả khóa học", href: "/admin/khoa-hoc" },
      { label: "Tạo khóa học", href: "/admin/khoa-hoc/tao-moi" },
      { label: "Danh mục", href: "/admin/khoa-hoc/danh-muc" },
    ],
  },
  {
    label: "Nội dung",
    icon: FileText,
    submenu: [
      { label: "Bài viết", href: "/admin/noi-dung/bai-viet" },
      { label: "Ngân hàng đề", href: "/admin/noi-dung/de-thi" },
    ],
  },
  {
    label: "Báo cáo",
    icon: BarChart3,
    submenu: [
      { label: "Doanh thu", href: "/admin/bao-cao/doanh-thu" },
      { label: "Học viên", href: "/admin/bao-cao/hoc-vien" },
      { label: "Hiệu suất GV", href: "/admin/bao-cao/giao-vien" },
    ],
  },
  {
    label: "Hệ thống",
    icon: Activity,
    indicator: "online",
    submenu: [
      { label: "Nhật ký hoạt động", href: "/admin/he-thong/nhat-ky" },
      { label: "Sức khỏe server", href: "/admin/he-thong/server" },
      { label: "Backup dữ liệu", href: "/admin/he-thong/backup" },
    ],
  },
  {
    label: "Thông báo",
    href: "/admin/thong-bao",
    icon: Bell,
    badge: 4,
  },
  { label: "Cài đặt", href: "/admin/cai-dat", icon: Settings },
];

const ADMIN = "#0F172A";
const ADMIN_ACCENT = "#F59E0B";
const ADMIN_ACCENT_LIGHT = "#FEF3C7";
const ADMIN_BG = "#F8FAFC";
const ADMIN_ACTIVE_BG = "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)";

export function AdminLayout() {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  useEffect(() => {
    for (const item of adminNav) {
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
    <div className="flex h-screen" style={{ background: ADMIN_BG }}>
      {/* Sidebar */}
      <aside
        className="w-[272px] h-screen flex flex-col flex-shrink-0 border-r"
        style={{ background: "#FFFFFF", borderColor: "#E2E8F0" }}
      >
        {/* Logo */}
        <div
          className="h-20 flex items-center px-6 border-b"
          style={{ borderColor: "#E2E8F0" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                boxShadow: "0 4px 12px rgba(15,23,42,0.25)",
              }}
            >
              <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
              <div
                className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full"
                style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)" }}
              />
            </div>
            <div className="flex flex-col">
              <span
                className="leading-none"
                style={{ fontSize: 17, fontWeight: 700, color: ADMIN, letterSpacing: "-0.02em" }}
              >
                NamThu Edu
              </span>
              <span
                className="leading-none mt-0.5"
                style={{ fontSize: 11, fontWeight: 600, color: ADMIN_ACCENT }}
              >
                Admin Console
              </span>
            </div>
          </div>
        </div>

        {/* Admin profile */}
        <div className="px-4 py-4">
          <div
            className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)" }}
          >
            <div
              className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2"
              style={{
                background: "linear-gradient(135deg, #F59E0B, #EF4444)",
                borderColor: "rgba(255,255,255,0.2)",
                fontSize: 15,
                fontWeight: 700,
                color: "#FFFFFF",
                boxShadow: "0 2px 8px rgba(245,158,11,0.4)",
              }}
            >
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="truncate"
                style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", marginBottom: 2 }}
              >
                Administrator
              </p>
              <p
                className="flex items-center gap-1"
                style={{ fontSize: 12, fontWeight: 500, color: ADMIN_ACCENT }}
              >
                <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                Super Admin
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span style={{ fontSize: 11, color: "#10B981", fontWeight: 500 }}>
                  Đang hoạt động
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats strip */}
        <div className="px-4 pb-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "GV", val: "24", icon: GraduationCap },
              { label: "HV", val: "1.2K", icon: Users },
              { label: "Sự cố", val: "0", icon: ServerCrash },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center py-2 rounded-lg"
                style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
              >
                <s.icon className="w-3.5 h-3.5 mb-0.5" style={{ color: "#64748B" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: ADMIN }}>{s.val}</span>
                <span style={{ fontSize: 10, color: "#94A3B8" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto space-y-0.5">
          {adminNav.map((item) => {
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
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200"
                    style={{
                      background: active ? ADMIN_ACTIVE_BG : "transparent",
                      color: active ? "#FFFFFF" : "#64748B",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "#F1F5F9";
                        e.currentTarget.style.color = ADMIN;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#64748B";
                      }
                    }}
                  >
                    <Icon
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: active ? ADMIN_ACCENT : "#64748B" }}
                    />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.indicator === "online" && (
                      <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    )}
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
                        color: active ? "#94A3B8" : "#CBD5E1",
                      }}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: expanded ? 300 : 0, opacity: expanded ? 1 : 0 }}
                  >
                    <div className="pl-8 pr-4 py-1 space-y-0.5">
                      {item.submenu!.map((sub) => {
                        const subActive = isSubActive(sub.href);
                        return (
                          <Link
                            key={sub.href}
                            to={sub.href}
                            className="block px-4 py-2 rounded-lg transition-all duration-150"
                            style={{
                              background: subActive ? ADMIN_ACCENT_LIGHT : "transparent",
                              color: subActive ? "#92400E" : "#64748B",
                              fontSize: 13,
                              fontWeight: subActive ? 600 : 500,
                            }}
                            onMouseEnter={(e) => {
                              if (!subActive) {
                                e.currentTarget.style.background = "#F8FAFC";
                                e.currentTarget.style.color = ADMIN;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!subActive) {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "#64748B";
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
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200"
                style={{
                  background: active ? ADMIN_ACTIVE_BG : "transparent",
                  color: active ? "#FFFFFF" : "#64748B",
                  fontSize: 14,
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "#F1F5F9";
                    e.currentTarget.style.color = ADMIN;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#64748B";
                  }
                }}
              >
                <Icon
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: active ? ADMIN_ACCENT : "#64748B" }}
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
          className="px-4 py-4 border-t"
          style={{ borderColor: "#E2E8F0" }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3"
            style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
          >
            <Database className="w-4 h-4" style={{ color: "#10B981" }} />
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#065F46" }}>
                Server: Online
              </p>
              <p style={{ fontSize: 10, color: "#10B981" }}>Uptime 99.8% • 12ms</p>
            </div>
            <Zap className="w-3.5 h-3.5 ml-auto" style={{ color: "#10B981" }} />
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
