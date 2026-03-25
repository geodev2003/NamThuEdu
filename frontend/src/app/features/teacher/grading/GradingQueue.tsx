import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Search,
  Eye,
  Zap,
  Edit3,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { Header } from "../../../components/shared/Header";

interface Submission {
  id: string;
  studentName: string;
  studentAvatar: string;
  examTitle: string;
  examType: string;
  submissionTime: Date;
  status: "submitted" | "graded" | "partially_graded";
  score?: number;
  maxScore: number;
  attemptNumber: number;
}

export function GradingQueue() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterExam, setFilterExam] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);

  // Mock data
  const submissions: Submission[] = [
    {
      id: "1",
      studentName: "Nguyễn Văn An",
      studentAvatar: "NA",
      examTitle: "Cambridge KET - Reading & Writing Test 1",
      examType: "Cambridge KET",
      submissionTime: new Date("2024-03-20T14:30:00"),
      status: "submitted",
      maxScore: 100,
      attemptNumber: 1,
    },
    {
      id: "2",
      studentName: "Trần Thị Bình",
      studentAvatar: "TB",
      examTitle: "IELTS Reading Practice Test - Academic",
      examType: "IELTS",
      submissionTime: new Date("2024-03-20T15:45:00"),
      status: "partially_graded",
      score: 65,
      maxScore: 100,
      attemptNumber: 2,
    },
    {
      id: "3",
      studentName: "Lê Hoàng Cường",
      studentAvatar: "LC",
      examTitle: "TOEFL Speaking Section - Test 3",
      examType: "TOEFL",
      submissionTime: new Date("2024-03-21T09:15:00"),
      status: "graded",
      score: 88,
      maxScore: 100,
      attemptNumber: 1,
    },
    {
      id: "4",
      studentName: "Phạm Thị Dung",
      studentAvatar: "PD",
      examTitle: "PET Listening Test - Module 2",
      examType: "PET",
      submissionTime: new Date("2024-03-21T10:30:00"),
      status: "submitted",
      maxScore: 100,
      attemptNumber: 1,
    },
  ];

  const stats = {
    total: 45,
    graded: 28,
    pending: 15,
    completionRate: 62,
  };

  const getStatusBadge = (status: Submission["status"]) => {
    const badges = {
      submitted: { text: "Chờ chấm", color: "bg-orange-100 text-orange-700 border-orange-200" },
      graded: { text: "Đã chấm", color: "bg-green-100 text-green-700 border-green-200" },
      partially_graded: { text: "Chấm 1 phần", color: "bg-blue-100 text-blue-700 border-blue-200" },
    };
    return badges[status];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const matchSearch =
      searchQuery === "" ||
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.examTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchExam = filterExam === "" || sub.examType === filterExam;
    const matchStatus = filterStatus === "" || sub.status === filterStatus;
    return matchSearch && matchExam && matchStatus;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header breadcrumb={[t("breadcrumb.dashboard"), t("breadcrumb.grading")]} />

      <div className="flex-1 overflow-y-auto" style={{ background: "#EEEEF3" }}>
        <div className="px-8 py-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Submissions */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Edit3 className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-gray-600 text-sm mb-1">Tổng số bài nộp</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>

            {/* Graded */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all">
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

            {/* Pending */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all">
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
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Tỷ lệ hoàn thành</p>
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold text-gray-900">{stats.completionRate}%</p>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all"
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm học sinh hoặc đề thi..."
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
                  <option value="Cambridge KET">Cambridge KET</option>
                  <option value="IELTS">IELTS</option>
                  <option value="TOEFL">TOEFL</option>
                  <option value="PET">PET</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Filter Status */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="submitted">Chờ chấm</option>
                  <option value="graded">Đã chấm</option>
                  <option value="partially_graded">Chấm 1 phần</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Bulk Action */}
              <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-semibold">Chấm tự động hàng loạt</span>
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Học sinh
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Đề thi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Thời gian nộp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Điểm
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Lần thi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => {
                    const badge = getStatusBadge(submission.status);
                    return (
                      <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {submission.studentAvatar}
                            </div>
                            <p className="font-semibold text-gray-900">{submission.studentName}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900 mb-1">{submission.examTitle}</p>
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                            {submission.examType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-700">{formatTime(submission.submissionTime)}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${badge.color}`}>
                            {badge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {submission.score !== undefined ? (
                            <span className="text-lg font-bold text-gray-900">
                              {submission.score}/{submission.maxScore}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm font-semibold">
                            Lần {submission.attemptNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/giao-vien/cham-diem/${submission.id}`}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                              title="Chấm tự động"
                            >
                              <Zap className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all"
                              title="Chấm thủ công"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredSubmissions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 font-semibold mb-2">Không tìm thấy bài nộp nào</p>
                <p className="text-sm text-gray-500">Thử điều chỉnh bộ lọc của bạn</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
