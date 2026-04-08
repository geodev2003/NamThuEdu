import { useState } from "react";

export function AdminSettingsPage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [emailAlert, setEmailAlert] = useState(false);

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Cài đặt Admin</h1>
        <p className="text-sm text-slate-500">Thiết lập cơ bản cho dashboard quản trị</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="font-medium text-slate-900">Tự động làm mới dữ liệu</p>
          <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Bật tự động refresh
          </label>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="font-medium text-slate-900">Cảnh báo email</p>
          <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={emailAlert}
              onChange={(e) => setEmailAlert(e.target.checked)}
            />
            Gửi email khi có lỗi nghiêm trọng
          </label>
        </div>
      </div>
    </div>
  );
}

