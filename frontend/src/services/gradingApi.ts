import { api } from "./api";

/**
 * AI-Assisted Grading Review API client.
 *
 * Backend endpoints (under /teacher/):
 *   POST  /submissions/:id/ai-grade
 *   GET   /submissions/:id/ai-status
 *   POST  /submissions/:id/answers/:ansId/regrade
 *   POST  /submissions/:id/answers/:ansId/accept-ai
 *   POST  /submissions/:id/answers/:ansId/teacher-grade
 *   POST  /submissions/:id/save-all
 *   GET   /submissions/:id/grading-history
 */

export type ReviewStatus = "pending" | "accepted" | "modified";

export interface AnswerGradingPayload {
  saId: number;
  saPoints_awarded: number | null;
  saTeacher_feedback: string | null;
  saAi_score: number | null;
  saAi_feedback: string | null;
  saAi_criteria: any;
  saAi_model: string | null;
  saAi_graded_at: string | null;
  saReview_status: ReviewStatus;
  saReviewed_at: string | null;
  saReviewed_by: number | null;
}

export interface AiStatusResponse {
  submission_status: string;
  writing: {
    graded_at: string | null;
    model: string;
    overall_score: number;
    tasks_count: number;
    pending_review: number;
  } | null;
  speaking: {
    graded_at: string | null;
    model: string;
    overall_score: number | null;
    parts_count: number;
  } | null;
}

export interface GradingHistoryEntry {
  id: number;
  action: "ai_grade" | "ai_regrade" | "teacher_accept" | "teacher_modify" | "teacher_save_all";
  actor: string | null;
  actor_id: number | null;
  answer_id: number | null;
  prev_score: number | null;
  new_score: number | null;
  note: string | null;
  metadata: any;
  at: string | null;
}

interface ApiEnvelope<T> { status: string; data: T; message?: string }

export const gradingApi = {
  triggerAiGrade: async (submissionId: number, force = false) => {
    const res = await api.post<ApiEnvelope<{ queued: boolean; estimated_seconds?: number; message?: string }>>(
      `/teacher/submissions/${submissionId}/ai-grade`,
      { force },
    );
    return res.data?.data ?? res.data;
  },

  getAiStatus: async (submissionId: number) => {
    const res = await api.get<ApiEnvelope<AiStatusResponse>>(`/teacher/submissions/${submissionId}/ai-status`);
    return res.data?.data ?? (res.data as any);
  },

  regradeAnswer: async (submissionId: number, answerId: number, hint?: string) => {
    const res = await api.post<ApiEnvelope<AnswerGradingPayload>>(
      `/teacher/submissions/${submissionId}/answers/${answerId}/regrade`,
      { hint },
    );
    return res.data?.data ?? (res.data as any);
  },

  acceptAi: async (submissionId: number, answerId: number) => {
    const res = await api.post<ApiEnvelope<AnswerGradingPayload>>(
      `/teacher/submissions/${submissionId}/answers/${answerId}/accept-ai`,
    );
    return res.data?.data ?? (res.data as any);
  },

  teacherGrade: async (
    submissionId: number,
    answerId: number,
    body: { score: number; feedback?: string; criteria?: Record<string, number>; note?: string },
  ) => {
    const res = await api.post<ApiEnvelope<AnswerGradingPayload>>(
      `/teacher/submissions/${submissionId}/answers/${answerId}/teacher-grade`,
      body,
    );
    return res.data?.data ?? (res.data as any);
  },

  saveAll: async (
    submissionId: number,
    body: { sTeacher_feedback?: string; skill_overrides?: Record<string, number> },
  ) => {
    const res = await api.post<ApiEnvelope<{ sStatus: string; sScore: number; vstep_scores: Record<string, number>; vstep_average: number | null }>>(
      `/teacher/submissions/${submissionId}/save-all`,
      body,
    );
    return res.data?.data ?? (res.data as any);
  },

  getHistory: async (submissionId: number) => {
    const res = await api.get<ApiEnvelope<GradingHistoryEntry[]>>(`/teacher/submissions/${submissionId}/grading-history`);
    return res.data?.data ?? [];
  },
};
