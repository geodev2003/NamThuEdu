import { useEffect, useState } from "react";
import { adminApi } from "@/services/adminApi";
import { AdminSettingsSkeleton } from "../components/AdminPageSkeleton";

export function AdminSettingsPage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [emailAlert, setEmailAlert] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.getSettings();
        if (data.autoRefresh !== undefined) setAutoRefresh(Boolean(data.autoRefresh));
        if (data.emailAlert !== undefined) setEmailAlert(Boolean(data.emailAlert));
      } catch (err) {
        console.error("Lỗi tải cài đặt", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleUpdate = async (key: string, value: boolean) => {
    if (key === "autoRefresh") setAutoRefresh(value);
    if (key === "emailAlert") setEmailAlert(value);
    
    try {
      await adminApi.updateSettings({ [key]: value });
    } catch (err) {
      console.error("Lỗi lưu cài đặt", err);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Cài đặt Admin</h1>
        <p className="text-sm text-slate-500">Thiết lập cơ bản cho dashboard quản trị</p>
      </div>

      {loading ? (
        <AdminSettingsSkeleton />
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-medium text-slate-900">Tự động làm mới dữ liệu</p>
            <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => handleUpdate("autoRefresh", e.target.checked)}
                className="cursor-pointer"
              />
              Bật tự động refresh
            </label>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-medium text-slate-900">Cảnh báo email</p>
            <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlert}
                onChange={(e) => handleUpdate("emailAlert", e.target.checked)}
                className="cursor-pointer"
              />
              Gửi email khi có lỗi nghiêm trọng
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
