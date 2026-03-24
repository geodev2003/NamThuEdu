import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  Search,
  Calendar,
  Clock,
  Users,
  School,
  Target,
  CheckCircle2,
  AlertCircle,
  Send,
  Save,
  FileText,
} from "lucide-react";

interface Exam {
  id: string;
  title: string;
  type: string;
  duration: number;
  totalQuestions: number;
}

interface Class {
  id: string;
  name: string;
  studentCount: number;
  level: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  className: string;
}

export function CreateAssignment() {
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [assignmentType, setAssignmentType] = useState<"class" | "individual">("class");
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [deadline, setDeadline] = useState("");
  const [maxAttempts, setMaxAttempts] = useState("1");
  const [showInstructions, setShowInstructions] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const exams: Exam[] = [
    {
      id: "1",
      title: "Cambridge KET - Reading Test 1",
      type: "Reading",
      duration: 60,
      totalQuestions: 40,
    },
    {
      id: "2",
      title: "IELTS Academic Reading Practice",
      type: "Reading",
      duration: 60,
      totalQuestions: 40,
    },
    {
      id: "3",
      title: "TOEFL Listening Test 2",
      type: "Listening",
      duration: 45,
      totalQuestions: 28,
    },
    {
      id: "4",
      title: "Cambridge PET - Use of English",
      type: "Grammar",
      duration: 45,
      totalQuestions: 35,
    },
  ];

  const classes: Class[] = [
    { id: "1", name: "KET Morning A1", studentCount: 20, level: "A2" },
    { id: "2", name: "IELTS 6.5 Evening", studentCount: 25, level: "B2" },
    { id: "3", name: "PET Intensive B1", studentCount: 18, level: "B1" },
    { id: "4", name: "TOEFL Advanced", studentCount: 15, level: "C1" },
  ];

  const students: Student[] = [
    { id: "1", name: "Nguyễn Văn An", email: "an@email.com", className: "KET Morning A1" },
    { id: "2", name: "Trần Thị Bình", email: "binh@email.com", className: "IELTS 6.5 Evening" },
    { id: "3", name: "Lê Hoàng Châu", email: "chau@email.com", className: "PET Intensive B1" },
    { id: "4", name: "Phạm Minh Đức", email: "duc@email.com", className: "TOEFL Advanced" },
    { id: "5", name: "Võ Thu Hà", email: "ha@email.com", className: "KET Morning A1" },
  ];

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTargetToggle = (id: string) => {
    setSelectedTargets((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    // Validate
    if (!selectedExam) {
      alert("Vui lòng chọn đề thi!");
      return;
    }
    if (selectedTargets.length === 0) {
      alert("Vui lòng chọn lớp hoặc học sinh!");
      return;
    }
    if (!deadline) {
      alert("Vui lòng chọn deadline!");
      return;
    }

    // Mock success
    alert(`✅ Đã giao bài "${selectedExam.title}" cho ${selectedTargets.length} ${assignmentType === "class" ? "lớp" : "học sinh"}`);
    navigate("/giao-vien/bai-tap");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/giao-vien/bai-tap"
              className="p-2 hover:bg-white/80 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Giao bài thi mới 📝</h1>
              <p className="text-gray-600 mt-1">Tạo assignment cho học sinh hoặc lớp học</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/giao-vien/bai-tap")}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Lưu nháp
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <Send className="w-5 h-5" />
              Giao bài
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Select Exam */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Chọn đề thi</h3>
                  <p className="text-sm text-gray-600">Tìm và chọn đề thi muốn giao</p>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm đề thi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Exam List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredExams.map((exam) => (
                  <div
                    key={exam.id}
                    onClick={() => setSelectedExam(exam)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedExam?.id === exam.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <h4 className="font-semibold text-gray-900">{exam.title}</h4>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {exam.duration} phút
                          </span>
                          <span>{exam.totalQuestions} câu hỏi</span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                            {exam.type}
                          </span>
                        </div>
                      </div>
                      {selectedExam?.id === exam.id && (
                        <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Select Target */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Chọn đối tượng</h3>
                  <p className="text-sm text-gray-600">Giao cho lớp hoặc học sinh cụ thể</p>
                </div>
              </div>

              {/* Type Selector */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => {
                    setAssignmentType("class");
                    setSelectedTargets([]);
                  }}
                  className={`flex-1 p-4 border-2 rounded-xl font-semibold transition-all ${
                    assignmentType === "class"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-green-300"
                  }`}
                >
                  <School className="w-6 h-6 mx-auto mb-2" />
                  Giao theo lớp
                </button>
                <button
                  onClick={() => {
                    setAssignmentType("individual");
                    setSelectedTargets([]);
                  }}
                  className={`flex-1 p-4 border-2 rounded-xl font-semibold transition-all ${
                    assignmentType === "individual"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-green-300"
                  }`}
                >
                  <Target className="w-6 h-6 mx-auto mb-2" />
                  Giao cá nhân
                </button>
              </div>

              {/* Target List */}
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {assignmentType === "class"
                  ? classes.map((cls) => (
                      <div
                        key={cls.id}
                        onClick={() => handleTargetToggle(cls.id)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedTargets.includes(cls.id)
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <School className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-semibold text-gray-900">{cls.name}</p>
                              <p className="text-sm text-gray-600">
                                {cls.studentCount} học sinh • Level {cls.level}
                              </p>
                            </div>
                          </div>
                          {selectedTargets.includes(cls.id) && (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))
                  : students.map((student) => (
                      <div
                        key={student.id}
                        onClick={() => handleTargetToggle(student.id)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedTargets.includes(student.id)
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{student.name}</p>
                              <p className="text-sm text-gray-600">{student.className}</p>
                            </div>
                          </div>
                          {selectedTargets.includes(student.id) && (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            {/* Step 3: Settings */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Cài đặt</h3>
                  <p className="text-sm text-gray-600">Deadline và số lần làm bài</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Deadline */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  />
                </div>

                {/* Max Attempts */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Số lần làm bài
                  </label>
                  <select
                    value={maxAttempts}
                    onChange={(e) => setMaxAttempts(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  >
                    <option value="1">1 lần</option>
                    <option value="2">2 lần</option>
                    <option value="3">3 lần</option>
                    <option value="unlimited">Không giới hạn</option>
                  </select>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInstructions}
                    onChange={(e) => setShowInstructions(e.target.checked)}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Hiển thị hướng dẫn cho học sinh
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Tóm tắt</h3>

              <div className="space-y-4">
                {/* Selected Exam */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Đề thi:</p>
                  {selectedExam ? (
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="font-semibold text-blue-900 text-sm">
                        {selectedExam.title}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        {selectedExam.duration} phút • {selectedExam.totalQuestions} câu
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                      <AlertCircle className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm text-gray-500">Chưa chọn đề thi</p>
                    </div>
                  )}
                </div>

                {/* Selected Targets */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Đối tượng:</p>
                  {selectedTargets.length > 0 ? (
                    <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2">
                        {assignmentType === "class" ? (
                          <School className="w-5 h-5 text-green-600" />
                        ) : (
                          <Users className="w-5 h-5 text-green-600" />
                        )}
                        <p className="font-semibold text-green-900 text-sm">
                          {selectedTargets.length}{" "}
                          {assignmentType === "class" ? "lớp" : "học sinh"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                      <AlertCircle className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm text-gray-500">Chưa chọn đối tượng</p>
                    </div>
                  )}
                </div>

                {/* Deadline */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Deadline:</p>
                  {deadline ? (
                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                      <p className="font-semibold text-purple-900 text-sm">
                        {new Date(deadline).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                      <AlertCircle className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm text-gray-500">Chưa đặt deadline</p>
                    </div>
                  )}
                </div>

                {/* Max Attempts */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Số lần làm:</p>
                  <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                    <p className="font-semibold text-orange-900 text-sm">
                      {maxAttempts === "unlimited" ? "Không giới hạn" : `${maxAttempts} lần`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning */}
              {(!selectedExam || selectedTargets.length === 0 || !deadline) && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-900">
                        Chưa hoàn tất
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Vui lòng điền đầy đủ thông tin trước khi giao bài
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}