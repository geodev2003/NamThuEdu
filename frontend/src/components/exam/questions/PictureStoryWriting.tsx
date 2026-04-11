import { getFullMediaUrl } from '../../../utils/mediaUtils';

interface PictureStoryWritingProps {
  question: any;
  taskData: any;
  interactiveMode: boolean;
  userAnswer?: any;
  onAnswerChange?: (answer: any) => void;
}

export function PictureStoryWriting({
  question,
  taskData,
  interactiveMode,
  userAnswer,
  onAnswerChange
}: PictureStoryWritingProps) {
  const realTaskData = taskData.task_data || taskData;
  const config = taskData.config || realTaskData.config || {};
  
  const images = realTaskData?.images || config?.images || realTaskData?.story_images || config?.story_images || [];
  const instructions = realTaskData?.instructions || config?.instructions;
  const minWords = realTaskData?.min_words || config?.min_words || 20;
  const maxWords = realTaskData?.max_words || config?.max_words || 50;
  
  return (
    <div className="space-y-4">
      {/* Instructions */}
      {instructions && (
        <div className="p-4 bg-pink-50 rounded-lg border-2 border-pink-200">
          <p className="text-pink-900 font-medium text-lg">📖 {instructions}</p>
        </div>
      )}
      
      {/* Story images in sequence */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img: any, idx: number) => {
            const imageUrl = img.url || img.imageUrl || img.image_url || img;
            
            return (
              <div key={idx} className="border-4 border-pink-300 rounded-xl overflow-hidden bg-white shadow-lg">
                <div className="p-2 bg-pink-500 text-white text-center font-bold">
                  {idx + 1}
                </div>
                <img 
                  src={getFullMediaUrl(imageUrl)} 
                  alt={`Story ${idx + 1}`} 
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: '150px' }}
                  onError={() => {
                    console.error(`❌ Story image ${idx + 1} failed to load:`, imageUrl);
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
      
      {/* Writing area */}
      <div className="p-5 bg-white rounded-xl border-3 border-pink-200 shadow-md">
        <p className="text-sm font-bold text-pink-900 mb-3">
          ✍️ Viết câu chuyện ({minWords}-{maxWords} từ):
        </p>
        <textarea
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none text-lg resize-none"
          rows={8}
          placeholder={`Nhìn vào các tranh và viết câu chuyện (${minWords}-${maxWords} từ)...`}
          disabled={!interactiveMode}
          value={userAnswer?.story || ''}
          onChange={(e) => {
            if (onAnswerChange) {
              onAnswerChange({
                ...userAnswer,
                story: e.target.value
              });
            }
          }}
        />
        {userAnswer?.story && (
          <p className="text-sm text-gray-600 mt-2">
            Số từ: {userAnswer.story.split(/\s+/).filter((w: string) => w).length}
          </p>
        )}
      </div>
      
      {images.length === 0 && (
        <div className="p-6 bg-yellow-50 rounded-lg border-2 border-yellow-300">
          <p className="text-yellow-800 font-medium">⚠️ Không tìm thấy story images cho task này</p>
        </div>
      )}
    </div>
  );
}
