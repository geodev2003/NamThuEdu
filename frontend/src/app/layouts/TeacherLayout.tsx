import { Outlet } from "react-router";
import { Sidebar } from "../components/shared/Sidebar";

/**
 * TeacherLayout — Layout chính dành cho giáo viên.
 * Tái sử dụng Sidebar hiện có, bọc Outlet bên phải.
 */
export function TeacherLayout() {
  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
