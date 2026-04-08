import { useEffect, useMemo, useState } from "react";
import { Lock, Search, Shield, Unlock, Users } from "lucide-react";
import { adminApi, AdminUser } from "@/services/adminApi";

type RoleFilter = "all" | "student" | "teacher" | "admin";
type StatusFilter = "all" | "active" | "inactive";

function displayName(user: AdminUser) {
  return user.uName || user.name || "N/A";
}

function displayPhone(user: AdminUser) {
  return user.uPhone || user.phone || "N/A";
}

function displayRole(user: AdminUser) {
  return user.uRole || user.role || "student";
}

function displayStatus(user: AdminUser) {
  return user.uStatus || user.status || "inactive";
}

function displayId(user: AdminUser) {
  return user.uId || user.id || 0;
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getUsers({
        search: search || undefined,
        role: role === "all" ? undefined : role,
        status: status === "all" ? undefined : status,
      });
      setUsers(data);
    } catch {
      setError("Không tải được danh sách học viên.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const bySearch =
        !q ||
        displayName(u).toLowerCase().includes(q) ||
        displayPhone(u).toLowerCase().includes(q);
      const byRole = role === "all" || displayRole(u) === role;
      const byStatus = status === "all" || displayStatus(u) === status;
      return bySearch && byRole && byStatus;
    });
  }, [users, search, role, status]);

  const totals = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => displayStatus(u) === "active").length;
    const locked = users.filter((u) => displayStatus(u) === "inactive").length;
    return { total, active, locked };
  }, [users]);

  const onToggleLock = async (user: AdminUser) => {
    const id = displayId(user);
    if (!id) return;
    try {
      setBusyId(id);
      if (displayStatus(user) === "active") {
        await adminApi.lockUser(id);
      } else {
        await adminApi.unlockUser(id);
      }
      await loadUsers();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý học viên</h1>
          <p className="text-sm text-slate-500">Danh sách tài khoản trong hệ thống admin</p>
        </div>
        <button
          onClick={loadUsers}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Tải lại
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <Users className="h-4 w-4" /> Tổng user
          </div>
          <p className="text-2xl font-bold text-slate-900">{totals.total}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-emerald-700">
            <Shield className="h-4 w-4" /> Đang hoạt động
          </div>
          <p className="text-2xl font-bold text-emerald-700">{totals.active}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-amber-700">
            <Lock className="h-4 w-4" /> Đã khóa
          </div>
          <p className="text-2xl font-bold text-amber-700">{totals.locked}</p>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, số điện thoại..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as RoleFilter)}
            className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : (
          <table className="w-full min-w-[860px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Điện thoại</th>
                <th className="px-4 py-3">Vai trò</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const id = displayId(u);
                const isActive = displayStatus(u) === "active";
                return (
                  <tr key={id} className="border-t border-slate-100">
                    <td className="px-4 py-3 text-sm text-slate-700">{id}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{displayName(u)}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{displayPhone(u)}</td>
                    <td className="px-4 py-3 text-sm capitalize text-slate-700">{displayRole(u)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isActive ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onToggleLock(u)}
                        disabled={busyId === id}
                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium ${
                          isActive
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        } disabled:opacity-60`}
                      >
                        {isActive ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                        {busyId === id ? "Đang xử lý..." : isActive ? "Khóa" : "Mở khóa"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

