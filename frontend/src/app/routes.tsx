/**
 * routes.tsx — Entry point tổng hợp tất cả route của ứng dụng.
 *
 * Cấu trúc 3 role:
 *  - Teacher  → base path "/"         → TeacherLayout (sidebar #2563EB)
 *  - Student  → base path "/hoc-sinh" → StudentLayout (sidebar #8B5CF6)
 *  - Admin    → base path "/admin"    → AdminLayout   (sidebar #0F172A)
 *
 * Auth routes không có layout chung (login, register, v.v.)
 *
 * Để thêm route mới:
 *  - Giáo viên → chỉnh /routes/teacherRoutes.tsx
 *  - Học viên  → chỉnh /routes/studentRoutes.tsx
 *  - Admin     → chỉnh /routes/adminRoutes.tsx
 *  - Auth      → chỉnh /routes/authRoutes.tsx
 */
import { createBrowserRouter, Navigate } from "react-router";
import { authRoutes } from "./routes/authRoutes";
import { teacherRoutes } from "./routes/teacherRoutes";
import { studentRoutes } from "./routes/studentRoutes";
import { adminRoutes } from "./routes/adminRoutes";

export const router = createBrowserRouter([
  // ─── Redirect gốc "/" → teacher portal ───────────────────────────────────
  { path: "/", element: <Navigate to="/giao-vien" replace /> },

  // ─── Auth (no layout) ────────────────────────────────────────────────────
  ...authRoutes,

  // ─── Teacher Portal  ("/giao-vien") ──────────────────────────────────────
  teacherRoutes,

  // ─── Student Portal  ("/hoc-sinh") ───────────────────────────────────────
  studentRoutes,

  // ─── Admin Console   ("/admin") ──────────────────────────────────────────
  adminRoutes,
]);