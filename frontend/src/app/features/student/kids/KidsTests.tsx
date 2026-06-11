/**
 * KidsTests — Trang "Bài thi của em" cho trẻ 6-12 (Cambridge YL)
 *
 * Tiêu chí: SẠCH, NHẸ NHÀNG, không màu mè. Khác bản chung TestList (hero
 * gradient xanh tím đậm + nhiều bộ lọc VSTEP/IELTS). Ở đây:
 * - Nền sáng, thẻ trắng, 1 điểm nhấn rose duy nhất.
 * - Bỏ bộ lọc loại/dạng (kids chỉ có Cambridge — không cần).
 * - Tab trạng thái đơn giản + tìm kiếm nhẹ.
 * Dùng chung studentApi.getTests và điều hướng phong-cho / ket-qua.
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Clock, ListChecks, Search, CheckCircle2, Play, RotateCcw, BookOpen } from 'lucide-react';
import { studentApi } from '../../../../services/studentApi';
import { usePageTitle, PAGE_TITLES } from '../../../../hooks/usePageTitle';

const BASE = '/hoc-vien';

type Status = 'all' | 'pending' | 'in_progress' | 'completed';

// Ẩn đề người lớn (kids chỉ thấy Cambridge YL)
function isAdultExam(t: any): boolean {
  const s = (String(t.exam_type ?? '') + ' ' + String(t.exam_title ?? '')).toLowerCase();
  return s.includes('vstep') || s.includes('ielts') || s.includes('toeic');
}

const STATUS_META: Record<Exclude<Status, 'all'>, { label: string; c: string; soft: string }> = {
  pending:     { label: 'Chưa làm',   c: '#E11D48', soft: '#FFE4E6' },
  in_progress: { label: 'Đang làm',   c: '#B45309', soft: '#FEF3C7' },
  completed:   { label: 'Hoàn thành', c: '#059669', soft: '#D1FAE5' },
};

export function KidsTests() {
  usePageTitle(PAGE_TITLES.STUDENT_TESTS);
  const [status, setStatus] = useState<Status>('pending');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['student', 'tests', 'kids'],
    queryFn: () => studentApi.getTests({}),
  });

  const groups = (data as any)?.data?.data;

  const allTests = useMemo(() => {
    const map = (arr: any[], s: Status) => (arr || []).map(t => ({ ...t, status: s }));
    const merged = [
      ...map(groups?.pending, 'pending'),
      ...map(groups?.in_progress, 'in_progress'),
      ...map(groups?.completed, 'completed'),
    ];
    return merged.filter(t => !isAdultExam(t));
  }, [groups]);

  const counts = useMemo(() => ({
    all: allTests.length,
    pending: allTests.filter(t => t.status === 'pending').length,
    in_progress: allTests.filter(t => t.status === 'in_progress').length,
    completed: allTests.filter(t => t.status === 'completed').length,
  }), [allTests]);

  const visible = useMemo(() => {
    let list = status === 'all' ? allTests : allTests.filter(t => t.status === status);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => String(t.exam_title ?? '').toLowerCase().includes(q));
    }
    return list;
  }, [allTests, status, search]);

  const tabs: { key: Status; label: string; count: number }[] = [
    { key: 'pending',     label: 'Chưa làm',   count: counts.pending },
    { key: 'in_progress', label: 'Đang làm',   count: counts.in_progress },
    { key: 'completed',   label: 'Hoàn thành', count: counts.completed },
    { key: 'all',         label: 'Tất cả',     count: counts.all },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-10 space-y-5">

        {/* ─── Header (nhẹ, sạch) ──────────────────────────────── */}
        <header className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-500 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">Bài thi của em</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Các bài thầy cô giao — chọn bài để bắt đầu nhé!</p>
          </div>
        </header>

        {/* ─── Tabs + Search ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {tabs.map(tab => {
              const active = status === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setStatus(tab.key)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-bold transition-colors"
                  style={active
                    ? { background: '#F43F5E', color: '#fff' }
                    : { background: '#fff', color: '#64748B', border: '1.5px solid #E2E8F0' }}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-bold"
                      style={active ? { background: 'rgba(255,255,255,0.25)' } : { background: '#FFE4E6', color: '#E11D48' }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="relative flex-1 sm:max-w-xs sm:ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm bài thi…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-full text-sm outline-none focus:border-rose-300 transition-colors"
              style={{ background: '#fff', border: '1.5px solid #E2E8F0', color: '#1E293B' }}
            />
          </div>
        </div>

        {/* ─── List ────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-40 rounded-2xl animate-pulse bg-white border border-slate-200" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-base font-extrabold text-slate-800">
              {search ? 'Không tìm thấy bài nào' : 'Em không có bài nào ở đây'}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {search ? 'Thử từ khóa khác nhé.' : 'Khi thầy cô giao bài, bài sẽ hiện ở đây.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visible.map(test => {
              const meta = STATUS_META[test.status as Exclude<Status, 'all'>] ?? STATUS_META.pending;
              const isCompleted = test.status === 'completed';
              const inProgress = test.status === 'in_progress';
              return (
                <div key={test.assignment_id}
                  className="flex flex-col bg-white rounded-2xl border border-slate-200 p-5 transition-all hover:shadow-md hover:border-rose-200">
                  {/* Status chip */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ background: meta.soft, color: meta.c }}>
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : inProgress ? <RotateCcw className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {meta.label}
                    </span>
                    {test.exam_skill && (
                      <span className="text-xs font-semibold text-slate-400 capitalize">{test.exam_skill}</span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 min-h-[44px]">
                    {test.exam_title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-2 mb-4">
                    {test.exam_duration > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" /> {test.exam_duration} phút
                      </span>
                    )}
                    {test.total_questions > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <ListChecks className="w-4 h-4 text-slate-400" /> {test.total_questions} câu
                      </span>
                    )}
                  </div>

                  {/* Action */}
                  <div className="mt-auto">
                    {isCompleted ? (
                      <Link to={`${BASE}/ket-qua/${test.submission_id}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors">
                        <CheckCircle2 className="w-4 h-4" /> Xem kết quả
                      </Link>
                    ) : (
                      <Link to={`${BASE}/phong-cho/${test.assignment_id}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-transform hover:scale-[1.01] active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #FB7185 0%, #F97316 100%)' }}>
                        <Play className="w-4 h-4 fill-white" /> {inProgress ? 'Tiếp tục làm' : 'Bắt đầu'}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
