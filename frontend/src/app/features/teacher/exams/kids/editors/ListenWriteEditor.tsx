import React, { useState, useEffect } from 'react';
import { X, Upload, Play, Pause, Plus, Trash2, Volume2 } from 'lucide-react';
import { uploadKidsMedia } from '../../../../../../services/kidsExamApi';
import { useToastContext } from '../../../../../../contexts/ToastContext';

interface ListenWriteEditorProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId: string | null;
  questionId?: string | null;
}

interface WriteItem {
  id: string;
  text: string;
  answer: string;
  audioUrl?: string;
  imageUrl?: string; // Add image support
  isExample?: boolean; // Mark as example question
}

const ListenWriteEditor: React.FC<ListenWriteEditorProps> = ({
  onSave,
  onCancel,
  initialData,
  examId,
  questionId,
}) => {
  const toast = useToastContext();
  const [title, setTitle] = useState(initialData?.title || 'Nghe và viết');
  const [points, setPoints] = useState(initialData?.points || 5);
  const [items, setItems] = useState<WriteItem[]>(
    initialData?.config?.items || [
      { id: '1', text: 'Question 1:', answer: '', audioUrl: '' },
    ]
  );
  const [mainAudioUrl, setMainAudioUrl] = useState(initialData?.config?.mainAudioUrl || '');
  const [mainImageUrl, setMainImageUrl] = useState(initialData?.config?.mainImageUrl || '');
  const [audioPreview, setAudioPreview] = useState<string | null>(initialData?.config?.mainAudioUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  // Handle paste event for image
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items || !examId) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const blob = items[i].getAsFile();
          if (blob) {
            await uploadImageFromBlob(blob);
          }
          break;
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [examId]);

  const uploadImageFromBlob = async (blob: Blob) => {
    if (!examId) {
      toast.error('Vui lòng tạo đề thi trước!');
      return;
    }

    // Check file size (max 20MB)
    if (blob.size > 20 * 1024 * 1024) {
      toast.error('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 20MB 😊');
      return;
    }

    // Convert blob to file
    const file = new File([blob], `pasted-image-${Date.now()}.png`, { type: blob.type });

    console.log('📤 Uploading pasted image:', file.name, file.type, file.size);
    setIsUploading(true);
    try {
      const response = await uploadKidsMedia(file, 'image', examId);
      console.log('📦 Upload response:', response);
      
      const imageUrl = response.media?.url || response.url;
      if (imageUrl) {
        setMainImageUrl(imageUrl);
        console.log('✅ Pasted image uploaded:', imageUrl);
        toast.success('✅ Paste ảnh thành công! Nhớ nhấn "Lưu câu hỏi" để lưu vào database 💾');
      } else {
        throw new Error('No URL in response');
      }
    } catch (error: any) {
      console.error('❌ Failed to upload pasted image:', error);
      console.error('❌ Error details:', error.response?.data);
      toast.error(`Không thể tải ảnh lên: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddItem = () => {
    const newItem: WriteItem = {
      id: Date.now().toString(),
      text: `Question ${items.length + 1}:`,
      answer: '',
      audioUrl: '',
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof WriteItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleMainAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !examId) {
      toast.error('Vui lòng chọn file audio!');
      return;
    }

    console.log('📤 Uploading main audio:', file.name, file.type, file.size);
    
    // Create preview URL immediately
    const previewUrl = URL.createObjectURL(file);
    setAudioPreview(previewUrl);
    
    setIsUploading(true);
    try {
      const response = await uploadKidsMedia(file, 'audio', examId);
      console.log('📦 Upload response:', response);
      
      const audioUrl = response.media?.url || response.url;
      if (audioUrl) {
        setMainAudioUrl(audioUrl);
        console.log('✅ Main audio uploaded:', audioUrl);
        toast.success('✅ Tải audio thành công!');
      } else {
        throw new Error('No URL in response');
      }
    } catch (error: any) {
      console.error('❌ Failed to upload audio:', error);
      console.error('❌ Error details:', error.response?.data);
      toast.error(`Không thể tải audio lên: ${error.response?.data?.message || error.message}`);
      // Clear preview on error
      setAudioPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !examId) {
      toast.error('Vui lòng chọn file ảnh!');
      return;
    }

    // Check file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 20MB 😊');
      return;
    }

    console.log('📤 Uploading main image:', file.name, file.type, file.size);
    setIsUploading(true);
    try {
      const response = await uploadKidsMedia(file, 'image', examId);
      console.log('📦 Upload response:', response);
      
      const imageUrl = response.media?.url || response.url;
      if (imageUrl) {
        setMainImageUrl(imageUrl);
        console.log('✅ Main image uploaded:', imageUrl);
        toast.success('✅ Tải ảnh thành công! Nhớ nhấn "Lưu câu hỏi" để lưu vào database 💾');
      } else {
        throw new Error('No URL in response');
      }
    } catch (error: any) {
      console.error('❌ Failed to upload image:', error);
      console.error('❌ Error details:', error.response?.data);
      toast.error(`Không thể tải ảnh lên: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleItemImageUpload = async (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !examId) {
      toast.error('Vui lòng chọn file ảnh!');
      return;
    }

    // Check file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 20MB 😊');
      return;
    }

    console.log('📤 Uploading item image:', file.name, file.type, file.size);
    setIsUploading(true);
    try {
      const response = await uploadKidsMedia(file, 'image', examId);
      console.log('📦 Upload response:', response);
      
      const imageUrl = response.media?.url || response.url;
      if (imageUrl) {
        handleItemChange(itemId, 'imageUrl', imageUrl);
        console.log('✅ Item image uploaded:', imageUrl);
        toast.success('✅ Tải ảnh thành công!');
      } else {
        throw new Error('No URL in response');
      }
    } catch (error: any) {
      console.error('❌ Failed to upload image:', error);
      console.error('❌ Error details:', error.response?.data);
      toast.error(`Không thể tải ảnh lên: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleItemAudioUpload = async (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !examId) {
      toast.error('Vui lòng chọn file audio!');
      return;
    }

    console.log('📤 Uploading item audio:', file.name, file.type, file.size);
    setIsUploading(true);
    try {
      const response = await uploadKidsMedia(file, 'audio', examId);
      console.log('📦 Upload response:', response);
      
      const audioUrl = response.media?.url || response.url;
      if (audioUrl) {
        handleItemChange(itemId, 'audioUrl', audioUrl);
        console.log('✅ Item audio uploaded:', audioUrl);
        toast.success('✅ Tải audio thành công!');
      } else {
        throw new Error('No URL in response');
      }
    } catch (error: any) {
      console.error('❌ Failed to upload audio:', error);
      console.error('❌ Error details:', error.response?.data);
      toast.error(`Không thể tải audio lên: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const toggleAudio = (audioUrl: string) => {
    if (playingAudio === audioUrl) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(audioUrl);
    }
  };

  const handleSave = () => {
    // Allow saving even if incomplete (draft mode)
    // User can come back and edit later
    
    const questionData = {
      type: 'listen_and_write', // IMPORTANT: This identifies Part 2
      title,
      points,
      config: {
        mainAudioUrl,
        mainImageUrl,
        items: items.map(item => ({
          id: item.id,
          text: item.text,
          answer: item.answer,
          audioUrl: item.audioUrl,
          imageUrl: item.imageUrl,
          isExample: item.isExample,
        })),
      },
    };

    console.log('💾 ListenWriteEditor saving:', questionData);
    onSave(questionData);
  };

  return (
    <div className="min-h-[600px] space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✍️</span>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Nghe và viết
            </h3>
            <p className="text-sm text-slate-500">Part 2 - Nghe và viết từ</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="rounded-full p-2 transition-colors hover:bg-slate-100"
        >
          <X className="h-5 w-5 text-slate-500" />
        </button>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Tiêu đề câu hỏi / Hướng dẫn <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
            placeholder="Ví dụ: Nghe và viết. Có một ví dụ."
          />
          <p className="mt-1 text-xs text-slate-500">
            Hướng dẫn này sẽ hiển thị cho học sinh biết phải làm gì
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Điểm
          </label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value))}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
            min="1"
          />
        </div>
      </div>

      {/* Main Image - Prominent position */}
      <div>
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
          <span className="text-lg">🖼️</span>
          <span>Hình ảnh chính cho câu hỏi</span>
        </label>
        <p className="mb-2 text-xs text-slate-500">
          Hình ảnh này sẽ hiển thị cho tất cả học sinh khi làm bài. Có thể Ctrl+V để paste trực tiếp.
        </p>
        
        {!mainImageUrl ? (
          <label className="flex cursor-pointer items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 transition-colors hover:border-orange-400 hover:bg-orange-50/40">
            <Upload className="h-7 w-7 text-slate-400" />
            <div className="text-center">
              <span className="block text-sm font-medium text-slate-700">
                {isUploading ? 'Đang tải lên...' : 'Nhấn để tải hình ảnh lên'}
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                PNG, JPG, GIF, WebP (tối đa 20MB) hoặc Ctrl+V để paste
              </span>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleMainImageUpload}
              disabled={isUploading}
            />
          </label>
        ) : (
          <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-center bg-slate-50 p-4">
              <img
                src={mainImageUrl}
                alt="Main question image"
                className="max-h-96 w-auto rounded-lg"
              />
            </div>
            <button
              type="button"
              onClick={() => setMainImageUrl('')}
              className="absolute right-3 top-3 rounded-full bg-red-500 p-2 text-white shadow-sm transition-colors hover:bg-red-600"
              title="Xóa hình ảnh"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Audio */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Audio File <span className="text-red-500">*</span>
        </label>
        
        {!audioPreview ? (
          <div className="flex items-center space-x-4">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-3 transition-colors hover:border-orange-400 hover:bg-orange-50/40">
              <Upload className="h-5 w-5 text-slate-400" />
              <span className="text-sm text-slate-700">
                {isUploading ? 'Đang upload...' : 'Upload Audio'}
              </span>
              <input
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav,audio/m4a,audio/mp4,audio/ogg"
                className="hidden"
                onChange={handleMainAudioUpload}
                disabled={isUploading}
              />
            </label>
            <span className="text-xs text-slate-500">MP3, WAV (max 10MB)</span>
            {isUploading && <span className="text-sm text-orange-600 animate-pulse">Đang tải...</span>}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <Volume2 className="h-6 w-6 text-slate-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Audio chính</p>
                <audio 
                  controls 
                  className="mt-2 w-full"
                  src={audioPreview}
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMainAudioUrl('');
                  setAudioPreview(null);
                }}
                className="rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                title="Xóa audio"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="space-y-4">
        {/* Sticky header with add button */}
        <div className="sticky top-0 z-40 -mx-6 mb-4 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h4 className="text-sm font-semibold text-slate-900">
            Danh sách câu hỏi ({items.length})
          </h4>
          <button
            onClick={handleAddItem}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm câu</span>
          </button>
        </div>

        {items.map((item, index) => (
          <div
            key={item.id}
            className={`rounded-xl border p-4 ${
              item.isExample
                ? 'border-amber-300 bg-amber-50'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-semibold ${
                  item.isExample ? 'text-amber-700' : 'text-slate-700'
                }`}>
                  {item.isExample ? '📌 Câu ví dụ' : `Câu ${index + 1}`}
                </span>
              </div>
              {items.length > 1 && (
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="rounded p-1 text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {/* Example checkbox */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.isExample || false}
                  onChange={(e) => {
                    setItems(items.map(i =>
                      i.id === item.id ? { ...i, isExample: e.target.checked } : i
                    ));
                  }}
                  className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                />
                <span className="text-sm font-medium text-slate-700">
                  ✨ Đây là câu ví dụ (không tính điểm, hiển thị sẵn đáp án)
                </span>
              </label>
              
              {/* Question Text */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Câu hỏi
                </label>
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleItemChange(item.id, 'text', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  placeholder="Nhập câu hỏi..."
                />
              </div>

              {/* Answer */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Đáp án đúng *
                </label>
                <input
                  type="text"
                  value={item.answer}
                  onChange={(e) => handleItemChange(item.id, 'answer', e.target.value)}
                  className="w-full rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  placeholder="Nhập đáp án..."
                />
              </div>

              {/* Item Audio */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Audio riêng (tùy chọn)
                </label>
                <div className="flex items-center space-x-2">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50">
                    <Upload className="h-4 w-4" />
                    <span>Tải audio</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleItemAudioUpload(item.id, e)}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  {item.audioUrl && (
                    <button
                      onClick={() => toggleAudio(item.audioUrl!)}
                      className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      {playingAudio === item.audioUrl ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <button
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
        >
          Lưu câu hỏi
        </button>
      </div>

      {/* Hidden Audio Player */}
      {playingAudio && (
        <audio
          src={playingAudio}
          autoPlay
          onEnded={() => setPlayingAudio(null)}
          className="hidden"
        />
      )}
    </div>
  );
};

export default ListenWriteEditor;
