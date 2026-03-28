/**
 * Custom hook to set page title
 * Automatically updates document.title based on current page
 */

import { useEffect } from 'react';

const BASE_TITLE = 'NamThu Education';

export function usePageTitle(pageTitle?: string) {
  useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} - ${BASE_TITLE}`;
    } else {
      document.title = `${BASE_TITLE} - Nền tảng học tập thông minh`;
    }

    // Cleanup: reset to default title when component unmounts
    return () => {
      document.title = `${BASE_TITLE} - Nền tảng học tập thông minh`;
    };
  }, [pageTitle]);
}

// Predefined page titles for consistency
export const PAGE_TITLES = {
  // Public pages
  HOME: 'Trang chủ',
  LANDING: 'Chào mừng',
  
  // Auth pages
  LOGIN: 'Đăng nhập',
  REGISTER: 'Đăng ký',
  FORGOT_PASSWORD: 'Quên mật khẩu',
  
  // Student pages
  STUDENT_DASHBOARD: 'Trang chủ học sinh',
  STUDENT_TESTS: 'Bài tập',
  STUDENT_PRACTICE: 'Luyện tập',
  STUDENT_PROGRESS: 'Tiến độ học tập',
  STUDENT_PROFILE: 'Hồ sơ cá nhân',
  STUDENT_SETTINGS: 'Cài đặt',
  STUDENT_NOTIFICATIONS: 'Thông báo',
  STUDENT_TEST_TAKING: 'Làm bài thi',
  STUDENT_TEST_RESULT: 'Kết quả bài thi',
  STUDENT_EXAM_LOBBY: 'Phòng chờ thi',
  
  // Teacher pages
  TEACHER_DASHBOARD: 'Trang chủ giáo viên',
  TEACHER_COURSES: 'Khóa học',
  TEACHER_ASSIGNMENTS: 'Bài tập',
  TEACHER_GRADING: 'Chấm bài',
  TEACHER_STUDENTS: 'Học sinh',
  TEACHER_REPORTS: 'Báo cáo',
  
  // Admin pages
  ADMIN_DASHBOARD: 'Quản trị hệ thống',
  ADMIN_USERS: 'Quản lý người dùng',
  ADMIN_COURSES: 'Quản lý khóa học',
  ADMIN_REPORTS: 'Báo cáo hệ thống',
} as const;
