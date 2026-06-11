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
import { createBrowserRouter, Navigate } from "react-router";
import { getAuthToken, getAuthUser } from '../utils/authStorage';
import { authRoutes } from "./routes/authRoutes";
import { teacherRoutes } from "./routes/teacherRoutes";
import { studentLegacyRoutes, studentRoutes, kidsRoutes, teensRoutes, adultsRoutes } from "./routes/studentRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import { adminPreviewRoutes } from "./routes/adminPreviewRoutes";
import { MockTestPage } from "./features/test/MockTestPage";
import { PublicBlogList } from "./features/public/PublicBlogList";
import { PublicBlogDetail } from "./features/public/PublicBlogDetail";
import { PublicFeatures } from "./features/public/PublicFeatures";
import { AboutPage } from "./features/public/AboutPage";

function SmartRedirect() {
  try {
    const token = getAuthToken();
    if (token) {
      const user = getAuthUser();
      const role: string | null = (user?.role as string) || (user?.uRole as string) || null;
      if (role === 'teacher') return <Navigate to="/giao-vien" replace />;
      if (role === 'admin')   return <Navigate to="/admin"     replace />;
      if (role === 'student') return <Navigate to="/hoc-vien"  replace />;
    }
  } catch { /* ignore */ }
  return <Navigate to="/" replace />;
}

export const router = createBrowserRouter([
  // ─── Auth (no layout) ────────────────────────────────────────────────────
  ...authRoutes,

  // ─── Teacher Portal  ("/giao-vien") ──────────────────────────────────────
  teacherRoutes,

  // ─── Student Portal  ("/hoc-vien") ───────────────────────────────────────
  studentRoutes,
  
  // ─── Age-Specific Student Portals ───────────────────────────────────────
  kidsRoutes,    // "/hoc-vien/kids/*"   - Redirect → /hoc-vien (kids share namespace now)
  teensRoutes,   // "/hoc-vien/teens/*"  - Modern, trendy for 13-17 years  
  adultsRoutes,  // "/hoc-vien/adults/*" - Professional, minimal for 18+ years
  
  // ─── Legacy Student Routes ──────────────────────────────────────────────
  studentLegacyRoutes,

  // ─── Admin Exam Preview (full-screen, no sidebar) ────────────────────────
  adminPreviewRoutes,

  // ─── Admin Console   ("/admin") ──────────────────────────────────────────
  adminRoutes,

  // ─── Public Blog ("/bai-viet") ───────────────────────────────────────────
  { path: "/bai-viet",        element: <PublicBlogList /> },
  { path: "/bai-viet/:slug",  element: <PublicBlogDetail /> },

  // ─── Public Features ("/tinh-nang") ──────────────────────────────
  { path: "/tinh-nang",       element: <PublicFeatures /> },

  // ─── About ("/ve-chung-toi") ─────────────────────────────────────
  { path: "/ve-chung-toi",    element: <AboutPage /> },

  // ─── Test Pages (no auth required - DEVELOPMENT ONLY) ───────────────────
  {
    path: "/test-vstep-demo",
    element: <MockTestPage />,
  },

  // ─── Catch-all: unknown URL → smart redirect based on auth state ─────────
  { path: "*", element: <SmartRedirect /> },
]);
