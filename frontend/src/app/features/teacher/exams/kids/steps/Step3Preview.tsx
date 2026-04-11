import React from 'react';
import { ArrowLeft, CheckCircle, Clock, FileText, Award } from 'lucide-react';

interface Step3PreviewProps {
  examData: any;
  onBack: () => void;
  onPublish: () => void;
}

const Step3Preview: React.FC<Step3PreviewProps> = ({
  examData,
  onBack,
  onPublish,
}) => {
  const totalPoints = examData.questions.reduce(
    (sum: number, q: any) => sum + (q.points || 5),
    0
  );

  const getExamTypeName = (type: string) => {
    const names: Record<string, string> = {
      starters: 'Starters (Pre A1)',
      movers: 'Movers (A1)',
      flyers: 'Flyers (A2)',
    };
    return names[type] || type;
  };

  const groupQuestionsByType = () => {
    const groups: Record<string, any[]> = {
      listening: [],
      reading: [],
      speaking: [],
    };

    examData.questions.forEach((q: any) => {
      if (q.type?.includes('listen')) {
        groups.listening.push(q);
      } else if (q.type?.includes('speak') || q.type?.includes('mic')) {
        groups.speaking.push(q);
      } else {
        groups.reading.push(q);
      }
    });

    return groups;
  };

  const questionGroups = groupQuestionsByType();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 font-baloo text-3xl font-bold text-indigo-600">
          Bước 3: Xem Trước Đề Thi
        </h2>
        <p className="text-gray-600">
          Kiểm tra lại thông tin trước khi xuất bản
        </p>
      </div>

      {/* Exam Info Card */}
      <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6">
        <div className="mb-4 flex items-center space-x-2">
          <FileText className="h-6 w-6 text-indigo-600" />
          <h3 className="font-baloo text-2xl font-bold text-indigo-600">
            Thông Tin Đề Thi
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Tên đề thi
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {examData.title}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Cấp độ
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {getExamTypeName(examData.examType)}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Thời gian
            </label>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <p className="text-lg font-semibold text-gray-900">
                {examData.duration} phút
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Tổng câu hỏi
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {examData.questions.length} câu
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Tổng điểm
            </label>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <p className="text-lg font-semibold text-gray-900">
                {totalPoints} điểm
              </p>
            </div>
          </div>
        </div>

        {examData.description && (
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Mô tả
            </label>
            <p className="text-gray-700">{examData.description}</p>
          </div>
        )}
      </div>

      {/* Questions Summary */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-baloo text-2xl font-bold text-gray-800">
          Danh Sách Câu Hỏi
        </h3>

        <div className="space-y-6">
          {/* Listening Section */}
          {questionGroups.listening.length > 0 && (
            <div>
              <div className="mb-3 flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                  <span className="text-lg">🎧</span>
                </div>
                <h4 className="font-baloo text-xl font-bold text-indigo-600">
                  LISTENING
                </h4>
                <span className="text-sm text-gray-500">
                  ({questionGroups.listening.length} câu)
                </span>
              </div>
              <div className="space-y-2 pl-10">
                {questionGroups.listening.map((q: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-700">
                        Q{idx + 1}:
                      </span>
                      <span className="text-gray-900">{q.title}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {q.points || 5} điểm
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reading Section */}
          {questionGroups.reading.length > 0 && (
            <div>
              <div className="mb-3 flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                  <span className="text-lg">📖</span>
                </div>
                <h4 className="font-baloo text-xl font-bold text-orange-600">
                  READING & WRITING
                </h4>
                <span className="text-sm text-gray-500">
                  ({questionGroups.reading.length} câu)
                </span>
              </div>
              <div className="space-y-2 pl-10">
                {questionGroups.reading.map((q: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-700">
                        Q{questionGroups.listening.length + idx + 1}:
                      </span>
                      <span className="text-gray-900">{q.title}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {q.points || 5} điểm
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Speaking Section */}
          {questionGroups.speaking.length > 0 && (
            <div>
              <div className="mb-3 flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                  <span className="text-lg">🎤</span>
                </div>
                <h4 className="font-baloo text-xl font-bold text-purple-600">
                  SPEAKING
                </h4>
                <span className="text-sm text-gray-500">
                  ({questionGroups.speaking.length} câu)
                </span>
              </div>
              <div className="space-y-2 pl-10">
                {questionGroups.speaking.map((q: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-700">
                        Q
                        {questionGroups.listening.length +
                          questionGroups.reading.length +
                          idx +
                          1}
                        :
                      </span>
                      <span className="text-gray-900">{q.title}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {q.points || 5} điểm
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Message */}
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-600" />
          <div>
            <h4 className="mb-1 font-bold text-green-900">
              Đề thi đã sẵn sàng!
            </h4>
            <p className="text-sm text-green-700">
              Bạn có thể lưu nháp để chỉnh sửa sau hoặc xuất bản ngay để học
              sinh có thể làm bài.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 rounded-lg border border-gray-300 px-6 py-3 transition-colors hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Quay lại</span>
        </button>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              /* Save as draft */
            }}
            className="rounded-lg border border-gray-300 px-6 py-3 transition-colors hover:bg-gray-50"
          >
            Lưu nháp
          </button>
          <button
            onClick={onPublish}
            className="flex items-center space-x-2 rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Xuất bản đề thi</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3Preview;
