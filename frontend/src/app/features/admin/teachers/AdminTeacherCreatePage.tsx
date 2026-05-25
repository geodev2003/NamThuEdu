import { useState } from "react";
import { useNavigate } from "react-router";
import {
  UserPlus, ArrowLeft, GraduationCap, Phone, Lock,
  Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw,
  Shield, Info,
} from "lucide-react";
import { adminApi } from "@/services/adminApi";

const GRADIENTS = [
  "linear-gradient(135deg,#2563EB,#7C3AED)",
  "linear-gradient(135deg,#0D9488,#2563EB)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#10B981,#0284C7)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
];

function initials(name: string) {
  return name.split(" ").slice(-2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "GV";
}

function Field({
  label, required, icon: Icon, children,
}: { label: string; required?: boolean; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}{required && <span style={{ color: "#EF4444", marginLeft: 3 }}>*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "#94A3B8" }} />
        {children}
      </div>
    </div>
  );
}

export function AdminTeacherCreatePage() {
  const navigate = useNavigate();
  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus]   = useState<"active" | "inactive">("active");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [done, setDone]       = useState(false);

  const gradientIdx = name.length % GRADIENTS.length;
  const avatarGrad  = GRADIENTS[gradientIdx];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ các trường bắt buộc."); return;
    }
    setLoading(true); setError(null);
    try {
      await adminApi.createUser({ name: name.trim(), phone: phone.trim(), password, role: "teacher", status });
      setDone(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Tạo giáo viên thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setName(""); setPhone(""); setPassword(""); setStatus("active"); setDone(false); setError(null); };

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>

      {/* ── Header ── */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500, marginBottom: 2 }}>QUẢN LÝ GIÁO VIÊN</p>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>Thêm giáo viên mới</h1>
          <p style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>Tạo tài khoản và cấp quyền truy cập hệ thống</p>
        </div>
        <button onClick={() => navigate("/admin/teachers")}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all"
          style={{ background: "#FFF", border: "1px solid #E2E8F0", fontSize: 13, fontWeight: 500, color: "#374151" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFC"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#FFF"; }}>
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </button>
      </div>

      <div className="grid grid-cols-12 gap-5 max-w-4xl">

        {/* ── Left: preview card ── */}
        <div className="col-span-4">
          <div className="rounded-2xl overflow-hidden sticky top-6"
            style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>

            {/* Dark admin-theme header panel */}
            <div className="px-5 pt-5 pb-6" style={{ background: "#0F172A" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <GraduationCap className="h-3.5 w-3.5" style={{ color: "#94A3B8" }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>Xem trước</span>
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-white text-lg font-bold"
                  style={{ background: avatarGrad, boxShadow: "0 4px 14px rgba(0,0,0,0.3)" }}>
                  {initials(name)}
                </div>
                <p className="mt-3 text-center truncate max-w-full px-2"
                  style={{ fontSize: 15, fontWeight: 700, color: name.trim() ? "#F8FAFC" : "#475569" }}>
                  {name.trim() || "Chưa nhập tên"}
                </p>
                <p style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{phone || "—"}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full"
                    style={{ background: status === "active" ? "#10B981" : "#EF4444" }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: status === "active" ? "#10B981" : "#EF4444" }}>
                    {status === "active" ? "Hoạt động" : "Khoá"}
                  </span>
                </div>
              </div>
            </div>

            {/* Info rows */}
            <div className="bg-white divide-y" style={{ borderColor: "#F1F5F9" }}>
              {[
                { icon: GraduationCap, label: "Vai trò",        val: "Giáo viên",     color: "#2563EB", bg: "#EFF6FF" },
                { icon: Shield,        label: "Quyền truy cập", val: "Teacher Portal", color: "#8B5CF6", bg: "#F5F3FF" },
              ].map(({ icon: Icon, label, val, color, bg }) => (
                <div key={label} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: bg }}>
                    <Icon className="h-3.5 w-3.5" style={{ color }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: "#94A3B8", fontWeight: 500 }}>{label}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{val}</p>
                  </div>
                </div>
              ))}

              {/* New user badge */}
              <div className="px-4 py-3">
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
                  style={{ fontSize: 11, fontWeight: 600, background: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A" }}>
                  <div className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                  Tài khoản mới
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: form ── */}
        <div className="col-span-8">

          {/* Success state */}
          {done ? (
            <div className="rounded-2xl bg-white p-8 flex flex-col items-center text-center"
              style={{ border: "1px solid #A7F3D0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-4" style={{ background: "#ECFDF5" }}>
                <CheckCircle2 className="h-7 w-7" style={{ color: "#10B981" }} />
              </div>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>Tạo tài khoản thành công!</p>
              <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>
                Giáo viên <strong style={{ color: "#0F172A" }}>{name}</strong> đã được tạo và có thể đăng nhập ngay.
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={reset}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5"
                  style={{ background: "#0F172A", color: "#FFF", fontSize: 13, fontWeight: 600 }}>
                  <UserPlus className="h-4 w-4" /> Tạo thêm
                </button>
                <button onClick={() => navigate("/admin/teachers")}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5"
                  style={{ background: "#FFF", border: "1px solid #E2E8F0", fontSize: 13, fontWeight: 500, color: "#374151" }}>
                  Xem danh sách
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white overflow-hidden"
              style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              {/* Card header */}
              <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: "1px solid #F1F5F9", borderLeft: "3px solid #2563EB" }}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "#EFF6FF" }}>
                  <GraduationCap className="h-4 w-4" style={{ color: "#2563EB" }} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Thông tin tài khoản</p>
                  <p style={{ fontSize: 11, color: "#94A3B8" }}>Điền đầy đủ để khởi tạo quyền truy cập</p>
                </div>
              </div>

              <form onSubmit={onSubmit} className="p-5 space-y-4">
                {/* Name */}
                <Field label="Tên giáo viên" required icon={GraduationCap}>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A"
                    className="w-full rounded-xl pl-10 pr-4 py-2.5 outline-none transition-all"
                    style={{ fontSize: 14, color: "#0F172A", background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                    onFocus={(e) => { e.target.style.borderColor = "#2563EB"; e.target.style.background = "#EFF6FF"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#F8FAFC"; }} />
                </Field>

                {/* Phone */}
                <Field label="Số điện thoại" required icon={Phone}>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0900 000 000"
                    className="w-full rounded-xl pl-10 pr-4 py-2.5 outline-none transition-all"
                    style={{ fontSize: 14, color: "#0F172A", background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                    onFocus={(e) => { e.target.style.borderColor = "#2563EB"; e.target.style.background = "#EFF6FF"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#F8FAFC"; }} />
                </Field>

                {/* Password */}
                <Field label="Mật khẩu" required icon={Lock}>
                  <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full rounded-xl pl-10 pr-10 py-2.5 outline-none transition-all"
                    style={{ fontSize: 14, color: "#0F172A", background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                    onFocus={(e) => { e.target.style.borderColor = "#2563EB"; e.target.style.background = "#EFF6FF"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#F8FAFC"; }} />
                  <button type="button" onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2">
                    {showPass ? <EyeOff className="h-4 w-4" style={{ color: "#94A3B8" }} /> : <Eye className="h-4 w-4" style={{ color: "#94A3B8" }} />}
                  </button>
                </Field>

                {/* Status toggle */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Trạng thái ban đầu
                  </label>
                  <div className="flex gap-2">
                    {(["active", "inactive"] as const).map((s) => (
                      <button key={s} type="button" onClick={() => setStatus(s)}
                        className="flex items-center gap-2 rounded-xl px-4 py-2.5 flex-1 transition-all"
                        style={{
                          border: `1px solid ${status === s ? (s === "active" ? "#A7F3D0" : "#FECACA") : "#E2E8F0"}`,
                          background: status === s ? (s === "active" ? "#ECFDF5" : "#FEF2F2") : "#F8FAFC",
                          fontSize: 13, fontWeight: status === s ? 600 : 400,
                          color: status === s ? (s === "active" ? "#065F46" : "#991B1B") : "#64748B",
                        }}>
                        <div className="h-2 w-2 rounded-full"
                          style={{ background: s === "active" ? "#10B981" : "#EF4444" }} />
                        {s === "active" ? "Hoạt động ngay" : "Khoá ban đầu"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info note */}
                <div className="flex items-start gap-2.5 rounded-xl px-3.5 py-3"
                  style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
                  <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: "#2563EB" }} />
                  <p style={{ fontSize: 11, color: "#1E40AF", lineHeight: 1.55 }}>
                    Sau khi tạo, giáo viên có thể đăng nhập bằng <strong>số điện thoại + mật khẩu</strong> tại trang đăng nhập giáo viên.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-3"
                    style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
                    <AlertCircle className="h-4 w-4 flex-shrink-0" style={{ color: "#EF4444" }} />
                    <p style={{ fontSize: 12, color: "#991B1B" }}>{error}</p>
                  </div>
                )}

                {/* Submit */}
                <div className="flex justify-end pt-1">
                  <button type="submit" disabled={loading}
                    className="flex items-center gap-2 rounded-xl px-6 py-2.5 transition-all"
                    style={{ background: "#0F172A", color: "#FFF", fontSize: 13, fontWeight: 600, opacity: loading ? 0.7 : 1 }}
                    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#1E293B"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#0F172A"; }}>
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                    {loading ? "Đang tạo..." : "Tạo tài khoản"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

