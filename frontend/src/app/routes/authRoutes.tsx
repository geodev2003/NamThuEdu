/**
 * authRoutes — Các route xác thực (không có layout chung).
 * Bao gồm login cho từng role: teacher, student, admin.
 */
import { Login } from "../features/auth/Login";
import { Register } from "../features/auth/Register";
import { ForgotPassword } from "../features/auth/ForgotPassword";
import { TeacherLogin } from "../features/auth/TeacherLogin";

export const authRoutes = [
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  { path: "/forgot-password", Component: ForgotPassword },

  // Teacher portal
  { path: "/giao-vien/dang-nhap", Component: TeacherLogin },

  // Student portal — dùng lại TeacherLogin tạm, thay khi có StudentLogin
  { path: "/hoc-sinh/login", Component: Login },

  // Admin portal
  { path: "/admin/login", Component: Login },
];