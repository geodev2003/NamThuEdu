/**
 * Landing Page - IMPROVED VERSION
 * 
 * All improvements applied:
 * 1. Hero section with two-column layout
 * 2. Single stats section (removed duplicate)
 * 3. Testimonials section added
 * 4. Features with preview mockups
 * 5. CTA with micro-copy
 * 6. Demo flashcard section
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { usePageTitle, PAGE_TITLES } from '../../../hooks/usePageTitle';
import { 
  Search,
  BookOpen,
  ChevronRight,
  ArrowRight,
  Globe,
  Headphones,
  Trophy,
  Video,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

// IMPROVED: Import new components
import { HeroSection, StatsSection, TestimonialsSection, DemoFlashcard } from './components';

export function LandingPageImproved() {
  const navigate = useNavigate();
  usePageTitle(PAGE_TITLES.LANDING);
  const [searchQuery, setSearchQuery] = useState('');

  // Age-based learning paths
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

  // IMPROVED: Features with preview mockups
  const features = [
    {
      icon: Globe,
      title: 'Học tập thích ứng',
      description: 'Giao diện và nội dung tự động điều chỉnh theo độ tuổi',
      color: 'text-blue-600',
      preview: 'Adaptive UI'
    },
    {
      icon: Headphones,
      title: 'Luyện nghe - nói',
      description: 'AI đánh giá phát âm và giao tiếp thực tế',
      color: 'text-purple-600',
      preview: 'AI Speech'
    },
    {
      icon: Trophy,
      title: 'Thi đấu & Xếp hạng',
      description: 'Cạnh tranh với bạn bè, nhận huy chương',
      color: 'text-yellow-600',
      preview: 'Leaderboard'
    },
    {
      icon: Video,
      title: 'Video bài giảng',
      description: 'Học qua video tương tác với giáo viên bản xứ',
      color: 'text-red-600',
      preview: 'Video Lessons'
    },
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
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  NamThu English
                </h1>
                <p className="text-xs text-gray-500">Học tiếng Anh thông minh</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dang-nhap')}
                className="px-5 py-2.5 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 text-sm font-medium cursor-pointer"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigate('/dang-ky')}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 rounded-xl transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg cursor-pointer"
              >
                Học thử miễn phí
              </button>
            </div>
          </div>

          <div className="pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm khóa học, bài học, từ vựng, ngữ pháp..."
                  className="w-full pl-12 pr-32 py-3.5 bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 focus:border-purple-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md cursor-pointer"
                >
                  Tìm kiếm
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      <div className="h-40"></div>

      {/* IMPROVED: Hero Section */}
      <HeroSection />

      {/* IMPROVED: Stats Section (single instance) */}
      <StatsSection />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Learning Paths by Age */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Chọn lộ trình học phù hợp với bạn
            </h2>
            <p className="text-lg text-gray-600">
              Giao diện và nội dung tự động thích ứng theo độ tuổi và trình độ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Trình độ tiếng Anh
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {proficiencyLevels.map((level) => (
              <button
                key={level.name}
                onClick={() => navigate('/dang-ky')}
                className={`${level.color} rounded-2xl p-6 text-center hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer`}
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
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Luyện thi chứng chỉ quốc tế
            </h2>
            <p className="text-lg text-gray-600">
              Đạt điểm cao với phương pháp học hiệu quả và đề thi chuẩn quốc tế
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {examPrep.map((exam) => (
              <button
                key={exam.name}
                onClick={() => navigate('/dang-ky')}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 text-center cursor-pointer hover:-translate-y-1"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${exam.color} flex items-center justify-center text-3xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}>
                  {exam.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{exam.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{exam.students} học viên</p>
                <div className="flex items-center justify-center gap-1 text-purple-600 font-medium text-sm">
                  <span>Xem khóa học</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* IMPROVED: Features with preview mockups */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Tính năng nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-102 cursor-pointer"
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                
                {/* IMPROVED: Preview mockup */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center">
                  <div className="text-xs font-semibold text-purple-600 mb-2">Preview</div>
                  <div className="h-20 bg-white/50 rounded-lg flex items-center justify-center text-xs text-gray-500">
                    {feature.preview}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* IMPROVED: Testimonials Section */}
        <TestimonialsSection />

        {/* IMPROVED: CTA with micro-copy */}
        <section className="text-center py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Bắt đầu hành trình chinh phục tiếng Anh
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Đăng ký ngay để nhận 7 ngày học thử miễn phí với giao diện thích ứng theo độ tuổi
          </p>
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => navigate('/dang-ky')}
              className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Học thử miễn phí 7 ngày</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            
            {/* IMPROVED: Micro-copy */}
            <p className="text-sm text-gray-500">
              Không cần thẻ tín dụng · Hủy bất cứ lúc nào
            </p>
          </div>
        </section>
      </main>

      {/* IMPROVED: Demo Flashcard Section */}
      <DemoFlashcard />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-6 h-6 text-purple-400" />
                <span className="font-bold text-white text-lg">NamThu English</span>
              </div>
              <p className="text-sm text-gray-400">
                Nền tảng học tiếng Anh thông minh với giao diện thích ứng theo độ tuổi
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Khóa học</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Trẻ em (6-12 tuổi)</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Thiếu niên (13-17 tuổi)</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Người lớn (18+)</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Luyện thi IELTS/TOEIC</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Hướng dẫn</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Câu hỏi thường gặp</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Liên hệ</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Chính sách</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Kết nối</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">YouTube</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Email: hello@namthu.edu.vn</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Hotline: 1900-xxxx</a></li>
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
