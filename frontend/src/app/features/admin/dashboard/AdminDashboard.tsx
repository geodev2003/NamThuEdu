import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  Activity,
  AlertTriangle,
  ChevronRight,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Bell,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { adminApi } from "@/services/adminApi";

type RoleStats = Record<string, { active: number; inactive: number; total: number }>;

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<Record<string, unknown> | null>(null);
  const [roleStats, setRoleStats] = useState<RoleStats>({});
  const [contentStats, setContentStats] = useState<Record<string, unknown> | null>(null);
  const [examStats, setExamStats] = useState<Record<string, unknown> | null>(null);
  const [lockedUsers, setLockedUsers] = useState(0);
  const [trendsReport, setTrendsReport] = useState<Record<string, unknown> | null>(null);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Chào buổi sáng";
    if (h < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [dashboardData, roleStatsData, contentStatsData, examStatsData, lockedUsersData, trendsData] = await Promise.all([
          adminApi.getDashboardReport(),
          adminApi.getRoleStatistics(),
          adminApi.getContentStatistics(),
          adminApi.getExamStatistics(),
          adminApi.getLockedUsers(),
          adminApi.getTrendsReport("30d"),
        ]);
        setDashboard(dashboardData as unknown as Record<string, unknown>);
        setRoleStats(roleStatsData);
        setContentStats(contentStatsData);
        setExamStats(examStatsData);
        setLockedUsers(lockedUsersData.length);
        setTrendsReport(trendsData);
      } catch {
        setError("Không tải được dashboard admin.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = useMemo(
    () => [
      {
        label: "Tổng giáo viên",
        value: roleStats.teacher?.total ?? 0,
        sub: `${roleStats.teacher?.active ?? 0} đang hoạt động`,
        icon: GraduationCap,
        color: "#2563EB",
        bg: "#EFF6FF",
        border: "#BFDBFE",
      },
      {
        label: "Tổng học viên",
        value: roleStats.student?.total ?? 0,
        sub: `${(dashboard?.users as Record<string, unknown> | undefined)?.new_this_week ?? 0} mới tuần này`,
        icon: Users,
        color: "#10B981",
        bg: "#ECFDF5",
        border: "#A7F3D0",
      },
      {
        label: "Khóa học active",
        value: (dashboard?.courses as Record<string, unknown> | undefined)?.total ?? 0,
        sub: `${(dashboard?.courses as Record<string, unknown> | undefined)?.total_enrollments ?? 0} lượt ghi danh`,
        icon: BookOpen,
        color: "#8B5CF6",
        bg: "#F5F3FF",
        border: "#DDD6FE",
      },
      {
        label: "Bài nộp hôm nay",
        value: (dashboard?.activity as Record<string, unknown> | undefined)?.tests_taken_today ?? 0,
        sub: `Đề thi: ${examStats?.total_exams ?? 0}`,
        icon: FileText,
        color: "#F59E0B",
        bg: "#FFFBEB",
        border: "#FDE68A",
      },
    ],
    [dashboard, examStats, roleStats]
  );

  const trendData = useMemo(() => {
    const timeline = (trendsReport?.timeline as Array<Record<string, unknown>> | undefined) || [];

    return timeline.slice(-6).map((point) => ({
      month: String(point.date ?? "").slice(5),
      revenue: Number(point.submissions ?? 0),
      students: Number(point.new_users ?? 0),
    }));
  }, [trendsReport]);

  const postTypeBars = useMemo(() => {
    const byType = (contentStats?.by_type as Record<string, number> | undefined) || {};
    const colors = ["#2563EB", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];
    return Object.entries(byType)
      .slice(0, 5)
      .map(([name, value], idx) => ({ name, students: value, color: colors[idx % colors.length] }));
  }, [contentStats]);

  const recentActivities = useMemo(
    () => [
      {
        id: 1,
        text: `${(dashboard?.activity as Record<string, unknown> | undefined)?.tests_taken_today ?? 0} bài nộp mới trong ngày`,
        time: "Realtime",
        color: "#2563EB",
      },
      {
        id: 2,
        text: `${(dashboard?.activity as Record<string, unknown> | undefined)?.posts_created_today ?? 0} bài viết mới`,
        time: "Realtime",
        color: "#10B981",
      },
      {
        id: 3,
        text: `${(dashboard?.courses as Record<string, unknown> | undefined)?.new_enrollments_today ?? 0} ghi danh mới`,
        time: "Realtime",
        color: "#8B5CF6",
      },
      {
        id: 4,
        text: `${contentStats?.pending_posts ?? 0} bài viết chờ duyệt`,
        time: "Realtime",
        color: "#F59E0B",
      },
    ],
    [contentStats, dashboard]
  );

  const pendingAlerts = useMemo(
    () => [
      { id: 1, text: `${contentStats?.pending_posts ?? 0} bài viết chờ duyệt`, severity: "warning", path: "/admin/content/posts" },
      { id: 2, text: `${examStats?.pending_exams ?? 0} đề thi chờ duyệt`, severity: "info", path: "/admin/content/exams" },
      { id: 3, text: `${lockedUsers} tài khoản đang bị khóa`, severity: "danger", path: "/admin/students" },
      {
        id: 4,
        text: `Tỷ lệ hoàn thành bài tập ${(dashboard?.performance as Record<string, unknown> | undefined)?.assignment_completion_rate ?? 0}%`,
        severity: "info",
        path: "/admin/reports/students",
      },
    ],
    [contentStats, dashboard, examStats, lockedUsers]
  );

  const serverMetrics = useMemo(
    () => {
      const metrics = (trendsReport?.server_metrics as Record<string, unknown> | undefined) || {};
      return [
        { label: "CPU", val: Number(metrics.cpu ?? 0), icon: Cpu, color: "#10B981" },
        { label: "RAM", val: Number(metrics.ram ?? 0), icon: Database, color: "#F59E0B" },
        { label: "Disk", val: Number(metrics.disk ?? 0), icon: HardDrive, color: "#EF4444" },
        { label: "Network", val: Number(metrics.network ?? 0), icon: Wifi, color: "#8B5CF6" },
      ];
    },
    [trendsReport]
  );

  if (loading) {
    return (
      <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">Đang tải dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>{greeting}, Admin 👋</p>
            <h1 className="mt-1" style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em" }}>
              Admin Console
            </h1>
            <p style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>Tổng quan hệ thống NamThu Education</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl px-4 py-2.5" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
              <div className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              <span style={{ fontSize: 13, color: "#065F46", fontWeight: 600 }}>Hệ thống Online</span>
            </div>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-[#F1F5F9]" style={{ border: "1px solid #E2E8F0" }}>
              <Bell className="h-5 w-5" style={{ color: "#64748B" }} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-white" style={{ background: "#EF4444", fontSize: 10, fontWeight: 700 }}>
                {pendingAlerts.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl p-5" style={{ background: card.bg, border: `1px solid ${card.border}` }}>
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${card.color}20` }}>
                <card.icon className="h-5 w-5" style={{ color: card.color }} />
              </div>
            </div>
            <p style={{ fontSize: 30, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{String(card.value)}</p>
            <p style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>{card.label}</p>
            <p style={{ fontSize: 11, color: "#10B981", marginTop: 6, fontWeight: 600 }}>{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-12 gap-4">
        <div className="col-span-8 rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
          <div className="mb-5 flex items-center justify-between">
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>Xu hướng hoạt động</h2>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F172A" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#0F172A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="studGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#0F172A" strokeWidth={2.5} fill="url(#revGrad)" />
              <Area type="monotone" dataKey="students" stroke="#F59E0B" strokeWidth={2.5} fill="url(#studGrad2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-4 rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
          <h2 className="mb-5" style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
            Loại nội dung
          </h2>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={postTypeBars} layout="vertical" barSize={20}>
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="students" radius={[0, 6, 6, 0]}>
                {postTypeBars.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-5 rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" style={{ color: "#0F172A" }} />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>Hoạt động gần đây</h2>
            </div>
            <Link to="/admin/system/activity-logs" className="flex items-center gap-1" style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>
              Xem nhật ký <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivities.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full" style={{ background: a.color }} />
                <div className="min-w-0 flex-1">
                  <p style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{a.text}</p>
                  <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 3 }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-4 rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" style={{ color: "#F59E0B" }} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>Cần xử lý</h2>
          </div>
          <div className="space-y-2.5">
            {pendingAlerts.map((alert) => (
              <Link key={alert.id} to={alert.path} className="flex items-start gap-3 rounded-xl border p-3 transition-all" style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}>
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#F59E0B]" />
                <p style={{ fontSize: 13, color: "#334155", fontWeight: 500, flex: 1 }}>{alert.text}</p>
                <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>

        <div className="col-span-3 rounded-2xl p-6" style={{ background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)", boxShadow: "0 4px 20px rgba(15,23,42,0.2)" }}>
          <h2 className="mb-5" style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF" }}>
            Sức khỏe Server
          </h2>
          <div className="space-y-4">
            {serverMetrics.map((m) => (
              <div key={m.label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <m.icon className="h-3.5 w-3.5" style={{ color: "#94A3B8" }} />
                    <span style={{ fontSize: 12, color: "#94A3B8" }}>{m.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF" }}>{m.val}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${m.val}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
