/**
 * Shared sub-components dùng chung cho các section editor.
 */
import { Trash2 } from 'lucide-react';
import { THPT_THEME } from '../sections';

export function QuestionBadge({ n }: { n: number }) {
  return (
    <span
      className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-white text-xs font-bold flex-shrink-0"
      style={{ backgroundColor: THPT_THEME.primary }}
    >
      {n}
    </span>
  );
}

export function DeleteBtn({ onClick, title = 'Xoá' }: { onClick: () => void; title?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer p-1.5 rounded-md hover:bg-red-50 flex-shrink-0"
      title={title}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

export function AddButton({
  onClick,
  label,
  disabled,
}: {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 bg-white text-slate-500 hover:text-blue-600 py-3 font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      + {label}
    </button>
  );
}

/** Section header với title + instructions editable */
export function SectionHeader({
  title,
  instructions,
  hint,
  onTitleChange,
  onInstructionsChange,
}: {
  title: string;
  instructions: string;
  hint?: string;
  onTitleChange: (v: string) => void;
  onInstructionsChange: (v: string) => void;
}) {
  return (
    <div className="rounded-2xl p-5 bg-white border border-slate-200">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full text-lg font-bold text-slate-900 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-md px-1 -ml-1"
        placeholder="Tiêu đề phần"
      />
      {hint && <p className="text-sm text-slate-500 mt-0.5">{hint}</p>}
      <textarea
        value={instructions}
        onChange={(e) => onInstructionsChange(e.target.value)}
        placeholder="Hướng dẫn cho học viên..."
        rows={2}
        className="mt-3 w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}

/** A/B/C/D option picker — bấm để chọn đáp án đúng */
export function OptionRow({
  letter,
  text,
  isCorrect,
  onPick,
  onTextChange,
  placeholder,
}: {
  letter: string;
  text: string;
  isCorrect: boolean;
  onPick: () => void;
  onTextChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border p-2 transition-colors ${
        isCorrect ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-slate-50/50'
      }`}
    >
      <button
        type="button"
        onClick={onPick}
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
          isCorrect ? 'text-white' : 'bg-white border border-slate-300 text-slate-500 hover:border-blue-400'
        }`}
        style={isCorrect ? { backgroundColor: THPT_THEME.success } : {}}
        title="Chọn làm đáp án đúng"
      >
        {letter}
      </button>
      <input
        type="text"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={placeholder ?? `Phương án ${letter}`}
        className="flex-1 min-w-0 text-sm bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-md px-2 py-1"
      />
    </div>
  );
}
