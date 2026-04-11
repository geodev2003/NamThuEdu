import { useState, useEffect } from "react";
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

export function GradingStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGradingStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/grading/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success') {
            setStats(result.data);
          } else {
            setError('Không thể tải thống kê chấm bài');
          }
        } else {
          setError('Lỗi khi tải dữ liệu');
        }
      } catch (err) {
        setError('Lỗi kết nối đến server');
      } finally {
        setLoading(false);
      }
    };

    fetchGradingStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Đang tải thống kê chấm bài...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-semibold mb-2">{error || 'Không tìm thấy dữ liệu'}</p>
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

  const scoresByExamType = stats.scoresByExamType || [];
  const avgScoresByType = scoresByExamType.map((item: any) => ({
    name: item.type,
    score: item.average,
  }));

  const submissionsByStatus = stats.submissionsByStatus || [
    { name: "Đã chấm", value: 98, color: "#10B981" },
    { name: "Chờ chấm", value: 47, color: "#F59E0B" },
  ];
  
  const gradingActivity = stats.gradingActivity || [
    { date: "17/03", graded: 12 },
    { date: "18/03", graded: 15 },
    { date: "19/03", graded: 18 },
    { date: "20/03", graded: 14 },
    { date: "21/03", graded: 20 },
    { date: "22/03", graded: 16 },
    { date: "23/03", graded: 23 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thống kê chấm bài 📈</h1>
        <p className="text-gray-600">Tổng quan về hoạt động chấm bài và hiệu suất</p>
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
          <p className="text-gray-600 text-sm mb-1">Tổng số bài nộp</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalSubmissions}</p>
        </div>

        {/* Graded Submissions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
              {stats.graded}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Đã chấm</p>
          <p className="text-3xl font-bold text-gray-900">{stats.graded}</p>
        </div>

        {/* Pending Submissions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold">
              {stats.pending}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Chờ chấm</p>
          <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
        </div>

        {/* Completion Rate */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Tỷ lệ hoàn thành</p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-gray-900">{stats.completionRate}%</p>
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                  style={{ width: `${stats.completionRate}%` }}
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
          <p className="text-gray-600 text-sm mb-1">Hoạt động 7 ngày qua</p>
          <p className="text-3xl font-bold text-gray-900">{stats.recentActivity}</p>
          <p className="text-xs text-gray-500 mt-1">Bài đã chấm gần đây</p>
        </div>

        {/* Average Grading Time */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Timer className="w-6 h-6 text-pink-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Thời gian chấm TB</p>
          <p className="text-3xl font-bold text-gray-900">{stats.averageGradingTime}</p>
          <p className="text-xs text-gray-500 mt-1">phút / bài</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart: Submissions by Status */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Phân bố theo trạng thái
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
            Hoạt động chấm bài (7 ngày)
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
          Điểm trung bình theo loại đề thi
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
          <h3 className="text-lg font-bold text-gray-900">Điểm số theo loại đề thi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Loại đề thi
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Số bài nộp
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Điểm TB
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Cao nhất
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Thấp nhất
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
            <span className="text-2xl font-bold">{stats.pending}</span>
          </div>
          <h3 className="text-lg font-bold mb-2">Xem bài chờ chấm</h3>
          <p className="text-sm text-blue-100">Danh sách bài thi cần chấm điểm</p>
        </Link>

        <button className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white hover:shadow-lg transition-all group text-left">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">{stats.pending}</span>
          </div>
          <h3 className="text-lg font-bold mb-2">Chấm tự động hàng loạt</h3>
          <p className="text-sm text-green-100">Chấm nhiều bài cùng lúc</p>
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
          <h3 className="text-lg font-bold mb-2">Xem báo cáo chi tiết</h3>
          <p className="text-sm text-purple-100">Thống kê và phân tích lớp học</p>
        </Link>
      </div>
    </div>
  );
}