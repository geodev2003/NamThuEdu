import { useState } from "react";
import { Link } from "react-router";
import {
  GraduationCap,
  Users,
  BookOpen,
  TrendingUp,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Database,
  Zap,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  UserPlus,
  FileText,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Eye,
  Bell,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const revenueData = [
  { month: "T10", revenue: 85, students: 210 },
  { month: "T11", revenue: 92, students: 235 },
  { month: "T12", revenue: 108, students: 280 },
  { month: "T1", revenue: 95, students: 260 },
  { month: "T2", revenue: 118, students: 310 },
  { month: "T3", revenue: 134, students: 342 },
];

const courseActivity = [
  { name: "IELTS 7.0", students: 124, color: "#2563EB" },
  { name: "IELTS 6.5", students: 98, color: "#8B5CF6" },
  { name: "IELTS 6.0", students: 72, color: "#10B981" },
  { name: "Nền tảng", students: 48, color: "#F59E0B" },
];

const recentActivities = [
  {
    id: 1,
    type: "teacher",
    text: "GV Nguyễn Văn Thuận tạo đề thi mới",
    time: "5 phút trước",
    color: "#2563EB",
    icon: GraduationCap,
  },
  {
    id: 2,
    type: "student",
    text: "12 học viên mới đăng ký khóa IELTS 7.0",
    time: "23 phút trước",
    color: "#10B981",
    icon: UserPlus,
  },
  {
    id: 3,
    type: "system",
    text: "Backup dữ liệu thành công • 2.4 GB",
    time: "1 giờ trước",
    color: "#8B5CF6",
    icon: Database,
  },
  {
    id: 4,
    type: "alert",
    text: "Phiên thi IELTS Mock Test kết thúc • 48 học viên",
    time: "2 giờ trước",
    color: "#F59E0B",
    icon: FileText,
  },
  {
    id: 5,
    type: "teacher",
    text: "GV Trần Thị Hoa chấm 24 bài writing",
    time: "3 giờ trước",
    color: "#2563EB",
    icon: CheckCircle2,
  },
];

const pendingAlerts = [
  { id: 1, text: "12 học viên chờ duyệt đăng ký", severity: "warning", path: "/admin/hoc-vien/dang-ky" },
  { id: 2, text: "2 giáo viên yêu cầu cấp lại mật khẩu", severity: "info", path: "/admin/giao-vien" },
  { id: 3, text: "Server disk 78% — cần dọn cache", severity: "danger", path: "/admin/he-thong/server" },
  { id: 4, text: "Cập nhật hệ thống v2.4.1 có sẵn", severity: "info", path: "/admin/cai-dat" },
];

export function AdminDashboard() {
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return "Chào buổi sáng";
    if (h < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  });

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>
              {greeting}, Admin 👋
            </p>
            <h1
              className="mt-1"
              style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em" }}
            >
              Admin Console
            </h1>
            <p style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>
              Tổng quan hệ thống NamThu Education • Thứ Ba, 24/03/2026
            </p>
          </div>

          {/* System status */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span style={{ fontSize: 13, color: "#065F46", fontWeight: 600 }}>
                Hệ thống Online
              </span>
            </div>
            <button
              className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-[#F1F5F9]"
              style={{ border: "1px solid #E2E8F0" }}
            >
              <Bell className="w-5 h-5" style={{ color: "#64748B" }} />
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white"
                style={{ background: "#EF4444", fontSize: 10, fontWeight: 700 }}
              >
                4
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Tổng giáo viên",
            value: "24",
            sub: "+2 tháng này",
            trend: "up",
            icon: GraduationCap,
            color: "#2563EB",
            bg: "#EFF6FF",
            border: "#BFDBFE",
          },
          {
            label: "Tổng học viên",
            value: "1,247",
            sub: "+87 tháng này",
            trend: "up",
            icon: Users,
            color: "#10B981",
            bg: "#ECFDF5",
            border: "#A7F3D0",
          },
          {
            label: "Khóa học active",
            value: "18",
            sub: "4 khóa sắp khai giảng",
            trend: "up",
            icon: BookOpen,
            color: "#8B5CF6",
            bg: "#F5F3FF",
            border: "#DDD6FE",
          },
          {
            label: "Bài nộp hôm nay",
            value: "342",
            sub: "-12% so với hôm qua",
            trend: "down",
            icon: FileText,
            color: "#F59E0B",
            bg: "#FFFBEB",
            border: "#FDE68A",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl p-5"
            style={{ background: card.bg, border: `1px solid ${card.border}` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${card.color}20` }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              {card.trend === "up" ? (
                <ArrowUpRight className="w-4 h-4" style={{ color: "#10B981" }} />
              ) : (
                <ArrowDownRight className="w-4 h-4" style={{ color: "#EF4444" }} />
              )}
            </div>
            <p style={{ fontSize: 30, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>
              {card.value}
            </p>
            <p style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>{card.label}</p>
            <p
              style={{
                fontSize: 11,
                color: card.trend === "up" ? "#10B981" : "#EF4444",
                marginTop: 6,
                fontWeight: 600,
              }}
            >
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        {/* Revenue chart - col 8 */}
        <div
          className="col-span-8 rounded-2xl p-6"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#1E293B" }}
              >
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                  Doanh thu & Học viên
                </h2>
                <p style={{ fontSize: 12, color: "#94A3B8" }}>6 tháng gần nhất</p>
              </div>
            </div>
            <span
              className="flex items-center gap-1 px-3 py-1.5 rounded-full"
              style={{ background: "#ECFDF5", fontSize: 12, color: "#065F46", fontWeight: 600 }}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              +57% doanh thu
            </span>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={revenueData}>
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
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Doanh thu (tr)"
                stroke="#0F172A"
                strokeWidth={2.5}
                fill="url(#revGrad)"
                dot={{ fill: "#0F172A", r: 4, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="students"
                name="Học viên"
                stroke="#F59E0B"
                strokeWidth={2.5}
                fill="url(#studGrad2)"
                dot={{ fill: "#F59E0B", r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Course distribution - col 4 */}
        <div
          className="col-span-4 rounded-2xl p-6"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#1E293B" }}
            >
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
              Phân bổ học viên
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={courseActivity} layout="vertical" barSize={20}>
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="students" radius={[0, 6, 6, 0]}>
                {courseActivity.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {courseActivity.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span style={{ fontSize: 12, color: "#64748B" }}>{c.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>
                  {c.students} HV
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Activity feed - col 5 */}
        <div
          className="col-span-5 rounded-2xl p-6"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" style={{ color: "#0F172A" }} />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                Hoạt động gần đây
              </h2>
            </div>
            <Link
              to="/admin/he-thong/nhat-ky"
              className="flex items-center gap-1"
              style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}
            >
              Xem nhật ký <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivities.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.id} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${a.color}15` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: a.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 13, color: "#374151", fontWeight: 500, lineHeight: 1.4 }}>
                      {a.text}
                    </p>
                    <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 3 }}>{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alerts - col 4 */}
        <div
          className="col-span-4 rounded-2xl p-6"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5" style={{ color: "#F59E0B" }} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
              Cần xử lý
            </h2>
            <span
              className="px-2 py-0.5 rounded-full text-white"
              style={{ background: "#EF4444", fontSize: 11, fontWeight: 700 }}
            >
              {pendingAlerts.length}
            </span>
          </div>
          <div className="space-y-2.5">
            {pendingAlerts.map((alert) => {
              const colors = {
                warning: { bg: "#FFFBEB", border: "#FDE68A", dot: "#F59E0B", text: "#92400E" },
                danger: { bg: "#FEF2F2", border: "#FECACA", dot: "#EF4444", text: "#991B1B" },
                info: { bg: "#EFF6FF", border: "#BFDBFE", dot: "#2563EB", text: "#1E40AF" },
              };
              const c = colors[alert.severity as keyof typeof colors];
              return (
                <Link
                  key={alert.id}
                  to={alert.path}
                  className="flex items-start gap-3 p-3 rounded-xl transition-all"
                  style={{ background: c.bg, border: `1px solid ${c.border}` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.85";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                    style={{ background: c.dot }}
                  />
                  <p style={{ fontSize: 13, color: c.text, fontWeight: 500, flex: 1 }}>
                    {alert.text}
                  </p>
                  <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: c.dot }} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Server health - col 3 */}
        <div
          className="col-span-3 rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            boxShadow: "0 4px 20px rgba(15,23,42,0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Server className="w-5 h-5" style={{ color: "#F59E0B" }} />
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF" }}>
              Sức khỏe Server
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "CPU", val: 42, icon: Cpu, color: "#10B981" },
              { label: "RAM", val: 67, icon: Database, color: "#F59E0B" },
              { label: "Disk", val: 78, icon: HardDrive, color: "#EF4444" },
              { label: "Network", val: 23, icon: Wifi, color: "#8B5CF6" },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <m.icon className="w-3.5 h-3.5" style={{ color: "#94A3B8" }} />
                    <span style={{ fontSize: 12, color: "#94A3B8" }}>{m.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF" }}>
                    {m.val}%
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${m.val}%`,
                      background: m.color,
                      boxShadow: `0 0 6px ${m.color}80`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            className="mt-5 flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}
          >
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span style={{ fontSize: 12, color: "#6EE7B7", fontWeight: 600 }}>
              Uptime 99.8% • 12ms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
