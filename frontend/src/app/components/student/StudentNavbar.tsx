import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { logout } from "../../../services/authApi";
import {
  Home,
  ClipboardList,
  Target,
  Bell,
  User,
  LogOut,
  Settings,
  Flame,
  BookOpen,
  BarChart2,
  ChevronDown,
  Zap,
  Menu,
  X,
  TrendingUp,
  History,
  Trophy,
} from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";

// ─── Color tokens (Student = Purple) ──────────────────────────────────────────
const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#EDE9FE";
const PURPLE_MID = "#8B5CF6";
const STUDENT_BASE_PATH = "/hoc-vien";

const studentPath = (suffix = "") => `${STUDENT_BASE_PATH}${suffix}`;

export function StudentNavbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/dang-nhap", { replace: true });
  };

  // Scroll-aware glassmorphism
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close profile menu on outside click
  useEffect(() => {
    if (!profileMenuOpen) return;
    const close = () => setProfileMenuOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [profileMenuOpen]);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const navItems = [
    { path: studentPath(), label: t("student.nav.dashboard"), exact: true },
    { path: studentPath("/bai-tap"), label: t("student.nav.tests"), exact: false },
    { path: studentPath("/de-thi"), label: "\u0110\u1ec1 thi", exact: false },
    { path: studentPath("/luyen-tap"), label: t("student.nav.practice"), exact: false },
    { path: studentPath("/tien-do"), label: t("student.nav.progress"), exact: false },
    { path: studentPath("/lich-su"), label: t("student.nav.history"), exact: false },
  ];

  // Bottom nav items (mobile)
  const bottomNavItems = [
    { path: studentPath(), label: t("student.nav.dashboard"), icon: Home, exact: true },
    { path: studentPath("/bai-tap"), label: t("student.nav.tests"), icon: ClipboardList, exact: false },
    { path: studentPath("/de-thi"), label: "Đề thi", icon: BookOpen, exact: false },
    { path: studentPath("/luyen-tap"), label: t("student.nav.practice"), icon: Target, exact: false },
    { path: studentPath("/tien-do"), label: t("student.nav.progress"), icon: BarChart2, exact: false },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  const sidebarItems = [
    { path: studentPath(),                 label: t("student.nav.dashboard"),         icon: Home,          exact: true },
    { path: studentPath("/bai-tap"),       label: t("student.nav.tests"),              icon: ClipboardList, exact: false },
    { path: studentPath("/de-thi"),        label: "Đề thi",                            icon: BookOpen,      exact: false },
    { path: studentPath("/luyen-tap"),     label: t("student.nav.practice"),           icon: Target,        exact: false },
    { path: studentPath("/tien-do"),       label: t("student.nav.progress"),           icon: TrendingUp,    exact: false },
    { path: studentPath("/lich-su"),       label: t("student.nav.history"),            icon: History,       exact: false },
    { path: studentPath("/bang-xep-hang"),label: "Bảng xếp hạng",                    icon: Trophy,        exact: false },
    { path: studentPath("/thong-bao"),     label: "Thông báo",                         icon: Bell,          exact: false },
    { path: studentPath("/ho-so"),         label: t("student.nav.profile.myProfile"),  icon: User,          exact: false },
    { path: studentPath("/cai-dat"),       label: t("student.nav.profile.settings"),   icon: Settings,      exact: false },
  ];

  return (
    <>
      {/* ─── Top Navbar ─────────────────────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(255,255,255,0.85)"
            : "rgba(255,255,255,1)",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(124,58,237,0.12)"
            : "1px solid rgba(229,231,235,0.8)",
          boxShadow: scrolled
            ? "0 4px 32px rgba(124,58,237,0.12)"
            : "none",
        }}
      >
        {/* ── Top accent gradient ── */}
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, ${PURPLE} 0%, #A78BFA 55%, #60A5FA 100%)`,
          }}
        />
        <div className="w-full px-5 py-2">
          <div className="flex items-center justify-between">

            {/* ── Left: Hamburger + Logo ── */}
            <div className="flex items-center gap-2">

            {/* Hamburger */}
            <button
              onClick={(e) => { e.stopPropagation(); setSidebarOpen(true); }}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-purple-50"
              aria-label="Mở menu"
            >
              <Menu className="w-5 h-5" style={{ color: PURPLE }} />
            </button>

            {/* ── Logo ── */}
            <Link
              to={studentPath()}
              className="flex items-center gap-2.5"
              style={{ textDecoration: "none" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_MID})`,
                }}
              >
                <BookOpen className="w-[18px] h-[18px] text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: "#1F1344",
                    letterSpacing: "-0.03em",
                  }}
                >
                  NamThu
                  <span style={{ color: PURPLE }}>Edu</span>
                </span>
                <span
                  style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}
                >
                  {t("student.nav.profile.student")}
                </span>
              </div>
            </Link>
            </div>{/* end left group */}

            {/* ── Desktop Nav Links ── */}
            <div
              className="hidden md:flex items-center gap-0.5 rounded-2xl p-1"
              style={{
                background: "#F5F3FF",
                border: "1px solid #EDE9FE",
              }}
            >
              {navItems.map((item) => {
                const active = isActive(item.path, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="px-4 py-1.5 transition-all duration-200 rounded-xl whitespace-nowrap"
                    style={{
                      fontSize: 13,
                      fontWeight: active ? 700 : 500,
                      color: active ? "#fff" : "#6B7280",
                      background: active
                        ? `linear-gradient(135deg, ${PURPLE}, ${PURPLE_MID})`
                        : "transparent",
                      boxShadow: active ? `0 2px 10px ${PURPLE}40` : "none",
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* ── Right Section ── */}
            <div className="flex items-center gap-2">

              {/* Streak badge */}
              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #F97316, #FBBF24)",
                  boxShadow: "0 2px 10px rgba(249,115,22,0.38)",
                }}
              >
                <Flame className="w-3.5 h-3.5 text-white" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                  7
                </span>
              </div>

              {/* XP badge */}
              <div
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_MID})`,
                  boxShadow: `0 2px 10px ${PURPLE}45`,
                }}
              >
                <Zap className="w-3 h-3 text-white" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                  1,240 XP
                </span>
              </div>

              {/* Language switcher */}
              <div
                className="hidden lg:flex items-center gap-0.5 p-0.5 rounded-lg"
                style={{ background: "#F3F4F6" }}
              >
                {["vi", "en"].map((lng) => (
                  <button
                    key={lng}
                    onClick={() => changeLanguage(lng)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-150"
                    style={{
                      color: i18n.language === lng ? PURPLE : "#9CA3AF",
                      background: i18n.language === lng ? "#fff" : "transparent",
                      boxShadow:
                        i18n.language === lng
                          ? "0 1px 4px rgba(0,0,0,0.1)"
                          : "none",
                    }}
                  >
                    {lng.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Notifications dropdown */}
              <NotificationDropdown />

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileMenuOpen((p) => !p);
                  }}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl transition-colors duration-200 hover:bg-purple-50"
                >
                  {/* Avatar with gradient ring */}
                  <div
                    className="rounded-full p-[2px]"
                    style={{
                      background: `linear-gradient(135deg, ${PURPLE}, #A78BFA, #60A5FA)`,
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_MID})`,
                        border: "2px solid white",
                      }}
                    >
                      H
                    </div>
                  </div>
                  <ChevronDown
                    className="w-3.5 h-3.5 hidden md:block transition-transform duration-200"
                    style={{
                      color: "#6B7280",
                      transform: profileMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {/* Dropdown */}
                {profileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-2xl shadow-xl border overflow-hidden"
                    style={{
                      background: "#FFFFFF",
                      borderColor: "#E5E7EB",
                      boxShadow:
                        "0 20px 48px rgba(124,58,237,0.15), 0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  >
                    {/* Header */}
                    <div
                      className="px-4 py-3"
                      style={{
                        background: `linear-gradient(135deg, ${PURPLE_LIGHT}, #DDD6FE)`,
                        borderBottom: `1px solid ${PURPLE}20`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="rounded-full p-[2px]"
                          style={{
                            background: `linear-gradient(135deg, ${PURPLE}, #A78BFA, #60A5FA)`,
                          }}
                        >
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base"
                            style={{
                              background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_MID})`,
                              border: "2px solid white",
                            }}
                          >
                            H
                          </div>
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#1F1344",
                            }}
                          >
                            {t("student.nav.profile.student")}
                          </p>
                          <p style={{ fontSize: 11, color: "#7C3AED" }}>
                            1,240 XP · 7 {t("student.nav.streak.days")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="p-2">
                      <Link
                        to={studentPath("/ho-so")}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-purple-50"
                        style={{ fontSize: 14, color: "#374151" }}
                      >
                        <User
                          className="w-4 h-4"
                          style={{ color: PURPLE }}
                        />
                        {t("student.nav.profile.myProfile")}
                      </Link>
                      <Link
                        to={studentPath("/cai-dat")}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-purple-50"
                        style={{ fontSize: 14, color: "#374151" }}
                      >
                        <Settings
                          className="w-4 h-4"
                          style={{ color: "#6B7280" }}
                        />
                        {t("student.nav.profile.settings")}
                      </Link>
                      <div
                        className="my-1.5 mx-1"
                        style={{
                          height: 1,
                          background: "#F3F4F6",
                        }}
                      />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-red-50"
                        style={{ fontSize: 14, color: "#EF4444" }}
                      >
                        <LogOut className="w-4 h-4" />
                        {t("student.nav.profile.logout")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Left Sidebar Drawer ─────────────────────────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[99]"
            style={{ background: "rgba(15,5,40,0.45)", backdropFilter: "blur(4px)" }}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer panel */}
          <div
            className="fixed top-0 left-0 h-full z-[100] flex flex-col"
            style={{
              width: 280,
              background: "#fff",
              boxShadow: "4px 0 40px rgba(124,58,237,0.18)",
              animation: "slideInLeft 0.22s ease",
            }}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ background: `linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)`, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <Link to={studentPath()} className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}>
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                  NamThu<span style={{ color: "#C4B5FD" }}>Edu</span>
                </span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150"
                    style={{
                      background: active ? `linear-gradient(135deg, ${PURPLE}, ${PURPLE_MID})` : "transparent",
                      color: active ? "#fff" : "#374151",
                      fontWeight: active ? 700 : 500,
                      fontSize: 14,
                      boxShadow: active ? `0 2px 10px ${PURPLE}40` : "none",
                    }}
                  >
                    <Icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: 18, height: 18, color: active ? "#fff" : PURPLE }} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-3 pb-6 pt-2" style={{ borderTop: "1px solid #F0EEFF" }}>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-red-50"
                style={{ fontSize: 14, color: "#EF4444", fontWeight: 600 }}
              >
                <LogOut className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                {t("student.nav.profile.logout")}
              </button>
            </div>
          </div>

          <style>{`
            @keyframes slideInLeft {
              from { transform: translateX(-100%); opacity: 0; }
              to   { transform: translateX(0);     opacity: 1; }
            }
          `}</style>
        </>
      )}

      {/* ─── Mobile Bottom Navigation ─────────────────────────────────────────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(124,58,237,0.12)",
          boxShadow: "0 -4px 24px rgba(124,58,237,0.08)",
        }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200"
                style={{
                  color: active ? PURPLE : "#9CA3AF",
                  background: active ? PURPLE_LIGHT : "transparent",
                  minWidth: 56,
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{
                    color: active ? PURPLE : "#9CA3AF",
                    strokeWidth: active ? 2.5 : 1.8,
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: active ? 700 : 500,
                    lineHeight: 1,
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        {/* Safe area for iPhone */}
        <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
      </nav>
    </>
  );
}
