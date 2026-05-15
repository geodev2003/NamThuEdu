import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import {
  Users,
  FileText,
  TrendingUp,
  Award,
  Download,
  ChevronDown,
  Trophy,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useClassReport } from "@/hooks/useClassReport";

export function ClassReport() {
  const { t } = useTranslation();
  const { classId } = useParams();
  const [selectedExam, setSelectedExam] = useState("all");
  
  // Use custom hook
  const { data: reportData, loading, error } = useClassReport(classId || '');

  // Mock data for charts (will be replaced with real data when available)
  const scoreDistribution = reportData?.stats?.score_distribution || [
    { range: "90-100", count: 0, color: "#10B981" },
    { range: "80-89", count: 0, color: "#3B82F6" },
    { range: "70-79", count: 0, color: "#F59E0B" },
    { range: "60-69", count: 0, color: "#EF4444" },
    { range: "0-59", count: 0, color: "#6B7280" },
  ];

  const examPerformance = [
    {
      id: "1",
      title: "Cambridge KET - Reading Test 1",
      submissions: 23,
      averageScore: 82.5,
      passRate: 87,
      highestScore: 98,
      lowestScore: 45,
    },
    {
      id: "2",
      title: "IELTS Reading Practice",
      submissions: 20,
      averageScore: 75.3,
      passRate: 80,
      highestScore: 92,
      lowestScore: 52,
    },
  ];

  const studentRankings = [
    {
      rank: 1,
      name: "Nguyễn Văn An",
      avatar: "NA",
      submissions: 5,
      averageScore: 95.2,
      highestScore: 98,
      totalPoints: 476,
      trend: "up" as const,
    },
    {
      rank: 2,
      name: "Trần Thị Bình",
      avatar: "TB",
      submissions: 5,
      averageScore: 89.5,
      highestScore: 95,
      totalPoints: 447,
      trend: "up" as const,
    },
    {
      rank: 3,
      name: "Lê Hoàng Cường",
      avatar: "LC",
      submissions: 4,
      averageScore: 85.0,
      highestScore: 90,
      totalPoints: 340,
      trend: "same" as const,
    },
    {
      rank: 4,
      name: "Phạm Thị Dung",
      avatar: "PD",
      submissions: 5,
      averageScore: 78.4,
      highestScore: 85,
      totalPoints: 392,
      trend: "down" as const,
    },
  ];

  const questionAnalysis = [
    {
      id: "1",
      text: "What is the main idea of the passage about climate change?",
      type: "Multiple Choice",
      successRate: 45,
      averageScore: 4.5,
      totalAttempts: 23,
      difficulty: "hard" as const,
    },
    {
      id: "2",
      text: "Fill in the blank: The capital of Vietnam is ___",
      type: "Fill Blank",
      successRate: 92,
      averageScore: 9.2,
      totalAttempts: 23,
      difficulty: "easy" as const,
    },
    {
      id: "3",
      text: "Write an essay about environmental protection (200 words)",
      type: "Essay",
      successRate: 68,
      averageScore: 13.6,
      totalAttempts: 20,
      difficulty: "medium" as const,
    },
  ];

  const getDifficultyBadge = (difficulty: "easy" | "medium" | "hard") => {
    const badges = {
      easy: { text: t("teacher.grading.classReport.difficulty_easy"), color: "bg-green-100 text-green-700" },
      medium: { text: t("teacher.grading.classReport.difficulty_medium"), color: "bg-orange-100 text-orange-700" },
      hard: { text: t("teacher.grading.classReport.difficulty_hard"), color: "bg-red-100 text-red-700" },
    };
    return badges[difficulty];
  };

  const getTrendIcon = (trend: "up" | "down" | "same") => {
    if (trend === "up") return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (trend === "down") return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">{t("teacher.grading.classReport.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-semibold mb-2">{error || t("teacher.grading.classReport.notFound")}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
          >
            {t("teacher.grading.classReport.retry")}
          </button>
        </div>
      </div>
    );
  }

  // Extract data from reportData
  const classInfo = reportData.class;
  const students = reportData.students;
  const stats = reportData.stats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("teacher.grading.classReport.heading", { className: classInfo.cName })} 📊
          </h1>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30">
            <Download className="w-5 h-5" />
            {t("teacher.grading.classReport.exportPdf")}
          </button>
        </div>
        <p className="text-gray-600">{t("teacher.grading.classReport.subtitle")}</p>
      </div>

      {/* Exam Filter */}
      <div className="mb-6">
        <div className="relative inline-block">
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-12 font-semibold"
          >
            <option value="all">{t("teacher.grading.classReport.allExams")}</option>
            <option value="ket">Cambridge KET</option>
            <option value="ielts">IELTS</option>
            <option value="toefl">TOEFL</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Class Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">{t("teacher.grading.classReport.totalStudents")}</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total_students || 0}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">{t("teacher.grading.classReport.submissions")}</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total_submissions || 0}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">{t("teacher.grading.classReport.participationRate")}</p>
          <p className="text-3xl font-bold text-gray-900">{stats.completion_rate || 0}%</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">{t("teacher.grading.classReport.avgScore")}</p>
          <p className="text-3xl font-bold text-gray-900">{stats.average_score?.toFixed(1) || 0}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">{t("teacher.grading.classReport.passRate")}</p>
          <p className="text-3xl font-bold text-gray-900">{stats.pass_rate?.toFixed(1) || 0}%</p>
        </div>
      </div>

      {/* Score Distribution Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">{t("teacher.grading.classReport.scoreDistribution")}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scoreDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="range" tick={{ fill: "#6B7280", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {scoreDistribution.map((entry, index) => (
                <Bar key={`cell-${index}`} dataKey="count" fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Exam Performance Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{t("teacher.grading.classReport.examPerformance")}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.examTitle")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.submissionsCount")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.avgScore")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.passRate")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.highScore")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.lowScore")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {examPerformance.map((exam) => (
                <tr key={exam.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{exam.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 font-semibold">{exam.submissions}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-blue-600">{exam.averageScore}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-green-600">{exam.passRate}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-bold">
                      {exam.highestScore}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg font-bold">
                      {exam.lowestScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Rankings Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{t("teacher.grading.classReport.studentRankings")}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.rank")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.table.student")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.submissionsCount")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.avgScore")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.highScore")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.totalScore")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.trend")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studentRankings.map((student) => (
                <tr key={student.rank} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {student.rank <= 3 && (
                        <Trophy
                          className={`w-5 h-5 ${
                            student.rank === 1
                              ? "text-yellow-500"
                              : student.rank === 2
                              ? "text-gray-400"
                              : "text-orange-600"
                          }`}
                        />
                      )}
                      <span className="text-lg font-bold text-gray-900">#{student.rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {student.avatar}
                      </div>
                      <p className="font-semibold text-gray-900">{student.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 font-semibold">{student.submissions}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-blue-600">{student.averageScore}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-bold">
                      {student.highestScore}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-purple-600">{student.totalPoints}</span>
                  </td>
                  <td className="px-6 py-4">{getTrendIcon(student.trend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Question Analysis */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{t("teacher.grading.classReport.questionAnalysis")}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.questionText")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.type")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.successRate")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.avgScore")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.attempts")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.classReport.difficulty")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {questionAnalysis.map((question) => {
                const badge = getDifficultyBadge(question.difficulty);
                return (
                  <tr key={question.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 max-w-md">
                      <p className="text-gray-900 truncate">{question.text}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                        {question.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-green-600">
                        {question.successRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-semibold">{question.averageScore}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-semibold">{question.totalAttempts}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${badge.color}`}>
                        {badge.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
