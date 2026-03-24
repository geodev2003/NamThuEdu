import { FileText, Eye, Heart, TrendingUp, Activity, ChevronRight } from "lucide-react";
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
import { Link } from "react-router";

export function ContentStats() {
  // Mock data
  const overviewStats = {
    totalPosts: 48,
    publishedPosts: 35,
    draftPosts: 10,
    totalViews: 12580,
    totalLikes: 1847,
    avgViewsPerPost: 360,
  };

  // Views over time (last 30 days)
  const viewsOverTime = [
    { date: "01/03", views: 320 },
    { date: "05/03", views: 450 },
    { date: "10/03", views: 380 },
    { date: "15/03", views: 520 },
    { date: "20/03", views: 480 },
    { date: "25/03", views: 610 },
    { date: "30/03", views: 550 },
  ];

  // Posts by type
  const postsByType = [
    { type: "Grammar", count: 18 },
    { type: "Tips", count: 15 },
    { type: "Vocabulary", count: 15 },
  ];

  // Posts by category
  const postsByCategory = [
    { name: "IELTS", value: 15, color: "#3B82F6" },
    { name: "TOEFL", value: 10, color: "#10B981" },
    { name: "Cambridge", value: 12, color: "#F59E0B" },
    { name: "General", value: 11, color: "#8B5CF6" },
  ];

  // Top performing posts
  const topPosts = [
    {
      id: "1",
      thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=100",
      title: "10 Common Grammar Mistakes",
      type: "Grammar",
      views: 1245,
      likes: 89,
      publishedDate: "02/03/2026",
    },
    {
      id: "2",
      thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=100",
      title: "IELTS Vocabulary Guide",
      type: "Vocabulary",
      views: 892,
      likes: 67,
      publishedDate: "28/02/2026",
    },
    {
      id: "3",
      thumbnail: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=100",
      title: "Cambridge KET Tips",
      type: "Tips",
      views: 756,
      likes: 54,
      publishedDate: "25/02/2026",
    },
  ];

  // Recent activity
  const recentActivity = [
    {
      id: "1",
      type: "published",
      message: "Đã xuất bản bài viết 'Advanced Grammar Structures'",
      time: "2 giờ trước",
    },
    {
      id: "2",
      type: "edited",
      message: "Đã chỉnh sửa bài viết 'TOEFL Speaking Strategies'",
      time: "5 giờ trước",
    },
    {
      id: "3",
      type: "liked",
      message: "Bài viết 'Common Mistakes' đã đạt 100 lượt thích",
      time: "1 ngày trước",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link to="/giao-vien/bai-viet" className="text-blue-600 hover:text-blue-700 font-semibold">
            Bài viết
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Thống kê</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thống kê nội dung 📈</h1>
        <p className="text-gray-600">Theo dõi hiệu suất và phân tích bài viết của bạn</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Tổng bài viết</p>
          <p className="text-3xl font-bold text-gray-900">{overviewStats.totalPosts}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Đã xuất bản</p>
          <p className="text-3xl font-bold text-green-600">{overviewStats.publishedPosts}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Bản nháp</p>
          <p className="text-3xl font-bold text-gray-600">{overviewStats.draftPosts}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Tổng lượt xem</p>
          <p className="text-2xl font-bold text-gray-900">{overviewStats.totalViews.toLocaleString()}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Tổng lượt thích</p>
          <p className="text-2xl font-bold text-gray-900">{overviewStats.totalLikes.toLocaleString()}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">TB xem/bài</p>
          <p className="text-3xl font-bold text-gray-900">{overviewStats.avgViewsPerPost}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Line Chart: Views Over Time */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Lượt xem 30 ngày qua</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsOverTime}>
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
                dataKey="views"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: Posts by Type */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Bài viết theo loại</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={postsByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="type" tick={{ fill: "#6B7280", fontSize: 12 }} />
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
                {postsByType.map((entry, index) => (
                  <Cell
                    key={`bar-type-${entry.type}-${index}`}
                    fill={["#3B82F6", "#8B5CF6", "#10B981"][index]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Pie Chart: Posts by Category */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Bài viết theo danh mục</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={postsByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {postsByCategory.map((entry, index) => (
                  <Cell key={`pie-category-${entry.name}-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Hoạt động gần đây
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 transition-all"
              >
                <p className="text-sm font-semibold text-gray-900 mb-1">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Bài viết nổi bật</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Bài viết
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Loại
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Lượt xem
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Lượt thích
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Ngày xuất bản
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topPosts.map((post) => (
                <tr key={post.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <p className="font-semibold text-gray-900">{post.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                      {post.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-700">
                      <Eye className="w-4 h-4" />
                      <span className="font-semibold">{post.views.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-pink-600">
                      <Heart className="w-4 h-4" />
                      <span className="font-semibold">{post.likes}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{post.publishedDate}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/giao-vien/bai-viet/${post.id}`}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all font-semibold text-sm"
                    >
                      Xem
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}