import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  ChevronRight,
  User,
  FileText,
  Clock,
  Hash,
  Zap,
  Save,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Edit3,
  ThumbsUp,
  AlertCircle,
} from "lucide-react";

interface Question {
  id: string;
  number: number;
  type: "multiple_choice" | "essay" | "fill_blank" | "true_false";
  text: string;
  studentAnswer: string;
  correctAnswer?: string;
  points: number;
  maxPoints: number;
  isCorrect?: boolean;
  feedback: string;
  autoGraded: boolean;
}

export function GradingDetail() {
  const { submissionId } = useParams();
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      number: 1,
      type: "multiple_choice",
      text: "What is the capital of Vietnam?",
      studentAnswer: "Hanoi",
      correctAnswer: "Hanoi",
      points: 10,
      maxPoints: 10,
      isCorrect: true,
      feedback: "",
      autoGraded: true,
    },
    {
      id: "2",
      number: 2,
      type: "essay",
      text: "Write an essay about the importance of learning English in the modern world. (200-250 words)",
      studentAnswer:
        "Learning English is extremely important in today's globalized world. It helps us communicate with people from different countries and opens up many opportunities for career advancement...",
      points: 0,
      maxPoints: 20,
      feedback: "",
      autoGraded: false,
    },
    {
      id: "3",
      number: 3,
      type: "fill_blank",
      text: "I ___ (go) to school every day.",
      studentAnswer: "go",
      correctAnswer: "go",
      points: 5,
      maxPoints: 5,
      isCorrect: true,
      feedback: "",
      autoGraded: true,
    },
  ]);

  const [overallFeedback, setOverallFeedback] = useState("");
  const [strengths, setStrengths] = useState<string[]>(["Grammar tốt", "Từ vựng phong phú"]);
  const [improvements, setImprovements] = useState<string[]>(["Cần cải thiện phát âm"]);

  // Mock student data
  const student = {
    name: "Nguyễn Văn An",
    avatar: "NA",
    id: "SV001",
  };

  const exam = {
    title: "Cambridge KET - Reading & Writing Test 1",
    type: "Cambridge KET",
  };

  const submission = {
    time: new Date("2024-03-20T14:30:00"),
    status: "submitted" as const,
    attemptNumber: 1,
  };

  const calculateScore = () => {
    const total = questions.reduce((sum, q) => sum + q.points, 0);
    const max = questions.reduce((sum, q) => sum + q.maxPoints, 0);
    return { total, max };
  };

  const { total: totalScore, max: maxScore } = calculateScore();
  const gradedCount = questions.filter((q) => q.autoGraded || q.points > 0).length;
  const manualCount = questions.filter((q) => !q.autoGraded && q.points === 0).length;

  const updateQuestionPoints = (questionId: string, points: number) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, points: Math.min(points, q.maxPoints) } : q))
    );
  };

  const updateQuestionFeedback = (questionId: string, feedback: string) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, feedback } : q)));
  };

  const getQuestionTypeLabel = (type: Question["type"]) => {
    const labels = {
      multiple_choice: "Trắc nghiệm",
      essay: "Tự luận",
      fill_blank: "Điền khuyết",
      true_false: "Đúng/Sai",
    };
    return labels[type];
  };

  const getQuestionTypeColor = (type: Question["type"]) => {
    const colors = {
      multiple_choice: "bg-blue-100 text-blue-700",
      essay: "bg-purple-100 text-purple-700",
      fill_blank: "bg-green-100 text-green-700",
      true_false: "bg-orange-100 text-orange-700",
    };
    return colors[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/giao-vien/cham-diem" className="text-blue-600 hover:text-blue-700 font-semibold">
            Chấm bài
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">{student.name}</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{exam.title}</span>
        </div>
      </div>

      <div className="p-6">
        {/* Student & Exam Info Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold">
                {student.avatar}
              </div>
              <div>
                <p className="text-sm text-blue-100 mb-1">Học sinh</p>
                <p className="text-xl font-bold">{student.name}</p>
                <p className="text-sm text-blue-100">ID: {student.id}</p>
              </div>
            </div>

            {/* Exam Info */}
            <div>
              <p className="text-sm text-blue-100 mb-1">Đề thi</p>
              <p className="text-lg font-bold mb-1">{exam.title}</p>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold">
                {exam.type}
              </span>
            </div>

            {/* Submission Info */}
            <div>
              <div className="mb-3">
                <p className="text-sm text-blue-100 mb-1">Thời gian nộp</p>
                <p className="font-semibold">
                  {submission.time.toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span className="px-3 py-1.5 bg-orange-500 rounded-lg text-sm font-bold">
                Lần thi {submission.attemptNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/giao-vien/cham-diem"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </Link>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30">
            <Zap className="w-5 h-5" />
            Chấm tự động
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2 shadow-lg shadow-green-500/30 ml-auto">
            <Save className="w-5 h-5" />
            Lưu điểm
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Questions List */}
          <div className="lg:col-span-2 space-y-4">
            {questions.map((question) => (
              <div
                key={question.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {question.number}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-semibold ${getQuestionTypeColor(
                        question.type
                      )}`}
                    >
                      {getQuestionTypeLabel(question.type)}
                    </span>
                  </div>
                  {question.autoGraded && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-semibold">Tự động</span>
                    </div>
                  )}
                </div>

                {/* Question Text */}
                <div className="mb-4">
                  <p className="text-gray-900 font-semibold mb-3">{question.text}</p>
                </div>

                {/* Student Answer */}
                <div className="mb-4">
                  <label className="text-sm font-bold text-gray-700 mb-2 block">
                    Câu trả lời của học sinh:
                  </label>
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                    <p className="text-gray-900">{question.studentAnswer}</p>
                  </div>
                </div>

                {/* Correct Answer (if available) */}
                {question.correctAnswer && (
                  <div className="mb-4">
                    <label className="text-sm font-bold text-gray-700 mb-2 block">
                      Đáp án đúng:
                    </label>
                    <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                      <p className="text-gray-900">{question.correctAnswer}</p>
                    </div>
                  </div>
                )}

                {/* Grading Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Points Input */}
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Điểm</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max={question.maxPoints}
                        value={question.points}
                        onChange={(e) =>
                          updateQuestionPoints(question.id, parseFloat(e.target.value) || 0)
                        }
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-600 font-semibold">/ {question.maxPoints}</span>
                    </div>
                  </div>

                  {/* Correct/Incorrect Toggle */}
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Đánh giá</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateQuestionPoints(question.id, question.maxPoints)}
                        className="flex-1 px-4 py-2.5 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all flex items-center justify-center gap-2 font-semibold"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Đúng
                      </button>
                      <button
                        onClick={() => updateQuestionPoints(question.id, 0)}
                        className="flex-1 px-4 py-2.5 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all flex items-center justify-center gap-2 font-semibold"
                      >
                        <XCircle className="w-5 h-5" />
                        Sai
                      </button>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Nhận xét</label>
                  <textarea
                    value={question.feedback}
                    onChange={(e) => updateQuestionFeedback(question.id, e.target.value)}
                    placeholder="Nhập nhận xét cho câu hỏi này..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            ))}

            {/* Overall Feedback Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                Nhận xét tổng quát
              </h3>

              <div className="mb-4">
                <label className="text-sm font-bold text-gray-700 mb-2 block">
                  Nhận xét chung
                </label>
                <textarea
                  value={overallFeedback}
                  onChange={(e) => setOverallFeedback(e.target.value)}
                  placeholder="Nhập nhận xét chung về bài làm của học sinh..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                    Điểm mạnh
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {strengths.map((strength, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-semibold"
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    Cần cải thiện
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {improvements.map((improvement, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-semibold"
                      >
                        {improvement}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Score Summary Sidebar (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Tổng kết điểm</h3>

              {/* Total Score */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-2">Tổng điểm</p>
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {totalScore}
                  <span className="text-2xl text-gray-400">/{maxScore}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                    style={{ width: `${(totalScore / maxScore) * 100}%` }}
                  />
                </div>
              </div>

              {/* Progress Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-gray-700">Đã chấm</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{gradedCount}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-semibold text-gray-700">Cần chấm thủ công</span>
                  </div>
                  <span className="text-lg font-bold text-orange-600">{manualCount}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-700">Tổng số câu</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{questions.length}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-700">Điểm tối đa</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{maxScore}</span>
                </div>
              </div>

              {/* Quick Info */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-900">
                  <strong>Lưu ý:</strong> Nhớ lưu điểm sau khi hoàn tất chấm bài!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}