import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useApiQuery } from "../../../../hooks/useTeacherApi";
import { teacherApi } from "../../../../services/teacherApi";
import { handleApiError } from "../../../../components/shared/ErrorHandler";
import type { TestStatistics, ApiResponse } from "../../../../types/teacher";
import {
  Users,
  CheckCircle,
  Clock,
  Award,
  Timer,
  Activity,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function RealtimeStats() {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [examId, setExamId] = useState<number | null>(null); // Get from URL params or props

  // Fetch test statistics with polling
  const { data: statsData, loading, error } = useApiQuery(
    () => examId 
      ? teacherApi.dashboard.getTestStatistics(examId) 
      : Promise.resolve({ status: 'success', data: null } as ApiResponse<TestStatistics | null>),
    {
      enabled: !!examId,
      refetchInterval: 10000, // 10 seconds
      onError: (error: any) => {
        handleApiError(error, () => window.location.reload());
      }
    }
  );

  const stats: TestStatistics | null = statsData;

  // Simulate auto-refresh for last update time
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Students active over time - use real data if available
  const activeStudentsData = stats?.active_students_over_time || [
    { time: "14:00", count: 5 },
    { time: "14:10", count: 12 },
    { time: "14:20", count: 18 },
    { time: "14:30", count: 25 },
    { time: "14:40", count: 22 },
    { time: "14:50", count: 15 },
    { time: "15:00", count: 12 },
  ];

  // Questions answered distribution
  const questionsData = stats?.questions_distribution || [
    { range: "0-5", count: 2 },
    { range: "6-10", count: 5 },
    { range: "11-15", count: 8 },
    { range: "16-20", count: 12 },
    { range: "21-25", count: 10 },
    { range: "26-30", count: 8 },
  ];

  // Connection status breakdown
  const connectionData = stats?.connection_status || [
    { name: "Kết nối tốt", value: 35, color: "#10B981" },
    { name: "Không ổn định", value: 7, color: "#F59E0B" },
    { name: "Mất kết nối", value: 3, color: "#EF4444" },
  ];

  // Question difficulty analysis
  const questionAnalysis = stats?.question_analysis || [
    {
      id: "1",
      number: 1,
      attempts: 45,
      correct: 42,
      successRate: 93,
      avgTime: "1:20",
      difficulty: "easy" as const,
    },
    {
      id: "2",
      number: 5,
      attempts: 45,
      correct: 35,
      successRate: 78,
      avgTime: "2:10",
      difficulty: "medium" as const,
    },
    {
      id: "3",
      number: 12,
      attempts: 45,
      correct: 18,
      successRate: 40,
      avgTime: "3:45",
      difficulty: "hard" as const,
    },
    {
      id: "4",
      number: 18,
      attempts: 45,
      correct: 38,
      successRate: 84,
      avgTime: "1:50",
      difficulty: "easy" as const,
    },
    {
      id: "5",
      number: 25,
      attempts: 45,
      correct: 22,
      successRate: 49,
      avgTime: "4:20",
      difficulty: "hard" as const,
    },
  ];

  // Student progress
  const studentProgress = stats?.student_progress || [
    {
      id: "1",
      name: "Nguyễn Văn An",
      avatar: "NA",
      progress: 90,
      timeElapsed: "45:30",
      connectionStatus: "connected" as const,
      currentQuestion: 27,
    },
    {
      id: "2",
      name: "Trần Thị Bình",
      avatar: "TB",
      progress: 60,
      timeElapsed: "38:15",
      connectionStatus: "unstable" as const,
      currentQuestion: 18,
    },
    {
      id: "3",
      name: "Lê Hoàng Cường",
      avatar: "LC",
      progress: 40,
      timeElapsed: "42:00",
      connectionStatus: "disconnected" as const,
      currentQuestion: 12,
    },
  ];

  const getDifficultyBadge = (difficulty: "easy" | "medium" | "hard") => {
    const badges = {
      easy: { text: "Dễ", color: "bg-green-100 text-green-700" },
      medium: { text: "Trung bình", color: "bg-orange-100 text-orange-700" },
      hard: { text: "Khó", color: "bg-red-100 text-red-700" },
    };
    return badges[difficulty];
  };

  const getConnectionBadge = (status: "connected" | "unstable" | "disconnected") => {
    const badges = {
      connected: { text: "Kết nối", color: "text-green-600 bg-green-100" },
      unstable: { text: "Không ổn định", color: "text-yellow-600 bg-yellow-100" },
      disconnected: { text: "Mất kết nối", color: "text-red-600 bg-red-100" },
    };
    return badges[status];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              Thống kê: {stats?.exam_title || "Đang tải..."} 📊
            </h1>
            {/* LIVE Indicator */}
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 font-bold text-sm">LIVE</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Cập nhật {Math.floor((Date.now() - lastUpdate.getTime()) / 1000)} giây trước
          </div>
        </div>
        <p className="text-gray-600">Thống kê thời gian thực về bài thi đang diễn ra</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Đã bắt đầu</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.total_started || 0}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
              </div>
              <p className="text-gray-600 text-sm mb-1">Đang làm bài</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.in_progress || 0}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Đã hoàn thành</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.completed || 0}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Điểm trung bình</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.average_score || 0}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <Timer className="w-6 h-6 text-pink-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Thời gian TB</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.average_time_spent || "0 phút"}</p>
            </div>
          </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Line Chart: Students Active Over Time */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Học sinh đang hoạt động theo thời gian
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activeStudentsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="time" tick={{ fill: "#6B7280", fontSize: 12 }} />
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
                dataKey="count"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Connection Status */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Trạng thái kết nối</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={connectionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {connectionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Questions Answered Distribution */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Phân bố số câu đã trả lời</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={questionsData}>
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
            <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Question Difficulty Analysis */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Phân tích độ khó câu hỏi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Câu hỏi
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Số lượt
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Đúng
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Tỷ lệ đúng
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Thời gian TB
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Độ khó
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {questionAnalysis.map((question) => {
                const badge = getDifficultyBadge(question.difficulty);
                return (
                  <tr key={question.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">Câu {question.number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-semibold">{question.attempts}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 font-semibold">{question.correct}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-green-600"
                            style={{ width: `${question.successRate}%` }}
                          />
                        </div>
                        <span className="text-lg font-bold text-green-600 min-w-[50px]">
                          {question.successRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-semibold">{question.avgTime}</span>
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

      {/* Student Progress Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Tiến độ học sinh</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Học sinh
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Tiến độ
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Thời gian
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Kết nối
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Câu hiện tại
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studentProgress.map((student) => {
                const badge = getConnectionBadge(student.connectionStatus);
                return (
                  <tr key={student.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {student.avatar}
                        </div>
                        <p className="font-semibold text-gray-900">{student.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[150px]">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-blue-600 min-w-[40px]">
                          {student.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-semibold">{student.timeElapsed}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${badge.color}`}>
                        {badge.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-bold">
                        Câu {student.currentQuestion}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/giam-sat-truc-tiep/${student.id}`}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all inline-flex"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
