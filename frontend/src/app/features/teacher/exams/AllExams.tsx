import { useState, useEffect } from "react";
import { Link } from "react-router";
import { usePageTitle, PAGE_TITLES } from "../../../../hooks/usePageTitle";
import {
  FileText,
  Plus,
  Search,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Layers,
  Baby,
  GraduationCap,
  BookOpen,
  Briefcase,
  Check,
  CheckSquare,
  Square,
  X,
} from "lucide-react";
import { getKidsExams, deleteKidsExam } from "../../../../services/kidsExamApi";
import { api } from "../../../../services/api";
import { useToastContext } from "../../../../contexts/ToastContext";
import {
  getVstepFullExams,
  getIeltsFullExams,
  getAdultExams,
} from "../../../../services/examGroupsApi";

interface KidsExam {
  eId: number;
  eTitle: string;
  eDescription: string | null;
  eDuration: number | null;
  eStatus: string;
  eCreated_at: string;
  eType?: string;
  eSkill?: string;
  age_group?: string;
  kids_exam_config?: {
    exam_type: string;
    mode: string;
    level: string;
    age_range: string;
  };
  questions?: any[];
  _group?: "vstep" | "ielts" | "adult" | "kids" | "teens";
}

export function AllExams() {
  usePageTitle(PAGE_TITLES.TEACHER_EXAMS);
  const toast = useToastContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exams, setExams] = useState<KidsExam[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterAgeGroup, setFilterAgeGroup] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const itemsPerPage = 20;

  // Toggle chọn 1 exam
  const toggleSelect = (examId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(examId)) {
        next.delete(examId);
      } else {
        next.add(examId);
      }
      return next;
    });
  };

  // Bỏ chọn tất cả
  const clearSelection = () => setSelectedIds(new Set());

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch 4 nhóm song song:
      // 1. VSTEP Full (đề đầy đủ 4 kỹ năng)
      // 2. IELTS Full (đề đầy đủ 4 sections)
      // 3. Adult (General, Business, TOEIC...)
      // 4. Kids (YLE Starters/Movers/Flyers)
      // 5. Teens (để trống cho sau)
      const [vstepRes, ieltsRes, adultRes, kidsRes, teensRes] = await Promise.all([
        getVstepFullExams().catch(() => []),
        getIeltsFullExams().catch(() => []),
        getAdultExams().catch(() => []),
        getKidsExams().catch(() => []),
        api.get("/teacher/exams", { params: { group: "teens" } })
          .then((r) => r.data?.data || []).catch(() => []),
      ]);

      const vstepList: KidsExam[] = Array.isArray(vstepRes) ? vstepRes : [];
      const ieltsList: KidsExam[] = Array.isArray(ieltsRes) ? ieltsRes : [];
      const adultList: KidsExam[] = Array.isArray(adultRes) ? adultRes : [];
      const kidsList: KidsExam[] = Array.isArray(kidsRes) ? kidsRes : [];
      const teensList: KidsExam[] = Array.isArray(teensRes) ? teensRes : [];

      // Gắn nhãn group cho từng exam (để dùng cho filter/stats)
      const tagged = [
        ...vstepList.map((e) => ({ ...e, _group: "vstep" as const })),
        ...ieltsList.map((e) => ({ ...e, _group: "ielts" as const })),
        ...adultList.map((e) => ({ ...e, _group: "adult" as const })),
        ...kidsList.map((e) => ({ ...e, _group: "kids" as const })),
        ...teensList.map((e) => ({ ...e, _group: "teens" as const })),
      ];

      // Lọc bỏ exam không hợp lệ + sort theo ngày tạo
      const merged = tagged
        .filter((e) => e && e.eId && e.eTitle)
        .sort(
          (a, b) =>
            new Date(b.eCreated_at).getTime() -
            new Date(a.eCreated_at).getTime()
        );
      setExams(merged);
    } catch (err: any) {
      console.error("Failed to load exams:", err);
      setError(err.message || "Không thể tải danh sách đề thi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (examId: number) => {
    try {
      const exam = exams.find((e) => e.eId === examId);
      if (!exam) {
        // Đề thi không tồn tại trong danh sách local → xóa khỏi UI
        setExams((prev) => prev.filter((e) => e.eId !== examId));
        setDeleteConfirm(null);
        // Vẫn refetch để đồng bộ
        await loadExams();
        return;
      }

      // Xác định endpoint dựa trên age_group hoặc kids_exam_config
      const isKidsExam =
        (exam as any).age_group === "kids" || exam.kids_exam_config !== undefined;

      if (isKidsExam) {
        await deleteKidsExam(examId);
      } else {
        // VSTEP / IELTS / General ...
        await api.delete(`/teacher/exams/${examId}`);
      }

      // Cập nhật local state ngay
      setExams((prev) => prev.filter((e) => e.eId !== examId));
      setDeleteConfirm(null);

      // ✅ Toast thành công
      toast.success(`Đã xóa đề thi "${exam.eTitle}" thành công!`);

      // Refetch để đảm bảo đồng bộ với server (loại bỏ các đề thi khác đã bị xóa trước)
      await loadExams();
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        // Đề thi đã bị xóa trước đó → xóa khỏi UI + refetch để đồng bộ các đề thi khác
        setExams((prev) => prev.filter((e) => e.eId !== examId));
        setDeleteConfirm(null);
        toast.info("Đề thi đã được xóa trước đó - đang đồng bộ danh sách");
        // Refetch quan trọng: các đề thi khác đã xóa trên server sẽ bị loại bỏ
        await loadExams();
      } else {
        toast.error(
          "Không thể xóa đề thi: " + (err.response?.data?.message || err.message)
        );
      }
    }
  };

  // Xóa nhiều exam
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setBulkDeleting(true);
    const ids = Array.from(selectedIds);
    const targetExams = exams.filter((e) => selectedIds.has(e.eId));
    let successCount = 0;
    let failCount = 0;

    for (const exam of targetExams) {
      const isKidsExam =
        (exam as any).age_group === "kids" || exam.kids_exam_config !== undefined;
      try {
        if (isKidsExam) {
          await deleteKidsExam(exam.eId);
        } else {
          await api.delete(`/teacher/exams/${exam.eId}`);
        }
        successCount++;
        setExams((prev) => prev.filter((e) => e.eId !== exam.eId));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(exam.eId);
          return next;
        });
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404) {
          // đã bị xóa trước đó
          successCount++;
          setExams((prev) => prev.filter((e) => e.eId !== exam.eId));
          setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(exam.eId);
            return next;
          });
        } else {
          failCount++;
        }
      }
    }

    setBulkDeleting(false);
    setBulkDeleteConfirm(false);

    if (failCount > 0) {
      toast.warning(
        `Đã xóa ${successCount} đề thi. ${failCount} đề thi xóa thất bại.`
      );
    } else {
      toast.success(`Đã xóa thành công ${successCount} đề thi!`);
    }

    // Refetch để đồng bộ
    await loadExams();
  };

  // Filter exams - đã move lên trên (trước stats)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    // Clear selection khi filter thay đổi để tránh xóa nhầm
    setSelectedIds(new Set());
  }, [searchQuery, filterType, filterAgeGroup]);

  // Validate exam tồn tại khi mount - lọc bỏ exam không hợp lệ khỏi state
  useEffect(() => {
    setExams((prev) =>
      prev.filter((e) => e && e.eId && e.eTitle)
    );
  }, []);

  // Calculate stats by age group - ưu tiên dùng _group tag từ API
  // Mapping:
  //   VSTEP  → "professionals" (Người đi làm)
  //   IELTS  → "professionals" (Người đi làm)
  //   Adult  → "adults" (Sinh viên)
  //   Kids   → "kids" (Trẻ em)
  //   Teens  → "teens" (Học sinh)
  const getAgeGroup = (exam: KidsExam & { _group?: string }) => {
    if (exam._group === "vstep") return "professionals";
    if (exam._group === "ielts") return "professionals";
    if (exam._group === "adult") return "adults";
    if (exam._group === "kids") return "kids";
    if (exam._group === "teens") return "teens";

    // Fallback: check kids_exam_config
    const ageRange = exam.kids_exam_config?.age_range || "all";
    if (ageRange === "kids" || ageRange.includes("6-8") || ageRange.includes("8-11") || ageRange.includes("9-12")) return "kids";
    if (ageRange === "teens" || ageRange.includes("13-17")) return "teens";
    if (ageRange === "adults" || ageRange.includes("18+") || ageRange.includes("university")) return "adults";
    if (ageRange === "professionals" || ageRange.includes("working")) return "professionals";
    return "all";
  };

  // Filter exams - dùng getAgeGroup() để áp dụng mapping mới (VSTEP/IELTS → professionals)
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.eTitle.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter: check cả kids_exam_config, eType, và _group
    let matchesType = filterType === "all";
    if (!matchesType) {
      const kidsType = exam.kids_exam_config?.exam_type;
      const eType = (exam.eType || "").toLowerCase();
      const group = exam._group;
      const filterLower = filterType.toLowerCase();

      if (kidsType && kidsType.toLowerCase() === filterLower) {
        matchesType = true;
      } else if (eType === filterLower) {
        matchesType = true;
      } else if (
        // VSTEP/IELTS mapping
        (filterLower === "vstep" && (group === "vstep" || eType === "vstep")) ||
        (filterLower === "ielts" && (group === "ielts" || eType === "ielts"))
      ) {
        matchesType = true;
      }
    }

    // Age group filter - dùng getAgeGroup để nhất quán với stats
    let matchesAgeGroup = filterAgeGroup === "all";
    if (!matchesAgeGroup) {
      const examAgeGroup = getAgeGroup(exam);
      // Nếu age_group="all" (chưa phân loại) → match mọi filter
      if (examAgeGroup === "all") {
        matchesAgeGroup = true;
      } else {
        matchesAgeGroup = examAgeGroup === filterAgeGroup;
      }
    }

    return matchesSearch && matchesType && matchesAgeGroup;
  });

  const stats = {
    total: exams.length,
    kids: exams.filter(e => getAgeGroup(e) === "kids").length,
    teens: exams.filter(e => getAgeGroup(e) === "teens").length,
    adults: exams.filter(e => getAgeGroup(e) === "adults").length,
    professionals: exams.filter(e => getAgeGroup(e) === "professionals").length,
  };

  // Pagination - lọc thêm lần nữa để chắc chắn không có exam không hợp lệ
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedExams = filteredExams
    .filter((exam) => exam && exam.eId && exam.eTitle)
    .slice(startIndex, endIndex);

  // Get exam type display info
  const getExamTypeInfo = (exam: KidsExam) => {
    const examType = exam.kids_exam_config?.exam_type;
    const types: Record<string, { label: string; color: string }> = {
      yle_starters: { label: "Starters", color: "#EA580C" },
      yle_movers: { label: "Movers", color: "#F97316" },
      yle_flyers: { label: "Flyers", color: "#FB923C" },
      ielts: { label: "IELTS", color: "#3B82F6" },
      toefl: { label: "TOEFL", color: "#8B5CF6" },
      toeic: { label: "TOEIC", color: "#10B981" },
      business: { label: "Business", color: "#F59E0B" },
      general: { label: "Tổng hợp", color: "#6B7280" },
    };
    if (examType && types[examType.toLowerCase()]) return types[examType.toLowerCase()];

    // Fallback theo eType (VSTEP, IELTS, GENERAL...)
    if (exam.eType === "VSTEP") {
      const skill = (exam.eSkill || "").toLowerCase();
      if (skill === "mixed") return { label: "VSTEP Full", color: "#7C3AED" };
      if (skill === "listening") return { label: "VSTEP Listening", color: "#0EA5E9" };
      if (skill === "reading") return { label: "VSTEP Reading", color: "#10B981" };
      if (skill === "writing") return { label: "VSTEP Writing", color: "#F59E0B" };
      if (skill === "speaking") return { label: "VSTEP Speaking", color: "#EC4899" };
      return { label: "VSTEP", color: "#7C3AED" };
    }
    if (exam.eType === "IELTS") return { label: "IELTS", color: "#3B82F6" };
    if (examType) return { label: examType, color: "#6B7280" };
    return { label: "Chưa phân loại", color: "#6B7280" };
  };

  // Đường dẫn chỉnh sửa tuỳ theo loại đề
  const getEditLink = (exam: KidsExam) => {
    // Kids exam ưu tiên check age_group / kids_exam_config trước
    const isKidsExam =
      (exam as any).age_group === "kids" || exam.kids_exam_config !== undefined;
    if (isKidsExam) {
      return `/giao-vien/de-thi/kids/tao-moi/${exam.eId}`;
    }
    if (exam.eType === "VSTEP") {
      const skill = (exam.eSkill || "").toLowerCase();
      if (skill === "mixed") return `/giao-vien/de-thi/vstep/full/sua/${exam.eId}`;
      if (skill && ["listening", "reading", "writing", "speaking"].includes(skill))
        return `/giao-vien/de-thi/vstep/${skill}/sua/${exam.eId}`;
      return `/giao-vien/de-thi/${exam.eId}`;
    }
    return `/giao-vien/de-thi/${exam.eId}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50/30 via-white to-amber-50/30">
      {/* Refined Header - STICKY */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                <Link to="/giao-vien" className="hover:text-orange-600 transition-colors">
                  Dashboard
                </Link>
                <span className="text-gray-300">/</span>
                <span className="text-gray-700 font-medium">Ngân hàng đề thi</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Ngân hàng đề thi</h1>
            </div>
            <Link
              to="/giao-vien/de-thi/kids/tao-moi"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all text-sm font-semibold shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Tạo đề mới
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-14 h-14 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-gray-600">Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-900">Có lỗi xảy ra</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Refined Stats Cards - Compact & Professional */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <button
              onClick={() => setFilterAgeGroup("all")}
              className={`group p-4 rounded-xl border transition-all text-left ${
                filterAgeGroup === "all"
                  ? "bg-gradient-to-br from-orange-600 to-orange-500 border-orange-600 shadow-lg shadow-orange-200/50"
                  : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-orange-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  filterAgeGroup === "all" ? "bg-white/20" : "bg-orange-50 group-hover:bg-orange-100"
                }`}>
                  <Layers className={`w-4 h-4 ${filterAgeGroup === "all" ? "text-white" : "text-orange-600"}`} />
                </div>
                <div className={`text-xs font-medium ${filterAgeGroup === "all" ? "text-white/90" : "text-gray-600"}`}>
                  Tất cả
                </div>
              </div>
              <div className={`text-2xl font-bold ${filterAgeGroup === "all" ? "text-white" : "text-gray-900"}`}>
                {stats.total}
              </div>
            </button>

            <button
              onClick={() => setFilterAgeGroup("kids")}
              className={`group p-4 rounded-xl border transition-all text-left ${
                filterAgeGroup === "kids"
                  ? "bg-gradient-to-br from-pink-600 to-pink-500 border-pink-600 shadow-lg shadow-pink-200/50"
                  : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-pink-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  filterAgeGroup === "kids" ? "bg-white/20" : "bg-pink-50 group-hover:bg-pink-100"
                }`}>
                  <Baby className={`w-4 h-4 ${filterAgeGroup === "kids" ? "text-white" : "text-pink-600"}`} />
                </div>
                <div className={`text-xs font-medium ${filterAgeGroup === "kids" ? "text-white/90" : "text-gray-600"}`}>
                  Trẻ em
                </div>
              </div>
              <div className={`text-2xl font-bold ${filterAgeGroup === "kids" ? "text-white" : "text-gray-900"}`}>
                {stats.kids}
              </div>
            </button>

            <button
              onClick={() => setFilterAgeGroup("teens")}
              className={`group p-4 rounded-xl border transition-all text-left ${
                filterAgeGroup === "teens"
                  ? "bg-gradient-to-br from-blue-600 to-blue-500 border-blue-600 shadow-lg shadow-blue-200/50"
                  : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-blue-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  filterAgeGroup === "teens" ? "bg-white/20" : "bg-blue-50 group-hover:bg-blue-100"
                }`}>
                  <BookOpen className={`w-4 h-4 ${filterAgeGroup === "teens" ? "text-white" : "text-blue-600"}`} />
                </div>
                <div className={`text-xs font-medium ${filterAgeGroup === "teens" ? "text-white/90" : "text-gray-600"}`}>
                  Học sinh
                </div>
              </div>
              <div className={`text-2xl font-bold ${filterAgeGroup === "teens" ? "text-white" : "text-gray-900"}`}>
                {stats.teens}
              </div>
            </button>

            <button
              onClick={() => setFilterAgeGroup("adults")}
              className={`group p-4 rounded-xl border transition-all text-left ${
                filterAgeGroup === "adults"
                  ? "bg-gradient-to-br from-violet-600 to-violet-500 border-violet-600 shadow-lg shadow-violet-200/50"
                  : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-violet-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  filterAgeGroup === "adults" ? "bg-white/20" : "bg-violet-50 group-hover:bg-violet-100"
                }`}>
                  <GraduationCap className={`w-4 h-4 ${filterAgeGroup === "adults" ? "text-white" : "text-violet-600"}`} />
                </div>
                <div className={`text-xs font-medium ${filterAgeGroup === "adults" ? "text-white/90" : "text-gray-600"}`}>
                  Sinh viên
                </div>
              </div>
              <div className={`text-2xl font-bold ${filterAgeGroup === "adults" ? "text-white" : "text-gray-900"}`}>
                {stats.adults}
              </div>
            </button>

            <button
              onClick={() => setFilterAgeGroup("professionals")}
              className={`group p-4 rounded-xl border transition-all text-left ${
                filterAgeGroup === "professionals"
                  ? "bg-gradient-to-br from-emerald-600 to-emerald-500 border-emerald-600 shadow-lg shadow-emerald-200/50"
                  : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-emerald-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  filterAgeGroup === "professionals" ? "bg-white/20" : "bg-emerald-50 group-hover:bg-emerald-100"
                }`}>
                  <Briefcase className={`w-4 h-4 ${filterAgeGroup === "professionals" ? "text-white" : "text-emerald-600"}`} />
                </div>
                <div className={`text-xs font-medium ${filterAgeGroup === "professionals" ? "text-white/90" : "text-gray-600"}`}>
                  Người đi làm
                </div>
              </div>
              <div className={`text-2xl font-bold ${filterAgeGroup === "professionals" ? "text-white" : "text-gray-900"}`}>
                {stats.professionals}
              </div>
            </button>
          </div>
        )}

        {/* Refined Search & Filters - Inline Design */}
        {!loading && !error && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="space-y-4">
              {/* Search bar */}
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên đề thi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm bg-white placeholder-gray-400 transition-shadow"
                />
              </div>
              
              {/* Filters - Inline */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold text-gray-600">Lọc theo:</span>
                
                {/* Age Group Filter */}
                <select
                  value={filterAgeGroup}
                  onChange={(e) => setFilterAgeGroup(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-xs bg-white font-medium text-gray-700 cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <option value="all">Tất cả nhóm tuổi</option>
                  <option value="kids">Trẻ em (6-12)</option>
                  <option value="teens">Học sinh (13-17)</option>
                  <option value="adults">Sinh viên (18+)</option>
                  <option value="professionals">Người đi làm</option>
                </select>
                
                {/* Exam Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-xs bg-white font-medium text-gray-700 cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <option value="all">Tất cả loại đề</option>
                  
                  {/* Kids exam types */}
                  {(filterAgeGroup === "all" || filterAgeGroup === "kids") && (
                    <>
                      <option value="yle_starters">Starters (6-8)</option>
                      <option value="yle_movers">Movers (8-11)</option>
                      <option value="yle_flyers">Flyers (9-12)</option>
                    </>
                  )}
                  
                  {/* Teens/Adults exam types */}
                  {(filterAgeGroup === "all" || filterAgeGroup === "teens" || filterAgeGroup === "adults") && (
                    <>
                      <option value="ielts">IELTS</option>
                      <option value="toefl">TOEFL</option>
                    </>
                  )}
                  
                  {/* Adults/Professionals exam types */}
                  {(filterAgeGroup === "all" || filterAgeGroup === "adults" || filterAgeGroup === "professionals") && (
                    <option value="toeic">TOEIC</option>
                  )}
                  
                  {/* Professionals only */}
                  {(filterAgeGroup === "all" || filterAgeGroup === "professionals") && (
                    <option value="business">Business English</option>
                  )}
                  
                  {/* General - available for all */}
                  {filterAgeGroup !== "kids" && (
                    <option value="general">Đề tổng hợp</option>
                  )}
                </select>
                
                {/* Clear filters */}
                {(filterAgeGroup !== "all" || filterType !== "all") && (
                  <button 
                    onClick={() => { setFilterAgeGroup("all"); setFilterType("all"); }}
                    className="text-xs text-orange-600 hover:text-orange-700 font-semibold ml-auto transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
              
              {/* Results count */}
              <div className="text-xs text-gray-600 pt-2 border-t border-gray-100">
                Hiển thị <span className="font-semibold text-gray-900">{filteredExams.length}</span> đề thi
              </div>
            </div>
          </div>
        )}

        {/* Bulk Action Bar */}
        {!loading && !error && paginatedExams.length > 0 && (
          <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const pageIds = paginatedExams.map((e) => e.eId);
                  const allSelected = pageIds.every((id) => selectedIds.has(id));
                  setSelectedIds((prev) => {
                    const next = new Set(prev);
                    if (allSelected) {
                      pageIds.forEach((id) => next.delete(id));
                    } else {
                      pageIds.forEach((id) => next.add(id));
                    }
                    return next;
                  });
                }}
                className="group flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
              >
                {paginatedExams.every((e) => selectedIds.has(e.eId)) &&
                paginatedExams.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-orange-600" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
                )}
                <span>
                  {paginatedExams.every((e) => selectedIds.has(e.eId)) &&
                  paginatedExams.length > 0
                    ? "Bỏ chọn tất cả"
                    : "Chọn tất cả trang này"}
                </span>
              </button>
              {selectedIds.size > 0 && (
                <span className="text-xs text-gray-500">
                  • Đã chọn{" "}
                  <span className="font-semibold text-orange-600">
                    {selectedIds.size}
                  </span>{" "}
                  đề thi
                </span>
              )}
            </div>
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={clearSelection}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Hủy chọn
                </button>
                <button
                  onClick={() => setBulkDeleteConfirm(true)}
                  className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-lg shadow-sm hover:shadow-md hover:shadow-red-500/30 transition-all active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                  Xóa {selectedIds.size} đề thi
                </button>
              </div>
            )}
          </div>
        )}

        {/* Refined Exam Cards Grid */}
        {!loading && !error && paginatedExams.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedExams.map((exam) => {
              if (!exam || !exam.eId || !exam.eTitle) return null;
              const typeInfo = getExamTypeInfo(exam);
              const isSelected = selectedIds.has(exam.eId);
              return (
                <div
                  key={exam.eId}
                  onClick={(e) => {
                    // Click vào card nhưng không phải link/button thì toggle select
                    const target = e.target as HTMLElement;
                    if (
                      !target.closest("a") &&
                      !target.closest("button") &&
                      !target.closest("input")
                    ) {
                      toggleSelect(exam.eId);
                    }
                  }}
                  className={`group relative bg-white/90 backdrop-blur-sm rounded-xl border p-5 transition-all cursor-pointer ${
                    isSelected
                      ? "border-orange-500 ring-2 ring-orange-200 shadow-lg shadow-orange-100"
                      : "border-gray-200 hover:border-orange-300 hover:shadow-lg"
                  }`}
                >
                  {/* Checkbox top-left */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(exam.eId);
                    }}
                    className={`absolute top-2 left-2 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-gradient-to-br from-orange-500 to-orange-600 border-orange-600 shadow-md shadow-orange-500/30"
                        : "bg-white border-gray-300 hover:border-orange-400"
                    }`}
                  >
                    {isSelected && (
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    )}
                  </button>

                  {/* ID badge top-right corner */}
                  <span className="absolute top-2 right-2 text-[10px] font-mono font-semibold text-gray-400 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded">
                    #{exam.eId}
                  </span>

                  {/* Header */}
                  <div className="flex items-start justify-between mb-3 pl-7 pr-12">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold"
                      style={{
                        backgroundColor: `${typeInfo.color}15`,
                        color: typeInfo.color
                      }}
                    >
                      {typeInfo.label}
                    </span>
                    {exam.eStatus === "draft" && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700">
                        Nháp
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {exam.eTitle}
                  </h3>

                  {/* Description */}
                  {exam.eDescription && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {exam.eDescription}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{(exam as any).questions_count ?? exam.questions?.length ?? 0} câu</span>
                    </div>
                    {exam.eDuration && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{exam.eDuration} phút</span>
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 pb-4 border-b border-gray-100">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(exam.eCreated_at).toLocaleDateString("vi-VN")}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={getEditLink(exam)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Sửa
                    </Link>
                    <Link
                      to={
                        exam.eType === "VSTEP"
                          ? `/giao-vien/de-thi/${exam.eId}/vstep`
                          : `/giao-vien/de-thi/${exam.eId}/xem`
                      }
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all text-sm font-medium shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Xem
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(exam.eId)}
                      className="inline-flex items-center justify-center p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Refined Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{startIndex + 1}-{Math.min(endIndex, filteredExams.length)}</span> trong tổng số <span className="font-medium text-gray-900">{filteredExams.length}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Trước
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const showPage = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    const showEllipsis = 
                      (page === currentPage - 2 && currentPage > 3) ||
                      (page === currentPage + 2 && currentPage < totalPages - 2);

                    if (showEllipsis) {
                      return (
                        <span key={page} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-sm"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Sau
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
        )}

        {/* Refined Empty State */}
        {!loading && !error && filteredExams.length === 0 && (
          <div className="text-center py-20 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || filterType !== "all" ? "Không tìm thấy đề thi" : "Chưa có đề thi nào"}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {searchQuery || filterType !== "all" || filterAgeGroup !== "all"
                ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                : "Hãy tạo đề thi đầu tiên của bạn"
              }
            </p>
            {!searchQuery && filterType === "all" && filterAgeGroup === "all" && (
              <Link
                to="/giao-vien/de-thi/kids/tao-moi"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all text-sm font-semibold shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Tạo đề thi đầu tiên
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Refined Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative bg-white rounded-3xl p-7 max-w-md w-full shadow-2xl border border-gray-100
                       transform transition-all animate-in zoom-in-95 duration-300
                       hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
          >
            {/* Decorative gradient blob */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-red-200/40 to-orange-200/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-gradient-to-br from-red-100/40 to-pink-200/40 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex items-start gap-4 mb-6">
              <div className="relative w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                <div className="absolute inset-0 bg-red-500 rounded-2xl animate-ping opacity-20" />
                <AlertCircle className="relative w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1.5 tracking-tight">
                  Xác nhận xóa đề thi
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Bạn có chắc chắn muốn xóa đề thi này?
                  <span className="block mt-1 text-red-600 font-medium">
                    Hành động này không thể hoàn tác.
                  </span>
                </p>
              </div>
            </div>

            {/* Warning info box */}
            <div className="relative mb-6 px-4 py-3 bg-red-50/70 border border-red-100 rounded-xl">
              <div className="flex items-center gap-2 text-xs text-red-700">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="font-medium">Đề thi và tất cả câu hỏi sẽ bị xóa vĩnh viễn</span>
              </div>
            </div>

            <div className="relative flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="group flex-1 relative overflow-hidden px-4 py-3 bg-gray-100 text-gray-700 rounded-xl
                           hover:bg-gray-900 hover:text-white
                           active:scale-95
                           transition-all duration-300 ease-out
                           text-sm font-semibold
                           hover:shadow-lg hover:shadow-gray-900/20
                           hover:-translate-y-0.5"
              >
                <span className="relative z-10">Hủy</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 opacity-0 group-hover:opacity-0 transition-opacity" />
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="group flex-1 relative overflow-hidden px-4 py-3 text-white rounded-xl
                           bg-gradient-to-r from-red-600 via-red-500 to-orange-500
                           hover:from-red-700 hover:via-red-600 hover:to-orange-600
                           active:scale-95
                           transition-all duration-300 ease-out
                           text-sm font-semibold
                           shadow-lg shadow-red-500/40
                           hover:shadow-2xl hover:shadow-red-500/60
                           hover:-translate-y-0.5
                           ring-1 ring-red-400/50
                           hover:ring-2 hover:ring-red-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
                  <span>Xóa đề thi</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {bulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative bg-white rounded-3xl p-7 max-w-md w-full shadow-2xl border border-gray-100
                       transform transition-all animate-in zoom-in-95 duration-300
                       hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-red-200/40 to-orange-200/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-gradient-to-br from-red-100/40 to-pink-200/40 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex items-start gap-4 mb-6">
              <div className="relative w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/30">
                <div className="absolute inset-0 bg-red-500 rounded-2xl animate-ping opacity-20" />
                <Trash2 className="relative w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1.5 tracking-tight">
                  Xóa {selectedIds.size} đề thi?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Bạn đang chọn xóa{" "}
                  <span className="font-bold text-red-600">
                    {selectedIds.size}
                  </span>{" "}
                  đề thi cùng lúc.
                  <span className="block mt-1 text-red-600 font-medium">
                    Hành động này không thể hoàn tác.
                  </span>
                </p>
              </div>
            </div>

            <div className="relative mb-6 px-4 py-3 bg-red-50/70 border border-red-100 rounded-xl max-h-40 overflow-y-auto">
              <div className="text-xs text-red-700 font-medium mb-2">
                Danh sách đề thi sẽ bị xóa:
              </div>
              <ul className="space-y-1">
                {Array.from(selectedIds).map((id) => {
                  const exam = exams.find((e) => e.eId === id);
                  return (
                    <li
                      key={id}
                      className="flex items-center gap-2 text-xs text-red-700"
                    >
                      <span className="w-1 h-1 bg-red-500 rounded-full" />
                      <span className="font-mono text-red-500">#{id}</span>
                      <span className="truncate">
                        {exam?.eTitle || "(không tồn tại)"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="relative flex gap-3">
              <button
                onClick={() => setBulkDeleteConfirm(false)}
                disabled={bulkDeleting}
                className="group flex-1 relative overflow-hidden px-4 py-3 bg-gray-100 text-gray-700 rounded-xl
                           hover:bg-gray-900 hover:text-white
                           active:scale-95
                           transition-all duration-300 ease-out
                           text-sm font-semibold
                           hover:shadow-lg hover:shadow-gray-900/20
                           hover:-translate-y-0.5
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">Hủy</span>
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="group flex-1 relative overflow-hidden px-4 py-3 text-white rounded-xl
                           bg-gradient-to-r from-red-600 via-red-500 to-orange-500
                           hover:from-red-700 hover:via-red-600 hover:to-orange-600
                           active:scale-95
                           transition-all duration-300 ease-out
                           text-sm font-semibold
                           shadow-lg shadow-red-500/40
                           hover:shadow-2xl hover:shadow-red-500/60
                           hover:-translate-y-0.5
                           ring-1 ring-red-400/50
                           hover:ring-2 hover:ring-red-300
                           disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {bulkDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Đang xóa...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
                      <span>Xóa {selectedIds.size} đề thi</span>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
