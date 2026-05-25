/**
 * Student Login Component
 * 
 * Clean login form for students matching admin login style
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { login, LoginFormData } from '../../../../services/authApi';
import { usePageTitle, PAGE_TITLES } from '../../../../hooks/usePageTitle';
import { Eye, EyeOff, Phone, Lock, GraduationCap } from 'lucide-react';
import { Header } from '../../public/components/Header';
import { setAuthData, getRememberedPhone } from '../../../../utils/authStorage';

export function StudentLogin() {
  const navigate = useNavigate();
  const { syncWithAuth } = useThemeContext();
  const { t } = useTranslation();
  usePageTitle(PAGE_TITLES.LOGIN);
  
  const [formData, setFormData] = useState<LoginFormData>({
    phone: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedPhone = getRememberedPhone('student');
    if (savedPhone) {
      setFormData(prev => ({ ...prev, phone: savedPhone }));
      setRememberMe(true);
    }
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await login(formData);
      const { access_token, user } = response.data;

      if (user.role !== 'student') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_role');
        setError(t('auth.studentLogin.errorWrongRole'));
        return;
      }

      setAuthData(access_token, user as unknown as Record<string, unknown>, rememberMe);

      // Sync theme with user data
      syncWithAuth(user);

      // Check if student has class
      if (!user.class_id) {
        navigate('/hoc-vien/cho-xep-lop');
        return;
      }

      // Redirect based on age_group
      switch (user.age_group) {
        case 'kids':
          navigate('/hoc-vien/kids');
          break;
        case 'teens':
          navigate('/hoc-vien/teens');
          break;
        case 'adults':
          navigate('/hoc-vien/adults');
          break;
        default:
          navigate('/hoc-vien/teens');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.studentLogin.errorDefault'));
      setFormData(prev => ({ ...prev, password: '' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(145deg, #FFF7ED 0%, #FFEDD5 100%)' }}
    >
      {/* ── Full-width Header ─────────────────────────────────────────────── */}
      <Header />

      {/* ── Content row ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 bg-white">

        {/* ── LEFT: Image panel (hidden on mobile) ─────────────────────── */}
        <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] items-center justify-end pr-4 pl-8 py-8">
          <div className="overflow-hidden" style={{ maxWidth: '770px', width: '100%', borderRadius: '40px' }}>
            <img
              src="/images/form-login.png"
              alt="NamThuEdu"
              className="w-full h-auto block"
            />
          </div>
        </div>

        {/* ── RIGHT: Form panel ──────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-start justify-center px-6 py-10 lg:px-10 xl:px-14">

          <div className="w-full max-w-[460px]">

          {/* Heading */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{t('auth.studentLogin.title')}</h1>
          <p className="text-gray-500 text-sm mb-8">{t('auth.studentLogin.subtitle')}</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t('auth.studentLogin.phoneLabel')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  autoFocus
                  placeholder={t('auth.studentLogin.phonePlaceholder')}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t('auth.studentLogin.passwordLabel')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder={t('auth.studentLogin.passwordPlaceholder')}
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Remember me + hint */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <div
                  onClick={() => setRememberMe(v => !v)}
                  className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer ${
                    rememberMe ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                    rememberMe ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </div>
                <span className="text-sm text-gray-600 select-none">{t('auth.studentLogin.rememberMe')}</span>
              </label>
              <span className="text-xs text-gray-400">{t('auth.studentLogin.securityNote')}</span>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 font-bold text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
              style={{
                background: isLoading ? '#94A3B8' : 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                boxShadow: isLoading ? 'none' : '0 4px 14px rgba(234, 88, 12, 0.40)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(234, 88, 12, 0.45)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(234, 88, 12, 0.40)';
                }
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('auth.studentLogin.loggingIn')}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <GraduationCap className="w-4.5 h-4.5" />
                  {t('auth.studentLogin.loginButton')}
                </span>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="mt-6 text-xs text-center text-gray-400">
            {t('auth.studentLogin.securityTitle')}&nbsp;
            <span className="text-orange-500 font-medium">0776 818 160</span>
          </p>

          {/* Cross-link to teacher */}
          <p className="mt-4 text-sm text-center text-gray-500">
            {t('auth.studentLogin.isTeacher')}&nbsp;
            <Link to="/giao-vien/dang-nhap" className="text-orange-500 font-semibold hover:underline">
              {t('auth.studentLogin.teacherLoginLink')}
            </Link>
          </p>

          </div>
        </div>
      </div>
    </div>
  );
}
