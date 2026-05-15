import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import {
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
  Timer,
  BarChart3,
  Eye,
  Zap,
  FileSearch,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useGradingStats } from "@/hooks/useGradingStats";

export function GradingStats() {
  const { t } = useTranslation();
  // Use custom hook
  const { data: statsData, loading, error } = useGradingStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">{t("teacher.grading.statsPage.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !statsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-semibold mb-2">{error || t("teacher.grading.statsPage.notFound")}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
          >
            {t("teacher.grading.statsPage.retry")}
          </button>
        </div>
      </div>
    );
  }

  // Extract data from statsData
  const overview = statsData.overview;
  const bySkill = statsData.bySkill;
  const trend = statsData.trend;

  // Calculate completion rate
  const completionRate = overview.total > 0 
    ? Math.round((overview.graded / overview.total) * 100) 
    : 0;

  // Prepare data for charts
  const submissionsByStatus = [
    { name: t("teacher.grading.statsPage.graded"), value: overview.graded, color: "#10B981" },
    { name: t("teacher.grading.statsPage.pendingGrading"), value: overview.pending, color: "#F59E0B" },
  ];
  
  const gradingActivity = trend.map(item => ({
    date: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    graded: item.count,
  }));

  // Mock data for exam types (will be replaced with real data when available)
  const scoresByExamType: any[] = [];
  const avgScoresByType = scoresByExamType.map((item: any) => ({
    name: item.type,
    score: item.average,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("teacher.grading.statsPage.heading")} 📈</h1>
        <p className="text-gray-600">{t("teacher.grading.statsPage.subtitle")}</p>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Total Submissions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-gray-600 text-sm mb-1">{t("teacher.grading.statsPage.totalSubmissions")}</p>
          <p className="text-3xl font-bold text-gray-900">{overview.total}</p>
        </div>

        {/* Graded Submissions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
              {Math.round((overview.graded / overview.total) * 100)}%
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">{t("teacher.grading.statsPage.graded")}</p>
          <p className="text-3xl font-bold text-gray-900">{overview.graded}</p>
        </div>

        {/* Pending Submissions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold">
              {Math.round((overview.pending / overview.total) * 100)}%
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">{t("teacher.grading.statsPage.pendingGrading")}</p>
          <p className="text-3xl font-bold text-gray-900">{overview.pending}</p>
        </div>

        {/* Completion Rate */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">{t("teacher.grading.statsPage.completionRate")}</p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity (7 days) */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">{t("teacher.grading.statsPage.recentActivity")}</p>
          <p className="text-3xl font-bold text-gray-900">{overview.graded}</p>
          <p className="text-xs text-gray-500 mt-1">{t("teacher.grading.statsPage.recentlyGraded")}</p>
        </div>

        {/* Average Grading Time */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Timer className="w-6 h-6 text-pink-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">{t("teacher.grading.statsPage.avgTime")}</p>
          <p className="text-3xl font-bold text-gray-900">{overview.avgTime}</p>
          <p className="text-xs text-gray-500 mt-1">{t("teacher.grading.statsPage.minutesPerSubmission")}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart: Submissions by Status */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            {t("teacher.grading.statsPage.statusDistribution")}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={submissionsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {submissionsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart: Grading Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            {t("teacher.grading.statsPage.gradingActivityChart")}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gradingActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="graded"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Average Scores by Exam Type */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          {t("teacher.grading.statsPage.avgScoreByType")}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={avgScoresByType}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
              {avgScoresByType.map((entry, index) => (
                <Cell key={`bar-cell-${index}`} fill={["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"][index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Scores by Exam Type Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{t("teacher.grading.statsPage.scoresByExamType")}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.statsPage.examType")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.statsPage.submissionsCount")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.statsPage.avgScore")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.statsPage.highest")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  {t("teacher.grading.statsPage.lowest")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {scoresByExamType.map((exam, index) => (
                <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{exam.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 font-semibold">{exam.count}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-blue-600">{exam.average}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-bold">
                      {exam.highest}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg font-bold">
                      {exam.lowest}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/giao-vien/cham-diem"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">{overview.pending}</span>
          </div>
          <h3 className="text-lg font-bold mb-2">{t("teacher.grading.statsPage.viewPending")}</h3>
          <p className="text-sm text-blue-100">{t("teacher.grading.statsPage.viewPendingDesc")}</p>
        </Link>

        <button className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white hover:shadow-lg transition-all group text-left">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">{overview.pending}</span>
          </div>
          <h3 className="text-lg font-bold mb-2">{t("teacher.grading.statsPage.autoGrade")}</h3>
          <p className="text-sm text-green-100">{t("teacher.grading.statsPage.autoGradeDesc")}</p>
        </button>

        <Link
          to="/giao-vien/cham-diem/bao-cao-lop"
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FileSearch className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-bold mb-2">{t("teacher.grading.statsPage.viewReport")}</h3>
          <p className="text-sm text-purple-100">{t("teacher.grading.statsPage.viewReportDesc")}</p>
        </Link>
      </div>
    </div>
  );
}