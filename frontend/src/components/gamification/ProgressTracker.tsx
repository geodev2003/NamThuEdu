/**
 * Progress Tracker Component
 * 
 * Displays learning progress with age-appropriate visualization
 */

import { TrendingUp, Target, Award, CheckCircle } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { AdaptiveCard } from '../adaptive';

interface ProgressTrackerProps {
  current: number;
  target: number;
  label: string;
  unit?: string;
  milestones?: { value: number; label: string; reached: boolean }[];
}

export function ProgressTracker({ 
  current, 
  target, 
  label,
  unit = '',
  milestones = []
}: ProgressTrackerProps) {
  const { colors, borderRadius, shadows, isKids, isTeens, isAdults } = useTheme();

  const percentage = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;

  // Kids: Large, colorful, celebratory
  if (isKids) {
    return (
      <AdaptiveCard variant="elevated">
        <div className="py-4">
          <div className="flex items-center justify-center mb-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: isComplete
                  ? 'linear-gradient(135deg, #10B981, #34D399)'
                  : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                boxShadow: shadows.md,
              }}
            >
              {isComplete ? (
                <Award className="w-10 h-10 text-white" />
              ) : (
                <Target className="w-10 h-10 text-white" />
              )}
            </div>
          </div>

          <p 
            className="text-center font-bold mb-2"
            style={{ fontSize: '20px', color: colors.text }}
          >
            {label}
          </p>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span 
                className="font-extrabold"
                style={{ fontSize: '28px', color: colors.primary }}
              >
                {current}{unit}
              </span>
              <span 
                className="font-bold"
                style={{ fontSize: '20px', color: colors.textMuted }}
              >
                / {target}{unit}
              </span>
            </div>
            
            <div
              className="h-6 rounded-full overflow-hidden"
              style={{ 
                background: colors.backgroundSecondary,
                border: `3px solid ${colors.border}`
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  background: isComplete
                    ? 'linear-gradient(90deg, #10B981, #34D399)'
                    : `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                }}
              />
            </div>

            <p 
              className="text-center mt-2 font-bold"
              style={{ fontSize: '18px', color: isComplete ? colors.success : colors.accent }}
            >
              {isComplete ? '🎉 Hoàn thành!' : `${percentage.toFixed(0)}% - Cố lên!`}
            </p>
          </div>

          {milestones.length > 0 && (
            <div className="space-y-2">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{
                    background: milestone.reached 
                      ? `${colors.success}20`
                      : colors.backgroundSecondary,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: milestone.reached ? colors.success : colors.border,
                    }}
                  >
                    {milestone.reached ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <span className="text-white font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold" style={{ fontSize: '14px', color: colors.text }}>
                      {milestone.label}
                    </p>
                    <p className="text-xs" style={{ color: colors.textMuted }}>
                      {milestone.value}{unit}
                    </p>
                  </div>
                  {milestone.reached && (
                    <span className="text-2xl">✨</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </AdaptiveCard>
    );
  }

  // Teens: Modern, sleek
  if (isTeens) {
    return (
      <AdaptiveCard variant="elevated">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: isComplete ? `${colors.success}20` : `${colors.primary}20`,
                }}
              >
                {isComplete ? (
                  <Award className="w-5 h-5" style={{ color: colors.success }} />
                ) : (
                  <Target className="w-5 h-5" style={{ color: colors.primary }} />
                )}
              </div>
              <p className="font-semibold" style={{ fontSize: '16px', color: colors.text }}>
                {label}
              </p>
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: isComplete ? `${colors.success}15` : `${colors.primary}15`,
                color: isComplete ? colors.success : colors.primary,
              }}
            >
              {percentage.toFixed(0)}%
            </span>
          </div>

          <div className="mb-3">
            <div className="flex justify-between items-baseline mb-2">
              <span 
                className="font-bold"
                style={{ fontSize: '24px', color: colors.text }}
              >
                {current}{unit}
              </span>
              <span 
                className="text-sm"
                style={{ color: colors.textMuted }}
              >
                Mục tiêu: {target}{unit}
              </span>
            </div>
            
            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ background: colors.backgroundSecondary }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  background: isComplete ? colors.success : colors.primary,
                }}
              />
            </div>
          </div>

          {milestones.length > 0 && (
            <div className="space-y-2">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 py-2"
                  style={{
                    borderBottom: index < milestones.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: milestone.reached ? colors.success : colors.backgroundSecondary,
                    }}
                  >
                    {milestone.reached ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <span style={{ color: colors.textMuted, fontSize: '10px' }}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <p 
                    className="flex-1 text-sm"
                    style={{ 
                      color: milestone.reached ? colors.text : colors.textMuted,
                      textDecoration: milestone.reached ? 'line-through' : 'none',
                    }}
                  >
                    {milestone.label}
                  </p>
                  <span className="text-xs font-medium" style={{ color: colors.textMuted }}>
                    {milestone.value}{unit}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdaptiveCard>
    );
  }

  // Adults: Minimal, data-focused
  return (
    <AdaptiveCard variant="outlined">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: colors.secondary }} />
            <p className="font-medium text-sm" style={{ color: colors.text }}>
              {label}
            </p>
          </div>
          <span className="text-xs font-semibold" style={{ color: colors.text }}>
            {current}/{target}{unit}
          </span>
        </div>

        <div
          className="h-2 rounded-full overflow-hidden mb-2"
          style={{ background: colors.backgroundSecondary }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${percentage}%`,
              background: isComplete ? colors.success : colors.secondary,
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: colors.textMuted }}>
            {percentage.toFixed(1)}% hoàn thành
          </span>
          {isComplete && (
            <span className="text-xs font-medium" style={{ color: colors.success }}>
              ✓ Đạt mục tiêu
            </span>
          )}
        </div>

        {milestones.length > 0 && (
          <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${colors.borderLight}` }}>
            <div className="space-y-1">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs"
                >
                  <span 
                    style={{ 
                      color: milestone.reached ? colors.textMuted : colors.text,
                      textDecoration: milestone.reached ? 'line-through' : 'none',
                    }}
                  >
                    {milestone.label}
                  </span>
                  <span style={{ color: colors.textMuted }}>
                    {milestone.value}{unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdaptiveCard>
  );
}
