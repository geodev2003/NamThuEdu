/**
 * useTheme Hook
 * 
 * Convenient hook to access theme values and utilities
 */

import { useThemeContext } from '../contexts/ThemeContext';
import { Theme } from '../themes/types';

export interface UseThemeReturn {
  theme: Theme;
  colors: Theme['colors'];
  typography: Theme['typography'];
  spacing: Theme['spacing'];
  borderRadius: Theme['borderRadius'];
  shadows: Theme['shadows'];
  iconSizes: Theme['iconSizes'];
  touchTargets: Theme['touchTargets'];
  gamification: Theme['gamification'];
  layout: Theme['layout'];
  animations: Theme['animations'];
  isKids: boolean;
  isTeens: boolean;
  isAdults: boolean;
}

/**
 * Hook to access current theme and its properties
 */
export function useTheme(): UseThemeReturn {
  const { theme } = useThemeContext();

  return {
    theme,
    colors: theme.colors,
    typography: theme.typography,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
    shadows: theme.shadows,
    iconSizes: theme.iconSizes,
    touchTargets: theme.touchTargets,
    gamification: theme.gamification,
    layout: theme.layout,
    animations: theme.animations,
    isKids: theme.ageGroup === 'kids',
    isTeens: theme.ageGroup === 'teens',
    isAdults: theme.ageGroup === 'adults',
  };
}
