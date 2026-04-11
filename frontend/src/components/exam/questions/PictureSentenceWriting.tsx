import { getFullMediaUrl } from '../../../utils/mediaUtils';

interface PictureSentenceWritingProps {
  question: any;
  taskData: any;
  interactiveMode: boolean;
  userAnswer?: any;
  onAnswerChange?: (answer: any) => void;
}

export function PictureSentenceWriting({
  question,
  taskData,
  interactiveMode,
  userAnswer,
  onAnswerChange
}: PictureSentenceWritingProps) {
  const realTaskData = taskData.task_data || taskData;
  const config = taskData.config || realTaskData.config || {};
  
  const images = realTaskData?.images || config?.images || [];
  const instructions = realTaskData?.instructions || config?.instructions;
  const minWords = realTaskData?.min_words || config?.min_words || 5;
  
  return (
    <div className="space-y-4">
      {/* Instructions */}
      {instructions && (
        <div className="p-4 bg-teal-50 rounded-lg border-2 border-teal-200">
          <p className="text-teal-900 font-medium text-lg">✍️ {instructions}</p>
        </div>
      )}
      
      {/* Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img: any, idx: number) => {
            const imageUrl = img.url || img.imageUrl || img.image_url || img;
            
            return (
              <div key={idx} className="border-4 border-teal-300 rounded-xl overflow-hidden bg-white shadow-lg">
                <img 
                  src={getFullMediaUrl(imageUrl)} 
                  alt={`Picture ${idx + 1}`} 
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: '200px' }}
                  onError={() => {
                    console.error(`❌ Picture ${idx + 1} failed to load:`, imageUrl);
                  }}
                />
                <div className="p-3 bg-teal-50">
                  <p className="text-sm font-bold text-teal-900 mb-2">Viết câu mô tả:</p>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none text-base resize-none"
                    rows={3}
                    placeholder={`Viết ít nhất ${minWords} từ...`}
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
            );
          })}
        </div>
      )}
      
      {images.length === 0 && (
        <div className="p-6 bg-yellow-50 rounded-lg border-2 border-yellow-300">
          <p className="text-yellow-800 font-medium">⚠️ Không tìm thấy images cho task này</p>
        </div>
      )}
    </div>
  );
}
