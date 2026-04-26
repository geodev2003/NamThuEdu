import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';

export interface ClassInfo {
  cId: number;
  cName: string;
  cDescription?: string;
  cTeacher_id: number;
  cCreated_at: string;
}

export interface Student {
  uId: number;
  uName: string;
  uPhone: string;
  uDoB?: string;
  age_group?: string;
}

export interface ClassStats {
  total_students: number;
  active_students: number;
  total_submissions: number;
  average_score: number;
  pass_rate: number;
  completion_rate?: number;
  score_distribution?: {
    range: string;
    count: number;
  }[];
  skill_breakdown?: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
  };
}

export interface ClassReport {
  class: ClassInfo;
  students: Student[];
  student_count: number;
  stats: ClassStats;
}

interface UseClassReportResult {
  data: ClassReport | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useClassReport = (classId: number | string): UseClassReportResult => {
  const [data, setData] = useState<ClassReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!classId) {
      setError('Class ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch class details and students
      const classResponse = await api.get(`/teacher/class/${classId}`);
      
      if (classResponse.data.status !== 'success') {
        throw new Error(classResponse.data.message || 'Failed to load class details');
      }

      const classData = classResponse.data.data;

      // Fetch class statistics
      let statsData: ClassStats = {
        total_students: classData.student_count || 0,
        active_students: classData.student_count || 0,
        total_submissions: 0,
        average_score: 0,
        pass_rate: 0,
      };

      try {
        const statsResponse = await api.get(`/teacher/class/${classId}/stats`);
        if (statsResponse.data.status === 'success') {
          statsData = {
            ...statsData,
            ...statsResponse.data.data,
          };
        }
      } catch (statsError) {
        console.warn('Failed to load class statistics:', statsError);
        // Continue with basic stats from class data
      }

      // Combine data
      const reportData: ClassReport = {
        class: classData.class,
        students: classData.students || [],
        student_count: classData.student_count || 0,
        stats: statsData,
      };

      setData(reportData);

    } catch (err: any) {
      console.error('Error fetching class report:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Không thể tải báo cáo lớp học'
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [classId]);

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
