import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';

// Types
export interface TrendPoint {
  date: string;
  submissions: number;
  graded: number;
  active_students: number;
}

export interface ExamsByType {
  vstep: number;
  cambridge: number;
  ielts: number;
  toefl: number;
  other: number;
}

export interface TopClass {
  class_id: number;
  class_name: string;
  total_submissions: number;
  avg_score: number;
  pending_count: number;
}

export interface TopStudent {
  student_id: number;
  student_name: string;
  class_name: string;
  total_submissions: number;
  avg_score: number;
}

export interface ClassNeedAttention {
  class_id: number;
  class_name: string;
  pending_count: number;
  avg_score: number;
  reason: string;
}

export interface ScoreTrendPoint {
  date: string;
  avg_score: number;
}

export interface AtRiskStudent {
  student_id: number;
  student_name: string;
  avatar_url?: string | null;
  class_name: string;
  avg_score_recent_3: number | null;
  last_activity_at: string | null;
  last_login_at: string | null;
  is_online: boolean;
  days_inactive: number | null;
  reasons: Array<'low_score' | 'inactive' | 'declining_trend'>;
}

export interface OverdueStudent {
  student_id: number;
  student_name: string;
  avatar_url?: string | null;
  class_name: string;
  exam_id: number;
  exam_title: string;
  deadline: string;
  is_overdue: boolean;
  hours_late: number | null;
  hours_left: number | null;
}

export interface ImprovingClass {
  class_id: number;
  class_name: string;
  student_count: number;
  first_half_avg: number;
  second_half_avg: number;
  improvement: number;
  submission_count: number;
}

export interface SkillBreakdown {
  listening: { avg_score: number | null; submission_count: number };
  reading:   { avg_score: number | null; submission_count: number };
  writing:   { avg_score: number | null; submission_count: number };
  speaking:  { avg_score: number | null; submission_count: number };
}

export interface Insight {
  type: 'warning' | 'success' | 'info';
  icon: string;
  message: string;
}

export interface ReportsOverview {
  period: string;
  overview: {
    total_students: number;
    total_classes: number;
    total_exams: number;
    total_submissions: number;
    avg_score: number;
    growth: {
      students: number;
      classes: number;
      exams: number;
      submissions: number;
      avg_score: number;
    };
  };
  activity_timeline: TrendPoint[];
  exams_by_type: ExamsByType;
  top_classes: TopClass[];
  top_students: TopStudent[];
  classes_need_attention: ClassNeedAttention[];
  at_risk_students: AtRiskStudent[];
  overdue_students: OverdueStudent[];
  top_improving_classes: ImprovingClass[];
  skill_breakdown: SkillBreakdown;
  score_trend: ScoreTrendPoint[];
  insights: Insight[];
  generated_at: string;
}

interface UseTeacherReportsResult {
  data: ReportsOverview | null;
  loading: boolean;
  error: string | null;
  refetch: (period?: string) => void;
}

export const useTeacherReports = (initialPeriod: string = '30days'): UseTeacherReportsResult => {
  const [data, setData] = useState<ReportsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState(initialPeriod);

  const fetchData = useCallback(async (newPeriod?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const periodParam = newPeriod || period;
      const response = await api.get(`/teacher/reports/overview?period=${periodParam}`);
      
      if (response.data.status === 'success') {
        setData(response.data.data);
        if (newPeriod) {
          setPeriod(newPeriod);
        }
      } else {
        throw new Error(response.data.message || 'Failed to load reports');
      }
    } catch (err: any) {
      console.error('Error fetching teacher reports:', err);
      setError(err.response?.data?.message || err.message || 'Không thể tải báo cáo');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};
