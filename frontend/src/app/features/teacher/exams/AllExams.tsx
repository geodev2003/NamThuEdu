import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  FileText,
  Plus,
  LayoutTemplate,
  Search,
  X,
  Grid3x3,
  List,
  ChevronDown,
  Clock,
  HelpCircle,
  Eye,
  Edit,
  Copy,
  Trash2,
  MoreVertical,
  Users,
  FileCheck,
  Target,
  Calendar,
  Send,
  Download,
  BookOpen,
  Headphones,
  Pen,
  MessageSquare,
  FileEdit,
  AlertCircle,
} from "lucide-react";

interface DraftExam {
  examType: string;
  examSkill: string;
  examTitle: string;
  examDescription: string;
  duration: number;
  questions: any[];
  timestamp: number;
  currentStep: number;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  type: "VSTEP" | "IELTS" | "Cambridge" | "General";
  skill: "Listening" | "Reading" | "Writing" | "Speaking";
  duration: number;
  questions: number;
  points: number;
  status: "Draft" | "Published" | "Private";
  source: "Manual" | "Template" | "Upload";
  createdAt: string;
  assignments: number;
  submissions: number;
  avgScore: number;
  progress?: number;
}

// Mock exams removed - will be loaded from API
const mockExams: Exam[] = [];

const typeColors = {
  VSTEP: "bg-orange-100 text-orange-700 border-orange-200",
  IELTS: "bg-green-100 text-green-700 border-green-200",
  Cambridge: "bg-purple-100 text-purple-700 border-purple-200",
  General: "bg-gray-100 text-gray-700 border-gray-200",
};

const skillIcons = {
  Listening: Headphones,
  Reading: BookOpen,
  Writing: Pen,
  Speaking: MessageSquare,
};

const skillColors = {
  Listening: "text-orange-600",
  Reading: "text-green-600",
  Writing: "text-orange-600",
  Speaking: "text-purple-600",
};

const statusColors = {
  Draft: "bg-orange-100 text-orange-700",
  Published: "bg-green-100 text-green-700",
  Private: "bg-gray-100 text-gray-700",
};

const sourceColors = {
  Manual: "bg-orange-50 text-orange-600",
  Template: "bg-purple-50 text-purple-600",
  Upload: "bg-green-50 text-green-600",
};

export function AllExams() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterSkill, setFilterSkill] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [localDrafts, setLocalDrafts] = useState<DraftExam[]>([]);

  // Load drafts from localStorage
  useEffect(() => {
    const loadDrafts = () => {
      try {
        const draftKey = 'exam-draft-current';
        const saved = localStorage.getItem(draftKey);
        if (saved) {
          const draft = JSON.parse(saved);
          // Check if draft has any content (even just exam type/skill selection)
          const hasMeaningfulContent = draft && (
            draft.examType || 
            draft.examSkill ||
            draft.examTitle?.trim() || 
            draft.examDescription?.trim() || 
            (draft.questions && draft.questions.length > 0)
          );
          
          if (hasMeaningfulContent) {
            setLocalDrafts([draft]);
          }
        }
      } catch (error) {
        console.error('Failed to load drafts:', error);
      }
    };
    
    loadDrafts();
  }, []);

  const deleteDraft = () => {
    if (window.confirm('Bạn có chắc muốn xóa bản nháp này?')) {
      localStorage.removeItem('exam-draft-current');
      setLocalDrafts([]);
    }
  };

  const continueDraft = () => {
    window.location.href = '/giao-vien/de-thi/tao-moi';
  };
  const [filterSource, setFilterSource] = useState("all");
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Statistics
  const totalExams = mockExams.length;
  const publishedExams = mockExams.filter((e) => e.status === "Published").length;
  const draftExams = mockExams.filter((e) => e.status === "Draft").length;
  const totalQuestions = mockExams.reduce((sum, e) => sum + e.questions, 0);

  // Filter exams
  const filteredExams = mockExams.filter((exam) => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || exam.type === filterType;
    const matchesSkill = filterSkill === "all" || exam.skill === filterSkill;
    const matchesStatus = filterStatus === "all" || exam.status === filterStatus;
    const matchesSource = filterSource === "all" || exam.source === filterSource;
    return matchesSearch && matchesType && matchesSkill && matchesStatus && matchesSource;
  });

  const clearFilters = () => {
    setFilterType("all");
    setFilterSkill("all");
    setFilterStatus("all");
    setFilterSource("all");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-amber-50/20 to-orange-50/10">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Ngân hàng đề thi</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link to="/giao-vien" className="hover:text-orange-600 transition-colors">
                  Dashboard
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">Ngân hàng đề</span>
                <span>/</span>
                <span className="text-gray-900 font-medium">Tất cả đề thi</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/giao-vien/de-thi/mau-de"
                className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 font-medium"
              >
                <LayoutTemplate className="w-4 h-4" />
                Từ mẫu đề
              </Link>
              <Link
                to="/giao-vien/de-thi/tao-moi"
                className="px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all flex items-center gap-2 font-medium shadow-lg shadow-orange-500/30"
              >
                <Plus className="w-4 h-4" />
                Tạo đề mới
              </Link>
              <div className="flex items-center gap-1 ml-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-all ${
                    viewMode === "list"
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Tổng số đề thi</h3>
            <p className="text-3xl font-bold text-gray-900">{totalExams}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Đã xuất bản</h3>
            <p className="text-3xl font-bold text-gray-900">{publishedExams}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Bản nháp</h3>
            <p className="text-3xl font-bold text-gray-900">{draftExams + localDrafts.length}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Tổng câu hỏi</h3>
            <p className="text-3xl font-bold text-gray-900">{totalQuestions}</p>
          </div>
        </div>

        {/* Local Drafts Section */}
        {localDrafts.length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileEdit className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">Bản nháp chưa lưu</h3>
                  <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-medium rounded">
                    Chưa hoàn thành
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Bạn có một bản nháp đang dở. Tiếp tục chỉnh sửa hoặc xóa để tạo đề mới.
                </p>
                
                {localDrafts.map((draft, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-orange-200 mb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {draft.examTitle || "Đề thi chưa có tên"}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {draft.examType || "Chưa chọn loại"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {draft.examSkill || "Chưa chọn kỹ năng"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {draft.duration || 0} phút
                          </span>
                          <span className="flex items-center gap-1">
                            <HelpCircle className="w-4 h-4" />
                            {draft.questions?.length || 0} câu hỏi
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Lưu lúc: {new Date(draft.timestamp).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={continueDraft}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all flex items-center gap-2 font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Tiếp tục
                        </button>
                        <button
                          onClick={deleteDraft}
                          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo tên đề thi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer text-sm"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="VSTEP">VSTEP</option>
                  <option value="IELTS">IELTS</option>
                  <option value="Cambridge">Cambridge</option>
                  <option value="General">General</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={filterSkill}
                  onChange={(e) => setFilterSkill(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer text-sm"
                >
                  <option value="all">Tất cả kỹ năng</option>
                  <option value="Listening">Listening</option>
                  <option value="Reading">Reading</option>
                  <option value="Writing">Writing</option>
                  <option value="Speaking">Speaking</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer text-sm"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Draft">Bản nháp</option>
                  <option value="Published">Đã xuất bản</option>
                  <option value="Private">Riêng tư</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer text-sm"
                >
                  <option value="all">Tất cả nguồn</option>
                  <option value="Manual">Tự tạo</option>
                  <option value="Template">Từ mẫu</option>
                  <option value="Upload">Upload</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {(filterType !== "all" ||
                filterSkill !== "all" ||
                filterStatus !== "all" ||
                filterSource !== "all" ||
                searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Exam Cards Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => {
              const SkillIcon = skillIcons[exam.skill];
              return (
                <div
                  key={exam.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${typeColors[exam.type]}`}
                      >
                        {exam.type}
                      </span>
                      <div className="flex items-center gap-2">
                        <SkillIcon className={`w-5 h-5 ${skillColors[exam.skill]}`} />
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowActionMenu(showActionMenu === exam.id ? null : exam.id)
                            }
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                          {showActionMenu === exam.id && (
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg w-48 py-2 z-10">
                              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                Xem trước
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                <Copy className="w-4 h-4" />
                                Sao chép
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                <Send className="w-4 h-4" />
                                Giao cho lớp
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Xuất PDF
                              </button>
                              <hr className="my-2" />
                              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                                <Trash2 className="w-4 h-4" />
                                Xóa
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {exam.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{exam.description}</p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{exam.duration} phút</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <HelpCircle className="w-4 h-4" />
                        <span>{exam.questions} câu</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Target className="w-4 h-4" />
                        <span>{exam.points} điểm</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(exam.createdAt).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${statusColors[exam.status]}`}>
                        {exam.status === "Draft"
                          ? "Bản nháp"
                          : exam.status === "Published"
                            ? "Đã xuất bản"
                            : "Riêng tư"}
                      </span>
                      <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${sourceColors[exam.source]}`}>
                        {exam.source === "Manual"
                          ? "Tự tạo"
                          : exam.source === "Template"
                            ? "Từ mẫu"
                            : "Upload"}
                      </span>
                    </div>

                    {exam.progress !== undefined && exam.progress < 100 && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Tiến độ</span>
                          <span>{exam.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-600 h-full rounded-full transition-all"
                            style={{ width: `${exam.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {exam.submissions > 0 && (
                      <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Lớp</p>
                          <p className="text-sm font-semibold text-gray-900">{exam.assignments}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Bài nộp</p>
                          <p className="text-sm font-semibold text-gray-900">{exam.submissions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Điểm TB</p>
                          <p className="text-sm font-semibold text-gray-900">{exam.avgScore}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 pb-6 flex items-center gap-2">
                    <Link
                      to={`/giao-vien/de-thi/${exam.id}`}
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all text-center text-sm font-medium"
                    >
                      Xem chi tiết
                    </Link>
                    <Link
                      to={`/giao-vien/de-thi/${exam.id}/chinh-sua`}
                      className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-center text-sm font-medium"
                    >
                      Chỉnh sửa
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tên đề thi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Kỹ năng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Câu hỏi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nguồn
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredExams.map((exam) => {
                    const SkillIcon = skillIcons[exam.skill];
                    return (
                      <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            to={`/giao-vien/de-thi/${exam.id}`}
                            className="font-semibold text-gray-900 hover:text-orange-600 transition-colors"
                          >
                            {exam.title}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">{exam.description}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold border ${typeColors[exam.type]}`}
                          >
                            {exam.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <SkillIcon className={`w-4 h-4 ${skillColors[exam.skill]}`} />
                            <span className="text-sm text-gray-900">{exam.skill}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{exam.duration} phút</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{exam.questions}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${statusColors[exam.status]}`}>
                            {exam.status === "Draft"
                              ? "Bản nháp"
                              : exam.status === "Published"
                                ? "Đã xuất bản"
                                : "Riêng tư"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${sourceColors[exam.source]}`}>
                            {exam.source === "Manual"
                              ? "Tự tạo"
                              : exam.source === "Template"
                                ? "Từ mẫu"
                                : "Upload"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/giao-vien/de-thi/${exam.id}`}
                              className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/giao-vien/de-thi/${exam.id}/chinh-sua`}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                              title="Sao chép"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredExams.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Không tìm thấy đề thi</h3>
              <p className="text-gray-600">
                {searchTerm ||
                filterType !== "all" ||
                filterSkill !== "all" ||
                filterStatus !== "all" ||
                filterSource !== "all"
                  ? "Không có đề thi nào phù hợp với bộ lọc."
                  : "Chưa có đề thi nào trong ngân hàng đề."}
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  to="/giao-vien/de-thi/tao-moi"
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tạo đề mới
                </Link>
                <Link
                  to="/giao-vien/de-thi/mau-de"
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium inline-flex items-center gap-2"
                >
                  <LayoutTemplate className="w-4 h-4" />
                  Chọn từ mẫu đề
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredExams.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Hiển thị <span className="font-semibold">{filteredExams.length}</span> trong tổng số{" "}
              <span className="font-semibold">{totalExams}</span> đề thi
            </p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                Trước
              </button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                3
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



