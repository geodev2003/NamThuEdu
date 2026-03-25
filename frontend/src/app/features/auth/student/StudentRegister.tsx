/**
 * Enhanced Registration Component
 * 
 * Student registration with improved UX, progress indicator, and animations
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { register, RegisterFormData } from '../../../../services/authApi';
import { calculateAgeGroup } from '../../../../utils/ageDetection';
import { AgeGroup } from '../../../../utils/ageDetection';
import { CheckCircle2, Sparkles, User, Phone, Calendar, Lock, Eye, EyeOff } from 'lucide-react';

// Helper functions
function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

function getAgeGroupLabel(ageGroup: AgeGroup): string {
  const labels = {
    kids: 'Trẻ em (6-12 tuổi)',
    teens: 'Thiếu niên (13-17 tuổi)',
    adults: 'Người lớn (18+ tuổi)',
  };
  return labels[ageGroup];
}

function getAgeGroupEmoji(ageGroup: AgeGroup): string {
  const emojis = {
    kids: '🎨',
    teens: '🎮',
    adults: '💼',
  };
  return emojis[ageGroup];
}

export function StudentRegister() {
  const navigate = useNavigate();
  const { syncWithAuth } = useThemeContext();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    phone: '',
    password: '',
    password_confirmation: '',
    date_of_birth: '',
  });
  
  const [previewAgeGroup, setPreviewAgeGroup] = useState<AgeGroup | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Calculate age group preview
  useEffect(() => {
    if (formData.date_of_birth) {
      try {
        const age = calculateAge(formData.date_of_birth);
        if (age >= 6) {
          const ageGroup = calculateAgeGroup(formData.date_of_birth);
          setPreviewAgeGroup(ageGroup);
        } else {
          setPreviewAgeGroup(null);
        }
      } catch (e) {
        setPreviewAgeGroup(null);
      }
    } else {
      setPreviewAgeGroup(null);
    }
  }, [formData.date_of_birth]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await register(formData);
      const { access_token, user } = response.data;

      localStorage.setItem('auth_token', access_token);
      syncWithAuth(user);
      
      // Show success step briefly
      setStep(2);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      navigate('/hoc-sinh');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      }
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative w-full max-w-md">
        {step === 1 ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl animate-fadeInUp">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  1
                </div>
                <span className="text-white text-sm font-medium">Thông tin</span>
              </div>
              <div className="w-12 h-0.5 bg-white/20" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white/50 text-sm font-bold">
                  2
                </div>
                <span className="text-white/50 text-sm font-medium">Hoàn tất</span>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white font-medium">Tạo tài khoản mới</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Đăng ký tài khoản
              </h2>
              <p className="text-blue-200">
                Bắt đầu hành trình học tập của bạn
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                  Họ và tên <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border ${
                      fieldErrors.name ? 'border-red-500' : 'border-white/20'
                    } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all`}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                {fieldErrors.name && (
                  <p className="mt-1 text-sm text-red-300 flex items-center gap-1">
                    <span>⚠️</span> {fieldErrors.name[0]}
                  </p>
                )}
              </div>

              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                  Số điện thoại <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={`w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border ${
                      fieldErrors.phone ? 'border-red-500' : 'border-white/20'
                    } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all`}
                    placeholder="0336695863"
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="mt-1 text-sm text-red-300 flex items-center gap-1">
                    <span>⚠️</span> {fieldErrors.phone[0]}
                  </p>
                )}
              </div>

              {/* Date of Birth Input */}
              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-semibold text-white mb-2">
                  Ngày sinh <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border ${
                      fieldErrors.date_of_birth ? 'border-red-500' : 'border-white/20'
                    } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all`}
                  />
                </div>
                {fieldErrors.date_of_birth && (
                  <p className="mt-1 text-sm text-red-300 flex items-center gap-1">
                    <span>⚠️</span> {fieldErrors.date_of_birth[0]}
                  </p>
                )}
                {previewAgeGroup && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getAgeGroupEmoji(previewAgeGroup)}</div>
                      <div>
                        <p className="text-sm text-blue-200">Giao diện phù hợp:</p>
                        <p className="font-semibold text-white">{getAgeGroupLabel(previewAgeGroup)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                  Mật khẩu <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className={`w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-sm border ${
                      fieldErrors.password ? 'border-red-500' : 'border-white/20'
                    } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-300 flex items-center gap-1">
                    <span>⚠️</span> {fieldErrors.password[0]}
                  </p>
                )}
                <p className="mt-1 text-xs text-blue-300">Tối thiểu 6 ký tự</p>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-semibold text-white mb-2">
                  Xác nhận mật khẩu <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="password_confirmation"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className={`w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-sm border ${
                      fieldErrors.password_confirmation ? 'border-red-500' : 'border-white/20'
                    } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {fieldErrors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-300 flex items-center gap-1">
                    <span>⚠️</span> {fieldErrors.password_confirmation[0]}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl animate-shake">
                  <p className="text-red-200 text-sm flex items-center gap-2">
                    <span>⚠️</span> {error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng ký</span>
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-blue-200">
                Đã có tài khoản?{' '}
                <Link 
                  to="/dang-nhap" 
                  className="text-white font-bold hover:text-blue-300 transition-colors underline"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        ) : (
          // Success Step
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-12 shadow-2xl text-center animate-fadeInUp">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">Đăng ký thành công!</h3>
            <p className="text-blue-200 mb-6">Đang chuyển đến trang chủ...</p>
            <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-400 animate-loading-bar" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
