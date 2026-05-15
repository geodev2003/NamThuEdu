import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { api } from "../../../../services/api";
import {
  Users,
  Activity,
  TrendingUp,
  Clock,
  Search,
  ChevronDown,
  Eye,
  Grid3x3,
  List,
  CheckCircle2,
} from "lucide-react";
import { Header } from "../../../components/shared/Header";

interface Session {
  id: number;
  student: { id: number | null; name: string; avatar: string };
  exam: { id: number | null; title: string; type: string };
  class_name: string | null;
  started_at: string;
  elapsed_min: number;
  remaining_min: number | null;
  answered: number;
  total: number;
  progress_pct: number;
}

interface MonitoringStats {
  active_now: number;
  total_today: number;
  completion_rate: number;
  connected: number;
}

export function LiveMonitoring() {
  const { t } = useTranslation();
  const [viewMode, setViewMode]     = useState<"grid" | "list">("list");
  const [filterExam, setFilterExam] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sessions, setSessions]     = useState<Session[]>([]);
  const [stats, setStats]           = useState<MonitoringStats>({ active_now: 0, total_today: 0, completion_rate: 0, connected: 0 });
  const [loading, setLoading]       = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [tick, setTick]             = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSessions = () => {
    api.get("/teacher/dashboard/active-sessions")
      .then((res: any) => {
        const d = res?.data?.data ?? res?.data ?? [];
        setSessions(Array.isArray(d) ? d : []);
        setLastUpdate(new Date());
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const fetchStats = () => {
    api.get("/teacher/dashboard/monitoring-stats")
      .then((res: any) => {
        const d = res?.data?.data ?? res?.data;
        if (d) setStats(d);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchSessions();
    fetchStats();
    pollRef.current = setInterval(() => {
      fetchSessions();
      fetchStats();
    }, 10000);
    tickRef.current = setInterval(() => setTick((n) => n + 1), 1000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  const filteredSessions = sessions.filter((s) => {
    const matchSearch = !searchQuery || s.student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchExam   = !filterExam  || String(s.exam.id) === filterExam;
    return matchSearch && matchExam;
  });

  const uniqueExams = Array.from(new Map(sessions.map((s) => [s.exam.id, s.exam])).values());

  const fmtElapsed = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const fmtRemaining = (min: number | null) => {
    if (min === null) return "—";
    if (min <= 0) return "Hết giờ";
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header breadcrumb={[t("breadcrumb.dashboard"), t("breadcrumb.liveMonitoring")]} />

      <div className="flex-1 overflow-y-auto" style={{ background: "#EEEEF3" }}>
        <div className="px-8 py-6 space-y-6">

          {/* Live Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-700 font-bold text-sm">LIVE</span>
              </div>
              <span className="text-sm text-slate-500" key={tick}>
                Cập nhật {Math.floor((Date.now() - lastUpdate.getTime()) / 1000)}s trước
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              </div>
              <p className="text-gray-500 text-xs mb-1">Học sinh đang thi</p>
              <p className="text-3xl font-bold text-gray-900">{stats.active_now}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-500 text-xs mb-1">Tổng phiên hôm nay</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total_today}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-gray-500 text-xs mb-1">Tỉ lệ hoàn thành TB</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completion_rate}%</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-slate-500" />
                </div>
              </div>
              <p className="text-gray-500 text-xs mb-1">Vẫn đang kết nối</p>
              <p className="text-3xl font-bold text-gray-900">{stats.connected}</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm học sinh..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative min-w-44">
                <select
                  value={filterExam}
                  onChange={(e) => setFilterExam(e.target.value)}
                  className="w-full pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Tất cả đề thi</option>
                  {uniqueExams.map((e) => (
                    <option key={e.id} value={String(e.id)}>{e.title}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-semibold">Không có học sinh nào đang thi</p>
              <p className="text-sm text-gray-400 mt-1">Dữ liệu tự động cập nhật mỗi 10 giây</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions.map((s) => {
                const isLowTime = s.remaining_min !== null && s.remaining_min <= 10;
                return (
                  <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {s.student.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{s.student.name}</p>
                        {s.class_name && (
                          <p className="text-xs text-gray-500 truncate">{s.class_name}</p>
                        )}
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        s.exam.type?.toUpperCase() === "VSTEP"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {s.exam.type}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-gray-700 truncate mb-3">{s.exam.title}</p>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="p-2.5 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-0.5">Đã thi</p>
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {fmtElapsed(s.elapsed_min)}
                        </p>
                      </div>
                      <div className={`p-2.5 rounded-lg ${isLowTime ? "bg-red-50" : "bg-gray-50"}`}>
                        <p className="text-xs text-gray-500 mb-0.5">Còn lại</p>
                        <p className={`text-sm font-bold ${isLowTime ? "text-red-600" : "text-gray-900"}`}>
                          {fmtRemaining(s.remaining_min)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-gray-500">Tiến độ</span>
                        <span className="text-xs font-bold text-blue-600">{s.answered}/{s.total} câu</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                          style={{ width: `${s.progress_pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <button
                        disabled
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-50 text-gray-300 rounded-lg text-sm font-semibold cursor-not-allowed border border-gray-100"
                      >
                        <Eye className="w-4 h-4" />
                        Đang làm bài…
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Column headers */}
              <div className="grid grid-cols-[minmax(0,1fr)_100px_100px_200px_44px] gap-0 px-5 py-3 bg-gray-50 border-b border-gray-100">
                {["Học sinh / Đề thi", "Đã thi", "Còn lại", "Tiến độ", ""].map((h) => (
                  <span key={h} className="text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</span>
                ))}
              </div>

              {/* Grouped by student */}
              {(() => {
                const grouped = filteredSessions.reduce<Record<number, Session[]>>((acc, s) => {
                  const key = s.student.id ?? 0;
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(s);
                  return acc;
                }, {});

                return Object.entries(grouped).map(([studentIdStr, studentSessions]) => {
                  const first   = studentSessions[0];
                  const hasNew  = studentSessions.some((s) => s.elapsed_min < 3);
                  return (
                    <div key={studentIdStr} className="border-b border-gray-100 last:border-0">
                      {/* Student header */}
                      <div className={`flex items-center gap-3 px-5 py-3 ${hasNew ? "bg-green-50/50" : "bg-slate-50/40"}`}>
                        <div className="relative flex-shrink-0">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {first.student.avatar}
                          </div>
                          {hasNew && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-gray-900 text-sm">{first.student.name}</span>
                          {first.class_name && (
                            <span className="ml-2 text-xs text-gray-400">{first.class_name}</span>
                          )}
                          {hasNew && (
                            <span className="ml-2 text-xs font-semibold text-green-600">● Vừa vào thi</span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-medium">
                          {studentSessions.length} phiên đang chạy
                        </span>
                      </div>

                      {/* Session rows */}
                      {[...studentSessions].sort((a, b) => a.elapsed_min - b.elapsed_min).map((s, idx) => {
                        const isLowTime = s.remaining_min !== null && s.remaining_min <= 10;
                        const isNew     = s.elapsed_min < 3;
                        const isActive  = idx === 0;
                        return (
                          <div
                            key={s.id}
                            className={`grid grid-cols-[minmax(0,1fr)_100px_100px_200px_44px] items-center gap-0 pl-16 pr-5 py-3.5 border-t border-gray-200 transition-all ${
                              isNew    ? "bg-green-50/40" :
                              isActive ? "bg-blue-50/30" :
                                         "bg-gray-50/30 opacity-75"
                            }`}
                          >
                            {/* Exam name + status badges */}
                            <div className="min-w-0 pr-4">
                              <div className="flex items-center gap-1.5 mb-1">
                                {isActive ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 flex-shrink-0">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    Đang làm
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-400 flex-shrink-0">
                                    Gần nhất
                                  </span>
                                )}
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                                  s.exam.type?.toUpperCase() === "VSTEP" ? "bg-indigo-100 text-indigo-700" : "bg-blue-100 text-blue-700"
                                }`}>
                                  {s.exam.type}
                                </span>
                              </div>
                              <p className={`text-sm truncate ${isActive ? "font-semibold text-gray-900" : "font-medium text-gray-500"}`}>
                                {s.exam.title}
                              </p>
                            </div>

                            {/* Elapsed */}
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <span className="text-sm font-semibold text-gray-700">{fmtElapsed(s.elapsed_min)}</span>
                            </div>

                            {/* Remaining */}
                            <div>
                              <span className={`text-sm font-bold ${isLowTime ? "text-red-600" : "text-gray-700"}`}>
                                {fmtRemaining(s.remaining_min)}
                              </span>
                              {isLowTime && <p className="text-[10px] text-red-400 font-semibold leading-none mt-0.5">Sắp hết giờ</p>}
                            </div>

                            {/* Progress */}
                            <div className="flex items-center gap-2 pr-2">
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    s.progress_pct >= 80 ? "bg-green-500" :
                                    s.progress_pct >= 40 ? "bg-blue-500" : "bg-blue-300"
                                  }`}
                                  style={{ width: `${s.progress_pct}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-slate-500 whitespace-nowrap w-12 text-right">
                                {s.answered}/{s.total}
                              </span>
                            </div>

                            {/* Action — disabled while in progress */}
                            <div className="relative group">
                              <button
                                disabled
                                className="w-8 h-8 bg-gray-50 border border-gray-200 text-gray-300 rounded-lg inline-flex items-center justify-center cursor-not-allowed"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 hidden group-hover:block z-10 pointer-events-none">
                                <div className="bg-gray-800 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                                  Học viên đang làm bài
                                  <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-800" />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
