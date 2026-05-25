import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router";
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
  Search,
  ChevronRight,
} from "lucide-react";
import { logout } from "../../services/authApi";
import { NotificationDropdown } from "../features/admin/components/NotificationDropdown";

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
      { label: "Danh sách giáo viên", href: "/admin/teachers" },
      { label: "Phân công lớp", href: "/admin/teachers/assignments" },
    ],
  },
  {
    label: "Học viên",
    icon: Users,
    badge: 12,
    submenu: [
      { label: "Tất cả học viên", href: "/admin/students" },
      { label: "Đăng ký mới", href: "/admin/students/new-registrations" },
      { label: "Khiếu nại", href: "/admin/students/complaints" },
    ],
  },
  {
    label: "Khóa học",
    icon: BookOpen,
    submenu: [
      { label: "Tất cả khóa học", href: "/admin/courses" },
      { label: "Tạo khóa học", href: "/admin/courses/new" },
      { label: "Danh mục", href: "/admin/courses/categories" },
    ],
  },
  {
    label: "Nội dung",
    icon: FileText,
    submenu: [
      { label: "Bài viết", href: "/admin/content/posts" },
      { label: "Ngân hàng đề", href: "/admin/content/exams" },
    ],
  },
  {
    label: "Báo cáo",
    icon: BarChart3,
    submenu: [
      { label: "Doanh thu", href: "/admin/reports/revenue" },
      { label: "Học viên", href: "/admin/reports/students" },
      { label: "Hiệu suất GV", href: "/admin/reports/teachers" },
    ],
  },
  {
    label: "Hệ thống",
    icon: Activity,
    indicator: "online",
    submenu: [
      { label: "Nhật ký hoạt động", href: "/admin/system/activity-logs" },
      { label: "Sức khỏe server", href: "/admin/system/server-health" },
      { label: "Backup dữ liệu", href: "/admin/system/backups" },
    ],
  },
  {
    label: "Thông báo",
    href: "/admin/notifications",
    icon: Bell,
    badge: 4,
  },
  { label: "Cài đặt", href: "/admin/settings", icon: Settings },
];

const ADMIN = "#0F172A";
const ADMIN_ACCENT = "#F59E0B";
const ADMIN_ACCENT_LIGHT = "#FEF3C7";
const ADMIN_BG = "#F8FAFC";
const ADMIN_ACTIVE_BG = "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)";

const AVATAR_PRESETS_LAYOUT = [
  { id: "amber",  gradient: "linear-gradient(135deg,#F59E0B,#EF4444)" },
  { id: "blue",   gradient: "linear-gradient(135deg,#2563EB,#7C3AED)" },
  { id: "green",  gradient: "linear-gradient(135deg,#10B981,#0284C7)" },
  { id: "purple", gradient: "linear-gradient(135deg,#8B5CF6,#EC4899)" },
  { id: "red",    gradient: "linear-gradient(135deg,#EF4444,#F97316)" },
  { id: "teal",   gradient: "linear-gradient(135deg,#0D9488,#2563EB)" },
];
const getAvatarGradient = () => {
  const id = localStorage.getItem("admin_avatar_color") ?? "amber";
  return AVATAR_PRESETS_LAYOUT.find((p) => p.id === id)?.gradient ?? AVATAR_PRESETS_LAYOUT[0].gradient;
};

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [avatarGradient, setAvatarGradient] = useState(getAvatarGradient);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  useEffect(() => {
    const handler = () => setAvatarGradient(getAvatarGradient());
    window.addEventListener("admin_avatar_changed", handler);
    return () => window.removeEventListener("admin_avatar_changed", handler);
  }, []);

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
        className="w-64 h-screen flex flex-col flex-shrink-0 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)" }}
      >
        {/* Subtle background texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        {/* Amber glow top-right */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12), transparent)" }} />

        {/* ── Logo ── */}
        <div className="relative z-10 flex items-center gap-3 px-5 h-[68px] flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", boxShadow: "0 3px 10px rgba(245,158,11,0.35)" }}>
            <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="leading-none font-bold text-white" style={{ fontSize: 15, letterSpacing: "-0.01em" }}>NamThu Edu</p>
            <p className="leading-none mt-0.5 font-semibold" style={{ fontSize: 10, color: "#F59E0B" }}>Admin Console</p>
          </div>
          {/* live dot */}
          <div className="ml-auto flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          </div>
        </div>

        {/* ── Profile ── */}
        <div className="relative z-10 px-4 pt-4 pb-3 flex-shrink-0">
          <div className="flex items-center gap-3 rounded-xl px-3 py-3"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)", boxShadow: "0 2px 8px rgba(245,158,11,0.35)" }}>
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate" style={{ fontSize: 13 }}>Administrator</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Shield className="w-3 h-3 flex-shrink-0" style={{ color: ADMIN_ACCENT }} />
                <span style={{ fontSize: 11, color: ADMIN_ACCENT, fontWeight: 500 }}>Super Admin</span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-[#10B981] flex-shrink-0" />
          </div>
        </div>

        {/* ── Nav ── */}
        <nav className="relative z-10 flex-1 px-3 pb-2 overflow-y-auto space-y-0.5">
          {adminNav.map((item) => {
            const active = isActive(item);
            const expanded = expandedMenu === item.label;
            const Icon = item.icon;
            const hasSubmenu = !!item.submenu;

            if (hasSubmenu) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setExpandedMenu(expanded ? null : item.label)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 relative"
                    style={{
                      background: active ? "rgba(245,158,11,0.12)" : "transparent",
                      color: active ? "#FFFFFF" : "#94A3B8",
                      fontSize: 13.5,
                      fontWeight: active ? 600 : 500,
                    }}
                    onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#E2E8F0"; } }}
                    onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; } }}
                  >
                    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ background: ADMIN_ACCENT }} />}
                    <Icon className="w-4.5 h-4.5 flex-shrink-0" style={{ color: active ? ADMIN_ACCENT : "#475569" }} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.indicator === "online" && <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />}
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-white" style={{ background: "#EF4444", fontSize: 10, fontWeight: 700 }}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0"
                      style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", color: "#475569" }} />
                  </button>
                  <div className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: expanded ? 300 : 0, opacity: expanded ? 1 : 0 }}>
                    <div className="pl-9 pr-3 py-1 space-y-0.5">
                      {item.submenu!.map((sub) => {
                        const subActive = isSubActive(sub.href);
                        return (
                          <Link key={sub.href} to={sub.href}
                            className="block px-3 py-2 rounded-lg transition-all duration-150"
                            style={{
                              background: subActive ? "rgba(245,158,11,0.15)" : "transparent",
                              color: subActive ? "#FCD34D" : "#64748B",
                              fontSize: 12.5,
                              fontWeight: subActive ? 600 : 400,
                            }}
                            onMouseEnter={(e) => { if (!subActive) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#CBD5E1"; } }}
                            onMouseLeave={(e) => { if (!subActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748B"; } }}
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
              <Link key={item.label} to={item.href!}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 relative"
                style={{
                  background: active ? "rgba(245,158,11,0.12)" : "transparent",
                  color: active ? "#FFFFFF" : "#94A3B8",
                  fontSize: 13.5,
                  fontWeight: active ? 600 : 500,
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#E2E8F0"; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; } }}
              >
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ background: ADMIN_ACCENT }} />}
                <Icon className="w-4.5 h-4.5 flex-shrink-0" style={{ color: active ? ADMIN_ACCENT : "#475569" }} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-white" style={{ background: "#EF4444", fontSize: 10, fontWeight: 700 }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Bottom ── */}
        <div className="relative z-10 px-4 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {/* Server status */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3"
            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <Database className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#10B981" }} />
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 11, fontWeight: 700, color: "#10B981" }}>Server: Online</p>
              <p style={{ fontSize: 10, color: "#34D399" }}>Uptime 99.8% • 12ms</p>
            </div>
            <Zap className="w-3 h-3 flex-shrink-0" style={{ color: "#10B981" }} />
          </div>
          {/* Logout */}
          <button onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl w-full transition-all duration-150"
            style={{ fontSize: 13.5, fontWeight: 500, color: "#94A3B8" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#FCA5A5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; }}
          >
            <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center gap-4 px-6 bg-white"
          style={{ height: 60, borderBottom: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>

          {/* Left: breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: "linear-gradient(180deg, #F59E0B, #D97706)" }} />
            <span style={{ fontSize: 11, color: "#94A3B8" }}>Admin</span>
            <ChevronRight className="h-3 w-3 flex-shrink-0" style={{ color: "#CBD5E1" }} />
            <span className="font-semibold truncate" style={{ fontSize: 14, color: "#0F172A" }}>
              {location.pathname === "/admin" || location.pathname === "/admin/dashboard" ? "Tổng quan" :
               location.pathname.startsWith("/admin/teachers") ? "Giáo viên" :
               location.pathname.startsWith("/admin/students") ? "Học viên" :
               location.pathname.startsWith("/admin/courses") ? "Khóa học" :
               location.pathname.startsWith("/admin/content") ? "Nội dung" :
               location.pathname.startsWith("/admin/reports") ? "Báo cáo" :
               location.pathname.startsWith("/admin/system") ? "Hệ thống" :
               location.pathname.startsWith("/admin/notifications") ? "Thông báo" :
               location.pathname.startsWith("/admin/settings") ? "Cài đặt" :
               location.pathname.startsWith("/admin/profile") ? "Hồ sơ" : "Admin"}
            </span>
          </div>

          {/* Center: search */}
          <div className="flex-1 max-w-xs">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "#94A3B8" }} />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  fontSize: 13,
                  color: "#334155",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#F59E0B"; e.target.style.background = "#FFFBEB"; }}
                onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#F8FAFC"; }}
              />
            </div>
          </div>

          {/* Right: actions + profile */}
          <div className="flex items-center gap-2 ml-auto">
            {/* System status */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
              style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span style={{ fontSize: 11, color: "#065F46", fontWeight: 600 }}>Hệ thống Online</span>
            </div>

            {/* Date */}
            <span className="hidden md:block" style={{ fontSize: 12, color: "#94A3B8" }}>
              {new Date().toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" })}
            </span>

            <div className="h-5 w-px" style={{ background: "#E2E8F0" }} />

            {/* Bell — notification dropdown */}
            <NotificationDropdown />

            <div className="h-5 w-px" style={{ background: "#E2E8F0" }} />

            {/* Admin profile chip */}
            <Link to="/admin/profile"
              className="flex items-center gap-2 rounded-xl px-3 py-1.5 cursor-pointer transition-all no-underline"
              style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#FFFBEB"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#FDE68A"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#F8FAFC"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E2E8F0"; }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: avatarGradient }}>AD</div>
              <div className="hidden sm:block">
                <p style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", lineHeight: 1.2 }}>Administrator</p>
                <p style={{ fontSize: 10, color: "#F59E0B", fontWeight: 500 }}>Super Admin</p>
              </div>
              <ChevronDown className="h-3 w-3 flex-shrink-0" style={{ color: "#94A3B8" }} />
            </Link>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
