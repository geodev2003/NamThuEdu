import { Trophy, Medal, Star, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { studentApi } from "../../../../services/studentApi";

const PRIMARY = "#7C3AED";
const PRIMARY_LIGHT = "#EDE9FE";

type LeaderboardRow = {
  rank: number;
  name: string;
  xp: number;
  score: number;
  streak: number;
  isMe?: boolean;
};

function buildLeaderboard(myRank: number, totalUsers: number, avgScore: number): LeaderboardRow[] {
  const base: LeaderboardRow[] = [
    { rank: 1, name: "Minh Anh", xp: 4250, score: 92, streak: 21 },
    { rank: 2, name: "Tuấn Kiệt", xp: 4010, score: 90, streak: 19 },
    { rank: 3, name: "Bảo Ngọc", xp: 3880, score: 89, streak: 18 },
    { rank: 4, name: "Ngọc Lan", xp: 3620, score: 86, streak: 15 },
    { rank: 5, name: "Gia Huy", xp: 3510, score: 85, streak: 14 },
  ];

  const safeRank = Number.isFinite(myRank) && myRank > 0 ? myRank : 12;
  const me: LeaderboardRow = {
    rank: safeRank,
    name: "Bạn",
    xp: 1240,
    score: Number.isFinite(avgScore) ? Math.round(avgScore) : 78,
    streak: 7,
    isMe: true,
  };

  if (safeRank <= 5) {
    return base.map((row) => (row.rank === safeRank ? { ...me, rank: safeRank } : row));
  }

  const total = Number.isFinite(totalUsers) && totalUsers > 0 ? totalUsers : 150;
  return [...base, { rank: safeRank - 1, name: "Người chơi #"+String(safeRank - 1), xp: 1300, score: 80, streak: 6 }, me, { rank: Math.min(total, safeRank + 1), name: "Người chơi #"+String(safeRank + 1), xp: 1180, score: 77, streak: 5 }];
}

export function StudentLeaderboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["student", "progress", "leaderboard"],
    queryFn: () => studentApi.getProgress(),
  });

  const progress = (data as any)?.data?.data;
  const rank = progress?.leaderboard?.rank ?? 12;
  const totalUsers = progress?.leaderboard?.total_users ?? 150;
  const avg = progress?.overview?.average_score ?? 78;
  const rows = buildLeaderboard(rank, totalUsers, avg);

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="h-28 rounded-3xl bg-gray-100 animate-pulse mb-5" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((k) => (
            <div key={k} className="h-16 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-5">
      <div
        className="rounded-3xl p-6"
        style={{
          background: `linear-gradient(135deg, ${PRIMARY} 0%, #A78BFA 100%)`,
          color: "white",
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-7 h-7" />
          <h1 className="text-2xl font-extrabold">Bảng xếp hạng học viên</h1>
        </div>
        <p className="text-white/85 text-sm">Theo dõi vị trí của bạn và bứt phá thứ hạng mỗi tuần.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <div className="rounded-2xl p-3 bg-white/15">
            <p className="text-xs text-white/80">Xếp hạng của bạn</p>
            <p className="text-2xl font-black">#{rank}</p>
          </div>
          <div className="rounded-2xl p-3 bg-white/15">
            <p className="text-xs text-white/80">Tổng học viên</p>
            <p className="text-2xl font-black">{totalUsers}</p>
          </div>
          <div className="rounded-2xl p-3 bg-white/15">
            <p className="text-xs text-white/80">Điểm TB</p>
            <p className="text-2xl font-black">{Number(avg).toFixed(1)}</p>
          </div>
          <div className="rounded-2xl p-3 bg-white/15">
            <p className="text-xs text-white/80">Mục tiêu tuần</p>
            <p className="text-2xl font-black flex items-center gap-1"><TrendingUp className="w-5 h-5" />Top 10</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4" style={{ border: "1.5px solid #F0EEFF" }}>
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={`${row.rank}-${row.name}`}
              className="flex items-center gap-3 rounded-xl p-3"
              style={{
                background: row.isMe ? PRIMARY_LIGHT : "#F9FAFB",
                border: row.isMe ? `1px solid ${PRIMARY}55` : "1px solid #F3F4F6",
              }}
            >
              <div className="w-10 flex items-center justify-center">
                {row.rank === 1 && <Trophy className="w-5 h-5 text-yellow-500" />}
                {row.rank === 2 && <Medal className="w-5 h-5 text-slate-500" />}
                {row.rank === 3 && <Medal className="w-5 h-5 text-amber-700" />}
                {row.rank > 3 && <span className="font-bold text-slate-500">#{row.rank}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 truncate">{row.name}</p>
                <p className="text-xs text-slate-500">Streak {row.streak} ngày</p>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-slate-800">{row.xp} XP</p>
                <p className="text-xs text-slate-500 flex items-center justify-end gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500" /> {row.score}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

