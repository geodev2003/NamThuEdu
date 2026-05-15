import React, { useState } from 'react';
import { Save, X, Plus, Trash2, Upload } from 'lucide-react';
import { uploadKidsMedia } from '../../../../../../services/kidsExamApi';
import { useToastContext } from '../../../../../../contexts/ToastContext';

interface InformationExchangeEditorProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId: string | null;
  questionId: string | null;
}

interface KnownInfo {
  field: string;
  value: string;
}

const InformationExchangeEditor: React.FC<InformationExchangeEditorProps> = ({
  onSave,
  onCancel,
  initialData,
  examId,
}) => {
  const toast = useToastContext();
  const [title, setTitle] = useState(initialData?.title || 'Information Exchange');
  const [points, setPoints] = useState(initialData?.points || 10);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [knownInfo, setKnownInfo] = useState<KnownInfo[]>([
    { field: '', value: '' },
  ]);
  const [questionsToAsk, setQuestionsToAsk] = useState<string[]>(['']);

  // Load initial data with backward compatibility
  React.useEffect(() => {
    if (!initialData?.config) return;

    const config = initialData.config;
    console.log('📥 Loading InformationExchange data:', config);

    // Load image URL
    setImageUrl(config.imageUrl || config.image_url || '');

    // Load candidate card
    const card = config.candidateCard || config.candidate_card;
    if (card) {
      setCardTitle(card.title || '');
      
      // Load known info
      if (card.knownInfo || card.known_info) {
        const info = card.knownInfo || card.known_info;
        setKnownInfo(
          info.map((item: any) => ({
            field: item.field || '',
            value: item.value || '',
          }))
        );
      }

      // Load questions to ask
      if (card.questionsToAsk || card.questions_to_ask) {
        setQuestionsToAsk(card.questionsToAsk || card.questions_to_ask);
      }
    }
  }, [initialData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !examId) {
      toast.error('Vui lòng chọn file ảnh!');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 20MB 😊');
      return;
    }

    setUploadingImage(true);
    try {
      const response = await uploadKidsMedia(file, 'image', examId, null);
      const uploadedUrl = response.media?.url || response.url;
      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
        toast.success('✅ Tải ảnh thành công!');
      }
    } catch (error: any) {
      console.error('Image upload failed:', error);
      toast.error(`Không thể tải ảnh lên: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePasteImage = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items || !examId) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = item.getAsFile();
        if (!blob) return;

        if (blob.size > 20 * 1024 * 1024) {
          toast.error('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 20MB 😊');
          return;
        }

        const file = new File([blob], `pasted-image-${Date.now()}.png`, { type: blob.type });
        
        setUploadingImage(true);
        try {
          const response = await uploadKidsMedia(file, 'image', examId, null);
          const uploadedUrl = response.media?.url || response.url;
          if (uploadedUrl) {
            setImageUrl(uploadedUrl);
            toast.success('✅ Dán ảnh thành công!');
          }
        } catch (error: any) {
          console.error('Paste upload failed:', error);
          toast.error(`Không thể tải ảnh lên: ${error.response?.data?.message || error.message}`);
        } finally {
          setUploadingImage(false);
        }
        break;
      }
    }
  };

  const handleAddKnownInfo = () => {
    setKnownInfo([...knownInfo, { field: '', value: '' }]);
  };

  const handleRemoveKnownInfo = (index: number) => {
    if (knownInfo.length > 1) {
      setKnownInfo(knownInfo.filter((_, i) => i !== index));
    }
  };

  const handleKnownInfoChange = (index: number, field: 'field' | 'value', value: string) => {
    setKnownInfo(
      knownInfo.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddQuestion = () => {
    setQuestionsToAsk([...questionsToAsk, '']);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questionsToAsk.length > 1) {
      setQuestionsToAsk(questionsToAsk.filter((_, i) => i !== index));
    }
  };

  const handleQuestionChange = (index: number, value: string) => {
    setQuestionsToAsk(
      questionsToAsk.map((q, i) => (i === index ? value : q))
    );
  };

  const handleSave = () => {
    // Validate
    if (!imageUrl) {
      toast.error('Vui lòng upload hình ảnh!');
      return;
    }

    if (!cardTitle.trim()) {
      toast.error('Vui lòng nhập tiêu đề thẻ!');
      return;
    }

    const hasEmptyKnownInfo = knownInfo.some(
      (item) => !item.field.trim() || !item.value.trim()
    );

    if (hasEmptyKnownInfo) {
      toast.error('Vui lòng điền đầy đủ thông tin đã biết (field + value)!');
      return;
    }

    const hasEmptyQuestions = questionsToAsk.some((q) => !q.trim());

    if (hasEmptyQuestions) {
      toast.error('Vui lòng điền đầy đủ các câu hỏi cần hỏi!');
      return;
    }

    const questionData = {
      type: 'information_exchange',
      title,
      points,
      config: {
        image_url: imageUrl,
        candidate_card: {
          title: cardTitle.trim(),
          known_info: knownInfo.map((item) => ({
            field: item.field.trim(),
            value: item.value.trim(),
          })),
          questions_to_ask: questionsToAsk.map((q) => q.trim()),
        },
      },
    };

    console.log('💾 Saving InformationExchange:', questionData);
    onSave(questionData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-4 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-baloo text-2xl font-bold text-purple-600">
              🗣️ Information Exchange (Speaking)
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Hỏi và trả lời để hoàn thành bảng thông tin
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
              placeholder="VD: Hỏi về lâu đài"
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
              max="20"
            />
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
        <h4 className="mb-4 font-baloo text-lg font-bold text-blue-800">
          🖼️ Hình ảnh minh họa *
        </h4>
        <div className="space-y-4">
          {imageUrl ? (
            <div className="relative inline-block">
              <img
                src={imageUrl}
                alt="Information Exchange"
                className="h-64 w-full rounded-lg border-2 border-blue-200 object-cover"
              />
              <button
                onClick={() => setImageUrl('')}
                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div
              onPaste={handlePasteImage}
              className="relative"
            >
              <label className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:bg-gray-50">
                <Upload className="mb-2 h-12 w-12 text-gray-400" />
                <span className="text-lg text-gray-500">
                  {uploadingImage ? 'Đang tải...' : 'Upload hình ảnh'}
                </span>
                <span className="text-sm text-gray-400">hoặc Ctrl+V để dán</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
              <input
                type="text"
                onPaste={handlePasteImage}
                placeholder="Nhấn vào đây và Ctrl+V để dán ảnh"
                className="mt-2 w-full rounded border border-dashed border-blue-300 px-3 py-2 text-sm text-center"
                readOnly
              />
            </div>
          )}
          <p className="text-sm text-blue-700">
            💡 Upload hình ảnh liên quan đến chủ đề (VD: lâu đài, công viên, v.v.)
          </p>
        </div>
      </div>

      {/* Candidate Card Title */}
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6">
        <h4 className="mb-4 font-baloo text-lg font-bold text-green-800">
          🎴 Tiêu đề thẻ ứng viên *
        </h4>
        <input
          type="text"
          value={cardTitle}
          onChange={(e) => setCardTitle(e.target.value)}
          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:outline-none"
          placeholder="VD: George's castle"
        />
        <p className="mt-2 text-sm text-green-700">
          💡 Tên của chủ đề/đối tượng mà học viên sẽ hỏi về
        </p>
      </div>

      {/* Known Info */}
      <div className="rounded-xl border-2 border-yellow-200 bg-white p-6">
        <div className="sticky top-0 z-40 -mx-6 -mt-6 mb-4 flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <h4 className="font-baloo text-lg font-bold text-yellow-600">
            ✅ Thông tin đã biết - {knownInfo.length} mục
          </h4>
          <button
            onClick={handleAddKnownInfo}
            className="flex items-center space-x-2 rounded-lg bg-yellow-500 px-4 py-2 text-white transition-all hover:bg-yellow-600"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm thông tin</span>
          </button>
        </div>

        <div className="space-y-4">
          {knownInfo.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <h5 className="font-bold text-yellow-700">Thông tin #{index + 1}</h5>
                {knownInfo.length > 1 && (
                  <button
                    onClick={() => handleRemoveKnownInfo(index)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Trường * (VD: Where / castle, Name, Who lives)
                  </label>
                  <input
                    type="text"
                    value={item.field}
                    onChange={(e) =>
                      handleKnownInfoChange(index, 'field', e.target.value)
                    }
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none"
                    placeholder="VD: Where / castle"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Giá trị * (VD: mountain, Black Castle, queen)
                  </label>
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) =>
                      handleKnownInfoChange(index, 'value', e.target.value)
                    }
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none"
                    placeholder="VD: mountain"
                  />
                </div>
              </div>

              {/* Preview */}
              {item.field && item.value && (
                <div className="mt-3 rounded-lg bg-white p-3 border-2 border-green-200">
                  <p className="text-xs font-medium text-gray-600 mb-1">Xem trước:</p>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-700">{item.field}:</span>
                    <span className="text-green-700">{item.value}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Questions to Ask */}
      <div className="rounded-xl border-2 border-pink-200 bg-white p-6">
        <div className="sticky top-0 z-40 -mx-6 -mt-6 mb-4 flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <h4 className="font-baloo text-lg font-bold text-pink-600">
            ❓ Câu hỏi cần hỏi - {questionsToAsk.length} câu
          </h4>
          <button
            onClick={handleAddQuestion}
            className="flex items-center space-x-2 rounded-lg bg-pink-500 px-4 py-2 text-white transition-all hover:bg-pink-600"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm câu hỏi</span>
          </button>
        </div>

        <div className="space-y-4">
          {questionsToAsk.map((question, index) => (
            <div
              key={index}
              className="rounded-lg border-2 border-pink-200 bg-pink-50 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <h5 className="font-bold text-pink-700">Câu hỏi #{index + 1}</h5>
                {questionsToAsk.length > 1 && (
                  <button
                    onClick={() => handleRemoveQuestion(index)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <input
                type="text"
                value={question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none"
                placeholder="VD: Where / castle, Name, Who lives, How old, Interesting"
              />

              {/* Preview */}
              {question && (
                <div className="mt-3 rounded-lg bg-white p-3 border-2 border-blue-200">
                  <p className="text-xs font-medium text-gray-600 mb-1">Xem trước:</p>
                  <p className="text-blue-700 font-medium">❓ {question}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-4">
        <h4 className="mb-2 font-baloo text-sm font-bold text-purple-800">
          💡 Hướng dẫn:
        </h4>
        <ul className="space-y-1 text-sm text-purple-700">
          <li>• Upload hình ảnh minh họa cho chủ đề</li>
          <li>• Nhập tiêu đề thẻ ứng viên (VD: George's castle)</li>
          <li>• Thêm các thông tin đã biết (field + value)</li>
          <li>• Thêm các câu hỏi mà học viên cần hỏi</li>
          <li>• Học viên sẽ hỏi và trả lời để hoàn thành bảng thông tin</li>
          <li>• Phù hợp cho Flyers Speaking - Information Exchange</li>
        </ul>
      </div>
    </div>
  );
};

export default InformationExchangeEditor;
