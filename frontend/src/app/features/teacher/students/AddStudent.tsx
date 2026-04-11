import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  Upload,
  Camera,
  Save,
  X,
  Eye,
  EyeOff,
  User,
  Shield,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Baby,
  Users,
  GraduationCap,
} from "lucide-react";
import { useToast } from "../../../../hooks/useToast";
import { ToastContainer } from "../../../../components/ui";
import { StudentCredentialsModal } from "./StudentCredentialsModal";

export function AddStudent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toasts, removeToast, success, error: showError } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [autoPassword, setAutoPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [studentCredentials, setStudentCredentials] = useState<{
    name: string;
    phone: string;
    password: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    studentName: "",
    studentPhone: "",
    studentEmail: "",
    studentDoB: "",
    gender: "male",
    address: "",
    age_group: "teens" as "kids" | "teens" | "adults",
    studentPassword: "",
    confirmPassword: "",
    sendSMS: false,
    status: "active",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const ageGroups = [
    {
      value: 'kids' as const,
      label: 'Trẻ em',
      ageRange: '6-12 tuổi',
      icon: Baby,
      color: 'from-pink-400 to-purple-400',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-300',
      description: 'Lớp 1 - 5 (Tiểu học)'
    },
    {
      value: 'teens' as const,
      label: 'Thiếu niên',
      ageRange: '13-17 tuổi',
      icon: Users,
      color: 'from-orange-400 to-amber-400',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      description: 'Cấp 2 - 3 (THCS + THPT)'
    },
    {
      value: 'adults' as const,
      label: 'Người lớn',
      ageRange: '18+ tuổi',
      icon: GraduationCap,
      color: 'from-slate-400 to-gray-400',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-300',
      description: 'Sinh viên & người đi làm'
    },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      // Validate file type - accept common image formats
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        setError('Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF, WEBP, BMP, SVG)');
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate password if not auto-generating
    if (!autoPassword && !formData.studentPassword) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }
    
    setIsLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      
      // Append all form fields
      formDataToSend.append('studentName', formData.studentName);
      formDataToSend.append('studentPhone', formData.studentPhone);
      if (formData.studentEmail) formDataToSend.append('studentEmail', formData.studentEmail);
      if (formData.studentDoB) formDataToSend.append('studentDoB', formData.studentDoB);
      formDataToSend.append('gender', formData.gender);
      if (formData.address) formDataToSend.append('address', formData.address);
      formDataToSend.append('age_group', formData.age_group);
      
      // Handle password - auto-generate if checkbox is checked
      const passwordToSend = autoPassword 
        ? Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase() 
        : formData.studentPassword;
      formDataToSend.append('studentPassword', passwordToSend);
      
      formDataToSend.append('status', formData.status);
      
      // Append avatar if selected
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
        console.log('Avatar file attached:', avatarFile.name, avatarFile.size);
      }

      console.log('Submitting form data...');
      console.log('Auto password:', autoPassword);
      console.log('Password length:', passwordToSend.length);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/teacher/student`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type, let browser set it with boundary for FormData
        },
        body: formDataToSend,
      });

      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Không thể tạo học viên');
      }

      // Success - show credentials modal with password
      setStudentCredentials({
        name: formData.studentName,
        phone: formData.studentPhone,
        password: data.data?.password || passwordToSend, // Get password from response or use the one we sent
      });
      setShowCredentialsModal(true);
      
      success(`Đã tạo học viên "${formData.studentName}" thành công! 🎉`);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Có lỗi xảy ra');
      showError(err.message || 'Có lỗi xảy ra khi tạo học viên');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, title: "Thông tin cá nhân", icon: User },
    { id: 2, title: "Tài khoản", icon: Shield },
  ];

  return (
    <div className="p-8 min-h-screen pb-48 bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/giao-vien/students"
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#EA580C] mb-6 transition-colors group"
        >
          <div className="p-1.5 rounded-lg bg-white border border-[#E5E7EB] group-hover:border-[#EA580C] transition-colors">
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
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#EA580C] to-[#C2410C] text-white shadow-lg shadow-orange-500/20 mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-[#111827]">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-[#EA580C] to-[#FDBA74] mx-4 mb-8" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        {/* Section 1: Personal Information */}
        <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow mb-6">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#F3F4F6]">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5]">
              <User className="w-6 h-6 text-[#EA580C]" />
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
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] border-2 border-dashed border-[#D1D5DB] flex items-center justify-center group-hover:border-[#EA580C] transition-all cursor-pointer overflow-hidden">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-10 h-10 text-[#9CA3AF] group-hover:text-[#EA580C] transition-colors" />
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/svg+xml"
                    onChange={handleAvatarChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#EA580C] flex items-center justify-center shadow-lg">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
              <p className="text-xs text-[#6B7280] mt-3 text-center font-medium">
                Tải ảnh đại diện
                <br />
                <span className="text-[#9CA3AF]">JPG, PNG, GIF, WEBP (Max 5MB)</span>
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
                  value={formData.studentName}
                  onChange={(e) => handleInputChange("studentName", e.target.value)}
                  placeholder="Nhập họ và tên đầy đủ"
                  className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all text-[#111827] placeholder:text-[#9CA3AF] hover:border-[#D1D5DB]"
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
                  value={formData.studentPhone}
                  onChange={(e) => handleInputChange("studentPhone", e.target.value)}
                  placeholder="0901 234 567"
                  className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all text-[#111827] placeholder:text-[#9CA3AF] hover:border-[#D1D5DB]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-3">
                  <Mail className="w-4 h-4 text-[#6B7280]" />
                  Email <span className="text-[#9CA3AF] font-normal">(Không bắt buộc)</span>
                </label>
                <input
                  type="email"
                  value={formData.studentEmail}
                  onChange={(e) => handleInputChange("studentEmail", e.target.value)}
                  placeholder="hocsinh@email.com"
                  className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all text-[#111827] placeholder:text-[#9CA3AF] hover:border-[#D1D5DB]"
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
                value={formData.studentDoB}
                onChange={(e) => handleInputChange("studentDoB", e.target.value)}
                className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all text-[#111827] hover:border-[#D1D5DB]"
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
                        className="w-5 h-5 text-[#EA580C] border-2 border-[#D1D5DB] focus:ring-2 focus:ring-[#EA580C] focus:ring-offset-2 cursor-pointer"
                      />
                    </div>
                    <span className="text-sm font-medium text-[#374151] group-hover:text-[#EA580C] transition-colors">
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
                className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent resize-none transition-all text-[#111827] placeholder:text-[#9CA3AF] hover:border-[#D1D5DB]"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-[#111827] mb-3">
                Chọn độ tuổi học viên <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-[#6B7280] mb-3">
                Học viên sẽ được tự động gán vào lớp phù hợp với độ tuổi
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ageGroups.map((group) => {
                  const Icon = group.icon;
                  const isSelected = formData.age_group === group.value;
                  
                  return (
                    <button
                      key={group.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, age_group: group.value }))}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all
                        ${isSelected 
                          ? `${group.borderColor} ${group.bgColor} shadow-lg scale-105` 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }
                      `}
                    >
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className={`
                          w-12 h-12 rounded-full bg-gradient-to-r ${group.color} 
                          flex items-center justify-center
                          ${isSelected ? 'scale-110' : ''}
                          transition-transform
                        `}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{group.label}</div>
                          <div className="text-sm text-slate-600 font-medium">{group.ageRange}</div>
                          <div className="text-xs text-slate-500 mt-1">{group.description}</div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Account */}
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
            <label className="flex items-start gap-4 p-5 bg-gradient-to-r from-[#FFF7ED] to-[#FFEDD5] border-2 border-[#FDBA74] rounded-xl cursor-pointer hover:shadow-md transition-all group">
              <input
                type="checkbox"
                checked={autoPassword}
                onChange={(e) => setAutoPassword(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-2 border-[#EA580C] text-[#EA580C] focus:ring-2 focus:ring-[#EA580C] focus:ring-offset-2 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-[#C2410C]">
                    Tự động tạo mật khẩu
                  </p>
                  <span className="px-2 py-0.5 bg-[#EA580C] text-white text-xs font-bold rounded-full">
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
                      value={formData.studentPassword}
                      onChange={(e) => handleInputChange("studentPassword", e.target.value)}
                      placeholder="Nhập mật khẩu mạnh"
                      className="w-full px-4 py-3.5 pr-12 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#EA580C] transition-colors"
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
                    className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all bg-white"
                  />
                </div>
              </div>
            )}

            <label className="flex items-center gap-3 p-4 border-2 border-[#E5E7EB] rounded-xl cursor-pointer hover:border-[#EA580C] hover:bg-[#F9FAFB] transition-all group">
              <input
                type="checkbox"
                checked={formData.sendSMS}
                onChange={(e) => handleInputChange("sendSMS", e.target.checked)}
                className="w-5 h-5 rounded border-2 border-[#D1D5DB] text-[#EA580C] focus:ring-2 focus:ring-[#EA580C] cursor-pointer"
              />
              <Phone className="w-5 h-5 text-[#6B7280] group-hover:text-[#EA580C] transition-colors" />
              <span className="text-sm font-medium text-[#374151] group-hover:text-[#EA580C] transition-colors">
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
          {error && (
            <div className="flex-1 mr-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </p>
            </div>
          )}
          <Link
            to="/giao-vien/students"
            className="flex items-center gap-2 px-6 py-3.5 border-2 border-[#E5E7EB] text-[#374151] rounded-xl hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all font-semibold"
          >
            <X className="w-5 h-5" />
            Hủy bỏ
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white rounded-xl hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Thêm học sinh
                </>
              )}
            </button>
          </div>
        </div>
      </form>
      
      {/* Student Credentials Modal */}
      {studentCredentials && (
        <StudentCredentialsModal
          isOpen={showCredentialsModal}
          onClose={() => {
            setShowCredentialsModal(false);
            // Navigate to students list after closing modal
            setTimeout(() => {
              navigate('/giao-vien/students');
            }, 300);
          }}
          studentData={studentCredentials}
        />
      )}
    </div>
  );
}