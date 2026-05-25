import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';

export interface PracticeSession {
  ps_id: number;
  ps_title: string;
  ps_description?: string;
  ps_type: 'topic_based' | 'template_based' | 'random' | 'skill_based' | 'custom';
  ps_target_skill?: 'listening' | 'reading' | 'writing' | 'speaking';
  ps_difficulty?: 'easy' | 'medium' | 'hard';
  ps_duration_minutes?: number;
  ps_question_count?: number;
  ps_purpose?: 'review' | 'practice' | 'drill' | 'mock_test' | 'homework';
  ps_topic?: string;
  ps_is_active: boolean;
  ps_created_at: string;
  assignment_count?: number;
  exam?: {
    eId: number;
    eTitle: string;
    eDuration_minutes: number;
    eCreated_at: string;
  };
}

export interface PracticeSessionsResponse {
  current_page: number;
  data: PracticeSession[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface PracticeStatistics {
  total: number;
  by_type: Record<string, number>;
  by_skill: Record<string, number>;
  by_difficulty: Record<string, number>;
  recent_count: number;
  active_count: number;
}

interface UsePracticeSessionsOptions {
  type?: string;
  skill?: string;
  purpose?: string;
  difficulty?: string;
  perPage?: number;
}

interface UsePracticeSessionsResult {
  sessions: PracticeSession[];
  pagination: Omit<PracticeSessionsResponse, 'data'> | null;
  statistics: PracticeStatistics | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePracticeSessions = (options: UsePracticeSessionsOptions = {}): UsePracticeSessionsResult => {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [pagination, setPagination] = useState<Omit<PracticeSessionsResponse, 'data'> | null>(null);
  const [statistics, setStatistics] = useState<PracticeStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams();
      if (options.type && options.type !== 'all') params.append('type', options.type);
      if (options.skill && options.skill !== 'all') params.append('skill', options.skill);
      if (options.purpose && options.purpose !== 'all') params.append('purpose', options.purpose);
      if (options.difficulty && options.difficulty !== 'all') params.append('difficulty', options.difficulty);
      if (options.perPage) params.append('per_page', options.perPage.toString());

      const queryString = params.toString();
      const url = `/teacher/practice-sessions${queryString ? `?${queryString}` : ''}`;

      // Fetch sessions
      const response = await api.get(url);
      
      if (response.data.status === 'success') {
        const data = response.data.data as PracticeSessionsResponse;
        setSessions(data.data || []);
        
        // Extract pagination info
        const { data: _, ...paginationInfo } = data;
        setPagination(paginationInfo);
      } else {
        throw new Error(response.data.message || 'Failed to load practice sessions');
      }

      // Fetch statistics
      try {
        const statsResponse = await api.get('/teacher/practice-sessions/statistics');
        if (statsResponse.data.status === 'success') {
          setStatistics(statsResponse.data.data);
        }
      } catch (statsError) {
        console.warn('Failed to load statistics:', statsError);
        // Don't fail the whole request if stats fail
      }

    } catch (err: any) {
      console.error('Error fetching practice sessions:', err);
      setError(err.response?.data?.message || err.message || 'Không thể tải danh sách bài luyện tập');
      setSessions([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [options.type, options.skill, options.purpose, options.difficulty, options.perPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    sessions,
    pagination,
    statistics,
    loading,
    error,
    refetch: fetchData,
  };
};

// Hook for templates
export const usePracticeTemplates = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await api.get('/teacher/templates');
        
        if (response.data.status === 'success') {
          setTemplates(response.data.data || []);
        } else {
          throw new Error('Failed to load templates');
        }
      } catch (err: any) {
        setError(err.message || 'Không thể tải danh sách templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return { templates, loading, error };
};
