import { useState, useCallback } from 'react';

export function useAnswerTracking() {
  const [answers, setAnswers] = useState<{ [questionId: number]: any }>({});

  const updateAnswer = useCallback((questionId: number, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  }, []);

  const updateAnswerField = useCallback((questionId: number, field: string | number, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        [field]: value
      }
    }));
  }, []);

  const resetQuestion = useCallback((questionId: number) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
  }, []);

  const resetAll = useCallback(() => {
    setAnswers({});
  }, []);

  const getAnswer = useCallback((questionId: number) => {
    return answers[questionId];
  }, [answers]);

  return {
    answers,
    updateAnswer,
    updateAnswerField,
    resetQuestion,
    resetAll,
    getAnswer,
    answeredCount: Object.keys(answers).length
  };
}
