/**
 * Adaptive Button Component
 * 
 * Button that adapts its size, style, and behavior based on age group
 */

import React, { ButtonHTMLAttributes } from 'react';
import { useTheme } from '../../hooks/useTheme';

export interface AdaptiveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cta' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function AdaptiveButton({
  variant = 'primary',
  size,
  fullWidth = false,
  children,
  className = '',
  style = {},
  disabled,
  ...props
}: AdaptiveButtonProps) {
  const { colors, typography, borderRadius, shadows, touchTargets, isKids, isTeens, isAdults } =
    useTheme();

  // Determine size based on age group if not specified
  const effectiveSize = size || (isKids ? 'lg' : isTeens ? 'md' : 'sm');

  // Size mappings per age group
  const sizeStyles = {
    kids: {
      sm: { height: '48px', fontSize: '16px', padding: '0 20px' },
      md: { height: '56px', fontSize: '18px', padding: '0 24px' },
      lg: { height: '64px', fontSize: '20px', padding: '0 32px' },
    },
    teens: {
      sm: { height: '40px', fontSize: '14px', padding: '0 16px' },
      md: { height: '48px', fontSize: '16px', padding: '0 20px' },
      lg: { height: '56px', fontSize: '18px', padding: '0 24px' },
    },
    adults: {
      sm: { height: '36px', fontSize: '13px', padding: '0 12px' },
      md: { height: '40px', fontSize: '15px', padding: '0 16px' },
      lg: { height: '48px', fontSize: '17px', padding: '0 20px' },
    },
  };

  const ageGroup = isKids ? 'kids' : isTeens ? 'teens' : 'adults';
  const sizeStyle = sizeStyles[ageGroup][effectiveSize];

  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: colors.primary,
      color: '#FFFFFF',
      border: 'none',
    },
    secondary: {
      backgroundColor: colors.secondary,
      color: '#FFFFFF',
      border: 'none',
    },
    cta: {
      backgroundColor: colors.cta,
      color: '#FFFFFF',
      border: 'none',
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.primary,
      border: `2px solid ${colors.primary}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.text,
      border: 'none',
    },
  };

  const variantStyle = variantStyles[variant];

  // Border radius based on age group
  const buttonBorderRadius = isKids
    ? borderRadius.lg
    : isTeens
    ? borderRadius.md
    : borderRadius.sm;

  // Shadow based on age group
  const buttonShadow = isKids ? shadows.md : isTeens ? shadows.sm : 'none';

  // Combined styles
  const buttonStyle: React.CSSProperties = {
    ...sizeStyle,
    ...variantStyle,
    borderRadius: buttonBorderRadius,
    boxShadow: disabled ? 'none' : buttonShadow,
    fontFamily: typography.fontFamily.body,
    fontWeight: isKids ? typography.fontWeight.semibold : typography.fontWeight.medium,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    minHeight: touchTargets.min,
    ...style,
  };

  return (
    <button
      className={`adaptive-button ${className}`}
      style={buttonStyle}
      disabled={disabled}
      {...props}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = isKids ? 'scale(1.05)' : 'scale(1.02)';
          e.currentTarget.style.boxShadow = isKids ? shadows.lg : shadows.md;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = buttonShadow;
        }
      }}
    >
      {children}
    </button>
  );
}
