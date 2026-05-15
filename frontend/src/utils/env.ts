/**
 * Environment configuration utilities
 */

export const env = {
  // API
  apiUrl: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL,
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,

  // App
  appName: import.meta.env.VITE_APP_NAME || 'NamThu Education',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',

  // WebSocket
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:6001',
  wsKey: import.meta.env.VITE_WS_KEY || 'namthuedu',

  // Feature Flags
  enableMonitoring: import.meta.env.VITE_ENABLE_MONITORING === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',

  // Upload
  maxFileSize: Number(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760, // 10MB
  allowedFileTypes:
    import.meta.env.VITE_ALLOWED_FILE_TYPES ||
    '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png',

  // Pagination
  defaultPageSize: Number(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 20,
  maxPageSize: Number(import.meta.env.VITE_MAX_PAGE_SIZE) || 100,

  // Helpers
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Validate required environment variables
export function validateEnv() {
  const required = ['VITE_API_URL'];

  const missing = required.filter(
    (key) => !import.meta.env[key as keyof ImportMetaEnv]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
