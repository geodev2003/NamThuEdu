import { X, AlertTriangle, Send, Users, Clock, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentCount: number;
  assignmentTitle: string;
  deadline?: Date;
  isBulk?: boolean;
}

export function ReminderModal({
  isOpen,
  onClose,
  onConfirm,
  studentCount,
  assignmentTitle,
  deadline,
  isBulk = false,
}: ReminderModalProps) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const formatDeadline = (date?: Date) => {
    if (!date) return t("teacher.assignments.reminder.noDeadline");
    return date.toLocaleString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t("teacher.assignments.reminder.title")}</h2>
                <p className="text-orange-100 text-sm">
                  {isBulk ? t("teacher.assignments.reminder.bulkSubtitle") : t("teacher.assignments.reminder.studentSubtitle")}
                </p>
              </div>
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
        <div className="p-6 space-y-6">
          {/* Warning Message */}
          <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4">
            <p className="text-gray-900 font-semibold mb-2">
              {isBulk
                ? t("teacher.assignments.reminder.bulkConfirm", { count: studentCount })
                : t("teacher.assignments.reminder.singleConfirm")}
            </p>
            <p className="text-sm text-gray-700">
              {isBulk
                ? t("teacher.assignments.reminder.bulkDesc")
                : t("teacher.assignments.reminder.singleDesc")}
            </p>
          </div>

          {/* Assignment Details */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 text-sm uppercase text-gray-500">
              {t("teacher.assignments.reminder.examDetails")}
            </h3>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              {/* Exam Title */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">{t("teacher.assignments.reminder.examLabel")}</p>
                  <p className="font-semibold text-gray-900">{assignmentTitle}</p>
                </div>
              </div>

              {/* Student Count */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">{t("teacher.assignments.reminder.studentCount")}</p>
                  <p className="font-semibold text-gray-900">
                    {t("teacher.assignments.reminder.studentsNotDone", { count: studentCount })}
                  </p>
                </div>
              </div>

              {/* Deadline */}
              {deadline && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">{t("teacher.assignments.reminder.deadlineLabel")}</p>
                    <p className="font-semibold text-gray-900">{formatDeadline(deadline)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reminder Message Preview */}
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 text-sm uppercase text-gray-500">
              {t("teacher.assignments.reminder.reminderContent")}
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                📢 <strong>{t("teacher.assignments.reminder.emailTitle")}</strong>
                <br />
                <br />
                {t("teacher.assignments.reminder.emailGreeting")} "<strong>{assignmentTitle}</strong>".
                <br />
                {deadline && (
                  <>
                    {t("teacher.assignments.reminder.emailDeadlineLabel")} <strong>{formatDeadline(deadline)}</strong>
                    <br />
                  </>
                )}
                <br />
                {t("teacher.assignments.reminder.emailNote")}
                <br />
                <br />
                {t("teacher.assignments.reminder.emailSalutation")}
                <br />
                NamThu Education Team
              </p>
            </div>
          </div>

          {/* Info Notice */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <p className="text-sm text-gray-700">
              {t("teacher.assignments.reminder.noticeText")}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
          >
            {t("teacher.assignments.reminder.cancel")}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
          >
            <Send className="w-5 h-5" />
            {t("teacher.assignments.reminder.send")}
          </button>
        </div>
      </div>
    </div>
  );
}
