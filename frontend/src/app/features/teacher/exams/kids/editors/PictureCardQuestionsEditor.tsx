import React, { useState } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { uploadKidsMedia } from '../../../../../../services/kidsExamApi';
import { useToastContext } from '../../../../../../contexts/ToastContext';

interface PictureCardQuestionsEditorProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId: string | null;
  questionId?: string | null;
}

interface CardItem {
  id: string;
  imageUrl: string;
  question: string;
  sampleAnswer: string;
}

const PictureCardQuestionsEditor: React.FC<PictureCardQuestionsEditorProps> = ({
  onSave,
  onCancel,
  initialData,
  examId,
}) => {
  const toast = useToastContext();
  const [title, setTitle] = useState(initialData?.title || '');
  const [cards, setCards] = useState<CardItem[]>(initialData?.config?.cards || []);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, cardId: string) => {
    const file = e.target.files?.[0];
    if (!file || !examId) {
      toast.error('Vui lòng chọn file ảnh!');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB 😊');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadKidsMedia(file, 'image', examId, null);
      const uploadedUrl = response.media?.url || response.url;
      if (uploadedUrl) {
        setCards(cards.map(c => 
          c.id === cardId ? { ...c, imageUrl: uploadedUrl } : c
        ));
        toast.success('✅ Tải ảnh thành công!');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error(`Không thể tải ảnh lên: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handlePasteImage = async (e: React.ClipboardEvent, cardId: string) => {
    const items = e.clipboardData?.items;
    if (!items || !examId) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = item.getAsFile();
        if (!blob) {
          toast.error('Vui lòng chọn file ảnh!');
          return;
        }

        // Check file size (max 5MB)
        if (blob.size > 5 * 1024 * 1024) {
          toast.error('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB 😊');
          return;
        }

        const file = new File([blob], `pasted-image-${Date.now()}.png`, { type: blob.type });
        
        setUploading(true);
        try {
          const response = await uploadKidsMedia(file, 'image', examId, null);
          const uploadedUrl = response.media?.url || response.url;
          if (uploadedUrl) {
            setCards(cards.map(c => 
              c.id === cardId ? { ...c, imageUrl: uploadedUrl } : c
            ));
            toast.success('✅ Dán ảnh thành công!');
          }
        } catch (error: any) {
          console.error('Paste upload failed:', error);
          toast.error(`Không thể tải ảnh lên: ${error.response?.data?.message || error.message}`);
        } finally {
          setUploading(false);
        }
        break;
      }
    }
  };

  const addCard = () => {
    const newCard: CardItem = {
      id: `card-${Date.now()}`,
      imageUrl: '',
      question: '',
      sampleAnswer: '',
    };
    setCards([...cards, newCard]);
  };

  const removeCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const updateCard = (id: string, field: keyof CardItem, value: string) => {
    setCards(cards.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề!');
      return;
    }

    if (cards.length === 0) {
      alert('Vui lòng thêm ít nhất 1 thẻ hình!');
      return;
    }

    const invalidCards = cards.filter(c => !c.imageUrl || !c.question || !c.sampleAnswer);
    if (invalidCards.length > 0) {
      alert('Vui lòng điền đầy đủ thông tin cho tất cả thẻ hình!');
      return;
    }

    onSave({
      type: 'picture_card_questions',
      title,
      points: cards.length,
      config: {
        cards: cards.map(c => ({
          image_url: c.imageUrl,
          question: c.question,
          sample_answer: c.sampleAnswer,
        })),
      },
    });
  };

  return (
    <div className="rounded-2xl border-4 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-baloo text-3xl font-bold text-orange-600">
            🃏 Picture Card Questions
          </h3>
          <p className="text-lg text-gray-600">
            Starters Speaking Part 3 - Hỏi về thẻ hình nhỏ
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
          📝 Tiêu đề
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="VD: Trả lời câu hỏi về thẻ hình"
          className="w-full rounded-xl border-2 border-orange-200 px-4 py-3 text-lg focus:border-orange-400 focus:outline-none"
        />
      </div>

      {/* Cards */}
      <div className="mb-6">
        {/* Sticky header with add button */}
        <div className="sticky top-0 z-40 -mx-6 -mt-6 mb-3 flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <label className="font-baloo text-xl font-bold text-gray-700">
            🃏 Thẻ hình ({cards.length})
          </label>
          <button
            onClick={addCard}
            className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
          >
            <Plus className="h-5 w-5" />
            Thêm thẻ hình
          </button>
        </div>

        <div className="space-y-4">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="rounded-xl border-2 border-orange-200 bg-white p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-baloo text-lg font-bold text-orange-600">
                  Thẻ {index + 1}
                </span>
                <button
                  onClick={() => removeCard(card.id)}
                  className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Hình thẻ nhỏ (Upload hoặc Ctrl+V để dán)
                  </label>
                  {card.imageUrl ? (
                    <div className="relative inline-block">
                      <img
                        src={card.imageUrl}
                        alt={`Card ${index + 1}`}
                        className="h-32 w-32 rounded-lg border-2 border-orange-200 object-cover"
                      />
                      <button
                        onClick={() => updateCard(card.id, 'imageUrl', '')}
                        className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onPaste={(e) => handlePasteImage(e, card.id)}
                      className="relative"
                    >
                      <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:bg-gray-50">
                        <Upload className="mb-1 h-8 w-8 text-gray-400" />
                        <span className="text-xs text-gray-500">Upload</span>
                        <span className="text-xs text-gray-400">hoặc Ctrl+V</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, card.id)}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                      <input
                        type="text"
                        onPaste={(e) => handlePasteImage(e, card.id)}
                        placeholder="Nhấn vào đây và Ctrl+V"
                        className="mt-2 w-32 rounded border border-dashed border-orange-300 px-2 py-1 text-xs text-center"
                        readOnly
                      />
                    </div>
                  )}
                </div>

                {/* Question */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Câu hỏi
                  </label>
                  <input
                    type="text"
                    value={card.question}
                    onChange={(e) => updateCard(card.id, 'question', e.target.value)}
                    placeholder="VD: What is this? hoặc Have you got a cat?"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>

                {/* Sample Answer */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Đáp án mẫu
                  </label>
                  <input
                    type="text"
                    value={card.sampleAnswer}
                    onChange={(e) => updateCard(card.id, 'sampleAnswer', e.target.value)}
                    placeholder="VD: It's a cat hoặc Yes, I have / No, I haven't"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
            </div>
          ))}

          {cards.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <p className="text-gray-500">
                Chưa có thẻ hình nào. Nhấn "Thêm thẻ hình" để bắt đầu!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sample Questions */}
      <div className="mb-6 rounded-xl bg-orange-100 p-4">
        <h4 className="mb-2 font-bold text-orange-800">💡 Gợi ý câu hỏi:</h4>
        <ul className="space-y-1 text-sm text-orange-700">
          <li>• "What is this?" → "It's a [cat/dog/bird]"</li>
          <li>• "What colour is it?" → "It's [black/white/brown]"</li>
          <li>• "Have you got a [cat]?" → "Yes, I have" / "No, I haven't"</li>
          <li>• "Do you like [cats]?" → "Yes, I do" / "No, I don't"</li>
          <li>• "Is this your [book]?" → "Yes, it is" / "No, it isn't"</li>
        </ul>
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
          className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 py-3 font-baloo text-xl font-bold text-white hover:from-orange-600 hover:to-yellow-600"
        >
          💾 Lưu câu hỏi
        </button>
      </div>
    </div>
  );
};

export default PictureCardQuestionsEditor;
