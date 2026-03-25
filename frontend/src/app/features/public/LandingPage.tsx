/**
 * Landing Page Component
 * 
 * Professional landing page for guest users (unauthenticated)
 * Uses adults theme for professional appearance
 */

import React from 'react';
import { useNavigate } from 'react-router';
import { 
  Sparkles, 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp,
  CheckCircle2,
  Zap,
  Globe,
  Target,
  Star
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: 'Học tập cá nhân hóa',
      description: 'Giao diện thích ứng theo độ tuổi, tối ưu trải nghiệm học tập',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: Target,
      title: 'Luyện thi hiệu quả',
      description: 'Đề thi Cambridge, IELTS, VSTEP với chấm điểm tự động',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: TrendingUp,
      title: 'Theo dõi tiến độ',
      description: 'Phân tích chi tiết kết quả, xác định điểm mạnh yếu',
      color: 'from-pink-400 to-pink-600'
    },
    {
      icon: Users,
      title: 'Cộng đồng học tập',
      description: 'Kết nối với giáo viên và bạn học trên toàn quốc',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: Zap,
      title: 'Công nghệ AI',
      description: 'Gợi ý bài tập thông minh, tối ưu lộ trình học',
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      icon: Award,
      title: 'Chứng chỉ uy tín',
      description: 'Chuẩn bị tốt nhất cho các kỳ thi quốc tế',
      color: 'from-red-400 to-red-600'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Học sinh', icon: Users },
    { value: '1K+', label: 'Giáo viên', icon: Globe },
    { value: '100K+', label: 'Bài kiểm tra', icon: BookOpen },
    { value: '99%', label: 'Hài lòng', icon: Star }
  ];

  const testimonials = [
    {
      name: 'Nguyễn Minh Anh',
      role: 'Học sinh lớp 10',
      content: 'Giao diện dễ sử dụng, bài tập phong phú. Em đã cải thiện điểm số rất nhiều!',
      avatar: '👧',
      rating: 5
    },
    {
      name: 'Trần Văn Nam',
      role: 'Học sinh lớp 12',
      content: 'Đề thi IELTS rất sát với đề thật. Mình đã đạt 7.5 sau 3 tháng luyện tập.',
      avatar: '👨',
      rating: 5
    },
    {
      name: 'Lê Thị Hương',
      role: 'Giáo viên',
      content: 'Công cụ tuyệt vời để quản lý lớp học và theo dõi tiến độ học sinh.',
      avatar: '👩‍🏫',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">NamThu Education</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dang-nhap')}
              className="px-6 py-2 text-white hover:text-blue-300 transition-colors font-medium"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => navigate('/dang-ky')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-white font-medium">Nền tảng học tiếng Anh #1 Việt Nam</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Nền tảng học tiếng Anh
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Thông minh & Hiện đại
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Trải nghiệm học tập được cá nhân hóa theo độ tuổi với công nghệ AI tiên tiến.
            Chuẩn bị tốt nhất cho Cambridge, IELTS, VSTEP.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/dang-ky')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all text-lg flex items-center gap-2"
            >
              <span>Bắt đầu học ngay</span>
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/dang-nhap')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all text-lg"
            >
              Đăng nhập
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 pt-8">
            {[
              { icon: CheckCircle2, text: 'Miễn phí dùng thử' },
              { icon: Zap, text: 'Kết quả nhanh chóng' },
              { icon: Award, text: 'Chứng chỉ uy tín' }
            ].map((badge, index) => (
              <div key={index} className="flex items-center gap-2 text-blue-200">
                <badge.icon className="w-5 h-5 text-green-400" />
                <span className="font-medium">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="flex justify-center mb-3">
                <stat.icon className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-blue-200">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tính năng nổi bật
          </h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Công nghệ hiện đại giúp bạn học tiếng Anh hiệu quả hơn
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:scale-105 transition-all group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-blue-200 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Học viên nói gì về chúng tôi
          </h2>
          <p className="text-xl text-blue-200">
            Hơn 50,000 học sinh đã tin tưởng và đạt kết quả
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-blue-100 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-sm text-blue-300">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl border border-white/20 p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sẵn sàng bắt đầu hành trình học tập?
          </h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Đăng ký ngay hôm nay để trải nghiệm nền tảng học tiếng Anh hiện đại nhất
          </p>
          <button
            onClick={() => navigate('/dang-ky')}
            className="px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all text-lg inline-flex items-center gap-3"
          >
            <span>Đăng ký miễn phí</span>
            <Sparkles className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">NamThu Education</span>
              </div>
              <p className="text-blue-200 text-sm">
                Nền tảng học tiếng Anh thông minh, hiện đại và hiệu quả
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Học sinh</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Giáo viên</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trường học</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Pháp lý</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-blue-200 text-sm">
            <p>&copy; 2026 NamThu Education. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
