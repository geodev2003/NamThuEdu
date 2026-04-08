import { useState } from "react";
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
  Target,
  Calendar,
  Send,
  Download,
  Archive,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  BookOpen,
  Headphones,
  Pen,
  MessageSquare,
  Activity,
} from "lucide-react";

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
  modifiedAt: string;
  createdFrom?: string;
  assignments: number;
  submissions: number;
  avgScore: number;
  completionRate: number;
  avgTimeSpent: number;
}

const mockExams: Exam[] = [
  {
    id: "1",
    title: "VSTEP B2 Listening - Practice Test 1",
    description: "Comprehensive listening test covering all parts of VSTEP B2 format",
    type: "VSTEP",
    skill: "Listening",
    duration: 90,
    questions: 40,
    points: 100,
    status: "Published",
    source: "Template",
    createdAt: "2026-03-15",
    modifiedAt: "2026-03-20",
    createdFrom: "VSTEP B2 Template",
    assignments: 12,
    submissions: 350,
    avgScore: 78,
    completionRate: 95,
    avgTimeSpent: 85,
  },
  {
    id: "2",
    title: "IELTS Reading - Academic Module",
    description: "Full-length IELTS reading test with 3 passages",
    type: "IELTS",
    skill: "Reading",
    duration: 60,
    questions: 40,
    points: 100,
    status: "Published",
    source: "Manual",
    createdAt: "2026-03-14",
    modifiedAt: "2026-03-18",
    assignments: 8,
    submissions: 240,
    avgScore: 68,
    completionRate: 92,
    avgTimeSpent: 58,
  },
  {
    id: "3",
    title: "Cambridge FCE Writing Task 1",
    description: "Essay writing practice for B2 First exam",
    type: "Cambridge",
    skill: "Writing",
    duration: 45,
    questions: 2,
    points: 50,
    status: "Draft",
    source: "Manual",
    createdAt: "2026-03-16",
    modifiedAt: "2026-03-16",
    assignments: 0,
    submissions: 0,
    avgScore: 0,
    completionRate: 0,
    avgTimeSpent: 0,
  },
  {
    id: "4",
    title: "General Speaking Assessment",
    description: "Interactive speaking test with multiple topics",
    type: "General",
    skill: "Speaking",
    duration: 30,
    questions: 5,
    points: 100,
    status: "Private",
    source: "Upload",
    createdAt: "2026-03-10",
    modifiedAt: "2026-03-19",
    assignments: 5,
    submissions: 125,
    avgScore: 82,
    completionRate: 98,
    avgTimeSpent: 28,
  },
  {
    id: "5",
    title: "VSTEP B1 Reading Comprehension",
    description: "Reading test for B1 level with various text types",
    type: "VSTEP",
    skill: "Reading",
    duration: 60,
    questions: 35,
    points: 100,
    status: "Published",
    source: "Template",
    createdAt: "2026-03-12",
    modifiedAt: "2026-03-21",
    createdFrom: "VSTEP B1 Template",
    assignments: 15,
    submissions: 450,
    avgScore: 71,
    completionRate: 94,
    avgTimeSpent: 57,
  },
];

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

export function MyExams() {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterSkill, setFilterSkill] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Filter by tab
  const filterByTab = (exam: Exam) => {
    if (activeTab === "all") return true;
    if (activeTab === "published") return exam.status === "Published";
    if (activeTab === "draft") return exam.status === "Draft";
    if (activeTab === "private") return exam.status === "Private";
    return true;
  };

  // Filter exams
  const filteredExams = mockExams
    .filter((exam) => {
      const matchesTab = filterByTab(exam);
      const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || exam.type === filterType;
      const matchesSkill = filterSkill === "all" || exam.skill === filterSkill;
      return matchesTab && matchesSearch && matchesType && matchesSkill;
    })
    .sort((a, b) => {
      if (sortBy === "recent") return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "most-used") return b.assignments - a.assignments;
      if (sortBy === "highest-score") return b.avgScore - a.avgScore;
      return 0;
    });

  // Tab counts
  const allCount = mockExams.length;
  const publishedCount = mockExams.filter((e) => e.status === "Published").length;
  const draftCount = mockExams.filter((e) => e.status === "Draft").length;
  const privateCount = mockExams.filter((e) => e.status === "Private").length;

  const clearFilters = () => {
    setFilterType("all");
    setFilterSkill("all");
    setSearchTerm("");
    setSortBy("recent");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-amber-50/20 to-orange-50/10">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Đề thi của tôi</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link to="/giao-vien" className="hover:text-orange-600 transition-colors">
                  Dashboard
                </Link>
                <span>/</span>
                <Link to="/giao-vien/de-thi/tat-ca" className="hover:text-orange-600 transition-colors">
                  Ngân hàng đề
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">Đề thi của tôi</span>
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
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "all"
                ? "bg-orange-600 text-white shadow-lg shadow-orange-500/30"
                : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:bg-orange-50"
            }`}
          >
            Tất cả
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "all" ? "bg-white/20" : "bg-gray-100"
              }`}
            >
              {allCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("published")}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "published"
                ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
                : "bg-white text-gray-700 border border-gray-200 hover:border-green-300 hover:bg-green-50"
            }`}
          >
            Đã xuất bản
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "published" ? "bg-white/20" : "bg-gray-100"
              }`}
            >
              {publishedCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("draft")}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "draft"
                ? "bg-orange-600 text-white shadow-lg shadow-orange-500/30"
                : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:bg-orange-50"
            }`}
          >
            Bản nháp
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "draft" ? "bg-white/20" : "bg-gray-100"
              }`}
            >
              {draftCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("private")}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "private"
                ? "bg-gray-600 text-white shadow-lg shadow-gray-500/30"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            Riêng tư
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "private" ? "bg-white/20" : "bg-gray-100"
              }`}
            >
              {privateCount}
            </span>
          </button>
        </div>

        {/* Secondary Filters */}
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
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer text-sm"
                >
                  <option value="recent">Mới nhất</option>
                  <option value="name">Tên A-Z</option>
                  <option value="most-used">Dùng nhiều nhất</option>
                  <option value="highest-score">Điểm cao nhất</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {(filterType !== "all" || filterSkill !== "all" || searchTerm || sortBy !== "recent") && (
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

        {/* Bulk Actions */}
        {selectedExams.length > 0 && (
          <div className="bg-orange-600 text-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{selectedExams.length} đề thi đã chọn</span>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium">
                  Xuất bản
                </button>
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium">
                  Lưu trữ
                </button>
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium">
                  Xuất file
                </button>
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium">
                  Xóa
                </button>
                <button
                  onClick={() => setSelectedExams([])}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exam Cards Grid */}
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
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedExams.includes(exam.id)}
                          onChange={() => {
                            setSelectedExams((prev) =>
                              prev.includes(exam.id)
                                ? prev.filter((id) => id !== exam.id)
                                : [...prev, exam.id]
                            );
                          }}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span
                          className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${typeColors[exam.type]}`}
                        >
                          {exam.type}
                        </span>
                      </div>
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
                                <BarChart3 className="w-4 h-4" />
                                Xem thống kê
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Xuất PDF
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                <Archive className="w-4 h-4" />
                                Lưu trữ
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
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{exam.description}</p>
                    {exam.createdFrom && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <LayoutTemplate className="w-3 h-3" />
                        <span>Từ mẫu: {exam.createdFrom}</span>
                      </div>
                    )}
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
                        <span>{new Date(exam.modifiedAt).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`inline-block whitespace-nowrap px-2.5 py-1 rounded-md text-xs font-semibold ${statusColors[exam.status]}`}>
                        {exam.status === "Draft"
                          ? "Bản nháp"
                          : exam.status === "Published"
                            ? "Đã xuất bản"
                            : "Riêng tư"}
                      </span>
                    </div>

                    {exam.submissions > 0 && (
                      <>
                        <div className="pt-4 border-t border-gray-100 space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Đã giao</span>
                            <span className="font-semibold text-gray-900">
                              {exam.assignments} lớp
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Bài nộp</span>
                            <span className="font-semibold text-gray-900">{exam.submissions}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Điểm TB</span>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-gray-900">{exam.avgScore}/100</span>
                              {exam.avgScore >= 75 && (
                                <TrendingUp className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Hoàn thành</span>
                            <span className="font-semibold text-gray-900">
                              {exam.completionRate}%
                            </span>
                          </div>
                        </div>

                        {/* Mini Chart */}
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-700">Hiệu suất</span>
                            <Activity className="w-4 h-4 text-orange-600" />
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Điểm</p>
                              <div className="h-12 bg-orange-200 rounded relative">
                                <div
                                  className="absolute bottom-0 w-full bg-orange-600 rounded"
                                  style={{ height: `${exam.avgScore}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Hoàn thành</p>
                              <div className="h-12 bg-green-200 rounded relative">
                                <div
                                  className="absolute bottom-0 w-full bg-green-600 rounded"
                                  style={{ height: `${exam.completionRate}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Thời gian</p>
                              <div className="h-12 bg-purple-200 rounded relative">
                                <div
                                  className="absolute bottom-0 w-full bg-purple-600 rounded"
                                  style={{
                                    height: `${(exam.avgTimeSpent / exam.duration) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 pb-6 flex items-center gap-2">
                    <Link
                      to={`/de-thi/${exam.id}`}
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all text-center text-sm font-medium"
                    >
                      Xem chi tiết
                    </Link>
                    <Link
                      to={`/de-thi/${exam.id}/chinh-sua`}
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
                      Đã giao
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Bài nộp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Điểm TB
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Sửa lần cuối
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
                            checked={selectedExams.includes(exam.id)}
                            onChange={() => {
                              setSelectedExams((prev) =>
                                prev.includes(exam.id)
                                  ? prev.filter((id) => id !== exam.id)
                                  : [...prev, exam.id]
                              );
                            }}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            to={`/de-thi/${exam.id}`}
                            className="font-semibold text-gray-900 hover:text-orange-600 transition-colors flex items-center gap-2"
                          >
                            <SkillIcon className={`w-4 h-4 ${skillColors[exam.skill]}`} />
                            <span>{exam.title}</span>
                          </Link>
                          {exam.createdFrom && (
                            <p className="text-xs text-gray-500 mt-1">Từ: {exam.createdFrom}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block whitespace-nowrap px-2.5 py-1 rounded-md text-xs font-semibold border ${typeColors[exam.type]}`}
                          >
                            {exam.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {exam.assignments} lớp
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {exam.submissions}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-gray-900">
                              {exam.avgScore}
                            </span>
                            {exam.avgScore >= 75 && (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block whitespace-nowrap px-2.5 py-1 rounded-md text-xs font-semibold ${statusColors[exam.status]}`}>
                            {exam.status === "Draft"
                              ? "Bản nháp"
                              : exam.status === "Published"
                                ? "Đã xuất bản"
                                : "Riêng tư"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(exam.modifiedAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/de-thi/${exam.id}`}
                              className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/de-thi/${exam.id}/chinh-sua`}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                              title="Thống kê"
                            >
                              <BarChart3 className="w-4 h-4" />
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
              <h3 className="text-xl font-semibold text-gray-900">
                {activeTab === "all" ? "Bạn chưa tạo đề thi nào" : "Không có đề thi nào"}
              </h3>
              <p className="text-gray-600">
                {activeTab === "all"
                  ? "Hãy bắt đầu bằng cách tạo đề thi mới hoặc chọn từ mẫu đề có sẵn."
                  : "Không có đề thi nào trong danh mục này."}
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
      </div>
    </div>
  );
}


