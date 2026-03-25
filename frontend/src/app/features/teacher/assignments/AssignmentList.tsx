import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Users,
  User,
  Search,
  Eye,
  Bell,
  Trash2,
  AlertCircle,
  BarChart3,
  Send,
} from "lucide-react";
import { Header } from "../../../components/shared/Header";
import { BulkAssignment } from "./BulkAssignment";
import { ReminderModal } from "./ReminderModal";

interface Assignment {
  id: string;
  examTitle: string;
  targetType: "class" | "student";
  targetName: string;
  deadline: Date;
  maxAttempts: number;
  completionRate: number;
  isOverdue: boolean;
  totalStudents: number;
  completedStudents: number;
}

export function AssignmentList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [examFilter, setExamFilter] = useState("all");
  const [targetFilter, setTargetFilter] = useState("all");
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Mock data
  const assignments: Assignment[] = [
    {
      id: "1",
      examTitle: "Cambridge KET - Reading & Writing Test 1",
      targetType: "class",
      targetName: "Lớp KET Morning A1",
      deadline: new Date(2024, 11, 30),
      maxAttempts: 2,
      completionRate: 75,
      isOverdue: false,
      totalStudents: 20,
      completedStudents: 15,
    },
    {
      id: "2",
      examTitle: "IELTS Reading Practice Test - Academic",
      targetType: "class",
      targetName: "Lớp IELTS 6.5 Evening",
      deadline: new Date(2024, 11, 25),
      maxAttempts: 1,
      completionRate: 45,
      isOverdue: true,
      totalStudents: 25,
      completedStudents: 11,
    },
    {
      id: "3",
      examTitle: "TOEFL Speaking Section - Test 3",
      targetType: "student",
      targetName: "Nguyễn Văn An",
      deadline: new Date(2025, 0, 5),
      maxAttempts: 3,
      completionRate: 100,
      isOverdue: false,
      totalStudents: 1,
      completedStudents: 1,
    },
    {
      id: "4",
      examTitle: "PET Listening Test - Module 2",
      targetType: "class",
      targetName: "Lớp PET Intermediate B1",
      deadline: new Date(2024, 11, 28),
      maxAttempts: 2,
      completionRate: 60,
      isOverdue: false,
      totalStudents: 18,
      completedStudents: 11,
    },
  ];

  const stats = [
    {
      label: "Tổng số bài",
      value: assignments.length,
      icon: BarChart3,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Giao cho lớp",
      value: assignments.filter((a) => a.targetType === "class").length,
      icon: Users,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Giao cá nhân",
      value: assignments.filter((a) => a.targetType === "student").length,
      icon: User,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Quá hạn",
      value: assignments.filter((a) => a.isOverdue).length,
      icon: AlertCircle,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.targetName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesExam = examFilter === "all" || assignment.examTitle === examFilter;
    const matchesTarget = targetFilter === "all" || assignment.targetType === targetFilter;

    return matchesSearch && matchesExam && matchesTarget;
  });

  const formatDeadline = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `Quá hạn ${Math.abs(diffDays)} ngày`;
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Ngày mai";
    return `${diffDays} ngày nữa`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        breadcrumb={[t("breadcrumb.dashboard"), t("breadcrumb.assignments")]}
        action={{
          label: t("assignments.createNew"),
          onClick: () => navigate("/giao-vien/bai-tap/giao-moi"),
        }}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: "#EEEEF3" }}>
        <div className="px-8 py-6 space-y-6">
          {/* Quick Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setShowBulkModal(true)}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Giao hàng loạt
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài thi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

              {/* Exam Filter */}
              <select
                value={examFilter}
                onChange={(e) => setExamFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">Tất cả đề thi</option>
                <option value="Cambridge KET">Cambridge KET</option>
                <option value="IELTS">IELTS</option>
                <option value="TOEFL">TOEFL</option>
              </select>

              {/* Target Filter */}
              <select
                value={targetFilter}
                onChange={(e) => setTargetFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">Tất cả đối tượng</option>
                <option value="class">Lớp học</option>
                <option value="student">Học sinh</option>
              </select>
            </div>
          </div>

          {/* Assignments Table */}
          {filteredAssignments.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Đề thi
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Đối tượng
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Hạn nộp
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Lượt làm
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Tiến độ
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAssignments.map((assignment) => (
                    <tr
                      key={assignment.id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{assignment.examTitle}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold w-fit ${
                              assignment.targetType === "class"
                                ? "bg-green-100 text-green-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {assignment.targetType === "class" ? (
                              <Users className="w-3 h-3" />
                            ) : (
                              <User className="w-3 h-3" />
                            )}
                            {assignment.targetType === "class" ? "Lớp học" : "Cá nhân"}
                          </span>
                          <p className="text-sm text-gray-600">{assignment.targetName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-gray-900">
                            {assignment.deadline.toLocaleDateString("vi-VN")}
                          </p>
                          <p
                            className={`text-xs font-semibold ${
                              assignment.isOverdue ? "text-red-600" : "text-gray-500"
                            }`}
                          >
                            {assignment.isOverdue && (
                              <AlertCircle className="inline w-3 h-3 mr-1" />
                            )}
                            {formatDeadline(assignment.deadline)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {assignment.maxAttempts} lần
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">
                              {assignment.completedStudents}/{assignment.totalStudents}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {assignment.completionRate}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                assignment.completionRate >= 75
                                  ? "bg-gradient-to-r from-green-500 to-green-600"
                                  : assignment.completionRate >= 50
                                  ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                  : "bg-gradient-to-r from-orange-500 to-orange-600"
                              }`}
                              style={{ width: `${assignment.completionRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/giao-vien/bai-tap/${assignment.id}/tien-do`}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Xem tiến độ"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedAssignment(assignment);
                              setShowReminderModal(true);
                            }}
                            className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                            title="Gửi nhắc nhở"
                          >
                            <Bell className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Chưa có bài thi nào được giao</h3>
              <p className="text-gray-600">
                Bắt đầu giao bài thi cho học sinh hoặc lớp học để theo dõi tiến độ học tập
              </p>
              <button
                onClick={() => navigate("/giao-vien/bai-tap/giao-moi")}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Giao bài thi đầu tiên
              </button>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Bulk Assignment Modal */}
      <BulkAssignment
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
      />

      {/* Reminder Modal */}
      {selectedAssignment && (
        <ReminderModal
          isOpen={showReminderModal}
          onClose={() => setShowReminderModal(false)}
          onConfirm={() => {
            console.log("Sending reminder for:", selectedAssignment.id);
          }}
          studentCount={selectedAssignment.totalStudents - selectedAssignment.completedStudents}
          assignmentTitle={selectedAssignment.examTitle}
          deadline={selectedAssignment.deadline}
          isBulk={false}
        />
      )}
    </div>
  );
}