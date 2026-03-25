import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, RotateCcw } from "lucide-react";

interface ListeningLayoutProps {
  question: any;
  answer: string;
  onChange: (val: string) => void;
}

export function ListeningLayout({ question, answer, onChange }: ListeningLayoutProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fake audio logic for UI
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return p + 0.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (progress >= 100) return; // Prevent replay if needed
    setIsPlaying(!isPlaying);
  };

  if (!question) return null;
  const options = question.options || [];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full gap-6">
      
      {/* Audio Player Sticky Header */}
      <div className="bg-white rounded-[2rem] p-6 lg:p-8 flex flex-col items-center justify-center relative overflow-hidden"
           style={{ border: "1.5px solid #F0EEFF", boxShadow: "0 8px 32px rgba(124,58,237,0.06)" }}>
        
        {/* Animated Waveform Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
            {/* Giả lập sóng âm */}
            {isPlaying && (
               <div className="flex gap-1 h-32 items-center">
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className="w-2 bg-indigo-600 rounded-full animate-pulse" 
                         style={{ height: `${Math.random() * 80 + 20}%`, animationDuration: `${Math.random() * 0.5 + 0.5}s` }} />
                  ))}
               </div>
            )}
        </div>

        <div className="flex items-center gap-6 z-10 w-full max-w-2xl">
          <button 
            onClick={togglePlay}
            disabled={progress >= 100}
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "#4F46E5", color: "#fff", boxShadow: "0 8px 24px rgba(79,70,229,0.3)" }}>
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
          </button>
          
          <div className="flex-1">
             <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-800">Part {question.part || "1"} Audio</span>
                <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" /> Chỉ nghe được 1 lần
                </span>
             </div>
             
             {/* Progress Bar */}
             <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden w-full relative">
                <div className="absolute top-0 left-0 h-full bg-indigo-600 transition-all duration-100 rounded-full"
                     style={{ width: `${progress}%` }} />
             </div>
          </div>
        </div>
      </div>

      {/* Question & Options */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 flex-1 overflow-y-auto"
           style={{ border: "1.5px solid #F0EEFF", boxShadow: "0 4px 20px rgba(124,58,237,0.03)" }}>
        
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: question.qContent }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {options.map((opt: any) => {
            const isSelected = answer === opt.id?.toString();
            return (
              <button
                key={opt.id}
                onClick={() => onChange(opt.id?.toString())}
                className="w-full text-left p-5 rounded-xl transition-all flex items-start gap-4 group"
                style={{
                  background: isSelected ? "#EEF2FF" : "#F9FAFB",
                  border: isSelected ? "2px solid #4F46E5" : "2px solid transparent",
                }}
              >
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm transition-colors"
                     style={{
                       background: isSelected ? "#4F46E5" : "#E5E7EB",
                       color: isSelected ? "#fff" : "#6B7280"
                     }}>
                  {opt.label || ["A","B","C","D"][options.indexOf(opt)]}
                </div>
                <div className="flex-1 text-base font-medium mt-1" 
                     style={{ color: isSelected ? "#1E1B4B" : "#4B5563" }}
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
