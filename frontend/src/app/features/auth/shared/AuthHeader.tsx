import { GraduationCap, Phone } from "lucide-react";
import { Link } from "react-router";

export function AuthHeader() {
  return (
    <header className="border-b border-orange-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-400 text-white shadow-md">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div>
            <p className="text-base font-bold text-slate-900">NamThu Education</p>
            <p className="text-xs text-slate-500">English Center</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <a
            href="tel:0776818160"
            className="hidden items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 sm:flex"
          >
            <Phone className="h-4 w-4" />
            0776 818 160
          </a>
          <Link
            to="/dang-ky"
            className="rounded-xl bg-gradient-to-r from-orange-400 to-amber-400 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-orange-500 hover:to-amber-500"
          >
            Đăng ký tư vấn
          </Link>
        </div>
      </div>
    </header>
  );
}
