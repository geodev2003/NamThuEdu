import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Search, Trash2, XCircle } from "lucide-react";
import { adminApi, AdminExam } from "@/services/adminApi";
import { RejectReasonModal } from "../components/RejectReasonModal";
import { AdminTableSkeleton } from "../components/AdminPageSkeleton";

function examId(exam: AdminExam) {
  return exam.eId || exam.id || 0;
}
function examTitle(exam: AdminExam) {
  return exam.eTitle || exam.title || "Không có tiêu đề";
}
function examType(exam: AdminExam) {
  return exam.eType || "N/A";
}
function examSkill(exam: AdminExam) {
  return exam.eSkill || "N/A";
}
function examStatus(exam: AdminExam) {
  if (exam.eStatus) return exam.eStatus;
  return exam.eIs_private ? "pending" : "published";
}
function examTeacher(exam: AdminExam) {
  return exam.teacher?.uName || exam.teacher?.name || "N/A";
}

export function AdminExamsPage() {
  const [exams, setExams] = useState<AdminExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [rejectTarget, setRejectTarget] = useState<AdminExam | null>(null);

  const loadExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const [allExams, pendingExams] = await Promise.all([adminApi.getExams(), adminApi.getPendingExams()]);
      const mergedMap = new Map<number, AdminExam>();
      allExams.forEach((e) => mergedMap.set(examId(e), e));
      pendingExams.forEach((e) => mergedMap.set(examId(e), e));
      setExams(Array.from(mergedMap.values()));
    } catch {
      setError("Không tải được danh sách đề thi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return exams.filter(
      (e) =>
        !q ||
        examTitle(e).toLowerCase().includes(q) ||
        examTeacher(e).toLowerCase().includes(q) ||
        examType(e).toLowerCase().includes(q) ||
        examSkill(e).toLowerCase().includes(q)
    );
  }, [exams, search]);

  const stats = useMemo(() => {
    const total = exams.length;
    const pending = exams.filter((e) => examStatus(e) === "pending").length;
    const approved = exams.filter((e) => examStatus(e) === "published").length;
    const rejected = exams.filter((e) => examStatus(e) === "archived").length;
    return { total, pending, approved, rejected };
  }, [exams]);

  const handleApprove = async (id: number) => {
    try {
      setBusyId(id);
      await adminApi.approveExam(id);
      await loadExams();
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id: number) => {
    const target = exams.find((e) => examId(e) === id);
    if (target) setRejectTarget(target);
  };

  const submitReject = async (reason: string) => {
    if (!rejectTarget) return;
    const id = examId(rejectTarget);
    try {
      setBusyId(id);
      await adminApi.rejectExam(id, reason);
      setRejectTarget(null);
      await loadExams();
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setBusyId(id);
      await adminApi.deleteExam(id);
      await loadExams();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kiểm duyệt đề thi</h1>
          <p className="text-sm text-slate-500">Quản lý ngân hàng đề thi và trạng thái duyệt</p>
        </div>
        <button
          onClick={loadExams}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Tải lại
        </button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Tổng đề thi</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs text-amber-700">Chờ duyệt</p>
          <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs text-emerald-700">Đã duyệt</p>
          <p className="text-2xl font-bold text-emerald-700">{stats.approved}</p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-xs text-rose-700">Từ chối</p>
          <p className="text-2xl font-bold text-rose-700">{stats.rejected}</p>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo đề thi, giáo viên, kỹ năng..."
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <AdminTableSkeleton rows={7} cols={5} />
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : (
          <table className="w-full min-w-[980px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tiêu đề</th>
                <th className="px-4 py-3">Giáo viên</th>
                <th className="px-4 py-3">Loại</th>
                <th className="px-4 py-3">Kỹ năng</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => {
                const id = examId(e);
                const status = examStatus(e);
                return (
                  <tr key={id} className="border-t border-slate-100">
                    <td className="px-4 py-3 text-sm text-slate-700">{id}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{examTitle(e)}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{examTeacher(e)}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{examType(e)}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{examSkill(e)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          status === "published"
                            ? "bg-emerald-100 text-emerald-700"
                            : status === "archived"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(id)}
                          disabled={busyId === id}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-200 disabled:opacity-60"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Duyệt
                        </button>
                        <button
                          onClick={() => handleReject(id)}
                          disabled={busyId === id}
                          className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2.5 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-200 disabled:opacity-60"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Từ chối
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          disabled={busyId === id}
                          className="inline-flex items-center gap-1 rounded-lg bg-rose-100 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-200 disabled:opacity-60"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Xóa
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

      <RejectReasonModal
        open={!!rejectTarget}
        title="Từ chối đề thi"
        subject={rejectTarget ? examTitle(rejectTarget) : ""}
        busy={busyId === (rejectTarget ? examId(rejectTarget) : 0)}
        onCancel={() => setRejectTarget(null)}
        onConfirm={submitReject}
      />
    </div>
  );
}

