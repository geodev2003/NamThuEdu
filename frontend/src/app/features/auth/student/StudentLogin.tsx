/**
 * Student Login Component
 * 
 * Clean login form for students matching admin login style
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { login, LoginFormData } from '../../../../services/authApi';
import { usePageTitle, PAGE_TITLES } from '../../../../hooks/usePageTitle';
import { Eye, EyeOff, Phone, Lock, GraduationCap } from 'lucide-react';
import { ParticlesBackgroundWhite } from '../../public/components/ParticlesBackgroundWhite';
import studentLoginText from '../../../../locales/student-login.json';

export function StudentLogin() {
  const navigate = useNavigate();
  const { syncWithAuth } = useThemeContext();
  const { i18n } = useTranslation();
  usePageTitle(PAGE_TITLES.LOGIN);
  
  // Get text based on current language
  const lang = i18n.language as 'vi' | 'en';
  const text = studentLoginText[lang] || studentLoginText.vi;
  
  const [formData, setFormData] = useState<LoginFormData>({
    phone: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
        setError(text.errorWrongRole);
        return;
      }

      // Store token
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('auth_role', user.role);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
      }

      // Sync theme with user data
      syncWithAuth(user);

      // Redirect to student portal
      navigate('/hoc-vien');
    } catch (err: any) {
      setError(err.response?.data?.message || text.errorDefault);
      setFormData(prev => ({ ...prev, password: '' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-white">
      {/* Particles Background */}
      <ParticlesBackgroundWhite />
      
      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center p-2 md:p-4">
        <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full" style={{
              background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.35)'
            }}>
              <GraduationCap className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-sm">{text.badge}</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {text.title}
            </h1>
            <p className="text-gray-600">
              {text.subtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {text.phoneLabel} <span className="text-red-500">{text.required}</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  autoFocus
                  placeholder={text.phonePlaceholder}
                   className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {text.passwordLabel} <span className="text-red-500">{text.required}</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder={text.passwordPlaceholder}
                   className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                   className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-300 cursor-pointer"
                />
                <span className="text-sm text-gray-600">{text.rememberMe}</span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 font-bold text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background: isLoading ? '#94A3B8' : 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
                boxShadow: isLoading ? 'none' : '0 4px 12px rgba(234, 88, 12, 0.45)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(249, 115, 22, 0.45)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.35)';
                }
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {text.loggingIn}
                </span>
              ) : (
                <>
                  <GraduationCap className="inline w-5 h-5 mr-2" />
                  {text.loginButton}
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-900">
              <strong>{text.securityTitle}</strong><br />
              {text.securityNote}
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
