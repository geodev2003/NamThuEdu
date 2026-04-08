import { Award, Gift, Sparkles, Lock, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { studentApi } from "../../../../services/studentApi";

const PURPLE = "#7C3AED";

type Reward = {
  id: string;
  title: string;
  desc: string;
  needXp: number;
  unlocked: boolean;
};

function rewardList(currentXp: number): Reward[] {
  const items = [
    { id: "badge-1", title: "Huy hiệu Khởi động", desc: "Hoàn thành 3 bài đầu tiên", needXp: 200 },
    { id: "badge-2", title: "Huy hiệu Chuyên cần", desc: "Streak 7 ngày liên tiếp", needXp: 700 },
    { id: "theme-1", title: "Giao diện Galaxy", desc: "Mở khóa theme đặc biệt", needXp: 1200 },
    { id: "avatar-1", title: "Avatar Premium", desc: "Bộ avatar giới hạn", needXp: 1800 },
    { id: "coupon-1", title: "Voucher 20%", desc: "Giảm giá khóa học nâng cao", needXp: 2500 },
  ];
  return items.map((it) => ({ ...it, unlocked: currentXp >= it.needXp }));
}

export function StudentRewards() {
  const { data, isLoading } = useQuery({
    queryKey: ["student", "progress", "rewards"],
    queryFn: () => studentApi.getProgress(),
  });

  const xp = Number((data as any)?.data?.data?.gamification?.xp ?? 1240);
  const rewards = rewardList(xp);

  if (isLoading) {
    return (
      <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="py-6 space-y-5">
      <div
        className="rounded-3xl p-6"
        style={{
          background: "linear-gradient(135deg, #F5F3FF 0%, #EEF2FF 100%)",
          border: "1.5px solid #E9D5FF",
        }}
      >
        <div className="flex items-center gap-3">
          <Gift className="w-7 h-7" style={{ color: PURPLE }} />
          <h1 className="text-2xl font-extrabold text-slate-800">Phần thưởng học tập</h1>
        </div>
        <p className="text-sm text-slate-500 mt-2">Tích lũy XP để mở khóa badge, giao diện và ưu đãi học tập.</p>
        <div className="mt-4 rounded-2xl bg-white p-4 border border-purple-100">
          <p className="text-xs text-slate-500">XP hiện tại</p>
          <p className="text-3xl font-black text-slate-800">{xp} XP</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="rounded-2xl p-4 bg-white"
            style={{
              border: reward.unlocked ? `1.5px solid ${PURPLE}55` : "1.5px solid #E5E7EB",
              boxShadow: reward.unlocked ? "0 8px 24px rgba(124,58,237,0.10)" : "none",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: reward.unlocked ? "#EDE9FE" : "#F3F4F6" }}
              >
                {reward.unlocked ? (
                  <Award className="w-5 h-5 text-purple-600" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800">{reward.title}</p>
                <p className="text-sm text-slate-500 mt-0.5">{reward.desc}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-700">
                    Cần {reward.needXp} XP
                  </span>
                  {reward.unlocked ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã mở khóa
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Chưa mở khóa
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

