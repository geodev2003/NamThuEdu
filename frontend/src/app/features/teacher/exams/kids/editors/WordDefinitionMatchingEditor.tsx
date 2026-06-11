import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import EditorShell from '../components/EditorShell';
import { FieldLabel, TextField, AddItemButton } from '../components/editorPrimitives';

interface WordDefinitionMatchingEditorProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  examId: string | null;
  questionId: string | null;
}

interface WordItem {
  id: string;
  word: string;
  definition: string;
}

const WordDefinitionMatchingEditor: React.FC<WordDefinitionMatchingEditorProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || 'Ghép Từ Với Định Nghĩa');
  const [words, setWords] = useState<WordItem[]>(
    initialData?.config?.words || [
      { id: '1', word: '', definition: '' },
      { id: '2', word: '', definition: '' },
      { id: '3', word: '', definition: '' },
      { id: '4', word: '', definition: '' },
      { id: '5', word: '', definition: '' },
    ]
  );

  const addWord = () => {
    if (words.length >= 15) return alert('Tối đa 15 từ!');
    setWords([...words, { id: Date.now().toString(), word: '', definition: '' }]);
  };

  const removeWord = (wordId: string) => {
    if (words.length <= 5) return alert('Phải có ít nhất 5 từ!');
    setWords(words.filter((w) => w.id !== wordId));
  };

  const updateWord = (wordId: string, field: 'word' | 'definition', value: string) =>
    setWords(words.map((w) => (w.id === wordId ? { ...w, [field]: value } : w)));

  const canSave = words.every((w) => w.word.trim() && w.definition.trim()) && words.length >= 5;

  const handleSave = () => {
    if (words.some((w) => !w.word.trim())) return alert('Vui lòng nhập đầy đủ tất cả các từ!');
    if (words.some((w) => !w.definition.trim()))
      return alert('Vui lòng nhập đầy đủ tất cả các định nghĩa!');
    if (words.length < 5) return alert('Phải có ít nhất 5 từ!');

    onSave({
      type: 'word_definition_matching',
      title,
      config: {
        words: words.map((w) => ({ word: w.word.trim(), definition: w.definition.trim() })),
      },
      points: words.length,
    });
  };

  return (
    <EditorShell
      title="Ghép từ với định nghĩa"
      badge="Reading & Writing · Matching"
      instruction="Học sinh ghép mỗi từ với định nghĩa phù hợp. Movers: 5-8 từ · Flyers: 10-15 từ (có thể có từ nhiễu). Tối thiểu 5, tối đa 15 từ."
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
            placeholder="VD: Ghép từ với nghĩa đúng"
          />
        </div>

        <div>
          <FieldLabel hint={`${words.length} từ (5-15)`}>Danh sách từ & định nghĩa</FieldLabel>
          <div className="space-y-2">
            {words.map((word, index) => (
              <div key={word.id} className="flex items-center gap-2">
                <span className="w-5 flex-shrink-0 text-sm font-semibold text-slate-400">
                  {index + 1}.
                </span>
                <TextField
                  value={word.word}
                  onChange={(e) => updateWord(word.id, 'word', e.target.value)}
                  placeholder="Từ (VD: elephant)"
                />
                <TextField
                  value={word.definition}
                  onChange={(e) => updateWord(word.id, 'definition', e.target.value)}
                  placeholder="Định nghĩa (VD: A big animal with a long nose)"
                />
                {words.length > 5 && (
                  <button
                    type="button"
                    onClick={() => removeWord(word.id)}
                    className="flex-shrink-0 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    aria-label="Xóa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            {words.length < 15 && <AddItemButton onClick={addWord} label="Thêm từ" />}
          </div>
        </div>
      </div>
    </EditorShell>
  );
};

export default WordDefinitionMatchingEditor;
