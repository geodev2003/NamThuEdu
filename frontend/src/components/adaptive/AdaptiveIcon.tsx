/**
 * Adaptive Icon Component
 * 
 * Icon wrapper that adapts size based on age group
 */

import React, { HTMLAttributes } from 'react';
import { useTheme } from '../../hooks/useTheme';

export interface AdaptiveIconProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  children: React.ReactNode;
}

export function AdaptiveIcon({
  size,
  color,
  children,
  className = '',
  style = {},
  ...props
}: AdaptiveIconProps) {
  const { colors, iconSizes, isKids, isTeens, isAdults } = useTheme();

  // Determine size based on age group if not specified
  const effectiveSize = size || (isKids ? 'lg' : isTeens ? 'md' : 'sm');

  // Get icon size from theme
  const iconSize = iconSizes[effectiveSize];

  // Icon color
  const iconColor = color || colors.text;

  // Combined styles
  const iconStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: iconSize,
    height: iconSize,
    color: iconColor,
    flexShrink: 0,
    ...style,
  };

  return (
    <span className={`adaptive-icon ${className}`} style={iconStyle} {...props}>
      {children}
    </span>
  );
}

/**
 * Adaptive Icon Button
 * Icon wrapped in a clickable button
 */
export interface AdaptiveIconButtonProps extends HTMLAttributes<HTMLButtonElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  variant?: 'default' | 'filled' | 'outlined';
  children: React.ReactNode;
  disabled?: boolean;
}

export function AdaptiveIconButton({
  size,
  color,
  variant = 'default',
  children,
  className = '',
  style = {},
  disabled,
  ...props
}: AdaptiveIconButtonProps) {
  const { colors, iconSizes, borderRadius, shadows, touchTargets, isKids, isTeens } = useTheme();

  // Determine size based on age group if not specified
  const effectiveSize = size || (isKids ? 'lg' : isTeens ? 'md' : 'sm');

  // Get icon size from theme
  const iconSize = iconSizes[effectiveSize];

  // Button size (larger than icon for touch target)
  const buttonSize = touchTargets.min;

  // Icon color
  const iconColor = color || colors.text;

  // Variant styles
  const variantStyles = {
    default: {
      backgroundColor: 'transparent',
      color: iconColor,
      border: 'none',
    },
    filled: {
      backgroundColor: colors.primary,
      color: '#FFFFFF',
      border: 'none',
    },
    outlined: {
      backgroundColor: 'transparent',
      color: iconColor,
      border: `2px solid ${colors.border}`,
    },
  };

  const variantStyle = variantStyles[variant];

  // Combined styles
  const buttonStyle: React.CSSProperties = {
    ...variantStyle,
    width: buttonSize,
    height: buttonSize,
    minWidth: buttonSize,
    minHeight: buttonSize,
    borderRadius: borderRadius.md,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    padding: 0,
    ...style,
  };

  return (
    <button
      className={`adaptive-icon-button ${className}`}
      style={buttonStyle}
      disabled={disabled}
      {...props}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor =
            variant === 'default' ? colors.backgroundSecondary : variantStyle.backgroundColor;
          e.currentTarget.style.transform = 'scale(1.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = variantStyle.backgroundColor;
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
    >
      <span style={{ width: iconSize, height: iconSize, display: 'flex' }}>{children}</span>
    </button>
  );
}
