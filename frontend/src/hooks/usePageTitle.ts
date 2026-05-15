/**
 * usePageTitle — Hook để set document.title động cho từng trang.
 *
 * Quy tắc:
 * - Trang public (landing, login): "Tên trang | NamThu Edu"
 * - Trang nội bộ (teacher/student/admin portal): chỉ "Tên trang"
 *
 * @param title - Tiêu đề trang
 * @param withBrand - Có thêm " | NamThu Edu" vào không (default: false)
 */
import { useEffect } from "react";

export function usePageTitle(title: string, withBrand = false) {
  useEffect(() => {
    const fullTitle = withBrand ? `${title} | NamThu Edu` : title;
    document.title = fullTitle;

    return () => {
      document.title = "NamThu Edu";
    };
  }, [title, withBrand]);
}

// ─── Page Title Constants ─────────────────────────────────────────────────────
// Public pages: có brand
// Internal pages: không có brand (chỉ tên trang)

export const PAGE_TITLES = {
  // ── Public ──────────────────────────────────────────────────────────────
  LANDING: "Giải pháp học tiếng Anh thông minh",

  // ── Auth ────────────────────────────────────────────────────────────────
  LOGIN: "Đăng nhập",
  REGISTER: "Đăng ký",
  STUDENT_LOGIN: "Đăng nhập học viên",
  TEACHER_LOGIN: "Đăng nhập giáo viên",
  ADMIN_LOGIN: "Đăng nhập quản trị",

  // ── Teacher Portal ───────────────────────────────────────────────────────
  TEACHER_DASHBOARD: "Tổng quan",
  TEACHER_STUDENTS: "Quản lý học viên",
  TEACHER_STUDENTS_ADD: "Thêm học viên",
  TEACHER_STUDENTS_IMPORT: "Import học viên",
  TEACHER_CLASSES: "Lớp học",
  TEACHER_CLASSES_CREATE: "Tạo lớp học",
  TEACHER_CLASSES_TRANSFER: "Chuyển lớp",
  TEACHER_CLASSES_STATS: "Thống kê lớp học",
  TEACHER_COURSES: "Khóa học",
  TEACHER_COURSES_CREATE: "Tạo khóa học",
  TEACHER_COURSES_STATS: "Thống kê khóa học",
  TEACHER_EXAMS: "Ngân hàng đề thi",
  TEACHER_EXAMS_MY: "Đề thi của tôi",
  TEACHER_EXAMS_CREATE: "Tạo đề thi",
  TEACHER_EXAMS_CREATE_KIDS: "Tạo đề thi Cambridge YLE",
  TEACHER_EXAMS_TEMPLATES: "Mẫu đề thi",
  TEACHER_EXAMS_IMPORT: "Import đề thi",
  TEACHER_ASSIGNMENTS: "Giao bài tập",
  TEACHER_ASSIGNMENTS_CREATE: "Giao bài mới",
  TEACHER_ASSIGNMENTS_STATS: "Thống kê bài tập",
  TEACHER_PRACTICE: "Luyện tập",
  TEACHER_GRADING: "Chấm bài",
  TEACHER_GRADING_REPORT: "Báo cáo lớp",
  TEACHER_GRADING_STATS: "Thống kê chấm bài",
  TEACHER_MONITORING: "Giám sát trực tiếp",
  TEACHER_BLOG: "Bài viết",
  TEACHER_BLOG_CREATE: "Tạo bài viết",
  TEACHER_BLOG_CATEGORIES: "Danh mục bài viết",
  TEACHER_REPORTS: "Báo cáo",
  TEACHER_REPORTS_PROGRESS: "Tiến độ học viên",
  TEACHER_REPORTS_ANALYSIS: "Phân tích kết quả",
  TEACHER_SETTINGS: "Cài đặt",

  // ── Student Portal ───────────────────────────────────────────────────────
  STUDENT_DASHBOARD: "Tổng quan",
  STUDENT_KIDS_DASHBOARD: "Trang chủ",
  STUDENT_TEENS_DASHBOARD: "Trang chủ",
  STUDENT_ADULTS_DASHBOARD: "Trang chủ",
  STUDENT_TESTS: "Bài tập",
  STUDENT_PRACTICE: "Luyện tập",
  STUDENT_TAKE_EXAM: "Làm bài thi",
  STUDENT_RESULT: "Kết quả",
  STUDENT_HISTORY: "Lịch sử làm bài",
  STUDENT_PROGRESS: "Tiến độ học tập",
  STUDENT_LEADERBOARD: "Bảng xếp hạng",
  STUDENT_REWARDS: "Phần thưởng",
  STUDENT_SCHEDULE: "Lịch học",
  STUDENT_PROFILE: "Hồ sơ",
  STUDENT_NOTIFICATIONS: "Thông báo",
  STUDENT_SETTINGS: "Cài đặt",
  STUDENT_WAITING: "Chờ xếp lớp",

  // ── Admin Portal ─────────────────────────────────────────────────────────
  ADMIN_DASHBOARD: "Tổng quan hệ thống",
  ADMIN_TEACHERS: "Quản lý giáo viên",
  ADMIN_STUDENTS: "Quản lý học viên",
  ADMIN_COURSES: "Quản lý khóa học",
  ADMIN_CONTENT: "Quản lý nội dung",
  ADMIN_REPORTS: "Báo cáo hệ thống",
  ADMIN_SYSTEM: "Hệ thống",
  ADMIN_NOTIFICATIONS: "Thông báo",
  ADMIN_SETTINGS: "Cài đặt hệ thống",
} as const;
