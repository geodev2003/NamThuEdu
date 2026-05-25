import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';

export interface TrendPoint { date: string; graded: number; }
export interface TopStudent  { name: string; count: number; avg: number; }
export interface PendingExam { title: string; type: string; count: number; }
export interface ScoreByType {
  count: number;
  average_score: number;
  highest_score: number | null;
  lowest_score: number | null;
}

export interface GradingStats {
  total_submissions: number;
  graded_submissions: number;
  pending_submissions: number;
  grading_completion_rate: number;
  recent_grading_activity: number;
  average_grading_time: number;
  scores_by_exam_type: Record<string, ScoreByType>;
  trend_7d: TrendPoint[];
  by_skill: { listening: number; reading: number; writing: number; speaking: number };
  score_dist: Record<string, number>;
  top_students: TopStudent[];
  pending_by_exam: PendingExam[];
}

interface UseGradingStatsResult {
  data: GradingStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useGradingStats = (): UseGradingStatsResult => {
  const [data, setData] = useState<GradingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/teacher/grading/statistics');
      if (response.data.status === 'success') {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to load grading statistics');
      }
    } catch (err: any) {
      console.error('Error fetching grading stats:', err);
      setError(err.response?.data?.message || err.message || 'Không thể tải thống kê chấm bài');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
