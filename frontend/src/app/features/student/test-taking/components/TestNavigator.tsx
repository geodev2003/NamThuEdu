import { CheckCircle2, Flag, MapPin } from "lucide-react";

interface TestNavigatorProps {
  questions: any[];
  currentQuestionIndex: number;
  answers: Record<string, any>;
  flaggedAnswers: Record<string, boolean>;
  onNavigate: (index: number) => void;
  onFlagToggle?: (questionId: string) => void;
}

export function TestNavigator({
  questions,
  currentQuestionIndex,
  answers,
  flaggedAnswers,
  onNavigate,
  onFlagToggle
}: TestNavigatorProps) {
  
  if (!questions || questions.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl h-full flex flex-col" 
         style={{ border: "1.5px solid #F0EEFF", boxShadow: "0 4px 20px rgba(124,58,237,0.03)" }}>
      
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 text-sm">Điều hướng câu hỏi</h3>
        <div className="flex gap-4 mt-3 text-xs">
           <div className="flex items-center gap-1.5 text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-200"></span> Chưa làm
           </div>
           <div className="flex items-center gap-1.5 text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Đã làm
           </div>
           <div className="flex items-center gap-1.5 text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> Xem lại
           </div>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto min-h-[200px] scrollbar-hide">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isFlagged = flaggedAnswers[q.id];
            const isActive = currentQuestionIndex === idx;

            return (
              <button
                key={q.id || idx}
                onClick={() => onNavigate(idx)}
                className="relative w-full aspect-square rounded-xl flex items-center justify-center font-bold text-sm transition-all"
                style={{
                  background: isActive ? '#E0E7FF' : isAnswered ? '#DBEAFE' : '#F3F4F6',
                  color: isActive ? '#4338CA' : isAnswered ? '#2563EB' : '#6B7280',
                  border: isActive ? '2px solid #4F46E5' : '2px solid transparent'
                }}
              >
                {idx + 1}
                {isFlagged && (
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full border-2 border-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Current question flag action */}
      {onFlagToggle && questions[currentQuestionIndex] && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
           <button 
             onClick={() => onFlagToggle(questions[currentQuestionIndex].id)}
             className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition hover:bg-gray-200"
             style={{ 
               background: flaggedAnswers[questions[currentQuestionIndex].id] ? '#FEF3C7' : '#E5E7EB',
               color: flaggedAnswers[questions[currentQuestionIndex].id] ? '#D97706' : '#4B5563'
             }}
           >
             <Flag className="w-4 h-4" /> 
             {flaggedAnswers[questions[currentQuestionIndex].id] ? "Bỏ cờ đánh dấu" : "Đánh dấu xem lại"}
           </button>
        </div>
      )}
    </div>
  );
}
