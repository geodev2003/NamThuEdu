import { useState, useEffect } from 'react';
import { getKidsExam } from '../../services/kidsExamApi';
import { ExamData } from '../../types/exam';

export function useExamData(examId: number) {
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExam = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getKidsExam(examId);
      console.log('📥 Loaded exam:', response);
      setExamData(response);
    } catch (err: any) {
      console.error('❌ Failed to load exam:', err);
      setError(err.message || 'Failed to load exam');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (examId) {
      loadExam();
    }
  }, [examId]);

  return { examData, loading, error, reload: loadExam };
}
