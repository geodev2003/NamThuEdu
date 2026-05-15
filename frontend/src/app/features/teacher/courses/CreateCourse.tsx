import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  BookOpen,
  Upload,
  Target,
  Globe,
  GraduationCap,
  Users,
  Clock,
  Calendar,
  DollarSign,
  Settings as SettingsIcon,
  Save,
  CheckCircle2,
  X,
  Plus,
  Minus,
  Info,
  Sparkles,
  ChevronDown,
} from "lucide-react";

interface ScheduleDay {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

const weekDays = [
  { key: "mon", label: "Thứ 2" },
  { key: "tue", label: "Thứ 3" },
  { key: "wed", label: "Thứ 4" },
  { key: "thu", label: "Thứ 5" },
  { key: "fri", label: "Thứ 6" },
  { key: "sat", label: "Thứ 7" },
  { key: "sun", label: "CN" },
];

export function CreateCourse() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Form state
  const [courseName, setCourseName] = useState("");
  const [category, setCategory] = useState<"VSTEP" | "IELTS" | "Cambridge" | "">("");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [maxStudents, setMaxStudents] = useState(30);
  const [duration, setDuration] = useState("");
  const [scheduleMode, setScheduleMode] = useState<"text" | "visual">("visual");
  const [scheduleText, setScheduleText] = useState("");
  const [scheduleDays, setScheduleDays] = useState<ScheduleDay[]>(
    weekDays.map((d) => ({
      day: d.key,
      enabled: false,
      startTime: "19:00",
      endTime: "21:00",
    }))
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [courseFee, setCourseFee] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("full");
  const [courseStatus, setCourseStatus] = useState<"draft" | "active">("draft");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [enableEnrollment, setEnableEnrollment] = useState(false);
  const [enrollmentCode, setEnrollmentCode] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Category options
  const categoryOptions = {
    VSTEP: ["B1", "B2", "C1"],
    IELTS: ["5.0-6.0", "6.5-7.0", "7.5+"],
    Cambridge: ["KET", "PET", "FCE"],
  };

  // Toggle schedule day
  const toggleDay = (dayKey: string) => {
    setScheduleDays((prev) =>
      prev.map((d) => (d.day === dayKey ? { ...d, enabled: !d.enabled } : d))
    );
    setIsDirty(true);
  };

  // Update schedule time
  const updateScheduleTime = (dayKey: string, field: "startTime" | "endTime", value: string) => {
    setScheduleDays((prev) =>
      prev.map((d) => (d.day === dayKey ? { ...d, [field]: value } : d))
    );
    setIsDirty(true);
  };

  // Generate schedule preview
  const getSchedulePreview = () => {
    if (scheduleMode === "text") return scheduleText;

    const enabledDays = scheduleDays.filter((d) => d.enabled);
    if (enabledDays.length === 0) return "Chưa chọn lịch học";

    const dayLabels = enabledDays.map(
      (d) => weekDays.find((wd) => wd.key === d.day)?.label || ""
    );
    const timeRange = `${enabledDays[0].startTime}-${enabledDays[0].endTime}`;
    return `${dayLabels.join(", ")} - ${timeRange}`;
  };

  // Calculate course duration
  const calculateDuration = () => {
    if (!startDate || !endDate) return "";

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const months = Math.floor(diffDays / 30);

    if (months > 0) return `${months} tháng`;
    if (weeks > 0) return `${weeks} tuần`;
    return `${diffDays} ngày`;
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
      setIsDirty(true);
    }
  };

  // Remove tag
  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
    setIsDirty(true);
  };

  // Generate enrollment code
  const generateEnrollmentCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setEnrollmentCode(code);
    setIsDirty(true);
  };

  // Auto-save simulation
  const handleAutoSave = () => {
    setLastSaved(new Date());
    console.log("Auto-saved at", new Date());
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating course...", {
      courseName,
      category,
      subCategory,
      description,
      maxStudents,
      duration,
      schedule: getSchedulePreview(),
      startDate,
      endDate,
      courseFee,
      courseStatus,
    });
    setShowSuccessModal(true);
    setIsDirty(false);
  };

  // Handle cancel
  const handleCancel = () => {
    if (isDirty) {
      if (confirm("Bạn có chắc muốn hủy? Các thay đổi chưa lưu sẽ bị mất.")) {
        navigate("/giao-vien/khoa-hoc");
      }
    } else {
      navigate("/giao-vien/khoa-hoc");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo khóa học mới</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Link to="/giao-vien" className="hover:text-orange-600 transition-colors">
                    Dashboard
                  </Link>
                  <span>/</span>
                  <Link to="/giao-vien/khoa-hoc" className="hover:text-orange-600 transition-colors">
                    Khóa học
                  </Link>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">Tạo khóa học</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {lastSaved && (
                <span className="text-sm text-gray-500">
                  Lưu lần cuối: {lastSaved.toLocaleTimeString("vi-VN")}
                </span>
              )}
              <button
                type="button"
                onClick={handleAutoSave}
                className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 font-medium"
              >
                <Save className="w-4 h-4" />
                Lưu nháp
              </button>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Section 1: Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Thông tin cơ bản</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Banner Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ảnh bìa khóa học
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-orange-400 transition-colors cursor-pointer bg-gray-50 hover:bg-orange-50/50">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Kéo thả ảnh hoặc click để chọn
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WebP (Tỷ lệ 16:9, tối đa 20MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên khóa học <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={courseName}
                  onChange={(e) => {
                    setCourseName(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="VD: Khóa học VSTEP B1-B2 - Buổi tối"
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">Tên khóa học dễ nhớ, mô tả rõ ràng</p>
                  <p className="text-xs text-gray-400">{courseName.length}/100</p>
                </div>
              </div>

              {/* Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {(["VSTEP", "IELTS", "Cambridge"] as const).map((cat) => (
                      <div
                        key={cat}
                        onClick={() => {
                          setCategory(cat);
                          setSubCategory("");
                          setIsDirty(true);
                        }}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          category === cat
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              cat === "VSTEP"
                                ? "bg-orange-100"
                                : cat === "IELTS"
                                  ? "bg-purple-100"
                                  : "bg-green-100"
                            }`}
                          >
                            {cat === "VSTEP" && <Target className="w-5 h-5 text-orange-600" />}
                            {cat === "IELTS" && <Globe className="w-5 h-5 text-purple-600" />}
                            {cat === "Cambridge" && (
                              <GraduationCap className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{cat}</p>
                          </div>
                          {category === cat && (
                            <CheckCircle2 className="w-5 h-5 text-orange-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-category */}
                {category && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Cấp độ <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {categoryOptions[category].map((sub) => (
                        <div
                          key={sub}
                          onClick={() => {
                            setSubCategory(sub);
                            setIsDirty(true);
                          }}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            subCategory === sub
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">{sub}</span>
                            {subCategory === sub && (
                              <CheckCircle2 className="w-4 h-4 text-orange-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Mô tả</label>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    AI gợi ý
                  </button>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setIsDirty(true);
                  }}
                  rows={4}
                  maxLength={1000}
                  placeholder="Mô tả chi tiết về khóa học, đối tượng học viên, mục tiêu..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">Mô tả giúp học viên hiểu rõ khóa học</p>
                  <p className="text-xs text-gray-400">{description.length}/1000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Course Configuration */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <SettingsIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Cấu hình khóa học</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Max Students & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sĩ số tối đa <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => maxStudents > 1 && setMaxStudents(maxStudents - 1)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <input
                      type="number"
                      required
                      value={maxStudents}
                      onChange={(e) => {
                        setMaxStudents(parseInt(e.target.value) || 0);
                        setIsDirty(true);
                      }}
                      min={1}
                      max={100}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => maxStudents < 100 && setMaxStudents(maxStudents + 1)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Từ 1 đến 100 học viên</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Thời lượng mỗi buổi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={duration}
                      onChange={(e) => {
                        setDuration(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="VD: 2 giờ, 90 phút"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Thời lượng mỗi buổi học</p>
                </div>
              </div>

              {/* Schedule Mode Toggle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Lịch học <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setScheduleMode("visual")}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                      scheduleMode === "visual"
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Chọn trực quan
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleMode("text")}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                      scheduleMode === "text"
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Nhập văn bản
                  </button>
                </div>

                {/* Visual Schedule Builder */}
                {scheduleMode === "visual" && (
                  <div className="space-y-4">
                    {/* Days Selection */}
                    <div className="grid grid-cols-7 gap-2">
                      {weekDays.map((day) => {
                        const dayData = scheduleDays.find((d) => d.day === day.key);
                        return (
                          <button
                            key={day.key}
                            type="button"
                            onClick={() => toggleDay(day.key)}
                            className={`py-3 rounded-lg font-semibold transition-all ${
                              dayData?.enabled
                                ? "bg-orange-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Time Picker */}
                    {scheduleDays.some((d) => d.enabled) && (
                      <div className="bg-orange-50 rounded-lg p-4 space-y-3">
                        <p className="text-sm font-semibold text-gray-700">Giờ học:</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Bắt đầu</label>
                            <input
                              type="time"
                              value={scheduleDays.find((d) => d.enabled)?.startTime || "19:00"}
                              onChange={(e) => {
                                scheduleDays
                                  .filter((d) => d.enabled)
                                  .forEach((d) => updateScheduleTime(d.day, "startTime", e.target.value));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Kết thúc</label>
                            <input
                              type="time"
                              value={scheduleDays.find((d) => d.enabled)?.endTime || "21:00"}
                              onChange={(e) => {
                                scheduleDays
                                  .filter((d) => d.enabled)
                                  .forEach((d) => updateScheduleTime(d.day, "endTime", e.target.value));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preview */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-800 font-medium">
                        📅 {getSchedulePreview()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Text Schedule */}
                {scheduleMode === "text" && (
                  <div>
                    <input
                      type="text"
                      required
                      value={scheduleText}
                      onChange={(e) => {
                        setScheduleText(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="VD: Thứ 2-4-6, 19:00-21:00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setIsDirty(true);
                      }}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày kết thúc <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setIsDirty(true);
                      }}
                      min={startDate || new Date().toISOString().split("T")[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Duration Preview */}
              {startDate && endDate && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-orange-800">
                    <Info className="w-4 h-4" />
                    <p className="text-sm font-medium">
                      Khóa học kéo dài: <span className="font-bold">{calculateDuration()}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Pricing (Optional) */}
          <details className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <summary className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Học phí & Thanh toán (Tùy chọn)</h2>
              </div>
            </summary>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Học phí</label>
                  <input
                    type="text"
                    value={courseFee}
                    onChange={(e) => {
                      setCourseFee(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="VD: 1,500,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Đơn vị: VNĐ</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phương thức thanh toán
                  </label>
                  <div className="relative">
                    <select
                      value={paymentTerm}
                      onChange={(e) => {
                        setPaymentTerm(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                    >
                      <option value="full">Thanh toán toàn bộ</option>
                      <option value="installment-2">Trả góp 2 lần</option>
                      <option value="installment-3">Trả góp 3 lần</option>
                      <option value="installment-4">Trả góp 4 lần</option>
                      <option value="per-session">Thanh toán theo buổi</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </details>

          {/* Section 4: Advanced Settings */}
          <details className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <summary className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <SettingsIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Cài đặt nâng cao</h2>
              </div>
            </summary>
            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Trạng thái khóa học
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => {
                      setCourseStatus("draft");
                      setIsDirty(true);
                    }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      courseStatus === "draft"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">📝 Nháp</p>
                    <p className="text-sm text-gray-600 mt-1">Chưa công khai</p>
                  </div>
                  <div
                    onClick={() => {
                      setCourseStatus("active");
                      setIsDirty(true);
                    }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      courseStatus === "active"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">✅ Kích hoạt</p>
                    <p className="text-sm text-gray-600 mt-1">Kích hoạt ngay</p>
                  </div>
                </div>
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Hiển thị
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => {
                      setVisibility("public");
                      setIsDirty(true);
                    }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      visibility === "public"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">Công khai</p>
                    <p className="text-sm text-gray-600 mt-1">Hiển thị cho tất cả</p>
                  </div>
                  <div
                    onClick={() => {
                      setVisibility("private");
                      setIsDirty(true);
                    }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      visibility === "private"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">Riêng tư</p>
                    <p className="text-sm text-gray-600 mt-1">Chỉ học viên được mời</p>
                  </div>
                </div>
              </div>

              {/* Auto-enrollment */}
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Tự động ghi danh</p>
                    <p className="text-sm text-gray-600">Cho phép học viên tự đăng ký bằng mã</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableEnrollment}
                      onChange={(e) => {
                        setEnableEnrollment(e.target.checked);
                        if (e.target.checked && !enrollmentCode) {
                          generateEnrollmentCode();
                        }
                        setIsDirty(true);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
                {enableEnrollment && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={enrollmentCode}
                        onChange={(e) => {
                          setEnrollmentCode(e.target.value);
                          setIsDirty(true);
                        }}
                        placeholder="Mã ghi danh"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={generateEnrollmentCode}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Tạo mã
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Nhập tag và Enter"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Intensive", "Weekend", "Online", "Beginner"].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        if (!tags.includes(suggestion)) {
                          setTags([...tags, suggestion]);
                          setIsDirty(true);
                        }
                      }}
                      className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-md text-xs hover:bg-gray-100 transition-colors"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </details>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Hủy
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAutoSave}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Lưu nháp
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all font-semibold shadow-lg shadow-orange-500/30 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Tạo khóa học
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Tạo khóa học thành công!</h3>
              <p className="text-gray-600">Khóa học "{courseName}" đã được tạo.</p>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Danh mục:</span>
                  <span className="font-semibold text-gray-900">
                    {category} {subCategory}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sĩ số tối đa:</span>
                  <span className="font-semibold text-gray-900">{maxStudents} học viên</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="font-semibold text-gray-900">
                    {courseStatus === "draft" ? "Nháp" : "Kích hoạt"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={() => navigate("/giao-vien/khoa-hoc")}
                  className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium"
                >
                  Về danh sách
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    window.location.reload();
                  }}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                >
                  Tạo khóa học khác
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

