import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import EditorShell from '../components/EditorShell';
import { FieldLabel, TextField, AddItemButton } from '../components/editorPrimitives';

interface DialogueMatchingEditorProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId: string | null;
  questionId: string | null;
}

interface DialogueOption {
  id: string;
  text: string;
}

interface Dialogue {
  id: string;
  question: string;
  options: DialogueOption[];
  correct_answer: string;
}

const newDialogue = (): Dialogue => ({
  id: Date.now().toString(),
  question: '',
  options: [
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' },
  ],
  correct_answer: '',
});

const DialogueMatchingEditor: React.FC<DialogueMatchingEditorProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || 'Dialogue Matching');
  const [dialogues, setDialogues] = useState<Dialogue[]>(
    initialData?.config?.dialogues || [newDialogue()]
  );

  const addDialogue = () => setDialogues([...dialogues, newDialogue()]);
  const removeDialogue = (id: string) =>
    dialogues.length > 1 && setDialogues(dialogues.filter((d) => d.id !== id));

  const updateDialogue = (id: string, field: 'question' | 'correct_answer', value: string) =>
    setDialogues(dialogues.map((d) => (d.id === id ? { ...d, [field]: value } : d)));

  const updateOption = (dialogueId: string, optionId: string, value: string) =>
    setDialogues(
      dialogues.map((d) =>
        d.id === dialogueId
          ? { ...d, options: d.options.map((o) => (o.id === optionId ? { ...o, text: value } : o)) }
          : d
      )
    );

  const addOption = (dialogueId: string) =>
    setDialogues(
      dialogues.map((d) =>
        d.id === dialogueId && d.options.length < 5
          ? { ...d, options: [...d.options, { id: String.fromCharCode(65 + d.options.length), text: '' }] }
          : d
      )
    );

  const removeOption = (dialogueId: string, optionId: string) =>
    setDialogues(
      dialogues.map((d) =>
        d.id === dialogueId && d.options.length > 2
          ? { ...d, options: d.options.filter((o) => o.id !== optionId) }
          : d
      )
    );

  const canSave = dialogues.every(
    (d) =>
      d.question.trim() &&
      d.correct_answer &&
      d.options.every((o) => o.text.trim()) &&
      d.options.some((o) => o.id === d.correct_answer)
  );

  const handleSave = () => {
    if (dialogues.some((d) => !d.question.trim() || !d.correct_answer || d.options.some((o) => !o.text.trim())))
      return alert('Vui lòng điền đầy đủ thông tin cho tất cả các hội thoại!');
    if (dialogues.some((d) => !d.options.some((o) => o.id === d.correct_answer)))
      return alert('Đáp án đúng phải là một trong các lựa chọn!');

    onSave({
      type: 'dialogue_matching',
      title,
      points: dialogues.length,
      config: {
        dialogues: dialogues.map((d) => ({
          question: d.question.trim(),
          options: d.options.map((o) => ({ id: o.id, text: o.text.trim() })),
          correct_answer: d.correct_answer,
        })),
      },
    });
  };

  return (
    <EditorShell
      title="Ghép hội thoại"
      badge="Reading & Writing · Dialogue"
      instruction="Học sinh chọn câu trả lời phù hợp cho mỗi câu hỏi/câu nói. Mỗi hội thoại có 2-5 lựa chọn, chọn 1 đáp án đúng. Phù hợp Movers, Flyers."
      saveDisabled={!canSave}
      onSave={handleSave}
      onCancel={onCancel}
    >
      <div className="space-y-5">
        <div>
          <FieldLabel required>Tiêu đề câu hỏi</FieldLabel>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Chọn câu trả lời phù hợp"
          />
        </div>

        <div>
          <FieldLabel hint={`${dialogues.length} hội thoại`}>Danh sách hội thoại</FieldLabel>
          <div className="space-y-2">
            {dialogues.map((dialogue, index) => (
              <div key={dialogue.id} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Hội thoại {index + 1}
                  </span>
                  {dialogues.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDialogue(dialogue.id)}
                      className="rounded-md p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      aria-label="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <TextField
                    value={dialogue.question}
                    onChange={(e) => updateDialogue(dialogue.id, 'question', e.target.value)}
                    placeholder="Câu hỏi / câu nói (VD: What's your name?)"
                  />

                  {dialogue.options.map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-500">
                        {option.id}
                      </span>
                      <TextField
                        value={option.text}
                        onChange={(e) => updateOption(dialogue.id, option.id, e.target.value)}
                        placeholder={`Câu trả lời ${option.id}`}
                      />
                      {dialogue.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(dialogue.id, option.id)}
                          className="flex-shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          aria-label="Xóa lựa chọn"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  <div className="flex items-center justify-between gap-3">
                    {dialogue.options.length < 5 ? (
                      <button
                        type="button"
                        onClick={() => addOption(dialogue.id)}
                        className="text-xs font-medium text-orange-600 hover:text-orange-700"
                      >
                        + Thêm lựa chọn
                      </button>
                    ) : (
                      <span />
                    )}
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      Đáp án đúng:
                      <select
                        value={dialogue.correct_answer}
                        onChange={(e) => updateDialogue(dialogue.id, 'correct_answer', e.target.value)}
                        className="rounded-md border border-slate-200 px-2 py-1 text-sm focus:border-orange-400 focus:outline-none"
                      >
                        <option value="">--</option>
                        {dialogue.options.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.id}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            ))}
            <AddItemButton onClick={addDialogue} label="Thêm hội thoại" />
          </div>
        </div>
      </div>
    </EditorShell>
  );
};

export default DialogueMatchingEditor;
