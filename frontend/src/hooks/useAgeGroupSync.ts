/**
 * useAgeGroupSync Hook
 * 
 * Hook to sync age group and theme preference with backend
 */

import { useEffect, useState } from 'react';
import { useAgeGroup } from './useAgeGroup';
import {
  getAgeGroup,
  updateAgeGroup as updateAgeGroupApi,
  updateThemePreference as updateThemePreferenceApi,
} from '../services/ageGroupApi';
import { AgeGroup } from '../utils/ageDetection';
import { ThemePreference } from '../themes/types';

export interface UseAgeGroupSyncReturn {
  isSyncing: boolean;
  syncError: Error | null;
  syncFromBackend: () => Promise<void>;
  updateAgeGroupBackend: (ageGroup: AgeGroup) => Promise<void>;
  updateDateOfBirthBackend: (dateOfBirth: string) => Promise<void>;
  updateThemePreferenceBackend: (preference: ThemePreference) => Promise<void>;
}

/**
 * Hook to sync age group with backend
 */
export function useAgeGroupSync(): UseAgeGroupSyncReturn {
  const { setAgeGroup, setThemePreference } = useAgeGroup();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<Error | null>(null);

  // Sync from backend on mount
  useEffect(() => {
    syncFromBackend();
  }, []);

  /**
   * Sync age group and theme preference from backend
   */
  const syncFromBackend = async () => {
    setIsSyncing(true);
    setSyncError(null);

    try {
      const data = await getAgeGroup();
      setAgeGroup(data.age_group);
      setThemePreference(data.theme_preference);
    } catch (error) {
      console.error('Failed to sync age group from backend:', error);
      setSyncError(error as Error);
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Update age group in backend
   */
  const updateAgeGroupBackend = async (ageGroup: AgeGroup) => {
    setIsSyncing(true);
    setSyncError(null);

    try {
      await updateAgeGroupApi({ age_group: ageGroup });
      setAgeGroup(ageGroup);
    } catch (error) {
      console.error('Failed to update age group in backend:', error);
      setSyncError(error as Error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Update date of birth in backend (automatically calculates age group)
   */
  const updateDateOfBirthBackend = async (dateOfBirth: string) => {
    setIsSyncing(true);
    setSyncError(null);

    try {
      const response = await updateAgeGroupApi({ date_of_birth: dateOfBirth });
      setAgeGroup(response.age_group);
    } catch (error) {
      console.error('Failed to update date of birth in backend:', error);
      setSyncError(error as Error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Update theme preference in backend
   */
  const updateThemePreferenceBackend = async (preference: ThemePreference) => {
    setIsSyncing(true);
    setSyncError(null);

    try {
      await updateThemePreferenceApi({ theme_preference: preference });
      setThemePreference(preference);
    } catch (error) {
      console.error('Failed to update theme preference in backend:', error);
      setSyncError(error as Error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    syncError,
    syncFromBackend,
    updateAgeGroupBackend,
    updateDateOfBirthBackend,
    updateThemePreferenceBackend,
  };
}
