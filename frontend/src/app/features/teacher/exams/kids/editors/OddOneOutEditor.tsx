import React, { useState } from 'react';
import { Upload, Save, AlertCircle, Trash2 } from 'lucide-react';
import { uploadKidsMedia } from '../../../../../../services/kidsExamApi';

interface ImageItem {
  id: number;
  url: string;
  category: string;
}

interface OddOneOutEditorProps {
  onSave: (questionData: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId?: string | null;
  questionId?: number | null;
}

const OddOneOutEditor: React.FC<OddOneOutEditorProps> = ({
  onSave,
  onCancel,
  initialData,
  questionId
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [images, setImages] = useState<ImageItem[]>(
    initialData?.question_data?.images || [
      { id: 1, url: '', category: '' },
      { id: 2, url: '', category: '' },
      { id: 3, url: '', category: '' },
      { id: 4, url: '', category: '' }
    ]
  );
  const [correctOddOne, setCorrectOddOne] = useState<number>(
    initialData?.question_data?.correct_odd_one || 0
  );
  const [uploading, setUploading] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(index);
      setError('');
      const url = await uploadKidsMedia(file, 'image');
      const updated = [...images];
      updated[index].url = url;
      setImages(updated);
    } catch (err: any) {
      setError(err.message || `Lỗi upload hình ${index + 1}`);
    } finally {
      setUploading(null);
    }
  };

  const updateCategory = (index: number, category: string) => {
    const updated = [...images];
    updated[index].category = category;
    setImages(updated);
  };

  const handleSave = () => {
    // Validation
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề câu hỏi');
      return;
    }

    const validImages = images.filter(img => img.url.trim() && img.category.trim());
    if (validImages.length !== 4) {
      setError('Vui lòng upload đủ 4 hình và điền category');
      return;
    }

    if (!correctOddOne || correctOddOne < 1 || correctOddOne > 4) {
      setError('Vui lòng chọn hình khác loại (1-4)');
      return;
    }

    const questionData = {
      id: questionId,
      type: 'odd_one_out',
      title,
      points: 10,
      question_data: {
        images: validImages,
        correct_odd_one: correctOddOne
      }
    };

    onSave(questionData);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-4 border-amber-200 bg-gradient-to-r from-amber-100 to-yellow-100 p-6">
        <div className="flex items-center space-x-4">
          <span className="text-6xl">🤔</span>
          <div className="flex-1">
            <h3 className="font-baloo text-3xl font-bold text-amber-600">
              Odd-one-out
            </h3>
            <p className="mt-2 text-lg text-gray-700">
              Tìm hình khác loại và giải thích lý do (4 hình)
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-3 rounded-xl border-2 border-red-300 bg-red-50 p-4">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Title Input */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        <label className="mb-3 block font-baloo text-xl font-bold text-gray-700">
          📝 Tiêu đề câu hỏi
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="VD: Tìm hình khác loại và giải thích"
          className="w-full rounded-xl border-2 border-gray-300 p-4 text-lg focus:border-amber-400 focus:outline-none"
        />
      </div>

      {/* Images Grid (2x2) */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        <label className="mb-4 block font-baloo text-xl font-bold text-gray-700">
          🖼️ 4 hình (1 hình khác loại)
        </label>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`rounded-xl border-4 p-4 transition-all ${
                correctOddOne === image.id
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-baloo text-2xl font-bold text-amber-600">
                  Hình {image.id}
                </span>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="oddOne"
                    checked={correctOddOne === image.id}
                    onChange={() => setCorrectOddOne(image.id)}
                    className="h-5 w-5"
                  />
                  <span className="text-sm font-medium text-red-600">
                    Khác loại
                  </span>
                </label>
              </div>

              {/* Image Upload */}
              {image.url ? (
                <div className="space-y-3">
                  <img
                    src={image.url}
                    alt={`Picture ${image.id}`}
                    className="h-48 w-full rounded-lg border-2 border-amber-300 object-cover"
                  />
                  <button
                    onClick={() => {
                      const updated = [...images];
                      updated[index].url = '';
                      setImages(updated);
                    }}
                    className="flex w-full items-center justify-center space-x-2 rounded-lg border-2 border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600 transition-all hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Xóa hình</span>
                  </button>
                </div>
              ) : (
                <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-amber-300 bg-white transition-all hover:border-amber-400 hover:bg-amber-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e)}
                    className="hidden"
                    disabled={uploading === index}
                  />
                  {uploading === index ? (
                    <div className="text-center">
                      <div className="text-5xl animate-spin">🎨</div>
                      <p className="mt-2 text-sm text-amber-600">Đang tải...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-amber-400" />
                      <p className="mt-2 text-sm text-amber-600">Tải hình {image.id}</p>
                    </>
                  )}
                </label>
              )}

              {/* Category Input */}
              <div className="mt-3">
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Loại (category):
                </label>
                <input
                  type="text"
                  value={image.category}
                  onChange={(e) => updateCategory(index, e.target.value)}
                  placeholder="VD: animal, fruit, vehicle..."
                  className="w-full rounded-lg border-2 border-gray-300 p-3 text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-700">
            💡 <strong>Gợi ý:</strong> Upload 4 hình, trong đó 3 hình cùng loại và 1 hình khác loại.
            <br />
            VD: 3 con vật (cat, dog, bird) + 1 phương tiện (car) → car là odd-one-out
          </p>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="flex w-full items-center justify-center space-x-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 px-8 py-5 font-baloo text-2xl font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
      >
        <Save className="h-7 w-7" />
        <span>Lưu câu hỏi 🎉</span>
      </button>
    </div>
  );
};

export default OddOneOutEditor;
