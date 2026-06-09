import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { AdminStatsSkeleton } from "../components/AdminPageSkeleton";

type CourseReport = {
  overview?: {
    total_courses?: number;
    active_courses?: number;
    new_courses?: number;
    total_enrollments?: number;
    new_enrollments?: number;
  };
  revenue?: {
    total_revenue?: number;
    revenue_this_period?: number;
    avg_revenue_per_course?: number;
  };
};

export function AdminRevenueReportPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CourseReport | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  const load = async (p: "7d" | "30d" | "90d" | "1y") => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getCoursesReport(p);
      setData(res as CourseReport);
    } catch {
      setError("Không tải được báo cáo doanh thu.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      setExportMsg(null);
      const filename = await adminApi.downloadReportCsv({ type: "courses", period });
      setExportMsg(`Đã tải ${filename}`);
    } catch {
      setExportMsg("Xuất CSV thất bại.");
    } finally {
      setExporting(false);
      setTimeout(() => setExportMsg(null), 3000);
    }
  };

  useEffect(() => {
    load(period);
  }, [period]);

  const overview = data?.overview || {};
  const revenue = data?.revenue || {};

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Báo cáo doanh thu</h1>
          <p className="text-sm text-slate-500">Sử dụng dữ liệu từ /admin/reports/courses</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as "7d" | "30d" | "90d" | "1y")}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500"
          >
            <option value="7d">7 ngày</option>
            <option value="30d">30 ngày</option>
            <option value="90d">90 ngày</option>
            <option value="1y">1 năm</option>
          </select>
          <button
            data-testid="admin-export-csv"
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {exporting ? "Đang xuất..." : "Xuất CSV"}
          </button>
        </div>
      </div>

      {exportMsg && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          {exportMsg}
        </div>
      )}

      {loading ? (
        <AdminStatsSkeleton cards={4} />
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card label="Tổng doanh thu" value={Number(revenue.total_revenue || 0)} />
          <Card label="Doanh thu kỳ này" value={Number(revenue.revenue_this_period || 0)} />
          <Card label="TB / khóa học" value={Number(revenue.avg_revenue_per_course || 0)} />
          <Card label="Tổng khóa học" value={Number(overview.total_courses || 0)} />
          <Card label="Khóa active" value={Number(overview.active_courses || 0)} />
          <Card label="Tổng ghi danh" value={Number(overview.total_enrollments || 0)} />
        </div>
      )}
    </div>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value.toLocaleString()}</p>
    </div>
  );
}

