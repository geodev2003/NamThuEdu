import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { ExamPlayer } from '../../../../components/exam';

/**
 * Student Exam Page - Interactive Mode
 * Students can take exam with drag & drop, answer tracking, submit
 * URL: /hoc-vien/lam-bai/:examId
 */
export function TakeExam() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (answers: any, uploadedImages: any) => {
    console.log('🎉 Student submitted exam!');
    console.log('Answers:', answers);
    console.log('Uploaded images:', uploadedImages);
    
    // TODO: Call API to submit exam
    // await submitExam(examId, answers, uploadedImages);
    
    // Navigate to results or dashboard
    setTimeout(() => {
      navigate('/hoc-vien/dashboard');
    }, 2000);
  };

  if (!examId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-xl text-gray-600 mb-4 font-medium">Exam ID not found</p>
          <button
            onClick={() => navigate('/hoc-vien/dashboard')}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all inline-flex items-center gap-2 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <ExamPlayer
      examId={parseInt(examId)}
      mode="student"
      showHeader={true}
      showTimer={true}
      allowInteraction={true}
      onSubmit={handleSubmit}
    />
  );
}
