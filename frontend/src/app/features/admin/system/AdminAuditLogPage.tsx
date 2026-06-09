import { useEffect, useMemo, useState, useCallback } from "react";
import { usePageTitle, PAGE_TITLES } from "../../../../hooks/usePageTitle";
import {
  ShieldCheck,
  AlertTriangle,
  Activity,
  Search,
  RefreshCw,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { adminApi, type AdminActivityLogItem, type AdminActivityLogStats } from "@/services/adminApi";
import { AdminTableSkeleton } from "../components/AdminPageSkeleton";

/**
 * AdminAuditLogPage — Nhật ký audit thao tác admin (real audit trail).
 *
 * Design system: Data-Dense Dashboard (UI-UX skill).
 *  - Màu: primary #1E40AF, secondary #3B82F6, highlight #F59E0B, bg #F8FAFC, text #1E3A8A.
 *  - SVG icons (Lucide), KHÔNG emoji. Hover/transition 150–200ms. Bảng có filter rõ ràng.
 */

const ENTITY_OPTIONS = [
  { value: "", label: "Tất cả đối tượng" },
  { value: "user", label: "Người dùng" },
  { value: "exam", label: "Đề thi" },
  { value: "post", label: "Bài viết" },
  { value: "category", label: "Danh mục" },
  { value: "template", label: "Mẫu đề" },
  { value: "setting", label: "Cài đặt" },
  { value: "session", label: "Phiên đăng nhập" },
];

function actionColor(action: string): { bg: string; text: string } {
  if (action.includes("delete") || action.includes("reject") || action.includes("lock")) {
    return { bg: "#FEF2F2", text: "#DC2626" };
  }
  if (action.includes("approve") || action.includes("unlock") || action.includes("activate") || action.includes("create")) {
    return { bg: "#ECFDF5", text: "#059669" };
  }
  if (action.includes("update") || action.includes("assign")) {
    return { bg: "#EFF6FF", text: "#2563EB" };
  }
  return { bg: "#F1F5F9", text: "#475569" };
}

function statusColor(code: number | null): string {
  if (code == null) return "#94A3B8";
  if (code >= 500) return "#DC2626";
  if (code >= 400) return "#F59E0B";
  return "#059669";
}

export function AdminAuditLogPage() {
  usePageTitle(PAGE_TITLES.ADMIN_DASHBOARD);

  const [logs, setLogs] = useState<AdminActivityLogItem[]>([]);
  const [stats, setStats] = useState<AdminActivityLogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [entityType, setEntityType] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [logRes, statRes] = await Promise.all([
        adminApi.getActivityLogs({
          search: search || undefined,
          entity_type: entityType || undefined,
          page,
          per_page: 25,
        }),
        adminApi.getActivityLogStats(),
      ]);

      const raw = logRes as { data?: AdminActivityLogItem[]; current_page?: number; last_page?: number; total?: number } | AdminActivityLogItem[];
      if (Array.isArray(raw)) {
        setLogs(raw);
        setLastPage(1);
        setTotal(raw.length);
      } else {
        setLogs(raw.data ?? []);
        setLastPage(raw.last_page ?? 1);
        setTotal(raw.total ?? (raw.data?.length ?? 0));
      }
      setStats(statRes as AdminActivityLogStats);
    } catch {
      setError("Không tải được nhật ký audit.");
    } finally {
      setLoading(false);
    }
  }, [search, entityType, page]);

  useEffect(() => {
    load();
  }, [load]);

  const summaryCards = useMemo(
    () => [
      { label: "Tổng thao tác", value: stats?.total ?? 0, icon: Activity, color: "#1E40AF", bg: "#EFF6FF" },
      { label: "7 ngày gần đây", value: stats?.last_7_days ?? 0, icon: ShieldCheck, color: "#059669", bg: "#ECFDF5" },
      { label: "Lỗi (≥400)", value: stats?.errors ?? 0, icon: AlertTriangle, color: "#DC2626", bg: "#FEF2F2" },
    ],
    [stats]
  );

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const fmtTime = (s: string | null) => {
    if (!s) return "—";
    try {
      return new Date(s).toLocaleString("vi-VN", { hour12: false });
    } catch {
      return s;
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6" style={{ color: "#1E40AF" }} />
            <h1 className="text-2xl font-bold" style={{ color: "#1E3A8A" }}>
              Nhật ký Audit
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi mọi thao tác thay đổi của quản trị viên — nguồn: /admin/activity-logs
          </p>
        </div>
        <button
          onClick={() => load()}
          className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Tải lại
        </button>
      </div>

      {/* Summary cards */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-slate-200 bg-white p-5"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: c.bg }}>
              <c.icon className="h-4.5 w-4.5" style={{ color: c.color }} />
            </div>
            <p className="text-3xl font-extrabold leading-none" style={{ color: "#0F172A" }}>
              {c.value.toLocaleString("vi-VN")}
            </p>
            <p className="mt-1.5 text-xs text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <form
        onSubmit={onSearchSubmit}
        className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo action, path, mô tả..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-slate-800 transition-colors duration-150 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={entityType}
          onChange={(e) => {
            setEntityType(e.target.value);
            setPage(1);
          }}
          className="cursor-pointer rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 transition-colors duration-150 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          {ENTITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="cursor-pointer rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150"
          style={{ background: "#1E40AF" }}
        >
          Lọc
        </button>
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <AdminTableSkeleton rows={7} cols={5} />
        ) : error ? (
          <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">{error}</div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <Activity className="h-10 w-10 text-slate-200" />
            <p className="text-sm text-slate-500">Chưa có thao tác nào được ghi nhận.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500" style={{ background: "#F8FAFC" }}>
                  <th className="px-4 py-3 font-semibold">Thời gian</th>
                  <th className="px-4 py-3 font-semibold">Quản trị viên</th>
                  <th className="px-4 py-3 font-semibold">Hành động</th>
                  <th className="px-4 py-3 font-semibold">Đối tượng</th>
                  <th className="px-4 py-3 font-semibold">Request</th>
                  <th className="px-4 py-3 font-semibold">IP</th>
                  <th className="px-4 py-3 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const ac = actionColor(log.action);
                  return (
                    <tr key={log.id} className="border-b border-slate-100 transition-colors duration-150 hover:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500">{fmtTime(log.created_at)}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 text-slate-800">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: "#EFF6FF" }}>
                            <UserIcon className="h-3.5 w-3.5" style={{ color: "#1E40AF" }} />
                          </span>
                          {log.admin_name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-md px-2 py-1 text-xs font-semibold" style={{ background: ac.bg, color: ac.text }}>
                          {log.action}
                        </span>
                        {log.detail && log.detail !== log.action && (
                          <p className="mt-1 max-w-xs truncate text-xs text-slate-400">{log.detail}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {log.entity_type ? (
                          <span>
                            {log.entity_type}
                            {log.entity_id != null && <span className="text-slate-400"> #{log.entity_id}</span>}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">{log.method}</span> {log.path}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{log.ip ?? "—"}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold" style={{ color: statusColor(log.status_code) }}>
                          {log.status_code ?? "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && logs.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Trang {page}/{lastPage} · Tổng {total.toLocaleString("vi-VN")} bản ghi
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" /> Trước
            </button>
            <button
              disabled={page >= lastPage}
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
