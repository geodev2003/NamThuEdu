import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Shield,
  GraduationCap,
  ClipboardCheck,
  BarChart3,
  MessageSquare,
} from "lucide-react";

export function TeacherLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      navigate("/giao-vien");
    }, 1500);
  };

  const teacherFeatures = [
    { 
      icon: BookOpen, 
      text: "Tạo đề thi IELTS, TOEIC, VSTEP", 
      color: "text-blue-400",
      description: "Ngân hàng đề thi phong phú với templates sẵn có"
    },
    { 
      icon: ClipboardCheck, 
      text: "Chấm điểm tự động & thủ công", 
      color: "text-green-400",
      description: "AI hỗ trợ chấm bài viết, tự động cho trắc nghiệm"
    },
    { 
      icon: Users, 
      text: "Quản lý lớp học & học viên", 
      color: "text-purple-400",
      description: "Theo dõi tiến độ từng học sinh real-time"
    },
    { 
      icon: BarChart3, 
      text: "Báo cáo & phân tích chi tiết", 
      color: "text-orange-400",
      description: "Dashboard thống kê với biểu đồ trực quan"
    },
  ];

  const stats = [
    { value: "50K+", label: "Giáo viên", icon: GraduationCap, color: "text-blue-400" },
    { value: "500K+", label: "Học sinh", icon: Users, color: "text-green-400" },
    { value: "1M+", label: "Bài kiểm tra", icon: BookOpen, color: "text-purple-400" },
    { value: "99%", label: "Hài lòng", icon: Award, color: "text-orange-400" },
  ];

  const testimonials = [
    {
      text: "Công cụ tuyệt vời giúp tôi tiết kiệm 10 giờ/tuần trong việc tạo đề và chấm bài!",
      author: "Cô Nguyễn Thị Hà",
      role: "Giáo viên IELTS - Trung tâm Language Link",
      rating: 5
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: '0.5s' }} />
        
        {/* Floating Shapes */}
        <div className="absolute top-20 left-20 w-20 h-20 border-2 border-white/10 rounded-lg rotate-12 animate-float" />
        <div className="absolute top-40 right-40 w-16 h-16 border-2 border-white/10 rounded-full animate-float" 
          style={{ animationDelay: '0.3s' }} />
        <div className="absolute bottom-40 left-40 w-24 h-24 border-2 border-white/10 rounded-lg -rotate-12 animate-float" 
          style={{ animationDelay: '0.7s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Teacher Branding & Features */}
          <div className="hidden lg:block space-y-8 text-white">
            {/* Logo & Title */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">NamThu Education</span>
                <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full text-xs font-bold">
                  Teacher
                </span>
              </div>
              
              <h1 className="text-5xl font-bold leading-tight">
                <span className="text-white">Chào mừng</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Giáo viên tiếng Anh! 👋
                </span>
              </h1>
              
              <p className="text-xl text-blue-200 leading-relaxed">
                Nền tảng quản lý giảng dạy toàn diện với AI hỗ trợ - 
                Tạo đề, chấm bài, theo dõi tiến độ học sinh một cách thông minh và hiệu quả.
              </p>
            </div>

            {/* Features with Descriptions */}
            <div className="space-y-4">
              {teacherFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-white mb-1">{feature.text}</p>
                    <p className="text-sm text-blue-200/80">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="p-6 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Award key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-white/90 italic mb-4">"{testimonials[0].text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonials[0].author.charAt(3)}
                </div>
                <div>
                  <p className="font-semibold text-white">{testimonials[0].author}</p>
                  <p className="text-xs text-blue-200">{testimonials[0].role}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 pt-8 border-t border-white/10">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-blue-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 lg:p-12">
              {/* Mobile Logo */}
              <div className="lg:hidden flex justify-center mb-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg text-white">NamThu Education</span>
                </div>
              </div>

              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-blue-400/30 mb-4">
                  <GraduationCap className="w-5 h-5 text-blue-300" />
                  <span className="text-sm font-semibold text-blue-200">Teacher Portal</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Đăng nhập Giáo viên 🎓</h2>
                <p className="text-blue-200">Truy cập Teacher Dashboard của bạn</p>
              </div>

              {/* Quick Demo Login */}
              <div className="mb-8 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-xl border border-green-400/30">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">Demo Account</p>
                    <p className="text-xs text-green-200">
                      Email: <span className="font-mono text-white">teacher@demo.com</span>
                      <br />
                      Password: <span className="font-mono text-white">demo123</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">Email Giáo viên</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="teacher@namthu.edu.vn"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">Mật khẩu</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-offset-0"
                    />
                    <span className="text-sm text-blue-200 group-hover:text-white transition-colors">
                      Ghi nhớ đăng nhập
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-300 hover:text-white transition-colors font-medium"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Đang đăng nhập...</span>
                    </>
                  ) : (
                    <>
                      <span>Đăng nhập Teacher Portal</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/10 backdrop-blur-sm text-blue-200 rounded-full">
                    Hoặc đăng nhập nhanh với
                  </span>
                </div>
              </div>

              {/* Social Login for Teachers */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-300 group">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      className="text-white"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      className="text-blue-400"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      className="text-yellow-400"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      className="text-green-400"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="font-semibold text-white text-sm">Google</span>
                </button>
                <button className="flex items-center justify-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-300 group">
                  <MessageSquare className="w-5 h-5 text-white" />
                  <span className="font-semibold text-white text-sm">Microsoft</span>
                </button>
              </div>

              {/* Sign Up Link for Teachers */}
              <div className="mt-8 text-center">
                <p className="text-blue-200">
                  Giáo viên mới?{" "}
                  <Link
                    to="/register"
                    className="text-white font-bold hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                  >
                    Đăng ký tài khoản Teacher
                    <Sparkles className="w-4 h-4" />
                  </Link>
                </p>
              </div>

              {/* Security Badge */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-blue-200">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>Bảo mật với mã hóa SSL 256-bit</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-blue-300">
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      ISO 27001 Certified
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      GDPR Compliant
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="mt-6 text-center text-sm text-blue-200">
              <p>
                Bằng việc đăng nhập, bạn đồng ý với{" "}
                <Link to="/terms" className="text-white hover:underline">
                  Điều khoản sử dụng
                </Link>{" "}
                và{" "}
                <Link to="/privacy" className="text-white hover:underline">
                  Chính sách bảo mật
                </Link>
              </p>
            </div>

            {/* Help Link */}
            <div className="mt-4 text-center">
              <Link
                to="/help"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-full border border-white/10 text-sm text-blue-200 hover:text-white transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Cần hỗ trợ đăng nhập?
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}