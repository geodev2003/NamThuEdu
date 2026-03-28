import { useState, useEffect } from "react";
import { Mic, Square, Play, RotateCcw } from "lucide-react";

interface SpeakingLayoutProps {
  question: any;
  answer: string; // Có thể lưu base64 của file audio hoặc đường dẫn
  onChange: (val: string) => void;
  prepTime?: number; // Thời gian chuẩn bị (ví dụ 60s)
  speakTime?: number; // Thời gian nói tối đa (ví dụ 120s)
}

export function SpeakingLayout({ question, answer, onChange, prepTime = 60, speakTime = 120 }: SpeakingLayoutProps) {
  const [phase, setPhase] = useState<'idle' | 'preparing' | 'recording' | 'done'>('idle');
  const [timeLeft, setTimeLeft] = useState(prepTime);

  // Countdown timer logic
  useEffect(() => {
    let timer: any;
    if (phase === 'preparing' || phase === 'recording') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            if (phase === 'preparing') {
              startRecording();
            } else if (phase === 'recording') {
              stopRecording();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [phase]);

  const startPreparation = () => {
    setPhase('preparing');
    setTimeLeft(prepTime);
  };

  const startRecording = () => {
    setPhase('recording');
    setTimeLeft(speakTime);
    // TODO: Init MediaRecorder here
  };

  const stopRecording = () => {
    setPhase('done');
    setTimeLeft(0);
    // TODO: Stop MediaRecorder, get blob, call onChange with blob URL or Base64
    onChange("audio_mock_recorded.webm");
  };

  const reset = () => {
    setPhase('idle');
    setTimeLeft(prepTime);
    onChange("");
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!question) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      
      {/* Question Card */}
      <div className="w-full max-w-3xl bg-white rounded-[2rem] p-8 lg:p-12 mb-8 text-center"
           style={{ border: "1.5px solid #F0EEFF", boxShadow: "0 8px 32px rgba(124,58,237,0.06)" }}>
        <h3 className="text-2xl font-bold text-gray-800 mb-6" dangerouslySetInnerHTML={{ __html: question.qContent || "Topic: Describe your favorite book..." }} />
        
        {(question.qPassage || question.qImage) && (
           <div className="mt-8 p-6 bg-gray-50 rounded-2xl text-left border border-gray-100">
             <div dangerouslySetInnerHTML={{ __html: question.qPassage }} />
           </div>
        )}
      </div>

      {/* Recording Studio Controls */}
      <div className="flex flex-col items-center">
        
        {/* Status Text & Timer */}
        <div className="mb-8 text-center">
           <h4 className="text-sm font-bold uppercase tracking-wider mb-2" 
               style={{ color: phase === 'preparing' ? '#D97706' : phase === 'recording' ? '#DC2626' : phase === 'done' ? '#16A34A' : '#6B7280' }}>
             {phase === 'idle' && "Sẵn sàng"}
             {phase === 'preparing' && "Thời gian chuẩn bị (Preparation)"}
             {phase === 'recording' && "Đang thu âm (Recording...)"}
             {phase === 'done' && "Đã thu âm xong"}
           </h4>
           <div className="text-5xl font-black font-mono" 
                style={{ color: phase === 'recording' ? '#DC2626' : '#1F1344' }}>
             {formatTime(timeLeft)}
           </div>
        </div>

        {/* Big Mic Button */}
        <div className="relative flex justify-center items-center w-32 h-32">
          {/* Waves animation when recording */}
          {phase === 'recording' && (
            <>
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping" style={{ animationDuration: '1.5s' }} />
              <div className="absolute inset-2 bg-red-400 rounded-full opacity-30 animate-pulse" />
            </>
          )}

          {phase === 'idle' && (
            <button onClick={startPreparation} 
                    className="z-10 w-20 h-20 bg-indigo-600 rounded-full flex justify-center items-center text-white transition-transform hover:scale-105 shadow-xl">
              <Play className="w-8 h-8 ml-1 fill-current" />
            </button>
          )}

          {phase === 'preparing' && (
            <button onClick={startRecording} 
                    className="z-10 px-6 py-3 bg-yellow-500 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105">
              Bỏ qua chuẩn bị
            </button>
          )}

          {phase === 'recording' && (
            <button onClick={stopRecording} 
                    className="z-10 w-20 h-20 bg-red-600 rounded-full flex justify-center items-center text-white transition-transform hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.5)]">
              <Square className="w-8 h-8 fill-current" />
            </button>
          )}

          {phase === 'done' && (
            <div className="flex gap-4">
              <button className="z-10 px-6 py-3 bg-green-600 text-white rounded-full font-bold shadow-lg flex items-center gap-2">
                <Play className="w-5 h-5 fill-current" /> Nghe lại
              </button>
              <button onClick={reset} className="z-10 w-12 h-12 bg-white text-gray-700 border border-gray-200 rounded-full flex justify-center items-center hover:bg-gray-50 transition-colors">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
