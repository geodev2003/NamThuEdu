// THEME: updated to Forest+Coral
/**
 * Landing Page - IMPROVED VERSION
 * 
 * Primary: #1A5C45 (Forest Green)
 * Accent: #FF6B5B (Coral)
 * 
 * All improvements applied:
 * 1. Hero section with two-column layout
 * 2. Single stats section (removed duplicate)
 * 3. Testimonials section added
 * 4. Features with preview mockups
 * 5. CTA with micro-copy
 * 6. Demo flashcard section
 */

import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { usePageTitle, PAGE_TITLES } from '../../../hooks/usePageTitle';
import { 
  ChevronRight,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Globe,
  Headphones,
  Trophy,
  Video,
} from 'lucide-react';

// IMPROVED: Import new components
import { Header, HeroSection, StatsSection, TestimonialsSection, DemoFlashcard, Footer } from './components';

export function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  usePageTitle(PAGE_TITLES.LANDING);

  // Age-based learning paths - Orange theme
  const learningPaths = [
    {
      id: 'kids',
      name: t('landing.learningPaths.kids.name'),
      description: t('landing.learningPaths.kids.description'),
      color: 'from-[#FFB74D] via-[#FFA726] to-[#FF9800]',
      icon: '🎨',
      features: [
        t('landing.learningPaths.kids.feature1'),
        t('landing.learningPaths.kids.feature2'),
        t('landing.learningPaths.kids.feature3'),
        t('landing.learningPaths.kids.feature4')
      ],
      courses: 24,
      bgColor: 'bg-gradient-to-br from-[#FFF9F0] to-[#FFF4E6]',
      textColor: 'text-[#FF8C42]',
      borderColor: 'border-[#FFE0B2]'
    },
    {
      id: 'teens',
      name: t('landing.learningPaths.teens.name'),
      description: t('landing.learningPaths.teens.description'),
      color: 'from-[#FF8C42] via-[#FF6B35] to-[#FF8C42]',
      icon: '🎮',
      features: [
        t('landing.learningPaths.teens.feature1'),
        t('landing.learningPaths.teens.feature2'),
        t('landing.learningPaths.teens.feature3'),
        t('landing.learningPaths.teens.feature4')
      ],
      courses: 36,
      bgColor: 'bg-gradient-to-br from-[#FFF4E6] to-[#FFE0B2]',
      textColor: 'text-[#FF6B35]',
      borderColor: 'border-[#FFB74D]'
    },
    {
      id: 'adults',
      name: t('landing.learningPaths.adults.name'),
      description: t('landing.learningPaths.adults.description'),
      color: 'from-[#FF6B35] via-[#FF5722] to-[#FF6B35]',
      icon: '💼',
      features: [
        t('landing.learningPaths.adults.feature1'),
        t('landing.learningPaths.adults.feature2'),
        t('landing.learningPaths.adults.feature3'),
        t('landing.learningPaths.adults.feature4')
      ],
      courses: 48,
      bgColor: 'bg-gradient-to-br from-[#FFE0B2] to-[#FFCCBC]',
      textColor: 'text-[#FF5722]',
      borderColor: 'border-[#FF8C42]'
    },
  ];

  const proficiencyLevels = [
    { 
      name: 'Beginner', 
      nameVi: t('landing.proficiency.beginner'),
      icon: '🌱', 
      courses: 12, 
      color: 'bg-[#FFF9F0] text-[#FF8C42] border-2 border-[#FFE0B2]',
      description: t('landing.proficiency.beginnerDesc')
    },
    { 
      name: 'Intermediate', 
      nameVi: t('landing.proficiency.intermediate'),
      icon: '🌿', 
      courses: 18, 
      color: 'bg-[#FFF4E6] text-[#FF6B35] border-2 border-[#FFB74D]',
      description: t('landing.proficiency.intermediateDesc')
    },
    { 
      name: 'Advanced', 
      nameVi: t('landing.proficiency.advanced'),
      icon: '🌳', 
      courses: 15, 
      color: 'bg-[#FFE0B2] text-[#FF5722] border-2 border-[#FF8C42]',
      description: t('landing.proficiency.advancedDesc')
    },
    { 
      name: 'Exam Prep', 
      nameVi: t('landing.proficiency.examPrep'),
      icon: '🎯', 
      courses: 24, 
      color: 'bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] text-white border-2 border-[#FF8C42]',
      description: t('landing.proficiency.examPrepDesc')
    },
  ];

  // IMPROVED: Features with preview mockups - Orange theme
  const features = [
    {
      icon: Globe,
      title: t('landing.features.adaptive'),
      description: t('landing.features.adaptiveDesc'),
      color: 'text-[#FF8C42]',
      preview: 'Adaptive UI'
    },
    {
      icon: Headphones,
      title: t('landing.features.listening'),
      description: t('landing.features.listeningDesc'),
      color: 'text-[#FF6B35]',
      preview: 'AI Speech'
    },
    {
      icon: Trophy,
      title: t('landing.features.competition'),
      description: t('landing.features.competitionDesc'),
      color: 'text-[#FFA726]',
      preview: 'Leaderboard'
    },
    {
      icon: Video,
      title: t('landing.features.video'),
      description: t('landing.features.videoDesc'),
      color: 'text-[#FF8C42]',
      preview: 'Video Lessons'
    },
  ];

  const examPrep = [
    { name: 'IELTS', icon: '🎓', students: '15,000+', color: 'from-[#FF8C42] to-[#FF6B35]' },
    { name: 'TOEIC', icon: '📊', students: '12,000+', color: 'from-[#FFA726] to-[#FF8C42]' },
    { name: 'Cambridge', icon: '🏆', students: '8,000+', color: 'from-[#FF6B35] to-[#FF5722]' },
    { name: 'VSTEP', icon: '🎯', students: '5,000+', color: 'from-[#FFB74D] to-[#FFA726]' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* IMPROVED: New Header with Announcement Bar */}
      <Header />

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
              {t('landing.page.learningPathsTitle')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('landing.page.learningPathsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {learningPaths.map((path) => (
              <button
                key={path.id}
                onClick={() => navigate('/dang-ky')}
                className={`group ${path.bgColor} rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-200 border-2 ${path.borderColor} text-left cursor-pointer hover:-translate-y-2`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${path.color} flex items-center justify-center text-4xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-200`}>
                    {path.icon}
                  </div>
                  <ChevronRight className={`w-6 h-6 ${path.textColor} group-hover:translate-x-1 transition-all duration-200`} />
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
                      <CheckCircle className={`w-4 h-4 ${path.textColor} flex-shrink-0`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                  <div className="flex items-center gap-2">
                    <BookOpen className={`w-5 h-5 ${path.textColor}`} />
                    <span className={`font-bold ${path.textColor}`}>{path.courses} {t('landing.learningPaths.coursesCount')}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${path.textColor} font-semibold`}>
                    <span>{t('landing.learningPaths.startNow')}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Proficiency Levels - Enhanced UI/UX */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('landing.page.proficiencyTitle')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {proficiencyLevels.map((level) => (
              <button
                key={level.name}
                onClick={() => navigate('/dang-ky')}
                className={`${level.color} rounded-2xl p-6 text-center hover:scale-105 hover:shadow-xl transition-all duration-200 cursor-pointer`}
              >
                <div className="text-5xl mb-4 transform hover:scale-110 transition-transform duration-200">
                  {level.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{level.nameVi}</h3>
                <p className="text-xs opacity-80 mb-2">{level.name}</p>
                <p className="text-sm font-medium mb-2 leading-relaxed">{level.description}</p>
                <div className="flex items-center justify-center gap-1 text-sm font-medium mt-3">
                  <span>{level.courses} {t('landing.learningPaths.coursesCount')}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Exam Preparation - Enhanced with UI/UX Pro Max guidelines */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {t('landing.page.examPrepTitle')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('landing.page.examPrepSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {examPrep.map((exam) => (
              <button
                key={exam.name}
                onClick={() => navigate('/dang-ky')}
                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-[#FF8C42] text-center cursor-pointer hover:-translate-y-1"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${exam.color} flex items-center justify-center text-3xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-200`}>
                  {exam.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{exam.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{exam.students} {t('landing.hero.trustStudents')}</p>
                <div className="flex items-center justify-center gap-1 text-[#FF8C42] font-medium text-sm">
                  <span>{t('landing.examPrep.viewCourses')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* IMPROVED: Features with preview mockups - Enhanced UI/UX */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('landing.page.featuresTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-[#FFE0B2]"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#FFF4E6] to-[#FFE0B2] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                
                {/* IMPROVED: Preview mockup with better styling */}
                <div className="bg-gradient-to-br from-[#FFF9F0] to-[#FFF4E6] rounded-xl p-4 text-center border border-[#FFE0B2]">
                  <div className="text-xs font-semibold text-[#FF8C42] mb-2">{t('landing.features.preview')}</div>
                  <div className="h-20 bg-white/60 rounded-lg flex items-center justify-center text-xs text-gray-500 backdrop-blur-sm">
                    {feature.preview}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* IMPROVED: Testimonials Section */}
        <TestimonialsSection />

        {/* IMPROVED: CTA with micro-copy - Enhanced with UI/UX Pro Max */}
        <section className="text-center py-16 bg-gradient-to-br from-[#FFF9F0] to-white rounded-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('landing.page.ctaTitle')}
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('landing.page.ctaSubtitle')}
          </p>
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => navigate('/dang-ky')}
              className="group px-10 py-5 bg-gradient-to-r from-[#FF8C42] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#FF5722] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-200 flex items-center gap-3 cursor-pointer"
            >
              <span>{t('landing.cta.button')}</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            
            {/* IMPROVED: Micro-copy with trust indicators */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                {t('landing.cta.noCard')}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                {t('landing.cta.cancelAnytime')}
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* IMPROVED: Demo Flashcard Section */}
      <DemoFlashcard />

      {/* IMPROVED: Modern Footer */}
      <Footer />
    </div>
  );
}
