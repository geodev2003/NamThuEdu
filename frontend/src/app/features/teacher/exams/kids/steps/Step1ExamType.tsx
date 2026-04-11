import React from 'react';
import { Rocket, Target, Plane, ArrowRight } from 'lucide-react';

interface Step1ExamTypeProps {
  examData: any;
  setExamData: (data: any) => void;
  onNext: () => void;
}

const examTypes = [
  {
    id: 'starters',
    name: 'Starters',
    icon: Rocket,
    ageRange: '6-8 tuổi',
    level: 'Pre A1',
    vocabulary: '~350 từ',
    duration: 45, // Official Cambridge duration
    color: 'from-blue-400 to-blue-500',
    borderColor: 'border-blue-400',
    badge: 'Phổ biến',
  },
  {
    id: 'movers',
    name: 'Movers',
    icon: Target,
    ageRange: '8-11 tuổi',
    level: 'A1',
    vocabulary: '~650 từ',
    duration: 60, // Official Cambridge duration
    color: 'from-purple-400 to-purple-500',
    borderColor: 'border-purple-400',
    badge: null,
  },
  {
    id: 'flyers',
    name: 'Flyers',
    icon: Plane,
    ageRange: '9-12 tuổi',
    level: 'A2',
    vocabulary: '~1000 từ',
    duration: 75, // Official Cambridge duration
    color: 'from-orange-400 to-orange-500',
    borderColor: 'border-orange-400',
    badge: 'Nâng cao',
  },
];

const Step1ExamType: React.FC<Step1ExamTypeProps> = ({
  examData,
  setExamData,
  onNext,
}) => {
  const handleSelectType = (typeId: string) => {
    // Find the selected exam type to get its default duration
    const selectedType = examTypes.find(type => type.id === typeId);
    const defaultDuration = selectedType?.duration || 60;
    
    setExamData({ 
      ...examData, 
      examType: typeId,
      duration: defaultDuration // Auto-fill duration based on exam type
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setExamData({ ...examData, [field]: value });
  };

  const handleModeToggle = (mode: 'flexible' | 'cambridge') => {
    setExamData({ ...examData, mode });
  };

  const canProceed = examData.examType && examData.title;

  return (
    <div className="mx-auto w-full space-y-8">
      <div>
        <h2 className="mb-2 font-baloo text-3xl font-bold text-indigo-600">
          Bước 1: Chọn Loại Đề Thi
        </h2>
        <p className="text-gray-600">
          Chọn cấp độ phù hợp với độ tuổi học sinh
        </p>
      </div>

      {/* Exam Type Cards */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {examTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = examData.examType === type.id;

          return (
            <button
              key={type.id}
              onClick={() => handleSelectType(type.id)}
              className={`group relative overflow-hidden rounded-2xl border-4 bg-white p-6 text-left transition-all hover:shadow-xl ${
                isSelected
                  ? `${type.borderColor} shadow-lg`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Badge */}
              {type.badge && (
                <div className="absolute right-4 top-4">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    {type.badge}
                  </span>
                </div>
              )}

              {/* Icon */}
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${type.color}`}
              >
                <Icon className="h-8 w-8 text-white" />
              </div>

              {/* Title */}
              <h3 className="mb-3 font-baloo text-2xl font-bold text-gray-800">
                {type.name}
              </h3>

              {/* Info */}
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center">
                  <span className="mr-2">🎯</span>
                  {type.ageRange}
                </p>
                <p className="flex items-center">
                  <span className="mr-2">📚</span>
                  {type.level}
                </p>
                <p className="flex items-center">
                  <span className="mr-2">📝</span>
                  {type.vocabulary}
                </p>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute bottom-4 right-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                    <span className="text-white">✓</span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mode Selection - HIDDEN, default to flexible */}
      {/* Cambridge mode is hidden for now */}

      {/* Exam Info Form */}
      <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6">
        <h3 className="mb-4 font-baloo text-xl font-bold text-gray-800">
          Thông tin đề thi
        </h3>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Tên đề thi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={examData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="VD: Cambridge YLE Starters - Test 1"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              value={examData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Mô tả ngắn về đề thi này..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Thời gian làm bài (phút)
            </label>
            <input
              type="number"
              value={examData.duration}
              onChange={(e) =>
                handleInputChange('duration', parseInt(e.target.value))
              }
              min="15"
              max="180"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex items-center space-x-2 rounded-lg px-6 py-3 font-medium transition-all ${
            canProceed
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
              : 'cursor-not-allowed bg-gray-300 text-gray-500'
          }`}
        >
          <span>Tiếp theo</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Step1ExamType;
