import { Link } from "react-router";
import { Sparkles, Play, Clock, FileQuestion } from "lucide-react";
import { getSkillColor, getSkillIcon } from "../../../../utils/skillHelpers";

const PURPLE = "#7C3AED";

interface Recommendation {
  id: number;
  title: string;
  reason: string;
  skill: string;
  duration: number;
  questionCount: number;
  difficulty: "easy" | "medium" | "hard";
  link: string;
}

interface PracticeRecommendationsProps {
  recommendations: Recommendation[];
  isLoading?: boolean;
}

export function PracticeRecommendations({
  recommendations,
  isLoading,
}: PracticeRecommendationsProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-50 to-purple-50 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-white rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return { bg: "#D1FAE5", text: "#065F46" };
      case "medium":
        return { bg: "#DBEAFE", text: "#1E40AF" };
      case "hard":
        return { bg: "#FEE2E2", text: "#991B1B" };
      default:
        return { bg: "#F3F4F6", text: "#374151" };
    }
  };

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "#EDE9FE" }}
        >
          <Sparkles className="w-4 h-4" style={{ color: PURPLE }} />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1F1344" }}>
          Gợi ý luyện tập cho bạn
        </h3>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => {
          const skillColor = getSkillColor(rec.skill);
          const SkillIcon = getSkillIcon(rec.skill);
          const diffColor = getDifficultyColor(rec.difficulty);

          return (
            <div
              key={rec.id}
              className="p-4 bg-white rounded-xl transition-all duration-200 hover:shadow-md"
              style={{ border: "1px solid #E5E7EB" }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold mb-1"
                    style={{ fontSize: 14, color: "#1F1344" }}
                  >
                    {rec.title}
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "#6B7280" }}
                  >
                    {rec.reason}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 ml-3 flex-shrink-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${skillColor}15` }}
                  >
                    <SkillIcon className="w-4 h-4" style={{ color: skillColor }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" style={{ color: "#9CA3AF" }} />
                    <span style={{ color: "#6B7280" }}>{rec.duration} phút</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileQuestion className="w-3 h-3" style={{ color: "#9CA3AF" }} />
                    <span style={{ color: "#6B7280" }}>{rec.questionCount} câu</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-semibold"
                    style={{ background: diffColor.bg, color: diffColor.text }}
                  >
                    {rec.difficulty}
                  </span>
                </div>
                <Link
                  to={rec.link}
                  className="flex items-center gap-1 text-sm font-bold transition-opacity hover:opacity-80"
                  style={{ color: PURPLE }}
                >
                  Bắt đầu
                  <Play className="w-3.5 h-3.5 fill-current" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
