import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Info,
  Search,
  X,
  ChevronDown,
  Clock,
  HelpCircle,
  Users,
  FileText,
  BookOpen,
  Headphones,
  Pen,
  MessageSquare,
  Target,
  CheckCircle,
  Eye,
  Sparkles,
} from "lucide-react";

interface ExamTemplate {
  id: string;
  name: string;
  level: string;
  category: string;
  ageGroup: string;
  skills: string[];
  duration: number;
  sections: number;
  parts: number;
  totalQuestions: number;
  totalPoints: number;
  description: string;
  structure: string;
  popularity: number;
}

const mockTemplates: ExamTemplate[] = [
  {
    id: "yl-starters",
    name: "Pre A1 Starters",
    level: "Pre A1",
    category: "Cambridge Young Learners",
    ageGroup: "7-12 tuổi",
    skills: ["Listening", "Reading & Writing", "Speaking"],
    duration: 45,
    sections: 3,
    parts: 3,
    totalQuestions: 25,
    totalPoints: 100,
    description: "Kỳ thi đầu tiên trong hệ thống Cambridge Young Learners dành cho trẻ em mới bắt đầu học tiếng Anh",
    structure: "3 phần: Listening, Reading & Writing, Speaking với hoạt động vui nhộn phù hợp lứa tuổi",
    popularity: 85,
  },
  {
    id: "yl-movers",
    name: "A1 Movers",
    level: "A1",
    category: "Cambridge Young Learners",
    ageGroup: "8-11 tuổi",
    skills: ["Listening", "Reading & Writing", "Speaking"],
    duration: 55,
    sections: 3,
    parts: 3,
    totalQuestions: 30,
    totalPoints: 100,
    description: "Cấp độ thứ hai trong hệ thống Cambridge Young Learners với độ khó tăng dần",
    structure: "3 phần kỹ năng với các bài tập phù hợp trình độ A1",
    popularity: 78,
  },
  {
    id: "yl-flyers",
    name: "A2 Flyers",
    level: "A2",
    category: "Cambridge Young Learners",
    ageGroup: "9-12 tuổi",
    skills: ["Listening", "Reading & Writing", "Speaking"],
    duration: 60,
    sections: 3,
    parts: 3,
    totalQuestions: 35,
    totalPoints: 100,
    description: "Cấp độ cao nhất trong hệ thống Cambridge Young Learners, chuẩn bị cho KET",
    structure: "3 phần kỹ năng với độ khó tương đương A2",
    popularity: 72,
  },
  {
    id: "key-a2",
    name: "A2 Key (KET)",
    level: "A2",
    category: "Cambridge Main Suite",
    ageGroup: "Mọi lứa tuổi",
    skills: ["Reading & Writing", "Listening", "Speaking"],
    duration: 110,
    sections: 3,
    parts: 7,
    totalQuestions: 60,
    totalPoints: 150,
    description: "Chứng chỉ tiếng Anh cơ bản của Cambridge, phù hợp cho người mới bắt đầu",
    structure: "Reading & Writing (60 phút), Listening (30 phút), Speaking (8-10 phút)",
    popularity: 92,
  },
  {
    id: "pet-b1",
    name: "B1 Preliminary (PET)",
    level: "B1",
    category: "Cambridge Main Suite",
    ageGroup: "Mọi lứa tuổi",
    skills: ["Reading", "Writing", "Listening", "Speaking"],
    duration: 140,
    sections: 4,
    parts: 8,
    totalQuestions: 70,
    totalPoints: 170,
    description: "Chứng chỉ trung cấp thấp của Cambridge, phù hợp cho người có nền tảng cơ bản",
    structure: "Reading (45 phút), Writing (45 phút), Listening (30 phút), Speaking (12-14 phút)",
    popularity: 88,
  },
  {
    id: "fce-b2",
    name: "B2 First (FCE)",
    level: "B2",
    category: "Cambridge Main Suite",
    ageGroup: "Mọi lứa tuổi",
    skills: ["Reading & Use of English", "Writing", "Listening", "Speaking"],
    duration: 209,
    sections: 4,
    parts: 7,
    totalQuestions: 82,
    totalPoints: 190,
    description: "Chứng chỉ trung cấp cao của Cambridge, được công nhận rộng rãi",
    structure: "Reading & Use of English (75 phút), Writing (80 phút), Listening (40 phút), Speaking (14 phút)",
    popularity: 95,
  },
  {
    id: "cae-c1",
    name: "C1 Advanced (CAE)",
    level: "C1",
    category: "Cambridge Main Suite",
    ageGroup: "Mọi lứa tuổi",
    skills: ["Reading & Use of English", "Writing", "Listening", "Speaking"],
    duration: 235,
    sections: 4,
    parts: 8,
    totalQuestions: 86,
    totalPoints: 210,
    description: "Chứng chỉ cao cấp của Cambridge, chứng minh trình độ tiếng Anh xuất sắc",
    structure: "Reading & Use of English (90 phút), Writing (90 phút), Listening (40 phút), Speaking (15 phút)",
    popularity: 81,
  },
  {
    id: "vstep-b1",
    name: "VSTEP B1",
    level: "B1",
    category: "International Tests",
    ageGroup: "Người lớn",
    skills: ["Listening", "Reading", "Writing", "Speaking"],
    duration: 145,
    sections: 4,
    parts: 4,
    totalQuestions: 60,
    totalPoints: 100,
    description: "Bài thi tiếng Anh chuẩn Việt Nam theo khung CEFR, cấp độ B1",
    structure: "Listening (40 phút), Reading (60 phút), Writing (60 phút), Speaking (12 phút)",
    popularity: 90,
  },
  {
    id: "vstep-b2",
    name: "VSTEP B2",
    level: "B2",
    category: "International Tests",
    ageGroup: "Người lớn",
    skills: ["Listening", "Reading", "Writing", "Speaking"],
    duration: 175,
    sections: 4,
    parts: 4,
    totalQuestions: 70,
    totalPoints: 100,
    description: "Bài thi tiếng Anh chuẩn Việt Nam theo khung CEFR, cấp độ B2",
    structure: "Listening (40 phút), Reading (60 phút), Writing (60 phút), Speaking (15 phút)",
    popularity: 98,
  },
  {
    id: "vstep-c1",
    name: "VSTEP C1",
    level: "C1",
    category: "International Tests",
    ageGroup: "Người lớn",
    skills: ["Listening", "Reading", "Writing", "Speaking"],
    duration: 195,
    sections: 4,
    parts: 4,
    totalQuestions: 75,
    totalPoints: 100,
    description: "Bài thi tiếng Anh chuẩn Việt Nam theo khung CEFR, cấp độ C1",
    structure: "Listening (40 phút), Reading (60 phút), Writing (60 phút), Speaking (15 phút)",
    popularity: 75,
  },
  {
    id: "ielts-academic",
    name: "IELTS Academic",
    level: "B1-C2",
    category: "International Tests",
    ageGroup: "Người lớn",
    skills: ["Listening", "Reading", "Writing", "Speaking"],
    duration: 165,
    sections: 4,
    parts: 4,
    totalQuestions: 80,
    totalPoints: 9,
    description: "Bài thi IELTS học thuật cho mục đích du học và làm việc quốc tế",
    structure: "Listening (30 phút), Reading (60 phút), Writing (60 phút), Speaking (11-14 phút)",
    popularity: 100,
  },
  {
    id: "ielts-general",
    name: "IELTS General Training",
    level: "B1-C2",
    category: "International Tests",
    ageGroup: "Người lớn",
    skills: ["Listening", "Reading", "Writing", "Speaking"],
    duration: 165,
    sections: 4,
    parts: 4,
    totalQuestions: 80,
    totalPoints: 9,
    description: "Bài thi IELTS dành cho mục đích định cư và làm việc",
    structure: "Listening (30 phút), Reading (60 phút), Writing (60 phút), Speaking (11-14 phút)",
    popularity: 87,
  },
];

const levelColors: Record<string, string> = {
  "Pre A1": "bg-orange-100 text-orange-700 border-orange-200",
  A1: "bg-green-100 text-green-700 border-green-200",
  A2: "bg-yellow-100 text-yellow-700 border-yellow-200",
  B1: "bg-orange-100 text-orange-700 border-orange-200",
  B2: "bg-red-100 text-red-700 border-red-200",
  C1: "bg-purple-100 text-purple-700 border-purple-200",
  C2: "bg-pink-100 text-pink-700 border-pink-200",
  "B1-C2": "bg-gradient-to-r from-orange-100 to-purple-100 text-purple-700 border-purple-200",
};

export function ExamTemplates() {
  const [activeTab, setActiveTab] = useState("Cambridge Young Learners");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<ExamTemplate | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories = [
    "Cambridge Young Learners",
    "Cambridge Main Suite",
    "International Tests",
  ];

  // Filter templates
  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesTab = template.category === activeTab;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "all" || template.level === selectedLevel;
    return matchesTab && matchesSearch && matchesLevel;
  });

  const openDetailModal = (template: ExamTemplate) => {
    setSelectedTemplate(template);
    setShowDetailModal(true);
  };

  const openCreateModal = (template: ExamTemplate) => {
    setSelectedTemplate(template);
    setShowDetailModal(false);
    setShowCreateModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-amber-50/20 to-orange-50/10">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/giao-vien/de-thi/tat-ca"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Mẫu đề thi</h1>
                <div className="group relative">
                  <Info className="w-5 h-5 text-gray-400 cursor-help" />
                  <div className="absolute left-0 top-8 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 w-64 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    Chọn mẫu đề thi chuẩn để tạo đề nhanh chóng theo định dạng chính thống
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link to="/giao-vien" className="hover:text-orange-600 transition-colors">
                  Dashboard
                </Link>
                <span>/</span>
                <Link to="/giao-vien/de-thi/tat-ca" className="hover:text-orange-600 transition-colors">
                  Ngân hàng đề
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">Mẫu đề thi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm mẫu đề thi..."
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

            {/* Level Filter */}
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer text-sm"
              >
                <option value="all">Tất cả cấp độ</option>
                <option value="Pre A1">Pre A1</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === category
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-500/30"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:bg-orange-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Template Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${levelColors[template.level]}`}
                  >
                    {template.level}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span>{template.popularity}%</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{template.ageGroup}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">{template.description}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {template.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
                    >
                      {skill === "Listening" && <Headphones className="w-3 h-3" />}
                      {skill === "Reading" && <BookOpen className="w-3 h-3" />}
                      {skill === "Writing" && <Pen className="w-3 h-3" />}
                      {skill === "Speaking" && <MessageSquare className="w-3 h-3" />}
                      {skill.includes("Reading") && <BookOpen className="w-3 h-3" />}
                      {skill.includes("Writing") && <Pen className="w-3 h-3" />}
                      {skill.includes("Use of English") && <FileText className="w-3 h-3" />}
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{template.duration} phút</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <HelpCircle className="w-4 h-4" />
                    <span>{template.totalQuestions} câu</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>{template.sections} phần</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>{template.totalPoints} điểm</span>
                  </div>
                </div>

                {/* Structure Summary */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Cấu trúc:</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{template.structure}</p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6 flex items-center gap-2">
                <button
                  onClick={() => openDetailModal(template)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-center text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Xem chi tiết
                </button>
                <button
                  onClick={() => openCreateModal(template)}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all text-center text-sm font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Sử dụng mẫu
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Không tìm thấy mẫu đề</h3>
              <p className="text-gray-600">
                Không có mẫu đề thi nào phù hợp với bộ lọc của bạn.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{selectedTemplate.name}</h3>
                <p className="text-orange-100 text-sm mt-1">{selectedTemplate.category}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Overview */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-orange-600" />
                  Tổng quan
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cấp độ:</span>
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${levelColors[selectedTemplate.level]}`}
                    >
                      {selectedTemplate.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Độ tuổi:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedTemplate.ageGroup}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Thời gian:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedTemplate.duration} phút
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tổng câu hỏi:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedTemplate.totalQuestions} câu
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tổng điểm:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedTemplate.totalPoints} điểm
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Mô tả</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{selectedTemplate.description}</p>
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Kỹ năng đánh giá</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium"
                    >
                      {skill === "Listening" && <Headphones className="w-4 h-4" />}
                      {skill === "Reading" && <BookOpen className="w-4 h-4" />}
                      {skill === "Writing" && <Pen className="w-4 h-4" />}
                      {skill === "Speaking" && <MessageSquare className="w-4 h-4" />}
                      {skill.includes("Reading") && <BookOpen className="w-4 h-4" />}
                      {skill.includes("Writing") && <Pen className="w-4 h-4" />}
                      {skill.includes("Use of English") && <FileText className="w-4 h-4" />}
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Structure */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Cấu trúc đề thi</h4>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedTemplate.structure}</p>
                </div>
              </div>

              {/* Stats */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Thống kê</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <FileText className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{selectedTemplate.sections}</p>
                    <p className="text-xs text-gray-600 mt-1">Phần thi</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <HelpCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{selectedTemplate.parts}</p>
                    <p className="text-xs text-gray-600 mt-1">Parts</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Sparkles className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{selectedTemplate.popularity}%</p>
                    <p className="text-xs text-gray-600 mt-1">Phổ biến</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Đóng
              </button>
              <button
                onClick={() => openCreateModal(selectedTemplate)}
                className="px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Sử dụng mẫu này
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl font-bold">Tạo đề thi từ mẫu</h3>
              <p className="text-orange-100 text-sm mt-1">{selectedTemplate.name}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Exam Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên đề thi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue={`${selectedTemplate.name} - Practice Test`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập tên đề thi..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  rows={3}
                  defaultValue={selectedTemplate.description}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  placeholder="Mô tả đề thi..."
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thời gian làm bài
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="customDuration"
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="customDuration" className="text-sm text-gray-700">
                    Tùy chỉnh thời gian (mặc định: {selectedTemplate.duration} phút)
                  </label>
                </div>
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hiển thị
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      defaultChecked
                      className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">
                      🌐 Public - Hiển thị cho tất cả giáo viên
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">🔒 Private - Chỉ mình tôi</span>
                  </label>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">Lưu ý:</p>
                    <p>
                      Đề thi sẽ được tạo với cấu trúc mẫu gồm {selectedTemplate.totalQuestions} câu
                      hỏi. Bạn có thể chỉnh sửa và thêm câu hỏi sau khi tạo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Hủy
              </button>
              <Link
                to="/giao-vien/de-thi/tao-moi"
                className="px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium"
              >
                Tạo đề thi
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


