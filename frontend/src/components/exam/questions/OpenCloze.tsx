import { getFullMediaUrl } from '../../../utils/mediaUtils';

interface OpenClozeProps {
  question: any;
  taskData: any;
  interactiveMode: boolean;
  userAnswer?: any;
  onAnswerChange?: (answer: any) => void;
}

export function OpenCloze({
  question,
  taskData,
  interactiveMode,
  userAnswer,
  onAnswerChange
}: OpenClozeProps) {
  const realTaskData = taskData.task_data || taskData;
  const config = taskData.config || realTaskData.config || {};
  
  const text = realTaskData?.text || config?.text || realTaskData?.story || config?.story;
  const gaps = realTaskData?.gaps || config?.gaps || [];
  const instructions = realTaskData?.instructions || config?.instructions;
  
  return (
    <div className="space-y-4">
      {/* Instructions */}
      {instructions && (
        <div className="p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
          <p className="text-indigo-900 font-medium text-lg">✍️ {instructions}</p>
        </div>
      )}
      
      {/* Text with gaps - students type their own answers */}
      {text && text !== 'kids_task' && (
        <div className="p-5 bg-white rounded-xl border-3 border-indigo-200 shadow-md">
          <div className="text-gray-700 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      )}
      
      {/* Gap inputs */}
      {gaps.length > 0 ? (
        <div className="space-y-4">
          {gaps.map((gap: any, idx: number) => {
            const gapNumber = gap.gap_number || gap.gapNumber || idx + 1;
            const hint = gap.hint || gap.clue || '';
            
            return (
              <div key={idx} className="p-5 bg-white rounded-xl border-3 border-indigo-200 shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                    {gapNumber}
                  </span>
                  <div className="flex-1">
                    {hint && (
                      <p className="text-sm text-gray-600 mb-2">{hint}</p>
                    )}
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg font-medium"
                      placeholder="Nhập câu trả lời..."
                      disabled={!interactiveMode}
                      value={userAnswer?.[idx] || ''}
                      onChange={(e) => {
                        if (onAnswerChange) {
                          onAnswerChange({
                            ...userAnswer,
                            [idx]: e.target.value
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 bg-yellow-50 rounded-lg border-2 border-yellow-300">
          <p className="text-yellow-800 font-medium">⚠️ Không tìm thấy gaps cho task này</p>
        </div>
      )}
    </div>
  );
}
