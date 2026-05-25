import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  Bell,
  UserPlus,
  FileText,
  ClipboardList,
  CheckCheck,
  ChevronRight,
  Inbox,
  X,
} from "lucide-react";
import { adminApi } from "@/services/adminApi";

interface NotifItem {
  id: string;
  type: "student" | "post" | "exam";
  text: string;
  sub: string;
  link: string;
  time: string;
  read: boolean;
}

const TYPE_META = {
  student: { icon: UserPlus,      color: "#10B981", bg: "#ECFDF5", label: "Học viên mới" },
  post:    { icon: FileText,       color: "#F59E0B", bg: "#FFFBEB", label: "Bài viết"     },
  exam:    { icon: ClipboardList,  color: "#8B5CF6", bg: "#F5F3FF", label: "Đề thi"       },
};

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "Vừa xong";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "Vừa xong";
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  return `${Math.floor(h / 24)} ngày trước`;
}

export function NotificationDropdown() {
  const [open, setOpen]   = useState(false);
  const [items, setItems] = useState<NotifItem[]>([]);
  const [loading, setLoading] = useState(false);
  const LS_KEY = "admin_notif_read_ids";
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      return stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
    } catch { return new Set<string>(); }
  });

  /* sync readIds → localStorage whenever it changes */
  const updateReadIds = (next: Set<string>) => {
    setReadIds(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify([...next])); } catch { }
  };
  const ref = useRef<HTMLDivElement>(null);

  /* ── fetch ── */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [sysNotifsRes, studentsRes, contentRes, examRes] = await Promise.allSettled([
          adminApi.getNotifications(),
          adminApi.getStudentNewRegistrations({ period_days: 7 }),
          adminApi.getContentStatistics(),
          adminApi.getExamStatistics(),
        ]);

        const list: NotifItem[] = [];

        /* system notifications (primary) */
        if (sysNotifsRes.status === "fulfilled") {
          sysNotifsRes.value.slice(0, 3).forEach((n) => {
            const type: NotifItem["type"] =
              n.title?.toLowerCase().includes("học viên") || n.title?.toLowerCase().includes("student") ? "student" :
              n.title?.toLowerCase().includes("đề thi") || n.title?.toLowerCase().includes("exam") ? "exam" : "post";
            list.push({
              id:   `sys-${n.id}`,
              type,
              text: n.title,
              sub:  n.body,
              link: type === "student" ? "/admin/students" : type === "exam" ? "/admin/content/exams" : "/admin/content/posts",
              time: n.time ?? "Vừa xong",
              read: n.is_read,
            });
          });
        }

        /* students created recently by teachers */
        if (studentsRes.status === "fulfilled") {
          studentsRes.value.items.slice(0, 4).forEach((s) => {
            list.push({
              id:   `student-${s.id}`,
              type: "student",
              text: `Học viên mới: ${s.name ?? s.phone}`,
              sub:  `SĐT ${s.phone} · ${s.status === "active" ? "Hoạt động" : "Chưa kích hoạt"}`,
              link: "/admin/students",
              time: timeAgo(s.created_at),
              read: false,
            });
          });
        }

        /* pending posts */
        if (contentRes.status === "fulfilled") {
          const pending = Number((contentRes.value as Record<string, unknown>)?.pending_posts ?? 0);
          if (pending > 0) {
            list.push({
              id:   "post-pending",
              type: "post",
              text: `${pending} bài viết chờ duyệt`,
              sub:  "Cần xem xét và phê duyệt",
              link: "/admin/content/posts",
              time: "Ngay bây giờ",
              read: false,
            });
          }
        }

        /* pending exams */
        if (examRes.status === "fulfilled") {
          const pending = Number((examRes.value as Record<string, unknown>)?.pending_exams ?? 0);
          if (pending > 0) {
            list.push({
              id:   "exam-pending",
              type: "exam",
              text: `${pending} đề thi chờ duyệt`,
              sub:  "Cần xem xét và phê duyệt",
              link: "/admin/content/exams",
              time: "Ngay bây giờ",
              read: false,
            });
          }
        }

        /* deduplicate by id */
        const seen = new Set<string>();
        setItems(list.filter((i) => { if (seen.has(i.id)) return false; seen.add(i.id); return true; }));
        /* pre-mark system notifs that are already read (merge with localStorage) */
        if (sysNotifsRes.status === "fulfilled") {
          const dbRead = sysNotifsRes.value.filter((n) => n.is_read).map((n) => `sys-${n.id}`);
          if (dbRead.length) {
            setReadIds((prev) => {
              const merged = new Set([...prev, ...dbRead]);
              try { localStorage.setItem(LS_KEY, JSON.stringify([...merged])); } catch { }
              return merged;
            });
          }
        }
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ── click outside ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const unread = items.filter((i) => !readIds.has(i.id)).length;

  const markAll = () => {
    const next = new Set(items.map((i) => i.id));
    updateReadIds(next);
    /* persist sys-* to DB */
    items
      .filter((i) => i.id.startsWith("sys-") && !readIds.has(i.id))
      .forEach((i) => {
        const numId = Number(i.id.replace("sys-", ""));
        if (numId) adminApi.markNotificationRead(numId).catch(() => {});
      });
  };

  /* ── group by type ── */
  const groups = (["student", "post", "exam"] as const)
    .map((type) => ({ type, items: items.filter((i) => i.type === type) }))
    .filter((g) => g.items.length > 0);

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-all"
        style={{
          background: open ? "#FFFBEB" : "#F8FAFC",
          border: `1px solid ${open ? "#F59E0B" : "#E2E8F0"}`,
        }}
        onMouseEnter={(e) => {
          if (!open) {
            e.currentTarget.style.background = "#F1F5F9";
            e.currentTarget.style.borderColor = "#CBD5E1";
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.background = "#F8FAFC";
            e.currentTarget.style.borderColor = "#E2E8F0";
          }
        }}
      >
        <Bell className="h-4 w-4" style={{ color: open ? "#F59E0B" : "#475569" }} />
        {unread > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-white"
            style={{ background: "#EF4444", fontSize: 9, fontWeight: 700 }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-50 rounded-2xl overflow-hidden"
          style={{
            width: 360,
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            boxShadow: "0 10px 40px rgba(15,23,42,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid #F1F5F9" }}
          >
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" style={{ color: "#0F172A" }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Thông báo</span>
              {unread > 0 && (
                <span
                  className="flex items-center justify-center rounded-full px-2 py-0.5 text-white"
                  style={{ background: "#EF4444", fontSize: 10, fontWeight: 700 }}
                >
                  {unread} mới
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  onClick={markAll}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 transition-all"
                  style={{ fontSize: 11, color: "#64748B" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFC"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Đọc tất cả
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-lg transition-all"
                onMouseEnter={(e) => { e.currentTarget.style.background = "#F1F5F9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <X className="h-3.5 w-3.5" style={{ color: "#94A3B8" }} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto" style={{ maxHeight: 380 }}>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#F59E0B] border-t-transparent" />
              </div>
            ) : groups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: "#F8FAFC" }}
                >
                  <Inbox className="h-6 w-6" style={{ color: "#CBD5E1" }} />
                </div>
                <p style={{ fontSize: 13, color: "#94A3B8" }}>Không có thông báo mới</p>
              </div>
            ) : (
              groups.map((group) => {
                const meta = TYPE_META[group.type];
                return (
                  <div key={group.type}>
                    {/* Section label */}
                    <div
                      className="flex items-center gap-2 px-4 py-2"
                      style={{ background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}
                    >
                      <div
                        className="flex h-5 w-5 items-center justify-center rounded"
                        style={{ background: meta.bg }}
                      >
                        <meta.icon className="h-3 w-3" style={{ color: meta.color }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {meta.label}
                      </span>
                      <span
                        className="ml-auto rounded-full px-1.5 py-0.5"
                        style={{ background: meta.bg, fontSize: 10, fontWeight: 700, color: meta.color }}
                      >
                        {group.items.length}
                      </span>
                    </div>

                    {/* Items */}
                    {group.items.map((item) => {
                      const isRead = readIds.has(item.id);
                      return (
                        <Link
                          key={item.id}
                          to={item.link}
                          onClick={() => {
                            updateReadIds(new Set([...readIds, item.id]));
                            /* persist sys-* to DB */
                            if (item.id.startsWith("sys-")) {
                              const numId = Number(item.id.replace("sys-", ""));
                              if (numId) adminApi.markNotificationRead(numId).catch(() => {});
                            }
                            setOpen(false);
                          }}
                          className="flex items-start gap-3 px-4 py-3 transition-all"
                          style={{
                            background: isRead ? "transparent" : `${meta.color}06`,
                            borderBottom: "1px solid #F8FAFC",
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#F8FAFC"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = isRead ? "transparent" : `${meta.color}06`; }}
                        >
                          <div
                            className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
                            style={{ background: meta.bg }}
                          >
                            <meta.icon className="h-4 w-4" style={{ color: meta.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p style={{ fontSize: 13, fontWeight: isRead ? 400 : 600, color: "#0F172A" }}>
                              {item.text}
                            </p>
                            <p className="truncate mt-0.5" style={{ fontSize: 11, color: "#94A3B8" }}>
                              {item.sub}
                            </p>
                            <p className="mt-1" style={{ fontSize: 10, color: "#CBD5E1" }}>
                              {item.time}
                            </p>
                          </div>
                          {!isRead && (
                            <div
                              className="mt-2 h-2 w-2 flex-shrink-0 rounded-full"
                              style={{ background: meta.color }}
                            />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid #F1F5F9" }}>
            <Link
              to="/admin/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 py-3 transition-all"
              style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#F59E0B"; (e.currentTarget as HTMLAnchorElement).style.background = "#FFFBEB"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#64748B"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
            >
              Xem tất cả thông báo
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
