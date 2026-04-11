import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Save, X, Volume2, Image as ImageIcon } from 'lucide-react';
import { uploadKidsMedia } from '../../../../../../services/kidsExamApi';
import { useToastContext } from '../../../../../../contexts/ToastContext';

interface ListenColourEditorProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId: string | null;
  questionId: string | null;
}

interface ColourInstruction {
  id: string;
  objectName: string;
  colour: string;
  position: string;
  writeText?: string; // NEW: Optional text to write (Movers/Flyers Part 5)
  isExample: boolean;
}

const ListenColourEditor: React.FC<ListenColourEditorProps> = ({
  onSave,
  onCancel,
  initialData,
  examId,
  questionId,
}) => {
  console.log('🎯 ListenColourEditor loaded with initialData:', initialData);
  console.log('🎯 examId:', examId, 'questionId:', questionId);

  const toast = useToastContext();
  const [title, setTitle] = useState('');
  const [mainAudioUrl, setMainAudioUrl] = useState('');
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [instructions, setInstructions] = useState<ColourInstruction[]>([]);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setMainAudioUrl(initialData.config?.mainAudioUrl || '');
      setMainImageUrl(initialData.config?.mainImageUrl || '');
      
      // Map instructions with writeText support
      const mappedInstructions = (initialData.config?.instructions || []).map((inst: any) => ({
        ...inst,
        writeText: inst.writeText || inst.write_text || ''
      }));
      setInstructions(mappedInstructions);
    }
  }, [initialData]);

  // Handle paste for main image
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const blob = items[i].getAsFile();
          if (blob) {
            await uploadMainImageFromBlob(blob);
          }
          break;
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [examId]);

  const uploadMainImageFromBlob = async (blob: Blob) => {
    if (!examId) {
      toast.error('Vui lòng tạo đề thi trước!');
      return;
    }

    setUploadingImage(true);
    try {
      const file = new File([blob], 'pasted-image.png', { type: 'image/png' });
      const response = await uploadKidsMedia(file, 'image', examId, null);
      
      const imageUrl = response.media?.url || response.url;
      if (imageUrl) {
        setMainImageUrl(imageUrl);
        toast.success('✅ Đã tải ảnh lên!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('❌ Không thể tải ảnh lên!');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleMainAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !examId) return;

    setUploadingAudio(true);
    try {
      const response = await uploadKidsMedia(file, 'audio', examId, null);
      const audioUrl = response.media?.url || response.url;
      
      if (audioUrl) {
        setMainAudioUrl(audioUrl);
        toast.success('✅ Đã tải audio lên!');
      } else {
        throw new Error('No URL in response');
      }
    } catch (error) {
      console.error('❌ Audio upload error:', error);
      toast.error('❌ Không thể tải audio lên!');
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !examId) return;

    setUploadingImage(true);
    try {
      const response = await uploadKidsMedia(file, 'image', examId, null);
      const imageUrl = response.media?.url || response.url;
      
      if (imageUrl) {
        setMainImageUrl(imageUrl);
        toast.success('✅ Đã tải ảnh lên!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('❌ Không thể tải ảnh lên!');
    } finally {
      setUploadingImage(false);
    }
  };

  const addInstruction = () => {
    const newInstruction: ColourInstruction = {
      id: Date.now().toString(),
      objectName: '',
      colour: '',
      position: '',
      writeText: '', // NEW: Optional write text
      isExample: false,
    };
    setInstructions([...instructions, newInstruction]);
  };

  const updateInstruction = (id: string, field: keyof ColourInstruction, value: any) => {
    setInstructions(instructions.map(inst => 
      inst.id === id ? { ...inst, [field]: value } : inst
    ));
  };

  const deleteInstruction = (id: string) => {
    setInstructions(instructions.filter(inst => inst.id !== id));
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.warning('⚠️ Vui lòng nhập tiêu đề!');
      return;
    }

    const questionData = {
      type: 'listen_colour_write',
      title,
      points: 5,
      config: {
        mainAudioUrl,
        mainImageUrl,
        instructions: instructions.map(inst => ({
          id: inst.id,
          objectName: inst.objectName,
          colour: inst.colour,
          position: inst.position,
          write_text: inst.writeText || null, // NEW: Add write_text field
          isExample: inst.isExample
        })),
      },
    };

    console.log('💾 Saving question:', questionData);
    toast.success('✅ Đã lưu câu hỏi thành công!');
    onSave(questionData);
  };

  const colours = [
    { value: 'red', label: '🔴 Đỏ', color: '#ef4444' },
    { value: 'blue', label: '🔵 Xanh dương', color: '#3b82f6' },
    { value: 'green', label: '🟢 Xanh lá', color: '#22c55e' },
    { value: 'yellow', label: '🟡 Vàng', color: '#eab308' },
    { value: 'orange', label: '🟠 Cam', color: '#f97316' },
    { value: 'purple', label: '🟣 Tím', color: '#a855f7' },
    { value: 'pink', label: '🩷 Hồng', color: '#ec4899' },
    { value: 'brown', label: '🟤 Nâu', color: '#92400e' },
    { value: 'black', label: '⚫ Đen', color: '#000000' },
    { value: 'white', label: '⚪ Trắng', color: '#ffffff' },
    { value: 'grey', label: '⚪ Xám', color: '#6b7280' },
  ];

  return (
    <div className="space-y-6 rounded-2xl border-4 border-indigo-200 bg-white p-6 shadow-xl">
      {/* Header */}
      <div className="border-b-4 border-indigo-100 pb-4">
        <h3 className="font-baloo text-3xl font-bold text-indigo-600">
          🎨 Phần 4: Nghe và Tô Màu
        </h3>
        <p className="mt-1 text-gray-600">
          Học viên nghe audio, tô màu theo hướng dẫn, và upload ảnh đã tô
        </p>
      </div>

      {/* Question Title */}
      <div>
        <label className="mb-2 block font-baloo text-lg font-bold text-gray-700">
          📝 Tiêu đề câu hỏi / Hướng dẫn
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="VD: Nghe và tô màu các đồ vật trong tranh"
          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none"
        />
        <p className="mt-1 text-sm text-gray-500">
          Hướng dẫn chung cho học viên về cách làm bài
        </p>
      </div>

      {/* Main Audio Upload */}
      <div>
        <label className="mb-2 block font-baloo text-lg font-bold text-gray-700">
          🎧 Audio Hướng Dẫn Chính
        </label>
        
        {!mainAudioUrl ? (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 transition-all hover:border-indigo-400 hover:bg-indigo-50">
            <Volume2 className="mb-2 h-12 w-12 text-gray-400" />
            <span className="mb-1 text-base font-medium text-gray-700">
              {uploadingAudio ? 'Đang tải lên...' : 'Nhấn để tải audio lên'}
            </span>
            <span className="text-sm text-gray-500">MP3, WAV, M4A (tối đa 20MB)</span>
            <input
              type="file"
              accept="audio/*"
              onChange={handleMainAudioUpload}
              className="hidden"
              disabled={uploadingAudio}
            />
          </label>
        ) : (
          <div className="rounded-xl border-2 border-indigo-400 bg-white p-4">
            <div className="flex items-center justify-between">
              <audio controls src={mainAudioUrl} className="flex-1">
                Trình duyệt không hỗ trợ audio
              </audio>
              <button
                onClick={() => setMainAudioUrl('')}
                className="ml-4 rounded-lg bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                title="Xóa audio"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Image Upload */}
      <div>
        <label className="mb-2 block font-baloo text-lg font-bold text-gray-700">
          🖼️ Tranh Cần Tô Màu (Ctrl+V để paste)
        </label>
        
        {!mainImageUrl ? (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 transition-all hover:border-purple-400 hover:bg-purple-50">
            <ImageIcon className="mb-2 h-12 w-12 text-gray-400" />
            <span className="mb-1 text-base font-medium text-gray-700">
              {uploadingImage ? 'Đang tải lên...' : 'Nhấn để tải ảnh hoặc Ctrl+V'}
            </span>
            <span className="text-sm text-gray-500">PNG, JPG, WEBP (tối đa 20MB)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageUpload}
              className="hidden"
              disabled={uploadingImage}
            />
          </label>
        ) : (
          <div className="rounded-xl border-2 border-purple-400 bg-white p-4">
            <div className="flex items-start justify-between">
              <img
                src={mainImageUrl}
                alt="Main"
                className="max-h-64 rounded-lg object-contain"
              />
              <button
                onClick={() => setMainImageUrl('')}
                className="ml-4 rounded-lg bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                title="Xóa ảnh"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Colouring Instructions */}
      <div>
        {/* Sticky header with add button */}
        <div className="sticky top-0 z-40 -mx-6 -mt-6 mb-4 flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <h4 className="font-baloo text-2xl font-bold text-gray-800">
            🎨 Danh Sách Hướng Dẫn Tô Màu
          </h4>
          <button
            onClick={addInstruction}
            className="flex items-center space-x-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
          >
            <Upload className="h-5 w-5" />
            <span>Thêm hướng dẫn</span>
          </button>
        </div>

        {instructions.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <div className="mb-3 text-5xl">🎨</div>
            <p className="text-gray-600">Chưa có hướng dẫn nào. Nhấn "Thêm hướng dẫn" để bắt đầu!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {instructions.map((inst, index) => (
              <div
                key={inst.id}
                className={`rounded-xl border-4 p-4 transition-all ${
                  inst.isExample
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                      {index + 1}
                    </span>
                    {inst.isExample && (
                      <span className="rounded-full bg-amber-500 px-3 py-1 text-sm font-bold text-white">
                        📌 Câu ví dụ
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inst.isExample}
                        onChange={(e) => updateInstruction(inst.id, 'isExample', e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300"
                      />
                      <span className="text-sm font-medium">Đánh dấu là ví dụ</span>
                    </label>
                    <button
                      onClick={() => deleteInstruction(inst.id)}
                      className="rounded-lg bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {/* Object Name */}
                  <div>
                    <label className="mb-1 block text-sm font-bold text-gray-700">
                      Đồ vật cần tô
                    </label>
                    <input
                      type="text"
                      value={inst.objectName}
                      onChange={(e) => updateInstruction(inst.id, 'objectName', e.target.value)}
                      placeholder="VD: quả táo"
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Colour */}
                  <div>
                    <label className="mb-1 block text-sm font-bold text-gray-700">
                      Màu sắc
                    </label>
                    <select
                      value={inst.colour}
                      onChange={(e) => updateInstruction(inst.id, 'colour', e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">Chọn màu...</option>
                      {colours.map(c => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="mb-1 block text-sm font-bold text-gray-700">
                      Vị trí
                    </label>
                    <input
                      type="text"
                      value={inst.position}
                      onChange={(e) => updateInstruction(inst.id, 'position', e.target.value)}
                      placeholder="VD: trên bàn"
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Write Text (Optional - Movers/Flyers Part 5) */}
                  <div>
                    <label className="mb-1 block text-sm font-bold text-gray-700">
                      ✍️ Từ cần viết (Tùy chọn - Movers/Flyers Part 5)
                    </label>
                    <input
                      type="text"
                      value={inst.writeText || ''}
                      onChange={(e) => updateInstruction(inst.id, 'writeText', e.target.value)}
                      placeholder="VD: fast (nếu yêu cầu viết thêm 1 từ)"
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Movers/Flyers Part 5: Vừa tô màu VỪA viết 1 từ. Để trống nếu chỉ tô màu (Starters Part 4)
                    </p>
                  </div>
                </div>

                {/* Preview */}
                {inst.objectName && inst.colour && (
                  <div className="mt-3 rounded-lg bg-gray-100 p-3">
                    <p className="text-sm">
                      <span className="font-bold">Hướng dẫn:</span> Tô màu{' '}
                      <span className="font-bold" style={{ color: colours.find(c => c.value === inst.colour)?.color }}>
                        {colours.find(c => c.value === inst.colour)?.label}
                      </span>
                      {' '}cho <span className="font-bold">{inst.objectName}</span>
                      {inst.position && <span> {inst.position}</span>}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions for Students */}
      <div className="rounded-xl border-2 border-blue-300 bg-blue-50 p-4">
        <h4 className="mb-2 font-baloo text-lg font-bold text-blue-700">
          💡 Hướng dẫn cho học viên:
        </h4>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-blue-900">
          <li>Nghe audio hướng dẫn</li>
          <li>Tô màu vào tranh theo đúng hướng dẫn</li>
          <li>Chụp ảnh hoặc scan tranh đã tô</li>
          <li>Upload ảnh lên hệ thống để nộp bài</li>
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 border-t-2 border-gray-200 pt-4">
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 rounded-lg border-2 border-gray-300 px-6 py-3 transition-colors hover:bg-gray-50"
        >
          <X className="h-5 w-5" />
          <span>Hủy</span>
        </button>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-6 py-3 text-white transition-colors hover:bg-indigo-700"
        >
          <Save className="h-5 w-5" />
          <span>Lưu câu hỏi</span>
        </button>
      </div>
    </div>
  );
};

export default ListenColourEditor;
