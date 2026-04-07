/**
 * routes.tsx — Entry point tổng hợp tất cả route của ứng dụng.
 *
 * Cấu trúc 3 role:
 *  - Teacher  → base path "/giao-vien" → TeacherLayout (sidebar #2563EB)
 *  - Student  → base path "/hoc-vien"  → StudentLayout (sidebar #8B5CF6)
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
import { studentLegacyRoutes, studentRoutes } from "./routes/studentRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import { MockTestPage } from "./features/test/MockTestPage";

export const router = createBrowserRouter([
  // ─── Auth (no layout) ────────────────────────────────────────────────────
  ...authRoutes,

  // ─── Teacher Portal  ("/giao-vien") ──────────────────────────────────────
  teacherRoutes,

  // ─── Student Portal  ("/") ───────────────────────────────────────────────
  studentRoutes,
  studentLegacyRoutes,

  // ─── Admin Console   ("/admin") ──────────────────────────────────────────
  adminRoutes,

  // ─── Mock Test Demo (no auth required) ──────────────────────────────────
  {
    path: "/test-vstep-demo",
    element: <MockTestPage />,
  },
]);
