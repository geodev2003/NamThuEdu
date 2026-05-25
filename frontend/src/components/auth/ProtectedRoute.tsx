/**
 * ProtectedRoute - Auth Guard Component
 *
 * Synchronous check (no flash) — reads localStorage immediately.
 * - Not authenticated → redirect to role-specific login page.
 * - Wrong role       → redirect to the authenticated user's own dashboard.
 */

import { Navigate, useLocation } from 'react-router';
import { getAuthToken, getAuthUser } from '../../utils/authStorage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'teacher' | 'admin';
  redirectTo?: string;
}

function getLoginPath(role?: string): string {
  if (role === 'student') return '/dang-nhap';
  if (role === 'teacher') return '/giao-vien/dang-nhap';
  if (role === 'admin') return '/admin/login';
  return '/dang-nhap';
}

function getDashboardPath(role?: string | null): string {
  if (role === 'teacher') return '/giao-vien';
  if (role === 'admin') return '/admin';
  return '/hoc-vien';
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo,
}: ProtectedRouteProps) {
  const location = useLocation();

  // ── Synchronous auth check (localStorage + sessionStorage) ─────────────────
  const token = getAuthToken();
  let userRole: string | null = null;

  if (token) {
    const user = getAuthUser();
    userRole = (user?.role as string) || (user?.uRole as string) || null;
  }

  // Not authenticated → go to the correct login page
  if (!token || !userRole) {
    const loginPath = redirectTo || getLoginPath(requiredRole);
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Wrong role → silently redirect user to their own dashboard
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={getDashboardPath(userRole)} replace />;
  }

  return <>{children}</>;
}
