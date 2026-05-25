import { useEffect, useRef, useState, useCallback } from "react";
import {
  User, Lock, Bell, Shield, Eye, EyeOff,
  Check, AlertCircle, RefreshCw, Mail,
  Calendar, Clock, LogIn, Settings, Edit2,
  Smartphone, Trash2, MonitorSmartphone, X, Save,
  Palette,
} from "lucide-react";
import { adminApi } from "@/services/adminApi";

/* ── avatar gradient presets ── */
const AVATAR_PRESETS = [
  { id: "amber",  gradient: "linear-gradient(135deg,#F59E0B,#EF4444)",  label: "Amber" },
  { id: "blue",   gradient: "linear-gradient(135deg,#2563EB,#7C3AED)",  label: "Xanh" },
  { id: "green",  gradient: "linear-gradient(135deg,#10B981,#0284C7)",  label: "Xanh lá" },
  { id: "purple", gradient: "linear-gradient(135deg,#8B5CF6,#EC4899)",  label: "Tím" },
  { id: "red",    gradient: "linear-gradient(135deg,#EF4444,#F97316)",  label: "Đỏ" },
  { id: "teal",   gradient: "linear-gradient(135deg,#0D9488,#2563EB)",  label: "Teal" },
];
const LS_AVATAR = "admin_avatar_color";
const getStoredAvatar = () => localStorage.getItem(LS_AVATAR) ?? "amber";

/* ── session device icon heuristic ── */
function DeviceIcon({ name }: { name: string }) {
  const lower = (name ?? "").toLowerCase();
  if (lower.includes("mobile") || lower.includes("phone")) return <Smartphone className="h-4 w-4" />;
  return <MonitorSmartphone className="h-4 w-4" />;
}

/* ── tiny toast ── */
function Toast({ msg, type }: { msg: string; type: "ok" | "err" }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 shadow-lg"
      style={{ background: type === "ok" ? "#0F172A" : "#FEF2F2", border: `1px solid ${type === "ok" ? "#334155" : "#FECACA"}`, minWidth: 240 }}>
      {type === "ok"
        ? <Check className="h-4 w-4 flex-shrink-0" style={{ color: "#10B981" }} />
        : <AlertCircle className="h-4 w-4 flex-shrink-0" style={{ color: "#EF4444" }} />}
      <span style={{ fontSize: 13, color: type === "ok" ? "#F8FAFC" : "#EF4444", fontWeight: 500 }}>{msg}</span>
    </div>
  );
}

/* ── toggle switch ── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className="relative inline-flex h-5 w-9 flex-shrink-0 rounded-full transition-colors duration-200"
      style={{ background: checked ? "#0F172A" : "#E2E8F0" }}>
      <span className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: checked ? "translate(18px, 2px)" : "translate(2px, 2px)" }} />
    </button>
  );
}

export function AdminProfilePage() {
  /* ── profile ── */
  const [profile, setProfile] = useState<{ name: string; phone: string; email: string; role: string; created_at: string | null } | null>(null);
  const [editMode, setEditMode]     = useState(false);
  const [editName, setEditName]     = useState("");
  const [editEmail, setEditEmail]   = useState("");
  const [editLoading, setEditLoading] = useState(false);

  /* ── avatar ── */
  const [avatarId, setAvatarId]         = useState(getStoredAvatar);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const avatarGradient = AVATAR_PRESETS.find((p) => p.id === avatarId)?.gradient ?? AVATAR_PRESETS[0].gradient;

  /* ── sessions ── */
  type Session = { id: number; name: string; is_current: boolean; created_at: string; last_used_at: string };
  const [sessions, setSessions]         = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [revokingId, setRevokingId]     = useState<number | null>(null);
  const [revokeAllLoading, setRevokeAllLoading] = useState(false);

  /* ── settings ── */
  const [autoRefresh, setAutoRefresh]   = useState(true);
  const [emailAlert, setEmailAlert]     = useState(false);
  const [notifyLogin, setNotifyLogin]   = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);

  /* ── password ── */
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew]         = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [showPw, setShowPw]       = useState<Record<string, boolean>>({});
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError]     = useState<string | null>(null);

  /* ── toast ── */
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((msg: string, type: "ok" | "err") => {
    setToast({ msg, type });
    if (toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 3500);
  }, []);

  /* ── load everything ── */
  useEffect(() => {
    adminApi.getAdminProfile().then((data) => {
      if (data) { setProfile(data); setEditName(data.name); setEditEmail(data.email); }
    }).catch(() => {
      setProfile({ name: "Administrator", phone: "", email: "admin@namthu.edu", role: "admin", created_at: null });
    });

    adminApi.getSettings().then((data) => {
      if (data.autoRefresh !== undefined) setAutoRefresh(Boolean(data.autoRefresh));
      if (data.emailAlert  !== undefined) setEmailAlert(Boolean(data.emailAlert));
    }).catch(() => {}).finally(() => setSettingsLoading(false));

    setSessionsLoading(true);
    adminApi.getAdminSessions().then(setSessions).catch(() => setSessions([])).finally(() => setSessionsLoading(false));
  }, []);

  /* ── avatar picker ── */
  const pickAvatar = (id: string) => {
    setAvatarId(id);
    localStorage.setItem(LS_AVATAR, id);
    window.dispatchEvent(new Event("admin_avatar_changed"));
    setAvatarPickerOpen(false);
  };

  /* ── save profile ── */
  const handleSaveProfile = async () => {
    setEditLoading(true);
    try {
      const updated = await adminApi.updateAdminProfile({ name: editName, email: editEmail });
      if (updated) setProfile((p) => p ? { ...p, name: updated.name, email: updated.email } : p);
      showToast("Cập nhật hồ sơ thành công", "ok");
      setEditMode(false);
    } catch { showToast("Cập nhật thất bại", "err"); }
    finally { setEditLoading(false); }
  };

  /* ── sessions ── */
  const handleRevokeSession = async (id: number) => {
    setRevokingId(id);
    try {
      await adminApi.revokeSession(id);
      setSessions((s) => s.filter((x) => x.id !== id));
      showToast("Đã thu hồi phiên đăng nhập", "ok");
    } catch { showToast("Thu hồi thất bại", "err"); }
    finally { setRevokingId(null); }
  };

  const handleRevokeAll = async () => {
    setRevokeAllLoading(true);
    try {
      await adminApi.revokeAllSessions();
      setSessions((s) => s.filter((x) => x.is_current));
      showToast("Đã thu hồi tất cả phiên khác", "ok");
    } catch { showToast("Thu hồi thất bại", "err"); }
    finally { setRevokeAllLoading(false); }
  };

  /* ── settings ── */
  const saveSetting = async (key: string, value: boolean) => {
    try {
      await adminApi.updateSettings({ [key]: value });
      showToast("Đã lưu cài đặt", "ok");
    } catch { showToast("Lưu cài đặt thất bại", "err"); }
  };

  /* ── change password ── */
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    if (!pwCurrent) { setPwError("Vui lòng nhập mật khẩu hiện tại"); return; }
    if (pwNew.length < 8) { setPwError("Mật khẩu mới tối thiểu 8 ký tự"); return; }
    if (pwNew !== pwConfirm) { setPwError("Mật khẩu xác nhận không khớp"); return; }
    setPwLoading(true);
    try {
      await adminApi.changePassword(pwCurrent, pwNew, pwConfirm);
      showToast("Đổi mật khẩu thành công", "ok");
      setPwCurrent(""); setPwNew(""); setPwConfirm("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Đổi mật khẩu thất bại";
      setPwError(msg);
    } finally { setPwLoading(false); }
  };

  /* ── pw strength ── */
  const pwStrength = pwNew.length === 0 ? 0 : pwNew.length < 6 ? 1 : pwNew.length < 10 ? 2 : 3;
  const pwStrengthLabel = ["", "Yếu", "Trung bình", "Mạnh"];
  const pwStrengthColor = ["", "#EF4444", "#F59E0B", "#10B981"];

  const displayName  = profile?.name  ?? "Administrator";
  const displayEmail = profile?.email ?? "admin@namthu.edu";
  const joinDate = profile?.created_at ?? new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  const otherSessions = sessions.filter((s) => !s.is_current);

  return (
    <div className="min-h-screen" style={{ background: "#F1F5F9" }}>

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden px-6 pt-8 pb-0"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)" }}>
        <div className="pointer-events-none absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${AVATAR_PRESETS.find(p=>p.id===avatarId)?.gradient.split(",")[1]?.split(")")[0] ?? "#F59E0B"}, transparent 70%)` }} />

        <div className="relative z-10 flex items-end gap-6 pb-0">
          {/* Avatar with picker */}
          <div className="relative mb-0 flex-shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl text-white text-2xl font-black shadow-xl cursor-pointer select-none"
              style={{ background: avatarGradient, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
              onClick={() => setAvatarPickerOpen((p) => !p)}>
              AD
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full"
                style={{ background: "#0F172A", border: "2px solid #1E293B" }}>
                <Palette className="h-3 w-3" style={{ color: "#F59E0B" }} />
              </div>
            </div>
            {/* Avatar picker popover */}
            {avatarPickerOpen && (
              <div className="absolute left-0 top-full mt-2 z-50 rounded-xl p-3 shadow-xl"
                style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", minWidth: 200 }}>
                <p style={{ fontSize: 11, color: "#64748B", marginBottom: 8, fontWeight: 600 }}>CHỌN MÀU</p>
                <div className="grid grid-cols-3 gap-2">
                  {AVATAR_PRESETS.map((preset) => (
                    <button key={preset.id} onClick={() => pickAvatar(preset.id)}
                      className="flex flex-col items-center gap-1 rounded-lg p-2 transition-all"
                      style={{ background: avatarId === preset.id ? "rgba(255,255,255,0.1)" : "transparent" }}>
                      <div className="h-8 w-8 rounded-lg" style={{ background: preset.gradient }} />
                      <span style={{ fontSize: 10, color: "#94A3B8" }}>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Name + meta */}
          <div className="pb-5 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#F8FAFC" }}>{displayName}</h1>
              <span className="rounded-full px-2.5 py-0.5"
                style={{ fontSize: 11, fontWeight: 700, background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" }}>
                Super Admin
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {joinDate && (
                <span className="flex items-center gap-1.5" style={{ fontSize: 12, color: "#94A3B8" }}>
                  <Calendar className="h-3.5 w-3.5" /> Tham gia {joinDate}
                </span>
              )}
              <span className="flex items-center gap-1.5" style={{ fontSize: 12, color: "#94A3B8" }}>
                <Mail className="h-3.5 w-3.5" /> {displayEmail}
              </span>
              <span className="flex items-center gap-1.5" style={{ fontSize: 12, color: "#10B981" }}>
                <div className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" /> Đang hoạt động
              </span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="hidden lg:flex items-end gap-3 pb-5">
            {[
              { label: "Vai trò",      value: "Admin",             color: "#F59E0B" },
              { label: "Quyền hạn",   value: "Toàn quyền",        color: "#10B981" },
              { label: "Phiên active", value: String(sessions.length || "—"), color: "#94A3B8" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl px-4 py-2.5 text-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</p>
                <p style={{ fontSize: 10, color: "#64748B" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <div className="relative z-10 flex gap-1 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", marginTop: 16 }}>
          {[
            { id: "info",     icon: User,     label: "Tài khoản"  },
            { id: "sessions", icon: Shield,   label: "Phiên đăng nhập" },
            { id: "security", icon: Lock,     label: "Bảo mật"    },
            { id: "prefs",    icon: Settings, label: "Tuỳ chỉnh"  },
          ].map((tab) => (
            <button key={tab.id}
              onClick={() => document.getElementById(`section-${tab.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="flex items-center gap-1.5 px-4 py-3 transition-all"
              style={{ fontSize: 13, color: "#94A3B8" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#F8FAFC"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#94A3B8"; }}>
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body: two-column layout ── */}
      <div className="flex gap-6 px-6 py-6" style={{ background: "#F8FAFC", minHeight: "calc(100vh - 220px)" }}>

        {/* ── Left sidebar ── */}
        <aside className="hidden lg:flex flex-col gap-2 flex-shrink-0" style={{ width: 220, position: "sticky", top: 16, alignSelf: "flex-start" }}>
          {/* Mini profile card */}
          <div className="rounded-2xl overflow-hidden mb-1" style={{ background: "#0F172A", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex flex-col items-center py-5 px-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl text-white text-lg font-black mb-3 cursor-pointer"
                style={{ background: avatarGradient, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
                onClick={() => setAvatarPickerOpen((p) => !p)}>
                AD
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC", textAlign: "center" }}>{displayName}</p>
              <span className="mt-1 rounded-full px-2 py-0.5"
                style={{ fontSize: 10, fontWeight: 700, background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.25)" }}>
                Super Admin
              </span>
              <div className="mt-3 flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span style={{ fontSize: 11, color: "#10B981" }}>Đang hoạt động</span>
              </div>
            </div>
          </div>

          {/* Section nav */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "#FFF", border: "1px solid #E2E8F0" }}>
            {[
              { id: "info",     icon: User,          label: "Tài khoản",         color: "#2563EB" },
              { id: "sessions", icon: MonitorSmartphone, label: "Phiên đăng nhập", color: "#8B5CF6" },
              { id: "security", icon: Lock,           label: "Bảo mật",           color: "#0D9488" },
              { id: "prefs",    icon: Bell,           label: "Tuỳ chỉnh",         color: "#F59E0B" },
            ].map((item, idx, arr) => (
              <button key={item.id}
                onClick={() => document.getElementById(`section-${item.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="flex w-full items-center gap-3 px-4 py-3 transition-all text-left"
                style={{ borderBottom: idx < arr.length - 1 ? "1px solid #F8FAFC" : "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFC"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `${item.color}15` }}>
                  <item.icon className="h-3.5 w-3.5" style={{ color: item.color }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Danger button */}
          <button onClick={handleRevokeAll} disabled={revokeAllLoading}
            className="mt-1 flex w-full items-center gap-2 rounded-xl px-4 py-2.5 transition-all"
            style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#EF4444", fontSize: 12, fontWeight: 600, opacity: revokeAllLoading ? 0.7 : 1 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#EF4444"; e.currentTarget.style.color = "#FFF"; e.currentTarget.style.borderColor = "#EF4444"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.borderColor = "#FECACA"; }}>
            {revokeAllLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Đăng xuất tất cả
          </button>
        </aside>

        {/* ── Right content ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* ── 1. Account info ── */}
          <section id="section-info">
            <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              {/* Card header with accent left border */}
              <div className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid #F1F5F9", borderLeft: "3px solid #2563EB", borderRadius: "16px 16px 0 0" }}>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "#EFF6FF" }}>
                    <User className="h-4 w-4" style={{ color: "#2563EB" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Thông tin tài khoản</p>
                    <p style={{ fontSize: 11, color: "#94A3B8" }}>Tên hiển thị, email và thông tin cơ bản</p>
                  </div>
                </div>
                {!editMode ? (
                  <button onClick={() => setEditMode(true)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all"
                    style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", background: "#EFF6FF", border: "1px solid #BFDBFE" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#2563EB"; e.currentTarget.style.color = "#FFF"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#EFF6FF"; e.currentTarget.style.color = "#2563EB"; }}>
                    <Edit2 className="h-3 w-3" /> Chỉnh sửa
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setEditMode(false)}
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5"
                      style={{ fontSize: 12, fontWeight: 500, color: "#64748B", background: "#F1F5F9" }}>
                      <X className="h-3 w-3" /> Huỷ
                    </button>
                    <button onClick={handleSaveProfile} disabled={editLoading}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
                      style={{ fontSize: 12, fontWeight: 600, color: "#FFF", background: "#0F172A", opacity: editLoading ? 0.7 : 1 }}>
                      {editLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                      Lưu thay đổi
                    </button>
                  </div>
                )}
              </div>

              <div className="p-5 grid grid-cols-2 gap-4">
                {[
                  { label: "Tên hiển thị", icon: User,   editable: true,  val: editName,  setter: setEditName,  display: displayName },
                  { label: "Vai trò",       icon: Shield, editable: false, val: "",        setter: ()=>{},      display: "Super Admin" },
                  { label: "Email",         icon: Mail,   editable: true,  val: editEmail, setter: setEditEmail, display: displayEmail },
                  { label: "Múi giờ",       icon: Clock,  editable: false, val: "",        setter: ()=>{},      display: "UTC+7 (Hà Nội)" },
                ].map((f) => (
                  <div key={f.label} className="rounded-xl p-4 transition-all"
                    style={{ background: editMode && f.editable ? "#FFFBEB" : "#F8FAFC", border: `1px solid ${editMode && f.editable ? "#FDE68A" : "#F1F5F9"}` }}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <f.icon className="h-3.5 w-3.5" style={{ color: "#94A3B8" }} />
                      <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.label}</span>
                    </div>
                    {editMode && f.editable ? (
                      <input value={f.val} onChange={(e) => f.setter(e.target.value)}
                        className="w-full rounded-lg px-2 py-1 outline-none"
                        style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", background: "transparent", border: "none" }} />
                    ) : (
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{f.display}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 2. Sessions ── */}
          <section id="section-sessions">
            <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid #F1F5F9", borderLeft: "3px solid #8B5CF6" }}>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "#F5F3FF" }}>
                    <MonitorSmartphone className="h-4 w-4" style={{ color: "#8B5CF6" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Phiên đăng nhập</p>
                    <p style={{ fontSize: 11, color: "#94A3B8" }}>Thiết bị đang truy cập tài khoản này</p>
                  </div>
                </div>
                {otherSessions.length > 0 && (
                  <button onClick={handleRevokeAll} disabled={revokeAllLoading}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all"
                    style={{ fontSize: 12, fontWeight: 600, color: "#EF4444", background: "#FEF2F2", border: "1px solid #FECACA", opacity: revokeAllLoading ? 0.7 : 1 }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#EF4444"; e.currentTarget.style.color = "#FFF"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.color = "#EF4444"; }}>
                    {revokeAllLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                    Thu hồi tất cả
                  </button>
                )}
              </div>
              {sessionsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#8B5CF6] border-t-transparent" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <MonitorSmartphone className="h-10 w-10" style={{ color: "#E2E8F0" }} />
                  <p style={{ fontSize: 13, color: "#94A3B8" }}>Không có dữ liệu phiên</p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: "#F8FAFC" }}>
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center gap-4 px-5 py-3.5 transition-all"
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFC"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                        style={{ background: session.is_current ? "#F5F3FF" : "#F8FAFC", border: `1px solid ${session.is_current ? "#DDD6FE" : "#F1F5F9"}` }}>
                        <DeviceIcon name={session.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }} className="truncate">{session.name}</p>
                          {session.is_current && (
                            <span className="flex-shrink-0 rounded-full px-2 py-0.5"
                              style={{ fontSize: 10, fontWeight: 700, background: "#F5F3FF", color: "#8B5CF6", border: "1px solid #DDD6FE" }}>
                              Hiện tại
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
                          Tạo {session.created_at} · Lần cuối {session.last_used_at}
                        </p>
                      </div>
                      {!session.is_current && (
                        <button onClick={() => handleRevokeSession(session.id)} disabled={revokingId === session.id}
                          className="flex-shrink-0 rounded-lg px-3 py-1.5 transition-all"
                          style={{ fontSize: 11, fontWeight: 500, color: "#EF4444", background: "#FEF2F2", border: "1px solid #FECACA", opacity: revokingId === session.id ? 0.6 : 1 }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#EF4444"; e.currentTarget.style.color = "#FFF"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.color = "#EF4444"; }}>
                          {revokingId === session.id ? <RefreshCw className="h-3 w-3 animate-spin" /> : "Thu hồi"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── 3. Change password ── */}
          <section id="section-security">
            <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: "1px solid #F1F5F9", borderLeft: "3px solid #0D9488" }}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "#F0FDFA" }}>
                  <Lock className="h-4 w-4" style={{ color: "#0D9488" }} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Bảo mật & Mật khẩu</p>
                  <p style={{ fontSize: 11, color: "#94A3B8" }}>Đổi mật khẩu để bảo vệ tài khoản</p>
                </div>
              </div>
              <form onSubmit={handleChangePassword} className="p-5 space-y-4">
                {pwError && (
                  <div className="flex items-center gap-2 rounded-xl px-4 py-3" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
                    <AlertCircle className="h-4 w-4 flex-shrink-0" style={{ color: "#EF4444" }} />
                    <span style={{ fontSize: 13, color: "#EF4444" }}>{pwError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: "current", label: "Mật khẩu hiện tại", val: pwCurrent, set: setPwCurrent },
                    { id: "new",     label: "Mật khẩu mới",      val: pwNew,     set: setPwNew     },
                    { id: "confirm", label: "Xác nhận mật khẩu", val: pwConfirm, set: setPwConfirm },
                  ].map(({ id, label, val, set }) => (
                    <div key={id}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
                      <div className="relative">
                        <input type={showPw[id] ? "text" : "password"} value={val} onChange={(e) => set(e.target.value)}
                          placeholder={`Nhập ${label.toLowerCase()}`}
                          className="w-full rounded-xl pr-10 py-2.5 pl-4 outline-none transition-all"
                          style={{ fontSize: 14, color: "#0F172A", background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                          onFocus={(e) => { e.target.style.borderColor = "#0D9488"; e.target.style.background = "#F0FDFA"; e.target.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.08)"; }}
                          onBlur={(e)  => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#F8FAFC"; e.target.style.boxShadow = "none"; }} />
                        <button type="button" onClick={() => setShowPw((p) => ({ ...p, [id]: !p[id] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2">
                          {showPw[id] ? <EyeOff className="h-4 w-4" style={{ color: "#94A3B8" }} /> : <Eye className="h-4 w-4" style={{ color: "#94A3B8" }} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {pwNew.length > 0 && (
                  <div>
                    <div className="flex gap-1.5 mb-1.5">
                      {[1,2,3].map((n) => (
                        <div key={n} className="h-1.5 flex-1 rounded-full transition-all duration-300"
                          style={{ background: n <= pwStrength ? pwStrengthColor[pwStrength] : "#E2E8F0" }} />
                      ))}
                    </div>
                    <p style={{ fontSize: 11, color: pwStrengthColor[pwStrength], fontWeight: 500 }}>
                      Độ mạnh: {pwStrengthLabel[pwStrength]}
                    </p>
                  </div>
                )}
                <div className="flex justify-end pt-1">
                  <button type="submit" disabled={pwLoading}
                    className="flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all"
                    style={{ background: "#0F172A", color: "#F8FAFC", fontSize: 13, fontWeight: 600, opacity: pwLoading ? 0.7 : 1 }}
                    onMouseEnter={(e) => { if (!pwLoading) e.currentTarget.style.background = "#1E293B"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#0F172A"; }}>
                    {pwLoading && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                    {pwLoading ? "Đang lưu..." : "Cập nhật mật khẩu"}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* ── 4. Preferences ── */}
          <section id="section-prefs">
            <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: "1px solid #F1F5F9", borderLeft: "3px solid #F59E0B" }}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "#FFFBEB" }}>
                  <Bell className="h-4 w-4" style={{ color: "#F59E0B" }} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Tuỳ chỉnh & Thông báo</p>
                  <p style={{ fontSize: 11, color: "#94A3B8" }}>Cấu hình dashboard và thông báo hệ thống</p>
                </div>
              </div>
              {settingsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#F59E0B] border-t-transparent" />
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: "#F8FAFC" }}>
                  {[
                    { icon: RefreshCw, label: "Tự động làm mới dữ liệu", desc: "Dashboard tự cập nhật mỗi 30 giây", checked: autoRefresh, onChange: (v: boolean) => { setAutoRefresh(v); saveSetting("autoRefresh", v); } },
                    { icon: Mail,      label: "Cảnh báo qua email",       desc: "Nhận email khi hệ thống có lỗi nghiêm trọng", checked: emailAlert, onChange: (v: boolean) => { setEmailAlert(v); saveSetting("emailAlert", v); } },
                    { icon: LogIn,     label: "Thông báo đăng nhập",      desc: "Nhận cảnh báo khi có đăng nhập từ thiết bị lạ", checked: notifyLogin, onChange: (v: boolean) => setNotifyLogin(v) },
                  ].map(({ icon: Icon, label, desc, checked, onChange }) => (
                    <div key={label} className="flex items-center justify-between px-5 py-4 transition-all"
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#FFFBEB04"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: "#FFFBEB" }}>
                          <Icon className="h-4 w-4" style={{ color: "#F59E0B" }} />
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{label}</p>
                          <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{desc}</p>
                        </div>
                      </div>
                      <Toggle checked={checked} onChange={onChange} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
