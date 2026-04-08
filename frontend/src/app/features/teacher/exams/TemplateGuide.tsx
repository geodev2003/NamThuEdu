import { Download, FileJson, BookOpen, Info } from 'lucide-react';

export function TemplateGuide() {
  const templates = [
    {
      name: 'VSTEP Listening',
      file: 'vstep-listening-template.json',
      description: 'Template cho đề thi VSTEP Listening với các dạng câu hỏi phổ biến',
      icon: '🎧',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      name: 'VSTEP Reading',
      file: 'vstep-reading-template.json',
      description: 'Template cho đề thi VSTEP Reading với đoạn văn và câu hỏi mẫu',
      icon: '📖',
      color: 'bg-green-50 border-green-200'
    },
    {
      name: 'IELTS Listening',
      file: 'ielts-listening-template.json',
      description: 'Template cho đề thi IELTS Listening theo format chuẩn',
      icon: '🎯',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      name: 'General Mixed',
      file: 'general-mixed-template.json',
      description: 'Template tổng hợp cho đề thi đa kỹ năng',
      icon: '📚',
      color: 'bg-orange-50 border-orange-200'
    }
  ];

  const downloadTemplate = (filename: string) => {
    const link = document.createElement('a');
    link.href = `/templates/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadReadme = () => {
    const link = document.createElement('a');
    link.href = '/templates/README.md';
    link.download = 'HUONG-DAN-SU-DUNG.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileJson className="w-5 h-5 text-orange-600" />
            Template JSON Mẫu
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Tải template để tạo đề thi nhanh chóng và chuẩn format
          </p>
        </div>
        <button
          onClick={downloadReadme}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Hướng dẫn sử dụng
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-900">
            <p className="font-medium mb-1">Cách sử dụng:</p>
            <ol className="list-decimal list-inside space-y-1 text-orange-800">
              <li>Tải template phù hợp với loại đề thi</li>
              <li>Mở file và chỉnh sửa nội dung câu hỏi, đáp án</li>
              <li>Copy toàn bộ nội dung JSON</li>
              <li>Click nút "Import JSON" ở bước 2 để import vào hệ thống</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div
            key={template.file}
            className={`border-2 rounded-lg p-4 ${template.color} hover:shadow-md transition-all`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{template.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">{template.name}</h4>
                  <p className="text-xs text-gray-600 mt-0.5">{template.file}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">{template.description}</p>
            <button
              onClick={() => downloadTemplate(template.file)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <Download className="w-4 h-4" />
              Tải template
            </button>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 Mẹo: Sau khi tải template, bạn có thể sử dụng các công cụ online như{' '}
          <a
            href="https://jsonformatter.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:underline"
          >
            JSON Formatter
          </a>{' '}
          để kiểm tra và format JSON trước khi import
        </p>
      </div>
    </div>
  );
}



