import React from "react";

interface ExamBottomNavProps {
  questions: any[];
  currentQuestionIndex: number;
  onNavigate: (index: number) => void;
}

const SKILLS_CONFIG = [
  { id: "listening", label: "Listening", time: 47, parts: [1, 2, 3] },
  { id: "reading", label: "Reading", time: 60, parts: [1, 2, 3, 4] },
  { id: "writing", label: "Writing", time: 60, parts: [1, 2] },
  { id: "speaking", label: "Speaking", time: 12, parts: [1, 2, 3] }
];

export function ExamBottomNav({ questions, currentQuestionIndex, onNavigate }: ExamBottomNavProps) {
  // Determine current active skill and part based on current question
  const currentQuestion = questions[currentQuestionIndex];
  const activeSkill = currentQuestion?.qSkill?.toLowerCase() || "reading";
  const activePart = currentQuestion?.qPart || 1;

  const handlePartClick = (skillId: string, partNumber: number) => {
    // Find the first question in this skill and part
    const firstQuestionIndex = questions.findIndex(
      (q) => q.qSkill?.toLowerCase() === skillId && q.qPart === partNumber
    );

    if (firstQuestionIndex !== -1) {
      onNavigate(firstQuestionIndex);
    } else {
      console.warn(`No questions found for ${skillId} Part ${partNumber}`);
    }
  };

  return (
    <div className="w-full bg-[#374151] text-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] flex-shrink-0 relative z-50 font-sans">
      <div className="flex w-full divide-x divide-gray-600">
        {SKILLS_CONFIG.map((skill) => (
          <div key={skill.id} className="flex flex-col flex-1">
            
            {/* Parts row for the skill (Top) */}
            <div className="flex flex-1 divide-x divide-gray-500 bg-[#4B5563]">
              {skill.parts.map((part) => {
                const isActive = activeSkill === skill.id && activePart === part;
                const hasQuestions = questions.some(
                  (q) => q.qSkill?.toLowerCase() === skill.id && q.qPart === part
                );

                return (
                  <button
                    key={`${skill.id}-part-${part}`}
                    disabled={!hasQuestions}
                    onClick={() => handlePartClick(skill.id, part)}
                    className={`flex-1 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-bold transition-colors whitespace-nowrap px-1 uppercase
                      ${
                        isActive
                          ? "bg-[#F97316] text-white"
                          : hasQuestions
                          ? "bg-[#6B7280] text-gray-200 hover:bg-gray-500"
                          : "bg-[#4B5563] text-gray-400 cursor-not-allowed hidden sm:block"
                      }
                    `}
                  >
                    Part {part}
                  </button>
                );
              })}
            </div>

            {/* Header row for the skill (Bottom) */}
            <div className="bg-[#374151] py-1.5 px-2 text-center text-[10px] sm:text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-gray-300">
              {skill.label} - {skill.time}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
