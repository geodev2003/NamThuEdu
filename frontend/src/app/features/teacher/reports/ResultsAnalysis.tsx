import { useState } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  FileText,
  Users,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Target,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export function ResultsAnalysis() {
  const [selectedExam, setSelectedExam] = useState("exam1");

  // Score distribution data
  const scoreDistribution = [
    { range: "90-100", count: 12, label: "Xuất sắc" },
    { range: "80-89", count: 28, label: "Giỏi" },
    { range: "70-79", count: 45, label: "Khá" },
    { range: "60-69", count: 32, label: "Trung bình" },
    { range: "0-59", count: 8, label: "Yếu" },
  ];

  // Question difficulty data
  const questionAnalysis = [
    {
      id: "Q1",
      question: "Choose the correct answer: She ___ to school every day.",
      type: "Multiple Choice",
      attempts: 125,
      correct: 112,
      successRate: 89.6,
      difficulty: "Easy",
      avgTime: "45s",
    },
    {
      id: "Q2",
      question: "Complete the sentence with the appropriate tense.",
      type: "Fill in Blank",
      attempts: 125,
      correct: 95,
      successRate: 76.0,
      difficulty: "Medium",
      avgTime: "1m 20s",
    },
    {
      id: "Q3",
      question: "Identify the grammatical error in the paragraph.",
      type: "Error Detection",
      attempts: 125,
      correct: 58,
      successRate: 46.4,
      difficulty: "Hard",
      avgTime: "2m 15s",
    },
    {
      id: "Q4",
      question: "Write a short essay about your hometown.",
      type: "Essay",
      attempts: 125,
      correct: 48,
      successRate: 38.4,
      difficulty: "Hard",
      avgTime: "15m",
    },
    {
      id: "Q5",
      question: "Listen and choose the correct answer.",
      type: "Listening",
      attempts: 125,
      correct: 102,
      successRate: 81.6,
      difficulty: "Medium",
      avgTime: "1m 45s",
    },
  ];

  // Performance by section
  const sectionPerformance = [
    { section: "Reading", avgScore: 7.8, successRate: 78, questions: 20 },
    { section: "Writing", avgScore: 6.5, successRate: 65, questions: 15 },
    { section: "Listening", avgScore: 8.2, successRate: 82, questions: 25 },
    { section: "Speaking", avgScore: 7.0, successRate: 70, questions: 10 },
  ];

  // Skills radar data
  const skillsData = [
    { skill: "Grammar", value: 85 },
    { skill: "Vocabulary", value: 78 },
    { skill: "Reading", value: 82 },
    { skill: "Writing", value: 65 },
    { skill: "Listening", value: 88 },
    { skill: "Speaking", value: 72 },
  ];

  // Top performers
  const topPerformers = [
    { rank: 1, name: "Lê Thị D", score: 9.5, time: "45 phút", attempts: 1 },
    { rank: 2, name: "Nguyễn Văn A", score: 9.2, time: "52 phút", attempts: 1 },
    { rank: 3, name: "Đặng Thị F", score: 8.8, time: "48 phút", attempts: 1 },
    { rank: 4, name: "Trần Thị B", score: 8.5, time: "55 phút", attempts: 1 },
    { rank: 5, name: "Phạm Văn C", score: 8.2, time: "60 phút", attempts: 2 },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-orange-100 text-orange-700";
      case "Hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return "text-green-600";
    if (rate >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const COLORS = ["#10B981", "#2563EB", "#F59E0B", "#8B5CF6", "#EF4444"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link to="/giao-vien/bao-cao" className="text-blue-600 hover:text-blue-700 font-semibold">
            Báo cáo
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Phân tích kết quả</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Phân tích kết quả bài thi 📊</h1>
        <p className="text-gray-600 mt-2">Thống kê chi tiết và đánh giá hiệu suất</p>
      </div>

      {/* Exam Selector */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Chọn bài thi để phân tích
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="exam1">IELTS Reading Practice Test #1</option>
              <option value="exam2">TOEFL Listening Mock Test</option>
              <option value="exam3">Cambridge FCE Writing Assessment</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all">
              So sánh
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30">
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Exam Info Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-6 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">IELTS Reading Practice Test #1</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                40 câu hỏi
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                60 phút
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                125 bài nộp
              </span>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
            <p className="text-sm opacity-90 mb-1">Điểm trung bình</p>
            <p className="text-4xl font-bold">7.5</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Điểm cao nhất</p>
          <p className="text-3xl font-bold text-gray-900">9.5</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Điểm thấp nhất</p>
          <p className="text-3xl font-bold text-gray-900">4.5</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Tỷ lệ đạt</p>
          <p className="text-3xl font-bold text-gray-900">82%</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Thời gian TB</p>
          <p className="text-3xl font-bold text-gray-900">52 phút</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Score Distribution */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Phân bố điểm</h3>
              <p className="text-sm text-gray-600">Số học sinh theo khoảng điểm</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="range" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-4">
            {scoreDistribution.map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-xs text-gray-600">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Radar Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Phân tích kỹ năng</h3>
              <p className="text-sm text-gray-600">Hiệu suất theo từng kỹ năng</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={skillsData}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="skill" stroke="#6B7280" fontSize={12} />
              <PolarRadiusAxis stroke="#6B7280" fontSize={10} />
              <Radar
                name="Performance"
                dataKey="value"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.5}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section Performance */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Hiệu suất theo phần thi</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {sectionPerformance.map((section) => (
            <div key={section.section} className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{section.section}</h4>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-blue-600">{section.avgScore}</span>
                <span className="text-sm text-gray-600">/ 10</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tỷ lệ đạt</span>
                  <span className="font-semibold text-gray-900">{section.successRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{ width: `${section.successRate}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600">{section.questions} câu hỏi</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question Analysis Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Phân tích từng câu hỏi</h3>
          <p className="text-sm text-gray-600 mt-1">Câu hỏi khó và tỷ lệ đúng</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Câu hỏi
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Loại
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                  Lượt làm
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                  Đúng
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                  Tỷ lệ
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                  TG trung bình
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                  Độ khó
                </th>
              </tr>
            </thead>
            <tbody>
              {questionAnalysis.map((q) => (
                <tr key={q.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{q.id}</p>
                      <p className="text-sm text-gray-600 line-clamp-1">{q.question}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                      {q.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-semibold text-gray-900">{q.attempts}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-semibold text-gray-900">{q.correct}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-bold ${getSuccessRateColor(q.successRate)}`}>
                      {q.successRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-700">{q.avgTime}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getDifficultyColor(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Top 5 học sinh xuất sắc 🏆</h3>
        <div className="space-y-3">
          {topPerformers.map((performer) => (
            <div
              key={performer.rank}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  performer.rank === 1
                    ? "bg-yellow-100 text-yellow-700"
                    : performer.rank === 2
                    ? "bg-gray-200 text-gray-700"
                    : performer.rank === 3
                    ? "bg-orange-100 text-orange-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {performer.rank === 1 ? "🥇" : performer.rank === 2 ? "🥈" : performer.rank === 3 ? "🥉" : performer.rank}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{performer.name}</p>
                <p className="text-sm text-gray-600">
                  Thời gian: {performer.time} • Lần thử: {performer.attempts}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{performer.score}</p>
                <p className="text-xs text-gray-600">điểm</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}