import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import {
  ArrowLeft,
  Upload,
  Camera,
  RefreshCw,
  Save,
  X,
  Eye,
  EyeOff,
  User,
  BookOpen,
  Shield,
  Check,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Hash,
  FileText,
} from "lucide-react";

export function AddStudent() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [autoPassword, setAutoPassword] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    dob: "",
    gender: "male",
    address: "",
    classes: [] as string[],
    courses: [] as string[],
    studentId: "ST2024-001248",
    notes: "",
    password: "",
    confirmPassword: "",
    sendSMS: false,
    status: "active",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const steps = [
    { id: 1, title: "Thông tin cá nhân", icon: User },
    { id: 2, title: "Thông tin học tập", icon: BookOpen },
    { id: 3, title: "Tài khoản", icon: Shield },
  ];

  return (
    <div className="p-8 min-h-screen pb-48 bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/giao-vien/students"
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#2563EB] mb-6 transition-colors group"
        >
          <div className="p-1.5 rounded-lg bg-white border border-[#E5E7EB] group-hover:border-[#2563EB] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Quay lại danh sách</span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#111827] mb-2">
              Thêm học sinh mới
            </h1>
            <p className="text-[#6B7280]">
              Điền đầy đủ thông tin để tạo hồ sơ học sinh
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white shadow-lg shadow-blue-500/20 mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-[#111827]">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-[#2563EB] to-[#93C5FD] mx-4 mb-8" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl">
        {/* Section 1: Personal Information */}
        <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow mb-6">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#F3F4F6]">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]">
              <User className="w-6 h-6 text-[#2563EB]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#111827]">
                Thông tin cá nhân
              </h2>
              <p className="text-sm text-[#6B7280]">
                Thông tin cơ bản về học sinh
              </p>
            </div>
          </div>

          {/* Avatar Upload */}
          <div className="flex items-start gap-8 mb-8 pb-8 border-b border-[#F3F4F6]">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] border-2 border-dashed border-[#D1D5DB] flex items-center justify-center group-hover:border-[#2563EB] transition-all cursor-pointer overflow-hidden">
                  <Camera className="w-10 h-10 text-[#9CA3AF] group-hover:text-[#2563EB] transition-colors" />
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center shadow-lg">
                  <Upload className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-xs text-[#6B7280] mt-3 text-center font-medium">
                Tải ảnh đại diện
                <br />
                <span className="text-[#9CA3AF]">PNG, JPG (Max 2MB)</span>
              </p>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-3">
                  <User className="w-4 h-4 text-[#6B7280]" />
                  Họ và tên <span className="text-[#EF4444] ml-1">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Nhập họ và tên đầy đủ"
                  className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all text-[#111827] placeholder:text-[#9CA3AF] hover:border-[#D1D5DB]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-3">
                  <Phone className="w-4 h-4 text-[#6B7280]" />
                  Số điện thoại <span className="text-[#EF4444] ml-1">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="0901 234 567"
                  className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all text-[#111827] placeholder:text-[#9CA3AF] hover:border-[#D1D5DB]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-3">
                  <Mail className="w-4 h-4 text-[#6B7280]" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="hocsinh@email.com"
                  className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all text-[#111827] placeholder:text-[#9CA3AF] hover:border-[#D1D5DB]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-3">
                <Calendar className="w-4 h-4 text-[#6B7280]" />
                Ngày sinh
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange("dob", e.target.value)}
                className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all text-[#111827] hover:border-[#D1D5DB]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-3">
                Giới tính
              </label>
              <div className="flex items-center gap-4 h-[50px]">
                {[
                  { value: "male", label: "Nam" },
                  { value: "female", label: "Nữ" },
                  { value: "other", label: "Khác" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <div className="relative">
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={formData.gender === option.value}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        className="w-5 h-5 text-[#2563EB] border-2 border-[#D1D5DB] focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 cursor-pointer"
                      />
                    </div>
                    <span className="text-sm font-medium text-[#374151] group-hover:text-[#2563EB] transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-3">
                <MapPin className="w-4 h-4 text-[#6B7280]" />
                Địa chỉ
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                rows={3}
                className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none transition-all text-[#111827] placeholder:text-[#9CA3AF] hover:border-[#D1D5DB]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Academic Information */}
        <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow mb-6">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#F3F4F6]">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]">
              <BookOpen className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#111827]">
                Thông tin học tập
              </h2>
              <p className="text-sm text-[#6B7280]">
                Lớp học, khóa học và thông tin liên quan
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-3">
                Lớp học
              </label>
              <select
                multiple
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all text-[#111827] hover:border-[#D1D5DB]"
                style={{ minHeight: "140px" }}
              >
                <option className="py-2 hover:bg-[#EFF6FF]">IELTS 6.5 - Sáng (T2, T4, T6)</option>
                <option className="py-2 hover:bg-[#EFF6FF]">TOEIC 750 - Chiều (T3, T5, T7)</option>
                <option className="py-2 hover:bg-[#EFF6FF]">Cambridge FCE - Tối (T2, T4)</option>
                <option className="py-2 hover:bg-[#EFF6FF]">VSTEP B2 - Cuối tuần (T7, CN)</option>
              </select>
              <div className="flex items-center gap-2 mt-2 text-xs text-[#6B7280] bg-[#F9FAFB] px-3 py-2 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                Giữ Ctrl/Cmd để chọn nhiều lớp
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-3">
                Khóa học
              </label>
              <select
                multiple
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all text-[#111827] hover:border-[#D1D5DB]"
                style={{ minHeight: "140px" }}
              >
                <option className="py-2 hover:bg-[#F0FDF4]">IELTS Foundation</option>
                <option className="py-2 hover:bg-[#F0FDF4]">IELTS Intermediate</option>
                <option className="py-2 hover:bg-[#F0FDF4]">TOEIC Basic</option>
                <option className="py-2 hover:bg-[#F0FDF4]">TOEIC Advanced</option>
                <option className="py-2 hover:bg-[#F0FDF4]">Cambridge FCE</option>
                <option className="py-2 hover:bg-[#F0FDF4]">VSTEP B2</option>
              </select>
              <div className="flex items-center gap-2 mt-2 text-xs text-[#6B7280] bg-[#F9FAFB] px-3 py-2 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                Giữ Ctrl/Cmd để chọn nhiều khóa
              </div>
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-3">
                <Hash className="w-4 h-4 text-[#6B7280]" />
                Mã học sinh
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={formData.studentId}
                    readOnly
                    className="w-full px-4 py-3.5 bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-[#6B7280] font-mono font-semibold"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-[#DBEAFE] text-[#2563EB] text-xs font-bold rounded">
                    AUTO
                  </div>
                </div>
                <button
                  type="button"
                  className="p-3.5 border border-[#E5E7EB] rounded-xl hover:bg-[#EFF6FF] hover:border-[#2563EB] transition-all group"
                >
                  <RefreshCw className="w-5 h-5 text-[#6B7280] group-hover:text-[#2563EB] group-hover:rotate-180 transition-all duration-500" />
                </button>
              </div>
              <p className="text-xs text-[#6B7280] mt-2 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                Mã tự động tạo, click để tạo lại mã mới
              </p>
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-3">
                <FileText className="w-4 h-4 text-[#6B7280]" />
                Ghi chú
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Thêm ghi chú về học sinh: năng lực, mục tiêu học tập, lưu ý đặc biệt..."
                rows={4}
                className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none transition-all text-[#111827] placeholder:text-[#9CA3AF] hover:border-[#D1D5DB]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Account */}
        <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow mb-6">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#F3F4F6]">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A]">
              <Shield className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#111827]">
                Tài khoản đăng nhập
              </h2>
              <p className="text-sm text-[#6B7280]">
                Thông tin bảo mật và quyền truy cập
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <label className="flex items-start gap-4 p-5 bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] border-2 border-[#93C5FD] rounded-xl cursor-pointer hover:shadow-md transition-all group">
              <input
                type="checkbox"
                checked={autoPassword}
                onChange={(e) => setAutoPassword(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-2 border-[#2563EB] text-[#2563EB] focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-[#1E40AF]">
                    Tự động tạo mật khẩu
                  </p>
                  <span className="px-2 py-0.5 bg-[#2563EB] text-white text-xs font-bold rounded-full">
                    Khuyến nghị
                  </span>
                </div>
                <p className="text-sm text-[#6B7280]">
                  Hệ thống sẽ tạo mật khẩu mạnh và gửi qua SMS/Email cho học sinh
                </p>
              </div>
            </label>

            {!autoPassword && (
              <div className="grid grid-cols-2 gap-6 p-6 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-3">
                    Mật khẩu <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required={!autoPassword}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Nhập mật khẩu mạnh"
                      className="w-full px-4 py-3.5 pr-12 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#2563EB] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] transition-all rounded-full"
                        style={{ width: "75%" }}
                      />
                    </div>
                    <span className="text-xs text-[#10B981] font-bold px-2 py-0.5 bg-[#D1FAE5] rounded">
                      Mạnh
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-3">
                    Xác nhận mật khẩu <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="password"
                    required={!autoPassword}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    placeholder="Nhập lại mật khẩu"
                    className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all bg-white"
                  />
                </div>
              </div>
            )}

            <label className="flex items-center gap-3 p-4 border-2 border-[#E5E7EB] rounded-xl cursor-pointer hover:border-[#2563EB] hover:bg-[#F9FAFB] transition-all group">
              <input
                type="checkbox"
                checked={formData.sendSMS}
                onChange={(e) => handleInputChange("sendSMS", e.target.checked)}
                className="w-5 h-5 rounded border-2 border-[#D1D5DB] text-[#2563EB] focus:ring-2 focus:ring-[#2563EB] cursor-pointer"
              />
              <Phone className="w-5 h-5 text-[#6B7280] group-hover:text-[#2563EB] transition-colors" />
              <span className="text-sm font-medium text-[#374151] group-hover:text-[#2563EB] transition-colors">
                Gửi thông tin tài khoản qua SMS
              </span>
            </label>

            <div className="p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
              <label className="block text-sm font-semibold text-[#111827] mb-4">
                Trạng thái tài khoản
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange("status", formData.status === "active" ? "inactive" : "active")}
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 ${
                    formData.status === "active"
                      ? "bg-gradient-to-r from-[#10B981] to-[#059669]"
                      : "bg-[#E5E7EB]"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                      formData.status === "active"
                        ? "translate-x-9"
                        : "translate-x-1"
                    }`}
                  />
                </button>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${
                    formData.status === "active" ? "text-[#10B981]" : "text-[#6B7280]"
                  }`}>
                    {formData.status === "active" ? "Kích hoạt" : "Tạm khóa"}
                  </span>
                  {formData.status === "active" && (
                    <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  )}
                </div>
              </div>
              <p className="text-xs text-[#6B7280] mt-3">
                {formData.status === "active"
                  ? "Học sinh có thể đăng nhập và sử dụng hệ thống"
                  : "Tài khoản bị tạm khóa, học sinh không thể đăng nhập"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t-2 border-[#E5E7EB] -mx-8 px-8 py-5 flex items-center justify-between shadow-2xl rounded-t-2xl">
          <Link
            to="/giao-vien/students"
            className="flex items-center gap-2 px-6 py-3.5 border-2 border-[#E5E7EB] text-[#374151] rounded-xl hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all font-semibold"
          >
            <X className="w-5 h-5" />
            Hủy bỏ
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-6 py-3.5 border-2 border-[#E5E7EB] text-[#374151] rounded-xl hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all font-semibold"
            >
              Lưu nháp
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all font-bold"
            >
              <Save className="w-5 h-5" />
              Thêm học sinh
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}