import { useState, useEffect } from "react";
import { X, Upload, User, Key, Copy, Eye, EyeOff, Clock, CheckCircle2, RefreshCw } from "lucide-react";
import { getApiUrl, getAssetUrl } from "../../../../utils/apiConfig";
import { useToast } from "../../../../hooks/useToast";

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
  onSave: (updatedStudent: any) => void;
  toast?: {
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
  };
}

export function EditStudentModal({ isOpen, onClose, student, onSave, toast: toastProp }: EditStudentModalProps) {
  // Use toast from props if available, otherwise create local instance
  const localToast = useToast();
  const toast = toastProp || { 
    success: localToast.success, 
    error: localToast.error, 
    warning: localToast.warning 
  };
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    ageGroup: "teens",
    status: "active",
  });

  // Store original values for comparison
  const [originalData, setOriginalData] = useState({
    name: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    ageGroup: "teens",
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  
  // Password management states
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [timeLeft, setTimeLeft] = useState(5);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Helper function to format date to yyyy-MM-dd
  const formatDateToInput = (dateString: string): string => {
    if (!dateString) return "";
    
    try {
      // Parse the date string
      const date = new Date(dateString);
      
      // Check if valid date
      if (isNaN(date.getTime())) return "";
      
      // Format to yyyy-MM-dd with zero padding
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return "";
    }
  };

  useEffect(() => {
    if (student) {
      // Get date of birth from student data and format properly
      let dobFormatted = "";
      
      // Try to get from dateOfBirth field first (already formatted from API)
      if (student.dateOfBirth) {
        dobFormatted = formatDateToInput(student.dateOfBirth);
      } else if (student.uDoB) {
        // If from API, format it properly
        dobFormatted = formatDateToInput(student.uDoB);
      } else if (student.createdAt) {
        // Fallback: parse from Vietnamese format "dd/mm/yyyy"
        const parts = student.createdAt.split("/");
        if (parts.length === 3) {
          // Convert to ISO format then format
          dobFormatted = formatDateToInput(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      }

      const initialData = {
        name: student.name || "",
        phone: student.phone || "",
        email: student.email === "Chưa có" ? "" : student.email || "",
        dateOfBirth: dobFormatted,
        ageGroup: student.ageGroup || "teens",
        status: student.status || "active",
      };

      setFormData(initialData);
      setOriginalData(initialData); // Store original values

      // Set avatar preview from existing avatar
      if (student.avatarUrl) {
        setAvatarPreview(getAssetUrl(student.avatarUrl));
      } else {
        setAvatarPreview("");
      }
      setAvatarFile(null);
      
      // Reset password section
      setShowPasswordSection(false);
      setCurrentPassword("");
      setShowPassword(true);
      setTimeLeft(5);
    }
  }, [student]);

  // Countdown timer for password visibility
  useEffect(() => {
    if (!showPasswordSection || !currentPassword) return;

    if (timeLeft <= 0) {
      setShowPassword(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowPassword(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showPasswordSection, currentPassword, timeLeft]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        toast.error('Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF, WEBP, BMP, SVG)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 5MB');
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(currentPassword);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Không thể copy mật khẩu');
    }
  };

  const handleViewPassword = async () => {
    setLoadingPassword(true);
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(getApiUrl(`teacher/student/${student.id}/view-password`), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setCurrentPassword(data.data.password);
        setShowPasswordSection(true);
        setShowPassword(true);
        setTimeLeft(5);
      } else {
        // Show more helpful error message
        const errorMsg = data.message || 'Mật khẩu không khả dụng.';
        if (errorMsg.includes('không khả dụng')) {
          toast.error('Mật khẩu không khả dụng. Học viên này được tạo trước khi có tính năng lưu mật khẩu. Vui lòng liên hệ quản trị viên để cập nhật mật khẩu mặc định.');
        } else {
          toast.error(errorMsg);
        }
      }
    } catch (error) {
      console.error('Error viewing password:', error);
      toast.error('Có lỗi xảy ra khi xem mật khẩu');
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if anything has changed - compare with original values
    const hasNameChanged = formData.name !== originalData.name;
    const hasPhoneChanged = formData.phone !== originalData.phone;
    const hasEmailChanged = formData.email !== originalData.email;
    const hasDobChanged = formData.dateOfBirth !== originalData.dateOfBirth;
    const hasAgeGroupChanged = formData.ageGroup !== originalData.ageGroup;
    const hasStatusChanged = formData.status !== originalData.status;
    const hasAvatarChanged = avatarFile !== null;

    // Debug logging
    console.log('=== CHANGE DETECTION DEBUG ===');
    console.log('Name:', { current: formData.name, original: originalData.name, changed: hasNameChanged });
    console.log('Phone:', { current: formData.phone, original: originalData.phone, changed: hasPhoneChanged });
    console.log('Email:', { current: formData.email, original: originalData.email, changed: hasEmailChanged });
    console.log('DoB:', { current: formData.dateOfBirth, original: originalData.dateOfBirth, changed: hasDobChanged });
    console.log('AgeGroup:', { current: formData.ageGroup, original: originalData.ageGroup, changed: hasAgeGroupChanged });
    console.log('Status:', { current: formData.status, original: originalData.status, changed: hasStatusChanged });
    console.log('Avatar:', { hasFile: avatarFile !== null, changed: hasAvatarChanged });
    console.log('Has any change:', hasNameChanged || hasPhoneChanged || hasEmailChanged || hasDobChanged || hasAgeGroupChanged || hasStatusChanged || hasAvatarChanged);

    const hasAnyChange = hasNameChanged || hasPhoneChanged || hasEmailChanged || 
                         hasDobChanged || hasAgeGroupChanged || hasStatusChanged || hasAvatarChanged;

    if (!hasAnyChange) {
      toast.warning(`Không có gì thay đổi cho học viên "${student.name}"`);
      onClose(); // Close modal immediately
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        setLoading(false);
        return;
      }

      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('_method', 'PUT'); // Laravel method spoofing for file uploads
      formDataToSend.append('uName', formData.name);
      formDataToSend.append('uPhone', formData.phone);
      formDataToSend.append('uEmail', formData.email || '');
      formDataToSend.append('uDoB', formData.dateOfBirth);
      formDataToSend.append('age_group', formData.ageGroup);
      formDataToSend.append('uStatus', formData.status);
      
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }

      const response = await fetch(getApiUrl(`teacher/student/${student.id}`), {
        method: 'POST', // Use POST with _method=PUT for file uploads
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type, let browser set it with boundary
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result.data);
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Có lỗi xảy ra khi cập nhật học viên");
      }
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error("Có lỗi xảy ra khi cập nhật học viên");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              Chỉnh sửa học viên
            </h2>
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Cập nhật thông tin học viên. Nhấn lưu khi hoàn tất.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 pt-0 space-y-4">
            {/* Avatar Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Ảnh đại diện
              </label>
              <div className="flex items-center gap-4">
                {/* Avatar Preview */}
                <div className="relative">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar preview" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center border-2 border-gray-200">
                      <User className="w-10 h-10 text-orange-600" />
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="flex-1">
                  <label 
                    htmlFor="avatar-upload"
                    className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 border border-gray-300 bg-white hover:bg-gray-100 h-10 px-4 py-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Chọn ảnh mới
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/svg+xml"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG, GIF, WEBP, BMP, SVG (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium leading-none">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                  placeholder="0336695863"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label htmlFor="dob" className="text-sm font-medium leading-none">
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <input
                id="dob"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                required
              />
            </div>

            {/* Age Group & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="ageGroup" className="text-sm font-medium leading-none">
                  Nhóm lớp
                </label>
                <select
                  id="ageGroup"
                  value={formData.ageGroup}
                  onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                >
                  <option value="kids">👶 Trẻ em (6-12)</option>
                  <option value="teens">🎓 Thiếu niên (13-17)</option>
                  <option value="adults">👔 Người lớn (18+)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium leading-none">
                  Trạng thái
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                >
                  <option value="active">✅ Đang học</option>
                  <option value="inactive">⏸️ Tạm nghỉ</option>
                </select>
              </div>
            </div>

            {/* Password Management Section */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-600" />
                  <label className="text-sm font-medium leading-none">
                    Xem mật khẩu
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleViewPassword}
                  disabled={loadingPassword}
                  className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 h-9 px-3 py-2"
                >
                  {loadingPassword ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Xem mật khẩu
                    </>
                  )}
                </button>
              </div>

              {showPasswordSection && currentPassword && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      {timeLeft > 0 ? (
                        <Clock className="w-4 h-4 text-blue-600" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium text-blue-900">
                        {timeLeft > 0 
                          ? `Mật khẩu (ẩn sau ${timeLeft}s)` 
                          : 'Mật khẩu đã được ẩn'}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white border border-blue-300 rounded-md px-3 py-2 font-mono text-sm">
                          {showPassword ? currentPassword : '••••••••••••'}
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 border border-blue-300 bg-white hover:bg-blue-50 h-10 w-10"
                          title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-blue-700" />
                          ) : (
                            <Eye className="w-4 h-4 text-blue-700" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleCopyPassword}
                          className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 border border-blue-300 bg-white hover:bg-blue-50 h-10 px-3"
                        >
                          {copiedPassword ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="text-green-700">Đã copy</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-blue-700" />
                              <span className="text-blue-700">Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-xs text-blue-700">
                        ⚠️ Mật khẩu chỉ hiển thị một lần. Vui lòng copy và gửi cho học viên ngay.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 pt-0">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-100 h-10 px-4 py-2"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-600 text-white hover:bg-orange-700 h-10 px-4 py-2"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
