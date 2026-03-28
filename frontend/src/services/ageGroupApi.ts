/**
 * Age Group API Service
 * 
 * API calls for age group and theme preference management
 */

import { api } from './api';
import { AgeGroup } from '../utils/ageDetection';
import { ThemePreference } from '../themes/types';

export interface AgeGroupResponse {
  age_group: AgeGroup;
  date_of_birth: string | null;
  theme_preference: ThemePreference;
  calculated_age: number | null;
}

export interface ThemePreferenceResponse {
  theme_preference: ThemePreference;
  age_group: AgeGroup;
  effective_theme: AgeGroup;
}

export interface UpdateAgeGroupRequest {
  date_of_birth?: string;
  age_group?: AgeGroup;
}

export interface UpdateThemePreferenceRequest {
  theme_preference: ThemePreference;
}

/**
 * Get user's age group
 */
export async function getAgeGroup(): Promise<AgeGroupResponse> {
  const response = await api.get<AgeGroupResponse>('/user/age-group');
  return response.data;
}

/**
 * Update user's age group
 */
export async function updateAgeGroup(
  data: UpdateAgeGroupRequest
): Promise<{ message: string; age_group: AgeGroup; date_of_birth: string | null }> {
  const response = await api.post('/user/age-group', data);
  return response.data;
}

/**
 * Get user's theme preference
 */
export async function getThemePreference(): Promise<ThemePreferenceResponse> {
  const response = await api.get<ThemePreferenceResponse>('/user/theme-preference');
  return response.data;
}

/**
 * Update user's theme preference
 */
export async function updateThemePreference(
  data: UpdateThemePreferenceRequest
): Promise<{ message: string; theme_preference: ThemePreference; effective_theme: AgeGroup }> {
  const response = await api.post('/user/theme-preference', data);
  return response.data;
}

/**
 * Sync age group from backend
 */
export async function syncAgeGroup(): Promise<AgeGroupResponse> {
  return getAgeGroup();
}

/**
 * Sync theme preference from backend
 */
export async function syncThemePreference(): Promise<ThemePreferenceResponse> {
  return getThemePreference();
}
