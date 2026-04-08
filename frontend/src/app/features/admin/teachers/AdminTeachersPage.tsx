import { useEffect, useMemo, useState } from "react";
import { UserPlus, Users } from "lucide-react";
import { adminApi, AdminUser } from "@/services/adminApi";

export function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getUsers({ role: "teacher" });
      setTeachers(data);
    } catch {
      setError("Không tải được danh sách giáo viên.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const activeCount = useMemo(() => teachers.filter((t) => (t.uStatus || t.status) === "active").length, [teachers]);

  const onCreate = async () => {
    if (!name || !phone || !password) return;
    try {
      setCreating(true);
      await adminApi.createUser({ name, phone, password, role: "teacher", status: "active" });
      setName("");
      setPhone("");
      setPassword("");
      await load();
    } catch {
      setError("Tạo giáo viên thất bại.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý giáo viên</h1>
          <p className="text-sm text-slate-500">Danh sách và tạo tài khoản giáo viên</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">
          {activeCount}/{teachers.length} đang hoạt động
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-800">Tạo giáo viên mới</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên giáo viên"
            className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Số điện thoại"
            className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            type="password"
            className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
          />
          <button
            onClick={onCreate}
            disabled={creating}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <UserPlus className="h-4 w-4" />
            {creating ? "Đang tạo..." : "Tạo giáo viên"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : (
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
        )}
      </div>

      {!loading && !error && teachers.length === 0 && (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
          <Users className="mx-auto mb-2 h-5 w-5" />
          Chưa có giáo viên nào.
        </div>
      )}
    </div>
  );
}

