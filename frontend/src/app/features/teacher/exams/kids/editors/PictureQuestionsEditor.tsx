import React, { useState } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { uploadKidsMedia } from '../../../../../../services/kidsExamApi';
import { useToastContext } from '../../../../../../contexts/ToastContext';

interface PictureQuestionsEditorProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId: string | null;
  questionId?: string | null;
}

interface QuestionItem {
  id: string;
  imageUrl: string;
  question: string;
  sampleAnswer: string;
}

const PictureQuestionsEditor: React.FC<PictureQuestionsEditorProps> = ({
  onSave,
  onCancel,
  initialData,
  examId,
}) => {
  const toast = useToastContext();
  const [title, setTitle] = useState(initialData?.title || '');
  const [questions, setQuestions] = useState<QuestionItem[]>(initialData?.config?.questions || []);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, questionId: string) => {
    const file = e.target.files?.[0];
    if (!file || !examId) {
      toast.error('Vui lòng chọn file ảnh!');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB 😊');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadKidsMedia(file, 'image', examId, null);
      const uploadedUrl = response.media?.url || response.url;
      if (uploadedUrl) {
        setQuestions(questions.map(q => 
          q.id === questionId ? { ...q, imageUrl: uploadedUrl } : q
        ));
        toast.success('✅ Tải ảnh thành công!');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error(`Không thể tải ảnh lên: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handlePasteImage = async (e: React.ClipboardEvent, questionId: string) => {
    const items = e.clipboardData?.items;
    if (!items || !examId) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = item.getAsFile();
        if (!blob) {
          toast.error('Vui lòng chọn file ảnh!');
          return;
        }

        // Check file size (max 5MB)
        if (blob.size > 5 * 1024 * 1024) {
          toast.error('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB 😊');
          return;
        }

        const file = new File([blob], `pasted-image-${Date.now()}.png`, { type: blob.type });
        
        setUploading(true);
        try {
          const response = await uploadKidsMedia(file, 'image', examId, null);
          const uploadedUrl = response.media?.url || response.url;
          if (uploadedUrl) {
            setQuestions(questions.map(q => 
              q.id === questionId ? { ...q, imageUrl: uploadedUrl } : q
            ));
            toast.success('✅ Dán ảnh thành công!');
          }
        } catch (error: any) {
          console.error('Paste upload failed:', error);
          toast.error(`Không thể tải ảnh lên: ${error.response?.data?.message || error.message}`);
        } finally {
          setUploading(false);
        }
        break;
      }
    }
  };

  const addQuestion = () => {
    const newQuestion: QuestionItem = {
      id: `q-${Date.now()}`,
      imageUrl: '',
      question: '',
      sampleAnswer: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, field: keyof QuestionItem, value: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề!');
      return;
    }

    if (questions.length === 0) {
      alert('Vui lòng thêm ít nhất 1 câu hỏi!');
      return;
    }

    const invalidQuestions = questions.filter(q => !q.imageUrl || !q.question || !q.sampleAnswer);
    if (invalidQuestions.length > 0) {
      alert('Vui lòng điền đầy đủ thông tin cho tất cả câu hỏi!');
      return;
    }

    onSave({
      type: 'picture_questions',
      title,
      points: questions.length,
      config: {
        questions: questions.map(q => ({
          image_url: q.imageUrl,
          question: q.question,
          sample_answer: q.sampleAnswer,
        })),
      },
    });
  };

  return (
    <div className="rounded-2xl border-4 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-baloo text-3xl font-bold text-blue-600">
            ❓ Picture Questions
          </h3>
          <p className="text-lg text-gray-600">
            Starters Speaking Part 2 - Trả lời câu hỏi về hình
          </p>
        </div>
        <button
          onClick={onCancel}
          className="rounded-full p-2 hover:bg-white/50 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label className="mb-2 block font-baloo text-xl font-bold text-gray-700">
          📝 Tiêu đề
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="VD: Trả lời câu hỏi về đồ vật trong hình"
          className="w-full rounded-xl border-2 border-blue-200 px-4 py-3 text-lg focus:border-blue-400 focus:outline-none"
        />
      </div>

      {/* Questions */}
      <div className="mb-6">
        {/* Sticky header with add button */}
        <div className="sticky top-0 z-40 -mx-6 -mt-6 mb-3 flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <label className="font-baloo text-xl font-bold text-gray-700">
            🖼️ Câu hỏi ({questions.length})
          </label>
          <button
            onClick={addQuestion}
            className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
          >
            <Plus className="h-5 w-5" />
            Thêm câu hỏi
          </button>
        </div>

        <div className="space-y-4">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="rounded-xl border-2 border-blue-200 bg-white p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-baloo text-lg font-bold text-blue-600">
                  Câu {index + 1}
                </span>
                <button
                  onClick={() => removeQuestion(q.id)}
                  className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Hình ảnh (Upload hoặc Ctrl+V để dán)
                  </label>
                  {q.imageUrl ? (
                    <div className="relative inline-block">
                      <img
                        src={q.imageUrl}
                        alt={`Question ${index + 1}`}
                        className="h-32 w-32 rounded-lg border-2 border-blue-200 object-cover"
                      />
                      <button
                        onClick={() => updateQuestion(q.id, 'imageUrl', '')}
                        className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onPaste={(e) => handlePasteImage(e, q.id)}
                      className="relative"
                    >
                      <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:bg-gray-50">
                        <Upload className="mb-1 h-8 w-8 text-gray-400" />
                        <span className="text-xs text-gray-500">Upload</span>
                        <span className="text-xs text-gray-400">hoặc Ctrl+V</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, q.id)}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                      <input
                        type="text"
                        onPaste={(e) => handlePasteImage(e, q.id)}
                        placeholder="Nhấn vào đây và Ctrl+V"
                        className="mt-2 w-32 rounded border border-dashed border-blue-300 px-2 py-1 text-xs text-center"
                        readOnly
                      />
                    </div>
                  )}
                </div>

                {/* Question */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Câu hỏi
                  </label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                    placeholder="VD: What is this? hoặc What colour is it?"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>

                {/* Sample Answer */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Đáp án mẫu
                  </label>
                  <input
                    type="text"
                    value={q.sampleAnswer}
                    onChange={(e) => updateQuestion(q.id, 'sampleAnswer', e.target.value)}
                    placeholder="VD: It's a ball hoặc It's red"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
            </div>
          ))}

          {questions.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <p className="text-gray-500">
                Chưa có câu hỏi nào. Nhấn "Thêm câu hỏi" để bắt đầu!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sample Questions */}
      <div className="mb-6 rounded-xl bg-blue-100 p-4">
        <h4 className="mb-2 font-bold text-blue-800">💡 Gợi ý câu hỏi:</h4>
        <ul className="space-y-1 text-sm text-blue-700">
          <li>• "What is this?" → "It's a [ball/book/pen]"</li>
          <li>• "What colour is it?" → "It's [red/blue/green]"</li>
          <li>• "How many [cats] are there?" → "There are [three]"</li>
          <li>• "Where is the [ball]?" → "It's [under the table]"</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-bold text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 py-3 font-baloo text-xl font-bold text-white hover:from-blue-600 hover:to-cyan-600"
        >
          💾 Lưu câu hỏi
        </button>
      </div>
    </div>
  );
};

export default PictureQuestionsEditor;
