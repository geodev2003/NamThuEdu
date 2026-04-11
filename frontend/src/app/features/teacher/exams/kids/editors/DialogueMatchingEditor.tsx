import React, { useState } from 'react';
import { Save, X, Plus, Trash2, MessageCircle } from 'lucide-react';

interface DialogueMatchingEditorProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId: string | null;
  questionId: string | null;
}

interface DialogueOption {
  id: string;
  text: string;
}

interface Dialogue {
  id: string;
  question: string;
  options: DialogueOption[];
  correct_answer: string;
}

const DialogueMatchingEditor: React.FC<DialogueMatchingEditorProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || 'Dialogue Matching');
  const [points, setPoints] = useState(initialData?.points || 5);
  const [dialogues, setDialogues] = useState<Dialogue[]>(
    initialData?.config?.dialogues || [
      {
        id: '1',
        question: '',
        options: [
          { id: 'A', text: '' },
          { id: 'B', text: '' },
          { id: 'C', text: '' },
        ],
        correct_answer: '',
      },
    ]
  );

  const handleAddDialogue = () => {
    const newDialogue: Dialogue = {
      id: Date.now().toString(),
      question: '',
      options: [
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
      ],
      correct_answer: '',
    };
    setDialogues([...dialogues, newDialogue]);
  };

  const handleRemoveDialogue = (dialogueId: string) => {
    if (dialogues.length > 1) {
      setDialogues(dialogues.filter((d) => d.id !== dialogueId));
    }
  };

  const handleDialogueChange = (dialogueId: string, field: 'question' | 'correct_answer', value: string) => {
    setDialogues(
      dialogues.map((d) =>
        d.id === dialogueId ? { ...d, [field]: value } : d
      )
    );
  };

  const handleOptionChange = (dialogueId: string, optionId: string, value: string) => {
    setDialogues(
      dialogues.map((d) => {
        if (d.id === dialogueId) {
          return {
            ...d,
            options: d.options.map((opt) =>
              opt.id === optionId ? { ...opt, text: value } : opt
            ),
          };
        }
        return d;
      })
    );
  };

  const handleAddOption = (dialogueId: string) => {
    setDialogues(
      dialogues.map((d) => {
        if (d.id === dialogueId && d.options.length < 5) {
          const nextLetter = String.fromCharCode(65 + d.options.length);
          return {
            ...d,
            options: [...d.options, { id: nextLetter, text: '' }],
          };
        }
        return d;
      })
    );
  };

  const handleRemoveOption = (dialogueId: string, optionId: string) => {
    setDialogues(
      dialogues.map((d) => {
        if (d.id === dialogueId && d.options.length > 2) {
          return {
            ...d,
            options: d.options.filter((opt) => opt.id !== optionId),
          };
        }
        return d;
      })
    );
  };

  const handleSave = () => {
    // Validate
    const hasEmptyFields = dialogues.some(
      (d) =>
        !d.question.trim() ||
        !d.correct_answer ||
        d.options.some((opt) => !opt.text.trim())
    );

    if (hasEmptyFields) {
      alert('Vui lòng điền đầy đủ thông tin cho tất cả các hội thoại!');
      return;
    }

    // Validate correct answers
    const invalidAnswers = dialogues.filter(
      (d) => !d.options.some((opt) => opt.id === d.correct_answer)
    );

    if (invalidAnswers.length > 0) {
      alert('Đáp án đúng phải là một trong các lựa chọn (A, B, C, ...)!');
      return;
    }

    const questionData = {
      type: 'dialogue_matching',
      title,
      points,
      config: {
        dialogues: dialogues.map((d) => ({
          question: d.question.trim(),
          options: d.options.map((opt) => ({
            id: opt.id,
            text: opt.text.trim(),
          })),
          correct_answer: d.correct_answer,
        })),
      },
    };

    onSave(questionData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-4 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-baloo text-2xl font-bold text-blue-600">
              💬 Dialogue Matching
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Chọn câu trả lời phù hợp cho hội thoại
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
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-2 font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
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
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="VD: Chọn câu trả lời phù hợp"
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
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              min="1"
              max="10"
            />
          </div>
        </div>
      </div>

      {/* Dialogues */}
      <div className="space-y-4">
        {/* Sticky header with add button */}
        <div className="sticky top-0 z-40 -mx-6 -mt-6 mb-4 flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <h4 className="font-baloo text-lg font-bold text-gray-800">
            💬 Danh sách hội thoại ({dialogues.length})
          </h4>
          <button
            onClick={handleAddDialogue}
            className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-all hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm hội thoại</span>
          </button>
        </div>

        {dialogues.map((dialogue, dialogueIndex) => (
          <div
            key={dialogue.id}
            className="rounded-xl border-2 border-gray-200 bg-white p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h5 className="font-baloo text-lg font-bold text-blue-600">
                Hội thoại #{dialogueIndex + 1}
              </h5>
              {dialogues.length > 1 && (
                <button
                  onClick={() => handleRemoveDialogue(dialogue.id)}
                  className="rounded-lg border border-red-300 p-2 text-red-500 transition-all hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Question */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Câu hỏi / Câu nói *
                </label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                  <input
                    type="text"
                    value={dialogue.question}
                    onChange={(e) =>
                      handleDialogueChange(dialogue.id, 'question', e.target.value)
                    }
                    className="w-full rounded-lg border-2 border-blue-200 bg-blue-50 py-2 pl-12 pr-4 font-medium text-blue-800 focus:border-blue-500 focus:outline-none"
                    placeholder="VD: What's your name?"
                  />
                </div>
              </div>

              {/* Options */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Các lựa chọn trả lời *
                  </label>
                  {dialogue.options.length < 5 && (
                    <button
                      onClick={() => handleAddOption(dialogue.id)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Thêm lựa chọn
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {dialogue.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                        {option.id}
                      </span>
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(dialogue.id, option.id, e.target.value)
                        }
                        className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder={`Câu trả lời ${option.id}`}
                      />
                      {dialogue.options.length > 2 && (
                        <button
                          onClick={() => handleRemoveOption(dialogue.id, option.id)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Correct Answer */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Đáp án đúng *
                </label>
                <select
                  value={dialogue.correct_answer}
                  onChange={(e) =>
                    handleDialogueChange(dialogue.id, 'correct_answer', e.target.value)
                  }
                  className="w-full rounded-lg border-2 border-green-300 bg-green-50 px-4 py-2 font-bold text-green-700 focus:border-green-500 focus:outline-none"
                >
                  <option value="">-- Chọn đáp án đúng --</option>
                  {dialogue.options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.id}: {opt.text || '(chưa nhập)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              {dialogue.question && dialogue.correct_answer && (
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="mb-2 text-xs font-medium text-gray-600">
                    Xem trước:
                  </p>
                  <div className="space-y-2">
                    <div className="rounded-lg bg-blue-200 p-3">
                      <p className="font-medium text-blue-900">
                        "{dialogue.question}"
                      </p>
                    </div>
                    <div className="space-y-1">
                      {dialogue.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`rounded-lg p-2 ${
                            opt.id === dialogue.correct_answer
                              ? 'bg-green-200 font-bold text-green-900'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {opt.id}. {opt.text}
                          {opt.id === dialogue.correct_answer && ' ✓'}
                        </div>
                      ))}
                    </div>
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
          <li>• Nhập câu hỏi hoặc câu nói trong hội thoại</li>
          <li>• Thêm 2-5 lựa chọn câu trả lời</li>
          <li>• Chọn đáp án đúng từ dropdown</li>
          <li>• Học viên sẽ chọn câu trả lời phù hợp nhất</li>
          <li>• Phù hợp cho Movers và Flyers</li>
        </ul>
      </div>
    </div>
  );
};

export default DialogueMatchingEditor;
