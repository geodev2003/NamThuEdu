import { Outlet } from "react-router";
import { Header } from "../../public/components/Header";
import { Footer } from "../../public/components/Footer";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-amber-50">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-8 md:py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
