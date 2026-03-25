import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  Target,
  Star,
  Award,
  BarChart2,
} from "lucide-react";
import { studentApi } from "../../../../services/studentApi";
import { getSkillColor } from "../../../../utils/skillHelpers";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const PRIMARY = "#0EA5E9";
const PRIMARY_LIGHT = "#E0F2FE";
const CYAN = "#06B6D4";

const masteryLabel: Record<string, { label: string; color: string; bg: string }> = {
  expert: { label: "Thành thạo", color: "#10B981", bg: "#D1FAE5" },
  advanced: { label: "Nâng cao", color: PRIMARY, bg: PRIMARY_LIGHT },
  intermediate: { label: "Trung cấp", color: "#F59E0B", bg: "#FEF3C7" },
  beginner: { label: "Cơ bản", color: "#EF4444", bg: "#FEE2E2" },
};

export function Progress() {
  const { data, isLoading } = useQuery({
    queryKey: ["student", "progress"],
    queryFn: () => studentApi.getProgress(),
  });

  const progress = (data as any)?.data?.data;
  const overview = progress?.overview ?? {};
  const skillsBreakdown = progress?.skill_analysis?.skills_breakdown ?? [];
  const recentScores = progress?.trends?.recent_scores ?? [];

  const chartData = recentScores.slice(-10).map((s: any, i: number) => ({
    week: `T${i + 1}`,
    score: s.score ?? 0,
    skill: s.exam_skill,
  }));

  const radarData = skillsBreakdown.map((s: any) => ({
    skill: s.skill_name ?? s.skill,
    score: s.average_score ?? 0,
  }));

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 rounded-full animate-spin"
          style={{ borderColor: PRIMARY_LIGHT, borderTopColor: PRIMARY }} />
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1F1344" }}>Tiến độ học tập</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>Phân tích kết quả và kỹ năng của bạn</p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Tổng bài thi", value: overview.total_tests ?? 0, icon: BarChart2, color: PRIMARY, bg: PRIMARY_LIGHT },
          { label: "Điểm trung bình", value: (overview.average_score ?? 0).toFixed(1), icon: TrendingUp, color: "#2563EB", bg: "#DBEAFE" },
          { label: "Điểm cao nhất", value: (overview.highest_score ?? 0).toFixed(1), icon: Star, color: "#10B981", bg: "#D1FAE5" },
          { label: "Điểm gần nhất", value: (overview.recent_score ?? 0).toFixed(1), icon: Award, color: "#F59E0B", bg: "#FEF3C7" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl p-4 bg-white"
            style={{ border: "1.5px solid #F0EEFF", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
              style={{ background: card.bg }}>
              <card.icon className="w-4 h-4" style={{ color: card.color }} />
            </div>
            <p style={{ fontSize: 24, fontWeight: 900, color: "#1F1344", lineHeight: 1 }}>{card.value}</p>
            <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Trend Chart — col 7 */}
        <div className="lg:col-span-7 rounded-2xl p-5 bg-white"
          style={{ border: "1.5px solid #F0EEFF" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: PRIMARY_LIGHT }}>
              <TrendingUp className="w-4 h-4" style={{ color: PRIMARY }} />
            </div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1F1344" }}>Điểm theo thời gian</h2>
          </div>
          {chartData.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">Chưa có dữ liệu</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${PRIMARY}30`, fontSize: 12 }} />
                <Area type="monotone" dataKey="score" stroke={PRIMARY} strokeWidth={2.5}
                  fill="url(#progressGrad)"
                  dot={{ fill: PRIMARY, r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Radar Chart — col 5 */}
        <div className="lg:col-span-5 rounded-2xl p-5 bg-white"
          style={{ border: "1.5px solid #F0EEFF" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: PRIMARY_LIGHT }}>
              <Target className="w-4 h-4" style={{ color: PRIMARY }} />
            </div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1F1344" }}>Radar kỹ năng</h2>
          </div>
          {radarData.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">Chưa có dữ liệu</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#EDE9FE" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Radar name="Điểm" dataKey="score" stroke={PRIMARY} fill={PRIMARY} fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Skill Breakdown */}
      {skillsBreakdown.length > 0 && (
        <div className="rounded-2xl p-5 bg-white" style={{ border: "1.5px solid #F0EEFF" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1F1344", marginBottom: 16 }}>
            Chi tiết kỹ năng
          </h2>
          <div className="space-y-4">
            {skillsBreakdown.map((s: any) => {
              const color = getSkillColor(s.skill);
              const mastery = masteryLabel[s.mastery_level ?? "beginner"] ?? masteryLabel.beginner;
              return (
                <div key={s.skill}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#1F1344" }}>
                        {s.skill_name ?? s.skill}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: mastery.bg, color: mastery.color }}>
                        {mastery.label}
                      </span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 800, color }}>
                      {(s.average_score ?? 0).toFixed(1)}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#F3F4F6" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${s.average_score ?? 0}%`, background: `linear-gradient(90deg, ${color}, ${color}BB)` }} />
                  </div>
                  <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
                    {s.count ?? 0} bài · Cao nhất: {(s.highest_score ?? 0).toFixed(1)} · Thấp nhất: {(s.lowest_score ?? 0).toFixed(1)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
