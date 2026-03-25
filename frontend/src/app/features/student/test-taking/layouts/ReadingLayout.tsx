import { useState } from "react";

interface ReadingLayoutProps {
  question: any;
  answer: string;
  onChange: (val: string) => void;
}

export function ReadingLayout({ question, answer, onChange }: ReadingLayoutProps) {
  if (!question) return null;

  // Giả lập đoạn văn nếu backend trả về trong qPassage hoặc gộp chung trong qContent
  const passageHTML = question.qPassage || "<p>Đoạn văn Đọc hiểu (Reading passage) sẽ hiển thị ở đây. Hệ thống cho phép bôi đen (highlight) đoạn văn tự do.</p>";
  
  const options = question.options || [];

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      
      {/* Pane Trái: Bài Đọc (Scrollable) */}
      <div className="flex-1 bg-white rounded-2xl p-6 lg:p-8 overflow-y-auto"
           style={{ border: "1.5px solid #F0EEFF", boxShadow: "0 4px 20px rgba(124,58,237,0.03)" }}>
        <h2 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-4 mb-4">
          Read the following passage
        </h2>
        <div 
          className="prose prose-blue max-w-none text-gray-700 leading-relaxed custom-passage"
          style={{ fontSize: 15 }}
          dangerouslySetInnerHTML={{ __html: passageHTML }}
        />
      </div>

      {/* Pane Phải: Chọn Đáp Án */}
      <div className="w-full lg:w-[45%] lg:min-w-[400px] flex flex-col bg-white rounded-2xl p-6"
           style={{ border: "1.5px solid #F0EEFF", boxShadow: "0 4px 20px rgba(124,58,237,0.03)" }}>
        
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 font-bold text-xs rounded-lg mb-4">
             Question
          </span>
          <div 
            className="text-base font-semibold text-gray-800"
            dangerouslySetInnerHTML={{ __html: question.qContent || "Nội dung câu hỏi chưa hiển thị" }}
          />
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {options.map((opt: any) => {
            const isSelected = answer === opt.id?.toString();
            return (
              <button
                key={opt.id}
                onClick={() => onChange(opt.id?.toString())}
                className="w-full text-left p-4 rounded-xl transition-all flex items-start gap-4"
                style={{
                  background: isSelected ? "#EEF2FF" : "#F9FAFB",
                  border: isSelected ? "2px solid #6366F1" : "2px solid #F3F4F6",
                }}
              >
                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm mt-0.5"
                     style={{
                       background: isSelected ? "#6366F1" : "#E5E7EB",
                       color: isSelected ? "#fff" : "#6B7280"
                     }}>
                  {opt.label || ["A","B","C","D"][options.indexOf(opt)]}
                </div>
                <div className="flex-1 text-sm font-medium" 
                     style={{ color: isSelected ? "#1E1B4B" : "#374151" }}
                     dangerouslySetInnerHTML={{ __html: opt.content }} 
                />
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
