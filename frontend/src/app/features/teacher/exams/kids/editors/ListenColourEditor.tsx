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
    <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
        <span className="text-2xl">🎨</span>
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Nghe và tô màu
          </h3>
          <p className="text-sm text-slate-500">
            Học viên nghe audio, tô màu theo hướng dẫn, và upload ảnh đã tô
          </p>
        </div>
      </div>

      {/* Question Title */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Tiêu đề câu hỏi / Hướng dẫn
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="VD: Nghe và tô màu các đồ vật trong tranh"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
        />
        <p className="mt-1 text-xs text-slate-500">
          Hướng dẫn chung cho học viên về cách làm bài
        </p>
      </div>

      {/* Main Audio Upload */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          🎧 Audio hướng dẫn chính
        </label>
        
        {!mainAudioUrl ? (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 transition-colors hover:border-orange-400 hover:bg-orange-50/40">
            <Volume2 className="mb-2 h-10 w-10 text-slate-400" />
            <span className="mb-1 text-sm font-medium text-slate-700">
              {uploadingAudio ? 'Đang tải lên...' : 'Nhấn để tải audio lên'}
            </span>
            <span className="text-xs text-slate-500">MP3, WAV, M4A (tối đa 20MB)</span>
            <input
              type="file"
              accept="audio/*"
              onChange={handleMainAudioUpload}
              className="hidden"
              disabled={uploadingAudio}
            />
          </label>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
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
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          🖼️ Tranh cần tô màu (Ctrl+V để paste)
        </label>
        
        {!mainImageUrl ? (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 transition-colors hover:border-orange-400 hover:bg-orange-50/40">
            <ImageIcon className="mb-2 h-10 w-10 text-slate-400" />
            <span className="mb-1 text-sm font-medium text-slate-700">
              {uploadingImage ? 'Đang tải lên...' : 'Nhấn để tải ảnh hoặc Ctrl+V'}
            </span>
            <span className="text-xs text-slate-500">PNG, JPG, WEBP (tối đa 20MB)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageUpload}
              className="hidden"
              disabled={uploadingImage}
            />
          </label>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
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
        <div className="sticky top-0 z-40 -mx-6 mb-4 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h4 className="text-sm font-semibold text-slate-900">
            🎨 Danh sách hướng dẫn tô màu
          </h4>
          <button
            onClick={addInstruction}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          >
            <Upload className="h-4 w-4" />
            <span>Thêm hướng dẫn</span>
          </button>
        </div>

        {instructions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="mb-3 text-4xl">🎨</div>
            <p className="text-sm text-slate-500">Chưa có hướng dẫn nào. Nhấn "Thêm hướng dẫn" để bắt đầu!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {instructions.map((inst, index) => (
              <div
                key={inst.id}
                className={`rounded-xl border p-4 transition-all ${
                  inst.isExample
                    ? 'border-amber-300 bg-amber-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    {inst.isExample && (
                      <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
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
                        className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                      />
                      <span className="text-sm font-medium text-slate-700">Đánh dấu là ví dụ</span>
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
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Đồ vật cần tô
                    </label>
                    <input
                      type="text"
                      value={inst.objectName}
                      onChange={(e) => updateInstruction(inst.id, 'objectName', e.target.value)}
                      placeholder="VD: quả táo"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                    />
                  </div>

                  {/* Colour */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Màu sắc
                    </label>
                    <select
                      value={inst.colour}
                      onChange={(e) => updateInstruction(inst.id, 'colour', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
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
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Vị trí
                    </label>
                    <input
                      type="text"
                      value={inst.position}
                      onChange={(e) => updateInstruction(inst.id, 'position', e.target.value)}
                      placeholder="VD: trên bàn"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                    />
                  </div>

                  {/* Write Text (Optional - Movers/Flyers Part 5) */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      ✍️ Từ cần viết (Tùy chọn - Movers/Flyers Part 5)
                    </label>
                    <input
                      type="text"
                      value={inst.writeText || ''}
                      onChange={(e) => updateInstruction(inst.id, 'writeText', e.target.value)}
                      placeholder="VD: fast (nếu yêu cầu viết thêm 1 từ)"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Movers/Flyers Part 5: Vừa tô màu VỪA viết 1 từ. Để trống nếu chỉ tô màu (Starters Part 4)
                    </p>
                  </div>
                </div>

                {/* Preview */}
                {inst.objectName && inst.colour && (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">Hướng dẫn:</span> Tô màu{' '}
                      <span className="font-semibold" style={{ color: colours.find(c => c.value === inst.colour)?.color }}>
                        {colours.find(c => c.value === inst.colour)?.label}
                      </span>
                      {' '}cho <span className="font-semibold">{inst.objectName}</span>
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
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="mb-2 text-sm font-semibold text-slate-900">
          💡 Hướng dẫn cho học viên
        </h4>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-600">
          <li>Nghe audio hướng dẫn</li>
          <li>Tô màu vào tranh theo đúng hướng dẫn</li>
          <li>Chụp ảnh hoặc scan tranh đã tô</li>
          <li>Upload ảnh lên hệ thống để nộp bài</li>
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <X className="h-4 w-4" />
          <span>Hủy</span>
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
        >
          <Save className="h-4 w-4" />
          <span>Lưu câu hỏi</span>
        </button>
      </div>
    </div>
  );
};

export default ListenColourEditor;
