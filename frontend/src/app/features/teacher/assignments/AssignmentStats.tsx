import { useState, useEffect, useCallback } from "react";
import { getAuthToken } from '../../../../utils/authStorage';
import { Link } from "react-router";
import {
  BarChart3, Calendar, AlertCircle, TrendingUp, Plus, Eye,
  Users, Target, Loader2, Bell, X, CheckCircle2, Search,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart,
} from "recharts";

interface AssignmentItem {
  id: number;
  exam_title: string;
  exam_type: string | null;
  target_type: 'class' | 'student';
  target_name: string;
  deadline: string | null;
  is_overdue: boolean;
  student_count: number;
  submitted_count: number;
  completion_rate: number;
  avg_score: number | null;
  created_at: string;
}
interface Overview {
  total_assignments: number;
  avg_completion_rate: number;
  overdue_count: number;
  this_week_count: number;
  total_students: number;
  total_submitted: number;
  class_assignments: number;
  student_assignments: number;
}
interface AgeGroupStat {
  name: string;
  key: string;
  not_submitted: number;
}
interface TrendPoint { date: string; count: number; rate: number; }
interface StatsData {
  overview: Overview;
  by_month: { month: string; count: number }[];
  submission_trends: TrendPoint[];
  by_target_type: { class: number; student: number };
  by_age_group: AgeGroupStat[];
  assignments_list: AssignmentItem[];
}
interface StudentProgress {
  uId: number;
  uName: string;
  submission?: {
    sId: number;
    sScore: number | null;
    sStatus: string;
    sSubmit_time: string;
    sAttempt: number;
  };
}
interface ProgressDetail {
  assignment: { taId: number; exam: { eTitle: string; eType: string } };
  completed: StudentProgress[];
  not_completed: StudentProgress[];
  stats: {
    total_students: number;
    completed_count: number;
    completion_rate: number;
    is_overdue: boolean;
  };
}

type FilterType = 'all' | 'active' | 'overdue' | 'this_week';

export function AssignmentStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [panelId, setPanelId] = useState<number | null>(null);
  const [panelData, setPanelData] = useState<ProgressDetail | null>(null);
  const [panelLoading, setPanelLoading] = useState(false);
  const [reminderLoading, setReminderLoading] = useState<number | null>(null);
  const [reminderSent, setReminderSent] = useState<Set<number>>(new Set());
  const [trendRange, setTrendRange] = useState<'7d' | '30d'>('7d');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/teacher/assignments/statistics`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      if (result.status === 'success') {
        setStats(result.data);
      } else {
        setError('Không thể tải dữ liệu thống kê.');
      }
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const openPanel = async (id: number) => {
    setPanelId(id);
    setPanelData(null);
    setPanelLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/teacher/assignments/${id}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.status === 'success') setPanelData(result.data);
    } catch { /* ignore */ } finally {
      setPanelLoading(false);
    }
  };

  const sendReminder = async (id: number) => {
    setReminderLoading(id);
    try {
      const token = getAuthToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/teacher/assignments/${id}/reminders`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setReminderSent(prev => new Set([...prev, id]));
        setTimeout(() => setReminderSent(prev => { const n = new Set(prev); n.delete(id); return n; }), 3000);
      }
    } catch { /* ignore */ } finally {
      setReminderLoading(null);
    }
  };

  const filteredList = (stats?.assignments_list ?? []).filter(a => {
    const matchSearch = !search ||
      a.exam_title.toLowerCase().includes(search.toLowerCase()) ||
      a.target_name.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === 'overdue') return a.is_overdue;
    if (filter === 'active') return !a.is_overdue && a.completion_rate < 100;
    if (filter === 'this_week') {
      const created = new Date(a.created_at);
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return created >= startOfWeek;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 border border-red-100 shadow-sm">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-slate-700 font-semibold mb-1">Lỗi khi tải dữ liệu</p>
          <p className="text-slate-400 text-sm mb-4">{error}</p>
          <button onClick={fetchStats} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const kpiCards = [
    { label: 'Tổng bài tập', value: stats.overview.total_assignments, icon: BarChart3, colorKey: 'indigo', sub: `${stats.overview.class_assignments} lớp • ${stats.overview.student_assignments} cá nhân` },
    { label: 'Tỉ lệ nộp TB', value: `${stats.overview.avg_completion_rate}%`, icon: TrendingUp, colorKey: 'green', sub: `${stats.overview.total_submitted}/${stats.overview.total_students} học sinh` },
    { label: 'Quá hạn', value: stats.overview.overdue_count, icon: AlertCircle, colorKey: 'red', sub: 'cần chú ý' },
    { label: 'Tuần này', value: stats.overview.this_week_count, icon: Calendar, colorKey: 'orange', sub: 'bài tập mới' },
  ];

  const colorMap: Record<string, { bg: string; icon: string; val: string }> = {
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', val: 'text-indigo-700' },
    green:  { bg: 'bg-emerald-50', icon: 'text-emerald-600', val: 'text-emerald-700' },
    red:    { bg: 'bg-red-50', icon: 'text-red-500', val: 'text-red-600' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-500', val: 'text-orange-600' },
  };

  const PIE_COLORS = ['#4F46E5', '#94A3B8'];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 px-6">
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Thống kê bài tập</h1>
            <p className="text-sm text-slate-500 mt-0.5">Tổng quan hiệu suất giao bài và nộp bài của học sinh</p>
          </div>
          <Link
            to="/giao-vien/bai-tap/giao-moi"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#4F46E5,#4338CA)' }}
          >
            <Plus className="w-4 h-4" />
            Giao bài mới
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card, i) => {
            const c = colorMap[card.colorKey];
            return (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all">
                <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
                  <card.icon className={`w-4.5 h-4.5 ${c.icon}`} style={{ width: 18, height: 18 }} />
                </div>
                <p className={`text-2xl font-bold ${c.val}`}>{card.value}</p>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">{card.label}</p>
                <p className="text-[11px] text-slate-400 mt-1">{card.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                Tỷ lệ nộp bài theo ngày
              </p>
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                {(['7d', '30d'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setTrendRange(r)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      trendRange === r ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {r === '7d' ? '7 ngày' : '30 ngày'}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart
                data={(stats.submission_trends ?? []).slice(trendRange === '7d' ? -7 : -30)}
                margin={{ top: 4, right: 4, bottom: 0, left: -10 }}
              >
                <defs>
                  <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} interval={trendRange === '7d' ? 0 : 4} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" domain={[0, 'auto']} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 12 }}
                  formatter={(val: number, name: string) => name === 'rate' ? [`${val}%`, 'Tỷ lệ nộp'] : [val, 'Số bài']}
                />
                <Area type="monotone" dataKey="rate" stroke="#4F46E5" strokeWidth={2} fill="url(#rateGrad)" dot={false} activeDot={{ r: 4, fill: '#4F46E5' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              Học viên chưa nộp theo độ tuổi
            </p>
            <p className="text-[11px] text-slate-400 mb-2">Tổng số lượt chưa nộp bài</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={(stats.by_age_group ?? []).map(g => ({ name: g.name, value: g.not_submitted }))}
                  cx="50%" cy="50%" innerRadius={48} outerRadius={72}
                  paddingAngle={3} dataKey="value"
                >
                  <Cell fill="#A78BFA" />
                  <Cell fill="#F59E0B" />
                  <Cell fill="#4F46E5" />
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
                  formatter={(value: number) => [`${value} học viên`, 'Chưa nộp']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 mt-2">
              {[
                { label: 'Kids',   color: 'bg-violet-400' },
                { label: 'Teens',  color: 'bg-amber-400' },
                { label: 'Adults', color: 'bg-indigo-600' },
              ].map((item, i) => {
                const g = stats.by_age_group?.[i];
                return (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-sm inline-block ${item.color}`} />
                      <span className="text-xs text-slate-600">{item.label}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{g?.not_submitted ?? 0} chưa nộp</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Filter + Search Bar */}
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              {([
                { key: 'all', label: 'Tất cả' },
                { key: 'active', label: 'Hoạt động' },
                { key: 'overdue', label: 'Quá hạn' },
                { key: 'this_week', label: 'Tuần này' },
              ] as { key: FilterType; label: string }[]).map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === f.key
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-700'
                  }`}
                >
                  {f.label}
                  {f.key === 'overdue' && stats.overview.overdue_count > 0 && (
                    <span className="ml-1.5 bg-red-500 text-white text-[9px] px-1 py-0.5 rounded-full">
                      {stats.overview.overdue_count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm đề thi, lớp..."
                className="text-xs bg-transparent outline-none text-slate-700 w-40 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/60 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Đề thi</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Đối tượng</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Deadline</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Nộp bài</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Tỉ lệ</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Điểm TB</th>
                  <th className="text-right px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-14 text-slate-400 text-sm">
                      Không tìm thấy bài tập nào
                    </td>
                  </tr>
                ) : (
                  filteredList.map(a => (
                    <tr key={a.id} className="hover:bg-indigo-50/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-800 text-[13px] truncate max-w-[200px]">{a.exam_title}</p>
                        {a.exam_type && (
                          <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-semibold mt-0.5 inline-block">
                            {a.exam_type}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {a.target_type === 'class'
                            ? <Users className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                            : <Target className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          }
                          <span className="text-[13px] text-slate-600 truncate max-w-[120px]">{a.target_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {a.deadline ? (
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            a.is_overdue ? 'bg-red-100 text-red-600' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {a.is_overdue ? '⚠ ' : ''}{new Date(a.deadline).toLocaleDateString('vi-VN')}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-[13px] text-slate-700 font-medium">{a.submitted_count}/{a.student_count}</p>
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full mt-1.5">
                          <div
                            className="h-1.5 rounded-full bg-indigo-500 transition-all"
                            style={{ width: `${Math.min(a.completion_rate, 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          a.completion_rate >= 80
                            ? 'bg-emerald-100 text-emerald-700'
                            : a.completion_rate >= 50
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-600'
                        }`}>
                          {a.completion_rate}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[13px] text-slate-700 font-medium">
                          {a.avg_score != null ? Number(a.avg_score).toFixed(1) : '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openPanel(a.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Chi tiết
                          </button>
                          {a.submitted_count < a.student_count && (
                            <button
                              onClick={() => sendReminder(a.id)}
                              disabled={reminderLoading === a.id}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors disabled:opacity-50 ${
                                reminderSent.has(a.id)
                                  ? 'text-emerald-600 bg-emerald-50'
                                  : 'text-orange-600 hover:bg-orange-50'
                              }`}
                            >
                              {reminderLoading === a.id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : reminderSent.has(a.id)
                                  ? <CheckCircle2 className="w-3.5 h-3.5" />
                                  : <Bell className="w-3.5 h-3.5" />
                              }
                              {reminderSent.has(a.id) ? 'Đã gửi' : 'Nhắc'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-out Detail Panel */}
      {panelId !== null && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => { setPanelId(null); setPanelData(null); }} />
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col">
            <div
              className="flex items-start justify-between px-5 py-4 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#4F46E5,#4338CA)' }}
            >
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-white font-semibold text-sm leading-tight truncate">
                  {panelData?.assignment.exam.eTitle ?? 'Chi tiết bài tập'}
                </p>
                <p className="text-indigo-200 text-[11px] mt-0.5">
                  {panelData
                    ? `${panelData.stats.completed_count}/${panelData.stats.total_students} học sinh đã nộp • ${panelData.stats.completion_rate}%`
                    : 'Đang tải...'}
                </p>
              </div>
              <button
                onClick={() => { setPanelId(null); setPanelData(null); }}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {panelLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
              </div>
            ) : panelData ? (
              <div className="flex-1 overflow-y-auto">
                {/* Stats row */}
                <div className="grid grid-cols-3 divide-x divide-indigo-100 bg-indigo-50/50 border-b border-indigo-100">
                  {[
                    { label: 'Tỉ lệ nộp', value: `${panelData.stats.completion_rate}%`, color: 'text-indigo-700' },
                    { label: 'Đã nộp', value: panelData.stats.completed_count, color: 'text-emerald-600' },
                    { label: 'Chưa nộp', value: panelData.stats.total_students - panelData.stats.completed_count, color: 'text-slate-600' },
                  ].map((s, i) => (
                    <div key={i} className="text-center py-3">
                      <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Reminder button */}
                {panelData.stats.completed_count < panelData.stats.total_students && (
                  <div className="px-4 py-3 border-b border-gray-100">
                    <button
                      onClick={() => sendReminder(panelId)}
                      disabled={reminderLoading === panelId}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${
                        reminderSent.has(panelId)
                          ? 'bg-emerald-500 text-white'
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}
                    >
                      {reminderLoading === panelId
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : reminderSent.has(panelId)
                          ? <CheckCircle2 className="w-4 h-4" />
                          : <Bell className="w-4 h-4" />
                      }
                      {reminderSent.has(panelId)
                        ? 'Đã gửi nhắc nhở!'
                        : `Gửi nhắc nhở (${panelData.stats.total_students - panelData.stats.completed_count} HS chưa nộp)`}
                    </button>
                  </div>
                )}

                {/* Completed list */}
                {panelData.completed.length > 0 && (
                  <div className="px-4 pt-4 pb-2">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Đã nộp ({panelData.completed.length})
                    </p>
                    <div className="space-y-1.5">
                      {panelData.completed.map(s => (
                        <div key={s.uId} className="flex items-center justify-between py-2 px-3 bg-emerald-50 rounded-lg">
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium text-slate-700 truncate">{s.uName}</p>
                            <p className="text-[10px] text-slate-400">
                              {s.submission?.sSubmit_time
                                ? new Date(s.submission.sSubmit_time).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
                                : ''}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            {s.submission?.sScore != null
                              ? <span className="text-sm font-bold text-emerald-600">{Number(s.submission.sScore).toFixed(1)}</span>
                              : <span className="text-[11px] text-amber-500 font-medium">Chưa chấm</span>
                            }
                            <p className="text-[10px] text-slate-400">Lần {s.submission?.sAttempt}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Not submitted list */}
                {panelData.not_completed.length > 0 && (
                  <div className="px-4 pt-3 pb-5">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                      Chưa nộp ({panelData.not_completed.length})
                    </p>
                    <div className="space-y-1.5">
                      {panelData.not_completed.map(s => (
                        <div key={s.uId} className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg">
                          <p className="text-[13px] font-medium text-slate-600">{s.uName}</p>
                          <span className="text-[10px] bg-red-100 text-red-500 px-2 py-0.5 rounded-full font-medium">Chưa nộp</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                Không tải được dữ liệu
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}