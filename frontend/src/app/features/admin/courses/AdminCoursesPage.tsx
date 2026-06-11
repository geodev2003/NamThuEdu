import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  BookOpenCheck,
  FileEdit,
  Clock,
  RefreshCw,
  Search,
  AlertTriangle,
  LayoutGrid,
} from "lucide-react";
import { adminApi, AdminExam } from "@/services/adminApi";
import { AdminStatsSkeleton } from "../components/AdminPageSkeleton";
import { RejectReasonModal } from "../components/RejectReasonModal";
import { ExamCard } from "./ExamCard";
import { ExamQuickViewModal } from "./ExamQuickViewModal";
import { ExamPreviewModal } from "./ExamPreviewModal";
import {
  classifyAgeGroup,
  classifyExamType,
  getExamId,
  getExamTitle,
  getExamTeacher,
  getExamSkill,
  getExamStatus,
  AGE_GROUP_META,
  type AgeGroupKey,
} from "./examClassify";

type AgeTab = "all" | AgeGroupKey;

const AGE_TABS: { key: AgeTab; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "kids", label: "Kids" },
  { key: "teens", label: "Teens" },
  { key: "adults", label: "Adults" },
  { key: "other", label: "Khác" },
];

export function AdminCoursesPage() {
  const [exams, setExams] = useState<AdminExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [ageTab, setAgeTab] = useState<AgeTab>("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [viewTarget, setViewTarget] = useState<AdminExam | null>(null);
  const [previewTarget, setPreviewTarget] = useState<AdminExam | null>(null);
  const [rejectTarget, setRejectTarget] = useState<AdminExam | null>(null);

  const loadExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const allExams = await adminApi.getExams();
      setExams(allExams);
    } catch {
      setError("Không tải được danh sách đề thi. Kiểm tra kết nối tới máy chủ rồi thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  // Đếm số đề theo từng nhóm tuổi (cho badge trên tab)
  const ageCounts = useMemo(() => {
    const counts: Record<string, number> = { all: exams.length, kids: 0, teens: 0, adults: 0, other: 0 };
    exams.forEach((e) => {
      counts[classifyAgeGroup(e)] = (counts[classifyAgeGroup(e)] || 0) + 1;
    });
    return counts;
  }, [exams]);

  const stats = useMemo(() => {
    const total = exams.length;
    const published = exams.filter((e) => getExamStatus(e) === "published").length;
    const pending = exams.filter((e) => getExamStatus(e) === "pending").length;
    const draft = exams.filter((e) => {
      const s = getExamStatus(e);
      return s !== "published" && s !== "pending";
    }).length;
    return { total, published, pending, draft };
  }, [exams]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return exams.filter((e) => {
      const matchesSearch =
        !q ||
        getExamTitle(e).toLowerCase().includes(q) ||
        getExamTeacher(e).toLowerCase().includes(q) ||
        classifyExamType(e).label.toLowerCase().includes(q) ||
        getExamSkill(e).toLowerCase().includes(q);
      const matchesAge = ageTab === "all" || classifyAgeGroup(e) === ageTab;
      const matchesStatus = statusFilter === "all" || getExamStatus(e) === statusFilter;
      return matchesSearch && matchesAge && matchesStatus;
    });
  }, [exams, search, ageTab, statusFilter]);

  // Gom nhóm theo loại đề để render từng section
  const grouped = useMemo(() => {
    const map = new Map<string, { label: string; color: string; exams: AdminExam[] }>();
    filtered.forEach((e) => {
      const meta = classifyExamType(e);
      if (!map.has(meta.key)) map.set(meta.key, { label: meta.label, color: meta.color, exams: [] });
      map.get(meta.key)!.exams.push(e);
    });
    return Array.from(map.values()).sort((a, b) => b.exams.length - a.exams.length);
  }, [filtered]);

  const handleApprove = async (id: number) => {
    try {
      setBusyId(id);
      await adminApi.approveExam(id);
      await loadExams();
    } finally {
      setBusyId(null);
    }
  };

  const submitReject = async (reason: string) => {
    if (!rejectTarget) return;
    const id = getExamId(rejectTarget);
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
    const target = exams.find((e) => getExamId(e) === id);
    const ok = window.confirm(
      `Xóa đề thi "${target ? getExamTitle(target) : `#${id}`}"?\nHành động này không thể hoàn tác.`
    );
    if (!ok) return;
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
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý đề thi</h1>
          <p className="text-sm text-slate-500">Ngân hàng đề thi toàn hệ thống, phân loại theo nhóm tuổi</p>
        </div>
        <button
          onClick={loadExams}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Tải lại
        </button>
      </div>

      {/* Stat cards */}
      {loading ? (
        <AdminStatsSkeleton cards={4} />
      ) : (
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard icon={<FileText className="h-4 w-4" />} label="Tổng đề thi" value={stats.total} tone="slate" />
          <StatCard icon={<BookOpenCheck className="h-4 w-4" />} label="Đã xuất bản" value={stats.published} tone="emerald" />
          <StatCard icon={<Clock className="h-4 w-4" />} label="Chờ duyệt" value={stats.pending} tone="amber" />
          <StatCard icon={<FileEdit className="h-4 w-4" />} label="Nháp" value={stats.draft} tone="slate" />
        </div>
      )}

      {/* Segmented control nhóm tuổi */}
      <div className="mb-4 flex flex-wrap gap-2">
        {AGE_TABS.map((tab) => {
          const active = ageTab === tab.key;
          const meta = tab.key !== "all" ? AGE_GROUP_META[tab.key as AgeGroupKey] : null;
          const count = ageCounts[tab.key] || 0;
          return (
            <button
              key={tab.key}
              onClick={() => setAgeTab(tab.key)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all"
              style={{
                background: active ? (meta ? meta.color : "#0F172A") : "#FFFFFF",
                color: active ? "#FFFFFF" : "#475569",
                borderColor: active ? (meta ? meta.color : "#0F172A") : "#E2E8F0",
              }}
              aria-pressed={active}
            >
              {meta && <meta.icon className="h-4 w-4" />}
              {tab.label}
              <span
                className="inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold"
                style={{
                  background: active ? "rgba(255,255,255,0.25)" : "#F1F5F9",
                  color: active ? "#FFFFFF" : "#64748B",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Toolbar: search + status */}
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center">
        <label htmlFor="exam-search" className="sr-only">Tìm kiếm đề thi</label>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="exam-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo đề thi, giáo viên, loại đề, kỹ năng..."
            aria-label="Tìm kiếm đề thi"
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <label htmlFor="status-filter" className="sr-only">Lọc theo trạng thái</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Lọc theo trạng thái"
          className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="published">Đã xuất bản</option>
          <option value="pending">Chờ duyệt</option>
          <option value="draft">Nháp</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <CardGridSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-white py-16">
          <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
            <AlertTriangle className="h-7 w-7 text-rose-500" />
          </span>
          <p className="text-sm font-semibold text-slate-900">{error}</p>
          <button
            onClick={loadExams}
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            <RefreshCw className="h-4 w-4" /> Thử lại
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16">
          <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <LayoutGrid className="h-7 w-7 text-slate-300" />
          </span>
          <p className="text-sm font-semibold text-slate-900">Không tìm thấy đề thi</p>
          <p className="mt-1 text-xs text-slate-500">Thử đổi nhóm tuổi, bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="space-y-7">
          {grouped.map((group) => (
            <section key={group.label}>
              {/* Section header theo loại đề */}
              <div className="mb-3 flex items-center gap-2.5">
                <span className="h-5 w-1.5 rounded-full" style={{ background: group.color }} aria-hidden />
                <h2 className="text-base font-bold text-slate-800">{group.label}</h2>
                <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                  {group.exams.length}
                </span>
              </div>
              {/* Lưới card */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {group.exams.map((e) => {
                  const id = getExamId(e);
                  return (
                    <ExamCard
                      key={id}
                      exam={e}
                      busy={busyId === id}
                      onView={() => setViewTarget(e)}
                      onApprove={() => handleApprove(id)}
                      onReject={() => setRejectTarget(e)}
                      onDelete={() => handleDelete(id)}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Modals */}
      <ExamQuickViewModal
        exam={viewTarget}
        onClose={() => setViewTarget(null)}
        onPreview={() => viewTarget && setPreviewTarget(viewTarget)}
      />
      <ExamPreviewModal exam={previewTarget} onClose={() => setPreviewTarget(null)} />
      <RejectReasonModal
        open={!!rejectTarget}
        title="Từ chối đề thi"
        subject={rejectTarget ? getExamTitle(rejectTarget) : ""}
        busy={busyId === (rejectTarget ? getExamId(rejectTarget) : 0)}
        onCancel={() => setRejectTarget(null)}
        onConfirm={submitReject}
      />
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────
type Tone = "slate" | "amber" | "emerald" | "rose";

const TONE_STYLES: Record<Tone, { border: string; bg: string; icon: string; text: string }> = {
  slate: { border: "border-slate-200", bg: "bg-white", icon: "bg-slate-100 text-slate-500", text: "text-slate-900" },
  amber: { border: "border-amber-200", bg: "bg-amber-50", icon: "bg-amber-100 text-amber-700", text: "text-amber-700" },
  emerald: { border: "border-emerald-200", bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-700", text: "text-emerald-700" },
  rose: { border: "border-rose-200", bg: "bg-rose-50", icon: "bg-rose-100 text-rose-700", text: "text-rose-700" },
};

function StatCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: Tone }) {
  const s = TONE_STYLES[tone];
  return (
    <div className={`flex items-center gap-3 rounded-xl border ${s.border} ${s.bg} px-4 py-3`}>
      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${s.icon}`}>{icon}</div>
      <div className="min-w-0">
        <p className={`truncate text-xs ${tone === "slate" ? "text-slate-500" : s.text}`}>{label}</p>
        <p className={`text-lg font-bold leading-tight ${s.text}`}>{value}</p>
      </div>
    </div>
  );
}

// ── Skeleton lưới card ───────────────────────────────────────────────────────
// Khớp đúng layout thật: các section (header nhóm + lưới card) cách nhau bằng
// space-y-7, tránh nhảy layout khi loading → loaded.
function CardGridSkeleton() {
  const groups = [6, 3]; // số card giả lập cho 2 nhóm đầu
  return (
    <div className="space-y-7">
      {groups.map((cardCount, gi) => (
        <section key={gi}>
          {/* Section header skeleton (thanh màu + nhãn nhóm + badge số lượng) */}
          <div className="mb-3 flex items-center gap-2.5">
            <span className="h-5 w-1.5 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-7 animate-pulse rounded-full bg-slate-100" />
          </div>
          {/* Lưới card */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: cardCount }, (_, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 pl-5">
                {/* Accent bar trái (giống ExamCard) */}
                <span className="absolute left-0 top-0 h-full w-1 animate-pulse bg-slate-200" />
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
                      <div className="h-2.5 w-10 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
                </div>
                <div className="mb-3 space-y-1.5">
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                </div>
                <div className="mb-3 flex gap-1.5">
                  <div className="h-4 w-14 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-12 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-10 animate-pulse rounded bg-slate-100" />
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-16 animate-pulse rounded-full bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
