import { useState } from "react";
import { useNavigate } from "react-router";
import {
  X,
  FileText,
  Users,
  User,
  Calendar,
  ChevronDown,
  CheckCircle2,
  Send,
  Trash2,
} from "lucide-react";

interface BulkAssignmentProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulkAssignment({ isOpen, onClose }: BulkAssignmentProps) {
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState("");
  const [activeTab, setActiveTab] = useState<"classes" | "students">("classes");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [deadline, setDeadline] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("23:59");
  const [maxAttempts, setMaxAttempts] = useState(1);

  // Mock data
  const exams = [
    { id: "1", title: "Cambridge KET - Reading & Writing Test 1", type: "Cambridge KET" },
    { id: "2", title: "IELTS Reading Practice Test - Academic", type: "IELTS" },
    { id: "3", title: "TOEFL Speaking Section - Test 3", type: "TOEFL" },
    { id: "4", title: "PET Listening Test - Module 2", type: "PET" },
  ];

  const classes = [
    { id: "1", name: "Lớp KET Morning A1", students: 20 },
    { id: "2", name: "Lớp IELTS 6.5 Evening", students: 25 },
    { id: "3", name: "Lớp PET Intermediate B1", students: 18 },
    { id: "4", name: "Lớp TOEFL Advanced", students: 15 },
    { id: "5", name: "Lớp FCE Upper-Intermediate", students: 12 },
  ];

  const students = [
    { id: "1", name: "Nguyễn Văn An", phone: "0901234567", class: "KET Morning A1" },
    { id: "2", name: "Trần Thị Bình", phone: "0901234568", class: "IELTS 6.5" },
    { id: "3", name: "Lê Hoàng Cường", phone: "0901234569", class: "PET B1" },
    { id: "4", name: "Phạm Thị Dung", phone: "0901234570", class: "KET Morning A1" },
    { id: "5", name: "Hoàng Văn Em", phone: "0901234571", class: "TOEFL Advanced" },
    { id: "6", name: "Vũ Thị Giang", phone: "0901234572", class: "FCE" },
    { id: "7", name: "Đỗ Văn Hải", phone: "0901234573", class: "IELTS 6.5" },
  ];

  const toggleClass = (classId: string) => {
    setSelectedClasses((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const removeClass = (classId: string) => {
    setSelectedClasses((prev) => prev.filter((id) => id !== classId));
  };

  const removeStudent = (studentId: string) => {
    setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
  };

  const getTotalStudents = () => {
    const classStudents = selectedClasses.reduce((total, classId) => {
      const cls = classes.find((c) => c.id === classId);
      return total + (cls?.students || 0);
    }, 0);
    return classStudents + selectedStudents.length;
  };

  const handleSubmit = () => {
    console.log("Bulk assignment created:", {
      selectedExam,
      selectedClasses,
      selectedStudents,
      deadline,
      deadlineTime,
      maxAttempts,
    });
    // Simulate API call
    setTimeout(() => {
      onClose();
      navigate("/giao-vien/bai-tap");
    }, 1000);
  };

  const canSubmit = () => {
    return (
      selectedExam !== "" &&
      (selectedClasses.length > 0 || selectedStudents.length > 0) &&
      deadline !== ""
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Giao bài hàng loạt 🚀</h2>
              <p className="text-green-100">Giao bài thi cho nhiều lớp và học sinh cùng lúc</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Select Exam */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Chọn đề thi *
            </label>
            <div className="relative">
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
              >
                <option value="">-- Chọn đề thi --</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Target Selection with Tabs */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Chọn đối tượng *
            </label>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab("classes")}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "classes"
                    ? "bg-green-100 text-green-700 border-2 border-green-600"
                    : "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200"
                }`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                Chọn lớp học ({selectedClasses.length})
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "students"
                    ? "bg-purple-100 text-purple-700 border-2 border-purple-600"
                    : "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200"
                }`}
              >
                <User className="w-5 h-5 inline mr-2" />
                Chọn học sinh ({selectedStudents.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 max-h-64 overflow-y-auto">
              {activeTab === "classes" ? (
                <div className="space-y-2">
                  {classes.map((cls) => (
                    <label
                      key={cls.id}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selectedClasses.includes(cls.id)}
                        onChange={() => toggleClass(cls.id)}
                        className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{cls.name}</p>
                        <p className="text-sm text-gray-600">{cls.students} học sinh</p>
                      </div>
                      {selectedClasses.includes(cls.id) && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {students.map((student) => (
                    <label
                      key={student.id}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudent(student.id)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">
                          {student.phone} • {student.class}
                        </p>
                      </div>
                      {selectedStudents.includes(student.id) && (
                        <CheckCircle2 className="w-5 h-5 text-purple-600" />
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Targets Chips */}
          {(selectedClasses.length > 0 || selectedStudents.length > 0) && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Đã chọn ({selectedClasses.length} lớp, {selectedStudents.length} học sinh)
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedClasses.map((classId) => {
                  const cls = classes.find((c) => c.id === classId);
                  return (
                    <span
                      key={classId}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold"
                    >
                      <Users className="w-4 h-4" />
                      {cls?.name}
                      <button
                        onClick={() => removeClass(classId)}
                        className="hover:bg-green-200 rounded-full p-1 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
                {selectedStudents.map((studentId) => {
                  const student = students.find((s) => s.id === studentId);
                  return (
                    <span
                      key={studentId}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold"
                    >
                      <User className="w-4 h-4" />
                      {student?.name}
                      <button
                        onClick={() => removeStudent(studentId)}
                        className="hover:bg-purple-200 rounded-full p-1 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Common Settings */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <h3 className="font-bold text-gray-900">Cài đặt chung</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Hạn nộp bài *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Giờ nộp
                </label>
                <input
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Số lần làm bài tối đa
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Summary */}
          {canSubmit() && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
              <p className="font-bold text-green-900 mb-2">📋 Tổng kết:</p>
              <p className="text-gray-700">
                Sẽ giao bài thi cho{" "}
                <span className="font-bold text-green-700">{selectedClasses.length} lớp</span> và{" "}
                <span className="font-bold text-purple-700">{selectedStudents.length} học sinh</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Tổng cộng khoảng <span className="font-bold">{getTotalStudents()} học sinh</span>{" "}
                sẽ nhận bài thi này
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit()}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-green-500/30"
          >
            <Send className="w-5 h-5" />
            Giao bài hàng loạt
          </button>
        </div>
      </div>
    </div>
  );
}