/**
 * routes.tsx — Entry point tổng hợp tất cả route của ứng dụng.
 *
 * Cấu trúc 3 role:
 *  - Teacher  → base path "/giao-vien" → TeacherLayout (sidebar #2563EB)
 *  - Student  → base path "/"          → StudentLayout (sidebar #8B5CF6)
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
import { createBrowserRouter } from "react-router";
import { authRoutes } from "./routes/authRoutes";
import { teacherRoutes } from "./routes/teacherRoutes";
import { studentRoutes } from "./routes/studentRoutes";
import { adminRoutes } from "./routes/adminRoutes";

export const router = createBrowserRouter([
  // ─── Auth (no layout) ────────────────────────────────────────────────────
  ...authRoutes,

  // ─── Teacher Portal  ("/giao-vien") ──────────────────────────────────────
  teacherRoutes,

  // ─── Student Portal  ("/") ───────────────────────────────────────────────
  studentRoutes,

  // ─── Admin Console   ("/admin") ──────────────────────────────────────────
  adminRoutes,
]);