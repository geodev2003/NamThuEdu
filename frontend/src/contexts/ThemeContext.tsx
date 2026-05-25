/**
 * Theme Context
 * 
 * Provides theme state and management to the entire application
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getAuthToken } from '../utils/authStorage';
import { Theme, ThemePreference } from '../themes/types';
import { AgeGroup, calculateAgeGroup } from '../utils/ageDetection';
import {
  getEffectiveTheme,
  applyTheme,
  loadThemeFonts,
  saveThemePreference,
  loadThemePreference,
} from '../themes/themeUtils';
import { teensTheme } from '../themes';
import { api } from '../services/api';

interface UserData {
  age_group?: AgeGroup;
  theme_preference?: ThemePreference;
}

interface ThemeContextValue {
  theme: Theme;
  ageGroup: AgeGroup;
  themePreference: ThemePreference;
  setAgeGroup: (ageGroup: AgeGroup) => void;
  setThemePreference: (preference: ThemePreference) => void;
  setDateOfBirth: (dateOfBirth: string) => void;
  syncWithAuth: (userData: UserData) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialAgeGroup?: AgeGroup;
  initialThemePreference?: ThemePreference;
}

export function ThemeProvider({
  children,
  initialAgeGroup = 'teens',
  initialThemePreference = 'auto',
}: ThemeProviderProps) {
  const [ageGroup, setAgeGroupState] = useState<AgeGroup>(initialAgeGroup);
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(
    initialThemePreference
  );
  const [theme, setTheme] = useState<Theme>(teensTheme);
  const [isLoading, setIsLoading] = useState(true);

  // Sync theme with authentication data
  const syncWithAuth = useCallback((userData: UserData) => {
    if (userData.age_group) {
      setAgeGroupState(userData.age_group);
    }
    if (userData.theme_preference) {
      setThemePreferenceState(userData.theme_preference);
    }
    setIsLoading(false);
  }, []);

  // Initialize theme from localStorage or auth
  useEffect(() => {
    const initializeTheme = async () => {
      const token = getAuthToken();

      if (token) {
        try {
          // Fetch user profile to get age_group
          const response = await api.get('/user/profile');
          const userData = response.data.data;
          syncWithAuth(userData);
        } catch (error) {
          console.warn('Failed to fetch user profile, using localStorage fallback');
          // Fallback to localStorage
          const savedPreference = loadThemePreference();
          if (savedPreference) {
            setThemePreferenceState(savedPreference);
          }
          setIsLoading(false);
        }
      } else {
        // Guest user - use adults theme
        setAgeGroupState('adults');
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, [syncWithAuth]);

  // Update theme when ageGroup or themePreference changes
  useEffect(() => {
    const effectiveTheme = getEffectiveTheme(themePreference, ageGroup);
    setTheme(effectiveTheme);
    applyTheme(effectiveTheme);
    loadThemeFonts(effectiveTheme);
  }, [ageGroup, themePreference]);

  // Set age group
  const setAgeGroup = useCallback((newAgeGroup: AgeGroup) => {
    setAgeGroupState(newAgeGroup);
  }, []);

  // Set theme preference
  const setThemePreference = useCallback((preference: ThemePreference) => {
    setThemePreferenceState(preference);
    saveThemePreference(preference);
  }, []);

  // Set date of birth (automatically calculates age group)
  const setDateOfBirth = useCallback((dateOfBirth: string) => {
    const calculatedAgeGroup = calculateAgeGroup(dateOfBirth);
    setAgeGroupState(calculatedAgeGroup);
  }, []);

  const value: ThemeContextValue = {
    theme,
    ageGroup,
    themePreference,
    setAgeGroup,
    setThemePreference,
    setDateOfBirth,
    syncWithAuth,
    isLoading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to use theme context
 */
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
