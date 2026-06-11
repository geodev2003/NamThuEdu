import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { Newspaper, ChevronLeft, ChevronRight, Clock, ExternalLink } from 'lucide-react';
import { getApiUrl } from '../../../../../utils/apiConfig';

// ─── Types ────────────────────────────────────────────────────────────────────
interface NewsItem {
  title: string;
  link: string;
  source: string;
  published_at: string | null;
  description: string;
  image: string | null;
}

interface NewsResponse {
  status: 'success' | 'error';
  data: { topic: string; items: NewsItem[] };
}

interface ExamNewsFeedProps {
  topic?: 'thpt-quoc-gia' | 'ielts' | 'vstep' | 'tieng-anh';
  limit?: number;
  title?: string;
  subtitle?: string;
  /** Auto-advance interval in ms. Set to 0 to disable. */
  autoPlayMs?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const FALLBACK_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'>
      <defs>
        <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
          <stop offset='0' stop-color='#0D9488'/>
          <stop offset='1' stop-color='#14B8A6'/>
        </linearGradient>
      </defs>
      <rect width='800' height='450' fill='url(#g)'/>
      <text x='50%' y='50%' fill='white' font-family='sans-serif' font-size='32' font-weight='700' text-anchor='middle' dominant-baseline='middle'>Tin giáo dục</text>
    </svg>`,
  );

function formatRelativeTime(iso: string | null): string {
  if (!iso) return '';
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return '';
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return new Date(ts).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ─── Component ────────────────────────────────────────────────────────────────
export const ExamNewsFeed = ({
  topic = 'thpt-quoc-gia',
  limit = 8,
  title = 'Tin tức kỳ thi THPT Quốc gia',
  subtitle = 'Cập nhật từ báo chí Việt Nam',
  autoPlayMs = 5000,
}: ExamNewsFeedProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['news-feed', topic, limit],
    queryFn: async () => {
      const url = getApiUrl(`/public/news?topic=${topic}&limit=${limit}`);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch news');
      return (await res.json()) as NewsResponse;
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const items = data?.data?.items ?? [];
  const total = items.length;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setActive(0);
  }, [total]);

  const next = useCallback(() => setActive(i => (total === 0 ? 0 : (i + 1) % total)), [total]);
  const prev = useCallback(() => setActive(i => (total === 0 ? 0 : (i - 1 + total) % total)), [total]);

  useEffect(() => {
    if (!autoPlayMs || paused || total <= 1) return;
    const id = setInterval(next, autoPlayMs);
    return () => clearInterval(id);
  }, [autoPlayMs, paused, total, next]);

  return (
    <section
      className="rounded-2xl overflow-hidden bg-white"
      style={{ border: '1.5px solid #F0EEFF', boxShadow: '0 4px 20px rgba(124,58,237,0.08)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0D9488, #14B8A6)' }}
          >
            <Newspaper className="w-[18px] h-[18px] text-white" strokeWidth={2.2} />
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1F1344' }}>{title}</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
        {total > 1 && (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] text-slate-400 tabular-nums">
              {active + 1} / {total}
            </span>
            <button
              onClick={prev}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-teal-700 hover:bg-slate-100 transition-colors"
              aria-label="Tin trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-teal-700 hover:bg-slate-100 transition-colors"
              aria-label="Tin tiếp"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="p-12 flex items-center justify-center text-sm text-slate-400 gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-slate-200 border-t-teal-500 animate-spin" />
          Đang tải tin tức…
        </div>
      ) : isError || total === 0 ? (
        <div className="p-12 text-center text-sm text-slate-500">
          {isError ? 'Không tải được tin tức.' : 'Chưa có tin nào.'}
        </div>
      ) : (
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Slides viewport */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {items.map((item, idx) => (
                <a
                  key={`${item.link}-${idx}`}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block flex-shrink-0 w-full"
                  style={{ flex: '0 0 100%' }}
                >
                  {/* Two-column layout on md+; stacked on mobile */}
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="relative aspect-[16/9] md:aspect-auto md:min-h-[280px] bg-slate-100 overflow-hidden">
                      <img
                        src={item.image || FALLBACK_IMG}
                        alt={item.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                        }}
                      />
                      {item.source && (
                        <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-[11px] font-semibold text-slate-700 shadow-sm">
                          {item.source.split(' - ')[0]}
                        </span>
                      )}
                    </div>

                    {/* Text content */}
                    <div className="flex flex-col justify-center p-6 md:p-8">
                      {item.published_at && (
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-700 mb-3">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(item.published_at)}
                        </div>
                      )}
                      <h3 className="text-[18px] md:text-[20px] font-extrabold leading-snug text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-3">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-[13px] text-slate-600 leading-relaxed mt-3 line-clamp-3">
                          {item.description}
                        </p>
                      )}
                      <div className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-teal-700 group-hover:gap-2.5 transition-all">
                        Đọc tiếp
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Dots */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-1.5 py-3 border-t border-slate-100">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === active
                      ? 'w-6 h-1.5 bg-teal-500'
                      : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Chuyển tới tin ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
