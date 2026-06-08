/**
 * Whisper Local STT — chạy hoàn toàn trong browser, không cần API key.
 * Dùng @huggingface/transformers (transformers.js v3) + ONNX runtime web.
 *
 * Model mặc định: Xenova/whisper-tiny.en (~40MB, tiếng Anh)
 * Lần đầu sẽ download model + cache vào IndexedDB của trình duyệt → các lần sau chạy offline.
 *
 * Hỗ trợ mp3 / wav / m4a / webm / ogg — tự decode về 16kHz mono PCM bằng Web Audio API.
 */
import { pipeline, env, type PipelineType } from "@huggingface/transformers";

// Cho phép tải model từ Hugging Face Hub (default true), tắt local model files
env.allowLocalModels = false;
env.useBrowserCache = true;

// Whisper sample rate yêu cầu = 16000 Hz mono
const WHISPER_SAMPLE_RATE = 16_000;

type Pipe = (
  input: Float32Array | string,
  options?: any
) => Promise<{ text: string } | { text: string }[]>;

let pipePromise: Promise<Pipe> | null = null;

export type ProgressCb = (info: {
  status: string;
  name?: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
}) => void;

/**
 * Lazy-load pipeline. Tái sử dụng instance đã tạo cho các lần gọi sau.
 */
function getPipeline(modelId: string, onProgress?: ProgressCb): Promise<Pipe> {
  if (pipePromise) return pipePromise;
  pipePromise = pipeline(
    "automatic-speech-recognition" as PipelineType,
    modelId,
    {
      // fp32 cho stable trên ONNX web (quantized hay lỗi missing scale)
      dtype: "fp32",
      progress_callback: onProgress as any,
    } as any
  ) as unknown as Promise<Pipe>;
  return pipePromise;
}

/**
 * Decode 1 audio file (bất kỳ format browser hỗ trợ) → Float32Array PCM 16kHz mono.
 */
async function decodeAudioToPCM(file: File | Blob): Promise<Float32Array> {
  const arrayBuf = await file.arrayBuffer();

  // OfflineAudioContext để resample về 16kHz mono
  const tempCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const decoded = await tempCtx.decodeAudioData(arrayBuf.slice(0));
  await tempCtx.close();

  // Nếu đã đúng sample rate + mono thì lấy luôn
  if (decoded.sampleRate === WHISPER_SAMPLE_RATE && decoded.numberOfChannels === 1) {
    return decoded.getChannelData(0).slice();
  }

  // Resample bằng OfflineAudioContext
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

  const pipe = await getPipeline(modelId, options.onProgress);
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

  const out = await pipe(pcm, callOpts);

  // Khi return_timestamps:true → out có shape { text, chunks: [{text, timestamp}] }
  const anyOut = out as any;
  const text = (anyOut.text || "").trim();
  const chunks = Array.isArray(anyOut.chunks) ? anyOut.chunks : [];
  return { text, chunks, pcm };
}

/**
 * Reset pipeline cache (vd để đổi model).
 */
export function resetWhisper() {
  pipePromise = null;
}
