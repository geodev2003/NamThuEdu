import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trophy,
  Calendar,
  Send,
  Eye,
  Bell,
  TrendingUp,
  Target,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  phone: string;
  status: "completed" | "not-started";
  score?: number;
  submittedAt?: Date;
  attemptNumber?: number;
  isGraded?: boolean;
}

export function AssignmentProgress() {
  const { assignmentId } = useParams();
  const [showReminderModal, setShowReminderModal] = useState(false);

  // Mock data
  const assignment = {
    id: assignmentId,
    examTitle: "Cambridge KET - Reading & Writing Test 1",
    examType: "Cambridge KET",
    targetType: "class" as const,
    targetName: "Lớp KET Morning A1",
    deadline: new Date(2024, 11, 30, 23, 59),
    maxAttempts: 2,
    isOverdue: false,
  };

  const students: Student[] = [
    {
      id: "1",
      name: "Nguyễn Văn An",
      phone: "0901234567",
      status: "completed",
      score: 85,
      submittedAt: new Date(2024, 11, 25, 14, 30),
      attemptNumber: 1,
      isGraded: true,
    },
    {
      id: "2",
      name: "Trần Thị Bình",
      phone: "0901234568",
      status: "completed",
      score: 92,
      submittedAt: new Date(2024, 11, 26, 10, 15),
      attemptNumber: 1,
      isGraded: true,
    },
    {
      id: "3",
      name: "Lê Hoàng Cường",
      phone: "0901234569",
      status: "completed",
      score: 78,
      submittedAt: new Date(2024, 11, 27, 16, 45),
      attemptNumber: 2,
      isGraded: true,
    },
    {
      id: "4",
      name: "Phạm Thị Dung",
      phone: "0901234570",
      status: "not-started",
    },
    {
      id: "5",
      name: "Hoàng Văn Em",
      phone: "0901234571",
      status: "not-started",
    },
  ];

  const completedStudents = students.filter((s) => s.status === "completed");
  const notCompletedStudents = students.filter((s) => s.status === "not-started");
  const totalStudents = students.length;
  const completionRate = Math.round((completedStudents.length / totalStudents) * 100);

  const getTimeRemaining = () => {
    const now = new Date();
    const diff = assignment.deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diff < 0) return "Đã quá hạn";
    if (days > 0) return `Còn ${days} ngày ${hours} giờ`;
    if (hours > 0) return `Còn ${hours} giờ`;
    return "Sắp hết hạn";
  };

  const stats = [
    {
      label: "Tổng học sinh",
      value: totalStudents,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Đã hoàn thành",
      value: completedStudents.length,
      icon: CheckCircle2,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Chưa hoàn thành",
      value: notCompletedStudents.length,
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      label: "Tỷ lệ hoàn thành",
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link to="/giao-vien/bai-tap" className="text-gray-600 hover:text-blue-600 transition-colors">
            Quản lý giao bài
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{assignment.examTitle}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Link
              to="/giao-vien/bai-tap"
              className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tiến độ làm bài 📊</h1>
              <p className="text-gray-600 mt-1">Theo dõi chi tiết kết quả làm bài của học sinh</p>
            </div>
          </div>
        </div>

        {/* Assignment Info Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-blue-100 text-sm mb-1">Đề thi</p>
              <p className="font-bold text-lg">{assignment.examTitle}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-semibold">
                {assignment.examType}
              </span>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Giao cho</p>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <p className="font-bold text-lg">{assignment.targetName}</p>
              </div>
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-semibold">
                Lớp học
              </span>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Hạn nộp</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <p className="font-bold text-lg">
                  {assignment.deadline.toLocaleDateString("vi-VN")}
                </p>
              </div>
              <p className="text-sm mt-2 font-semibold">{getTimeRemaining()}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Số lần làm bài</p>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <p className="font-bold text-lg">{assignment.maxAttempts} lần</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overdue Banner */}
        {assignment.isOverdue && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">Bài thi đã quá hạn!</p>
              <p className="text-sm text-red-700">
                Vui lòng gửi nhắc nhở đến học sinh chưa hoàn thành
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Completed Students */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                Đã hoàn thành ({completedStudents.length})
              </h2>
            </div>

            <div className="space-y-3">
              {completedStudents.map((student) => (
                <div
                  key={student.id}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-green-100 rounded-lg">
                        <p className="text-2xl font-bold text-green-700">{student.score}</p>
                      </div>
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {student.submittedAt?.toLocaleString("vi-VN")}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-semibold">
                        Lần {student.attemptNumber}
                      </span>
                      {student.isGraded && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-semibold">
                          Đã chấm
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/bai-tap/${assignment.id}/students/${student.id}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Not Completed Students */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-600" />
                Chưa hoàn thành ({notCompletedStudents.length})
              </h2>
            </div>

            <div className="space-y-3">
              {notCompletedStudents.map((student) => (
                <div
                  key={student.id}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.phone}</p>
                    </div>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-semibold">
                      Chưa làm bài
                    </span>
                  </div>

                  <button className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                    <Bell className="w-4 h-4" />
                    Gửi nhắc nhở
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        {notCompletedStudents.length > 0 && (
          <button
            onClick={() => setShowReminderModal(true)}
            className="fixed bottom-8 right-8 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-full shadow-2xl shadow-orange-500/50 flex items-center gap-2 transition-all duration-200 hover:scale-105"
          >
            <Send className="w-5 h-5" />
            Gửi nhắc nhở hàng loạt ({notCompletedStudents.length})
          </button>
        )}
      </div>
    </div>
  );
}