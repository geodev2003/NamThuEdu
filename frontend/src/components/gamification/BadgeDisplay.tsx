/**
 * Badge Display Component
 * 
 * Displays badges/achievements with age-appropriate styling
 */

import { Award, Star, Trophy, Crown, Zap, Target, Heart, Sparkles } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { AdaptiveCard } from '../adaptive';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: 'award' | 'star' | 'trophy' | 'crown' | 'zap' | 'target' | 'heart' | 'sparkles';
  color: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number; // 0-100 for partially earned badges
}

interface BadgeDisplayProps {
  badges: Badge[];
  maxDisplay?: number;
}

const iconMap = {
  award: Award,
  star: Star,
  trophy: Trophy,
  crown: Crown,
  zap: Zap,
  target: Target,
  heart: Heart,
  sparkles: Sparkles,
};

export function BadgeDisplay({ badges, maxDisplay }: BadgeDisplayProps) {
  const { colors, borderRadius, shadows, isKids, isTeens, isAdults } = useTheme();

  const displayBadges = maxDisplay ? badges.slice(0, maxDisplay) : badges;

  // Kids: Large, colorful, animated
  if (isKids) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayBadges.map((badge) => {
          const Icon = iconMap[badge.icon];
          return (
            <AdaptiveCard 
              key={badge.id} 
              variant="elevated"
              hoverable
              style={{
                opacity: badge.earned ? 1 : 0.4,
                cursor: 'pointer',
              }}
            >
              <div className="flex flex-col items-center text-center py-3">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
                  style={{
                    background: badge.earned 
                      ? `linear-gradient(135deg, ${badge.color}, ${badge.color}CC)`
                      : colors.backgroundSecondary,
                    boxShadow: badge.earned ? shadows.md : 'none',
                  }}
                >
                  <Icon 
                    className="w-10 h-10" 
                    style={{ color: badge.earned ? '#FFFFFF' : colors.textMuted }} 
                  />
                </div>
                <p 
                  className="font-bold mb-1"
                  style={{ fontSize: '16px', color: colors.text }}
                >
                  {badge.name}
                </p>
                <p 
                  className="text-xs"
                  style={{ color: colors.textMuted }}
                >
                  {badge.description}
                </p>
                {badge.earned && badge.earnedDate && (
                  <p 
                    className="text-xs mt-2 font-semibold"
                    style={{ color: badge.color }}
                  >
                    ✨ {badge.earnedDate}
                  </p>
                )}
                {!badge.earned && badge.progress !== undefined && (
                  <div className="w-full mt-2">
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: colors.backgroundSecondary }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${badge.progress}%`,
                          background: badge.color,
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                      {badge.progress}%
                    </p>
                  </div>
                )}
              </div>
            </AdaptiveCard>
          );
        })}
      </div>
    );
  }

  // Teens: Modern, sleek
  if (isTeens) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {displayBadges.map((badge) => {
          const Icon = iconMap[badge.icon];
          return (
            <AdaptiveCard 
              key={badge.id} 
              variant="outlined"
              hoverable
              style={{
                opacity: badge.earned ? 1 : 0.5,
                cursor: 'pointer',
              }}
            >
              <div className="flex flex-col items-center text-center py-2">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-2"
                  style={{
                    background: badge.earned 
                      ? `${badge.color}20`
                      : colors.backgroundSecondary,
                  }}
                >
                  <Icon 
                    className="w-7 h-7" 
                    style={{ color: badge.earned ? badge.color : colors.textMuted }} 
                  />
                </div>
                <p 
                  className="font-semibold text-xs mb-1"
                  style={{ color: colors.text }}
                >
                  {badge.name}
                </p>
                {badge.earned && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ 
                      background: `${badge.color}15`,
                      color: badge.color 
                    }}
                  >
                    Đạt được
                  </span>
                )}
                {!badge.earned && badge.progress !== undefined && (
                  <div className="w-full mt-1">
                    <div
                      className="h-1 rounded-full overflow-hidden"
                      style={{ background: colors.backgroundSecondary }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${badge.progress}%`,
                          background: badge.color,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </AdaptiveCard>
          );
        })}
      </div>
    );
  }

  // Adults: Minimal, professional
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
      {displayBadges.map((badge) => {
        const Icon = iconMap[badge.icon];
        return (
          <div
            key={badge.id}
            className="flex flex-col items-center text-center p-2 rounded-lg cursor-pointer transition-all"
            style={{
              background: badge.earned ? colors.backgroundSecondary : 'transparent',
              border: `1px solid ${badge.earned ? colors.border : colors.borderLight}`,
              opacity: badge.earned ? 1 : 0.4,
            }}
            title={badge.description}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-1"
              style={{
                background: badge.earned ? `${badge.color}10` : colors.backgroundSecondary,
              }}
            >
              <Icon 
                className="w-5 h-5" 
                style={{ color: badge.earned ? badge.color : colors.textMuted }} 
              />
            </div>
            <p 
              className="text-xs font-medium truncate w-full"
              style={{ color: colors.text }}
            >
              {badge.name}
            </p>
          </div>
        );
      })}
    </div>
  );
}
