import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  ChevronRight,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Volume2,
  FileText,
  Info,
  Clock,
  Target,
  HelpCircle,
  Sparkles,
  Globe,
  Lock,
  Settings,
  Calendar,
  Bell,
  X,
  ChevronDown,
} from "lucide-react";

type ExamType = "VSTEP" | "IELTS" | "Cambridge" | "General" | null;
type ExamSkill = "Listening" | "Reading" | "Writing" | "Speaking" | null;
type QuestionType =
  | "multiple-choice"
  | "true-false"
  | "fill-blank"
  | "short-answer"
  | "essay"
  | "matching"
  | "listening"
  | "speaking";

interface Question {
  id: string;
  type: QuestionType;
  content: string;
  points: number;
  answers?: { id: string; text: string; isCorrect: boolean }[];
}

const examTypeData = [
  {
    value: "VSTEP",
    icon: "🎯",
    name: "VSTEP",
    description: "Bài thi chuẩn Việt Nam (B1, B2, C1)",
    duration: "145-195 phút",
  },
  {
    value: "IELTS",
    icon: "🌍",
    name: "IELTS",
    description: "Academic / General Training",
    duration: "165 phút",
  },
  {
    value: "Cambridge",
    icon: "📚",
    name: "Cambridge",
    description: "KET, PET, FCE, CAE, CPE",
    duration: "110-235 phút",
  },
  {
    value: "General",
    icon: "📄",
    name: "General",
    description: "Đề thi tùy chỉnh",
    duration: "Tùy chọn",
  },
];

const skillData = [
  { value: "Listening", icon: "🎧", name: "Listening", color: "blue" },
  { value: "Reading", icon: "📖", name: "Reading", color: "green" },
  { value: "Writing", icon: "✍️", name: "Writing", color: "orange" },
  { value: "Speaking", icon: "🗣️", name: "Speaking", color: "purple" },
];

const questionTypes = [
  { value: "multiple-choice", label: "Trắc nghiệm nhiều đáp án", icon: HelpCircle },
  { value: "true-false", label: "Đúng / Sai", icon: CheckCircle2 },
  { value: "fill-blank", label: "Điền vào chỗ trống", icon: FileText },
  { value: "short-answer", label: "Câu trả lời ngắn", icon: FileText },
  { value: "essay", label: "Tự luận", icon: FileText },
  { value: "matching", label: "Nối đáp án", icon: Target },
  { value: "listening", label: "Nghe (có audio)", icon: Volume2 },
  { value: "speaking", label: "Nói (có ghi âm)", icon: Volume2 },
];

export function CreateExam() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Step 1: Basic Info
  const [examType, setExamType] = useState<ExamType>(null);
  const [examSkill, setExamSkill] = useState<ExamSkill>(null);
  const [examTitle, setExamTitle] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [duration, setDuration] = useState(60);
  const [durationUnit, setDurationUnit] = useState<"minutes" | "hours">("minutes");
  const [difficulty, setDifficulty] = useState("medium");
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [allowPreview, setAllowPreview] = useState(true);

  // Step 2: Questions
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState<QuestionType | null>(null);

  // Step 3: Preview & Publish
  const [publishOption, setPublishOption] = useState<"now" | "draft" | "schedule">("now");
  const [notifyStudents, setNotifyStudents] = useState(false);
  const [notifyTeachers, setNotifyTeachers] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const totalQuestions = questions.length;

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Đã lưu nháp!");
    }, 1000);
  };

  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type,
      content: "",
      points: 1,
      answers:
        type === "multiple-choice" || type === "true-false"
          ? [
              { id: "a1", text: "", isCorrect: false },
              { id: "a2", text: "", isCorrect: false },
            ]
          : undefined,
    };
    setQuestions([...questions, newQuestion]);
    setSelectedQuestion(newQuestion);
    setIsAddingQuestion(false);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    if (selectedQuestion?.id === id) {
      setSelectedQuestion(null);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedStep1 = examType && examSkill && examTitle && duration > 0;
  const canProceedStep2 = questions.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo đề thi mới</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link to="/giao-vien" className="hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <span>/</span>
                <Link to="/giao-vien/de-thi/tat-ca" className="hover:text-blue-600 transition-colors">
                  Ngân hàng đề
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">Tạo đề mới</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div
                  className={`w-2 h-2 rounded-full ${isSaving ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`}
                />
                <span>{isSaving ? "Đang lưu..." : "Đã lưu"}</span>
              </div>
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 font-medium"
              >
                <Save className="w-4 h-4" />
                Lưu nháp
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((step, idx) => (
              <div key={step} className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep === step
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : currentStep > step
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {currentStep > step ? <CheckCircle2 className="w-5 h-5" /> : step}
                  </div>
                  <div className="text-left">
                    <p
                      className={`text-sm font-semibold ${currentStep === step ? "text-blue-600" : "text-gray-600"}`}
                    >
                      Bước {step}
                    </p>
                    <p className="text-xs text-gray-500">
                      {step === 1 && "Thông tin cơ bản"}
                      {step === 2 && "Thêm câu hỏi"}
                      {step === 3 && "Xem trước & Xuất bản"}
                    </p>
                  </div>
                </div>
                {step < 3 && (
                  <ChevronRight
                    className={`w-5 h-5 ${currentStep > step ? "text-green-600" : "text-gray-300"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="px-8 py-6">
        {/* STEP 1: Basic Info */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Exam Type */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Loại đề thi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {examTypeData.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setExamType(type.value as ExamType)}
                    className={`p-6 border-2 rounded-xl text-left transition-all ${
                      examType === type.value
                        ? "border-blue-600 bg-blue-50 shadow-lg"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <div className="text-4xl mb-3">{type.icon}</div>
                    <h4 className="font-bold text-gray-900 mb-1">{type.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {type.duration}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Skill */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Kỹ năng</h3>
              <p className="text-sm text-gray-600 mb-4">Chọn kỹ năng chính cho đề thi này</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {skillData.map((skill) => (
                  <button
                    key={skill.value}
                    onClick={() => setExamSkill(skill.value as ExamSkill)}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      examSkill === skill.value
                        ? `border-${skill.color}-600 bg-${skill.color}-50 shadow-lg`
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-3xl mb-2">{skill.icon}</div>
                    <p className="font-semibold text-gray-900">{skill.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Thông tin đề thi</h3>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên đề thi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="VD: VSTEP B2 Listening - Practice Test 1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={255}
                />
                <p className="text-xs text-gray-500 mt-1">{examTitle.length}/255 ký tự</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  value={examDescription}
                  onChange={(e) => setExamDescription(e.target.value)}
                  rows={4}
                  placeholder="Mô tả chi tiết về đề thi..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thời gian làm bài <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                    min={1}
                    className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value as "minutes" | "hours")}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="minutes">Phút</option>
                    <option value="hours">Giờ</option>
                  </select>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Độ khó</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="easy">Dễ</option>
                  <option value="medium">Trung bình</option>
                  <option value="hard">Khó</option>
                  <option value="expert">Rất khó</option>
                </select>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Cài đặt</h3>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Hiển thị
                </label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:bg-gray-50">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === "public"}
                      onChange={() => setVisibility("public")}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-semibold text-gray-900">
                        <Globe className="w-5 h-5 text-blue-600" />
                        Public
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Hiển thị cho tất cả giáo viên trong hệ thống
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:bg-gray-50">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === "private"}
                      onChange={() => setVisibility("private")}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-semibold text-gray-900">
                        <Lock className="w-5 h-5 text-gray-600" />
                        Private
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Chỉ mình tôi có thể xem và sử dụng</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Allow Preview */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="allowPreview"
                  checked={allowPreview}
                  onChange={(e) => setAllowPreview(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="allowPreview" className="flex-1 cursor-pointer">
                  <p className="font-semibold text-gray-900">Cho phép xem trước</p>
                  <p className="text-sm text-gray-600">
                    Học sinh có thể xem trước đề thi trước khi bắt đầu làm bài
                  </p>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Link
                to="/giao-vien/de-thi/tat-ca"
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Hủy
              </Link>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveDraft}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Lưu nháp
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!canProceedStep1}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
                    canProceedStep1
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Tiếp tục
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Add Questions */}
        {currentStep === 2 && (
          <div className="flex gap-6">
            {/* Left Panel: Question List */}
            <div className="w-80 bg-white rounded-xl border border-gray-200 p-4 space-y-4 h-fit sticky top-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Danh sách câu hỏi</h3>
                <button
                  onClick={() => setIsAddingQuestion(true)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    onClick={() => setSelectedQuestion(question)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedQuestion?.id === question.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-gray-900">Câu {index + 1}</span>
                          <span className="text-xs text-gray-600">{question.points} điểm</span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {question.content || "Chưa có nội dung"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {questionTypes.find((t) => t.value === question.type)?.label}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(question.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng câu hỏi:</span>
                    <span className="font-semibold text-gray-900">{totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng điểm:</span>
                    <span className="font-semibold text-gray-900">{totalPoints}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Question Editor */}
            <div className="flex-1 space-y-6">
              {!selectedQuestion && !isAddingQuestion && (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <HelpCircle className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Thêm câu hỏi đầu tiên</h3>
                    <p className="text-gray-600">
                      Bắt đầu xây dựng đề thi bằng cách thêm câu hỏi. Chọn loại câu hỏi phù hợp từ
                      menu bên dưới.
                    </p>
                    <button
                      onClick={() => setIsAddingQuestion(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm câu hỏi
                    </button>
                  </div>
                </div>
              )}

              {isAddingQuestion && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Chọn loại câu hỏi</h3>
                    <button
                      onClick={() => setIsAddingQuestion(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {questionTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          onClick={() => handleAddQuestion(type.value as QuestionType)}
                          className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
                        >
                          <Icon className="w-6 h-6 text-blue-600 mb-2" />
                          <p className="font-semibold text-gray-900">{type.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedQuestion && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                      Câu hỏi {questions.findIndex((q) => q.id === selectedQuestion.id) + 1}
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                      {questionTypes.find((t) => t.value === selectedQuestion.type)?.label}
                    </span>
                  </div>

                  {/* Question Content */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nội dung câu hỏi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Nhập nội dung câu hỏi..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm flex items-center gap-1">
                        <ImageIcon className="w-4 h-4" />
                        Hình ảnh
                      </button>
                      {(selectedQuestion.type === "listening" ||
                        selectedQuestion.type === "speaking") && (
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm flex items-center gap-1">
                          <Volume2 className="w-4 h-4" />
                          Audio
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Points */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Điểm</label>
                    <input
                      type="number"
                      defaultValue={1}
                      min={1}
                      className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Answers Section */}
                  {(selectedQuestion.type === "multiple-choice" ||
                    selectedQuestion.type === "true-false") && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-semibold text-gray-700">Đáp án</label>
                        {selectedQuestion.type === "multiple-choice" && (
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            + Thêm đáp án
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {selectedQuestion.type === "true-false" ? (
                          <>
                            <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300">
                              <input
                                type="radio"
                                name="answer"
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="font-medium text-gray-900">Đúng</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300">
                              <input
                                type="radio"
                                name="answer"
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="font-medium text-gray-900">Sai</span>
                            </label>
                          </>
                        ) : (
                          selectedQuestion.answers?.map((answer, index) => (
                            <div
                              key={answer.id}
                              className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg"
                            >
                              <input
                                type="radio"
                                name="correct-answer"
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <input
                                type="text"
                                placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                                className="flex-1 px-3 py-2 border-0 focus:outline-none"
                              />
                              <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedQuestion(null)}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      Hủy
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                      Lưu câu hỏi
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                      Lưu & Thêm tiếp
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!isAddingQuestion && (
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                  >
                    Quay lại
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveDraft}
                      className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                    >
                      Lưu nháp
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={!canProceedStep2}
                      className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
                        canProceedStep2
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Tiếp tục
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Preview & Publish */}
        {currentStep === 3 && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Exam Summary */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-xl p-8 text-white shadow-2xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-3">{examTitle || "Đề thi chưa đặt tên"}</h2>
                  <p className="text-blue-100 mb-4">{examDescription}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg font-semibold">
                      {examType}
                    </span>
                    <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg font-semibold">
                      {examSkill}
                    </span>
                    <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {duration} {durationUnit === "minutes" ? "phút" : "giờ"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-3 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-all">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-blue-100 text-sm mb-1">Câu hỏi</p>
                  <p className="text-3xl font-bold">{totalQuestions}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-blue-100 text-sm mb-1">Tổng điểm</p>
                  <p className="text-3xl font-bold">{totalPoints}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-blue-100 text-sm mb-1">Độ khó</p>
                  <p className="text-xl font-bold capitalize">{difficulty}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-blue-100 text-sm mb-1">Trạng thái</p>
                  <p className="text-xl font-bold">
                    {publishOption === "now" ? "Xuất bản" : "Nháp"}
                  </p>
                </div>
              </div>
            </div>

            {/* Questions Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Danh sách câu hỏi</h3>
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                          Câu {index + 1}
                        </span>
                        <span className="text-sm text-gray-600">
                          {questionTypes.find((t) => t.value === question.type)?.label}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {question.points} điểm
                      </span>
                    </div>
                    <p className="text-gray-700">{question.content || "Chưa có nội dung"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Publish Options */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Tùy chọn xuất bản</h3>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:bg-gray-50">
                  <input
                    type="radio"
                    name="publish"
                    checked={publishOption === "now"}
                    onChange={() => setPublishOption("now")}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Xuất bản ngay</p>
                    <p className="text-sm text-gray-600">Đề thi sẽ được xuất bản ngay lập tức</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:bg-gray-50">
                  <input
                    type="radio"
                    name="publish"
                    checked={publishOption === "draft"}
                    onChange={() => setPublishOption("draft")}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Lưu nháp</p>
                    <p className="text-sm text-gray-600">Lưu đề thi để chỉnh sửa sau</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:bg-gray-50">
                  <input
                    type="radio"
                    name="publish"
                    checked={publishOption === "schedule"}
                    onChange={() => setPublishOption("schedule")}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Lên lịch xuất bản</p>
                    <p className="text-sm text-gray-600 mb-3">Chọn ngày giờ xuất bản</p>
                    {publishOption === "schedule" && (
                      <div className="flex items-center gap-3">
                        <input
                          type="datetime-local"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Notifications */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Thông báo</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyStudents}
                      onChange={(e) => setNotifyStudents(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Thông báo cho học sinh</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyTeachers}
                      onChange={(e) => setNotifyTeachers(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Thông báo cho giáo viên khác</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Gửi email thông báo</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevStep}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Quay lại
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveDraft}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Lưu nháp
                </button>
                <Link
                  to="/giao-vien/de-thi/cua-toi"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-bold shadow-lg shadow-blue-500/50 flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Xuất bản đề thi
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}