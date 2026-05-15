import React, { useState, useEffect } from 'react';
import { Trash2, Save, X, Image as ImageIcon, Plus } from 'lucide-react';
import { uploadKidsMedia } from '../../../../../../services/kidsExamApi';
import { useToastContext } from '../../../../../../contexts/ToastContext';
import { calculateQuestionPoints, getScorableItemsCount, getExampleItemsCount } from '../../../../../../utils/examUtils';

interface LookReadWriteEditorProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId: string | null;
  questionId: string | null;
}

interface Question {
  id: string;
  question: string;
  questionType: 'complete' | 'answer' | 'free_write'; // NEW: Type of question
  hintPrefix: string;
  correctAnswer: string;
  isExample: boolean;
  imageUrl?: string; // Optional: Hình ảnh riêng cho câu hỏi này
}

interface UploadedImage {
  id: string;
  url: string;
  name: string;
}

const LookReadWriteEditor: React.FC<LookReadWriteEditorProps> = ({
  onSave,
  onCancel,
  initialData,
  examId,
  questionId,
}) => {
  console.log('🎯 LookReadWriteEditor loaded with initialData:', initialData);
  console.log('🎯 examId:', examId, 'questionId:', questionId);

  const toast = useToastContext();
  const [title, setTitle] = useState('');
  const [sharedImageUrl, setSharedImageUrl] = useState('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]); // List of uploaded images
  const [questions, setQuestions] = useState<Question[]>([]);
  const [uploadingSharedImage, setUploadingSharedImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [focusedSharedImage, setFocusedSharedImage] = useState(false);
  const [focusedImageUpload, setFocusedImageUpload] = useState(false);

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setSharedImageUrl(initialData.config?.shared_image_url || '');
      
      // Extract uploaded images from questions
      const images: UploadedImage[] = [];
      const questionsData = initialData.config?.questions || [];
      
      // Map backend format to frontend format
      const mappedQuestions: Question[] = questionsData.map((q: any, index: number) => {
        // Add image to uploaded images list if it exists
        if (q.image_url) {
          const existingImage = images.find(img => img.url === q.image_url);
          if (!existingImage) {
            images.push({
              id: `img-${images.length}`,
              url: q.image_url,
              name: `Ảnh ${images.length + 1}`
            });
          }
        }
        
        return {
          id: q.id || `q-${index}`,
          question: q.question || '',
          questionType: q.questionType || q.question_type || 'complete', // NEW: Map question type
          hintPrefix: q.hint_prefix || '',
          correctAnswer: q.correct_answer || '',
          isExample: q.is_example || false,
          imageUrl: q.image_url || ''
        };
      });
      
      setUploadedImages(images);
      setQuestions(mappedQuestions);
      
      console.log('✅ Loaded initial data:', {
        title: initialData.title,
        questionsCount: mappedQuestions.length,
        imagesCount: images.length
      });
    }
  }, [initialData]);

  // Handle paste for shared image and additional images
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items || !examId) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const blob = items[i].getAsFile();
          if (blob) {
            if (focusedSharedImage) {
              await uploadSharedImageFromBlob(blob);
            } else if (focusedImageUpload) {
              await uploadAdditionalImageFromBlob(blob);
            }
          }
          break;
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [examId, focusedSharedImage, focusedImageUpload]);

  const uploadSharedImageFromBlob = async (blob: Blob) => {
    if (!examId) {
      toast.error('Vui lòng tạo đề thi trước!');
      return;
    }

    if (blob.size > 20 * 1024 * 1024) {
      toast.error('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 20MB 😊');
      return;
    }

    const file = new File([blob], `pasted-shared-${Date.now()}.png`, { type: blob.type });

    setUploadingSharedImage(true);
    try {
      const response = await uploadKidsMedia(file, 'image', examId);
      const imageUrl = response.media?.url || response.url;
      if (imageUrl) {
        setSharedImageUrl(imageUrl);
        toast.success('✅ Paste ảnh thành công! 💾');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`❌ Không thể tải ảnh lên: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploadingSharedImage(false);
    }
  };

  const uploadAdditionalImageFromBlob = async (blob: Blob) => {
    if (!examId) {
      toast.error('Vui lòng tạo đề thi trước!');
      return;
    }

    if (blob.size > 20 * 1024 * 1024) {
      toast.error('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 20MB 😊');
      return;
    }

    const file = new File([blob], `pasted-additional-${Date.now()}.png`, { type: blob.type });

    setUploadingImage(true);
    try {
      const response = await uploadKidsMedia(file, 'image', examId);
      const imageUrl = response.media?.url || response.url;
      if (imageUrl) {
        const newImage: UploadedImage = {
          id: Date.now().toString(),
          url: imageUrl,
          name: `Ảnh ${uploadedImages.length + 1}`
        };
        setUploadedImages([...uploadedImages, newImage]);
        toast.success('✅ Paste ảnh thành công! 💾');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`❌ Không thể tải ảnh lên: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSharedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !examId) {
      toast.error('Vui lòng chọn file ảnh!');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 20MB 😊');
      return;
    }

    setUploadingSharedImage(true);
    try {
      const response = await uploadKidsMedia(file, 'image', examId);
      const imageUrl = response.media?.url || response.url;
      if (imageUrl) {
        setSharedImageUrl(imageUrl);
        toast.success('✅ Tải ảnh thành công! 💾');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`❌ Không thể tải ảnh lên: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploadingSharedImage(false);
    }
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await uploadKidsMedia(file, 'image', examId);
      const imageUrl = response.media?.url || response.url;
      if (imageUrl) {
        const newImage: UploadedImage = {
          id: Date.now().toString(),
          url: imageUrl,
          name: `Ảnh ${uploadedImages.length + 1}`
        };
        setUploadedImages([...uploadedImages, newImage]);
        toast.success('✅ Tải ảnh thành công! 💾');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`❌ Không thể tải ảnh lên: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteUploadedImage = (imageId: string) => {
    // Remove image from list
    setUploadedImages(uploadedImages.filter(img => img.id !== imageId));
    
    // Remove image from questions that use it
    const imageToDelete = uploadedImages.find(img => img.id === imageId);
    if (imageToDelete) {
      setQuestions(questions.map(q => 
        q.imageUrl === imageToDelete.url ? { ...q, imageUrl: '' } : q
      ));
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      questionType: 'complete', // Default type
      hintPrefix: '',
      correctAnswer: '',
      isExample: false,
      imageUrl: '', // Optional image for this question
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  // Helper function: Get effective image for a question (inheritance logic)
  const getEffectiveImage = (questionIndex: number): string => {
    // Check if this question has its own image
    if (questions[questionIndex].imageUrl) {
      return questions[questionIndex].imageUrl;
    }
    
    // Search upward for the nearest question with an image
    for (let i = questionIndex - 1; i >= 0; i--) {
      if (questions[i].imageUrl) {
        return questions[i].imageUrl;
      }
    }
    
    // Fall back to shared image
    return sharedImageUrl;
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.warning('⚠️ Vui lòng nhập tiêu đề!');
      return;
    }

    if (questions.length === 0) {
      toast.warning('⚠️ Vui lòng thêm ít nhất 1 câu hỏi!');
      return;
    }

    // Validate: Every question must have access to an image (own, inherited, or shared)
    const questionsWithoutImage = questions.filter((_, index) => !getEffectiveImage(index));
    if (questionsWithoutImage.length > 0) {
      toast.warning('⚠️ Vui lòng tải ảnh chung HOẶC tải ảnh cho câu hỏi đầu tiên!');
      return;
    }

    const hasEmptyQuestions = questions.some(q => !q.question.trim() || !q.correctAnswer.trim());
    if (hasEmptyQuestions) {
      toast.warning('⚠️ Vui lòng nhập đầy đủ câu hỏi và đáp án!');
      return;
    }

    // Calculate points based on non-example items only
    const config = {
      shared_image_url: sharedImageUrl,
      questions: questions.map(q => ({
        question: q.question,
        question_type: q.questionType, // NEW: Add question type
        hint_prefix: q.hintPrefix,
        correct_answer: q.correctAnswer,
        is_example: q.isExample,
        image_url: q.imageUrl || '', // Include question-specific image
      })),
    };
    
    const calculatedPoints = calculateQuestionPoints(config, 1); // 1 point per question

    const questionData = {
      type: 'look_read_write',
      title,
      points: calculatedPoints,
      config,
    };

    console.log('💾 Saving question with calculated points:', {
      totalQuestions: questions.length,
      scorableQuestions: getScorableItemsCount(questions),
      exampleQuestions: getExampleItemsCount(questions),
      calculatedPoints,
    });

    toast.success('✅ Đã lưu câu hỏi thành công!');
    onSave(questionData);
  };

  return (
    <div className="space-y-6 rounded-2xl border-4 border-purple-200 bg-white p-6 shadow-xl">
      {/* Header */}
      <div className="border-b-4 border-purple-100 pb-4">
        <h3 className="font-baloo text-3xl font-bold text-purple-600">
          ✍️ Nhìn, Đọc và Viết
        </h3>
        <p className="mt-1 text-gray-600">
          Học viên nhìn tranh lớn, đọc câu hỏi và viết câu trả lời <span className="font-bold text-purple-600">MỘT TỪ</span>
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
          placeholder="VD: Nhìn tranh và đọc câu hỏi. Viết câu trả lời một từ."
          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-purple-500 focus:outline-none"
        />
        <p className="mt-1 text-sm text-gray-500">
          Hướng dẫn chung cho học viên về cách làm bài
        </p>
      </div>

      {/* Shared Image Upload - OPTIONAL */}
      <div className="rounded-xl border-4 border-blue-300 bg-blue-50 p-4">
        <div className="mb-3 flex items-center space-x-2">
          <span className="text-2xl">🖼️</span>
          <h4 className="font-baloo text-xl font-bold text-blue-700">
            Hình ảnh chung cho tất cả câu hỏi (Tùy chọn)
          </h4>
        </div>
        <p className="mb-3 text-sm text-blue-900">
          💡 Upload 1 hình lớn chung, tất cả câu hỏi đều dựa vào hình này.
        </p>

        {!sharedImageUrl ? (
          <div
            tabIndex={0}
            onClick={() => {
              if (!focusedSharedImage) {
                setFocusedSharedImage(true);
              } else {
                const input = document.getElementById('shared-image-input') as HTMLInputElement;
                if (input) input.click();
              }
            }}
            onFocus={() => setFocusedSharedImage(true)}
            onBlur={() => setFocusedSharedImage(false)}
            className={`cursor-pointer rounded-lg border-2 border-dashed transition-colors ${
              focusedSharedImage
                ? 'border-blue-500 bg-blue-100'
                : 'border-blue-300 bg-white'
            }`}
          >
            <div className="flex flex-col items-center justify-center p-6">
              <ImageIcon className="mb-2 h-16 w-16 text-blue-400" />
              <span className="mb-1 text-lg font-bold text-blue-700">
                {uploadingSharedImage ? '⏳ Đang tải lên...' : 'Nhấn để tải ảnh hoặc Ctrl+V'}
              </span>
              <span className="text-sm text-blue-600">PNG, JPG (tối đa 20MB)</span>
              {focusedSharedImage && (
                <p className="mt-2 text-sm font-bold text-blue-700 animate-pulse">
                  💡 Bạn có thể Ctrl+V để dán ảnh từ clipboard
                </p>
              )}
            </div>
            <input
              id="shared-image-input"
              type="file"
              accept="image/*"
              onChange={handleSharedImageUpload}
              className="hidden"
              disabled={uploadingSharedImage}
            />
          </div>
        ) : (
          <div className="relative rounded-lg border-2 border-blue-500 bg-white p-4">
            <div className="flex items-center justify-center">
              <img
                src={sharedImageUrl}
                alt="Shared image"
                className="max-h-96 w-auto rounded-lg shadow-lg"
              />
            </div>
            <button
              type="button"
              onClick={() => setSharedImageUrl('')}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white shadow-lg transition-colors hover:bg-red-600"
              title="Xóa ảnh"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="mt-2 text-center text-sm font-bold text-green-600">
              ✅ Tất cả câu hỏi sẽ dùng chung hình này!
            </p>
          </div>
        )}
      </div>

      {/* Additional Images Upload Section - NEW */}
      <div className="rounded-xl border-4 border-purple-300 bg-purple-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎨</span>
            <h4 className="font-baloo text-xl font-bold text-purple-700">
              Thư viện ảnh bổ sung (Tùy chọn)
            </h4>
          </div>
          <span className="rounded-full bg-purple-200 px-3 py-1 text-sm font-bold text-purple-700">
            {uploadedImages.length} ảnh
          </span>
        </div>
        <p className="mb-3 text-sm text-purple-900">
          💡 Upload nhiều ảnh trước, sau đó chọn ảnh nào cho câu hỏi nào ở dưới.
        </p>

        {/* Upload Area */}
        <div
          tabIndex={0}
          onClick={() => {
            if (!focusedImageUpload) {
              setFocusedImageUpload(true);
            } else {
              const input = document.getElementById('additional-image-input') as HTMLInputElement;
              if (input) input.click();
            }
          }}
          onFocus={() => setFocusedImageUpload(true)}
          onBlur={() => setFocusedImageUpload(false)}
          className={`mb-4 cursor-pointer rounded-lg border-2 border-dashed transition-colors ${
            focusedImageUpload
              ? 'border-purple-500 bg-purple-100'
              : 'border-purple-300 bg-white'
          }`}
        >
          <div className="flex flex-col items-center justify-center p-4">
            <Plus className="mb-2 h-12 w-12 text-purple-400" />
            <span className="mb-1 text-base font-bold text-purple-700">
              {uploadingImage ? '⏳ Đang tải lên...' : 'Nhấn để tải ảnh hoặc Ctrl+V'}
            </span>
            <span className="text-sm text-purple-600">PNG, JPG (tối đa 20MB)</span>
            {focusedImageUpload && (
              <p className="mt-2 text-sm font-bold text-purple-700 animate-pulse">
                💡 Bạn có thể Ctrl+V để dán ảnh từ clipboard
              </p>
            )}
          </div>
          <input
            id="additional-image-input"
            type="file"
            accept="image/*"
            onChange={handleAdditionalImageUpload}
            className="hidden"
            disabled={uploadingImage}
          />
        </div>

        {/* Uploaded Images Grid */}
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {uploadedImages.map((img) => (
              <div
                key={img.id}
                className="relative rounded-lg border-2 border-purple-400 bg-white p-2 transition-all hover:shadow-lg"
              >
                <div className="flex items-center justify-center">
                  <img
                    src={img.url}
                    alt={img.name}
                    className="max-h-24 w-auto rounded"
                  />
                </div>
                <p className="mt-1 text-center text-xs font-bold text-purple-700 truncate">
                  {img.name}
                </p>
                <button
                  type="button"
                  onClick={() => deleteUploadedImage(img.id)}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg transition-colors hover:bg-red-600"
                  title="Xóa ảnh"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {uploadedImages.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-purple-300 bg-white p-4 text-center">
            <p className="text-sm text-purple-600">
              Chưa có ảnh nào. Upload ảnh để sử dụng cho các câu hỏi! 📸
            </p>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div>
        {/* Sticky header with add button */}
        <div className="sticky top-0 z-40 -mx-6 -mt-6 mb-4 flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <div>
            <h4 className="font-baloo text-2xl font-bold text-gray-800">
              📋 Danh Sách Câu Hỏi
            </h4>
            <p className="text-sm text-gray-600">
              {getScorableItemsCount(questions)} câu chấm điểm • {getExampleItemsCount(questions)} câu ví dụ
            </p>
          </div>
          <button
            onClick={addQuestion}
            className="flex items-center space-x-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
          >
            <Plus className="h-5 w-5" />
            <span>Thêm câu hỏi</span>
          </button>
        </div>

        {questions.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <div className="mb-3 text-5xl">❓</div>
            <p className="text-gray-600">Chưa có câu hỏi nào. Nhấn "Thêm câu hỏi" để bắt đầu!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className={`rounded-xl border-4 p-4 transition-all ${
                  q.isExample
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
                      {index + 1}
                    </span>
                    {q.isExample && (
                      <span className="rounded-full bg-amber-500 px-3 py-1 text-sm font-bold text-white">
                        📌 Câu ví dụ
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="flex cursor-pointer items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={q.isExample}
                        onChange={(e) => updateQuestion(q.id, 'isExample', e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300"
                      />
                      <span className="text-sm font-medium">Đánh dấu là ví dụ</span>
                    </label>
                    <button
                      onClick={() => deleteQuestion(q.id)}
                      className="rounded-lg bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Question Type Selector */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      📋 Loại câu hỏi:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuestion(q.id, 'questionType', 'complete')}
                        className={`rounded-lg border-2 p-3 text-left text-sm transition-all ${
                          q.questionType === 'complete'
                            ? 'border-purple-500 bg-purple-100 font-bold'
                            : 'border-gray-300 bg-white hover:border-purple-300'
                        }`}
                      >
                        <div className="font-bold">✏️ Complete</div>
                        <div className="text-xs text-gray-600">Điền từ vào chỗ trống</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateQuestion(q.id, 'questionType', 'answer')}
                        className={`rounded-lg border-2 p-3 text-left text-sm transition-all ${
                          q.questionType === 'answer'
                            ? 'border-purple-500 bg-purple-100 font-bold'
                            : 'border-gray-300 bg-white hover:border-purple-300'
                        }`}
                      >
                        <div className="font-bold">💬 Answer</div>
                        <div className="text-xs text-gray-600">Trả lời câu hỏi ngắn</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateQuestion(q.id, 'questionType', 'free_write')}
                        className={`rounded-lg border-2 p-3 text-left text-sm transition-all ${
                          q.questionType === 'free_write'
                            ? 'border-purple-500 bg-purple-100 font-bold'
                            : 'border-gray-300 bg-white hover:border-purple-300'
                        }`}
                      >
                        <div className="font-bold">📝 Free Write</div>
                        <div className="text-xs text-gray-600">Viết tự do 1-2 câu</div>
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="mb-1 block text-sm font-bold text-gray-700">
                      ❓ Câu hỏi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                      placeholder="VD: Where's the woman's hat?"
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  {/* Hint Prefix (Only for 'complete' type) */}
                  {q.questionType === 'complete' && (
                  <div>
                    <label className="mb-1 block text-sm font-bold text-gray-700">
                      💡 Từ gợi ý đầu câu (Tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={q.hintPrefix}
                      onChange={(e) => updateQuestion(q.id, 'hintPrefix', e.target.value)}
                      placeholder="VD: on the... / in a..."
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Từ gợi ý giúp học viên biết cấu trúc câu trả lời (VD: "on the <u>table</u>")
                    </p>
                  </div>
                  )}

                  {/* Correct Answer (Not for 'free_write' type) */}
                  {q.questionType !== 'free_write' && (
                  <div>
                    <label className="mb-1 block text-sm font-bold text-gray-700">
                      ✅ Đáp án đúng {q.questionType === 'complete' ? '(MỘT TỪ)' : ''} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={q.correctAnswer}
                      onChange={(e) => updateQuestion(q.id, 'correctAnswer', e.target.value)}
                      placeholder={q.questionType === 'complete' ? 'VD: table' : 'VD: on the table'}
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {q.questionType === 'complete' 
                        ? 'Chỉ nhập MỘT TỪ duy nhất (không có dấu cách)'
                        : 'Nhập đáp án ngắn (1 từ hoặc cụm từ ngắn)'
                      }
                    </p>
                  </div>
                  )}

                  {/* Free Write Note */}
                  {q.questionType === 'free_write' && (
                  <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-3">
                    <p className="text-sm text-blue-700">
                      <strong>📝 Viết tự do:</strong> Học viên sẽ viết 1-2 câu về hình ảnh. 
                      Không có đáp án cố định, giáo viên sẽ chấm thủ công.
                    </p>
                  </div>
                  )}

                  {/* Question-Specific Image Selection (Optional) */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      🖼️ Chọn ảnh cho câu này (Tùy chọn)
                    </label>
                    <p className="mb-2 text-xs text-gray-500">
                      💡 Chọn ảnh từ thư viện ở trên. Nếu không chọn, câu này sẽ dùng ảnh chung hoặc ảnh của câu gần nhất phía trên.
                    </p>
                    
                    <select
                      value={q.imageUrl || ''}
                      onChange={(e) => updateQuestion(q.id, 'imageUrl', e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none"
                    >
                      <option value="">-- Không chọn (dùng ảnh chung/kế thừa) --</option>
                      {uploadedImages.map((img) => (
                        <option key={img.id} value={img.url}>
                          {img.name}
                        </option>
                      ))}
                    </select>
                    
                    {/* Show preview of selected or inherited image */}
                    {getEffectiveImage(index) && (
                      <div className="mt-2 rounded-lg border-2 border-blue-300 bg-blue-50 p-2">
                        <p className="text-xs font-bold text-blue-700 mb-1">
                          📌 Câu này đang dùng ảnh:
                        </p>
                        <div className="flex items-center justify-center">
                          <img
                            src={getEffectiveImage(index)}
                            alt="Effective"
                            className="max-h-24 w-auto rounded border-2 border-blue-400"
                          />
                        </div>
                        <p className="mt-1 text-center text-xs text-blue-600">
                          {q.imageUrl
                            ? '✅ Ảnh được chọn'
                            : sharedImageUrl && getEffectiveImage(index) === sharedImageUrl
                            ? '🔗 Ảnh chung'
                            : '🔗 Ảnh kế thừa từ câu trên'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Preview */}
                  {q.question && q.correctAnswer && (
                    <div className="rounded-lg bg-purple-50 border-2 border-purple-200 p-3">
                      <p className="text-sm">
                        <span className="font-bold text-purple-700">Preview:</span>
                      </p>
                      {getEffectiveImage(index) && (
                        <div className="mt-2 flex justify-center">
                          <img
                            src={getEffectiveImage(index)}
                            alt="Preview"
                            className="max-h-32 w-auto rounded-lg border-2 border-purple-300"
                          />
                        </div>
                      )}
                      <p className="mt-2">
                        <span className="font-medium">{q.question}</span>
                      </p>
                      {q.hintPrefix && (
                        <p className="mt-1 text-gray-600">
                          {q.hintPrefix} <span className="underline decoration-dotted">{q.correctAnswer}</span>
                        </p>
                      )}
                      {!q.hintPrefix && (
                        <p className="mt-1 text-gray-600">
                          → <span className="font-bold text-green-600">{q.correctAnswer}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
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
          <li>Nhìn kỹ bức tranh (chung hoặc riêng từng câu)</li>
          <li>Đọc từng câu hỏi</li>
          <li>Viết câu trả lời <span className="font-bold">MỘT TỪ</span> duy nhất</li>
          <li>Nếu có từ gợi ý, viết từ tiếp theo (VD: "on the <u>table</u>")</li>
        </ol>
        
        <div className="mt-3 rounded-lg border-2 border-green-300 bg-green-50 p-3">
          <p className="text-sm font-bold text-green-800">
            ✨ Cách hoạt động của ảnh:
          </p>
          <ul className="mt-2 space-y-1 text-xs text-green-900">
            <li>🎨 <span className="font-bold">Ảnh chung:</span> Tất cả câu hỏi dùng chung 1 ảnh</li>
            <li>🎨 <span className="font-bold">Ảnh riêng:</span> Upload ảnh mới → Câu đó + các câu dưới sẽ dùng ảnh mới</li>
            <li>🎨 <span className="font-bold">Kế thừa:</span> Câu không có ảnh riêng sẽ dùng ảnh gần nhất phía trên</li>
          </ul>
          <div className="mt-2 rounded border-2 border-green-400 bg-white p-2">
            <p className="text-xs font-bold text-green-800 mb-1">📖 Ví dụ:</p>
            <div className="space-y-1 text-xs text-green-900">
              <div>• Câu 1: Upload ảnh A → Dùng ảnh A</div>
              <div>• Câu 2: Không upload → Dùng ảnh A (kế thừa)</div>
              <div>• Câu 3: Upload ảnh B → Dùng ảnh B</div>
              <div>• Câu 4: Không upload → Dùng ảnh B (kế thừa)</div>
            </div>
          </div>
        </div>
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
          className="flex items-center space-x-2 rounded-lg bg-purple-600 px-6 py-3 text-white transition-colors hover:bg-purple-700"
        >
          <Save className="h-5 w-5" />
          <span>Lưu câu hỏi</span>
        </button>
      </div>
    </div>
  );
};

export default LookReadWriteEditor;
