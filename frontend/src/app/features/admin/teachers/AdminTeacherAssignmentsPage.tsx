import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, RefreshCw, Search, Users } from "lucide-react";
import {
  adminApi,
  type AdminAssignmentTeacher,
  type AdminClassAssignment,
} from "@/services/adminApi";

export function AdminTeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<AdminClassAssignment[]>([]);
  const [teachers, setTeachers] = useState<AdminAssignmentTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingClassId, setSavingClassId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [teacherFilter, setTeacherFilter] = useState<"all" | number>("all");
  const [selectedTeacherByClass, setSelectedTeacherByClass] = useState<Record<number, number>>({});

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const [assignmentRows, teacherRows] = await Promise.all([
        adminApi.getTeacherClassAssignments(),
        adminApi.getTeacherAssignmentCandidates(),
      ]);

      setAssignments(assignmentRows);
      setTeachers(teacherRows);
      setSelectedTeacherByClass(
        assignmentRows.reduce<Record<number, number>>((acc, item) => {
          if (item.teacher?.id) acc[item.class_id] = item.teacher.id;
          return acc;
        }, {})
      );
    } catch {
      setError("Không tải được dữ liệu phân công lớp.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      if (status !== "all" && item.class_status !== status) return false;
      if (teacherFilter !== "all" && item.teacher?.id !== teacherFilter) return false;

      if (!search.trim()) return true;
      const keyword = search.trim().toLowerCase();
      return [
        item.class_name,
        item.teacher?.name,
        item.teacher?.phone,
        item.course?.name,
        item.description || "",
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
    });
  }, [assignments, search, status, teacherFilter]);

  const stats = useMemo(() => {
    const totalClasses = assignments.length;
    const activeClasses = assignments.filter((item) => item.class_status === "active").length;
    const totalStudents = assignments.reduce((sum, item) => sum + (item.student_count || 0), 0);
    const uniqueTeachers = new Set(
      assignments
        .map((item) => item.teacher?.id)
        .filter((id): id is number => typeof id === "number")
    ).size;

    return { totalClasses, activeClasses, totalStudents, uniqueTeachers };
  }, [assignments]);

  const onReassign = async (classId: number) => {
    const nextTeacherId = selectedTeacherByClass[classId];
    if (!nextTeacherId) {
      setError("Vui lòng chọn giáo viên trước khi lưu.");
      return;
    }

    try {
      setSavingClassId(classId);
      setError(null);
      setSuccess(null);
      await adminApi.reassignClassTeacher(classId, nextTeacherId);
      setSuccess("Cập nhật phân công giáo viên thành công.");
      await load();
    } catch {
      setError("Cập nhật phân công thất bại.");
    } finally {
      setSavingClassId(null);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Phân công lớp</h1>
          <p className="text-sm text-slate-500">
            Quản lý lớp theo giáo viên phụ trách và cập nhật phân công trực tiếp.
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Tải lại
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Tổng lớp" value={stats.totalClasses} />
        <StatCard title="Lớp đang hoạt động" value={stats.activeClasses} />
        <StatCard title="Tổng học viên" value={stats.totalStudents} />
        <StatCard title="GV đang phụ trách" value={stats.uniqueTeachers} />
      </div>

      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo lớp, giáo viên, khóa học..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "all" | "active" | "inactive")}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">Tất cả trạng thái lớp</option>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>

          <select
            value={teacherFilter}
            onChange={(e) => setTeacherFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">Tất cả giáo viên</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <div className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Đang tải dữ liệu phân công...</div>
        ) : filteredAssignments.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Users className="mx-auto mb-2 h-5 w-5" />
            Không có dữ liệu phù hợp.
          </div>
        ) : (
          <table className="w-full min-w-[980px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Lớp</th>
                <th className="px-4 py-3">Khóa học</th>
                <th className="px-4 py-3">Học viên</th>
                <th className="px-4 py-3">GV hiện tại</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Đổi giáo viên</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((item) => {
                const classId = item.class_id;
                const currentTeacherId = item.teacher?.id;
                const selectedTeacherId = selectedTeacherByClass[classId] || currentTeacherId || 0;
                const unchanged = selectedTeacherId === currentTeacherId;
                const isSaving = savingClassId === classId;

                return (
                  <tr key={classId} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{item.class_name}</p>
                      <p className="text-xs text-slate-500">ID: {item.class_id}</p>
                      {item.description && <p className="mt-1 text-xs text-slate-500">{item.description}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {item.course?.name || "Chưa gán khóa học"}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">{item.student_count}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <p className="font-medium text-slate-900">{item.teacher?.name || "N/A"}</p>
                      <p className="text-xs text-slate-500">{item.teacher?.phone || "-"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.class_status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.class_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex min-w-[260px] items-center gap-2">
                        <select
                          value={selectedTeacherId || ""}
                          onChange={(e) =>
                            setSelectedTeacherByClass((prev) => ({
                              ...prev,
                              [classId]: Number(e.target.value),
                            }))
                          }
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        >
                          <option value="" disabled>
                            Chọn giáo viên
                          </option>
                          {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                              {teacher.name} ({teacher.assigned_classes} lớp)
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => onReassign(classId)}
                          disabled={unchanged || isSaving}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSaving ? "Đang lưu..." : "Lưu"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
