import { useEffect, useMemo, useState } from "react";
import { adminApi, AdminUser } from "@/services/adminApi";

export function AdminTeachersReportPage() {
  const [teachers, setTeachers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const users = await adminApi.getUsers({ role: "teacher" });
      setTeachers(users);
    } catch {
      setError("Không tải được báo cáo giáo viên.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const total = teachers.length;
    const active = teachers.filter((u) => (u.uStatus || u.status) === "active").length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [teachers]);

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Báo cáo giáo viên</h1>
        <p className="text-sm text-slate-500">Tổng hợp trạng thái tài khoản giáo viên</p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">{error}</div>
      ) : (
        <>
          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Stat label="Tổng giáo viên" value={stats.total} />
            <Stat label="Đang hoạt động" value={stats.active} />
            <Stat label="Đã khóa" value={stats.inactive} />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[760px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Tên</th>
                  <th className="px-4 py-3">SĐT</th>
                  <th className="px-4 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => {
                  const status = t.uStatus || t.status || "inactive";
                  return (
                    <tr key={t.uId || t.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 text-sm text-slate-700">{t.uId || t.id}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{t.uName || t.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{t.uPhone || t.phone}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

