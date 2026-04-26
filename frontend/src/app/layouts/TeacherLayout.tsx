import { Outlet } from "react-router";
import { Sidebar } from "../components/shared/Sidebar";
import { SidebarProvider, useSidebar } from "../../contexts/SidebarContext";

function TeacherLayoutContent() {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggle={toggle}
      />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

/**
 * TeacherLayout — Layout chính dành cho giáo viên.
 * Tái sử dụng Sidebar hiện có, bọc Outlet bên phải.
 */
export function TeacherLayout() {
  return (
    <SidebarProvider>
      <TeacherLayoutContent />
    </SidebarProvider>
  );
}
