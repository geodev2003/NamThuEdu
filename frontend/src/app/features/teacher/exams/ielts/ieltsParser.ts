/**
 * IELTS Exam Smart Parser
 * ───────────────────────
 * Parse text trích xuất từ PDF đề thi IELTS (Academic / General Training)
 * thành payload đúng shape cho 4 editor: Listening / Reading / Writing / Speaking.
 *
 * KHÔNG dùng AI — chỉ regex + heuristic dựa trên cấu trúc cố định của IELTS.
 *
 * Dùng chung type với `services/groqApi.ts` để parent (CreateIeltsExam) nhận
 * data y hệt khi parse offline hoặc qua Groq fallback.
 */

import type {
  IeltsImportSkill,
  IeltsImportTestType,
  IeltsListeningImport,
  IeltsReadingImport,
  IeltsWritingImport,
  IeltsSpeakingImport,
  IeltsSkillImport,
} from "../../../../../services/groqApi";

// ─── Common helpers ──────────────────────────────────────────────────────────

const ABCD = ['A', 'B', 'C', 'D'] as const;
type Letter = typeof ABCD[number];

/** Loại bỏ các marker "=== Page N ===" do IeltsImportModal chèn vào */
const cleanText = (raw: string): string =>
  raw.replace(/=== Page \d+ ===/g, '\n').replace(/\r\n?/g, '\n');

/** Tìm vị trí bắt đầu của mỗi block khớp regex; sort theo vị trí */
const findHeaderPositions = (
  text: string,
  re: RegExp,
): Array<{ num: number; pos: number; raw: string }> => {
  const positions: Array<{ num: number; pos: number; raw: string }> = [];
  // Reset lastIndex để chắc chắn match từ đầu
  re.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    positions.push({ num: parseInt(m[1], 10), pos: m.index, raw: m[0] });
    if (m[0].length === 0) re.lastIndex++;
  }
  return positions.sort((a, b) => a.pos - b.pos);
};

/** Cắt một block text theo positions liền kề */
const sliceBlock = (
  text: string,
  positions: Array<{ pos: number }>,
  i: number,
): string => {
  const start = positions[i].pos;
  const end = i + 1 < positions.length ? positions[i + 1].pos : text.length;
  return text.slice(start, end);
};

interface ParsedMcqQ {
  number: number;
  text: string;
  options: { A?: string; B?: string; C?: string; D?: string };
  correctAnswer: Letter;
}

interface ParsedCompletionQ {
  number: number;
  text: string;
  correctAnswer: string;
}

/**
 * Parse multiple-choice questions từ block text.
 * Heuristic giống vstepParser: dòng "N. ..." mở câu, "A.|B.|C.|D. ..." mở option.
 */
const parseMcqList = (block: string): ParsedMcqQ[] => {
  const lines = block.split('\n');
  const out: ParsedMcqQ[] = [];
  let cur: ParsedMcqQ | null = null;
  let lastOpt: Letter | null = null;
  let mode: 'q' | 'opt' | 'idle' = 'idle';

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { mode = 'idle'; continue; }
    if (isBoundaryLine(line)) { mode = 'idle'; continue; }

    const optMatch = line.match(/^([A-D])[\.\)]\s*(.+)$/);
    const qMatch = line.match(/^(\d+)[\.\)]\s+(.+)/);

    if (optMatch && cur) {
      const letter = optMatch[1] as Letter;
      cur.options[letter] = optMatch[2].trim();
      lastOpt = letter;
      mode = 'opt';
      continue;
    }

    if (qMatch) {
      if (cur) out.push(cur);
      cur = {
        number: parseInt(qMatch[1], 10),
        text: qMatch[2].trim(),
        options: {},
        correctAnswer: 'A',
      };
      lastOpt = null;
      mode = 'q';
      continue;
    }

    if (cur) {
      if (mode === 'q') cur.text += ' ' + line;
      if (mode === 'opt' && lastOpt) cur.options[lastOpt] = (cur.options[lastOpt] || '') + ' ' + line;
    }
  }
  if (cur) out.push(cur);
  // Chỉ giữ câu thực sự có ≥2 options (nếu không sẽ là completion)
  return out.filter(q => Object.values(q.options).filter(Boolean).length >= 2);
};

/**
 * Parse completion-style questions: "N. ........" / "N. _____" / "N. answer goes here"
 * Dùng cho listening / reading completion, sentence completion.
 */
const parseCompletionList = (block: string, startNum?: number, expected?: number): ParsedCompletionQ[] => {
  const lines = block.split('\n');
  const out: ParsedCompletionQ[] = [];
  let cur: ParsedCompletionQ | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (isBoundaryLine(line)) continue;

    const qMatch = line.match(/^(\d+)[\.\)]\s+(.+)/);
    if (qMatch) {
      if (cur) out.push(cur);
      cur = {
        number: parseInt(qMatch[1], 10),
        text: qMatch[2].trim(),
        correctAnswer: '',
      };
      continue;
    }
    if (cur) cur.text += ' ' + line;
  }
  if (cur) out.push(cur);

  if (startNum !== undefined && expected !== undefined) {
    return out.filter(q => q.number >= startNum && q.number < startNum + expected);
  }
  return out;
};

/** Dòng phân cách (boundary) — dừng append vào câu hỏi đang build */
const isBoundaryLine = (line: string): boolean =>
  /^(SECTION|PART)\s+\d+\b/i.test(line) ||
  /^READING\s+PASSAGE\s+\d+\b/i.test(line) ||
  /^PASSAGE\s+\d+\b/i.test(line) ||
  /^TASK\s+\d+\b/i.test(line) ||
  /^WRITING\s+TASK\s+\d+\b/i.test(line) ||
  /^Questions?\s+\d+/i.test(line) ||
  /^Directions?:/i.test(line) ||
  /^(LISTENING|READING|WRITING|SPEAKING)\s*$/i.test(line);

// ─── LISTENING ──────────────────────────────────────────────────────────────

/**
 * IELTS Listening: 4 sections × 10 câu = 40 câu.
 * Section 1: form/note completion (everyday, 2 speakers)
 * Section 2: monologue (everyday) — MCQ / matching / labelling
 * Section 3: 2-4 speakers (academic) — MCQ / matching
 * Section 4: monologue (academic lecture) — note completion
 */
export const parseIeltsListeningFromText = (rawText: string): IeltsListeningImport | null => {
  const text = cleanText(rawText);

  // Detect "PART N" hoặc "SECTION N"
  const positions = findHeaderPositions(text, /^[ \t]*(?:PART|SECTION)[ \t]+([1-4])\b.*$/gim);
  if (positions.length === 0) return null;

  const sections: IeltsListeningImport['sections'] = [];

  for (let i = 0; i < positions.length; i++) {
    const num = positions[i].num as 1 | 2 | 3 | 4;
    if (num < 1 || num > 4) continue;
    const block = sliceBlock(text, positions, i);

    // Cắt phần "ANSWER" / "ANSWERS" cuối nếu có (đáp án sẽ extract riêng)
    const answersIdx = block.search(/^[ \t]*(ANSWERS?|ANSWER\s+KEY)\b/im);
    const body = answersIdx > 0 ? block.slice(0, answersIdx) : block;

    const mcqs = parseMcqList(body);
    const completions = parseCompletionList(body);

    // Merge: ưu tiên MCQ nếu có options, completion cho phần còn lại
    const byNum = new Map<number, IeltsListeningImport['sections'][number]['questions'][number]>();

    for (const q of mcqs) {
      byNum.set(q.number, {
        questionNumber: q.number,
        questionType: 'multiple-choice',
        questionText: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
      });
    }
    for (const q of completions) {
      if (byNum.has(q.number)) continue;
      byNum.set(q.number, {
        questionNumber: q.number,
        questionType: detectCompletionType(q.text),
        questionText: q.text,
        correctAnswer: q.correctAnswer,
      });
    }

    const questions = Array.from(byNum.values()).sort((a, b) => a.questionNumber - b.questionNumber);
    if (questions.length === 0) continue;

    sections.push({
      sectionNumber: num,
      transcript: '',
      questions,
    });
  }

  return sections.length ? { sections } : null;
};

/** Phân loại câu completion dựa trên ký tự blank trong text */
const detectCompletionType = (text: string): string => {
  if (/_{2,}|\.{4,}|\s\(\s*\d+\s*\)/.test(text)) return 'note-completion';
  if (/^[A-Z][a-z]+:/.test(text)) return 'form-completion';
  return 'sentence-completion';
};

// ─── READING ────────────────────────────────────────────────────────────────

/**
 * IELTS Reading: 3 passages × ~13-14 câu = 40 câu.
 * Question types: TFNG, YNNG, MCQ, matching headings, sentence completion, summary completion.
 */
export const parseIeltsReadingFromText = (rawText: string): IeltsReadingImport | null => {
  const text = cleanText(rawText);

  // "READING PASSAGE 1" hoặc "PASSAGE 1" hoặc "Passage 1"
  let positions = findHeaderPositions(
    text,
    /^[ \t]*(?:READING\s+PASSAGE|PASSAGE)[ \t]+([1-3])\b.*$/gim,
  );
  if (positions.length === 0) {
    // Fallback: thử "Part N" cho reading mock
    positions = findHeaderPositions(text, /^[ \t]*PART[ \t]+([1-3])\b.*$/gim);
  }
  if (positions.length === 0) return null;

  const passages: IeltsReadingImport['passages'] = [];

  for (let i = 0; i < positions.length; i++) {
    const num = positions[i].num as 1 | 2 | 3;
    if (num < 1 || num > 3) continue;
    const block = sliceBlock(text, positions, i);
    const lines = block.split('\n');

    // Lấy title: dòng đầu tiên non-empty không phải header
    let title = '';
    let bodyStartLine = 1;
    for (let j = 1; j < Math.min(6, lines.length); j++) {
      const l = lines[j].trim();
      if (!l) continue;
      if (isBoundaryLine(l)) continue;
      title = l;
      bodyStartLine = j + 1;
      break;
    }

    // Tìm dòng đầu tiên của câu hỏi đầu tiên: "N." mà có dấu hiệu list câu hỏi (có "Questions" hoặc options A./B. trong vài dòng tiếp theo, hoặc là line bắt đầu bằng số)
    let firstQ = -1;
    for (let j = bodyStartLine; j < lines.length; j++) {
      const trimmed = lines[j].trim();
      if (!/^\d+[\.\)]\s+/.test(trimmed)) continue;
      // Kiểm tra context: nhìn 2 dòng trước có "Questions" hay không, hoặc 6 dòng sau có A./B./C./D. options không, hoặc text TFNG/YNNG keyword
      const ctxBefore = lines.slice(Math.max(0, j - 5), j).join('\n');
      const ctxAfter = lines.slice(j + 1, Math.min(j + 8, lines.length)).join('\n');
      if (
        /\bQuestions?\s+\d+/i.test(ctxBefore) ||
        /^[A-D][\.\)]\s+/m.test(ctxAfter) ||
        /\b(TRUE|FALSE|NOT GIVEN|YES|NO)\b/.test(ctxAfter)
      ) {
        firstQ = j;
        break;
      }
    }

    let body = '';
    let questions: IeltsReadingImport['passages'][number]['questions'] = [];

    if (firstQ === -1) {
      // Không có câu hỏi → toàn bộ là body
      body = lines.slice(bodyStartLine).join('\n').trim();
    } else {
      body = lines.slice(bodyStartLine, firstQ).join('\n').trim();
      const qBlock = lines.slice(firstQ).join('\n');

      // Detect TFNG / YNNG context
      const isTfng = /\bTRUE\b.*\bFALSE\b.*\bNOT\s+GIVEN\b/is.test(qBlock);
      const isYnng = /\bYES\b.*\bNO\b.*\bNOT\s+GIVEN\b/is.test(qBlock);

      const mcqs = parseMcqList(qBlock);
      const completions = parseCompletionList(qBlock);
      const byNum = new Map<number, IeltsReadingImport['passages'][number]['questions'][number]>();

      for (const q of mcqs) {
        byNum.set(q.number, {
          questionNumber: q.number,
          questionType: 'multiple-choice',
          questionText: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
        });
      }
      for (const q of completions) {
        if (byNum.has(q.number)) continue;
        let qType = 'sentence-completion';
        if (isTfng) qType = 'true-false-not-given';
        else if (isYnng) qType = 'yes-no-not-given';
        else if (/_{2,}|\.{4,}/.test(q.text)) qType = 'summary-completion';
        else if (/^(According to|What|Which|How|Where|Who|Why|When)/i.test(q.text)) qType = 'short-answer';

        byNum.set(q.number, {
          questionNumber: q.number,
          questionType: qType,
          questionText: q.text,
          correctAnswer: q.correctAnswer,
        });
      }

      questions = Array.from(byNum.values()).sort((a, b) => a.questionNumber - b.questionNumber);
    }

    passages.push({
      passageNumber: num,
      title,
      body,
      wordCount: body ? body.split(/\s+/).filter(Boolean).length : 0,
      questions,
    });
  }

  return passages.length ? { passages } : null;
};

// ─── WRITING ────────────────────────────────────────────────────────────────

/**
 * IELTS Writing: Task 1 + Task 2.
 * Academic Task 1: chart/graph/table/diagram description (150 words / 20 min)
 * General Task 1: letter (formal/semi-formal/informal) (150 words / 20 min)
 * Task 2: essay (250 words / 40 min) — opinion/discuss/problem-solution/adv-disadv
 */
export const parseIeltsWritingFromText = (
  rawText: string,
  testType: IeltsImportTestType = 'Academic',
): IeltsWritingImport | null => {
  const text = cleanText(rawText);

  // "TASK 1", "WRITING TASK 1", "Task 1"
  const positions = findHeaderPositions(
    text,
    /^[ \t]*(?:WRITING\s+)?TASK[ \t]+([12])\b.*$/gim,
  );
  if (positions.length === 0) return null;

  const tasks: IeltsWritingImport['tasks'] = [];

  for (let i = 0; i < positions.length; i++) {
    const num = positions[i].num as 1 | 2;
    if (num < 1 || num > 2) continue;
    const block = sliceBlock(text, positions, i);
    const lines = block.split('\n');
    // Bỏ dòng đầu (header), gộp phần còn lại làm prompt
    const prompt = lines.slice(1).join('\n').trim();

    if (num === 1) {
      if (testType === 'Academic') {
        tasks.push({
          taskNumber: 1,
          prompt,
          chartType: detectChartType(prompt),
        });
      } else {
        tasks.push({
          taskNumber: 1,
          prompt,
          tone: detectLetterTone(prompt),
        });
      }
    } else {
      tasks.push({
        taskNumber: 2,
        prompt,
        essayType: detectEssayType(prompt),
      });
    }
  }

  return tasks.length ? { tasks } : null;
};

const detectChartType = (prompt: string): IeltsWritingImport['tasks'][number]['chartType'] => {
  const p = prompt.toLowerCase();
  if (/\bbar\s+(chart|graph)\b/.test(p)) return 'bar';
  if (/\bline\s+(chart|graph)\b/.test(p)) return 'line';
  if (/\bpie\s+chart\b/.test(p)) return 'pie';
  if (/\btable\b/.test(p)) return 'table';
  if (/\bprocess\b|\bdiagram\b/.test(p)) return 'process';
  if (/\bmap\b/.test(p)) return 'map';
  return 'bar';
};

const detectLetterTone = (prompt: string): IeltsWritingImport['tasks'][number]['tone'] => {
  const p = prompt.toLowerCase();
  if (/\bmanager\b|\bcompany\b|\blandlord\b|\bsir\b|\bmadam\b|\bofficial\b/.test(p)) return 'formal';
  if (/\bfriend\b|\bcousin\b|\bbrother\b|\bsister\b/.test(p)) return 'informal';
  return 'semi-formal';
};

const detectEssayType = (prompt: string): IeltsWritingImport['tasks'][number]['essayType'] => {
  const p = prompt.toLowerCase();
  if (/\b(do you agree|to what extent|in your opinion)\b/.test(p)) return 'opinion';
  if (/\bdiscuss both\b|\bboth views\b/.test(p)) return 'discuss';
  if (/\bproblem(s)?\b.*\bsolution(s)?\b|\bcauses?\b.*\bsolution/.test(p)) return 'problem-solution';
  if (/\badvantages?\b.*\bdisadvantages?\b|\bbenefits?\b.*\bdrawbacks?\b/.test(p)) return 'advantages-disadvantages';
  return 'opinion';
};

// ─── SPEAKING ───────────────────────────────────────────────────────────────

/**
 * IELTS Speaking: 3 parts.
 * Part 1: Interview (4-5 min) — short Q about familiar topics, grouped by topic.
 * Part 2: Long turn (3-4 min) — cue card "Describe..." + 4 bullets + follow-up.
 * Part 3: Discussion (4-5 min) — open-ended Q tied to Part 2 theme.
 */
export const parseIeltsSpeakingFromText = (rawText: string): IeltsSpeakingImport | null => {
  const text = cleanText(rawText);

  const positions = findHeaderPositions(text, /^[ \t]*PART[ \t]+([1-3])\b.*$/gim);
  if (positions.length === 0) return null;

  const parts: IeltsSpeakingImport['parts'] = [];

  for (let i = 0; i < positions.length; i++) {
    const num = positions[i].num as 1 | 2 | 3;
    if (num < 1 || num > 3) continue;
    const block = sliceBlock(text, positions, i);

    if (num === 2) {
      const cueCard = parseSpeakingPart2(block);
      if (cueCard) parts.push({ partNumber: 2, cueCard });
    } else {
      const questions = parseSpeakingPart1or3(block);
      if (questions.length > 0) parts.push({ partNumber: num, questions });
    }
  }

  return parts.length ? { parts } : null;
};

const parseSpeakingPart1or3 = (block: string): Array<{ topic?: string; text: string }> => {
  const lines = block.split('\n');
  const out: Array<{ topic?: string; text: string }> = [];
  let currentTopic = '';

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (isBoundaryLine(line)) continue;

    // Topic header: "Topic: X" hoặc "Hometown" / dạng heading ngắn không phải câu hỏi
    const topicMatch = line.match(/^Topic:\s*(.+)$/i);
    if (topicMatch) {
      currentTopic = topicMatch[1].trim();
      continue;
    }
    // Heuristic topic: dòng ngắn không kết thúc bằng "?", không bắt đầu bằng số/bullet, dưới 40 ký tự
    if (
      line.length < 40 &&
      !/[?:]$/.test(line) &&
      !/^[\d\-\u2022•]/.test(line) &&
      !/^(What|How|Where|When|Why|Who|Do|Does|Did|Are|Is|Have|Has|Can|Could|Would|Should|Will)\b/i.test(line)
    ) {
      currentTopic = line;
      continue;
    }

    // Câu hỏi: bắt đầu bằng số, bullet hoặc câu hỏi tiếng Anh
    const numMatch = line.match(/^[\d]+[\.\)]\s+(.+)/);
    const bulletMatch = line.match(/^[\-\u2022•*]\s+(.+)/);
    const qWord = /^(What|How|Where|When|Why|Who|Do|Does|Did|Are|Is|Have|Has|Can|Could|Would|Should|Will|Tell)\b/i.test(line);

    if (numMatch) {
      out.push({ topic: currentTopic || undefined, text: numMatch[1].trim() });
    } else if (bulletMatch) {
      out.push({ topic: currentTopic || undefined, text: bulletMatch[1].trim() });
    } else if (qWord && line.endsWith('?')) {
      out.push({ topic: currentTopic || undefined, text: line });
    } else if (qWord) {
      out.push({ topic: currentTopic || undefined, text: line });
    }
  }

  return out;
};

const parseSpeakingPart2 = (
  block: string,
): { topic: string; bullets: string[]; followUp?: string } => {
  const lines = block.split('\n');
  let topic = '';
  const bullets: string[] = [];
  let followUp = '';

  // Tìm dòng "Describe ..."
  let describeIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    const l = lines[i].trim();
    if (/^Describe\b/i.test(l)) { topic = l; describeIdx = i; break; }
  }
  if (describeIdx === -1) {
    // Không có "Describe" → fallback: dòng đầu non-empty làm topic
    for (let i = 1; i < lines.length; i++) {
      const l = lines[i].trim();
      if (l && !isBoundaryLine(l)) { topic = l; describeIdx = i; break; }
    }
  }

  // Sau topic: tìm "You should say:" và bullets
  let inBullets = false;
  for (let i = describeIdx + 1; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l) continue;
    if (/^You\s+should\s+say:?$/i.test(l)) { inBullets = true; continue; }

    // Bullet line: starts with "- ", "•", "what", "where", "who", "why", "how"
    const bullet = l.match(/^[\-\u2022•*]\s*(.+)/);
    if (bullet) { bullets.push(bullet[1].trim()); continue; }
    if (/^(what|where|when|who|why|how|and explain|and say)\b/i.test(l) && bullets.length < 6) {
      bullets.push(l);
      continue;
    }

    // Follow-up question (kết thúc "?")
    if (l.endsWith('?')) { followUp = l; break; }
    if (/^You\s+will\s+have/i.test(l)) continue; // skip instructions

    // Nếu đã có bullets mà gặp dòng dài → coi là follow-up (nếu không có "?")
    if (inBullets && bullets.length >= 3 && l.length > 30) {
      followUp = l;
      break;
    }
  }

  return {
    topic: topic.replace(/^Describe\s+/i, '').trim() || topic,
    bullets,
    followUp: followUp || undefined,
  };
};

// ─── Combined entry point ──────────────────────────────────────────────────

/**
 * Parse text PDF thành payload đúng shape cho 1 IELTS skill.
 * Trả về `null` nếu không nhận diện được cấu trúc.
 */
export const parseIeltsSkillSmart = (
  rawText: string,
  skill: IeltsImportSkill,
  testType: IeltsImportTestType = 'Academic',
): IeltsSkillImport | null => {
  switch (skill) {
    case 'listening':
      return parseIeltsListeningFromText(rawText);
    case 'reading':
      return parseIeltsReadingFromText(rawText);
    case 'writing':
      return parseIeltsWritingFromText(rawText, testType);
    case 'speaking':
      return parseIeltsSpeakingFromText(rawText);
    default:
      return null;
  }
};


// ─── Quality scoring ────────────────────────────────────────────────────────

export interface QualityResult {
  score: number;     // 0-100
  passed: boolean;   // true nếu kết quả đủ tốt, không cần AI
  issues: string[];  // các vấn đề phát hiện
}

const QUALITY_THRESHOLD = 60; // < 60 thì fallback sang AI

/**
 * Đánh giá chất lượng JSON parse được từ lib regex.
 * Nếu score thấp → nên fallback sang AI.
 */
export const scoreParsedQuality = (
  payload: IeltsSkillImport | null,
  skill: IeltsImportSkill,
): QualityResult => {
  const issues: string[] = [];
  let score = 0;

  if (!payload) {
    return { score: 0, passed: false, issues: ['Không parse được gì'] };
  }

  if (skill === 'listening') {
    const p = payload as IeltsListeningImport;
    const sections = p.sections || [];
    const totalQ = sections.reduce((s, sec) => s + (sec.questions?.length || 0), 0);

    // 4 sections: +40
    if (sections.length === 4) score += 40;
    else { score += sections.length * 8; issues.push(`Chỉ có ${sections.length}/4 sections`); }

    // ≥35 questions tổng: +30
    if (totalQ >= 35) score += 30;
    else if (totalQ >= 25) score += 20;
    else if (totalQ >= 15) score += 10;
    else issues.push(`Chỉ có ${totalQ}/40 câu hỏi`);

    // Mỗi section ≥7 questions: +30 (chia đều 4 sections)
    let goodSections = 0;
    for (const sec of sections) {
      if ((sec.questions?.length || 0) >= 7) goodSections++;
    }
    score += goodSections * 7.5;

    if (sections.length === 0) issues.push('Không nhận diện được section nào');
  }

  else if (skill === 'reading') {
    const p = payload as IeltsReadingImport;
    const passages = p.passages || [];
    const totalQ = passages.reduce((s, pa) => s + (pa.questions?.length || 0), 0);

    // 3 passages: +30
    if (passages.length === 3) score += 30;
    else { score += passages.length * 8; issues.push(`Chỉ có ${passages.length}/3 passages`); }

    // ≥35 questions: +25
    if (totalQ >= 35) score += 25;
    else if (totalQ >= 25) score += 15;
    else issues.push(`Chỉ có ${totalQ}/40 câu hỏi`);

    // Body có nội dung thực sự (wordCount ≥ 200): +15 mỗi passage
    let goodPassages = 0;
    for (const pa of passages) {
      if ((pa.wordCount || 0) >= 200 && pa.body && pa.body.length > 500) goodPassages++;
    }
    score += goodPassages * 15;
    if (goodPassages < passages.length) issues.push('Một vài passage có body quá ngắn');
  }

  else if (skill === 'writing') {
    const p = payload as IeltsWritingImport;
    const tasks = p.tasks || [];

    // 2 tasks: +50
    if (tasks.length === 2) score += 50;
    else { score += tasks.length * 20; issues.push(`Chỉ có ${tasks.length}/2 tasks`); }

    // Prompt đủ dài: +25 mỗi task
    let goodTasks = 0;
    for (const t of tasks) {
      const wordCount = (t.prompt || '').split(/\s+/).filter(Boolean).length;
      if (wordCount >= 25) goodTasks++;
    }
    score += goodTasks * 25;
    if (goodTasks < tasks.length) issues.push('Một vài task có prompt quá ngắn');
  }

  else if (skill === 'speaking') {
    const p = payload as IeltsSpeakingImport;
    const parts = p.parts || [];

    // 3 parts: +40
    if (parts.length === 3) score += 40;
    else { score += parts.length * 12; issues.push(`Chỉ có ${parts.length}/3 parts`); }

    // Part 1 có ≥3 questions: +20
    const part1 = parts.find(pt => pt.partNumber === 1) as any;
    if (part1?.questions && part1.questions.length >= 3) score += 20;
    else issues.push('Part 1 thiếu câu hỏi');

    // Part 2 có cueCard với bullets: +25
    const part2 = parts.find(pt => pt.partNumber === 2) as any;
    if (part2?.cueCard?.topic && part2.cueCard.bullets?.length >= 2) score += 25;
    else issues.push('Part 2 thiếu cue card đầy đủ');

    // Part 3 có ≥3 questions: +15
    const part3 = parts.find(pt => pt.partNumber === 3) as any;
    if (part3?.questions && part3.questions.length >= 3) score += 15;
    else issues.push('Part 3 thiếu câu hỏi');
  }

  score = Math.min(100, Math.round(score));
  return {
    score,
    passed: score >= QUALITY_THRESHOLD,
    issues,
  };
};
