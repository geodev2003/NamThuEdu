// Common types used across the application

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student' | 'admin';
  avatar?: string;
}

/**
 * Standard API response shape matching backend Laravel responses.
 * Used by ALL services — do not redefine this elsewhere.
 */
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Paginated response matching Laravel paginator output.
 */
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface ValidationError {
  status: 'error';
  message: string;
  errors: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface SelectOption {
  label: string;
  value: string;
}
