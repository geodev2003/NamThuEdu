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

// Teacher Auth
import { TeacherLogin } from "../features/auth/teacher/TeacherLogin";

// Shared Auth
import { ForgotPassword } from "../features/auth/shared/ForgotPassword";

// Public Pages
import { LandingPage } from "../features/public/LandingPage";

// Legacy (for backward compatibility)
import { Login } from "../features/auth/Login";
import { Register } from "../features/auth/Register";

export const authRoutes = [
  // ========== PUBLIC ==========
  { path: "/", Component: LandingPage },
  
  // ========== STUDENT AUTH ==========
  { path: "/dang-nhap", Component: StudentLogin },
  { path: "/dang-ky", Component: StudentRegister },
  
  // ========== TEACHER AUTH ==========
  { path: "/giao-vien/dang-nhap", Component: TeacherLogin },
  
  // ========== ADMIN AUTH ==========
  { path: "/admin/login", Component: Login },
  
  // ========== SHARED ==========
  { path: "/forgot-password", Component: ForgotPassword },
  { path: "/quen-mat-khau", Component: ForgotPassword },
  
  // ========== LEGACY (Backward Compatibility) ==========
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
];
