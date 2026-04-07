import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Target, BrainCircuit, Users } from "lucide-react";

export function CourseAIInsights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Overview Prediction - Spans 2 columns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:col-span-2 rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
          color: "white",
        }}
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <BrainCircuit className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-indigo-300" />
            <h3 className="text-lg font-semibold text-indigo-100">Dự báo từ AI NamThu</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-indigo-200 text-sm mb-2">Dự kiến tỷ lệ đạt mục tiêu (IELTS 6.5+)</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold text-white">82%</span>
                <span className="flex items-center text-emerald-400 text-sm font-medium mb-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5% so với tháng trước
                </span>
              </div>
              <p className="text-indigo-200 text-sm mt-4 leading-relaxed">
                Dựa trên kết quả 3 bài kiểm tra gần nhất, tốc độ làm bài và mức độ tương tác trên lớp, AI dự báo lớp sẽ có tỷ lệ đạt mục tiêu rất khả quan.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-indigo-200">Listening & Reading</span>
                  <span className="text-white font-medium">92% đạt</span>
                </div>
                <div className="w-full bg-indigo-900 rounded-full h-1.5">
                  <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-indigo-200">Writing</span>
                  <span className="text-white font-medium">65% đạt</span>
                </div>
                <div className="w-full bg-indigo-900 rounded-full h-1.5">
                  <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-indigo-200">Speaking</span>
                  <span className="text-white font-medium">78% đạt</span>
                </div>
                <div className="w-full bg-indigo-900 rounded-full h-1.5">
                  <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* At Risk Students */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-gray-900">Cần chú ý</h3>
          </div>
          <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded-md">3 học viên</span>
        </div>
        
        <div className="space-y-4">
          {[
            { name: "Phạm Thu Dung", issue: "Điểm Writing giảm liên tục", trend: "down" },
            { name: "Lê Hoàng Cường", issue: "Vắng mặt 3 buổi liên tiếp", trend: "down" },
            { name: "Trần Minh Tuấn", issue: "Chưa nộp 2 bài tập gần nhất", trend: "down" },
          ].map((student, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-medium text-xs">
                {student.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{student.name}</p>
                <p className="text-xs text-red-600 mt-0.5">{student.issue}</p>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-100 hover:bg-indigo-50 rounded-lg transition-colors">
          Xem kế hoạch can thiệp
        </button>
      </motion.div>

      {/* Suggested Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="md:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-gray-900">Đề xuất nội dung giảng dạy</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded">Ưu tiên cao</span>
              <span className="text-sm font-medium text-gray-900">Writing Task 2: Cấu trúc lập luận</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">65% lớp đang gặp khó khăn trong việc phát triển ý (Coherence & Cohesion).</p>
            <button className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1">
              Thêm vào bài giảng tiếp theo <TrendingUp className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">Nên bổ sung</span>
              <span className="text-sm font-medium text-gray-900">Speaking Part 3: Từ vựng chuyên ngành</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">Học viên có xu hướng lặp từ khi trả lời các câu hỏi trừu tượng.</p>
            <button className="text-xs font-medium text-blue-700 hover:text-blue-800 flex items-center gap-1">
              Tạo bài tập thực hành AI <Target className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Class Strengths */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-gray-900">Điểm mạnh của lớp</h3>
        </div>
        
        <ul className="space-y-4">
          <li className="flex gap-3">
            <div className="mt-0.5 text-emerald-500">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Kỹ năng Nghe xuất sắc</p>
              <p className="text-xs text-gray-600 mt-1">Vượt 15% so với điểm chuẩn của trung tâm</p>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="mt-0.5 text-emerald-500">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Tương tác nhóm tốt</p>
              <p className="text-xs text-gray-600 mt-1">Các bài tập Speaking nhóm có độ sôi nổi cao</p>
            </div>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
