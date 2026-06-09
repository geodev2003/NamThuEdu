import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, BookPlus, RefreshCw } from "lucide-react";
import { adminApi, type AdminCategory, type AdminUser } from "@/services/adminApi";
import { AdminFormSkeleton } from "../components/AdminPageSkeleton";

type CourseStatus = "draft" | "active" | "ongoing" | "complete";

const displayTeacherId = (u: AdminUser) => u.uId || u.id || 0;
const displayTeacherName = (u: AdminUser) => u.uName || u.name || "N/A";
const displayCategoryId = (c: AdminCategory) => c.caId || c.cId || 0;
const displayCategoryName = (c: AdminCategory) => c.caName || c.cName || "N/A";

export function AdminCourseCreatePage() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<AdminUser[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [courseName, setCourseName] = useState("");
  const [teacherId, setTeacherId] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [maxStudents, setMaxStudents] = useState<number>(30);
  const [time, setTime] = useState("");
  const [schedule, setSchedule] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<CourseStatus>("draft");
  const [description, setDescription] = useState("");

  const loadOptions = async () => {
    try {
      setLoadingOptions(true);
      setError(null);
      const [teacherRows, categoryRows] = await Promise.all([
        adminApi.getUsers({ role: "teacher", status: "active" }),
        adminApi.getCategories(),
      ]);

      setTeachers(teacherRows);
      setCategories(categoryRows);
      if (!teacherId && teacherRows.length > 0) setTeacherId(displayTeacherId(teacherRows[0]));
      if (!categoryId && categoryRows.length > 0) setCategoryId(displayCategoryId(categoryRows[0]));
    } catch {
      setError("Không tải được dữ liệu giáo viên hoặc danh mục.");
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim() || !teacherId || !categoryId || !time.trim() || !schedule.trim() || !startDate || !endDate) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      await adminApi.createCourse({
        course_name: courseName.trim(),
        teacher_id: teacherId,
        category_id: categoryId,
        max_students: maxStudents,
        time: time.trim(),
        schedule: schedule.trim(),
        start_date: startDate,
        end_date: endDate,
        status,
        description: description.trim() || undefined,
      });

      setSuccess("Tạo khóa học thành công.");
      setCourseName("");
      setMaxStudents(30);
      setTime("");
      setSchedule("");
      setStartDate("");
      setEndDate("");
      setStatus("draft");
      setDescription("");
    } catch {
      setError("Tạo khóa học thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tạo khóa học</h1>
          <p className="text-sm text-slate-500">Khởi tạo khóa học mới và phân công giáo viên phụ trách</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadOptions}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Tải dữ liệu
          </button>
          <button
            onClick={() => navigate("/admin/courses")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </button>
        </div>
      </div>

      <div className="max-w-5xl rounded-2xl border border-slate-200 bg-white p-6">
        {loadingOptions ? (
          <AdminFormSkeleton fields={8} cols={2} />
        ) : (
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-slate-700">Tên khóa học *</label>
            <input
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Ví dụ: IELTS Foundation 5.0 - 6.0"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Giáo viên phụ trách *</label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
              disabled={loadingOptions}
            >
              <option value={0}>Chọn giáo viên</option>
              {teachers.map((t) => (
                <option key={displayTeacherId(t)} value={displayTeacherId(t)}>
                  {displayTeacherName(t)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Danh mục *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
              disabled={loadingOptions}
            >
              <option value={0}>Chọn danh mục</option>
              {categories.map((c) => (
                <option key={displayCategoryId(c)} value={displayCategoryId(c)}>
                  {displayCategoryName(c)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Sĩ số tối đa *</label>
            <input
              type="number"
              min={1}
              max={500}
              value={maxStudents}
              onChange={(e) => setMaxStudents(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Thời lượng *</label>
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Ví dụ: 2 tháng"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Lịch học *</label>
            <input
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="Ví dụ: T2, T4, T6 - 19:00"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Trạng thái *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CourseStatus)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="draft">draft</option>
              <option value="active">active</option>
              <option value="ongoing">ongoing</option>
              <option value="complete">complete</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Ngày bắt đầu *</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Ngày kết thúc *</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-slate-700">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Mô tả ngắn về khóa học"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            {error && <p className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            {success && <p className="mb-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>}
            <button
              type="submit"
              disabled={submitting || loadingOptions}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <BookPlus className="h-4 w-4" />
              {submitting ? "Đang tạo..." : "Tạo khóa học"}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
