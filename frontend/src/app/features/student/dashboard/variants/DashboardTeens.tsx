/**
 * Dashboard Teens (13-17 tuổi)
 * 
 * Features:
 * - Modern, trendy design
 * - Glassmorphism effects
 * - Medium gamification (achievements, streaks, leaderboard)
 * - 2-3 column layout
 * - Social features
 * - Smooth animations
 */

import { Link } from 'react-router';
import { 
  TrendingUp, 
  Trophy, 
  Flame, 
  Zap, 
  Target, 
  Award,
  Users,
  BarChart3,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { AdaptiveCard, AdaptiveButton, AdaptiveHeading2, AdaptiveBody } from '../../../../../components/adaptive';
import { useTheme } from '../../../../../hooks/useTheme';
const STUDENT_BASE_PATH = '/hoc-vien';

interface DashboardTeensProps {
  stats: {
    pendingTests: number;
    averageScore: number;
    totalTests: number;
    recentScore: number;
    streak: number;
    xp: number;
    level: number;
    rank: number;
    totalUsers: number;
  };
  isLoading?: boolean;
}

export function DashboardTeens({ stats, isLoading = false }: DashboardTeensProps) {
  const { colors, borderRadius, shadows, spacing } = useTheme();

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-40 bg-gray-200 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Hero Section - Modern Glassmorphism */}
      <div
        className="relative overflow-hidden p-6"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}E6 0%, ${colors.secondary}E6 100%)`,
          borderRadius: borderRadius.lg,
          boxShadow: shadows.md,
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 
                  className="text-white font-bold"
                  style={{ fontSize: '24px', lineHeight: 1.2 }}
                >
                  Chào bạn! 👋
                </h1>
                <p 
                  className="text-white/80"
                  style={{ fontSize: '14px' }}
                >
                  Level {stats.level} • {stats.xp} XP
                </p>
              </div>
            </div>

            {/* Progress Bar - Sleek */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="text-white/90 font-medium"
                  style={{ fontSize: '13px' }}
                >
                  Tiến độ đến Level {stats.level + 1}
                </span>
                <span 
                  className="text-white/80 font-medium"
                  style={{ fontSize: '13px' }}
                >
                  {((stats.xp % 1000) / 10).toFixed(0)}%
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ 
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(stats.xp % 1000) / 10}%`,
                    background: 'linear-gradient(90deg, #10B981, #34D399)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Streak & Rank */}
          <div className="flex gap-4 ml-6">
            <div
              className="flex flex-col items-center px-6 py-4 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <Flame className="w-6 h-6 text-orange-300 mb-1" />
              <p
                className="text-white font-bold"
                style={{ fontSize: '24px', lineHeight: 1 }}
              >
                {stats.streak}
              </p>
              <p 
                className="text-white/80 text-xs"
              >
                ngày streak
              </p>
            </div>

            <div
              className="flex flex-col items-center px-6 py-4 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <Trophy className="w-6 h-6 text-yellow-300 mb-1" />
              <p
                className="text-white font-bold"
                style={{ fontSize: '24px', lineHeight: 1 }}
              >
                #{stats.rank}
              </p>
              <p 
                className="text-white/80 text-xs"
              >
                xếp hạng
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Làm bài tập */}
        <AdaptiveCard variant="elevated" hoverable>
          <Link to={`${STUDENT_BASE_PATH}/bai-tap`} className="block">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                <Target className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <AdaptiveHeading2 style={{ fontSize: '16px', color: colors.text, marginBottom: '4px' }}>
                  Bài tập
                </AdaptiveHeading2>
                <AdaptiveBody style={{ fontSize: '13px', color: colors.textMuted }}>
                  {stats.pendingTests} bài đang chờ
                </AdaptiveBody>
              </div>
            </div>
          </Link>
        </AdaptiveCard>

        {/* Luyện tập */}
        <AdaptiveCard variant="elevated" hoverable>
          <Link to={`${STUDENT_BASE_PATH}/luyen-tap`} className="block">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${colors.success}, #34D399)`,
                }}
              >
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <AdaptiveHeading2 style={{ fontSize: '16px', color: colors.text, marginBottom: '4px' }}>
                  Luyện tập
                </AdaptiveHeading2>
                <AdaptiveBody style={{ fontSize: '13px', color: colors.textMuted }}>
                  Nâng cao kỹ năng
                </AdaptiveBody>
              </div>
            </div>
          </Link>
        </AdaptiveCard>

        {/* Bảng xếp hạng */}
        <AdaptiveCard variant="elevated" hoverable>
          <Link to={`${STUDENT_BASE_PATH}/bang-xep-hang`} className="block">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent}, #FCD34D)`,
                }}
              >
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <AdaptiveHeading2 style={{ fontSize: '16px', color: colors.text, marginBottom: '4px' }}>
                  Xếp hạng
                </AdaptiveHeading2>
                <AdaptiveBody style={{ fontSize: '13px', color: colors.textMuted }}>
                  Top {stats.rank}/{stats.totalUsers}
                </AdaptiveBody>
              </div>
            </div>
          </Link>
        </AdaptiveCard>
      </div>

      {/* Stats Grid - 3 columns */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            icon: TrendingUp,
            label: 'Điểm TB',
            value: stats.averageScore.toFixed(1),
            change: '+2.5',
            color: colors.primary,
            bg: `${colors.primary}15`,
          },
          {
            icon: Trophy,
            label: 'Hoàn thành',
            value: stats.totalTests,
            change: `+${Math.floor(stats.totalTests * 0.1)}`,
            color: colors.success,
            bg: `${colors.success}15`,
          },
          {
            icon: Award,
            label: 'Điểm gần nhất',
            value: stats.recentScore.toFixed(1),
            change: stats.recentScore > stats.averageScore ? '+' : '-',
            color: colors.accent,
            bg: `${colors.accent}15`,
          },
          {
            icon: Clock,
            label: 'Thời gian học',
            value: `${Math.floor(stats.totalTests * 45)}m`,
            change: '+15m',
            color: colors.secondary,
            bg: `${colors.secondary}15`,
          },
          {
            icon: BarChart3,
            label: 'Tuần này',
            value: Math.floor(stats.totalTests * 0.15),
            change: '+3',
            color: '#8B5CF6',
            bg: '#8B5CF615',
          },
          {
            icon: Flame,
            label: 'Streak tốt nhất',
            value: Math.max(stats.streak, 12),
            change: 'Kỷ lục',
            color: '#F59E0B',
            bg: '#F59E0B15',
          },
        ].map((stat) => (
          <AdaptiveCard key={stat.label} variant="outlined">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: stat.bg }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-bold truncate"
                  style={{ fontSize: '20px', color: colors.text, lineHeight: 1 }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-xs truncate"
                  style={{ color: colors.textMuted, marginTop: '2px' }}
                >
                  {stat.label}
                </p>
              </div>
              <span
                className="text-xs font-semibold px-2 py-1 rounded"
                style={{ 
                  background: `${colors.success}15`, 
                  color: colors.success 
                }}
              >
                {stat.change}
              </span>
            </div>
          </AdaptiveCard>
        ))}
      </div>

      {/* Call to Action */}
      <AdaptiveCard 
        variant="elevated"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <AdaptiveHeading2 style={{ color: colors.text, marginBottom: spacing.xs }}>
              Sẵn sàng chinh phục thử thách mới? 🚀
            </AdaptiveHeading2>
            <AdaptiveBody style={{ color: colors.textMuted }}>
              Hoàn thành bài tập hôm nay để duy trì streak!
            </AdaptiveBody>
          </div>
          <Link to={`${STUDENT_BASE_PATH}/bai-tap`}>
            <AdaptiveButton variant="primary" size="md">
              Bắt đầu ngay
            </AdaptiveButton>
          </Link>
        </div>
      </AdaptiveCard>
    </div>
  );
}
