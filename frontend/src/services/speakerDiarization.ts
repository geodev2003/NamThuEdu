/**
 * Speaker diarization 2-speaker (heuristic, browser-only, free).
 *
 * Cách làm:
 *  1. Đầu vào: AudioBuffer (đã decode 16kHz mono) + chunks có timestamps từ Whisper
 *  2. Mỗi chunk → extract median pitch (Hz) bằng autocorrelation
 *  3. K-means K=2 trên pitches → 2 cluster (giọng trầm vs cao)
 *  4. Assign nhãn 'A' (xuất hiện trước) / 'B' cho từng chunk
 *
 * Phù hợp khi:
 *   • 2 speakers giọng khác biệt (nam-nữ, hoặc rõ trầm-cao)
 *   • IELTS Listening Part 1 + Part 3
 *
 * Hạn chế:
 *   • 2 giọng cùng giới giống nhau → accuracy thấp
 *   • Tiếng ồn/nhạc nền có thể gây nhiễu pitch
 */

export interface RawChunk {
  text: string;
  /** [start_seconds, end_seconds] */
  timestamp: [number, number] | [number, null];
}

export interface DiarizedChunk {
  text: string;
  start: number;
  end: number;
  speaker: "A" | "B";
  pitch: number; // Hz, để debug
}

const SAMPLE_RATE = 16_000;
const MIN_PITCH_HZ = 70; // ~thấp nhất giọng nam
const MAX_PITCH_HZ = 400; // ~cao nhất giọng nữ
const MIN_RMS = 0.005; // bỏ qua đoạn quá im lặng

/**
 * Autocorrelation pitch detection cho 1 đoạn samples.
 * Return Hz hoặc 0 nếu không detect được.
 */
function detectPitch(samples: Float32Array, sampleRate: number): number {
  // Bỏ đoạn quá im lặng (RMS thấp)
  let sumSq = 0;
  for (let i = 0; i < samples.length; i++) sumSq += samples[i] * samples[i];
  const rms = Math.sqrt(sumSq / samples.length);
  if (rms < MIN_RMS) return 0;

  const minLag = Math.floor(sampleRate / MAX_PITCH_HZ);
  const maxLag = Math.floor(sampleRate / MIN_PITCH_HZ);
  if (maxLag >= samples.length) return 0;

  // Autocorrelation chỉ tính ở range lag quan tâm — nhanh hơn full ACF
  let bestLag = 0;
  let bestCorr = 0;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let corr = 0;
    const len = samples.length - lag;
    for (let i = 0; i < len; i++) corr += samples[i] * samples[i + lag];
    corr /= len;
    if (corr > bestCorr) {
      bestCorr = corr;
      bestLag = lag;
    }
  }
  if (bestLag === 0) return 0;
  return sampleRate / bestLag;
}

/**
 * Lấy median pitch của 1 segment audio bằng cách sample nhiều khung 30ms.
 */
function medianPitchOfSegment(
  pcm: Float32Array,
  startSec: number,
  endSec: number,
  sampleRate: number
): number {
  const startIdx = Math.max(0, Math.floor(startSec * sampleRate));
  const endIdx = Math.min(pcm.length, Math.floor(endSec * sampleRate));
  if (endIdx - startIdx < sampleRate * 0.1) return 0; // đoạn <100ms thì bỏ

  const frameSize = Math.floor(sampleRate * 0.03); // 30ms frame
  const hopSize = Math.floor(sampleRate * 0.015); // 15ms hop
  const pitches: number[] = [];

  for (let i = startIdx; i + frameSize < endIdx; i += hopSize) {
    const frame = pcm.subarray(i, i + frameSize);
    const p = detectPitch(frame, sampleRate);
    if (p >= MIN_PITCH_HZ && p <= MAX_PITCH_HZ) pitches.push(p);
  }

  if (pitches.length === 0) return 0;
  pitches.sort((a, b) => a - b);
  return pitches[Math.floor(pitches.length / 2)];
}

/**
 * 1D K-means K=2 đơn giản. Trả về 2 centroids đã sort tăng dần.
 */
function kmeans2(values: number[]): { low: number; high: number } {
  if (values.length === 0) return { low: 0, high: 0 };
  if (values.length === 1) return { low: values[0], high: values[0] };

  // Init: centroid 1 = min, centroid 2 = max
  let c1 = Math.min(...values);
  let c2 = Math.max(...values);
  if (c1 === c2) return { low: c1, high: c2 };

  for (let iter = 0; iter < 20; iter++) {
    const cluster1: number[] = [];
    const cluster2: number[] = [];
    for (const v of values) {
      if (Math.abs(v - c1) < Math.abs(v - c2)) cluster1.push(v);
      else cluster2.push(v);
    }
    const newC1 = cluster1.length
      ? cluster1.reduce((a, b) => a + b, 0) / cluster1.length
      : c1;
    const newC2 = cluster2.length
      ? cluster2.reduce((a, b) => a + b, 0) / cluster2.length
      : c2;
    if (Math.abs(newC1 - c1) < 0.5 && Math.abs(newC2 - c2) < 0.5) break;
    c1 = newC1;
    c2 = newC2;
  }
  return c1 < c2 ? { low: c1, high: c2 } : { low: c2, high: c1 };
}

/**
 * Diarize chunks: gán mỗi chunk speaker 'A' hoặc 'B' dựa theo pitch.
 *
 * @param pcm    Audio đã decode về 16kHz mono (Float32Array)
 * @param chunks Whisper chunks với timestamps [start, end] (seconds)
 */
export function diarizeChunks(
  pcm: Float32Array,
  chunks: RawChunk[]
): DiarizedChunk[] {
  // 1. Tính median pitch cho mỗi chunk
  const withPitch = chunks.map((c) => {
    const start = c.timestamp[0] ?? 0;
    const end = c.timestamp[1] ?? start + 1;
    const pitch = medianPitchOfSegment(pcm, start, end, SAMPLE_RATE);
    return { text: c.text.trim(), start, end, pitch };
  });

  // 2. Cluster chỉ trên các chunk có pitch hợp lệ
  const validPitches = withPitch
    .map((c) => c.pitch)
    .filter((p) => p >= MIN_PITCH_HZ && p <= MAX_PITCH_HZ);

  if (validPitches.length < 2) {
    // Không đủ data → tất cả gán 'A'
    return withPitch.map((c) => ({ ...c, speaker: "A" as const }));
  }

  const { low, high } = kmeans2(validPitches);

  // 3. Heuristic: Nếu khoảng cách 2 centroid quá nhỏ (<25Hz) thì coi như chỉ 1 speaker
  const SAME_VOICE_THRESHOLD = 25;
  const oneSpeaker = high - low < SAME_VOICE_THRESHOLD;

  // 4. Assign speaker label. Speaker xuất hiện trước = 'A'
  let firstClusterIsLow: boolean | null = null;
  return withPitch.map((c) => {
    if (oneSpeaker || c.pitch === 0) {
      // Không xác định được → kế thừa speaker trước, hoặc default 'A'
      return { ...c, speaker: "A" as const };
    }
    const isLow =
      Math.abs(c.pitch - low) < Math.abs(c.pitch - high);

    if (firstClusterIsLow === null) firstClusterIsLow = isLow;

    // Speaker có cluster đầu tiên = 'A'
    const speaker: "A" | "B" =
      isLow === firstClusterIsLow ? "A" : "B";
    return { ...c, speaker };
  });
}

/**
 * Format diarized chunks thành text dạng "A: ... / B: ..." cho transcript.
 * Gộp các chunk liên tiếp cùng speaker thành 1 đoạn.
 */
export function formatDiarizedTranscript(diarized: DiarizedChunk[]): string {
  if (diarized.length === 0) return "";
  const lines: string[] = [];
  let currentSpeaker = diarized[0].speaker;
  let buffer: string[] = [];

  const flush = () => {
    if (buffer.length === 0) return;
    lines.push(`${currentSpeaker}: ${buffer.join(" ").replace(/\s+/g, " ").trim()}`);
    buffer = [];
  };

  for (const c of diarized) {
    if (c.speaker !== currentSpeaker) {
      flush();
      currentSpeaker = c.speaker;
    }
    buffer.push(c.text);
  }
  flush();
  return lines.join("\n");
}
