/**
 * Adaptive Card Component
 * 
 * Card that adapts its padding, border radius, and shadow based on age group
 */

import React, { HTMLAttributes } from 'react';
import { useTheme } from '../../hooks/useTheme';

export interface AdaptiveCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  children: React.ReactNode;
}

export function AdaptiveCard({
  variant = 'default',
  padding,
  hoverable = false,
  children,
  className = '',
  style = {},
  ...props
}: AdaptiveCardProps) {
  const { colors, borderRadius, shadows, layout, isKids, isTeens, isAdults } = useTheme();

  // Determine padding based on age group if not specified
  const effectivePadding = padding || (isKids ? 'lg' : isTeens ? 'md' : 'sm');

  // Padding mappings per age group
  const paddingStyles = {
    kids: {
      sm: '20px',
      md: '24px',
      lg: '32px',
    },
    teens: {
      sm: '16px',
      md: '20px',
      lg: '24px',
    },
    adults: {
      sm: '12px',
      md: '16px',
      lg: '20px',
    },
  };

  const ageGroup = isKids ? 'kids' : isTeens ? 'teens' : 'adults';
  const cardPadding = paddingStyles[ageGroup][effectivePadding];

  // Border radius based on age group
  const cardBorderRadius = isKids
    ? borderRadius.lg
    : isTeens
    ? borderRadius.md
    : borderRadius.sm;

  // Variant styles
  const variantStyles = {
    default: {
      backgroundColor: colors.surface,
      boxShadow: isKids ? shadows.md : isTeens ? shadows.sm : shadows.sm,
      border: 'none',
    },
    elevated: {
      backgroundColor: colors.surface,
      boxShadow: isKids ? shadows.lg : isTeens ? shadows.md : shadows.md,
      border: 'none',
    },
    outlined: {
      backgroundColor: colors.surface,
      boxShadow: 'none',
      border: `1px solid ${colors.border}`,
    },
    flat: {
      backgroundColor: colors.backgroundSecondary,
      boxShadow: 'none',
      border: 'none',
    },
  };

  const variantStyle = variantStyles[variant];

  // Combined styles
  const cardStyle: React.CSSProperties = {
    ...variantStyle,
    padding: cardPadding,
    borderRadius: cardBorderRadius,
    transition: 'all 0.2s ease',
    ...style,
  };

  return (
    <div
      className={`adaptive-card ${className}`}
      style={cardStyle}
      {...props}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = isKids ? 'translateY(-4px)' : 'translateY(-2px)';
          e.currentTarget.style.boxShadow = isKids ? shadows.xl : isTeens ? shadows.lg : shadows.md;
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = variantStyle.boxShadow;
        }
      }}
    >
      {children}
    </div>
  );
}
