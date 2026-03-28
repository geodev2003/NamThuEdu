// THEME: Orange & White - Modern Educational Design
/**
 * Hero Section - Modern Orange Theme
 * Clean, professional design with vibrant orange accents
 */

import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Play, BookOpen, Users, Award, Sparkles, Star, TrendingUp } from 'lucide-react';

export function HeroSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FFF4E6] rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFE0B2] rounded-full blur-3xl opacity-60"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        {/* Banner with side content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Left side - Feature highlights (smaller, pushed left) */}
          <div className="lg:col-span-1 space-y-4 lg:-ml-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-[#FFF4E6]">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] rounded-xl flex items-center justify-center mb-3 shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">{t('landing.hero.featureCommunication')}</h3>
              <p className="text-xs text-gray-600">{t('landing.hero.featureCommunicationDesc')}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-[#FFF4E6]">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFA726] to-[#FF8C42] rounded-xl flex items-center justify-center mb-3 shadow-md">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">{t('landing.hero.featureGrades')}</h3>
              <p className="text-xs text-gray-600">{t('landing.hero.featureGradesDesc')}</p>
            </div>
          </div>

          {/* Center - Banner image (much larger) */}
          <div className="lg:col-span-10 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="/images/banner.png" 
                alt="Tuyển sinh khóa học tiếng Anh"
                className="w-full h-auto"
              />
              
              {/* Gradient overlay for better contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>

            {/* Floating badges - Orange theme */}
            <div className="absolute -bottom-6 left-6 bg-white rounded-2xl shadow-2xl p-5 animate-bounce border-4 border-[#FFF4E6]">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF8C42] to-[#FF6B35] bg-clip-text text-transparent">50K+</div>
                <div className="text-xs font-semibold text-gray-600 mt-1">{t('landing.hero.students')}</div>
              </div>
            </div>
            
            <div className="absolute -top-6 right-6 bg-white rounded-2xl shadow-2xl p-5 animate-pulse border-4 border-[#FFF4E6]">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-5 h-5 fill-[#FF8C42] text-[#FF8C42]" />
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF8C42] to-[#FF6B35] bg-clip-text text-transparent">4.9</div>
                </div>
                <div className="text-xs font-semibold text-gray-600">{t('landing.hero.rating')}</div>
              </div>
            </div>
          </div>

          {/* Right side - More features (smaller, pushed right) */}
          <div className="lg:col-span-1 space-y-4 lg:-mr-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-[#FFF4E6]">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] rounded-xl flex items-center justify-center mb-3 shadow-md">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">{t('landing.hero.featureExams')}</h3>
              <p className="text-xs text-gray-600">{t('landing.hero.featureExamsDesc')}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-[#FFF4E6]">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFA726] to-[#FF8C42] rounded-xl flex items-center justify-center mb-3 shadow-md">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">{t('landing.hero.featureAI')}</h3>
              <p className="text-xs text-gray-600">{t('landing.hero.featureAIDesc')}</p>
            </div>
          </div>
        </div>

        {/* Bottom section - Headline and CTA */}
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#FFF4E6] px-6 py-3 rounded-full mb-6 border-2 border-[#FFE0B2]">
            <TrendingUp className="w-5 h-5 text-[#FF8C42]" />
            <span className="text-sm font-bold text-[#FF6B35]">{t('landing.hero.badge')}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('landing.hero.title')}
            <span className="block mt-2 bg-gradient-to-r from-[#FF8C42] via-[#FF6B35] to-[#FFA726] bg-clip-text text-transparent">
              {t('landing.hero.titleHighlight')}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            {t('landing.hero.subtitle')}
          </p>

          {/* Key features - Orange theme */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-[#FFF4E6]">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] rounded-xl flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">{t('landing.hero.featureCommunication')}</div>
                <div className="text-sm text-gray-600">{t('landing.hero.featureCommunicationDesc')}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-[#FFF4E6]">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFA726] to-[#FF8C42] rounded-xl flex items-center justify-center shadow-md">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">{t('landing.hero.featureGrades')}</div>
                <div className="text-sm text-gray-600">{t('landing.hero.featureGradesDesc')}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-[#FFF4E6]">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] rounded-xl flex items-center justify-center shadow-md">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">{t('landing.hero.featureExams')}</div>
                <div className="text-sm text-gray-600">{t('landing.hero.featureExamsDesc')}</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons - Orange theme */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dang-ky')}
              className="group px-10 py-5 bg-gradient-to-r from-[#FF8C42] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#FF5722] text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 border-4 border-white shadow-xl"
            >
              <span>{t('landing.hero.ctaRegister')}</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => {/* TODO: Open demo video */}}
              className="group px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg border-4 border-[#FF8C42] hover:bg-[#FFF4E6] transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              <Play className="w-6 h-6 text-[#FF8C42]" />
              <span>{t('landing.hero.ctaDemo')}</span>
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] border-2 border-white"></div>
                ))}
              </div>
              <span className="font-semibold">50,000+ {t('landing.hero.trustStudents')}</span>
            </div>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 fill-[#FF8C42] text-[#FF8C42]" />
              ))}
              <span className="font-semibold ml-2">4.9/5 {t('landing.hero.trustRating')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
