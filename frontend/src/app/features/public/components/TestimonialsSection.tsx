// THEME: updated to Forest+Coral
/**
 * Testimonials Section - IMPROVED: Added social proof
 * 3 testimonial cards with avatar, name, age group, rating, quote
 */

import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function TestimonialsSection() {
  const { t } = useTranslation();
  
  const testimonials = [
    {
      name: 'Nguyễn Minh An',
      ageGroup: t('landing.testimonials.kids'),
      ageGroupColor: 'text-[#FF6B5B] bg-[#FFD6D2]',
      avatar: '👧',
      rating: 5,
      quote: 'Con rất thích học qua trò chơi và bài hát. Giờ con tự tin nói tiếng Anh với bạn bè!',
      result: 'Tăng 2 cấp độ sau 6 tháng'
    },
    {
      name: 'Trần Hoàng Long',
      ageGroup: t('landing.testimonials.teens'),
      ageGroupColor: 'text-blue-600 bg-blue-100',
      avatar: '👦',
      rating: 5,
      quote: 'Luyện thi Cambridge KET với video lessons rất hay. Đạt 140/150 điểm!',
      result: 'Cambridge KET: 140/150 điểm'
    },
    {
      name: 'Lê Thị Hương',
      ageGroup: t('landing.testimonials.adults'),
      ageGroupColor: 'text-[#1A5C45] bg-[#E8F5EF]',
      avatar: '👩',
      rating: 5,
      quote: 'Tăng 150 điểm TOEIC sau 3 tháng học. Business English giúp tôi tự tin trong công việc.',
      result: 'TOEIC: 650 → 800 điểm'
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t('landing.testimonials.title')}
        </h2>
        <p className="text-lg text-gray-600">
          {t('landing.testimonials.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            {/* Avatar & Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#E8F5EF] flex items-center justify-center text-3xl">
                {testimonial.avatar}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{testimonial.name}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${testimonial.ageGroupColor}`}>
                  {testimonial.ageGroup}
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-gray-700 mb-4 leading-relaxed italic">
              "{testimonial.quote}"
            </p>

            {/* Result */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-semibold text-[#1A5C45]">
                ✨ {testimonial.result}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
