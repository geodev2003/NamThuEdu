// THEME: updated to Forest+Coral
/**
 * Demo Flashcard - IMPROVED: Interactive vocabulary flashcard with flip animation
 * CSS-only flip effect, no external libraries
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw } from 'lucide-react';

export function DemoFlashcard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const { t } = useTranslation();

  return (
    <section className="container mx-auto px-4 py-16 bg-[#E8F5EF]">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t('landing.demo.title')}
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          {t('landing.demo.subtitle')}
        </p>

        {/* Flashcard */}
        <div className="perspective-1000 mb-6">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`relative w-full h-80 cursor-pointer transition-transform duration-700 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front side */}
            <div
              className="absolute inset-0 bg-white rounded-3xl shadow-2xl p-12 flex flex-col items-center justify-center backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-5xl font-bold text-gray-900 mb-4">Success</h3>
              <p className="text-gray-500 text-sm">{t('landing.demo.clickToFlip')}</p>
            </div>

            {/* Back side */}
            <div
              className="absolute inset-0 bg-[#1A5C45] rounded-3xl shadow-2xl p-12 flex flex-col items-center justify-center text-white backface-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="text-6xl mb-6">✨</div>
              <h3 className="text-4xl font-bold mb-4">Thành công</h3>
              <p className="text-lg mb-6 opacity-90">/səkˈses/</p>
              <p className="text-center leading-relaxed opacity-90">
                <span className="font-semibold">{t('landing.demo.example')}</span><br />
                "Hard work leads to success"<br />
                <span className="text-sm">(Làm việc chăm chỉ dẫn đến thành công)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Reset button */}
        <button
          onClick={() => setIsFlipped(false)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1A5C45] border-2 border-[#1A5C45] rounded-xl font-semibold hover:shadow-lg hover:bg-[#1A5C45] hover:text-white transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          <span>{t('landing.demo.reset')}</span>
        </button>

        <p className="mt-6 text-sm text-gray-600">
          {t('landing.demo.note')}
        </p>
      </div>

      {/* CSS for 3D flip */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );
}
