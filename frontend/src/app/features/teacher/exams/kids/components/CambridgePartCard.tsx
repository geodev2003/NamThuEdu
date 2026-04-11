import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SubPart {
  partNumber: number;
  name: string;
  description: string;
  questions?: number;
  taskType?: string;
  icon?: string;
}

interface CambridgePartCardProps {
  partId: number;
  name: string;
  icon: string;
  totalQuestions?: number;
  duration?: string;
  subParts: SubPart[];
  questionsCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  onSubPartClick: (subPart: SubPart) => void;
  getSubPartQuestionCount: (subPartNumber: number) => number;
}

const CambridgePartCard: React.FC<CambridgePartCardProps> = ({
  partId,
  name,
  icon,
  totalQuestions,
  duration,
  subParts,
  questionsCount,
  isExpanded,
  onToggle,
  onSubPartClick,
  getSubPartQuestionCount,
}) => {
  return (
    <div className="rounded-2xl border-4 border-indigo-200 bg-white shadow-lg overflow-hidden">
      {/* Header - Clickable to expand/collapse */}
      <button
        onClick={onToggle}
        className="w-full p-6 text-left transition-all hover:bg-indigo-50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{icon}</span>
            <div>
              <h3 className="font-baloo text-xl font-bold text-indigo-600">
                Phần {partId}: {name}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                {totalQuestions && (
                  <span>📝 {totalQuestions} câu</span>
                )}
                {duration && (
                  <span>⏱️ {duration}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {questionsCount > 0 && (
              <div className="rounded-full bg-green-100 px-4 py-2">
                <span className="font-bold text-green-700">
                  ✓ {questionsCount} câu
                </span>
              </div>
            )}
            {isExpanded ? (
              <ChevronUp className="h-6 w-6 text-indigo-600" />
            ) : (
              <ChevronDown className="h-6 w-6 text-indigo-600" />
            )}
          </div>
        </div>
      </button>

      {/* Sub-parts - Show when expanded */}
      {isExpanded && (
        <div className="border-t-2 border-indigo-100 bg-indigo-50 p-4 space-y-3">
          {subParts.map((subPart) => {
            const subPartQuestionsCount = getSubPartQuestionCount(subPart.partNumber);
            const hasQuestions = subPartQuestionsCount > 0;

            return (
              <button
                key={subPart.partNumber}
                onClick={() => onSubPartClick(subPart)}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${
                  hasQuestions
                    ? 'border-green-300 bg-green-50 hover:border-green-400'
                    : 'border-gray-200 bg-white hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {subPart.icon && <span className="text-2xl">{subPart.icon}</span>}
                      <h4 className="font-baloo text-lg font-bold text-gray-800">
                        {subPart.name}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {subPart.description}
                    </p>
                    {subPart.questions && (
                      <p className="text-xs text-gray-500">
                        💡 Gợi ý Cambridge: {subPart.questions} câu
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    {hasQuestions ? (
                      <div className="rounded-full bg-green-500 px-3 py-1">
                        <span className="text-sm font-bold text-white">
                          ✓ {subPartQuestionsCount}
                        </span>
                      </div>
                    ) : (
                      <div className="rounded-lg bg-indigo-500 px-4 py-2 text-white font-medium hover:bg-indigo-600 transition-colors">
                        + Thêm
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CambridgePartCard;
