import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Sparkles, Check } from 'lucide-react';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { ThemePreference } from '../../../../themes/types';
import { useEffect, useState } from 'react';

interface ThemeOption {
  id: ThemePreference;
  emoji: string;
  gradient: string;
  shadowColor: string;
  borderColor: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'kids',
    emoji: '🎨',
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #4ECDC4 50%, #FFE66D 100%)',
    shadowColor: 'rgba(255, 107, 53, 0.3)',
    borderColor: '#FF6B35',
  },
  {
    id: 'teens',
    emoji: '🎮',
    gradient: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
    shadowColor: 'rgba(16, 185, 129, 0.3)',
    borderColor: '#10B981',
  },
  {
    id: 'adults',
    emoji: '💼',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #3B82F6 100%)',
    shadowColor: 'rgba(14, 165, 233, 0.2)',
    borderColor: '#0EA5E9',
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectTheme: (theme: ThemePreference) => void;
}

export default function ThemeSelectionModal({ isOpen, onClose, onSelectTheme }: Props) {
  const { t } = useTranslation();
  const { ageGroup } = useThemeContext();
  const [selectedTheme, setSelectedTheme] = useState<ThemePreference | null>(null);
  const [hoveredTheme, setHoveredTheme] = useState<ThemePreference | null>(null);

  // Auto-suggest based on age
  const suggestedTheme: ThemePreference = ageGroup === 'kids' ? 'kids' : ageGroup === 'teens' ? 'teens' : 'adults';

  const handleConfirmSelection = () => {
    if (selectedTheme) {
      onSelectTheme(selectedTheme);
      onClose();
    }
  };

  const handleSkip = () => {
    // Skip for now, use auto theme
    onSelectTheme('auto');
    onClose();
  };

  // Prevent body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-pink-900/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer z-10"
              aria-label={t('common.close', 'Close')}
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            {/* Header */}
            <div className="text-center pt-12 pb-8 px-8">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ fontFamily: '"Baloo 2", "Comic Neue", sans-serif' }}
              >
                {t('student.themeSelection.title', 'Chọn giao diện phù hợp với bạn')}
              </motion.h1>

              <motion.p
                className="text-lg text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {t('student.themeSelection.subtitle', 'Chọn phong cách học tập mà bạn thích nhất')}
              </motion.p>
            </div>

            {/* Theme Cards */}
            <div className="px-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {THEME_OPTIONS.map((option, index) => {
                  const isSelected = selectedTheme === option.id;
                  const isHovered = hoveredTheme === option.id;
                  const isSuggested = suggestedTheme === option.id;

                  return (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="relative"
                    >
                      {/* Suggested badge */}
                      {isSuggested && !selectedTheme && (
                        <motion.div
                          className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8, type: 'spring' }}
                        >
                          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                            {t('student.themeSelection.recommended', 'Đề xuất cho bạn')}
                          </div>
                        </motion.div>
                      )}

                      {/* Theme Card */}
                      <motion.button
                        onClick={() => setSelectedTheme(option.id)}
                        onMouseEnter={() => setHoveredTheme(option.id)}
                        onMouseLeave={() => setHoveredTheme(null)}
                        className={`
                          relative w-full rounded-2xl p-8 cursor-pointer
                          border-4 transition-all duration-300
                          ${
                            isSelected
                              ? 'border-indigo-600 shadow-2xl'
                              : isSuggested && !selectedTheme
                              ? 'border-amber-400/50'
                              : 'border-gray-200'
                          }
                        `}
                        style={{
                          background: isHovered || isSelected ? option.gradient : '#F9FAFB',
                          boxShadow:
                            isHovered || isSelected
                              ? `0 20px 50px ${option.shadowColor}, 0 8px 16px ${option.shadowColor}`
                              : '0 4px 12px rgba(0,0,0,0.08)',
                          transform: isHovered || isSelected ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Selected checkmark */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                              transition={{ type: 'spring', stiffness: 200 }}
                            >
                              <Check className="w-5 h-5 text-green-600" />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Emoji Icon */}
                        <div className="text-6xl mb-4">{option.emoji}</div>

                        {/* Theme Name */}
                        <h3
                          className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
                            isHovered || isSelected ? 'text-white' : 'text-gray-900'
                          }`}
                          style={{ fontFamily: '"Baloo 2", sans-serif' }}
                        >
                          {t(`student.themeSelection.${option.id}.title`)}
                        </h3>

                        {/* Age Range */}
                        <p
                          className={`text-sm font-semibold mb-4 transition-colors duration-300 ${
                            isHovered || isSelected ? 'text-white/90' : 'text-gray-600'
                          }`}
                        >
                          {t(`student.themeSelection.${option.id}.ageRange`)}
                        </p>

                        {/* Description */}
                        <p
                          className={`text-base mb-6 transition-colors duration-300 ${
                            isHovered || isSelected ? 'text-white/95' : 'text-gray-700'
                          }`}
                        >
                          {t(`student.themeSelection.${option.id}.description`)}
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          {[1, 2, 3, 4].map((num) => (
                            <div
                              key={num}
                              className={`text-sm flex items-center gap-2 transition-colors duration-300 ${
                                isHovered || isSelected ? 'text-white/90' : 'text-gray-600'
                              }`}
                            >
                              <span className="text-base">{t(`student.themeSelection.${option.id}.feature${num}`)}</span>
                            </div>
                          ))}
                        </div>
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer Actions */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <p className="text-sm text-gray-500 text-center sm:text-left">
                  {t('student.themeSelection.canChangeAnytime', 'Bạn có thể thay đổi giao diện bất cứ lúc nào trong phần Cài đặt')}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleSkip}
                    className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  >
                    {t('student.themeSelection.skipForNow', 'Bỏ qua (chọn sau)')}
                  </button>

                  <button
                    onClick={handleConfirmSelection}
                    disabled={!selectedTheme}
                    className={`
                      px-8 py-3 rounded-xl font-bold text-white transition-all duration-200
                      ${
                        selectedTheme
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl cursor-pointer'
                          : 'bg-gray-300 cursor-not-allowed'
                      }
                    `}
                  >
                    {t('student.themeSelection.confirmSelection', 'Chọn giao diện này')}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
