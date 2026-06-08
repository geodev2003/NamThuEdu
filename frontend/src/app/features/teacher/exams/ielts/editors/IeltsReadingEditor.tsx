import { useState, useEffect } from "react";
import {
  BookOpen,
  Save,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { IELTS_STRUCTURE, IELTS_READING_QUESTION_TYPES, type IeltsTestType } from "../structure";

interface ReadingQuestion {
  id: string;
  questionNumber: number;
  questionType: string;
  questionText: string;
  options?: { A: string; B: string; C: string; D: string };
  correctAnswer: string;
}

interface ReadingPassage {
  passageNumber: 1 | 2 | 3;
  title: string;
  body: string;
  wordCount: number;
  questions: ReadingQuestion[];
}

interface Props {
  examId?: string;
  testType: IeltsTestType;
  initialData?: any;
  onSave: (data: any) => void;
}

const PASSAGE_QUESTIONS = [13, 13, 14] as const;

const buildEmptyPassage = (n: 1 | 2 | 3): ReadingPassage => {
  const offset = n === 1 ? 0 : n === 2 ? 13 : 26;
  const count = PASSAGE_QUESTIONS[n - 1];
  return {
    passageNumber: n,
    title: "",
    body: "",
    wordCount: 0,
    questions: Array.from({ length: count }, (_, i) => ({
      id: `p${n}-q${offset + i + 1}`,
      questionNumber: offset + i + 1,
      questionType: "multiple-choice",
      questionText: "",
      options: { A: "", B: "", C: "", D: "" },
      correctAnswer: "A",
    })),
  };
};

export function IeltsReadingEditor({ initialData, onSave, testType }: Props) {
  const [passages, setPassages] = useState<ReadingPassage[]>(
    () =>
      initialData?.passages ||
      [1, 2, 3].map((n) => buildEmptyPassage(n as 1 | 2 | 3))
  );
  const [activePassage, setActivePassage] = useState<1 | 2 | 3>(1);

  const current = passages.find((p) => p.passageNumber === activePassage)!;
  const partInfo = IELTS_STRUCTURE.reading.parts[activePassage - 1];

  const updatePassage = (n: number, patch: Partial<ReadingPassage>) => {
    setPassages((prev) =>
      prev.map((p) => (p.passageNumber === n ? { ...p, ...patch } : p))
    );
  };

  const updateQuestion = (
    pNum: number,
    qIdx: number,
    patch: Partial<ReadingQuestion>
  ) => {
    setPassages((prev) =>
      prev.map((p) => {
        if (p.passageNumber !== pNum) return p;
        const questions = [...p.questions];
        questions[qIdx] = { ...questions[qIdx], ...patch };
        return { ...p, questions };
      })
    );
  };

  // Re-count words on body change
  useEffect(() => {
    const wc = current.body.trim().split(/\s+/).filter(Boolean).length;
    if (wc !== current.wordCount) {
      updatePassage(current.passageNumber, { wordCount: wc });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.body]);

  useEffect(() => {
    onSave({ passages });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passages]);

  return (
    <div className="space-y-5">
      {/* Variant note */}
      <div className="rounded-lg bg-emerald-50/50 border border-emerald-200 p-3 text-xs text-emerald-700">
        <strong>{testType}:</strong>{" "}
        {testType === "Academic"
          ? "3 đoạn văn học thuật từ sách báo, tạp chí (700–1100 từ mỗi đoạn)."
          : "Section 1: văn bản đời sống. Section 2: văn bản công sở. Section 3: bài đọc dài về chủ đề chung."}
      </div>

      {/* Passage tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          {passages.map((p) => {
            const isActive = p.passageNumber === activePassage;
            const filledQs = p.questions.filter((q) => q.questionText.trim()).length;
            const hasBody = p.body.trim().length > 50;
            return (
              <button
                key={p.passageNumber}
                type="button"
                onClick={() => setActivePassage(p.passageNumber)}
                className="px-4 py-3 text-left transition-all cursor-pointer"
                style={{
                  background: isActive ? "#ECFDF5" : "#FFFFFF",
                  borderBottom: isActive ? "3px solid #10B981" : "3px solid transparent",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-xs font-bold"
                    style={{ color: isActive ? "#047857" : "#6B7280" }}
                  >
                    Passage {p.passageNumber}
                  </span>
                  {hasBody && filledQs === p.questions.length && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                  <FileText className="w-3 h-3" />
                  <span className={hasBody ? "text-emerald-600 font-medium" : ""}>
                    {hasBody ? `${p.wordCount} từ` : "Chưa có text"}
                  </span>
                  <span className="text-gray-300">·</span>
                  <span>
                    {filledQs}/{p.questions.length} câu
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Passage editor */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              {partInfo.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{partInfo.description}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600 tabular-nums">
              {current.wordCount}
              <span className="text-sm text-gray-400 font-normal"> từ</span>
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">
              khuyến nghị 700–1100
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="mb-3">
          <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
            Tiêu đề bài đọc
          </label>
          <input
            type="text"
            value={current.title}
            onChange={(e) => updatePassage(activePassage, { title: e.target.value })}
            placeholder={`VD: ${
              activePassage === 1 ? "The History of Coffee" : activePassage === 2 ? "Modern Architecture" : "Climate Change Research"
            }`}
            className="w-full px-3 py-2 text-sm font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
            Nội dung bài đọc
          </label>
          <textarea
            value={current.body}
            onChange={(e) => updatePassage(activePassage, { body: e.target.value })}
            placeholder="Dán nội dung bài đọc IELTS Reading vào đây..."
            rows={14}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 leading-relaxed font-serif"
          />
          <p className="text-[11px] text-gray-500 mt-1">
            {current.wordCount < 700 && current.wordCount > 0 && (
              <span className="text-amber-600 font-medium">
                Bài đọc hơi ngắn ({current.wordCount} từ). Khuyến nghị ≥ 700 từ.
              </span>
            )}
            {current.wordCount >= 700 && current.wordCount <= 1100 && (
              <span className="text-emerald-600 font-medium">
                Độ dài phù hợp ({current.wordCount} từ).
              </span>
            )}
            {current.wordCount > 1100 && (
              <span className="text-amber-600 font-medium">
                Bài đọc hơi dài ({current.wordCount} từ).
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-gray-900">
            Câu hỏi {current.questions[0].questionNumber} –{" "}
            {current.questions[current.questions.length - 1].questionNumber}
          </h4>
          <span className="text-xs text-gray-500">
            {current.questions.length} câu / passage
          </span>
        </div>

        <div className="space-y-3">
          {current.questions.map((q, idx) => (
            <ReadingQuestionRow
              key={q.id}
              question={q}
              onChange={(patch) => updateQuestion(activePassage, idx, patch)}
            />
          ))}
        </div>
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-end bg-white rounded-2xl border border-gray-200 p-4 sticky bottom-0">
        <button
          type="button"
          onClick={() => onSave({ passages })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Lưu Reading
        </button>
      </div>
    </div>
  );
}

function ReadingQuestionRow({
  question,
  onChange,
}: {
  question: ReadingQuestion;
  onChange: (patch: Partial<ReadingQuestion>) => void;
}) {
  const isMcq = question.questionType === "multiple-choice";
  const isTrueFalse = ["true-false-not-given", "yes-no-not-given"].includes(
    question.questionType
  );
  return (
    <div className="rounded-xl border border-gray-200 p-3 hover:border-emerald-300 transition-all">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
          {question.questionNumber}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <select
            value={question.questionType}
            onChange={(e) => onChange({ questionType: e.target.value })}
            className="text-xs font-medium px-2 py-1 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {IELTS_READING_QUESTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <textarea
            value={question.questionText}
            onChange={(e) => onChange({ questionText: e.target.value })}
            placeholder="Nội dung câu hỏi (statement / question)..."
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
          />

          {isMcq && question.options ? (
            <div className="grid grid-cols-2 gap-2">
              {(["A", "B", "C", "D"] as const).map((k) => (
                <label
                  key={k}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md border border-gray-200 hover:border-emerald-300 transition-all cursor-pointer text-xs"
                  style={{
                    background: question.correctAnswer === k ? "#ECFDF5" : "#FFFFFF",
                    borderColor: question.correctAnswer === k ? "#86EFAC" : "#E5E7EB",
                  }}
                >
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={question.correctAnswer === k}
                    onChange={() => onChange({ correctAnswer: k })}
                    className="w-3.5 h-3.5 accent-emerald-500"
                  />
                  <span className="font-bold text-gray-700">{k}.</span>
                  <input
                    type="text"
                    value={question.options![k]}
                    onChange={(e) =>
                      onChange({
                        options: { ...question.options!, [k]: e.target.value },
                      })
                    }
                    placeholder={`Đáp án ${k}`}
                    className="flex-1 bg-transparent text-xs outline-none"
                  />
                </label>
              ))}
            </div>
          ) : isTrueFalse ? (
            <div className="flex flex-wrap gap-2">
              {(question.questionType === "true-false-not-given"
                ? ["TRUE", "FALSE", "NOT GIVEN"]
                : ["YES", "NO", "NOT GIVEN"]
              ).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChange({ correctAnswer: opt })}
                  className="px-3 py-1.5 rounded-md border text-xs font-bold transition-all cursor-pointer"
                  style={{
                    background: question.correctAnswer === opt ? "#10B981" : "#FFFFFF",
                    color: question.correctAnswer === opt ? "#FFFFFF" : "#6B7280",
                    borderColor: question.correctAnswer === opt ? "#10B981" : "#E5E7EB",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={question.correctAnswer}
              onChange={(e) => onChange({ correctAnswer: e.target.value })}
              placeholder="Đáp án đúng (từ/cụm từ trong bài)..."
              className="w-full px-3 py-2 text-sm border border-emerald-200 bg-emerald-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default IeltsReadingEditor;
