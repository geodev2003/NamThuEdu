import { api } from "./api";

interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export interface PublicCourse {
  cId: number;
  cName: string;
  cType?: string;
  cStatus?: string;
  cTime?: string | null;
  cSchedule?: string | null;
  cStartDate?: string | null;
  cEndDate?: string | null;
  cNumberOfStudent?: number | null;
  cDescription?: string | null;
  category?: {
    caId: number;
    caName: string;
    caType?: string;
  } | null;
}

export const publicApi = {
  async getCourses() {
    const response = await api.get<ApiResponse<PublicCourse[]>>("/public/courses");
    return response.data.data || [];
  },
};
