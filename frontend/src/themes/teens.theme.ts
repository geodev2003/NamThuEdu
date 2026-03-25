/**
 * Teens Theme (13-17 tuổi)
 * 
 * Style: Glassmorphism - Modern, frosted glass, layered
 * Colors: Modern, trendy, not too childish
 * Typography: Inter + Poppins (clean, modern)
 * Gamification: MEDIUM
 */

import { Theme } from './types';

export const teensTheme: Theme = {
  name: 'NamThuEdu Teens',
  ageGroup: 'teens',
  
  colors: {
    primary: '#6366F1',        // Indigo - Modern, tech
    secondary: '#8B5CF6',      // Purple - Creative, unique
    accent: '#F59E0B',         // Amber - Energy, achievement
    cta: '#10B981',            // Green - Call to action
    success: '#10B981',        // Green - Success
    warning: '#F59E0B',        // Amber - Warning
    error: '#EF4444',          // Red - Error
    info: '#3B82F6',           // Blue - Information
    background: '#F9FAFB',     // Light Gray - Clean, modern
    backgroundSecondary: '#F3F4F6', // Gray 100
    surface: '#FFFFFF',        // White - Cards
    text: '#111827',           // Almost Black - High contrast
    textSecondary: '#374151',  // Gray 700 - Secondary
    textMuted: '#6B7280',      // Gray 500 - Muted
    border: '#E5E7EB',         // Gray 200 - Borders
    borderLight: '#F3F4F6',    // Gray 100
  },

  typography: {
    fontFamily: {
      heading: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'Fira Code', 'Courier New', monospace",
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',    // Standard size
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px',
      '4xl': '36px',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,     // Default for teens
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.3,
      normal: 1.6,     // Balanced
      relaxed: 1.8,
    },
  },

  spacing: {
    unit: 8,
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',       // Balanced spacing
    xl: '32px',
    '2xl': '40px',
    '3xl': '48px',
  },

  borderRadius: {
    none: '0',
    sm: '8px',
    md: '12px',       // Modern, not too rounded
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(0, 0, 0, 0.05)',
    md: '0 4px 12px rgba(0, 0, 0, 0.08)',      // Subtle, modern
    lg: '0 8px 16px rgba(0, 0, 0, 0.1)',
    xl: '0 12px 24px rgba(0, 0, 0, 0.12)',
    '2xl': '0 16px 32px rgba(0, 0, 0, 0.15)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  },

  iconSizes: {
    xs: '16px',
    sm: '20px',
    md: '24px',       // Standard icons
    lg: '32px',
    xl: '40px',
    '2xl': '48px',
  },

  touchTargets: {
    min: '44px',      // Standard touch targets
    comfortable: '48px',
    large: '56px',
  },

  gamification: {
    level: 'medium',
    showBadges: true,
    showStickers: false,      // Not childish
    showAnimations: true,
    showSoundEffects: false,  // Optional
    showProgressBars: true,
    showLeaderboard: true,    // Competitive
    showStreaks: true,
    showCelebrations: true,   // Subtle
  },

  layout: {
    maxColumns: 3,    // More complex
    contentDensity: 'medium',
    cardPadding: '20px',
    sectionSpacing: '24px',
  },

  animations: {
    duration: {
      fast: '150ms',
      normal: '250ms',  // Quick, smooth
      slow: '400ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};
