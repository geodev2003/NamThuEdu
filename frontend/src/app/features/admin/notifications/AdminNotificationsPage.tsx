import { useMemo } from "react";
import { Bell } from "lucide-react";

const notifications = [
  { id: 1, title: "Bài viết chờ duyệt", body: "Có nội dung mới cần kiểm duyệt.", time: "Vừa xong" },
  { id: 2, title: "Đề thi chờ duyệt", body: "Đang có đề thi cần xử lý.", time: "5 phút trước" },
  { id: 3, title: "Hệ thống ổn định", body: "Không phát hiện lỗi nghiêm trọng.", time: "30 phút trước" },
];

export function AdminNotificationsPage() {
  const count = useMemo(() => notifications.length, []);
  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thông báo</h1>
          <p className="text-sm text-slate-500">Khu vực tổng hợp thông báo hệ thống</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
          <Bell className="h-4 w-4" /> {count} thông báo
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-semibold text-slate-900">{n.title}</p>
            <p className="mt-1 text-sm text-slate-600">{n.body}</p>
            <p className="mt-2 text-xs text-slate-400">{n.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

