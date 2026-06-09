import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  UserPlus, Users, Search, GraduationCap, Phone,
  CheckCircle2, XCircle, Lock, Unlock,
  RefreshCw, ChevronDown, Eye, EyeOff,
  AlertCircle, Check, X,
} from "lucide-react";
import { adminApi, AdminUser } from "@/services/adminApi";
import { AdminTableSkeleton } from "../components/AdminPageSkeleton";

/* ── helpers ── */
function initials(name: string) {
  return name.split(" ").slice(-2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "GV";
}

const GRADIENTS = [
  "linear-gradient(135deg,#2563EB,#7C3AED)",
  "linear-gradient(135deg,#0D9488,#2563EB)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#10B981,#0284C7)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
];
const pickGradient = (id: number) => GRADIENTS[id % GRADIENTS.length];

const COOLDOWN_MS = 5 * 60 * 1000;
function fmtCooldown(ms: number) {
  const s = Math.ceil(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function ConfirmLockModal({ teacher, onConfirm, onCancel }: { teacher: AdminUser; onConfirm: () => void; onCancel: () => void }) {
  const name = teacher.uName ?? teacher.name ?? "giáo viên này";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(2px)" }}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.18)", border: "1px solid #E2E8F0" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0" style={{ background: "#FEF2F2" }}>
            <Lock className="h-5 w-5" style={{ color: "#EF4444" }} />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Xác nhận khoá tài khoản</p>
            <p style={{ fontSize: 12, color: "#94A3B8" }}>Hành động này sẽ chặn đăng nhập</p>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.65, marginBottom: 14 }}>
          Bạn có chắc muốn khoá tài khoản <strong style={{ color: "#0F172A" }}>{name}</strong>?
          Giáo viên sẽ <strong>không thể đăng nhập</strong> cho đến khi được mở khoá.
        </p>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-5" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
          <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full" style={{ background: "#F59E0B" }} />
          <p style={{ fontSize: 11, color: "#92400E" }}>Sau khi khoá, cần chờ <strong>5 phút</strong> trước khi khoá lại tài khoản này.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 rounded-xl py-2.5 transition-all"
            style={{ fontSize: 13, fontWeight: 500, background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#374151" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#F1F5F9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#F8FAFC"; }}>
            Huỷ bỏ
          </button>
          <button onClick={onConfirm}
            className="flex-1 rounded-xl py-2.5 transition-all flex items-center justify-center gap-2"
            style={{ fontSize: 13, fontWeight: 600, background: "#EF4444", color: "#FFF" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#DC2626"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#EF4444"; }}>
            <Lock className="h-3.5 w-3.5" /> Khoá tài khoản
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ msg, type }: { msg: string; type: "ok" | "err" }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl px-4 py-3 shadow-lg"
      style={{ background: type === "ok" ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${type === "ok" ? "#BBF7D0" : "#FECACA"}` }}>
      {type === "ok" ? <Check className="h-4 w-4" style={{ color: "#10B981" }} /> : <AlertCircle className="h-4 w-4" style={{ color: "#EF4444" }} />}
      <span style={{ fontSize: 13, fontWeight: 500, color: type === "ok" ? "#065F46" : "#991B1B" }}>{msg}</span>
    </div>
  );
}

export function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<AdminUser[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState<"all" | "active" | "inactive">("all");
  const [showCreate, setShowCreate] = useState(false);

  /* create form */
  const [cName, setCName]         = useState("");
  const [cPhone, setCPhone]       = useState("");
  const [cPass, setCPass]         = useState("");
  const [cStatus, setCStatus]     = useState<"active" | "inactive">("active");
  const [showPass, setShowPass]   = useState(false);
  const [creating, setCreating]   = useState(false);
  const [modalDone, setModalDone] = useState(false);

  const resetModal = () => { setCName(""); setCPhone(""); setCPass(""); setCStatus("active"); setModalDone(false); setShowCreate(false); };

  /* lock / unlock */
  const [lockingId, setLockingId]     = useState<number | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<AdminUser | null>(null);
  const [lockHistory, setLockHistory] = useState<Record<number, number>>({});
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const getCooldownMs = (id: number) => {
    const ts = lockHistory[id];
    if (!ts) return 0;
    return Math.max(0, COOLDOWN_MS - (now - ts));
  };

  /* toast */
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((msg: string, type: "ok" | "err") => {
    setToast({ msg, type });
    if (toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getUsers({ role: "teacher" });
      setTeachers(data);
    } catch {
      showToast("Không tải được danh sách giáo viên", "err");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  /* stats */
  const total    = teachers.length;
  const active   = useMemo(() => teachers.filter((t) => (t.uStatus || t.status) === "active").length, [teachers]);
  const inactive = total - active;

  /* filtered list */
  const displayed = useMemo(() => {
    const q = search.toLowerCase();
    return teachers.filter((t) => {
      const name  = (t.uName  || t.name  || "").toLowerCase();
      const phone = (t.uPhone || t.phone || "").toLowerCase();
      const st    = t.uStatus || t.status || "inactive";
      const matchSearch = !q || name.includes(q) || phone.includes(q);
      const matchFilter = filter === "all" || st === filter;
      return matchSearch && matchFilter;
    });
  }, [teachers, search, filter]);

  /* create */
  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim() || !cPhone.trim() || !cPass.trim()) {
      showToast("Vui lòng nhập đầy đủ thông tin", "err"); return;
    }
    setCreating(true);
    try {
      await adminApi.createUser({ name: cName.trim(), phone: cPhone.trim(), password: cPass, role: "teacher", status: cStatus });
      setModalDone(true);
      await load();
    } catch {
      showToast("Tạo giáo viên thất bại", "err");
    } finally {
      setCreating(false);
    }
  };

  /* lock / unlock */
  const executeLock = async (t: AdminUser, action: "lock" | "unlock") => {
    const id = t.uId ?? t.id ?? 0;
    setConfirmTarget(null);
    setLockingId(id);
    try {
      if (action === "lock") {
        await adminApi.lockUser(id);
        setLockHistory((prev) => ({ ...prev, [id]: Date.now() }));
        showToast("Đã khoá tài khoản — giáo viên không thể đăng nhập", "ok");
      } else {
        await adminApi.unlockUser(id);
        showToast("Đã mở khoá tài khoản", "ok");
      }
      setTeachers((prev) => prev.map((x) => {
        const xid = x.uId ?? x.id;
        if (xid !== id) return x;
        const newSt: "active" | "inactive" = action === "lock" ? "inactive" : "active";
        return { ...x, uStatus: newSt, status: newSt };
      }));
    } catch {
      showToast("Thao tác thất bại", "err");
    } finally {
      setLockingId(null);
    }
  };

  const handleLockBtn = (t: AdminUser) => {
    const id  = t.uId ?? t.id ?? 0;
    const st  = t.uStatus ?? t.status ?? "inactive";
    if (st !== "active") {
      executeLock(t, "unlock");
      return;
    }
    const rem = getCooldownMs(id);
    if (rem > 0) {
      showToast(`Cần chờ thêm ${fmtCooldown(rem)} để khoá lại tài khoản này`, "err");
      return;
    }
    setConfirmTarget(t);
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>

      {/* ── Header ── */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500, marginBottom: 2 }}>QUẢN LÝ HỆ THỐNG</p>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>Giáo viên</h1>
          <p style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>Danh sách và quản lý tài khoản giáo viên</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all"
          style={{ background: "#0F172A", color: "#F8FAFC", fontSize: 13, fontWeight: 600 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#1E293B"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#0F172A"; }}>
          <UserPlus className="h-4 w-4" /> Thêm giáo viên
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="mb-5 grid grid-cols-3 gap-4">
        {[
          { label: "Tổng giáo viên", value: total,    icon: Users,          color: "#2563EB", bg: "#EFF6FF",  border: "#BFDBFE" },
          { label: "Đang hoạt động", value: active,   icon: CheckCircle2,   color: "#10B981", bg: "#ECFDF5",  border: "#A7F3D0" },
          { label: "Không hoạt động", value: inactive, icon: XCircle,       color: "#F59E0B", bg: "#FFFBEB",  border: "#FDE68A" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5"
            style={{ border: `1px solid ${s.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: s.bg }}>
                <s.icon className="h-4 w-4" style={{ color: s.color }} />
              </div>
              <div className="h-2 w-2 rounded-full" style={{ background: s.color, opacity: 0.4, marginTop: 4 }} />
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Create teacher modal ── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(3px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) resetModal(); }}>
          <div className="w-full max-w-xl rounded-2xl overflow-hidden" style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.25)", border: "1px solid #E2E8F0" }}>

            {/* Modal header — dark */}
            <div className="flex items-center justify-between px-6 py-4" style={{ background: "#0F172A" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <UserPlus className="h-4 w-4" style={{ color: "#94A3B8" }} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC" }}>Thêm giáo viên mới</p>
                  <p style={{ fontSize: 11, color: "#64748B" }}>Tạo tài khoản và cấp quyền truy cập</p>
                </div>
              </div>
              <button onClick={resetModal} className="flex h-7 w-7 items-center justify-center rounded-lg transition-all"
                style={{ color: "#64748B" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#F8FAFC"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748B"; }}>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="bg-white p-6">
              {modalDone ? (
                <div className="flex flex-col items-center text-center py-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-4" style={{ background: "#ECFDF5" }}>
                    <CheckCircle2 className="h-7 w-7" style={{ color: "#10B981" }} />
                  </div>
                  <p style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>Tạo tài khoản thành công!</p>
                  <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>
                    Giáo viên <strong style={{ color: "#0F172A" }}>{cName}</strong> đã được tạo và có thể đăng nhập ngay.
                  </p>
                  <div className="mt-5 flex gap-3">
                    <button onClick={() => { setModalDone(false); setCName(""); setCPhone(""); setCPass(""); setCStatus("active"); }}
                      className="flex items-center gap-2 rounded-xl px-5 py-2.5"
                      style={{ background: "#0F172A", color: "#FFF", fontSize: 13, fontWeight: 600 }}>
                      <UserPlus className="h-4 w-4" /> Tạo thêm
                    </button>
                    <button onClick={resetModal}
                      className="flex items-center gap-2 rounded-xl px-5 py-2.5"
                      style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", fontSize: 13, fontWeight: 500, color: "#374151" }}>
                      Đóng
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={onCreate} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Tên giáo viên <span style={{ color: "#EF4444" }}>*</span></label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "#94A3B8" }} />
                      <input value={cName} onChange={(e) => setCName(e.target.value)} placeholder="Nguyễn Văn A"
                        className="w-full rounded-xl pl-10 pr-4 py-2.5 outline-none transition-all"
                        style={{ fontSize: 14, color: "#0F172A", background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                        onFocus={(e) => { e.target.style.borderColor = "#2563EB"; e.target.style.background = "#EFF6FF"; }}
                        onBlur={(e) =>  { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#F8FAFC"; }} />
                    </div>
                  </div>
                  {/* Phone */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Số điện thoại <span style={{ color: "#EF4444" }}>*</span></label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "#94A3B8" }} />
                      <input value={cPhone} onChange={(e) => setCPhone(e.target.value)} placeholder="0900 000 000"
                        className="w-full rounded-xl pl-10 pr-4 py-2.5 outline-none transition-all"
                        style={{ fontSize: 14, color: "#0F172A", background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                        onFocus={(e) => { e.target.style.borderColor = "#2563EB"; e.target.style.background = "#EFF6FF"; }}
                        onBlur={(e) =>  { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#F8FAFC"; }} />
                    </div>
                  </div>
                  {/* Password */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Mật khẩu <span style={{ color: "#EF4444" }}>*</span></label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "#94A3B8" }} />
                      <input type={showPass ? "text" : "password"} value={cPass} onChange={(e) => setCPass(e.target.value)} placeholder="Tối thiểu 6 ký tự"
                        className="w-full rounded-xl pl-10 pr-10 py-2.5 outline-none transition-all"
                        style={{ fontSize: 14, color: "#0F172A", background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                        onFocus={(e) => { e.target.style.borderColor = "#2563EB"; e.target.style.background = "#EFF6FF"; }}
                        onBlur={(e) =>  { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#F8FAFC"; }} />
                      <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2">
                        {showPass ? <EyeOff className="h-4 w-4" style={{ color: "#94A3B8" }} /> : <Eye className="h-4 w-4" style={{ color: "#94A3B8" }} />}
                      </button>
                    </div>
                  </div>
                  {/* Status */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Trạng thái ban đầu</label>
                    <div className="flex gap-2">
                      {(["active", "inactive"] as const).map((s) => (
                        <button key={s} type="button" onClick={() => setCStatus(s)}
                          className="flex items-center gap-2 rounded-xl px-4 py-2 flex-1 transition-all"
                          style={{ border: `1px solid ${cStatus === s ? (s === "active" ? "#A7F3D0" : "#FECACA") : "#E2E8F0"}`, background: cStatus === s ? (s === "active" ? "#ECFDF5" : "#FEF2F2") : "#F8FAFC", fontSize: 13, fontWeight: cStatus === s ? 600 : 400, color: cStatus === s ? (s === "active" ? "#065F46" : "#991B1B") : "#64748B" }}>
                          <div className="h-2 w-2 rounded-full" style={{ background: s === "active" ? "#10B981" : "#EF4444" }} />
                          {s === "active" ? "Hoạt động ngay" : "Khoá ban đầu"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Footer */}
                  <div className="flex justify-end gap-2 pt-2" style={{ borderTop: "1px solid #F1F5F9", marginTop: 8, paddingTop: 16 }}>
                    <button type="button" onClick={resetModal}
                      className="rounded-xl px-5 py-2.5 transition-all"
                      style={{ fontSize: 13, fontWeight: 500, background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#374151" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#F1F5F9"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#F8FAFC"; }}>
                      Huỷ
                    </button>
                    <button type="submit" disabled={creating}
                      className="flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all"
                      style={{ background: "#0F172A", color: "#FFF", fontSize: 13, fontWeight: 600, opacity: creating ? 0.7 : 1 }}
                      onMouseEnter={(e) => { if (!creating) e.currentTarget.style.background = "#1E293B"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#0F172A"; }}>
                      {creating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
                      {creating ? "Đang tạo..." : "Tạo tài khoản"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Search + filter ── */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#94A3B8" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc số điện thoại..."
            className="w-full rounded-xl py-2.5 pl-9 pr-4 outline-none transition-all"
            style={{ fontSize: 13, background: "#FFF", border: "1px solid #E2E8F0", color: "#0F172A" }}
            onFocus={(e) => { e.target.style.borderColor = "#0F172A"; }}
            onBlur={(e) =>  { e.target.style.borderColor = "#E2E8F0"; }} />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: "#FFF", border: "1px solid #E2E8F0" }}>
          {(["all", "active", "inactive"] as const).map((f) => {
            const labels = { all: "Tất cả", active: "Hoạt động", inactive: "Khoá" };
            return (
              <button key={f} onClick={() => setFilter(f)}
                className="rounded-lg px-3 py-1.5 transition-all"
                style={{
                  fontSize: 12, fontWeight: filter === f ? 600 : 400,
                  background: filter === f ? "#0F172A" : "transparent",
                  color: filter === f ? "#FFF" : "#64748B",
                }}>
                {labels[f]}
              </button>
            );
          })}
        </div>

        <button onClick={load} disabled={loading}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 transition-all"
          style={{ background: "#FFF", border: "1px solid #E2E8F0", fontSize: 12, color: "#64748B" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFC"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#FFF"; }}>
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </button>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        {/* Table header */}
        <div className="grid px-5 py-3"
          style={{ gridTemplateColumns: "40px 1fr 140px 100px 100px", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
          {["#", "Giáo viên", "Số điện thoại", "Trạng thái", "Thao tác"].map((h) => (
            <span key={h} style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <AdminTableSkeleton rows={7} cols={5} />
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <Users className="h-6 w-6" style={{ color: "#CBD5E1" }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#64748B" }}>
              {search || filter !== "all" ? "Không tìm thấy kết quả phù hợp" : "Chưa có giáo viên nào"}
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "#F8FAFC" }}>
            {displayed.map((t) => {
              const id     = t.uId ?? t.id ?? 0;
              const name   = t.uName ?? t.name ?? "";
              const phone  = t.uPhone ?? t.phone ?? "";
              const status = t.uStatus ?? t.status ?? "inactive";
              const isLocking = lockingId === id;
              const createdAt = t.uCreated_at ?? t.created_at ?? null;

              return (
                <div key={id} className="grid items-center px-5 py-3.5 transition-all"
                  style={{ gridTemplateColumns: "40px 1fr 140px 100px 100px" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFC"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>

                  {/* # */}
                  <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>#{id}</span>

                  {/* Name + avatar */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-white text-xs font-bold"
                      style={{ background: pickGradient(id) }}>
                      {initials(name)}
                    </div>
                    <div className="min-w-0">
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }} className="truncate">{name || "—"}</p>
                      {createdAt && (
                        <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
                          Tham gia {new Date(createdAt).toLocaleDateString("vi-VN")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <span style={{ fontSize: 13, color: "#374151" }}>{phone || "—"}</span>

                  {/* Status badge */}
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
                      style={{
                        fontSize: 11, fontWeight: 600,
                        background: status === "active" ? "#ECFDF5" : "#FEF2F2",
                        color:      status === "active" ? "#065F46"  : "#991B1B",
                        border:     `1px solid ${status === "active" ? "#A7F3D0" : "#FECACA"}`,
                      }}>
                      <div className="h-1.5 w-1.5 rounded-full"
                        style={{ background: status === "active" ? "#10B981" : "#EF4444" }} />
                      {status === "active" ? "Hoạt động" : "Khoá"}
                    </span>
                  </div>

                  {/* Actions */}
                  {(() => {
                    const cooldownMs = status === "active" ? getCooldownMs(id) : 0;
                    const inCooldown = cooldownMs > 0;
                    const isWaiting  = isLocking;
                    const disabled   = isWaiting || inCooldown;
                    const isUnlock   = status !== "active";
                    const btnBg    = isUnlock ? "#ECFDF5" : inCooldown ? "#F8FAFC" : "#FEF2F2";
                    const btnColor = isUnlock ? "#10B981" : inCooldown ? "#94A3B8" : "#EF4444";
                    const btnBorder = isUnlock ? "#A7F3D0" : inCooldown ? "#E2E8F0" : "#FECACA";
                    return (
                      <div>
                        <button onClick={() => handleLockBtn(t)} disabled={disabled}
                          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all"
                          style={{ fontSize: 11, fontWeight: 500, background: btnBg, color: btnColor, border: `1px solid ${btnBorder}`, opacity: isWaiting ? 0.6 : 1, cursor: inCooldown ? "not-allowed" : "pointer" }}
                          onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = isUnlock ? "#10B981" : "#EF4444"; e.currentTarget.style.color = "#FFF"; } }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = btnBg; e.currentTarget.style.color = btnColor; }}>
                          {isWaiting
                            ? <RefreshCw className="h-3 w-3 animate-spin" />
                            : isUnlock ? <Unlock className="h-3 w-3" />
                            : inCooldown ? <RefreshCw className="h-3 w-3" />
                            : <Lock className="h-3 w-3" />}
                          {isWaiting ? "..." : isUnlock ? "Mở khoá" : inCooldown ? fmtCooldown(cooldownMs) : "Khoá"}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {!loading && displayed.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid #F1F5F9" }}>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>
              Hiển thị <strong style={{ color: "#0F172A" }}>{displayed.length}</strong> / {total} giáo viên
            </span>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              <span style={{ fontSize: 11, color: "#94A3B8" }}>{active} đang hoạt động</span>
            </div>
          </div>
        )}
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {confirmTarget && (
        <ConfirmLockModal
          teacher={confirmTarget}
          onConfirm={() => executeLock(confirmTarget, "lock")}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </div>
  );
}

