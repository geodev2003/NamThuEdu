import React, { useState } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { uploadKidsMedia } from '../../../../../../services/kidsExamApi';

interface ObjectPlacementEditorProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId: string | null;
  questionId?: string | null;
}

interface PlacementItem {
  id: string;
  name: string;
  cardImageUrl: string;
  correctX: number;
  correctY: number;
}

const ObjectPlacementEditor: React.FC<ObjectPlacementEditorProps> = ({
  onSave,
  onCancel,
  initialData,
  examId,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [baseImageUrl, setBaseImageUrl] = useState(initialData?.config?.base_image_url || '');
  const [items, setItems] = useState<PlacementItem[]>(initialData?.config?.items || []);
  const [uploading, setUploading] = useState(false);

  const handleBaseImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !examId) return;

    setUploading(true);
    try {
      const response = await uploadKidsMedia(parseInt(examId), file, 'image');
      setBaseImageUrl(response.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Không thể upload hình. Vui lòng thử lại!');
    } finally {
      setUploading(false);
    }
  };

  const handleCardImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0];
    if (!file || !examId) return;

    setUploading(true);
    try {
      const response = await uploadKidsMedia(parseInt(examId), file, 'image');
      setItems(items.map(item => 
        item.id === itemId ? { ...item, cardImageUrl: response.url } : item
      ));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Không thể upload hình. Vui lòng thử lại!');
    } finally {
      setUploading(false);
    }
  };

  const addItem = () => {
    const newItem: PlacementItem = {
      id: `item-${Date.now()}`,
      name: '',
      cardImageUrl: '',
      correctX: 50,
      correctY: 50,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof PlacementItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề!');
      return;
    }

    if (!baseImageUrl) {
      alert('Vui lòng upload tranh lớn!');
      return;
    }

    if (items.length === 0) {
      alert('Vui lòng thêm ít nhất 1 thẻ hình!');
      return;
    }

    const invalidItems = items.filter(item => !item.name || !item.cardImageUrl);
    if (invalidItems.length > 0) {
      alert('Vui lòng điền đầy đủ thông tin cho tất cả thẻ hình!');
      return;
    }

    onSave({
      type: 'object_placement',
      title,
      points: items.length,
      config: {
        base_image_url: baseImageUrl,
        items: items.map(item => ({
          name: item.name,
          card_image_url: item.cardImageUrl,
          correct_position: {
            x: item.correctX,
            y: item.correctY,
          },
        })),
      },
    });
  };

  return (
    <div className="rounded-2xl border-4 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-baloo text-3xl font-bold text-purple-600">
            📍 Object Placement
          </h3>
          <p className="text-lg text-gray-600">
            Starters Speaking Part 1 - Đặt thẻ hình vào đúng vị trí
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
          📝 Tiêu đề câu hỏi
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="VD: Đặt các đồ vật vào đúng vị trí trong phòng"
          className="w-full rounded-xl border-2 border-purple-200 px-4 py-3 text-lg focus:border-purple-400 focus:outline-none"
        />
      </div>

      {/* Base Image */}
      <div className="mb-6">
        <label className="mb-2 block font-baloo text-xl font-bold text-gray-700">
          🖼️ Tranh lớn (Base Image)
        </label>
        <p className="mb-3 text-sm text-gray-600">
          Upload tranh lớn có nhiều vị trí để đặt thẻ hình
        </p>
        
        {baseImageUrl ? (
          <div className="relative">
            <img
              src={baseImageUrl}
              alt="Base"
              className="w-full max-w-2xl rounded-xl border-4 border-purple-200"
            />
            <button
              onClick={() => setBaseImageUrl('')}
              className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-4 border-dashed border-purple-300 bg-white p-8 hover:bg-purple-50">
            <Upload className="mb-2 h-12 w-12 text-purple-400" />
            <span className="font-medium text-purple-600">
              {uploading ? 'Đang upload...' : 'Click để upload tranh lớn'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleBaseImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {/* Items */}
      <div className="mb-6">
        {/* Sticky header with add button */}
        <div className="sticky top-0 z-40 -mx-6 -mt-6 mb-3 flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <label className="font-baloo text-xl font-bold text-gray-700">
            🃏 Thẻ hình nhỏ ({items.length})
          </label>
          <button
            onClick={addItem}
            className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
          >
            <Plus className="h-5 w-5" />
            Thêm thẻ hình
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="rounded-xl border-2 border-purple-200 bg-white p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-baloo text-lg font-bold text-purple-600">
                  Thẻ {index + 1}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tên đồ vật
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    placeholder="VD: shell, tree, ball"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>

                {/* Card Image */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Hình thẻ nhỏ
                  </label>
                  {item.cardImageUrl ? (
                    <div className="relative">
                      <img
                        src={item.cardImageUrl}
                        alt={item.name}
                        className="h-20 w-20 rounded-lg border-2 border-purple-200 object-cover"
                      />
                      <button
                        onClick={() => updateItem(item.id, 'cardImageUrl', '')}
                        className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:bg-gray-50">
                      <Upload className="h-6 w-6 text-gray-400" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCardImageUpload(e, item.id)}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>

                {/* Position */}
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Vị trí đúng (X: {item.correctX}%, Y: {item.correctY}%)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={item.correctX}
                      onChange={(e) => updateItem(item.id, 'correctX', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={item.correctY}
                      onChange={(e) => updateItem(item.id, 'correctY', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <p className="text-gray-500">
                Chưa có thẻ hình nào. Nhấn "Thêm thẻ hình" để bắt đầu!
              </p>
            </div>
          )}
        </div>
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
          className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-3 font-baloo text-xl font-bold text-white hover:from-purple-600 hover:to-pink-600"
        >
          💾 Lưu câu hỏi
        </button>
      </div>
    </div>
  );
};

export default ObjectPlacementEditor;
