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
