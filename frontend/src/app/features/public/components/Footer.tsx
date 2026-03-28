// THEME: Orange & White - Modern Educational Design
/**
 * Footer Component - Modern design with Orange theme
 */

import { Globe, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-white text-xl">NamThu English</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-md">
              {t('landing.footer.description')}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{t('landing.footer.followUs')}</span>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#FF5722] rounded-full flex items-center justify-center transition-all shadow-md"
              >
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#FF5722] rounded-full flex items-center justify-center transition-all shadow-md"
              >
                <Youtube className="w-4 h-4 text-white" />
              </a>
              <a 
                href="mailto:hello@namthu.edu.vn"
                className="w-9 h-9 bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#FF5722] rounded-full flex items-center justify-center transition-all shadow-md"
              >
                <Mail className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Chúng tôi đề xuất */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm">{t('landing.footer.weRecommend')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FF8C42] transition-colors">
                  {t('landing.footer.aboutUs')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FF8C42] transition-colors">
                  {t('landing.footer.forStudents')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FF8C42] transition-colors">
                  {t('landing.footer.forTeachers')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FF8C42] transition-colors">
                  {t('landing.footer.parentApp')}
                </a>
              </li>
            </ul>
          </div>

          {/* Tài nguyên */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm">{t('landing.footer.resources')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FF8C42] transition-colors">
                  {t('landing.footer.helpCenter')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FF8C42] transition-colors">
                  {t('landing.footer.userGuide')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FF8C42] transition-colors">
                  {t('landing.footer.feedback')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FF8C42] transition-colors">
                  {t('landing.footer.askChannel')}
                </a>
              </li>
            </ul>
          </div>

          {/* Ứng dụng mobile */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm">{t('landing.footer.mobileApp')}</h3>
            <div className="space-y-3">
              <a 
                href="#" 
                className="block bg-black hover:bg-gray-800 rounded-lg p-2 transition-all border border-gray-800 hover:border-[#FF8C42]"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] text-gray-400">{t('landing.footer.downloadOn')}</div>
                    <div className="text-sm font-semibold text-white">{t('landing.footer.appStore')}</div>
                  </div>
                </div>
              </a>
              
              <a 
                href="#" 
                className="block bg-black hover:bg-gray-800 rounded-lg p-2 transition-all border border-gray-800 hover:border-[#FF8C42]"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] text-gray-400">{t('landing.footer.getItOn')}</div>
                    <div className="text-sm font-semibold text-white">{t('landing.footer.googlePlay')}</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>{t('landing.footer.copyright')}</span>
              <span className="hidden md:inline">-</span>
              <span className="hidden md:inline">{t('landing.footer.email')} </span>
              <a href="mailto:hello@namthu.vn" className="text-[#FF8C42] hover:underline">
                hello@namthu.vn
              </a>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-[#FF8C42] transition-colors flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>1900-xxxx</span>
              </a>
              <a href="#" className="hover:text-[#FF8C42] transition-colors flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{t('landing.footer.contactUs')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
