import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, RefreshCw, Search, ShieldAlert } from "lucide-react";
import { adminApi, type AdminStudentComplaintItem } from "@/services/adminApi";
import { AdminTableSkeleton } from "../components/AdminPageSkeleton";

export function AdminStudentComplaintsPage() {
  const [items, setItems] = useState<AdminStudentComplaintItem[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminApi.getStudentComplaints({ search: search || undefined });
      setSummary(result.summary);
      setItems(result.items);
    } catch {
      setError("Không tải được danh sách khiếu nại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const values = [item.student.name || "", item.student.phone || "", item.student.address || "", item.note || ""];
      return values.some((v) => v.toLowerCase().includes(q));
    });
  }, [items, search]);

  const onResolve = async (studentId: number) => {
    try {
      setBusyId(studentId);
      setError(null);
      setSuccess(null);
      await adminApi.resolveStudentComplaint(studentId);
      setSuccess("Đã xử lý khiếu nại và mở lại tài khoản.");
      await load();
    } catch {
      setError("Xử lý khiếu nại thất bại.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Khiếu nại học viên</h1>
          <p className="text-sm text-slate-500">Theo dõi các yêu cầu mở lại tài khoản học viên</p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Tải lại
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatCard label="Tổng khiếu nại mở" value={summary.total_complaints || 0} />
        <StatCard label="Phát sinh 7 ngày gần nhất" value={summary.new_last_7_days || 0} />
      </div>

      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, SĐT, địa chỉ..."
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {success && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <div className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <AdminTableSkeleton rows={7} cols={5} />
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Không có khiếu nại nào cần xử lý.</div>
        ) : (
          <table className="w-full min-w-[920px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Mã KN</th>
                <th className="px-4 py-3">Học viên</th>
                <th className="px-4 py-3">SĐT</th>
                <th className="px-4 py-3">Nội dung</th>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.complaint_id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-sm text-slate-700">#{item.complaint_id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{item.student.name || "N/A"}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{item.student.phone}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{item.note || "Yêu cầu hỗ trợ tài khoản"}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {item.submitted_at ? new Date(item.submitted_at).toLocaleString("vi-VN") : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onResolve(item.student.id)}
                      disabled={busyId === item.student.id}
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      <ShieldAlert className="h-3.5 w-3.5" />
                      {busyId === item.student.id ? "Đang xử lý..." : "Đánh dấu đã xử lý"}
                    </button>
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

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
