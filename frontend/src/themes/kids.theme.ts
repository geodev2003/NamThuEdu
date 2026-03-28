/**
 * Kids Theme (6-12 tuổi)
 * 
 * Style: Claymorphism - Soft 3D, playful, toy-like
 * Colors: Bright, saturated, energetic
 * Typography: Baloo 2 + Comic Neue (playful, rounded)
 * Gamification: VERY HIGH
 */

import { Theme } from './types';

export const kidsTheme: Theme = {
  name: 'NamThuEdu Kids',
  ageGroup: 'kids',
  
  colors: {
    primary: '#4F46E5',        // Indigo - Trust, learning
    secondary: '#818CF8',      // Light Indigo - Playful
    accent: '#F97316',         // Orange - Energy, excitement
    cta: '#F97316',            // Orange - Call to action
    success: '#10B981',        // Green - Achievement
    warning: '#F59E0B',        // Amber - Attention
    error: '#EF4444',          // Red - Error
    info: '#3B82F6',           // Blue - Information
    background: '#EEF2FF',     // Very Light Indigo - Warm
    backgroundSecondary: '#E0E7FF', // Light Indigo
    surface: '#FFFFFF',        // White - Cards
    text: '#1E1B4B',           // Dark Indigo - Readable
    textSecondary: '#4C1D95',  // Purple - Secondary text
    textMuted: '#6366F1',      // Indigo - Muted text
    border: '#C7D2FE',         // Light Indigo - Borders
    borderLight: '#E0E7FF',    // Very Light Indigo
  },

  typography: {
    fontFamily: {
      heading: "'Baloo 2', 'Comic Sans MS', cursive",
      body: "'Comic Neue', 'Comic Sans MS', cursive",
      mono: "'Courier New', monospace",
    },
    fontSize: {
      xs: '14px',
      sm: '16px',
      base: '18px',    // Large for kids
      lg: '20px',
      xl: '24px',
      '2xl': '28px',
      '3xl': '32px',
      '4xl': '40px',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,   // Default for kids
      bold: 700,
    },
    lineHeight: {
      tight: 1.4,
      normal: 1.8,     // Generous for kids
      relaxed: 2.0,
    },
  },

  spacing: {
    unit: 8,
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',       // Generous spacing
    xl: '32px',
    '2xl': '40px',
    '3xl': '48px',
  },

  borderRadius: {
    none: '0',
    sm: '12px',
    md: '16px',
    lg: '20px',       // Very rounded
    xl: '24px',
    '2xl': '32px',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 2px 8px rgba(79, 70, 229, 0.1)',
    md: '0 4px 12px rgba(79, 70, 229, 0.15)',
    lg: '0 8px 16px rgba(79, 70, 229, 0.2)',   // Soft, playful
    xl: '0 12px 24px rgba(79, 70, 229, 0.25)',
    '2xl': '0 16px 32px rgba(79, 70, 229, 0.3)',
    inner: 'inset 0 2px 4px rgba(79, 70, 229, 0.1)',
  },

  iconSizes: {
    xs: '24px',
    sm: '32px',
    md: '48px',       // Large icons for kids
    lg: '64px',
    xl: '80px',
    '2xl': '96px',
  },

  touchTargets: {
    min: '60px',      // Large touch targets
    comfortable: '72px',
    large: '88px',
  },

  gamification: {
    level: 'high',
    showBadges: true,
    showStickers: true,
    showAnimations: true,
    showSoundEffects: true,
    showProgressBars: true,
    showLeaderboard: true,
    showStreaks: true,
    showCelebrations: true,
  },

  layout: {
    maxColumns: 2,    // Simple layout
    contentDensity: 'low',
    cardPadding: '24px',
    sectionSpacing: '32px',
  },

  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};
