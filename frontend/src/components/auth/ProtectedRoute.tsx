/**
 * ProtectedRoute - Auth Guard Component
 * 
 * Bảo vệ routes yêu cầu authentication
 * Redirect về login nếu chưa đăng nhập
 */

import { Navigate, useLocation } from 'react-router';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'teacher' | 'admin';
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  redirectTo 
}: ProtectedRouteProps) {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('user');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }

      try {
        const user = userStr ? JSON.parse(userStr) : null;
        // Support both uRole (database field) and role (API response)
        setUserRole(user?.role || user?.uRole || null);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsAuthenticated(false);
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    const loginPath = requiredRole === 'student' 
      ? '/hoc-vien/dang-nhap'
      : requiredRole === 'teacher'
      ? '/giao-vien/dang-nhap'
      : '/admin/dang-nhap';
    
    return <Navigate to={redirectTo || loginPath} state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h2>
          <p className="text-gray-600 mb-6">
            Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản {requiredRole}.
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Authenticated and authorized
  return <>{children}</>;
}
