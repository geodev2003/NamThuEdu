import React, { useRef, useState } from 'react';
import {
  Rocket,
  Target,
  Plane,
  ArrowRight,
  Users,
  BookOpen,
  Hash,
  Check,
  Sparkles,
  Loader2,
  X,
  type LucideIcon,
} from 'lucide-react';
import { generateKidsExamMeta } from '../../../../../../services/groqApi';

interface Step1ExamTypeProps {
  examData: any;
  setExamData: (data: any) => void;
  onNext: () => void;
}

interface ExamTypeOption {
  id: 'starters' | 'movers' | 'flyers';
  name: string;
  icon: LucideIcon;
  ageRange: string;
  level: string;
  vocabulary: string;
  duration: number;
  badge?: string;
}

const examTypes: ExamTypeOption[] = [
  {
    id: 'starters',
    name: 'Starters',
    icon: Rocket,
    ageRange: '6 - 8 tuổi',
    level: 'Pre A1',
    vocabulary: '~350 từ',
    duration: 45,
    badge: 'Phổ biến',
  },
  {
    id: 'movers',
    name: 'Movers',
    icon: Target,
    ageRange: '8 - 11 tuổi',
    level: 'A1',
    vocabulary: '~650 từ',
    duration: 60,
  },
  {
    id: 'flyers',
    name: 'Flyers',
    icon: Plane,
    ageRange: '9 - 12 tuổi',
    level: 'A2',
    vocabulary: '~1000 từ',
    duration: 75,
    badge: 'Nâng cao',
  },
];

const ORANGE = '#F97316';

const Step1ExamType: React.FC<Step1ExamTypeProps> = ({
  examData,
  setExamData,
  onNext,
}) => {
  const [aiOpen, setAiOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const aiInputRef = useRef<HTMLInputElement>(null);

  const handleSelectType = (typeId: ExamTypeOption['id']) => {
    const selectedType = examTypes.find((t) => t.id === typeId);
    setExamData({
      ...examData,
      examType: typeId,
      duration: selectedType?.duration ?? 60,
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setExamData({ ...examData, [field]: value });
  };

  const openAiPanel = () => {
    if (!examData.examType) {
      setAiError('Hãy chọn cấp độ Cambridge trước khi gợi ý.');
      return;
    }
    setAiError(null);
    setAiOpen(true);
    // focus input sau 1 frame để animation ổn
    setTimeout(() => aiInputRef.current?.focus(), 50);
  };

  const closeAiPanel = () => {
    setAiOpen(false);
    setAiError(null);
  };

  const handleAiGenerate = async () => {
    if (!examData.examType || aiLoading) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const meta = await generateKidsExamMeta(examData.examType, aiTopic.trim());
      if (!meta.title && !meta.description) {
        throw new Error('AI không trả về kết quả hợp lệ.');
      }
      setExamData({
        ...examData,
        title: meta.title || examData.title,
        description: meta.description || examData.description,
      });
      setAiOpen(false);
      setAiTopic('');
    } catch (err: any) {
      console.error(err);
      setAiError(err?.message || 'Không thể gọi AI. Hãy thử lại.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAiGenerate();
    } else if (e.key === 'Escape') {
      closeAiPanel();
    }
  };

  const canProceed = examData.examType && examData.title;

  return (
    <div className="space-y-6">
      {/* ── Cấp độ Cambridge ─────────────────────────────────────────────── */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700">
            Cấp độ Cambridge <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-slate-400">Chọn 1 cấp độ</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {examTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = examData.examType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => handleSelectType(type.id)}
                className={`relative text-left rounded-lg border bg-white p-4 transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: isSelected ? ORANGE : '#EFF6FF',
                      color: isSelected ? '#fff' : '#2563EB',
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      {type.name}
                    </h3>
                    {type.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                        {type.badge}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: ORANGE }}
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {type.ageRange}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    {type.level}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    {type.vocabulary}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="border-t border-slate-200" />

      {/* ── Thông tin đề thi ─────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700">
            Thông tin đề thi
          </h3>

          {/* AI suggestion trigger */}
          {!aiOpen && (
            <button
              type="button"
              onClick={openAiPanel}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-800 hover:bg-violet-50 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI gợi ý
            </button>
          )}
        </div>

        {/* AI panel — Enter để generate, Esc để đóng */}
        {aiOpen && (
          <div className="mb-4 rounded-lg border border-violet-200 bg-violet-50/50 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-violet-600 flex-shrink-0" />
              <span className="text-xs font-semibold text-violet-900">
                Mô tả ngắn chủ đề bạn muốn (tùy chọn)
              </span>
              <button
                type="button"
                onClick={closeAiPanel}
                className="ml-auto text-violet-400 hover:text-violet-600 cursor-pointer"
                aria-label="Đóng AI gợi ý"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={aiInputRef}
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                onKeyDown={handleAiKeyDown}
                disabled={aiLoading}
                placeholder='VD: "động vật trong rừng" hoặc để trống để AI tự chọn'
                className="flex-1 rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:bg-slate-50"
              />
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={aiLoading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Đang tạo
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Tạo gợi ý
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-violet-700/80 mt-2">
              Nhấn <kbd className="px-1 py-0.5 rounded bg-white border border-violet-200 font-mono text-[10px]">Enter</kbd> để tạo,{' '}
              <kbd className="px-1 py-0.5 rounded bg-white border border-violet-200 font-mono text-[10px]">Esc</kbd> để đóng.
              Kết quả sẽ điền sẵn vào "Tên đề thi" và "Mô tả".
            </p>

            {aiError && (
              <p className="text-[11px] text-red-600 mt-2">{aiError}</p>
            )}
          </div>
        )}

        {/* Hiện error nếu user mở AI mà chưa chọn cấp */}
        {!aiOpen && aiError && (
          <p className="text-[11px] text-red-600 mb-3">{aiError}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Title - 2 cols */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Tên đề thi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={examData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="VD: Cambridge YLE Starters - Test 1"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          {/* Duration - 1 col */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Thời gian (phút)
            </label>
            <input
              type="number"
              value={examData.duration}
              onChange={(e) =>
                handleInputChange('duration', parseInt(e.target.value) || 0)
              }
              min={15}
              max={180}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          {/* Description - full width */}
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Mô tả
            </label>
            <textarea
              value={examData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Mô tả ngắn về đề thi này..."
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
            />
          </div>
        </div>
      </section>

      {/* ── Action ───────────────────────────────────────────────────────── */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
            canProceed
              ? 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Tiếp theo
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Step1ExamType;
