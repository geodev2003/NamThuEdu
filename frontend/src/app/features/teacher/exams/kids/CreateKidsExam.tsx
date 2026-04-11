import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import StepIndicator from './components/StepIndicator';
import Step1ExamType from './steps/Step1ExamType';
import Step2AddQuestions from './steps/Step2AddQuestions';
import Step3Preview from './steps/Step3Preview';
import { createKidsExam, updateKidsExam, getKidsExam } from '../../../../../services/kidsExamApi';
import { ToastProvider } from '../../../../../contexts/ToastContext';
import { getFullMediaUrl } from '../../../../../utils/mediaUtils';

interface ExamData {
  examType: string;
  title: string;
  description: string;
  duration: number;
  questions: any[];
  mode?: 'flexible' | 'cambridge';
}

const CreateKidsExam: React.FC = () => {
  const navigate = useNavigate();
  const { examId } = useParams<{ examId: string }>();
  const [currentExamId, setCurrentExamId] = useState<string | null>(examId || null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [examData, setExamData] = useState<ExamData>({
    examType: '',
    title: '',
    description: '',
    duration: 60,
    questions: [],
    mode: 'flexible', // Default to flexible mode
  });

  // Load existing exam if examId exists
  useEffect(() => {
    if (examId) {
      loadExam(examId);
      // If exam exists, start at step 2 (adding questions)
      setCurrentStep(2);
    }
  }, [examId]);

  const loadExam = async (id: string) => {
    try {
      const exam = await getKidsExam(parseInt(id));
      if (exam) {
        const examTypeCode = exam.kids_exam_config?.exam_type || '';
        const examType = examTypeCode === 'yle_starters' ? 'starters'
          : examTypeCode === 'yle_movers' ? 'movers'
          : 'flyers';

        // Transform questions from database format to UI format
        const transformedQuestions = (exam.questions || []).map((q: any) => {
          // Extract media URLs from q.media array
          const audioMedia = q.media?.find((m: any) => m.media_type === 'audio');
          const imageMedia = q.media?.find((m: any) => m.media_type === 'image');
          
          // Get base config
          const baseConfig = q.kids_task_config?.task_data || {};
          
          // Convert relative URLs to full URLs
          const audioUrl = audioMedia ? getFullMediaUrl(audioMedia.file_url) : null;
          const imageUrl = imageMedia ? getFullMediaUrl(imageMedia.file_url) : null;
          
          // Add media URLs to config if they exist
          const configWithMedia = {
            ...baseConfig,
            ...(audioUrl && { audioUrl }),
            ...(imageUrl && { imageUrl }),
          };

          return {
            qId: q.qId,
            id: `q-${q.qId}`,
            type: q.kids_task_config?.task_type || q.qType,
            title: q.kids_task_config?.task_name || q.qContent || 'Untitled',
            points: q.qPoints || 5,
            config: configWithMedia,
            part: q.qPart || 1, // Load part from qPart field
            subPart: q.qSubPart || null, // Load subPart from qSubPart field (Cambridge mode)
          };
        });

        setExamData({
          examType: examType,
          title: exam.eTitle || '',
          description: exam.eDescription || '',
          duration: exam.eDuration || 60,
          questions: transformedQuestions,
          mode: exam.kids_exam_config?.mode || 'flexible', // Load mode from database
        });
        setCurrentExamId(id);
        
        console.log('📦 Loaded exam:', {
          examType,
          mode: exam.kids_exam_config?.mode || 'flexible',
          questionsCount: transformedQuestions.length,
          questions: transformedQuestions.map(q => ({
            type: q.type,
            part: q.part,
            subPart: q.subPart,
            hasAudio: !!q.config.audioUrl,
            hasImage: !!q.config.imageUrl,
          }))
        });
      }
    } catch (error) {
      console.error('Failed to load exam:', error);
    }
  };

  const createDraftExam = async () => {
    if (currentExamId) return currentExamId; // Already has ID

    setIsSaving(true);
    try {
      const examTypeCode = examData.examType === 'starters' ? 'yle_starters' 
        : examData.examType === 'movers' ? 'yle_movers' 
        : 'yle_flyers';

      const response = await createKidsExam({
        eTitle: examData.title || `Đề thi ${examData.examType} - ${new Date().toLocaleString('vi-VN')}`,
        eDescription: examData.description || 'Đang tạo...',
        eDuration: examData.duration,
        exam_type_code: examTypeCode,
        mode: examData.mode || 'flexible', // Send mode to server
      });

      if (response.exam?.eId) {
        const newExamId = response.exam.eId.toString();
        setCurrentExamId(newExamId);
        // Update URL with exam ID
        navigate(`/giao-vien/de-thi/kids/tao-moi/${newExamId}`, { replace: true });
        return newExamId;
      }
    } catch (error) {
      console.error('Failed to create draft exam:', error);
      alert('Không thể tạo đề thi. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
    return null;
  };

  const autoSaveExam = async () => {
    if (!currentExamId) return;

    try {
      await updateKidsExam(parseInt(currentExamId), {
        eTitle: examData.title,
        eDescription: examData.description,
        eDuration: examData.duration,
        mode: examData.mode, // Save mode when auto-saving
      });
      console.log('✅ Auto-saved');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  // Auto-save when questions change
  useEffect(() => {
    if (currentExamId && examData.questions.length > 0) {
      const timer = setTimeout(() => {
        autoSaveExam();
      }, 1000); // Debounce 1 second

      return () => clearTimeout(timer);
    }
  }, [examData.questions, currentExamId]);

  const handleNext = async () => {
    if (currentStep === 1 && !currentExamId) {
      // Create draft exam when moving from Step 1 to Step 2
      const newExamId = await createDraftExam();
      if (!newExamId) return; // Failed to create
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!currentExamId) {
      await createDraftExam();
      return;
    }

    setIsSaving(true);
    try {
      await updateKidsExam(parseInt(currentExamId), {
        eTitle: examData.title,
        eDescription: examData.description,
        eDuration: examData.duration,
        mode: examData.mode, // Save mode when publishing
      });

      if (status === 'published') {
        alert('Đã xuất bản đề thi thành công! 🎉');
        navigate('/giao-vien/de-thi');
      } else {
        alert('Đã lưu nháp thành công! ✅');
      }
    } catch (error) {
      console.error('Failed to save exam:', error);
      alert('Không thể lưu đề thi. Vui lòng thử lại. 😊');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ToastProvider>
      <div className="flex h-screen flex-col bg-gradient-to-br from-indigo-50 via-white to-orange-50">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/giao-vien/de-thi')}
                className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-indigo-600"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Quay lại</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="font-baloo text-2xl font-bold text-indigo-600">
                Tạo Đề Thi Kids
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleSave('draft')}
                className="flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
              >
                <Save className="h-4 w-4" />
                <span>Lưu nháp</span>
              </button>
              {currentStep === 3 && (
                <button
                  onClick={() => handleSave('published')}
                  className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
                >
                  <span>Xuất bản</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto flex h-full w-full flex-col px-2 py-6 sm:px-4 lg:px-6">
        {/* Step Indicator */}
        <div className="mb-6 flex-shrink-0">
          <StepIndicator currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto rounded-2xl bg-white p-8 shadow-lg">
          {currentStep === 1 && (
            <Step1ExamType
              examData={examData}
              setExamData={setExamData}
              onNext={handleNext}
            />
          )}
          {currentStep === 2 && (
            <Step2AddQuestions
              examData={examData}
              setExamData={setExamData}
              onNext={handleNext}
              onBack={handleBack}
              examId={currentExamId}
            />
          )}
          {currentStep === 3 && (
            <Step3Preview
              examData={examData}
              onBack={handleBack}
              onPublish={() => handleSave('published')}
            />
          )}
        </div>
      </div>
      </div>
    </ToastProvider>
  );
};

export default CreateKidsExam;
