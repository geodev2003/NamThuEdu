import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router";

export function AuthFooter() {
  return (
    <footer className="border-t border-orange-100 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-600 md:flex-row">
          <p className="text-center md:text-left">© NamThu Education. Đồng hành cùng bạn trên hành trình học tiếng Anh.</p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="tel:0776818160" className="inline-flex items-center gap-1.5 hover:text-orange-600">
              <Phone className="h-4 w-4" />
              0776 818 160
            </a>
            <a href="mailto:hello@namthu.vn" className="inline-flex items-center gap-1.5 hover:text-orange-600">
              <Mail className="h-4 w-4" />
              hello@namthu.vn
            </a>
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-orange-600">
              <MapPin className="h-4 w-4" />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
