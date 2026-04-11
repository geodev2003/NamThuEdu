/**
 * Shared types for Exam Player
 * Used by both teacher preview and student exam pages
 */

export type ExamMode = 'preview' | 'student';

export interface Question {
  qId: number;
  qContent: string;
  qType: string;
  qPoints: number;
  qPart: number;
  qSubPart: number | null;
  kids_task_config: any;
}

export interface ExamData {
  eId: number;
  eTitle: string;
  eDescription: string;
  eDuration: number;
  questions: Question[];
}

export interface ExamPlayerProps {
  examId: number;
  mode: ExamMode;
  onSubmit?: (answers: any, uploadedImages: any) => void;
  showHeader?: boolean;
  showTimer?: boolean;
  allowInteraction?: boolean;
}

export interface QuestionRendererProps {
  question: Question;
  mode: ExamMode;
  answer?: any;
  onAnswer?: (value: any) => void;
  uploadedImages?: { [key: string]: File };
  onImageUpload?: (key: string, file: File) => void;
  imageRefs?: { [questionId: number]: HTMLImageElement | null };
  labelRefs?: { [key: string]: HTMLDivElement | null };
  onSetImageRef?: (questionId: number, el: HTMLImageElement | null) => void;
  onSetLabelRef?: (key: string, el: HTMLDivElement | null) => void;
  onResetQuestion?: (questionId: number) => void;
}

export interface TaskData {
  task_type?: string;
  task_data?: any;
  config?: any;
  instructions?: string;
  imageUrl?: string;
  image_url?: string;
  mainImage?: string;
  mainImageUrl?: string;
  sharedImageUrl?: string;
  shared_image_url?: string;
  audioUrl?: string;
  audio_url?: string;
  mainAudioUrl?: string;
  items?: any[];
  questions?: any[];
  wordBank?: any[];
  word_bank?: any[];
  story?: string;
  text?: string;
}
