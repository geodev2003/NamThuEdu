import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { TemplateGuide } from "./TemplateGuide";
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  ChevronRight,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Volume2,
  FileText,
  Info,
  Clock,
  Target,
  HelpCircle,
  Sparkles,
  Globe,
  Lock,
  Settings,
  Calendar,
  Bell,
  X,
  ChevronDown,
  Menu,
  Mic,
  BookOpen,
} from "lucide-react";
import { teacherApi } from "../../../../services/teacherApi";

// VSTEP Structure - 4 Skills, 7 Main Parts
const VSTEP_STRUCTURE = {
  listening: {
    name: "Listening",
    icon: "🎧",
    duration: 40,
    totalQuestions: 35,
    parts: [
      { part: 1, name: "Announcements", questions: 8, description: "Thông báo ngắn" },
      { part: 2, name: "Dialogues", questions: 12, description: "Hội thoại 2-3 người" },
      { part: 3, name: "Lectures", questions: 15, description: "Bài giảng học thuật" },
    ],
  },
  reading: {
    name: "Reading",
    icon: "📖",
    duration: 60,
    totalQuestions: 40,
    parts: [
      { part: 1, name: "Passage 1", questions: 10, description: "Văn bản ngắn (400-500 từ)", wordCount: [400, 500] },
      { part: 2, name: "Passage 2", questions: 10, description: "Văn bản mô tả (400-500 từ)", wordCount: [400, 500] },
      { part: 3, name: "Passage 3", questions: 10, description: "Văn bản lập luận (500-600 từ)", wordCount: [500, 600] },
      { part: 4, name: "Passage 4", questions: 10, description: "Văn bản học thuật (600-700 từ)", wordCount: [600, 700] },
    ],
  },
  writing: {
    name: "Writing",
    icon: "✍️",
    duration: 60,
    totalQuestions: 2,
    parts: [
      { part: 1, name: "Task 1", questions: 1, description: "Letter/Email (150 từ)", minWords: 150 },
      { part: 2, name: "Task 2", questions: 1, description: "Essay (250 từ)", minWords: 250 },
    ],
  },
  speaking: {
    name: "Speaking",
    icon: "🗣️",
    duration: 12,
    totalQuestions: 3,
    parts: [
      { part: 1, name: "Social Interaction", questions: 1, description: "3-6 câu hỏi (3 phút)" },
      { part: 2, name: "Solution Discussion", questions: 1, description: "Chọn giải pháp (4 phút)" },
      { part: 3, name: "Topic Development", questions: 1, description: "Phát triển chủ đề (5 phút)" },
    ],
  },
};

type ExamType = "VSTEP" | "IELTS" | "Cambridge" | "General" | null;
type ExamSkill = "Listening" | "Reading" | "Writing" | "Speaking" | "Mixed" | null;
type QuestionType =
  | "multiple-choice"
  | "true-false"
  | "fill-blank"
  | "short-answer"
  | "essay"
  | "matching"
  | "listening"
  | "speaking";

interface Question {
  id: string;
  type: QuestionType;
  content: string;
  points: number;
  answers?: { id: string; text: string; isCorrect: boolean }[];
  // VSTEP specific fields
  skill?: string;
  part?: number;
  questionNumber?: number;
  audioUrl?: string;
  audioFileName?: string;
  transcript?: string;
  listenLimit?: number;
  passage?: string;
  minWords?: number;
  prepTime?: number;
  speakTime?: number;
}

const examTypeData = [
  {
    value: "VSTEP",
    icon: "🎯",
    name: "VSTEP",
    description: "Bài thi chuẩn Việt Nam (B1, B2, C1)",
    duration: "145-195 phút",
  },
  {
    value: "IELTS",
    icon: "🌍",
    name: "IELTS",
    description: "Academic / General Training",
    duration: "165 phút",
  },
  {
    value: "Cambridge",
    icon: "📚",
    name: "Cambridge",
    description: "KET, PET, FCE, CAE, CPE",
    duration: "110-235 phút",
  },
  {
    value: "General",
    icon: "📄",
    name: "General",
    description: "Đề thi tùy chỉnh",
    duration: "Tùy chọn",
  },
];

const skillData = [
  {
    value: "Mixed",
    icon: "🧩",
    name: "Full 4 kỹ năng",
    description: "Listening + Reading + Writing + Speaking",
    colorClass: "border-violet-600 bg-violet-50",
  },
  { value: "Listening", icon: "🎧", name: "Listening", color: "blue" },
  { value: "Reading", icon: "📖", name: "Reading", color: "green" },
  { value: "Writing", icon: "✍️", name: "Writing", color: "orange" },
  { value: "Speaking", icon: "🗣️", name: "Speaking", color: "purple" },
];

const questionTypes = [
  { value: "multiple-choice", label: "Trắc nghiệm nhiều đáp án", icon: HelpCircle },
  { value: "true-false", label: "Đúng / Sai", icon: CheckCircle2 },
  { value: "fill-blank", label: "Điền vào chỗ trống", icon: FileText },
  { value: "short-answer", label: "Câu trả lời ngắn", icon: FileText },
  { value: "essay", label: "Tự luận", icon: FileText },
  { value: "matching", label: "Nối đáp án", icon: Target },
  { value: "listening", label: "Nghe (có audio)", icon: Volume2 },
  { value: "speaking", label: "Nói (có ghi âm)", icon: Volume2 },
];

export function CreateExam() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [currentExamId, setCurrentExamId] = useState<string | null>(examId || null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Step 1: Basic Info
  const [examType, setExamType] = useState<ExamType>(null);
  const [examSkill, setExamSkill] = useState<ExamSkill>(null);
  const [examTitle, setExamTitle] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [duration, setDuration] = useState(60);
  const [durationUnit, setDurationUnit] = useState<"minutes" | "hours">("minutes");
  const [difficulty, setDifficulty] = useState("medium");
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [allowPreview, setAllowPreview] = useState(true);

  useEffect(() => {
    if (examType === "VSTEP" && examSkill === "Mixed") {
      setDuration(172);
      setDurationUnit("minutes");
    }
  }, [examType, examSkill]);

  // Step 2: Questions
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState<QuestionType | null>(null);

  // VSTEP Mode
  const [vstepCurrentSkill, setVstepCurrentSkill] = useState<"listening" | "reading" | "writing" | "speaking">("listening");
  const [vstepCurrentPart, setVstepCurrentPart] = useState(1);
  const [vstepActiveQuestionNumber, setVstepActiveQuestionNumber] = useState<number>(1);
  const [showVstepMenu, setShowVstepMenu] = useState(false);
  const [audioUploading, setAudioUploading] = useState<{[key: string]: boolean}>({});
  
  // Auto-save state
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [draftPromptShown, setDraftPromptShown] = useState(false);

  // Initialize VSTEP questions when type changes to VSTEP
  useEffect(() => {
    if (examType === "VSTEP" && examSkill === "Mixed" && questions.length === 0) {
      const vstepQuestions: Question[] = [];
      let questionCounter = 1;

      Object.entries(VSTEP_STRUCTURE).forEach(([skill, skillData]) => {
        skillData.parts.forEach((part) => {
          for (let i = 0; i < part.questions; i++) {
            vstepQuestions.push({
              id: `${skill}-p${part.part}-q${i + 1}`,
              skill,
              part: part.part,
              questionNumber: questionCounter++,
              type: skill === "listening" || skill === "reading" ? "multiple-choice" : skill === "writing" ? "essay" : "speaking",
              content: "",
              points: skill === "writing" || skill === "speaking" ? 10 : 1,
              answers: skill === "listening" || skill === "reading"
                ? [
                    { id: "a", text: "", isCorrect: false },
                    { id: "b", text: "", isCorrect: false },
                    { id: "c", text: "", isCorrect: false },
                    { id: "d", text: "", isCorrect: false },
                  ]
                : undefined,
              listenLimit: skill === "listening" ? 1 : undefined,
              minWords: skill === "writing" ? (part.part === 1 ? 150 : 250) : undefined,
            });
          }
        });
      });

      setQuestions(vstepQuestions);
      setExamTitle(examTitle || "VSTEP B2 - Practice Test");
    }
  }, [examType, examSkill]);

  // Step 3: Preview & Publish
  const [publishOption, setPublishOption] = useState<"now" | "draft" | "schedule">("now");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notifyStudents, setNotifyStudents] = useState(false);
  const [notifyTeachers, setNotifyTeachers] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const totalQuestions = questions.length;

  const updateQuestionInState = (questionId: string, updater: (question: Question) => Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === questionId ? updater(q) : q)));
    setSelectedQuestion((prev) => (prev && prev.id === questionId ? updater(prev) : prev));
  };

  const normalizeExamType = (type: ExamType) => {
    if (type === "VSTEP") return "VSTEP";
    if (type === "IELTS") return "IELTS";
    return "GENERAL";
  };

  const normalizeExamSkill = (
    skill: ExamSkill
  ): "listening" | "reading" | "writing" | "speaking" | "mixed" => {
    if (!skill) return "reading";
    if (skill === "Mixed") return "mixed";
    return skill.toLowerCase() as "listening" | "reading" | "writing" | "speaking";
  };

  const getExamSkillLabel = (skill: ExamSkill) => {
    if (skill === "Mixed") return "Full 4 kỹ năng";
    return skill || "Chưa chọn";
  };

  const normalizeQuestionType = (type: QuestionType) => {
    if (type === "multiple-choice") return "multiple_choice";
    if (type === "true-false") return "true_false";
    if (type === "fill-blank") return "fill_blank";
    if (type === "short-answer") return "short_answer";
    if (type === "essay") return "essay";
    if (type === "matching") return "reading_matching";
    if (type === "listening") return "listening_multiple_choice";
    if (type === "speaking") return "speaking_response";
    return "multiple_choice";
  };

  const buildAnswers = (question: Question) => {
    const candidates = (question.answers || [])
      .filter((answer) => answer.text.trim().length > 0)
      .map((answer) => ({
        aContent: answer.text.trim(),
        aIs_correct: answer.isCorrect,
      }));

    if (candidates.length === 0) {
      return [{ aContent: "N/A", aIs_correct: true }];
    }

    if (!candidates.some((answer) => answer.aIs_correct)) {
      candidates[0].aIs_correct = true;
    }

    return candidates;
  };

  const persistExam = async (mode: "draft" | "publish") => {
    if (!canProceedStep1 || !examType || !examSkill) {
      alert("Vui lòng nhập đầy đủ thông tin cơ bản của đề thi.");
      return;
    }

    setIsSaving(true);
    try {
      const durationMinutes = durationUnit === "hours" ? duration * 60 : duration;
      const createRes = await teacherApi.exams.create({
        eTitle: examTitle.trim(),
        eDescription: examDescription.trim(),
        eType: normalizeExamType(examType),
        eSkill: normalizeExamSkill(examSkill),
        eDuration_minutes: durationMinutes,
        eIs_private: visibility === "private",
        eSource_type: "manual",
      });

      const examId =
        (createRes as any)?.data?.examId ??
        (createRes as any)?.data?.eId ??
        (createRes as any)?.data?.id;

      if (!examId) {
        throw new Error("Không lấy được ID đề thi sau khi tạo.");
      }

      const questionPayload = questions
        .filter((question) => question.content.trim().length > 0)
        .map((question) => ({
          qContent: question.content.trim(),
          qType: normalizeQuestionType(question.type),
          qPoints: Number.isFinite(question.points) && question.points > 0 ? question.points : 1,
          answers: buildAnswers(question),
        }));

      if (questionPayload.length > 0) {
        await teacherApi.exams.addQuestions(examId, questionPayload);
      }

      const shouldPublishNow = mode === "publish" && publishOption === "now";
      if (shouldPublishNow) {
        await teacherApi.exams.publish(examId);
      }

      if (mode === "publish") {
        if (publishOption === "now") {
          alert("Tạo và xuất bản đề thi thành công.");
        } else if (publishOption === "schedule") {
          alert(
            `Đã lưu đề ở trạng thái nháp. Lên lịch xuất bản${scheduledAt ? ` (${scheduledAt})` : ""} chưa được backend hỗ trợ.`
          );
        } else {
          alert("Đã tạo đề thi ở trạng thái nháp.");
        }
      } else {
        alert("Đã lưu nháp đề thi thành công.");
      }

      navigate("/giao-vien/de-thi/cua-toi");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể lưu đề thi. Vui lòng thử lại.";
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    await persistExam("draft");
  };

  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type,
      content: "",
      points: 1,
      answers:
        type === "multiple-choice" || type === "true-false"
          ? [
              { id: "a1", text: "", isCorrect: false },
              { id: "a2", text: "", isCorrect: false },
            ]
          : undefined,
    };
    setQuestions([...questions, newQuestion]);
    setSelectedQuestion(newQuestion);
    setIsAddingQuestion(false);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    if (selectedQuestion?.id === id) {
      setSelectedQuestion(null);
    }
  };

  const handleNextStep = async () => {
    if (currentStep < 3) {
      // Create draft exam when moving from Step 1 to Step 2
      if (currentStep === 1 && !currentExamId) {
        try {
          const newExamId = await createDraftExam();
          console.log('🔍 Debug - newExamId:', newExamId, 'Type:', typeof newExamId);
          // Convert to string and check if it's not a temp ID
          if (newExamId && !String(newExamId).startsWith('temp_')) {
            console.log('✅ Navigating to:', `/giao-vien/de-thi/tao-moi/${newExamId}`);
            // Navigate to URL with exam ID
            navigate(`/giao-vien/de-thi/tao-moi/${newExamId}`, { replace: true });
          } else {
            console.log('❌ Not navigating - temp ID or invalid:', newExamId);
          }
        } catch (error) {
          console.error('Failed to create draft exam:', error);
        }
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedStep1 = examType && examSkill && examTitle && duration > 0;
  const canProceedStep2 = questions.length > 0;
  const canSubmitExam = canProceedStep1 && questions.length > 0;

  // Check if VSTEP mode
  const isVSTEPMode = examType === "VSTEP" && examSkill === "Mixed";

  // Get VSTEP progress
  const getVSTEPPartProgress = () => {
    const progress: any[] = [];
    if (!isVSTEPMode) return progress;

    Object.entries(VSTEP_STRUCTURE).forEach(([skill, skillData]) => {
      skillData.parts.forEach((part) => {
        const partQuestions = questions.filter((q) => q.skill === skill && q.part === part.part);
        const completed = partQuestions.filter((q) => {
          if (!q.content.trim()) return false;
          if (skill === "listening" || skill === "reading") {
            return q.answers?.some((a) => a.isCorrect && a.text.trim());
          }
          return true;
        }).length;

        progress.push({ skill, part: part.part, completed, total: part.questions });
      });
    });

    return progress;
  };

  const vstepProgress = getVSTEPPartProgress();

  // VSTEP: Get current part questions
  const vstepCurrentPartQuestions = isVSTEPMode
    ? questions.filter((q) => q.skill === vstepCurrentSkill && q.part === vstepCurrentPart)
    : [];

  // VSTEP: Update question
  const updateVSTEPQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, ...updates } : q)));
  };

  // VSTEP: Update answer
  const updateVSTEPAnswer = (questionId: string, answerId: string, content: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId && q.answers) {
          return {
            ...q,
            answers: q.answers.map((a) => (a.id === answerId ? { ...a, text: content } : a)),
          };
        }
        return q;
      })
    );
  };

  // VSTEP: Set correct answer
  const setVSTEPCorrectAnswer = (questionId: string, answerId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId && q.answers) {
          return {
            ...q,
            answers: q.answers.map((a) => ({ ...a, isCorrect: a.id === answerId })),
          };
        }
        return q;
      })
    );
  };

  // VSTEP: Navigate parts
  const allVSTEPParts = isVSTEPMode
    ? Object.entries(VSTEP_STRUCTURE).flatMap(([s, sd]) =>
        sd.parts.map((p) => ({ skill: s, part: p.part }))
      )
    : [];

  const vstepCurrentPartIndex = allVSTEPParts.findIndex(
    (p) => p.skill === vstepCurrentSkill && p.part === vstepCurrentPart
  );

  const goToNextVSTEPPart = () => {
    if (vstepCurrentPartIndex < allVSTEPParts.length - 1) {
      const next = allVSTEPParts[vstepCurrentPartIndex + 1];
      setVstepCurrentSkill(next.skill as any);
      setVstepCurrentPart(next.part);
      setVstepActiveQuestionNumber(1); // Reset to first question of new part
    }
  };

  // VSTEP: Jump to specific question in current part
  const jumpToVSTEPQuestion = (questionNumber: number) => {
    setVstepActiveQuestionNumber(questionNumber);
    // Scroll to question
    const questionElement = document.getElementById(`vstep-question-${vstepCurrentSkill}-${vstepCurrentPart}-q${questionNumber}`);
    if (questionElement) {
      questionElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  // VSTEP: Handle audio file upload
  const handleAudioUpload = async (questionId: string, file: File) => {
    if (!file.type.startsWith('audio/')) {
      alert('Vui lòng chọn file audio hợp lệ (MP3, WAV, etc.)');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert('File audio quá lớn. Vui lòng chọn file nhỏ hơn 50MB');
      return;
    }

    setAudioUploading(prev => ({ ...prev, [questionId]: true }));

    try {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('questionId', questionId);
      
      console.log('🎵 Uploading audio:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        questionId
      });
      
      const token = localStorage.getItem('auth_token');
      const apiEndpoint = token 
        ? 'http://localhost:8000/api/teacher/upload/audio'
        : 'http://localhost:8000/api/test/upload/audio';
      
      console.log('📡 API Endpoint:', apiEndpoint);
      console.log('🔑 Has token:', !!token);
      
      const headers: any = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Don't set Content-Type - let browser set it automatically with boundary for FormData
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers,
        body: formData,
      });

      console.log('📥 Response status:', response.status);
      const result = await response.json();
      console.log('📥 Response data:', result);

      if (response.ok && result.success) {
        updateVSTEPQuestion(questionId, { 
          audioUrl: result.data.audioUrl,
          audioFileName: result.data.originalName 
        });
        alert('✅ Upload audio thành công!');
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Audio upload error:', error);
      alert(`Lỗi upload audio: ${error.message}`);
    } finally {
      setAudioUploading(prev => ({ ...prev, [questionId]: false }));
    }
  };

  // Auto-save functions
  const createDraftExam = async () => {
    if (currentExamId) return currentExamId; // Already has ID
    
    try {
      const examData = {
        eTitle: examTitle || `Đề thi ${examType} - ${new Date().toLocaleString('vi-VN')}`,
        eDescription: examDescription || 'Đề thi đang được tạo...',
        eType: examType,
        eSkill: examSkill.toLowerCase() as 'listening' | 'reading' | 'writing' | 'speaking' | 'mixed',
        eDuration_minutes: duration,
        eIs_private: false,
        eSource_type: 'manual' as const
      };

      // Use teacherApi service instead of direct fetch
      const response = await teacherApi.exams.create(examData);
      console.log('🔍 API Response:', response);
      
      if (response.status === 'success' && response.data) {
        const newExamId = response.data.eId.toString();
        console.log('🔍 Setting currentExamId to:', newExamId);
        setCurrentExamId(newExamId);
        // Clear draft when successfully created
        clearLocalStorageDraft();
        return newExamId;
      } else {
        throw new Error(response.message || 'Failed to create draft exam');
      }
    } catch (error) {
      console.error('Error creating draft exam:', error);
      console.log('🔍 Error details:', error.response?.data || error.message);
      // Generate temporary local ID
      const tempId = 'temp_' + Date.now();
      console.log('🔍 Generated temp ID:', tempId);
      setCurrentExamId(tempId);
      return tempId;
    }
  };

  const generateAutoSaveKey = () => {
    return `exam-draft-${examType}-${examSkill}-${Date.now()}`;
  };

  const saveToLocalStorage = () => {
    try {
      const examData = {
        examType,
        examSkill,
        examTitle,
        examDescription,
        duration,
        durationUnit,
        questions,
        vstepCurrentSkill,
        vstepCurrentPart,
        currentStep,
        timestamp: Date.now()
      };
      
      const key = `exam-draft-current`;
      localStorage.setItem(key, JSON.stringify(examData));
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const key = `exam-draft-current`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const examData = JSON.parse(saved);
        // Only restore if less than 24 hours old
        if (Date.now() - examData.timestamp < 24 * 60 * 60 * 1000) {
          return examData;
        }
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return null;
  };

  const clearLocalStorageDraft = () => {
    try {
      localStorage.removeItem('exam-draft-current');
      setDraftPromptShown(false); // Reset để có thể hỏi lại nếu có draft mới
    } catch (error) {
      console.error('Failed to clear localStorage draft:', error);
    }
  };

  const saveToServer = async (isDraft = true) => {
    setAutoSaveStatus('saving');
    try {
      const examData = {
        eTitle: examTitle,
        eDescription: examDescription,
        eType: examType,
        eSkill: examSkill.toLowerCase() as 'listening' | 'reading' | 'writing' | 'speaking' | 'mixed',
        eDuration_minutes: duration,
        eIs_private: false,
        eSource_type: 'manual' as const
      };

      let result;
      if (currentExamId && !currentExamId.startsWith('temp_')) {
        // Update existing exam
        result = await teacherApi.exams.update(parseInt(currentExamId), examData);
      } else {
        // Create new exam
        result = await teacherApi.exams.create(examData);
        // If this was a new exam, store the ID
        if (result.status === 'success' && result.data?.eId) {
          setCurrentExamId(result.data.eId.toString());
        }
      }

      if (result.status === 'success') {
        setAutoSaveStatus('saved');
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        return result;
      } else {
        throw new Error(result.message || 'Server save failed');
      }
    } catch (error) {
      console.error('Auto-save to server failed:', error);
      // Fallback to localStorage
      if (saveToLocalStorage()) {
        setAutoSaveStatus('saved');
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      } else {
        setAutoSaveStatus('error');
      }
    }
  };

  // Auto-save effect with debounce
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      // Save draft if user has made any selection (type, skill, title, etc.)
      if (hasUnsavedChanges && (examType || examSkill || examTitle || examDescription || questions.length > 0)) {
        saveToLocalStorage();
        if (navigator.onLine) {
          saveToServer(true);
        }
      }
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [examTitle, examDescription, questions, examType, examSkill, duration, hasUnsavedChanges]);

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(true);
    setAutoSaveStatus('idle');
  }, [examTitle, examDescription, questions, examType, examSkill, duration, durationUnit]);

  // Load draft on component mount or load existing exam
  useEffect(() => {
    const loadExam = async () => {
      if (examId) {
        // Load existing exam
        try {
          const response = await teacherApi.exams.getById(parseInt(examId));
          
          if (response.status === 'success' && response.data) {
            const exam = response.data;
            // Load exam data
            setExamType(exam.eType as ExamType);
            setExamSkill(exam.eSkill.charAt(0).toUpperCase() + exam.eSkill.slice(1) as ExamSkill);
            setExamTitle(exam.eTitle);
            setExamDescription(exam.eDescription);
            setDuration(exam.eDuration_minutes);
            setDurationUnit('minutes'); // Backend only stores minutes
            setQuestions((exam.questions || []) as unknown as Question[]);
            
            // Set default values for VSTEP metadata since backend doesn't store these
            setVstepCurrentSkill('listening');
            setVstepCurrentPart(1);
            setCurrentStep(2);
            
            setCurrentExamId(examId);
            setHasUnsavedChanges(false);
            setLastSaved(exam.updated_at ? new Date(exam.updated_at) : new Date());
          }
        } catch (error) {
          console.error('Failed to load exam:', error);
        }
      } else {
        // Check for local draft only once
        if (!draftPromptShown) {
          const savedDraft = loadFromLocalStorage();
          
          // Only show prompt if draft has meaningful content
          const hasMeaningfulContent = savedDraft && (
            savedDraft.examTitle?.trim() || 
            savedDraft.examDescription?.trim() || 
            (savedDraft.questions && savedDraft.questions.length > 0 && 
             savedDraft.questions.some((q: Question) => q.content?.trim() || q.audioUrl))
          );
          
          if (hasMeaningfulContent) {
            setDraftPromptShown(true);
            if (window.confirm('Có bản nháp đã lưu. Bạn có muốn khôi phục không?')) {
              setExamType(savedDraft.examType);
              setExamSkill(savedDraft.examSkill);
              setExamTitle(savedDraft.examTitle);
              setExamDescription(savedDraft.examDescription);
              setDuration(savedDraft.duration);
              setDurationUnit(savedDraft.durationUnit);
              setQuestions(savedDraft.questions);
              setVstepCurrentSkill(savedDraft.vstepCurrentSkill);
              setVstepCurrentPart(savedDraft.vstepCurrentPart);
              setCurrentStep(savedDraft.currentStep);
              setHasUnsavedChanges(false);
              setLastSaved(new Date(savedDraft.timestamp));
            } else {
              // User declined, clear the draft
              clearLocalStorageDraft();
            }
          } else if (savedDraft) {
            // Draft exists but has no meaningful content, clear it silently
            clearLocalStorageDraft();
          }
        }
      }
    };

    loadExam();
  }, [examId, draftPromptShown]);

  // Clear draft when successfully published
  const handleSuccessfulPublish = () => {
    clearLocalStorageDraft();
    setHasUnsavedChanges(false);
    setAutoSaveStatus('saved');
  };

  // Prevent accidental page close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời khỏi trang?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // VSTEP: Render question editor
  const renderVSTEPQuestionEditor = (question: Question) => {
    const skillData = VSTEP_STRUCTURE[question.skill as keyof typeof VSTEP_STRUCTURE];
    const partData = skillData?.parts.find((p) => p.part === question.part);
    
    // Skill-based colors
    const questionColors = {
      listening: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-500', text: 'text-blue-700' },
      reading: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-500', text: 'text-green-700' },
      writing: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-500', text: 'text-orange-700' },
      speaking: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-500', text: 'text-purple-700' },
    };
    const colors = questionColors[question.skill as keyof typeof questionColors];

    return (
      <div 
        key={question.id} 
        id={`vstep-question-${question.skill}-${question.part}-q${question.questionNumber}`}
        className={`bg-white rounded-2xl border-2 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden ${
          vstepActiveQuestionNumber === question.questionNumber ? 'border-blue-400 shadow-blue-100' : 'border-gray-100'
        }`}
      >
        {/* Question Header */}
        <div className={`${colors.bg} ${colors.border} border-b-2 px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${colors.badge} text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md`}>
                {question.questionNumber}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Câu {question.questionNumber}
                </div>
                <div className={`text-xs ${colors.text} font-medium`}>
                  {skillData?.icon} {skillData?.name} - Part {question.part}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/80 rounded-lg text-xs font-semibold text-gray-600">
                {question.points || 1} điểm
              </span>
            </div>
          </div>
        </div>

        {/* Question Body */}
        <div className="p-4 space-y-4">
          {/* Question Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ❓ Nội dung câu hỏi
            </label>
            <textarea
              value={question.content}
              onChange={(e) => updateVSTEPQuestion(question.id, { content: e.target.value })}
              placeholder={`Nhập nội dung câu hỏi ${question.questionNumber}...`}
              className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] transition-all"
              rows={3}
            />
          </div>

          {/* Listening: Audio + Transcript */}
          {question.skill === "listening" && (
            <div className="space-y-3 bg-blue-50/50 rounded-lg p-4 border border-blue-100">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Volume2 className="w-4 h-4 inline mr-1" />
                  🎵 File Audio cho câu hỏi {question.questionNumber}
                </label>
                
                {/* Audio Upload Section */}
                <div className="space-y-3">
                  {/* Upload File Option */}
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center w-full h-12 border-2 border-dashed border-blue-300 rounded-xl bg-white hover:bg-blue-50 transition-all">
                        <input
                          type="file"
                          accept="audio/mp3,audio/wav,audio/m4a,audio/aac,audio/ogg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleAudioUpload(question.id, file);
                          }}
                          className="hidden"
                        />
                        <div className="flex items-center gap-2 text-blue-600">
                          {audioUploading[question.id] ? (
                            <>
                              <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                              <span className="text-sm font-medium">Đang upload...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5" />
                              <span className="text-sm font-medium">Upload file audio</span>
                            </>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Hỗ trợ: MP3, WAV, M4A, AAC, OGG • Tối đa 50MB
                  </p>
                  
                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">HOẶC</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>
                  
                  {/* URL Input Option */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Nhập link audio từ internet:</label>
                    <input
                      type="text"
                      value={question.audioUrl || ""}
                      onChange={(e) => updateVSTEPQuestion(question.id, { audioUrl: e.target.value })}
                      placeholder="https://example.com/audio.mp3"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Audio Preview */}
                {question.audioUrl && (
                  <div className="mt-4 p-4 bg-white rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-700">Preview Audio</span>
                      </div>
                      {question.audioFileName && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          📂 {question.audioFileName}
                        </span>
                      )}
                    </div>
                    <audio 
                      controls 
                      className="w-full h-10 rounded"
                      preload="metadata"
                      crossOrigin="anonymous"
                    >
                      <source src={question.audioUrl} type="audio/mpeg" />
                      <source src={question.audioUrl} type="audio/wav" />
                      <source src={question.audioUrl} type="audio/mp4" />
                      Trình duyệt không hỗ trợ audio player
                    </audio>
                    {!question.audioFileName && (
                      <p className="text-xs text-gray-500 mt-2 break-all">
                        🔗 {question.audioUrl.length > 60 ? question.audioUrl.substring(0, 60) + '...' : question.audioUrl}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 pt-2 border-t">
                      <button 
                        onClick={() => updateVSTEPQuestion(question.id, { audioUrl: '', audioFileName: '' })}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        🗑️ Xóa audio
                      </button>
                      <span className="text-xs text-gray-500">
                        ✅ Audio đã sẵn sàng cho học viên nghe
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  📝 Transcript (chỉ GV xem)
                </label>
                <textarea
                  value={question.transcript || ""}
                  onChange={(e) => updateVSTEPQuestion(question.id, { transcript: e.target.value })}
                  placeholder="Nhập nội dung transcript để GV tham khảo khi chấm bài..."
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[60px] transition-all font-mono"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Transcript giúp GV kiểm tra nội dung audio và hỗ trợ học viên khuyết tật
                </p>
              </div>
            </div>
          )}

          {/* Reading: Passage (only for first question) */}
          {question.skill === "reading" && question.id.includes("-q1") && (
            <div className="bg-green-50/50 rounded-xl p-5 border border-green-100">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-1" />
                📄 Passage {question.part} ({(partData as any)?.wordCount?.[0]}-{(partData as any)?.wordCount?.[1]} từ)
              </label>
              <textarea
                value={question.passage || ""}
                onChange={(e) => {
                  const partQuestions = questions.filter((q) => q.skill === "reading" && q.part === question.part);
                  partQuestions.forEach((pq) => updateVSTEPQuestion(pq.id, { passage: e.target.value }));
                }}
                placeholder={`Nhập văn bản đọc cho Part ${question.part}...`}
                className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[150px] font-serif leading-relaxed transition-all"
                rows={8}
              />
              <p className="text-xs text-green-700 mt-2 font-medium bg-green-100 rounded-lg px-3 py-1.5 inline-block">
                ✓ Văn bản này sẽ áp dụng cho tất cả {partData?.questions} câu hỏi trong Part {question.part}
              </p>
            </div>
          )}

          {/* Multiple Choice Answers */}
          {(question.skill === "listening" || question.skill === "reading") && question.answers && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                ✅ Đáp án (chọn 1 đáp án đúng):
              </label>
              {question.answers.map((answer, idx) => (
                <div key={answer.id} className="flex items-center gap-3 group">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                    answer.isCorrect 
                      ? `${colors.badge} text-white shadow-md` 
                      : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={answer.isCorrect}
                      onChange={() => setVSTEPCorrectAnswer(question.id, answer.id)}
                      className="hidden"
                    />
                    <span className="font-bold text-sm cursor-pointer" onClick={() => setVSTEPCorrectAnswer(question.id, answer.id)}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={answer.text}
                    onChange={(e) => updateVSTEPAnswer(question.id, answer.id, e.target.value)}
                    placeholder={`Nhập đáp án ${String.fromCharCode(65 + idx)}...`}
                    className={`flex-1 px-3 py-2 text-sm border-2 rounded-lg transition-all ${
                      answer.isCorrect 
                        ? `${colors.border} bg-${question.skill}-50/30 focus:ring-2 focus:ring-${question.skill}-500` 
                        : 'border-gray-200 focus:ring-2 focus:ring-gray-300'
                    }`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Writing: Min words */}
          {question.skill === "writing" && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-orange-900 mb-1">
                    ✍️ Yêu cầu tối thiểu: <span className="text-lg">{question.minWords} từ</span>
                  </p>
                  <p className="text-xs text-orange-700">Học viên sẽ tự viết bài. Giáo viên chấm điểm thủ công sau khi học viên nộp bài.</p>
                </div>
              </div>
            </div>
          )}

          {/* Speaking */}
          {question.skill === "speaking" && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-purple-900 mb-1">
                    🎤 Bài thi Speaking - Ghi âm trả lời
                  </p>
                  <p className="text-xs text-purple-700">Học viên sẽ ghi âm câu trả lời. Giáo viên nghe và chấm điểm thủ công sau khi học viên nộp bài.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/giao-vien/de-thi/tat-ca"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Tạo đề thi mới</h1>
                {/* Auto-save Status */}
                <div className="flex items-center gap-2">
                  {autoSaveStatus === 'saving' && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <span>Đang lưu...</span>
                    </div>
                  )}
                  {autoSaveStatus === 'saved' && lastSaved && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Đã lưu {new Date(lastSaved).toLocaleTimeString('vi-VN')}</span>
                    </div>
                  )}
                  {autoSaveStatus === 'error' && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.76 0L4.054 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span>Lỗi lưu</span>
                    </div>
                  )}
                  {hasUnsavedChanges && autoSaveStatus === 'idle' && (
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Có thay đổi chưa lưu</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link to="/giao-vien" className="hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <span>/</span>
                <Link to="/giao-vien/de-thi/tat-ca" className="hover:text-blue-600 transition-colors">
                  Ngân hàng đề
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">Tạo đề mới</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Manual Save Button */}
              <button
                onClick={() => saveToServer(true)}
                disabled={autoSaveStatus === 'saving'}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
              >
                <Save className="w-4 h-4" />
                {autoSaveStatus === 'saving' ? 'Đang lưu...' : 'Lưu nháp'}
              </button>
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 font-medium"
              >
                <Save className="w-4 h-4" />
                Lưu nháp
              </button>
            </div>
          </div>

          {/* Progress Indicator - Hide in VSTEP mode Step 2 */}
          {!(isVSTEPMode && currentStep === 2) && (
            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3].map((step, idx) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                        currentStep === step
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                          : currentStep > step
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {currentStep > step ? <CheckCircle2 className="w-5 h-5" /> : step}
                    </div>
                    <div className="text-left">
                      <p
                        className={`text-sm font-semibold ${currentStep === step ? "text-blue-600" : "text-gray-600"}`}
                      >
                        Bước {step}
                      </p>
                      <p className="text-xs text-gray-500">
                        {step === 1 && "Thông tin cơ bản"}
                        {step === 2 && "Thêm câu hỏi"}
                        {step === 3 && "Xem trước & Xuất bản"}
                      </p>
                    </div>
                  </div>
                  {step < 3 && (
                    <ChevronRight
                      className={`w-5 h-5 ${currentStep > step ? "text-green-600" : "text-gray-300"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Step Content */}
      <div className="px-8 py-6">
        {/* STEP 1: Basic Info */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Exam Type */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Loại đề thi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {examTypeData.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setExamType(type.value as ExamType)}
                    className={`p-6 border-2 rounded-xl text-left transition-all ${
                      examType === type.value
                        ? "border-blue-600 bg-blue-50 shadow-lg"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <div className="text-4xl mb-3">{type.icon}</div>
                    <h4 className="font-bold text-gray-900 mb-1">{type.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {type.duration}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Skill */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Kỹ năng bài thi</h3>
              <p className="text-sm text-gray-600 mb-4">
                VSTEP full test nên chọn <span className="font-semibold text-violet-700">Full 4 kỹ năng</span>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {skillData.map((skill) => (
                  <button
                    key={skill.value}
                    onClick={() => setExamSkill(skill.value as ExamSkill)}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      examSkill === skill.value
                        ? ("colorClass" in skill ? skill.colorClass : `border-${skill.color}-600 bg-${skill.color}-50 shadow-lg`)
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-3xl mb-2">{skill.icon}</div>
                    <p className="font-semibold text-gray-900">{skill.name}</p>
                    {"description" in skill && (
                      <p className="mt-1 text-xs text-gray-600">{skill.description}</p>
                    )}
                  </button>
                ))}
              </div>

              {examSkill === "Mixed" && (
                <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50 p-4">
                  <p className="text-sm font-bold text-violet-800">Format VSTEP Full 4 kỹ năng</p>
                  <p className="mt-1 text-xs text-violet-700">
                    Listening 40' • Reading 60' • Writing 60' • Speaking 12' (~172-180 phút)
                  </p>
                </div>
              )}
            </div>

            {/* Exam Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Thông tin đề thi</h3>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên đề thi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="VD: VSTEP B2 Listening - Practice Test 1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={255}
                />
                <p className="text-xs text-gray-500 mt-1">{examTitle.length}/255 ký tự</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  value={examDescription}
                  onChange={(e) => setExamDescription(e.target.value)}
                  rows={4}
                  placeholder="Mô tả chi tiết về đề thi..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thời gian làm bài <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                    min={1}
                    className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value as "minutes" | "hours")}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="minutes">Phút</option>
                    <option value="hours">Giờ</option>
                  </select>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Độ khó</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="easy">Dễ</option>
                  <option value="medium">Trung bình</option>
                  <option value="hard">Khó</option>
                  <option value="expert">Rất khó</option>
                </select>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Cài đặt</h3>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Hiển thị
                </label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:bg-gray-50">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === "public"}
                      onChange={() => setVisibility("public")}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-semibold text-gray-900">
                        <Globe className="w-5 h-5 text-blue-600" />
                        Public
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Hiển thị cho tất cả giáo viên trong hệ thống
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:bg-gray-50">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === "private"}
                      onChange={() => setVisibility("private")}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-semibold text-gray-900">
                        <Lock className="w-5 h-5 text-gray-600" />
                        Private
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Chỉ mình tôi có thể xem và sử dụng</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Allow Preview */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="allowPreview"
                  checked={allowPreview}
                  onChange={(e) => setAllowPreview(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="allowPreview" className="flex-1 cursor-pointer">
                  <p className="font-semibold text-gray-900">Cho phép xem trước</p>
                  <p className="text-sm text-gray-600">
                    Học sinh có thể xem trước đề thi trước khi bắt đầu làm bài
                  </p>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Link
                to="/giao-vien/de-thi/tat-ca"
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Hủy
              </Link>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveDraft}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Lưu nháp
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!canProceedStep1}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
                    canProceedStep1
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Tiếp tục
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Add Questions */}
        {currentStep === 2 && !isVSTEPMode && (
          <div className="flex gap-6">
            {/* Template Guide - Show when no questions */}
            {questions.length === 0 && (
              <div className="flex-1">
                <TemplateGuide />
              </div>
            )}
            
            {/* Left Panel: Question List */}
            <div className={`${questions.length === 0 ? 'hidden' : 'w-80'} bg-white rounded-xl border border-gray-200 p-4 space-y-4 h-fit sticky top-6`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Danh sách câu hỏi</h3>
                <button
                  onClick={() => setIsAddingQuestion(true)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    onClick={() => setSelectedQuestion(question)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedQuestion?.id === question.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-gray-900">Câu {index + 1}</span>
                          <span className="text-xs text-gray-600">{question.points} điểm</span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {question.content || "Chưa có nội dung"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {questionTypes.find((t) => t.value === question.type)?.label}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(question.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng câu hỏi:</span>
                    <span className="font-semibold text-gray-900">{totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng điểm:</span>
                    <span className="font-semibold text-gray-900">{totalPoints}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Question Editor */}
            <div className="flex-1 space-y-6">
              {!selectedQuestion && !isAddingQuestion && (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <HelpCircle className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Thêm câu hỏi đầu tiên</h3>
                    <p className="text-gray-600">
                      Bắt đầu xây dựng đề thi bằng cách thêm câu hỏi. Chọn loại câu hỏi phù hợp từ
                      menu bên dưới.
                    </p>
                    <button
                      onClick={() => setIsAddingQuestion(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm câu hỏi
                    </button>
                  </div>
                </div>
              )}

              {isAddingQuestion && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Chọn loại câu hỏi</h3>
                    <button
                      onClick={() => setIsAddingQuestion(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {questionTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          onClick={() => handleAddQuestion(type.value as QuestionType)}
                          className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
                        >
                          <Icon className="w-6 h-6 text-blue-600 mb-2" />
                          <p className="font-semibold text-gray-900">{type.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedQuestion && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                      Câu hỏi {questions.findIndex((q) => q.id === selectedQuestion.id) + 1}
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                      {questionTypes.find((t) => t.value === selectedQuestion.type)?.label}
                    </span>
                  </div>

                  {/* Question Content */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nội dung câu hỏi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Nhập nội dung câu hỏi..."
                      value={selectedQuestion.content}
                      onChange={(e) =>
                        updateQuestionInState(selectedQuestion.id, (question) => ({
                          ...question,
                          content: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm flex items-center gap-1">
                        <ImageIcon className="w-4 h-4" />
                        Hình ảnh
                      </button>
                      {(selectedQuestion.type === "listening" ||
                        selectedQuestion.type === "speaking") && (
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm flex items-center gap-1">
                          <Volume2 className="w-4 h-4" />
                          Audio
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Points */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Điểm</label>
                    <input
                      type="number"
                      value={selectedQuestion.points}
                      onChange={(e) =>
                        updateQuestionInState(selectedQuestion.id, (question) => ({
                          ...question,
                          points: parseInt(e.target.value || "0", 10) || 0,
                        }))
                      }
                      min={1}
                      className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Answers Section */}
                  {(selectedQuestion.type === "multiple-choice" ||
                    selectedQuestion.type === "true-false") && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-semibold text-gray-700">Đáp án</label>
                        {selectedQuestion.type === "multiple-choice" && (
                          <button
                            onClick={() =>
                              updateQuestionInState(selectedQuestion.id, (question) => ({
                                ...question,
                                answers: [
                                  ...(question.answers || []),
                                  { id: `a-${Date.now()}`, text: "", isCorrect: false },
                                ],
                              }))
                            }
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            + Thêm đáp án
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {selectedQuestion.type === "true-false" ? (
                          <>
                            <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300">
                              <input
                                type="radio"
                                name="answer"
                                checked={
                                  selectedQuestion.answers?.find((a) => a.text === "Đúng")?.isCorrect === true
                                }
                                onChange={() =>
                                  updateQuestionInState(selectedQuestion.id, (question) => ({
                                    ...question,
                                    answers: [
                                      { id: "a-true", text: "Đúng", isCorrect: true },
                                      { id: "a-false", text: "Sai", isCorrect: false },
                                    ],
                                  }))
                                }
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="font-medium text-gray-900">Đúng</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300">
                              <input
                                type="radio"
                                name="answer"
                                checked={
                                  selectedQuestion.answers?.find((a) => a.text === "Sai")?.isCorrect === true
                                }
                                onChange={() =>
                                  updateQuestionInState(selectedQuestion.id, (question) => ({
                                    ...question,
                                    answers: [
                                      { id: "a-true", text: "Đúng", isCorrect: false },
                                      { id: "a-false", text: "Sai", isCorrect: true },
                                    ],
                                  }))
                                }
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="font-medium text-gray-900">Sai</span>
                            </label>
                          </>
                        ) : (
                          selectedQuestion.answers?.map((answer, index) => (
                            <div
                              key={answer.id}
                              className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg"
                            >
                              <input
                                type="radio"
                                name="correct-answer"
                                checked={answer.isCorrect}
                                onChange={() =>
                                  updateQuestionInState(selectedQuestion.id, (question) => ({
                                    ...question,
                                    answers: (question.answers || []).map((candidate) => ({
                                      ...candidate,
                                      isCorrect: candidate.id === answer.id,
                                    })),
                                  }))
                                }
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <input
                                type="text"
                                placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                                value={answer.text}
                                onChange={(e) =>
                                  updateQuestionInState(selectedQuestion.id, (question) => ({
                                    ...question,
                                    answers: (question.answers || []).map((candidate) =>
                                      candidate.id === answer.id
                                        ? { ...candidate, text: e.target.value }
                                        : candidate
                                    ),
                                  }))
                                }
                                className="flex-1 px-3 py-2 border-0 focus:outline-none"
                              />
                              <button
                                onClick={() =>
                                  updateQuestionInState(selectedQuestion.id, (question) => ({
                                    ...question,
                                    answers: (question.answers || []).filter(
                                      (candidate) => candidate.id !== answer.id
                                    ),
                                  }))
                                }
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedQuestion(null)}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      Hủy
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                      Lưu câu hỏi
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                      Lưu & Thêm tiếp
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!isAddingQuestion && (
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                  >
                    Quay lại
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveDraft}
                      className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                    >
                      Lưu nháp
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={!canProceedStep2}
                      className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
                        canProceedStep2
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Tiếp tục
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: VSTEP MODE - Special Layout */}
        {currentStep === 2 && isVSTEPMode && (
          <div className="fixed left-64 right-0 top-[180px] bottom-0 bg-gray-100 flex flex-col z-40">
            {/* Main Content Area with Sidebar */}
            <div className="flex-1 overflow-hidden flex">
              {/* Left: Main Content */}
              <div className="flex-1 overflow-y-auto p-6 pb-32">
                <div className="max-w-4xl mx-auto">
                  {/* Part Info Banner */}
                  {(() => {
                    const skillData = VSTEP_STRUCTURE[vstepCurrentSkill];
                    const partInfo = skillData.parts.find((p) => p.part === vstepCurrentPart);
                    const partProgress = vstepProgress.find((p) => p.skill === vstepCurrentSkill && p.part === vstepCurrentPart);
                    const progressPercent = partProgress ? Math.round((partProgress.completed / partProgress.total) * 100) : 0;
                    
                    // Skill colors
                    const skillColors = {
                      listening: { from: 'from-blue-500', to: 'to-blue-700', badge: 'bg-blue-100 text-blue-700' },
                      reading: { from: 'from-green-500', to: 'to-green-700', badge: 'bg-green-100 text-green-700' },
                      writing: { from: 'from-orange-500', to: 'to-orange-700', badge: 'bg-orange-100 text-orange-700' },
                      speaking: { from: 'from-purple-500', to: 'to-purple-700', badge: 'bg-purple-100 text-purple-700' },
                    };
                    const colors = skillColors[vstepCurrentSkill as keyof typeof skillColors];
                    
                    return (
                      <div className={`bg-gradient-to-r ${colors.from} ${colors.to} text-white rounded-xl p-5 mb-4 shadow-xl`}>
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-4xl">
                              {skillData.icon}
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold mb-1">
                                {skillData.name} - Part {vstepCurrentPart}
                              </h2>
                              <p className="text-white/80 text-lg">{partInfo?.name}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className={`${colors.badge} px-3 py-1 rounded-full text-xs font-semibold`}>
                                  ⏱ {skillData.duration} phút
                                </span>
                                <span className={`${colors.badge} px-3 py-1 rounded-full text-xs font-semibold`}>
                                  📝 {partInfo?.questions} câu
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white/20 backdrop-blur rounded-xl px-6 py-4 text-center min-w-[120px]">
                            <div className="text-xs opacity-90 mb-1">Tiến độ</div>
                            <div className="text-3xl font-bold">{partProgress?.completed}/{partProgress?.total}</div>
                            <div className="text-xs opacity-75 mt-1">{progressPercent}%</div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-white transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-3">
                          <p className="text-sm leading-relaxed">
                            💡 <strong>Hướng dẫn:</strong> {partInfo?.description}
                            {(partInfo as any)?.wordCount && (
                              <span className="ml-2">• Độ dài: {(partInfo as any).wordCount[0]}-{(partInfo as any).wordCount[1]} từ</span>
                            )}
                            {(partInfo as any)?.minWords && (
                              <span className="ml-2">• Tối thiểu: {(partInfo as any).minWords} từ</span>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Questions List */}
                  <div className="space-y-4">
                    {vstepCurrentPartQuestions.length === 0 ? (
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Không có câu hỏi</h3>
                        <p className="text-gray-600 mb-4">
                          Skill: {vstepCurrentSkill} | Part: {vstepCurrentPart}
                        </p>
                        <p className="text-sm text-gray-500">
                          Tổng số câu hỏi: {questions.length}
                        </p>
                        <button
                          onClick={() => {
                            console.log('🔍 Debug Info:', {
                              isVSTEPMode,
                              examType,
                              examSkill,
                              vstepCurrentSkill,
                              vstepCurrentPart,
                              totalQuestions: questions.length,
                              allQuestions: questions.map(q => ({ id: q.id, skill: q.skill, part: q.part }))
                            });
                          }}
                          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          🐛 Debug (xem Console)
                        </button>
                      </div>
                    ) : (
                      vstepCurrentPartQuestions.map(renderVSTEPQuestionEditor)
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Question Navigation Grid */}
              <div className="w-80 bg-white border-l-2 border-gray-200 shadow-xl overflow-y-auto">
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="font-bold text-gray-800 mb-1">📋 Điều hướng câu hỏi</h3>
                  <p className="text-xs text-gray-500">Part {vstepCurrentPart} - {VSTEP_STRUCTURE[vstepCurrentSkill].parts.find(p => p.part === vstepCurrentPart)?.questions} câu</p>
                </div>
                
                <div className="p-4">
                  {/* Question Grid */}
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {Array.from({ length: VSTEP_STRUCTURE[vstepCurrentSkill].parts.find(p => p.part === vstepCurrentPart)?.questions || 0 }, (_, i) => {
                      const questionNumber = i + 1;
                      const question = vstepCurrentPartQuestions.find(q => q.questionNumber === questionNumber);
                      const isCompleted = question && question.content.trim() && 
                        (vstepCurrentSkill === "writing" || vstepCurrentSkill === "speaking" || 
                         question.answers?.some(a => a.isCorrect && a.text.trim()));
                      const isActive = vstepActiveQuestionNumber === questionNumber;
                      
                      // Skill colors for grid buttons
                      const gridColors = {
                        listening: isActive ? 'bg-blue-500 text-white' : isCompleted ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 text-gray-600 border-gray-300',
                        reading: isActive ? 'bg-green-500 text-white' : isCompleted ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-600 border-gray-300',
                        writing: isActive ? 'bg-orange-500 text-white' : isCompleted ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-gray-100 text-gray-600 border-gray-300',
                        speaking: isActive ? 'bg-purple-500 text-white' : isCompleted ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-gray-100 text-gray-600 border-gray-300',
                      };
                      const buttonColor = gridColors[vstepCurrentSkill];
                      
                      return (
                        <button
                          key={questionNumber}
                          onClick={() => jumpToVSTEPQuestion(questionNumber)}
                          className={`relative w-12 h-12 rounded-lg border-2 font-semibold text-sm transition-all hover:shadow-md ${buttonColor}`}
                        >
                          {questionNumber}
                          {isCompleted && !isActive && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded ${vstepCurrentSkill === 'listening' ? 'bg-blue-500' : vstepCurrentSkill === 'reading' ? 'bg-green-500' : vstepCurrentSkill === 'writing' ? 'bg-orange-500' : 'bg-purple-500'}`}></div>
                      <span className="text-gray-600">Đang chọn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded border-2 ${vstepCurrentSkill === 'listening' ? 'bg-blue-100 border-blue-300' : vstepCurrentSkill === 'reading' ? 'bg-green-100 border-green-300' : vstepCurrentSkill === 'writing' ? 'bg-orange-100 border-orange-300' : 'bg-purple-100 border-purple-300'}`}></div>
                      <span className="text-gray-600">Đã hoàn thành</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded border-2 bg-gray-100 border-gray-300"></div>
                      <span className="text-gray-600">Chưa hoàn thành</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation - VSTEP Style */}
            <div className="fixed bottom-0 left-64 right-0 bg-white border-t-2 shadow-2xl z-50">
              {/* Part Tabs */}
              <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto">
                {Object.entries(VSTEP_STRUCTURE).map(([skill, skillData]) => {
                  // Skill-based colors
                  const skillTabColors = {
                    listening: { 
                      active: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200',
                      completed: 'bg-blue-50 text-blue-700 border-2 border-blue-200',
                      default: 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                    },
                    reading: { 
                      active: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200',
                      completed: 'bg-green-50 text-green-700 border-2 border-green-200',
                      default: 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200'
                    },
                    writing: { 
                      active: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200',
                      completed: 'bg-orange-50 text-orange-700 border-2 border-orange-200',
                      default: 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
                    },
                    speaking: { 
                      active: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200',
                      completed: 'bg-purple-50 text-purple-700 border-2 border-purple-200',
                      default: 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200'
                    },
                  };
                  const tabColors = skillTabColors[skill as keyof typeof skillTabColors];

                  return (
                    <div key={skill} className="flex items-center gap-2">
                      {/* Skill Divider */}
                      <div className="flex items-center gap-2 mr-1">
                        <span className="text-lg">{skillData.icon}</span>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {skillData.name}
                        </span>
                      </div>
                      
                      {skillData.parts.map((part) => {
                        const isActive = vstepCurrentSkill === skill && vstepCurrentPart === part.part;
                        const partProgress = vstepProgress.find((p) => p.skill === skill && p.part === part.part);
                        const isCompleted = partProgress && partProgress.completed === partProgress.total;

                        return (
                          <button
                            key={`${skill}-${part.part}`}
                            onClick={() => {
                              setVstepCurrentSkill(skill as any);
                              setVstepCurrentPart(part.part);
                              setVstepActiveQuestionNumber(1); // Reset to first question
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap relative ${
                              isActive
                                ? tabColors.active
                                : isCompleted
                                  ? tabColors.completed
                                  : tabColors.default
                            }`}
                          >
                            <span className="relative z-10">Part {part.part}</span>
                            {isCompleted && !isActive && (
                              <span className="absolute top-0 right-0 -mt-1 -mr-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                                ✓
                              </span>
                            )}
                          </button>
                        );
                    })}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between px-6 py-4 border-t-2 bg-gradient-to-r from-gray-50 to-gray-100">
                <button
                  onClick={() => setShowVstepMenu(!showVstepMenu)}
                  className="px-5 py-2.5 bg-white border-2 border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 flex items-center gap-2 transition-all shadow-sm hover:shadow"
                >
                  <Menu className="w-4 h-4" />
                  {showVstepMenu ? "Đóng menu" : "Menu tổng quan"}
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-white border-2 border-yellow-300 text-yellow-700 rounded-xl text-sm font-semibold hover:bg-yellow-50 hover:border-yellow-400 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    {isSaving ? "Đang lưu..." : "Lưu bản nháp"}
                  </button>
                  <button
                    onClick={goToNextVSTEPPart}
                    disabled={vstepCurrentPartIndex >= allVSTEPParts.length - 1}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
                  >
                    <span>Tiếp tục</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Side Menu */}
            {showVstepMenu && (
              <div className="fixed left-64 top-[180px] bottom-0 w-96 bg-gradient-to-br from-white to-gray-50 shadow-2xl z-50 overflow-y-auto border-r-2 border-gray-200">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">📋 Tổng quan</h3>
                      <p className="text-xs text-gray-500 mt-1">VSTEP Full Test - 4 Kỹ năng</p>
                    </div>
                    <button 
                      onClick={() => setShowVstepMenu(false)} 
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Overall Progress */}
                  <div className="mb-6 p-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-sm opacity-90">Tiến độ hoàn thành</h4>
                      <span className="text-2xl">📊</span>
                    </div>
                    <p className="text-4xl font-bold mb-2">
                      {vstepProgress.reduce((sum, p) => sum + p.completed, 0)}<span className="text-xl opacity-75">/80</span>
                    </p>
                    <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-500"
                        style={{ width: `${(vstepProgress.reduce((sum, p) => sum + p.completed, 0) / 80) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs mt-2 opacity-90">
                      {Math.round((vstepProgress.reduce((sum, p) => sum + p.completed, 0) / 80) * 100)}% hoàn thành
                    </p>
                  </div>

                  {/* Skills Navigation */}
                  <div className="space-y-4">
                    {Object.entries(VSTEP_STRUCTURE).map(([skill, skillData]) => {
                      const skillColors = {
                        listening: { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
                        reading: { gradient: 'from-green-500 to-green-600', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
                        writing: { gradient: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
                        speaking: { gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
                      };
                      const colors = skillColors[skill as keyof typeof skillColors];
                      const skillProgress = vstepProgress.filter(p => p.skill === skill);
                      const skillCompleted = skillProgress.reduce((sum, p) => sum + p.completed, 0);
                      const skillTotal = skillProgress.reduce((sum, p) => sum + p.total, 0);
                      
                      return (
                        <div key={skill} className={`border-2 ${colors.border} rounded-2xl overflow-hidden shadow-sm`}>
                          <div className={`bg-gradient-to-r ${colors.gradient} text-white p-4`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{skillData.icon}</span>
                                <div>
                                  <h4 className="font-bold">{skillData.name}</h4>
                                  <p className="text-xs opacity-90">⏱ {skillData.duration} phút</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold">{skillCompleted}<span className="text-sm opacity-75">/{skillTotal}</span></div>
                                <div className="text-xs opacity-90">{Math.round((skillCompleted/skillTotal)*100)}%</div>
                              </div>
                            </div>
                          </div>
                          <div className={`${colors.bg} p-3 space-y-2`}>
                            {skillData.parts.map((part) => {
                              const isActive = vstepCurrentSkill === skill && vstepCurrentPart === part.part;
                              const partProgress = vstepProgress.find((p) => p.skill === skill && p.part === part.part);
                              const isPartCompleted = partProgress && partProgress.completed === partProgress.total;
                              
                              return (
                                <button
                                  key={part.part}
                                  onClick={() => {
                                    setVstepCurrentSkill(skill as any);
                                    setVstepCurrentPart(part.part);
                                    setVstepActiveQuestionNumber(1); // Reset to first question
                                    setShowVstepMenu(false);
                                  }}
                                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                    isActive 
                                      ? `bg-gradient-to-r ${colors.gradient} text-white shadow-md` 
                                      : isPartCompleted
                                        ? 'bg-white border-2 border-green-300 text-gray-700 hover:border-green-400'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className={`font-bold ${isActive ? 'text-white' : colors.text}`}>
                                        Part {part.part}
                                      </span>
                                      <span className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                                        {part.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                        {partProgress?.completed}/{partProgress?.total}
                                      </span>
                                      {isPartCompleted && !isActive && (
                                        <span className="text-green-500 font-bold">✓</span>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Preview & Publish */}
        {currentStep === 3 && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Exam Summary */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-xl p-8 text-white shadow-2xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-3">{examTitle || "Đề thi chưa đặt tên"}</h2>
                  <p className="text-blue-100 mb-4">{examDescription}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg font-semibold">
                      {examType}
                    </span>
                    <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg font-semibold">
                      {getExamSkillLabel(examSkill)}
                    </span>
                    <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {duration} {durationUnit === "minutes" ? "phút" : "giờ"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-3 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-all">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-blue-100 text-sm mb-1">Câu hỏi</p>
                  <p className="text-3xl font-bold">{totalQuestions}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-blue-100 text-sm mb-1">Tổng điểm</p>
                  <p className="text-3xl font-bold">{totalPoints}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-blue-100 text-sm mb-1">Độ khó</p>
                  <p className="text-xl font-bold capitalize">{difficulty}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-blue-100 text-sm mb-1">Trạng thái</p>
                  <p className="text-xl font-bold">
                    {publishOption === "now" ? "Xuất bản" : "Nháp"}
                  </p>
                </div>
              </div>
            </div>

            {/* Questions Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Danh sách câu hỏi</h3>
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                          Câu {index + 1}
                        </span>
                        <span className="text-sm text-gray-600">
                          {questionTypes.find((t) => t.value === question.type)?.label}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {question.points} điểm
                      </span>
                    </div>
                    <p className="text-gray-700">{question.content || "Chưa có nội dung"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Publish Options */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Tùy chọn xuất bản</h3>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:bg-gray-50">
                  <input
                    type="radio"
                    name="publish"
                    checked={publishOption === "now"}
                    onChange={() => setPublishOption("now")}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Xuất bản ngay</p>
                    <p className="text-sm text-gray-600">Đề thi sẽ được xuất bản ngay lập tức</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:bg-gray-50">
                  <input
                    type="radio"
                    name="publish"
                    checked={publishOption === "draft"}
                    onChange={() => setPublishOption("draft")}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Lưu nháp</p>
                    <p className="text-sm text-gray-600">Lưu đề thi để chỉnh sửa sau</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:bg-gray-50">
                  <input
                    type="radio"
                    name="publish"
                    checked={publishOption === "schedule"}
                    onChange={() => setPublishOption("schedule")}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Lên lịch xuất bản</p>
                    <p className="text-sm text-gray-600 mb-3">Chọn ngày giờ xuất bản</p>
                    {publishOption === "schedule" && (
                      <div className="flex items-center gap-3">
                        <input
                          type="datetime-local"
                          value={scheduledAt}
                          onChange={(e) => setScheduledAt(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Notifications */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Thông báo</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyStudents}
                      onChange={(e) => setNotifyStudents(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Thông báo cho học sinh</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyTeachers}
                      onChange={(e) => setNotifyTeachers(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Thông báo cho giáo viên khác</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Gửi email thông báo</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevStep}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Quay lại
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Lưu nháp
                </button>
                <button
                  onClick={() => persistExam("publish")}
                  disabled={isSaving || !canSubmitExam}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-bold shadow-lg shadow-blue-500/50 flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Xuất bản đề thi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateExam;
