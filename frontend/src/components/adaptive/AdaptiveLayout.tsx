/**
 * Adaptive Layout Components
 * 
 * Layout components that adapt grid columns and spacing based on age group
 */

import React, { HTMLAttributes } from 'react';
import { useTheme } from '../../hooks/useTheme';

export interface AdaptiveGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: number;
  gap?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function AdaptiveGrid({
  columns,
  gap = 'md',
  children,
  className = '',
  style = {},
  ...props
}: AdaptiveGridProps) {
  const { spacing, layout, isKids, isTeens, isAdults } = useTheme();

  // Determine columns based on age group if not specified
  const effectiveColumns = columns || layout.maxColumns;

  // Gap mappings
  const gapMap = {
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
  };

  const gridGap = gapMap[gap];

  // Combined styles
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
    gap: gridGap,
    maxWidth: '100%',
    ...style,
  };

  return (
    <div className={`adaptive-grid ${className}`} style={gridStyle} {...props}>
      {children}
    </div>
  );
}

export interface AdaptiveStackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'vertical' | 'horizontal';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  children: React.ReactNode;
}

export function AdaptiveStack({
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  children,
  className = '',
  style = {},
  ...props
}: AdaptiveStackProps) {
  const { spacing: themeSpacing } = useTheme();

  // Spacing map
  const spacingMap = {
    xs: themeSpacing.xs,
    sm: themeSpacing.sm,
    md: themeSpacing.md,
    lg: themeSpacing.lg,
    xl: themeSpacing.xl,
  };

  const stackSpacing = spacingMap[spacing];

  // Align map
  const alignMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  };

  // Justify map
  const justifyMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
  };

  // Combined styles
  const stackStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    gap: stackSpacing,
    alignItems: alignMap[align],
    justifyContent: justifyMap[justify],
    ...style,
  };

  return (
    <div className={`adaptive-stack ${className}`} style={stackStyle} {...props}>
      {children}
    </div>
  );
}

export interface AdaptiveContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  children: React.ReactNode;
}

export function AdaptiveContainer({
  maxWidth = 'lg',
  padding = true,
  children,
  className = '',
  style = {},
  ...props
}: AdaptiveContainerProps) {
  const { spacing, isKids, isTeens, isAdults } = useTheme();

  // Max width map
  const maxWidthMap = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    full: '100%',
  };

  // Padding based on age group
  const containerPadding = padding
    ? isKids
      ? spacing.xl
      : isTeens
      ? spacing.lg
      : spacing.md
    : '0';

  // Combined styles
  const containerStyle: React.CSSProperties = {
    maxWidth: maxWidthMap[maxWidth],
    margin: '0 auto',
    padding: containerPadding,
    width: '100%',
    ...style,
  };

  return (
    <div className={`adaptive-container ${className}`} style={containerStyle} {...props}>
      {children}
    </div>
  );
}

export interface AdaptiveSectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function AdaptiveSection({
  spacing = 'md',
  children,
  className = '',
  style = {},
  ...props
}: AdaptiveSectionProps) {
  const { spacing: themeSpacing, layout } = useTheme();

  // Spacing map
  const spacingMap = {
    sm: themeSpacing.lg,
    md: layout.sectionSpacing,
    lg: themeSpacing['2xl'],
  };

  const sectionSpacing = spacingMap[spacing];

  // Combined styles
  const sectionStyle: React.CSSProperties = {
    marginBottom: sectionSpacing,
    ...style,
  };

  return (
    <section className={`adaptive-section ${className}`} style={sectionStyle} {...props}>
      {children}
    </section>
  );
}
