import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Camera, Mic, Volume2, CheckCircle2, AlertCircle } from "lucide-react";

const BRAND = "#7C3AED";

export function ExamLobby() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
import { useTranslation } from "react-i18next";

  const [cameraReady, setCameraReady] = useState(false);
  const [speakerReady, setSpeakerReady] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const { t } = useTranslation();
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(true);
      setMicReady(true);
    } catch {
      setCameraReady(false);
    }
  };

  const testSpeaker = async () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      oscillator.connect(gain);
      gain.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.6);
      setSpeakerReady(true);
    } catch {
      setSpeakerReady(false);
    }
  };

  const testMic = async () => {
    try {
      setRecording(true);
      if (!streamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
      }
      window.setTimeout(() => {
        setMicReady(true);
        setRecording(false);
      }, 1500);
    } catch {
      setMicReady(false);
      setRecording(false);
    }
  };

  const canEnter = cameraReady && speakerReady && micReady;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F3F4F6] px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 md:p-8">
        <p className="text-xs text-slate-500 text-center mb-4">
          {t("student.examLobby.subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-7">
          <section className="space-y-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center">1</div>
            <h3 className="font-bold text-slate-800">CAU TRUC BAI THI</h3>
              {t("student.examLobby.sectionExamStructure")}
              <li>Ky nang 1: NGHE - 3 phan (47 phut)</li>
              <li>Ky nang 2: DOC - 4 phan (60 phut)</li>
              <li>{t("student.examLobby.skill1")}</li>
              <li>{t("student.examLobby.skill2")}</li>
              <li>{t("student.examLobby.skill3")}</li>
              <li>{t("student.examLobby.skill4")}</li>

          <section className="space-y-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center">2</div>
            <h3 className="font-bold text-slate-800">KIEM TRA THIET BI</h3>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-36 object-cover rounded-lg bg-slate-200" />
              {t("student.examLobby.sectionDeviceCheck")}
                onClick={enableCamera}
                className="mt-3 w-full py-2 rounded-lg text-white font-semibold"
                style={{ background: BRAND }}
              >
                <span className="inline-flex items-center gap-2"><Camera className="w-4 h-4" /> Bat camera</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={testSpeaker} className="py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold">
                <span className="inline-flex items-center gap-2"><Volume2 className="w-4 h-4" /> Test loa</span>
              </button>
              <button onClick={testMic} className="py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold">
                <span className="inline-flex items-center gap-2"><Mic className="w-4 h-4" /> {recording ? "Dang thu..." : "Test mic"}</span>
              </button>
            </div>
          </section>

          <section className="space-y-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center">3</div>
            <h3 className="font-bold text-slate-800">TRANG THAI SAN SANG</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-slate-50 border border-slate-200">
                <span>Camera</span>
                {cameraReady ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
              {t("student.examLobby.sectionReady")}
              <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-slate-50 border border-slate-200">
                <span>Loa</span>
                {speakerReady ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
                <span>{t("student.examLobby.camera")}</span>
              <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-slate-50 border border-slate-200">
                <span>Microphone</span>
                {micReady ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
                <span>{t("student.examLobby.speaker")}</span>
            </div>
            <button
              onClick={() => navigate(`/lam-bai/${id}?autostart=1`)}
                <span>{t("student.examLobby.microphone")}</span>
              className="mt-2 w-full py-2.5 rounded-lg text-white font-bold disabled:opacity-50"
              style={{ background: canEnter ? "#10B981" : "#94A3B8" }}
            >
              NHAN DE
            </button>
          </section>
        </div>
      </div>
    </div>
              {t("student.examLobby.enterExam")}
}
