import { api } from './api';
import { 
  mockTestAssignments, 
  mockSubmissions, 
  mockProgress, 
  mockPracticeTopics, 
  mockNotifications 
} from './mockData';

// Check if we should use mock data (when backend is not available)
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || false;

const mockDelay = (data: any) => new Promise(resolve => setTimeout(() => resolve({ data }), 500));

export interface TestAssignment {
  assignment_id: number;
  exam_id: number;
  exam_title: string;
  exam_type: string;
  exam_skill: string;
  exam_duration: number;
  total_questions: number;
  max_score: number;
  start_time: string;
  end_time: string;
  is_urgent: boolean;
  time_remaining: string;
  attempts_allowed: number;
  attempts_used: number;
}

export interface Submission {
  sId: number;
  sScore: number;
  sStatus: string;
  sSubmit_time: string;
  sGraded_time: string | null;
  sAttempt: number;
  sTime_taken: number;
  exam: {
    eId: number;
    eTitle: string;
    eType: string;
    eSkill: string;
    eTotal_questions: number;
    eMax_score: number;
  };
  stats?: {
    correct_answers: number;
    total_questions: number;
    accuracy: number;
    grade: string;
    rank_in_class: number;
    total_students: number;
  };
}

export interface ProgressData {
  overview: {
    total_tests: number;
    average_score: number;
    highest_score: number;
    lowest_score: number;
    recent_score: number;
  };
  trends: {
    recent_scores: Array<{
      date: string;
      score: number;
      exam_title: string;
      exam_type: string;
      exam_skill: string;
    }>;
  };
  skill_analysis: {
    skills_breakdown: Array<{
      skill: string;
      skill_name: string;
      count: number;
      average_score: number;
      highest_score: number;
      lowest_score: number;
      mastery_level: string;
    }>;
  };
}

export const studentApi = {
  // Tests
  getTests: (params?: { status?: string; type?: string; skill?: string }) =>
    USE_MOCK_DATA 
      ? mockDelay(mockTestAssignments)
      : api.get<{ status: string; data: { pending: TestAssignment[]; in_progress: TestAssignment[]; completed: TestAssignment[] } }>('/student/tests', { params }),

  getTestDetail: (id: number) =>
    api.get(`/student/tests/${id}`),

  startTest: (id: number) =>
    api.post(`/student/tests/${id}/start`),

  resumeTest: (id: number) =>
    api.get(`/student/tests/${id}/resume`),

  // Submissions
  getSubmissions: (params?: { limit?: number; sort?: string; status?: string }) =>
    USE_MOCK_DATA
      ? mockDelay(mockSubmissions)
      : api.get<{ status: string; data: { submissions: Submission[] } }>('/student/submissions', { params }),

  getSubmissionDetail: (id: number) =>
    api.get(`/student/submissions/${id}`),

  getAnswers: (id: number) =>
    api.get(`/student/submissions/${id}/answers`),

  compareSubmission: (id: number) =>
    api.get(`/student/submissions/${id}/compare`),

  // Progress
  getProgress: () =>
    USE_MOCK_DATA
      ? mockDelay(mockProgress)
      : api.get<{ status: string; data: ProgressData }>('/student/progress'),

  // Answer
  saveAnswer: (submissionId: number, data: { question_id: number; answer_id?: number; answer_text?: string; saAnswer_text?: string }) =>
    api.post(`/student/tests/${submissionId}/answer`, data),

  submitTest: (submissionId: number) =>
    api.post(`/student/tests/${submissionId}/submit`),

  // Practice
  getPracticeTopics: () =>
    USE_MOCK_DATA
      ? mockDelay(mockPracticeTopics)
      : api.get('/student/practice/topics'),

  getPracticeQuestions: (params: { topic_id?: number; skill?: string; difficulty?: string; count?: number }) =>
    api.get('/student/practice/questions', { params }),

  createPracticeSession: (data: { topic_id?: number; question_count: number; difficulty?: string }) =>
    api.post('/student/practice/sessions', data),

  savePracticeAnswer: (sessionId: number, data: { question_id: number; answer_id?: number; answer_text?: string }) =>
    api.post(`/student/practice/sessions/${sessionId}/answer`, data),

  completePracticeSession: (sessionId: number) =>
    api.post(`/student/practice/sessions/${sessionId}/complete`),

  // Notifications
  getNotifications: (params?: { page?: number; per_page?: number }) =>
    USE_MOCK_DATA
      ? mockDelay(mockNotifications)
      : api.get('/student/notifications', { params }),

  markNotificationRead: (id: number) =>
    api.put(`/student/notifications/${id}/read`),

  markAllNotificationsRead: () =>
    api.put('/student/notifications/read-all'),

  deleteNotification: (id: number) =>
    api.delete(`/student/notifications/${id}`),

  // Profile
  getProfile: () =>
    api.get('/student/profile'),

  updateProfile: (data: any) =>
    api.put('/student/profile', data),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/student/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  changePassword: (data: { current_password: string; new_password: string; new_password_confirmation: string }) =>
    api.put('/student/profile/password', data),

  // Settings
  getSettings: () =>
    api.get('/student/settings'),

  updateSettings: (data: any) =>
    api.put('/student/settings', data),
};
