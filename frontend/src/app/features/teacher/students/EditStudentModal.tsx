import { useState, useEffect } from "react";
import { getAuthToken } from '../../../../utils/authStorage';
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, Upload, User } from "lucide-react";
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
  const { t } = useTranslation();
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
      
    }
  }, [student]);


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        toast.error(t('teacher.students.editStudent.toast.invalidImage'));
        return;
      }

      // Validate file size (max 20MB)
      if (file.size > 20 * 1024 * 1024) {
        toast.error(t('teacher.students.editStudent.toast.imageTooLarge'));
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
      toast.warning(t('teacher.students.editStudent.toast.noChange', { name: student.name }));
      onClose(); // Close modal immediately
      return;
    }

    setLoading(true);

    try {
      const token = getAuthToken();
      
      if (!token) {
        toast.error(t('teacher.students.editStudent.toast.loginRequired'));
        setLoading(false);
        return;
      }

      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('_method', 'PUT'); // Laravel method spoofing (PHP doesn't parse multipart PUT)
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
        method: 'POST', // POST + _method=PUT for file upload compatibility
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type, let browser set it with boundary
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result.data);

        // Log activity (best-effort)
        const { logTeacherActivity } = await import("../../../../services/teacherActivityLog");
        logTeacherActivity({
          action: "student.update",
          entity_type: "student",
          entity_id: student?.id ?? null,
          detail: `Cập nhật học viên: ${formData.name}`,
          meta: { age_group: formData.ageGroup, status: formData.status },
        });

        onClose();
      } else {
        const errorData = await response.json();
        console.error('Update failed:', response.status, errorData);
        toast.error(errorData.message || t('teacher.students.editStudent.toast.updateError'));
      }
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error(t('teacher.students.editStudent.toast.updateError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <motion.div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.93, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              {t('teacher.students.editStudent.title')}
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
            {t('teacher.students.editStudent.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 pt-0 space-y-4">
            {/* Avatar Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {t('teacher.students.editStudent.avatar')}
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
                    {t('teacher.students.editStudent.chooseNewPhoto')}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/svg+xml"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG, GIF, WEBP, BMP, SVG (Max 20MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('teacher.students.editStudent.name')} <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={t('teacher.students.editStudent.name')}
                required
              />
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium leading-none">
                  {t('teacher.students.editStudent.phone')} <span className="text-red-500">*</span>
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
                {t('teacher.students.editStudent.dob')} <span className="text-red-500">*</span>
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
                  {t('teacher.students.editStudent.ageGroup')}
                </label>
                <select
                  id="ageGroup"
                  value={formData.ageGroup}
                  onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                >
                  <option value="kids">{t('teacher.students.editStudent.ageGroupOptions.kids')}</option>
                  <option value="teens">{t('teacher.students.editStudent.ageGroupOptions.teens')}</option>
                  <option value="adults">{t('teacher.students.editStudent.ageGroupOptions.adults')}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium leading-none">
                  {t('teacher.students.editStudent.statusLabel')}
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                >
                  <option value="active">{t('teacher.students.editStudent.statusOptions.active')}</option>
                  <option value="inactive">{t('teacher.students.editStudent.statusOptions.inactive')}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 pt-0">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-100 h-10 px-4 py-2"
            >
              {t('teacher.students.editStudent.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-600 text-white hover:bg-orange-700 h-10 px-4 py-2"
            >
              {loading ? t('teacher.students.editStudent.saving') : t('teacher.students.editStudent.save')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
}
