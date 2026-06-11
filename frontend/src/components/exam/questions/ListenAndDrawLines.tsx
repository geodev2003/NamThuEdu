import { Volume2 } from 'lucide-react';
import { QuestionRendererProps } from '../../../types/exam';
import { extractTaskData } from '../../../utils/examDataExtractor';
import { getFullMediaUrl } from '../../../utils/mediaUtils';

export function ListenAndDrawLines({
  question,
  mode,
  answer = {},
  onAnswer,
  imageRefs,
  labelRefs,
  onSetImageRef,
  onSetLabelRef,
  onResetQuestion
}: QuestionRendererProps) {
  const taskData = extractTaskData(question);
  const { instructions, imageUrl, audioUrl, items = [] } = taskData;
  const isInteractive = mode === 'student';
  const imageRef = imageRefs?.[question.qId];
  const matchingMode: string =
    (taskData as any).matchingMode ||
    taskData.config?.matchingMode ||
    (items[0]?.hotspot ? 'drag-to-image' : items[0]?.targetLabel ? 'drag-to-list' : 'drag-to-image');

  const handleDragStart = (e: React.DragEvent, itemIndex: number) => {
    e.dataTransfer.setData('questionId', question.qId.toString());
    e.dataTransfer.setData('itemIndex', itemIndex.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const draggedQuestionId = parseInt(e.dataTransfer.getData('questionId'));
    const draggedItemIndex = parseInt(e.dataTransfer.getData('itemIndex'));

    if (draggedQuestionId === question.qId && onAnswer) {
      onAnswer({
        ...answer,
        [draggedItemIndex]: targetIndex
      });
    }
  };

  const handleHotspotClick = (hotspotIndex: number) => {
    if (!isInteractive || !onAnswer) return;

    // Find which label is connected to this hotspot
    const labelIndex = Object.keys(answer).find(
      key => answer[parseInt(key)] === hotspotIndex
    );

    if (labelIndex) {
      // Remove the connection
      const newAnswers = { ...answer };
      delete newAnswers[parseInt(labelIndex)];
      onAnswer(newAnswers);
    }
  };

  return (
    <div className="space-y-4">
      {/* Instructions */}
      {instructions && (
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <p className="text-blue-900 font-medium text-lg">{instructions}</p>
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
      
      {/* Interactive Mode Toggle */}
      {isInteractive && onResetQuestion && (
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-2 border-green-300">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <span className="font-bold text-green-800">Chế độ tương tác - Kéo thả để làm bài!</span>
          </div>
          <button
            onClick={() => onResetQuestion(question.qId)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            🔄 Reset câu này
          </button>
        </div>
      )}
      
      {/* Draw lines interactive area */}
      {items && Array.isArray(items) && items.length > 0 && items[0]?.hotspot && (
        <div 
          className="rounded-lg border-2 border-indigo-200 bg-gray-50 p-8 relative" 
          style={{ minHeight: '600px' }}
        >
          <div className="relative p-16" style={{ display: 'inline-block', minWidth: '100%' }}>
            {/* Image with hotspots */}
            <div className="relative inline-block" style={{ marginLeft: '-40px', zIndex: 2 }}>
              {imageUrl && (
                <img 
                  ref={(el) => {
                    if (el && onSetImageRef && imageRefs?.[question.qId] !== el) {
                      onSetImageRef(question.qId, el);
                    }
                  }}
                  src={getFullMediaUrl(imageUrl)} 
                  alt="Question" 
                  className="block max-w-full h-auto"
                />
              )}
              
              {/* SVG for drawing lines */}
              {imageRef && (
                <svg 
                  className="absolute pointer-events-none" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    zIndex: 10,
                    top: 0,
                    left: 0
                  }}
                >
                  <defs>
                    <marker
                      id={`arrowhead-${question.qId}`}
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3, 0 6" fill="#22c55e" />
                    </marker>
                  </defs>
                  {/* Draw lines for matched items */}
                  {Object.entries(answer).map(([labelIdx, hotspotIdx]) => {
                    const labelItem = items[parseInt(labelIdx)];
                    const hotspotItem = items[hotspotIdx as number];
                    
                    if (!labelItem?.labelPosition || !hotspotItem?.hotspot) return null;
                    
                    const imgRect = imageRef.getBoundingClientRect();
                    const labelKey = `${question.qId}-${labelIdx}`;
                    const labelElement = labelRefs?.[labelKey];
                    
                    if (!labelElement) return null;
                    
                    const labelRect = labelElement.getBoundingClientRect();
                    const labelCenterX = labelRect.left + labelRect.width / 2 - imgRect.left;
                    const labelCenterY = labelRect.top + labelRect.height / 2 - imgRect.top;
                    const hotspotX = (hotspotItem.hotspot.x / 100) * imgRect.width;
                    const hotspotY = (hotspotItem.hotspot.y / 100) * imgRect.height;
                    
                    return (
                      <line
                        key={`line-${labelIdx}-${hotspotIdx}`}
                        x1={labelCenterX}
                        y1={labelCenterY}
                        x2={hotspotX}
                        y2={hotspotY}
                        stroke="#22c55e"
                        strokeWidth="4"
                        markerEnd={`url(#arrowhead-${question.qId})`}
                      />
                    );
                  })}
                </svg>
              )}
              
              {/* Hotspot markers */}
              {items.map((item: any, idx: number) => {
                const isMatched = Object.values(answer).includes(idx);
                const matchedItemIndex = Object.keys(answer).find(
                  key => answer[parseInt(key)] === idx
                );
                
                return item.hotspot && (
                  <div
                    key={`hotspot-${idx}`}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${isInteractive ? 'cursor-pointer hover:scale-110' : 'pointer-events-none'} transition-all`}
                    style={{
                      left: `${item.hotspot.x}%`,
                      top: `${item.hotspot.y}%`,
                      zIndex: 20,
                    }}
                    onDragOver={isInteractive ? handleDragOver : undefined}
                    onDrop={isInteractive ? (e) => handleDrop(e, idx) : undefined}
                    onClick={isInteractive ? () => handleHotspotClick(idx) : undefined}
                  >
                    <div className={`w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-all ${
                      isMatched 
                        ? 'bg-green-500 animate-bounce' 
                        : 'bg-red-500 animate-pulse'
                    }`}>
                      <span className="text-white font-bold text-sm">
                        {isMatched && matchedItemIndex ? parseInt(matchedItemIndex) + 1 : idx + 1}
                      </span>
                    </div>
                    {isMatched && matchedItemIndex && (
                      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                        ✓ {items[parseInt(matchedItemIndex)].name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Draggable labels */}
            {items.map((item: any, idx: number) => {
              const isUsed = answer[idx] !== undefined;
              const labelKey = `${question.qId}-${idx}`;

              return item.labelPosition && (
                <div
                  key={`label-${idx}`}
                  ref={(el) => {
                    if (el && onSetLabelRef && labelRefs?.[labelKey] !== el) {
                      onSetLabelRef(labelKey, el);
                    }
                  }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                    isInteractive ? 'cursor-move hover:scale-110' : ''
                  } transition-all`}
                  style={{
                    left: `${item.labelPosition.x}%`,
                    top: `${item.labelPosition.y}%`,
                    opacity: isUsed ? 0.5 : 1,
                    zIndex: 20,
                  }}
                  draggable={isInteractive}
                  onDragStart={isInteractive ? (e) => handleDragStart(e, idx) : undefined}
                >
                  <div className={`border-3 rounded-lg px-3 py-2 shadow-lg ${
                    isUsed 
                      ? 'bg-gray-300 border-gray-400' 
                      : 'bg-white border-indigo-400'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-xs ${
                        isUsed 
                          ? 'bg-gray-500 text-white' 
                          : 'bg-indigo-500 text-white'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className={`font-bold text-base whitespace-nowrap ${
                        isUsed ? 'text-gray-600' : 'text-gray-900'
                      }`}>
                        {item.name}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Drag-to-list mode: match each name with its description (2-column) */}
      {matchingMode === 'drag-to-list' && items && Array.isArray(items) && items.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
          {items.map((item: any, idx: number) => {
            const selected = answer[idx];
            return (
              <div
                key={`match-${idx}`}
                className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-2 sm:w-1/2">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{item.name}</span>
                </div>
                <div className="sm:w-1/2">
                  <select
                    value={selected ?? ''}
                    disabled={!isInteractive}
                    onChange={(e) => {
                      if (!onAnswer) return;
                      const val = e.target.value;
                      const next = { ...answer };
                      if (val === '') {
                        delete next[idx];
                      } else {
                        next[idx] = parseInt(val);
                      }
                      onAnswer(next);
                    }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    <option value="">— Chọn đáp án —</option>
                    {items.map((opt: any, optIdx: number) => (
                      <option key={optIdx} value={optIdx}>
                        {opt.targetLabel || opt.targetId || `Lựa chọn ${optIdx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
