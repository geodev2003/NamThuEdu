import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { login } from "../../../../services/authApi";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import adminBadgeImg from "../../../../assets/auth-icons/admin-badge.svg";
import idCardImg from "../../../../assets/auth-icons/id-card.svg";
import keyholeImg from "../../../../assets/auth-icons/keyhole.svg";
import sparkShieldImg from "../../../../assets/auth-icons/spark-shield.svg";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Checkbox } from "../../../components/ui/checkbox";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Alert, AlertDescription } from "../../../components/ui/alert";

function AdminLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Login attempt:', { phone: phone.trim() });
      const response = await login({ phone: phone.trim(), password });
      console.log('✅ Login response:', response);
      
      const { access_token, user } = response.data;
      console.log('👤 User data:', user);

      if (user.role !== "admin") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_role");
        setError(t("auth.adminLogin.errors.notAdmin"));
        console.error('❌ User is not admin:', user.role);
        return;
      }

      localStorage.setItem("auth_token", access_token);
      localStorage.setItem("auth_role", user.role);
      console.log('✅ Token saved, navigating to /admin');
      navigate("/admin");
    } catch (err: unknown) {
      console.error('❌ Login error:', err);
      if (axios.isAxiosError(err)) {
        console.error('Response data:', err.response?.data);
        setError(err.response?.data?.message || t("auth.adminLogin.errors.failed"));
      } else {
        setError(t("auth.adminLogin.errors.failed"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center p-2 md:p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative w-full max-w-sm">
        <Card className="bg-white/80 backdrop-blur-xl border-orange-100 shadow-xl shadow-orange-100/50 animate-fadeInUp">
          <CardHeader className="text-center pb-2">
            <Badge className="mx-auto mb-4 bg-orange-100 text-orange-700 border border-orange-200 px-3 py-1.5 gap-1.5">
              <img src={adminBadgeImg} alt="" className="w-4 h-4" />
              {t("auth.adminLogin.badge")}
              <img src={sparkShieldImg} alt="" className="w-4 h-4" />
            </Badge>
            <h2 className="text-2xl font-bold text-slate-800">{t("auth.adminLogin.title")}</h2>
            <p className="text-sm text-slate-500">{t("auth.adminLogin.subtitle")}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-slate-700">
                  {t("auth.adminLogin.phone")} <span className="text-orange-500">*</span>
                </Label>
                <div className="relative">
                  <img src={idCardImg} alt="" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                  <Input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="pl-11 h-11 bg-white border-orange-200 text-slate-700 placeholder:text-slate-400 focus-visible:ring-orange-200 focus-visible:border-orange-300"
                    placeholder={t("auth.adminLogin.phonePlaceholder")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-700">
                  {t("auth.adminLogin.password")} <span className="text-orange-500">*</span>
                </Label>
                <div className="relative">
                  <img src={keyholeImg} alt="" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-11 pr-11 h-11 bg-white border-orange-200 text-slate-700 placeholder:text-slate-400 focus-visible:ring-orange-200 focus-visible:border-orange-300"
                    placeholder={t("auth.adminLogin.passwordPlaceholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 hover:text-orange-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-start">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                    className="border-orange-200 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-slate-600 font-normal">
                    {t("auth.adminLogin.rememberMe")}
                  </Label>
                </div>
              </div>

              {error && (
                <Alert className="bg-rose-50 border-rose-200 text-rose-700">
                  <AlertCircle className="text-rose-500" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-orange-400 to-amber-400 text-white font-semibold hover:from-orange-500 hover:to-amber-500"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4.5 w-4.5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>{t("auth.adminLogin.authenticating")}</span>
                  </>
                ) : (
                  <>
                    <img src={sparkShieldImg} alt="" className="w-4.5 h-4.5" />
                    <span>{t("auth.adminLogin.loginButton")}</span>
                  </>
                )}
              </Button>
            </form>

            <Alert className="bg-amber-50 border-amber-200 text-amber-700">
              <img src={sparkShieldImg} alt="" className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
              <AlertDescription>
                <strong>{t("auth.adminLogin.securityTitle")}:</strong> {t("auth.adminLogin.securityText")}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { AdminLogin };
export default AdminLogin;
