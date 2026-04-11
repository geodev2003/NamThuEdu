import { getFullMediaUrl } from '../../../utils/mediaUtils';

interface UnscrambleWordsProps {
  question: any;
  taskData: any;
  interactiveMode: boolean;
  userAnswer?: any;
  onAnswerChange?: (answer: any) => void;
}

export function UnscrambleWords({
  question,
  taskData,
  interactiveMode,
  userAnswer,
  onAnswerChange
}: UnscrambleWordsProps) {
  const realTaskData = taskData.task_data || taskData;
  const config = taskData.config || realTaskData.config || {};
  
  const items = realTaskData?.items || config?.items || [];
  const instructions = realTaskData?.instructions || config?.instructions;
  
  return (
    <div className="space-y-4">
      {/* Instructions */}
      {instructions && (
        <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
          <p className="text-orange-900 font-medium text-lg">🔤 {instructions}</p>
        </div>
      )}
      
      {/* Unscramble items */}
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item: any, idx: number) => {
            const itemImageUrl = item.imageUrl || item.image_url || item.image;
            const scrambledWord = item.scrambled_word || item.scrambledWord || item.scrambled;
            const isExample = item.isExample || item.is_example;
            
            return (
              <div key={idx} className="p-5 bg-white rounded-xl border-3 border-orange-200 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <div className="flex-1 space-y-3">
                    {/* Item Image */}
                    {itemImageUrl && (
                      <div className="border-3 border-orange-200 rounded-lg overflow-hidden bg-gray-50">
                        <img 
                          src={getFullMediaUrl(itemImageUrl)} 
                          alt={`Item ${idx + 1}`} 
                          className="w-full h-auto object-contain"
                          style={{ maxHeight: '200px' }}
                          onError={(e) => {
                            console.error(`❌ Unscramble item ${idx + 1} image failed to load:`, itemImageUrl);
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Scrambled letters */}
                    {scrambledWord && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gray-600 font-medium">Chữ cái:</span>
                        {scrambledWord.split('').map((letter: string, letterIdx: number) => (
                          <span 
                            key={letterIdx}
                            className="w-10 h-10 bg-orange-100 border-2 border-orange-300 rounded-lg flex items-center justify-center font-bold text-lg text-orange-900"
                          >
                            {letter}
                          </span>
                        ))}
                        {isExample && (
                          <span className="ml-2 text-amber-600 font-bold">📌 (Ví dụ)</span>
                        )}
                      </div>
                    )}
                    
                    {/* Input field for answer */}
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-medium">Từ đúng:</span>
                      <input 
                        type="text" 
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-lg font-medium"
                        placeholder="Nhập từ đã sắp xếp..."
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
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 bg-yellow-50 rounded-lg border-2 border-yellow-300">
          <p className="text-yellow-800 font-medium">⚠️ Không tìm thấy items cho task này</p>
        </div>
      )}
    </div>
  );
}
