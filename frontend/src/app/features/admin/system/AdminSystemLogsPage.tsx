import { useEffect, useState } from "react";
import { adminApi } from "@/services/adminApi";
import { AdminTableSkeleton } from "../components/AdminPageSkeleton";

type ActivityReport = {
  tests?: Record<string, unknown>;
  content?: Record<string, unknown>;
  engagement?: Record<string, unknown>;
  usage_patterns?: Record<string, unknown>;
  peak_hours?: Array<{ hour?: string; activity_level?: number }>;
};

export function AdminSystemLogsPage() {
  const [data, setData] = useState<ActivityReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const report = await adminApi.getActivityReport("30d");
      setData(report as ActivityReport);
    } catch {
      setError("Không tải được nhật ký hoạt động.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nhật ký hoạt động</h1>
          <p className="text-sm text-slate-500">Nguồn dữ liệu từ /admin/reports/activity</p>
        </div>
        <button
          onClick={load}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Tải lại
        </button>
      </div>

      {loading ? (
        <AdminTableSkeleton rows={7} cols={5} />
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Panel title="Tests" data={data?.tests || {}} />
          <Panel title="Content" data={data?.content || {}} />
          <Panel title="Engagement" data={data?.engagement || {}} />
          <Panel title="Usage Patterns" data={data?.usage_patterns || {}} />
          <div className="rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-2">
            <h2 className="mb-3 text-base font-semibold text-slate-900">Peak hours</h2>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
              {(data?.peak_hours || []).slice(0, 12).map((item) => (
                <div key={item.hour} className="rounded-lg border border-slate-100 p-2 text-center text-xs">
                  <p className="font-medium text-slate-800">{item.hour}</p>
                  <p className="text-slate-500">{item.activity_level}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Panel({ title, data }: { title: string; data: Record<string, unknown> }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="mb-3 text-base font-semibold text-slate-900">{title}</h2>
      <div className="space-y-2 text-sm text-slate-700">
        {Object.entries(data).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between">
            <span>{k}</span>
            <span className="font-semibold">{String(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

