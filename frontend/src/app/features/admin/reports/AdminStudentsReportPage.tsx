import { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, CalendarClock, Download, Users } from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { AdminStatsSkeleton } from "../components/AdminPageSkeleton";

type ActivityData = {
  total_users?: number;
  active_users?: number;
  inactive_users?: number;
  recent_logins?: number;
  daily_active_users?: number;
  weekly_active_users?: number;
  monthly_active_users?: number;
};

export function AdminStudentsReportPage() {
  const [overview, setOverview] = useState<Record<string, unknown> | null>(null);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sysOverview, userActivity, userReport] = await Promise.all([
        adminApi.getSystemOverview(),
        adminApi.getUserActivity(),
        adminApi.getUserActivityReport(30),
      ]);
      setOverview(sysOverview);
      setActivity(userActivity);
      setReport(userReport.report_data || null);
    } catch {
      setError("Không tải được báo cáo học viên.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      setExportMsg(null);
      const filename = await adminApi.downloadReportCsv({ type: "users", period: "30d" });
      setExportMsg(`Đã tải ${filename}`);
    } catch {
      setExportMsg("Xuất CSV thất bại.");
    } finally {
      setExporting(false);
      setTimeout(() => setExportMsg(null), 3000);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cards = useMemo(
    () => [
      { label: "Tổng người dùng", value: activity?.total_users || 0, icon: Users, tone: "slate" },
      { label: "Đang hoạt động", value: activity?.active_users || 0, icon: Activity, tone: "emerald" },
      { label: "Đăng nhập 7 ngày", value: activity?.recent_logins || 0, icon: CalendarClock, tone: "amber" },
      { label: "DAU", value: activity?.daily_active_users || 0, icon: BarChart3, tone: "blue" },
    ],
    [activity]
  );

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Báo cáo học viên</h1>
          <p className="text-sm text-slate-500">Tổng hợp hoạt động và tăng trưởng người dùng</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Tải lại
          </button>
          <button
            data-testid="admin-export-csv"
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
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
        <>
          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const toneClass =
                card.tone === "emerald"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : card.tone === "amber"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : card.tone === "blue"
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-900";

              return (
                <div key={card.label} className={`rounded-2xl border p-4 ${toneClass}`}>
                  <div className="mb-2 flex items-center gap-2">
                    <card.icon className="h-4 w-4" />
                    <span className="text-xs">{card.label}</span>
                  </div>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-3 text-base font-semibold text-slate-900">Tổng quan hệ thống</h2>
              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  <span className="font-medium">Total users:</span> {String(overview?.total_users ?? 0)}
                </p>
                <p>
                  <span className="font-medium">Active users:</span> {String(overview?.active_users ?? 0)}
                </p>
                <p>
                  <span className="font-medium">Inactive users:</span> {String(overview?.inactive_users ?? 0)}
                </p>
                <p>
                  <span className="font-medium">Active sessions:</span> {String(overview?.active_sessions ?? 0)}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-3 text-base font-semibold text-slate-900">Báo cáo 30 ngày</h2>
              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  <span className="font-medium">New users:</span> {String(report?.new_users ?? 0)}
                </p>
                <p>
                  <span className="font-medium">Active users:</span> {String(report?.active_users ?? 0)}
                </p>
                <p>
                  <span className="font-medium">Students:</span> {String((report?.by_role as Record<string, unknown> | undefined)?.students ?? 0)}
                </p>
                <p>
                  <span className="font-medium">Teachers:</span> {String((report?.by_role as Record<string, unknown> | undefined)?.teachers ?? 0)}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

