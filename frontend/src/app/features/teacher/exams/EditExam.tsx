import { Link, useParams } from "react-router";
import { ArrowLeft, Save, Eye } from "lucide-react";

export function EditExam() {
  const { examId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-amber-50/20 to-orange-50/10">
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link to={`/giao-vien/de-thi/${examId}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Chỉnh sửa đề thi</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link to="/giao-vien" className="hover:text-orange-600">Dashboard</Link>
                <span>/</span>
                <Link to="/giao-vien/de-thi/cua-toi" className="hover:text-orange-600 transition-colors">
                  Đề thi của tôi
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">Chỉnh sửa</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 font-medium">
                <Eye className="w-4 h-4" />
                Xem trước
              </button>
              <button className="px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all flex items-center gap-2 font-medium shadow-lg shadow-orange-500/30">
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Save className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Edit Exam Page</h3>
            <p className="text-gray-600">Exam ID: {examId}</p>
            <p className="text-gray-600">This page will allow editing exam details, questions, and settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


