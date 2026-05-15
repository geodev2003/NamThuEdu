import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { publicBlogApi, type Blog } from "../../../services/blogApi";
import { Header, Footer } from "./components";
import {
  ArrowLeft,
  Calendar,
  Eye,
  BookOpen,
  Lightbulb,
  BookMarked,
  GraduationCap,
  Newspaper,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  grammar:    { label: "Ngữ pháp",  icon: BookOpen,      color: "text-blue-600",    bg: "bg-blue-50" },
  tips:       { label: "Mẹo học",   icon: Lightbulb,     color: "text-amber-600",   bg: "bg-amber-50" },
  vocabulary: { label: "Từ vựng",   icon: BookMarked,    color: "text-violet-600",  bg: "bg-violet-50" },
  teaching:   { label: "Giảng dạy", icon: GraduationCap, color: "text-emerald-600", bg: "bg-emerald-50" },
  news:       { label: "Tin tức",   icon: Newspaper,     color: "text-orange-600",  bg: "bg-orange-50" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" });
}

function BlogDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-10">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-3 w-16 rounded-full bg-gray-200" />
        <div className="h-3 w-3 rounded-full bg-gray-200" />
        <div className="h-3 w-16 rounded-full bg-gray-200" />
        <div className="h-3 w-3 rounded-full bg-gray-200" />
        <div className="h-3 w-32 rounded-full bg-gray-200" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        {/* Main */}
        <div>
          <div className="mb-4 h-6 w-20 rounded-full bg-gray-200" />
          <div className="mb-2 h-9 w-full rounded-lg bg-gray-200" />
          <div className="mb-6 h-9 w-2/3 rounded-lg bg-gray-200" />
          <div className="mb-6 flex gap-3">
            <div className="h-4 w-16 rounded-full bg-gray-200" />
            <div className="h-4 w-3 rounded-full bg-gray-200" />
            <div className="h-4 w-24 rounded-full bg-gray-200" />
          </div>
          <div className="mb-8 h-72 w-full rounded-xl bg-gray-200" />
          <div className="space-y-3">
            {[1,1,1,1,0.75,1,1,0.6,1,1,1,0.8].map((w, i) => (
              <div key={i} className="h-4 rounded bg-gray-100" style={{ width: `${w * 100}%` }} />
            ))}
          </div>
        </div>
        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="rounded-xl bg-gray-50 p-5">
            <div className="mb-4 h-5 w-28 rounded-lg bg-gray-200" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-3 py-3">
                <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full rounded bg-gray-200" />
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-16 rounded-full bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PublicBlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [ctaInView, setCtaInView] = useState(true);
  const [flyPos, setFlyPos] = useState<{ sx: number; sy: number; ex: number; ey: number } | null>(null);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setCtaInView(entry.isIntersecting);
        window.dispatchEvent(
          new CustomEvent("blog-cta-visible", { detail: { visible: entry.isIntersecting } })
        );
        if (!entry.isIntersecting) {
          const ctaRect = el.getBoundingClientRect();
          const btnEl = document.querySelector<HTMLElement>('[data-blog-login]');
          const btnRect = btnEl?.getBoundingClientRect();
          if (btnRect) {
            setFlyPos({
              sx: ctaRect.left + ctaRect.width / 2 - 8,
              sy: Math.max(ctaRect.top + ctaRect.height / 2 - 8, 4),
              ex: btnRect.left + btnRect.width / 2 - 8,
              ey: btnRect.top + btnRect.height / 2 - 8,
            });
            setTimeout(() => setFlyPos(null), 700);
          }
        }
      },
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      window.dispatchEvent(new CustomEvent("blog-cta-visible", { detail: { visible: true } }));
    };
  });

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    let postId = 0;
    publicBlogApi
      .getPost(slug)
      .then((res: any) => {
        if (cancelled) return;
        const data: Blog = res?.data?.data;
        if (!data) { setNotFound(true); return; }
        setPost(data);
        postId = data.pId;
        return publicBlogApi.getPosts({ type: data.pType, per_page: 4 });
      })
      .then((res: any) => {
        if (cancelled || !res) return;
        const items: Blog[] = res?.data?.data?.data ?? [];
        setRelated(items.filter((p) => p.pId !== postId).slice(0, 3));
      })
      .catch(() => { if (!cancelled) setNotFound(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <BlogDetailSkeleton />
        <Footer />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex h-96 flex-col items-center justify-center gap-4 text-slate-400">
          <BookOpen className="h-14 w-14 opacity-30" />
          <p className="text-lg font-medium">Không tìm thấy bài viết</p>
          <button
            onClick={() => navigate("/bai-viet")}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const cfg = TYPE_CONFIG[post.pType] ?? TYPE_CONFIG.news;
  const Icon = cfg.icon;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-xs text-slate-400">
          <Link to="/" className="hover:text-orange-500 transition-colors">Trang chủ</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/bai-viet" className="hover:text-orange-500 transition-colors">Bài viết</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="line-clamp-1 text-slate-600">{post.pTitle}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          {/* ── Main content ── */}
          <article>
            {/* Type badge */}
            <span className={`mb-4 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color}`}>
              <Icon className="h-3 w-3" />
              {cfg.label}
            </span>

            {/* Title */}
            <h1 className="mb-4 text-2xl font-bold leading-snug text-slate-900 md:text-3xl">
              {post.pTitle}
            </h1>

            {/* Meta */}
            <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-gray-100 pb-5 text-xs text-slate-400">
              {post.author && (
                <span className="font-semibold text-slate-600">{post.author.uName}</span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.pCreated_at)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {post.pView ?? 0} lượt xem
              </span>
              {post.category && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-slate-500">
                  {post.category.caName}
                </span>
              )}
            </div>

            {/* Thumbnail */}
            {post.pThumbnail && (
              <div className="mb-8 overflow-hidden rounded-xl">
                <img
                  src={post.pThumbnail}
                  alt={post.pTitle}
                  loading="lazy"
                  decoding="async"
                  className="h-72 w-full object-cover"
                />
              </div>
            )}

            {/* Content — render HTML safely */}
            <div
              className="prose prose-slate prose-sm max-w-none prose-headings:font-bold prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: post.pContent ?? "" }}
            />

            {/* Back link */}
            <div className="mt-10 border-t border-gray-100 pt-6">
              <button
                onClick={() => navigate("/bai-viet")}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-orange-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Quay lại danh sách bài viết
              </button>
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="space-y-6">
            {/* Related posts */}
            {related.length > 0 && (
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                <h3 className="mb-4 text-sm font-bold text-slate-800">Bài viết liên quan</h3>
                <div className="space-y-4">
                  {related.map((r) => {
                    const rSlug = r.pUrl || String(r.pId);
                    return (
                      <button
                        key={r.pId}
                        onClick={() => navigate(`/bai-viet/${rSlug}`)}
                        className="group flex w-full gap-3 text-left"
                      >
                        <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                          {r.pThumbnail
                            ? <img src={r.pThumbnail} alt="" loading="lazy" decoding="async" className="h-full w-full rounded-lg object-cover" />
                            : <BookOpen className="h-4 w-4 text-orange-400" />
                          }
                        </div>
                        <div className="flex-1">
                          <p className="line-clamp-2 text-sm font-medium text-slate-700 group-hover:text-orange-600 transition-colors">
                            {r.pTitle}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">{formatDate(r.pCreated_at)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => navigate(`/bai-viet?type=${post.pType}`)}
                  className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-gray-200 py-2 text-xs font-medium text-slate-500 hover:border-orange-200 hover:text-orange-600 transition-colors"
                >
                  Xem thêm <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* CTA sidebar */}
            <div ref={ctaRef} className="rounded-xl bg-gray-950 p-5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-orange-400">NamThuEdu</p>
              <h3 className="mb-2 text-sm font-bold text-white">Học tiếng Anh cùng giáo viên?</h3>
              <p className="mb-4 text-xs text-gray-400">Lộ trình cá nhân hóa theo trình độ và mục tiêu của bạn</p>
              <button
                onClick={() => navigate("/dang-nhap")}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
              >
                Đăng nhập ngay <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Notify header to highlight login button when CTA is off screen */}
          </aside>
        </div>
      </main>

      {/* Flying orb — animates from sidebar CTA center to header login button */}
      <AnimatePresence>
        {flyPos && (
          <motion.div
            key="fly-orb"
            className="pointer-events-none fixed z-[100] h-4 w-4 rounded-full bg-orange-500"
            style={{ left: flyPos.sx, top: flyPos.sy }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              x: flyPos.ex - flyPos.sx,
              y: flyPos.ey - flyPos.sy,
              scale: [0, 1.8, 1.2, 0.6, 0],
              opacity: [0, 1, 1, 0.8, 0],
            }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
