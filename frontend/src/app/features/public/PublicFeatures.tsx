import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Header, Footer } from "./components";
import { BlogSEO } from "../../../components/shared/BlogSEO";
import { ArrowRight } from "lucide-react";

interface ManifestoItem { num: string; title: string; desc: string; }
interface FaqItem { q: string; a: string; }

export function PublicFeatures() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fp = "landing.features_page";

  const manifesto  = t(`${fp}.manifesto.items`,  { returnObjects: true }) as ManifestoItem[];
  const traditional = t(`${fp}.comparison.traditional`, { returnObjects: true }) as string[];
  const namthu     = t(`${fp}.comparison.namthu`,  { returnObjects: true }) as string[];
  const faqs       = t(`${fp}.faq.items`,          { returnObjects: true }) as FaqItem[];
  const commitments = t(`${fp}.commitments`,        { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen text-slate-900" style={{ backgroundColor: "#FFFBF5" }}>
      <BlogSEO
        title={t(`${fp}.seo.title`)}
        description={t(`${fp}.seo.description`)}
        canonical="/tinh-nang"
        type="website"
      />
      <Header />

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section className="px-4 pb-16 pt-14" style={{ backgroundColor: "#FFFBF5" }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-16">

            {/* Left — text */}
            <div className="flex-1 lg:pt-4">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-400">
                {t(`${fp}.hero.eyebrow`)}
              </p>
              <h1 className="mb-5 text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl" style={{ fontFamily: "'Playpen Sans', 'Baloo 2', cursive" }}>
                {t(`${fp}.hero.headline1`)}<br />
                <span
                  className="relative inline-block text-orange-500"
                  style={{ fontWeight: 800, fontSize: "1.15em", letterSpacing: "-0.01em" }}
                >
                  {t(`${fp}.hero.headline2`)}
                  <svg aria-hidden="true" viewBox="0 0 220 10" className="absolute -bottom-1 left-0 w-full" preserveAspectRatio="none">
                    <path d="M3 7 C45 2, 95 8, 140 5 C170 3, 195 7, 217 4" stroke="#F97316" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
                  </svg>
                </span>
              </h1>
              <p className="mb-8 max-w-md text-base leading-relaxed text-stone-500">
                {t(`${fp}.hero.sub`)}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/dang-nhap")}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-orange-600"
                  style={{ boxShadow: "3px 3px 0 #9a3412" }}
                >
                  {t(`${fp}.hero.ctaPrimary`)} <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate("/bai-viet")}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 underline decoration-stone-300 underline-offset-4 hover:text-orange-600 hover:decoration-orange-400"
                >
                  {t(`${fp}.hero.ctaSecondary`)}
                </button>
              </div>
            </div>

            {/* Right — diploma seal */}
            <div className="flex w-52 flex-shrink-0 items-center justify-center lg:w-64">
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm" aria-hidden="true">
                <defs>
                  <path id="cp" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
                </defs>
                <circle cx="100" cy="100" r="90" fill="none" stroke="#F59E0B" strokeWidth="1.5" opacity="0.45" />
                <circle cx="100" cy="100" r="84" fill="none" stroke="#F59E0B" strokeWidth="0.5" opacity="0.3" />
                <text fontSize="9.5" fontFamily="system-ui" fontWeight="600" letterSpacing="3" fill="#78716C" opacity="0.8">
                  <textPath href="#cp">NAMTHUEDU · GIÁO DỤC TIẾNG ANH · VIỆT NAM ·</textPath>
                </text>
                <circle cx="100" cy="100" r="56" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.35" />
                <circle cx="100" cy="100" r="50" fill="#FFFBF5" />
                <text x="100" y="88" textAnchor="middle" fontSize="10" fill="#78716C" fontFamily="system-ui" fontWeight="500" letterSpacing="1.5">EST.</text>
                <text x="100" y="110" textAnchor="middle" fontSize="24" fill="#134E4A" fontFamily="system-ui" fontWeight="800">2026</text>
                <line x1="70" y1="117" x2="130" y2="117" stroke="#F59E0B" strokeWidth="1" opacity="0.55" />
                <text x="100" y="130" textAnchor="middle" fontSize="8.5" fill="#78716C" fontFamily="system-ui" letterSpacing="2">VIỆT NAM</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ══ COMMITMENTS STRIP ════════════════════════════════════════ */}
      <section className="border-y px-4 py-8" style={{ borderColor: "#E7E5E4", backgroundColor: "#F5F0E8" }}>
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {commitments.map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 text-xs font-bold" style={{ color: "#F59E0B" }}>
                  {String(i + 1).padStart(2, "0")}.
                </span>
                <p className="text-sm leading-relaxed text-stone-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main>

        {/* ══ NUMBERED MANIFESTO ════════════════════════════════════════ */}
        <section className="px-4 py-20" style={{ backgroundColor: "#FFFBF5" }}>
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.25em] text-orange-500">{t(`${fp}.manifesto.eyebrow`)}</p>
                <h2 className="text-2xl font-extrabold leading-snug text-slate-900">
                  {t(`${fp}.manifesto.title`)} —&nbsp;
                  <span className="text-stone-400 font-normal">{t(`${fp}.manifesto.titleSub`)}</span>
                </h2>
              </div>
              <span className="hidden h-px w-24 self-center bg-stone-200 sm:block" />
            </div>

            <div className="grid gap-px sm:grid-cols-2" style={{ backgroundColor: "#E7E5E4" }}>
              {manifesto.map(({ num, title, desc }) => (
                <div
                  key={num}
                  className="group flex flex-col gap-3 p-6 transition-colors duration-150 hover:bg-orange-50/60"
                  style={{ backgroundColor: "#FFFBF5" }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white"
                      style={{ backgroundColor: "#134E4A" }}
                    >
                      {num}
                    </span>
                    <h3 className="text-[0.9375rem] font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                      {title}
                    </h3>
                  </div>
                  <p className="pl-10 text-sm leading-relaxed text-stone-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ EDITORIAL COMPARISON ══════════════════════════════════════ */}
        <section className="px-4 py-20" style={{ backgroundColor: "#0F2926" }}>
          <div className="mx-auto max-w-3xl">

            {/* Header */}
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: "#F59E0B" }}>
              {t(`${fp}.comparison.eyebrow`)}
            </p>
            <h2 className="mb-12 max-w-lg text-2xl font-extrabold leading-snug text-white">
              {t(`${fp}.comparison.title`)}
            </h2>

            {/* Column headers */}
            <div className="mb-1 grid grid-cols-[1fr_36px_1fr] gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.35)" }}>
                {t(`${fp}.comparison.leftTitle`)}
              </span>
              <span />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#F59E0B" }}>
                {t(`${fp}.comparison.rightTitle`)}
              </span>
            </div>

            {/* Paired rows */}
            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              {traditional.map((pain, i) => (
                <div key={i} className="grid grid-cols-[1fr_36px_1fr] items-center gap-3 py-5">
                  {/* Pain — muted italic */}
                  <p className="text-sm italic leading-snug" style={{ color: "rgba(255,255,255,0.38)" }}>
                    {pain}
                  </p>
                  {/* Arrow */}
                  <span className="text-center text-base" style={{ color: "rgba(255,255,255,0.18)" }}>→</span>
                  {/* Solution — white bold */}
                  <p className="text-sm font-semibold leading-snug text-white">
                    <span className="mr-1.5 font-bold" style={{ color: "#F59E0B" }}>✓</span>
                    {namthu[i]}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ══ QUOTE ═════════════════════════════════════════════════════ */}
        <section className="px-4 py-24" style={{ backgroundColor: "#FFFBF5" }}>
          <div className="mx-auto max-w-2xl">

            {/* Quote block */}
            <div className="relative border-l-2 pl-8" style={{ borderColor: "#F59E0B" }}>
              {/* Decorative open-quote */}
              <span
                className="pointer-events-none absolute -top-8 left-4 select-none leading-none"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "7rem",
                  color: "#F59E0B",
                  opacity: 0.15,
                  lineHeight: 1,
                }}
              >"</span>

              <blockquote
                className="relative text-2xl leading-relaxed text-slate-800 sm:text-3xl"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                }}
              >
                {t(`${fp}.quote.text`)}
              </blockquote>

              <footer className="mt-6 flex items-center gap-4">
                <div className="h-px w-8 flex-shrink-0" style={{ backgroundColor: "#F59E0B" }} />
                <cite
                  className="not-italic text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "#78716C" }}
                >
                  {t(`${fp}.quote.attribution`)}
                </cite>
              </footer>
            </div>

            {/* Hairline divider */}
            <div className="my-16 h-px w-full" style={{ backgroundColor: "#E7E5E4" }} />

            {/* FAQ */}
            <dl className="space-y-0">
              <p className="mb-8 text-[11px] font-bold uppercase tracking-[0.25em] text-orange-500">
                {t(`${fp}.faq.eyebrow`)}
              </p>
              {faqs.map(({ q, a }, i) => (
                <div
                  key={i}
                  className="border-t py-6"
                  style={{ borderColor: "#E7E5E4" }}
                >
                  <dt
                    className="mb-3 text-[0.9375rem] font-bold leading-snug text-slate-800"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {q}
                  </dt>
                  <dd className="text-sm leading-relaxed text-stone-500">{a}</dd>
                </div>
              ))}
            </dl>

          </div>
        </section>

        {/* ══ CLOSING CTA ═══════════════════════════════════════════════ */}
        <section className="px-4 pb-20 pt-4" style={{ backgroundColor: "#FFFBF5" }}>
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-stone-200 bg-white px-8 py-12 text-center">
              {/* Ornament */}
              <div className="mb-6 flex items-center justify-center gap-3 text-stone-300">
                <span className="text-2xl">❦</span>
                <div className="h-px w-12 bg-stone-200" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500">{t(`${fp}.cta.ornament`)}</span>
                <div className="h-px w-12 bg-stone-200" />
                <span className="text-2xl">❦</span>
              </div>

              <h3 className="mb-3 text-2xl font-extrabold tracking-tight text-slate-900">
                {t(`${fp}.cta.title`)}
              </h3>
              <p className="mb-8 text-sm leading-relaxed text-stone-500">
                {t(`${fp}.cta.sub`)}
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <button
                  onClick={() => navigate("/dang-nhap")}
                  className="relative overflow-hidden group inline-flex items-center gap-2 rounded-lg bg-orange-500 px-8 py-3 text-sm font-bold text-white transition-all"
                  style={{ boxShadow: "3px 3px 0 #9a3412" }}
                >
                  <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-orange-600 transition-colors duration-300">
                    {t(`${fp}.cta.primary`)} <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
                <a
                  href="tel:0776818160"
                  className="text-sm font-semibold text-stone-500 underline decoration-stone-300 underline-offset-4 hover:text-orange-600 hover:decoration-orange-300"
                >
                  {t(`${fp}.cta.phone`)}
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
