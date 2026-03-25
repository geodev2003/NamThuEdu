import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Trophy,
  Clock,
  Eye,
  ChevronRight,
  SortAsc,
  BarChart2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { studentApi } from "../../../../services/studentApi";
import { formatDate } from "../../../../utils/formatters";
import { getSkillColor, getSkillName } from "../../../../utils/skillHelpers";

const PRIMARY = "#0EA5E9";
const PRIMARY_LIGHT = "#E0F2FE";

function getGrade(score: number) {
  if (score >= 80) return { label: "Đạt", color: "#10B981", bg: "#D1FAE5" };
  return { label: "Chưa đạt", color: "#EF4444", bg: "#FEE2E2" };
}

type SkillFilter = "all" | "listening" | "reading" | "writing" | "speaking";

export function TestHistory() {
  const [skillFilter, setSkillFilter] = useState<SkillFilter>("all");
  const [resultFilter, setResultFilter] = useState<"all" | "pass" | "fail">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["student", "submissions", "all"],
    queryFn: () => studentApi.getSubmissions({}),
  });

  const allSubmissions: any[] = (data as any)?.data?.data?.submissions ?? (data as any)?.data?.data ?? [];

  // Stats
  const totalTests = allSubmissions.length;
  const passedTests = allSubmissions.filter((s) => s.sScore >= 80).length;
  const avgScore = totalTests > 0 ? allSubmissions.reduce((sum, s) => sum + (s.sScore ?? 0), 0) / totalTests : 0;

  // Filter
  const filtered = allSubmissions.filter((s) => {
    if (skillFilter !== "all" && s.exam?.eSkill !== skillFilter) return false;
    if (resultFilter === "pass" && s.sScore < 80) return false;
    if (resultFilter === "fail" && s.sScore >= 80) return false;
    return true;
  });

  const skillFilters: { key: SkillFilter; label: string }[] = [
    { key: "all", label: "Tất cả" },
    { key: "listening", label: "Nghe" },
    { key: "reading", label: "Đọc" },
    { key: "writing", label: "Viết" },
    { key: "speaking", label: "Nói" },
  ];

  return (
    <div className="py-6 space-y-5">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1F1344" }}>Lịch sử bài thi</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>Tất cả bài thi đã nộp</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: BarChart2, label: "Tổng bài", value: totalTests, color: PRIMARY, bg: PRIMARY_LIGHT },
          { icon: CheckCircle, label: "Đã đạt", value: passedTests, color: "#10B981", bg: "#D1FAE5" },
          { icon: Trophy, label: "Điểm TB", value: avgScore.toFixed(1), color: "#F59E0B", bg: "#FEF3C7" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-4 bg-white text-center"
            style={{ border: "1.5px solid #F0EEFF" }}>
            <s.icon className="w-5 h-5 mx-auto mb-1" style={{ color: s.color }} />
            <p style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 11, color: "#9CA3AF" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Skill filter */}
        {skillFilters.map((f) => (
          <button key={f.key} onClick={() => setSkillFilter(f.key)}
            className="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: skillFilter === f.key ? PRIMARY : "#F3F4F6",
              color: skillFilter === f.key ? "#fff" : "#6B7280",
            }}>
            {f.label}
          </button>
        ))}
        <div className="w-px bg-gray-200 mx-1" />
        {/* Result filter */}
        {[
          { key: "all" as const, label: "Tất cả kết quả" },
          { key: "pass" as const, label: "✅ Đạt" },
          { key: "fail" as const, label: "❌ Chưa đạt" },
        ].map((f) => (
          <button key={f.key} onClick={() => setResultFilter(f.key)}
            className="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: resultFilter === f.key ? "#F3F4F6" : "transparent",
              color: resultFilter === f.key ? "#374151" : "#9CA3AF",
              border: `1px solid ${resultFilter === f.key ? "#E5E7EB" : "transparent"}`,
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Không có bài thi nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s: any) => {
            const grade = getGrade(s.sScore ?? 0);
            const skillColor = getSkillColor(s.exam?.eSkill);
            return (
              <Link key={s.sId} to={`/ket-qua/${s.sId}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white transition-all group cursor-pointer"
                style={{
                  border: "1.5px solid #F0EEFF",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${PRIMARY}40`;
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(14,165,233,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#F0EEFF";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";
                }}>
                {/* Score badge */}
                <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
                  style={{ background: grade.bg }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: grade.color, lineHeight: 1 }}>
                    {(s.sScore ?? 0).toFixed(0)}
                  </span>
                  <span style={{ fontSize: 9, color: grade.color, fontWeight: 600 }}>điểm</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate font-bold" style={{ fontSize: 14, color: "#1F1344" }}>
                    {s.exam?.eTitle ?? "Bài thi"}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded-lg text-xs font-semibold"
                      style={{ background: `${skillColor}18`, color: skillColor }}>
                      {getSkillName(s.exam?.eSkill)}
                    </span>
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                      <Clock className="w-3 h-3 inline mr-1" />
                      {formatDate(s.sSubmit_time)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: grade.bg, color: grade.color }}>
                      {grade.label}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1"
                  style={{ color: "#D1D5DB" }} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
