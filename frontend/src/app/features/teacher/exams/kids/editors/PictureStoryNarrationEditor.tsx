import React, { useState } from 'react';
import { Upload, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { uploadKidsMedia } from '../../../../../../services/kidsExamApi';

interface PictureStoryNarrationEditorProps {
  onSave: (questionData: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId?: string | null;
  questionId?: number | null;
}

const PictureStoryNarrationEditor: React.FC<PictureStoryNarrationEditorProps> = ({
  onSave,
  onCancel,
  initialData,
  questionId
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [images, setImages] = useState<string[]>(
    initialData?.question_data?.images || ['', '', '']
  );
  const [prompts, setPrompts] = useState<string[]>(
    initialData?.question_data?.prompts || [
      'What is happening in the first picture?',
      'What happened next?',
      'How did the story end?'
    ]
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
      updated[index] = url;
      setImages(updated);
    } catch (err: any) {
      setError(err.message || `Lỗi upload hình ${index + 1}`);
    } finally {
      setUploading(null);
    }
  };

  const addImage = () => {
    if (images.length >= 6) {
      setError('Tối đa 6 hình');
      return;
    }
    setImages([...images, '']);
    setPrompts([...prompts, '']);
  };

  const removeImage = (index: number) => {
    if (images.length <= 3) {
      setError('Tối thiểu 3 hình');
      return;
    }
    setImages(images.filter((_, i) => i !== index));
    setPrompts(prompts.filter((_, i) => i !== index));
  };

  const updatePrompt = (index: number, value: string) => {
    const updated = [...prompts];
    updated[index] = value;
    setPrompts(updated);
  };

  const handleSave = () => {
    // Validation
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề câu hỏi');
      return;
    }

    const validImages = images.filter(img => img.trim());
    if (validImages.length < 3) {
      setError('Vui lòng upload ít nhất 3 hình');
      return;
    }

    const questionData = {
      id: questionId,
      type: 'picture_story_narration',
      title,
      points: 10,
      question_data: {
        images: validImages,
        prompts: prompts.slice(0, validImages.length)
      }
    };

    onSave(questionData);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-4 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 p-6">
        <div className="flex items-center space-x-4">
          <span className="text-6xl">🗣️</span>
          <div className="flex-1">
            <h3 className="font-baloo text-3xl font-bold text-purple-600">
              Picture Story Narration
            </h3>
            <p className="mt-2 text-lg text-gray-700">
              Nhìn tranh và kể câu chuyện (3-6 hình)
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
          placeholder="VD: Kể câu chuyện về chuyến đi của Tom"
          className="w-full rounded-xl border-2 border-gray-300 p-4 text-lg focus:border-purple-400 focus:outline-none"
        />
      </div>

      {/* Images Grid */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <label className="font-baloo text-xl font-bold text-gray-700">
            🖼️ Tranh câu chuyện (3-6 hình)
          </label>
          {images.length < 6 && (
            <button
              onClick={addImage}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 px-4 py-2 text-white transition-all hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Thêm hình</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {images.map((imageUrl, index) => (
            <div key={index} className="space-y-3">
              {/* Image Upload */}
              <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-baloo text-lg font-bold text-purple-600">
                    Hình {index + 1}
                  </span>
                  {images.length > 3 && (
                    <button
                      onClick={() => removeImage(index)}
                      className="rounded-lg border-2 border-red-300 bg-red-50 p-2 text-red-600 transition-all hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {imageUrl ? (
                  <div className="space-y-2">
                    <img
                      src={imageUrl}
                      alt={`Picture ${index + 1}`}
                      className="h-48 w-full rounded-lg border-2 border-purple-300 object-cover"
                    />
                    <button
                      onClick={() => {
                        const updated = [...images];
                        updated[index] = '';
                        setImages(updated);
                      }}
                      className="flex w-full items-center justify-center space-x-2 rounded-lg border-2 border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600 transition-all hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Xóa</span>
                    </button>
                  </div>
                ) : (
                  <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-300 bg-white transition-all hover:border-purple-400 hover:bg-purple-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e)}
                      className="hidden"
                      disabled={uploading === index}
                    />
                    {uploading === index ? (
                      <div className="text-center">
                        <div className="text-4xl animate-spin">🎨</div>
                        <p className="mt-2 text-sm text-purple-600">Đang tải...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-purple-400" />
                        <p className="mt-2 text-sm text-purple-600">Tải hình</p>
                      </>
                    )}
                  </label>
                )}
              </div>

              {/* Prompt Input */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Câu hỏi gợi ý:
                </label>
                <input
                  type="text"
                  value={prompts[index] || ''}
                  onChange={(e) => updatePrompt(index, e.target.value)}
                  placeholder={`Câu hỏi cho hình ${index + 1}`}
                  className="w-full rounded-lg border-2 border-gray-300 p-3 text-sm focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm text-gray-500">
          💡 Gợi ý: Upload 3-6 hình theo thứ tự câu chuyện. Học viên sẽ nhìn tranh và kể lại câu chuyện.
        </p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="flex w-full items-center justify-center space-x-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-5 font-baloo text-2xl font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
      >
        <Save className="h-7 w-7" />
        <span>Lưu câu hỏi 🎉</span>
      </button>
    </div>
  );
};

export default PictureStoryNarrationEditor;
