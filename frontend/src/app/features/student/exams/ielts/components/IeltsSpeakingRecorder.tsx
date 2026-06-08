/**
 * IELTS Speaking — audio recorder for a single part.
 *
 * Behaviour:
 *  • Show the question / cue card based on `partNumber`
 *  • Part 2: 1-minute prep with cue card visible, then 1-2 min recording
 *  • Part 1 & 3: record per question (or single combined recording)
 *  • Recording uses MediaRecorder; uploaded via `studentApi.uploadSpeakingAudio`
 *  • Live waveform visualisation
 */
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Play, Square, Clock, Volume2 } from "lucide-react";

interface IeltsSpeakingRecorderProps {
  partNumber: 1 | 2 | 3;
  /** Part 1/3: array of question prompts; Part 2: cue card */
  prompt: string;
  bullets?: string[];
  prepSeconds?: number;
  speakSeconds: number;
  /** Triggers when recording is finalised — parent uploads the blob */
  onRecorded: (blob: Blob, durationSec: number) => void;
  /** Display only (review) */
  reviewMode?: boolean;
  reviewAudioUrl?: string;
}

type Phase = "idle" | "prep" | "recording" | "done";

export function IeltsSpeakingRecorder({
  partNumber,
  prompt,
  bullets,
  prepSeconds = 0,
  speakSeconds,
  onRecorded,
  reviewMode = false,
  reviewAudioUrl,
}: IeltsSpeakingRecorderProps) {
  const [phase, setPhase] = useState<Phase>(reviewMode ? "done" : "idle");
  const [timeLeft, setTimeLeft] = useState(prepSeconds || speakSeconds);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerIdRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timerIdRef.current && window.clearInterval(timerIdRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop();
    };
  }, []);

  const ensureStream = async (): Promise<MediaStream | null> => {
    if (streamRef.current) return streamRef.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      return stream;
    } catch {
      setPermissionDenied(true);
      return null;
    }
  };

  const startCountdown = (seconds: number, onComplete: () => void) => {
    setTimeLeft(seconds);
    timerIdRef.current && window.clearInterval(timerIdRef.current);
    timerIdRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          timerIdRef.current && window.clearInterval(timerIdRef.current);
          onComplete();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleStart = async () => {
    const stream = await ensureStream();
    if (!stream) return;

    if (prepSeconds > 0 && partNumber === 2) {
      // Prep phase first
      setPhase("prep");
      startCountdown(prepSeconds, () => beginRecording(stream));
    } else {
      beginRecording(stream);
    }
  };

  const beginRecording = (stream: MediaStream) => {
    chunksRef.current = [];
    const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mr.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const dur = Math.round((Date.now() - startTimeRef.current) / 1000);
      onRecorded(blob, dur);
      setPhase("done");
    };
    mediaRecorderRef.current = mr;
    startTimeRef.current = Date.now();
    mr.start();
    setPhase("recording");
    startCountdown(speakSeconds, stopRecording);
  };

  const stopRecording = () => {
    timerIdRef.current && window.clearInterval(timerIdRef.current);
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // ─── PHASE-SPECIFIC UI ──────────────────────────────────────────────

  // Review (after recording done OR view-only)
  if (phase === "done" || reviewMode) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Volume2 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Recording done</h3>
        </div>
        {reviewAudioUrl ? (
          <audio controls src={reviewAudioUrl} className="w-full" />
        ) : (
          <p className="text-sm text-gray-600">
            Your answer has been recorded and will be sent for grading.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Prompt area */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-pink-100 text-pink-700">
            Part {partNumber}
          </span>
          {phase === "prep" && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 animate-pulse">
              Prep time
            </span>
          )}
          {phase === "recording" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Recording
            </span>
          )}
        </div>

        <div className="prose prose-sm max-w-none text-gray-900 leading-relaxed">
          <p className="font-medium">{prompt}</p>
        </div>

        {bullets && bullets.length > 0 && (
          <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-pink-500 font-bold mt-0.5">·</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Timer + Controls */}
      <div className="px-5 py-4">
        {permissionDenied && (
          <div className="mb-3 p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-800">
            <strong>Microphone access denied.</strong> Please grant permission and reload the page.
          </div>
        )}

        {phase === "idle" && !permissionDenied && (
          <button
            type="button"
            onClick={handleStart}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold shadow-md transition-colors cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            {prepSeconds > 0 && partNumber === 2
              ? `Start ${prepSeconds}s prep then record`
              : "Start recording"}
          </button>
        )}

        {(phase === "prep" || phase === "recording") && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3 py-3">
              <Clock className={`w-5 h-5 ${phase === "recording" ? "text-red-600" : "text-amber-600"}`} />
              <div className={`text-3xl font-black tabular-nums ${
                phase === "recording" ? "text-red-600" : "text-amber-600"
              }`}>
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="text-center text-xs text-gray-600">
              {phase === "prep"
                ? "Take notes if needed. Recording starts automatically when prep ends."
                : "Speak naturally. Recording will stop automatically."}
            </div>
            {phase === "recording" && (
              <button
                type="button"
                onClick={stopRecording}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                Stop early
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
