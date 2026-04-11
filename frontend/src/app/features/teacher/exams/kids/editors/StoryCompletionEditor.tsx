import React, { useState } from 'react';
import { Save, X, Plus, Trash2, BookOpen } from 'lucide-react';

interface StoryCompletionEditorProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId: string | null;
  questionId: string | null;
}

interface CompletionSentence {
  id: string;
  text: string;
  correct_answer: string;
  max_words: number;
}

const StoryCompletionEditor: React.FC<StoryCompletionEditorProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || 'Story Completion');
  const [points, setPoints] = useState(initialData?.points || 5);
  const [storyText, setStoryText] = useState(
    initialData?.config?.story_text || ''
  );
  const [completionSentences, setCompletionSentences] = useState<CompletionSentence[]>(
    initialData?.config?.completion_sentences || [
      { id: '1', text: '', correct_answer: '', max_words: 3 },
    ]
  );

  const handleAddSentence = () => {
    const newSentence: CompletionSentence = {
      id: Date.now().toString(),
      text: '',
      correct_answer: '',
      max_words: 3,
    };
    setCompletionSentences([...completionSentences, newSentence]);
  };

  const handleRemoveSentence = (sentenceId: string) => {
    if (completionSentences.length > 1) {
      setCompletionSentences(completionSentences.filter((s) => s.id !== sentenceId));
    }
  };

  const handleSentenceChange = (
    sentenceId: string,
    field: keyof CompletionSentence,
    value: string | number
  ) => {
    setCompletionSentences(
      completionSentences.map((s) =>
        s.id === sentenceId ? { ...s, [field]: value } : s
      )
    );
  };

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleSave = () => {
    // Validate
    if (!storyText.trim()) {
      alert('Vui lòng nhập câu chuyện!');
      return;
    }

    const hasEmptyFields = completionSentences.some(
      (s) => !s.text.trim() || !s.correct_answer.trim()
    );

    if (hasEmptyFields) {
      alert('Vui lòng điền đầy đủ thông tin cho tất cả các câu!');
      return;
    }

    // Validate word count
    const invalidWordCount = completionSentences.filter(
      (s) => countWords(s.correct_answer) > s.max_words
    );

    if (invalidWordCount.length > 0) {
      alert(
        `Đáp án của câu ${completionSentences.indexOf(invalidWordCount[0]) + 1} vượt quá số từ cho phép!`
      );
      return;
    }

    const questionData = {
      type: 'story_completion',
      title,
      points,
      config: {
        story_text: storyText.trim(),
        completion_sentences: completionSentences.map((s) => ({
          text: s.text.trim(),
          correct_answer: s.correct_answer.trim(),
          max_words: s.max_words,
        })),
      },
    };

    onSave(questionData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-4 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-baloo text-2xl font-bold text-green-600">
              📖 Story Completion
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Đọc câu chuyện và hoàn thành câu (1-3 từ)
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onCancel}
              className="flex items-center space-x-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-2 transition-all hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
              <span>Hủy</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-2 font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
            >
              <Save className="h-4 w-4" />
              <span>Lưu câu hỏi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        <h4 className="mb-4 font-baloo text-lg font-bold text-gray-800">
          📝 Thông tin cơ bản
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tiêu đề câu hỏi
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
              placeholder="VD: Đọc và hoàn thành câu"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Điểm số
            </label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value))}
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
              min="1"
              max="10"
            />
          </div>
        </div>
      </div>

      {/* Story Text */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        <h4 className="mb-4 flex items-center font-baloo text-lg font-bold text-gray-800">
          <BookOpen className="mr-2 h-5 w-5" />
          Câu chuyện
        </h4>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Nhập câu chuyện *
          </label>
          <textarea
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 font-medium leading-relaxed focus:border-green-500 focus:outline-none"
            rows={8}
            placeholder="VD: Tom went to the park yesterday. He saw his friend Mary there. They played football together for two hours. After that, they went to buy ice cream..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Số từ: {countWords(storyText)}
          </p>
        </div>

        {/* Preview */}
        {storyText && (
          <div className="mt-4 rounded-lg bg-green-50 p-4">
            <p className="mb-2 text-xs font-medium text-gray-600">Xem trước:</p>
            <div className="rounded-lg bg-white p-4 text-base leading-relaxed">
              {storyText}
            </div>
          </div>
        )}
      </div>

      {/* Completion Sentences */}
      <div className="space-y-4">
        {/* Sticky header with add button */}
        <div className="sticky top-0 z-40 -mx-6 -mt-6 mb-4 flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <h4 className="font-baloo text-lg font-bold text-gray-800">
            ✏️ Câu cần hoàn thành ({completionSentences.length})
          </h4>
          <button
            onClick={handleAddSentence}
            className="flex items-center space-x-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-all hover:bg-green-600"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm câu</span>
          </button>
        </div>

        {completionSentences.map((sentence, index) => (
          <div
            key={sentence.id}
            className="rounded-xl border-2 border-gray-200 bg-white p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h5 className="font-baloo text-lg font-bold text-green-600">
                Câu #{index + 1}
              </h5>
              {completionSentences.length > 1 && (
                <button
                  onClick={() => handleRemoveSentence(sentence.id)}
                  className="rounded-lg border border-red-300 p-2 text-red-500 transition-all hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Sentence Text */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Câu cần hoàn thành * (dùng ___ để đánh dấu chỗ trống)
                </label>
                <input
                  type="text"
                  value={sentence.text}
                  onChange={(e) =>
                    handleSentenceChange(sentence.id, 'text', e.target.value)
                  }
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  placeholder="VD: Tom played with his ___"
                />
              </div>

              {/* Correct Answer */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Đáp án đúng *
                  </label>
                  <input
                    type="text"
                    value={sentence.correct_answer}
                    onChange={(e) =>
                      handleSentenceChange(sentence.id, 'correct_answer', e.target.value)
                    }
                    className="w-full rounded-lg border-2 border-green-300 bg-green-50 px-4 py-2 font-bold text-green-700 focus:border-green-500 focus:outline-none"
                    placeholder="VD: friends"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Số từ: {countWords(sentence.correct_answer)} / {sentence.max_words}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Số từ tối đa
                  </label>
                  <select
                    value={sentence.max_words}
                    onChange={(e) =>
                      handleSentenceChange(sentence.id, 'max_words', parseInt(e.target.value))
                    }
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
                  >
                    <option value={1}>1 từ</option>
                    <option value={2}>2 từ</option>
                    <option value={3}>3 từ</option>
                    <option value={4}>4 từ</option>
                    <option value={5}>5 từ</option>
                  </select>
                </div>
              </div>

              {/* Preview */}
              {sentence.text && sentence.correct_answer && (
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="mb-1 text-xs font-medium text-gray-600">
                    Xem trước:
                  </p>
                  <div className="space-y-1">
                    <p className="text-base">
                      {sentence.text.replace('___', '___________')}
                    </p>
                    <p className="text-sm text-green-700">
                      → {sentence.text.replace('___', sentence.correct_answer)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
        <h4 className="mb-2 font-baloo text-sm font-bold text-blue-800">
          💡 Hướng dẫn:
        </h4>
        <ul className="space-y-1 text-sm text-blue-700">
          <li>• Nhập câu chuyện hoàn chỉnh ở phần đầu</li>
          <li>• Tạo các câu cần hoàn thành với ___ đánh dấu chỗ trống</li>
          <li>• Nhập đáp án đúng (1-5 từ)</li>
          <li>• Học viên sẽ đọc câu chuyện và điền từ vào chỗ trống</li>
          <li>• Phù hợp cho Movers và Flyers</li>
        </ul>
      </div>
    </div>
  );
};

export default StoryCompletionEditor;
