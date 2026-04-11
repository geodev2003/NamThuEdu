import { getFullMediaUrl } from '../../../utils/mediaUtils';

interface ClozeTestProps {
  question: any;
  taskData: any;
  interactiveMode: boolean;
  userAnswer?: any;
  onAnswerChange?: (answer: any) => void;
}

export function ClozeTest({
  question,
  taskData,
  interactiveMode,
  userAnswer,
  onAnswerChange
}: ClozeTestProps) {
  const realTaskData = taskData.task_data || taskData;
  const config = taskData.config || realTaskData.config || {};
  
  const text = realTaskData?.text || config?.text || realTaskData?.story || config?.story;
  const questions = realTaskData?.questions || config?.questions || [];
  const instructions = realTaskData?.instructions || config?.instructions;
  
  return (
    <div className="space-y-4">
      {/* Instructions */}
      {instructions && (
        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <p className="text-purple-900 font-medium text-lg">📄 {instructions}</p>
        </div>
      )}
      
      {/* Text with gaps */}
      {text && text !== 'kids_task' && (
        <div className="p-5 bg-white rounded-xl border-3 border-purple-200 shadow-md">
          <div className="text-gray-700 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      )}
      
      {/* Questions with multiple choice options */}
      {questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((q: any, idx: number) => {
            const gapNumber = q.gap_number || q.gapNumber || idx + 1;
            const options = q.options || [];
            const questionText = q.text || q.question || `Gap ${gapNumber}`;
            
            return (
              <div key={idx} className="p-5 bg-white rounded-xl border-3 border-purple-200 shadow-md">
                <p className="font-medium mb-4 text-gray-800 text-lg">
                  {gapNumber}. {questionText}
                </p>
                
                {/* Multiple choice options */}
                <div className="flex flex-col gap-3">
                  {options.map((option: string, optIdx: number) => (
                    <button
                      key={optIdx}
                      className={`px-4 py-3 rounded-lg border-2 text-left font-medium transition-all ${
                        userAnswer?.[idx] === option
                          ? 'bg-purple-500 text-white border-purple-600'
                          : 'bg-white text-gray-800 border-purple-300 hover:bg-purple-50'
                      }`}
                      disabled={!interactiveMode}
                      onClick={() => {
                        if (onAnswerChange) {
                          onAnswerChange({
                            ...userAnswer,
                            [idx]: option
                          });
                        }
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 bg-yellow-50 rounded-lg border-2 border-yellow-300">
          <p className="text-yellow-800 font-medium">⚠️ Không tìm thấy questions cho task này</p>
        </div>
      )}
    </div>
  );
}
