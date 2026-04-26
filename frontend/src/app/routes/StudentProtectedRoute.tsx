import React from 'react';
import { Navigate } from 'react-router-dom';

interface StudentProtectedRouteProps {
  ageGroup: 'kids' | 'teens' | 'adults';
  children: React.ReactNode;
}

export const StudentProtectedRoute: React.FC<StudentProtectedRouteProps> = ({ 
  ageGroup, 
  children 
}) => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('auth_token');
  
  // Not logged in
  if (!token || !userStr) {
    return <Navigate to="/dang-nhap" replace />;
  }
  
  try {
    const user = JSON.parse(userStr);
    
    // Not a student
    if (user.role !== 'student') {
      return <Navigate to="/" replace />;
    }
    
    // No class assigned yet
    if (!user.class_id) {
      return <Navigate to="/hoc-vien/cho-xep-lop" replace />;
    }
    
    // Wrong age group - redirect to correct dashboard
    // Fallback to 'teens' nếu age_group thiếu (data cũ)
    const userAgeGroup = user.age_group || 'teens';
    if (userAgeGroup !== ageGroup) {
      return <Navigate to={`/hoc-vien/${userAgeGroup}`} replace />;
    }
    
    // All checks passed
    return <>{children}</>;
    
  } catch (error) {
    // Invalid user data
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    return <Navigate to="/dang-nhap" replace />;
  }
};
