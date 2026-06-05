import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell, Check, ClipboardList, CheckCircle, AlertCircle,
  MessageSquare, Trophy, Clock, ChevronRight,
} from "lucide-react";
import { studentApi } from "../../../services/studentApi";
import { formatTimeAgo } from "../../../utils/formatters";

const PURPLE = "#7C3AED";
const STUDENT_BASE_PATH = "/hoc-vien";

interface NotificationDto {
  id: number | string;
  title: string;
  message: string;
  type: string;
  color?: string;
  is_read?: boolean;
  created_at: string;
  action_url?: string;
  action_label?: string;
}

const ICON_MAP: Record<string, any> = {
  assignment: ClipboardList,
  graded:     CheckCircle,
  deadline:   AlertCircle,
  message:    MessageSquare,
  achievement: Trophy,
};

function getIcon(type: string) {
  return ICON_MAP[type] ?? Bell;
}

function resolveStudentActionUrl(actionUrl?: string): string | null {
  if (!actionUrl) return null;
  const normalized = actionUrl.startsWith("/") ? actionUrl : `/${actionUrl}`;
  if (normalized.startsWith(`${STUDENT_BASE_PATH}/`)) return normalized;
  return `${STUDENT_BASE_PATH}${normalized}`;
}

export function NotificationDropdown() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch notifications (auto-refetch every 60s while panel open or component mounted)
  const { data, isLoading } = useQuery({
    queryKey: ["student", "notifications", "dropdown"],
    queryFn: () => studentApi.getNotifications({ limit: 10 }),
    refetchInterval: 60_000,
  });

  const notifications: NotificationDto[] = (data as any)?.data?.data?.notifications || [];
  const unreadCount: number = (data as any)?.data?.data?.unread_count || 0;

  const markAllReadMutation = useMutation({
    mutationFn: () => studentApi.markAllNotificationsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["student", "notifications", "dropdown"] });
      const prev = queryClient.getQueryData(["student", "notifications", "dropdown"]);
      queryClient.setQueryData(["student", "notifications", "dropdown"], (old: any) => {
        if (!old) return old;
        const inner = old?.data?.data;
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...inner,
              unread_count: 0,
              notifications: inner?.notifications?.map((n: any) => ({ ...n, is_read: true })) ?? [],
            },
          },
        };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["student", "notifications", "dropdown"], ctx.prev);
    },
    onSuccess: () => {
      // Small delay so the server has committed before we refetch
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["student", "notifications"] });
      }, 800);
    },
  });

  const handleOpen = () => {
    setOpen(true);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setIsVisible(true))
    );
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setOpen(false), 220);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Real-time: when SW receives a push notification, refresh the badge count
  useEffect(() => {
    if (!navigator.serviceWorker) return;
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "NEW_NOTIFICATION") {
        queryClient.invalidateQueries({ queryKey: ["student", "notifications", "dropdown"] });
      }
    };
    navigator.serviceWorker.addEventListener("message", handler);
    return () => navigator.serviceWorker.removeEventListener("message", handler);
  }, [queryClient]);

  const hoverTimeout = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeout[0]) clearTimeout(hoverTimeout[0]);
    if (!open) handleOpen();
  };

  const handleMouseLeave = () => {
    const t = setTimeout(() => handleClose(), 200);
    hoverTimeout[1](t);
  };

  return (
    <div
      className="relative"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => (open ? handleClose() : handleOpen())}
        className="relative p-2 rounded-xl transition-colors duration-200 hover:bg-purple-50"
        aria-label="Thông báo"
      >
        <Bell className="w-5 h-5" style={{ color: open ? PURPLE : "#6B7280" }} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white tabular-nums"
            style={{
              background: "#EF4444",
              boxShadow: "0 0 0 2px white",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
        {/* Mobile backdrop */}
        <div
          className="fixed inset-0 z-[109] sm:hidden"
          onClick={handleClose}
        />

        <div
          className={[
            /* mobile: fixed full-width below navbar */
            "fixed left-2 right-2 top-[56px]",
            /* sm+: classic absolute dropdown */
            "sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-[380px]",
            "z-[110] rounded-2xl overflow-hidden border bg-white",
            "transition-all duration-200 ease-out",
            isVisible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2",
          ].join(" ")}
          style={{
            borderColor: "#E5E7EB",
            boxShadow:
              "0 20px 48px rgba(124,58,237,0.18), 0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: "#F3F4F6" }}
          >
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold" style={{ color: "#1F1344" }}>
                Thông báo
              </h3>
              {unreadCount > 0 && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                  style={{ background: "#EF4444" }}
                >
                  {unreadCount} mới
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
                className="text-[11px] font-semibold flex items-center gap-1 px-2 py-1 rounded-md hover:bg-purple-50 transition-colors"
                style={{ color: PURPLE }}
              >
                <Check className="w-3 h-3" />
                Đánh dấu tất cả
              </button>
            )}
          </div>

          {/* List */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: 420 }}
          >
            {isLoading ? (
              <div className="py-12 text-center">
                <div
                  className="w-8 h-8 border-2 rounded-full animate-spin mx-auto"
                  style={{ borderColor: "#EDE9FE", borderTopColor: PURPLE }}
                />
                <p className="mt-3 text-xs text-gray-400">Đang tải...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center px-6">
                <div
                  className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: "#F5F3FF" }}
                >
                  <Bell className="w-6 h-6" style={{ color: "#A78BFA" }} />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  Chưa có thông báo nào
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Các cập nhật mới sẽ hiển thị ở đây
                </p>
              </div>
            ) : (
              <div>
                {notifications.map((notif) => {
                  const Icon = getIcon(notif.type);
                  const color = notif.color || "#7C3AED";
                  const isUnread = !notif.is_read;
                  const url = resolveStudentActionUrl(notif.action_url);
                  const Wrapper: any = url ? Link : "div";
                  const wrapperProps = url ? { to: url, onClick: () => handleClose() } : {};

                  return (
                    <Wrapper
                      key={notif.id}
                      {...wrapperProps}
                      className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 cursor-pointer relative"
                      style={{
                        background: isUnread ? "#FAF5FF" : "white",
                        borderLeft: isUnread ? `3px solid ${color}` : "3px solid transparent",
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${color}15` }}
                      >
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={`text-sm truncate ${
                              isUnread ? "font-bold" : "font-semibold"
                            }`}
                            style={{ color: "#1F1344" }}
                          >
                            {notif.title}
                          </h4>
                          {isUnread && (
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                              style={{ background: color }}
                            />
                          )}
                        </div>
                        <p
                          className="text-xs mt-0.5 line-clamp-2"
                          style={{ color: "#6B7280" }}
                        >
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Clock
                            className="w-3 h-3"
                            style={{ color: "#9CA3AF" }}
                          />
                          <span
                            className="text-[10px] font-medium"
                            style={{ color: "#9CA3AF" }}
                          >
                            {formatTimeAgo(notif.created_at)}
                          </span>
                          {notif.action_label && url && (
                            <>
                              <span style={{ color: "#D1D5DB" }}>•</span>
                              <span
                                className="text-[10px] font-semibold"
                                style={{ color }}
                              >
                                {notif.action_label}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <Link
              to={`${STUDENT_BASE_PATH}/thong-bao`}
              onClick={() => handleClose()}
              className="flex items-center justify-center gap-1 py-3 border-t text-xs font-semibold transition-colors hover:bg-purple-50"
              style={{ borderColor: "#F3F4F6", color: PURPLE }}
            >
              Xem tất cả thông báo
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
        </>
      )}
    </div>
  );
}
