import { getFullMediaUrl } from '../../../utils/mediaUtils';

interface InformationExchangeProps {
  question: any;
  taskData: any;
  interactiveMode: boolean;
  userAnswer?: any;
  onAnswerChange?: (answer: any) => void;
}

export function InformationExchange({
  question,
  taskData,
  interactiveMode,
  userAnswer,
  onAnswerChange
}: InformationExchangeProps) {
  const realTaskData = taskData.task_data || taskData;
  const config = taskData.config || realTaskData.config || {};
  
  const instructions = realTaskData?.instructions || config?.instructions;
  const imageUrl = realTaskData?.imageUrl || config?.imageUrl || realTaskData?.image_url || config?.image_url;
  const questions = realTaskData?.questions || config?.questions || [];
  
  return (
    <div className="space-y-4">
      {/* Instructions */}
      {instructions && (
        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <p className="text-green-900 font-medium text-lg">💬 {instructions}</p>
        </div>
      )}
      
      {/* Main Image */}
      {imageUrl && (
        <div className="border-4 border-green-300 rounded-xl overflow-hidden bg-white shadow-lg">
          <img 
            src={getFullMediaUrl(imageUrl)} 
            alt="Information Exchange" 
            className="w-full h-auto object-contain"
            style={{ maxHeight: '500px' }}
            onError={() => {
              console.error('❌ Information exchange image failed to load:', imageUrl);
            }}
          />
        </div>
      )}
      
      {/* Questions */}
      {questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((q: any, idx: number) => {
            const questionText = q.text || q.question || q.questionText;
            
            return (
              <div key={idx} className="p-5 bg-white rounded-xl border-3 border-green-200 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <div className="flex-1 space-y-3">
                    <p className="font-medium text-lg text-gray-800">{questionText}</p>
                    
                    {/* Input field for answer */}
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg font-medium"
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
          <p className="text-yellow-800 font-medium">⚠️ Không tìm thấy questions cho task này</p>
        </div>
      )}
    </div>
  );
}
