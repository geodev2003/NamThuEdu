/**
 * Theme Utilities
 * 
 * Helper functions for theme management and CSS variable injection
 */

import { Theme, ThemePreference } from './types';
import { AgeGroup } from '../utils/ageDetection';
import { kidsTheme } from './kids.theme';
import { teensTheme } from './teens.theme';
import { adultsTheme } from './adults.theme';

/**
 * Get theme by age group
 */
export function getThemeByAgeGroup(ageGroup: AgeGroup): Theme {
  switch (ageGroup) {
    case 'kids':
      return kidsTheme;
    case 'teens':
      return teensTheme;
    case 'adults':
      return adultsTheme;
    default:
      return teensTheme; // Default fallback
  }
}

/**
 * Get effective theme based on preference and age group
 */
export function getEffectiveTheme(
  themePreference: ThemePreference,
  ageGroup: AgeGroup
): Theme {
  if (themePreference === 'auto') {
    return getThemeByAgeGroup(ageGroup);
  }
  return getThemeByAgeGroup(themePreference);
}

/**
 * Apply theme to document (inject CSS variables)
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${camelToKebab(key)}`, value);
  });

  // Typography
  root.style.setProperty('--font-heading', theme.typography.fontFamily.heading);
  root.style.setProperty('--font-body', theme.typography.fontFamily.body);
  if (theme.typography.fontFamily.mono) {
    root.style.setProperty('--font-mono', theme.typography.fontFamily.mono);
  }

  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    root.style.setProperty(`--font-size-${key}`, value);
  });

  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    root.style.setProperty(`--font-weight-${key}`, value.toString());
  });

  Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
    root.style.setProperty(`--line-height-${key}`, value.toString());
  });

  // Spacing
  root.style.setProperty('--spacing-unit', theme.spacing.unit.toString());
  Object.entries(theme.spacing).forEach(([key, value]) => {
    if (key !== 'unit') {
      root.style.setProperty(`--spacing-${key}`, value);
    }
  });

  // Border Radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });

  // Shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });

  // Icon Sizes
  Object.entries(theme.iconSizes).forEach(([key, value]) => {
    root.style.setProperty(`--icon-${key}`, value);
  });

  // Touch Targets
  Object.entries(theme.touchTargets).forEach(([key, value]) => {
    root.style.setProperty(`--touch-${key}`, value);
  });

  // Layout
  root.style.setProperty('--max-columns', theme.layout.maxColumns.toString());
  root.style.setProperty('--content-density', theme.layout.contentDensity);
  root.style.setProperty('--card-padding', theme.layout.cardPadding);
  root.style.setProperty('--section-spacing', theme.layout.sectionSpacing);

  // Animations
  Object.entries(theme.animations.duration).forEach(([key, value]) => {
    root.style.setProperty(`--duration-${key}`, value);
  });

  Object.entries(theme.animations.easing).forEach(([key, value]) => {
    root.style.setProperty(`--easing-${key}`, value);
  });

  // Store theme name as data attribute
  root.setAttribute('data-theme', theme.ageGroup);
  root.setAttribute('data-theme-name', theme.name);
}

/**
 * Load Google Fonts for theme
 */
export function loadThemeFonts(theme: Theme): void {
  const fontFamilies: string[] = [];

  // Extract font families
  if (theme.typography.fontFamily.heading.includes('Baloo 2')) {
    fontFamilies.push('Baloo+2:wght@400;500;600;700');
  }
  if (theme.typography.fontFamily.body.includes('Comic Neue')) {
    fontFamilies.push('Comic+Neue:wght@300;400;700');
  }
  if (theme.typography.fontFamily.heading.includes('Inter')) {
    fontFamilies.push('Inter:wght@300;400;500;600;700');
  }
  if (theme.typography.fontFamily.heading.includes('Poppins')) {
    fontFamilies.push('Poppins:wght@400;500;600;700');
  }
  if (theme.typography.fontFamily.body.includes('Open Sans')) {
    fontFamilies.push('Open+Sans:wght@300;400;500;600;700');
  }

  if (fontFamilies.length === 0) return;

  // Check if fonts are already loaded
  const existingLink = document.querySelector('link[data-theme-fonts]');
  if (existingLink) {
    existingLink.remove();
  }

  // Create and append font link
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${fontFamilies
    .map((f) => `family=${f}`)
    .join('&')}&display=swap`;
  link.setAttribute('data-theme-fonts', 'true');
  document.head.appendChild(link);
}

/**
 * Get all available themes
 */
export function getAllThemes(): Theme[] {
  return [kidsTheme, teensTheme, adultsTheme];
}

/**
 * Get theme name by age group
 */
export function getThemeName(ageGroup: AgeGroup): string {
  return getThemeByAgeGroup(ageGroup).name;
}

/**
 * Convert camelCase to kebab-case
 */
function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Save theme preference to localStorage
 */
export function saveThemePreference(preference: ThemePreference): void {
  localStorage.setItem('theme-preference', preference);
}

/**
 * Load theme preference from localStorage
 */
export function loadThemePreference(): ThemePreference | null {
  const saved = localStorage.getItem('theme-preference');
  if (saved && ['auto', 'kids', 'teens', 'adults'].includes(saved)) {
    return saved as ThemePreference;
  }
  return null;
}

/**
 * Clear theme preference from localStorage
 */
export function clearThemePreference(): void {
  localStorage.removeItem('theme-preference');
}
