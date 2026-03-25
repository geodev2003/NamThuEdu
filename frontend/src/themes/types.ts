/**
 * Theme Type Definitions
 * 
 * TypeScript interfaces for theme configuration
 */

import { AgeGroup } from '../utils/ageDetection';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  cta: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  backgroundSecondary: string;
  surface: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
}

export interface ThemeTypography {
  fontFamily: {
    heading: string;
    body: string;
    mono?: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface ThemeSpacing {
  unit: number; // Base unit (e.g., 8px)
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

export interface ThemeShadows {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
}

export interface ThemeIconSizes {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeTouchTargets {
  min: string;
  comfortable: string;
  large: string;
}

export interface ThemeGamification {
  level: 'high' | 'medium' | 'low';
  showBadges: boolean;
  showStickers: boolean;
  showAnimations: boolean;
  showSoundEffects: boolean;
  showProgressBars: boolean;
  showLeaderboard: boolean;
  showStreaks: boolean;
  showCelebrations: boolean;
}

export interface ThemeLayout {
  maxColumns: number;
  contentDensity: 'low' | 'medium' | 'high';
  cardPadding: string;
  sectionSpacing: string;
}

export interface ThemeAnimations {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    default: string;
    in: string;
    out: string;
    inOut: string;
  };
}

export interface Theme {
  name: string;
  ageGroup: AgeGroup;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  iconSizes: ThemeIconSizes;
  touchTargets: ThemeTouchTargets;
  gamification: ThemeGamification;
  layout: ThemeLayout;
  animations: ThemeAnimations;
}

export type ThemePreference = 'auto' | AgeGroup;
