import { getFullMediaUrl } from '../../../utils/mediaUtils';

interface ObjectPlacementProps {
  question: any;
  taskData: any;
  interactiveMode?: boolean;
  userAnswer?: any;
  onAnswerChange?: (answer: any) => void;
}

export function ObjectPlacement({ 
  question, 
  taskData, 
  interactiveMode = false,
  userAnswer = {},
  onAnswerChange 
}: ObjectPlacementProps) {
  const realTaskData = taskData.task_data || taskData;
  const config = taskData.config || realTaskData.config || {};
  
  const instructions = taskData.instructions || realTaskData.instructions || config.instructions;
  const items = realTaskData?.items || config?.items || [];
  const imageUrl = realTaskData?.imageUrl || realTaskData?.image_url || config?.imageUrl || config?.image_url;

  return (
    <div className="space-y-4">
      {/* Instructions */}
      {instructions && (
        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <p className="text-purple-900 font-medium text-lg">📍 {instructions}</p>
        </div>
      )}
      
      {/* Main Image */}
      {imageUrl && (
        <div className="border-4 border-purple-300 rounded-xl overflow-hidden bg-white shadow-lg">
          <img 
            src={getFullMediaUrl(imageUrl)} 
            alt="Object Placement" 
            className="w-full h-auto object-contain"
            style={{ maxHeight: '600px' }}
          />
        </div>
      )}
      
      {/* Items to place */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item: any, idx: number) => {
            const itemImageUrl = item.imageUrl || item.image_url || item.image;
            const itemName = item.name || item.text || item.label || `Item ${idx + 1}`;
            
            return (
              <div key={idx} className="p-4 bg-white rounded-lg border-2 border-purple-300 shadow-md">
                {itemImageUrl && (
                  <img 
                    src={getFullMediaUrl(itemImageUrl)} 
                    alt={itemName} 
                    className="w-full h-32 object-contain mb-2"
                  />
                )}
                <p className="text-center font-medium text-purple-900">{itemName}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
