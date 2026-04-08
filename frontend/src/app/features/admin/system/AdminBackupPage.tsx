import { useState } from "react";
import { adminApi } from "@/services/adminApi";

export function AdminBackupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const runExport = async (format: "json" | "csv" | "pdf") => {
    try {
      setLoading(true);
      const res = await adminApi.exportReport({ type: "dashboard", format, period: "30d" });
      setResult(JSON.stringify(res, null, 2));
    } catch {
      setResult("Export thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Backup dữ liệu</h1>
        <p className="text-sm text-slate-500">Dùng endpoint export report để tạo snapshot logic</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          disabled={loading}
          onClick={() => runExport("json")}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          Export JSON
        </button>
        <button
          disabled={loading}
          onClick={() => runExport("csv")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          Export CSV
        </button>
        <button
          disabled={loading}
          onClick={() => runExport("pdf")}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          Export PDF
        </button>
      </div>

      <pre className="overflow-auto rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-700">
        {result || "Chưa có dữ liệu export."}
      </pre>
    </div>
  );
}

