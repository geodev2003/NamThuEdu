/**
 * adminRoutes — Tất cả route dành cho admin.
 * Base path: "/admin" — Layout: AdminLayout (sidebar dark slate).
 * Tất cả page đều lazy-loaded để Suspense fallback (AdminPageSkeleton)
 * trong AdminLayout hiển thị khung skeleton khi chuyển trang.
 */
import { lazy } from "react";
import { Navigate } from "react-router";
import AdminLayout from "../layouts/AdminLayout";
import { ProtectedRoute } from "../../components/auth";
import { UnderConstruction } from "../components/shared/UnderConstruction";

// ─── Lazy admin pages ────────────────────────────────────────────────────────
const AdminDashboard               = lazy(() => import("../features/admin/dashboard/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminUsersPage               = lazy(() => import("../features/admin/users/AdminUsersPage").then(m => ({ default: m.AdminUsersPage })));
const AdminPostsPage               = lazy(() => import("../features/admin/content/AdminPostsPage").then(m => ({ default: m.AdminPostsPage })));
const AdminExamsPage               = lazy(() => import("../features/admin/content/AdminExamsPage").then(m => ({ default: m.AdminExamsPage })));
const AdminStudentsReportPage      = lazy(() => import("../features/admin/reports/AdminStudentsReportPage").then(m => ({ default: m.AdminStudentsReportPage })));
const AdminTeachersPage            = lazy(() => import("../features/admin/teachers/AdminTeachersPage").then(m => ({ default: m.AdminTeachersPage })));
const AdminCoursesPage             = lazy(() => import("../features/admin/courses/AdminCoursesPage").then(m => ({ default: m.AdminCoursesPage })));
const AdminCategoriesPage          = lazy(() => import("../features/admin/courses/AdminCategoriesPage").then(m => ({ default: m.AdminCategoriesPage })));
const AdminCourseCreatePage        = lazy(() => import("../features/admin/courses/AdminCourseCreatePage").then(m => ({ default: m.AdminCourseCreatePage })));
const AdminRevenueReportPage       = lazy(() => import("../features/admin/reports/AdminRevenueReportPage").then(m => ({ default: m.AdminRevenueReportPage })));
const AdminTeachersReportPage      = lazy(() => import("../features/admin/reports/AdminTeachersReportPage").then(m => ({ default: m.AdminTeachersReportPage })));
const AdminSystemLogsPage          = lazy(() => import("../features/admin/system/AdminSystemLogsPage").then(m => ({ default: m.AdminSystemLogsPage })));
const AdminAuditLogPage            = lazy(() => import("../features/admin/system/AdminAuditLogPage").then(m => ({ default: m.AdminAuditLogPage })));
const AdminServerHealthPage        = lazy(() => import("../features/admin/system/AdminServerHealthPage").then(m => ({ default: m.AdminServerHealthPage })));
const AdminBackupPage              = lazy(() => import("../features/admin/system/AdminBackupPage").then(m => ({ default: m.AdminBackupPage })));
const AdminNotificationsPage       = lazy(() => import("../features/admin/notifications/AdminNotificationsPage").then(m => ({ default: m.AdminNotificationsPage })));
const AdminSettingsPage            = lazy(() => import("../features/admin/settings/AdminSettingsPage").then(m => ({ default: m.AdminSettingsPage })));
const AdminProfilePage             = lazy(() => import("../features/admin/profile/AdminProfilePage").then(m => ({ default: m.AdminProfilePage })));
const AdminTeacherAssignmentsPage  = lazy(() => import("../features/admin/teachers/AdminTeacherAssignmentsPage").then(m => ({ default: m.AdminTeacherAssignmentsPage })));
const AdminStudentRegistrationsPage = lazy(() => import("../features/admin/students/AdminStudentRegistrationsPage").then(m => ({ default: m.AdminStudentRegistrationsPage })));
const AdminStudentComplaintsPage   = lazy(() => import("../features/admin/students/AdminStudentComplaintsPage").then(m => ({ default: m.AdminStudentComplaintsPage })));

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
    { path: "system/audit-logs", Component: AdminAuditLogPage },
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
