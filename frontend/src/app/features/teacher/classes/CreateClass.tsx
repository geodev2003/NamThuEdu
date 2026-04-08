import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import {
  ArrowLeft,
  Save,
  X,
  School,
  Settings,
  Calendar,
  Users,
  Upload,
  RefreshCw,
  Plus,
  Trash2,
  Check,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Clock,
  MapPin,
  User,
  Hash,
} from "lucide-react";

export function CreateClass() {
  const { t } = useTranslation();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [schedules, setSchedules] = useState([
    { id: 1, day: "monday", startTime: "08:00", endTime: "10:00", room: "A101" },
  ]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [autoEnroll, setAutoEnroll] = useState(false);
  const [allowSelfEnroll, setAllowSelfEnroll] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "CLS-2024-" + Math.floor(Math.random() * 1000).toString().padStart(3, "0"),
    description: "",
    course: "",
    semester: "",
    year: "2025-2026",
    type: "regular",
    maxStudents: 30,
    startDate: "",
    endDate: "",
    visibility: "public",
    tags: [] as string[],
  });

  const steps = [
    { id: 1, title: "Thông tin cơ bản", icon: School },
    { id: 2, title: "Cấu hình", icon: Settings },
    { id: 3, title: "Lịch học", icon: Calendar },
    { id: 4, title: "Học sinh", icon: Users },
  ];

  const addSchedule = () => {
    setSchedules([
      ...schedules,
      { id: Date.now(), day: "monday", startTime: "08:00", endTime: "10:00", room: "" },
    ]);
  };

  const removeSchedule = (id: number) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  const updateSchedule = (id: number, field: string, value: string) => {
    setSchedules(
      schedules.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating class:", formData, schedules, selectedStudents);
  };

  return (
    <div className="p-8 min-h-screen pb-48 bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/giao-vien/lop-hoc"
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#EA580C] mb-6 transition-colors group"
        >
          <div className="p-1.5 rounded-lg bg-white border border-[#E5E7EB] group-hover:border-[#EA580C] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Quay lại danh sách lớp</span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#111827] mb-2">
              Tạo lớp học mới
            </h1>
            <p className="text-[#6B7280]">
              Dashboard &gt; Lớp học &gt; Tạo lớp mới
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#D1FAE5] text-[#10B981] rounded-lg text-sm font-semibold">
            <Check className="w-4 h-4" />
            {t('teacher.common.autoSave')}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#EA580C] to-[#C2410C] text-white shadow-lg shadow-orange-500/20 mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-[#111827]">
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

      <form onSubmit={handleSubmit} className="max-w-6xl">
        {/* Section 1: Basic Info */}
        <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow mb-6">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#F3F4F6]">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5]">
              <School className="w-6 h-6 text-[#EA580C]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#111827]">
                Thông tin cơ bản
              </h2>
              <p className="text-sm text-[#6B7280]">
                Tên lớp, mã lớp và mô tả
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-3">
                <BookOpen className="w-4 h-4 text-[#6B7280]" />
                Tên lớp học <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: IELTS 7.0 - Intensive Morning"
                className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-3">
                <Hash className="w-4 h-4 text-[#6B7280]" />
                Mã lớp học
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={formData.code}
                  readOnly
                  className="flex-1 px-4 py-3.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl font-mono font-semibold text-[#6B7280]"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      code: "CLS-2024-" + Math.floor(Math.random() * 1000).toString().padStart(3, "0"),
                    })
                  }
                  className="p-3.5 border border-[#E5E7EB] rounded-xl hover:bg-[#FFF7ED] hover:border-[#EA580C] transition-all group"
                >
                  <RefreshCw className="w-5 h-5 text-[#6B7280] group-hover:text-[#EA580C] group-hover:rotate-180 transition-all duration-500" />
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-3">
                <Upload className="w-4 h-4 text-[#6B7280]" />
                Banner lớp học
              </label>
              <div className="relative group cursor-pointer">
                <div className="w-full h-32 rounded-xl bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] border-2 border-dashed border-[#D1D5DB] flex flex-col items-center justify-center group-hover:border-[#EA580C] transition-all">
                  <Upload className="w-8 h-8 text-[#9CA3AF] group-hover:text-[#EA580C] mb-2" />
                  <p className="text-sm text-[#6B7280] font-medium">
                    Kéo thả hoặc click để tải ảnh
                  </p>
                  <p className="text-xs text-[#9CA3AF]">PNG, JPG (16:9)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-[#111827] mb-3">
                Mô tả lớp học
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả chi tiết về lớp học, mục tiêu, yêu cầu..."
                rows={4}
                className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent resize-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Configuration */}
        <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow mb-6">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#F3F4F6]">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]">
              <Settings className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#111827]">
                Cấu hình lớp học
              </h2>
              <p className="text-sm text-[#6B7280]">
                Khóa học, học kỳ và loại lớp
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-3">
                Khóa học <span className="text-[#EF4444]">*</span>
              </label>
              <select
                required
                value={formData.course}
                onChange={(e) =>
                  setFormData({ ...formData, course: e.target.value })
                }
                className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C] font-medium"
              >
                <option value="">Chọn khóa học</option>
                <option>IELTS Foundation</option>
                <option>IELTS Intermediate</option>
                <option>IELTS Advanced</option>
                <option>TOEIC Basic</option>
                <option>TOEIC Intermediate</option>
                <option>Cambridge FCE</option>
                <option>VSTEP B2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-3">
                Học kỳ
              </label>
              <select
                value={formData.semester}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
                className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C] font-medium"
              >
                <option value="">Chọn học kỳ</option>
                <option>Spring 2026</option>
                <option>Summer 2026</option>
                <option>Fall 2026</option>
                <option>Winter 2026</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-3">
                Loại lớp học
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "regular", label: "Thường xuyên" },
                  { value: "intensive", label: "Tăng cường" },
                  { value: "weekend", label: "Cuối tuần" },
                  { value: "online", label: "Trực tuyến" },
                ].map((type) => (
                  <label
                    key={type.value}
                    className={`p-3 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.type === type.value
                        ? "border-[#EA580C] bg-[#FFF7ED]"
                        : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="sr-only"
                    />
                    <span
                      className={`text-sm font-semibold ${
                        formData.type === type.value
                          ? "text-[#EA580C]"
                          : "text-[#6B7280]"
                      }`}
                    >
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-3">
                Sĩ số tối đa
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.maxStudents}
                onChange={(e) =>
                  setFormData({ ...formData, maxStudents: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C] font-semibold"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-3">
                <Calendar className="w-4 h-4 text-[#6B7280]" />
                Ngày bắt đầu <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-3">
                <Calendar className="w-4 h-4 text-[#6B7280]" />
                Ngày kết thúc
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Schedule */}
        <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow mb-6">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#F3F4F6]">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A]">
              <Clock className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#111827]">Lịch học</h2>
              <p className="text-sm text-[#6B7280]">
                Thời gian và địa điểm học
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {schedules.map((schedule, index) => (
              <div
                key={schedule.id}
                className="grid grid-cols-5 gap-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]"
              >
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-2">
                    Thứ
                  </label>
                  <select
                    value={schedule.day}
                    onChange={(e) => updateSchedule(schedule.id, "day", e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] text-sm"
                  >
                    <option value="monday">Thứ 2</option>
                    <option value="tuesday">Thứ 3</option>
                    <option value="wednesday">Thứ 4</option>
                    <option value="thursday">Thứ 5</option>
                    <option value="friday">Thứ 6</option>
                    <option value="saturday">Thứ 7</option>
                    <option value="sunday">Chủ nhật</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-2">
                    Bắt đầu
                  </label>
                  <input
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) => updateSchedule(schedule.id, "startTime", e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-2">
                    Kết thúc
                  </label>
                  <input
                    type="time"
                    value={schedule.endTime}
                    onChange={(e) => updateSchedule(schedule.id, "endTime", e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-2">
                    Phòng
                  </label>
                  <input
                    type="text"
                    value={schedule.room}
                    onChange={(e) => updateSchedule(schedule.id, "room", e.target.value)}
                    placeholder="VD: A101"
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeSchedule(schedule.id)}
                    className="w-full p-2.5 border border-[#EF4444] text-[#EF4444] rounded-lg hover:bg-[#FEE2E2] transition-colors"
                  >
                    <Trash2 className="w-5 h-5 mx-auto" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addSchedule}
              className="w-full py-3 border-2 border-dashed border-[#D1D5DB] rounded-xl hover:border-[#EA580C] hover:bg-[#FFF7ED] transition-all flex items-center justify-center gap-2 text-[#6B7280] hover:text-[#EA580C] font-semibold"
            >
              <Plus className="w-5 h-5" />
              Thêm lịch học
            </button>
          </div>
        </div>

        {/* Section 4: Advanced Settings (Collapsible) */}
        <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow mb-6">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE]">
                <Settings className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-[#111827]">
                  Cài đặt nâng cao
                </h2>
                <p className="text-sm text-[#6B7280]">Tùy chọn bổ sung</p>
              </div>
            </div>
            {showAdvanced ? (
              <ChevronUp className="w-6 h-6 text-[#6B7280]" />
            ) : (
              <ChevronDown className="w-6 h-6 text-[#6B7280]" />
            )}
          </button>

          {showAdvanced && (
            <div className="space-y-6 pt-6 border-t border-[#F3F4F6]">
              <label className="flex items-center gap-4 p-4 border-2 border-[#E5E7EB] rounded-xl cursor-pointer hover:border-[#EA580C] transition-all">
                <input
                  type="checkbox"
                  checked={autoEnroll}
                  onChange={(e) => setAutoEnroll(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-[#D1D5DB] text-[#EA580C] focus:ring-2 focus:ring-[#EA580C] cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-semibold text-[#111827]">
                    Tự động ghi danh học sinh mới
                  </p>
                  <p className="text-sm text-[#6B7280]">
                    Học sinh mới sẽ được tự động thêm vào lớp
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 border-2 border-[#E5E7EB] rounded-xl cursor-pointer hover:border-[#EA580C] transition-all">
                <input
                  type="checkbox"
                  checked={allowSelfEnroll}
                  onChange={(e) => setAllowSelfEnroll(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-[#D1D5DB] text-[#EA580C] focus:ring-2 focus:ring-[#EA580C] cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-semibold text-[#111827]">
                    Cho phép tự đăng ký
                  </p>
                  <p className="text-sm text-[#6B7280]">
                    Học sinh có thể tự đăng ký vào lớp bằng mã
                  </p>
                </div>
              </label>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-3">
                  Hiển thị
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "public", label: "Công khai" },
                    { value: "private", label: "Riêng tư" },
                    { value: "hidden", label: "Ẩn" },
                  ].map((vis) => (
                    <label
                      key={vis.value}
                      className={`p-3 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.visibility === vis.value
                          ? "border-[#EA580C] bg-[#FFF7ED]"
                          : "border-[#E5E7EB]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value={vis.value}
                        checked={formData.visibility === vis.value}
                        onChange={(e) =>
                          setFormData({ ...formData, visibility: e.target.value })
                        }
                        className="sr-only"
                      />
                      <span
                        className={`text-sm font-semibold ${
                          formData.visibility === vis.value
                            ? "text-[#EA580C]"
                            : "text-[#6B7280]"
                        }`}
                      >
                        {vis.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t-2 border-[#E5E7EB] -mx-8 px-8 py-5 flex items-center justify-between shadow-2xl rounded-t-2xl">
          <Link
            to="/giao-vien/lop-hoc"
            className="flex items-center gap-2 px-6 py-3.5 border-2 border-[#E5E7EB] text-[#374151] rounded-xl hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all font-semibold"
          >
            <X className="w-5 h-5" />
            {t('teacher.common.cancelAction')}
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-6 py-3.5 border-2 border-[#E5E7EB] text-[#374151] rounded-xl hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all font-semibold"
            >
              {t('teacher.common.saveDraft')}
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white rounded-xl hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105 transition-all font-bold"
            >
              <Save className="w-5 h-5" />
              Tạo lớp học
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
