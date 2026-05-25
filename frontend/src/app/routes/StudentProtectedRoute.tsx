import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthToken, getAuthUser, clearAuthData } from '../../utils/authStorage';

interface StudentProtectedRouteProps {
  ageGroup: 'kids' | 'teens' | 'adults';
  children: React.ReactNode;
}

export const StudentProtectedRoute: React.FC<StudentProtectedRouteProps> = ({ 
  ageGroup, 
  children 
}) => {
  const token = getAuthToken();
  const user = getAuthUser();

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/dang-nhap" replace />;
  }
  
  try {
    
    // Not a student
    if ((user.role as string) !== 'student') {
      return <Navigate to="/" replace />;
    }
    
    // No class assigned yet
    if (!user.class_id as unknown) {
      return <Navigate to="/hoc-vien/cho-xep-lop" replace />;
    }
    
    // Wrong age group - redirect to correct dashboard
    const userAgeGroup = (user.age_group as string) || 'teens';
    if (userAgeGroup !== ageGroup) {
      return <Navigate to={`/hoc-vien/${userAgeGroup}`} replace />;
    }
    
    // All checks passed
    return <>{children}</>;
    
  } catch (error) {
    // Invalid user data
    clearAuthData();
    return <Navigate to="/dang-nhap" replace />;
  }
};
