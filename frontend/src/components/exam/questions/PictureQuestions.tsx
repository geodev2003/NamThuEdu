import { getFullMediaUrl } from '../../../utils/mediaUtils';

interface PictureQuestionsProps {
  question: any;
  taskData: any;
  interactiveMode?: boolean;
  userAnswer?: any;
  onAnswerChange?: (answer: any) => void;
}

export function PictureQuestions({ 
  question, 
  taskData, 
  interactiveMode = false,
  userAnswer = {},
  onAnswerChange 
}: PictureQuestionsProps) {
  const realTaskData = taskData.task_data || taskData;
  const config = taskData.config || realTaskData.config || {};
  
  const instructions = taskData.instructions || realTaskData.instructions || config.instructions;
  const questions = realTaskData?.questions || config?.questions || realTaskData?.items || config?.items || [];
  const imageUrl = realTaskData?.imageUrl || realTaskData?.image_url || config?.imageUrl || config?.image_url;

  return (
    <div className="space-y-4">
      {/* Instructions */}
      {instructions && (
        <div className="p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
          <p className="text-indigo-900 font-medium text-lg">🖼️ {instructions}</p>
        </div>
      )}
      
      {/* Main Image */}
      {imageUrl && (
        <div className="border-4 border-indigo-300 rounded-xl overflow-hidden bg-white shadow-lg">
          <img 
            src={getFullMediaUrl(imageUrl)} 
            alt="Picture Questions" 
            className="w-full h-auto object-contain"
            style={{ maxHeight: '600px' }}
          />
        </div>
      )}
      
      {/* Questions */}
      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((q: any, idx: number) => {
            const questionText = q.text || q.question || q.questionText || `Question ${idx + 1}`;
            const questionImageUrl = q.imageUrl || q.image_url || q.image;
            
            return (
              <div key={idx} className="p-5 bg-white rounded-xl border-3 border-indigo-200 shadow-md">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <div className="flex-1 space-y-3">
                    {/* Question Image */}
                    {questionImageUrl && (
                      <div className="border-3 border-indigo-200 rounded-lg overflow-hidden bg-gray-50">
                        <img 
                          src={getFullMediaUrl(questionImageUrl)} 
                          alt={`Question ${idx + 1}`} 
                          className="w-full h-auto object-contain"
                          style={{ maxHeight: '200px' }}
                        />
                      </div>
                    )}
                    
                    <p className="font-medium text-lg text-gray-800">{questionText}</p>
                    
                    {/* Answer input */}
                    {interactiveMode && (
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
                        placeholder="Câu trả lời..."
                        value={userAnswer[idx] || ''}
                        onChange={(e) => {
                          if (onAnswerChange) {
                            onAnswerChange({ ...userAnswer, [idx]: e.target.value });
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
