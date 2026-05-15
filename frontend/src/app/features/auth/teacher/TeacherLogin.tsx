/**
 * Teacher Login Component
 * 
 * Clean, professional login form for teachers
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { login } from '../../../../services/authApi';
import { Eye, EyeOff, Phone, Lock, GraduationCap } from 'lucide-react';
import { ParticlesBackgroundWhite } from '../../public/components/ParticlesBackgroundWhite';
import { usePageTitle, PAGE_TITLES } from '../../../../hooks/usePageTitle';

export function TeacherLogin() {
  usePageTitle(PAGE_TITLES.TEACHER_LOGIN, true);
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await login({ phone: phone.trim(), password });
      const { access_token, user } = response.data;

      if (user.role !== 'teacher') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_role');
        setError('Tài khoản này không thuộc cổng giáo viên.');
        return;
      }

      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('auth_role', user.role);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('teacher_phone', phone.trim()); // Store phone for re-authentication
      navigate('/giao-vien');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Đăng nhập thất bại.');
      } else {
        setError('Đăng nhập thất bại.');
      }
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col !bg-white" style={{ background: '#ffffff !important' }}>
      {/* Particles Background */}
      <ParticlesBackgroundWhite />
      
      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-orange-100" style={{
            boxShadow: '0 20px 60px rgba(234, 88, 12, 0.15), 0 0 0 1px rgba(234, 88, 12, 0.05)'
          }}>
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full" style={{
                background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.35)'
              }}>
                <GraduationCap className="w-5 h-5 text-white" />
                <span className="text-white font-bold text-sm">Teacher Portal</span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Đăng nhập Giáo viên
              </h1>
              <p className="text-gray-600">
                Truy cập Teacher Dashboard của bạn
              </p>
            </div>

            {/* Demo Account Info */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm font-semibold text-green-900 mb-2">
                🎯 Demo Account
              </p>
              <p className="text-xs text-green-800">
                SĐT: <span className="font-mono font-semibold">0336695863</span>
                <br />
                Password: <span className="font-mono font-semibold">password123</span>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Phone Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    autoFocus
                    placeholder="0336695863"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
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
                  <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
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
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(234, 88, 12, 0.45)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 88, 12, 0.35)';
                  }
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Đang đăng nhập...
                  </span>
                ) : (
                  <>
                    <GraduationCap className="inline w-5 h-5 mr-2" />
                    Đăng nhập Teacher Portal
                  </>
                )}
              </button>
            </form>

            {/* Security Note */}
            {/* <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-900">
                <strong>🔒 Bảo mật</strong><br />
                Thông tin đăng nhập được mã hóa SSL 256-bit
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
