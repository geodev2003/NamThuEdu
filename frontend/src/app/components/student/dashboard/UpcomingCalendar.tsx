import { Link } from "react-router";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { formatDate } from "../../../../utils/formatters";

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#EDE9FE";
const STUDENT_BASE_PATH = "/hoc-vien";

interface UpcomingTest {
  id: number;
  assignmentId: number;
  title: string;
  deadline: string;
  duration: number;
  skill: string;
  isUrgent: boolean;
  daysUntil: number;
}

interface UpcomingCalendarProps {
  tests: UpcomingTest[];
  isLoading?: boolean;
}

export function UpcomingCalendar({ tests, isLoading }: UpcomingCalendarProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl p-5 bg-white border border-gray-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <div
        className="rounded-2xl p-5 bg-white"
        style={{ border: "1.5px solid #F0EEFF" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5" style={{ color: PURPLE }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1F1344" }}>
            Lịch thi tuần này
          </h3>
        </div>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p style={{ fontSize: 14, color: "#9CA3AF" }}>
            Không có bài thi nào trong tuần này
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 bg-white"
      style={{ border: "1.5px solid #F0EEFF" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" style={{ color: PURPLE }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1F1344" }}>
            Lịch thi tuần này
          </h3>
        </div>
        <span
          className="text-xs font-semibold"
          style={{ color: "#6B7280" }}
        >
          {tests.length} bài thi
        </span>
      </div>

      <div className="space-y-3">
        {tests.map((test) => {
          const date = new Date(test.deadline);
          const day = date.getDate();
          const month = date.toLocaleDateString("vi-VN", { month: "short" });
          const time = date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <Link
              key={test.id}
              to={`${STUDENT_BASE_PATH}/bai-tap`}
              className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:shadow-md"
              style={{
                border: test.isUrgent
                  ? "1.5px solid #FEE2E2"
                  : "1px solid #F0EEFF",
                background: test.isUrgent ? "#FEF2F2" : "#FAFAFE",
              }}
            >
              <div
                className="text-center flex-shrink-0"
                style={{ minWidth: 48 }}
              >
                <div
                  className="text-2xl font-bold leading-none"
                  style={{ color: test.isUrgent ? "#EF4444" : PURPLE }}
                >
                  {day}
                </div>
                <div
                  className="text-xs mt-1"
                  style={{ color: test.isUrgent ? "#DC2626" : "#6B7280" }}
                >
                  {month}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold truncate mb-1"
                  style={{ fontSize: 14, color: "#1F1344" }}
                >
                  {test.title}
                </p>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" style={{ color: "#9CA3AF" }} />
                    <span style={{ color: "#6B7280" }}>
                      {time} • {test.duration} phút
                    </span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded"
                    style={{ background: PURPLE_LIGHT, color: PURPLE }}
                  >
                    {test.skill}
                  </span>
                </div>
              </div>

              {test.isUrgent && (
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-full flex-shrink-0"
                  style={{ background: "#FEE2E2", color: "#DC2626" }}
                >
                  <AlertCircle className="w-3 h-3" />
                  <span className="text-xs font-bold">
                    {test.daysUntil === 0
                      ? "Hôm nay"
                      : `${test.daysUntil} ngày`}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
