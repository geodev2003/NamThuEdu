/**
 * studentRoutes — Tất cả route dành cho học viên.
 * Base path: "/hoc-sinh" — Layout: StudentLayout (sidebar tím).
 */
import { StudentLayout } from "../layouts/StudentLayout";
import { StudentDashboard } from "../features/student/dashboard/StudentDashboard";
import { UnderConstruction } from "../components/shared/UnderConstruction";

export const studentRoutes = {
  path: "/hoc-sinh",
  Component: StudentLayout,
  children: [
    // Tổng quan
    { index: true, Component: StudentDashboard },

    // Bài tập
    { path: "bai-tap", Component: UnderConstruction },
    { path: "bai-tap/da-nop", Component: UnderConstruction },
    { path: "bai-tap/da-cham", Component: UnderConstruction },

    // Luyện tập
    { path: "luyen-tap/chu-de", Component: UnderConstruction },
    { path: "luyen-tap/ngau-nhien", Component: UnderConstruction },
    { path: "luyen-tap/mau-de", Component: UnderConstruction },

    // Kết quả
    { path: "ket-qua", Component: UnderConstruction },
    { path: "ket-qua/xep-hang", Component: UnderConstruction },

    // Bài viết
    { path: "bai-viet", Component: UnderConstruction },

    // Thông báo
    { path: "thong-bao", Component: UnderConstruction },

    // Hồ sơ
    { path: "ho-so", Component: UnderConstruction },

    // Catch-all
    { path: "*", Component: UnderConstruction },
  ],
};
