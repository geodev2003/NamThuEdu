/**
 * Theme Loader Component
 * 
 * Loading indicator shown during theme initialization
 * Displays while fetching user profile and applying theme
 */

import React from 'react';
import { Sparkles } from 'lucide-react';

export function ThemeLoader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center z-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative text-center space-y-8 max-w-md px-4">
        {/* Animated Logo */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDelay: '1s' }}>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full" />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-3">
          <h3 className="text-3xl font-bold text-white">Đang tải giao diện...</h3>
          <p className="text-lg text-blue-200">Chuẩn bị trải nghiệm của bạn</p>
        </div>

        {/* Loading Bar */}
        <div className="space-y-2">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-loading-bar" />
          </div>
          <p className="text-sm text-blue-300">Đang tải theme và cài đặt...</p>
        </div>

        {/* Feature hints */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          {[
            { icon: '🎨', text: 'Giao diện' },
            { icon: '⚡', text: 'Nhanh chóng' },
            { icon: '✨', text: 'Cá nhân hóa' }
          ].map((item, index) => (
            <div 
              key={index} 
              className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-xs text-blue-200">{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
