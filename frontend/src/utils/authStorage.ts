/**
 * authStorage — Centralized auth token storage.
 *
 * remember = true  → localStorage  (persists across browser sessions)
 * remember = false → sessionStorage (cleared when tab/browser closes)
 *
 * Both ProtectedRoute and AuthGuard check BOTH storages so either path works.
 */

export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
}

export function getAuthUser(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuthData(token: string, user: Record<string, unknown>, remember: boolean): void {
  // CRITICAL: Clear ALL auth data from BOTH storages first to prevent old user data leaking
  clearAuthData();
  
  const keep = remember ? localStorage : sessionStorage;

  keep.setItem('auth_token', token);
  keep.setItem('auth_role', String(user.role ?? ''));
  keep.setItem('user', JSON.stringify(user));

  if (remember) {
    localStorage.setItem('remember_phone', String(user.phone ?? ''));
    localStorage.setItem('remember_role', String(user.role ?? ''));
  }
}

export function getRememberedPhone(role: 'student' | 'teacher'): string {
  const remembered = localStorage.getItem('remember_role');
  if (remembered !== role) return '';
  return localStorage.getItem('remember_phone') ?? '';
}

export function clearAuthData(): void {
  ['auth_token', 'auth_role', 'user'].forEach((k) => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  });
  localStorage.removeItem('remember_me');
}
