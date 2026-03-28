/**
 * Theme Switcher Component
 * 
 * UI component to switch between themes and age groups
 */

import React from 'react';
import { useAgeGroup } from '../../hooks/useAgeGroup';
import { useAgeGroupSync } from '../../hooks/useAgeGroupSync';
import { AgeGroup, formatAgeGroupLabel, getAgeGroupDescription } from '../../utils/ageDetection';
import { ThemePreference } from '../../themes/types';

export function ThemeSwitcher() {
  const { ageGroup, themePreference, isAutoTheme } = useAgeGroup();
  const { updateAgeGroupBackend, updateThemePreferenceBackend, isSyncing } = useAgeGroupSync();

  const handleAgeGroupChange = async (newAgeGroup: AgeGroup) => {
    try {
      await updateAgeGroupBackend(newAgeGroup);
    } catch (error) {
      console.error('Failed to update age group:', error);
    }
  };

  const handleThemePreferenceChange = async (preference: ThemePreference) => {
    try {
      await updateThemePreferenceBackend(preference);
    } catch (error) {
      console.error('Failed to update theme preference:', error);
    }
  };

  const ageGroups: AgeGroup[] = ['kids', 'teens', 'adults'];
  const themePreferences: ThemePreference[] = ['auto', 'kids', 'teens', 'adults'];

  return (
    <div className="theme-switcher p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>

      {/* Age Group Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age Group
        </label>
        <div className="grid grid-cols-3 gap-2">
          {ageGroups.map((group) => (
            <button
              key={group}
              onClick={() => handleAgeGroupChange(group)}
              disabled={isSyncing}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  ageGroup === group
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
                ${isSyncing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {formatAgeGroupLabel(group)}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {getAgeGroupDescription(ageGroup)}
        </p>
      </div>

      {/* Theme Preference Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Theme Preference
        </label>
        <div className="grid grid-cols-2 gap-2">
          {themePreferences.map((pref) => (
            <button
              key={pref}
              onClick={() => handleThemePreferenceChange(pref)}
              disabled={isSyncing}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  themePreference === pref
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
                ${isSyncing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {pref === 'auto' ? 'Auto (Based on Age)' : formatAgeGroupLabel(pref as AgeGroup)}
            </button>
          ))}
        </div>
        {isAutoTheme && (
          <p className="mt-2 text-xs text-green-600">
            ✓ Theme automatically matches your age group
          </p>
        )}
      </div>

      {/* Current Status */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          <p>
            <span className="font-medium">Current Age Group:</span> {formatAgeGroupLabel(ageGroup)}
          </p>
          <p>
            <span className="font-medium">Theme Preference:</span>{' '}
            {themePreference === 'auto' ? 'Auto' : formatAgeGroupLabel(themePreference as AgeGroup)}
          </p>
          {isSyncing && (
            <p className="mt-2 text-blue-600">
              <span className="inline-block animate-spin mr-1">⟳</span>
              Syncing...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
