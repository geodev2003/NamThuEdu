/**
 * useAgeGroup Hook
 * 
 * Hook to manage age group and theme preferences
 */

import { useThemeContext } from '../contexts/ThemeContext';
import { AgeGroup } from '../utils/ageDetection';
import { ThemePreference } from '../themes/types';

export interface UseAgeGroupReturn {
  ageGroup: AgeGroup;
  themePreference: ThemePreference;
  setAgeGroup: (ageGroup: AgeGroup) => void;
  setThemePreference: (preference: ThemePreference) => void;
  setDateOfBirth: (dateOfBirth: string) => void;
  isKids: boolean;
  isTeens: boolean;
  isAdults: boolean;
  isAutoTheme: boolean;
}

/**
 * Hook to manage age group and theme preferences
 */
export function useAgeGroup(): UseAgeGroupReturn {
  const {
    ageGroup,
    themePreference,
    setAgeGroup,
    setThemePreference,
    setDateOfBirth,
  } = useThemeContext();

  return {
    ageGroup,
    themePreference,
    setAgeGroup,
    setThemePreference,
    setDateOfBirth,
    isKids: ageGroup === 'kids',
    isTeens: ageGroup === 'teens',
    isAdults: ageGroup === 'adults',
    isAutoTheme: themePreference === 'auto',
  };
}
