import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import {
  BarChart3,
  Calendar,
  Clock,
  AlertCircle,
  TrendingUp,
  Plus,
  Eye,
  FileText,
  Users,
  Target,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function AssignmentStats() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignmentStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/assignments/statistics`, {
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
            setError(t('teacher.assignments.assignmentStats.loadError'));
          }
        } else {
          setError(t('teacher.assignments.assignmentStats.dataError'));
        }
      } catch (err) {
        setError(t('teacher.assignments.assignmentStats.connectionError'));
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">{t("teacher.assignments.assignmentStats.loading")}</p>
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
          <p className="text-red-600 font-semibold mb-2">{error || t("teacher.assignments.assignmentStats.notFound")}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
          >
            {t("teacher.assignments.assignmentStats.retry")}
          </button>
        </div>
      </div>
    );
  }

  const assignmentsByExam = stats.assignmentsByExam || [];
  const assignmentTrends = stats.assignmentTrends || [];
  const recentAssignments = stats.recentAssignments || [];

  const statsCards = [
    {
      label: t("teacher.assignments.assignmentStats.totalAssigned"),
      value: stats.totalAssignments || "0",
      change: "+12%",
      trend: "up",
      icon: BarChart3,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: t("teacher.assignments.assignmentStats.withDeadline"),
      value: stats.withDeadlines || "0",
      change: "+8%",
      trend: "up",
      icon: Calendar,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: t("teacher.assignments.assignmentStats.recentCount"),
      value: stats.recentAssignmentsCount || "0",
      change: "+25%",
      trend: "up",
      icon: Clock,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: t("teacher.assignments.assignmentStats.overdueCount"),
      value: stats.overdue || "0",
      change: "-15%",
      trend: "down",
      icon: AlertCircle,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  const quickActions = [
    {
      title: t("teacher.assignments.assignmentStats.viewAll"),
      description: t("teacher.assignments.assignmentStats.viewAllDesc"),
      icon: Eye,
      link: "/giao-vien/bai-tap",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: t("teacher.assignments.assignmentStats.createNew"),
      description: t("teacher.assignments.assignmentStats.createNewDesc"),
      icon: Plus,
      link: "/giao-vien/bai-tap/giao-moi",
      color: "from-green-500 to-green-600",
    },
    {
      title: t("teacher.assignments.assignmentStats.report"),
      description: t("teacher.assignments.assignmentStats.reportDesc"),
      icon: FileText,
      link: "/giao-vien/bao-cao",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("teacher.assignments.assignmentStats.heading")} 📈</h1>
            <p className="text-gray-600 mt-1">{t("teacher.assignments.assignmentStats.subtitle")}</p>
          </div>
          <Link
            to="/giao-vien/bai-tap/giao-moi"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-5 h-5" />
            {t("teacher.assignments.assignmentStats.createNew")}
          </Link>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                    stat.trend === "up"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <TrendingUp
                    className={`w-3 h-3 ${stat.trend === "down" ? "rotate-180" : ""}`}
                  />
                  {stat.change}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assignments by Exam */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              {t("teacher.assignments.assignmentStats.byExam")}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assignmentsByExam}>
                <defs>
                  <linearGradient id="colorBlueBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
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
                <Bar dataKey="count" fill="url(#colorBlueBar)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Assignment Trends */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              {t("teacher.assignments.assignmentStats.trends")}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={assignmentTrends}>
                <defs>
                  <linearGradient id="colorGreenLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
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
                  dataKey="assignments"
                  stroke="url(#colorGreenLine)"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Recent Assignments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">{t("teacher.assignments.assignmentStats.quickActions")}</h3>
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="block bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Assignments */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">{t("teacher.assignments.assignmentStats.recentAssignments")}</h3>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {recentAssignments.map((assignment) => (
                  <Link
                    key={assignment.id}
                    to={`/bai-tap/${assignment.id}/tien-do`}
                    className="block p-4 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {assignment.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                              assignment.targetType === "class"
                                ? "bg-green-100 text-green-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {assignment.targetType === "class" ? (
                              <Users className="w-3 h-3" />
                            ) : (
                              <Target className="w-3 h-3" />
                            )}
                            {assignment.target}
                          </span>
                          <span className="text-xs text-gray-500">{assignment.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {assignment.completed}/{assignment.students}
                          </p>
                          <p className="text-xs text-gray-500">{t("teacher.assignments.assignmentStats.completedLabel")}</p>
                        </div>
                        <div className="w-16 h-16 relative">
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="#E5E7EB"
                              strokeWidth="6"
                              fill="none"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="#10B981"
                              strokeWidth="6"
                              fill="none"
                              strokeDasharray={`${
                                (assignment.completed / assignment.students) * 175.93
                              } 175.93`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-900">
                              {Math.round((assignment.completed / assignment.students) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}