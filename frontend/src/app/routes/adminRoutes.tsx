/**
 * adminRoutes — Tất cả route dành cho admin.
 * Base path: "/admin" — Layout: AdminLayout (sidebar dark slate).
 */
import { AdminLayout } from "../layouts/AdminLayout";
import { AdminDashboard } from "../features/admin/dashboard/AdminDashboard";
import { UnderConstruction } from "../components/shared/UnderConstruction";

export const adminRoutes = {
  path: "/admin",
  Component: AdminLayout,
  children: [
    // Tổng quan
    { index: true, Component: AdminDashboard },

    // Giáo viên
    { path: "giao-vien", Component: UnderConstruction },
    { path: "giao-vien/them-moi", Component: UnderConstruction },
    { path: "giao-vien/phan-cong", Component: UnderConstruction },

    // Học viên
    { path: "hoc-vien", Component: UnderConstruction },
    { path: "hoc-vien/dang-ky", Component: UnderConstruction },
    { path: "hoc-vien/khieu-nai", Component: UnderConstruction },

    // Khóa học
    { path: "khoa-hoc", Component: UnderConstruction },
    { path: "khoa-hoc/tao-moi", Component: UnderConstruction },
    { path: "khoa-hoc/danh-muc", Component: UnderConstruction },

    // Nội dung
    { path: "noi-dung/bai-viet", Component: UnderConstruction },
    { path: "noi-dung/de-thi", Component: UnderConstruction },

    // Báo cáo
    { path: "bao-cao/doanh-thu", Component: UnderConstruction },
    { path: "bao-cao/hoc-vien", Component: UnderConstruction },
    { path: "bao-cao/giao-vien", Component: UnderConstruction },

    // Hệ thống
    { path: "he-thong/nhat-ky", Component: UnderConstruction },
    { path: "he-thong/server", Component: UnderConstruction },
    { path: "he-thong/backup", Component: UnderConstruction },

    // Thông báo & Cài đặt
    { path: "thong-bao", Component: UnderConstruction },
    { path: "cai-dat", Component: UnderConstruction },

    // Catch-all
    { path: "*", Component: UnderConstruction },
  ],
};
