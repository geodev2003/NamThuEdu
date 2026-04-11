import React, { useState, useEffect } from 'react';
import { ArrowLeft, Headphones, BookOpen, Mic } from 'lucide-react';
import { getKidsTaskTypes, KidsTaskType } from '../../../../../../services/kidsExamApi';

interface TaskTypeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (taskType: any) => void;
  filterBySkill?: string | string[]; // Accept single skill or array of skills
}

// Map task types to editors (only these have editors implemented)
const EDITOR_MAP: Record<string, boolean> = {
  'listen_and_draw_lines': true,
  'listen_and_write': true,
  'listen_and_tick': true,
  'listen_colour_write': true,
  'look_and_read': true,
  'look_read_write': true, // NEW: Look, Read and Write
  'unscramble_words': true,
  'cloze_test': true,
  'dialogue_matching': true,
  'story_completion': true,
  'open_cloze': true,
  'picture_sentence_writing': true,
  'picture_story_writing': true,
  'word_definition_matching': true,
  'reading_comprehension': true,
  'word_bank_fill': true,
  'find_differences': true,
  'picture_story_narration': true,
  'odd_one_out': true,
  'information_exchange': true,
  'object_placement': true,
  'picture_questions': true,
  'picture_card_questions': true,
  'listening_letter_match': true,
  // All 24 editors implemented!
};

const TaskTypeSelectorModal: React.FC<TaskTypeSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  filterBySkill,
}) => {
  const [taskTypes, setTaskTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadTaskTypes();
    }
  }, [isOpen]);

  const loadTaskTypes = async () => {
    try {
      setLoading(true);
      const types = await getKidsTaskTypes();
      console.log('🔍 Raw task types from API:', types.length, types);
      
      // Parse definition JSON if it's a string
      const parsedTypes = types.map((t: any) => ({
        ...t,
        definition: typeof t.definition === 'string' ? JSON.parse(t.definition) : t.definition
      }));
      
      console.log('📦 Parsed task types:', parsedTypes.length, parsedTypes);
      setTaskTypes(parsedTypes);
    } catch (error) {
      console.error('❌ Failed to load task types:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group by skill
  const groupedTaskTypes = {
    listening: taskTypes.filter(t => t.definition?.skill === 'listening'),
    reading: taskTypes.filter(t => t.definition?.skill === 'reading'),
    writing: taskTypes.filter(t => t.definition?.skill === 'writing'),
    speaking: taskTypes.filter(t => t.definition?.skill === 'speaking'),
  };
  
  console.log('📊 Grouped task types:', {
    listening: groupedTaskTypes.listening.length,
    reading: groupedTaskTypes.reading.length,
    writing: groupedTaskTypes.writing.length,
    speaking: groupedTaskTypes.speaking.length,
    total: taskTypes.length
  });

  // Filter by skill if specified (support single skill or array of skills)
  const filteredGroups = filterBySkill
    ? (() => {
        const skillsToShow = Array.isArray(filterBySkill) ? filterBySkill : [filterBySkill];
        const result: any = {};
        skillsToShow.forEach(skill => {
          if (groupedTaskTypes[skill as keyof typeof groupedTaskTypes]) {
            result[skill] = groupedTaskTypes[skill as keyof typeof groupedTaskTypes];
          }
        });
        return result;
      })()
    : groupedTaskTypes;

  if (!isOpen) return null;

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between rounded-2xl border-4 border-indigo-200 bg-gradient-to-r from-indigo-100 to-purple-100 p-6">
        <div className="flex-1">
          <h2 className="font-baloo text-3xl font-bold text-indigo-600">
            🎯 Chọn Dạng Bài
          </h2>
          <p className="mt-2 text-gray-600">
            Chọn dạng bài phù hợp cho đề thi của bạn
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center space-x-2 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-medium transition-all hover:bg-gray-50 hover:shadow-md"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Quay lại</span>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl animate-spin">🎨</div>
            <p className="mt-4 font-baloo text-xl text-indigo-600">
              Đang tải... 🚀
            </p>
          </div>
        ) : (
          <>
            {/* Listening */}
            {filteredGroups.listening && filteredGroups.listening.length > 0 && (
              <div>
                <h3 className="mb-4 flex items-center font-baloo text-2xl font-bold text-indigo-600">
                  <Headphones className="mr-3 h-6 w-6" />
                  👂 NGHE
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {filteredGroups.listening.map((taskType) => (
                    <TaskTypeCard
                      key={taskType.code}
                      taskType={taskType}
                      onClick={() => onSelect(taskType)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Reading */}
            {filteredGroups.reading && filteredGroups.reading.length > 0 && (
              <div>
                <h3 className="mb-4 flex items-center font-baloo text-2xl font-bold text-orange-600">
                  <BookOpen className="mr-3 h-6 w-6" />
                  📖 ĐỌC
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {filteredGroups.reading.map((taskType) => (
                    <TaskTypeCard
                      key={taskType.code}
                      taskType={taskType}
                      onClick={() => onSelect(taskType)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Writing */}
            {filteredGroups.writing && filteredGroups.writing.length > 0 && (
              <div>
                <h3 className="mb-4 flex items-center font-baloo text-2xl font-bold text-green-600">
                  <BookOpen className="mr-3 h-6 w-6" />
                  ✍️ VIẾT
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {filteredGroups.writing.map((taskType) => (
                    <TaskTypeCard
                      key={taskType.code}
                      taskType={taskType}
                      onClick={() => onSelect(taskType)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Speaking */}
            {filteredGroups.speaking && filteredGroups.speaking.length > 0 && (
              <div>
                <h3 className="mb-4 flex items-center font-baloo text-2xl font-bold text-purple-600">
                  <Mic className="mr-3 h-6 w-6" />
                  🗣️ NÓI
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {filteredGroups.speaking.map((taskType) => (
                    <TaskTypeCard
                      key={taskType.code}
                      taskType={taskType}
                      onClick={() => onSelect(taskType)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface TaskTypeCardProps {
  taskType: any;
  onClick: () => void;
}

const TaskTypeCard: React.FC<TaskTypeCardProps> = ({ taskType, onClick }) => {
  const hasEditor = EDITOR_MAP[taskType.code] === true;

  return (
    <button
      onClick={onClick}
      disabled={!hasEditor}
      className={`group relative min-h-[120px] rounded-2xl border-4 p-5 text-left transition-all ${
        hasEditor
          ? 'border-gray-200 bg-white hover:scale-105 hover:border-indigo-400 hover:shadow-xl'
          : 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-60'
      }`}
    >
      <div className="flex items-start space-x-4">
        <span className="text-5xl">{taskType.definition?.icon || '📝'}</span>
        <div className="flex-1">
          <h4 className="mb-2 font-baloo text-xl font-bold text-gray-900">
            {taskType.name}
          </h4>
          <p className="text-sm leading-relaxed text-gray-600">
            {taskType.definition?.instructions || 'Không có mô tả'}
          </p>
          {!hasEditor && (
            <span className="mt-3 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
              🚧 Đang phát triển
            </span>
          )}
          {hasEditor && (
            <div className="mt-3 flex items-center text-xs font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
              <span>Nhấn để chọn →</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default TaskTypeSelectorModal;
