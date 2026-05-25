/**
 * AuthGuard — Bảo vệ trang login/register.
 *
 * Nếu user đã đăng nhập (với đúng role), tự redirect về dashboard tương ứng.
 * Dùng để bọc các trang: /dang-nhap, /giao-vien/dang-nhap, /admin/login.
 */

import { Navigate } from 'react-router';
import { getAuthToken, getAuthUser } from '../../utils/authStorage';

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
  const token = getAuthToken();

  if (token) {
    const user = getAuthUser();
    const role: string | null = (user?.role as string) || (user?.uRole as string) || null;
    if (role) return <Navigate to={getDashboardPath(role)} replace />;
  }

  return <>{children}</>;
}
