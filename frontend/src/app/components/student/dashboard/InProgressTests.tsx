import { Link } from "react-router";
import { Clock, Play, AlertCircle } from "lucide-react";

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#EDE9FE";

interface InProgressTest {
  id: number;
  submissionId: number;
  title: string;
  timeRemaining: number;
  totalDuration: number;
  skill: string;
  startedAt: string;
}

interface InProgressTestsProps {
  tests: InProgressTest[];
  isLoading?: boolean;
}

export function InProgressTests({ tests, isLoading }: InProgressTestsProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl p-5 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-white rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (tests.length === 0) {
    return null;
  }

  return (
    <div
      className="rounded-2xl p-5 border"
      style={{
        background: "linear-gradient(135deg, #F5F3FF 0%, #EFF6FF 100%)",
        borderColor: `${PURPLE}30`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: PURPLE_LIGHT }}
          >
            <Clock className="w-4 h-4" style={{ color: PURPLE }} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1F1344" }}>
            Bài thi đang làm dở
          </h3>
        </div>
        <span
          className="px-2.5 py-1 rounded-full text-xs font-bold"
          style={{ background: "#EF4444", color: "white" }}
        >
          {tests.length}
        </span>
      </div>

      <div className="space-y-3">
        {tests.map((test) => {
          const progressPercent = Math.round(
            ((test.totalDuration - test.timeRemaining) / test.totalDuration) * 100
          );
          const isUrgent = test.timeRemaining < 10;

          return (
            <div
              key={test.id}
              className="flex items-center gap-4 p-4 bg-white rounded-xl transition-all duration-200 hover:shadow-md"
              style={{ border: "1px solid #E5E7EB" }}
            >
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold truncate mb-1"
                  style={{ fontSize: 14, color: "#1F1344" }}
                >
                  {test.title}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-semibold"
                    style={{ background: PURPLE_LIGHT, color: PURPLE }}
                  >
                    {test.skill}
                  </span>
                  <div className="flex items-center gap-1">
                    {isUrgent ? (
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                    )}
                    <span
                      style={{
                        fontSize: 12,
                        color: isUrgent ? "#EF4444" : "#6B7280",
                        fontWeight: isUrgent ? 600 : 400,
                      }}
                    >
                      Còn {test.timeRemaining} phút
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${progressPercent}%`,
                      background: isUrgent
                        ? "#EF4444"
                        : `linear-gradient(90deg, ${PURPLE}, #A78BFA)`,
                    }}
                  />
                </div>
              </div>
              <Link
                to={`/lam-bai/${test.id}?submissionId=${test.submissionId}`}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90 flex-shrink-0"
                style={{ background: PURPLE }}
              >
                <Play className="w-4 h-4 fill-current" />
                Tiếp tục
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
