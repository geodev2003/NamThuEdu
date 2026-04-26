import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, BookOpen, Clock, Target } from "lucide-react";
import { api } from "../../../../services/api";

interface Question {
  qId: number;
  qContent: string;
  qPassage_text: string;
  qPart: number;
  qOrder: number;
  answers: Array<{
    aId: number;
    aContent: string;
    aIs_correct: boolean;
  }>;
}

interface Exam {
  eId: number;
  eTitle: string;
  eDescription: string;
  eType: string;
  eSkill: string;
  eDuration_minutes: number;
  eTotal_score: string;
  eDifficulty: string;
  questions: Question[];
}

export function VstepExamPreview() {
  const { examId } = useParams();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExam();
  }, [examId]);

  const loadExam = async () => {
    try {
      setLoading(true);
      
      // Use test endpoint (no auth required)
      const { data } = await api.get(`/test/exams/${examId}`);
      
      // Transform the response to match our interface
      const examData = data.exam || data.data || data;
      
      // Map the fields from TestExamController format to our format
      const transformedExam = {
        eId: examData.id,
        eTitle: examData.title,
        eDescription: examData.description,
        eType: examData.type,
        eSkill: examData.skill,
        eDuration_minutes: examData.duration,
        eTotal_score: examData.questions?.length || 0,
        eDifficulty: 'medium',
        questions: examData.questions?.map((q: any) => ({
          qId: q.id,
          qContent: q.text,
          qPassage_text: q.passage || '',
          qPart: q.part,
          qOrder: q.order,
          answers: q.answers?.map((a: any) => ({
            aId: a.id,
            aContent: a.text,
            aIs_correct: a.isCorrect,
          })) || [],
        })) || [],
      };
      
      setExam(transformedExam);
    } catch (err: any) {
      console.error('Failed to load exam:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải đề thi...</p>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Không thể tải đề thi: {error}</p>
          <Link to="/giao-vien/de-thi/tat-ca" className="text-orange-600 hover:underline">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const passage = exam.questions[0]?.qPassage_text || "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/giao-vien/de-thi/tat-ca"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{exam.eTitle}</h1>
              <p className="text-sm text-gray-600 mt-1">{exam.eDescription}</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{exam.eDuration_minutes} phút</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Target className="w-4 h-4" />
                <span>{exam.questions.length} câu hỏi</span>
              </div>
              <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                {exam.eType} - {exam.eSkill}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Left: Passage */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sticky top-8 h-fit">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <BookOpen className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Reading Passage</h2>
            </div>
            <div className="prose prose-sm max-w-none">
              {passage.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Right: Questions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Questions</h2>
              <div className="space-y-8">
                {exam.questions.map((question, idx) => (
                  <div key={question.qId} className="pb-6 border-b border-gray-200 last:border-0">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-gray-900 font-medium flex-1">{question.qContent}</p>
                    </div>
                    <div className="ml-11 space-y-2">
                      {question.answers.map((answer, ansIdx) => (
                        <div
                          key={answer.aId}
                          className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                            answer.aIs_correct
                              ? 'bg-green-50 border-2 border-green-500'
                              : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            answer.aIs_correct
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + ansIdx)}
                          </div>
                          <span className={`text-sm ${answer.aIs_correct ? 'text-green-900 font-semibold' : 'text-gray-700'}`}>
                            {answer.aContent}
                          </span>
                          {answer.aIs_correct && (
                            <span className="ml-auto text-xs text-green-600 font-semibold">✓ Đúng</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
