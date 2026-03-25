/**
 * Registration Component
 * 
 * Student registration form with date_of_birth collection and age group preview
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { register, RegisterFormData } from '../../../services/authApi';
import { calculateAgeGroup } from '../../../utils/ageDetection';
import { AgeGroup } from '../../../utils/ageDetection';

// Helper to calculate age from date of birth
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

// Helper to get age group label in Vietnamese
function getAgeGroupLabel(ageGroup: AgeGroup): string {
  const labels = {
    kids: 'Trẻ em (6-12 tuổi)',
    teens: 'Thiếu niên (13-17 tuổi)',
    adults: 'Người lớn (18+ tuổi)',
  };
  return labels[ageGroup];
}

export function Register() {
  const navigate = useNavigate();
  const { syncWithAuth } = useThemeContext();
  
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

  // Calculate age group preview when date_of_birth changes
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
    // Clear field error when user types
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

      // Store token
      localStorage.setItem('auth_token', access_token);

      // Sync theme with user data
      syncWithAuth(user);

      // Small delay to ensure theme applies
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect to dashboard
      navigate('/hoc-sinh');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        // Field-specific errors
        setFieldErrors(err.response.data.errors);
      }
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Đăng ký tài khoản
        </h2>
        <p className="text-blue-200 text-center mb-8">
          Tạo tài khoản học sinh mới
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
              Họ và tên <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border ${
                fieldErrors.name ? 'border-red-500' : 'border-white/20'
              } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all`}
              placeholder="Nguyễn Văn A"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-red-300">{fieldErrors.name[0]}</p>
            )}
          </div>

          {/* Phone Input */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
              Số điện thoại <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border ${
                fieldErrors.phone ? 'border-red-500' : 'border-white/20'
              } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all`}
              placeholder="0336695863"
            />
            {fieldErrors.phone && (
              <p className="mt-1 text-sm text-red-300">{fieldErrors.phone[0]}</p>
            )}
          </div>

          {/* Date of Birth Input */}
          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-semibold text-white mb-2">
              Ngày sinh <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border ${
                fieldErrors.date_of_birth ? 'border-red-500' : 'border-white/20'
              } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all`}
            />
            {fieldErrors.date_of_birth && (
              <p className="mt-1 text-sm text-red-300">{fieldErrors.date_of_birth[0]}</p>
            )}
            {previewAgeGroup && (
              <div className="mt-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-blue-300">
                  Giao diện: <span className="font-semibold text-white">{getAgeGroupLabel(previewAgeGroup)}</span>
                </p>
              </div>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
              Mật khẩu <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border ${
                fieldErrors.password ? 'border-red-500' : 'border-white/20'
              } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all`}
              placeholder="••••••••"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-300">{fieldErrors.password[0]}</p>
            )}
            <p className="mt-1 text-xs text-blue-300">Tối thiểu 6 ký tự</p>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-semibold text-white mb-2">
              Xác nhận mật khẩu <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              minLength={6}
              className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border ${
                fieldErrors.password_confirmation ? 'border-red-500' : 'border-white/20'
              } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all`}
              placeholder="••••••••"
            />
            {fieldErrors.password_confirmation && (
              <p className="mt-1 text-sm text-red-300">{fieldErrors.password_confirmation[0]}</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang xử lý...
              </span>
            ) : (
              'Đăng ký'
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
    </div>
  );
}
