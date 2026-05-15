import { Outlet } from "react-router";
import { Header } from "../../public/components/Header";

export function AuthLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <Header />
      <main className="flex flex-1 items-center justify-center overflow-hidden px-4">
        <Outlet />
      </main>
    </div>
  );
}
