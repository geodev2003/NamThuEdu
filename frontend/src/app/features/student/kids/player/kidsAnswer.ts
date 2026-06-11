/**
 * Tiện ích serialize/parse đáp án cho kids task.
 *
 * Một kids task = MỘT câu hỏi (1 qId) nhưng có thể chứa nhiều "ô" con
 * (vd: 6 chỗ trống, 5 cặp nối). Ta gói tất cả đáp án con thành 1 chuỗi JSON
 * lưu vào saAnswer_text. Backend giải JSON này khi chấm.
 *
 * Quy ước key: dùng index dạng chuỗi ("0","1",...) hoặc gap_id tùy task.
 */

export type KidsAnswerMap = Record<string, string>;

export function parseKidsAnswer(raw: string | undefined | null): KidsAnswerMap {
  if (!raw) return {};
  const trimmed = raw.trim();
  if (!trimmed) return {};
  // Đáp án mới luôn là JSON object. Dữ liệu cũ (text thuần) → bọc vào key "0".
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const out: KidsAnswerMap = {};
        for (const [k, v] of Object.entries(parsed)) out[k] = String(v ?? '');
        return out;
      }
    } catch {
      /* fallthrough */
    }
  }
  return { '0': trimmed };
}

export function serializeKidsAnswer(map: KidsAnswerMap): string {
  const cleaned: KidsAnswerMap = {};
  for (const [k, v] of Object.entries(map)) {
    if (String(v ?? '').trim() !== '') cleaned[k] = v;
  }
  return JSON.stringify(cleaned);
}

/** Đếm số ô con đã được trả lời (>0 nghĩa là câu này đã "động tới"). */
export function countFilled(map: KidsAnswerMap): number {
  return Object.values(map).filter((v) => String(v ?? '').trim() !== '').length;
}

/**
 * Chuẩn hóa đáp án để so khớp (gần giống normalizeAnswer phía backend):
 * lowercase, bỏ khoảng trắng thừa, bỏ dấu câu cơ bản ở 2 đầu.
 */
export function normalize(s: string): string {
  return String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/^[.,!?;:'"]+|[.,!?;:'"]+$/g, '')
    .trim();
}
