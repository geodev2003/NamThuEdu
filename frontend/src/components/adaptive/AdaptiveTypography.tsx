/**
 * Adaptive Typography Components
 * 
 * Typography components that adapt font size, weight, and family based on age group
 */

import React, { HTMLAttributes } from 'react';
import { useTheme } from '../../hooks/useTheme';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';

export interface AdaptiveTypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  color?: string;
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
  as?: React.ElementType;
}

export function AdaptiveTypography({
  variant = 'body',
  color,
  weight,
  align = 'left',
  children,
  className = '',
  style = {},
  as,
  ...props
}: AdaptiveTypographyProps) {
  const { colors, typography, isKids, isTeens, isAdults } = useTheme();

  // Determine element tag
  const variantTags: Record<TypographyVariant, React.ElementType> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    body: 'p',
    caption: 'span',
    label: 'label',
  };

  const Component = as || variantTags[variant];

  // Font size mappings
  const fontSizeMap: Record<TypographyVariant, string> = {
    h1: typography.fontSize['3xl'],
    h2: typography.fontSize['2xl'],
    h3: typography.fontSize.xl,
    h4: typography.fontSize.lg,
    body: typography.fontSize.base,
    caption: typography.fontSize.sm,
    label: typography.fontSize.sm,
  };

  // Font weight mappings
  const fontWeightMap = {
    h1: typography.fontWeight.bold,
    h2: typography.fontWeight.bold,
    h3: typography.fontWeight.semibold,
    h4: typography.fontWeight.semibold,
    body: typography.fontWeight.normal,
    caption: typography.fontWeight.normal,
    label: typography.fontWeight.medium,
  };

  // Font family
  const fontFamily =
    variant.startsWith('h') ? typography.fontFamily.heading : typography.fontFamily.body;

  // Text color
  const textColor = color || (variant === 'caption' ? colors.textMuted : colors.text);

  // Font weight
  const fontWeight = weight ? typography.fontWeight[weight] : fontWeightMap[variant];

  // Line height
  const lineHeight = isKids
    ? typography.lineHeight.relaxed
    : isTeens
    ? typography.lineHeight.normal
    : typography.lineHeight.tight;

  // Combined styles
  const textStyle: React.CSSProperties = {
    fontFamily,
    fontSize: fontSizeMap[variant],
    fontWeight,
    color: textColor,
    lineHeight,
    textAlign: align,
    margin: 0,
    ...style,
  };

  return (
    <Component className={`adaptive-typography ${className}`} style={textStyle} {...props}>
      {children}
    </Component>
  );
}

// Convenience components
export function AdaptiveHeading1(props: Omit<AdaptiveTypographyProps, 'variant'>) {
  return <AdaptiveTypography variant="h1" {...props} />;
}

export function AdaptiveHeading2(props: Omit<AdaptiveTypographyProps, 'variant'>) {
  return <AdaptiveTypography variant="h2" {...props} />;
}

export function AdaptiveHeading3(props: Omit<AdaptiveTypographyProps, 'variant'>) {
  return <AdaptiveTypography variant="h3" {...props} />;
}

export function AdaptiveHeading4(props: Omit<AdaptiveTypographyProps, 'variant'>) {
  return <AdaptiveTypography variant="h4" {...props} />;
}

export function AdaptiveBody(props: Omit<AdaptiveTypographyProps, 'variant'>) {
  return <AdaptiveTypography variant="body" {...props} />;
}

export function AdaptiveCaption(props: Omit<AdaptiveTypographyProps, 'variant'>) {
  return <AdaptiveTypography variant="caption" {...props} />;
}

export function AdaptiveLabel(props: Omit<AdaptiveTypographyProps, 'variant'>) {
  return <AdaptiveTypography variant="label" {...props} />;
}
