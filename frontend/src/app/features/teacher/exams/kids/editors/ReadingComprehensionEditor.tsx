import React, { useState } from 'react';
import { Save, ArrowLeft, Plus, Trash2, AlertCircle } from 'lucide-react';

interface ReadingComprehensionEditorProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId: string | null;
  questionId: string | null;
}

interface Question {
  id: string;
  question: string;
  answer: string;
}

const ReadingComprehensionEditor: React.FC<ReadingComprehensionEditorProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || 'Đọc Hiểu Và Trả Lời Câu Hỏi');
  const [passage, setPassage] = useState(initialData?.config?.passage || '');
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.config?.questions || [
      { id: '1', question: '', answer: '' },
      { id: '2', question: '', answer: '' },
      { id: '3', question: '', answer: '' },
    ]
  );

  const addQuestion = () => {
    if (questions.length >= 10) {
      alert('Tối đa 10 câu hỏi!');
      return;
    }
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      answer: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (questionId: string) => {
    if (questions.length <= 3) {
      alert('Phải có ít nhất 3 câu hỏi!');
      return;
    }
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, field: 'question' | 'answer', value: string) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  const handleSave = () => {
    // Validation
    if (!passage.trim()) {
      alert('Vui lòng nhập đoạn văn!');
      return;
    }

    const wordCount = countWords(passage);
    if (wordCount < 50) {
      alert('Đoạn văn phải có ít nhất 50 từ!');
      return;
    }

    const hasEmptyQuestions = questions.some(q => !q.question.trim());
    if (hasEmptyQuestions) {
      alert('Vui lòng nhập đầy đủ tất cả các câu hỏi!');
      return;
    }

    const hasEmptyAnswers = questions.some(q => !q.answer.trim());
    if (hasEmptyAnswers) {
      alert('Vui lòng nhập đầy đủ tất cả các câu trả lời!');
      return;
    }

    const questionData = {
      type: 'reading_comprehension',
      title,
      config: {
        passage: passage.trim(),
        questions: questions.map(q => ({
          question: q.question.trim(),
          answer: q.answer.trim(),
        })),
      },
      points: questions.length,
    };

    onSave(questionData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-4 border-emerald-300 bg-gradient-to-r from-emerald-100 to-green-100 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-5xl">📋</span>
            <div>
              <h3 className="font-baloo text-2xl font-bold text-emerald-600">
                Đọc Hiểu Và Trả Lời Câu Hỏi
              </h3>
              <p className="text-sm text-gray-600">
                Học viên đọc đoạn văn và trả lời câu hỏi (Flyers)
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

        {/* Warning Badge */}
        <div className="flex items-center gap-2 rounded-xl border-2 border-emerald-400 bg-emerald-50 p-3">
          <AlertCircle className="h-5 w-5 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-700">
            ⚠️ Dạng bài này chỉ dành cho Flyers (nâng cao) - Yêu cầu đọc hiểu sâu
          </p>
        </div>
      </div>

      {/* Title Input */}
      <div className="rounded-2xl border-4 border-emerald-200 bg-white p-6">
        <label className="mb-2 block font-medium text-gray-700">
          Tiêu đề câu hỏi:
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border-2 border-emerald-200 px-4 py-3 text-lg focus:border-emerald-400 focus:outline-none"
          placeholder="VD: Đọc đoạn văn và trả lời câu hỏi"
        />
      </div>

      {/* Passage Input */}
      <div className="rounded-2xl border-4 border-emerald-200 bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <label className="font-medium text-gray-700">
            Đoạn văn: <span className="text-red-500">*</span>
          </label>
          <span className={`text-sm font-bold ${
            countWords(passage) >= 50 ? 'text-green-600' : 'text-red-600'
          }`}>
            {countWords(passage)} từ {countWords(passage) >= 50 ? '✓' : '(tối thiểu 50)'}
          </span>
        </div>
        <textarea
          value={passage}
          onChange={(e) => setPassage(e.target.value)}
          rows={10}
          className="w-full rounded-xl border-2 border-emerald-200 px-4 py-3 leading-relaxed focus:border-emerald-400 focus:outline-none"
          placeholder="Nhập đoạn văn tiếng Anh (tối thiểu 50 từ)...

VD:
Last summer, Tom and his family went to the beach. They stayed in a small hotel near the sea. Every morning, Tom went swimming with his father. His mother liked to read books on the beach. In the afternoon, they played volleyball together. Tom's favorite part was building sandcastles. He made a very big castle with towers and a bridge. On the last day, they had a picnic and watched the sunset. It was the best holiday ever!"
        />
        <p className="mt-2 text-sm text-gray-500">
          💡 Đoạn văn nên có nội dung phù hợp với trẻ em, dễ hiểu
        </p>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-baloo text-xl font-bold text-emerald-600">
            ❓ Câu hỏi ({questions.length} câu)
          </h4>
          <span className="text-sm text-gray-500">
            Tối thiểu 3 câu, tối đa 10 câu
          </span>
        </div>

        {questions.map((question, index) => (
          <div
            key={question.id}
            className="rounded-2xl border-4 border-emerald-200 bg-white p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-baloo text-lg font-bold text-emerald-600">
                Câu {index + 1}
              </span>
              {questions.length > 3 && (
                <button
                  onClick={() => removeQuestion(question.id)}
                  className="rounded-lg border-2 border-red-300 bg-red-50 p-2 text-red-600 transition-all hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {/* Question */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Câu hỏi: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                  className="w-full rounded-xl border-2 border-emerald-200 px-4 py-3 focus:border-emerald-400 focus:outline-none"
                  placeholder="VD: Where did Tom go last summer?"
                />
              </div>

              {/* Answer */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Câu trả lời: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={question.answer}
                  onChange={(e) => updateQuestion(question.id, 'answer', e.target.value)}
                  className="w-full rounded-xl border-2 border-emerald-200 px-4 py-3 font-medium text-emerald-700 focus:border-emerald-400 focus:outline-none"
                  placeholder="VD: He went to the beach / To the beach"
                />
                <p className="mt-1 text-xs text-gray-500">
                  💡 Câu trả lời ngắn gọn, dựa trên thông tin trong đoạn văn
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Question Button */}
      {questions.length < 10 && (
        <button
          onClick={addQuestion}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-4 border-dashed border-emerald-300 bg-emerald-50 py-6 font-baloo text-xl font-bold text-emerald-600 transition-all hover:border-emerald-400 hover:bg-emerald-100"
        >
          <Plus className="h-6 w-6" />
          <span>Thêm câu hỏi ❓</span>
        </button>
      )}

      {/* Tips */}
      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
        <h4 className="mb-2 font-baloo text-lg font-bold text-blue-600">
          💡 Gợi ý tạo câu hỏi:
        </h4>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• Câu hỏi WH: Where, When, What, Who, Why, How</li>
          <li>• Câu hỏi Yes/No: Did Tom...? Was it...?</li>
          <li>• Câu hỏi chi tiết: What did Tom do in the morning?</li>
          <li>• Câu hỏi suy luận: Why did Tom like the holiday?</li>
        </ul>
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
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 py-4 font-baloo text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-xl"
        >
          <Save className="h-5 w-5" />
          <span>Lưu câu hỏi 💾</span>
        </button>
      </div>
    </div>
  );
};

export default ReadingComprehensionEditor;
