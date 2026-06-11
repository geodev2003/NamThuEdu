import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: 'Cấu hình đề thi' },
  { number: 2, label: 'Soạn thảo câu hỏi' },
  { number: 3, label: 'Kiểm tra & Xuất bản' },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center w-full max-w-2xl justify-between relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-200 -translate-y-1/2 z-0" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-indigo-500 -translate-y-1/2 transition-all duration-500 z-0"
          style={{ 
            width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' 
          }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          
          return (
            <div key={step.number} className="flex flex-col items-center relative z-10 bg-[#F8FAFC] px-4">
              {/* Step Circle */}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 border-2 ${
                  isCompleted
                    ? 'bg-indigo-500 border-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                    : isActive
                    ? 'bg-white border-indigo-500 text-indigo-600 shadow-md shadow-indigo-500/10'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : (
                  step.number
                )}
              </div>
              
              {/* Step Label */}
              <span
                className={`mt-2 text-xs font-semibold tracking-wide transition-colors duration-300 ${
                  isActive
                    ? 'text-indigo-600'
                    : isCompleted
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
