import { Outlet } from "react-router";
import { StudentNavbar } from "../components/student/StudentNavbar";

export function StudentLayout() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, #FAF8FF 0%, #F5F3FF 40%, #F9FAFB 100%)",
      }}
    >
      <StudentNavbar />

      {/* Main content — extra bottom padding on mobile for bottom nav */}
      <main
        className="w-full px-4 md:px-6"
        style={{ paddingBottom: "80px" }}
      >
        <Outlet />
      </main>
    </div>
  );
}
