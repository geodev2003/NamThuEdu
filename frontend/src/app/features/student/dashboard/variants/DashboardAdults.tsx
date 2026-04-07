/**
 * Dashboard Adults (18-45 tuổi)
 * 
 * Features:
 * - Professional, minimalist design
 * - Data-dense layout (3-4 columns)
 * - Low gamification (focus on analytics)
 * - Detailed progress tracking
 * - Efficiency-focused
 * - Certificates and goals
 */

import { Link } from 'react-router';
import { 
  TrendingUp, 
  BarChart2, 
  Clock, 
  Target, 
  Award,
  Calendar,
  FileText,
  CheckSquare,
  Activity,
  BookOpen,
  PieChart,
  ArrowUpRight
} from 'lucide-react';
import { AdaptiveCard, AdaptiveButton, AdaptiveHeading2, AdaptiveBody } from '../../../../../components/adaptive';
import { useTheme } from '../../../../../hooks/useTheme';
const STUDENT_BASE_PATH = '/hoc-vien';

interface DashboardAdultsProps {
  stats: {
    pendingTests: number;
    averageScore: number;
    totalTests: number;
    recentScore: number;
    streak: number;
    completionRate: number;
    studyTime: number;
    certificates: number;
    goalsCompleted: number;
    totalGoals: number;
  };
  isLoading?: boolean;
}

export function DashboardAdults({ stats, isLoading = false }: DashboardAdultsProps) {
  const { colors, borderRadius, shadows, spacing } = useTheme();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-28 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const progressPercentage = (stats.goalsCompleted / stats.totalGoals) * 100;

  return (
    <div className="space-y-5">
      
      {/* Header - Compact and Professional */}
      <div
        className="p-5"
        style={{
          background: colors.surface,
          borderRadius: borderRadius.md,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.sm,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 
              className="font-semibold"
              style={{ fontSize: '20px', color: colors.text, marginBottom: '4px' }}
            >
              Dashboard
            </h1>
            <p 
              className="text-sm"
              style={{ color: colors.textMuted }}
            >
              {stats.pendingTests} bài tập đang chờ • {stats.goalsCompleted}/{stats.totalGoals} mục tiêu hoàn thành
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Streak - Minimal */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: colors.backgroundSecondary }}>
              <Activity className="w-4 h-4" style={{ color: colors.secondary }} />
              <div>
                <p className="text-xs" style={{ color: colors.textMuted }}>Streak</p>
                <p className="font-semibold" style={{ fontSize: '16px', color: colors.text }}>{stats.streak} ngày</p>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: colors.backgroundSecondary }}>
              <PieChart className="w-4 h-4" style={{ color: colors.success }} />
              <div>
                <p className="text-xs" style={{ color: colors.textMuted }}>Tỷ lệ hoàn thành</p>
                <p className="font-semibold" style={{ fontSize: '16px', color: colors.text }}>{stats.completionRate}%</p>
              </div>
            </div>

            <Link to={`${STUDENT_BASE_PATH}/bai-tap`}>
              <AdaptiveButton variant="primary" size="sm">
                Làm bài tập
              </AdaptiveButton>
            </Link>
          </div>
        </div>

        {/* Progress Bar - Subtle */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium" style={{ color: colors.textMuted }}>
              Tiến độ mục tiêu tháng này
            </span>
            <span className="text-xs font-semibold" style={{ color: colors.text }}>
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: colors.backgroundSecondary }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progressPercentage}%`,
                background: colors.secondary,
              }}
            />
          </div>
        </div>
      </div>

      {/* Key Metrics - 4 columns, compact */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: TrendingUp,
            label: 'Điểm trung bình',
            value: stats.averageScore.toFixed(1),
            subtext: 'Tất cả bài thi',
            color: colors.secondary,
            trend: '+2.3',
          },
          {
            icon: CheckSquare,
            label: 'Hoàn thành',
            value: stats.totalTests,
            subtext: 'Tổng số bài',
            color: colors.success,
            trend: `+${Math.floor(stats.totalTests * 0.08)}`,
          },
          {
            icon: Clock,
            label: 'Thời gian học',
            value: `${stats.studyTime}h`,
            subtext: 'Tháng này',
            color: colors.accent,
            trend: '+5h',
          },
          {
            icon: Award,
            label: 'Chứng chỉ',
            value: stats.certificates,
            subtext: 'Đã đạt được',
            color: colors.warning,
            trend: 'Mới',
          },
        ].map((metric) => (
          <AdaptiveCard key={metric.label} variant="outlined">
            <div className="flex items-start justify-between mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${metric.color}10` }}
              >
                <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
              </div>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded"
                style={{ 
                  background: `${colors.success}10`, 
                  color: colors.success 
                }}
              >
                {metric.trend}
              </span>
            </div>
            <p
              className="font-bold"
              style={{ fontSize: '22px', color: colors.text, lineHeight: 1 }}
            >
              {metric.value}
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
              {metric.label}
            </p>
            <p className="text-xs" style={{ color: colors.textMuted, opacity: 0.7 }}>
              {metric.subtext}
            </p>
          </AdaptiveCard>
        ))}
      </div>

      {/* Quick Actions - Compact grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            icon: Target,
            label: 'Bài tập',
            count: stats.pendingTests,
            path: `${STUDENT_BASE_PATH}/bai-tap`,
            color: colors.primary,
          },
          {
            icon: BookOpen,
            label: 'Luyện tập',
            count: null,
            path: `${STUDENT_BASE_PATH}/luyen-tap`,
            color: colors.success,
          },
          {
            icon: BarChart2,
            label: 'Phân tích',
            count: null,
            path: `${STUDENT_BASE_PATH}/tien-do`,
            color: colors.secondary,
          },
          {
            icon: Calendar,
            label: 'Lịch học',
            count: null,
            path: `${STUDENT_BASE_PATH}/lich-hoc`,
            color: colors.accent,
          },
        ].map((action) => (
          <Link key={action.path} to={action.path}>
            <AdaptiveCard 
              variant="outlined" 
              hoverable
              style={{ cursor: 'pointer' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${action.color}10` }}
                >
                  <action.icon className="w-5 h-5" style={{ color: action.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: colors.text }}>
                    {action.label}
                  </p>
                  {action.count !== null && (
                    <p className="text-xs" style={{ color: colors.textMuted }}>
                      {action.count} mới
                    </p>
                  )}
                </div>
                <ArrowUpRight className="w-4 h-4 flex-shrink-0" style={{ color: colors.textMuted }} />
              </div>
            </AdaptiveCard>
          </Link>
        ))}
      </div>

      {/* Detailed Stats - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Performance Overview */}
        <AdaptiveCard variant="outlined">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5" style={{ color: colors.secondary }} />
              <h3 className="font-semibold" style={{ fontSize: '15px', color: colors.text }}>
                Hiệu suất
              </h3>
            </div>
            <Link to={`${STUDENT_BASE_PATH}/tien-do`} className="text-xs font-medium" style={{ color: colors.secondary }}>
              Chi tiết →
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Listening', score: 7.5, max: 9.0 },
              { label: 'Reading', score: 8.0, max: 9.0 },
              { label: 'Writing', score: 6.5, max: 9.0 },
              { label: 'Speaking', score: 7.0, max: 9.0 },
            ].map((skill) => (
              <div key={skill.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: colors.text }}>
                    {skill.label}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: colors.text }}>
                    {skill.score}/{skill.max}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: colors.backgroundSecondary }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(skill.score / skill.max) * 100}%`,
                      background: colors.secondary,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AdaptiveCard>

        {/* Recent Activity */}
        <AdaptiveCard variant="outlined">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" style={{ color: colors.accent }} />
              <h3 className="font-semibold" style={{ fontSize: '15px', color: colors.text }}>
                Hoạt động gần đây
              </h3>
            </div>
            <Link to={`${STUDENT_BASE_PATH}/lich-su`} className="text-xs font-medium" style={{ color: colors.secondary }}>
              Xem tất cả →
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { title: 'IELTS Reading Practice', score: 8.0, date: 'Hôm nay' },
              { title: 'Listening Test 12', score: 7.5, date: 'Hôm qua' },
              { title: 'Writing Task 2', score: 6.5, date: '2 ngày trước' },
            ].map((activity, index) => (
              <div 
                key={index}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: index < 2 ? `1px solid ${colors.borderLight}` : 'none' }}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: colors.text }}>
                    {activity.title}
                  </p>
                  <p className="text-xs" style={{ color: colors.textMuted }}>
                    {activity.date}
                  </p>
                </div>
                <span
                  className="text-sm font-semibold px-2 py-1 rounded"
                  style={{ 
                    background: colors.backgroundSecondary,
                    color: colors.text 
                  }}
                >
                  {activity.score}
                </span>
              </div>
            ))}
          </div>
        </AdaptiveCard>
      </div>

      {/* Call to Action - Professional */}
      <AdaptiveCard 
        variant="outlined"
        style={{
          background: `linear-gradient(135deg, ${colors.secondary}08, ${colors.accent}08)`,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1" style={{ fontSize: '16px', color: colors.text }}>
              Tiếp tục học tập để đạt mục tiêu
            </h3>
            <p className="text-sm" style={{ color: colors.textMuted }}>
              Hoàn thành {stats.pendingTests} bài tập đang chờ để duy trì tiến độ học tập
            </p>
          </div>
          <Link to={`${STUDENT_BASE_PATH}/bai-tap`}>
            <AdaptiveButton variant="primary" size="sm">
              Xem bài tập
            </AdaptiveButton>
          </Link>
        </div>
      </AdaptiveCard>
    </div>
  );
}
