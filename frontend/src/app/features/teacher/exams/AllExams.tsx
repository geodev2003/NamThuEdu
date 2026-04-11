import { useState, useEffect } from "react";
import { Link } from "react-router";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exams, setExams] = useState<KidsExam[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

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
    return matchesSearch && matchesType;
  });

  // Calculate stats
  const stats = {
    total: exams.length,
    starters: exams.filter(e => e.kids_exam_config?.exam_type === "yle_starters").length,
    movers: exams.filter(e => e.kids_exam_config?.exam_type === "yle_movers").length,
    flyers: exams.filter(e => e.kids_exam_config?.exam_type === "yle_flyers").length,
  };

  // Get exam type display info
  const getExamTypeInfo = (examType: string) => {
    const types: Record<string, { label: string; color: string; emoji: string }> = {
      yle_starters: { label: "Starters", color: "orange", emoji: "🌟" },
      yle_movers: { label: "Movers", color: "teal", emoji: "🚀" },
      yle_flyers: { label: "Flyers", color: "green", emoji: "✈️" },
    };
    return types[examType] || { label: examType, color: "gray", emoji: "📝" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b-4 border-indigo-200">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="font-baloo text-4xl font-bold text-indigo-600 mb-2">
                📚 Ngân hàng đề thi
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link to="/giao-vien" className="hover:text-indigo-600 transition-colors">
                  Dashboard
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">Ngân hàng đề</span>
              </div>
            </div>
            <Link
              to="/giao-vien/de-thi/kids/tao-moi"
              className="px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-2xl hover:scale-105 transition-all flex items-center gap-2 font-baloo text-lg font-bold shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Tạo đề mới
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl animate-spin">🎨</div>
            <p className="mt-4 font-baloo text-xl text-indigo-600">Đang tải... 🚀</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-4 border-red-200 rounded-2xl p-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl border-4 border-indigo-200 p-6 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl">
                  📚
                </div>
              </div>
              <h3 className="text-gray-700 text-sm font-medium mb-1">Tổng số đề thi</h3>
              <p className="font-baloo text-4xl font-bold text-indigo-600">{stats.total}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl border-4 border-orange-200 p-6 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl">
                  🌟
                </div>
              </div>
              <h3 className="text-gray-700 text-sm font-medium mb-1">Starters</h3>
              <p className="font-baloo text-4xl font-bold text-orange-600">{stats.starters}</p>
            </div>

            <div className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl border-4 border-teal-200 p-6 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl">
                  🚀
                </div>
              </div>
              <h3 className="text-gray-700 text-sm font-medium mb-1">Movers</h3>
              <p className="font-baloo text-4xl font-bold text-teal-600">{stats.movers}</p>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl border-4 border-green-200 p-6 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl">
                  ✈️
                </div>
              </div>
              <h3 className="text-gray-700 text-sm font-medium mb-1">Flyers</h3>
              <p className="font-baloo text-4xl font-bold text-green-600">{stats.flyers}</p>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl border-4 border-indigo-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên đề thi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-400 focus:outline-none font-medium"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-400 focus:outline-none font-medium"
              >
                <option value="all">Tất cả loại đề</option>
                <option value="yle_starters">🌟 Starters</option>
                <option value="yle_movers">🚀 Movers</option>
                <option value="yle_flyers">✈️ Flyers</option>
              </select>
            </div>
          </div>
        )}

        {/* Exam Cards Grid */}
        {!loading && !error && filteredExams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => {
              const typeInfo = getExamTypeInfo(exam.kids_exam_config?.exam_type);
              return (
                <div
                  key={exam.eId}
                  className="bg-white rounded-2xl border-4 border-gray-200 p-6 hover:border-indigo-400 hover:scale-105 transition-all shadow-lg"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{typeInfo.emoji}</span>
                      <span className={`px-3 py-1 bg-${typeInfo.color}-100 text-${typeInfo.color}-700 rounded-full text-sm font-bold`}>
                        {typeInfo.label}
                      </span>
                    </div>
                    {exam.eStatus === "draft" && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                        Nháp
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-baloo text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {exam.eTitle}
                  </h3>

                  {/* Description */}
                  {exam.eDescription && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {exam.eDescription}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{exam.questions?.length || 0} câu</span>
                    </div>
                    {exam.eDuration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{exam.eDuration} phút</span>
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                    <Calendar className="w-3 h-3" />
                    <span>Tạo: {new Date(exam.eCreated_at).toLocaleDateString("vi-VN")}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/giao-vien/de-thi/kids/tao-moi/${exam.eId}`}
                      className="flex-1 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Sửa
                    </Link>
                    <Link
                      to={`/giao-vien/de-thi/${exam.eId}/xem`}
                      className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      Xem
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(exam.eId)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredExams.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-4">📚</div>
            <h3 className="font-baloo text-2xl font-bold text-gray-700 mb-2">
              {searchQuery || filterType !== "all" ? "Không tìm thấy đề thi nào" : "Chưa có đề thi nào"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterType !== "all" 
                ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                : "Hãy tạo đề thi đầu tiên của bạn!"
              }
            </p>
            {!searchQuery && filterType === "all" && (
              <Link
                to="/giao-vien/de-thi/kids/tao-moi"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-2xl hover:scale-105 transition-all font-baloo text-lg font-bold shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Tạo đề thi đầu tiên
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border-4 border-red-200 p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="font-baloo text-2xl font-bold text-gray-900 mb-2">
                Xác nhận xóa đề thi
              </h3>
              <p className="text-gray-600">
                Bạn có chắc chắn muốn xóa đề thi này? Hành động này không thể hoàn tác!
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
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
