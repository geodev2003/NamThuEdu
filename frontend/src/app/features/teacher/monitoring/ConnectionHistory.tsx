import { useState } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  Wifi,
  WifiOff,
  Activity,
  CheckCircle,
  Clock,
  TrendingUp,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface ConnectionEvent {
  id: string;
  type: "connected" | "disconnected" | "reconnected" | "answer_saved";
  timestamp: Date;
  duration?: string;
  status: "success" | "error" | "warning" | "info";
  details: string;
  expanded?: boolean;
}

export function ConnectionHistory() {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  // Mock data
  const student = {
    name: "Nguyễn Văn An",
    avatar: "NA",
    id: "SV001",
  };

  const exam = {
    title: "Cambridge KET - Reading & Writing Test 1",
    type: "Cambridge KET",
  };

  const summaryStats = {
    totalConnectionTime: "45 phút 30 giây",
    totalDisconnectionTime: "8 phút 15 giây",
    stabilityScore: 85,
    reconnectionAttempts: 2,
  };

  const connectionEvents: ConnectionEvent[] = [
    {
      id: "1",
      type: "answer_saved",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      status: "info",
      details: "Đã lưu câu trả lời cho câu 18",
    },
    {
      id: "2",
      type: "reconnected",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      duration: "3 phút 20 giây",
      status: "warning",
      details: "Kết nối lại thành công sau 3 phút 20 giây mất kết nối",
    },
    {
      id: "3",
      type: "disconnected",
      timestamp: new Date(Date.now() - 18 * 60 * 1000),
      duration: "3 phút 20 giây",
      status: "error",
      details: "Mất kết nối - Nguyên nhân: Mạng không ổn định",
    },
    {
      id: "4",
      type: "answer_saved",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      status: "info",
      details: "Đã lưu câu trả lời cho câu 10",
    },
    {
      id: "5",
      type: "connected",
      timestamp: new Date(Date.now() - 50 * 60 * 1000),
      duration: "42 phút 10 giây",
      status: "success",
      details: "Bắt đầu làm bài thi",
    },
  ];

  // Mock connection quality data
  const qualityData = [
    { time: "14:00", quality: 95 },
    { time: "14:10", quality: 92 },
    { time: "14:20", quality: 88 },
    { time: "14:30", quality: 35 },
    { time: "14:40", quality: 30 },
    { time: "14:50", quality: 85 },
    { time: "15:00", quality: 90 },
    { time: "15:10", quality: 93 },
  ];

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const getEventIcon = (type: ConnectionEvent["type"]) => {
    switch (type) {
      case "connected":
        return <Wifi className="w-5 h-5 text-green-600" />;
      case "disconnected":
        return <WifiOff className="w-5 h-5 text-red-600" />;
      case "reconnected":
        return <Activity className="w-5 h-5 text-yellow-600" />;
      case "answer_saved":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getEventColor = (type: ConnectionEvent["type"]) => {
    switch (type) {
      case "connected":
        return "bg-green-100 text-green-700";
      case "disconnected":
        return "bg-red-100 text-red-700";
      case "reconnected":
        return "bg-yellow-100 text-yellow-700";
      case "answer_saved":
        return "bg-blue-100 text-blue-700";
    }
  };

  const getEventLabel = (type: ConnectionEvent["type"]) => {
    switch (type) {
      case "connected":
        return "Đã kết nối";
      case "disconnected":
        return "Mất kết nối";
      case "reconnected":
        return "Kết nối lại";
      case "answer_saved":
        return "Lưu câu trả lời";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link to="/giao-vien/giam-sat-truc-tiep" className="text-blue-600 hover:text-blue-700 font-semibold">
            Giám sát
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">{student.name}</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Lịch sử kết nối</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử kết nối 📡</h1>
        <p className="text-gray-600">Chi tiết hoạt động kết nối của học sinh trong bài thi</p>
      </div>

      {/* Student & Exam Info Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div>
            <p className="text-sm text-blue-100 mb-1">Đề thi</p>
            <p className="text-lg font-bold mb-1">{exam.title}</p>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold">
              {exam.type}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Wifi className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Thời gian kết nối</p>
          <p className="text-2xl font-bold text-gray-900">{summaryStats.totalConnectionTime}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <WifiOff className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Thời gian mất kết nối</p>
          <p className="text-2xl font-bold text-gray-900">{summaryStats.totalDisconnectionTime}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Độ ổn định kết nối</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-900">{summaryStats.stabilityScore}%</p>
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                  style={{ width: `${summaryStats.stabilityScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Lần kết nối lại</p>
          <p className="text-2xl font-bold text-gray-900">{summaryStats.reconnectionAttempts}</p>
        </div>
      </div>

      {/* Connection Quality Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Chất lượng kết nối theo thời gian</h3>
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all flex items-center gap-2 font-semibold text-sm">
            <Download className="w-4 h-4" />
            Xuất báo cáo PDF
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={qualityData}>
            <defs>
              <linearGradient id="connectionQualityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="time" tick={{ fill: "#6B7280", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="quality"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#connectionQualityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-900">
            <strong>Lưu ý:</strong> Vùng đỏ hiển thị các khoảng thời gian mất kết nối (chất lượng &lt; 50%)
          </p>
        </div>
      </div>

      {/* Connection Events Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Lịch sử sự kiện kết nối</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase w-12"></th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Loại sự kiện
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Thời gian
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Thời lượng
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Chi tiết
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {connectionEvents.map((event) => (
                <>
                  <tr
                    key={event.id}
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                    onClick={() => toggleRow(event.id)}
                  >
                    <td className="px-6 py-4">
                      {expandedRows.includes(event.id) ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getEventIcon(event.type)}
                        <span
                          className={`px-3 py-1 rounded-lg text-sm font-semibold ${getEventColor(
                            event.type
                          )}`}
                        >
                          {getEventLabel(event.type)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 font-semibold">
                        {event.timestamp.toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {event.duration ? (
                        <span className="text-sm text-gray-900 font-semibold">{event.duration}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          event.status === "success"
                            ? "bg-green-100 text-green-700"
                            : event.status === "error"
                            ? "bg-red-100 text-red-700"
                            : event.status === "warning"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {event.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{event.details}</p>
                    </td>
                  </tr>
                  {expandedRows.includes(event.id) && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <h4 className="font-bold text-gray-900 mb-2">Thông tin chi tiết</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">IP Address:</p>
                              <p className="font-semibold text-gray-900">192.168.1.100</p>
                            </div>
                            <div>
                              <p className="text-gray-600">User Agent:</p>
                              <p className="font-semibold text-gray-900">Chrome 120.0.0</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Session ID:</p>
                              <p className="font-semibold text-gray-900">abc123xyz789</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Connection Type:</p>
                              <p className="font-semibold text-gray-900">WiFi</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}