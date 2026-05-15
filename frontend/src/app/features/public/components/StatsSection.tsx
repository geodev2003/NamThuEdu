import { BookOpen, User, MessageCircle, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FEATURES = [
  { key: 'curriculum', Icon: BookOpen,      iconBg: 'bg-orange-100',  iconColor: 'text-orange-600'  },
  { key: 'personalized', Icon: User,         iconBg: 'bg-blue-100',    iconColor: 'text-blue-600'    },
  { key: 'community',  Icon: MessageCircle,  iconBg: 'bg-green-100',   iconColor: 'text-green-600'   },
  { key: 'practice',   Icon: FileText,       iconBg: 'bg-purple-100',  iconColor: 'text-purple-600'  },
] as const;

export function StatsSection() {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
        <div className="flex flex-col lg:flex-row">

          {/* ── LEFT — Title + feature grid ─────────────────────────────── */}
          <div className="flex-1 p-6 lg:py-10 lg:pl-12 lg:pr-8">
            <h3 className="mb-8 text-xl font-bold leading-snug text-slate-900 lg:text-2xl">
              {t('landing.why.title')}
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {FEATURES.map(({ key, Icon, iconBg, iconColor }) => (
                <div key={key} className="flex items-start gap-4 lg:flex-col">
                  <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconBg} lg:h-12 lg:w-12`}>
                    <Icon className={`h-5 w-5 lg:h-6 lg:w-6 ${iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <strong className="mb-1 block text-base font-bold text-slate-900 lg:text-lg">
                      {t(`landing.why.items.${key}.title`)}
                    </strong>
                    <p className="text-sm leading-snug text-slate-500">
                      {t(`landing.why.items.${key}.desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT — Image ───────────────────────────────────────────── */}
          <div className="relative hidden flex-shrink-0 lg:block lg:w-[380px]">
            <img
              src="/images/Why1.webp"
              alt={t('landing.why.title')}
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
