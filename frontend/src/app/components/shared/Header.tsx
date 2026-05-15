import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { Bell, Plus, ChevronRight, User, Settings, LogOut, ChevronDown, BookOpen, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { logout } from "../../../services/authApi";
import { api } from "../../../services/api";

interface HeaderProps {
  breadcrumb: string | string[];
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ExamNotification {
  id: number;
  student_name: string;
  avatar: string;
  exam_title: string;
  exam_type: string;
  started_at: string;
  elapsed_min: number;
  seenAt: number;
}

function getInitials(name: string): string {
  return name.split(" ").map((w) => w.charAt(0)).join("").toUpperCase().slice(0, 2);
}

function fmtAgo(min: number): string {
  if (min === 0) return "vừa xong";
  if (min < 60) return `${min} phút trước`;
  return `${Math.floor(min / 60)}h ${min % 60}m trước`;
}

export function Header({ breadcrumb, action }: HeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const crumbs = Array.isArray(breadcrumb) ? breadcrumb : [breadcrumb];

  const [profileOpen, setProfileOpen]   = useState(false);
  const [bellOpen, setBellOpen]         = useState(false);
  const [notifications, setNotifications] = useState<ExamNotification[]>([]);
  const [unread, setUnread]             = useState(0);
  const profileRef  = useRef<HTMLDivElement>(null);
  const bellRef     = useRef<HTMLDivElement>(null);
  const seenIdsRef  = useRef<Set<number> | null>(null);
  const pollRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  const userStr  = localStorage.getItem("user");
  const user     = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || user?.uName || "Giáo viên";
  const userRole = user?.role || user?.uRole || "";

  const fetchRecentStarts = () => {
    if (userRole !== "teacher") return;
    api.get("/teacher/dashboard/recent-starts")
      .then((res: any) => {
        const items: Omit<ExamNotification, "seenAt">[] = res?.data?.data ?? res?.data ?? [];
        if (!Array.isArray(items)) return;

        if (seenIdsRef.current === null) {
          seenIdsRef.current = new Set(items.map((i) => i.id));
          const veryNew = items.filter((i) => i.elapsed_min < 5);
          if (veryNew.length > 0) {
            setNotifications(veryNew.map((i) => ({ ...i, seenAt: Date.now() })));
            setUnread(veryNew.length);
          }
          return;
        }

        const newOnes = items.filter((i) => !seenIdsRef.current!.has(i.id));
        if (newOnes.length === 0) return;

        newOnes.forEach((i) => seenIdsRef.current!.add(i.id));

        setNotifications((prev) => [
          ...newOnes.map((i) => ({ ...i, seenAt: Date.now() })),
          ...prev,
        ].slice(0, 20));
        setUnread((c) => c + newOnes.length);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchRecentStarts();
    pollRef.current = setInterval(fetchRecentStarts, 30000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (bellRef.current   && !bellRef.current.contains(e.target as Node))   setBellOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleBellClick = () => {
    setBellOpen((p) => !p);
    setUnread(0);
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate("/giao-vien/dang-nhap", { replace: true });
  };

  return (
    <div className="h-20 bg-white border-b border-[#E5E7EB] px-8 flex items-center justify-between flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        {crumbs.map((crumb, index) => (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />}
            <span
              className={index === crumbs.length - 1 ? "text-[#1F2937] font-semibold" : "text-[#6B7280]"}
              style={{ fontSize: "14px" }}
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {action && (
          <Button
            onClick={action.onClick}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-10 px-5 rounded-lg shadow-sm flex items-center gap-2 transition-colors active:scale-[0.98]"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            <Plus className="w-4 h-4" />
            {action.label}
          </Button>
        )}

        <LanguageSwitcher />

        {/* Bell Notification */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={handleBellClick}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors relative"
            aria-label={t("header.notifications")}
          >
            <Bell className={`w-5 h-5 ${unread > 0 ? "text-blue-600" : "text-[#6B7280]"}`} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800">Học viên vừa bắt đầu thi</p>
                {notifications.length > 0 && (
                  <Link
                    to="/giao-vien/giam-sat-truc-tiep"
                    onClick={() => setBellOpen(false)}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Xem tất cả <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                    <Bell className="w-8 h-8 mb-2 opacity-30" />
                    <p className="text-sm">Chưa có thông báo mới</p>
                    <p className="text-xs mt-0.5">Cập nhật mỗi 30 giây</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={`${n.id}-${n.seenAt}`} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                        {n.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 leading-snug">
                          <span className="font-semibold">{n.student_name}</span>
                          <span className="text-slate-500"> bắt đầu làm </span>
                          <span className="font-medium text-slate-700 truncate">{n.exam_title}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                            {n.exam_type}
                          </span>
                          <span className="text-xs text-slate-400">{fmtAgo(n.elapsed_min)}</span>
                        </div>
                      </div>
                      <BookOpen className="w-4 h-4 text-slate-300 flex-shrink-0 mt-1" />
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60">
                  <Link
                    to="/giao-vien/giam-sat-truc-tiep"
                    onClick={() => setBellOpen(false)}
                    className="text-xs text-blue-600 font-semibold hover:underline flex items-center justify-center gap-1"
                  >
                    Mở trang giám sát trực tiếp <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className={`flex items-center gap-2 rounded-[20px] px-3 py-1.5 transition-colors ${
              profileOpen ? "bg-[#EFF6FF]" : "hover:bg-[#F3F4F6]"
            }`}
          >
            <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {getInitials(userName)}
            </div>
            <span className="text-[#374151] hidden md:block max-w-[120px] truncate" style={{ fontSize: "14px", fontWeight: 500 }}>
              {userName}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#9CA3AF] hidden md:block transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/60 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-50">
                <p className="text-sm font-semibold text-slate-800 truncate">{userName}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Giáo viên</p>
              </div>
              <div className="py-1.5">
                <button
                  onClick={() => { setProfileOpen(false); navigate("/giao-vien/cai-dat?tab=profile"); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  Hồ sơ cá nhân
                </button>
                <button
                  onClick={() => { setProfileOpen(false); navigate("/giao-vien/cai-dat"); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  Cài đặt
                </button>
              </div>
              <div className="border-t border-slate-100 py-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
