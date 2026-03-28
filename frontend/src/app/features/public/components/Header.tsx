/**
 * Landing Page Header Component - 2-Tier Design
 * 
 * Design inspired by VnDoc.com:
 * - Top bar: Logo + Search + Auth buttons (Orange gradient)
 * - Bottom bar: Navigation menu (White with orange accents)
 * - Sticky on scroll
 * - Mobile responsive
 * - UI/UX Pro Max compliant (200ms transitions, smooth scroll, reduced motion)
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Globe, 
  Menu, 
  X, 
  ChevronDown,
  Phone,
  GraduationCap,
  BookOpen,
  Trophy,
  Calendar,
  Mail as MailIcon,
} from 'lucide-react';

export function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Search:', searchQuery);
      // TODO: Implement search functionality
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  // Navigation menu structure
  const navItems = [
    { label: t('landing.header.home'), action: () => navigate('/'), icon: <Globe className="w-4 h-4" /> },
    {
      label: t('landing.header.courses'),
      icon: <BookOpen className="w-4 h-4" />,
      dropdown: [
        { label: t('landing.header.coursesKids'), icon: '🎨', action: () => scrollToSection('kids-courses') },
        { label: t('landing.header.coursesTeens'), icon: '🎮', action: () => scrollToSection('teens-courses') },
        { label: t('landing.header.coursesAdults'), icon: '💼', action: () => scrollToSection('adults-courses') },
        { label: t('landing.header.coursesCommunication'), icon: '💬', action: () => navigate('/khoa-hoc/giao-tiep') },
      ],
    },
    {
      label: t('landing.header.exams'),
      icon: <Trophy className="w-4 h-4" />,
      dropdown: [
        { label: t('landing.header.examsIELTS'), icon: '🎓', action: () => navigate('/luyen-thi/ielts') },
        { label: t('landing.header.examsTOEIC'), icon: '📊', action: () => navigate('/luyen-thi/toeic') },
        { label: t('landing.header.examsCambridge'), icon: '🏆', action: () => navigate('/luyen-thi/cambridge') },
        { label: t('landing.header.examsVSTEP'), icon: '🎯', action: () => navigate('/luyen-thi/vstep') },
        { label: t('landing.header.examsVSAT'), icon: '📚', action: () => navigate('/luyen-thi/vsat') },
      ],
    },
    { label: t('landing.header.schedule'), action: () => scrollToSection('schedule'), icon: <Calendar className="w-4 h-4" /> },
    { label: t('landing.header.contact'), action: () => scrollToSection('contact'), icon: <MailIcon className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* 2-Tier Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled ? 'shadow-lg' : ''
        }`}
      >
        {/* Top Bar - Orange Gradient */}
        <div className="bg-gradient-to-r from-[#FF8C42] via-[#FF6B35] to-[#FF8C42]">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16 gap-4">
              
              {/* Logo */}
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-3 group cursor-pointer flex-shrink-0"
              >
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:bg-white/30 transition-all duration-200">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-white leading-tight">
                    {t('landing.header.logo')}
                  </h1>
                  <p className="text-xs text-white/80">{t('landing.header.tagline')}</p>
                </div>
              </button>

              {/* Search Bar - Center */}
              <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF8C42] transition-colors duration-200">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('landing.header.searchPlaceholder')}
                    className="w-full pl-12 pr-4 py-2.5 bg-white/95 backdrop-blur-sm border-2 border-transparent focus:border-white rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-md"
                  />
                </div>
              </form>

              {/* Right side - Auth buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => navigate('/dang-nhap')}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-xl transition-all duration-200 font-medium cursor-pointer"
                >
                  {t('landing.header.login')}
                </button>
                <button
                  onClick={() => navigate('/dang-ky')}
                  className="flex items-center gap-2 px-5 py-2 bg-white text-[#FF6B35] hover:bg-gray-50 rounded-xl transition-all duration-200 font-bold shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span className="hidden sm:inline">{t('landing.header.register')}</span>
                  <span className="sm:hidden">{t('landing.header.register')}</span>
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/20 transition-all duration-200 cursor-pointer text-white"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Navigation Menu (White) */}
        <div className="bg-white border-b border-gray-200 hidden lg:block">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-center gap-1 h-12">
              {navItems.map((item, index) => (
                <div key={index} className="relative">
                  {item.dropdown ? (
                    <div
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="relative"
                    >
                      <button
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#FF8C42] hover:bg-[#FFF9F0] rounded-lg transition-all duration-200 font-medium cursor-pointer"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeDropdown === item.label && (
                        <div 
                          className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50"
                          style={{
                            animation: 'fadeIn 200ms ease-out',
                          }}
                        >
                          {item.dropdown.map((subItem, subIndex) => (
                            <button
                              key={subIndex}
                              onClick={subItem.action}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:text-[#FF8C42] hover:bg-[#FFF9F0] transition-all duration-200 cursor-pointer text-left"
                            >
                              <span className="text-lg">{subItem.icon}</span>
                              <span className="font-medium text-sm">{subItem.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={item.action}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#FF8C42] hover:bg-[#FFF9F0] rounded-lg transition-all duration-200 font-medium cursor-pointer"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden bg-white border-t border-gray-200 shadow-xl"
            style={{
              animation: 'slideDown 200ms ease-out',
            }}
          >
            <div className="container mx-auto px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('landing.header.searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#FF8C42] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFF4E6] transition-all duration-200"
                  />
                </div>
              </form>

              {/* Mobile Nav Items */}
              <nav className="space-y-1">
                {navItems.map((item, index) => (
                  <div key={index}>
                    {item.dropdown ? (
                      <div>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                          className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-[#FFF9F0] rounded-xl transition-all duration-200 font-medium cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
                            activeDropdown === item.label ? 'rotate-180' : ''
                          }`} />
                        </button>
                        {activeDropdown === item.label && (
                          <div className="pl-4 mt-1 space-y-1">
                            {item.dropdown.map((subItem, subIndex) => (
                              <button
                                key={subIndex}
                                onClick={subItem.action}
                                className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-[#FF8C42] hover:bg-[#FFF9F0] rounded-lg transition-all duration-200 cursor-pointer"
                              >
                                <span className="text-lg">{subItem.icon}</span>
                                <span>{subItem.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={item.action}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#FFF9F0] rounded-xl transition-all duration-200 font-medium cursor-pointer"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile Contact Info */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <a 
                  href="tel:0776818160"
                  className="flex items-center gap-3 px-4 py-3 bg-[#FFF4E6] text-[#FF6B35] rounded-xl font-semibold cursor-pointer hover:bg-[#FFE0B2] transition-colors duration-200"
                >
                  <Phone className="w-5 h-5" />
                  <div>
                    <div className="text-xs text-gray-600">{t('landing.header.hotline')}</div>
                    <div>0776.818.160</div>
                  </div>
                </a>
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-sm">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <GraduationCap className="w-4 h-4" />
                    <span className="font-semibold">{t('landing.header.promotions')}</span>
                  </div>
                  <ul className="text-gray-600 space-y-1 ml-6">
                    <li>• {t('landing.header.promotionGroup')}</li>
                    <li>• {t('landing.header.promotionDisadvantaged')}</li>
                    <li>• {t('landing.header.promotionMaterials')}</li>
                  </ul>
                </div>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="mt-4 space-y-2 sm:hidden">
                <button
                  onClick={() => navigate('/dang-nhap')}
                  className="w-full px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium cursor-pointer"
                >
                  {t('landing.header.login')}
                </button>
                <button
                  onClick={() => navigate('/dang-ky')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#FF8C42] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#FF5722] text-white rounded-xl transition-all duration-200 font-semibold shadow-md cursor-pointer"
                >
                  {t('landing.header.registerNow')}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent content jump */}
      <div className="h-28" />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}
