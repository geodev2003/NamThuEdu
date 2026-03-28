// THEME: Orange & White - Modern Educational Design
/**
 * Stats Section - Orange theme
 */

import { Users, GraduationCap, BookOpen, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function StatsSection() {
  const { t } = useTranslation();
  
  const stats = [
    { label: t('landing.stats.students'), value: '50,000+', icon: Users, gradient: 'from-[#FF8C42] to-[#FF6B35]' },
    { label: t('landing.stats.teachers'), value: '500+', icon: GraduationCap, gradient: 'from-[#FFA726] to-[#FF8C42]' },
    { label: t('landing.stats.courses'), value: '10,000+', icon: BookOpen, gradient: 'from-[#FF8C42] to-[#FF6B35]' },
    { label: t('landing.stats.satisfaction'), value: '98%', icon: Star, gradient: 'from-[#FFA726] to-[#FF8C42]' },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="bg-gradient-to-r from-[#FF8C42] via-[#FF6B35] to-[#FFA726] rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center text-white group">
              <div className={`w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">{stat.value}</div>
              <div className="text-sm md:text-base font-semibold opacity-95">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
