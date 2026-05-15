import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { usePageTitle } from "../../../hooks/usePageTitle";
import { publicBlogApi, type Blog } from "../../../services/blogApi";
import { Header, Footer } from "./components";
import {
  Search,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Lightbulb,
  BookMarked,
  GraduationCap,
  Newspaper,
  ArrowRight,
} from "lucide-react";

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; dot: string }> = {
  grammar:    { label: "Ngữ pháp",  icon: BookOpen,      dot: "bg-blue-500" },
  tips:       { label: "Mẹo học",   icon: Lightbulb,     dot: "bg-amber-500" },
  vocabulary: { label: "Từ vựng",   icon: BookMarked,    dot: "bg-violet-500" },
  teaching:   { label: "Giảng dạy", icon: GraduationCap, dot: "bg-emerald-500" },
  news:       { label: "Tin tức",   icon: Newspaper,     dot: "bg-orange-500" },
};

const TYPE_BADGE: Record<string, string> = {
  grammar:    "text-blue-600 bg-blue-50",
  tips:       "text-amber-600 bg-amber-50",
  vocabulary: "text-violet-600 bg-violet-50",
  teaching:   "text-emerald-600 bg-emerald-50",
  news:       "text-orange-600 bg-orange-50",
};

const ALL_TYPES = [
  { value: "", label: "Tất cả" },
  ...Object.entries(TYPE_CONFIG).map(([k, v]) => ({ value: k, label: v.label })),
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" });
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "");
}

/* ── Featured hero (typography-first) ───────────────────────────── */
const FeaturedCard = memo(function FeaturedCard({ post }: { post: Blog }) {
  const navigate = useNavigate();
  const slug = post.pUrl || String(post.pId);
  const cfg = TYPE_CONFIG[post.pType];

  return (
    <article
      onClick={() => navigate(`/bai-viet/${slug}`)}
      className="group cursor-pointer border-b border-gray-100 py-10"
    >
      {cfg && (
        <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </p>
      )}
      <h2 className="mb-4 text-[1.75rem] font-bold leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-orange-600">
        {post.pTitle}
      </h2>
      {post.pThumbnail && (
        <div className="mb-5 h-60 overflow-hidden rounded-xl">
          <img src={post.pThumbnail} alt={post.pTitle} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
      )}
      <p className="mb-5 text-[0.9375rem] leading-relaxed text-slate-500">
        {stripHtml(post.pContent ?? "").slice(0, 220)}…
      </p>
      <div className="flex items-center gap-3 text-xs text-slate-400">
        {post.author && <span className="font-semibold text-slate-600">{post.author.uName}</span>}
        <span>·</span>
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(post.pCreated_at)}</span>
        <span>·</span>
        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.pView ?? 0} lượt đọc</span>
        <span className="ml-auto flex items-center gap-1 font-semibold text-orange-600">
          Đọc tiếp <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </article>
  );
});

/* ── Post row ────────────────────────────────────────────────────── */
const PostRow = memo(function PostRow({ post }: { post: Blog }) {
  const navigate = useNavigate();
  const slug = post.pUrl || String(post.pId);
  const cfg = TYPE_CONFIG[post.pType];

  return (
    <article
      onClick={() => navigate(`/bai-viet/${slug}`)}
      className="group cursor-pointer border-b border-gray-100 py-6 last:border-0"
    >
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          {cfg && (
            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
              <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </p>
          )}
          <h3 className="mb-2 line-clamp-2 text-[0.9375rem] font-semibold leading-snug text-slate-900 transition-colors group-hover:text-orange-600">
            {post.pTitle}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-slate-400">
            {stripHtml(post.pContent ?? "").slice(0, 130)}…
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            {post.author && <span className="font-medium text-slate-500">{post.author.uName}</span>}
            <span>·</span>
            <span>{formatDate(post.pCreated_at)}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" />{post.pView ?? 0}</span>
          </div>
        </div>
        {post.pThumbnail && (
          <div className="hidden h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg sm:block">
            <img src={post.pThumbnail} alt={post.pTitle} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        )}
      </div>
    </article>
  );
});

/* ── Skeleton ───────────────────────────────────────────────────── */
function BlogListSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Featured skeleton */}
      <div className="border-b border-gray-100 py-10">
        <div className="mb-3 h-2.5 w-20 rounded-full bg-gray-200" />
        <div className="mb-2 h-8 w-4/5 rounded-lg bg-gray-200" />
        <div className="mb-5 h-8 w-1/2 rounded-lg bg-gray-200" />
        <div className="mb-5 space-y-2">
          <div className="h-4 rounded bg-gray-100" />
          <div className="h-4 rounded bg-gray-100" />
          <div className="h-4 w-2/3 rounded bg-gray-100" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-16 rounded-full bg-gray-200" />
          <div className="h-3 w-3 rounded-full bg-gray-200" />
          <div className="h-3 w-24 rounded-full bg-gray-200" />
          <div className="h-3 w-3 rounded-full bg-gray-200" />
          <div className="h-3 w-16 rounded-full bg-gray-200" />
        </div>
      </div>
      {/* Post row skeletons */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="border-b border-gray-100 py-6">
          <div className="flex items-start gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-2.5 w-16 rounded-full bg-gray-200" />
              <div className="h-5 w-3/4 rounded-lg bg-gray-200" />
              <div className="h-4 rounded bg-gray-100" />
              <div className="h-4 w-2/3 rounded bg-gray-100" />
              <div className="flex gap-2 pt-1">
                <div className="h-3 w-12 rounded-full bg-gray-200" />
                <div className="h-3 w-3 rounded-full bg-gray-200" />
                <div className="h-3 w-20 rounded-full bg-gray-200" />
              </div>
            </div>
            <div className="hidden h-20 w-28 flex-shrink-0 rounded-lg bg-gray-100 sm:block" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══ Page ══════════════════════════════════════════════════════════ */
export function PublicBlogList() {
  usePageTitle("Bài viết — NamThuEdu");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts]         = useState<Blog[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState(searchParams.get("search") ?? "");
  const [activeType, setActiveType] = useState(searchParams.get("type") ?? "");
  const [page, setPage]           = useState(Number(searchParams.get("page") ?? 1));
  const [lastPage, setLastPage]   = useState(1);
  const [total, setTotal]         = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    publicBlogApi
      .getPosts({ type: activeType || undefined, search: search || undefined, page, per_page: 12 })
      .then((res: any) => {
        if (cancelled) return;
        const paginator = res?.data?.data;
        setPosts(paginator?.data ?? []);
        setLastPage(paginator?.last_page ?? 1);
        setTotal(paginator?.total ?? 0);
      })
      .catch(() => { if (!cancelled) setPosts([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [activeType, search, page]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchParams({ type: activeType, search, page: "1" });
  }, [activeType, search, setSearchParams]);

  const handleTypeChange = useCallback((type: string) => {
    setActiveType(type);
    setPage(1);
    setSearchParams({ type, search, page: "1" });
  }, [search, setSearchParams]);

  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      {/* ── Page header ── */}
      <div className="border-b border-gray-100 px-4 py-7">
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.15em] text-orange-500">NamThuEdu</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bài viết & Kiến thức</h1>
          </div>
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm bài viết…"
                className="w-44 rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-sm text-slate-800 placeholder-gray-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </form>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4">
        {loading ? (
          <BlogListSkeleton />
        ) : posts.length === 0 ? (
          <div className="flex h-72 flex-col items-center justify-center gap-4">
            <BookOpen className="h-10 w-10 text-gray-200" />
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600">Chưa có bài viết nào</p>
              <p className="mt-1 text-xs text-slate-400">
                {search ? "Không tìm thấy kết quả phù hợp" : "Các bài viết sẽ xuất hiện tại đây"}
              </p>
            </div>
            {search && (
              <button
                onClick={() => { setSearch(""); setPage(1); }}
                className="rounded-lg border border-gray-200 px-4 py-1.5 text-xs font-medium text-slate-600 hover:border-orange-300 hover:text-orange-600 transition-colors"
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>
        ) : (
          <>
            {featured && <FeaturedCard post={featured} />}
            {rest.map((post) => (
              <PostRow key={post.pId} post={post} />
            ))}
          </>
        )}

        {/* ── Pagination ── */}
        {lastPage > 1 && (
          <div className="mt-12 flex items-center justify-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-gray-100 hover:text-slate-700 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-orange-500 text-white"
                    : "text-slate-500 hover:bg-gray-100 hover:text-slate-800"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              disabled={page >= lastPage}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-gray-100 hover:text-slate-700 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ── CTA ── */}
        <div className="mt-16 flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-8 py-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">NamThuEdu</p>
          <h3 className="text-xl font-bold text-slate-900">Muốn học trực tiếp cùng giáo viên?</h3>
          <p className="max-w-sm text-sm text-slate-500">Đăng ký để được tư vấn lộ trình học phù hợp với mục tiêu của bạn</p>
          <button
            onClick={() => navigate("/dang-nhap")}
            className="mt-2 inline-flex items-center gap-2 rounded-xl border border-orange-200 px-6 py-2.5 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors"
          >
            Bắt đầu ngay <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
