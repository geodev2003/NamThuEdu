/**
 * KidsResult — Trang xem điểm vui vẻ cho trẻ 6-12 (Cambridge YL)
 *
 * Khác bản người lớn (ResultDetail): claymorphism, lời khen ngợi theo điểm,
 * vòng tròn điểm to, sao thưởng, và trạng thái "Chờ thầy/cô chấm" thân thiện.
 * Dùng chung studentApi.getSubmissionDetail để lấy dữ liệu.
 */
import { useParams, useNavigate, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Eye, Clock, RefreshCw } from 'lucide-react';
import { studentApi } from '../../../../services/studentApi';
import { usePageTitle } from '../../../../hooks/usePageTitle';

const BASE = '/hoc-vien';

// Khen ngợi theo % điểm
function getPraise(pct: number) {
  if (pct >= 90) return { emoji: '🏆', title: 'Xuất sắc!', msg: 'Em làm bài tuyệt vời lắm!', c: '#059669', bg: 'linear-gradient(135deg,#D1FAE5,#A7F3D0)' };
  if (pct >= 75) return { emoji: '🌟', title: 'Giỏi lắm!', msg: 'Em làm rất tốt, cố lên nhé!', c: '#2563EB', bg: 'linear-gradient(135deg,#DBEAFE,#BFDBFE)' };
  if (pct >= 50) return { emoji: '👍', title: 'Khá tốt!', msg: 'Em đang tiến bộ rồi đấy!', c: '#B45309', bg: 'linear-gradient(135deg,#FEF3C7,#FDE68A)' };
  return { emoji: '💪', title: 'Cố lên nhé!', msg: 'Luyện thêm chút nữa là giỏi ngay!', c: '#E11D48', bg: 'linear-gradient(135deg,#FFE4E6,#FECDD3)' };
}

function KidsScoreRing({ pct, color }: { pct: number; color: string }) {
  const r = 60;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#F1F5F9" strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold tabular-nums" style={{ color: '#1A1040' }}>{pct}</span>
        <span className="text-xs font-bold text-slate-400">điểm / 100</span>
      </div>
    </div>
  );
}

export function KidsResult() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const submissionId = Number(id);
  usePageTitle('Kết quả của em');

  const { data, isLoading } = useQuery({
    queryKey: ['kids-submission', submissionId],
    queryFn: () => studentApi.getSubmissionDetail(submissionId),
    enabled: !!submissionId,
    // Còn chờ chấm thì poll để tự cập nhật khi giáo viên chấm xong
    refetchInterval: (query) => {
      const s: any = (query.state.data as any)?.data?.data ?? (query.state.data as any)?.data;
      return s?.sStatus && s.sStatus !== 'graded' ? 8000 : false;
    },
  });

  const sub = (data as any)?.data?.data ?? (data as any)?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #FFF1F2 0%, #FFF7ED 50%, #F0FDF4 100%)' }}>
        <div className="text-center space-y-3">
          <div className="text-5xl animate-bounce">🎈</div>
          <p className="text-base font-bold text-rose-500">Đang xem kết quả…</p>
        </div>
      </div>
    );
  }

  const maxScore = typeof sub?.exam?.eMax_score === 'number' ? sub.exam.eMax_score : parseFloat(sub?.exam?.eMax_score) || 100;
  const rawScore = typeof sub?.sScore === 'number' ? sub.sScore : parseFloat(sub?.sScore) || 0;
  const pct = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;
  const isGraded = sub?.sStatus === 'graded';
  const correct = sub?.answers?.filter((a: any) => a.saIs_correct)?.length ?? 0;
  const totalQ = sub?.exam?.questions?.length ?? sub?.answers?.length ?? 0;
  const praise = getPraise(pct);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #FFF1F2 0%, #FFF7ED 50%, #F0FDF4 100%)' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-10 space-y-5">

        <button onClick={() => navigate(`${BASE}/bai-tap`)}
          className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-rose-600 hover:bg-white transition-colors"
          style={{ boxShadow: '0 4px 14px rgba(244,63,94,0.12)' }}>
          <ArrowLeft className="w-4 h-4" /> Về danh sách bài
        </button>

        {!isGraded ? (
          /* ─── Chờ chấm ─────────────────────────────────────────── */
          <section className="rounded-3xl p-7 sm:p-9 text-center"
            style={{ background: 'linear-gradient(135deg,#FFFFFF,#FFF7ED)', boxShadow: '0 12px 40px rgba(251,113,133,0.16)', border: '2px solid rgba(255,255,255,0.9)' }}>
            <div className="text-6xl mb-3">📨</div>
            <h1 className="text-2xl font-extrabold" style={{ color: '#9F1239' }}>Em đã nộp bài rồi!</h1>
            <p className="mt-2 text-sm font-medium text-slate-500 max-w-sm mx-auto">
              Thầy/cô đang chấm bài của em. Khi chấm xong, em sẽ nhận được thông báo
              <span className="inline-flex items-center"> 🔔</span> ngay nhé!
            </p>
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-amber-700"
              style={{ background: 'rgba(251,191,36,0.15)', border: '1.5px solid rgba(251,191,36,0.3)' }}>
              <Clock className="w-4 h-4 animate-pulse" /> Đang chờ chấm điểm
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            </div>
            <p className="mt-3 text-xs text-slate-400 font-medium">{sub?.exam?.eTitle ?? 'Bài thi'}</p>
          </section>
        ) : (
          /* ─── Đã chấm ──────────────────────────────────────────── */
          <>
            <section className="relative overflow-hidden rounded-3xl p-7 sm:p-9 text-center"
              style={{ background: praise.bg, boxShadow: '0 12px 40px rgba(0,0,0,0.08)', border: '2px solid rgba(255,255,255,0.9)' }}>
              <div className="text-6xl mb-2">{praise.emoji}</div>
              <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: praise.c }}>{praise.title}</h1>
              <p className="text-sm font-bold mt-1" style={{ color: praise.c, opacity: 0.8 }}>{praise.msg}</p>
              <div className="mt-5 rounded-3xl bg-white/70 backdrop-blur-sm p-5 inline-block" style={{ border: '2px solid rgba(255,255,255,0.9)' }}>
                <KidsScoreRing pct={pct} color={praise.c} />
              </div>
            </section>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg,#F0FFF4,#BBF7D0)', border: '2px solid rgba(255,255,255,0.85)', boxShadow: '0 6px 18px rgba(5,150,105,0.12)' }}>
                <div className="text-3xl font-extrabold tabular-nums" style={{ color: '#059669' }}>{correct}/{totalQ}</div>
                <p className="text-xs font-bold mt-1 text-emerald-700/70">Câu đúng 🎯</p>
              </div>
              <div className="rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg,#EFF6FF,#BFDBFE)', border: '2px solid rgba(255,255,255,0.85)', boxShadow: '0 6px 18px rgba(37,99,235,0.12)' }}>
                <div className="text-3xl font-extrabold tabular-nums" style={{ color: '#2563EB' }}>{pct}%</div>
                <p className="text-xs font-bold mt-1 text-blue-700/70">Độ chính xác ⭐</p>
              </div>
            </div>

            {/* Xem đáp án */}
            <Link to={`${BASE}/dap-an/${submissionId}`}
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-extrabold transition-transform hover:scale-[1.01] active:scale-95"
              style={{ background: 'linear-gradient(135deg, #FB7185 0%, #F97316 100%)', boxShadow: '0 8px 24px rgba(251,113,133,0.35)' }}>
              <Eye className="w-5 h-5" /> Xem lại bài làm của em
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
