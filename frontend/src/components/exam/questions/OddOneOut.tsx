import { getFullMediaUrl } from '../../../utils/mediaUtils';

interface OddOneOutProps {
  question: any;
  taskData: any;
  interactiveMode: boolean;
  userAnswer?: any;
  onAnswerChange?: (answer: any) => void;
}

export function OddOneOut({
  question,
  taskData,
  interactiveMode,
  userAnswer,
  onAnswerChange
}: OddOneOutProps) {
  const realTaskData = taskData.task_data || taskData;
  const config = taskData.config || realTaskData.config || {};
  
  const images = realTaskData?.images || config?.images || [];
  
  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((img: any, idx: number) => (
            <div key={idx} className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <img 
                src={getFullMediaUrl(img.url || img)} 
                alt={`Picture ${idx + 1}`} 
                className="w-full h-auto"
              />
              {img.label && (
                <div className="p-2 bg-gray-100 text-center font-medium">
                  {img.label}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
        <p className="text-orange-900 font-medium">{question.qContent}</p>
      </div>
    </div>
  );
}
