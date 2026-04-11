import { Volume2 } from 'lucide-react';
import { getFullMediaUrl } from '../../../utils/mediaUtils';

interface ListenColourWriteProps {
  question: any;
  taskData: any;
  interactiveMode: boolean;
  userAnswer?: any;
  onAnswerChange?: (answer: any) => void;
}

export function ListenColourWrite({
  question,
  taskData,
  interactiveMode,
  userAnswer,
  onAnswerChange
}: ListenColourWriteProps) {
  const realTaskData = taskData.task_data || taskData;
  const config = taskData.config || realTaskData.config || {};
  
  const items = realTaskData?.items || config?.items || [];
  const instructions = realTaskData?.instructions || config?.instructions;
  const audioUrl = realTaskData?.audioUrl || config?.audioUrl || realTaskData?.audio_url || config?.audio_url;
  const imageUrl = realTaskData?.imageUrl || config?.imageUrl || realTaskData?.image_url || config?.image_url;
  
  const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white'];
  
  return (
    <div className="space-y-4">
      {/* Instructions */}
      {instructions && (
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <p className="text-blue-900 font-medium text-lg">🎨 {instructions}</p>
        </div>
      )}
      
      {/* Audio */}
      {audioUrl && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <Volume2 className="w-6 h-6 text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">🎧 Audio Instructions</p>
            <audio controls className="w-full mt-2">
              <source src={getFullMediaUrl(audioUrl)} type="audio/mpeg" />
            </audio>
          </div>
        </div>
      )}
      
      {/* Main Image */}
      {imageUrl && (
        <div className="border-4 border-blue-300 rounded-xl overflow-hidden bg-white shadow-lg">
          <img 
            src={getFullMediaUrl(imageUrl)} 
            alt="Colour and Write" 
            className="w-full h-auto object-contain"
            style={{ maxHeight: '500px' }}
            onError={() => {
              console.error('❌ Listen colour write image failed to load:', imageUrl);
            }}
          />
        </div>
      )}
      
      {/* Items to colour */}
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item: any, idx: number) => {
            const objectName = item.object || item.name || item.text;
            const isExample = item.isExample || item.is_example;
            
            return (
              <div key={idx} className="p-5 bg-white rounded-xl border-3 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <div className="flex-1 space-y-3">
                    <p className="font-medium text-lg text-gray-800">
                      {objectName}
                      {isExample && <span className="ml-2 text-amber-600 font-bold">📌 (Ví dụ)</span>}
                    </p>
                    
                    {/* Color selection */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-gray-600 font-medium">Chọn màu:</span>
                      {colors.map((color) => (
                        <button
                          key={color}
                          className={`w-12 h-12 rounded-lg border-2 transition-all ${
                            userAnswer?.[idx] === color
                              ? 'border-blue-600 scale-110'
                              : 'border-gray-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                          disabled={!interactiveMode}
                          onClick={() => {
                            if (onAnswerChange) {
                              onAnswerChange({
                                ...userAnswer,
                                [idx]: color
                              });
                            }
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                    
                    {/* Show selected color */}
                    {userAnswer?.[idx] && (
                      <p className="text-sm text-gray-600">
                        Đã chọn: <span className="font-bold capitalize">{userAnswer[idx]}</span>
                      </p>
                    )}
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
