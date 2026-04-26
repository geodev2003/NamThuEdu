import { useState } from "react";
import { useNavigate } from "react-router";
import { GraduationCap, Phone, Mail, Star, Menu, X, ChevronDown } from "lucide-react";

export function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);

  return (
    <>
      {/* Top Bar - Contact & Social Proof */}
      <div className="border-b bg-orange-50">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs text-slate-600">
          {/* Left: Contact */}
          <div className="hidden items-center gap-4 md:flex">
            <a
              href="tel:0776818160"
              className="flex items-center gap-1 transition-colors hover:text-orange-600"
            >
              <Phone className="h-3 w-3" />
              <span>0776 818 160</span>
            </a>
            <a
              href="mailto:hello@namthu.vn"
              className="flex items-center gap-1 transition-colors hover:text-orange-600"
            >
              <Mail className="h-3 w-3" />
              <span>hello@namthu.vn</span>
            </a>
          </div>

          {/* Right: Social Proof */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold">4.8/5</span>
            </div>
            <span className="text-slate-400">|</span>
            <span>1 triệu+ học viên</span>
          </div>
        </div>
      </div>

      {/* Main Header - Sticky */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Left: Logo + Brand */}
          <button
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-orange-600">NamThuEdu</span>
              <span className="hidden text-[10px] leading-none text-slate-500 sm:block">
                Học thông minh hơn
              </span>
            </div>
          </button>

          {/* Center: Navigation (Desktop only) */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 lg:flex">
            {/* Courses Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCoursesDropdownOpen(true)}
              onMouseLeave={() => setCoursesDropdownOpen(false)}
            >
              <a
                href="#courses"
                className="flex cursor-pointer items-center gap-1 transition-all duration-200 hover:text-orange-600"
              >
                Khóa học
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${coursesDropdownOpen ? 'rotate-180' : ''}`} />
              </a>

              {/* Dropdown Menu */}
              {coursesDropdownOpen && (
                <div className="absolute left-0 top-full pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="w-56 rounded-lg bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
                    <div className="py-2">
                      <a
                        href="#vstep"
                        className="block px-4 py-2.5 text-sm text-slate-700 transition-all duration-200 hover:bg-orange-50 hover:text-orange-600 hover:pl-5"
                      >
                        <div className="font-semibold">VSTEP</div>
                        <div className="text-xs text-slate-500">Chứng chỉ tiếng Anh quốc gia</div>
                      </a>
                      <a
                        href="#ielts"
                        className="block px-4 py-2.5 text-sm text-slate-700 transition-all duration-200 hover:bg-orange-50 hover:text-orange-600 hover:pl-5"
                      >
                        <div className="font-semibold">IELTS</div>
                        <div className="text-xs text-slate-500">Chứng chỉ tiếng Anh quốc tế</div>
                      </a>
                      <a
                        href="#kids"
                        className="block px-4 py-2.5 text-sm text-slate-700 transition-all duration-200 hover:bg-orange-50 hover:text-orange-600 hover:pl-5"
                      >
                        <div className="font-semibold">Tiếng Anh cho thiếu niên</div>
                        <div className="text-xs text-slate-500">Dành cho học sinh 6-15 tuổi</div>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a
              href="#features"
              className="cursor-pointer transition-all duration-200 hover:text-orange-600"
            >
              Tính năng
            </a>
            <a
              href="#blog"
              className="cursor-pointer transition-all duration-200 hover:text-orange-600"
            >
              Bài viết
            </a>
            <a
              href="#pricing"
              className="cursor-pointer transition-all duration-200 hover:text-orange-600"
            >
              Học phí
            </a>
            <a
              href="#about"
              className="cursor-pointer transition-all duration-200 hover:text-orange-600"
            >
              Về chúng tôi
            </a>
          </nav>

          {/* Right: CTA Buttons */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </button>

            {/* Desktop CTA */}
            <button
              onClick={() => navigate("/dang-nhap")}
              className="cursor-pointer rounded-xl border border-orange-200 px-5 py-2 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <span className="text-lg font-bold text-orange-600">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col space-y-2 p-4">
              {/* Courses with Submenu */}
              <div>
                <button
                  onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-lg p-3 font-medium transition-all duration-200 hover:bg-orange-50"
                >
                  <span>Khóa học</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${mobileCoursesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Submenu */}
                {mobileCoursesOpen && (
                  <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    <a
                      href="#vstep"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block cursor-pointer rounded-lg p-2.5 text-sm transition-all duration-200 hover:bg-orange-50 hover:pl-4"
                    >
                      <div className="font-semibold text-slate-700">VSTEP</div>
                      <div className="text-xs text-slate-500">Chứng chỉ tiếng Anh quốc gia</div>
                    </a>
                    <a
                      href="#ielts"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block cursor-pointer rounded-lg p-2.5 text-sm transition-all duration-200 hover:bg-orange-50 hover:pl-4"
                    >
                      <div className="font-semibold text-slate-700">IELTS</div>
                      <div className="text-xs text-slate-500">Chứng chỉ tiếng Anh quốc tế</div>
                    </a>
                    <a
                      href="#kids"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block cursor-pointer rounded-lg p-2.5 text-sm transition-all duration-200 hover:bg-orange-50 hover:pl-4"
                    >
                      <div className="font-semibold text-slate-700">Tiếng Anh cho thiếu niên</div>
                      <div className="text-xs text-slate-500">Dành cho học sinh 6-15 tuổi</div>
                    </a>
                  </div>
                )}
              </div>

              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer rounded-lg p-3 font-medium transition-all duration-200 hover:bg-orange-50"
              >
                Tính năng
              </a>
              <a
                href="#blog"
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer rounded-lg p-3 font-medium transition-all duration-200 hover:bg-orange-50"
              >
                Bài viết
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer rounded-lg p-3 font-medium transition-all duration-200 hover:bg-orange-50"
              >
                Học phí
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer rounded-lg p-3 font-medium transition-all duration-200 hover:bg-orange-50"
              >
                Về chúng tôi
              </a>

              {/* Divider */}
              <div className="my-4 border-t" />

              {/* Secondary Links */}
              <a
                href="#help"
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer rounded-lg p-3 text-sm text-slate-600 transition-colors hover:bg-gray-50"
              >
                Trợ giúp
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer rounded-lg p-3 text-sm text-slate-600 transition-colors hover:bg-gray-50"
              >
                Liên hệ
              </a>

              {/* Contact Info (Mobile) */}
              <div className="my-4 border-t" />
              <a
                href="tel:0776818160"
                className="flex cursor-pointer items-center gap-2 rounded-lg p-3 text-sm text-slate-600 transition-colors hover:bg-gray-50"
              >
                <Phone className="h-4 w-4" />
                <span>0776 818 160</span>
              </a>
              <a
                href="mailto:hello@namthu.vn"
                className="flex cursor-pointer items-center gap-2 rounded-lg p-3 text-sm text-slate-600 transition-colors hover:bg-gray-50"
              >
                <Mail className="h-4 w-4" />
                <span>hello@namthu.vn</span>
              </a>
            </nav>

            {/* CTAs */}
            <div className="absolute bottom-0 left-0 right-0 space-y-3 border-t bg-white p-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/dang-nhap");
                }}
                className="w-full cursor-pointer rounded-xl border border-orange-200 py-3 font-semibold text-orange-600 transition-colors hover:bg-orange-50"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/dang-ky");
                }}
                className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3 font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
