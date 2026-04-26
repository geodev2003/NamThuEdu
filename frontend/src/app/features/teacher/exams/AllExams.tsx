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
} from "lucide-react";
import { getKidsExams, deleteKidsExam } from "../../../../services/kidsExamApi";

interface KidsExam {
  eId: number;
  eTitle: string;
  eDescription: string | null;
  eDuration: number | null;
  eStatus: string;
  eCreated_at: string;
  kids_exam_config: {
    exam_type: string;
    mode: string;
    level: string;
    age_range: string;
  };
  questions: any[];
}

export function AllExams() {
  usePageTitle(PAGE_TITLES.TEACHER_EXAMS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exams, setExams] = useState<KidsExam[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterAgeGroup, setFilterAgeGroup] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getKidsExams();
      setExams(data);
    } catch (err: any) {
      console.error("Failed to load exams:", err);
      setError(err.message || "Không thể tải danh sách đề thi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (examId: number) => {
    try {
      await deleteKidsExam(examId);
      setExams(exams.filter(e => e.eId !== examId));
      setDeleteConfirm(null);
    } catch (err: any) {
      alert("Không thể xóa đề thi: " + err.message);
    }
  };

  // Filter exams
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.eTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || exam.kids_exam_config?.exam_type === filterType;
    
    // Age group filter
    let matchesAgeGroup = filterAgeGroup === "all";
    if (!matchesAgeGroup) {
      const examAgeGroup = exam.kids_exam_config?.age_range || "all";
      if (filterAgeGroup === "kids") {
        matchesAgeGroup = examAgeGroup === "kids" || examAgeGroup.includes("6-8") || examAgeGroup.includes("8-11") || examAgeGroup.includes("9-12");
      } else if (filterAgeGroup === "teens") {
        matchesAgeGroup = examAgeGroup === "teens" || examAgeGroup.includes("13-17");
      } else if (filterAgeGroup === "adults") {
        matchesAgeGroup = examAgeGroup === "adults" || examAgeGroup.includes("18+") || examAgeGroup.includes("university");
      } else if (filterAgeGroup === "professionals") {
        matchesAgeGroup = examAgeGroup === "professionals" || examAgeGroup.includes("working");
      }
    }
    
    return matchesSearch && matchesType && matchesAgeGroup;
  });

  // Pagination
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedExams = filteredExams.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterAgeGroup]);

  // Calculate stats by age group
  const getAgeGroup = (exam: KidsExam) => {
    const ageRange = exam.kids_exam_config?.age_range || "all";
    if (ageRange === "kids" || ageRange.includes("6-8") || ageRange.includes("8-11") || ageRange.includes("9-12")) return "kids";
    if (ageRange === "teens" || ageRange.includes("13-17")) return "teens";
    if (ageRange === "adults" || ageRange.includes("18+") || ageRange.includes("university")) return "adults";
    if (ageRange === "professionals" || ageRange.includes("working")) return "professionals";
    return "all";
  };

  const stats = {
    total: exams.length,
    kids: exams.filter(e => getAgeGroup(e) === "kids").length,
    teens: exams.filter(e => getAgeGroup(e) === "teens").length,
    adults: exams.filter(e => getAgeGroup(e) === "adults").length,
    professionals: exams.filter(e => getAgeGroup(e) === "professionals").length,
  };

  // Get exam type display info
  const getExamTypeInfo = (examType: string | undefined) => {
    if (!examType) {
      return { label: "Chưa phân loại", color: "#6B7280" };
    }
    
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
    
    return types[examType.toLowerCase()] || { label: examType, color: "#6B7280" };
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

        {/* Refined Exam Cards Grid */}
        {!loading && !error && paginatedExams.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedExams.map((exam) => {
              const typeInfo = getExamTypeInfo(exam.kids_exam_config?.exam_type);
              return (
                <div
                  key={exam.eId}
                  className="group bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-5 hover:border-orange-300 hover:shadow-lg transition-all cursor-pointer"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
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
                      <span>{exam.questions?.length || 0} câu</span>
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
                      to={`/giao-vien/de-thi/kids/tao-moi/${exam.eId}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Sửa
                    </Link>
                    <Link
                      to={`/giao-vien/de-thi/${exam.eId}/xem`}
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Xác nhận xóa đề thi
                </h3>
                <p className="text-sm text-gray-600">
                  Bạn có chắc chắn muốn xóa đề thi này? Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all text-sm font-medium shadow-sm"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
