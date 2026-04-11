import { getFullMediaUrl } from '../../../utils/mediaUtils';

interface PictureCardQuestionsProps {
  question: any;
  taskData: any;
  interactiveMode: boolean;
  userAnswer?: any;
  onAnswerChange?: (answer: any) => void;
}

export function PictureCardQuestions({
  question,
  taskData,
  interactiveMode,
  userAnswer,
  onAnswerChange
}: PictureCardQuestionsProps) {
  const realTaskData = taskData.task_data || taskData;
  const config = taskData.config || realTaskData.config || {};
  
  const cards = realTaskData?.cards || config?.cards || [];
  const instructions = realTaskData?.instructions || config?.instructions;
  
  return (
    <div className="space-y-4">
      {/* Instructions */}
      {instructions && (
        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <p className="text-purple-900 font-medium text-lg">🎴 {instructions}</p>
        </div>
      )}
      
      {/* Picture cards */}
      {cards.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cards.map((card: any, idx: number) => {
            const cardImageUrl = card.imageUrl || card.image_url || card.image;
            const cardText = card.text || card.label || card.name;
            
            return (
              <div key={idx} className="p-4 bg-white rounded-xl border-3 border-purple-200 shadow-md hover:shadow-lg transition-shadow">
                {/* Card Image */}
                {cardImageUrl && (
                  <div className="border-3 border-purple-200 rounded-lg overflow-hidden bg-gray-50 mb-3">
                    <img 
                      src={getFullMediaUrl(cardImageUrl)} 
                      alt={`Card ${idx + 1}`} 
                      className="w-full h-auto object-contain"
                      style={{ maxHeight: '200px' }}
                      onError={(e) => {
                        console.error(`❌ Card ${idx + 1} image failed to load:`, cardImageUrl);
                      }}
                    />
                  </div>
                )}
                
                {/* Card Text */}
                {cardText && (
                  <p className="text-center font-medium text-gray-800">{cardText}</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 bg-yellow-50 rounded-lg border-2 border-yellow-300">
          <p className="text-yellow-800 font-medium">⚠️ Không tìm thấy cards cho task này</p>
        </div>
      )}
    </div>
  );
}
