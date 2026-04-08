import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  AlertTriangle,
  PartyPopper,
  Users,
  School,
  Calendar,
  FileText,
  Eye,
  RotateCcw,
  ArrowLeftRight,
} from "lucide-react";

type Step = 1 | 2 | 3;

const mockClasses = [
  {
    id: 1,
    name: "IELTS 7.0 - Intensive Morning",
    code: "CLS-2024-001",
    studentCount: 28,
    maxStudents: 30,
  },
  {
    id: 2,
    name: "TOEIC 750+ Evening Class",
    code: "CLS-2024-002",
    studentCount: 25,
    maxStudents: 30,
  },
  {
    id: 3,
    name: "Cambridge FCE Preparation",
    code: "CLS-2024-003",
    studentCount: 18,
    maxStudents: 25,
  },
];

const mockStudents = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    phone: "0901234567",
    enrollDate: "15/01/2024",
    avgScore: 7.2,
    attendance: 92,
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    phone: "0912345678",
    enrollDate: "15/01/2024",
    avgScore: 6.8,
    attendance: 88,
  },
  {
    id: 3,
    name: "Lê Minh Châu",
    phone: "0923456789",
    enrollDate: "15/01/2024",
    avgScore: 7.5,
    attendance: 95,
  },
];

export function TransferClass() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [sourceClass, setSourceClass] = useState<number | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [destClass, setDestClass] = useState<number | null>(null);
  const [keepEnrollDate, setKeepEnrollDate] = useState(true);
  const [transferGrades, setTransferGrades] = useState(true);
  const [sendNotification, setSendNotification] = useState(true);
  const [reason, setReason] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);

  const steps = [
    { id: 1, title: "Chọn lớp nguồn", icon: School },
    { id: 2, title: "Chọn học sinh", icon: Users },
    { id: 3, title: "Chọn lớp đích", icon: ArrowLeftRight },
  ];

  const handleTransfer = () => {
    setShowConfirm(false);
    setIsSuccess(true);
  };

  const toggleStudent = (id: number) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const selectedSourceClass = mockClasses.find((c) => c.id === sourceClass);
  const selectedDestClass = mockClasses.find((c) => c.id === destClass);

  if (isSuccess) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-3xl p-12 border border-[#E5E7EB] shadow-2xl text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
            <PartyPopper className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#111827] mb-3">
            Chuyển lớp thành công! 🎉
          </h2>
          <p className="text-[#6B7280] text-lg mb-8">
            Đã chuyển <span className="font-bold text-[#10B981]">{selectedStudents.length} học sinh</span>{" "}
            từ <span className="font-semibold">{selectedSourceClass?.name}</span> sang{" "}
            <span className="font-semibold">{selectedDestClass?.name}</span>
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to={`/giao-vien/lop-hoc/${destClass}`}
              className="px-6 py-4 bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white rounded-xl hover:shadow-xl hover:shadow-orange-500/30 font-bold transition-all"
            >
              Xem lớp đích
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setCurrentStep(1);
                  setSourceClass(null);
                  setDestClass(null);
                  setSelectedStudents([]);
                }}
                className="px-6 py-3 border-2 border-[#E5E7EB] text-[#374151] rounded-xl hover:bg-[#F9FAFB] font-semibold transition-all"
              >
                Chuyển lớp khác
              </button>
              <Link
                to="/giao-vien/lop-hoc"
                className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#EA580C] mb-6 transition-colors group"
              >
                <div className="p-1.5 rounded-lg bg-white border border-[#E5E7EB] group-hover:border-[#EA580C] transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Quay lại danh sách lớp</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/giao-vien/lop-hoc"
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#EA580C] mb-6 transition-colors group"
        >
          <div className="p-1.5 rounded-lg bg-white border border-[#E5E7EB] group-hover:border-[#EA580C] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Quay lại danh sách lớp</span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#111827] mb-2">
              Chuyển lớp học sinh
            </h1>
            <p className="text-[#6B7280]">
              Dashboard &gt; Lớp học &gt; Chuyển lớp
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full mb-3 transition-all ${
                      isCompleted
                        ? "bg-[#10B981] shadow-lg shadow-green-500/20"
                        : isActive
                        ? "bg-gradient-to-br from-[#EA580C] to-[#C2410C] shadow-lg shadow-orange-500/20"
                        : "bg-[#E5E7EB]"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-[#6B7280]"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      isActive || isCompleted
                        ? "text-[#111827]"
                        : "text-[#6B7280]"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 mb-8 transition-all ${
                      currentStep > step.id
                        ? "bg-gradient-to-r from-[#10B981] to-[#059669]"
                        : "bg-[#E5E7EB]"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Step 1: Source Class */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm">
            <h2 className="text-2xl font-bold text-[#111827] mb-6">
              Chọn lớp nguồn
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {mockClasses.map((classItem) => (
                <button
                  key={classItem.id}
                  onClick={() => setSourceClass(classItem.id)}
                  className={`p-6 border-2 rounded-xl text-left transition-all ${
                    sourceClass === classItem.id
                      ? "border-[#EA580C] bg-[#FFF7ED] shadow-lg"
                      : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#111827] mb-1">
                        {classItem.name}
                      </h3>
                      <p className="text-sm text-[#6B7280] font-mono">
                        {classItem.code}
                      </p>
                    </div>
                    {sourceClass === classItem.id && (
                      <div className="w-6 h-6 rounded-full bg-[#EA580C] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <Users className="w-4 h-4" />
                    <span>
                      {classItem.studentCount}/{classItem.maxStudents} học sinh
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!sourceClass}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  sourceClass
                    ? "bg-[#EA580C] text-white hover:bg-[#C2410C]"
                    : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                }`}
              >
                Tiếp tục
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Students */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="p-8 border-b border-[#E5E7EB]">
              <h2 className="text-2xl font-bold text-[#111827] mb-2">
                Chọn học sinh cần chuyển
              </h2>
              <p className="text-[#6B7280]">
                Đã chọn:{" "}
                <span className="font-bold text-[#EA580C]">
                  {selectedStudents.length}
                </span>{" "}
                học sinh
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedStudents.length === mockStudents.length}
                        onChange={(e) =>
                          setSelectedStudents(
                            e.target.checked ? mockStudents.map((s) => s.id) : []
                          )
                        }
                        className="w-4 h-4 rounded border-2 border-[#D1D5DB] text-[#EA580C] focus:ring-2 focus:ring-[#EA580C] cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase">
                      Học sinh
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase">
                      SĐT
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase">
                      Ngày nhập học
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase">
                      Điểm TB
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase">
                      Điểm danh
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {mockStudents.map((student) => (
                    <tr
                      key={student.id}
                      className={`transition-colors ${
                        selectedStudents.includes(student.id)
                          ? "bg-[#FFF7ED]"
                          : "hover:bg-[#F9FAFB]"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudent(student.id)}
                          className="w-4 h-4 rounded border-2 border-[#D1D5DB] text-[#EA580C] focus:ring-2 focus:ring-[#EA580C] cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#111827]">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {student.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {student.enrollDate}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#10B981]">
                        {student.avgScore}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#EA580C]">
                        {student.attendance}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t border-[#E5E7EB] flex justify-between bg-[#F9FAFB]">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 px-6 py-3 border-2 border-[#E5E7EB] text-[#374151] rounded-xl hover:bg-white font-semibold transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Quay lại
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={selectedStudents.length === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedStudents.length > 0
                    ? "bg-[#EA580C] text-white hover:bg-[#C2410C]"
                    : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                }`}
              >
                Tiếp tục
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Destination & Options */}
        {currentStep === 3 && (
          <div className="grid grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="col-span-2 space-y-6">
              {/* Destination Class */}
              <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm">
                <h2 className="text-2xl font-bold text-[#111827] mb-6">
                  Chọn lớp đích
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {mockClasses
                    .filter((c) => c.id !== sourceClass)
                    .map((classItem) => {
                      const newTotal =
                        classItem.studentCount + selectedStudents.length;
                      const willExceed = newTotal > classItem.maxStudents;
                      return (
                        <button
                          key={classItem.id}
                          onClick={() => !willExceed && setDestClass(classItem.id)}
                          disabled={willExceed}
                          className={`p-6 border-2 rounded-xl text-left transition-all ${
                            destClass === classItem.id
                              ? "border-[#EA580C] bg-[#FFF7ED] shadow-lg"
                              : willExceed
                              ? "border-[#FEE2E2] bg-[#FEF2F2] cursor-not-allowed opacity-60"
                              : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-[#111827] mb-1">
                                {classItem.name}
                              </h3>
                              <p className="text-sm text-[#6B7280] font-mono">
                                {classItem.code}
                              </p>
                            </div>
                            {destClass === classItem.id && (
                              <div className="w-6 h-6 rounded-full bg-[#EA580C] flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#6B7280]">
                              Sĩ số: {classItem.studentCount}/{classItem.maxStudents}{" "}
                              → {newTotal}/{classItem.maxStudents}
                            </span>
                            {willExceed && (
                              <span className="px-2 py-1 bg-[#FEE2E2] text-[#EF4444] text-xs font-bold rounded">
                                Vượt quá sĩ số
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Transfer Options */}
              <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm">
                <h3 className="text-xl font-bold text-[#111827] mb-6">
                  Tùy chọn chuyển lớp
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 border border-[#E5E7EB] rounded-xl cursor-pointer hover:bg-[#F9FAFB] transition-colors">
                    <input
                      type="checkbox"
                      checked={keepEnrollDate}
                      onChange={(e) => setKeepEnrollDate(e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-[#D1D5DB] text-[#EA580C] focus:ring-2 focus:ring-[#EA580C] cursor-pointer"
                    />
                    <span className="text-sm font-medium text-[#374151]">
                      Giữ nguyên ngày nhập học
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-[#E5E7EB] rounded-xl cursor-pointer hover:bg-[#F9FAFB] transition-colors">
                    <input
                      type="checkbox"
                      checked={transferGrades}
                      onChange={(e) => setTransferGrades(e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-[#D1D5DB] text-[#EA580C] focus:ring-2 focus:ring-[#EA580C] cursor-pointer"
                    />
                    <span className="text-sm font-medium text-[#374151]">
                      Chuyển điểm số và kết quả thi
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-[#E5E7EB] rounded-xl cursor-pointer hover:bg-[#F9FAFB] transition-colors">
                    <input
                      type="checkbox"
                      checked={sendNotification}
                      onChange={(e) => setSendNotification(e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-[#D1D5DB] text-[#EA580C] focus:ring-2 focus:ring-[#EA580C] cursor-pointer"
                    />
                    <span className="text-sm font-medium text-[#374151]">
                      Gửi thông báo cho học sinh
                    </span>
                  </label>
                  <div>
                    <label className="block text-sm font-semibold text-[#374151] mb-2">
                      Lý do chuyển lớp (Tùy chọn)
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Nhập lý do chuyển lớp..."
                      rows={3}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C] resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Panel */}
            <div className="col-span-1">
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-lg sticky top-8">
                <h3 className="text-lg font-bold text-[#111827] mb-6">
                  Tóm tắt chuyển lớp
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[#F9FAFB] rounded-xl">
                    <p className="text-xs text-[#6B7280] mb-1">Từ lớp</p>
                    <p className="font-semibold text-[#111827]">
                      {selectedSourceClass?.name || "-"}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowLeftRight className="w-6 h-6 text-[#EA580C]" />
                  </div>
                  <div className="p-4 bg-[#FFF7ED] rounded-xl border border-[#EA580C]">
                    <p className="text-xs text-[#6B7280] mb-1">Sang lớp</p>
                    <p className="font-semibold text-[#EA580C]">
                      {selectedDestClass?.name || "Chưa chọn"}
                    </p>
                  </div>
                  <div className="p-4 bg-[#F9FAFB] rounded-xl">
                    <p className="text-xs text-[#6B7280] mb-1">Số học sinh</p>
                    <p className="text-2xl font-bold text-[#111827]">
                      {selectedStudents.length}
                    </p>
                  </div>
                  <div className="p-4 bg-[#F9FAFB] rounded-xl">
                    <p className="text-xs text-[#6B7280] mb-1">Ngày chuyển</p>
                    <p className="font-semibold text-[#111827]">
                      {new Date().toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="col-span-3 flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 px-6 py-3 border-2 border-[#E5E7EB] text-[#374151] rounded-xl hover:bg-[#F9FAFB] font-semibold transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Quay lại
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={!destClass}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
                  destClass
                    ? "bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white hover:shadow-xl hover:shadow-orange-500/30"
                    : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                }`}
              >
                <Check className="w-5 h-5" />
                Xác nhận chuyển lớp
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#FEF3C7] flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-[#F59E0B]" />
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-3 text-center">
              Xác nhận chuyển lớp?
            </h3>
            <p className="text-[#6B7280] text-center mb-6">
              Bạn đang chuyển{" "}
              <span className="font-bold text-[#111827]">
                {selectedStudents.length} học sinh
              </span>{" "}
              từ <span className="font-semibold">{selectedSourceClass?.name}</span>{" "}
              sang <span className="font-semibold">{selectedDestClass?.name}</span>
            </p>
            <div className="p-4 bg-[#F9FAFB] rounded-xl mb-6">
              <p className="text-sm text-[#6B7280] mb-2">
                <span className="font-semibold">Lớp nguồn:</span> Còn{" "}
                {(selectedSourceClass?.studentCount || 0) - selectedStudents.length}{" "}
                học sinh
              </p>
              <p className="text-sm text-[#6B7280]">
                <span className="font-semibold">Lớp đích:</span> Sẽ có{" "}
                {(selectedDestClass?.studentCount || 0) + selectedStudents.length}{" "}
                học sinh
              </p>
            </div>
            <label className="flex items-start gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-2 border-[#D1D5DB] text-[#EA580C] focus:ring-2 focus:ring-[#EA580C] cursor-pointer"
              />
              <span className="text-sm text-[#374151]">
                Tôi hiểu và muốn tiếp tục chuyển lớp
              </span>
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmChecked(false);
                }}
                className="flex-1 px-6 py-3 border-2 border-[#E5E7EB] text-[#374151] rounded-xl hover:bg-[#F9FAFB] font-semibold transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleTransfer}
                disabled={!confirmChecked}
                className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                  confirmChecked
                    ? "bg-[#EA580C] text-white hover:bg-[#C2410C]"
                    : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
