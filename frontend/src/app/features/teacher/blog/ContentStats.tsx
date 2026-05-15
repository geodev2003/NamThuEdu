import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";

export function ContentStats() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="mb-6">
        <Link
          to="/giao-vien/bai-viet"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Thống kê bài viết 📊</h1>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-4">Chức năng đang được phát triển</p>
          <p className="text-sm">Thống kê bài viết sẽ hiển thị ở đây</p>
        </div>
      </div>
    </div>
  );
}
