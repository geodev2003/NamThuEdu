import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// API Base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

/**
 * Core Axios instance for Teacher API
 * Configured with authentication, error handling, and development logging
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Request Interceptor
 * - Attaches Bearer token from localStorage
 * - Logs requests in development mode
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach authentication token
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Development mode logging
    if (import.meta.env.DEV) {
      console.group('🚀 API Request');
      console.log('Endpoint:', config.url);
      console.log('Method:', config.method?.toUpperCase());
      console.log('Params:', config.params);
      console.log('Data:', config.data);
      console.groupEnd();
    }

    return config;
  },
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - Handles 401 Unauthorized errors (redirect to login)
 * - Logs responses in development mode
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Development mode logging
    if (import.meta.env.DEV) {
      console.group('✅ API Response');
      console.log('Endpoint:', response.config.url);
      console.log('Status:', response.status);
      console.log('Data:', response.data);
      console.groupEnd();
    }

    return response;
  },
  (error: AxiosError) => {
    // Development mode logging
    if (import.meta.env.DEV) {
      console.group('❌ API Error');
      console.error('Endpoint:', error.config?.url);
      console.error('Method:', error.config?.method?.toUpperCase());
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Message:', error.message);
      console.groupEnd();
    }

    // Handle 401 Unauthorized - Clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_role');
      window.location.href = '/giao-vien/dang-nhap';
    }

    return Promise.reject(error);
  }
);

import {
  ApiResponse,
  PaginatedResponse,
  TestStatistics,
  ActiveSession,
  ConnectionLog,
  SendMessageRequest,
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  EnrollStudentRequest,
  CourseStatistics,
  Class,
  CreateClassRequest,
  UpdateClassRequest,
  EnrollStudentsRequest,
  TransferStudentsRequest,
  ClassTransferHistory,
  ClassStatistics,
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
  BulkImportResult,
  StudentStatistics,
  Exam,
  CreateExamRequest,
  UpdateExamRequest,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  ExamSection,
  TestAssignment,
  AssignmentProgress,
  AssignmentStatistics,
  Submission,
  ClassReport,
  GradingStatistics,
} from '../types/teacher';
import { cacheManager, generateCacheKey, withCache } from '../utils/cacheManager';

/**
 * Teacher API Service
 * Organized by modules: dashboard, courses, classes, students, exams, assignments, grading, monitoring
 */
export const teacherApi = {
  // Core API client for direct access if needed
  client: apiClient,

  /**
   * Dashboard & Monitoring Module
   */
  dashboard: {
    /**
     * Get test statistics for a specific exam
     * @param examId - Exam ID
     * @returns Test statistics
     */
    async getTestStatistics(examId: number): Promise<ApiResponse<TestStatistics>> {
      const cacheKey = generateCacheKey(`/teacher/dashboard/test-statistics/${examId}`);
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<TestStatistics>>(
          `/teacher/dashboard/test-statistics/${examId}`
        );
        return response.data;
      });
    },

    /**
     * Get all active test sessions
     * @returns List of active sessions
     */
    async getActiveSessions(): Promise<ApiResponse<ActiveSession[]>> {
      const cacheKey = generateCacheKey('/teacher/dashboard/active-sessions');
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<ActiveSession[]>>(
          '/teacher/dashboard/active-sessions'
        );
        return response.data;
      });
    },

    /**
     * Send message to a student during test
     * @param submissionId - Submission ID
     * @param message - Message content
     * @returns Success response
     */
    async sendMessage(submissionId: number, message: string): Promise<ApiResponse<void>> {
      const response = await apiClient.post<ApiResponse<void>>(
        `/teacher/dashboard/send-message`,
        { submission_id: submissionId, message }
      );
      return response.data;
    },

    /**
     * Get connection logs for a submission
     * @param submissionId - Submission ID
     * @returns List of connection logs
     */
    async getConnectionLogs(submissionId: number): Promise<ApiResponse<ConnectionLog[]>> {
      const cacheKey = generateCacheKey(`/teacher/dashboard/connection-logs/${submissionId}`);
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<ConnectionLog[]>>(
          `/teacher/dashboard/connection-logs/${submissionId}`
        );
        return response.data;
      });
    },

    /**
     * Get dashboard overview statistics
     * @returns Comprehensive dashboard statistics
     */
    async getOverview(): Promise<ApiResponse<any>> {
      const cacheKey = generateCacheKey('/teacher/dashboard/overview');
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<any>>(
          '/teacher/dashboard/overview'
        );
        return response.data;
      });
    },

    /**
     * Get weekly performance data
     * @returns Performance data for last 6 weeks
     */
    async getPerformanceData(): Promise<ApiResponse<any[]>> {
      const cacheKey = generateCacheKey('/teacher/dashboard/performance-data');
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<any[]>>(
          '/teacher/dashboard/performance-data'
        );
        return response.data;
      });
    },

    /**
     * Get recent activities
     * @returns Recent teacher activities
     */
    async getRecentActivities(): Promise<ApiResponse<any[]>> {
      const cacheKey = generateCacheKey('/teacher/dashboard/recent-activities');
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<any[]>>(
          '/teacher/dashboard/recent-activities'
        );
        return response.data;
      });
    },
  },

  // Module placeholders - will be implemented in subsequent tasks
  courses: {
    /**
     * Get all courses with optional pagination and filters
     * @param params - Query parameters (page, per_page, search, etc.)
     * @returns Paginated list of courses
     */
    async getAll(params?: {
      page?: number;
      per_page?: number;
      search?: string;
      category?: string;
      status?: string;
    }): Promise<ApiResponse<PaginatedResponse<Course>>> {
      const cacheKey = generateCacheKey('/teacher/courses', params);
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<PaginatedResponse<Course>>>(
          '/teacher/courses',
          { params }
        );
        return response.data;
      });
    },

    /**
     * Get course by ID
     * @param id - Course ID
     * @returns Course details with enrollment stats
     */
    async getById(id: number): Promise<ApiResponse<Course>> {
      const cacheKey = generateCacheKey(`/teacher/courses/${id}`);
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<Course>>(
          `/teacher/courses/${id}`
        );
        return response.data;
      });
    },

    /**
     * Create a new course
     * @param data - Course data
     * @returns Created course
     */
    async create(data: CreateCourseRequest): Promise<ApiResponse<Course>> {
      const response = await apiClient.post<ApiResponse<Course>>(
        '/teacher/courses',
        data
      );
      
      // Invalidate courses cache
      cacheManager.invalidate('/teacher/courses');
      
      return response.data;
    },

    /**
     * Update an existing course
     * @param id - Course ID
     * @param data - Updated course data
     * @returns Updated course
     */
    async update(id: number, data: UpdateCourseRequest): Promise<ApiResponse<Course>> {
      const response = await apiClient.put<ApiResponse<Course>>(
        `/teacher/courses/${id}`,
        data
      );
      
      // Invalidate courses cache
      cacheManager.invalidate('/teacher/courses');
      
      return response.data;
    },

    /**
     * Delete a course
     * @param id - Course ID
     * @returns Success response
     */
    async delete(id: number): Promise<ApiResponse<void>> {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/teacher/courses/${id}`
      );
      
      // Invalidate courses cache
      cacheManager.invalidate('/teacher/courses');
      
      return response.data;
    },

    /**
     * Get students enrolled in a course
     * @param id - Course ID
     * @returns List of enrolled students
     */
    async getStudents(id: number): Promise<ApiResponse<any[]>> {
      const cacheKey = generateCacheKey(`/teacher/courses/${id}/students`);
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<any[]>>(
          `/teacher/courses/${id}/students`
        );
        return response.data;
      });
    },

    /**
     * Enroll a student in a course
     * @param id - Course ID
     * @param data - Enrollment data (student_id, fee_paid, etc.)
     * @returns Success response
     */
    async enrollStudent(id: number, data: EnrollStudentRequest): Promise<ApiResponse<void>> {
      const response = await apiClient.post<ApiResponse<void>>(
        `/teacher/courses/${id}/enroll`,
        data
      );
      
      // Invalidate courses and students cache
      cacheManager.invalidate('/teacher/courses');
      cacheManager.invalidate('/teacher/students');
      
      return response.data;
    },

    /**
     * Remove a student from a course
     * @param courseId - Course ID
     * @param studentId - Student ID
     * @returns Success response
     */
    async removeStudent(courseId: number, studentId: number): Promise<ApiResponse<void>> {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/teacher/courses/${courseId}/students/${studentId}`
      );
      
      // Invalidate courses and students cache
      cacheManager.invalidate('/teacher/courses');
      cacheManager.invalidate('/teacher/students');
      
      return response.data;
    },

    /**
     * Get course statistics
     * @param id - Course ID
     * @returns Course statistics
     */
    async getStatistics(id: number): Promise<ApiResponse<CourseStatistics>> {
      const cacheKey = generateCacheKey(`/teacher/courses/${id}/statistics`);
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<CourseStatistics>>(
          `/teacher/courses/${id}/statistics`
        );
        return response.data;
      });
    },
  },
  classes: {
    /**
     * Get all classes
     * @returns List of classes with enrollment stats
     */
    async getAll(): Promise<ApiResponse<Class[]>> {
      const cacheKey = generateCacheKey('/teacher/classes');
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<Class[]>>(
          '/teacher/classes'
        );
        return response.data;
      });
    },

    /**
     * Get class by ID
     * @param id - Class ID
     * @returns Class details
     */
    async getById(id: number): Promise<ApiResponse<Class>> {
      const cacheKey = generateCacheKey(`/teacher/classes/${id}`);
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<Class>>(
          `/teacher/classes/${id}`
        );
        return response.data;
      });
    },

    /**
     * Create a new class
     * @param data - Class data
     * @returns Created class
     */
    async create(data: CreateClassRequest): Promise<ApiResponse<Class>> {
      const response = await apiClient.post<ApiResponse<Class>>(
        '/teacher/classes',
        data
      );
      
      // Invalidate classes cache
      cacheManager.invalidate('/teacher/classes');
      
      return response.data;
    },

    /**
     * Update an existing class
     * @param id - Class ID
     * @param data - Updated class data
     * @returns Updated class
     */
    async update(id: number, data: UpdateClassRequest): Promise<ApiResponse<Class>> {
      const response = await apiClient.put<ApiResponse<Class>>(
        `/teacher/classes/${id}`,
        data
      );
      
      // Invalidate classes cache
      cacheManager.invalidate('/teacher/classes');
      
      return response.data;
    },

    /**
     * Delete a class
     * @param id - Class ID
     * @returns Success response
     */
    async delete(id: number): Promise<ApiResponse<void>> {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/teacher/classes/${id}`
      );
      
      // Invalidate classes cache
      cacheManager.invalidate('/teacher/classes');
      
      return response.data;
    },

    /**
     * Enroll students in a class (bulk enrollment)
     * @param id - Class ID
     * @param studentIds - Array of student IDs
     * @returns Success response
     */
    async enrollStudents(id: number, studentIds: number[]): Promise<ApiResponse<void>> {
      const response = await apiClient.post<ApiResponse<void>>(
        `/teacher/classes/${id}/enroll`,
        { student_ids: studentIds }
      );
      
      // Invalidate classes and students cache
      cacheManager.invalidate('/teacher/classes');
      cacheManager.invalidate('/teacher/students');
      
      return response.data;
    },

    /**
     * Transfer students from one class to another
     * @param fromId - Source class ID
     * @param toId - Destination class ID
     * @param studentIds - Array of student IDs to transfer
     * @param reason - Transfer reason
     * @param notes - Additional notes
     * @returns Success response
     */
    async transferStudents(
      fromId: number,
      toId: number,
      studentIds: number[],
      reason: string,
      notes?: string
    ): Promise<ApiResponse<void>> {
      const response = await apiClient.post<ApiResponse<void>>(
        `/teacher/classes/${fromId}/transfer/${toId}`,
        {
          student_ids: studentIds,
          reason,
          notes,
        }
      );
      
      // Invalidate classes cache
      cacheManager.invalidate('/teacher/classes');
      
      return response.data;
    },

    /**
     * Get transfer history for a class
     * @param id - Class ID
     * @param days - Number of days to look back (default: 30)
     * @returns Transfer history
     */
    async getTransferHistory(id: number, days: number = 30): Promise<ApiResponse<ClassTransferHistory[]>> {
      const cacheKey = generateCacheKey(`/teacher/classes/${id}/transfer-history`, { days });
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<ClassTransferHistory[]>>(
          `/teacher/classes/${id}/transfer-history`,
          { params: { days } }
        );
        return response.data;
      });
    },

    /**
     * Remove a student from a class
     * @param id - Class ID
     * @param studentId - Student ID
     * @returns Success response
     */
    async removeStudent(id: number, studentId: number): Promise<ApiResponse<void>> {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/teacher/classes/${id}/students/${studentId}`
      );
      
      // Invalidate classes and students cache
      cacheManager.invalidate('/teacher/classes');
      cacheManager.invalidate('/teacher/students');
      
      return response.data;
    },

    /**
     * Get class statistics
     * @returns Class statistics
     */
    async getStatistics(): Promise<ApiResponse<ClassStatistics>> {
      const cacheKey = generateCacheKey('/teacher/classes/statistics');
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<ClassStatistics>>(
          '/teacher/classes/statistics'
        );
        return response.data;
      });
    },
  },
  students: {
    /**
     * Get all students with pagination, search, and filters
     * @param params - Query parameters
     * @returns Paginated list of students
     */
    async getAll(params?: {
      page?: number;
      per_page?: number;
      search?: string;
      status?: string;
      class_id?: number;
      gender?: string;
      sort_by?: string;
      sort_order?: 'asc' | 'desc';
    }): Promise<ApiResponse<PaginatedResponse<Student>>> {
      const cacheKey = generateCacheKey('/teacher/students', params);
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<PaginatedResponse<Student>>>(
          '/teacher/students',
          { params }
        );
        return response.data;
      });
    },

    /**
     * Get student by ID
     * @param id - Student ID
     * @returns Student details
     */
    async getById(id: number): Promise<ApiResponse<Student>> {
      const cacheKey = generateCacheKey(`/teacher/students/${id}`);
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<Student>>(
          `/teacher/students/${id}`
        );
        return response.data;
      });
    },

    /**
     * Create a new student (single or bulk)
     * @param data - Student data or array of students
     * @returns Created student(s) or bulk import result
     */
    async create(data: CreateStudentRequest | CreateStudentRequest[]): Promise<ApiResponse<Student | BulkImportResult>> {
      const response = await apiClient.post<ApiResponse<Student | BulkImportResult>>(
        '/teacher/students',
        Array.isArray(data) ? { students: data } : data
      );
      
      // Invalidate students cache
      cacheManager.invalidate('/teacher/students');
      
      return response.data;
    },

    /**
     * Update an existing student
     * @param id - Student ID
     * @param data - Updated student data
     * @returns Updated student
     */
    async update(id: number, data: UpdateStudentRequest): Promise<ApiResponse<Student>> {
      const response = await apiClient.put<ApiResponse<Student>>(
        `/teacher/students/${id}`,
        data
      );
      
      // Invalidate students cache
      cacheManager.invalidate('/teacher/students');
      
      return response.data;
    },

    /**
     * Delete a student
     * @param id - Student ID
     * @returns Success response
     */
    async delete(id: number): Promise<ApiResponse<void>> {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/teacher/students/${id}`
      );
      
      // Invalidate students cache
      cacheManager.invalidate('/teacher/students');
      
      return response.data;
    },

    /**
     * Get student statistics
     * @returns Student statistics
     */
    async getStatistics(): Promise<ApiResponse<StudentStatistics>> {
      const cacheKey = generateCacheKey('/teacher/students/statistics');
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<StudentStatistics>>(
          '/teacher/students/statistics'
        );
        return response.data;
      });
    },

    /**
     * Export students to CSV or JSON
     * @param format - Export format (csv or json)
     * @returns File blob
     */
    async exportStudents(format: 'csv' | 'json'): Promise<Blob> {
      const response = await apiClient.get(
        '/teacher/students/export',
        {
          params: { format },
          responseType: 'blob',
        }
      );
      
      return response.data;
    },
  },

  exams: {
    /**
     * Get all exams
     * @returns List of exams
     */
    async getAll(): Promise<ApiResponse<Exam[]>> {
      const cacheKey = generateCacheKey('/teacher/exams');
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<Exam[]>>(
          '/teacher/exams'
        );
        return response.data;
      });
    },

    /**
     * Get exam by ID
     * @param id - Exam ID
     * @returns Exam details with questions
     */
    async getById(id: number): Promise<ApiResponse<Exam>> {
      const cacheKey = generateCacheKey(`/teacher/exams/${id}`);
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<Exam>>(
          `/teacher/exams/${id}`
        );
        return response.data;
      });
    },

    /**
     * Create a new exam
     * @param data - Exam data
     * @returns Created exam
     */
    async create(data: CreateExamRequest): Promise<ApiResponse<Exam>> {
      const response = await apiClient.post<ApiResponse<Exam>>(
        '/teacher/exams',
        data
      );
      
      // Invalidate exams cache
      cacheManager.invalidate('/teacher/exams');
      
      return response.data;
    },

    /**
     * Update an existing exam
     * @param id - Exam ID
     * @param data - Updated exam data
     * @returns Updated exam
     */
    async update(id: number, data: UpdateExamRequest): Promise<ApiResponse<Exam>> {
      const response = await apiClient.put<ApiResponse<Exam>>(
        `/teacher/exams/${id}`,
        data
      );
      
      // Invalidate exams cache
      cacheManager.invalidate('/teacher/exams');
      
      return response.data;
    },

    /**
     * Delete an exam
     * @param id - Exam ID
     * @returns Success response
     */
    async delete(id: number): Promise<ApiResponse<void>> {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/teacher/exams/${id}`
      );
      
      // Invalidate exams cache
      cacheManager.invalidate('/teacher/exams');
      
      return response.data;
    },

    /**
     * Add questions to an exam
     * @param id - Exam ID
     * @param questions - Array of questions
     * @returns Success response
     */
    async addQuestions(id: number, questions: CreateQuestionRequest[]): Promise<ApiResponse<void>> {
      const response = await apiClient.post<ApiResponse<void>>(
        `/teacher/exams/${id}/questions`,
        { questions }
      );
      
      // Invalidate exams cache
      cacheManager.invalidate('/teacher/exams');
      
      return response.data;
    },

    /**
     * Update a question in an exam
     * @param examId - Exam ID
     * @param questionId - Question ID
     * @param data - Updated question data
     * @returns Success response
     */
    async updateQuestion(examId: number, questionId: number, data: UpdateQuestionRequest): Promise<ApiResponse<void>> {
      const response = await apiClient.put<ApiResponse<void>>(
        `/teacher/exams/${examId}/questions/${questionId}`,
        data
      );
      
      // Invalidate exams cache
      cacheManager.invalidate('/teacher/exams');
      
      return response.data;
    },

    /**
     * Delete a question from an exam
     * @param examId - Exam ID
     * @param questionId - Question ID
     * @returns Success response
     */
    async deleteQuestion(examId: number, questionId: number): Promise<ApiResponse<void>> {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/teacher/exams/${examId}/questions/${questionId}`
      );
      
      // Invalidate exams cache
      cacheManager.invalidate('/teacher/exams');
      
      return response.data;
    },

    /**
     * Get exam sections organized by skill
     * @param id - Exam ID
     * @returns Exam sections
     */
    async getSections(id: number): Promise<ApiResponse<ExamSection[]>> {
      const cacheKey = generateCacheKey(`/teacher/exams/${id}/sections`);
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<ExamSection[]>>(
          `/teacher/exams/${id}/sections`
        );
        return response.data;
      });
    },

    /**
     * Clone an exam
     * @param id - Exam ID
     * @param title - New exam title
     * @param description - New exam description
     * @returns Cloned exam
     */
    async clone(id: number, title: string, description?: string): Promise<ApiResponse<Exam>> {
      const response = await apiClient.post<ApiResponse<Exam>>(
        `/teacher/exams/${id}/clone`,
        { title, description }
      );
      
      // Invalidate exams cache
      cacheManager.invalidate('/teacher/exams');
      
      return response.data;
    },

    /**
     * Preview an exam (correct answers hidden)
     * @param id - Exam ID
     * @returns Exam preview
     */
    async preview(id: number): Promise<ApiResponse<Exam>> {
      const cacheKey = generateCacheKey(`/teacher/exams/${id}/preview`);
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<Exam>>(
          `/teacher/exams/${id}/preview`
        );
        return response.data;
      });
    },

    /**
     * Publish an exam
     * @param id - Exam ID
     * @returns Success response
     */
    async publish(id: number): Promise<ApiResponse<void>> {
      const response = await apiClient.post<ApiResponse<void>>(
        `/teacher/exams/${id}/publish`
      );
      
      // Invalidate exams cache
      cacheManager.invalidate('/teacher/exams');
      
      return response.data;
    },

    /**
     * Import exam from JSON (Gemini AI format)
     * @param data - Exam JSON data
     * @returns Import result with exam ID
     */
    async importExam(data: any): Promise<ApiResponse<{ examId: number; title: string; questions_count: number; total_points: number }>> {
      const response = await apiClient.post<ApiResponse<{ examId: number; title: string; questions_count: number; total_points: number }>>(
        '/teacher/exams/import',
        data
      );
      
      // Invalidate exams cache
      cacheManager.invalidate('/teacher/exams');
      
      return response.data;
    },

    /**
     * Validate exam JSON before import
     * @param data - Exam JSON data
     * @returns Validation result
     */
    async validateExamImport(data: any): Promise<ApiResponse<{
      valid: boolean;
      total_questions: number;
      total_points: number;
      issues: string[];
      warnings: string[];
      exam_info: {
        title: string;
        type: string;
        skill: string;
        duration: number;
      };
    }>> {
      const response = await apiClient.post(
        '/teacher/exams/import/validate',
        data
      );
      
      return response.data;
    },
  },
  examTemplates: {},
  assignments: {
    /**
     * Get all test assignments with filters
     * @param params - Query parameters
     * @returns List of assignments
     */
    async getAll(params?: {
      exam_id?: number;
      target_type?: 'class' | 'student';
      target_id?: number;
    }): Promise<ApiResponse<TestAssignment[]>> {
      const cacheKey = generateCacheKey('/teacher/assignments', params);
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<TestAssignment[]>>(
          '/teacher/assignments',
          { params }
        );
        return response.data;
      });
    },

    /**
     * Assign an exam to a target (class or student)
     * @param examId - Exam ID
     * @param targetType - Target type (class or student)
     * @param targetId - Target ID
     * @param deadline - Assignment deadline
     * @param maxAttempt - Maximum attempts allowed
     * @param isPublic - Whether assignment is public
     * @returns Created assignment
     */
    async assign(
      examId: number,
      targetType: 'class' | 'student',
      targetId: number,
      deadline: string,
      maxAttempt: number,
      isPublic: boolean
    ): Promise<ApiResponse<TestAssignment>> {
      const response = await apiClient.post<ApiResponse<TestAssignment>>(
        `/teacher/exams/${examId}/assign`,
        {
          target_type: targetType,
          target_id: targetId,
          deadline,
          max_attempt: maxAttempt,
          is_public: isPublic,
        }
      );
      
      // Invalidate assignments cache
      cacheManager.invalidate('/teacher/assignments');
      
      return response.data;
    },

    /**
     * Bulk assign an exam to multiple targets
     * @param examId - Exam ID
     * @param targets - Array of targets
     * @param deadline - Assignment deadline
     * @param maxAttempt - Maximum attempts allowed
     * @param isPublic - Whether assignment is public
     * @returns Success response
     */
    async bulkAssign(
      examId: number,
      targets: Array<{ type: 'class' | 'student'; id: number }>,
      deadline: string,
      maxAttempt: number,
      isPublic: boolean
    ): Promise<ApiResponse<void>> {
      const response = await apiClient.post<ApiResponse<void>>(
        `/teacher/exams/${examId}/bulk-assign`,
        {
          targets,
          deadline,
          max_attempt: maxAttempt,
          is_public: isPublic,
        }
      );
      
      // Invalidate assignments cache
      cacheManager.invalidate('/teacher/assignments');
      
      return response.data;
    },

    /**
     * Get assignment progress
     * @param id - Assignment ID
     * @returns Assignment progress
     */
    async getProgress(id: number): Promise<ApiResponse<AssignmentProgress>> {
      const cacheKey = generateCacheKey(`/teacher/assignments/${id}/progress`);
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<AssignmentProgress>>(
          `/teacher/assignments/${id}/progress`
        );
        return response.data;
      });
    },

    /**
     * Send reminders to students who haven't completed assignment
     * @param id - Assignment ID
     * @returns Success response
     */
    async sendReminders(id: number): Promise<ApiResponse<void>> {
      const response = await apiClient.post<ApiResponse<void>>(
        `/teacher/assignments/${id}/reminders`
      );
      
      return response.data;
    },

    /**
     * Delete an assignment
     * @param id - Assignment ID
     * @returns Success response
     */
    async delete(id: number): Promise<ApiResponse<void>> {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/teacher/assignments/${id}`
      );
      
      // Invalidate assignments cache
      cacheManager.invalidate('/teacher/assignments');
      
      return response.data;
    },

    /**
     * Get assignment statistics
     * @returns Assignment statistics
     */
    async getStatistics(): Promise<ApiResponse<AssignmentStatistics>> {
      const cacheKey = generateCacheKey('/teacher/assignments/statistics');
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<AssignmentStatistics>>(
          '/teacher/assignments/statistics'
        );
        return response.data;
      });
    },
  },

  grading: {
    /**
     * Get submissions with filters
     * @param params - Query parameters
     * @returns List of submissions
     */
    async getSubmissions(params?: {
      exam_id?: number;
      student_id?: number;
      status?: 'submitted' | 'graded' | 'partially_graded' | 'in_progress';
    }): Promise<ApiResponse<Submission[]>> {
      const cacheKey = generateCacheKey('/teacher/grading/submissions', params);
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<Submission[]>>(
          '/teacher/grading/submissions',
          { params }
        );
        return response.data;
      });
    },

    /**
     * Get submission by ID
     * @param id - Submission ID
     * @returns Submission details with answers
     */
    async getSubmissionById(id: number): Promise<ApiResponse<Submission>> {
      const cacheKey = generateCacheKey(`/teacher/grading/submissions/${id}`);
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<Submission>>(
          `/teacher/grading/submissions/${id}`
        );
        return response.data;
      });
    },

    /**
     * Grade a submission (manual grading)
     * @param id - Submission ID
     * @param score - Total score
     * @param feedback - Overall feedback
     * @param teacherFeedback - Teacher's feedback
     * @param questionScores - Scores for each question
     * @returns Success response
     */
    async gradeSubmission(
      id: number,
      score: number,
      feedback?: string,
      teacherFeedback?: string,
      questionScores?: Record<number, number>
    ): Promise<ApiResponse<void>> {
      const response = await apiClient.post<ApiResponse<void>>(
        `/teacher/grading/submissions/${id}/grade`,
        {
          score,
          feedback,
          teacher_feedback: teacherFeedback,
          question_scores: questionScores,
        }
      );
      
      // Invalidate grading cache
      cacheManager.invalidate('/teacher/grading');
      
      return response.data;
    },

    /**
     * Auto-grade a submission
     * @param id - Submission ID
     * @returns Success response
     */
    async autoGrade(id: number): Promise<ApiResponse<void>> {
      const response = await apiClient.post<ApiResponse<void>>(
        `/teacher/grading/submissions/${id}/auto-grade`
      );
      
      // Invalidate grading cache
      cacheManager.invalidate('/teacher/grading');
      
      return response.data;
    },

    /**
     * Detailed grading with per-question feedback
     * @param id - Submission ID
     * @param questionGrades - Grades for each question
     * @param overallFeedback - Overall feedback
     * @param strengths - Student's strengths
     * @param improvements - Areas for improvement
     * @returns Success response
     */
    async detailedGrade(
      id: number,
      questionGrades: Array<{ question_id: number; score: number; feedback: string }>,
      overallFeedback: string,
      strengths?: string[],
      improvements?: string[]
    ): Promise<ApiResponse<void>> {
      const response = await apiClient.post<ApiResponse<void>>(
        `/teacher/grading/submissions/${id}/detailed-grade`,
        {
          question_grades: questionGrades,
          overall_feedback: overallFeedback,
          strengths,
          improvements,
        }
      );
      
      // Invalidate grading cache
      cacheManager.invalidate('/teacher/grading');
      
      return response.data;
    },

    /**
     * Get class report
     * @param classId - Class ID
     * @param examId - Exam ID (optional)
     * @returns Class report
     */
    async getClassReport(classId: number, examId?: number): Promise<ApiResponse<ClassReport>> {
      const cacheKey = generateCacheKey(`/teacher/grading/class-report/${classId}`, { exam_id: examId });
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<ClassReport>>(
          `/teacher/grading/class-report/${classId}`,
          { params: { exam_id: examId } }
        );
        return response.data;
      });
    },

    /**
     * Get grading statistics
     * @returns Grading statistics
     */
    async getStatistics(): Promise<ApiResponse<GradingStatistics>> {
      const cacheKey = generateCacheKey('/teacher/grading/statistics');
      
      return withCache(cacheKey, async () => {
        const response = await apiClient.get<ApiResponse<GradingStatistics>>(
          '/teacher/grading/statistics'
        );
        return response.data;
      });
    },
  },
  monitoring: {},
  practiceSessions: {},
  blogs: {},
  categories: {},
  reports: {},
  
  /**
   * User Profile Module
   */
  user: {
    /**
     * Get current user profile
     * @returns User profile data
     */
    async getProfile(): Promise<ApiResponse<any>> {
      const response = await apiClient.get<ApiResponse<any>>('/user/profile');
      return response.data;
    },

    /**
     * Update user profile
     * @param data - Profile data to update
     * @returns Updated profile
     */
    async updateProfile(data: any): Promise<ApiResponse<any>> {
      const response = await apiClient.put<ApiResponse<any>>('/user/profile', data);
      return response.data;
    },

    /**
     * Change password
     * @param currentPassword - Current password
     * @param newPassword - New password
     * @param confirmPassword - Confirm new password
     * @returns Success response
     */
    async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<ApiResponse<any>> {
      const response = await apiClient.post<ApiResponse<any>>('/user/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      return response.data;
    },

    /**
     * Get active sessions
     * @returns List of active sessions
     */
    async getSessions(): Promise<ApiResponse<any>> {
      const response = await apiClient.get<ApiResponse<any>>('/user/sessions');
      return response.data;
    },

    /**
     * Logout from a specific session
     * @param sessionId - Session ID to logout
     * @returns Success response
     */
    async logoutSession(sessionId: string): Promise<ApiResponse<any>> {
      const response = await apiClient.delete<ApiResponse<any>>(`/user/sessions/${sessionId}`);
      return response.data;
    },
  },
};

export default teacherApi;
