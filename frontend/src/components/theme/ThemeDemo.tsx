/**
 * Theme Demo Component
 * 
 * Demonstrates theme-aware components and styling
 */

import React from 'react';
import { useTheme } from '../../hooks/useTheme';

export function ThemeDemo() {
  const { theme, colors, typography, spacing, borderRadius, shadows, iconSizes, gamification } =
    useTheme();

  return (
    <div className="theme-demo p-6 space-y-6">
      {/* Theme Info */}
      <div
        className="p-6 rounded-lg"
        style={{
          backgroundColor: colors.background,
          borderRadius: borderRadius.lg,
          boxShadow: shadows.md,
        }}
      >
        <h2
          className="text-2xl font-bold mb-2"
          style={{
            fontFamily: typography.fontFamily.heading,
            color: colors.text,
          }}
        >
          {theme.name}
        </h2>
        <p
          className="text-sm"
          style={{
            fontFamily: typography.fontFamily.body,
            color: colors.textSecondary,
          }}
        >
          Age Group: {theme.ageGroup} | Gamification: {gamification.level}
        </p>
      </div>

      {/* Color Palette */}
      <div
        className="p-6 rounded-lg"
        style={{
          backgroundColor: colors.surface,
          borderRadius: borderRadius.lg,
          boxShadow: shadows.md,
        }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{
            fontFamily: typography.fontFamily.heading,
            color: colors.text,
          }}
        >
          Color Palette
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(colors).slice(0, 8).map(([name, value]) => (
            <div key={name} className="text-center">
              <div
                className="w-full h-16 rounded mb-2"
                style={{
                  backgroundColor: value,
                  borderRadius: borderRadius.md,
                }}
              />
              <p className="text-xs" style={{ color: colors.textMuted }}>
                {name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div
        className="p-6 rounded-lg"
        style={{
          backgroundColor: colors.surface,
          borderRadius: borderRadius.lg,
          boxShadow: shadows.md,
        }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{
            fontFamily: typography.fontFamily.heading,
            color: colors.text,
          }}
        >
          Typography
        </h3>
        <div className="space-y-2">
          <p
            style={{
              fontFamily: typography.fontFamily.heading,
              fontSize: typography.fontSize['2xl'],
              color: colors.text,
            }}
          >
            Heading Font - {typography.fontSize['2xl']}
          </p>
          <p
            style={{
              fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.base,
              color: colors.textSecondary,
            }}
          >
            Body Font - {typography.fontSize.base}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div
        className="p-6 rounded-lg"
        style={{
          backgroundColor: colors.surface,
          borderRadius: borderRadius.lg,
          boxShadow: shadows.md,
        }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{
            fontFamily: typography.fontFamily.heading,
            color: colors.text,
          }}
        >
          Buttons
        </h3>
        <div className="flex flex-wrap gap-4">
          <button
            className="px-6 py-3 font-medium transition-all hover:opacity-90"
            style={{
              backgroundColor: colors.primary,
              color: '#FFFFFF',
              borderRadius: borderRadius.lg,
              fontSize: typography.fontSize.base,
            }}
          >
            Primary Button
          </button>
          <button
            className="px-6 py-3 font-medium transition-all hover:opacity-90"
            style={{
              backgroundColor: colors.secondary,
              color: '#FFFFFF',
              borderRadius: borderRadius.lg,
              fontSize: typography.fontSize.base,
            }}
          >
            Secondary Button
          </button>
          <button
            className="px-6 py-3 font-medium transition-all hover:opacity-90"
            style={{
              backgroundColor: colors.cta,
              color: '#FFFFFF',
              borderRadius: borderRadius.lg,
              fontSize: typography.fontSize.base,
            }}
          >
            CTA Button
          </button>
        </div>
      </div>

      {/* Cards */}
      <div
        className="p-6 rounded-lg"
        style={{
          backgroundColor: colors.surface,
          borderRadius: borderRadius.lg,
          boxShadow: shadows.md,
        }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{
            fontFamily: typography.fontFamily.heading,
            color: colors.text,
          }}
        >
          Cards
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {['Card 1', 'Card 2', 'Card 3'].map((title) => (
            <div
              key={title}
              className="p-4 transition-all hover:scale-105"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderRadius: borderRadius.lg,
                boxShadow: shadows.sm,
              }}
            >
              <div
                className="w-12 h-12 rounded-full mb-3 flex items-center justify-center"
                style={{
                  backgroundColor: colors.primary,
                  width: iconSizes.md,
                  height: iconSizes.md,
                }}
              >
                <span style={{ color: '#FFFFFF', fontSize: typography.fontSize.lg }}>
                  {title.charAt(5)}
                </span>
              </div>
              <h4
                className="font-semibold mb-1"
                style={{
                  fontFamily: typography.fontFamily.heading,
                  color: colors.text,
                  fontSize: typography.fontSize.base,
                }}
              >
                {title}
              </h4>
              <p
                style={{
                  fontFamily: typography.fontFamily.body,
                  color: colors.textMuted,
                  fontSize: typography.fontSize.sm,
                }}
              >
                Sample card content
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Gamification Features */}
      {gamification.level !== 'low' && (
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: colors.surface,
            borderRadius: borderRadius.lg,
            boxShadow: shadows.md,
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{
              fontFamily: typography.fontFamily.heading,
              color: colors.text,
            }}
          >
            Gamification Features
          </h3>
          <div className="space-y-2 text-sm">
            {gamification.showBadges && (
              <p style={{ color: colors.textSecondary }}>✓ Badges enabled</p>
            )}
            {gamification.showStickers && (
              <p style={{ color: colors.textSecondary }}>✓ Stickers enabled</p>
            )}
            {gamification.showAnimations && (
              <p style={{ color: colors.textSecondary }}>✓ Animations enabled</p>
            )}
            {gamification.showLeaderboard && (
              <p style={{ color: colors.textSecondary }}>✓ Leaderboard enabled</p>
            )}
            {gamification.showStreaks && (
              <p style={{ color: colors.textSecondary }}>✓ Streaks enabled</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
