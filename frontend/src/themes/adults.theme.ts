/**
 * Adults Theme (18-45 tuổi)
 * 
 * Style: Trust & Authority - Professional, minimalist
 * Colors: Professional, muted, clean
 * Typography: Poppins + Open Sans (professional)
 * Gamification: LOW (focus on analytics)
 */

import { Theme } from './types';

export const adultsTheme: Theme = {
  name: 'NamThuEdu Adults',
  ageGroup: 'adults',
  
  colors: {
    primary: '#0F172A',        // Slate 900 - Professional, serious
    secondary: '#2563EB',      // Blue - Trust, corporate
    accent: '#10B981',         // Green - Success, progress
    cta: '#2563EB',            // Blue - Call to action
    success: '#10B981',        // Green - Success
    warning: '#F59E0B',        // Amber - Warning
    error: '#EF4444',          // Red - Error
    info: '#3B82F6',           // Blue - Information
    background: '#FFFFFF',     // Pure White - Clean
    backgroundSecondary: '#F8FAFC', // Slate 50
    surface: '#FFFFFF',        // White - Cards
    text: '#0F172A',           // Slate 900 - High readability
    textSecondary: '#475569',  // Slate 600 - Secondary
    textMuted: '#64748B',      // Slate 500 - Muted
    border: '#E2E8F0',         // Slate 200 - Borders
    borderLight: '#F1F5F9',    // Slate 100
  },

  typography: {
    fontFamily: {
      heading: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
      body: "'Open Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'Fira Code', 'Courier New', monospace",
    },
    fontSize: {
      xs: '11px',
      sm: '13px',
      base: '15px',    // Smaller for content density
      lg: '17px',
      xl: '19px',
      '2xl': '22px',
      '3xl': '26px',
      '4xl': '32px',
    },
    fontWeight: {
      light: 300,
      normal: 400,     // Default for adults
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,     // Compact
      relaxed: 1.75,
    },
  },

  spacing: {
    unit: 8,
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',       // Compact spacing
    xl: '24px',
    '2xl': '32px',
    '3xl': '40px',
  },

  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',        // Subtle, professional
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',       // Minimal
    md: '0 2px 8px rgba(0, 0, 0, 0.06)',
    lg: '0 4px 12px rgba(0, 0, 0, 0.08)',
    xl: '0 8px 16px rgba(0, 0, 0, 0.1)',
    '2xl': '0 12px 24px rgba(0, 0, 0, 0.12)',
    inner: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
  },

  iconSizes: {
    xs: '14px',
    sm: '16px',
    md: '20px',       // Smaller, efficient
    lg: '24px',
    xl: '32px',
    '2xl': '40px',
  },

  touchTargets: {
    min: '40px',      // Efficient touch targets
    comfortable: '44px',
    large: '48px',
  },

  gamification: {
    level: 'low',
    showBadges: false,        // Not motivating for adults
    showStickers: false,      // Childish
    showAnimations: false,    // Minimal
    showSoundEffects: false,  // No sounds
    showProgressBars: true,   // Analytics
    showLeaderboard: false,   // Optional
    showStreaks: true,        // Habit formation
    showCelebrations: false,  // Subtle only
  },

  layout: {
    maxColumns: 4,    // Data-dense
    contentDensity: 'high',
    cardPadding: '16px',
    sectionSpacing: '20px',
  },

  animations: {
    duration: {
      fast: '100ms',
      normal: '200ms',  // Quick, functional
      slow: '300ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};
