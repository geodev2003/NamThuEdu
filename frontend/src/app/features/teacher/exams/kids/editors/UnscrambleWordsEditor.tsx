import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { uploadKidsMedia } from '../../../../../../services/kidsExamApi';
import { getFullMediaUrl } from '../../../../../../utils/mediaUtils';
import { useToastContext } from '../../../../../../contexts/ToastContext';
import { calculateQuestionPoints, getScorableItemsCount, getExampleItemsCount } from '../../../../../../utils/examUtils';

interface UnscrambleWordsEditorProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId: string | null;
  questionId: string | null;
}

interface WordItem {
  id: string;
  image_url: string;
  scrambled_word: string;
  correct_answer: string;
  isExample?: boolean; // Đánh dấu câu ví dụ
}

const UnscrambleWordsEditor: React.FC<UnscrambleWordsEditorProps> = ({
  onSave,
  onCancel,
  initialData,
  examId,
  questionId,
}) => {
  const toast = useToastContext();
  const [title, setTitle] = useState(initialData?.title || 'Unscramble Words');
  const [points, setPoints] = useState(initialData?.points || 5);
  const [items, setItems] = useState<WordItem[]>(
    initialData?.config?.items || [
      { id: '1', image_url: '', scrambled_word: '', correct_answer: '' },
    ]
  );
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);

  // Handle paste for images
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items || !examId || focusedItemIndex === null) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const blob = items[i].getAsFile();
          if (blob) {
            await uploadImageFromBlob(focusedItemIndex, blob);
          }
          break;
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [examId, focusedItemIndex]);

  const uploadImageFromBlob = async (index: number, blob: Blob) => {
    if (!examId) {
      toast.error('Vui lòng tạo đề thi trước!');
      return;
    }

    if (blob.size > 20 * 1024 * 1024) {
      toast.error('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 20MB 😊');
      return;
    }

    const file = new File([blob], `pasted-word-${index}-${Date.now()}.png`, { type: blob.type });

    setUploadingIndex(index);
    try {
      const response = await uploadKidsMedia(file, 'image', examId);
      const imageUrl = response.media?.url || response.url;
      if (imageUrl) {
        const newItems = [...items];
        newItems[index].image_url = imageUrl;
        setItems(newItems);
        toast.success('✅ Paste ảnh thành công! 💾');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`❌ Không thể tải ảnh lên: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleAddItem = () => {
    const newItem: WordItem = {
      id: Date.now().toString(),
      image_url: '',
      scrambled_word: '',
      correct_answer: '',
      isExample: false,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof WordItem, value: string | boolean) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-generate scrambled word if correct answer changes
    if (field === 'correct_answer' && typeof value === 'string' && value) {
      const scrambled = value.split('').sort(() => Math.random() - 0.5).join('');
      newItems[index].scrambled_word = scrambled;
    }
    
    setItems(newItems);
  };

  const handleImageUpload = async (index: number, file: File) => {
    try {
      setUploadingIndex(index);
      const response = await uploadKidsMedia(file, 'image', examId, questionId);
      
      if (response.url) {
        const newItems = [...items];
        newItems[index].image_url = response.url;
        setItems(newItems);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Không thể tải ảnh lên. Vui lòng thử lại!');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSave = () => {
    // Validate
    const hasEmptyFields = items.some(
      item => !item.image_url || !item.correct_answer || !item.scrambled_word
    );

    if (hasEmptyFields) {
      toast.warning('⚠️ Vui lòng điền đầy đủ thông tin cho tất cả các từ!');
      return;
    }

    // Calculate points based on non-example items only
    const config = {
      items: items.map(item => ({
        image_url: item.image_url,
        scrambled_word: item.scrambled_word,
        correct_answer: item.correct_answer.toLowerCase().trim(),
        isExample: item.isExample || false,
      })),
    };
    
    const calculatedPoints = calculateQuestionPoints(config, 1); // 1 point per item

    const questionData = {
      type: 'unscramble_words',
      title,
      points: calculatedPoints, // Use calculated points
      config,
    };

    console.log('💾 Saving question with calculated points:', {
      totalItems: items.length,
      scorableItems: getScorableItemsCount(items),
      exampleItems: getExampleItemsCount(items),
      calculatedPoints,
    });

    onSave(questionData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-4 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-baloo text-2xl font-bold text-purple-600">
              🔤 Unscramble Words
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Nhìn hình và sắp xếp chữ cái thành từ đúng
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
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
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
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none"
              placeholder="VD: Sắp xếp chữ cái thành từ đúng"
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
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none"
              min="1"
              max="10"
            />
          </div>
        </div>
      </div>

      {/* Word Items */}
      <div className="space-y-4">
        {/* Sticky header with add button */}
        <div className="sticky top-0 z-40 -mx-6 -mt-6 mb-4 flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <div>
            <h4 className="font-baloo text-lg font-bold text-gray-800">
              🖼️ Danh sách từ ({items.length})
            </h4>
            <p className="text-sm text-gray-600">
              {getScorableItemsCount(items)} câu chấm điểm • {getExampleItemsCount(items)} câu ví dụ
            </p>
          </div>
          <button
            onClick={handleAddItem}
            className="flex items-center space-x-2 rounded-lg bg-purple-500 px-4 py-2 text-white transition-all hover:bg-purple-600"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm từ</span>
          </button>
        </div>

        {items.map((item, index) => (
          <div
            key={item.id}
            className={`rounded-xl border-2 p-6 ${
              item.isExample
                ? 'border-amber-400 bg-amber-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h5 className="font-baloo text-lg font-bold text-purple-600">
                  Từ #{index + 1}
                </h5>
                {item.isExample && (
                  <span className="rounded-full bg-amber-500 px-3 py-1 text-sm font-bold text-white">
                    📌 Câu ví dụ
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <label className="flex cursor-pointer items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={item.isExample || false}
                    onChange={(e) => handleItemChange(index, 'isExample', e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Đánh dấu là ví dụ</span>
                </label>
                {items.length > 1 && (
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="rounded-lg border border-red-300 p-2 text-red-500 transition-all hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Image Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Hình ảnh * (Ctrl+V để paste)
                </label>
                <div className="space-y-2">
                  {item.image_url ? (
                    <div className="relative">
                      <img
                        src={getFullMediaUrl(item.image_url) || ''}
                        alt={`Word ${index + 1}`}
                        className="h-48 w-full rounded-lg border-2 border-gray-300 object-cover"
                      />
                      <button
                        onClick={() => handleItemChange(index, 'image_url', '')}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      tabIndex={0}
                      onClick={() => {
                        // Click lần 1: Focus vào ô này
                        if (focusedItemIndex !== index) {
                          setFocusedItemIndex(index);
                        } else {
                          // Click lần 2 (đã focus rồi): Mở file dialog
                          const input = document.getElementById(`file-input-${index}`) as HTMLInputElement;
                          if (input) input.click();
                        }
                      }}
                      onFocus={() => setFocusedItemIndex(index)}
                      onBlur={() => setFocusedItemIndex(null)}
                      className={`flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all ${
                        focusedItemIndex === index
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-300 bg-gray-50 hover:border-purple-500 hover:bg-purple-50'
                      }`}
                    >
                      <input
                        id={`file-input-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(index, file);
                        }}
                        className="hidden"
                        disabled={uploadingIndex === index}
                      />
                      {uploadingIndex === index ? (
                        <div className="text-center">
                          <div className="mb-2 text-4xl animate-spin">⏳</div>
                          <p className="text-sm text-gray-600">Đang tải...</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                          <p className="text-sm font-medium text-gray-700">
                            Nhấn để tải ảnh hoặc Ctrl+V
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG (tối đa 20MB)
                          </p>
                          {focusedItemIndex === index && (
                            <p className="mt-2 text-xs font-bold text-purple-600 animate-pulse">
                              💡 Bạn có thể Ctrl+V để dán ảnh từ clipboard
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Word Fields */}
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Từ đúng * (Đáp án)
                  </label>
                  <input
                    type="text"
                    value={item.correct_answer}
                    onChange={(e) =>
                      handleItemChange(index, 'correct_answer', e.target.value)
                    }
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 font-bold text-green-600 focus:border-purple-500 focus:outline-none"
                    placeholder="VD: cat"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Nhập từ đúng, hệ thống sẽ tự động xáo trộn chữ cái
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Chữ cái xáo trộn *
                  </label>
                  <input
                    type="text"
                    value={item.scrambled_word}
                    onChange={(e) =>
                      handleItemChange(index, 'scrambled_word', e.target.value)
                    }
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 font-bold text-purple-600 focus:border-purple-500 focus:outline-none"
                    placeholder="VD: tac"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Có thể chỉnh sửa thủ công nếu cần
                  </p>
                </div>

                {/* Preview */}
                {item.correct_answer && item.scrambled_word && (
                  <div className="rounded-lg bg-purple-50 p-3">
                    <p className="mb-1 text-xs font-medium text-gray-600">
                      Xem trước:
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="rounded bg-purple-200 px-3 py-1 font-baloo text-lg font-bold text-purple-700">
                        {item.scrambled_word}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="rounded bg-green-200 px-3 py-1 font-baloo text-lg font-bold text-green-700">
                        {item.correct_answer}
                      </span>
                    </div>
                  </div>
                )}
              </div>
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
          <li>• Tải ảnh minh họa cho mỗi từ (động vật, đồ vật, v.v.)</li>
          <li>• Nhập từ đúng, hệ thống sẽ tự động xáo trộn chữ cái</li>
          <li>• Có thể chỉnh sửa chữ cái xáo trộn nếu muốn</li>
          <li>• Học viên sẽ nhìn hình và sắp xếp chữ cái thành từ đúng</li>
          <li>• Phù hợp cho Starters (6-7 tuổi)</li>
        </ul>
      </div>
    </div>
  );
};

export default UnscrambleWordsEditor;
