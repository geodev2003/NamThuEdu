/**
 * Streak Display Component
 * 
 * Shows learning streak with age-appropriate styling
 */

import { Flame, Calendar } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { AdaptiveCard } from '../adaptive';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  streakDays?: boolean[]; // Last 7 days, true = completed
}

export function StreakDisplay({ 
  currentStreak, 
  longestStreak,
  streakDays = [true, true, true, false, true, true, true]
}: StreakDisplayProps) {
  const { colors, borderRadius, shadows, isKids, isTeens, isAdults } = useTheme();

  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  // Kids: Large, animated, celebratory
  if (isKids) {
    return (
      <AdaptiveCard variant="elevated">
        <div className="text-center py-4">
          <div className="flex justify-center mb-4">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
                boxShadow: shadows.lg,
              }}
            >
              <Flame className="w-12 h-12 text-white animate-pulse" />
            </div>
          </div>
          
          <p 
            className="font-extrabold mb-2"
            style={{ fontSize: '40px', color: colors.text, lineHeight: 1 }}
          >
            {currentStreak}
          </p>
          <p 
            className="font-bold mb-4"
            style={{ fontSize: '20px', color: colors.textMuted }}
          >
            ngày liên tiếp! 🔥
          </p>

          <div className="flex justify-center gap-2 mb-4">
            {streakDays.map((completed, index) => (
              <div
                key={index}
                className="flex flex-col items-center"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
                  style={{
                    background: completed 
                      ? 'linear-gradient(135deg, #10B981, #34D399)'
                      : colors.backgroundSecondary,
                    border: completed ? 'none' : `2px solid ${colors.border}`,
                  }}
                >
                  {completed ? (
                    <span className="text-white font-bold text-lg">✓</span>
                  ) : (
                    <span style={{ color: colors.textMuted, fontSize: '12px' }}>
                      {weekDays[index]}
                    </span>
                  )}
                </div>
                <span 
                  className="text-xs font-semibold"
                  style={{ color: completed ? colors.success : colors.textMuted }}
                >
                  {weekDays[index]}
                </span>
              </div>
            ))}
          </div>

          <div
            className="p-3 rounded-2xl"
            style={{ background: colors.backgroundSecondary }}
          >
            <p className="text-sm font-semibold" style={{ color: colors.textMuted }}>
              Kỷ lục của bạn
            </p>
            <p className="text-2xl font-extrabold" style={{ color: colors.accent }}>
              {longestStreak} ngày 🏆
            </p>
          </div>
        </div>
      </AdaptiveCard>
    );
  }

  // Teens: Modern, sleek
  if (isTeens) {
    return (
      <AdaptiveCard variant="elevated">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
                }}
              >
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <p 
                  className="font-bold"
                  style={{ fontSize: '24px', color: colors.text, lineHeight: 1 }}
                >
                  {currentStreak} ngày
                </p>
                <p className="text-sm" style={{ color: colors.textMuted }}>
                  Streak hiện tại
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: colors.textMuted }}>
                Kỷ lục
              </p>
              <p className="font-bold" style={{ fontSize: '20px', color: colors.accent }}>
                {longestStreak}
              </p>
            </div>
          </div>

          <div className="flex justify-between gap-1">
            {streakDays.map((completed, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center"
              >
                <div
                  className="w-full aspect-square rounded-lg flex items-center justify-center mb-1"
                  style={{
                    background: completed 
                      ? `${colors.success}20`
                      : colors.backgroundSecondary,
                    border: completed ? `2px solid ${colors.success}` : `1px solid ${colors.border}`,
                  }}
                >
                  {completed && (
                    <span style={{ color: colors.success, fontSize: '16px' }}>✓</span>
                  )}
                </div>
                <span 
                  className="text-xs font-medium"
                  style={{ color: completed ? colors.text : colors.textMuted }}
                >
                  {weekDays[index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </AdaptiveCard>
    );
  }

  // Adults: Minimal, data-focused
  return (
    <AdaptiveCard variant="outlined">
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5" style={{ color: colors.accent }} />
            <div>
              <p className="font-semibold" style={{ fontSize: '16px', color: colors.text }}>
                {currentStreak} ngày
              </p>
              <p className="text-xs" style={{ color: colors.textMuted }}>
                Streak • Kỷ lục: {longestStreak}
              </p>
            </div>
          </div>
          <Calendar className="w-4 h-4" style={{ color: colors.textMuted }} />
        </div>

        <div className="flex gap-1">
          {streakDays.map((completed, index) => (
            <div
              key={index}
              className="flex-1 h-1.5 rounded-full"
              style={{
                background: completed ? colors.success : colors.backgroundSecondary,
              }}
              title={`${weekDays[index]}: ${completed ? 'Hoàn thành' : 'Chưa hoàn thành'}`}
            />
          ))}
        </div>
      </div>
    </AdaptiveCard>
  );
}
