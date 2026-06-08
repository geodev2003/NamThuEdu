import { api } from './api';

export interface ExamSummary {
  eId: number;
  eTitle: string;
  eDescription?: string | null;
  eType?: string;
  eSkill?: string;
  eStatus?: string;
  eCreated_at: string;
  eDuration?: number | null;
  age_group?: string;
  kids_exam_config?: any;
  questions_count?: number;
}

export interface ExamGroupResponse<T = ExamSummary[]> {
  status: string;
  data: T;
}

/**
 * Lấy đề VSTEP Full (đề đầy đủ 4 kỹ năng)
 * GET /api/teacher/exams?group=vstep_full
 */
export const getVstepFullExams = async (): Promise<ExamSummary[]> => {
  const response = await api.get<ExamGroupResponse>(
    '/teacher/exams',
    { params: { group: 'vstep_full' } }
  );
  return response.data?.data || [];
};

/**
 * Lấy đề IELTS Full (đề đầy đủ 4 sections)
 * GET /api/teacher/exams?group=ielts_full
 */
export const getIeltsFullExams = async (): Promise<ExamSummary[]> => {
  const response = await api.get<ExamGroupResponse>(
    '/teacher/exams',
    { params: { group: 'ielts_full' } }
  );
  return response.data?.data || [];
};

/**
 * Lấy đề cho người lớn (Adult) - General, Business, TOEIC, etc.
 * GET /api/teacher/exams?group=adults
 */
export const getAdultExams = async (): Promise<ExamSummary[]> => {
  const response = await api.get<ExamGroupResponse>(
    '/teacher/exams',
    { params: { group: 'adults' } }
  );
  return response.data?.data || [];
};

/**
 * Lấy đề cho thiếu niên (Teens)
 * GET /api/teacher/exams?group=teens
 */
export const getTeensExams = async (): Promise<ExamSummary[]> => {
  const response = await api.get<ExamGroupResponse>(
    '/teacher/exams',
    { params: { group: 'teens' } }
  );
  return response.data?.data || [];
};

/**
 * Lấy đề cho trẻ em (Kids) - YLE Starters/Movers/Flyers
 * GET /api/teacher/kids-exams
 */
export const getKidsExams = async (): Promise<ExamSummary[]> => {
  const response = await api.get<ExamGroupResponse>('/teacher/kids-exams');
  return response.data?.data || [];
};

/**
 * Lấy TẤT CẢ đề thi theo 4 nhóm song song
 * Trả về { vstep, ielts, adults, kids, teens }
 */
export const getAllExamGroups = async () => {
  const [vstep, ielts, adults, kids, teens] = await Promise.all([
    getVstepFullExams().catch(() => []),
    getIeltsFullExams().catch(() => []),
    getAdultExams().catch(() => []),
    getKidsExams().catch(() => []),
    getTeensExams().catch(() => []),
  ]);

  return { vstep, ielts, adults, kids, teens };
};
