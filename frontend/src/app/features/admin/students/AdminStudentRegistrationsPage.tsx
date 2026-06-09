import { useEffect, useMemo, useState, type ReactNode } from "react";
import { RefreshCw, Search, UserPlus, Users } from "lucide-react";
import { adminApi, type AdminStudentRegistrationItem } from "@/services/adminApi";
import { AdminTableSkeleton } from "../components/AdminPageSkeleton";

type PeriodFilter = 7 | 30 | 90;
type StatusFilter = "all" | "active" | "inactive";

export function AdminStudentRegistrationsPage() {
  const [items, setItems] = useState<AdminStudentRegistrationItem[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState<PeriodFilter>(30);
  const [status, setStatus] = useState<StatusFilter>("all");

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminApi.getStudentNewRegistrations({
        period_days: period,
        search: search || undefined,
        status: status === "all" ? undefined : status,
      });
      setSummary(result.summary);
      setItems(result.items);
    } catch {
      setError("Không tải được danh sách đăng ký mới.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, status]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const values = [item.name || "", item.phone || "", item.address || ""];
      return values.some((v) => v.toLowerCase().includes(q));
    });
  }, [items, search]);

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Đăng ký mới</h1>
          <p className="text-sm text-slate-500">Theo dõi học viên đăng ký gần đây và trạng thái tài khoản</p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Tải lại
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label={`Đăng ký mới (${period} ngày)`} value={summary.total_new || 0} icon={<UserPlus className="h-4 w-4" />} />
        <StatCard label="Đang active" value={summary.active || 0} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Đang inactive" value={summary.inactive || 0} icon={<Users className="h-4 w-4" />} />
        <StatCard label="7 ngày gần nhất" value={summary.last_7_days || 0} icon={<Users className="h-4 w-4" />} />
      </div>

      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, SĐT, địa chỉ..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value) as PeriodFilter)}
            className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
          >
            <option value={7}>7 ngày</option>
            <option value={30}>30 ngày</option>
            <option value={90}>90 ngày</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <AdminTableSkeleton rows={7} cols={5} />
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Không có học viên đăng ký mới.</div>
        ) : (
          <table className="w-full min-w-[920px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Học viên</th>
                <th className="px-4 py-3">Số điện thoại</th>
                <th className="px-4 py-3">Địa chỉ</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Thời gian đăng ký</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-sm text-slate-700">{row.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.name || "N/A"}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{row.phone}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{row.address || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        row.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {row.created_at ? new Date(row.created_at).toLocaleString("vi-VN") : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-2 inline-flex items-center gap-2 text-xs text-slate-500">
        {icon}
        {label}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
