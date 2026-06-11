import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  Bell,
  UserPlus,
  FileText,
  ClipboardList,
  FileCheck2,
  CheckCheck,
  ChevronRight,
  Inbox,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { adminApi } from "@/services/adminApi";

type NotifType = "submission" | "student" | "exam" | "post";

interface NotifItem {
  id: string;
  type: NotifType;
  text: string;
  sub: string;
  link: string;
  time: string;
  ts: number; // epoch ms for ordering / new-detection
  read: boolean;
}

const TYPE_META: Record<NotifType, { icon: typeof Bell; color: string; bg: string; label: string }> = {
  submission: { icon: FileCheck2,     color: "#2563EB", bg: "#EFF6FF", label: "Học viên nộp bài" },
  student:    { icon: UserPlus,       color: "#059669", bg: "#ECFDF5", label: "Học viên mới"     },
  exam:       { icon: ClipboardList,  color: "#D97706", bg: "#FFFBEB", label: "Đề thi mới"       },
  post:       { icon: FileText,       color: "#7C3AED", bg: "#F5F3FF", label: "Bài viết"         },
};

const SECTION_ORDER: NotifType[] = ["submission", "exam", "student", "post"];

const LS_READ_KEY  = "admin_notif_read_ids";
const LS_SOUND_KEY = "admin_notif_sound";
const POLL_MS = 45000;

function timeAgo(ms: number): string {
  if (!ms) return "Vừa xong";
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "Vừa xong";
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  return `${Math.floor(h / 24)} ngày trước`;
}

/* Two-tone "ping" qua Web Audio API — không cần file âm thanh */
function playPing() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const tones = [880, 1175]; // A5 → D6
    tones.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + i * 0.12;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.2);
    });
    setTimeout(() => ctx.close().catch(() => {}), 600);
  } catch {
    /* ignore */
  }
}

export function NotificationDropdown() {
  const [open, setOpen]       = useState(false);
  const [items, setItems]     = useState<NotifItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [soundOn, setSoundOn] = useState<boolean>(() => {
    try { return localStorage.getItem(LS_SOUND_KEY) !== "0"; } catch { return true; }
  });

  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(LS_READ_KEY);
      return stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
    } catch { return new Set<string>(); }
  });

  const ref = useRef<HTMLDivElement>(null);
  const knownIds = useRef<Set<string> | null>(null); // ids đã thấy ở lần fetch trước (để phát âm khi có mới)

  const persistReadIds = (next: Set<string>) => {
    setReadIds(next);
    try { localStorage.setItem(LS_READ_KEY, JSON.stringify([...next])); } catch { }
  };

  const toggleSound = () => {
    setSoundOn((v) => {
      const next = !v;
      try { localStorage.setItem(LS_SOUND_KEY, next ? "1" : "0"); } catch { }
      if (next) playPing(); // preview + unlock audio context qua user gesture
      return next;
    });
  };

  /* ── fetch + merge ── */
  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [activityRes, sysRes] = await Promise.allSettled([
        adminApi.getRecentActivity({ limit: 12 }),
        adminApi.getNotifications(),
      ]);

      const list: NotifItem[] = [];

      if (activityRes.status === "fulfilled") {
        activityRes.value.forEach((a) => {
          const ts = a.ts ? new Date(a.ts).getTime() : 0;
          list.push({
            id: a.id,
            type: (a.type as NotifType) ?? "post",
            text: a.title,
            sub: a.body,
            link: a.link,
            ts,
            time: timeAgo(ts),
            read: false,
          });
        });
      }

      if (sysRes.status === "fulfilled") {
        sysRes.value.forEach((n) => {
          const t = (n.title || "").toLowerCase();
          const type: NotifType =
            t.includes("học viên") || t.includes("student") ? "student" :
            t.includes("đề thi")   || t.includes("exam")    ? "exam"    :
            t.includes("nộp")                                ? "submission" : "post";
          list.push({
            id: `sys-${n.id}`,
            type,
            text: n.title,
            sub: n.body,
            link: type === "student" ? "/admin/students" : type === "exam" ? "/admin/content/exams" : "/admin/content/posts",
            ts: 0,
            time: n.time ?? "Vừa xong",
            read: n.is_read,
          });
        });
      }

      /* dedupe theo id, sort theo ts giảm dần */
      const seen = new Set<string>();
      const deduped = list
        .filter((i) => { if (seen.has(i.id)) return false; seen.add(i.id); return true; })
        .sort((a, b) => b.ts - a.ts);

      /* merge sys-* đã đọc từ DB vào readIds */
      const dbRead = deduped.filter((i) => i.read).map((i) => i.id);
      if (dbRead.length) {
        setReadIds((prev) => {
          const merged = new Set([...prev, ...dbRead]);
          try { localStorage.setItem(LS_READ_KEY, JSON.stringify([...merged])); } catch { }
          return merged;
        });
      }

      /* phát âm thanh nếu có id mới chưa-đọc xuất hiện (bỏ qua lần fetch đầu) */
      const currentIds = new Set(deduped.map((i) => i.id));
      if (knownIds.current) {
        const hasNew = deduped.some((i) => !knownIds.current!.has(i.id) && !readIds.has(i.id));
        if (hasNew && soundOn) playPing();
      }
      knownIds.current = currentIds;

      setItems(deduped);
    } catch {
      /* silent */
    } finally {
      if (!silent) setLoading(false);
    }
  }, [readIds, soundOn]);

  /* initial + polling */
  useEffect(() => {
    load();
    const t = setInterval(() => load(true), POLL_MS);
    return () => clearInterval(t);
  }, [load]);

  /* click outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const unread = items.filter((i) => !readIds.has(i.id)).length;

  const markAll = () => {
    persistReadIds(new Set(items.map((i) => i.id)));
    items
      .filter((i) => i.id.startsWith("sys-") && !readIds.has(i.id))
      .forEach((i) => {
        const numId = Number(i.id.replace("sys-", ""));
        if (numId) adminApi.markNotificationRead(numId).catch(() => {});
      });
  };

  const groups = SECTION_ORDER
    .map((type) => ({ type, items: items.filter((i) => i.type === type) }))
    .filter((g) => g.items.length > 0);

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 cursor-pointer"
        style={{
          background: open ? "#0F172A" : "#FFFFFF",
          border: `1px solid ${open ? "#0F172A" : "#E2E8F0"}`,
        }}
        onMouseEnter={(e) => { if (!open) { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.borderColor = "#CBD5E1"; } }}
        onMouseLeave={(e) => { if (!open) { e.currentTarget.style.background = "#FFFFFF"; e.currentTarget.style.borderColor = "#E2E8F0"; } }}
      >
        <Bell className="h-4 w-4" style={{ color: open ? "#FFFFFF" : "#64748B" }} />
        {unread > 0 && (
          <span
            className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-white ring-2 ring-white"
            style={{ background: "#F59E0B", fontSize: 9, fontWeight: 700 }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-50 rounded-xl overflow-hidden"
          style={{
            width: 360,
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            boxShadow: "0 20px 40px -12px rgba(15,23,42,0.18), 0 2px 6px rgba(15,23,42,0.04)",
          }}
        >
          {/* Header — terminal-style slate */}
          <div className="flex items-center justify-between px-4 py-3" style={{ background: "#0F172A" }}>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" style={{ color: "#F59E0B" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC", letterSpacing: "0.01em" }}>Thông báo</span>
              {unread > 0 && (
                <span
                  className="flex items-center justify-center rounded-full px-1.5 py-0.5 text-white"
                  style={{ background: "#F59E0B", fontSize: 9, fontWeight: 700, color: "#0F172A" }}
                >
                  {unread}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleSound}
                title={soundOn ? "Tắt âm thanh" : "Bật âm thanh"}
                className="flex h-6 w-6 items-center justify-center rounded-md transition-all cursor-pointer"
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1E293B"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {soundOn
                  ? <Volume2 className="h-3.5 w-3.5" style={{ color: "#94A3B8" }} />
                  : <VolumeX className="h-3.5 w-3.5" style={{ color: "#64748B" }} />}
              </button>
              {unread > 0 && (
                <button
                  onClick={markAll}
                  className="flex items-center gap-1 rounded-md px-1.5 py-1 transition-all cursor-pointer"
                  style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#1E293B"; e.currentTarget.style.color = "#F8FAFC"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; }}
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Đọc tất cả
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-md transition-all cursor-pointer"
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1E293B"; }}
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
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              </div>
            ) : groups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: "#F1F5F9" }}>
                  <Inbox className="h-5 w-5" style={{ color: "#CBD5E1" }} />
                </div>
                <p style={{ fontSize: 12, color: "#94A3B8" }}>Không có thông báo mới</p>
              </div>
            ) : (
              groups.map((group) => {
                const meta = TYPE_META[group.type];
                return (
                  <div key={group.type}>
                    {/* Section label */}
                    <div className="flex items-center gap-2 px-4 py-1.5" style={{ background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
                      <div className="flex h-4 w-4 items-center justify-center rounded" style={{ background: meta.bg }}>
                        <meta.icon className="h-2.5 w-2.5" style={{ color: meta.color }} />
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {meta.label}
                      </span>
                      <span className="ml-auto rounded-full px-1.5 py-0.5" style={{ background: meta.bg, fontSize: 9, fontWeight: 700, color: meta.color }}>
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
                            persistReadIds(new Set([...readIds, item.id]));
                            if (item.id.startsWith("sys-")) {
                              const numId = Number(item.id.replace("sys-", ""));
                              if (numId) adminApi.markNotificationRead(numId).catch(() => {});
                            }
                            setOpen(false);
                          }}
                          className="flex items-start gap-3 px-4 py-2.5 transition-all"
                          style={{ background: isRead ? "transparent" : `${meta.color}0A`, borderBottom: "1px solid #F8FAFC" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#F1F5F9"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = isRead ? "transparent" : `${meta.color}0A`; }}
                        >
                          <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: meta.bg }}>
                            <meta.icon className="h-4 w-4" style={{ color: meta.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p style={{ fontSize: 12.5, fontWeight: isRead ? 400 : 600, color: "#0F172A" }}>{item.text}</p>
                            <p className="truncate mt-0.5" style={{ fontSize: 11.5, color: "#64748B" }}>{item.sub}</p>
                            <p className="mt-1 tabular-nums" style={{ fontSize: 9.5, color: "#94A3B8" }}>{item.time}</p>
                          </div>
                          {!isRead && <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: meta.color }} />}
                        </Link>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>

          {/* No footer when the separate notifications page is removed */}
        </div>
      )}
    </div>
  );
}
