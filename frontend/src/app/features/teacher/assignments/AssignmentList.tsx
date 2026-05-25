import { useState, useEffect } from "react";
import { getAuthToken } from '../../../../utils/authStorage';
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
  TrendingUp,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Header } from "../../../components/shared/Header";
import { api } from "../../../../services/api";
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
  
  // API state
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch assignments from API
  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const token = getAuthToken();
        if (!token) {
          setError(t('teacher.assignments.loginRequired'));
          setLoading(false);
          return;
        }

        const params: Record<string, string> = {};
        if (targetFilter !== 'all') params.target_type = targetFilter;

        const { data: result } = await api.get('/teacher/assignments', { params });
        if (result.status === 'success') {
          // Transform backend data to frontend format
          const transformedAssignments = result.data.map((assign: any) => {
            const deadline = assign.taDeadline ? new Date(assign.taDeadline) : null;
            const isOverdue = deadline ? new Date() > deadline : false;

            return {
              id: assign.taId.toString(),
              examTitle: assign.exam?.eTitle || 'Unknown Exam',
              targetType: assign.taTarget_type as "class" | "student",
              targetName: assign.target_name || `ID: ${assign.taTarget_id}`,
              deadline: deadline,
              maxAttempts: assign.taMax_attempt || 1,
              completionRate: assign.completion_rate || 0,
              isOverdue: isOverdue,
              totalStudents: assign.total_students || 0,
              completedStudents: assign.completed_students || 0,
            };
          });
          setAssignments(transformedAssignments);
        } else {
          setError(t('teacher.assignments.loadError'));
        }
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setError(t('teacher.assignments.dataError'));
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [targetFilter]); // Re-fetch when filter changes

  const overdueCount = assignments.filter((a) => a.isOverdue).length;
  const thisWeekCount = assignments.filter((a) => {
    const created = a.deadline ? new Date(a.deadline) : null;
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return created && created >= startOfWeek;
  }).length;

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.targetName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesExam = examFilter === "all" || assignment.examTitle === examFilter;
    const matchesTarget = targetFilter === "all" || assignment.targetType === targetFilter;

    return matchesSearch && matchesExam && matchesTarget;
  });

  const formatDeadline = (date: Date | null | undefined) => {
    if (!date) return "—";
    const now = new Date();
    const diffTime = new Date(date).getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return t("teacher.assignments.deadline.overdueBy", { count: Math.abs(diffDays) });
    if (diffDays === 0) return t("teacher.assignments.deadline.today");
    if (diffDays === 1) return t("teacher.assignments.deadline.tomorrow");
    return t("teacher.assignments.deadline.inDays", { count: diffDays });
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
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Compact info strip */}
          {!loading && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-5 py-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                  <BarChart3 className="w-3.5 h-3.5" />
                  {assignments.length} bài tập
                </span>
                {overdueCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {overdueCount} quá hạn
                  </span>
                )}
                {thisWeekCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-xs font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    {thisWeekCount} tuần này
                  </span>
                )}
              </div>
              <Link
                to="/giao-vien/bai-tap/thong-ke"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-600 text-xs font-medium hover:bg-indigo-50 transition-colors"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Xem thống kê chi tiết
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px]">
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
                <option value="all">{t('teacher.assignments.allExams')}</option>
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
                <option value="all">{t('teacher.assignments.allTargets')}</option>
                <option value="class">{t('teacher.assignments.targetType.class')}</option>
                <option value="student">{t('teacher.assignments.targetType.student')}</option>
              </select>

              {/* Giao hàng loạt button — right side */}
              <button
                onClick={() => setShowBulkModal(true)}
                className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-orange-50 border border-orange-200 text-orange-600 font-medium rounded-lg hover:bg-orange-100 hover:border-orange-300 transition-all text-sm whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                {t("teacher.assignments.bulkAssign")}
              </button>
            </div>
          </div>

          {/* Assignments Table */}
          {!loading && !error && filteredAssignments.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      {t("teacher.assignments.table.exam")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      {t("teacher.assignments.table.target")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      {t("teacher.assignments.table.dueDate")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      {t("teacher.assignments.table.attempts")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      {t("teacher.assignments.table.completed")}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      {t("teacher.assignments.table.actions")}
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
                            {assignment.targetType === "class" ? t("teacher.assignments.targetLabel.class") : t("teacher.assignments.targetLabel.individual")}
                          </span>
                          <p className="text-sm text-gray-600">{assignment.targetName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-gray-900">
                            {assignment.deadline ? assignment.deadline.toLocaleDateString("vi-VN") : "—"}
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
                          {t("teacher.assignments.attemptsCount", { count: assignment.maxAttempts })}
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
                            title={t("teacher.assignments.viewProgress")}
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedAssignment(assignment);
                              setShowReminderModal(true);
                            }}
                            className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                            title={t("teacher.assignments.sendReminderTitle")}
                          >
                            <Bell className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title={t('teacher.common.delete')}
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
          ) : !loading && !error ? (
            /* Empty State */
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t("teacher.assignments.empty.title")}</h3>
              <p className="text-gray-600">
                {t("teacher.assignments.empty.description")}
              </p>
              <button
                onClick={() => navigate("/giao-vien/bai-tap/giao-moi")}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {t("teacher.assignments.empty.cta")}
              </button>
            </div>
          </div>
          ) : null}
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