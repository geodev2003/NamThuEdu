import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  Users,
  User,
  Calendar,
  ChevronDown,
  CheckCircle2,
  Send,
  Zap,
} from "lucide-react";

interface BulkAssignmentProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulkAssignment({ isOpen, onClose }: BulkAssignmentProps) {
  const { t } = useTranslation();
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#EA580C] to-[#F97316] px-6 py-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-tight">{t("teacher.assignments.bulk.heading")}</h2>
                  <p className="text-xs text-orange-100 mt-0.5">{t("teacher.assignments.bulk.subtitle")}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Select Exam */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-2">
                  <FileText className="w-4 h-4 text-[#EA580C]" />
                  {t("teacher.assignments.bulk.selectExam")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all appearance-none hover:border-[#D1D5DB] text-sm"
                  >
                    <option value="">{t("teacher.assignments.bulk.selectExamPlaceholder")}</option>
                    {exams.map((exam) => (
                      <option key={exam.id} value={exam.id}>{exam.title}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                </div>
              </div>

              {/* Target Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-3">
                  <Users className="w-4 h-4 text-[#EA580C]" />
                  {t("teacher.assignments.bulk.selectTarget")} <span className="text-red-500">*</span>
                </label>

                {/* Tabs */}
                <div className="flex gap-2 mb-3 p-1 bg-[#F3F4F6] rounded-xl">
                  <button
                    onClick={() => setActiveTab("classes")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === "classes"
                        ? "bg-white text-[#EA580C] shadow-sm"
                        : "text-[#6B7280] hover:text-[#374151]"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    {t("teacher.assignments.bulk.selectClassesTab", { count: selectedClasses.length })}
                  </button>
                  <button
                    onClick={() => setActiveTab("students")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === "students"
                        ? "bg-white text-[#EA580C] shadow-sm"
                        : "text-[#6B7280] hover:text-[#374151]"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    {t("teacher.assignments.bulk.selectStudentsTab", { count: selectedStudents.length })}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="border border-[#E5E7EB] rounded-xl overflow-hidden max-h-52 overflow-y-auto">
                  {activeTab === "classes" ? (
                    <div className="divide-y divide-[#F3F4F6]">
                      {classes.map((cls) => (
                        <label
                          key={cls.id}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                            selectedClasses.includes(cls.id) ? "bg-orange-50" : "bg-white hover:bg-[#F9FAFB]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedClasses.includes(cls.id)}
                            onChange={() => toggleClass(cls.id)}
                            className="w-4 h-4 accent-[#EA580C] rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#111827]">{cls.name}</p>
                            <p className="text-xs text-[#6B7280]">{cls.students} {t("teacher.assignments.bulk.studentsLabel")}</p>
                          </div>
                          {selectedClasses.includes(cls.id) && <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0" />}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="divide-y divide-[#F3F4F6]">
                      {students.map((student) => (
                        <label
                          key={student.id}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                            selectedStudents.includes(student.id) ? "bg-orange-50" : "bg-white hover:bg-[#F9FAFB]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => toggleStudent(student.id)}
                            className="w-4 h-4 accent-[#EA580C] rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#111827]">{student.name}</p>
                            <p className="text-xs text-[#6B7280]">{student.phone} · {student.class}</p>
                          </div>
                          {selectedStudents.includes(student.id) && <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0" />}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected chips */}
                <AnimatePresence>
                  {(selectedClasses.length > 0 || selectedStudents.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-1.5 mt-3"
                    >
                      {selectedClasses.map((classId) => {
                        const cls = classes.find((c) => c.id === classId);
                        return (
                          <span key={classId} className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-xs font-medium">
                            <Users className="w-3 h-3" />{cls?.name}
                            <button onClick={() => removeClass(classId)} className="w-4 h-4 rounded flex items-center justify-center hover:bg-orange-200 transition-colors"><X className="w-3 h-3" /></button>
                          </span>
                        );
                      })}
                      {selectedStudents.map((studentId) => {
                        const student = students.find((s) => s.id === studentId);
                        return (
                          <span key={studentId} className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-xs font-medium">
                            <User className="w-3 h-3" />{student?.name}
                            <button onClick={() => removeStudent(studentId)} className="w-4 h-4 rounded flex items-center justify-center hover:bg-orange-200 transition-colors"><X className="w-3 h-3" /></button>
                          </span>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Settings */}
              <div className="pt-4 border-t border-[#F3F4F6] space-y-4">
                <p className="text-sm font-semibold text-[#111827]">{t("teacher.assignments.bulk.commonSettings")}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                      {t("teacher.assignments.bulk.dueDate")} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                      <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">{t("teacher.assignments.bulk.dueTime")}</label>
                    <input
                      type="time"
                      value={deadlineTime}
                      onChange={(e) => setDeadlineTime(e.target.value)}
                      className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">{t("teacher.assignments.bulk.maxAttempts")}</label>
                  <input
                    type="number" min="1" max="10"
                    value={maxAttempts}
                    onChange={(e) => setMaxAttempts(parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Summary */}
              <AnimatePresence>
                {canSubmit() && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50/50 p-4"
                  >
                    <p className="text-sm font-semibold text-[#EA580C] mb-1">{t("teacher.assignments.bulk.summaryTitle")}</p>
                    <p className="text-sm text-[#374151]">{t("teacher.assignments.bulk.willAssignTo", { classes: selectedClasses.length, students: selectedStudents.length })}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{t("teacher.assignments.bulk.totalWillReceive", { count: getTotalStudents() })}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#F3F4F6] bg-[#FAFAFA] flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={onClose}
                className="px-4 py-2.5 border border-[#E5E7EB] bg-white text-[#374151] text-sm font-medium rounded-xl hover:bg-[#F9FAFB] transition-all"
              >
                {t("teacher.common.cancel")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit()}
                className="px-5 py-2.5 bg-[#EA580C] text-white text-sm font-semibold rounded-xl hover:bg-[#C2410C] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-orange-300"
              >
                <Send className="w-4 h-4" />
                {t("teacher.assignments.bulk.submitLabel")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}