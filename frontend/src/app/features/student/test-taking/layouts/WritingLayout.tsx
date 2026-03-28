import { useState, useEffect } from "react";
import { Edit3, CheckCircle2, AlertTriangle } from "lucide-react";

interface WritingLayoutProps {
  question: any;
  answer: string;
  onChange: (val: string) => void;
  wordLimit?: { min: number; max: number };
}

export function WritingLayout({ question, answer, onChange, wordLimit = { min: 150, max: 250 } }: WritingLayoutProps) {
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const textOptions = (answer || "").trim();
    setWordCount(textOptions === "" ? 0 : textOptions.split(/\s+/).length);
  }, [answer]);

  if (!question) return null;

  const getWordCountColor = () => {
    if (wordCount === 0) return "text-gray-400";
    if (wordCount < wordLimit.min) return "text-yellow-600";
    if (wordCount > wordLimit.max) return "text-red-500";
    return "text-green-600";
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      
      {/* Pane Trái: Đề bài (Prompt) */}
      <div className="w-full lg:w-[45%] flex flex-col bg-white rounded-2xl p-6 lg:p-8 overflow-y-auto"
           style={{ border: "1.5px solid #F0EEFF", boxShadow: "0 4px 20px rgba(124,58,237,0.03)" }}>
        
        <div className="flex items-center gap-2 mb-4">
           <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
              <Edit3 className="w-4 h-4" />
           </div>
           <h2 className="font-bold text-gray-800 text-lg">Writing Task</h2>
        </div>
        
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-6 text-sm text-gray-600 font-medium">
          Bạn cần viết một đoạn văn bản khoảng <b>{wordLimit.min} đến {wordLimit.max} từ</b>. Hãy chú ý thời gian làm bài.
        </div>

        {/* Nội dung đề bài */}
        <div 
          className="prose prose-blue max-w-none text-gray-800 leading-relaxed custom-passage font-medium"
          style={{ fontSize: 16 }}
          dangerouslySetInnerHTML={{ __html: question.qContent || "Nội dung câu hỏi Viết sẽ hiển thị tại đây." }}
        />
      </div>

      {/* Pane Phải: Khung soạn thảo (Rich / Plain Textarea) */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl p-6 lg:p-8"
           style={{ border: "1.5px solid #F0EEFF", boxShadow: "0 4px 20px rgba(124,58,237,0.03)" }}>
        
        <div className="flex justify-between items-center mb-4">
           <h3 className="font-bold text-gray-800">Bài làm (Your answer)</h3>
           {/* Word Count Badge */}
           <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-gray-50 border ${
               wordCount < wordLimit.min ? 'border-yellow-200 bg-yellow-50' : 
               wordCount > wordLimit.max ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
             }`}>
             {wordCount < wordLimit.min ? <AlertTriangle className="w-4 h-4 text-yellow-600" /> :
              wordCount > wordLimit.max ? <AlertTriangle className="w-4 h-4 text-red-500" /> :
              <CheckCircle2 className="w-4 h-4 text-green-600" />}
             
             <span className={getWordCountColor()}>{wordCount} / {wordLimit.min}+ từ</span>
           </div>
        </div>

        <textarea
          value={answer || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Bắt đầu gõ bài làm của bạn vào đây..."
          className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-xl p-6 resize-none outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-gray-800"
          style={{ fontSize: 16, lineHeight: 1.6 }}
          spellCheck="false"
        />
      </div>

    </div>
  );
}
