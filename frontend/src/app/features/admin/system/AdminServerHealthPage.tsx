import { useEffect, useState } from "react";
import { adminApi } from "@/services/adminApi";

type TrendsReport = {
  growth?: Record<string, unknown>;
  usage?: Record<string, unknown>;
  performance?: Record<string, unknown>;
  seasonal?: Record<string, unknown>;
  predictions?: Record<string, unknown>;
};

export function AdminServerHealthPage() {
  const [data, setData] = useState<TrendsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const report = await adminApi.getTrendsReport("90d");
      setData(report as TrendsReport);
    } catch {
      setError("Không tải được dữ liệu sức khỏe hệ thống.");
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
          <h1 className="text-2xl font-bold text-slate-900">Sức khỏe server</h1>
          <p className="text-sm text-slate-500">Nguồn dữ liệu: /admin/reports/trends</p>
        </div>
        <button
          onClick={load}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Tải lại
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Panel title="Growth trends" data={data?.growth || {}} />
          <Panel title="Usage trends" data={data?.usage || {}} />
          <Panel title="Performance trends" data={data?.performance || {}} />
          <Panel title="Seasonal patterns" data={data?.seasonal || {}} />
          <div className="rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-2">
            <h2 className="mb-3 text-base font-semibold text-slate-900">Predictions</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {Object.entries(data?.predictions || {}).map(([k, v]) => (
                <div key={k} className="rounded-lg border border-slate-100 p-3">
                  <p className="text-xs text-slate-500">{k}</p>
                  <p className="text-xl font-bold text-slate-900">{String(v)}</p>
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

