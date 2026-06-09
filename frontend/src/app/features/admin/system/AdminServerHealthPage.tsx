import { useEffect, useState, useCallback } from "react";
import {
  Server,
  Database,
  HardDrive,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Gauge,
} from "lucide-react";
import { adminApi, type AdminSystemHealth } from "@/services/adminApi";
import { AdminStatsSkeleton } from "../components/AdminPageSkeleton";

/**
 * AdminServerHealthPage — Sức khỏe hệ thống (chỉ số ĐO THẬT từ server).
 * Nguồn: GET /admin/system/health (PHP/disk/memory/DB latency/queue).
 * Design: data-dense admin (blue/slate/amber), SVG icons, no emoji.
 */

function fmtBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function barColor(pct: number): string {
  if (pct >= 90) return "#DC2626";
  if (pct >= 70) return "#F59E0B";
  return "#059669";
}

const OVERALL_META: Record<string, { label: string; color: string; bg: string; Icon: typeof CheckCircle2 }> = {
  healthy:  { label: "Hệ thống ổn định", color: "#059669", bg: "#ECFDF5", Icon: CheckCircle2 },
  warning:  { label: "Cần chú ý",        color: "#F59E0B", bg: "#FFFBEB", Icon: AlertTriangle },
  critical: { label: "Sự cố nghiêm trọng", color: "#DC2626", bg: "#FEF2F2", Icon: XCircle },
};

export function AdminServerHealthPage() {
  const [data, setData] = useState<AdminSystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getSystemHealth();
      setData(res as AdminSystemHealth);
    } catch {
      setError("Không tải được dữ liệu sức khỏe hệ thống.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const overall = data ? OVERALL_META[data.overall] ?? OVERALL_META.warning : null;

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="h-6 w-6" style={{ color: "#1E40AF" }} />
            <h1 className="text-2xl font-bold" style={{ color: "#1E3A8A" }}>
              Sức khỏe hệ thống
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">Chỉ số đo thật từ server — nguồn: /admin/system/health</p>
        </div>
        <button
          onClick={load}
          className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </button>
      </div>

      {loading ? (
        <AdminStatsSkeleton cards={4} />
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">{error}</div>
      ) : data ? (
        <div className="space-y-5">
          {/* Overall banner */}
          {overall && (
            <div className="flex items-center gap-3 rounded-2xl border p-4" style={{ background: overall.bg, borderColor: overall.color + "40" }}>
              <overall.Icon className="h-6 w-6" style={{ color: overall.color }} />
              <div>
                <p className="font-semibold" style={{ color: overall.color }}>{overall.label}</p>
                <p className="text-xs text-slate-500">Cập nhật: {new Date(data.timestamp).toLocaleString("vi-VN", { hour12: false })}</p>
              </div>
            </div>
          )}

          {/* Usage gauges */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <GaugeCard icon={HardDrive} title="Dung lượng đĩa" pct={data.disk.used_percent}
              detail={`${fmtBytes(data.disk.used_bytes)} / ${fmtBytes(data.disk.total_bytes)} · còn trống ${fmtBytes(data.disk.free_bytes)}`} />
            <GaugeCard icon={Cpu} title="Bộ nhớ PHP" pct={data.memory.used_percent}
              detail={`${fmtBytes(data.memory.usage_bytes)} / ${data.memory.limit} · đỉnh ${fmtBytes(data.memory.peak_bytes)}`} />
          </div>

          {/* Database + drivers */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <Database className="h-5 w-5" style={{ color: "#1E40AF" }} />
                <h2 className="font-semibold text-slate-900">Cơ sở dữ liệu</h2>
              </div>
              <div className="space-y-2.5 text-sm">
                <Row label="Kết nối" value={
                  <span className="flex items-center gap-1.5 font-semibold" style={{ color: data.database.connected ? "#059669" : "#DC2626" }}>
                    {data.database.connected ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    {data.database.connected ? "OK" : "Lỗi"}
                  </span>
                } />
                <Row label="Độ trễ" value={<span className="flex items-center gap-1"><Gauge className="h-4 w-4 text-slate-400" />{data.database.latency_ms != null ? `${data.database.latency_ms} ms` : "—"}</span>} />
                {Object.entries(data.database.counts).map(([k, v]) => (
                  <Row key={k} label={`Bản ghi ${k}`} value={<span className="font-semibold text-slate-800">{v != null ? v.toLocaleString("vi-VN") : "—"}</span>} />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <Server className="h-5 w-5" style={{ color: "#1E40AF" }} />
                <h2 className="font-semibold text-slate-900">Môi trường & Driver</h2>
              </div>
              <div className="space-y-2.5 text-sm">
                <Row label="PHP" value={<span className="font-mono text-slate-700">{data.app.php_version}</span>} />
                <Row label="Laravel" value={<span className="font-mono text-slate-700">{data.app.laravel}</span>} />
                <Row label="Environment" value={<span className="font-semibold text-slate-800">{data.app.environment}</span>} />
                <Row label="Cache driver" value={<span className="font-mono text-slate-700">{data.drivers.cache}</span>} />
                <Row label="Queue driver" value={<span className="font-mono text-slate-700">{data.drivers.queue}</span>} />
                <Row label="Session driver" value={<span className="font-mono text-slate-700">{data.drivers.session}</span>} />
                <Row label="Hàng đợi chờ xử lý" value={<span className="font-semibold text-slate-800">{data.queue.pending_jobs != null ? data.queue.pending_jobs : "—"}</span>} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function GaugeCard({ icon: Icon, title, pct, detail }: { icon: typeof Cpu; title: string; pct: number; detail: string }) {
  const color = barColor(pct);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${color}15` }}>
            <Icon className="h-4.5 w-4.5" style={{ color }} />
          </span>
          <h2 className="font-semibold text-slate-900">{title}</h2>
        </div>
        <span className="text-xl font-extrabold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: "#F1F5F9" }}>
        <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      {value}
    </div>
  );
}
