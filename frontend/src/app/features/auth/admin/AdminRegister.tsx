import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { register, RegisterFormData } from "../../../../services/authApi";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import adminBadgeImg from "../../../../assets/auth-icons/admin-badge.svg";
import idCardImg from "../../../../assets/auth-icons/id-card.svg";
import keyholeImg from "../../../../assets/auth-icons/keyhole.svg";
import sparkShieldImg from "../../../../assets/auth-icons/spark-shield.svg";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Alert, AlertDescription } from "../../../components/ui/alert";

interface AdminRegisterFormData extends RegisterFormData {
  email: string;
  admin_code?: string;
}

export function AdminRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState<AdminRegisterFormData>({
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
    admin_code: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await register({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });
      const { access_token, user } = response.data;

      localStorage.setItem("auth_token", access_token);
      localStorage.setItem("auth_role", user.role);

      setStep(2);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      navigate("/admin");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      }
      setError(err.response?.data?.message || "Đăng ký thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center p-2 md:p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="relative w-full max-w-xl">
        {step === 1 ? (
          <Card className="bg-white/80 backdrop-blur-xl border-orange-100 shadow-xl shadow-orange-100/50 animate-fadeInUp">
            {/* Header with Admin Badge */}
            <CardHeader className="text-center pb-2">
              <Badge className="mx-auto mb-4 bg-orange-100 text-orange-700 border border-orange-200 px-3 py-1.5 gap-1.5">
                <img src={adminBadgeImg} alt="" className="w-4 h-4" />
                Đăng Ký Admin
                <img src={sparkShieldImg} alt="" className="w-4 h-4" />
              </Badge>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">
                Tạo tài khoản quản trị
              </h2>
              <p className="text-sm text-slate-500">
                Đăng ký tài khoản để quản lý hệ thống NamThuEdu
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Input */}
                <div>
                  <Label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Họ và tên <span className="text-orange-500">*</span>
                  </Label>
                  <div className="relative">
                    <img src={idCardImg} alt="" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" />
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`pl-11 h-11 bg-white border ${
                        fieldErrors.name ? "border-rose-400" : "border-orange-200"
                      } text-slate-700 placeholder:text-slate-400 focus-visible:ring-orange-200 focus-visible:border-orange-300`}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="mt-1 text-sm text-rose-600 flex items-center gap-1">
                      <span>⚠️</span> {fieldErrors.name[0]}
                    </p>
                  )}
                </div>

                {/* Phone Input */}
                <div>
                  <Label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Số điện thoại <span className="text-orange-500">*</span>
                  </Label>
                  <div className="relative">
                    <img src={idCardImg} alt="" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" />
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className={`pl-11 h-11 bg-white border ${
                        fieldErrors.phone ? "border-rose-400" : "border-orange-200"
                      } text-slate-700 placeholder:text-slate-400 focus-visible:ring-orange-200 focus-visible:border-orange-300`}
                      placeholder="0912345678"
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="mt-1 text-sm text-rose-600 flex items-center gap-1">
                      <span>⚠️</span> {fieldErrors.phone[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Input */}
              <div>
                <Label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email <span className="text-orange-500">*</span>
                </Label>
                <div className="relative">
                  <img src={idCardImg} alt="" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" />
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`pl-11 h-11 bg-white border ${
                      fieldErrors.email ? "border-rose-400" : "border-orange-200"
                    } text-slate-700 placeholder:text-slate-400 focus-visible:ring-orange-200 focus-visible:border-orange-300`}
                    placeholder="admin@namthuedu.com"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-rose-600 flex items-center gap-1">
                    <span>⚠️</span> {fieldErrors.email[0]}
                  </p>
                )}
              </div>

              {/* Admin Code */}
              <div>
                <Label htmlFor="admin_code" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Mã quản trị viên <span className="text-orange-500">*</span>
                </Label>
                <div className="relative">
                  <img src={sparkShieldImg} alt="" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" />
                  <Input
                    type="text"
                    id="admin_code"
                    name="admin_code"
                    value={formData.admin_code}
                    onChange={handleChange}
                    required
                    className={`pl-11 h-11 bg-white border ${
                      fieldErrors.admin_code ? "border-rose-400" : "border-orange-200"
                    } text-slate-700 placeholder:text-slate-400 focus-visible:ring-orange-200 focus-visible:border-orange-300`}
                    placeholder="Nhập mã cấp quyền admin"
                  />
                </div>
                {fieldErrors.admin_code && (
                  <p className="mt-1 text-sm text-rose-600 flex items-center gap-1">
                    <span>⚠️</span> {fieldErrors.admin_code[0]}
                  </p>
                )}
                <p className="mt-1 text-xs text-amber-700">
                  Mã này do hệ thống cấp. Liên hệ quản trị cấp cao để được cấp mã.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password Input */}
                <div>
                  <Label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Mật khẩu <span className="text-orange-500">*</span>
                  </Label>
                  <div className="relative">
                    <img src={keyholeImg} alt="" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      className={`pl-11 pr-11 h-11 bg-white border ${
                        fieldErrors.password ? "border-rose-400" : "border-orange-200"
                      } text-slate-700 placeholder:text-slate-400 focus-visible:ring-orange-200 focus-visible:border-orange-300`}
                      placeholder="Tối thiểu 8 ký tự"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-orange-400 hover:text-orange-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1 text-sm text-rose-600 flex items-center gap-1">
                      <span>⚠️</span> {fieldErrors.password[0]}
                    </p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <Label
                    htmlFor="password_confirmation"
                    className="block text-sm font-semibold text-slate-700 mb-1.5"
                  >
                    Xác nhận mật khẩu <span className="text-orange-500">*</span>
                  </Label>
                  <div className="relative">
                    <img src={keyholeImg} alt="" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      id="password_confirmation"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      required
                      minLength={8}
                      className={`pl-11 pr-11 h-11 bg-white border ${
                        fieldErrors.password_confirmation
                          ? "border-rose-400"
                          : "border-orange-200"
                      } text-slate-700 placeholder:text-slate-400 focus-visible:ring-orange-200 focus-visible:border-orange-300`}
                      placeholder="Nhập lại mật khẩu"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-orange-400 hover:text-orange-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password_confirmation && (
                    <p className="mt-1 text-sm text-rose-600 flex items-center gap-1">
                      <span>⚠️</span> {fieldErrors.password_confirmation[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <Alert className="bg-rose-50 border-rose-200 text-rose-700">
                  <AlertCircle className="text-rose-500" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Security Notice */}
              <Alert className="bg-amber-50 border-amber-200 text-amber-700">
                <img src={sparkShieldImg} alt="" className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                <AlertDescription>
                  <strong>Lưu ý:</strong> Tài khoản admin có toàn quyền quản lý hệ thống.
                  Vui lòng bảo mật thông tin đăng nhập và không chia sẻ với người khác.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-orange-400 to-amber-400 text-white font-semibold hover:from-orange-500 hover:to-amber-500"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <img src={sparkShieldImg} alt="" className="w-5 h-5" />
                    <span>Đăng ký Admin</span>
                  </>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
               <p className="text-sm text-slate-500">
                Đã có tài khoản admin?{" "}
                <Link
                  to="/admin/login"
                  className="text-orange-600 font-semibold hover:text-orange-700 transition-colors underline"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
            </CardContent>
          </Card>
        ) : (
          // Success Step
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-orange-100 p-10 shadow-xl shadow-orange-100/50 text-center animate-fadeInUp">
            <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Đăng ký thành công!
            </h3>
            <p className="text-slate-500 mb-5">
              Đang chuyển đến bảng điều khiển admin...
            </p>
            <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-orange-400 to-amber-400 animate-loading-bar" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
