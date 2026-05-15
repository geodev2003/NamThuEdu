import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { usePageTitle, PAGE_TITLES } from "../../../../hooks/usePageTitle";
import {
  Plus,
  Search,
  Filter,
  Grid3x3,
  List,
  BookOpen,
  FileText,
  Shuffle,
  Headphones,
  Book,
  PenTool,
  Mic,
  Clock,
  Users,
  BarChart3,
  Edit,
  Eye,
  Trash2,
  Copy,
  Send,
  MoreVertical,
  TrendingUp,
  CheckCircle,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { usePracticeSessions } from "@/hooks/usePracticeSessions";

type PracticeType = "topic_based" | "template_based" | "random" | "skill_based" | "custom";
type Skill = "listening" | "reading" | "writing" | "speaking";
type Difficulty = "easy" | "medium" | "hard" | "mixed";
type Purpose = "review" | "practice" | "drill" | "mock_test" | "homework";

export function PracticeSessionList() {
  usePageTitle(PAGE_TITLES.TEACHER_PRACTICE);
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSkill, setFilterSkill] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterPurpose, setFilterPurpose] = useState<string>("all");

  // Use custom hook
  const { sessions, statistics, loading, error, refetch } = usePracticeSessions({
    type: filterType,
    skill: filterSkill,
    purpose: filterPurpose,
    difficulty: filterDifficulty,
  });

  const getTypeConfig = (type: PracticeType) => {
    const configs = {
      topic_based: { label: "Theo chủ đề", color: "purple", icon: BookOpen, badgeClass: "bg-purple-100 text-purple-700" },
      template_based: { label: "Template", color: "blue", icon: FileText, badgeClass: "bg-blue-100 text-blue-700" },
      random: { label: "Ngẫu nhiên", color: "orange", icon: Shuffle, badgeClass: "bg-orange-100 text-orange-700" },
      skill_based: { label: "Theo kỹ năng", color: "green", icon: BarChart3, badgeClass: "bg-green-100 text-green-700" },
      custom: { label: "Tùy chỉnh", color: "gray", icon: Edit, badgeClass: "bg-gray-100 text-gray-700" },
    };
    return configs[type] || configs.custom;
  };

  const getSkillConfig = (skill: Skill) => {
    const configs = {
      listening: { label: "Listening", color: "blue", icon: Headphones, textClass: "text-blue-600" },
      reading: { label: "Reading", color: "green", icon: Book, textClass: "text-green-600" },
      writing: { label: "Writing", color: "amber", icon: PenTool, textClass: "text-amber-600" },
      speaking: { label: "Speaking", color: "red", icon: Mic, textClass: "text-red-600" },
    };
    return configs[skill];
  };

  const getDifficultyConfig = (difficulty: Difficulty) => {
    const configs = {
      easy: { label: "Dễ", color: "green", stars: 1, badgeClass: "bg-green-100 text-green-700" },
      medium: { label: "Trung bình", color: "amber", stars: 2, badgeClass: "bg-amber-100 text-amber-700" },
      hard: { label: "Khó", color: "red", stars: 3, badgeClass: "bg-red-100 text-red-700" },
      mixed: { label: "Hỗn hợp", color: "gray", stars: 0, badgeClass: "bg-gray-100 text-gray-700" },
    };
    return configs[difficulty];
  };

  const getPurposeLabel = (purpose: Purpose) => {
    const labels = {
      review: "Ôn tập",
      practice: "Luyện tập",
      drill: "Rèn luyện",
      mock_test: "Thi thử",
      homework: "Bài tập về nhà",
    };
    return labels[purpose];
  };

  // Client-side search filtering
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch = session.ps_title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [sessions, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Đang tải bài luyện tập...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-semibold mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Bài luyện tập</h1>
            <p className="text-gray-600 mt-1">Quản lý và tạo bài luyện tập cho học sinh</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Tạo bài luyện tập
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Tổng số
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{statistics?.total || sessions.length}</p>
            <p className="text-sm text-gray-600">Bài luyện tập</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Hoạt động
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{statistics?.active_count || 0}</p>
            <p className="text-sm text-gray-600">Đang hoạt động</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                Gần đây
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{statistics?.recent_count || 0}</p>
            <p className="text-sm text-gray-600">Bài mới tạo</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                Loại
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {statistics?.by_type ? Object.keys(statistics.by_type).length : 0}
            </p>
            <p className="text-sm text-gray-600">Loại khác nhau</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài luyện tập..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="md:col-span-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả loại</option>
                <option value="topic_based">Theo chủ đề</option>
                <option value="template_based">Template</option>
                <option value="random">Ngẫu nhiên</option>
                <option value="skill_based">Theo kỹ năng</option>
              </select>
            </div>

            {/* Skill Filter */}
            <div className="md:col-span-2">
              <select
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả kỹ năng</option>
                <option value="listening">Listening</option>
                <option value="reading">Reading</option>
                <option value="writing">Writing</option>
                <option value="speaking">Speaking</option>
              </select>
            </div>

            {/* Purpose Filter */}
            <div className="md:col-span-2">
              <select
                value={filterPurpose}
                onChange={(e) => setFilterPurpose(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Mục đích</option>
                <option value="review">Ôn tập</option>
                <option value="practice">Luyện tập</option>
                <option value="drill">Rèn luyện</option>
                <option value="mock_test">Thi thử</option>
                <option value="homework">BTVN</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="md:col-span-1">
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Độ khó</option>
                <option value="easy">Dễ</option>
                <option value="medium">TB</option>
                <option value="hard">Khó</option>
                <option value="mixed">Mix</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="md:col-span-1 flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                  viewMode === "grid"
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
                }`}
              >
                <Grid3x3 className="w-5 h-5 mx-auto" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                  viewMode === "list"
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
                }`}
              >
                <List className="w-5 h-5 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredSessions.map((session) => {
            const typeConfig = getTypeConfig(session.ps_type as PracticeType);
            const skillConfig = session.ps_target_skill ? getSkillConfig(session.ps_target_skill as Skill) : null;
            const difficultyConfig = session.ps_difficulty ? getDifficultyConfig(session.ps_difficulty as Difficulty) : null;
            const TypeIcon = typeConfig.icon;
            const SkillIcon = skillConfig?.icon;

            return (
              <div
                key={session.ps_id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 ${typeConfig.badgeClass} text-xs font-semibold rounded-lg flex items-center gap-1.5`}>
                          <TypeIcon className="w-3.5 h-3.5" />
                          {typeConfig.label}
                        </span>
                        {!session.ps_is_active && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                            Không hoạt động
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                        {session.ps_title}
                      </h3>
                      {session.ps_description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{session.ps_description}</p>
                      )}
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    {skillConfig && SkillIcon && (
                      <div className={`flex items-center gap-1.5 ${skillConfig.textClass}`}>
                        <SkillIcon className="w-4 h-4" />
                        <span className="font-medium">{skillConfig.label}</span>
                      </div>
                    )}
                    {difficultyConfig && (
                      <div className={`px-2 py-1 ${difficultyConfig.badgeClass} text-xs font-semibold rounded-lg`}>
                        {difficultyConfig.label}
                      </div>
                    )}
                    {session.ps_purpose && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                        {getPurposeLabel(session.ps_purpose as Purpose)}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {session.ps_duration_minutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{session.ps_duration_minutes} phút</span>
                      </div>
                    )}
                    {session.ps_question_count && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{session.ps_question_count} câu</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(session.ps_created_at).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>

                  {/* Exam Info */}
                  {session.exam && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Đề thi liên kết</span>
                        <span className="font-semibold text-blue-600">{session.exam.eTitle}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-4 gap-2 pt-4">
                    <button onClick={() => navigate(`/giao-vien/luyen-tap/${session.ps_id}`)} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors flex items-center justify-center" title="Xem">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors flex items-center justify-center" title="Giao bài">
                      <Send className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors flex items-center justify-center" title="Sao chép">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors flex items-center justify-center" title="Chỉnh sửa">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredSessions.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy bài luyện tập
            </h3>
            <p className="text-gray-600 mb-6">
              Thử thay đổi bộ lọc hoặc tạo bài luyện tập mới
            </p>
            <button
              onClick={() => navigate("/giao-vien/de-thi/tao-moi")}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all">
              Tạo bài luyện tập đầu tiên
            </button>
          </div>
        )}
      </div>
    </div>
  );
}