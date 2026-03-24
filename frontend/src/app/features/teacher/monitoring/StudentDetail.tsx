import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  X,
  User,
  FileText,
  Clock,
  Wifi,
  WifiOff,
  Activity as ActivityIcon,
  Phone,
  Signal,
  CheckCircle,
  XCircle,
  MessageCircle,
  Download,
  ChevronRight,
  Eye,
} from "lucide-react";

interface Activity {
  id: string;
  type: "answer_saved" | "connected" | "disconnected" | "reconnected";
  description: string;
  timestamp: Date;
}

export function StudentDetail() {
  const { studentId } = useParams();
  const [timeElapsed, setTimeElapsed] = useState(1524); // seconds
  const [lastSeen, setLastSeen] = useState(new Date());

  // Mock data
  const student = {
    name: "Nguyễn Văn An",
    avatar: "NA",
    id: "SV001",
    phone: "0912 345 678",
  };

  const exam = {
    title: "Cambridge KET - Reading & Writing Test 1",
    type: "Cambridge KET",
  };

  const session = {
    connectionStatus: "connected" as const,
    startTime: new Date(Date.now() - 25 * 60 * 1000),
    duration: 60, // minutes
    questionsAnswered: 18,
    totalQuestions: 30,
    connectionQuality: 85, // 0-100
  };

  const connectionStats = {
    totalConnections: 1,
    totalDisconnections: 2,
    avgConnectionDuration: "12 phút 30 giây",
    answersSubmitted: 18,
  };

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      type: "answer_saved",
      description: "Đã lưu câu trả lời cho câu 18",
      timestamp: new Date(Date.now() - 10 * 1000),
    },
    {
      id: "2",
      type: "answer_saved",
      description: "Đã lưu câu trả lời cho câu 17",
      timestamp: new Date(Date.now() - 45 * 1000),
    },
    {
      id: "3",
      type: "reconnected",
      description: "Đã kết nối lại",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: "4",
      type: "disconnected",
      description: "Mất kết nối",
      timestamp: new Date(Date.now() - 6 * 60 * 1000),
    },
    {
      id: "5",
      type: "connected",
      description: "Bắt đầu làm bài",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
    },
  ]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
      setLastSeen(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeRemaining = session.duration * 60 - timeElapsed;
  const isLowTime = timeRemaining < 600; // < 10 min

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const formatLastSeen = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 5) return "Vừa xong";
    if (seconds < 60) return `${seconds} giây trước`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} phút trước`;
  };

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "answer_saved":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case "connected":
        return <Wifi className="w-5 h-5 text-green-600" />;
      case "disconnected":
        return <WifiOff className="w-5 h-5 text-red-600" />;
      case "reconnected":
        return <ActivityIcon className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "answer_saved":
        return "bg-blue-50 border-blue-200";
      case "connected":
        return "bg-green-50 border-green-200";
      case "disconnected":
        return "bg-red-50 border-red-200";
      case "reconnected":
        return "bg-yellow-50 border-yellow-200";
    }
  };

  // Mock question progress
  const questionProgress = Array.from({ length: 30 }, (_, i) => i < 18);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold">
                {student.avatar}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-blue-100">ID: {student.id}</span>
                  <span className="flex items-center gap-1 text-sm text-blue-100">
                    <Phone className="w-4 h-4" />
                    {student.phone}
                  </span>
                </div>
              </div>
            </div>
            <Link
              to="/giao-vien/giam-sat-truc-tiep"
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all"
            >
              <X className="w-6 h-6" />
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100 mb-1">Đề thi</p>
              <p className="text-lg font-bold">{exam.title}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded-lg">
              <Wifi className="w-5 h-5" />
              <span className="font-bold">Đang kết nối</span>
            </div>
          </div>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-5 gap-4 p-6 border-b border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Bắt đầu</p>
            <p className="text-lg font-bold text-gray-900">
              {session.startTime.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Đã làm</p>
            <p className="text-lg font-bold text-gray-900">{formatTime(timeElapsed)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Còn lại</p>
            <p className={`text-lg font-bold ${isLowTime ? "text-red-600" : "text-gray-900"}`}>
              {formatTime(timeRemaining)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Đã trả lời</p>
            <p className="text-lg font-bold text-blue-600">
              {session.questionsAnswered}/{session.totalQuestions}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Chất lượng kết nối</p>
            <div className="flex items-center justify-center gap-2">
              <Signal
                className={`w-5 h-5 ${
                  session.connectionQuality > 70
                    ? "text-green-600"
                    : session.connectionQuality > 40
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              />
              <p className="text-lg font-bold text-gray-900">{session.connectionQuality}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Left Column - Connection Stats & Activity */}
          <div className="col-span-2 space-y-6">
            {/* Connection Statistics */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Thống kê kết nối</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-semibold text-gray-700">Lần kết nối</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {connectionStats.totalConnections}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <WifiOff className="w-5 h-5 text-red-600" />
                    <p className="text-sm font-semibold text-gray-700">Mất kết nối</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {connectionStats.totalDisconnections}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <p className="text-sm font-semibold text-gray-700">Lần xem cuối</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{formatLastSeen(lastSeen)}</p>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <p className="text-sm font-semibold text-gray-700">Đã gửi</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {connectionStats.answersSubmitted}
                  </p>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Hoạt động gần đây</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`p-4 bg-white rounded-lg border-l-4 ${getActivityColor(
                      activity.type
                    )}`}
                  >
                    <div className="flex items-start gap-3">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.timestamp.toLocaleTimeString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Question Progress & Actions */}
          <div className="space-y-6">
            {/* Question Progress Grid */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tiến độ câu hỏi</h3>
              <div className="grid grid-cols-6 gap-2">
                {questionProgress.map((answered, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${
                      answered
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded" />
                  <span className="text-sm text-gray-600">Đã trả lời</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded" />
                  <span className="text-sm text-gray-600">Chưa trả lời</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30">
                <MessageCircle className="w-5 h-5" />
                Gửi tin nhắn
              </button>

              <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30">
                <Eye className="w-5 h-5" />
                Xem chi tiết bài làm
              </button>

              <button className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/30">
                <Download className="w-5 h-5" />
                Xuất báo cáo
              </button>
            </div>

            {/* Info Notice */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-900">
                <strong>Lưu ý:</strong> Dữ liệu được cập nhật tự động mỗi giây.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}