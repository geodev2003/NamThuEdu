import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherApi } from '@/services/teacherApi';

interface Answer {
  aContent: string;
  aIs_correct: boolean;
}

interface Question {
  qContent: string;
  qPoints: number;
  qType: string;
  qDifficulty: string;
  answers: Answer[];
}

interface ExamForm {
  eTitle: string;
  eType: string;
  eSkill: string;
  eDuration_minutes: number;
  eDifficulty: string;
  eDescription: string;
  questions: Question[];
}

export const CreateExamManual: React.FC = () => {
  const navigate = useNavigate();
  
  const [exam, setExam] = useState<ExamForm>({
    eTitle: '',
    eType: 'GENERAL',
    eSkill: 'reading',
    eDuration_minutes: 60,
    eDifficulty: 'medium',
    eDescription: '',
    questions: []
  });
  
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    qContent: '',
    qPoints: 1,
    qType: 'multiple_choice',
    qDifficulty: 'medium',
    answers: [
      { aContent: '', aIs_correct: false },
      { aContent: '', aIs_correct: false },
      { aContent: '', aIs_correct: false },
      { aContent: '', aIs_correct: false }
    ]
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddQuestion = () => {
    if (!currentQuestion.qContent.trim()) {
      setError('Vui lòng nhập nội dung câu hỏi');
      return;
    }
    
    const hasCorrectAnswer = currentQuestion.answers.some(a => a.aIs_correct && a.aContent.trim());
    if (!hasCorrectAnswer) {
      setError('Vui lòng chọn ít nhất 1 đáp án đúng');
      return;
    }
    
    const validAnswers = currentQuestion.answers.filter(a => a.aContent.trim());
    if (validAnswers.length < 2) {
      setError('Cần ít nhất 2 đáp án');
      return;
    }
    
    setExam({
      ...exam,
      questions: [...exam.questions, { ...currentQuestion, answers: validAnswers }]
    });
    
    // Reset form
    setCurrentQuestion({
      qContent: '',
      qPoints: 1,
      qType: 'multiple_choice',
      qDifficulty: 'medium',
      answers: [
        { aContent: '', aIs_correct: false },
        { aContent: '', aIs_correct: false },
        { aContent: '', aIs_correct: false },
        { aContent: '', aIs_correct: false }
      ]
    });
    
    setError(null);
  };

  const handleRemoveQuestion = (index: number) => {
    setExam({
      ...exam,
      questions: exam.questions.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async () => {
    if (!exam.eTitle.trim()) {
      setError('Vui lòng nhập tên đề thi');
      return;
    }
    
    if (exam.questions.length === 0) {
      setError('Vui lòng thêm ít nhất 1 câu hỏi');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await teacherApi.exams.importExam(exam);
      navigate(`/giao-vien/de-thi/${response.data.examId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tạo đề thi');
    } finally {
      setLoading(false);
    }
  };

  const totalPoints = exam.questions.reduce((sum, q) => sum + q.qPoints, 0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Tạo Đề Thi Thủ Công</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Exam Info */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Thông Tin Đề Thi</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên đề thi *</label>
              <input
                type="text"
                value={exam.eTitle}
                onChange={(e) => setExam({ ...exam, eTitle: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="VD: Đề thi VSTEP Reading 2024"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Loại đề</label>
              <select
                value={exam.eType}
                onChange={(e) => setExam({ ...exam, eType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="GENERAL">General</option>
                <option value="VSTEP">VSTEP</option>
                <option value="IELTS">IELTS</option>
                <option value="TOEIC">TOEIC</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Kỹ năng</label>
              <select
                value={exam.eSkill}
                onChange={(e) => setExam({ ...exam, eSkill: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="reading">Reading</option>
                <option value="listening">Listening</option>
                <option value="writing">Writing</option>
                <option value="speaking">Speaking</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Thời gian (phút)</label>
              <input
                type="number"
                value={exam.eDuration_minutes}
                onChange={(e) => setExam({ ...exam, eDuration_minutes: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Độ khó</label>
              <select
                value={exam.eDifficulty}
                onChange={(e) => setExam({ ...exam, eDifficulty: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="easy">Dễ</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tổng điểm</label>
              <input
                type="text"
                value={totalPoints}
                disabled
                className="w-full px-3 py-2 border rounded-lg bg-gray-100"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea
              value={exam.eDescription}
              onChange={(e) => setExam({ ...exam, eDescription: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={2}
              placeholder="Mô tả ngắn về đề thi..."
            />
          </div>
        </div>

        {/* Add Question Form */}
        <div className="mb-8 p-4 border-2 border-blue-200 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Thêm Câu Hỏi Mới</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nội dung câu hỏi *</label>
            <textarea
              value={currentQuestion.qContent}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, qContent: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
              placeholder="Nhập nội dung câu hỏi..."
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Điểm</label>
              <input
                type="number"
                value={currentQuestion.qPoints}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, qPoints: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                min="0.5"
                step="0.5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Loại câu hỏi</label>
              <select
                value={currentQuestion.qType}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, qType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="multiple_choice">Trắc nghiệm</option>
                <option value="true_false">Đúng/Sai</option>
                <option value="fill_blank">Điền từ</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Độ khó</label>
              <select
                value={currentQuestion.qDifficulty}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, qDifficulty: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="easy">Dễ</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Đáp án *</label>
            {currentQuestion.answers.map((answer, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={answer.aIs_correct}
                  onChange={(e) => {
                    const newAnswers = [...currentQuestion.answers];
                    newAnswers[idx].aIs_correct = e.target.checked;
                    setCurrentQuestion({ ...currentQuestion, answers: newAnswers });
                  }}
                  className="mt-3"
                />
                <input
                  type="text"
                  value={answer.aContent}
                  onChange={(e) => {
                    const newAnswers = [...currentQuestion.answers];
                    newAnswers[idx].aContent = e.target.value;
                    setCurrentQuestion({ ...currentQuestion, answers: newAnswers });
                  }}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
                />
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-1">✓ = Đáp án đúng</p>
          </div>
          
          <button
            onClick={handleAddQuestion}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            ➕ Thêm Câu Hỏi
          </button>
        </div>

        {/* Questions List */}
        {exam.questions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">
              Danh Sách Câu Hỏi ({exam.questions.length} câu - {totalPoints} điểm)
            </h2>
            
            <div className="space-y-3">
              {exam.questions.map((q, idx) => (
                <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium">Câu {idx + 1}: {q.qContent}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Điểm: {q.qPoints} | Độ khó: {q.qDifficulty}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-red-600 hover:text-red-800 ml-4"
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    {q.answers.map((a, aidx) => (
                      <div key={aidx} className={`text-sm ${a.aIs_correct ? 'text-green-700 font-medium' : 'text-gray-700'}`}>
                        {a.aIs_correct ? '✓' : '○'} {String.fromCharCode(65 + aidx)}. {a.aContent}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading || exam.questions.length === 0}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang tạo...' : `✓ Tạo Đề Thi (${exam.questions.length} câu)`}
          </button>
          
          <button
            onClick={() => navigate('/giao-vien/de-thi')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};
