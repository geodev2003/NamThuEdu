import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ChevronLeft, FileText, Eye, Heart, MessageCircle,
  TrendingUp, TrendingDown, Activity, CheckCircle,
  Calendar, Award, Target, Type, BookMarked, Lightbulb,
  BookOpen, ExternalLink, Loader2, AlertCircle
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { teacherBlogApi } from "../../../../services/blogApi";
import { useToast } from "../../../../hooks/useToast";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Icon mapping for categories
const iconMap: Record<string, React.ElementType> = {
  Award,
  Target,
  Type,
  BookMarked,
  Lightbulb,
  BookOpen,
  GraduationCap: Award,
  Newspaper: FileText,
};

const CategoryIcon = ({ iconName, className, style }: { iconName: string; className?: string; style?: React.CSSProperties }) => {
  const IconComponent = iconMap[iconName] || BookOpen;
  return <IconComponent className={className} style={style} />;
};

interface BlogStats {
  overview: {
    totalPosts: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    changes: {
      posts: number;
      views: number;
      likes: number;
      comments: number;
    };
  };
  viewsOverTime: Array<{
    date: string;
    views: number;
  }>;
  postsByCategory: Array<{
    category: string;
    count: number;
    color: string;
  }>;
  topPosts: Array<{
    id: number;
    title: string;
    views: number;
    likes: number;
    comments: number;
    status: string;
  }>;
  categoryPerformance: Array<{
    category: string;
    icon: string;
    color: string;
    posts: number;
    views: number;
    engagement: number;
  }>;
  engagement: {
    avgViews: number;
    engagementRate: number;
    publishRate: number;
  };
}

export function ContentStats() {
  const [timePeriod, setTimePeriod] = useState("30");
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { error: showError } = useToast();

  useEffect(() => {
    fetchStatistics();
  }, [timePeriod]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teacherBlogApi.getStatistics(timePeriod);
      setStats(response.data.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Không thể tải thống kê';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F5F7' }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F5F7' }}>
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Không thể tải thống kê</h3>
          <p className="text-sm text-slate-500 mb-6">{error || 'Đã xảy ra lỗi'}</p>
          <button
            onClick={fetchStatistics}
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-2xl hover:scale-[1.02] transition-transform"
            style={{ background: '#EC4899', boxShadow: '0 4px 12px rgba(236,72,153,0.25)' }}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Overview stats configuration
  const overviewStats = [
    {
      label: "Tổng bài viết",
      value: stats.overview.totalPosts,
      change: stats.overview.changes.posts,
      icon: FileText,
      color: "#2563EB",
      bgColor: "#EFF6FF"
    },
    {
      label: "Tổng lượt xem",
      value: stats.overview.totalViews.toLocaleString(),
      change: stats.overview.changes.views,
      icon: Eye,
      color: "#10B981",
      bgColor: "#F0FDF4"
    },
    {
      label: "Tổng lượt thích",
      value: stats.overview.totalLikes.toLocaleString(),
      change: stats.overview.changes.likes,
      icon: Heart,
      color: "#EC4899",
      bgColor: "#FDF2F8"
    },
    {
      label: "Tổng bình luận",
      value: stats.overview.totalComments.toLocaleString(),
      change: stats.overview.changes.comments,
      icon: MessageCircle,
      color: "#F59E0B",
      bgColor: "#FEF3C7"
    }
  ];

  // Engagement metrics
  const engagementMetrics = [
    {
      label: "Trung bình lượt xem",
      value: stats.engagement.avgViews,
      subtitle: "mỗi bài viết",
      icon: TrendingUp,
      color: "#2563EB"
    },
    {
      label: "Tỷ lệ tương tác",
      value: `${stats.engagement.engagementRate}%`,
      subtitle: "likes + comments / views",
      icon: Activity,
      color: "#10B981"
    },
    {
      label: "Tỷ lệ xuất bản",
      value: `${stats.engagement.publishRate}%`,
      subtitle: "active / total posts",
      icon: CheckCircle,
      color: "#EC4899"
    }
  ];

  // Line chart data
  const lineChartData = {
    labels: stats.viewsOverTime.map(d => d.date),
    datasets: [
      {
        label: "Lượt xem",
        data: stats.viewsOverTime.map(d => d.views),
        borderColor: "#2563EB",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#2563EB",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1F2937",
        padding: 12,
        borderRadius: 8,
        titleColor: "#F9FAFB",
        bodyColor: "#F9FAFB",
        displayColors: false,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748B", font: { size: 11 } }
      },
      y: {
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "#64748B", font: { size: 11 } }
      }
    }
  };

  // Bar chart data
  const barChartData = {
    labels: stats.postsByCategory.map(d => d.category),
    datasets: [
      {
        label: "Số bài viết",
        data: stats.postsByCategory.map(d => d.count),
        backgroundColor: stats.postsByCategory.map(d => d.color),
        borderRadius: 8,
        barThickness: 32,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1F2937",
        padding: 12,
        borderRadius: 8,
        titleColor: "#F9FAFB",
        bodyColor: "#F9FAFB",
        displayColors: false,
      }
    },
    scales: {
      x: {
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "#64748B", font: { size: 11 } }
      },
      y: {
        grid: { display: false },
        ticks: { color: "#64748B", font: { size: 11 } }
      }
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen" style={{ background: '#F5F5F7' }}>
      <div className="w-full px-6 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              to="/giao-vien/bai-viet"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-3 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Quay lại danh sách
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Thống kê bài viết</h1>
            <p className="text-sm text-slate-500 mt-1">Phân tích hiệu suất và xu hướng nội dung</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2.5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <Calendar className="w-4 h-4 text-slate-400" />
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="text-sm font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="7">7 ngày qua</option>
                <option value="30">30 ngày qua</option>
                <option value="90">90 ngày qua</option>
                <option value="365">1 năm qua</option>
                <option value="all">Tất cả</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewStats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${stat.change >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {stat.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 leading-none mb-2">{stat.value}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Line Chart */}
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 className="text-base font-bold text-slate-900 mb-5">Lượt xem theo thời gian</h3>
            <div style={{ height: '280px' }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 className="text-base font-bold text-slate-900 mb-5">Bài viết theo danh mục</h3>
            <div style={{ height: '280px' }}>
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
        </div>

        {/* Performance Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Top Posts */}
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 className="text-base font-bold text-slate-900 mb-5">Bài viết nổi bật</h3>
            <div className="space-y-3">
              {stats.topPosts.map((post, idx) => (
                <Link
                  key={post.id}
                  to={`/giao-vien/bai-viet/${post.id}`}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1 mb-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {formatNumber(post.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 className="text-base font-bold text-slate-900 mb-5">Hiệu suất danh mục</h3>
            <div className="space-y-4">
              {stats.categoryPerformance.map((cat) => (
                <div key={cat.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: cat.color + "20" }}
                      >
                        <CategoryIcon iconName={cat.icon} className="w-4 h-4" style={{ color: cat.color }} />
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{cat.category}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{cat.posts} bài</span>
                      <span>{formatNumber(cat.views)} views</span>
                      <span className="font-semibold" style={{ color: cat.color }}>{cat.engagement}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${cat.engagement * 10}%`,
                        backgroundColor: cat.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {engagementMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-200"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${metric.color}, ${metric.color}dd)`
                  }}
                >
                  <metric.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 leading-none">{metric.value}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-900 mb-1">{metric.label}</p>
              <p className="text-xs text-slate-500">{metric.subtitle}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
