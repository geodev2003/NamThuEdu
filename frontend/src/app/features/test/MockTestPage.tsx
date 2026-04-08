import { useState, useMemo } from "react";
import { 
  BookOpen, Bookmark, BookmarkCheck, Mic 
} from "lucide-react";

// VSTEP Structure
const VSTEP_STRUCTURE = {
  listening: {
    name: "Listening",
    icon: "🎧",
    color: "#3B82F6",
    lightBg: "#DBEAFE",
    parts: [
      { part: 1, name: "Announcements", questions: 8 },
      { part: 2, name: "Dialogues", questions: 12 },
      { part: 3, name: "Lectures", questions: 15 },
    ],
  },
  reading: {
    name: "Reading",
    icon: "📖",
    color: "#10B981",
    lightBg: "#D1FAE5",
    parts: [
      { part: 1, name: "Passage 1", questions: 10 },
      { part: 2, name: "Passage 2", questions: 10 },
      { part: 3, name: "Passage 3", questions: 10 },
      { part: 4, name: "Passage 4", questions: 10 },
    ],
  },
  writing: {
    name: "Writing",
    icon: "✍️",
    color: "#F59E0B",
    lightBg: "#FEF3C7",
    parts: [
      { part: 1, name: "Task 1", questions: 1, minWords: 150 },
      { part: 2, name: "Task 2", questions: 1, minWords: 250 },
    ],
  },
  speaking: {
    name: "Speaking",
    icon: "🗣️",
    color: "#8B5CF6",
    lightBg: "#EDE9FE",
    parts: [
      { part: 1, name: "Social Interaction", questions: 1 },
      { part: 2, name: "Solution Discussion", questions: 1 },
      { part: 3, name: "Topic Development", questions: 1 },
    ],
  },
};

type SkillType = keyof typeof VSTEP_STRUCTURE;

// Mock questions generator
const generateMockQuestions = () => {
  const questions: any[] = [];
  let qId = 1;

  // Listening
  for (let part = 1; part <= 3; part++) {
    const count = VSTEP_STRUCTURE.listening.parts[part - 1].questions;
    for (let i = 0; i < count; i++) {
      questions.push({
        id: `l${part}-${i + 1}`,
        qId: qId++,
        skill: "listening",
        part,
        content: `Question ${i + 1}: What is the main topic?`,
        options: [
          { id: "a", label: "A", content: "Option A" },
          { id: "b", label: "B", content: "Option B" },
          { id: "c", label: "C", content: "Option C" },
          { id: "d", label: "D", content: "Option D" },
        ],
      });
    }
  }

  // Reading
  for (let part = 1; part <= 4; part++) {
    const count = VSTEP_STRUCTURE.reading.parts[part - 1].questions;
    for (let i = 0; i < count; i++) {
      questions.push({
        id: `r${part}-${i + 1}`,
        qId: qId++,
        skill: "reading",
        part,
        passage: `<p><strong>Passage ${part}</strong></p><p>This is a sample reading passage...</p>`,
        content: `Question ${i + 1}: According to the passage...`,
        options: [
          { id: "a", label: "A", content: "First option" },
          { id: "b", label: "B", content: "Second option" },
          { id: "c", label: "C", content: "Third option" },
          { id: "d", label: "D", content: "Fourth option" },
        ],
      });
    }
  }

  // Writing
  questions.push({
    id: "w1-1",
    qId: qId++,
    skill: "writing",
    part: 1,
    content: "Write an email (150 words minimum)",
    minWords: 150,
  });

  questions.push({
    id: "w2-1",
    qId: qId++,
    skill: "writing",
    part: 2,
    content: "Write an essay (250 words minimum)",
    minWords: 250,
  });

  // Speaking
  questions.push({
    id: "s1-1",
    qId: qId++,
    skill: "speaking",
    part: 1,
    content: "Part 1: Social Interaction (3 minutes)",
  });

  questions.push({
    id: "s2-1",
    qId: qId++,
    skill: "speaking",
    part: 2,
    content: "Part 2: Solution Discussion (4 minutes)",
  });

  questions.push({
    id: "s3-1",
    qId: qId++,
    skill: "speaking",
    part: 3,
    content: "Part 3: Topic Development (5 minutes)",
  });

  return questions;
};

function formatClock(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function MockTestPage() {
  const [currentSkill, setCurrentSkill] = useState<SkillType>("listening");
  const [currentPart, setCurrentPart] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [timeLeft] = useState(179 * 60);

  const questions = useMemo(() => generateMockQuestions(), []);

  const currentPartQuestions = useMemo(
    () => questions.filter((q: any) => q.skill === currentSkill && q.part === currentPart),
    [questions, currentSkill, currentPart]
  );

  const answeredCount = useMemo(
    () => Object.keys(answers).filter((k) => String(answers[k] ?? "").trim() !== "").length,
    [answers]
  );

  const getPartAnsweredCount = (skill: SkillType, part: number) => {
    const partQuestions = questions.filter((q: any) => q.skill === skill && q.part === part);
    return partQuestions.filter((q: any) => String(answers[q.id] ?? "").trim() !== "").length;
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const toggleBookmark = (questionId: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const skillData = VSTEP_STRUCTURE[currentSkill];

  return (
    <div className="min-h-screen bg-gray-100 pb-48">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-gray-200 px-4 lg:px-6 shadow-sm">
        <div className="h-full max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-semibold text-gray-800">VSTEP B2 - Mock Test (Demo)</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Đã trả lời: <span className="font-bold text-gray-900">{answeredCount}/{questions.length}</span>
            </div>
            <div className="px-4 py-1.5 rounded-lg bg-blue-500 text-white font-mono font-bold text-lg">
              {formatClock(timeLeft)}
            </div>
            <button
              onClick={() => alert("Chức năng nộp bài (demo)")}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition"
            >
              Nộp bài
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
            <div className="flex gap-6">
              {/* Main Content */}
              <div className="flex-1">
                {/* Part Banner */}
                <div 
                  className="rounded-lg p-4 mb-6"
                  style={{ background: skillData.lightBg, borderLeft: `4px solid ${skillData.color}` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{skillData.icon}</span>
                    <div>
                      <h2 className="font-bold text-lg" style={{ color: skillData.color }}>
                        {skillData.name} - Part {currentPart}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {skillData.parts.find(p => p.part === currentPart)?.name} • {currentPartQuestions.length} câu hỏi
                      </p>
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-6">
                  {currentPartQuestions.map((question: any, index: number) => {
                    const qKey = question.id;
                    const selected = answers[qKey] ?? "";
                    const isBookmarked = bookmarks.has(qKey);

                    // Multiple Choice
                    if (currentSkill === "listening" || currentSkill === "reading") {
                      return (
                        <div key={qKey} className="border border-gray-200 rounded-lg p-5">
                          <div className="flex items-start justify-between mb-3">
                            <h3 
                              className="text-base font-bold text-gray-800 flex-1" 
                              dangerouslySetInnerHTML={{ __html: question.content }} 
                            />
                            <button
                              onClick={() => toggleBookmark(qKey)}
                              className="ml-3 p-1.5 rounded hover:bg-gray-100 transition"
                            >
                              {isBookmarked ? (
                                <BookmarkCheck className="w-5 h-5 text-amber-500" />
                              ) : (
                                <Bookmark className="w-5 h-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                          <div className="space-y-2">
                            {question.options.map((opt: any) => (
                              <label
                                key={opt.id}
                                className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition"
                                style={{
                                  background: selected === opt.id ? skillData.lightBg : "#F9FAFB",
                                  border: `2px solid ${selected === opt.id ? skillData.color : "#E5E7EB"}`,
                                }}
                              >
                                <input
                                  type="radio"
                                  className="mt-1"
                                  checked={selected === opt.id}
                                  onChange={() => handleAnswerChange(qKey, opt.id)}
                                />
                                <span>{opt.label}. {opt.content}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    // Writing
                    if (currentSkill === "writing") {
                      const minWords = question.minWords || 150;
                      const wordCount = selected.trim().split(/\s+/).filter(Boolean).length;

                      return (
                        <div key={qKey} className="border border-gray-200 rounded-lg p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-base font-bold text-gray-800 mb-2">Task {currentPart}</h3>
                              <p className="text-sm text-gray-600">{question.content}</p>
                            </div>
                            <button
                              onClick={() => toggleBookmark(qKey)}
                              className="ml-3 p-1.5 rounded hover:bg-gray-100 transition"
                            >
                              {isBookmarked ? (
                                <BookmarkCheck className="w-5 h-5 text-amber-500" />
                              ) : (
                                <Bookmark className="w-5 h-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                          <div className="mb-2 text-sm">
                            <span className={wordCount >= minWords ? "text-green-600 font-semibold" : "text-gray-600"}>
                              {wordCount} từ
                            </span>
                            <span className="text-gray-400"> / {minWords} từ tối thiểu</span>
                          </div>
                          <textarea
                            value={selected}
                            onChange={(e) => handleAnswerChange(qKey, e.target.value)}
                            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Nhập câu trả lời của bạn..."
                          />
                        </div>
                      );
                    }

                    // Speaking
                    if (currentSkill === "speaking") {
                      return (
                        <div key={qKey} className="border border-gray-200 rounded-lg p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-base font-bold text-gray-800 mb-2">Part {currentPart}</h3>
                              <p className="text-sm text-gray-600">{question.content}</p>
                            </div>
                            <button
                              onClick={() => toggleBookmark(qKey)}
                              className="ml-3 p-1.5 rounded hover:bg-gray-100 transition"
                            >
                              {isBookmarked ? (
                                <BookmarkCheck className="w-5 h-5 text-amber-500" />
                              ) : (
                                <Bookmark className="w-5 h-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                            <button className="p-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition">
                              <Mic className="w-5 h-5" />
                            </button>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-800">Nhấn để ghi âm</p>
                              <p className="text-xs text-gray-500">Bạn có thể ghi âm nhiều lần</p>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>

              {/* Right Sidebar - Question Navigator */}
              <div className="w-64 flex-shrink-0">
                <div className="sticky top-24 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-sm text-gray-800 mb-3">Danh sách câu hỏi</h3>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {currentPartQuestions.map((q: any, idx: number) => {
                      const qid = q.id;
                      const isAnswered = String(answers[qid] ?? "").trim() !== "";
                      const isBookmarked = bookmarks.has(qid);

                      return (
                        <button
                          key={qid}
                          className="w-10 h-10 rounded-lg font-semibold text-sm transition relative"
                          style={{
                            background: isAnswered ? "#10B981" : "#E5E7EB",
                            color: isAnswered ? "#FFFFFF" : "#6B7280",
                          }}
                        >
                          {idx + 1}
                          {isBookmarked && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-500" />
                      <span className="text-gray-600">Đã trả lời</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gray-300" />
                      <span className="text-gray-600">Chưa trả lời</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-500" />
                      <span className="text-gray-600">Đánh dấu</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-4">
          {/* Skill Tabs */}
          <div className="mb-3">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(Object.keys(VSTEP_STRUCTURE) as SkillType[]).map((skill) => {
                const data = VSTEP_STRUCTURE[skill];
                const isActive = currentSkill === skill;
                return (
                  <button
                    key={skill}
                    onClick={() => {
                      setCurrentSkill(skill);
                      setCurrentPart(1);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition whitespace-nowrap"
                    style={{
                      background: isActive ? data.lightBg : "#F9FAFB",
                      color: isActive ? data.color : "#6B7280",
                      border: `2px solid ${isActive ? data.color : "transparent"}`,
                    }}
                  >
                    <span className="text-lg">{data.icon}</span>
                    <span>{data.name.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Part Tabs */}
          <div>
            <div className="flex gap-2 overflow-x-auto">
              {skillData.parts.map((partData) => {
                const isActive = currentPart === partData.part;
                const answeredInPart = getPartAnsweredCount(currentSkill, partData.part);
                const totalInPart = partData.questions;

                return (
                  <button
                    key={partData.part}
                    onClick={() => setCurrentPart(partData.part)}
                    className="flex flex-col items-start px-4 py-2.5 rounded-lg font-semibold text-sm transition min-w-[140px]"
                    style={{
                      background: isActive ? skillData.lightBg : "#FFFFFF",
                      border: `2px solid ${isActive ? skillData.color : "#E5E7EB"}`,
                      color: isActive ? skillData.color : "#374151",
                    }}
                  >
                    <span>Part {partData.part}</span>
                    <span className="text-xs font-normal text-gray-500">
                      {answeredInPart}/{totalInPart} câu
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
