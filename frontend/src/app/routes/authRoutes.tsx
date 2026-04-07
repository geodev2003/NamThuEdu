/**
 * Authentication Routes
 * 
 * Organized by role:
 * - Student: /dang-nhap, /dang-ky
 * - Teacher: /giao-vien/dang-nhap
 * - Admin: /admin/login
 * - Public: / (landing page)
 */

// Student Auth
import { StudentLogin } from "../features/auth/student/StudentLogin";
import { StudentRegister } from "../features/auth/student/StudentRegister";
import { Navigate } from "react-router";
import { LandingPage } from "../features/public";
import { AuthLayout } from "../features/auth/shared/AuthLayout";

// Teacher Auth
import { TeacherLogin } from "../features/auth/teacher/TeacherLogin";

// Admin Auth
import AdminLogin from "../features/auth/admin/AdminLogin";

export const authRoutes = [
  // ========== PUBLIC ==========
  { path: "/", Component: LandingPage },

  {
    Component: AuthLayout,
    children: [
      // ========== STUDENT AUTH ==========
      { path: "/dang-nhap", Component: StudentLogin },
      // { path: "/dang-ky", Component: StudentRegister }, // DISABLED: Students cannot self-register

      // ========== TEACHER AUTH ==========
      { path: "/giao-vien/dang-nhap", Component: TeacherLogin },

      // ========== ADMIN AUTH ==========
      { path: "/admin/login", Component: AdminLogin },
      { path: "/admin/register", Component: () => <Navigate to="/admin/login" replace /> },
    ],
  },
];
