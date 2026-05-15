import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  Users, CheckCircle, BookOpen, Zap, TrendingUp, Activity,
  ChevronRight, RefreshCw,
} from "lucide-react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { api } from "../../../../services/api";

type Period = "24h" | "7d" | "30d";

interface Summary {
  total_sessions: number;
  exam_sessions: number;
  practice_sessions: number;
  completion_rate: number;
  avg_score: number | null;
  unique_students: number;
}
interface TimelinePoint { label: string; exam: number; practice: number; }
interface TopStudent { id: number; name: string; avatar: string; exam_count: number; practice_count: number; total: number; }
interface TopExam { id: number; title: string; type: string; purpose: string; attempts: number; completion_rate: number; }
interface StatsData {
  period: Period;
  summary: Summary;
  timeline: TimelinePoint[];
  top_students: TopStudent[];
  top_exams: TopExam[];
}

const PERIOD_LABELS: Record<Period, string> = { "24h": "24 giờ", "7d": "7 ngày", "30d": "30 ngày" };
const DONUT_COLORS = ["#6366F1", "#F59E0B"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name === "exam" ? "Thi chính thức" : "Luyện tập"}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export function RealtimeStats() {
  const [period, setPeriod]     = useState<Period>("7d");
  const [data, setData]         = useState<StatsData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [tick, setTick]         = useState(0);
  const [lastFetch, setLastFetch] = useState<Date>(new Date());
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = (p: Period) => {
    setLoading(true);
    api.get(`/teacher/dashboard/statistics?period=${p}`)
      .then((res: any) => {
        const d = res?.data?.data ?? res?.data;
        if (d) { setData(d); setLastFetch(new Date()); }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(period);
    pollRef.current = setInterval(() => fetchData(period), 30000);
    tickRef.current = setInterval(() => setTick(n => n + 1), 1000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [period]);

  const secAgo = Math.floor((Date.now() - lastFetch.getTime()) / 1000);
  const lastUpdateLabel = secAgo < 60 ? `${secAgo}s trước` : `${Math.floor(secAgo / 60)}m trước`;

  const s = data?.summary;
  const donutData = s ? [
    { name: "Thi chính thức", value: s.exam_sessions },
    { name: "Luyện tập", value: s.practice_sessions },
  ] : [];

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link to="/giao-vien/giam-sat-truc-tiep" className="hover:text-blue-600 transition-colors">
              Giám sát trực tiếp
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium">Thống kê</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Thống kê hoạt động</h1>
          <p className="text-sm text-gray-500 mt-0.5">Lượt thi, luyện tập, học viên trong {PERIOD_LABELS[period]}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period tabs */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            {(["24h", "7d", "30d"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  period === p
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
          {/* Last update */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Cập nhật {lastUpdateLabel}</span>
          </div>
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[
          { label: "Tổng lượt", value: s?.total_sessions ?? "—", icon: Activity, iconBg: "bg-blue-100", iconColor: "text-blue-600", valueBg: "text-blue-700" },
          { label: "Thi chính thức", value: s?.exam_sessions ?? "—", icon: BookOpen, iconBg: "bg-indigo-100", iconColor: "text-indigo-600", valueBg: "text-indigo-700" },
          { label: "Luyện tập", value: s?.practice_sessions ?? "—", icon: Zap, iconBg: "bg-amber-100", iconColor: "text-amber-600", valueBg: "text-amber-700" },
          { label: "Hoàn thành", value: s ? `${s.completion_rate}%` : "—", icon: CheckCircle, iconBg: "bg-green-100", iconColor: "text-green-600", valueBg: "text-green-700" },
          { label: "Điểm TB", value: s?.avg_score != null ? s.avg_score : "—", icon: TrendingUp, iconBg: "bg-purple-100", iconColor: "text-purple-600", valueBg: "text-purple-700" },
          { label: "Học viên", value: s?.unique_students ?? "—", icon: Users, iconBg: "bg-cyan-100", iconColor: "text-cyan-600", valueBg: "text-cyan-700" },
        ].map(({ label, value, icon: Icon, iconBg, iconColor, valueBg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
            <p className={`text-2xl font-bold ${valueBg}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

        {/* Area chart — 2/3 width */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4.5 h-4.5 text-indigo-500" />
            <h3 className="text-base font-bold text-gray-900">Lượt làm bài theo thời gian</h3>
          </div>
          {loading ? (
            <div className="h-[280px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data?.timeline ?? []} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="examGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="practiceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="label" tick={{ fill: "#9CA3AF", fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(v) => v === "exam" ? "Thi chính thức" : "Luyện tập"} wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="exam" stroke="#6366F1" strokeWidth={2.5} fill="url(#examGrad)" dot={false} activeDot={{ r: 4, fill: "#6366F1" }} />
                <Area type="monotone" dataKey="practice" stroke="#F59E0B" strokeWidth={2.5} fill="url(#practiceGrad)" dot={false} activeDot={{ r: 4, fill: "#F59E0B" }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Donut chart — 1/3 width */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <h3 className="text-base font-bold text-gray-900 mb-5">Phân loại lượt làm</h3>
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                    {donutData.map((_, i) => (
                      <Cell key={i} fill={DONUT_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v} lượt`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 mt-2 w-full">
                {donutData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block flex-shrink-0" style={{ background: DONUT_COLORS[i] }} />
                      <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Top tables row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Top students */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Users className="w-4.5 h-4.5 text-indigo-500" />
              <h3 className="text-base font-bold text-gray-900">Top học viên</h3>
            </div>
            <span className="text-xs text-gray-400">{PERIOD_LABELS[period]}</span>
          </div>
          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-400" />
            </div>
          ) : (data?.top_students?.length ?? 0) === 0 ? (
            <p className="text-center text-sm text-gray-400 py-10">Chưa có dữ liệu</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {(data?.top_students ?? []).map((student, idx) => (
                <Link key={student.id} to="/giao-vien/giam-sat-truc-tiep" className="flex items-center gap-3 px-6 py-3.5 hover:bg-indigo-50/60 transition-colors cursor-pointer">
                  <span className={`w-5 text-xs font-bold text-center flex-shrink-0 ${idx === 0 ? "text-amber-500" : idx === 1 ? "text-slate-400" : idx === 2 ? "text-orange-400" : "text-gray-300"}`}>
                    {idx + 1}
                  </span>
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {student.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{student.name}</p>
                    <div className="flex gap-3 mt-0.5">
                      <span className="text-[11px] text-indigo-600 font-medium">{student.exam_count} thi</span>
                      <span className="text-[11px] text-amber-600 font-medium">{student.practice_count} luyện tập</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
                        style={{ width: `${Math.min(100, (student.total / ((data?.top_students?.[0]?.total ?? 1) || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700 w-6 text-right">{student.total}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Top exams */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-indigo-500" />
              <h3 className="text-base font-bold text-gray-900">Top đề thi</h3>
            </div>
            <span className="text-xs text-gray-400">{PERIOD_LABELS[period]}</span>
          </div>
          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-400" />
            </div>
          ) : (data?.top_exams?.length ?? 0) === 0 ? (
            <p className="text-center text-sm text-gray-400 py-10">Chưa có dữ liệu</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {(data?.top_exams ?? []).map((exam, idx) => (
                <div key={exam.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50/60 transition-colors">
                  <span className={`w-5 text-xs font-bold text-center flex-shrink-0 ${idx === 0 ? "text-amber-500" : idx === 1 ? "text-slate-400" : idx === 2 ? "text-orange-400" : "text-gray-300"}`}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{exam.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${exam.type?.toUpperCase() === "VSTEP" ? "bg-indigo-100 text-indigo-700" : "bg-blue-100 text-blue-700"}`}>
                        {exam.type}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${exam.purpose === "practice" || exam.purpose === "review" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                        {exam.purpose === "practice" || exam.purpose === "review" ? "Luyện tập" : "Thi"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-sm font-bold text-gray-800">{exam.attempts} lượt</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${exam.completion_rate >= 70 ? "bg-green-400" : exam.completion_rate >= 40 ? "bg-amber-400" : "bg-red-400"}`}
                          style={{ width: `${exam.completion_rate}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-gray-500 font-medium w-8 text-right">{exam.completion_rate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
