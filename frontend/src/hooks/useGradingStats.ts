import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';

export interface GradingOverview {
  total: number;
  graded: number;
  pending: number;
  avgTime: number;
}

export interface SkillStats {
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
}

export interface TrendData {
  date: string;
  count: number;
}

export interface TopPerformer {
  uId: number;
  uName: string;
  averageScore: number;
  totalSubmissions: number;
}

export interface GradingStats {
  overview: GradingOverview;
  bySkill: SkillStats;
  trend: TrendData[];
  topPerformers: TopPerformer[];
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

      // Try to fetch from dedicated stats endpoint
      try {
        const response = await api.get('/teacher/grading/stats');
        
        if (response.data.status === 'success') {
          setData(response.data.data);
          setLoading(false);
          return;
        }
      } catch (statsError) {
        console.warn('Dedicated stats endpoint not available, using fallback');
      }

      // Fallback: Calculate stats from submissions and queue
      const [submissionsResponse, queueResponse] = await Promise.all([
        api.get('/teacher/submissions?per_page=100'),
        api.get('/teacher/grading/queue').catch(() => ({ data: { status: 'error', data: { total: 0, data: [] } } })),
      ]);

      if (submissionsResponse.data.status === 'success') {
        const submissions = submissionsResponse.data.data.data || [];
        const total = submissionsResponse.data.data.total || 0;
        
        // Calculate graded vs pending
        const graded = submissions.filter((s: any) => s.sStatus === 'graded').length;
        const pending = queueResponse.data.status === 'success' 
          ? queueResponse.data.data.total || 0
          : total - graded;

        // Calculate average grading time (mock for now)
        const avgTime = 5; // minutes

        // Calculate by skill (mock for now - would need exam data)
        const bySkill: SkillStats = {
          listening: 0,
          reading: 0,
          writing: 0,
          speaking: 0,
        };

        // Calculate trend (last 7 days)
        const trend: TrendData[] = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const count = submissions.filter((s: any) => {
            const subDate = new Date(s.sCreated_at).toISOString().split('T')[0];
            return subDate === dateStr;
          }).length;

          trend.push({
            date: dateStr,
            count,
          });
        }

        // Get top performers (mock for now)
        const topPerformers: TopPerformer[] = [];

        const statsData: GradingStats = {
          overview: {
            total,
            graded,
            pending,
            avgTime,
          },
          bySkill,
          trend,
          topPerformers,
        };

        setData(statsData);
      } else {
        throw new Error('Failed to load grading statistics');
      }

    } catch (err: any) {
      console.error('Error fetching grading stats:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Không thể tải thống kê chấm bài'
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
