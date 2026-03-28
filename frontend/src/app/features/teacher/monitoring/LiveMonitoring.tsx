import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Users,
  Activity,
  TrendingUp,
  AlertCircle,
  Search,
  ChevronDown,
  Eye,
  MessageCircle,
  FileText,
  Grid3x3,
  List,
  WifiOff,
  Wifi,
  Clock,
} from "lucide-react";
import { Header } from "../../../components/shared/Header";

interface StudentSession {
  id: string;
  studentName: string;
  studentAvatar: string;
  examTitle: string;
  examId: string;
  connectionStatus: "connected" | "disconnected" | "unstable";
  startTime: Date;
  duration: number; // minutes
  timeElapsed: number; // seconds
  questionsAnswered: number;
  totalQuestions: number;
  lastActivity: Date;
  hasWarning: boolean;
}

export function LiveMonitoring() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterExam, setFilterExam] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock data
  const [sessions, setSessions] = useState<StudentSession[]>([
    {
      id: "1",
      studentName: "Nguyễn Văn An",
      studentAvatar: "NA",
      examTitle: "Cambridge KET - Reading Test 1",
      examId: "ket-1",
      connectionStatus: "connected",
      startTime: new Date(Date.now() - 25 * 60 * 1000),
      duration: 60,
      timeElapsed: 25 * 60,
      questionsAnswered: 18,
      totalQuestions: 30,
      lastActivity: new Date(Date.now() - 10 * 1000),
      hasWarning: false,
    },
    {
      id: "2",
      studentName: "Trần Thị Bình",
      studentAvatar: "TB",
      examTitle: "IELTS Reading Practice",
      examId: "ielts-1",
      connectionStatus: "unstable",
      startTime: new Date(Date.now() - 35 * 60 * 1000),
      duration: 60,
      timeElapsed: 35 * 60,
      questionsAnswered: 12,
      totalQuestions: 25,
      lastActivity: new Date(Date.now() - 45 * 1000),
      hasWarning: true,
    },
    {
      id: "3",
      studentName: "Lê Hoàng Cường",
      studentAvatar: "LC",
      examTitle: "TOEFL Speaking Section",
      examId: "toefl-1",
      connectionStatus: "disconnected",
      startTime: new Date(Date.now() - 40 * 60 * 1000),
      duration: 45,
      timeElapsed: 40 * 60,
      questionsAnswered: 8,
      totalQuestions: 20,
      lastActivity: new Date(Date.now() - 5 * 60 * 1000),
      hasWarning: true,
    },
  ]);

  const stats = {
    activeStudents: sessions.filter((s) => s.connectionStatus === "connected").length,
    totalSessions: 45,
    avgCompletion: 68,
    connectionIssues: sessions.filter((s) => s.hasWarning).length,
  };

  // Simulate auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Update time elapsed
      setSessions((prev) =>
        prev.map((s) => ({
          ...s,
          timeElapsed: s.timeElapsed + 5,
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getConnectionBadge = (status: StudentSession["connectionStatus"]) => {
    const badges = {
      connected: { icon: Wifi, color: "text-green-600", bg: "bg-green-100" },
      disconnected: { icon: WifiOff, color: "text-red-600", bg: "bg-red-100" },
      unstable: { icon: Activity, color: "text-yellow-600", bg: "bg-yellow-100" },
    };
    return badges[status];
  };

  const formatTimeRemaining = (timeElapsed: number, duration: number) => {
    const remaining = duration * 60 - timeElapsed;
    if (remaining <= 0) return "Hết giờ";
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatTimeElapsed = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const formatLastActivity = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} giây trước`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} phút trước`;
  };

  const filteredSessions = sessions.filter((session) => {
    const matchSearch =
      searchQuery === "" ||
      session.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchExam = filterExam === "" || session.examId === filterExam;
    const matchActive = !showActiveOnly || session.connectionStatus !== "disconnected";
    return matchSearch && matchExam && matchActive;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        breadcrumb={[t("breadcrumb.dashboard"), t("breadcrumb.liveMonitoring")]}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: "#EEEEF3" }}>
        <div className="px-8 py-6 space-y-6">
          {/* Live Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-700 font-bold text-sm">LIVE</span>
              </div>
              <span className="text-sm text-gray-600">
                Cập nhật {Math.floor((Date.now() - lastUpdate.getTime()) / 1000)} giây trước
              </span>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Active Students */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
          <p className="text-gray-600 text-sm mb-1">Học sinh đang thi</p>
          <p className="text-3xl font-bold text-gray-900">{stats.activeStudents}</p>
        </div>

            {/* Total Sessions */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Tổng phiên hôm nay</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalSessions}</p>
        </div>

            {/* Average Completion */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Tỷ lệ hoàn thành TB</p>
          <p className="text-3xl font-bold text-gray-900">{stats.avgCompletion}%</p>
        </div>

            {/* Connection Issues */}
            <div
              className={`bg-white rounded-xl border p-5 ${
                stats.connectionIssues > 0 ? "border-red-300" : "border-gray-200"
              }`}
            >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stats.connectionIssues > 0 ? "bg-red-100" : "bg-gray-100"
              }`}
            >
              <AlertCircle
                className={`w-6 h-6 ${
                  stats.connectionIssues > 0 ? "text-red-600" : "text-gray-400"
                }`}
              />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Vấn đề kết nối</p>
          <p
            className={`text-3xl font-bold ${
              stats.connectionIssues > 0 ? "text-red-600" : "text-gray-900"
            }`}
          >
            {stats.connectionIssues}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm học sinh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Exam */}
          <div className="relative">
            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Tất cả đề thi</option>
              <option value="ket-1">Cambridge KET</option>
              <option value="ielts-1">IELTS Reading</option>
              <option value="toefl-1">TOEFL Speaking</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter Class */}
          <div className="relative">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Tất cả lớp</option>
              <option value="ket-morning">KET Morning A1</option>
              <option value="ielts-evening">IELTS Evening 6.5</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Active Only Toggle */}
          <label className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={(e) => setShowActiveOnly(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-semibold text-gray-700">Chỉ đang hoạt động</span>
          </label>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex-1 px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          </div>
        </div>

        {/* Student Sessions Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((session) => {
            const badge = getConnectionBadge(session.connectionStatus);
            const Icon = badge.icon;
            const progress = (session.questionsAnswered / session.totalQuestions) * 100;
            const timeRemaining = formatTimeRemaining(session.timeElapsed, session.duration);
            const isLowTime = session.duration * 60 - session.timeElapsed < 600; // < 10 min

            return (
              <div
                key={session.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all"
              >
                {/* Student Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {session.studentAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{session.studentName}</p>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                      {session.examTitle}
                    </span>
                  </div>
                  {session.hasWarning && (
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                </div>

                {/* Connection Status */}
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-2 rounded-lg ${badge.bg}`}>
                    <Icon className={`w-4 h-4 ${badge.color}`} />
                  </div>
                  <span className={`text-sm font-semibold ${badge.color}`}>
                    {session.connectionStatus === "connected"
                      ? "Đang kết nối"
                      : session.connectionStatus === "disconnected"
                      ? "Mất kết nối"
                      : "Không ổn định"}
                  </span>
                </div>

                {/* Time Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Đã làm</p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatTimeElapsed(session.timeElapsed)}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${isLowTime ? "bg-red-50" : "bg-gray-50"}`}>
                    <p className="text-xs text-gray-600 mb-1">Còn lại</p>
                    <p
                      className={`text-sm font-bold ${isLowTime ? "text-red-600" : "text-gray-900"}`}
                    >
                      {timeRemaining}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Tiến độ</span>
                    <span className="text-sm font-bold text-blue-600">
                      {session.questionsAnswered}/{session.totalQuestions} câu
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Last Activity */}
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Hoạt động {formatLastActivity(session.lastActivity)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/giao-vien/giam-sat-truc-tiep/${session.id}`}
                    className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center gap-2 font-semibold text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Chi tiết
                  </Link>
                  <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all">
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Học sinh
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Đề thi
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Thời gian
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Tiến độ
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSessions.map((session) => {
                const badge = getConnectionBadge(session.connectionStatus);
                const Icon = badge.icon;
                const progress = (session.questionsAnswered / session.totalQuestions) * 100;

                return (
                  <tr key={session.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {session.studentAvatar}
                        </div>
                        <p className="font-semibold text-gray-900">{session.studentName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                        {session.examTitle}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${badge.color}`} />
                        <span className={`text-sm font-semibold ${badge.color}`}>
                          {session.connectionStatus === "connected" ? "Kết nối" : "Mất kết nối"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      {formatTimeRemaining(session.timeElapsed, session.duration)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-blue-600">
                          {session.questionsAnswered}/{session.totalQuestions}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                      <Link
                        to={`/giao-vien/giam-sat-truc-tiep/${session.id}`}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                        <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredSessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 font-semibold mb-2">Không có học sinh nào đang thi</p>
          <p className="text-sm text-gray-500">Khi có học sinh bắt đầu thi, họ sẽ xuất hiện ở đây</p>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
