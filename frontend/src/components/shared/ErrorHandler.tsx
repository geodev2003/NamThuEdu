import { AxiosError } from 'axios';
import { toast } from '../../lib/toast';
import { ValidationError } from '../../types/teacher';

/**
 * Error message mapping for different HTTP status codes
 */
export const ERROR_MESSAGES: Record<number | string, string> = {
  400: 'Dữ liệu không hợp lệ',
  401: 'Phiên đăng nhập đã hết hạn',
  403: 'Bạn không có quyền thực hiện hành động này',
  404: 'Không tìm thấy dữ liệu',
  500: 'Lỗi hệ thống. Vui lòng thử lại sau',
  network: 'Không thể kết nối đến server. Kiểm tra kết nối mạng',
};

/**
 * Handle API errors with appropriate user feedback
 * @param error - Axios error object
 * @param onRetry - Optional retry callback for retryable errors
 * @returns Formatted error message
 */
export function handleApiError(
  error: AxiosError<ValidationError>,
  onRetry?: () => void
): string {
  // Network error - no response from server
  if (!error.response) {
    const message = ERROR_MESSAGES.network;
    
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      action: onRetry ? {
        label: 'Thử lại',
        onClick: onRetry,
      } : undefined,
    });
    
    return message;
  }

  const status = error.response.status;
  const responseData = error.response.data;

  // Validation errors (400) - Display field-specific messages
  if (status === 400 && responseData?.errors) {
    const fieldErrors = responseData.errors;
    const errorMessages: string[] = [];

    Object.entries(fieldErrors).forEach(([field, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        errorMessages.push(`${field}: ${messages[0]}`);
      }
    });

    const message = errorMessages.join('\n') || ERROR_MESSAGES[400];
    
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        whiteSpace: 'pre-line',
      },
    });

    return message;
  }

  // Other HTTP errors
  const message = ERROR_MESSAGES[status] || responseData?.message || 'Đã xảy ra lỗi';
  
  // Show retry option for 500 and network errors
  const showRetry = (status === 500 || !error.response) && onRetry;
  
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
    action: showRetry ? {
      label: 'Thử lại',
      onClick: onRetry,
    } : undefined,
  });

  return message;
}

/**
 * Display success toast notification
 * @param message - Success message to display
 */
export function showSuccessToast(message: string): void {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#10b981',
      color: '#fff',
    },
  });
}

/**
 * Display info toast notification
 * @param message - Info message to display
 */
export function showInfoToast(message: string): void {
  toast(message, {
    duration: 3000,
    position: 'top-right',
    icon: 'ℹ️',
  });
}

/**
 * Display warning toast notification
 * @param message - Warning message to display
 */
export function showWarningToast(message: string): void {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    icon: '⚠️',
    style: {
      background: '#f59e0b',
      color: '#fff',
    },
  });
}

/**
 * Display loading toast notification
 * @param message - Loading message to display
 * @returns Toast ID for dismissal
 */
export function showLoadingToast(message: string): string | number {
  return toast.loading(message, {
    position: 'top-right',
  });
}

/**
 * Dismiss a specific toast
 * @param toastId - ID of the toast to dismiss
 */
export function dismissToast(toastId: string | number): void {
  toast.dismiss(toastId);
}

/**
 * Extract field-specific validation errors
 * @param error - Axios error object
 * @returns Object with field names as keys and error messages as values
 */
export function extractValidationErrors(
  error: AxiosError<ValidationError>
): Record<string, string> {
  if (error.response?.status === 400 && error.response.data?.errors) {
    const fieldErrors = error.response.data.errors;
    const result: Record<string, string> = {};

    Object.entries(fieldErrors).forEach(([field, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        result[field] = messages[0];
      }
    });

    return result;
  }

  return {};
}

/**
 * Check if error is a network error
 * @param error - Axios error object
 * @returns True if network error
 */
export function isNetworkError(error: AxiosError): boolean {
  return !error.response;
}

/**
 * Check if error is retryable
 * @param error - Axios error object
 * @returns True if error can be retried
 */
export function isRetryableError(error: AxiosError): boolean {
  return !error.response || error.response.status === 500;
}

/**
 * Log error in development mode
 * @param error - Error object
 * @param context - Additional context
 */
export function logError(error: any, context?: string): void {
  if (import.meta.env.DEV) {
    console.group('🔴 Error Log' + (context ? ` - ${context}` : ''));
    console.error('Error:', error);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    console.error('Stack:', error.stack);
    console.groupEnd();
  }
}
