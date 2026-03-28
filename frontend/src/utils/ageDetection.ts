/**
 * Age Detection Utilities
 * 
 * Utilities for calculating age and determining age groups
 * for UI/UX adaptation system
 */

export type AgeGroup = 'kids' | 'teens' | 'adults';

export interface AgeGroupConfig {
  minAge: number;
  maxAge: number;
  label: string;
  description: string;
}

/**
 * Age group configurations
 */
export const AGE_GROUP_CONFIGS: Record<AgeGroup, AgeGroupConfig> = {
  kids: {
    minAge: 6,
    maxAge: 12,
    label: 'Trẻ em',
    description: 'Giao diện vui nhộn, nhiều màu sắc',
  },
  teens: {
    minAge: 13,
    maxAge: 17,
    label: 'Thiếu niên',
    description: 'Giao diện hiện đại, năng động',
  },
  adults: {
    minAge: 18,
    maxAge: 100,
    label: 'Người lớn',
    description: 'Giao diện chuyên nghiệp, hiệu quả',
  },
};

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: string | Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // Adjust if birthday hasn't occurred this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Determine age group from date of birth
 */
export function calculateAgeGroup(dateOfBirth: string | Date): AgeGroup {
  const age = calculateAge(dateOfBirth);
  
  if (age >= AGE_GROUP_CONFIGS.kids.minAge && age <= AGE_GROUP_CONFIGS.kids.maxAge) {
    return 'kids';
  } else if (age >= AGE_GROUP_CONFIGS.teens.minAge && age <= AGE_GROUP_CONFIGS.teens.maxAge) {
    return 'teens';
  } else {
    return 'adults';
  }
}

/**
 * Get age group configuration
 */
export function getAgeGroupConfig(ageGroup: AgeGroup): AgeGroupConfig {
  return AGE_GROUP_CONFIGS[ageGroup];
}

/**
 * Validate if age is within a specific age group
 */
export function isAgeInGroup(age: number, ageGroup: AgeGroup): boolean {
  const config = AGE_GROUP_CONFIGS[ageGroup];
  return age >= config.minAge && age <= config.maxAge;
}

/**
 * Get all age groups
 */
export function getAllAgeGroups(): AgeGroup[] {
  return Object.keys(AGE_GROUP_CONFIGS) as AgeGroup[];
}

/**
 * Format age group label for display
 */
export function formatAgeGroupLabel(ageGroup: AgeGroup): string {
  return AGE_GROUP_CONFIGS[ageGroup].label;
}

/**
 * Get age group description
 */
export function getAgeGroupDescription(ageGroup: AgeGroup): string {
  return AGE_GROUP_CONFIGS[ageGroup].description;
}
