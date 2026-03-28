/**
 * Authentication Components
 * 
 * Organized by role for better maintainability
 */

// Student Auth
export * from './student';

// Teacher Auth
export * from './teacher';

// Shared Auth
export * from './shared';

// Legacy exports for backward compatibility
export { Login } from './Login';
export { Register } from './Register';
