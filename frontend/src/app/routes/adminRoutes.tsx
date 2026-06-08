/**
 * adminRoutes — Tất cả route dành cho admin.
 * Base path: "/admin" — Layout: AdminLayout (sidebar dark slate).
 */
import AdminLayout from "../layouts/AdminLayout";
import { AdminDashboard } from "../features/admin/dashboard/AdminDashboard";
import { UnderConstruction } from "../components/shared/UnderConstruction";
import { AdminUsersPage } from "../features/admin/users/AdminUsersPage";
import { AdminPostsPage } from "../features/admin/content/AdminPostsPage";
import { AdminExamsPage } from "../features/admin/content/AdminExamsPage";
import { AdminStudentsReportPage } from "../features/admin/reports/AdminStudentsReportPage";
import { AdminTeachersPage } from "../features/admin/teachers/AdminTeachersPage";
import { AdminCoursesPage } from "../features/admin/courses/AdminCoursesPage";
import { AdminCategoriesPage } from "../features/admin/courses/AdminCategoriesPage";
import { AdminCourseCreatePage } from "../features/admin/courses/AdminCourseCreatePage";
import { AdminRevenueReportPage } from "../features/admin/reports/AdminRevenueReportPage";
import { AdminTeachersReportPage } from "../features/admin/reports/AdminTeachersReportPage";
import { AdminSystemLogsPage } from "../features/admin/system/AdminSystemLogsPage";
import { AdminServerHealthPage } from "../features/admin/system/AdminServerHealthPage";
import { AdminBackupPage } from "../features/admin/system/AdminBackupPage";
import { AdminNotificationsPage } from "../features/admin/notifications/AdminNotificationsPage";
import { AdminSettingsPage } from "../features/admin/settings/AdminSettingsPage";
import { AdminProfilePage } from "../features/admin/profile/AdminProfilePage";
import { Navigate } from "react-router";
import { AdminTeacherAssignmentsPage } from "../features/admin/teachers/AdminTeacherAssignmentsPage";
import { AdminStudentRegistrationsPage } from "../features/admin/students/AdminStudentRegistrationsPage";
import { AdminStudentComplaintsPage } from "../features/admin/students/AdminStudentComplaintsPage";
import { ProtectedRoute } from "../../components/auth";

function ProtectedAdminLayout() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout />
    </ProtectedRoute>
  );
}

export const adminRoutes = {
  path: "/admin",
  Component: ProtectedAdminLayout,
  children: [
    // Tổng quan
    { index: true, Component: AdminDashboard },

    // Giáo viên
    { path: "teachers", Component: AdminTeachersPage },
    { path: "teachers/new", Component: () => <Navigate to="/admin/teachers" replace /> },
    { path: "teachers/assignments", Component: AdminTeacherAssignmentsPage },

    // Học viên
    { path: "students", Component: AdminUsersPage },
    { path: "students/new-registrations", Component: AdminStudentRegistrationsPage },
    { path: "students/complaints", Component: AdminStudentComplaintsPage },

    // Khóa học
    { path: "courses", Component: AdminCoursesPage },
    { path: "courses/new", Component: AdminCourseCreatePage },
    { path: "courses/categories", Component: AdminCategoriesPage },

    // Nội dung
    { path: "content/posts", Component: AdminPostsPage },
    { path: "content/exams", Component: AdminExamsPage },

    // Báo cáo
    { path: "reports/revenue", Component: AdminRevenueReportPage },
    { path: "reports/students", Component: AdminStudentsReportPage },
    { path: "reports/teachers", Component: AdminTeachersReportPage },

    // Hệ thống
    { path: "system/activity-logs", Component: AdminSystemLogsPage },
    { path: "system/server-health", Component: AdminServerHealthPage },
    { path: "system/backups", Component: AdminBackupPage },

    // Thông báo & Cài đặt
    { path: "notifications", Component: AdminNotificationsPage },
    { path: "settings", Component: AdminSettingsPage },
    { path: "profile", Component: AdminProfilePage },

    // Legacy redirects (old URLs)
    { path: "giao-vien", Component: () => <Navigate to="/admin/teachers" replace /> },
    { path: "giao-vien/them-moi", Component: () => <Navigate to="/admin/teachers/new" replace /> },
    { path: "giao-vien/phan-cong", Component: () => <Navigate to="/admin/teachers/assignments" replace /> },
    { path: "students/dang-ky", Component: () => <Navigate to="/admin/students/new-registrations" replace /> },
    { path: "students/khieu-nai", Component: () => <Navigate to="/admin/students/complaints" replace /> },
    { path: "khoa-hoc", Component: () => <Navigate to="/admin/courses" replace /> },
    { path: "khoa-hoc/tao-moi", Component: () => <Navigate to="/admin/courses/new" replace /> },
    { path: "khoa-hoc/danh-muc", Component: () => <Navigate to="/admin/courses/categories" replace /> },
    { path: "noi-dung/bai-viet", Component: () => <Navigate to="/admin/content/posts" replace /> },
    { path: "noi-dung/de-thi", Component: () => <Navigate to="/admin/content/exams" replace /> },
    { path: "bao-cao/doanh-thu", Component: () => <Navigate to="/admin/reports/revenue" replace /> },
    { path: "bao-cao/students", Component: () => <Navigate to="/admin/reports/students" replace /> },
    { path: "bao-cao/giao-vien", Component: () => <Navigate to="/admin/reports/teachers" replace /> },
    { path: "he-thong/nhat-ky", Component: () => <Navigate to="/admin/system/activity-logs" replace /> },
    { path: "he-thong/server", Component: () => <Navigate to="/admin/system/server-health" replace /> },
    { path: "he-thong/backup", Component: () => <Navigate to="/admin/system/backups" replace /> },
    { path: "thong-bao", Component: () => <Navigate to="/admin/notifications" replace /> },
    { path: "cai-dat", Component: () => <Navigate to="/admin/settings" replace /> },

    // Catch-all
    { path: "*", Component: UnderConstruction },
  ],
};
