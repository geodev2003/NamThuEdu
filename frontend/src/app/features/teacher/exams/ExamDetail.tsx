import { Link, useParams } from "react-router";
import { ArrowLeft, Edit, Copy, Send, Download, Archive, Trash2, Eye } from "lucide-react";

export function ExamDetail() {
  const { examId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/giao-vien/de-thi/cua-toi" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Chi tiết đề thi</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <span>/</span>
                <Link to="/giao-vien" className="hover:text-blue-600 transition-colors">
                  Giáo viên
                </Link>
                <span>/</span>
                <Link to="/giao-vien/de-thi/cua-toi" className="hover:text-blue-600 transition-colors">
                  Đề thi của tôi
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">Chi tiết</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={`/giao-vien/de-thi/${examId}/chinh-sua`}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 font-medium shadow-lg shadow-blue-500/30"
              >
                <Edit className="w-4 h-4" />
                Chỉnh sửa
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Eye className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Exam Detail Page</h3>
            <p className="text-gray-600">Exam ID: {examId}</p>
            <p className="text-gray-600">This page will display full exam details, statistics, and student submissions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}