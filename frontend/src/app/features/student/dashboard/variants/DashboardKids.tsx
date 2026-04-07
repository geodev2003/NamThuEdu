/**
 * Dashboard Kids (6-12 tuổi)
 * 
 * Features:
 * - Large, colorful cards
 * - Playful animations
 * - High gamification (badges, stickers, celebrations)
 * - Simple 1-2 column layout
 * - Large icons and text
 * - Immediate rewards and feedback
 */

import { Link } from 'react-router';
import { 
  Star, 
  Trophy, 
  Flame, 
  Zap, 
  Target, 
  Sparkles,
  Gift,
  Crown,
  Heart,
  Rocket
} from 'lucide-react';
import { AdaptiveCard, AdaptiveButton, AdaptiveHeading2, AdaptiveBody } from '../../../../../components/adaptive';
import { useTheme } from '../../../../../hooks/useTheme';
const STUDENT_BASE_PATH = '/hoc-vien';

interface DashboardKidsProps {
  stats: {
    pendingTests: number;
    averageScore: number;
    totalTests: number;
    recentScore: number;
    streak: number;
    xp: number;
    level: number;
    badges: number;
  };
  isLoading?: boolean;
}

export function DashboardKids({ stats, isLoading = false }: DashboardKidsProps) {
  const { colors, borderRadius, shadows, spacing } = useTheme();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 bg-gray-200 animate-pulse rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Hero Section - Playful Welcome */}
      <div
        className="relative overflow-hidden p-8"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          borderRadius: borderRadius.xl,
          boxShadow: shadows.lg,
        }}
      >
        {/* Decorative elements */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
          style={{ background: 'rgba(255,255,255,0.3)' }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'rgba(255,255,255,0.5)' }}
        />
        <Sparkles 
          className="absolute top-6 right-20 w-8 h-8 text-yellow-300 animate-pulse" 
        />
        <Star 
          className="absolute bottom-8 right-32 w-6 h-6 text-yellow-200 animate-bounce" 
        />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-10 h-10 text-yellow-300" />
              <h1 
                className="text-white font-extrabold"
                style={{ fontSize: '32px', lineHeight: 1.2 }}
              >
                Chào bạn! 🎉
              </h1>
            </div>
            <p 
              className="text-white/90 font-semibold"
              style={{ fontSize: '20px' }}
            >
              Hôm nay bạn có {stats.pendingTests} bài tập vui!
            </p>

            {/* XP Bar - Large and colorful */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="w-8 h-8 text-yellow-300" />
                <span 
                  className="text-white font-bold"
                  style={{ fontSize: '22px' }}
                >
                  {stats.xp} XP
                </span>
              </div>
              <div
                className="flex-1 h-4 rounded-full overflow-hidden"
                style={{ 
                  background: 'rgba(255,255,255,0.25)',
                  maxWidth: '200px',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(stats.xp % 1000) / 10}%`,
                    background: 'linear-gradient(90deg, #FCD34D, #F59E0B)',
                  }}
                />
              </div>
              <span 
                className="text-white/80 font-semibold"
                style={{ fontSize: '16px' }}
              >
                Level {stats.level}
              </span>
            </div>
          </div>

          {/* Streak Badge - Large and prominent */}
          <div
            className="flex flex-col items-center px-8 py-6 rounded-3xl"
            style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '3px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }}
          >
            <Flame className="w-12 h-12 text-yellow-300 mb-2 animate-bounce" />
            <p
              className="text-white font-extrabold"
              style={{ fontSize: '36px', lineHeight: 1 }}
            >
              {stats.streak}
            </p>
            <p 
              className="text-white/90 font-semibold"
              style={{ fontSize: '14px' }}
            >
              ngày liên tiếp
            </p>
          </div>
        </div>
      </div>

      {/* Big Action Cards - 2 columns max */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Làm bài tập */}
        <AdaptiveCard 
          variant="elevated" 
          hoverable
          className="cursor-pointer"
        >
          <Link to={`${STUDENT_BASE_PATH}/bai-tap`} className="block">
            <div className="flex flex-col items-center text-center py-4">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent}, #FCD34D)`,
                  boxShadow: shadows.lg,
                }}
              >
                <Target className="w-12 h-12 text-white" />
              </div>
              <AdaptiveHeading2 style={{ color: colors.text, marginBottom: spacing.sm }}>
                Làm bài tập 📝
              </AdaptiveHeading2>
              <AdaptiveBody style={{ color: colors.textMuted }}>
                {stats.pendingTests} bài đang chờ bạn!
              </AdaptiveBody>
              <div className="mt-4">
                <AdaptiveButton variant="primary" size="lg">
                  Bắt đầu ngay! 🚀
                </AdaptiveButton>
              </div>
            </div>
          </Link>
        </AdaptiveCard>

        {/* Phần thưởng */}
        <AdaptiveCard 
          variant="elevated" 
          hoverable
          className="cursor-pointer"
        >
          <Link to={`${STUDENT_BASE_PATH}/phan-thuong`} className="block">
            <div className="flex flex-col items-center text-center py-4">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: `linear-gradient(135deg, ${colors.success}, #34D399)`,
                  boxShadow: shadows.lg,
                }}
              >
                <Gift className="w-12 h-12 text-white" />
              </div>
              <AdaptiveHeading2 style={{ color: colors.text, marginBottom: spacing.sm }}>
                Phần thưởng 🎁
              </AdaptiveHeading2>
              <AdaptiveBody style={{ color: colors.textMuted }}>
                {stats.badges} huy hiệu mới!
              </AdaptiveBody>
              <div className="mt-4">
                <AdaptiveButton variant="cta" size="lg">
                  Xem ngay! ✨
                </AdaptiveButton>
              </div>
            </div>
          </Link>
        </AdaptiveCard>

        {/* Bảng xếp hạng */}
        <AdaptiveCard 
          variant="elevated" 
          hoverable
          className="cursor-pointer"
        >
          <Link to={`${STUDENT_BASE_PATH}/bang-xep-hang`} className="block">
            <div className="flex flex-col items-center text-center py-4">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  boxShadow: shadows.lg,
                }}
              >
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <AdaptiveHeading2 style={{ color: colors.text, marginBottom: spacing.sm }}>
                Bảng xếp hạng 🏆
              </AdaptiveHeading2>
              <AdaptiveBody style={{ color: colors.textMuted }}>
                Xem bạn đứng thứ mấy!
              </AdaptiveBody>
              <div className="mt-4">
                <AdaptiveButton variant="secondary" size="lg">
                  Xem bảng xếp hạng
                </AdaptiveButton>
              </div>
            </div>
          </Link>
        </AdaptiveCard>

        {/* Luyện tập */}
        <AdaptiveCard 
          variant="elevated" 
          hoverable
          className="cursor-pointer"
        >
          <Link to={`${STUDENT_BASE_PATH}/luyen-tap`} className="block">
            <div className="flex flex-col items-center text-center py-4">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: `linear-gradient(135deg, #8B5CF6, #A78BFA)`,
                  boxShadow: shadows.lg,
                }}
              >
                <Rocket className="w-12 h-12 text-white" />
              </div>
              <AdaptiveHeading2 style={{ color: colors.text, marginBottom: spacing.sm }}>
                Luyện tập vui 🎮
              </AdaptiveHeading2>
              <AdaptiveBody style={{ color: colors.textMuted }}>
                Chơi và học cùng lúc!
              </AdaptiveBody>
              <div className="mt-4">
                <AdaptiveButton variant="outline" size="lg">
                  Chơi ngay!
                </AdaptiveButton>
              </div>
            </div>
          </Link>
        </AdaptiveCard>
      </div>

      {/* Stats Cards - Large and colorful */}
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            icon: Star,
            label: 'Điểm trung bình',
            value: stats.averageScore.toFixed(1),
            color: '#F59E0B',
            bg: '#FEF3C7',
          },
          {
            icon: Trophy,
            label: 'Bài đã làm',
            value: stats.totalTests,
            color: '#10B981',
            bg: '#D1FAE5',
          },
          {
            icon: Heart,
            label: 'Điểm gần nhất',
            value: stats.recentScore.toFixed(1),
            color: '#EF4444',
            bg: '#FEE2E2',
          },
          {
            icon: Sparkles,
            label: 'Huy hiệu',
            value: stats.badges,
            color: '#8B5CF6',
            bg: '#EDE9FE',
          },
        ].map((stat) => (
          <AdaptiveCard key={stat.label} variant="elevated">
            <div className="flex flex-col items-center text-center py-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                style={{ background: stat.bg }}
              >
                <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
              </div>
              <p
                className="font-extrabold"
                style={{ fontSize: '28px', color: colors.text, lineHeight: 1 }}
              >
                {stat.value}
              </p>
              <p
                className="font-semibold mt-1"
                style={{ fontSize: '14px', color: colors.textMuted }}
              >
                {stat.label}
              </p>
            </div>
          </AdaptiveCard>
        ))}
      </div>
    </div>
  );
}
