import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { Bell, Plus, ChevronRight, User, Settings, LogOut, ChevronDown, BookOpen, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { logout } from "../../../services/authApi";
import { api } from "../../../services/api";
import { getAuthUser } from "../../../utils/authStorage";

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
  const bellCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const profileCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seenIdsRef  = useRef<Set<number> | null>(null);
  const pollRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  const user     = getAuthUser();
  const userName = (user?.name as string) || (user?.uName as string) || "Giáo viên";
  const userRole = (user?.role as string) || (user?.uRole as string) || "";
  const userAvatar = (user?.avatar_url as string) || (user?.avatar as string) || "";
  
  // Helper function to get full avatar URL
  const getAvatarUrl = (avatar: string) => {
    if (!avatar) return '';
    // If already a full URL, return as is
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
      return avatar;
    }
    // If relative path, prepend backend URL from .env
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!baseUrl) {
      console.error('VITE_API_BASE_URL is not defined in .env');
      return '';
    }
    return avatar.startsWith('/') ? `${baseUrl}${avatar}` : `${baseUrl}/${avatar}`;
  };
  
  // State to track avatar updates
  const [currentAvatar, setCurrentAvatar] = useState(getAvatarUrl(userAvatar));
  
  // Listen for storage changes to update avatar
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = getAuthUser();
      const newAvatar = (updatedUser?.avatar_url as string) || (updatedUser?.avatar as string) || '';
      setCurrentAvatar(getAvatarUrl(newAvatar));
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event from Settings page
    window.addEventListener('avatarUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('avatarUpdated', handleStorageChange);
    };
  }, []);

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
    const syncUserProfile = async () => {
      try {
        const rawUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (!rawUser) return;
        const parsedUser = JSON.parse(rawUser);
        
        if (!parsedUser.avatar_url && !parsedUser.avatar) {
          const { data: res } = await api.get('/user/profile');
          if (res.status === 'success' && res.data) {
            const updatedUser = {
              ...parsedUser,
              avatar_url: res.data.avatar_url,
              avatar: res.data.avatar_url,
            };
            const isLocal = localStorage.getItem('user') !== null;
            const storage = isLocal ? localStorage : sessionStorage;
            storage.setItem('user', JSON.stringify(updatedUser));
            
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new Event('avatarUpdated'));
          }
        }
      } catch (err) {
        console.error('Error syncing user profile:', err);
      }
    };
    
    syncUserProfile();
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

  const cancelBellClose = () => {
    if (bellCloseTimerRef.current) {
      clearTimeout(bellCloseTimerRef.current);
      bellCloseTimerRef.current = null;
    }
  };

  const scheduleBellClose = () => {
    cancelBellClose();
    bellCloseTimerRef.current = setTimeout(() => {
      setBellOpen(false);
      bellCloseTimerRef.current = null;
    }, 150);
  };

  const openBell = () => {
    cancelBellClose();
    setBellOpen(true);
    setUnread(0);
  };

  const handleProfileClick = () => {
    setProfileOpen((p) => !p);
  };

  const cancelProfileClose = () => {
    if (profileCloseTimerRef.current) {
      clearTimeout(profileCloseTimerRef.current);
      profileCloseTimerRef.current = null;
    }
  };

  const scheduleProfileClose = () => {
    cancelProfileClose();
    profileCloseTimerRef.current = setTimeout(() => {
      setProfileOpen(false);
      profileCloseTimerRef.current = null;
    }, 150);
  };

  const openProfile = () => {
    cancelProfileClose();
    setProfileOpen(true);
  };

  useEffect(() => {
    return () => {
      if (bellCloseTimerRef.current) clearTimeout(bellCloseTimerRef.current);
      if (profileCloseTimerRef.current) clearTimeout(profileCloseTimerRef.current);
    };
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate("/giao-vien/dang-nhap", { replace: true });
  };

  return (
    <div className="sticky top-0 z-40 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 flex items-center justify-between flex-shrink-0 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all duration-300">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5">
        {crumbs.map((crumb, index) => (
          <span key={index} className="flex items-center gap-1.5 group">
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />}
            <span
              className={`transition-colors duration-200 ${
                index === crumbs.length - 1
                  ? "text-slate-800 font-bold tracking-tight text-[15px]"
                  : "text-slate-400 hover:text-indigo-600 font-medium text-[14px] cursor-pointer"
              }`}
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {action && (
          <Button
            onClick={action.onClick}
            className="relative overflow-hidden group text-white h-10 px-5 rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-md shadow-indigo-200/50 hover:shadow-lg hover:shadow-indigo-300/40 border border-indigo-500/20"
            style={{ fontSize: "13px", fontWeight: 600 }}
          >
            <Plus className="w-4.5 h-4.5 transition-transform duration-300 group-hover:rotate-90" />
            {action.label}
          </Button>
        )}

        <div className="h-6 w-[1px] bg-slate-200/80" />

        <LanguageSwitcher />

        {/* Bell Notification */}
        <div
          className="relative pb-2 -mb-2"
          ref={bellRef}
          onMouseEnter={openBell}
          onMouseLeave={scheduleBellClose}
        >
          <button
            onClick={handleBellClick}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300 relative shadow-sm hover:shadow-md ${
              unread > 0
                ? "bg-indigo-50/80 border-indigo-100 text-indigo-600 hover:bg-indigo-100/80"
                : "bg-slate-50/50 border-slate-100 text-slate-500 hover:bg-indigo-50/50 hover:border-indigo-100 hover:text-indigo-600"
            }`}
            aria-label={t("header.notifications")}
          >
            <Bell className={`w-[18px] h-[18px] transition-transform duration-300 hover:scale-110 ${unread > 0 ? "animate-pulse" : ""}`} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm ring-1 ring-rose-500/20">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          <div
            onMouseEnter={cancelBellClose}
            onMouseLeave={scheduleBellClose}
            className={`absolute right-0 top-full z-50 pt-2 transition-all duration-300 origin-top-right ${
              bellOpen ? "opacity-100 translate-y-0 scale-100 visible" : "opacity-0 -translate-y-2 scale-95 invisible pointer-events-none"
            }`}
          >
            <div className="w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/80 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100/80 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">Học viên vừa bắt đầu thi</p>
                {notifications.length > 0 && (
                  <Link
                    to="/giao-vien/giam-sat-truc-tiep"
                    onClick={() => setBellOpen(false)}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 transition-all"
                  >
                    Xem tất cả <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                      <Bell className="w-5 h-5 text-slate-400 opacity-60" />
                    </div>
                    <p className="text-xs font-medium text-slate-500">Chưa có thông báo mới</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Tự động cập nhật mỗi 30 giây</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={`${n.id}-${n.seenAt}`} className="flex items-start gap-3 px-4 py-3 hover:bg-indigo-50/30 transition-all cursor-pointer">
                      <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5 shadow-sm ring-2 ring-indigo-50">
                        {n.avatar || getInitials(n.student_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 leading-snug">
                          <span className="font-semibold text-slate-900">{n.student_name}</span>
                          <span className="text-slate-500"> bắt đầu làm </span>
                          <span className="font-medium text-slate-800 truncate block mt-0.5">{n.exam_title}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {n.exam_type}
                          </span>
                          <span className="text-[10px] text-slate-400">{fmtAgo(n.elapsed_min)}</span>
                        </div>
                      </div>
                      <BookOpen className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 mt-1" />
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60">
                  <Link
                    to="/giao-vien/giam-sat-truc-tiep"
                    onClick={() => setBellOpen(false)}
                    className="text-xs text-indigo-600 font-bold hover:text-indigo-800 hover:underline flex items-center justify-center gap-1 transition-all"
                  >
                    Mở trang giám sát trực tiếp <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Dropdown */}
        <div
          className="relative pb-2 -mb-2"
          ref={profileRef}
          onMouseEnter={openProfile}
          onMouseLeave={scheduleProfileClose}
        >
          <button
            onClick={handleProfileClick}
            className={`group flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 transition-all duration-300 shadow-sm ${
              profileOpen
                ? "bg-indigo-50/80 border-indigo-200 shadow-md"
                : "bg-slate-50/50 border-slate-100 hover:border-slate-200 hover:bg-slate-50 hover:shadow-md"
            }`}
          >
            {currentAvatar ? (
              <img
                src={currentAvatar}
                alt={userName}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0 border border-slate-200 shadow-sm transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105 ${currentAvatar ? 'hidden' : ''}`} style={{ background: 'linear-gradient(135deg,#6366F1,#4338CA)' }}>
              {getInitials(userName)}
            </div>
            <span className="text-slate-700 group-hover:text-slate-900 hidden md:block max-w-[120px] truncate" style={{ fontSize: "13.5px", fontWeight: 600 }}>
              {userName}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${profileOpen ? "rotate-180 text-indigo-600" : "group-hover:text-slate-600"}`}
            />
          </button>

          {profileOpen && (
            <div
              onMouseEnter={cancelProfileClose}
              onMouseLeave={scheduleProfileClose}
              className="absolute right-0 top-full mt-2 w-52 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/80 z-50 overflow-hidden origin-top-right transition-all duration-300"
            >
              <div className="px-4 py-3 border-b border-slate-100/80">
                <p className="text-xs font-bold text-slate-800 truncate">{userName}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold uppercase tracking-wider">Giáo viên</p>
              </div>
              <div className="py-1.5">
                <button
                  onClick={() => { setProfileOpen(false); navigate("/giao-vien/cai-dat?tab=profile"); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-indigo-50/60 hover:text-indigo-700 transition-all text-left group"
                >
                  <User className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 flex-shrink-0 transition-colors" />
                  Hồ sơ cá nhân
                </button>
                <button
                  onClick={() => { setProfileOpen(false); navigate("/giao-vien/cai-dat"); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-indigo-50/60 hover:text-indigo-700 transition-all text-left group"
                >
                  <Settings className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 flex-shrink-0 transition-colors" />
                  Cài đặt
                </button>
              </div>
              <div className="border-t border-slate-100/80 py-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50/50 hover:text-rose-700 transition-all text-left group"
                >
                  <LogOut className="w-4 h-4 group-hover:translate-x-0.5 flex-shrink-0 transition-transform" />
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
