import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import CambridgePartCard from '../components/CambridgePartCard';
import { CAMBRIDGE_PARTS_STRUCTURE } from '../constants/cambridgeStructure';
import ListenDrawLinesEditor from '../editors/ListenDrawLinesEditor';
import ListenWriteEditor from '../editors/ListenWriteEditor';
import ListenTickEditor from '../editors/ListenTickEditor';
import ListenColourEditor from '../editors/ListenColourEditor';
import LookReadEditor from '../editors/LookReadEditor';
import LookReadWriteEditor from '../editors/LookReadWriteEditor';
import UnscrambleWordsEditor from '../editors/UnscrambleWordsEditor';
import ClozeTestEditor from '../editors/ClozeTestEditor';
import DialogueMatchingEditor from '../editors/DialogueMatchingEditor';
import StoryCompletionEditor from '../editors/StoryCompletionEditor';
import OpenClozeEditor from '../editors/OpenClozeEditor';
import PictureSentenceWritingEditor from '../editors/PictureSentenceWritingEditor';
import PictureStoryWritingEditor from '../editors/PictureStoryWritingEditor';
import WordDefinitionMatchingEditor from '../editors/WordDefinitionMatchingEditor';
import ReadingComprehensionEditor from '../editors/ReadingComprehensionEditor';
import WordBankFillEditor from '../editors/WordBankFillEditor';
import FindDifferencesEditor from '../editors/FindDifferencesEditor';
import PictureStoryNarrationEditor from '../editors/PictureStoryNarrationEditor';
import OddOneOutEditor from '../editors/OddOneOutEditor';
import InformationExchangeEditor from '../editors/InformationExchangeEditor';
import ObjectPlacementEditor from '../editors/ObjectPlacementEditor';
import PictureQuestionsEditor from '../editors/PictureQuestionsEditor';
import PictureCardQuestionsEditor from '../editors/PictureCardQuestionsEditor';
import ListeningLetterMatchEditor from '../editors/ListeningLetterMatchEditor';
import TaskTypeSelectorModal from '../components/TaskTypeSelectorModal';
import { addKidsQuestion, updateKidsQuestion } from '../../../../../../services/kidsExamApi';

interface Step2AddQuestionsProps {
  examData: any;
  setExamData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  examId: string | null;
}

const Step2AddQuestions: React.FC<Step2AddQuestionsProps> = ({
  examData,
  setExamData,
  onNext,
  onBack,
  examId,
}) => {
  const [selectedTaskType, setSelectedTaskType] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showTaskTypeSelector, setShowTaskTypeSelector] = useState(false);
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const [selectedSubPart, setSelectedSubPart] = useState<number | null>(null);
  const [expandedParts, setExpandedParts] = useState<number[]>([]);

  // Define fixed parts structure for Kids exams
  const EXAM_PARTS = [
    { id: 1, name: 'NGHE', icon: '🎧', skill: 'listening' },
    { id: 2, name: 'ĐỌC VÀ VIẾT', icon: '📖', skill: 'reading_writing' },
    { id: 3, name: 'NÓI', icon: '🗣️', skill: 'speaking' },
  ];

  // Get Cambridge structure based on exam type
  const getCambridgeStructure = () => {
    const examType = examData.examType?.toLowerCase();
    if (!examType || !CAMBRIDGE_PARTS_STRUCTURE[examType as keyof typeof CAMBRIDGE_PARTS_STRUCTURE]) {
      return null;
    }
    return CAMBRIDGE_PARTS_STRUCTURE[examType as keyof typeof CAMBRIDGE_PARTS_STRUCTURE];
  };

  const cambridgeStructure = getCambridgeStructure();
  const isCambridgeMode = examData.mode === 'cambridge';
  const hasCambridgeStructure = !!cambridgeStructure;
  
  // Show sub-parts if we have a valid exam type (starters/movers/flyers)
  const showSubParts = hasCambridgeStructure;

  // Debug logging
  console.log('📊 Step2 Debug:', {
    mode: examData.mode,
    isCambridgeMode,
    examType: examData.examType,
    hasCambridgeStructure,
    showSubParts
  });

  // Auto-expand all parts when we have structure
  React.useEffect(() => {
    if (showSubParts) {
      console.log('✅ Auto-expanding parts with sub-parts');
      setExpandedParts([1, 2, 3]);
    }
  }, [showSubParts]);

  // Toggle part expansion
  const togglePart = (partId: number) => {
    setExpandedParts(prev => 
      prev.includes(partId) 
        ? prev.filter(id => id !== partId)
        : [...prev, partId]
    );
  };

  // Handle Cambridge sub-part click
  const handleCambridgeSubPartClick = (partId: number, subPart: any) => {
    setSelectedPart(partId);
    setSelectedSubPart(subPart.partNumber);
    
    // Check if this sub-part already has a question
    const existingQuestion = examData.questions.find(
      (q: any) => q.part === partId && q.subPart === subPart.partNumber
    );
    
    if (existingQuestion) {
      // Sub-part has question, open editor directly
      setSelectedTaskType(existingQuestion.type);
      setShowTaskTypeSelector(false); // Close task type selector
      setShowEditor(true);
    } else {
      // Sub-part is empty, show task type selector
      setShowEditor(false); // Close editor
      setShowTaskTypeSelector(true);
    }
    
    // Scroll to top
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Get skill type based on part ID
  const getSkillByPart = (partId: number): string | string[] => {
    if (partId === 1) return 'listening';
    if (partId === 2) return ['reading', 'writing']; // Part 2 includes both reading AND writing
    if (partId === 3) return 'speaking';
    return '';
  };

  // Get question count for a sub-part
  const getSubPartQuestionCount = (partId: number, subPartNumber: number) => {
    return examData.questions.filter(
      (q: any) => q.part === partId && q.subPart === subPartNumber
    ).length;
  };

  // Get total questions for a part
  const getPartQuestionCount = (partId: number) => {
    return examData.questions.filter((q: any) => q.part === partId).length;
  };

  const handlePartClick = (partId: number) => {
    setSelectedPart(partId);
    setSelectedSubPart(null); // Reset sub-part for flexible mode
    
    // Check if this part already has questions
    const partQuestions = examData.questions.filter((q: any) => q.part === partId);
    
    if (partQuestions.length > 0) {
      // Part has questions, show the first one in editor
      const firstQuestion = partQuestions[0];
      setSelectedTaskType(firstQuestion.type);
      setShowTaskTypeSelector(false); // Close task type selector
      setShowEditor(true);
    } else {
      // Part is empty, show task type selector
      setShowEditor(false); // Close editor
      setShowTaskTypeSelector(true);
    }
  };

  const handleTaskTypeSelected = (taskType: any) => {
    console.log('✅ Task type selected:', taskType);
    console.log('📍 Current part:', selectedPart, 'subPart:', selectedSubPart);
    
    setSelectedTaskType(taskType.code);
    setShowTaskTypeSelector(false);
    setShowEditor(true);
    
    // Scroll to top to see the editor
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Get the question for current selected task type, part, and subPart
  const getCurrentQuestion = () => {
    if (!selectedTaskType) return null;
    
    console.log('🔍 getCurrentQuestion - Looking for:', {
      type: selectedTaskType,
      part: selectedPart,
      subPart: selectedSubPart,
      isCambridgeMode,
      hasCambridgeStructure,
      allQuestions: examData.questions
    });
    
    // Find question matching type, part, and subPart
    // If exam has Cambridge structure (with sub-parts), always compare subPart
    const found = examData.questions.find((q: any) => {
      const typeMatch = q.type === selectedTaskType;
      const partMatch = q.part === selectedPart;
      
      // If exam has Cambridge structure with sub-parts, must match subPart too
      if (hasCambridgeStructure && selectedSubPart !== null) {
        const subPartMatch = q.subPart === selectedSubPart;
        const match = typeMatch && partMatch && subPartMatch;
        
        console.log('  Checking question:', {
          qId: q.qId,
          type: q.type,
          part: q.part,
          subPart: q.subPart,
          expectedPart: selectedPart,
          expectedSubPart: selectedSubPart,
          typeMatch,
          partMatch,
          subPartMatch,
          finalMatch: match
        });
        return match;
      } else {
        // No sub-parts, just match type and part
        const match = typeMatch && partMatch;
        
        console.log('  Checking question:', {
          qId: q.qId,
          type: q.type,
          part: q.part,
          subPart: q.subPart,
          expectedPart: selectedPart,
          typeMatch,
          partMatch,
          finalMatch: match
        });
        return match;
      }
    });
    
    console.log('🎯 Found question:', found);
    return found;
  };

  const handleSaveQuestion = async (questionData: any) => {
    if (!examId) {
      alert('Vui lòng tạo đề thi trước khi thêm câu hỏi!');
      return;
    }

    try {
      // Add part and subPart information to question data
      const questionWithPart = {
        ...questionData,
        part: selectedPart,
        subPart: selectedSubPart, // Add subPart for Cambridge mode
      };

      // Prepare question data for API
      const apiQuestionData = {
        task_type_code: questionWithPart.type,
        task_data: questionWithPart.config || {},
        qContent: questionWithPart.title || '',
        qPoints: questionWithPart.points || 5,
        part: selectedPart,
        subPart: selectedSubPart, // Include subPart in API call
      };

      console.log('📤 Sending question data to API:', apiQuestionData);
      
      // Validate that we have required data
      if (!apiQuestionData.task_data || Object.keys(apiQuestionData.task_data).length === 0) {
        alert('Vui lòng nhập đầy đủ thông tin câu hỏi!');
        return;
      }

      // Find existing question of this type in this part (and subPart if Cambridge mode)
      console.log('🔍 Looking for existing question:', {
        type: questionWithPart.type,
        part: selectedPart,
        subPart: selectedSubPart,
        hasCambridgeStructure,
        allQuestions: examData.questions.map(q => ({
          qId: q.qId,
          type: q.type,
          part: q.part,
          subPart: q.subPart
        }))
      });

      const existingQuestionIndex = examData.questions.findIndex(
        (q: any) => {
          // If exam has Cambridge structure with sub-parts, must match subPart too
          if (hasCambridgeStructure && selectedSubPart !== null) {
            const match = q.type === questionWithPart.type && 
                   q.part === selectedPart && 
                   q.subPart === selectedSubPart;
            console.log(`  Checking q${q.qId}: type=${q.type}, part=${q.part}, subPart=${q.subPart} => ${match}`);
            return match;
          } else {
            const match = q.type === questionWithPart.type && q.part === selectedPart;
            console.log(`  Checking q${q.qId}: type=${q.type}, part=${q.part} => ${match}`);
            return match;
          }
        }
      );
      
      console.log('🎯 Existing question index:', existingQuestionIndex);
      
      if (existingQuestionIndex !== -1) {
        // Edit existing question
        const existingQuestion = examData.questions[existingQuestionIndex];
        
        if (existingQuestion.qId) {
          await updateKidsQuestion(parseInt(examId), existingQuestion.qId, apiQuestionData);
        }
        
        const updatedQuestions = [...examData.questions];
        updatedQuestions[existingQuestionIndex] = {
          ...existingQuestion,
          ...questionWithPart,
        };
        setExamData({ ...examData, questions: updatedQuestions });
      } else {
        // Add new question to database
        const response = await addKidsQuestion(parseInt(examId), apiQuestionData);
        
        // Add to local state with database ID
        const newQuestion = {
          ...questionWithPart,
          qId: response.question?.qId,
          id: `q-${Date.now()}`,
        };
        
        setExamData({
          ...examData,
          questions: [...examData.questions, newQuestion],
        });
        
        console.log('✅ Question saved to database:', response);
      }

      setShowEditor(false);
    } catch (error: any) {
      console.error('❌ Failed to save question:', error);
      console.error('❌ Error response:', error.response?.data);
      alert('Không thể lưu câu hỏi. Vui lòng thử lại!');
    }
  };

  const handleCancelEditor = () => {
    setShowEditor(false);
  };

  return (
    <div className="flex gap-6 h-full max-h-[calc(100vh-200px)]">
      {/* Left Sidebar - Scrollable independently */}
      <div className="w-56 flex-shrink-0 overflow-y-auto h-full">
        <div className="space-y-4">
          {/* Header */}
          <div className="rounded-lg border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-2">
            <h3 className="font-baloo text-sm font-bold text-indigo-600">
              📋 Cấu trúc đề thi
            </h3>
            <p className="text-xs text-gray-600">
              {showSubParts 
                ? `${examData.examType?.toUpperCase() || 'Cambridge'} - 3 kỹ năng`
                : '3 phần cố định'
              }
            </p>
          </div>

          {/* Flexible Mode WITHOUT Sub-parts - Only show if no exam type selected */}
          {!showSubParts && (
            <div className="space-y-2">
              {EXAM_PARTS.map((part) => {
                const partQuestions = examData.questions.filter((q: any) => q.part === part.id);
                const hasQuestions = partQuestions.length > 0;
                
                return (
                  <button
                    key={part.id}
                    onClick={() => handlePartClick(part.id)}
                    className={`group w-full rounded-xl border-2 p-4 text-left transition-all hover:border-indigo-300 hover:shadow-md ${
                      selectedPart === part.id && showEditor
                        ? 'border-indigo-500 bg-indigo-50'
                        : hasQuestions
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{part.icon}</span>
                        <div>
                          <div className="font-baloo text-sm font-bold text-gray-900">
                            Phần {part.id}
                          </div>
                          <div className="text-xs text-gray-600">{part.name}</div>
                        </div>
                      </div>
                      {hasQuestions && (
                        <span className="text-xl">✓</span>
                      )}
                    </div>
                    {hasQuestions && (
                      <div className="mt-2 text-xs text-gray-500">
                        {partQuestions.length} câu hỏi
                      </div>
                    )}
                    {!hasQuestions && (
                      <div className="mt-2 text-xs text-gray-400">
                        Chưa có câu hỏi
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Show Parts with Sub-parts - Based on Exam Type (Starters/Movers/Flyers) */}
          {showSubParts && cambridgeStructure && (
            <div className="space-y-2">
              {/* Listening Part */}
              <div className="rounded-xl border-2 border-blue-200 bg-white overflow-hidden">
                <button
                  onClick={() => togglePart(1)}
                  className="w-full p-3 flex items-center justify-between hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cambridgeStructure.listening.icon}</span>
                    <div className="text-left">
                      <div className="font-baloo text-sm font-bold text-gray-900">
                        Phần 1
                      </div>
                      <div className="text-xs text-gray-600">NGHE</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPartQuestionCount(1) > 0 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {getPartQuestionCount(1)}
                      </span>
                    )}
                    <span className={`transform transition-transform ${expandedParts.includes(1) ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>
                
                {expandedParts.includes(1) && (
                  <div className="border-t border-blue-100 bg-blue-50 p-2 space-y-1">
                    {cambridgeStructure.listening.parts.map((subPart: any) => {
                      const subPartCount = getSubPartQuestionCount(1, subPart.partNumber);
                      const subPartQuestion = examData.questions.find(
                        (q: any) => q.part === 1 && q.subPart === subPart.partNumber
                      );
                      const isSelected = selectedPart === 1 && selectedSubPart === subPart.partNumber;
                      return (
                        <button
                          key={subPart.partNumber}
                          onClick={() => handleCambridgeSubPartClick(1, subPart)}
                          className={`w-full text-left p-2 rounded-lg transition-all duration-300 ease-in-out transform ${
                            isSelected
                              ? 'bg-blue-300 border-2 border-blue-600 shadow-lg scale-105 animate-pulse-subtle'
                              : subPartCount > 0
                              ? 'bg-green-50 border border-green-200 hover:bg-green-100 hover:scale-102'
                              : 'bg-white border border-blue-100 hover:bg-blue-100 hover:scale-102'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className={`text-xs transition-all duration-300 ${isSelected ? 'font-bold text-blue-900' : 'font-medium text-gray-900'}`}>
                                {subPart.name}
                              </div>
                              <div className={`text-xs transition-all duration-300 ${isSelected ? 'font-semibold text-blue-700' : 'text-gray-600'}`}>
                                {subPartQuestion ? `Dạng: ${subPartQuestion.type}` : subPart.description}
                              </div>
                            </div>
                            {subPartCount > 0 && (
                              <span className="text-green-600 ml-2 transition-transform duration-300">✓</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Reading & Writing Part */}
              <div className="rounded-xl border-2 border-purple-200 bg-white overflow-hidden">
                <button
                  onClick={() => togglePart(2)}
                  className="w-full p-3 flex items-center justify-between hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cambridgeStructure.reading_writing.icon}</span>
                    <div className="text-left">
                      <div className="font-baloo text-sm font-bold text-gray-900">
                        Phần 2
                      </div>
                      <div className="text-xs text-gray-600">ĐỌC VÀ VIẾT</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPartQuestionCount(2) > 0 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {getPartQuestionCount(2)}
                      </span>
                    )}
                    <span className={`transform transition-transform ${expandedParts.includes(2) ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>
                
                {expandedParts.includes(2) && (
                  <div className="border-t border-purple-100 bg-purple-50 p-2 space-y-1">
                    {cambridgeStructure.reading_writing.parts.map((subPart: any) => {
                      const subPartCount = getSubPartQuestionCount(2, subPart.partNumber);
                      const subPartQuestion = examData.questions.find(
                        (q: any) => q.part === 2 && q.subPart === subPart.partNumber
                      );
                      const isSelected = selectedPart === 2 && selectedSubPart === subPart.partNumber;
                      return (
                        <button
                          key={subPart.partNumber}
                          onClick={() => handleCambridgeSubPartClick(2, subPart)}
                          className={`w-full text-left p-2 rounded-lg transition-all duration-300 ease-in-out transform ${
                            isSelected
                              ? 'bg-purple-300 border-2 border-purple-600 shadow-lg scale-105 animate-pulse-subtle'
                              : subPartCount > 0
                              ? 'bg-green-50 border border-green-200 hover:bg-green-100 hover:scale-102'
                              : 'bg-white border border-purple-100 hover:bg-purple-100 hover:scale-102'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className={`text-xs transition-all duration-300 ${isSelected ? 'font-bold text-purple-900' : 'font-medium text-gray-900'}`}>
                                {subPart.name}
                              </div>
                              <div className={`text-xs transition-all duration-300 ${isSelected ? 'font-semibold text-purple-700' : 'text-gray-600'}`}>
                                {subPartQuestion ? `Dạng: ${subPartQuestion.type}` : subPart.description}
                              </div>
                            </div>
                            {subPartCount > 0 && (
                              <span className="text-green-600 ml-2 transition-transform duration-300">✓</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Speaking Part */}
              <div className="rounded-xl border-2 border-orange-200 bg-white overflow-hidden">
                <button
                  onClick={() => togglePart(3)}
                  className="w-full p-3 flex items-center justify-between hover:bg-orange-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cambridgeStructure.speaking.icon}</span>
                    <div className="text-left">
                      <div className="font-baloo text-sm font-bold text-gray-900">
                        Phần 3
                      </div>
                      <div className="text-xs text-gray-600">NÓI</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPartQuestionCount(3) > 0 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {getPartQuestionCount(3)}
                      </span>
                    )}
                    <span className={`transform transition-transform ${expandedParts.includes(3) ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>
                
                {expandedParts.includes(3) && (
                  <div className="border-t border-orange-100 bg-orange-50 p-2 space-y-1">
                    {cambridgeStructure.speaking.parts.map((subPart: any) => {
                      const subPartCount = getSubPartQuestionCount(3, subPart.partNumber);
                      const subPartQuestion = examData.questions.find(
                        (q: any) => q.part === 3 && q.subPart === subPart.partNumber
                      );
                      const isSelected = selectedPart === 3 && selectedSubPart === subPart.partNumber;
                      return (
                        <button
                          key={subPart.partNumber}
                          onClick={() => handleCambridgeSubPartClick(3, subPart)}
                          className={`w-full text-left p-2 rounded-lg transition-all duration-300 ease-in-out transform ${
                            isSelected
                              ? 'bg-orange-300 border-2 border-orange-600 shadow-lg scale-105 animate-pulse-subtle'
                              : subPartCount > 0
                              ? 'bg-green-50 border border-green-200 hover:bg-green-100 hover:scale-102'
                              : 'bg-white border border-orange-100 hover:bg-orange-100 hover:scale-102'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className={`text-xs transition-all duration-300 ${isSelected ? 'font-bold text-orange-900' : 'font-medium text-gray-900'}`}>
                                {subPart.name}
                              </div>
                              <div className={`text-xs transition-all duration-300 ${isSelected ? 'font-semibold text-orange-700' : 'text-gray-600'}`}>
                                {subPartQuestion ? `Dạng: ${subPartQuestion.type}` : subPart.description}
                              </div>
                            </div>
                            {subPartCount > 0 && (
                              <span className="text-green-600 ml-2 transition-transform duration-300">✓</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area - Scrollable independently */}
      <div className="flex-1 space-y-4 overflow-y-auto h-full">
        {/* Header */}
        <div>
          <h2 className="mb-1 font-baloo text-2xl font-bold text-indigo-600">
            Bước 2: Thêm Câu Hỏi 📝
          </h2>
          <p className="text-sm text-gray-600">
            {showSubParts 
              ? `Chọn Part và thêm câu hỏi theo cấu trúc ${examData.examType?.toUpperCase() || 'Cambridge'}`
              : 'Chọn dạng bài và tạo câu hỏi cho đề thi'
            }
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Task Type Selector - Show inline when open (Both modes) */}
          {showTaskTypeSelector && selectedPart && (
            <TaskTypeSelectorModal
              isOpen={showTaskTypeSelector}
              onClose={() => {
                setShowTaskTypeSelector(false);
                // Don't reset selectedPart and selectedSubPart so user can see which part they were working on
              }}
              onSelect={handleTaskTypeSelected}
              filterBySkill={getSkillByPart(selectedPart)}
            />
          )}

          {/* Instruction when no editor - Show different message based on structure */}
          {!showEditor && !showTaskTypeSelector && (
            <div className={`rounded-2xl border-4 border-dashed p-12 text-center ${
              showSubParts 
                ? 'border-purple-300 bg-purple-50' 
                : 'border-gray-300 bg-gray-50'
            }`}>
              <div className="mb-4 text-6xl">{showSubParts ? '☝️' : '👈'}</div>
              <h3 className={`mb-2 font-baloo text-2xl font-bold ${
                showSubParts ? 'text-purple-700' : 'text-gray-700'
              }`}>
                {showSubParts ? 'Chọn Part để thêm câu hỏi' : 'Chọn phần để thêm câu hỏi'}
              </h3>
              <p className={showSubParts ? 'text-purple-600' : 'text-gray-500'}>
                {showSubParts 
                  ? `Nhấn vào các Part bên trái để tạo câu hỏi theo cấu trúc ${examData.examType?.toUpperCase()}`
                  : 'Nhấn vào một trong 3 phần bên trái để bắt đầu'
                }
              </p>
            </div>
          )}

          {/* Question Editor */}
          {showEditor && selectedTaskType && (
            <div>
              {selectedTaskType === 'listen_and_draw_lines' ? (
                <ListenDrawLinesEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'listen_and_write' ? (
                <ListenWriteEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'listen_and_tick' ? (
                <ListenTickEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'listen_colour' || selectedTaskType === 'listen_colour_write' ? (
                <ListenColourEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'look_and_read' ? (
                <LookReadEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'look_read_write' ? (
                <LookReadWriteEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'unscramble_words' ? (
                <UnscrambleWordsEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'cloze_test' ? (
                <ClozeTestEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'dialogue_matching' ? (
                <DialogueMatchingEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'story_completion' ? (
                <StoryCompletionEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'open_cloze' ? (
                <OpenClozeEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'picture_sentence_writing' ? (
                <PictureSentenceWritingEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'picture_story_writing' ? (
                <PictureStoryWritingEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'word_definition_matching' ? (
                <WordDefinitionMatchingEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'reading_comprehension' ? (
                <ReadingComprehensionEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'word_bank_fill' ? (
                <WordBankFillEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'find_differences' ? (
                <FindDifferencesEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'picture_story_narration' ? (
                <PictureStoryNarrationEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'odd_one_out' ? (
                <OddOneOutEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'information_exchange' ? (
                <InformationExchangeEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'object_placement' ? (
                <ObjectPlacementEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'picture_questions' ? (
                <PictureQuestionsEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'picture_card_questions' ? (
                <PictureCardQuestionsEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : selectedTaskType === 'listening_letter_match' ? (
                <ListeningLetterMatchEditor
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEditor}
                  initialData={getCurrentQuestion()}
                  examId={examId}
                  questionId={getCurrentQuestion()?.id || null}
                />
              ) : (
                <div className="rounded-xl border-2 border-gray-200 bg-white p-6 text-center">
                  <div className="mb-4 text-6xl">🚧</div>
                  <h3 className="mb-2 font-baloo text-2xl font-bold text-indigo-600">
                    Đang phát triển
                  </h3>
                  <p className="text-gray-600">
                    Editor cho dạng bài: <span className="font-semibold">{selectedTaskType}</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Tính năng này sẽ được bổ sung trong phiên bản tiếp theo
                  </p>
                  <button
                    onClick={handleCancelEditor}
                    className="mt-6 rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50"
                  >
                    Đóng
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Questions List - Removed from main area since it's now in sidebar */}

          {/* Empty State - Removed, replaced with instruction above */}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 rounded-xl border-2 border-gray-300 px-6 py-3 font-medium transition-all hover:bg-gray-50 hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại</span>
          </button>
          <button
            onClick={onNext}
            disabled={examData.questions.length === 0}
            className={`flex items-center space-x-2 rounded-xl px-6 py-3 font-baloo text-lg font-bold transition-all ${
              examData.questions.length > 0
                ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white hover:scale-105 hover:shadow-xl'
                : 'cursor-not-allowed bg-gray-300 text-gray-500'
            }`}
          >
            <span>Tiếp theo: Xem trước 🎉</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2AddQuestions;
