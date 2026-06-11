/// <reference lib="webworker" />
/**
 * Whisper Web Worker — chạy inference ONNX ở luồng nền để KHÔNG treo UI.
 *
 * Toàn bộ phần nặng (load model + transcribe) chạy trong worker này.
 * Main thread chỉ decode audio → PCM rồi gửi sang, nhận progress/kết quả về.
 *
 * Giao thức message:
 *   in : { id, pcm: Float32Array, modelId: string, callOpts: object }
 *   out: { type: "progress", info }          — tiến trình tải model
 *        { type: "result", id, out }          — kết quả transcribe
 *        { type: "error",  id, message }       — lỗi
 */
import { pipeline, env, type PipelineType } from "@huggingface/transformers";

// Tải model từ HF Hub + cache vào IndexedDB (giống cấu hình cũ).
env.allowLocalModels = false;
env.useBrowserCache = true;

// Dùng `any` để tránh xung đột type giữa lib "dom" và "webworker".
const ctx: any = self;

let pipePromise: Promise<any> | null = null;
/** Job đang chạy trên worker này (pool đảm bảo 1 job/worker tại 1 thời điểm). */
let currentJobId: number | null = null;

/** Lazy-load pipeline, tái sử dụng cho các lần gọi sau. */
function getPipeline(modelId: string): Promise<any> {
  if (pipePromise) return pipePromise;
  pipePromise = pipeline("automatic-speech-recognition" as PipelineType, modelId, {
    // fp32 cho stable trên ONNX web (quantized hay lỗi missing scale)
    dtype: "fp32",
    progress_callback: (info: any) =>
      ctx.postMessage({ type: "progress", id: currentJobId, info }),
  } as any);
  return pipePromise;
}

ctx.onmessage = async (e: MessageEvent) => {
  const { id, pcm, modelId, callOpts } = e.data || {};
  if (id == null) return;
  currentJobId = id;
  try {
    const pipe = await getPipeline(modelId);
    const out = await pipe(pcm, callOpts);
    ctx.postMessage({ type: "result", id, out });
  } catch (err: any) {
    ctx.postMessage({ type: "error", id, message: err?.message || String(err) });
  } finally {
    currentJobId = null;
  }
};
