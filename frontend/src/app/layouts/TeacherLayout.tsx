import { Outlet, useLocation } from "react-router";
import { Sidebar } from "../components/shared/Sidebar";
import { Header } from "../components/shared/Header";
import { SidebarProvider, useSidebar } from "../../contexts/SidebarContext";
import {
  TeacherHeaderProvider,
  useTeacherHeaderContext,
} from "../../contexts/TeacherHeaderContext";

/**
 * Các khu vực "full-bleed" — trang tự dựng thanh header riêng (back + tiêu đề +
 * nút hành động) chiếm trọn chiều ngang. Những trang này KHÔNG dùng Header chung
 * để tránh 2 thanh header chồng nhau. Danh sách theo prefix path để khi thêm
 * editor mới (vd loại đề mới) cũng tự động đúng, không phải sửa từng file.
 */
const FULL_BLEED_PREFIXES = [
  "/giao-vien/de-thi", // Ngân hàng đề + toàn bộ editor/preview đề thi
  "/giao-vien/test-exam", // Trình thử đề
  "/giao-vien/cham-diem", // Hàng chờ chấm + chi tiết chấm (tự render Header riêng)
  "/giao-vien/xem-vstep", // Preview làm bài VSTEP
  "/giao-vien/xem-ielts", // Preview làm bài IELTS
  "/giao-vien/giam-sat-truc-tiep", // Giám sát trực tiếp (tự render Header riêng)
];

function isFullBleedPath(pathname: string): boolean {
  return FULL_BLEED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
  );
}

function TeacherLayoutContent() {
  const { isCollapsed, toggle } = useSidebar();
  const { config, hidden } = useTeacherHeaderContext();
  const { pathname } = useLocation();

  // Ẩn Header chung khi: trang chủ động yêu cầu ẩn (useHideTeacherHeader) HOẶC
  // đang ở khu vực full-bleed (theo route).
  const hideHeader = hidden || isFullBleedPath(pathname);

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header chung — hiện ở MỌI trang giáo viên (trừ trang full-bleed).
            Trang chưa khai báo breadcrumb vẫn có header với breadcrumb mặc định. */}
        {!hideHeader && (
          <Header
            breadcrumb={config?.breadcrumb ?? "Dashboard"}
            action={config?.action}
          />
        )}
        <Outlet />
      </div>
    </div>
  );
}

/**
 * TeacherLayout — Layout chính dành cho giáo viên.
 * Tái sử dụng Sidebar + Header chung, bọc Outlet bên phải.
 */
export function TeacherLayout() {
  return (
    <SidebarProvider>
      <TeacherHeaderProvider>
        <TeacherLayoutContent />
      </TeacherHeaderProvider>
    </SidebarProvider>
  );
}
