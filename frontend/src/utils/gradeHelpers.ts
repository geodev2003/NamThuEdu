export function getGradeBadge(score: number): string {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 75) return 'C+';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

export function getGradeColor(grade: string): { bg: string; text: string; border: string } {
  if (grade.startsWith('A')) return { bg: '#D1FAE5', text: '#065F46', border: '#10B981' };
  if (grade.startsWith('B')) return { bg: '#DBEAFE', text: '#1E40AF', border: '#2563EB' };
  if (grade.startsWith('C')) return { bg: '#FEF3C7', text: '#78350F', border: '#F59E0B' };
  return { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' };
}

export function getGradeDescription(grade: string, locale: string = 'vi'): string {
  const descriptions: Record<string, { vi: string; en: string }> = {
    'A+': { vi: 'Xuất sắc', en: 'Excellent' },
    'A': { vi: 'Rất tốt', en: 'Very Good' },
    'B+': { vi: 'Tốt', en: 'Good' },
    'B': { vi: 'Khá', en: 'Above Average' },
    'C+': { vi: 'Trung bình khá', en: 'Average+' },
    'C': { vi: 'Trung bình', en: 'Average' },
    'D': { vi: 'Yếu', en: 'Below Average' },
    'F': { vi: 'Kém', en: 'Fail' },
  };
  return descriptions[grade]?.[locale as 'vi' | 'en'] || grade;
}

export function isPassingGrade(score: number, threshold: number = 70): boolean {
  return score >= threshold;
}

export function calculateGradeImprovement(currentScore: number, previousScore: number): {
  difference: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
} {
  const difference = currentScore - previousScore;
  const percentage = previousScore > 0 ? (difference / previousScore) * 100 : 0;
  
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (difference > 2) trend = 'up';
  else if (difference < -2) trend = 'down';

  return { difference, percentage, trend };
}
