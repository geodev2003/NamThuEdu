import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';

export interface Assignment {
  taId: number;
  taTitle: string;
  taDescription?: string;
  taDue_date: string;
  taStatus: string;
  taCreated_at: string;
}

export interface StudentProgress {
  uId: number;
  uName: string;
  uPhone: string;
  submission?: {
    sId: number;
    sScore: number;
    sStatus: string;
    sSubmitted_at: string;
  };
  status: 'completed' | 'in_progress' | 'not_started';
}

export interface AssignmentProgress {
  assignment: Assignment;
  total_students: number;
  completed: number;
  in_progress: number;
  not_started: number;
  completion_rate: number;
  average_score: number;
  students: StudentProgress[];
}

interface UseAssignmentProgressResult {
  data: AssignmentProgress | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useAssignmentProgress = (assignmentId: number | string): UseAssignmentProgressResult => {
  const [data, setData] = useState<AssignmentProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!assignmentId) {
      setError('Assignment ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try dedicated progress endpoint first
      try {
        const response = await api.get(`/teacher/assignment/${assignmentId}/progress`);
        
        if (response.data.status === 'success') {
          setData(response.data.data);
          setLoading(false);
          return;
        }
      } catch (progressError) {
        console.warn('Dedicated progress endpoint not available, using fallback');
      }

      // Fallback: Fetch assignment details and submissions separately
      const [assignmentResponse, submissionsResponse] = await Promise.all([
        api.get(`/teacher/assignment/${assignmentId}`),
        api.get(`/teacher/submissions?assignment_id=${assignmentId}&per_page=100`),
      ]);

      if (assignmentResponse.data.status !== 'success') {
        throw new Error('Failed to load assignment details');
      }

      const assignment = assignmentResponse.data.data;
      const submissions = submissionsResponse.data.status === 'success' 
        ? submissionsResponse.data.data.data || []
        : [];

      // Calculate progress statistics
      const completed = submissions.filter((s: any) => s.sStatus === 'graded').length;
      const inProgress = submissions.filter((s: any) => s.sStatus === 'submitted' || s.sStatus === 'pending').length;
      const totalStudents = assignment.total_students || submissions.length;
      const notStarted = totalStudents - completed - inProgress;
      const completionRate = totalStudents > 0 ? Math.round((completed / totalStudents) * 100) : 0;

      // Calculate average score
      const gradedSubmissions = submissions.filter((s: any) => s.sStatus === 'graded' && s.sScore !== null);
      const averageScore = gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((sum: number, s: any) => sum + (s.sScore || 0), 0) / gradedSubmissions.length
        : 0;

      // Map students with their progress
      const students: StudentProgress[] = submissions.map((sub: any) => ({
        uId: sub.student?.uId || sub.sStudent_id,
        uName: sub.student?.uName || 'Unknown',
        uPhone: sub.student?.uPhone || '',
        submission: {
          sId: sub.sId,
          sScore: sub.sScore,
          sStatus: sub.sStatus,
          sSubmitted_at: sub.sSubmitted_at,
        },
        status: sub.sStatus === 'graded' ? 'completed' : 'in_progress',
      }));

      const progressData: AssignmentProgress = {
        assignment,
        total_students: totalStudents,
        completed,
        in_progress: inProgress,
        not_started: notStarted,
        completion_rate: completionRate,
        average_score: Math.round(averageScore * 10) / 10,
        students,
      };

      setData(progressData);

    } catch (err: any) {
      console.error('Error fetching assignment progress:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Không thể tải tiến độ bài tập'
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

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
