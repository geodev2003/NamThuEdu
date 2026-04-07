import { Link } from "react-router";
import { AlertCircle, Bell, X } from "lucide-react";
import { formatTimeAgo } from "../../../../utils/formatters";

const AMBER = "#F59E0B";
const STUDENT_BASE_PATH = "/hoc-vien";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "urgent" | "warning" | "info";
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
}

interface ImportantNotificationsProps {
  notifications: Notification[];
  isLoading?: boolean;
  onDismiss?: (id: number) => void;
}

export function ImportantNotifications({
  notifications,
  isLoading,
  onDismiss,
}: ImportantNotificationsProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl p-5 bg-white border-l-4 border-amber-500 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return null;
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "urgent":
        return { bg: "#FEE2E2", text: "#DC2626", border: "#EF4444" };
      case "warning":
        return { bg: "#FEF3C7", text: "#92400E", border: "#F59E0B" };
      default:
        return { bg: "#DBEAFE", text: "#1E40AF", border: "#2563EB" };
    }
  };

  return (
    <div
      className="rounded-2xl p-5 bg-white border-l-4"
      style={{ borderColor: AMBER }}
    >
      <div className="flex items-center gap-3 mb-3">
        <AlertCircle className="w-5 h-5" style={{ color: AMBER }} />
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1F1344" }}>
          Thông báo quan trọng
        </h3>
        <Link
          to={`${STUDENT_BASE_PATH}/thong-bao`}
          className="ml-auto text-xs font-semibold"
          style={{ color: AMBER }}
        >
          Xem tất cả
        </Link>
      </div>

      <div className="space-y-2">
        {notifications.map((notif) => {
          const colors = getTypeColor(notif.type);

          return (
            <div
              key={notif.id}
              className="flex items-start gap-3 p-3 rounded-lg relative group"
              style={{ background: colors.bg }}
            >
              <Bell className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.text }} />
              
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-sm mb-1"
                  style={{ color: colors.text }}
                >
                  {notif.title}
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: colors.text, opacity: 0.8 }}
                >
                  {notif.message}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs" style={{ color: colors.text, opacity: 0.6 }}>
                    {formatTimeAgo(notif.createdAt)}
                  </span>
                  {notif.actionUrl && (
                    <Link
                      to={notif.actionUrl}
                      className="text-xs font-bold hover:underline"
                      style={{ color: colors.text }}
                    >
                      {notif.actionLabel || "Xem chi tiết"}
                    </Link>
                  )}
                </div>
              </div>

              {onDismiss && (
                <button
                  onClick={() => onDismiss(notif.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/50"
                  style={{ color: colors.text }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
