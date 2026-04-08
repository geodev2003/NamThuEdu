import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Palette, Check } from 'lucide-react';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { ThemePreference } from '../../../../themes/types';

const THEME_OPTIONS: { id: ThemePreference; emoji: string; labelKey: string; descKey: string }[] = [
  {
    id: 'kids',
    emoji: '🎨',
    labelKey: 'student.settings.theme.playful.label',
    descKey: 'student.settings.theme.playful.description',
  },
  {
    id: 'teens',
    emoji: '🎮',
    labelKey: 'student.settings.theme.dynamic.label',
    descKey: 'student.settings.theme.dynamic.description',
  },
  {
    id: 'adults',
    emoji: '💼',
    labelKey: 'student.settings.theme.professional.label',
    descKey: 'student.settings.theme.professional.description',
  },
  {
    id: 'auto',
    emoji: '✨',
    labelKey: 'student.settings.theme.auto.label',
    descKey: 'student.settings.theme.auto.description',
  },
];

export default function ThemeSwitcher() {
  const { t } = useTranslation();
  const { themePreference, setThemePreference, ageGroup } = useThemeContext();

  const currentOption = THEME_OPTIONS.find((opt) => opt.id === themePreference) || THEME_OPTIONS[3];

  const getAutoThemeLabel = () => {
    if (ageGroup === 'kids') return '🎨 ' + t('student.settings.theme.playful.label');
    if (ageGroup === 'teens') return '🎮 ' + t('student.settings.theme.dynamic.label');
    if (ageGroup === 'adults') return '💼 ' + t('student.settings.theme.professional.label');
    return '✨ ' + t('student.settings.theme.auto.label');
  };

  return (
    <div className="theme-switcher-container">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          {t('student.settings.theme.title')}
        </h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {t('student.settings.theme.description')}
      </p>

      <div className="space-y-3">
        {THEME_OPTIONS.map((option) => {
          const isActive = themePreference === option.id;
          const label = t(option.labelKey);
          const displayLabel = option.id === 'auto' ? getAutoThemeLabel() : `${option.emoji} ${label}`;

          return (
            <button
              key={option.id}
              onClick={() => {
                setThemePreference(option.id);
              }}
              className={`
                w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all
                ${
                  isActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex-shrink-0 text-3xl">{option.emoji}</div>

              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{label}</span>
                  {option.id === 'auto' && (
                    <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded">
                      {t('student.settings.theme.currentlyLabel')}: {getAutoThemeLabel()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{t(option.descKey)}</p>
              </div>

              {isActive && (
                <div className="flex-shrink-0">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Theme Preview Note */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-900">
          <strong>💡 {t('student.settings.theme.tipTitle')}:</strong> {t('student.settings.theme.tipDescription')}
        </p>
      </div>
    </div>
  );
}
