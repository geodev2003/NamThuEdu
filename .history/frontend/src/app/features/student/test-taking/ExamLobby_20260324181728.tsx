import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Camera, Mic, Volume2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { studentApi } from "@/services/studentApi";

const BRAND = "#7C3AED";

type ExamLobbyInfo = {
  title: string;
  durationMinutes: number | null;
};

export function ExamLobby() {
  const { id } = useParams<{ id: string }>();
  const assignmentId = Number(id ?? 0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [speakerReady, setSpeakerReady] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [loadingExam, setLoadingExam] = useState(true);
  const [startingExam, setStartingExam] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [examInfo, setExamInfo] = useState<ExamLobbyInfo>({
    title: t("student.examLobby.defaultTitle"),
    durationMinutes: null,
  });

  const applyStreamToPreview = (stream: MediaStream) => {
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const requestCameraAndMic = async (silent = false) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatusMessage(t("student.examLobby.mediaUnsupported"));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      applyStreamToPreview(stream);
      setCameraReady(true);
      setMicReady(true);
      setStatusMessage(t("student.examLobby.permissionGranted"));
    } catch {
      setCameraReady(false);
      setMicReady(false);
      setStatusMessage(t("student.examLobby.permissionRequired"));
      if (!silent) {
        alert(t("student.examLobby.alertCameraMicPermission"));
      }
    }
  };

  const loadExamInfo = async () => {
    if (!assignmentId) {
      setLoadingExam(false);
      return;
    }

    try {
      setLoadingExam(true);
      const res: any = await studentApi.getTestDetail(assignmentId);
      const data = res?.data?.data;
      const assignment = data?.assignment ?? data;
      const exam = assignment?.exam ?? data?.exam;
      const title =
        exam?.eTitle ??
        assignment?.exam_title ??
        data?.exam_title ??
        t("student.examLobby.defaultTitle");
      const duration = Number(
        exam?.eDuration_minutes ??
          assignment?.exam_duration ??
          data?.exam_duration ??
          0
      );

      setExamInfo({
        title: String(title),
        durationMinutes: duration > 0 ? duration : null,
      });
    } catch {
      setStatusMessage(t("student.examLobby.loadExamFailed"));
    } finally {
      setLoadingExam(false);
    }
  };

  useEffect(() => {
    requestCameraAndMic(true);
    loadExamInfo();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const enableCamera = async () => {
    await requestCameraAndMic(false);
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
        await requestCameraAndMic(false);
      }
      window.setTimeout(() => {
        setMicReady(true);
        setRecording(false);
      }, 1500);
    } catch {
      setMicReady(false);
      setRecording(false);
      alert(t("student.examLobby.alertMicPermission"));
    }
  };

  const canEnter = cameraReady && speakerReady && micReady && !startingExam && !loadingExam;

  const handleEnterExam = async () => {
    if (!assignmentId) return;

    if (!cameraReady || !micReady) {
      alert(t("student.examLobby.alertCameraMicPermission"));
      return;
    }

    if (!speakerReady) {
      alert(t("student.examLobby.alertSpeakerRequired"));
      return;
    }

    try {
      setStartingExam(true);
      setStatusMessage(t("student.examLobby.startingSession"));

      const startRes: any = await studentApi.startTest(assignmentId);
      const startData = startRes?.data?.data ?? {};
      const sid = Number(startData?.submissionId ?? 0);

      if (!sid) {
        throw new Error("missing-submission-id");
      }

      try {
        await studentApi.connectTestWebsocket(sid);
      } catch {
        await studentApi.reconnectTestWebsocket(sid);
      }
      setStatusMessage(t("student.examLobby.sessionConnected"));
      navigate(`/lam-bai/${assignmentId}?autostart=1&submissionId=${sid}`);
    } catch {
      setStatusMessage(t("student.examLobby.sessionFailed"));
      alert(t("student.examLobby.alertSessionFailed"));
    } finally {
      setStartingExam(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-[#EEF2FF] via-[#F8FAFC] to-[#E2E8F0] px-3 md:px-6 py-6 md:py-10">
      <div className="max-w-[1320px] mx-auto rounded-[30px] border-2 border-indigo-300 bg-white/95 p-5 md:p-10 shadow-[0_30px_100px_rgba(15,23,42,0.2)] ring-8 ring-indigo-100/90">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-500">{t("student.examLobby.title")}</p>
          <h1 className="mt-2 text-2xl md:text-3xl font-black text-slate-800">{examInfo.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{t("student.examLobby.subtitle")}</p>
          {examInfo.durationMinutes && (
            <p className="mt-1 text-sm font-semibold text-indigo-600">
              {t("student.examLobby.duration", { minutes: examInfo.durationMinutes })}
            </p>
          )}
        </div>

        {(loadingExam || statusMessage) && (
          <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 flex items-center justify-center gap-2">
            {loadingExam ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{loadingExam ? t("student.examLobby.loadingExam") : statusMessage}</span>
          </div>
        )}

        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/50 p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 mb-1">
          <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">1</div>
            <h3 className="font-bold text-slate-800">{t("student.examLobby.sectionExamStructure")}</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>{t("student.examLobby.skill1")}</li>
              <li>{t("student.examLobby.skill2")}</li>
              <li>{t("student.examLobby.skill3")}</li>
              <li>{t("student.examLobby.skill4")}</li>
            </ul>
          </section>

          <section className="space-y-3 rounded-2xl border-2 border-indigo-300 bg-indigo-50/50 p-4 shadow-[0_10px_28px_rgba(79,70,229,0.16)]">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">2</div>
            <h3 className="font-bold text-slate-800">{t("student.examLobby.sectionDeviceCheck")}</h3>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-48 object-cover rounded-lg bg-slate-200" />
              <button
                onClick={enableCamera}
                className="mt-3 w-full py-2 rounded-lg text-white font-semibold"
                style={{ background: BRAND }}
              >
                <span className="inline-flex items-center gap-2">
                  <Camera className="w-4 h-4" /> {t("student.examLobby.enableCamera")}
                </span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={testSpeaker} className="py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold">
                <span className="inline-flex items-center gap-2">
                  <Volume2 className="w-4 h-4" /> {t("student.examLobby.testSpeaker")}
                </span>
              </button>
              <button onClick={testMic} className="py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold">
                <span className="inline-flex items-center gap-2">
                  <Mic className="w-4 h-4" /> {recording ? t("student.examLobby.recording") : t("student.examLobby.testMic")}
                </span>
              </button>
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">3</div>
            <h3 className="font-bold text-slate-800">{t("student.examLobby.sectionReady")}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-slate-50 border border-slate-200">
                <span>{t("student.examLobby.camera")}</span>
                {cameraReady ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
              </div>
              <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-slate-50 border border-slate-200">
                <span>{t("student.examLobby.speaker")}</span>
                {speakerReady ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
              </div>
              <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-slate-50 border border-slate-200">
                <span>{t("student.examLobby.microphone")}</span>
                {micReady ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
              </div>
            </div>
            <button
              onClick={handleEnterExam}
              disabled={!canEnter}
              className="mt-2 w-full py-2.5 rounded-lg text-white font-bold disabled:opacity-50"
              style={{ background: canEnter ? "#10B981" : "#94A3B8" }}
            >
              {startingExam ? t("student.examLobby.connecting") : t("student.examLobby.enterExam")}
            </button>
          </section>
          </div>
        </div>
      </div>
    </div>
  );
}
