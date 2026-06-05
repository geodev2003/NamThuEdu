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

// ─── VSTEP shared score helpers ──────────────────────────────────────────────
// Single source-of-truth used by GradingQueue list AND TeacherReviewModal.

export const VSTEP_SKILL_KEYS = ['listening', 'reading', 'writing', 'speaking'] as const;
export type VstepSkillKey = typeof VSTEP_SKILL_KEYS[number];

/** Parse sGemini_feedback JSON and return per-skill scores (null if missing). */
export function parseVstepScores(sGemini_feedback?: string): Record<VstepSkillKey, number | null> {
  try {
    const vs = JSON.parse(sGemini_feedback ?? '{}')?.vstep_scores ?? {};
    return {
      listening: vs.listening !== undefined && vs.listening !== null ? Number(vs.listening) : null,
      reading:   vs.reading   !== undefined && vs.reading   !== null ? Number(vs.reading)   : null,
      writing:   vs.writing   !== undefined && vs.writing   !== null ? Number(vs.writing)   : null,
      speaking:  vs.speaking  !== undefined && vs.speaking  !== null ? Number(vs.speaking)  : null,
    };
  } catch {
    return { listening: null, reading: null, writing: null, speaking: null };
  }
}

/** Average all four VSTEP skills. Returns null if any skill is missing. */
export function calcVstepAvg(vstepScores: Record<VstepSkillKey, number | null>): number | null {
  const vals = VSTEP_SKILL_KEYS.map((k) => vstepScores[k]);
  if (vals.some((v) => v === null)) return null;
  return (vals as number[]).reduce((s, v) => s + v, 0) / vals.length;
}

/** Returns true for VSTEP exam type or title. */
export function isVstepExam(examType?: string, examTitle?: string): boolean {
  return (
    examType?.toUpperCase() === 'VSTEP' ||
    String(examTitle ?? '').toUpperCase().includes('VSTEP')
  );
}

/**
 * Canonical display score for any submission.
 * - VSTEP: use sScore/10 from DB (authoritative). Falls back to avg of AI skill scores.
 * - Other: use sScore directly.
 * Returns null when no score is available.
 */
export function getSubmissionDisplayScore(
  opts: {
    examType?: string;
    examTitle?: string;
    sGemini_feedback?: string;
    score?: number;   // mapped from sScore
    maxScore?: number;
  }
): { value: number; max: number } | null {
  const { examType, examTitle, sGemini_feedback, score, maxScore = 100 } = opts;
  if (isVstepExam(examType, examTitle)) {
    // 1st priority: sScore from DB (= backend computed value, authoritative)
    if (score !== undefined && score !== null) return { value: score / 10, max: 10 };
    // Fallback: average of AI skill scores in sGemini_feedback
    const vs = parseVstepScores(sGemini_feedback);
    const avg = calcVstepAvg(vs);
    if (avg !== null) return { value: avg, max: 10 };
    return null;
  }
  if (score !== undefined && score !== null) return { value: score, max: maxScore };
  return null;
}

/** Patch object passed from modal → queue when teacher saves a review. */
export interface SubmissionScoreUpdate {
  id: string;
  /** New raw score saved to DB (= totalOverride * 10 for VSTEP). */
  rawScore?: number;
  sTeacher_feedback?: string;
  /** Updated AI feedback JSON string (unchanged, forwarded for consistency). */
  sGemini_feedback?: string;
  teacher_reviewed_at: string;
}
