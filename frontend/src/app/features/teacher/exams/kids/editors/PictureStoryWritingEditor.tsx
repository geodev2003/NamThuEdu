import React, { useState, useEffect } from 'react';
import { Upload, X, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { uploadKidsMedia } from '../../../../../../services/kidsExamApi';
import { getFullMediaUrl } from '../../../../../../utils/mediaUtils';

interface PictureStoryWritingEditorProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId: string | null;
  questionId: string | null;
}

const PictureStoryWritingEditor: React.FC<PictureStoryWritingEditorProps> = ({
  onSave,
  onCancel,
  initialData,
  examId,
}) => {
  const [title, setTitle] = useState(initialData?.title || 'Viết Câu Chuyện Theo Tranh');
  const [images, setImages] = useState<string[]>(initialData?.config?.images || ['', '', '']);
  const [minWords, setMinWords] = useState(initialData?.config?.min_words || 20);
  const [uploading, setUploading] = useState<number | null>(null);

  const handleImageUpload = async (index: number, file: File) => {
    if (!examId) {
      alert('Vui lòng tạo đề thi trước!');
      return;
    }

    try {
      setUploading(index);
      const response = await uploadKidsMedia(parseInt(examId), file, 'image');
      
      const newImages = [...images];
      newImages[index] = response.url;
      setImages(newImages);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Không thể tải ảnh lên. Vui lòng thử lại!');
    } finally {
      setUploading(null);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = '';
    setImages(newImages);
  };

  const addImageSlot = () => {
    if (images.length >= 6) {
      alert('Tối đa 6 tranh!');
      return;
    }
    setImages([...images, '']);
  };

  const removeImageSlot = (index: number) => {
    if (images.length <= 3) {
      alert('Phải có ít nhất 3 tranh!');
      return;
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Validation
    const hasEmptyImages = images.some(img => !img);
    if (hasEmptyImages) {
      alert('Vui lòng tải đầy đủ tất cả các tranh!');
      return;
    }

    if (minWords < 20) {
      alert('Số từ tối thiểu phải từ 20 trở lên!');
      return;
    }

    const questionData = {
      type: 'picture_story_writing',
      title,
      config: {
        images,
        min_words: minWords,
        scoring_criteria: {
          content: 3,
          language: 3,
          organization: 2,
        },
      },
      points: 8,
    };

    onSave(questionData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-4 border-amber-300 bg-gradient-to-r from-amber-100 to-yellow-100 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-5xl">🖼️</span>
            <div>
              <h3 className="font-baloo text-2xl font-bold text-amber-600">
                Viết Câu Chuyện Theo Tranh
              </h3>
              <p className="text-sm text-gray-600">
                Học viên nhìn tranh và viết câu chuyện hoàn chỉnh (tối thiểu 20 từ)
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
        <div className="flex items-center gap-2 rounded-xl border-2 border-amber-400 bg-amber-50 p-3">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <p className="text-sm font-medium text-amber-700">
            ⚠️ Dạng bài này chỉ dành cho Flyers (nâng cao) - Yêu cầu viết câu chuyện dài
          </p>
        </div>
      </div>

      {/* Settings */}
      <div className="rounded-2xl border-4 border-amber-200 bg-white p-6">
        <h4 className="mb-4 font-baloo text-xl font-bold text-amber-600">
          ⚙️ Cài đặt
        </h4>

        {/* Title */}
        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-700">
            Tiêu đề câu hỏi:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border-2 border-amber-200 px-4 py-3 text-lg focus:border-amber-400 focus:outline-none"
            placeholder="VD: Nhìn tranh và viết câu chuyện"
          />
        </div>

        {/* Min Words */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Số từ tối thiểu:
          </label>
          <input
            type="number"
            value={minWords}
            onChange={(e) => setMinWords(parseInt(e.target.value) || 20)}
            min="20"
            max="100"
            className="w-full rounded-xl border-2 border-amber-200 px-4 py-3 focus:border-amber-400 focus:outline-none"
          />
          <p className="mt-1 text-sm text-gray-500">
            💡 Cambridge YLE yêu cầu tối thiểu 20 từ cho Flyers
          </p>
        </div>
      </div>

      {/* Images Grid */}
      <div className="rounded-2xl border-4 border-amber-200 bg-white p-6">
        <h4 className="mb-4 font-baloo text-xl font-bold text-amber-600">
          🖼️ Tranh minh họa ({images.length} tranh)
        </h4>
        <p className="mb-4 text-sm text-gray-600">
          Tải lên 3-6 tranh kể câu chuyện theo thứ tự
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-baloo text-lg font-bold text-amber-600">
                  Tranh {index + 1}
                </span>
                {images.length > 3 && (
                  <button
                    onClick={() => removeImageSlot(index)}
                    className="rounded-lg border-2 border-red-300 bg-red-50 p-1 text-red-600 hover:bg-red-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {image ? (
                <div className="relative">
                  <img
                    src={getFullMediaUrl(image)}
                    alt={`Story image ${index + 1}`}
                    className="h-48 w-full rounded-xl border-4 border-amber-200 object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-4 border-dashed border-amber-300 bg-amber-50 transition-all hover:border-amber-400 hover:bg-amber-100">
                  <Upload className="mb-2 h-10 w-10 text-amber-400" />
                  <span className="font-baloo text-sm font-bold text-amber-600">
                    {uploading === index ? 'Đang tải... 🚀' : 'Tải ảnh lên 📸'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(index, file);
                    }}
                    disabled={uploading === index}
                  />
                </label>
              )}
            </div>
          ))}
        </div>

        {/* Add Image Button */}
        {images.length < 6 && (
          <button
            onClick={addImageSlot}
            className="mt-4 w-full rounded-xl border-4 border-dashed border-amber-300 bg-amber-50 py-4 font-baloo text-lg font-bold text-amber-600 transition-all hover:border-amber-400 hover:bg-amber-100"
          >
            + Thêm tranh (tối đa 6)
          </button>
        )}
      </div>

      {/* Scoring Criteria Info */}
      <div className="rounded-2xl border-4 border-blue-200 bg-blue-50 p-6">
        <h4 className="mb-3 font-baloo text-xl font-bold text-blue-600">
          📊 Tiêu chí chấm điểm
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between rounded-lg bg-white p-3">
            <span className="font-medium">📝 Nội dung (Content)</span>
            <span className="font-bold text-blue-600">3 điểm</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-white p-3">
            <span className="font-medium">🔤 Ngôn ngữ (Language)</span>
            <span className="font-bold text-blue-600">3 điểm</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-white p-3">
            <span className="font-medium">📋 Tổ chức (Organization)</span>
            <span className="font-bold text-blue-600">2 điểm</span>
          </div>
          <div className="mt-2 rounded-lg border-2 border-blue-300 bg-white p-3">
            <span className="font-bold text-blue-700">Tổng: 8 điểm</span>
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
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-4 font-baloo text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-xl"
        >
          <Save className="h-5 w-5" />
          <span>Lưu câu hỏi 💾</span>
        </button>
      </div>
    </div>
  );
};

export default PictureStoryWritingEditor;
