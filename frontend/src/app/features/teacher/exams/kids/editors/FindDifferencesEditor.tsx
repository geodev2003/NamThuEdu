import React, { useState } from 'react';
import { Upload, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { uploadKidsMedia } from '../../../../../../services/kidsExamApi';

interface FindDifferencesEditorProps {
  onSave: (questionData: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId?: string | null;
  questionId?: number | null;
}

const FindDifferencesEditor: React.FC<FindDifferencesEditorProps> = ({
  onSave,
  onCancel,
  initialData,
  questionId
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [imageAUrl, setImageAUrl] = useState(initialData?.question_data?.image_a_url || '');
  const [imageBUrl, setImageBUrl] = useState(initialData?.question_data?.image_b_url || '');
  const [differences, setDifferences] = useState<string[]>(
    initialData?.question_data?.differences || ['']
  );
  const [uploadingA, setUploadingA] = useState(false);
  const [uploadingB, setUploadingB] = useState(false);
  const [error, setError] = useState('');

  const handleImageAUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingA(true);
      setError('');
      const url = await uploadKidsMedia(file, 'image');
      setImageAUrl(url);
    } catch (err: any) {
      setError(err.message || 'Lỗi upload hình A');
    } finally {
      setUploadingA(false);
    }
  };

  const handleImageBUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingB(true);
      setError('');
      const url = await uploadKidsMedia(file, 'image');
      setImageBUrl(url);
    } catch (err: any) {
      setError(err.message || 'Lỗi upload hình B');
    } finally {
      setUploadingB(false);
    }
  };

  const addDifference = () => {
    setDifferences([...differences, '']);
  };

  const updateDifference = (index: number, value: string) => {
    const updated = [...differences];
    updated[index] = value;
    setDifferences(updated);
  };

  const removeDifference = (index: number) => {
    setDifferences(differences.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Validation
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề câu hỏi');
      return;
    }

    if (!imageAUrl || !imageBUrl) {
      setError('Vui lòng upload cả 2 hình');
      return;
    }

    const validDifferences = differences.filter(d => d.trim());
    if (validDifferences.length === 0) {
      setError('Vui lòng thêm ít nhất 1 điểm khác biệt');
      return;
    }

    const questionData = {
      id: questionId,
      type: 'find_differences',
      title,
      points: 10,
      question_data: {
        image_a_url: imageAUrl,
        image_b_url: imageBUrl,
        differences: validDifferences
      }
    };

    onSave(questionData);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-4 border-red-200 bg-gradient-to-r from-red-100 to-orange-100 p-6">
        <div className="flex items-center space-x-4">
          <span className="text-6xl">🔍</span>
          <div className="flex-1">
            <h3 className="font-baloo text-3xl font-bold text-red-600">
              Find the Differences
            </h3>
            <p className="mt-2 text-lg text-gray-700">
              So sánh 2 bức tranh và mô tả sự khác biệt
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
          placeholder="VD: Tìm 5 điểm khác biệt giữa 2 bức tranh"
          className="w-full rounded-xl border-2 border-gray-300 p-4 text-lg focus:border-red-400 focus:outline-none"
        />
      </div>

      {/* Images Upload */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Image A */}
        <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
          <label className="mb-3 block font-baloo text-xl font-bold text-blue-600">
            🖼️ Hình A
          </label>
          
          {imageAUrl ? (
            <div className="space-y-4">
              <img
                src={imageAUrl}
                alt="Picture A"
                className="h-64 w-full rounded-xl border-4 border-blue-200 object-cover"
              />
              <button
                onClick={() => setImageAUrl('')}
                className="flex w-full items-center justify-center space-x-2 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-red-600 transition-all hover:bg-red-100"
              >
                <Trash2 className="h-5 w-5" />
                <span>Xóa hình</span>
              </button>
            </div>
          ) : (
            <label className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-4 border-dashed border-blue-300 bg-blue-50 transition-all hover:border-blue-400 hover:bg-blue-100">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageAUpload}
                className="hidden"
                disabled={uploadingA}
              />
              {uploadingA ? (
                <div className="text-center">
                  <div className="text-6xl animate-spin">🎨</div>
                  <p className="mt-4 font-baloo text-xl text-blue-600">
                    Đang tải lên...
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="h-16 w-16 text-blue-400" />
                  <p className="mt-4 font-baloo text-xl text-blue-600">
                    Nhấn để tải hình A
                  </p>
                </>
              )}
            </label>
          )}
        </div>

        {/* Image B */}
        <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
          <label className="mb-3 block font-baloo text-xl font-bold text-orange-600">
            🖼️ Hình B
          </label>
          
          {imageBUrl ? (
            <div className="space-y-4">
              <img
                src={imageBUrl}
                alt="Picture B"
                className="h-64 w-full rounded-xl border-4 border-orange-200 object-cover"
              />
              <button
                onClick={() => setImageBUrl('')}
                className="flex w-full items-center justify-center space-x-2 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-red-600 transition-all hover:bg-red-100"
              >
                <Trash2 className="h-5 w-5" />
                <span>Xóa hình</span>
              </button>
            </div>
          ) : (
            <label className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-4 border-dashed border-orange-300 bg-orange-50 transition-all hover:border-orange-400 hover:bg-orange-100">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageBUpload}
                className="hidden"
                disabled={uploadingB}
              />
              {uploadingB ? (
                <div className="text-center">
                  <div className="text-6xl animate-spin">🎨</div>
                  <p className="mt-4 font-baloo text-xl text-orange-600">
                    Đang tải lên...
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="h-16 w-16 text-orange-400" />
                  <p className="mt-4 font-baloo text-xl text-orange-600">
                    Nhấn để tải hình B
                  </p>
                </>
              )}
            </label>
          )}
        </div>
      </div>

      {/* Differences List */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        {/* Sticky header with add button */}
        <div className="sticky top-0 z-40 -mx-6 -mt-6 mb-4 flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <label className="font-baloo text-xl font-bold text-gray-700">
            📋 Danh sách điểm khác biệt (cho giáo viên chấm)
          </label>
          <button
            onClick={addDifference}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 px-4 py-2 text-white transition-all hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span>Thêm</span>
          </button>
        </div>

        <div className="space-y-3">
          {differences.map((diff, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="font-baloo text-2xl font-bold text-red-500">
                {index + 1}.
              </span>
              <input
                type="text"
                value={diff}
                onChange={(e) => updateDifference(index, e.target.value)}
                placeholder="VD: Hình A có 3 quả táo, hình B có 2 quả táo"
                className="flex-1 rounded-xl border-2 border-gray-300 p-3 text-lg focus:border-red-400 focus:outline-none"
              />
              {differences.length > 1 && (
                <button
                  onClick={() => removeDifference(index)}
                  className="rounded-xl border-2 border-red-300 bg-red-50 p-3 text-red-600 transition-all hover:bg-red-100"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm text-gray-500">
          💡 Gợi ý: Liệt kê các điểm khác biệt để giáo viên dễ chấm bài nói của học viên
        </p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="flex w-full items-center justify-center space-x-3 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-8 py-5 font-baloo text-2xl font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
      >
        <Save className="h-7 w-7" />
        <span>Lưu câu hỏi 🎉</span>
      </button>
    </div>
  );
};

export default FindDifferencesEditor;
