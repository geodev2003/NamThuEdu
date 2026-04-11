interface StoryCompletionProps {
  question: any;
  taskData: any;
  interactiveMode: boolean;
  userAnswer?: any;
  onAnswerChange?: (answer: any) => void;
}

export function StoryCompletion({
  question,
  taskData,
  interactiveMode,
  userAnswer,
  onAnswerChange
}: StoryCompletionProps) {
  const realTaskData = taskData.task_data || taskData;
  const config = taskData.config || realTaskData.config || {};
  
  const storyBeginning = realTaskData?.story_beginning || config?.story_beginning || realTaskData?.text || config?.text;
  const instructions = realTaskData?.instructions || config?.instructions;
  const minWords = realTaskData?.min_words || config?.min_words || 20;
  
  return (
    <div className="space-y-4">
      {/* Instructions */}
      {instructions && (
        <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
          <p className="text-amber-900 font-medium text-lg">📖 {instructions}</p>
        </div>
      )}
      
      {/* Story beginning */}
      {storyBeginning && storyBeginning !== 'kids_task' && (
        <div className="p-5 bg-white rounded-xl border-3 border-amber-200 shadow-md">
          <p className="text-sm font-bold text-amber-900 mb-3">📚 Phần đầu câu chuyện:</p>
          <div className="text-gray-700 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: storyBeginning }} />
        </div>
      )}
      
      {/* Completion area */}
      <div className="p-5 bg-white rounded-xl border-3 border-amber-200 shadow-md">
        <p className="text-sm font-bold text-amber-900 mb-3">
          ✍️ Hoàn thành câu chuyện (ít nhất {minWords} từ):
        </p>
        <textarea
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-lg resize-none"
          rows={8}
          placeholder={`Viết tiếp câu chuyện (ít nhất ${minWords} từ)...`}
          disabled={!interactiveMode}
          value={userAnswer?.completion || ''}
          onChange={(e) => {
            if (onAnswerChange) {
              onAnswerChange({
                ...userAnswer,
                completion: e.target.value
              });
            }
          }}
        />
        {userAnswer?.completion && (
          <p className="text-sm text-gray-600 mt-2">
            Số từ: {userAnswer.completion.split(/\s+/).filter((w: string) => w).length}
          </p>
        )}
      </div>
    </div>
  );
}
