import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle } from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { AdminTableSkeleton } from "../components/AdminPageSkeleton";

type Notification = { id: number; title: string; body: string; is_read: boolean; time: string };

export function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Lỗi tải thông báo", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.is_read).length, [notifications]);

  const markAsRead = async (id: number) => {
    try {
      await adminApi.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái", err);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thông báo</h1>
          <p className="text-sm text-slate-500">Khu vực tổng hợp thông báo hệ thống</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
          <Bell className="h-4 w-4" /> {unreadCount} chưa đọc
        </div>
      </div>

      {loading ? (
        <AdminTableSkeleton rows={7} cols={4} />
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">Không có thông báo nào.</div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className={`flex items-start justify-between rounded-2xl border p-4 ${n.is_read ? 'bg-slate-50 border-slate-200' : 'bg-white border-blue-200 shadow-sm'}`}>
              <div>
                <p className={`font-semibold ${n.is_read ? 'text-slate-600' : 'text-slate-900'}`}>{n.title}</p>
                <p className={`mt-1 text-sm ${n.is_read ? 'text-slate-500' : 'text-slate-700'}`}>{n.body}</p>
                <p className="mt-2 text-xs text-slate-400">{n.time}</p>
              </div>
              {!n.is_read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  title="Đánh dấu đã đọc"
                  className="text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <CheckCircle className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
