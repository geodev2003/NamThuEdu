import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: 'Chọn loại đề thi' },
  { number: 2, label: 'Thêm câu hỏi' },
  { number: 3, label: 'Xem trước' },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          {/* Step Circle */}
          <div className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
                currentStep > step.number
                  ? 'bg-emerald-500 text-white'
                  : currentStep === step.number
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'border-2 border-slate-200 bg-white text-slate-400'
              }`}
            >
              {currentStep > step.number ? (
                <Check className="h-4 w-4" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={`ml-2 text-sm font-medium ${
                currentStep === step.number
                  ? 'text-orange-600'
                  : currentStep > step.number
                  ? 'text-emerald-600'
                  : 'text-slate-400'
              }`}
            >
              {step.label}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`mx-3 h-0.5 w-12 transition-colors ${
                currentStep > step.number ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
