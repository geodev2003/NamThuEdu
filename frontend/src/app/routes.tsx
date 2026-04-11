/**
 * routes.tsx — Entry point tổng hợp tất cả route của ứng dụng.
 *
 * Cấu trúc 3 role:
 *  - Teacher  → base path "/giao-vien" → TeacherLayout (sidebar #2563EB)
 *  - Student  → base path "/hoc-vien"  → StudentLayout (sidebar #8B5CF6)
 *    - Kids   → "/hoc-vien/kids"      → KidsLayout (colorful, emoji-rich)
 *    - Teens  → "/hoc-vien/teens"     → TeensLayout (modern, trendy)
 *    - Adults → "/hoc-vien/adults"    → AdultsLayout (professional, minimal)
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
import { studentLegacyRoutes, studentRoutes, kidsRoutes, teensRoutes, adultsRoutes } from "./routes/studentRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import { MockTestPage } from "./features/test/MockTestPage";

export const router = createBrowserRouter([
  // ─── Auth (no layout) ────────────────────────────────────────────────────
  ...authRoutes,

  // ─── Teacher Portal  ("/giao-vien") ──────────────────────────────────────
  teacherRoutes,

  // ─── Student Portal  ("/hoc-vien") ───────────────────────────────────────
  studentRoutes,
  
  // ─── Age-Specific Student Portals ───────────────────────────────────────
  kidsRoutes,    // "/hoc-vien/kids/*"   - Colorful, emoji-rich for 6-12 years
  teensRoutes,   // "/hoc-vien/teens/*"  - Modern, trendy for 13-17 years  
  adultsRoutes,  // "/hoc-vien/adults/*" - Professional, minimal for 18+ years
  
  // ─── Legacy Student Routes ──────────────────────────────────────────────
  studentLegacyRoutes,

  // ─── Admin Console   ("/admin") ──────────────────────────────────────────
  adminRoutes,

  // ─── Test Pages (no auth required - DEVELOPMENT ONLY) ───────────────────
  {
    path: "/test-vstep-demo",
    element: <MockTestPage />,
  },
]);
