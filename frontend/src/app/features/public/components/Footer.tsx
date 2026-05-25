// THEME: Orange & White - Modern Educational Design
/**
 * Footer Component - Redesigned with complete information
 * Based on NamThu Education banner and header
 */

import { useState } from 'react';
import { GraduationCap, Phone, Mail, MapPin, Clock, Facebook, Youtube, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../../hooks/useToast';
import { ToastContainer } from '../../../../components/ui/ToastContainer';
import { LegalModal } from './LegalModal';

export function Footer() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const f = 'landing.footer';
  const { toasts, removeToast, info } = useToast();
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const courses = t(`${f}.courses.items`, { returnObjects: true }) as string[];
  const promos  = t(`${f}.support.promos`,  { returnObjects: true }) as string[];

  return (
    <>
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Description */}
          <div className="lg:pr-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">NamThuEdu</span>
                <span className="text-[10px] leading-none text-gray-400">
                  {t(`${f}.brand.tagline`)}
                </span>
              </div>
            </div>

            <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-400">
              {t(`${f}.brand.description`)}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  info('Đang chuyển đến trang Facebook của NamThuEdu...');
                  setTimeout(() => window.open('https://www.facebook.com/profile.php?id=61573591333617', '_blank', 'noopener,noreferrer'), 600);
                }}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-md transition-all hover:from-orange-600 hover:to-orange-700">
                <Facebook className="h-4 w-4 text-white" />
              </button>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-md transition-all hover:from-orange-600 hover:to-orange-700">
                <Youtube className="h-4 w-4 text-white" />
              </a>
              <a href={t(`${f}.contact.emailHref`)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-md transition-all hover:from-orange-600 hover:to-orange-700">
                <Mail className="h-4 w-4 text-white" />
              </a>
            </div>
          </div>

          {/* Column 2: Courses */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-white">{t(`${f}.courses.title`)}</h3>
            <ul className="space-y-2.5 text-sm">
              {courses.map((name) => (
                <li key={name}>
                  <button onClick={() => navigate('/dang-nhap')}
                    className="cursor-pointer text-left text-gray-400 transition-colors hover:text-orange-400">
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-white">{t(`${f}.contact.title`)}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={t(`${f}.contact.hotlineHref`)}
                  className="flex cursor-pointer items-start gap-2 text-gray-400 transition-colors hover:text-orange-400">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">{t(`${f}.contact.hotlineLabel`)}</div>
                    <div>{t(`${f}.contact.hotline`)}</div>
                  </div>
                </a>
              </li>
              <li>
                <a href={t(`${f}.contact.emailHref`)}
                  className="flex cursor-pointer items-start gap-2 text-gray-400 transition-colors hover:text-orange-400">
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">{t(`${f}.contact.emailLabel`)}</div>
                    <div>{t(`${f}.contact.emailVal`)}</div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={t(`${f}.contact.addressHref`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex cursor-pointer items-start gap-2 text-gray-400 transition-colors hover:text-orange-400"
                >
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">{t(`${f}.contact.addressLabel`)}</div>
                    <div>{t(`${f}.contact.address`)}</div>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-gray-400">
                  <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">{t(`${f}.contact.scheduleLabel`)}</div>
                    <div>{t(`${f}.contact.schedule`)}</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Promotions */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-white">{t(`${f}.support.title`)}</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('openContactFAB'))}
                  className="cursor-pointer text-gray-400 transition-colors hover:text-orange-400">
                  {t(`${f}.support.register`)}
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('openContactFAB'))}
                  className="cursor-pointer text-gray-400 transition-colors hover:text-orange-400">
                  {t(`${f}.support.consult`)}
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('openContactFAB'))}
                  className="cursor-pointer text-gray-400 transition-colors hover:text-orange-400">
                  {t(`${f}.support.faq`)}
                </button>
              </li>
            </ul>

            {/* Humanitarian note */}
            <div className="mt-6 border-l-2 border-red-500/40 pl-3">
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-red-400/80">
                <span>♥</span>
                {t(`${f}.support.promoTitle`)}
              </p>
              <ul className="space-y-1.5">
                {promos.map((item) => {
                  const [bold, rest] = item.split(" — ");
                  return (
                    <li key={item} className="text-xs leading-snug text-gray-500">
                      <span className="text-gray-400">{bold}</span>
                      {rest && <span className="text-gray-600"> — {rest}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">
            <div className="text-center md:text-left">
              © {new Date().getFullYear()} {t(`${f}.bottom.copyright`)}
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => navigate('/ve-chung-toi')} className="cursor-pointer transition-colors hover:text-orange-400">
                Về chúng tôi
              </button>
              <button onClick={() => setLegalModal('privacy')} className="cursor-pointer transition-colors hover:text-orange-400">
                {t(`${f}.bottom.privacy`)}
              </button>
              <button onClick={() => setLegalModal('terms')} className="cursor-pointer transition-colors hover:text-orange-400">
                {t(`${f}.bottom.terms`)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>

      <ToastContainer toasts={toasts} onClose={removeToast} />
      <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
    </>
  );
}
