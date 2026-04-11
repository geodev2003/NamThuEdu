import { useState } from 'react';
import { ArrowLeft, Clock, Undo2 } from 'lucide-react';
import { ExamPlayerProps } from '../../types/exam';
import { useExamData, useAnswerTracking, useLineDrawing, useMediaUpload } from '../../hooks/exam';
import { groupQuestionsByPart, getPartInfo, getActualTaskType, getTaskTypeName } from '../../utils/examDataExtractor';
import { QuestionRenderer } from './QuestionRenderer';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../ui/ToastContainer';

export function ExamPlayer({
  examId,
  mode,
  onSubmit,
  showHeader = true,
  showTimer = true,
  allowInteraction = true
}: ExamPlayerProps) {
  const toast = useToast();
  const { examData, loading, error } = useExamData(examId);
  const { answers, updateAnswer, resetQuestion, resetAll, answeredCount } = useAnswerTracking();
  const { imageRefs, labelRefs, setImageRef, setLabelRef } = useLineDrawing();
  const { uploadedImages, uploadImage, uploadedCount } = useMediaUpload();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);

  const isInteractive = mode === 'student' && allowInteraction;

  const handleSubmitExam = () => {
    if (answeredCount === 0) {
      toast.error('Bạn chưa trả lời câu hỏi nào!');
      return;
    }
    setShowSubmitModal(true);
  };

  const confirmSubmit = () => {
    const submissionData = {
      examId: examData?.eId,
      answers,
      uploadedImages: uploadedCount,
      submittedAt: new Date().toISOString()
    };
    
    console.log('📤 Submitting exam:', submissionData);
    
    if (onSubmit) {
      onSubmit(answers, uploadedImages);
    }
    
    toast.success('🎉 Xuất sắc! Bạn đã nộp bài thành công! 🌟');
    setShowSubmitModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <p className="text-xl text-gray-600 font-medium">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error || !examData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-xl text-gray-600 mb-4 font-medium">{error || 'Exam not found'}</p>
        </div>
      </div>
    );
  }

  if (!examData.questions || examData.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-xl text-gray-600 mb-4 font-medium">No questions found</p>
        </div>
      </div>
    );
  }

  // Group questions by part and subpart
  const allParts: Array<{
    part: number;
    subPart: number | null;
    questions: typeof examData.questions;
    skillName: string;
    skillIcon: string;
    skillColor: string;
  }> = [];

  examData.questions.forEach((question) => {
    const existingPart = allParts.find(
      (p) => p.part === question.qPart && p.subPart === question.qSubPart
    );

    if (!existingPart) {
      let skillName = '';
      let skillIcon = '';
      let skillColor = '';

      if (question.qPart === 1) {
        skillName = 'Listening';
        skillIcon = '🎧';
        skillColor = 'bg-gradient-to-r from-orange-500 to-orange-600';
      } else if (question.qPart === 2) {
        skillName = 'Reading';
        skillIcon = '📖';
        skillColor = 'bg-gradient-to-r from-blue-500 to-blue-600';
      } else if (question.qPart === 3) {
        skillName = 'Speaking';
        skillIcon = '🗣️';
        skillColor = 'bg-gradient-to-r from-purple-500 to-purple-600';
      }

      allParts.push({
        part: question.qPart,
        subPart: question.qSubPart,
        questions: [question],
        skillName,
        skillIcon,
        skillColor,
      });
    } else {
      existingPart.questions.push(question);
    }
  });

  // Sort parts by part number and subpart
  allParts.sort((a, b) => {
    if (a.part !== b.part) return a.part - b.part;
    return (a.subPart || 0) - (b.subPart || 0);
  });

  const currentPart = allParts[currentPartIndex];

  const handleNextPart = () => {
    if (currentPartIndex < allParts.length - 1) {
      setCurrentPartIndex(currentPartIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPart = () => {
    if (currentPartIndex > 0) {
      setCurrentPartIndex(currentPartIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToPart = (index: number) => {
    setCurrentPartIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPartStatus = (partIndex: number) => {
    const part = allParts[partIndex];
    const partQuestionIds = part.questions.map((q) => q.qId);
    const answeredInPart = partQuestionIds.filter((qId) => answers[qId] !== undefined).length;

    if (answeredInPart === partQuestionIds.length) return 'completed';
    if (partIndex === currentPartIndex) return 'current';
    if (answeredInPart > 0) return 'in-progress';
    return 'not-started';
  };

  return (
    <>
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
        {/* Timer Bar - Fixed Top */}
        {showHeader && (
          <div className="bg-white border-b-4 border-orange-400 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    {examData.eTitle}
                  </h1>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    {showTimer && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {examData.eDuration} minutes
                      </span>
                    )}
                    <span className="text-gray-500">
                      Part {currentPart.subPart ? `${currentPart.part}.${currentPart.subPart}` : currentPart.part} / {allParts.length}
                    </span>
                  </div>
                </div>
                
                {isInteractive && (
                  <button
                    onClick={resetAll}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2"
                  >
                    <Undo2 className="w-4 h-4" />
                    Reset tất cả
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Layout: Content LEFT + Sidebar RIGHT */}
        <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">
          {/* Main Content Area - LEFT (Scrollable) */}
          <div className="flex-1 min-w-0">
            {/* Current Part Content */}
            <div className="mb-8">
              {/* Skill Header */}
              <div className={`${currentPart.skillColor} text-white p-4 rounded-t-2xl`}>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {currentPart.skillIcon} {currentPart.skillName}
                </h2>
              </div>

              {/* Questions */}
              <div className="bg-white rounded-b-2xl shadow-xl border-4 border-gray-200 overflow-hidden">
                {currentPart.questions.map((question, idx) => {
                  const actualTaskType = getActualTaskType(question);
                  
                  return (
                    <div key={question.qId} className={idx > 0 ? 'border-t-4 border-gray-200' : ''}>
                      {/* Question Header */}
                      <div className="bg-gray-50 p-4 border-b-2 border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 font-medium">
                              {question.qSubPart ? `Part ${question.qPart}.${question.qSubPart}` : `Part ${question.qPart}`}
                            </p>
                            <h3 className="text-lg font-bold text-gray-800 mt-1">
                              {getTaskTypeName(actualTaskType)}
                            </h3>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">Points</p>
                            <p className="text-2xl font-bold text-orange-600">{question.qPoints}</p>
                          </div>
                        </div>
                      </div>

                      {/* Question Content */}
                      <div className="p-6">
                        <QuestionRenderer
                          question={question}
                          mode={mode}
                          answer={answers[question.qId]}
                          onAnswer={(value) => updateAnswer(question.qId, value)}
                          uploadedImages={uploadedImages}
                          onImageUpload={uploadImage}
                          imageRefs={imageRefs}
                          labelRefs={labelRefs}
                          onSetImageRef={setImageRef}
                          onSetLabelRef={setLabelRef}
                          onResetQuestion={resetQuestion}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 mt-6">
              <button
                onClick={handlePreviousPart}
                disabled={currentPartIndex === 0}
                className={`px-6 py-3 rounded-lg font-bold text-lg transition-all flex items-center gap-2 ${
                  currentPartIndex === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Previous Part
              </button>

              {currentPartIndex === allParts.length - 1 ? (
                isInteractive && (
                  <button
                    onClick={handleSubmitExam}
                    className="px-8 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg font-bold text-lg hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <span className="text-2xl">🚀</span>
                    Submit Exam
                  </button>
                )
              ) : (
                <button
                  onClick={handleNextPart}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold text-lg hover:bg-blue-600 hover:scale-105 transition-all flex items-center gap-2"
                >
                  Next Part
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar Navigation - RIGHT (Fixed) */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl border-4 border-gray-200 overflow-hidden">
              {/* Sidebar Header */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  📋 Parts Navigation
                </h3>
              </div>

              {/* Parts List */}
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-4 space-y-2">
                {allParts.map((part, index) => {
                  const status = getPartStatus(index);
                  const isCurrent = index === currentPartIndex;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleJumpToPart(index)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        isCurrent
                          ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                          : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Status Icon */}
                        <div className="flex-shrink-0">
                          {status === 'completed' && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">✓</span>
                            </div>
                          )}
                          {status === 'current' && (
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">●</span>
                            </div>
                          )}
                          {status === 'in-progress' && (
                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">◐</span>
                            </div>
                          )}
                          {status === 'not-started' && (
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-gray-500 text-sm font-bold">○</span>
                            </div>
                          )}
                        </div>

                        {/* Part Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{part.skillIcon}</span>
                            <span className={`font-bold text-sm ${isCurrent ? 'text-blue-700' : 'text-gray-700'}`}>
                              Part {part.subPart ? `${part.part}.${part.subPart}` : part.part}
                            </span>
                          </div>
                          <p className={`text-xs mt-1 ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>
                            {part.questions.length} question{part.questions.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Submit Button in Sidebar */}
              {isInteractive && (
                <div className="p-4 border-t-4 border-gray-200">
                  <button
                    onClick={handleSubmitExam}
                    className="w-full py-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl font-bold text-lg hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span className="text-2xl">🚀</span>
                    Nộp bài
                  </button>
                  
                  {/* Progress */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      {answeredCount} / {examData.questions.length} câu
                    </p>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                        style={{ width: `${(answeredCount / examData.questions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl border-4 border-yellow-400 animate-bounce-in">
            <div className="text-center">
              <div className="text-8xl mb-4 animate-bounce">📋</div>
              <h3 className="text-4xl font-bold text-purple-600 mb-6">
                Xác nhận nộp bài? 🤔
              </h3>
              
              <div className="bg-white rounded-2xl p-6 mb-6 border-4 border-purple-300 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">📝</span>
                      <span className="text-xl font-bold text-gray-700">Tổng số câu:</span>
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{examData.questions.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">✅</span>
                      <span className="text-xl font-bold text-gray-700">Đã trả lời:</span>
                    </div>
                    <span className="text-3xl font-bold text-green-600">{answeredCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">📸</span>
                      <span className="text-xl font-bold text-gray-700">Ảnh đã tải:</span>
                    </div>
                    <span className="text-3xl font-bold text-blue-600">{uploadedCount}</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-100 border-4 border-orange-400 rounded-2xl p-4 mb-6">
                <p className="text-xl font-bold text-orange-800 flex items-center justify-center gap-2">
                  <span className="text-3xl">⚠️</span>
                  Sau khi nộp bạn sẽ không thể chỉnh sửa!
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 min-h-[70px] px-6 py-4 bg-gray-300 text-gray-800 rounded-2xl font-bold text-xl hover:bg-gray-400 hover:scale-105 active:scale-95 transition-all border-4 border-gray-400 shadow-lg"
                >
                  <span className="text-2xl mr-2">❌</span>
                  Hủy
                </button>
                <button
                  onClick={confirmSubmit}
                  className="flex-1 min-h-[70px] px-6 py-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-2xl font-bold text-xl hover:from-green-500 hover:to-green-700 hover:scale-105 active:scale-95 transition-all border-4 border-green-300 shadow-lg"
                >
                  <span className="text-2xl mr-2">✅</span>
                  Nộp bài!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
