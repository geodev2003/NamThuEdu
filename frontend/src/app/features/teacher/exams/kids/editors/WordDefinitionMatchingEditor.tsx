import React, { useState } from 'react';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface WordDefinitionMatchingEditorProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId: string | null;
  questionId: string | null;
}

interface WordItem {
  id: string;
  word: string;
  definition: string;
}

const WordDefinitionMatchingEditor: React.FC<WordDefinitionMatchingEditorProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || 'Ghép Từ Với Định Nghĩa');
  const [words, setWords] = useState<WordItem[]>(
    initialData?.config?.words || [
      { id: '1', word: '', definition: '' },
      { id: '2', word: '', definition: '' },
      { id: '3', word: '', definition: '' },
      { id: '4', word: '', definition: '' },
      { id: '5', word: '', definition: '' },
    ]
  );

  const addWord = () => {
    if (words.length >= 15) {
      alert('Tối đa 15 từ!');
      return;
    }
    const newWord: WordItem = {
      id: Date.now().toString(),
      word: '',
      definition: '',
    };
    setWords([...words, newWord]);
  };

  const removeWord = (wordId: string) => {
    if (words.length <= 5) {
      alert('Phải có ít nhất 5 từ!');
      return;
    }
    setWords(words.filter(w => w.id !== wordId));
  };

  const updateWord = (wordId: string, field: 'word' | 'definition', value: string) => {
    setWords(words.map(w =>
      w.id === wordId ? { ...w, [field]: value } : w
    ));
  };

  const handleSave = () => {
    // Validation
    const hasEmptyWords = words.some(w => !w.word.trim());
    if (hasEmptyWords) {
      alert('Vui lòng nhập đầy đủ tất cả các từ!');
      return;
    }

    const hasEmptyDefinitions = words.some(w => !w.definition.trim());
    if (hasEmptyDefinitions) {
      alert('Vui lòng nhập đầy đủ tất cả các định nghĩa!');
      return;
    }

    if (words.length < 5) {
      alert('Phải có ít nhất 5 từ!');
      return;
    }

    const questionData = {
      type: 'word_definition_matching',
      title,
      config: {
        words: words.map(w => ({
          word: w.word.trim(),
          definition: w.definition.trim(),
        })),
      },
      points: words.length,
    };

    onSave(questionData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-4 border-teal-300 bg-gradient-to-r from-teal-100 to-cyan-100 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-5xl">📚</span>
            <div>
              <h3 className="font-baloo text-2xl font-bold text-teal-600">
                Ghép Từ Với Định Nghĩa
              </h3>
              <p className="text-sm text-gray-600">
                Học viên ghép từ với định nghĩa phù hợp (Movers, Flyers)
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-2 transition-all hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </button>
        </div>

        {/* Title Input */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Tiêu đề câu hỏi:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border-2 border-teal-200 px-4 py-3 text-lg focus:border-teal-400 focus:outline-none"
            placeholder="VD: Ghép từ với nghĩa đúng"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
        <h4 className="mb-2 font-baloo text-lg font-bold text-blue-600">
          💡 Hướng dẫn:
        </h4>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• Movers: 5-8 từ</li>
          <li>• Flyers: 10-15 từ (có thể có từ nhiễu)</li>
          <li>• Định nghĩa phải rõ ràng, dễ hiểu</li>
          <li>• Từ nên theo chủ đề (animals, food, sports...)</li>
        </ul>
      </div>

      {/* Words List */}
      <div className="space-y-4">
        {/* Sticky header with add button */}
        <div className="sticky top-0 z-40 -mx-6 -mt-6 mb-4 flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <h4 className="font-baloo text-xl font-bold text-teal-600">
            📝 Danh sách từ ({words.length} từ)
          </h4>
          <span className="text-sm text-gray-500">
            Tối thiểu 5 từ, tối đa 15 từ
          </span>
        </div>

        {words.map((word, index) => (
          <div
            key={word.id}
            className="rounded-2xl border-4 border-teal-200 bg-white p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-baloo text-lg font-bold text-teal-600">
                Từ {index + 1}
              </span>
              {words.length > 5 && (
                <button
                  onClick={() => removeWord(word.id)}
                  className="rounded-lg border-2 border-red-300 bg-red-50 p-2 text-red-600 transition-all hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Word */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Từ vựng: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={word.word}
                  onChange={(e) => updateWord(word.id, 'word', e.target.value)}
                  className="w-full rounded-xl border-2 border-teal-200 px-4 py-3 font-bold text-teal-700 focus:border-teal-400 focus:outline-none"
                  placeholder="VD: elephant"
                />
              </div>

              {/* Definition */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Định nghĩa: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={word.definition}
                  onChange={(e) => updateWord(word.id, 'definition', e.target.value)}
                  className="w-full rounded-xl border-2 border-teal-200 px-4 py-3 focus:border-teal-400 focus:outline-none"
                  placeholder="VD: A big animal with a long nose"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Word Button */}
      {words.length < 15 && (
        <button
          onClick={addWord}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-4 border-dashed border-teal-300 bg-teal-50 py-6 font-baloo text-xl font-bold text-teal-600 transition-all hover:border-teal-400 hover:bg-teal-100"
        >
          <Plus className="h-6 w-6" />
          <span>Thêm từ mới 📚</span>
        </button>
      )}

      {/* Preview */}
      <div className="rounded-2xl border-4 border-purple-200 bg-purple-50 p-6">
        <h4 className="mb-4 font-baloo text-xl font-bold text-purple-600">
          👀 Xem trước
        </h4>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <h5 className="mb-2 font-bold text-purple-700">Từ vựng:</h5>
            <div className="space-y-1">
              {words.map((w, i) => (
                <div key={i} className="rounded-lg bg-white p-2 text-sm">
                  {i + 1}. {w.word || '(chưa nhập)'}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5 className="mb-2 font-bold text-purple-700">Định nghĩa:</h5>
            <div className="space-y-1">
              {words.map((w, i) => (
                <div key={i} className="rounded-lg bg-white p-2 text-sm">
                  {String.fromCharCode(65 + i)}. {w.definition || '(chưa nhập)'}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl border-2 border-gray-300 py-4 font-medium transition-all hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 py-4 font-baloo text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-xl"
        >
          <Save className="h-5 w-5" />
          <span>Lưu câu hỏi 💾</span>
        </button>
      </div>
    </div>
  );
};

export default WordDefinitionMatchingEditor;
