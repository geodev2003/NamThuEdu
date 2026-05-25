import { useEffect, useState, useRef } from "react";
import { X, Shield, FileText, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "../../../../services/api";

interface LegalApiCache { legal_vi: Record<string, any> | null; legal_en: Record<string, any> | null; }
let _legalCache: LegalApiCache | null = null;
let _legalFetchPromise: Promise<LegalApiCache> | null = null;

async function fetchLegalContent(): Promise<LegalApiCache> {
  if (_legalCache) return _legalCache;
  if (_legalFetchPromise) return _legalFetchPromise;
  _legalFetchPromise = api
    .get<{ status: string; data: LegalApiCache }>("/legal-content")
    .then(r => { _legalCache = r.data.data; return _legalCache!; })
    .catch(() => ({ legal_vi: null, legal_en: null }));
  return _legalFetchPromise;
}

type ModalType = "privacy" | "terms" | null;
interface Section { title: string; body: string; }

interface LegalModalProps {
  type: ModalType;
  onClose: () => void;
}

function AccordionList({ sections }: { sections: Section[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 overflow-hidden">
      {sections.map((section, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={section.title}>
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-orange-50/60"
            >
              <span className="text-sm font-semibold text-slate-800">{section.title}</span>
              <ChevronDown
                className="h-4 w-4 flex-shrink-0 text-orange-400 transition-transform duration-200"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>
            {isOpen && (
              <div
                className="px-4 pb-4 pt-1 text-sm leading-relaxed text-slate-500"
                style={{ animation: "sectionOpen 0.2s ease-out both" }}
              >
                {section.body}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  const { t, i18n } = useTranslation();
  const k = `landing.legal`;
  const [dbCache, setDbCache] = useState<LegalApiCache | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (type) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [type]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (!type || fetchedRef.current) return;
    fetchedRef.current = true;
    fetchLegalContent().then(cache => {
      _legalCache = cache;
      setDbCache(cache);
    });
  }, [type]);

  if (!type) return null;

  const isPrivacy = type === "privacy";
  const sub = isPrivacy ? "privacy" : "terms";
  const title      = t(`${k}.${sub}.title`);
  const intro      = t(`${k}.${sub}.intro`);
  const contactSfx = t(`${k}.${sub}.contactSuffix`);
  const Icon       = isPrivacy ? Shield : FileText;

  const currentLang = i18n.language.startsWith("en") ? "en" : "vi";
  const activeCache = dbCache ?? _legalCache;
  const dbData = activeCache?.[`legal_${currentLang}` as keyof LegalApiCache] as Record<string, any> | null;
  const sections: Section[] = (dbData?.[sub]?.sections as Section[] | undefined)
    ?? (t(`${k}.${sub}.sections`, { returnObjects: true }) as Section[]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center p-4 sm:items-center"
      style={{ animation: "backdropIn 0.25s ease-out both" }}
      onClick={onClose}
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)" }} />

      {/* Modal card */}
      <div
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ animation: "cardUp 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex-shrink-0 bg-white px-6 pt-5 pb-4">
          {/* Orange accent left bar */}
          <div className="absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-gradient-to-b from-orange-500 to-amber-400" />

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-50 ring-1 ring-orange-200">
                <Icon className="h-6 w-6 text-orange-500" />
              </div>

              <div>
                {/* Eyebrow */}
                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-orange-500">
                  NamThu Education
                </p>
                {/* Title */}
                <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {title}
                </h2>
                {/* Meta */}
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {t(`${k}.lastUpdated`)}: {t(`${k}.date`)}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all hover:bg-orange-100 hover:text-orange-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Bottom divider */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-orange-200 via-orange-100 to-transparent" />
        </div>

        {/* Intro strip */}
        <div className="flex-shrink-0 border-b border-amber-100/60 bg-amber-50/40 px-6 py-3">
          <p className="text-xs leading-relaxed text-slate-600">{intro}</p>
        </div>

        {/* Scrollable sections */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <AccordionList sections={sections} />

          {/* Contact note */}
          <div className="mt-6 rounded-xl border border-orange-100 bg-orange-50 p-4" style={{ animation: "fadeSlideIn 0.3s ease-out 0.32s both" }}>
            <p className="text-xs leading-relaxed text-slate-600">
              <span className="font-semibold text-orange-700">Liên hệ: </span>
              {t(`${k}.contactNote`)}{" "}
              <a href="mailto:hello@namthu.vn" className="font-medium text-orange-600 underline underline-offset-2">
                hello@namthu.vn
              </a>{" "}
              {t(`${k}.contactOr`)}{" "}
              <a href="tel:0776818160" className="font-medium text-orange-600">0776.818.160</a>
              {contactSfx ? ` (${contactSfx})` : ""}.
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="flex-shrink-0 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-105 hover:shadow-md active:scale-[0.98]"
          >
            {t(`${k}.understood`)}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes sectionOpen {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cardUp {
          from { opacity: 0; transform: translateY(32px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)     scale(1);   }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
}
