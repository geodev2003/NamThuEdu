import { Outlet } from "react-router";
import { StudentNavbar } from "../components/student/StudentNavbar";
import { usePushNotification } from "../../hooks/usePushNotification";
import { NotificationPermissionBanner } from "../../components/NotificationPermissionBanner";

export function StudentLayout() {
  const push = usePushNotification();

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, #FAF8FF 0%, #F5F3FF 40%, #F9FAFB 100%)",
      }}
    >
      <NotificationPermissionBanner push={push} />
      <StudentNavbar />

      {/* Main content — extra bottom padding on mobile for bottom nav */}
      <main
        className="w-full"
        style={{ paddingBottom: "80px" }}
      >
        <div className="px-4 sm:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
