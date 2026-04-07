// THEME: Orange & White - Modern Educational Design
/**
 * Footer Component - Redesigned with complete information
 * Based on NamThu Education banner and header
 */

import { GraduationCap, Phone, Mail, MapPin, Clock, Facebook, Youtube, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Description */}
          <div className="lg:pr-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">NamThuEdu</span>
                <span className="text-[10px] leading-none text-gray-400">
                  Học thông minh hơn
                </span>
              </div>
            </div>
            
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-400">
              Trung tâm tiếng Anh uy tín tại Cần Thơ. Phát triển kỹ năng tiếng Anh toàn diện cho học sinh từ lớp 1-12 và luyện thi quốc tế.
            </p>

            {/* Social Proof */}
            <div className="mb-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-white">4.8/5</span>
              </div>
              <span className="text-gray-600">|</span>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-orange-400" />
                <span>1 triệu+ học viên</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-md transition-all hover:from-orange-600 hover:to-orange-700"
              >
                <Facebook className="h-4 w-4 text-white" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-md transition-all hover:from-orange-600 hover:to-orange-700"
              >
                <Youtube className="h-4 w-4 text-white" />
              </a>
              <a
                href="mailto:hello@namthu.vn"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-md transition-all hover:from-orange-600 hover:to-orange-700"
              >
                <Mail className="h-4 w-4 text-white" />
              </a>
            </div>
          </div>

          {/* Column 2: Courses */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-white">Khóa học</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#giao-tiep" className="cursor-pointer text-gray-400 transition-colors hover:text-orange-400">
                  Tiếng Anh giao tiếp
                </a>
              </li>
              <li>
                <a href="#hoc-sinh" className="cursor-pointer text-gray-400 transition-colors hover:text-orange-400">
                  Tiếng Anh học sinh (Lớp 1-12)
                </a>
              </li>
              <li>
                <a href="#cambridge" className="cursor-pointer text-gray-400 transition-colors hover:text-orange-400">
                  Luyện thi Cambridge (Starters, Movers, Flyers)
                </a>
              </li>
              <li>
                <a href="#ket-pet" className="cursor-pointer text-gray-400 transition-colors hover:text-orange-400">
                  Luyện thi KET, PET
                </a>
              </li>
              <li>
                <a href="#ielts" className="cursor-pointer text-gray-400 transition-colors hover:text-orange-400">
                  Luyện thi IELTS
                </a>
              </li>
              <li>
                <a href="#vstep" className="cursor-pointer text-gray-400 transition-colors hover:text-orange-400">
                  Luyện thi VSTEP, V-SAT (ĐHCT)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-white">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:0776818160"
                  className="flex cursor-pointer items-start gap-2 text-gray-400 transition-colors hover:text-orange-400"
                >
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Hotline</div>
                    <div>0776 818 160</div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@namthu.vn"
                  className="flex cursor-pointer items-start gap-2 text-gray-400 transition-colors hover:text-orange-400"
                >
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Email</div>
                    <div>hello@namthu.vn</div>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-gray-400">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Địa chỉ</div>
                    <div>Hẻm 387K1, 14B, Trần Nam Phú, Cần Thơ</div>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-2 text-gray-400">
                  <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Lịch học</div>
                    <div>Tối thứ 2 - thứ 7, Chủ nhật</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Promotions */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-white">Hỗ trợ & Ưu đãi</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('/dang-ky')}
                  className="cursor-pointer text-gray-400 transition-colors hover:text-orange-400"
                >
                  Đăng ký học
                </button>
              </li>
              <li>
                <a href="#tu-van" className="cursor-pointer text-gray-400 transition-colors hover:text-orange-400">
                  Tư vấn khóa học
                </a>
              </li>
              <li>
                <a href="#faq" className="cursor-pointer text-gray-400 transition-colors hover:text-orange-400">
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>

            {/* Promotions Box */}
            <div className="mt-6 rounded-lg border border-orange-500/20 bg-orange-500/10 p-4">
              <div className="mb-2 text-xs font-bold text-orange-400">🎁 Ưu đãi hấp dẫn</div>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li>• Nhóm đăng ký từ 3 học viên</li>
                <li>• Học viên khó khăn</li>
                <li>• Miễn phí tài liệu</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">
            <div className="text-center md:text-left">
              © {new Date().getFullYear()} NamThu Education. Đồng hành cùng bạn trên hành trình học tiếng Anh.
            </div>

            <div className="flex items-center gap-6">
              <a href="#privacy" className="cursor-pointer transition-colors hover:text-orange-400">
                Chính sách bảo mật
              </a>
              <a href="#terms" className="cursor-pointer transition-colors hover:text-orange-400">
                Điều khoản sử dụng
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
