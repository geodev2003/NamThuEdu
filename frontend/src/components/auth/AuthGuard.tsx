/**
 * AuthGuard — Bảo vệ trang login/register.
 *
 * Nếu user đã đăng nhập (với đúng role), tự redirect về dashboard tương ứng.
 * Dùng để bọc các trang: /dang-nhap, /giao-vien/dang-nhap, /admin/login.
 */

import { Navigate } from 'react-router';

interface AuthGuardProps {
  children: React.ReactNode;
  /** Role mà trang login này phục vụ */
  forRole: 'student' | 'teacher' | 'admin';
}

function getDashboardPath(role: string): string {
  if (role === 'teacher') return '/giao-vien';
  if (role === 'admin') return '/admin';
  return '/hoc-vien';
}

export function AuthGuard({ children, forRole }: AuthGuardProps) {
  const token = localStorage.getItem('auth_token');

  if (token) {
    try {
      const raw = localStorage.getItem('user');
      const user = raw ? JSON.parse(raw) : null;
      const role: string | null = user?.role || user?.uRole || null;

      if (role) {
        // Already logged in → go to their own dashboard (any role)
        return <Navigate to={getDashboardPath(role)} replace />;
      }
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
    }
  }

  return <>{children}</>;
}
