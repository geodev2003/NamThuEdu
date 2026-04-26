import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { Header } from "../../../components/shared/Header";
import { ToastContainer } from "../../../../components/ui/ToastContainer";
import { useToast } from "../../../../hooks/useToast";
import { usePageTitle, PAGE_TITLES } from "../../../../hooks/usePageTitle";
import { teacherApi } from "../../../../services/teacherApi";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  CheckCircle2,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Laptop,
  LogOut,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function Settings() {
  usePageTitle(PAGE_TITLES.TEACHER_SETTINGS);
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Get user info from localStorage as fallback
  const userStr = localStorage.getItem('user');
  const localUser = userStr ? JSON.parse(userStr) : null;
  const userName = userProfile?.name || userProfile?.uName || localUser?.name || localUser?.uName || 'Teacher';
  const userPhone = userProfile?.phone || userProfile?.uPhone || localUser?.phone || localUser?.uPhone || '';
  const userEmail = userProfile?.email || `${userPhone}@namthuedu.com`;

  const activeTab = searchParams.get("tab") || "profile";

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Fetch user profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await teacherApi.user.getProfile();
        if (response.status === 'success' && response.data) {
          setUserProfile(response.data);
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const tabs = [
    { id: "profile", label: "Hồ sơ cá nhân", icon: User },
    { id: "account", label: "Tài khoản", icon: Shield },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "appearance", label: "Giao diện", icon: Palette },
    { id: "language", label: "Ngôn ngữ", icon: Globe },
  ];

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  const handleSave = () => {
    toast.success("Đã lưu thay đổi thành công!");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      <Header
        breadcrumb={[t("breadcrumb.dashboard"), t("breadcrumb.settings")]}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: "#EEEEF3" }}>
        <div className="px-8 py-6">
          {/* Header Section */}
          <div
            className="mb-6"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(-12px)",
              transition: "opacity 400ms ease, transform 400ms ease",
            }}
          >
            <h1
              className="text-[#111827] mb-2"
              style={{ fontSize: "32px", fontWeight: 700 }}
            >
              Cài đặt
            </h1>
            <p
              className="text-[#6B7280]"
              style={{ fontSize: "15px", lineHeight: "1.6" }}
            >
              Quản lý thông tin cá nhân và tùy chỉnh hệ thống
            </p>
          </div>

          <div className="flex gap-6">
            {/* Sidebar Navigation */}
            <div
              className={`flex-shrink-0 transition-all duration-300 ${
                sidebarCollapsed ? "w-[70px]" : "w-[280px]"
              }`}
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateX(-12px)" : "translateX(-24px)",
                transition: "opacity 400ms ease 100ms, transform 400ms ease 100ms, width 300ms ease",
              }}
            >
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-3 relative">
                {/* Toggle Button */}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="absolute -right-3 top-6 w-6 h-6 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#EA580C] hover:border-[#EA580C] transition-all shadow-sm z-10"
                  title={sidebarCollapsed ? "Mở rộng" : "Thu gọn"}
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </button>

                <div className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`w-full flex items-center rounded-lg transition-all duration-200 ${
                          sidebarCollapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3"
                        }`}
                        style={{
                          background: isActive
                            ? "linear-gradient(135deg, #EA580C 0%, #C2410C 100%)"
                            : "transparent",
                          color: isActive ? "#FFFFFF" : "#6B7280",
                          fontSize: "14px",
                          fontWeight: isActive ? 600 : 500,
                        }}
                        title={sidebarCollapsed ? tab.label : undefined}
                      >
                        <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                        {!sidebarCollapsed && <span>{tab.label}</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Logout Button */}
                <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                  <button
                    className={`w-full flex items-center rounded-lg text-[#EF4444] hover:bg-[#FEE2E2] transition-all duration-200 ${
                      sidebarCollapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3"
                    }`}
                    title={sidebarCollapsed ? "Đăng xuất" : undefined}
                  >
                    <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>
                        Đăng xuất
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div
              className="flex-1"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 400ms ease 200ms, transform 400ms ease 200ms",
              }}
            >
              {activeTab === "profile" && <ProfileTab userName={userName} userEmail={userEmail} userProfile={userProfile} onSave={handleSave} loading={loading} toast={toast} />}
              {activeTab === "account" && <AccountTab onSave={handleSave} showPassword={showPassword} setShowPassword={setShowPassword} toast={toast} />}
              {activeTab === "notifications" && <NotificationsTab onSave={handleSave} />}
              {activeTab === "appearance" && <AppearanceTab onSave={handleSave} />}
              {activeTab === "language" && <LanguageTab currentLang={i18n.language} onSave={handleSave} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ userName, userEmail, userProfile, onSave, loading, toast }: { userName: string; userEmail: string; userProfile: any; onSave: () => void; loading: boolean; toast: any }) {
  const [formData, setFormData] = useState({
    name: userName,
    email: userEmail,
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    bio: userProfile?.bio || '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || userProfile.uName || userName,
        email: userProfile.email || userEmail,
        phone: userProfile.phone || userProfile.uPhone || '',
        address: userProfile.address || '',
        bio: userProfile.bio || '',
      });
    }
  }, [userProfile, userName, userEmail]);

  const handleSubmit = async () => {
    try {
      await teacherApi.user.updateProfile(formData);
      toast.success('Đã cập nhật thông tin thành công!');
      onSave();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Không thể cập nhật thông tin');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <h3
          className="text-[#111827] mb-6"
          style={{ fontSize: "18px", fontWeight: 700 }}
        >
          Ảnh đại diện
        </h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white"
              style={{
                background: "linear-gradient(135deg, #EA580C 0%, #C2410C 100%)",
                fontSize: "32px",
                fontWeight: 700,
              }}
            >
              NT
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#EA580C] rounded-full flex items-center justify-center text-white hover:bg-[#C2410C] transition-colors border-2 border-white">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h4
              className="text-[#111827] mb-1"
              style={{ fontSize: "16px", fontWeight: 600 }}
            >
              {userName}
            </h4>
            <p className="text-[#6B7280] mb-3" style={{ fontSize: "14px" }}>
              Giáo viên
            </p>
            <div className="flex gap-3">
              <button className="h-9 px-4 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors">
                <span style={{ fontSize: "14px", fontWeight: 500 }}>
                  Tải ảnh lên
                </span>
              </button>
              <button className="h-9 px-4 bg-[#F3F4F6] text-[#6B7280] rounded-lg hover:bg-[#E5E7EB] transition-colors">
                <span style={{ fontSize: "14px", fontWeight: 500 }}>Xóa</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <h3
          className="text-[#111827] mb-6"
          style={{ fontSize: "18px", fontWeight: 700 }}
        >
          Thông tin cá nhân
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label
              className="block text-[#374151] mb-2"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              Họ và tên <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all"
              style={{ fontSize: "14px" }}
            />
          </div>

          <div>
            <label
              className="block text-[#374151] mb-2"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              Email <span className="text-[#EF4444]">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-11 pl-11 pr-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all"
                style={{ fontSize: "14px" }}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-[#374151] mb-2"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              Số điện thoại
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-11 pl-11 pr-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all"
                style={{ fontSize: "14px" }}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-[#374151] mb-2"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              Chức vụ
            </label>
            <select className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all">
              <option>Giáo viên</option>
              <option>Trợ giảng</option>
              <option>Quản lý</option>
            </select>
          </div>

          <div className="col-span-2">
            <label
              className="block text-[#374151] mb-2"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              Địa chỉ
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-[#9CA3AF]" />
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all resize-none"
                style={{ fontSize: "14px" }}
              />
            </div>
          </div>

          <div className="col-span-2">
            <label
              className="block text-[#374151] mb-2"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              Giới thiệu
            </label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Viết vài dòng giới thiệu về bản thân..."
              className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all resize-none"
              style={{ fontSize: "14px" }}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 h-11 px-6 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors"
        >
          <Save className="w-[18px] h-[18px]" />
          <span style={{ fontSize: "14px", fontWeight: 500 }}>Lưu thay đổi</span>
        </button>
      </div>
    </div>
  );
}

function AccountTab({
  onSave,
  showPassword,
  setShowPassword,
  toast,
}: {
  onSave: () => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  toast: any;
}) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  // Fetch sessions from API
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoadingSessions(true);
        const response = await teacherApi.user.getSessions();
        if (response.status === 'success' && response.data) {
          setSessions(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        // Use mock data as fallback
        setSessions([
          {
            id: '1',
            device: 'Windows - Chrome',
            location: 'Hồ Chí Minh, Việt Nam',
            lastActive: new Date().toISOString(),
            isCurrent: true,
          },
        ]);
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchSessions();
  }, []);

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwords.new.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    try {
      await teacherApi.user.changePassword(passwords.current, passwords.new, passwords.confirm);
      toast.success('Đã đổi mật khẩu thành công!');
      setPasswords({ current: '', new: '', confirm: '' });
      onSave();
    } catch (error: any) {
      console.error('Failed to change password:', error);
      const message = error?.response?.data?.message || 'Không thể đổi mật khẩu';
      toast.error(message);
    }
  };

  const handleLogoutSession = async (sessionId: string) => {
    try {
      await teacherApi.user.logoutSession(sessionId);
      toast.success('Đã đăng xuất khỏi phiên thành công!');
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (error) {
      console.error('Failed to logout session:', error);
      toast.error('Không thể đăng xuất khỏi phiên');
    }
  };
  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <h3
          className="text-[#111827] mb-6"
          style={{ fontSize: "18px", fontWeight: 700 }}
        >
          Đổi mật khẩu
        </h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label
              className="block text-[#374151] mb-2"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full h-11 pl-11 pr-11 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all"
                style={{ fontSize: "14px" }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              className="block text-[#374151] mb-2"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              Mật khẩu mới
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full h-11 pl-11 pr-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all"
                style={{ fontSize: "14px" }}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-[#374151] mb-2"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full h-11 pl-11 pr-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all"
                style={{ fontSize: "14px" }}
              />
            </div>
          </div>

          <div className="bg-[#FEF3C7] border border-[#FDE047] rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[#92400E]" style={{ fontSize: "13px", lineHeight: "1.5" }}>
                Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3
              className="text-[#111827] mb-2"
              style={{ fontSize: "18px", fontWeight: 700 }}
            >
              Xác thực hai yếu tố (2FA)
            </h3>
            <p className="text-[#6B7280]" style={{ fontSize: "14px" }}>
              Tăng cường bảo mật cho tài khoản của bạn
            </p>
          </div>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#D1D5DB] transition-colors hover:bg-[#9CA3AF]">
            <span className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <h3
          className="text-[#111827] mb-6"
          style={{ fontSize: "18px", fontWeight: 700 }}
        >
          Phiên đăng nhập
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 border border-[#E5E7EB] rounded-lg">
            <div className="w-10 h-10 bg-[#FFEDD5] rounded-lg flex items-center justify-center">
              <Laptop className="w-5 h-5 text-[#EA580C]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4
                  className="text-[#111827]"
                  style={{ fontSize: "14px", fontWeight: 600 }}
                >
                  Windows - Chrome
                </h4>
                <span
                  className="px-2 py-0.5 bg-[#D1FAE5] text-[#065F46] rounded-full"
                  style={{ fontSize: "11px", fontWeight: 600 }}
                >
                  HIỆN TẠI
                </span>
              </div>
              <p className="text-[#6B7280]" style={{ fontSize: "13px" }}>
                Hồ Chí Minh, Việt Nam • Đăng nhập lúc 14:30, hôm nay
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 border border-[#E5E7EB] rounded-lg">
            <div className="w-10 h-10 bg-[#FED7AA] rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-[#6366F1]" />
            </div>
            <div className="flex-1">
              <h4
                className="text-[#111827] mb-1"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                iPhone - Safari
              </h4>
              <p className="text-[#6B7280]" style={{ fontSize: "13px" }}>
                Hồ Chí Minh, Việt Nam • Đăng nhập lúc 08:15, hôm nay
              </p>
            </div>
            <button className="text-[#EF4444] hover:text-[#DC2626]">
              <span style={{ fontSize: "13px", fontWeight: 500 }}>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl p-6 border border-[#EF4444]">
        <h3
          className="text-[#EF4444] mb-6"
          style={{ fontSize: "18px", fontWeight: 700 }}
        >
          Vùng nguy hiểm
        </h3>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h4
                className="text-[#111827] mb-1"
                style={{ fontSize: "15px", fontWeight: 600 }}
              >
                Xóa tài khoản
              </h4>
              <p className="text-[#6B7280]" style={{ fontSize: "14px" }}>
                Xóa vĩnh viễn tài khoản và tất cả dữ liệu của bạn
              </p>
            </div>
            <button className="flex items-center gap-2 h-10 px-4 bg-[#FEE2E2] text-[#EF4444] rounded-lg hover:bg-[#FECACA] transition-colors">
              <Trash2 className="w-4 h-4" />
              <span style={{ fontSize: "14px", fontWeight: 500 }}>Xóa tài khoản</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <button
          onClick={onSave}
          className="flex items-center gap-2 h-11 px-6 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors"
        >
          <Save className="w-[18px] h-[18px]" />
          <span style={{ fontSize: "14px", fontWeight: 500 }}>Lưu thay đổi</span>
        </button>
      </div>
    </div>
  );
}

function NotificationsTab({ onSave }: { onSave: () => void }) {
  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <h3
          className="text-[#111827] mb-6"
          style={{ fontSize: "18px", fontWeight: 700 }}
        >
          Thông báo qua Email
        </h3>
        <div className="space-y-4">
          {[
            { label: "Học viên mới đăng ký", desc: "Nhận thông báo khi có học viên mới" },
            { label: "Bài tập được nộp", desc: "Thông báo khi học viên nộp bài tập" },
            { label: "Tin nhắn mới", desc: "Nhận thông báo tin nhắn từ học viên" },
            { label: "Báo cáo hàng tuần", desc: "Tóm tắt hoạt động trong tuần" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-[#E5E7EB] last:border-0">
              <div>
                <h4
                  className="text-[#111827] mb-1"
                  style={{ fontSize: "14px", fontWeight: 600 }}
                >
                  {item.label}
                </h4>
                <p className="text-[#6B7280]" style={{ fontSize: "13px" }}>
                  {item.desc}
                </p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#EA580C] transition-colors">
                <span className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-[22px]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <h3
          className="text-[#111827] mb-6"
          style={{ fontSize: "18px", fontWeight: 700 }}
        >
          Thông báo đẩy
        </h3>
        <div className="space-y-4">
          {[
            { label: "Nhắc nhở lịch dạy", desc: "Nhắc trước 15 phút khi có lớp học" },
            { label: "Thông báo hệ thống", desc: "Cập nhật quan trọng từ hệ thống" },
            { label: "Âm thanh thông báo", desc: "Phát âm thanh khi có thông báo mới" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-[#E5E7EB] last:border-0">
              <div>
                <h4
                  className="text-[#111827] mb-1"
                  style={{ fontSize: "14px", fontWeight: 600 }}
                >
                  {item.label}
                </h4>
                <p className="text-[#6B7280]" style={{ fontSize: "13px" }}>
                  {item.desc}
                </p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#EA580C] transition-colors">
                <span className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-[22px]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <button
          onClick={onSave}
          className="flex items-center gap-2 h-11 px-6 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors"
        >
          <Save className="w-[18px] h-[18px]" />
          <span style={{ fontSize: "14px", fontWeight: 500 }}>Lưu thay đổi</span>
        </button>
      </div>
    </div>
  );
}

function AppearanceTab({ onSave }: { onSave: () => void }) {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <h3
          className="text-[#111827] mb-6"
          style={{ fontSize: "18px", fontWeight: 700 }}
        >
          Chủ đề giao diện
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: "light", label: "Sáng", icon: Sun },
            { id: "dark", label: "Tối", icon: Moon },
            { id: "system", label: "Hệ thống", icon: Monitor },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = theme === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTheme(item.id as any)}
                className="relative p-6 border-2 rounded-xl transition-all duration-200"
                style={{
                  borderColor: isActive ? "#EA580C" : "#E5E7EB",
                  background: isActive ? "#FFF7ED" : "#FFFFFF",
                }}
              >
                {isActive && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-[#EA580C] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{
                      background: isActive ? "#EA580C" : "#F3F4F6",
                      color: isActive ? "#FFFFFF" : "#6B7280",
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className="text-[#111827]"
                    style={{ fontSize: "14px", fontWeight: 600 }}
                  >
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <h3
          className="text-[#111827] mb-6"
          style={{ fontSize: "18px", fontWeight: 700 }}
        >
          Hiển thị
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
            <div>
              <h4
                className="text-[#111827] mb-1"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                Chế độ thu gọn sidebar
              </h4>
              <p className="text-[#6B7280]" style={{ fontSize: "13px" }}>
                Thu gọn menu điều hướng bên trái
              </p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#D1D5DB] transition-colors">
              <span className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-0.5" />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h4
                className="text-[#111827] mb-1"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                Hiệu ứng động
              </h4>
              <p className="text-[#6B7280]" style={{ fontSize: "13px" }}>
                Bật/tắt animation và transitions
              </p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#EA580C] transition-colors">
              <span className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-[22px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <button
          onClick={onSave}
          className="flex items-center gap-2 h-11 px-6 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors"
        >
          <Save className="w-[18px] h-[18px]" />
          <span style={{ fontSize: "14px", fontWeight: 500 }}>Lưu thay đổi</span>
        </button>
      </div>
    </div>
  );
}

function LanguageTab({ currentLang, onSave }: { currentLang: string; onSave: () => void }) {
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(currentLang);

  const handleLanguageChange = (lang: string) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <h3
          className="text-[#111827] mb-6"
          style={{ fontSize: "18px", fontWeight: 700 }}
        >
          Ngôn ngữ hiển thị
        </h3>
        <div className="space-y-3">
          {[
            { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
            { code: "en", label: "English", flag: "🇬🇧" },
          ].map((lang) => {
            const isActive = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all duration-200"
                style={{
                  borderColor: isActive ? "#EA580C" : "#E5E7EB",
                  background: isActive ? "#FFF7ED" : "#FFFFFF",
                }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: "24px" }}>{lang.flag}</span>
                  <span
                    className="text-[#111827]"
                    style={{ fontSize: "15px", fontWeight: 600 }}
                  >
                    {lang.label}
                  </span>
                </div>
                {isActive && (
                  <CheckCircle2 className="w-5 h-5 text-[#EA580C]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Regional Settings */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <h3
          className="text-[#111827] mb-6"
          style={{ fontSize: "18px", fontWeight: 700 }}
        >
          Cài đặt khu vực
        </h3>
        <div className="space-y-4">
          <div>
            <label
              className="block text-[#374151] mb-2"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              Múi giờ
            </label>
            <select className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all">
              <option>(GMT+7) Bangkok, Hanoi, Jakarta</option>
              <option>(GMT+8) Beijing, Hong Kong, Singapore</option>
              <option>(GMT+9) Tokyo, Seoul</option>
            </select>
          </div>

          <div>
            <label
              className="block text-[#374151] mb-2"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              Định dạng ngày
            </label>
            <select className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all">
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label
              className="block text-[#374151] mb-2"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              Định dạng giờ
            </label>
            <select className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all">
              <option>24 giờ (14:30)</option>
              <option>12 giờ (2:30 PM)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <button
          onClick={onSave}
          className="flex items-center gap-2 h-11 px-6 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors"
        >
          <Save className="w-[18px] h-[18px]" />
          <span style={{ fontSize: "14px", fontWeight: 500 }}>Lưu thay đổi</span>
        </button>
      </div>
    </div>
  );
}


