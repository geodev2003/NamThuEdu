import { useState, useRef } from "react";
import { Mic, Volume2, Play, CheckCircle2, AlertCircle } from "lucide-react";

interface IntroScreenProps {
  examData: any;
  onStart: () => void;
  isLoading?: boolean;
}

export function IntroScreen({ examData, onStart, isLoading }: IntroScreenProps) {
  const [micStatus, setMicStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [speakerStatus, setSpeakerStatus] = useState<'idle' | 'playing' | 'success'>('idle');
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const testMicrophone = async () => {
    try {
      setMicStatus('testing');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      // Simulate testing for 2 seconds
      setTimeout(() => {
        setMicStatus('success');
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
      }, 2000);
    } catch (err) {
      setMicStatus('failed');
    }
  };

  const testSpeaker = () => {
    setSpeakerStatus('playing');
    // Mute placeholder beep
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 440; // A4 note
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 1);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 1);

      setTimeout(() => setSpeakerStatus('success'), 1000);
    } catch (e) {
      setSpeakerStatus('success'); // Fallback
    }
  };

  const canStart = micStatus === 'success' && speakerStatus === 'success';
  const color = "#7C3AED"; // PURPLE

  if (!examData) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="bg-white rounded-[2rem] p-8 w-full max-w-2xl" 
           style={{ border: "1.5px solid #F0EEFF", boxShadow: "0 8px 32px rgba(124,58,237,0.08)" }}>
        
        <div className="text-center mb-8">
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1F1344" }} className="mb-2">
            {examData.exam_title || "Bài thi VSTEP Tiếng Anh"}
          </h1>
          <p className="text-gray-500">
            Thời gian làm bài: <b>{examData.exam_duration || 120} phút</b> • Số câu hỏi: <b>{examData.total_questions || 40} câu</b>
          </p>
        </div>

        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-8 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
          <p>
            <b>Nội quy phòng thi:</b> Bạn không được phép rời khỏi trình duyệt hoặc mở tab khác trong quá trình thi. 
            Bài thi sẽ tự động ghi sổ nếu phát hiện gian lận. Vui lòng kiểm tra kỹ Micro và Loa trước khi bắt đầu.
          </p>
        </div>

        <h3 className="font-bold text-gray-800 mb-4 px-2">Kiểm tra thiết bị bắt buộc:</h3>
        
        <div className="space-y-4 mb-8">
          {/* Speaker Test */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100">
                <Volume2 className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-800">Kiểm tra Loa (Speaker)</p>
                <p className="text-xs text-gray-500">Cần thiết cho phần thi Listening</p>
              </div>
            </div>
            
            {speakerStatus === 'success' ? (
              <span className="flex items-center gap-1 text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4" /> Đã kiểm tra
              </span>
            ) : speakerStatus === 'playing' ? (
              <span className="text-sm font-bold text-blue-600">Đang phát âm thanh...</span>
            ) : (
              <button onClick={testSpeaker} className="text-sm font-bold bg-white border border-gray-200 px-4 py-2 rounded-xl transition hover:bg-gray-50">
                Phát âm thanh thử
              </button>
            )}
          </div>

          {/* Mic Test */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100">
                <Mic className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-800">Kiểm tra Micro (Microphone)</p>
                <p className="text-xs text-gray-500">Cần thiết cho phần thi Speaking</p>
              </div>
            </div>
            
            {micStatus === 'success' ? (
              <span className="flex items-center gap-1 text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4" /> Đã kết nối
              </span>
            ) : micStatus === 'failed' ? (
              <span className="flex items-center gap-1 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                <AlertCircle className="w-4 h-4" /> Lỗi Micro
              </span>
            ) : micStatus === 'testing' ? (
              <span className="text-sm font-bold text-blue-600">Đang kiểm tra...</span>
            ) : (
              <button onClick={testMicrophone} className="text-sm font-bold bg-white border border-gray-200 px-4 py-2 rounded-xl transition hover:bg-gray-50">
                Cho phép & Thu âm thử
              </button>
            )}
          </div>
        </div>

        <button
          onClick={onStart}
          disabled={!canStart || isLoading}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all
            ${canStart ? 'hover:-translate-y-1 shadow-lg' : 'opacity-60 cursor-not-allowed'}`}
          style={{ background: canStart ? color : '#E5E7EB', color: canStart ? '#fff' : '#9CA3AF' }}
        >
          {isLoading ? (
             <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
          ) : (
             <Play className="w-5 h-5 fill-current" />
          )}
          {canStart ? "Vào Phòng Thi Góc" : "Hãy kiểm tra thiết bị để tiếp tục"}
        </button>
        
      </div>
    </div>
  );
}
