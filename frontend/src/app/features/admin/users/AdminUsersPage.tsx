import { useEffect, useMemo, useState } from "react";
import { Lock, Search, Shield, Unlock, Users, Trash2, UserCog, X, CheckSquare, Square } from "lucide-react";
import { adminApi, AdminUser } from "@/services/adminApi";
import { AdminTableSkeleton } from "../components/AdminPageSkeleton";

type RoleFilter = "all" | "student" | "teacher" | "admin";
type StatusFilter = "all" | "active" | "inactive";
type BulkAction = "lock" | "unlock" | "delete" | "change_role";

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

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [pendingAction, setPendingAction] = useState<BulkAction | null>(null);
  const [pendingRole, setPendingRole] = useState<"student" | "teacher" | "admin">("student");

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
      setSelectedIds(new Set()); // reset selection on reload
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

  const allFilteredIds = useMemo(() => filtered.map(displayId).filter(Boolean) as number[], [filtered]);
  const allSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedIds.has(id));
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allFilteredIds));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

  const runBulkAction = async () => {
    if (!pendingAction || selectedIds.size === 0) return;
    const userIds = Array.from(selectedIds);
    const confirmMsg =
      pendingAction === "delete"
        ? `Xoá ${userIds.length} người dùng đã chọn? Hành động không thể hoàn tác.`
        : pendingAction === "change_role"
        ? `Đổi ${userIds.length} người dùng sang vai trò "${pendingRole}"?`
        : `Xác nhận thao tác ${pendingAction} cho ${userIds.length} người dùng?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      setBulkBusy(true);
      setBulkResult(null);
      const res = await adminApi.bulkUserAction({
        action: pendingAction,
        user_ids: userIds,
        role: pendingAction === "change_role" ? pendingRole : undefined,
      });
      const changed = res?.changed ?? 0;
      const skipped = res?.skipped?.length ?? 0;
      setBulkResult({
        ok: true,
        msg: `Đã xử lý ${changed} user${skipped > 0 ? `, bỏ qua ${skipped}` : ""}.`,
      });
      setPendingAction(null);
      await loadUsers();
    } catch (e) {
      setBulkResult({ ok: false, msg: "Thao tác hàng loạt thất bại." });
    } finally {
      setBulkBusy(false);
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
          className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
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
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as RoleFilter)}
            className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 outline-none transition-colors focus:border-blue-500"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 outline-none transition-colors focus:border-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* ── Bulk action toolbar (chỉ hiện khi có selection) ── */}
      {selectedIds.size > 0 && (
        <div
          className="mb-3 flex flex-wrap items-center gap-3 rounded-xl border-2 px-4 py-3"
          style={{ background: "#EFF6FF", borderColor: "#BFDBFE" }}
        >
          <span className="text-sm font-semibold" style={{ color: "#1E40AF" }}>
            Đã chọn {selectedIds.size} người dùng
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setPendingAction("lock")}
              disabled={bulkBusy}
              className="flex cursor-pointer items-center gap-1 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-200 disabled:opacity-60"
            >
              <Lock className="h-3.5 w-3.5" /> Khoá
            </button>
            <button
              onClick={() => setPendingAction("unlock")}
              disabled={bulkBusy}
              className="flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-200 disabled:opacity-60"
            >
              <Unlock className="h-3.5 w-3.5" /> Mở khoá
            </button>
            <button
              onClick={() => setPendingAction("change_role")}
              disabled={bulkBusy}
              className="flex cursor-pointer items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200 disabled:opacity-60"
            >
              <UserCog className="h-3.5 w-3.5" /> Đổi vai trò
            </button>
            <button
              onClick={() => setPendingAction("delete")}
              disabled={bulkBusy}
              className="flex cursor-pointer items-center gap-1 rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-200 disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" /> Xoá
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="ml-2 flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-slate-500 hover:bg-white"
            >
              <X className="h-3.5 w-3.5" /> Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* ── Confirm panel cho bulk action đang chờ ── */}
      {pendingAction && (
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <span className="text-sm font-semibold text-amber-800">
            Xác nhận: {pendingAction.replace("_", " ")} cho {selectedIds.size} user
          </span>
          {pendingAction === "change_role" && (
            <select
              value={pendingRole}
              onChange={(e) => setPendingRole(e.target.value as "student" | "teacher" | "admin")}
              className="cursor-pointer rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm"
            >
              <option value="student">student</option>
              <option value="teacher">teacher</option>
              <option value="admin">admin</option>
            </select>
          )}
          <button
            onClick={runBulkAction}
            disabled={bulkBusy}
            className="cursor-pointer rounded-lg bg-amber-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
          >
            {bulkBusy ? "Đang xử lý..." : "Xác nhận"}
          </button>
          <button
            onClick={() => setPendingAction(null)}
            disabled={bulkBusy}
            className="cursor-pointer rounded-lg px-3 py-1.5 text-sm text-amber-700 hover:bg-amber-100"
          >
            Huỷ
          </button>
        </div>
      )}

      {bulkResult && (
        <div
          className={`mb-3 rounded-lg px-4 py-2 text-sm ${
            bulkResult.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {bulkResult.msg}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <AdminTableSkeleton rows={8} cols={6} />
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : (
          <table className="w-full min-w-[860px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="w-10 px-4 py-3">
                  <button
                    onClick={toggleSelectAll}
                    aria-label="Chọn tất cả"
                    className="cursor-pointer text-slate-500 hover:text-blue-600"
                  >
                    {allSelected ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : someSelected ? (
                      <CheckSquare className="h-4 w-4 opacity-60" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
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
                const checked = selectedIds.has(id);
                return (
                  <tr
                    key={id}
                    className={`border-t border-slate-100 transition-colors ${
                      checked ? "bg-blue-50/40" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleSelectOne(id)}
                        aria-label={`Chọn user ${id}`}
                        className="cursor-pointer text-slate-500 hover:text-blue-600"
                      >
                        {checked ? <CheckSquare className="h-4 w-4 text-blue-600" /> : <Square className="h-4 w-4" />}
                      </button>
                    </td>
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
                        className={`inline-flex cursor-pointer items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
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
