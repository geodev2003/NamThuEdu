import React, { useState } from 'react';
import { Save, X, Plus, Trash2, AlertCircle } from 'lucide-react';

interface OpenClozeEditorProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId: string | null;
  questionId: string | null;
}

interface Gap {
  gap_id: number;
  correct_answers: string[];
}

const OpenClozeEditor: React.FC<OpenClozeEditorProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || 'Open Cloze');
  const [points, setPoints] = useState(initialData?.points || 5);
  const [text, setText] = useState(
    initialData?.config?.text || 'I __1__ to school every day. My school __2__ very big.'
  );
  const [gaps, setGaps] = useState<Gap[]>(
    initialData?.config?.gaps || [
      { gap_id: 1, correct_answers: [''] },
    ]
  );

  const handleAddGap = () => {
    const newGapId = gaps.length > 0 ? Math.max(...gaps.map(g => g.gap_id)) + 1 : 1;
    setGaps([...gaps, { gap_id: newGapId, correct_answers: [''] }]);
  };

  const handleRemoveGap = (gapId: number) => {
    if (gaps.length > 1) {
      setGaps(gaps.filter(g => g.gap_id !== gapId));
    }
  };

  const handleAnswerChange = (gapId: number, answerIndex: number, value: string) => {
    setGaps(gaps.map(g => {
      if (g.gap_id === gapId) {
        const newAnswers = [...g.correct_answers];
        newAnswers[answerIndex] = value;
        return { ...g, correct_answers: newAnswers };
      }
      return g;
    }));
  };

  const handleAddAnswer = (gapId: number) => {
    setGaps(gaps.map(g => {
      if (g.gap_id === gapId && g.correct_answers.length < 5) {
        return { ...g, correct_answers: [...g.correct_answers, ''] };
      }
      return g;
    }));
  };

  const handleRemoveAnswer = (gapId: number, answerIndex: number) => {
    setGaps(gaps.map(g => {
      if (g.gap_id === gapId && g.correct_answers.length > 1) {
        return {
          ...g,
          correct_answers: g.correct_answers.filter((_, i) => i !== answerIndex),
        };
      }
      return g;
    }));
  };

  const renderTextWithGaps = () => {
    let result = text;
    gaps.forEach(gap => {
      const gapMarker = `__${gap.gap_id}__`;
      result = result.replace(
        gapMarker,
        `<span class="inline-flex items-center rounded-lg bg-indigo-200 px-3 py-1 font-bold text-indigo-800">${gapMarker}</span>`
      );
    });
    return result;
  };

  const handleSave = () => {
    // Validate
    if (!text.trim()) {
      alert('Vui lòng nhập đoạn văn!');
      return;
    }

    const hasEmptyGaps = gaps.some(
      gap => gap.correct_answers.every(ans => !ans.trim())
    );

    if (hasEmptyGaps) {
      alert('Vui lòng nhập ít nhất 1 đáp án đúng cho mỗi chỗ trống!');
      return;
    }

    // Check if all gaps are in text
    const missingGaps = gaps.filter(gap => !text.includes(`__${gap.gap_id}__`));
    if (missingGaps.length > 0) {
      alert(`Chỗ trống __${missingGaps[0].gap_id}__ không có trong đoạn văn!`);
      return;
    }

    const questionData = {
      type: 'open_cloze',
      title,
      points,
      config: {
        text,
        gaps: gaps.map(gap => ({
          gap_id: gap.gap_id,
          correct_answers: gap.correct_answers.filter(ans => ans.trim()).map(ans => ans.trim().toLowerCase()),
        })),
      },
    };

    onSave(questionData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-4 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-baloo text-2xl font-bold text-indigo-600">
              ✏️ Open Cloze
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Tự điền 1 từ thích hợp vào chỗ trống (không có lựa chọn)
            </p>
            <div className="mt-2 flex items-center space-x-2 text-xs text-orange-600">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Dành cho Flyers (A2) - Nâng cao</span>
            </div>
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
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-2 font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
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
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
              placeholder="VD: Điền từ vào chỗ trống"
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
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
              min="1"
              max="10"
            />
          </div>
        </div>
      </div>

      {/* Text with Gaps */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        <h4 className="mb-4 font-baloo text-lg font-bold text-gray-800">
          📄 Đoạn văn
        </h4>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nhập đoạn văn (dùng __1__, __2__, __3__ để đánh dấu chỗ trống)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 font-medium focus:border-indigo-500 focus:outline-none"
              rows={6}
              placeholder="VD: I __1__ to school every day. My school __2__ very big. I __3__ many friends there."
            />
          </div>

          {/* Preview */}
          <div className="rounded-lg bg-indigo-50 p-4">
            <p className="mb-2 text-sm font-medium text-gray-700">Xem trước:</p>
            <div
              className="text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderTextWithGaps() }}
            />
          </div>
        </div>
      </div>

      {/* Gaps Configuration */}
      <div className="space-y-4">
        {/* Sticky header with add button */}
        <div className="sticky top-0 z-40 -mx-6 -mt-6 mb-4 flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <h4 className="font-baloo text-lg font-bold text-gray-800">
            🔢 Cấu hình chỗ trống ({gaps.length})
          </h4>
          <button
            onClick={handleAddGap}
            className="flex items-center space-x-2 rounded-lg bg-indigo-500 px-4 py-2 text-white transition-all hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm chỗ trống</span>
          </button>
        </div>

        {gaps.map((gap) => (
          <div
            key={gap.gap_id}
            className="rounded-xl border-2 border-gray-200 bg-white p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h5 className="font-baloo text-lg font-bold text-indigo-600">
                Chỗ trống __{gap.gap_id}__
              </h5>
              {gaps.length > 1 && (
                <button
                  onClick={() => handleRemoveGap(gap.gap_id)}
                  className="rounded-lg border border-red-300 p-2 text-red-500 transition-all hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Correct Answers */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Các đáp án đúng * (có thể có nhiều đáp án)
                  </label>
                  {gap.correct_answers.length < 5 && (
                    <button
                      onClick={() => handleAddAnswer(gap.gap_id)}
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      + Thêm đáp án
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {gap.correct_answers.map((answer, answerIndex) => (
                    <div key={answerIndex} className="flex items-center space-x-2">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600">
                        {answerIndex + 1}
                      </span>
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) =>
                          handleAnswerChange(gap.gap_id, answerIndex, e.target.value)
                        }
                        className="flex-1 rounded-lg border-2 border-green-300 bg-green-50 px-4 py-2 font-medium text-green-700 focus:border-green-500 focus:outline-none"
                        placeholder={`Đáp án ${answerIndex + 1}`}
                      />
                      {gap.correct_answers.length > 1 && (
                        <button
                          onClick={() => handleRemoveAnswer(gap.gap_id, answerIndex)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  💡 Mẹo: Thêm nhiều đáp án đúng nếu có nhiều cách trả lời (VD: "go", "walk", "run")
                </p>
              </div>

              {/* Preview */}
              {gap.correct_answers.some(ans => ans.trim()) && (
                <div className="rounded-lg bg-indigo-50 p-3">
                  <p className="mb-1 text-xs font-medium text-gray-600">
                    Đáp án được chấp nhận:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {gap.correct_answers
                      .filter(ans => ans.trim())
                      .map((ans, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-green-200 px-3 py-1 text-sm font-medium text-green-800"
                        >
                          {ans}
                        </span>
                      ))}
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
          <li>• Nhập đoạn văn và dùng __1__, __2__, __3__ để đánh dấu chỗ trống</li>
          <li>• Mỗi chỗ trống có thể có nhiều đáp án đúng</li>
          <li>• Học viên tự nghĩ và điền 1 từ (không có lựa chọn)</li>
          <li>• Đáp án sẽ được so sánh không phân biệt hoa thường</li>
          <li>• Dạng bài nâng cao, chỉ dành cho Flyers (A2)</li>
        </ul>
      </div>

      {/* Warning */}
      <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600" />
          <div>
            <h4 className="mb-1 font-baloo text-sm font-bold text-orange-800">
              ⚠️ Lưu ý quan trọng:
            </h4>
            <p className="text-sm text-orange-700">
              Open Cloze khó hơn Cloze Test vì học viên phải tự nghĩ ra từ mà không có gợi ý. 
              Chỉ nên dùng cho học viên Flyers (A2) có trình độ tốt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenClozeEditor;
