/**
 * Whisper Local STT — chạy hoàn toàn trong browser, không cần API key.
 * Dùng @huggingface/transformers (transformers.js v3) + ONNX runtime web.
 *
 * Model mặc định: Xenova/whisper-tiny.en (~40MB, tiếng Anh)
 * Lần đầu sẽ download model + cache vào IndexedDB của trình duyệt → các lần sau chạy offline.
 *
 * Hỗ trợ mp3 / wav / m4a / webm / ogg — tự decode về 16kHz mono PCM bằng Web Audio API.
 */
import { env } from "@huggingface/transformers";

// Cho phép tải model từ Hugging Face Hub (default true), tắt local model files.
// (Giữ ở main thread vì decode audio vẫn dùng env này; worker tự set riêng.)
env.allowLocalModels = false;
env.useBrowserCache = true;

// Whisper sample rate yêu cầu = 16000 Hz mono
const WHISPER_SAMPLE_RATE = 16_000;

export type ProgressCb = (info: {
  status: string;
  name?: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
}) => void;

/* ─────────────────────────────────────────────────────────────────────────────
 * Web Worker: chạy inference ONNX ở luồng nền để KHÔNG treo UI.
 * Main thread chỉ decode audio (native, async) rồi gửi PCM sang worker.
 * ───────────────────────────────────────────────────────────────────────────── */

/** Số worker chạy song song tối đa. */
const MAX_WORKERS = 4;

interface Job {
  id: number;
  pcm: Float32Array;
  modelId: string;
  callOpts: any;
  onProgress?: ProgressCb;
  resolve: (out: any) => void;
  reject: (err: Error) => void;
}

interface PoolWorker {
  worker: Worker;
  /** Job đang chạy trên worker này, null nếu rảnh. */
  job: Job | null;
}

const pool: PoolWorker[] = [];
const queue: Job[] = [];
let msgSeq = 0;

/** Tạo 1 worker kèm message handler định tuyến theo id job đang chạy trên nó. */
function spawnWorker(): PoolWorker {
  const worker = new Worker(new URL("./whisperWorker.ts", import.meta.url), {
    type: "module",
  });
  const pw: PoolWorker = { worker, job: null };

  worker.addEventListener("message", (e: MessageEvent) => {
    const data = e.data || {};
    const job = pw.job;
    if (!job) return;
    // Chỉ nhận message của job đang chạy trên chính worker này.
    if (data.id != null && data.id !== job.id) return;

    if (data.type === "progress") {
      job.onProgress?.(data.info);
      return;
    }
    if (data.type === "result") {
      pw.job = null;
      job.resolve(data.out);
      pump();
    } else if (data.type === "error") {
      pw.job = null;
      job.reject(new Error(data.message || "Worker transcribe failed"));
      pump();
    }
  });

  return pw;
}

/** Gán job kế tiếp trong queue cho worker rảnh (tạo thêm worker nếu chưa đủ MAX). */
function pump() {
  if (queue.length === 0) return;

  // Tìm worker rảnh
  let free = pool.find((p) => p.job === null);

  // Chưa có worker rảnh nhưng còn slot → tạo thêm
  if (!free && pool.length < MAX_WORKERS) {
    free = spawnWorker();
    pool.push(free);
  }
  if (!free) return; // pool đầy, các job còn lại chờ

  const job = queue.shift()!;
  free.job = job;
  // Copy PCM sang worker (không transfer để caller giữ pcm cho diarize).
  free.worker.postMessage({
    id: job.id,
    pcm: job.pcm,
    modelId: job.modelId,
    callOpts: job.callOpts,
  });

  // Còn job + còn slot rảnh → tiếp tục lấp đầy (chạy song song).
  if (queue.length > 0) pump();
}

/**
 * Gửi PCM vào pool để transcribe. Trả về kết quả thô từ pipeline.
 * Nhiều job có thể chạy song song (tối đa MAX_WORKERS), phần dư xếp hàng đợi.
 */
function runInWorker(
  pcm: Float32Array,
  modelId: string,
  callOpts: any,
  onProgress?: ProgressCb
): Promise<any> {
  const id = ++msgSeq;
  return new Promise((resolve, reject) => {
    queue.push({ id, pcm, modelId, callOpts, onProgress, resolve, reject });
    pump();
  });
}

/**
 * AudioContext dùng CHUNG để decode — Chrome giới hạn ~6 AudioContext/trang,
 * nên KHÔNG tạo mới mỗi lần (sẽ gây EncodingError khi chạy song song nhiều file).
 */
let sharedDecodeCtx: AudioContext | null = null;
function getDecodeCtx(): AudioContext {
  if (!sharedDecodeCtx || sharedDecodeCtx.state === "closed") {
    sharedDecodeCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return sharedDecodeCtx;
}

/**
 * Decode 1 audio file (bất kỳ format browser hỗ trợ) → Float32Array PCM 16kHz mono.
 */
async function decodeAudioToPCM(file: File | Blob): Promise<Float32Array> {
  const arrayBuf = await file.arrayBuffer();

  // Dùng context chung (không đóng) để tránh chạm giới hạn số AudioContext.
  const ctx = getDecodeCtx();
  let decoded: AudioBuffer;
  try {
    decoded = await ctx.decodeAudioData(arrayBuf.slice(0));
  } catch (err) {
    // Một số trình duyệt cần context ở trạng thái "running" mới decode được.
    try {
      await ctx.resume();
    } catch {
      /* ignore */
    }
    decoded = await ctx.decodeAudioData(arrayBuf.slice(0));
  }

  // Nếu đã đúng sample rate + mono thì lấy luôn
  if (decoded.sampleRate === WHISPER_SAMPLE_RATE && decoded.numberOfChannels === 1) {
    return decoded.getChannelData(0).slice();
  }

  // Resample bằng OfflineAudioContext (tự đóng sau khi render xong)
  const offline = new OfflineAudioContext(
    1,
    Math.ceil((decoded.duration * WHISPER_SAMPLE_RATE)),
    WHISPER_SAMPLE_RATE
  );
  const src = offline.createBufferSource();
  src.buffer = decoded;
  src.connect(offline.destination);
  src.start(0);
  const rendered = await offline.startRendering();
  return rendered.getChannelData(0).slice();
}

/**
 * Transcribe 1 file audio → text. Chạy hoàn toàn local, free.
 *
 * @param file        Audio file (mp3, wav, m4a, webm, ogg…)
 * @param options     { language?: 'en' | 'vi' | …, model?: string, onProgress }
 *                    - model: HF repo id, default 'Xenova/whisper-tiny.en'
 *                            cho tiếng Anh. Đổi 'Xenova/whisper-base' (~145MB)
 *                            nếu cần đa ngôn ngữ.
 */
export async function transcribeLocal(
  file: File | Blob,
  options: {
    language?: string;
    model?: string;
    onProgress?: ProgressCb;
  } = {}
): Promise<string> {
  const result = await transcribeLocalDetailed(file, options);
  return result.text;
}

/**
 * Detailed version — trả về text + chunks có timestamps + raw PCM.
 * Dùng cho speaker diarization.
 */
export interface TranscribeDetailedResult {
  text: string;
  chunks: Array<{
    text: string;
    timestamp: [number, number] | [number, null];
  }>;
  pcm: Float32Array;
}

export async function transcribeLocalDetailed(
  file: File | Blob,
  options: {
    language?: string;
    model?: string;
    onProgress?: ProgressCb;
  } = {}
): Promise<TranscribeDetailedResult> {
  const modelId = options.model ?? "Xenova/whisper-tiny.en";

  // Decode audio ở main thread (native, async — không gây treo UI).
  const pcm = await decodeAudioToPCM(file);

  const isEnglishOnly = /\.en($|-)/i.test(modelId);
  const callOpts: any = {
    chunk_length_s: 30,
    stride_length_s: 5,
    return_timestamps: true, // BẬT để diarize được
  };
  if (!isEnglishOnly) {
    callOpts.language = options.language;
    callOpts.task = "transcribe";
  }

  // Inference chạy trong Web Worker → main thread rảnh, UI không đơ.
  const out = await runInWorker(pcm, modelId, callOpts, options.onProgress);

  // Khi return_timestamps:true → out có shape { text, chunks: [{text, timestamp}] }
  const anyOut = out as any;
  const text = (anyOut.text || "").trim();
  const chunks = Array.isArray(anyOut.chunks) ? anyOut.chunks : [];
  return { text, chunks, pcm };
}

/**
 * Reset toàn bộ worker pool (vd để đổi model hoặc giải phóng bộ nhớ).
 */
export function resetWhisper() {
  for (const pw of pool) {
    pw.worker.terminate();
    pw.job?.reject(new Error("Whisper pool đã bị reset"));
  }
  pool.length = 0;
  for (const job of queue) job.reject(new Error("Whisper pool đã bị reset"));
  queue.length = 0;
}
