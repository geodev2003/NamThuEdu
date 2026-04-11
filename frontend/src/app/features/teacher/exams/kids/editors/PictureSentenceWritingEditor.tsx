import React, { useState, useEffect } from 'react';
import { Upload, X, Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { uploadKidsMedia } from '../../../../../../services/kidsExamApi';
import { getFullMediaUrl } from '../../../../../../utils/mediaUtils';

interface PictureSentenceWritingEditorProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId: string | null;
  questionId: string | null;
}

interface SentenceItem {
  id: string;
  image_url: string;
  prompt: string;
  sample_answers: string[];
}

const PictureSentenceWritingEditor: React.FC<PictureSentenceWritingEditorProps> = ({
  onSave,
  onCancel,
  initialData,
  examId,
}) => {
  const [title, setTitle] = useState(initialData?.title || 'Viết Câu Mô Tả Tranh');
  const [items, setItems] = useState<SentenceItem[]>(
    initialData?.config?.items || [
      {
        id: '1',
        image_url: '',
        prompt: '',
        sample_answers: [''],
      },
    ]
  );
  const [uploading, setUploading] = useState<string | null>(null);

  const handleImageUpload = async (itemId: string, file: File) => {
    if (!examId) {
      alert('Vui lòng tạo đề thi trước!');
      return;
    }

    try {
      setUploading(itemId);
      const response = await uploadKidsMedia(parseInt(examId), file, 'image');
      
      setItems(items.map(item => 
        item.id === itemId 
          ? { ...item, image_url: response.url }
          : item
      ));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Không thể tải ảnh lên. Vui lòng thử lại!');
    } finally {
      setUploading(null);
    }
  };

  const addItem = () => {
    const newItem: SentenceItem = {
      id: Date.now().toString(),
      image_url: '',
      prompt: '',
      sample_answers: [''],
    };
    setItems([...items, newItem]);
  };

  const removeItem = (itemId: string) => {
    if (items.length === 1) {
      alert('Phải có ít nhất 1 câu!');
      return;
    }
    setItems(items.filter(item => item.id !== itemId));
  };

  const updateItem = (itemId: string, field: keyof SentenceItem, value: any) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const addSampleAnswer = (itemId: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          sample_answers: [...item.sample_answers, ''],
        };
      }
      return item;
    }));
  };

  const updateSampleAnswer = (itemId: string, index: number, value: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const newAnswers = [...item.sample_answers];
        newAnswers[index] = value;
        return { ...item, sample_answers: newAnswers };
      }
      return item;
    }));
  };

  const removeSampleAnswer = (itemId: string, index: number) => {
    setItems(items.map(item => {
      if (item.id === itemId && item.sample_answers.length > 1) {
        return {
          ...item,
          sample_answers: item.sample_answers.filter((_, i) => i !== index),
        };
      }
      return item;
    }));
  };

  const handleSave = () => {
    // Validation
    const hasEmptyImages = items.some(item => !item.image_url);
    if (hasEmptyImages) {
      alert('Vui lòng tải ảnh cho tất cả các câu!');
      return;
    }

    const hasEmptyPrompts = items.some(item => !item.prompt.trim());
    if (hasEmptyPrompts) {
      alert('Vui lòng nhập câu hỏi gợi ý cho tất cả các câu!');
      return;
    }

    const hasEmptyAnswers = items.some(item => 
      item.sample_answers.length === 0 || item.sample_answers.every(a => !a.trim())
    );
    if (hasEmptyAnswers) {
      alert('Vui lòng nhập ít nhất 1 câu trả lời mẫu cho mỗi câu!');
      return;
    }

    const questionData = {
      type: 'picture_sentence_writing',
      title,
      config: {
        items: items.map(item => ({
          ...item,
          sample_answers: item.sample_answers.filter(a => a.trim()),
        })),
      },
      points: items.length * 2,
    };

    onSave(questionData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-4 border-pink-300 bg-gradient-to-r from-pink-100 to-rose-100 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-5xl">📸</span>
            <div>
              <h3 className="font-baloo text-2xl font-bold text-pink-600">
                Viết Câu Mô Tả Tranh
              </h3>
              <p className="text-sm text-gray-600">
                Học viên nhìn tranh và viết câu mô tả hoàn chỉnh
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
            className="w-full rounded-xl border-2 border-pink-200 px-4 py-3 text-lg focus:border-pink-400 focus:outline-none"
            placeholder="VD: Viết câu mô tả những gì bạn thấy trong tranh"
          />
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-2xl border-4 border-pink-200 bg-white p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-baloo text-xl font-bold text-pink-600">
                Câu {index + 1} 📝
              </h4>
              {items.length > 1 && (
                <button
                  onClick={() => removeItem(item.id)}
                  className="rounded-lg border-2 border-red-300 bg-red-50 p-2 text-red-600 transition-all hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="mb-2 block font-medium text-gray-700">
                Hình ảnh: <span className="text-red-500">*</span>
              </label>
              {item.image_url ? (
                <div className="relative">
                  <img
                    src={getFullMediaUrl(item.image_url)}
                    alt={`Item ${index + 1}`}
                    className="h-64 w-full rounded-xl border-4 border-pink-200 object-cover"
                  />
                  <button
                    onClick={() => updateItem(item.id, 'image_url', '')}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-4 border-dashed border-pink-300 bg-pink-50 transition-all hover:border-pink-400 hover:bg-pink-100">
                  <Upload className="mb-2 h-12 w-12 text-pink-400" />
                  <span className="font-baloo text-lg font-bold text-pink-600">
                    {uploading === item.id ? 'Đang tải lên... 🚀' : 'Tải ảnh lên 📸'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(item.id, file);
                    }}
                    disabled={uploading === item.id}
                  />
                </label>
              )}
            </div>

            {/* Prompt */}
            <div className="mb-4">
              <label className="mb-2 block font-medium text-gray-700">
                Câu hỏi gợi ý: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={item.prompt}
                onChange={(e) => updateItem(item.id, 'prompt', e.target.value)}
                className="w-full rounded-xl border-2 border-pink-200 px-4 py-3 focus:border-pink-400 focus:outline-none"
                placeholder="VD: What is the boy doing?"
              />
              <p className="mt-1 text-sm text-gray-500">
                💡 Câu hỏi giúp học viên biết cần viết gì
              </p>
            </div>

            {/* Sample Answers */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Câu trả lời mẫu: <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {item.sample_answers.map((answer, answerIndex) => (
                  <div key={answerIndex} className="flex gap-2">
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) => updateSampleAnswer(item.id, answerIndex, e.target.value)}
                      className="flex-1 rounded-xl border-2 border-pink-200 px-4 py-2 focus:border-pink-400 focus:outline-none"
                      placeholder={`Câu trả lời ${answerIndex + 1}`}
                    />
                    {item.sample_answers.length > 1 && (
                      <button
                        onClick={() => removeSampleAnswer(item.id, answerIndex)}
                        className="rounded-lg border-2 border-red-300 bg-red-50 px-3 text-red-600 hover:bg-red-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addSampleAnswer(item.id)}
                  className="flex items-center gap-2 rounded-lg border-2 border-pink-300 bg-pink-50 px-4 py-2 text-pink-600 transition-all hover:bg-pink-100"
                >
                  <Plus className="h-4 w-4" />
                  <span>Thêm câu trả lời mẫu</span>
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                💡 Nhiều câu trả lời mẫu giúp giáo viên chấm linh hoạt hơn
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Button */}
      <button
        onClick={addItem}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-4 border-dashed border-pink-300 bg-pink-50 py-6 font-baloo text-xl font-bold text-pink-600 transition-all hover:border-pink-400 hover:bg-pink-100"
      >
        <Plus className="h-6 w-6" />
        <span>Thêm câu mới 📸</span>
      </button>

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
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-400 to-rose-500 py-4 font-baloo text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-xl"
        >
          <Save className="h-5 w-5" />
          <span>Lưu câu hỏi 💾</span>
        </button>
      </div>
    </div>
  );
};

export default PictureSentenceWritingEditor;
