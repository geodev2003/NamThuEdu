import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { login } from "../../../../services/authApi";
import {
  Eye, EyeOff, AlertCircle, Shield, Phone, Lock,
  Activity, Users, BookOpen, ArrowRight, CheckCircle,
} from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sysStats, setSysStats] = useState<{ students: number; teachers: number; courses: number; exams: number } | null>(null);
  const [serverOk, setServerOk] = useState<boolean | null>(null);

  useEffect(() => {
    import("../../../../services/api").then(({ api }) => {
      api.get<{ status: string; data: { students: number; teachers: number; courses: number; exams: number } }>("/public/stats")
        .then(r => setSysStats(r.data.data))
        .catch(() => {});
      api.get("/health")
        .then(() => setServerOk(true))
        .catch(() => setServerOk(false));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await login({ phone: phone.trim(), password });
      const { access_token, user } = response.data;
      if (user.role !== "admin") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_role");
        setError(t("auth.adminLogin.errors.notAdmin"));
        return;
      }
      localStorage.setItem("auth_token", access_token);
      localStorage.setItem("auth_role", user.role);
      navigate("/admin");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || t("auth.adminLogin.errors.failed"));
      } else {
        setError(t("auth.adminLogin.errors.failed"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const p = "auth.adminLogin.panel";
  const modules = t(`${p}.modules`, { returnObjects: true }) as Array<{ label: string; sub?: string; tag: string; tagOffline?: string }>;
  const features = t(`${p}.features`, { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)" }}
      >
        {/* Decorative orbs */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #F59E0B, transparent)" }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-56 h-56 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #3B82F6, transparent)" }} />
        <div className="absolute top-1/2 right-8 w-32 h-32 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #F59E0B, transparent)" }} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", boxShadow: "0 4px 16px rgba(245,158,11,0.4)" }}>
            <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">{t(`${p}.appName`)}</p>
            <p className="text-xs font-semibold leading-none mt-0.5" style={{ color: "#F59E0B" }}>{t(`${p}.consoleName`)}</p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6 text-xs font-semibold"
              style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              {t(`${p}.systemLive`)}
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-3">
              {t(`${p}.heroTitle`)}<br />
              <span style={{ color: "#F59E0B" }}>{t(`${p}.heroHighlight`)}</span>
            </h1>
            <p className="text-base leading-relaxed" style={{ color: "#94A3B8" }}>
              {t(`${p}.heroDesc`)}
            </p>
          </div>

          {/* Security modules panel */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3"
              style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-xs font-semibold" style={{ color: "#94A3B8" }}>{t(`${p}.statusTitle`)}</span>
              </div>
              <span className="text-[10px] font-mono" style={{ color: "#475569" }}>{t(`${p}.statusLive`)}</span>
            </div>

            {/* Module rows */}
            <div style={{ background: "rgba(255,255,255,0.02)" }}>
              {[
                { icon: Users,    data: modules[0],
                  sub: sysStats ? t(`${p}.statsUsers`, { students: sysStats.students.toLocaleString(), teachers: sysStats.teachers }) : t(`${p}.loading`),
                  dot: "#10B981", tag: modules[0]?.tag },
                { icon: BookOpen, data: modules[1],
                  sub: sysStats ? t(`${p}.statsCourses`, { courses: sysStats.courses, exams: sysStats.exams }) : t(`${p}.loading`),
                  dot: "#10B981", tag: modules[1]?.tag },
                { icon: Shield,   data: modules[2], sub: modules[2]?.sub ?? "JWT · RBAC · HTTPS",
                  dot: "#F59E0B", tag: modules[2]?.tag },
                { icon: Activity, data: modules[3],
                  sub: serverOk === null ? t(`${p}.checking`) : serverOk ? t(`${p}.apiOnline`) : t(`${p}.apiOffline`),
                  dot: serverOk === false ? "#EF4444" : "#10B981",
                  tag: serverOk === false ? (modules[3]?.tagOffline ?? "Offline") : modules[3]?.tag },
              ].map((m, i) => (
                <div key={i}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.06)" }}>
                    <m.icon className="w-4 h-4" style={{ color: "#64748B" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none mb-0.5" style={{ color: "#E2E8F0" }}>{m.data?.label}</p>
                    <p className="text-[11px] truncate" style={{ color: "#475569" }}>{m.sub}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: m.dot }} />
                    <span className="text-[10px] font-semibold" style={{ color: m.dot }}>{m.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {features.map(f => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#10B981" }} />
                <span className="text-sm" style={{ color: "#94A3B8" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <p className="relative z-10 text-xs" style={{ color: "#475569" }}>
          © {new Date().getFullYear()} {t(`${p}.copyright`)}
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #0F172A, #1E293B)" }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 leading-none">{t(`${p}.appName`)}</p>
              <p className="text-xs font-semibold leading-none mt-0.5 text-amber-500">{t(`${p}.consoleName`)}</p>
            </div>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4 text-xs font-semibold"
              style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A" }}>
              <Shield className="w-3.5 h-3.5" /> {t("auth.adminLogin.securityZone")}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1.5">{t("auth.adminLogin.title")}</h2>
            <p className="text-sm text-slate-500">{t("auth.adminLogin.subtitle")}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl px-4 py-3 mb-6"
              style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                {t("auth.adminLogin.phone")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel" id="phone" value={phone}
                  onChange={e => setPhone(e.target.value)} required autoComplete="tel"
                  placeholder={t("auth.adminLogin.phonePlaceholder")}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border bg-white text-slate-800 text-sm placeholder:text-slate-400 outline-none transition"
                  style={{ borderColor: "#E2E8F0", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
                  onFocus={e => { e.target.style.borderColor = "#F59E0B"; e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)"; }}
                  onBlur={e => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                {t("auth.adminLogin.password")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"} id="password" value={password}
                  onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
                  placeholder={t("auth.adminLogin.passwordPlaceholder")}
                  className="w-full h-11 pl-10 pr-11 rounded-xl border bg-white text-slate-800 text-sm placeholder:text-slate-400 outline-none transition"
                  style={{ borderColor: "#E2E8F0", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
                  onFocus={e => { e.target.style.borderColor = "#F59E0B"; e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)"; }}
                  onBlur={e => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)"; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox" id="rememberMe" checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer accent-amber-500"
              />
              <label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer select-none">
                {t("auth.adminLogin.rememberMe")}
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={isLoading}
              className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: isLoading ? "#1E293B" : "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                boxShadow: "0 4px 14px rgba(15,23,42,0.35)",
              }}
              onMouseEnter={e => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #1E293B 0%, #334155 100%)"; }}
              onMouseLeave={e => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)"; }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{t("auth.adminLogin.authenticating")}</span>
                </>
              ) : (
                <>
                  <span>{t("auth.adminLogin.loginButton")}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security note */}
          <div className="mt-6 flex items-start gap-3 rounded-xl px-4 py-3"
            style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
            <p className="text-xs text-slate-500 leading-relaxed">
              <span className="font-semibold text-slate-700">{t("auth.adminLogin.securityTitle")}:</span>{" "}
              {t("auth.adminLogin.securityText")}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

export { AdminLogin };
export default AdminLogin;
