/**
 * Landing Page - English Learning Platform
 * 
 * Homepage for NamThuEdu - English learning platform
 * Age-based learning paths: Kids (6-12), Teens (13-17), Adults (18+)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { usePageTitle, PAGE_TITLES } from '../../../hooks/usePageTitle';
import { 
  Search,
  BookOpen,
  Users,
  Trophy,
  ChevronRight,
  Star,
  Target,
  Award,
  Zap,
  CheckCircle,
  ArrowRight,
  Globe,
  Headphones,
  MessageCircle,
  Video,
  Sparkles,
  GraduationCap
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  usePageTitle(PAGE_TITLES.LANDING);
  const [searchQuery, setSearchQuery] = useState('');

  // Age-based learning paths for English
  const learningPaths = [
    {
      id: 'kids',
      name: 'Trẻ em (6-12 tuổi)',
      description: 'Học tiếng Anh qua trò chơi, hình ảnh sinh động và bài hát vui nhộn',
      color: 'from-pink-400 via-purple-400 to-indigo-400',
      icon: '🎨',
      features: ['Trò chơi tương tác', 'Hình ảnh sinh động', 'Bài hát vui nhộn', 'Phát âm chuẩn'],
      courses: 24,
      bgColor: 'bg-gradient-to-br from-pink-50 to-purple-50',
      textColor: 'text-pink-700',
      borderColor: 'border-pink-200'
    },
    {
      id: 'teens',
      name: 'Thiếu niên (13-17 tuổi)',
      description: 'Luyện thi Cambridge, giao tiếp thực tế và học qua video hiện đại',
      color: 'from-blue-400 via-cyan-400 to-teal-400',
      icon: '🎮',
      features: ['Cambridge YLE/KET/PET', 'Video lessons', 'Speaking practice', 'Gamification'],
      courses: 36,
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    {
      id: 'adults',
      name: 'Người lớn (18+ tuổi)',
      description: 'IELTS, TOEIC, VSTEP và tiếng Anh giao tiếp công sở chuyên nghiệp',
      color: 'from-indigo-400 via-purple-400 to-pink-400',
      icon: '💼',
      features: ['IELTS/TOEIC/VSTEP', 'Business English', 'Interview skills', 'Professional'],
      courses: 48,
      bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50',
      textColor: 'text-indigo-700',
      borderColor: 'border-indigo-200'
    },
  ];

  // English proficiency levels
  const proficiencyLevels = [
    { 
      name: 'Beginner', 
      nameVi: 'Sơ cấp',
      icon: '🌱', 
      courses: 12, 
      color: 'bg-green-100 text-green-700',
      description: 'A1-A2: Bắt đầu với nền tảng'
    },
    { 
      name: 'Intermediate', 
      nameVi: 'Trung cấp',
      icon: '🌿', 
      courses: 18, 
      color: 'bg-blue-100 text-blue-700',
      description: 'B1-B2: Giao tiếp tự tin'
    },
    { 
      name: 'Advanced', 
      nameVi: 'Cao cấp',
      icon: '🌳', 
      courses: 15, 
      color: 'bg-purple-100 text-purple-700',
      description: 'C1-C2: Thành thạo như người bản xứ'
    },
    { 
      name: 'Exam Prep', 
      nameVi: 'Luyện thi',
      icon: '🎯', 
      courses: 24, 
      color: 'bg-orange-100 text-orange-700',
      description: 'IELTS, TOEIC, Cambridge, VSTEP'
    },
  ];

  const features = [
    {
      icon: Globe,
      title: 'Học tập thích ứng',
      description: 'Giao diện và nội dung tự động điều chỉnh theo độ tuổi',
      color: 'text-blue-600'
    },
    {
      icon: Headphones,
      title: 'Luyện nghe - nói',
      description: 'AI đánh giá phát âm và giao tiếp thực tế',
      color: 'text-purple-600'
    },
    {
      icon: Trophy,
      title: 'Thi đấu & Xếp hạng',
      description: 'Cạnh tranh với bạn bè, nhận huy chương',
      color: 'text-yellow-600'
    },
    {
      icon: Video,
      title: 'Video bài giảng',
      description: 'Học qua video tương tác với giáo viên bản xứ',
      color: 'text-red-600'
    },
  ];

  const stats = [
    { label: 'Học viên', value: '50,000+', icon: Users },
    { label: 'Giáo viên', value: '500+', icon: GraduationCap },
    { label: 'Bài học', value: '10,000+', icon: BookOpen },
    { label: 'Hài lòng', value: '98%', icon: Star },
  ];

  const examPrep = [
    { name: 'IELTS', icon: '🎓', students: '15,000+', color: 'from-red-400 to-pink-400' },
    { name: 'TOEIC', icon: '📊', students: '12,000+', color: 'from-blue-400 to-cyan-400' },
    { name: 'Cambridge', icon: '🏆', students: '8,000+', color: 'from-green-400 to-emerald-400' },
    { name: 'VSTEP', icon: '🎯', students: '5,000+', color: 'from-purple-400 to-pink-400' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Glassmorphism Style */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  NamThu English
                </h1>
                <p className="text-xs text-gray-500">Học tiếng Anh thông minh</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dang-nhap')}
                className="px-5 py-2.5 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 text-sm font-medium cursor-pointer"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigate('/dang-ky')}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 rounded-xl transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg cursor-pointer"
              >
                Học thử miễn phí
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm khóa học, bài học, từ vựng, ngữ pháp..."
                  className="w-full pl-12 pr-32 py-3.5 bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 focus:border-indigo-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md cursor-pointer"
                >
                  Tìm kiếm
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-40"></div>

      {/* Banner - Modern Style */}
      <section className="container mx-auto px-4 mb-8">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <span className="font-bold text-xl">HỌC TIẾNG ANH THÔNG MINH</span>
            </div>
            <div className="flex items-center gap-8 text-sm font-medium">
              <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-200">
                <CheckCircle className="w-5 h-5" />
                <span>Giao diện thích ứng theo độ tuổi</span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-200">
                <CheckCircle className="w-5 h-5" />
                <span>AI đánh giá phát âm & giao tiếp</span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-200">
                <CheckCircle className="w-5 h-5" />
                <span>Luyện thi IELTS, TOEIC, Cambridge</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Learning Paths by Age */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Chọn lộ trình học phù hợp với bạn
            </h2>
            <p className="text-gray-600 text-lg">
              Giao diện và nội dung tự động thích ứng theo độ tuổi và trình độ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <button
                key={path.id}
                onClick={() => navigate('/dang-ky')}
                className={`group ${path.bgColor} rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 border-2 ${path.borderColor} text-left cursor-pointer hover:-translate-y-2`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${path.color} flex items-center justify-center text-4xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    {path.icon}
                  </div>
                  <ChevronRight className={`w-6 h-6 ${path.textColor} group-hover:translate-x-1 transition-all duration-300`} />
                </div>
                
                <h3 className={`text-2xl font-bold ${path.textColor} mb-3`}>
                  {path.name}
                </h3>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {path.description}
                </p>

                <div className="space-y-2 mb-6">
                  {path.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className={`w-4 h-4 ${path.textColor}`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <BookOpen className={`w-5 h-5 ${path.textColor}`} />
                    <span className={`font-bold ${path.textColor}`}>{path.courses} khóa học</span>
                  </div>
                  <div className={`flex items-center gap-1 ${path.textColor} font-semibold`}>
                    <span>Bắt đầu ngay</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Proficiency Levels */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Trình độ tiếng Anh</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {proficiencyLevels.map((level) => (
              <button
                key={level.name}
                onClick={() => navigate('/dang-ky')}
                className={`${level.color} rounded-2xl p-6 text-center hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer`}
              >
                <div className="text-5xl mb-4 transform hover:scale-110 transition-transform duration-300">
                  {level.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{level.nameVi}</h3>
                <p className="text-xs opacity-80 mb-2">{level.name}</p>
                <p className="text-sm font-medium mb-2">{level.description}</p>
                <p className="text-sm opacity-80 font-medium">{level.courses} khóa học →</p>
              </button>
            ))}
          </div>
        </section>

        {/* Exam Preparation */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Luyện thi chứng chỉ quốc tế
            </h2>
            <p className="text-gray-600">
              Đạt điểm cao với phương pháp học hiệu quả và đề thi chuẩn quốc tế
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {examPrep.map((exam) => (
              <button
                key={exam.name}
                onClick={() => navigate('/dang-ky')}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 text-center cursor-pointer hover:-translate-y-1"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${exam.color} flex items-center justify-center text-3xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}>
                  {exam.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{exam.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{exam.students} học viên</p>
                <div className="flex items-center justify-center gap-1 text-indigo-600 font-medium text-sm">
                  <span>Xem khóa học</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tính năng nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold text-center mb-8">
              Được tin tưởng bởi hàng ngàn học viên trên toàn quốc
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bắt đầu hành trình chinh phục tiếng Anh
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Đăng ký ngay để nhận 7 ngày học thử miễn phí với giao diện thích ứng theo độ tuổi
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/dang-ky')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Học thử miễn phí 7 ngày</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/dang-nhap')}
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold border-2 border-gray-300 hover:border-indigo-600 hover:text-indigo-600 transition-all"
            >
              Đăng nhập
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-6 h-6 text-indigo-400" />
                <span className="font-bold text-white text-lg">NamThu English</span>
              </div>
              <p className="text-sm text-gray-400">
                Nền tảng học tiếng Anh thông minh với giao diện thích ứng theo độ tuổi
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Khóa học</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Trẻ em (6-12 tuổi)</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Thiếu niên (13-17 tuổi)</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Người lớn (18+)</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Luyện thi IELTS/TOEIC</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Hướng dẫn</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Câu hỏi thường gặp</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Liên hệ</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Chính sách</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Kết nối</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">YouTube</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Email: hello@namthu.edu.vn</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Hotline: 1900-xxxx</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2026 NamThu English. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
