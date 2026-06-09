import { useEffect, useState } from "react";
import { adminApi } from "@/services/adminApi";
import { AdminStatsSkeleton } from "../components/AdminPageSkeleton";

type CourseReport = {
  overview?: {
    total_courses?: number;
    active_courses?: number;
    new_courses?: number;
    total_enrollments?: number;
    new_enrollments?: number;
  };
  by_type?: Record<string, number>;
  popular_courses?: Array<{ course_name?: string; enrollments?: number; type?: string }>;
};

export function AdminCoursesPage() {
  const [data, setData] = useState<CourseReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const report = await adminApi.getCoursesReport("30d");
      setData(report as CourseReport);
    } catch {
      setError("Không tải được dữ liệu khóa học.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const overview = data?.overview || {};
  const byType = data?.by_type || {};
  const popular = data?.popular_courses || [];

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý khóa học</h1>
          <p className="text-sm text-slate-500">Số liệu khóa học và ghi danh từ hệ thống</p>
        </div>
        <button
          onClick={load}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Tải lại
        </button>
      </div>

      {loading ? (
        <AdminStatsSkeleton cards={4} />
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">{error}</div>
      ) : (
        <>
          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-5">
            <Stat label="Tổng khóa học" value={overview.total_courses || 0} />
            <Stat label="Khóa active" value={overview.active_courses || 0} />
            <Stat label="Khóa mới (30d)" value={overview.new_courses || 0} />
            <Stat label="Tổng ghi danh" value={overview.total_enrollments || 0} />
            <Stat label="Ghi danh mới" value={overview.new_enrollments || 0} />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-3 text-base font-semibold text-slate-900">Phân loại khóa học</h2>
              <div className="space-y-2 text-sm text-slate-700">
                {Object.entries(byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span>{type}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
                {Object.keys(byType).length === 0 && <p className="text-slate-500">Không có dữ liệu.</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-3 text-base font-semibold text-slate-900">Top khóa học phổ biến</h2>
              <div className="space-y-3 text-sm text-slate-700">
                {popular.map((item, idx) => (
                  <div key={`${item.course_name}-${idx}`} className="rounded-lg border border-slate-100 p-3">
                    <p className="font-medium text-slate-900">{item.course_name || "N/A"}</p>
                    <p className="text-slate-500">Type: {item.type || "N/A"} • Enrollments: {item.enrollments || 0}</p>
                  </div>
                ))}
                {popular.length === 0 && <p className="text-slate-500">Không có dữ liệu.</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

